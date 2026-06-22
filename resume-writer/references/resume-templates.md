# Resume Templates & Layout Principles

How recruiters actually read tech resumes, what layout to use, and which proven templates to model. Read this when deciding structure/format or generating the PDF. The content matters more than the template — but a bad template buries good content.

## Table of contents

1. [Why layout matters: the 10-second scan](#why-layout-matters)
2. [Single-column top-down vs. two-column](#single-column-vs-two-column)
3. [The recommended developer layout](#the-recommended-developer-layout)
4. [Proven template models](#proven-template-models)
5. [Templates and patterns to avoid](#templates-and-patterns-to-avoid)

---

## Why layout matters

Recruiters and hiring managers process dozens to hundreds of resumes. They read **top to bottom** and, in the first few seconds, look for exactly four things:

1. **Location** — local? needs a visa or relocation?
2. **Years of experience** — quick math from the earliest work date or education end date.
3. **Key technologies** — do they overlap with what the role needs?
4. **Titles & companies** — what's the career progression? any standout names?

Only if those match does the recruiter actually *read* the resume — and even then it's a short top-to-bottom skim looking for relevant or attention-grabbing detail. A good template makes those four facts effortless to find and uses bolding/color to guide the eye to a few more. Design every layout decision for that scan.

A technical recruiter's framing: a resume is a 10-second elevator pitch for your career. Tell the story right in 10 seconds and you earn the time for a real read.

---

## Single-column vs. two-column

**Use single-column, top-down. Always, for software engineering resumes.**

Why it wins:
- Mirrors the **LinkedIn profile format** every tech recruiter reads daily — instantly familiar.
- Reads cleanly top to bottom in one pass; no guessing where to look.
- Works for both one- and two-page resumes.
- Gives room for several detailed bullets per role.

Two-column layouts *look* space-efficient but cost you readability:
- The reader must go top-to-bottom *and* left-to-right; column order is inconsistent from resume to resume, so recruiters can't predict where education or experience lives.
- They **discourage detail** — no two-column design comfortably fits several bullets per role or spills to a second page, so they fill with buzzwords instead of impact.
- Their one legitimate use is when the layout *is* the work product (design/UX roles). For software engineering there's no upside, only drawbacks.

Avoid multi-column entirely unless a specific non-engineering context demands it.

---

## The recommended developer layout

A LinkedIn-familiar order, adjusted to foreground what matters for developers (LinkedIn under-emphasizes languages & technologies — you should not):

```
Name + contact details (location, email, one of LinkedIn/GitHub/site)
Summary                 (only when it adds value — see SKILL.md)
Technologies & Languages
Work Experience         (reverse-chronological, RIC bullets, dates right-aligned)
Education
Projects                (with GitHub links if polished)
Interests / Honors      (optional, brief)
```

Put **Technologies & Languages high** (right after the name/summary) so the recruiter's tech scan succeeds immediately. For senior candidates with standout companies, Education can move further down.

---

## Proven template models

These single-column, top-down templates are proven choices for engineers. Model the *structure and emphasis*, not the literal styling.

### Pragmatic Engineer / CareerCup style (default, all levels)
Familiar to US tech recruiters. Name centered at top; one row per role with **title — company — right-aligned date**; tight RIC bullets; Technologies & Languages as a labeled mini-table (Languages / Technologies / Other). Works at one or two pages, with or without a summary. This is the safe default for most candidates.

Structure of a work-experience entry:
```
Job Title              Company                 Start – End
[Location if useful]
 • [RIC bullet: result + how + tech]
 • [RIC bullet]
```

### Mono style (when companies/titles need the spotlight)
A variant that draws more attention to the company or title line. Good when you have standout companies/education, **or** the opposite — companies recruiters won't recognize, so emphasizing strong titles helps. Otherwise identical to the default.

### Experienced Engineer style (staff/principal, standout profiles only)
A two-page layout for above-senior candidates (principal, staff, distinguished), people with standout companies, or strong open-source/public contributions. Company name and title get extra emphasis; links are deliberately prominent to invite click-throughs to strong content; Technologies & Languages often lands on page 2 — acceptable *because* this is for profiles where recruiters will read page 2. **Do not use for less-experienced candidates or those without standout signal** — it leaves deliberate whitespace that only pays off for a strong profile.

### Markdown-to-PDF (tooling note)
Keeping the resume as Markdown (source of truth in git, generate PDF from it) is a clean workflow that produces a Mono-style result. Relevant when the user wants version control / multiple tailored variants — which pairs well with the master-resume strategy.

**Page length by profile:** 1 page for new grads / early career; 2 pages standard for mid-to-senior; up to 3 for director-level. Let content decide. Two pages is *fine* for a senior candidate with enough meaningful content, especially outside the US where one-page norms are looser. Never cram — removing whitespace and shrinking fonts to force one page is the #1 mistake that makes resumes hard to scan.

---

## Templates and patterns to avoid

- **Two-column / infographic templates** (many resume.io, EnhanCV, Canva, Google Docs Swiss layouts) — hard to scan, discourage detail, inconsistent column order.
- **Skill point/star ratings** (●●●○○) — a self-rating ≤3/5 reads as "not proficient," and ≥4/5 is assumed anyway since you listed it. People also rate themselves inaccurately, and recruiters know it. List technologies you're proficient with and relevant to the role; drop the ratings.
- **Photos** — introduce bias; remove them. Same goes for birth date, gender, marital status, nationality, religion.
- **Buzzword "skills"** like "Power Skills," "Life Philosophy," "Most Proud Of," generic "Analytical Thinking" — they add noise, not signal.
- **Europass CV** — encourages exactly the bias-inducing details above (photo, DOB, gender), wastes space, represents tech poorly. Not required for European jobs despite the myth. Avoid.
- **Dated black-and-white table layouts** — risk the subconscious "won't keep up with tech" bias. A clean modern single-column template with one muted accent color reads better.
- **Spoken languages, driving licenses, references / "references available on request"** — noise unless specifically relevant (e.g. applying to a non-English-speaking company).

Whatever the template: top-to-bottom, single-column, important things first, strategic and *consistent* bolding/color. Generators don't fix weak content — and most are tuned for every profession at once, not for engineers.
