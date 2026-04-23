# Feature Cost Estimation Framework

A scoring system for estimating the cost of individual software features. Each feature is scored across 5 dimensions (1–5 each), producing a total score that maps to a complexity tier and price band.

---

## Complexity Tiers

| Tier | Score Range | Price Band | Typical Features |
|---|---|---|---|
| **S — Simple** | 5–11 | $500–$1,500 | Pure config, reuses existing patterns, single component, no external deps |
| **M — Medium** | 12–17 | $1,500–$4,000 | Multiple components, some custom logic, moderate dependencies |
| **L — Large** | 18–22 | $4,000–$10,000 | Cross-system integration, non-trivial custom logic, high uncertainty or risk |
| **XL — Complex** | 23–25 | $10,000–$25,000 | Novel engineering, multiple external dependencies, high risk + uncertainty |

Price bands assume a blended team rate of ~$80–$120/person-day (typical for SEA-based teams). Adjust for your actual rate.

---

## Scoring Dimensions

### 1. Tech Complexity (1–5)
How technically challenging is the implementation?

| Score | Description |
|---|---|
| 1 | No code — pure configuration, writing, or coordination |
| 2 | Standard patterns — follows well-documented approaches with minor customization |
| 3 | Custom logic — distinct business logic beyond standard patterns |
| 4 | Non-trivial integration — real-time processing, multi-step orchestration, ML inference |
| 5 | Novel engineering — building something that doesn't have an established playbook |

### 2. Feature Size (1–5)
How much stuff is in this feature?

| Score | Description |
|---|---|
| 1 | Single component, one screen or endpoint |
| 2 | 2–3 components, small but self-contained |
| 3 | Multiple components with branching logic or variants |
| 4 | Spans many areas — each with meaningful edge cases |
| 5 | Epic-scale — many distinct workflows, screens, and backend logic |

### 3. Dependencies (1–5)
How many other things does this feature depend on, or how many things depend on it?

| Score | Description |
|---|---|
| 1 | Fully standalone — no runtime dependencies on other features |
| 2 | Single clean integration point |
| 3 | Depends on 2–3 internal or external services |
| 4 | Depends on multiple services AND other features depend on it (critical path) |
| 5 | Depends on multiple external APIs outside your control + blocks everything else |

### 4. Uncertainty (1–5)
How much do we know about what we're building?

| Score | Description |
|---|---|
| 1 | Fully defined — zero design decisions remain |
| 2 | Clear requirements — 1–2 minor questions to resolve |
| 3 | Some ambiguity — key decisions to be made at kickoff or early in development |
| 4 | Significant unknowns — iterative tuning needed, won't be calibrated until tested with real data |
| 5 | Exploratory — fundamental approach may change during development |

### 5. Risk (1–5)
What happens if this feature fails or has bugs?

| Score | Description |
|---|---|
| 1 | No impact — can be disabled with no consequence |
| 2 | Minor inconvenience — easy rollback, no data impact |
| 3 | Moderate operational impact — affects multiple users, requires remediation |
| 4 | Direct customer-facing or business failure — wrong data shown, broken bookings, lost leads |
| 5 | Regulatory, legal, or irreversible consequences — compliance breach, data leak |

---

## How to Score a Feature

1. **Break the system into features.** Each feature should be a deployable unit of work — not too granular (avoid "add a button"), not too large (avoid "the entire backend").

2. **Score each dimension independently.** Don't let one dimension influence another. A feature can be low-tech but high-risk (e.g., compliance), or high-tech but low-risk (e.g., an internal tool).

3. **Write an explanation for each feature** covering all 5 dimensions. The explanation should justify the score without mentioning the specific number, so scores can be adjusted without rewriting explanations.

4. **Include non-code features.** Project management, testing, documentation, deployment, and post-launch care are real costs. Omitting them makes the estimate unrealistically low.

5. **Don't forget:**
   - **Project Management & Discovery** — kickoff, coordination, weekly syncs, change management
   - **Testing & QA** — the most cross-system feature; needs sandboxes for every integration
   - **Documentation** — runbooks, API docs, user guides, handover checklists
   - **Deployment & Handover** — CI/CD, environment promotion, credential transfer
   - **Post-Launch Care** — bug fixes after pilot, stability monitoring, flow adjustments

---

## Adjusting Scores

Scores should reflect reality, not be inflated for safety margin or deflated for competitiveness.

**Lower scores when:**
- Using well-documented APIs with standard integration patterns
- Reusing patterns from another feature in the same project
- Using open-source tools that provide the capability out of the box
- Requirements are fully specified with no ambiguity

**Raise scores when:**
- The explanation itself admits uncertainty ("I'm not sure if it fulfills our needs")
- External APIs are unreliable or have unpredictable approval processes
- The feature handles PII or has regulatory consequences
- A bug in this feature cascades to other features
- RAG, ML training, or iterative tuning is involved

---

## Presenting to the Client

The main proposal shows a simple table:

```
| Feature                        | Cost    |
| Project Management & Discovery | $2,750  |
| Infrastructure                 | $2,750  |
| ...                            | ...     |
| TOTAL                          | $31,250 |
```

Use the midpoint of each tier's price band. Link to a detailed spreadsheet or appendix with the full scoring matrix.

The scoring spreadsheet should include:
- Feature name
- 5 dimension scores
- Total score (auto-calculated)
- Tier (auto-derived from total)
- Price low / high / midpoint (auto-derived from tier)
- Explanation (one paragraph per feature, covering all 5 dimensions)
