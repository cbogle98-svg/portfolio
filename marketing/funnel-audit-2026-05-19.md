# Funnel Audit — 2026-05-19

Audit of Bosque Works cold-outreach funnel performance, prompted by the
working theory that "I've sent hundreds of cold emails and nobody bites —
this is a me problem." The data told a different story.

## What We Thought Going In

- Cold outreach has been substantial in volume.
- Reply rate is near zero.
- The diagnosis is some mix of (a) trust-wall (small-town TX buys from
  people it knows), (b) personality fit (Cody isn't a salesperson).
- Therefore: stand up a referral partner program to borrow trust from
  locally-connected referrers.

## What the Data Actually Showed

| Metric | Value | Note |
|---|---:|---|
| Cold emails sent (total ever) | **33** | Not "hundreds." A 5-week burst that peaked at 16/wk then trickled to 1/wk. |
| Unique prospects emailed | 17 | |
| Automated followups sent | 15 | One per prospect 5 days after initial, when no reply. |
| Inbound replies recorded | 2 | 1 was a Gmail bounce (`Mail Delivery Subsystem` — `blurryculturestudio@yahoo.com` address invalid). |
| **Real inbound replies** | **1** | Stensen Hansen / Rafter-H: "What's it cost" — a buy-signal. |
| Real reply rate on initials | 1 / 16 = **6.25%** | Above the 2-3% B2B baseline. |
| Reply rate on followups | 0 / 15 = **0%** | All 15 had mojibake'd subjects (see Bug #1). |
| Outbound replies from Cody | **2** | Not visible to CRM until 2026-05-19 (see Bug #2). |
| Phone calls logged | **0** | Data hygiene gap — calls happen but aren't logged. |

## The Three Diagnoses (in order of being wrong, less wrong, actually right)

### Diagnosis 1 (going in): Trust-wall + personality fit

Plan: build `/partners` referral program. Shipped — useful but not the
right primary fix.

### Diagnosis 2 (after CRM funnel data): Response-handling discipline

The CRM activities table showed Rafter-H's "what's it cost" reply
followed by 8 days of silence and a manual "Declined." Looked like Cody
didn't respond. Wrong on the facts — the CRM doesn't log Cody's manual
outbound replies.

### Diagnosis 3 (after Cody's Gmail screenshots): Encoding bug + data gap

Cody actually replied to Rafter-H within 3 hours with a full pricing
breakdown, a comparison link, and a 1-2-3 next-steps walkthrough. Four
days later he followed up with a half-price discount ($500 build fee +
$50/mo). Stensen replied "No thank you" — a real declination after a
real sales motion ran. None of that was visible to the CRM.

**The real root causes:**

1. **Encoding bug:** the followup subject template `Following up — sample
   site for ${biz}` contained a UTF-8 em-dash that wasn't RFC 2047-encoded
   by `gmail.ts:buildRfc822()`. Recipient mail clients rendered the bytes
   as Latin-1 mojibake (`Following up Ã¢Â€" sample site for...`), which
   almost certainly hurt open rates on every followup ever sent.
2. **CRM data gap:** the activities table only auto-logged initial cold
   sends + inbound replies. Cody's manual outbound responses via Gmail
   were invisible, so funnel snapshots systematically undercounted
   engagement.
3. **Small absolute volume:** 33 emails isn't enough data to evaluate
   anything — offer fit, message fit, reply rate, or close rate. The
   bigger problem isn't "conversion" — it's "we haven't actually run a
   real test yet."

## What Got Shipped Today

| Change | Repo | Purpose |
|---|---|---|
| `/partners` page (30% commission referral program) | portfolio | Trust-wall fix (still useful even though it's not the primary diagnosis) |
| `marketing/partner-invites.md` | portfolio | Email + SMS templates Cody adapts per recipient |
| `migrations/0005_add_referral_source.sql` + applied to D1 | bosqueworks-demos | Partner attribution column on `prospects` table |
| `/manage` filter dropdown + card badge for `referral_source` | bosqueworks-demos | CRM UI for tracking partner attribution |
| `gmail.ts` RFC 2047 encoder for Subject headers | bosqueworks-demos | Fix Bug #1 — fix-forward; new followups send with clean subjects |
| `gmail.ts` module-scope OAuth token cache | bosqueworks-demos | Fix CF Workers subrequest-cap bug discovered during backfill |
| `/api/crm/inbound/outbound-replies` poll | bosqueworks-demos | Fix Bug #2 — captures Cody's manual Gmail replies into activities |
| Workflow update — outbound-replies poll runs hourly in same cron job | bosqueworks-demos | Symmetric with existing inbound reply poll |
| Backfill complete — Rafter-H thread now has full conversation in CRM | D1 | Validates that the new poll works |

## Outstanding Decisions

1. **Recovery batch for the 15 mojibake'd-followup prospects** (`/manage` task #9).
   Two options laid out — manual (Cody composes 15 emails from a hit list) or
   one-shot automated endpoint (~30 min of code, one-click execute). Awaiting
   Cody's call.
2. **Sustained-volume cold-outreach campaign.** With Bug #1 fixed and Bug #2
   capturing engagement, the next real test is sending substantially more
   followups (and second-followups) and watching the funnel. Current
   `OUTBOUND_DAILY_CAP=5` is conservative.
3. **Pricing sensitivity.** N=1 data point (Rafter-H) declined even at $500
   for a Pro tier + $50/mo. Worth holding lightly but watching for the next
   buy-signal reply: does the pricing land?

## Lessons For The Next Audit

- **The CRM is a leaky lens.** Before drawing conclusions from activity logs,
  cross-check Gmail directly for ground truth on what was actually sent and
  received.
- **"Hundreds of emails" was anchor-on-a-feeling.** Always query the actual
  count before reasoning about it.
- **A 0% reply rate on a single template (the followup) is signal of bug
  before signal of market.** Initial sends had 6.25% — followups had 0% in
  the same population. That gap is almost always mechanical, not behavioral.
- **Encoding bugs in headers are silent killers.** Body content has charset
  declaration; headers don't. Em-dashes, smart quotes, and names with
  accents all need RFC 2047 wrapping. Helper now exists in `gmail.ts`.

## What This Audit Did NOT Resolve

- Whether the $800/$1,800/$3,500 tier pricing fits small-town TX wallets at
  scale. One data point isn't enough.
- Whether Cody's cold-email body copy lands. We only know it gets opened
  reliably (proven by 6.25% reply rate on initials); we don't know if the
  copy resonates beyond "show me the price."
- Whether the demo-as-pitch motion converts at the close step. The one
  prospect who saw it AND got pricing said no — but at half-price, on a
  Pro tier, from a small operator with no prior reputation. Underspecified.
