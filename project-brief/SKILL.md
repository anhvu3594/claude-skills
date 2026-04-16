---
name: project-brief
description: Generate comprehensive project briefs (.docx) from client interview transcripts. Use this skill whenever the user mentions project briefs, discovery documents, or wants to turn interview transcripts/scripts/notes into a structured project document. Also trigger when the user has interview recordings, client discovery sessions, stakeholder conversations, or any raw input about a project's origin, user needs, and goals that needs to be synthesized into a formal brief. Even if the user just says "write a brief from these interviews" or "turn this into a project document", use this skill.
---

# Project Brief Generator

You transform raw client interview transcripts into polished, comprehensive project briefs delivered as `.docx` files.

## What this skill does

Clients explain their work through interviews — they show how they do tasks, describe their struggles, and articulate their desires. These interviews are messy, conversational, and full of gold buried in tangents. Your job is to extract that gold and shape it into a structured project brief that a development team can act on.

The output brief follows a proven 11-section structure (see `references/brief-structure.md`) that covers everything from project origin to risks and next steps.

## When information is missing

Interviews rarely contain everything a brief needs. Timelines, budgets, technical constraints, and specific dates often live outside the transcript. When you encounter gaps:

- **Mark them clearly** as `[TO BE CONFIRMED]` in the output
- **Never fabricate** dates, budgets, names, or technical details
- **Do infer** product concepts, user needs, pain points, and opportunities — that's the whole point of synthesizing interviews

## Workflow

### Step 1: Gather the inputs

Read all provided interview transcripts. These may come as:
- Text pasted directly in the conversation
- Files (`.txt`, `.docx`, `.pdf`, or other text formats)
- Multiple files from different stakeholders

If multiple interviews exist, read them all before starting analysis. Different stakeholders reveal different facets of the same project.

### Step 2: Extract and organize

As you read the transcripts, pull out information organized by these themes:

**Origin & Context**
- Who initiated the project and why?
- What's their background and credibility?
- How did the building engagement come about?
- What existing solutions have they tried?

**The Problem / Opportunity**
- What gap in the market or workflow did they identify?
- What are the current pain points (their struggles)?
- What do they wish existed (their desires)?
- Why does this matter now — what's the urgency?

**The Product Vision**
- What are they asking to be built?
- How do they describe it working in practice?
- What's the core thesis — what does the product enable that wasn't possible before?
- What does the product explicitly NOT do?

**Users & Stakeholders**
- Who are the distinct user types?
- For each: who are they, what are they trying to do, how do they define success?
- Who is the customer (pays) vs. the end user (uses)?

**Client Opportunities**
- Are there specific clients or engagements already lined up?
- What are their names, sizes, timelines, and engagement details?

**Scope & Success Criteria**
- What does the MVP look like?
- How will they know it worked?
- What are the measurable outcomes?

**Risks & Concerns**
- What worries came up in conversation?
- What technical, operational, or market risks are implied?
- What assumptions are being made that could break?

**Timeline & Next Steps**
- Any dates, deadlines, or milestones mentioned?
- What needs to happen first?

### Step 3: Synthesize into the brief

Now write the project brief following the structure in `references/brief-structure.md`. Read that file for the exact section-by-section template.

Key principles for the synthesis:

- **Narrative sections should read like they were written by someone who deeply understands the project**, not like a transcript summary. Transform conversational rambling into clear, confident prose.
- **The "Session in Practice" scenario** is critical — it makes the product vision tangible. Construct this from what interviewees described about how they work and what they wish would happen. Write it in present tense, as if watching it unfold.
- **User types should reflect real empathy** pulled from the interviews. Use the interviewees' own language and concerns, refined into clean bullet points.
- **Risks should be specific**, not generic. "Latency in the AI pipeline" is good. "Technical risk" is useless. Pull these from concerns expressed or implied in the interviews.
- **The opportunity spectrum** (where most are today → where we build → where we aim) requires you to understand the competitive landscape from what was discussed. Position the product based on what interviewees said about existing alternatives.

### Step 4: Generate the .docx

Use the `document-skills:docx` skill to produce the final `.docx` file. Invoke it to create a professional document with:

- Clean typography (Arial font family)
- Proper heading hierarchy (Heading 1 for major sections, Heading 2 for sub-sections)
- Tables for structured data (Project at a Glance, Opportunity Spectrum, Timeline)
- Consistent spacing and margins
- US Letter page size

The document should look polished enough to send to a client or stakeholder without further formatting.

### Step 5: Review and flag gaps

After generating the document, provide a brief summary to the user:

1. **Sections fully populated** from interview data
2. **Sections with [TO BE CONFIRMED] markers** — list what's missing and what kind of information would fill the gaps
3. **Assumptions made** — where you inferred something that the interviews didn't state explicitly

This helps the user know exactly what to verify before the brief is final.

## Handling different interview styles

**Discovery interviews** (consultant asking structured questions): These tend to follow a logical flow. Extract answers mapped to the brief sections.

**Demo/walkthrough interviews** (client showing how they work): Rich in pain points and workflow details. Pay special attention to moments of frustration, workarounds, and "I wish this could..." statements — these are the product requirements.

**Multi-stakeholder interviews**: Different people emphasize different things. A CEO talks about market opportunity and vision. A CTO talks about technical constraints. An end user talks about daily pain. Weave these perspectives together — don't just stack them sequentially.

**Casual/unstructured conversations**: The gold is scattered. Read the whole thing before extracting anything. Themes emerge across the full conversation, not in neat blocks.

## Quality checklist

Before delivering the brief, verify:

- [ ] Every section from the reference structure is present (even if some have [TO BE CONFIRMED])
- [ ] The "How This Came About" section tells a coherent origin story, not a transcript summary
- [ ] The "What We Are Building" section includes a practical scenario walkthrough
- [ ] User types have all three sub-sections: who they are, what they're trying to do, definition of success
- [ ] Risks are specific to this project, not generic
- [ ] No fabricated dates, names, budgets, or statistics
- [ ] The tone is professional and direct — no marketing language, no filler
- [ ] The document is 2,500–4,000 words
