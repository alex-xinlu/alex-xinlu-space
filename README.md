# Alex Loo's Blog

Personal blog built with [Astro](https://astro.build/) and adapted from the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

Site: <https://alex-loo.pages.dev/>

This repository contains my notes on AI, coding, and random thoughts. The site is deployed on Cloudflare Pages and keeps the static-first workflow of AstroPaper while adding project-specific customization for Chinese typography, comments, sharing, and dynamic Open Graph images.

## Features

- Static blog powered by Astro
- Type-safe Markdown and MDX content
- Light and dark mode
- Pagefind static search
- RSS feed and sitemap
- Archives, tags, pagination, and adjacent post navigation
- Dynamic OG image generation with Satori and Sharp
- Local Chinese font support with Noto Sans SC
- Giscus comments backed by GitHub Discussions
- Cloudflare Pages deployment

## Tech Stack

- Astro
- TypeScript
- Tailwind CSS
- React, used for the Giscus comment component
- Giscus
- Pagefind
- Satori and Sharp
- pnpm

## Project Structure

```bash
/
├── astro-paper.config.ts        # site, feature, social, and share config
├── astro.config.ts              # Astro integrations and build config
├── public/                      # static assets
├── src/
│   ├── assets/                  # icons, fonts, and images
│   ├── components/              # shared UI components
│   ├── content/
│   │   ├── pages/               # standalone pages
│   │   └── posts/               # blog posts
│   ├── layouts/                 # page layouts
│   ├── pages/                   # routes
│   ├── scripts/                 # client scripts
│   ├── styles/                  # global styles and theme variables
│   └── utils/                   # shared utilities
└── package.json
```

Blog posts live in `src/content/posts/`. Subdirectories become part of the generated URL, so a post under `src/content/posts/coding/_2026-05/` is published under `/posts/coding/.../`.

## Content

Current post categories:

- `ai`: notes and troubleshooting around AI products and APIs
- `coding`: development, deployment, and blogging notes
- `thoughts`: personal reflections and drafts

## Development

Install dependencies:

```bash
pnpm install
```

Start the local dev server:

```bash
pnpm dev
```

Build the site:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Run Astro type checks:

```bash
pnpm astro check
```

Run linting and formatting:

```bash
pnpm lint
pnpm format
```

## Configuration

Most site-level settings are in `astro-paper.config.ts`, including:

- site title, description, author, URL, and timezone
- post pagination settings
- search, archives, edit links, and dynamic OG image behavior
- social links and share links

Giscus comments are configured in `src/components/Giscus.tsx` and are mapped by page pathname to GitHub Discussions in `alex-xinlu/alex-xinlu-space`.

## Deployment

The site is designed for Cloudflare Pages.

Recommended build settings:

```txt
Build command: pnpm build
Build output directory: dist
Node.js version: 22.12.0 or newer
```

The build command also runs Pagefind indexing and copies the generated search index into `public/pagefind/`.

### Page Views

Page and site view counts are handled by a Cloudflare Pages Function at `/api/views`.

Create a Cloudflare D1 database and bind it to the Pages project with this binding name:

```txt
BLOG_ANALYTICS_DB
```

The function creates its required `page_views` and `site_stats` tables automatically on first use. The client records each pathname once per browser session to avoid inflating counts from repeated refreshes, then displays post and site totals on article pages.

## TODO

- [x] Fix `Could not fetch from https://fonts.google.com/metadata/fonts.`
- [x] Choose and configure a Chinese font: Noto Sans SC
- [x] Write a blog post about deploying AstroPaper on Cloudflare Pages
- [x] Replace theme defaults with personal site information
- [ ] Finish social links and share links
- [x] Migrate posts into the AstroPaper content style
- [x] Add comments with Giscus
- [x] Add page view statistics with Cloudflare Pages Functions + D1
- [x] Add Google Site Verification and submit the site to Google Search Console

## Credits

This blog is based on [AstroPaper](https://github.com/satnaing/astro-paper), created by [Sat Naing](https://satnaing.dev/) and contributors.

## License

This project follows the license inherited from AstroPaper. See [LICENSE](./LICENSE).
