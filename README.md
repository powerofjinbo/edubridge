# EduBridge

EduBridge is a React/Vite landing page and lightweight Node backend for a local 1-on-1 academic mentorship service.

## Public website

The public site is deployed with GitHub Pages:

```text
https://powerofjinbo.github.io/edubridge/
```

The source code stays on `main`. The static production build is published to the `gh-pages` branch because GitHub rejected workflow-file updates from the current OAuth token.

## What is included

- Commercial landing page with responsive navigation, full-bleed tutoring imagery, program tabs, mentor profiles, FAQ accordions, legal notices, and subtle motion.
- Optimized WebP tutoring images, stored under `public/hero/`.
- Supplied teacher photos, stored under `public/teachers/`.
- A consultation dialog with working Calendly, phone, email inquiry, and mentor application paths.
- A dependency-free Node HTTP server for production static serving, `/api/health`, and `/api/consultations` submissions.
- API validation, CORS restrictions, basic rate limiting, a spam honeypot, and secure static response headers.

## Scripts

```bash
npm install
npm run dev
npm run dev:api
npm run build
npm run build:pages
npm run server
```

During development, Vite proxies `/api` to `http://localhost:8787`.

Use `npm run build:pages` before publishing to GitHub Pages. It builds the app with the `/edubridge/` base path so assets load from the public GitHub Pages URL.

## Backend

Run `npm run dev:api` to start the API server. Consultation requests are appended as JSON lines to:

```text
data/consultations.jsonl
```

In production, run `npm run build` and `npm run server`; the server serves `dist/` and handles API requests.

GitHub Pages is static hosting, so it does not run `server/index.js`. On the public Pages build, the inquiry form opens a pre-addressed email and the scheduling path opens Calendly, so the full contact flow still works without collecting family data in the static site.

For a hosted API, deploy the Node server separately, set `ALLOWED_ORIGINS`, and set `VITE_API_BASE_URL` during the frontend build. When `VITE_API_BASE_URL` is present, the same inquiry form submits directly to `/api/consultations`.
