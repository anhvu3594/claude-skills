---
name: tech-proposal
description: Create professional technical proposals for software projects — covering architecture, cost modeling, feature estimation, and client-ready deliverables. Use this skill when a user wants to write a proposal, pitch a software project, estimate costs for a client, compare technical approaches, or produce a client-facing architecture document. Also trigger when the user mentions "proposal", "estimate", "quotation", "architecture proposal", "cost breakdown", "feature pricing", or wants to prepare a document that explains what to build, how much it costs, and why the recommended approach is the right one.
---

# Technical Proposal Creator

Guide the user through creating a professional technical proposal for a software project. The output is a client-ready document that explains what will be built, how it works, what it costs, and why the recommended approach is the right one.

This skill was built from a real engagement. The patterns generalize to any technical proposal where you need to explain architecture, compare approaches, model costs, and estimate feature pricing.

## Templates

This skill includes two template files in `assets/`. Use them as the starting point for every new proposal:

- **`assets/template-proposal.docx`** — A polished, client-ready proposal document. Use this as the formatting and structure reference when generating the final .docx. Match the styling (colors, fonts, table formatting, heading hierarchy, page layout) of this template for all new proposals.
- **`assets/template-feature-cost-estimator.xlsx`** — A scoring spreadsheet for per-feature cost estimation. Has the 5-dimension scoring matrix, auto-calculated tiers, and price bands. Copy this file, rename it for the new project, and populate it with the project's features.

When generating the final deliverables, read the template docx (unpack it to inspect styles if needed) and match its visual formatting — dark blue headers, light gray borders, Arial font, table cell padding, heading colors, etc.

## How This Skill Works

The proposal process has five phases. All five are required — each builds on the previous.

```
Phase 1: Brainstorm → Phase 2: Decide → Phase 3: Draft → Phase 4: Cost & Feature Pricing → Phase 5: Deliver
```

Read `references/proposal-structure.md` for the document template. Read `references/cost-modeling.md` when building cost breakdowns. Read `references/feature-estimation.md` when scoring and pricing features.

---

## Phase 1: Brainstorm & Understand the Project

**Start by invoking the `brainstorming` skill.** This skill provides a structured workflow for exploring the user's intent, asking clarifying questions, and arriving at a design before implementation. Follow its process — it ensures thorough discovery.

Within the brainstorming process, focus on understanding:

**Analyze what you're given first.** Read whatever the user provides — requirements docs, briefs, client emails, existing proposals. Give the user your honest assessment:
- What's solid in the requirements
- What concerns you (budget, timeline, technical risk, missing info)
- What gaps need filling before you can write a proposal

**Flag scope problems early.** If the budget doesn't match the scope, say so directly with numbers. If a technical choice has hidden risks (e.g., a third-party API that's known to be unreliable), flag it. Clients respect honesty over optimism.

**Ask thoroughly.** Ask as many questions as needed to fully understand the project before drafting. Proposals built on assumptions are proposals that get rewritten. Cover:
- Business context: Who is the client? What's their current setup? What problem are they solving?
- Users and volume: Who uses the system? How many users/leads/transactions per month?
- Commercial model: Who owns the code? What's the pricing structure?
- Technical constraints: Cloud provider preferences? Existing stack? Compliance requirements?
- Integrations: What third-party systems does this connect to? What's their API quality like?
- Languages/regions: Where does this operate? What languages are needed?
- Scope boundaries: What's explicitly in scope? What's explicitly out?
- Success criteria: How does the client define "done"?
- Budget and timeline: What are the constraints?

The brainstorming skill handles the question-asking flow. Follow its one-question-at-a-time approach, using multiple-choice options where possible.

---

## Phase 2: Lock In Decisions

After brainstorming has surfaced the full picture, work through key decisions. Present options as structured choices (A/B/C/D) with your recommendation and reasoning.

Typical decisions to resolve:
- **Commercial model**: Who owns the code? SaaS vs client-owned vs hybrid?
- **Architecture approach**: If there are viable alternatives, compare them honestly
- **Technology choices**: Cloud provider, key frameworks, third-party services
- **Scope phasing**: What's in Phase 1 (MVP) vs Phase 2?
- **Languages/regions**: If applicable
- **Integration approach**: Build vs buy vs open-source for each component

Don't rush this phase. Each decision shapes the proposal's content, cost model, and recommendations. Get confirmation on each major decision before moving on.

---

## Phase 3: Draft the Proposal

Write the proposal in markdown first (fast to iterate), then convert to .docx when the content is stable.

Read `references/proposal-structure.md` for the full document template. Key principles:

**Write for the client, not for engineers.**
- Describe capabilities, not tool names. "A chatbot builder with visual drag-and-drop editing" beats "Typebot (AGPL-3.0)." The client doesn't want to Google your stack.
- Explain technical concepts in plain language. "A token is roughly 3/4 of a word" beats "3,000 input tokens per inference call."
- Use "What It Does" columns, not "Technical Specification" columns.

**Compare approaches honestly.** If you're recommending one approach over another, present both fairly — advantages AND trade-offs for each. The recommendation should be earned by the analysis, not assumed from the start. This builds client trust.

**Version your files.** When revising, write to a new file (v2, v3) rather than overwriting. Previous versions have value — the user may want to compare or revert.

---

## Phase 4: Cost Modeling & Feature Pricing

Two distinct cost sections, both required:

### Monthly Operating Cost

This is where proposals earn or lose credibility. Vague cost estimates invite skepticism. Detailed, sourced cost models build confidence.

Read `references/cost-modeling.md` for the full methodology. Key principles:

**Show your work.** For every cost line, show the assumption, the math, and the source.

**Separate variable from fixed costs.** Variable costs (messaging, AI tokens) scale with usage. Fixed costs (hosting, monitoring) don't.

**Show costs across multiple volumes.** Show 3 lead/user volumes so the client sees how costs scale.

**Use current pricing with references.** Look up actual rates — don't estimate from memory. Include links to official pricing pages.

**Create a cost appendix.** Main proposal shows summary tables. Appendix shows the full methodology.

### Feature Cost Estimation (Required)

Every proposal includes a per-feature cost breakdown. This gives the client transparency into what they're paying for and lets them make informed prioritization decisions.

Read `references/feature-estimation.md` for the 5-dimension scoring system.

**Process:**
1. Copy `assets/template-feature-cost-estimator.xlsx` and rename for the project
2. Break the system into discrete features (typically 10–15 features)
3. Score each feature across 5 dimensions (1–5): Tech Complexity, Feature Size, Dependencies, Uncertainty, Risk
4. Write an explanation for each feature (without mentioning scores, so scores can be adjusted independently)
5. Review scores with the user — challenge anything that seems too high or too low
6. Present the summary table in the proposal with feature name + midpoint cost
7. Link to the detailed spreadsheet

**Don't forget non-code features:**
- Project Management & Discovery
- Testing & QA
- Documentation
- Deployment & Handover
- Post-Launch Care (bug fixes, stability monitoring after pilot)

These are real costs. Omitting them makes the estimate unrealistically low and erodes trust when they inevitably come up.

---

## Phase 5: Deliver

**Use the template.** When generating the final .docx, use `assets/template-proposal.docx` as the formatting reference. Match its styling: colors, fonts, table formatting, heading hierarchy, page layout. If using docx-js or the docx skill, inspect the template's styles to replicate them.

**Mermaid diagrams** for architecture — create them as separate mermaid code blocks so the user can paste into mermaid.live and export as images for Word. ASCII diagrams break when pasted into Word docs.

**Feature cost spreadsheet** — deliver the populated `template-feature-cost-estimator.xlsx` alongside the proposal. The client will want to review and possibly adjust scores.

**.docx generation** — use the `docx` skill if available, or generate via `docx-js` (npm). Validate the output.

**Appendix as separate document** — keep the main proposal clean and put cost methodology in an appendix. Generate as a separate .docx so the client can attach or omit as they choose.

**Deliverables checklist:**
- [ ] Proposal document (.docx, matching template styling)
- [ ] Mermaid diagram code (for user to export as images)
- [ ] Feature cost estimator spreadsheet (.xlsx)
- [ ] Cost methodology appendix (.docx)

---

## Anti-Patterns to Avoid

These are mistakes that came up during real proposal work:

| Don't | Do Instead |
|---|---|
| Show specific tool names to non-technical clients | Describe what the component does and its benefits |
| Use technical jargon (SLA, webhook, BSP, AGPL) | Explain in plain language, define terms inline |
| Show only one lead volume in cost tables | Show 3 volumes so client sees scaling behavior |
| Use outdated pricing from memory | Look up current rates and cite sources |
| Overwrite previous proposal versions | Create versioned files (v1, v2, v3) |
| Present only the recommended approach | Compare honestly — show both with pros/cons |
| Bundle variable and fixed costs together | Separate them so client understands what scales |
| Put cost methodology in the main proposal | Keep main proposal clean, put methodology in appendix |
| Assume all messages on a platform have the same cost | Check per-category pricing (e.g., WhatsApp marketing vs utility vs service) |
| Skip feature cost estimation | It's required — clients want to see what each piece costs |
| Omit non-code features (PM, testing, docs) | These are real costs; include them or the total is misleading |
| Rush through discovery questions | Ask thoroughly — assumptions become rewrites |
