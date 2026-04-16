---
name: bytebytego-scraper
description: Use when the user wants to save, scrape, or download a ByteByteGo course page to a local HTML file. Triggers on phrases like "save this bytebytego lesson", "download this course page", "scrape bytebytego", or when given a bytebytego.com/courses URL.
---

# ByteByteGo Page Scraper

Saves a ByteByteGo course lesson to a self-contained local HTML file that looks identical to the original — images, styling, code tabs, and copy buttons all working.

## Why this approach

When a local HTML file loads, browsers block cross-origin stylesheets (CORS). So we can't rely on `<link>` tags pointing to bytebytego.com — all CSS must be inlined. The page also uses React/antd for interactive code tabs, so we need a small vanilla JS snippet to replicate that behavior.

## Step 1: Open the page

**First**, call `mcp__chrome-devtools__list_pages` to see what tabs are already open.

- If the user's **regular Chrome** is connected (you'll see their normal tabs like Gmail, GitHub, etc.), reuse an existing tab — pick any non-critical one and navigate it with `mcp__chrome-devtools__navigate_page`. This is the preferred approach since the user is already logged in.
- If only `about:blank` or automation-only tabs are visible, the MCP is running a separate browser instance. In that case, use `mcp__chrome-devtools__new_page` to open the URL in a new tab.

```
mcp__chrome-devtools__navigate_page(type: "url", url: "<the URL>")
```

Take a screenshot to verify the page loaded. If it shows a login wall or redirect, use the **cookie injection approach** below — do NOT ask the user to log in manually in the automation browser (Google OAuth is blocked in automated browser contexts).

### Login wall: Cookie injection approach

This is only needed when the MCP is running a separate browser instance (not the user's regular Chrome). Ask the user to run this in the DevTools Console of their **regular browser** (while on bytebytego.com):

```javascript
JSON.stringify(document.cookie.split(';').map(c => c.trim()))
```

Then inject those cookies into the automation browser before navigating:

```javascript
() => {
  const cookies = [/* paste the array items here, one per string */];
  cookies.forEach(c => {
    document.cookie = c + '; path=/; domain=.bytebytego.com';
  });
  return 'cookies set: ' + cookies.length;
}
```

After injecting, navigate to the target URL again — the session should now be active.

**Why this works**: ByteByteGo stores the auth token in a non-HttpOnly `token` cookie (Firebase JWT) that is readable via `document.cookie` and settable via JS. Google OAuth is blocked by Google in automated browser contexts, so manual login doesn't work.

## Step 2: Extract the article HTML

Run this script to click through all tabs (rendering all code panels) then return the article as base64. Base64 avoids encoding corruption when the result is large and auto-saved to a file.

```javascript
async () => {
  const tabs = document.querySelectorAll('.ant-tabs-tab');
  for (const tab of tabs) {
    tab.click();
    await new Promise(r => setTimeout(r, 400));
  }
  const article = document.querySelector('article');
  if (!article) return 'NO_ARTICLE';
  // Reset all tab groups so Python tab is active by default
  document.querySelectorAll('[class*="codeTabsWrap"]').forEach(wrap => {
    const tabs = wrap.querySelectorAll('.ant-tabs-tab');
    const panels = wrap.querySelectorAll('.ant-tabs-tabpane');
    tabs.forEach((t, i) => {
      t.classList.toggle('ant-tabs-tab-active', i === 0);
      const btn = t.querySelector('.ant-tabs-tab-btn');
      if (btn) { btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false'); btn.tabIndex = i === 0 ? 0 : -1; }
    });
    panels.forEach((p, i) => {
      p.classList.toggle('ant-tabs-tabpane-active', i === 0);
      p.classList.toggle('ant-tabs-tabpane-hidden', i !== 0);
      p.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });
  });
  return btoa(unescape(encodeURIComponent(article.outerHTML)));
}
```

If result is `NO_ARTICLE`, the page structure may be different — take a screenshot and investigate.

If the result is auto-saved to a file (too large), decode it with:
```bash
python3 -c "
import json, base64, re
with open('<auto-saved-path>') as f:
    data = json.load(f)
raw = data[0]['text']
b64 = re.search(r'\"([A-Za-z0-9+/=\n]+)\"', raw).group(1).replace('\n','')
html = base64.b64decode(b64).decode('utf-8')
with open('/tmp/bby_article.html', 'w') as f:
    f.write(html)
import re as r2
print(len(html), 'chars,', len(r2.findall(r'hljs-comment', html)), 'comments')
"
```

Always write to `/tmp/bby_article.html` and read it back in the build step — never paste or retype the HTML inline.

## Step 3: Use the standard CSS template

Do NOT extract CSS from the page — it produces 200KB+ of raw rules that look worse than this clean template. Use this fixed CSS block directly in the `<style>` tag:

```css
/* ── antd tabs base layout ── */
.ant-tabs { display: flex; }
.ant-tabs-top { flex-direction: column; }
.ant-tabs-top > .ant-tabs-nav { position: relative; display: flex; flex: none; align-items: center; margin: 0 0 16px; }
.ant-tabs-top > .ant-tabs-nav::before { position: absolute; right: 0; left: 0; bottom: 0; border-bottom: 1px solid rgb(211,211,211); content: ""; }
.ant-tabs-nav-wrap { position: relative; display: flex; flex: auto; align-self: stretch; overflow: hidden; white-space: nowrap; }
.ant-tabs-nav-list { position: relative; display: flex; }
.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab { margin-left: 2px; }
.ant-tabs-tab { position: relative; display: inline-flex; align-items: center; cursor: pointer; font-size: 14px; background: rgba(0,0,0,0.02); border: 1px solid rgb(240,240,240); transition: 0.3s; }
.ant-tabs-tab-btn { outline: none; transition: all 0.3s; }
.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab { border-radius: 8px 8px 0 0; }
.ant-tabs-ink-bar { display: none; }
.ant-tabs-content-holder { flex: auto; min-width: 0; min-height: 0; }
.ant-tabs-content { display: flex; width: 100%; }
.ant-tabs-content-top { flex-direction: row; }
.ant-tabs-tabpane { flex: none; width: 100%; outline: none; }
.ant-tabs-tabpane-hidden { display: none; }
.ant-tabs-nav-operations { display: none; }

/* ── ByteByteGo code tabs custom styles ── */
.style_codeTabsWrap__jMkKK { margin: 20px 0; }
.style_codeTabs__DEEq6 { padding: 0; margin: 16px 0; border-radius: 10px; border: 1px solid rgb(211,211,211); background: #fff; }
.style_codeTabs__DEEq6 > .ant-tabs-nav { padding: 2px 15px 0; background: rgb(231,255,249); margin-bottom: 0; border-radius: 10px 10px 0 0; }
.style_codeTabs__DEEq6 > .ant-tabs-nav::before { border-color: rgb(211,211,211); }
.style_codeTabs__DEEq6 > .ant-tabs-nav .ant-tabs-tab { height: 35px; padding: 0 16px; border-top: 1px solid transparent; border-right: 1px solid transparent; border-left: 1px solid transparent; border-bottom: none; background: transparent; }
.style_codeTabs__DEEq6 > .ant-tabs-nav .ant-tabs-tab-active { border-radius: 6px 6px 0 0; border-top: 1px solid rgb(211,211,211); border-right: 1px solid rgb(211,211,211); border-left: 1px solid rgb(211,211,211); border-bottom: none; background: #fff; }
.style_codeTabs__DEEq6 > .ant-tabs-nav .ant-tabs-tab-btn { color: rgb(102,102,102); font-size: 14px; }
.style_codeTabs__DEEq6 > .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn { color: rgb(0,97,71); }
.style_codeTabs__DEEq6 .ant-tabs-tabpane { position: relative; }
.style_codeTabs__DEEq6 pre { padding: 0 !important; margin: 0 !important; border: none !important; background: transparent !important; }
.style_codeTabs__DEEq6 pre code { display: block; padding: 16px 30px 20px; background: transparent; font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace; font-size: 14px; white-space: pre; color: rgb(22,105,176); }
.style_copyBtn__4MbAa { position: absolute; top: 22px; right: 20px; padding: 0; height: auto; border: none; background: transparent; box-shadow: none; cursor: pointer; display: inline-flex; }
.style_copyBtn__4MbAa:hover { opacity: 0.7; }

/* ── hljs syntax colors ── */
.hljs-keyword  { color: rgb(215,58,73); }
.hljs-type     { color: rgb(215,58,73); }
.hljs-built_in { color: rgb(227,98,9); }
.hljs-number   { color: rgb(0,92,197); }
.hljs-title.function_ { color: rgb(111,66,193); }
.hljs-variable { color: rgba(0,0,0,0.88); }
.hljs-operator { color: rgba(0,0,0,0.88); }
.hljs-comment  { color: rgb(106,115,125); font-style: italic; }
.hljs-string   { color: rgb(3,47,98); }

/* ── Article content styles ── */
.style_learnContent__K5K7M { min-width: 498px; max-width: 1000px; overflow: auto; margin: 0 auto; padding: 50px 30px; background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
.style_learnContent__K5K7M h1 { margin-top: 0; margin-bottom: 20px; font-size: 40px; font-weight: 600; color: rgb(40,40,40); line-height: 50px; }
.style_learnContent__K5K7M h2 { margin-top: 16px; margin-bottom: 10px; font-size: 30px; line-height: 40px; font-weight: 600; color: rgb(40,40,40); }
.style_learnContent__K5K7M h3 { margin-bottom: 10px; font-size: 26px; line-height: 37px; font-weight: 600; color: rgb(40,40,40); }
.style_learnContent__K5K7M p { margin-bottom: 10px; font-weight: 400; line-height: 26px; font-size: 15px; text-align: justify; color: rgb(33,37,41); }
.style_learnContent__K5K7M figure { margin: 16px 0; }
.style_learnContent__K5K7M strong { font-weight: 600; }
.style_learnContent__K5K7M code { word-break: break-all; color: rgb(22,105,176); font-family: "SF Mono", Monaco, Consolas, "Courier New", monospace; font-size: 13px; }
.style_learnContent__K5K7M pre code { font-size: 14px; }
.style_learnContent__K5K7M em { font-style: italic; }
.style_learnContent__K5K7M ul, .style_learnContent__K5K7M ol { margin: 10px 0 10px 20px; line-height: 26px; font-size: 15px; color: rgb(33,37,41); }
.style_learnContent__K5K7M li { margin-bottom: 6px; }
.style_learnContent__K5K7M blockquote { margin: 16px 0; padding: 10px 16px; border-left: 4px solid rgb(0,97,71); background: rgb(231,255,249); border-radius: 0 6px 6px 0; }
.style_learnContent__K5K7M blockquote p { margin: 0; }

/* ── Try it yourself banner ── */
.style_tryBanner__WFMKc { display: flex; align-items: center; justify-content: space-between; margin: 24px 0; padding: 16px 20px; background: rgb(231,255,249); border: 1px solid rgb(0,97,71); border-radius: 10px; }
.style_tryTitle__dVqce { font-size: 16px; font-weight: 600; color: rgb(40,40,40); margin-bottom: 4px; }
.style_tryDesc___lKzS { font-size: 14px; color: rgb(102,102,102); }
.style_openBtn__F_m3N { border-color: rgb(0,97,71); color: rgb(0,97,71); border-radius: 6px; }
.style_openBtn__F_m3N:hover { background: rgb(0,97,71); color: #fff; }
.ant-btn { display: inline-flex; align-items: center; justify-content: center; padding: 4px 15px; font-size: 14px; border-radius: 6px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; background: transparent; }
```

## Step 4: Determine the output filename

Derive the filename from the URL slug. For example:
- `bytebytego.com/courses/coding-patterns/two-pointers/introduction-to-two-pointers`
- → `introduction-to-two-pointers.html`

Save to the current working directory.

## Step 5: Build the self-contained HTML file

Assemble the final file using this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="https://bytebytego.com/">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css" crossorigin="anonymous">
  <title>{PAGE_TITLE}</title>
  <style>
    /* Critical rule — hides inactive tab panels */
    .ant-tabs-tabpane-hidden { display: none; }

    {EXTRACTED_CSS}
  </style>
</head>
<body>
  {ARTICLE_HTML}

  <script>
    // Tab switching — replicates antd behavior without React
    document.querySelectorAll('.ant-tabs-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        var wrap = tab.closest('.style_codeTabsWrap__jMkKK');
        if (!wrap) return;
        wrap.querySelectorAll('.ant-tabs-tab').forEach(function(t) {
          t.classList.remove('ant-tabs-tab-active');
          var btn = t.querySelector('.ant-tabs-tab-btn');
          if (btn) { btn.setAttribute('aria-selected', 'false'); btn.tabIndex = -1; }
        });
        tab.classList.add('ant-tabs-tab-active');
        var activeBtn = tab.querySelector('.ant-tabs-tab-btn');
        if (activeBtn) { activeBtn.setAttribute('aria-selected', 'true'); activeBtn.tabIndex = 0; }
        wrap.querySelectorAll('.ant-tabs-tabpane').forEach(function(p) {
          p.classList.remove('ant-tabs-tabpane-active');
          p.classList.add('ant-tabs-tabpane-hidden');
          p.setAttribute('aria-hidden', 'true');
        });
        var panelId = activeBtn && activeBtn.getAttribute('aria-controls');
        var panel = panelId && wrap.querySelector('#' + panelId);
        if (panel) {
          panel.classList.add('ant-tabs-tabpane-active');
          panel.classList.remove('ant-tabs-tabpane-hidden');
          panel.setAttribute('aria-hidden', 'false');
        }
      });
    });

    // Copy buttons
    document.querySelectorAll('[class*="copyBtn"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var code = btn.previousElementSibling && btn.previousElementSibling.querySelector('code');
        if (code) navigator.clipboard.writeText(code.innerText);
      });
    });
  </script>
</body>
</html>
```

Key things when assembling:
- `{PAGE_TITLE}` — use the `<h1>` text from the article
- `{EXTRACTED_CSS}` — the CSS template from Step 3 (never manually curate)
- `{ARTICLE_HTML}` — **always use the browser-extracted HTML directly** (see below)
- The `<base href>` makes relative image URLs resolve against bytebytego.com, so images load without being downloaded
- KaTeX CDN link handles math rendering (used in some lessons)

### CRITICAL: Never manually retype or reconstruct the article HTML

Always write the browser-extracted article HTML to disk via Python and read it back. Do NOT copy-paste or retype it — this silently drops code comments, truncates content, and corrupts special characters.

**Safe workflow for writing the article to disk:**

Step A — get article as base64 in the browser (avoids all encoding issues):
```javascript
() => {
  return btoa(unescape(encodeURIComponent(document.querySelector('article').outerHTML)));
}
```

If the result is auto-saved to a file (too large for inline), extract and decode with:
```bash
python3 -c "
import json, base64, re
with open('<auto-saved-path>') as f:
    data = json.load(f)
raw = data[0]['text']
b64 = re.search(r'\"([A-Za-z0-9+/=\n]+)\"', raw).group(1).replace('\n','')
html = base64.b64decode(b64).decode('utf-8')
with open('/tmp/bby_article.html', 'w') as f:
    f.write(html)
import re as r2
print(len(html), 'chars,', len(r2.findall(r'hljs-comment', html)), 'comments')
"
```

Step B — build the final file in Python by reading `/tmp/bby_article.html`:
```python
with open('/tmp/bby_article.html') as f:
    article_html = f.read()
# then assemble the full HTML using the template
```

## Common issues

**Images not showing**: Check that `<base href="https://bytebytego.com/">` is present in the `<head>`. Image `src` values like `/images/...` rely on this.

**Tabs stacked / all panels visible**: The `.ant-tabs-tabpane-hidden { display: none }` rule is missing or being overridden. Add `!important` if needed.

**CSS looks wrong / unstyled**: The CSS extraction may have missed some rules. Try broadening the `alwaysInclude` list in Step 3 with any class names that look unstyled.

**Page requires login / Google OAuth blocked**: The MCP browser opens a fresh session. Google OAuth is blocked in automated browser contexts. Use the cookie injection approach described in Step 1 instead.
