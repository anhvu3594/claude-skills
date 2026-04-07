# Claude Skills Collection

A collection of custom Claude Code skills I've built and tested.

## What are Claude Skills?

Claude Code skills are prompt files (`.skill`) that extend Claude's behavior for specific tasks. When invoked via the `Skill` tool, they load structured instructions, frameworks, and reference materials to improve output quality beyond Claude's defaults.

## Skills

### [resume-writer](./resume-writer/)

Helps Claude write high-quality, tailored resumes using:

- **RIC framework** — bullet points follow Result + Impact + Contribution structure
- **Experience-level guidance** — formatting rules for new grads, mid-level, and senior/staff engineers
- **Common mistakes checklist** — avoids anti-patterns like skill self-ratings, passive verbs, vague metrics, and "References available upon request"
