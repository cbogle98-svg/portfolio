# Recovery Batch — 15 Mojibake'd Followups

One-shot recovery for the 15 prospects whose followup subject lines were
corrupted by the pre-2026-05-19 encoding bug (followup subjects rendered
as `Following up Ã¢Â€" sample site for X` due to missing RFC 2047 header
encoding for the em-dash). All 15 are currently in the `outreach` lane
with 2 prior emails sent and 0 replies received.

## Template

**Subject:** `Quick re-send — last email's subject came out glitchy`

```
{greeting}

My last email about a sample site for {biz} went out with a glitchy subject line — our email service had a bug that probably made it look like spam. Apologies, I didn't catch it until just now.

The sample site is still up if you'd like a look: {demo_url}. No hard sell, just wanted to make sure a busted subject wasn't why it got skipped.

While I've got you — beyond websites, we also run lead-gen for local contractors. You get exclusive rights to every lead in your area for your trade — no sharing, no competition for the same lead. One contractor per territory, $500/month. Happy to send a one-pager if your phone could be ringing more.

— Cody Bogle
Bosque Works LLC
(254) 277-2131
```

Where `{greeting}` is `Hi {first_name},` if owner_name is set, otherwise
`Good morning/afternoon/evening, {short_name}!` (texasTimeOfDay-aware).

## Hit List

| # | Slug | Business | Owner | Email | Demo |
|---|------|----------|-------|-------|------|
| 1 | 3l-ranch-services | 3L Ranch Services | — | 3lranchservices@gmail.com | /3l-ranch-services/ |
| 2 | bc-construction | BC Construction | — | BCCGranbury@gmail.com | /bc-construction/ |
| 3 | big-dawgs-tattoo-piercing | Big Dawg's Tattoo & Piercing | — | Bigdawgtat2s@gmail.com | /big-dawgs-tattoo-piercing/ |
| 4 | corbin-warren-welding | Corbin Warren Welding & Fab. | Corbin | corbin76067@hotmail.com | /corbin-warren-welding/ |
| 5 | crazy-spirits-ranch | Crazy Spirits Ranch | — | crazyspiritsranch@gmail.com | /crazy-spirits-ranch/ |
| 6 | estades-salon | Estades Salon LLC | Alicia | estadessalonllc@gmail.com | /estades-salon/ |
| 7 | forbess-insurance-agency | Forbess Insurance Agency | Brenda | forbessagency@live.com | /forbess-insurance-agency/ |
| 8 | hamilton-trailer-repair | Hamilton Trailer Repair | Ray | hamiltontrailerrepair@gmail.com | /hamilton-trailer-repair/ |
| 9 | j-c-electric | J and C Electric LLC | — | Jpeysen@jandcelectric.com | /j-c-electric/ |
| 10 | jb-welding | JB Welding | — | jbwelding.tx@gmail.com | /jb-welding/ |
| 11 | mckamy-electric | McKamy Electric | — | jj@mckamyelectric.com | /mckamy-electric/ |
| 12 | polished-perfection-llc | Polished Perfection LLC | Ashlee | baysashlee@gmail.com | /polished-perfection-llc/ |
| 13 | rosscoes-handyman-services | Rosscoe's Handyman Services | Roscoe | rosscoehms@outlook.com | /rosscoes-handyman-services/ |
| 14 | sharpshooters-tattoo | Sharpshooters Tattoo | — | mage1971@hotmail.com | /sharpshooters-tattoo/ |
| 15 | txp-construction-remodeling | TXP Construction & Remodeling | — | Talley.oneal@yahoo.com | /txp-construction-remodeling/ |

8 of 15 are contractor-relevant (lead-gen paragraph speaks to them);
the other 7 will gracefully ignore the contractor-leads pitch.

## How to Send

Automated via the one-shot endpoint `/api/crm/outbound/recovery-send`
(in bosqueworks-demos repo at `functions/api/crm/outbound/recovery-send.ts`).
Hardcoded slug list inside the endpoint — safe by construction.

```bash
# Dry-run (returns previews, no sends):
source ~/.bosqueworks/.env
curl -sS -u "admin:${MANAGE_AUTH_PASSWORD}" \
  -X POST -H "content-type: application/json" \
  -d '{"dry_run": true}' \
  https://demos.bosqueworks.com/api/crm/outbound/recovery-send

# Actual send (15 emails go to real Gmail):
curl -sS -u "admin:${MANAGE_AUTH_PASSWORD}" \
  -X POST -H "content-type: application/json" \
  -d '{"dry_run": false}' \
  https://demos.bosqueworks.com/api/crm/outbound/recovery-send
```

Successful sends log as `kind='email'` activities (body prefixed
`Sent recovery email — Subject: ...`) so they appear in funnel queries
alongside cold sends and followups.
