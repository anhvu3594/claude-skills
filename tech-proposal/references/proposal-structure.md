# Proposal Document Structure

Use this as a template. Not every section is needed for every proposal — scale to the project's complexity. A small project might skip the architecture diagram and feature comparison. A large one might need all sections plus an appendix.

---

## Recommended Sections

### 1. Executive Summary (1 page max)
- What the client needs (1-2 sentences)
- What we propose (the approach, in plain language)
- Key differentiator of the recommended approach
- IP/ownership model (1 sentence)

Keep this scannable. A busy executive should get the gist in 30 seconds.

### 2. Business Context
- Client's current situation (what they use today)
- The gap or problem (what's not working)
- What this proposal covers (scope boundary)

Frame this from the client's perspective, not yours. Show you understand their business, not just their tech stack.

### 3. Requirements Summary
- Table format: Area | What's Needed
- Restate the client's brief so they see you understood it
- Group by theme: core features, channels, integrations, admin, non-functional

This is a mirror — the client should read it and think "yes, that's exactly right."

### 4. How the System Works
Start with what's shared across approaches (if comparing), then show what differs.

**Shared foundation:**
- Diagram showing the building blocks both approaches use
- Explain each component in "What It Does" language

**Per approach:**
- Diagram showing the specific flow
- How it works (numbered steps, plain language)
- Advantages (bullet list)
- Trade-offs (bullet list — be honest)

Describe components by what they do for the user, not by their technical name. "A chatbot builder that lets your team create guided conversations with a drag-and-drop editor" is better than "Typebot, an open-source AGPL-3.0 flow engine."

### 5. Side-by-Side Comparison (if comparing approaches)
- Table format: Criteria | Approach A | Approach B
- Cover: cost, accuracy, language quality, traceability, outage impact, conversation feel, setup speed, operator experience, test mode, fit for use case
- Bottom line summary (2 sentences)

### 6. Monthly Operating Cost
This is the most scrutinized section. Structure it as:

**Variable costs by lead volume** (table with 3 volume columns: low/mid/high)
- Break down by service and category
- Show per-unit rates and volumes

**Fixed infrastructure costs** (table with single range column)
- Line item per service
- Show what each service runs

**Total monthly cost** (summary table combining variable + fixed across all volumes)

**Scaling comparison** (if comparing approaches)
- Show how each approach's costs behave as volume grows

Include footnotes with:
- Exact rates used (with source links)
- Blended rate calculations if serving multiple markets
- Key assumptions (lead volume, reply rates, booking rates)

Say "See Appendix for full methodology" and create a separate appendix document.

### 7. Recommendation
- State the recommendation clearly
- Give 3-5 reasons tied to the client's specific situation
- Acknowledge when the other approach might be better (shows intellectual honesty)

### 8. Feature Cost Breakdown (Required)
Every proposal includes this section. It gives the client transparency into what each piece costs.

- Table: Feature | Cost (use midpoint of tier price band)
- Show total at the bottom
- Link to the detailed scoring spreadsheet (delivered as a separate .xlsx file)
- Include non-code features: Project Management & Discovery, Testing & QA, Documentation, Deployment & Handover, Post-Launch Care

See `references/feature-estimation.md` for the 5-dimension scoring framework.

### 9. Assumptions & Risks
**Assumptions** (numbered list):
- What the client needs to provide and when
- Technical assumptions (hosting region, AI provider, lead volume)
- Commercial assumptions (IP model, phasing)

**Risks** (table: Risk | Impact | Mitigation):
- External dependencies (third-party APIs, approval processes)
- Technical risks (API reliability, AI quality)
- Operational risks (volume spikes, cost overruns)

### 10. Rollout Plan
- Table: Weeks | What Happens
- Call out the biggest schedule risk explicitly
- Show pilot → phased rollout progression

### 11. Ownership & Operating Model
- Code ownership and handover terms
- Open-source component handling
- Infrastructure ownership
- Post-launch warranty period
- Ongoing operating arrangement
- Termination terms

### 12. Next Steps
- 3-5 concrete actions the client needs to take
- Call out the longest lead-time item first

---

## Formatting Principles

- **Tables over paragraphs** for anything comparative or structured
- **Numbered steps** for processes and flows
- **Bold key terms** on first use, then use them naturally
- **No jargon without inline definition** — if you use a technical term, explain it in the same sentence
- **Diagrams as mermaid** — create mermaid code blocks so user can export as images for Word
- **Footnotes for methodology** — keep main text clean, put math in footnotes or appendix
