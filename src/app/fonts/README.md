# Local font assets

Original Latin WOFF2 subsets of Geist (variable, normal 100–900) and Instrument Serif (normal/italic 400), obtained through Next.js's Google Fonts loader and copied unchanged from the verified build. These are served locally with `next/font/local`; no font network request is needed during development or build.

Upstream families and SIL Open Font Licenses:

- https://github.com/google/fonts/tree/main/ofl/geist
- https://github.com/google/fonts/tree/main/ofl/instrumentserif

License texts are included alongside the binaries. `scripts/font-licenses.mjs` can refresh them from the upstream source. Keep these licenses with redistributed font files.
