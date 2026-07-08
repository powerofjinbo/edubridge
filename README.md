# EduBridge

EduBridge is a React/Vite landing page and lightweight Node backend for a local 1-on-1 academic mentorship service.

## Public website

The public site is deployed with GitHub Pages:

```text
https://powerofjinbo.github.io/edubridge/
```

The source code stays on `main`. The static production build is published to the `gh-pages` branch because GitHub rejected workflow-file updates from the current OAuth token.

## What is included

- Polished landing page modeled after the reference Webflow site.
- Generated high-resolution hero tutoring images, stored under `public/hero/`.
- Supplied teacher photos, stored under `public/teachers/`.
- Responsive sections for hero, mentorship value, process, mentor profiles, satisfaction guarantee, and footer.
- A consultation modal wired to a backend API.
- A dependency-free Node HTTP server for production static serving and `/api/consultations` submissions.

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

GitHub Pages is static hosting, so it does not run `server/index.js`. For a public backend, deploy the Node server separately and set `VITE_API_BASE_URL` during the frontend build.
