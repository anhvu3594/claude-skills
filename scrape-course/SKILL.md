---
name: scrape-course
description: Scrapes an entire course from ByteByteGo (or similar Next.js platforms) to sequentially numbered PDFs. Use when the user wants to download a full course for offline use or NotebookLLM.
---

# Scrape Entire Course to PDF Workflow

This skill scrapes an entire course from ByteByteGo (or similar Next.js based platforms) to sequentially numbered PDFs.

The workflow uses a Puppeteer script that has been highly optimized to bypass layout quirks. It works by:
1. **Extracting Links**: Parsing the `__NEXT_DATA__` JSON blob directly from the DOM to get a highly reliable, perfectly ordered list of every lesson in the course (bypassing any issues with hidden or collapsed sidebars).
2. **Filtering Languages**: Automatically clicking "JavaScript" tabs on each page so only JS code blocks are captured.
3. **Image Loading**: Explicitly removing lazy-loading attributes and waiting for all `<img>` network requests to resolve before rendering the PDF to ensure no figures are missing.
4. **Organizing Output**: Creating a dedicated folder named after the course and saving all PDFs sequentially inside it (e.g., `01-foreword.pdf`).

## Prerequisites

This skill requires Node.js and the `puppeteer` package. If not already installed, run:
```bash
npm install puppeteer
```

## Instructions

When the user asks you to scrape a course to PDF (or run the scrape workflow for a course), follow these steps:

1. **Verify the Initial URL:** Ensure the user has provided a valid URL for the *first lesson* or the *landing page* of the course. If not, ask them for the URL.

2. **Launch Chrome with remote debugging:** The script connects to the user's currently open browser to bypass login walls and bot detection.
   - Ask the user to **completely close Chrome first**, then relaunch it from their terminal with:
     ```bash
     /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="$PWD/chrome_profile"
     ```
   - The user should log in to ByteByteGo in the browser window that opens before proceeding.

3. **Run the scraper script** using the Bash tool. Use `run_in_background=true` since this is a long-running batch job.
   - The script is at `scripts/scrape_to_pdf.js` inside this skill's directory. Use the path where this skill is installed.
     ```bash
     node <skill-dir>/scripts/scrape_to_pdf.js "<URL>"
     ```
   - *Note (Resuming):* By default, the script skips any PDFs that already exist in the folder.
   - *Note (Targeted Overwrite):* To overwrite only specific lessons (e.g., if figures were missing), pass a comma-separated list of lesson indices or URL slugs as a third argument:
     ```bash
     node <skill-dir>/scripts/scrape_to_pdf.js "<URL>" "11,13,21,22"
     ```
     This forces the script to overwrite those specific lessons only.

4. **Wait for Completion:** The script will take several minutes as it sequentially processes dozens of pages. Wait for the background task to complete (you will be notified). The script prints progress as it runs (links found, folder name, status of each page).

5. **Confirm Output:** After completion, verify the output folder was created and check the PDFs:
   ```bash
   ls <course-name>/
   ```

6. **Report to User:** Inform the user that the entire course has been successfully scraped. Mention the name of the new folder created and that all sequentially numbered PDFs are inside, ready to be uploaded to NotebookLLM.
