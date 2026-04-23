# Claude Skills Collection

A collection of custom Claude Code skills I've built and tested.

## What are Claude Skills?

Claude Code skills are prompt files (`.skill`) that extend Claude's behavior for specific tasks. When invoked via the `Skill` tool, they load structured instructions, frameworks, and reference materials to improve output quality beyond Claude's defaults.

## Skills

### [resume-writer](./resume-writer/)

Writes, rewrites, and tailors professional tech resumes — delivered as polished PDF files.

- **RIC framework** — bullet points follow Result + Impact + Contribution structure
- **Experience-level guidance** — formatting rules for new grads, mid-level, and senior/staff engineers
- **Job description tailoring** — mirrors target role language and reorders bullets for relevance
- **PDF output** — generates `Firstname_Lastname_Resume.pdf` via `document-skills:pdf`, falls back to Markdown
- **Common mistakes checklist** — avoids anti-patterns like skill self-ratings, passive verbs, vague metrics, and "References available upon request"

### [project-brief](./project-brief/)

Transforms raw client interview transcripts into polished, comprehensive project briefs as `.docx` files.

- **11-section structure** — covers project origin, problem/opportunity, product vision, user types, scope, risks, and next steps
- **Synthesis over summary** — converts conversational transcripts into clear, professional prose
- **Multi-stakeholder support** — weaves together CEO, CTO, and end-user perspectives
- **Gap tracking** — marks missing information as `[TO BE CONFIRMED]` rather than fabricating details
- **docx output** — generates a formatted Word document via `document-skills:docx`

### [scrape-course](./scrape-course/)

Scrapes an entire ByteByteGo course (or similar Next.js platforms) to sequentially numbered PDFs, ready to upload to NotebookLLM.

- **Full course extraction** — parses `__NEXT_DATA__` directly to get a perfectly ordered lesson list, no sidebar gymnastics
- **Image reliability** — removes lazy-load attributes and waits for all images to download before rendering
- **JavaScript tab filtering** — auto-clicks JS code tabs on each page
- **Resume support** — skips already-exported PDFs by default; targeted overwrite for specific lessons
- **Puppeteer-based** — connects to the user's existing Chrome session to bypass login walls
