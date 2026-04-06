# Cody Bogle — Portfolio

Personal business front page for Cody Bogle's web design business serving local trades and service businesses in Erath County, TX.

Built with **Astro + Tailwind CSS**, deployed to **Cloudflare Pages** with auto-deploy via **GitHub Actions**.

## Quick start

```bash
npm install
npm run dev    # local dev server at http://localhost:4321
npm run build  # production build → ./dist
```

## How to update content

All content (services, pricing, FAQ, portfolio items, brand colors, etc.) is driven by **`src/data/config.json`**. Edit that file and the entire site updates. No need to touch component files unless you're changing layout or adding sections.

```bash
# Edit src/data/config.json
git add src/data/config.json
git commit -m "Update pricing"
git push
# Site auto-deploys in ~45 seconds
```

## Structure

```
portfolio/
├── public/                    # static assets (demo HTMLs, favicon, etc.)
│   ├── demo_bosque_river_builders.html
│   ├── demo_easter_heat_and_air.html
│   └── demo_robertson_welding_fencing.html
├── src/
│   ├── components/            # all sections as reusable .astro components
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── Portfolio.astro
│   │   ├── About.astro
│   │   ├── Pricing.astro      # includes the retainer toggle JS
│   │   ├── Hosting.astro
│   │   ├── FAQ.astro
│   │   ├── Process.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── data/
│   │   └── config.json        # ← edit this to change content
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── .github/workflows/
    └── deploy.yml             # auto-deploy to Cloudflare Pages on push
```
