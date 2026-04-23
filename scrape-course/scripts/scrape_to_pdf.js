const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeUrlToPdf(page, url, index, total, outputDir, forceOverride) {
  // Determine output filename with index prefix early
  const urlObj = new URL(url);
  let slug = urlObj.pathname.split('/').filter(Boolean).pop() || 'lesson';
  const paddedIndex = String(index).padStart(2, '0');
  let filename = path.join(outputDir, `${paddedIndex}-${slug}.pdf`);

  if (!forceOverride && fs.existsSync(filename)) {
    console.log(`\n[${index}/${total}] Skipping ${filename} (already exists)`);
    return;
  }

  console.log(`\n[${index}/${total}] Navigating to ${url}...`);
  // Wait until dom content loaded
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Small wait for initial layout
  await new Promise(r => setTimeout(r, 2000));

  console.log(`[${index}/${total}] Selecting JavaScript code tabs...`);
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button, .tab, [role="tab"], li'));
    for (const tab of tabs) {
      if (tab.innerText && tab.innerText.trim() === 'JavaScript') {
        tab.click();
      }
    }
  });
  // Wait a bit for the tab change to render
  await new Promise(r => setTimeout(r, 1000));

  console.log(`[${index}/${total}] Isolating <article> tag and fixing layout...`);
  // Isolate the article element and fix layout issues (centering, cutoff)
  const hasArticle = await page.evaluate(() => {
    const article = document.querySelector('article');
    if (!article) return false;

    // Iterate upwards from the article to the body, hiding all siblings
    let current = article;
    while (current && current !== document.body && current !== document.documentElement) {
      const siblings = current.parentNode.children;
      for (let sibling of siblings) {
        if (sibling !== current && !['SCRIPT', 'STYLE', 'LINK', 'META', 'HEAD', 'TITLE'].includes(sibling.tagName)) {
          sibling.style.setProperty('display', 'none', 'important');
        }
      }
      
      // Force all parent elements to be simple block containers
      current.parentNode.style.setProperty('display', 'block', 'important');
      current.parentNode.style.setProperty('width', '100%', 'important');
      current.parentNode.style.setProperty('max-width', '100%', 'important');
      current.parentNode.style.setProperty('margin', '0', 'important');
      current.parentNode.style.setProperty('padding', '0', 'important');
      current.parentNode.style.setProperty('position', 'static', 'important');
      current.parentNode.style.setProperty('overflow', 'visible', 'important');
      
      current = current.parentNode;
    }
    
    // Remove any fixed or sticky elements that might overlap (like headers/footers)
    const allElements = document.querySelectorAll('*');
    for (let el of allElements) {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        if (!article.contains(el) && el !== article) {
          el.style.setProperty('display', 'none', 'important');
        } else {
          el.style.setProperty('position', 'static', 'important');
        }
      }
    }

    // Center the article itself and ensure it fits the page
    article.style.setProperty('margin', '0 auto', 'important');
    article.style.setProperty('max-width', '800px', 'important');
    article.style.setProperty('width', '100%', 'important');
    article.style.setProperty('display', 'block', 'important');
    article.style.setProperty('padding', '20px', 'important');
    article.style.setProperty('box-sizing', 'border-box', 'important');

    // Prevent inner elements (images, code blocks, tables) from overflowing
    const innerElements = article.querySelectorAll('*');
    for (let el of innerElements) {
      if (el.tagName === 'PRE' || el.tagName === 'CODE') {
        el.style.setProperty('white-space', 'pre-wrap', 'important');
        el.style.setProperty('word-break', 'break-word', 'important');
        el.style.setProperty('overflow-x', 'hidden', 'important');
      }
      if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'IFRAME') {
        el.style.setProperty('max-width', '100%', 'important');
        el.style.setProperty('height', 'auto', 'important');
      }
      el.style.setProperty('overflow-wrap', 'break-word', 'important');
    }

    return true;
  });

  if (!hasArticle) {
    console.warn(`[${index}/${total}] Warning: No <article> tag found on the page. Generating PDF of the whole page instead.`);
  } else {
    console.log(`[${index}/${total}] <article> tag isolated successfully.`);
  }

  // Scroll down to trigger lazy loading if needed
  console.log(`[${index}/${total}] Scrolling down to trigger lazy-loaded images...`);
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight - window.innerHeight){
          clearInterval(timer);
          window.scrollTo(0, 0); // Scroll back to top
          resolve();
        }
      }, 100);
    });
  });

  // Wait for all images to fully load over the network before generating PDF
  console.log(`[${index}/${total}] Waiting for all images to finish downloading...`);
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    
    // Force eager loading on all images
    images.forEach(img => {
      img.setAttribute('loading', 'eager');
      if (img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'sync');
      }
    });

    // Wait for all image network requests to finish
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        // Fallback timeout just in case an image hangs forever
        const timeout = setTimeout(resolve, 10000); 
        img.addEventListener('load', () => { clearTimeout(timeout); resolve(); });
        img.addEventListener('error', () => { clearTimeout(timeout); resolve(); });
      });
    }));
  });

  console.log(`[${index}/${total}] Generating PDF: ${filename}...`);
  await page.pdf({
    path: filename,
    format: 'A4',
    printBackground: true, 
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  console.log(`[${index}/${total}] Successfully saved PDF to ${filename}`);
}

(async () => {
  const initialUrl = process.argv[2];
  const filterString = process.argv[3]; // Optional: only process URLs matching this string
  if (!initialUrl) {
    console.error('Please provide the initial URL of the course to scrape. Example: node scrape_to_pdf.js "https://bytebytego.com/courses/..."');
    process.exit(1);
  }

  console.log(`Attempting to connect to your open browser...`);
  let browser;
  try {
    browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
    console.log(`Successfully connected to your browser!`);
  } catch (error) {
    console.error('\n❌ Could not connect to your browser.');
    console.error('Please make sure you started Chrome with the remote-debugging-port command.');
    process.exit(1);
  }
  
  try {
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    // Set viewport to a standard desktop size
    await page.setViewport({ width: 1200, height: 1000 });

    console.log(`Navigating to initial URL to extract course links: ${initialUrl}`);
    await page.goto(initialUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Give it a moment to ensure React has attached if necessary
    await new Promise(r => setTimeout(r, 2000));

    console.log(`Extracting all lesson links...`);
    const linksToScrape = await page.evaluate(() => {
      // Best approach for ByteByteGo: Parse the Next.js data block which contains the exact Table of Contents
      const nextDataElement = document.getElementById('__NEXT_DATA__');
      if (nextDataElement) {
          try {
              const data = JSON.parse(nextDataElement.innerText);
              if (data.props && data.props.pageProps && data.props.pageProps.toc) {
                  const toc = data.props.pageProps.toc;
                  return toc.map(item => {
                      const slugPath = Array.isArray(item.slug) ? item.slug.join('/') : item.slug;
                      return window.location.origin + '/courses/' + item.course + '/' + slugPath;
                  });
              }
          } catch (e) {
              console.error("Error parsing __NEXT_DATA__", e);
          }
      }

      // Fallback: Find all links in the sidebar/navigation areas
      const possibleLinks = Array.from(document.querySelectorAll('aside a, nav a, [class*="sidebar"] a, [class*="menu"] a, ul a'));
      
      const extractedLinks = possibleLinks
        .map(a => a.href)
        .filter(href => href && href.startsWith('http') && !href.includes('#')) // Filter valid links
        .filter(href => href.includes('/courses/')); // Ensure they are course links
      
      return [...new Set(extractedLinks)];
    });

    let finalLinks = linksToScrape;
    if (finalLinks.length === 0) {
      console.log(`No sidebar links found. Will only scrape the provided URL.`);
      finalLinks = [initialUrl];
    } else {
      console.log(`Found ${finalLinks.length} lessons in the course sidebar.`);
      // Sometimes the initial link might not be caught depending on DOM, ensure it's there if needed.
      // But usually, it is present in the sidebar. We trust the sidebar order.
    }

    console.log(`Starting batch scrape of ${finalLinks.length} pages...`);
    
    // Determine the course name from the initial URL and create a folder
    const initialUrlObj = new URL(initialUrl);
    const pathParts = initialUrlObj.pathname.split('/').filter(Boolean);
    let courseName = 'course_export';
    const coursesIndex = pathParts.indexOf('courses');
    if (coursesIndex !== -1 && pathParts.length > coursesIndex + 1) {
      courseName = pathParts[coursesIndex + 1];
    }
    
    const courseDir = path.join(process.cwd(), courseName);
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
      console.log(`Created directory: ${courseDir}`);
    }
    
    for (let i = 0; i < finalLinks.length; i++) {
      if (filterString) {
        const filters = filterString.split(',');
        const matches = filters.some(f => {
          const trimmed = f.trim();
          return finalLinks[i].includes(trimmed) || (i + 1).toString() === trimmed;
        });
        if (!matches) continue;
      }
      try {
        await scrapeUrlToPdf(page, finalLinks[i], i + 1, finalLinks.length, courseDir, !!filterString);
      } catch (err) {
        console.error(`[${i + 1}/${finalLinks.length}] Error processing ${finalLinks[i]}:`, err);
      }
    }

    console.log(`\nAll done! Processed ${finalLinks.length} pages.`);
  } catch (error) {
    console.error('Fatal Error:', error);
  } finally {
    await browser.close();
  }
})();
