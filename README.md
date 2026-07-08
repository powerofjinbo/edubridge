# EduBridge

EduBridge is a React/Vite landing page and lightweight Node backend for a local 1-on-1 academic mentorship service.

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
npm run server
```

During development, Vite proxies `/api` to `http://localhost:8787`.

## Backend

Run `npm run dev:api` to start the API server. Consultation requests are appended as JSON lines to:

```text
data/consultations.jsonl
```

In production, run `npm run build` and `npm run server`; the server serves `dist/` and handles API requests.
