# Cost Modeling Methodology

How to build credible, defensible cost estimates for technical proposals.

---

## Core Principle: Show Your Work

Every cost line should be traceable: assumption → math → source. A client should be able to verify any number by following your references.

---

## Step 1: Identify Cost Categories

Separate costs into three buckets:

| Category | What It Includes | How It Scales |
|---|---|---|
| **Fixed infrastructure** | Servers, databases, load balancers, monitoring, storage | Mostly flat regardless of volume |
| **Variable — messaging/API** | WhatsApp fees, SMS, email delivery, third-party API calls | Scales linearly with lead/user volume |
| **Variable — AI processing** | LLM token costs (input + output) | Scales with message volume × % routed to AI |

Present them separately so the client understands what changes with growth and what doesn't.

---

## Step 2: Estimate Message Volume Per Lead

Trace the journey of one lead through the system. For each step, estimate:
- How many leads reach this step (funnel %)
- How many messages are generated
- What category each message falls into (for cost assignment)

**Example funnel (WhatsApp lead engagement):**

| Step | % of leads | Messages | Category |
|---|---|---|---|
| Opening outreach | 100% | 1 per lead | Marketing (paid) |
| Conversation responses | ~70% reply × ~5 responses | ~3.5 per lead | Service (free) |
| Re-engagement | ~4.5% late reply × ~5 | ~0.2 per lead | Service (free) |
| Booking reminders | ~31% book × 2 reminders | ~0.6 per lead | Utility (paid) |
| Follow-up nurture | ~68% don't book × 2 msgs | ~1.4 per lead | Marketing (paid) |

The percentages come from industry benchmarks. State them explicitly and note they'll be validated during pilot.

---

## Step 3: Look Up Current Pricing

Pricing changes frequently. Always research current rates rather than estimating from memory.

**What to look up:**
- Messaging platform: per-message or per-conversation? By category? By country?
- AI provider: per-token pricing for input vs output, per model tier
- Cloud hosting: per-hour/month for each service, in the specific region
- Third-party APIs: rate limits, per-call pricing, free tiers

**Where to look:**
- Messaging: official pricing page + rate cards (often downloadable CSVs)
- AI: provider's pricing documentation page
- Cloud: provider's pricing calculator
- APIs: developer documentation pricing section

**Blended rates for multi-market:** If serving multiple countries, calculate a weighted average based on the actual user distribution (e.g., 95% Malaysia / 5% Indonesia, not a guess).

---

## Step 4: Build the AI Token Model

For any AI-powered component, estimate per-message token usage:

**Input tokens (what the AI reads):**

| Component | Typical range | Notes |
|---|---|---|
| System prompt / instructions | 500–2,000 | Persona, rules, guidelines |
| Conversation history | 500–3,000 | Grows per turn; use average across conversation length |
| Tool/function definitions | 300–800 | Each available action adds tokens |
| Retrieved context (RAG) | 500–2,000 | If using knowledge base retrieval |

**Output tokens (what the AI writes):**

| Response type | Typical range |
|---|---|
| Short reply (1-2 sentences) | 50–100 |
| Medium reply with options | 100–250 |
| Detailed response | 250–500 |
| Tool call + reply | 150–300 |

**Cost per message** = (input tokens × input rate) + (output tokens × output rate)

**With prompt caching:** If the AI provider supports caching (e.g., Anthropic's prompt caching), cached portions of input cost ~90% less. The system prompt and tool definitions are highly cacheable. Estimate 30–50% cost reduction as a note, but use uncached pricing as the baseline for conservative estimates.

---

## Step 5: Structure the Cost Tables

### Variable costs table (by lead volume)
Show 3 columns: low / medium / high volume. This is the most powerful table in the proposal because it shows scaling behavior.

```
|                          | 2,000 leads | 5,000 leads | 10,000 leads |
| Messaging — marketing    | $X          | $Y          | $Z           |
| Messaging — utility      | $X          | $Y          | $Z           |
| Messaging subtotal       | $X          | $Y          | $Z           |
| AI processing            | $X–$Y       | $X–$Y       | $X–$Y        |
| Variable total           | $X–$Y       | $X–$Y       | $X–$Y        |
```

### Fixed costs table (single range column)
```
| Service                  | Monthly cost |
| Application servers      | $X–$Y       |
| Database                 | $X–$Y       |
| ...                      |              |
| Infrastructure total     | $X–$Y       |
```

### Total monthly cost (summary)
```
|                    | 2,000 leads | 5,000 leads | 10,000 leads |
| Infrastructure     | $X–$Y       | $X–$Y       | $X–$Y        |
| Messaging          | $X          | $Y          | $Z           |
| AI                 | $X–$Y       | $X–$Y       | $X–$Y        |
| TOTAL              | $X–$Y       | $X–$Y       | $X–$Y        |
```

### Scaling comparison (if comparing approaches)
```
| Lead volume              | Approach A cost | Approach B cost | Saving |
| 2,000 leads (Xk msgs)   | $X–$Y           | $X–$Y           | $X–$Y  |
```

---

## Step 6: Write the Appendix

The main proposal shows summary tables. The appendix shows full methodology:

- **A1: Messaging pricing** — official rates per country per category, blended rate calculation
- **A2: Message volume per lead** — funnel assumptions with percentages and sources, per-lead cost breakdown
- **A3: AI token estimation** — what a token is (explain for non-technical readers), input/output breakdown, model pricing, per-message cost, scaling table
- **A4: Infrastructure pricing** — per-service specs, hourly rates, monthly estimates, reference links
- **A5: Summary formula** — one-line formula showing how total = fixed + variable components

---

## Common Pitfalls

| Pitfall | Why It's Wrong | What To Do |
|---|---|---|
| Using outdated pricing | Messaging and AI pricing changes frequently | Always look up current rates with sources |
| Assuming all messages cost the same | Platforms have different categories at different rates (some free) | Check per-category pricing |
| Not blending multi-market rates | Using one country's rate for a multi-country operation | Weight by actual distribution |
| Showing only one volume | Client can't see how costs scale | Always show 3 volumes |
| Bundling variable + fixed | Client can't distinguish what grows from what doesn't | Separate clearly |
| Estimating AI cost without token math | Vague ranges lack credibility | Show tokens × rate = cost per message |
| Forgetting prompt caching exists | Overestimates AI cost | Note caching potential (30-50% reduction) as a footnote |
| Not including the appendix | Technical reviewers can't verify your numbers | Always create a methodology appendix |
