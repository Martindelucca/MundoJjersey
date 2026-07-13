# Release QA

Automated source and post-build checks verify static routes, canonical metadata, JSON-LD markers, responsive-image contracts, sitemap/robots output, and the 1200×630 OG raster. `npm run ready` requires `PUBLIC_SITE_URL` to be a pure public deployment origin (for example, `https://example.com`, without credentials, path, query, or hash) and requires the build sitemap to contain at least one generated product page. Runtime URL consumers defensively normalize its origin. A normal local `npm run build:web` remains supported. These checks do **not** measure visual behavior, Core Web Vitals, or Lighthouse metrics.

## Preview checklist

Deploy a preview before production. Test `/`, `/catalogo`, every category route, each shirt collection route, a published product page, an out-of-stock product page, and a non-existent product URL.

At each viewport, inspect navigation, hero, catalog filters, cards, product detail, WhatsApp links, footer, and empty/not-found states:

- 320px
- 375px
- 390px
- 780px
- 1024px
- 1440px

Use keyboard-only navigation (including the skip link, mobile menu, chips, CTA, and visible focus), browser zoom at 200%, and reduced-motion mode. Confirm that images keep their intended crop (`cover` cards; `contain` product detail) and that no content clips or becomes unreachable.

## External validation

On the preview URL, capture Lighthouse separately for mobile and desktop. Record date, preview URL, device/profile, scores, LCP, INP, CLS, and any remediation links. These metrics must be measured in a browser/preview; source tests make no metric claim.

Run each representative URL through Google's Rich Results Test. Inspect the published preview with Meta Sharing Debugger, LinkedIn Post Inspector, and a WhatsApp share to confirm `/og.png`, title, description, and canonical URL.

Only promote the already-validated preview after Sanity content readiness passes, the generated sitemap and robots URLs use the production origin, and manual checks above have been recorded.
