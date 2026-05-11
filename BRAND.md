# Bosque Works — Brand Decisions

Last updated 2026-05-11.

## Typography

Three font systems, each scoped intentionally — do NOT unify.

| Surface | Heading font | Body font | Reason |
|---|---|---|---|
| Portfolio (bosqueworks.com) | Inter | Arial | Editorial weight on heading conveys craft; Arial body keeps the trades-friendly read. |
| Demo sites (demos.bosqueworks.com) | Per-client (Google Fonts via `client.brand.fontHeading`) | Per-client (Google Fonts via `client.brand.fontBody`) | Each prospect's demo is brand-personalized — distinct fonts are a feature, not a bug. |
| Marketing print (brochure, business card, decision sheet) | Arial | Arial | Print legibility + no font-embed dependency for distributed PDFs. |

If you ever consider unifying these, the test is: would a prospect notice the inconsistency between the brochure they took home, the demo URL they visit, and the portfolio they land on later? In practice the prospect sees each in isolation, separated by hours-to-days. The per-surface variation reads as appropriate-to-context, not as accidental.

## Taglines

Two taglines, each scoped intentionally.

| Tagline | Where used | Role |
|---|---|---|
| "Websites for Local Trades & Service Businesses" | Portfolio site (Hero badge), brochure header, decision sheet | **Primary** — descriptive, SEO-friendly, names the ICP. Use this everywhere unless there's a specific reason to swap. |
| "Your real business. Built into a real website." | Business card back only | **Punchy variant** — for spaces where the descriptive tagline is too long. Card-back is small format; the punchy line earns the space. |

Don't dual-use them on the same surface. Pick the one that fits the format.

## Color palette

Canonical values in `src/data/config.json` under `brand`:

- `navy` `#1C1917` — primary dark, body text
- `navyLight` `#292524` — surface variants
- `navyMid` `#44403C` — borders, subdued text
- `accent` `#D97706` — amber, CTAs and emphasis
- `accentLight` `#FCD34D` — amber highlight, eyebrows
- `warm` `#78350F` — eyebrow text on light backgrounds
- `cream` `#FAFAF9` — page background on light sections
- `border` `#E7E5E4` — separators
- `muted` `#A8A29E` — subdued body copy

## Voice

Owner-operator, rural Texas, plain-spoken. Cody-shaped. Specific tells:

- "I run a small web shop out of Stephenville" — not "we" or "agency"
- "Real phone, real address, your name on it" — recurring trust phrase
- Texanisms like "I'll leave you be" instead of "unsubscribe"
- No disarm-the-gate sales-book language ("I'm not pitching anything")
- No emoji-heavy decoration
- Acknowledge commercial intent, make the ask small

See `~/.claude/projects/C--Users-cbogl/memory/feedback_email_tone.md` for the V7 email principles and V5 phone-script field results that define this voice.

## What NOT to change

- Pricing transparency on portfolio (uncommon, trust-building, keep)
- Per-demo brand palette + per-client Google Fonts (real personalization, keep)
- V7 email template (`functions/_shared/email-template.ts` in bosqueworks-demos)
- The bracketed-placeholder convention on demos (`[TAGLINE GOES HERE]`)
- The HeroIllustration extensibility pattern
