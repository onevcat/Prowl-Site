# Prowl website

Source of [prowl.onev.cat](https://prowl.onev.cat), the homepage for the
[Prowl](https://github.com/onevcat/Prowl) macOS app. Built with [Astro](https://astro.build)
and deployed by Netlify from `master`.

## Pages

| Route | Source | Notes |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Single-screen landing page. |
| `/details/` | `src/pages/details.astro` | Feature tour grouped into chapters with horizontal panels. |
| `/manual/` | `src/pages/manual/` | The operator's manual, rendered from Prowl's `docs/` and `skills/`. |
| `/releases/` | `src/pages/releases.astro` | Release notes, fetched from `CHANGELOG.md` at build time. |
| `/og.png` | `src/pages/og.png.ts` | Social preview image, generated with Satori. |
| `/appcast.xml` | `public/_redirects` | Redirects to the latest GitHub release's Sparkle appcast. |

## The manual is synced, not copied

`npm run build` (and `npm run dev`) first runs `scripts/sync-docs.mjs`, which copies
`docs/` and `skills/` from the Prowl repository into `src/content/manual/` (gitignored):

- With a sibling checkout at `../Prowl`, the local files are used. This is the default for
  development.
- Otherwise, and always on Netlify, it does a shallow sparse `git clone` of
  `onevcat/Prowl@main`. Set `PROWL_DOCS_SOURCE=remote` to force this locally, or point it at
  another checkout. `PROWL_DOCS_REF` selects a branch or tag.

The rendered pages link back to the source commit, and `src/lib/manual.ts` owns the reading
order and group labels. New Markdown files that are not listed there still get a page under
"More", so adding a doc to Prowl does not require a site change. Relative links between docs are
rewritten to site routes by `src/lib/rehype-manual.mjs`.

The Prowl release script triggers a Netlify build hook, so a release republishes the manual and
the release notes together.

## Screenshots

`public/images/shots/` holds product screenshots used on the details page. They were captured
from a Debug build of Prowl running against a throwaway data directory
(`PROWL_DEBUG_DATA_DIRECTORY`) with demo repositories, so no personal data is in them. Window
captures use `screencapture -l <windowID>`; the capture list and any still-missing shots are
tracked in `docs/screenshots.md`.

## Commands

```bash
npm install
npm run dev        # sync docs, then serve at http://localhost:4321
npm run build      # sync docs, then build to ./dist (uses --force to bypass the content cache)
npm run preview    # serve ./dist
npm run sync-docs  # only refresh src/content/manual
```

Node 22.12 or newer.
