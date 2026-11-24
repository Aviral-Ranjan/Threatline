# Threatline

A modular cybercrime and cyber law intelligence platform built with React, Vite and Express.

## Development

```powershell
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Production

```powershell
npm run build
npm start
```

Set `PORT` in the environment to override the default port. The local Express entrypoint serves the built Vite application and `/api` endpoints.

## Deploy frontend and API together on Netlify

The repository includes `netlify.toml` and a Netlify Function adapter for the Express API. Netlify builds the React/Vite frontend into `dist` and routes `/api/*` requests to that function.

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**, then select the repository.
3. Use the repository root as the base directory. The build command is `npm run build`, and the publish directory is `dist` (both are configured in `netlify.toml`).
4. Deploy the site. No server environment variables are required for this app on Netlify.
5. Verify the deployed homepage and API, for example `https://<site-name>.netlify.app/api/countries`.

The frontend and API share the Netlify origin, so the development-only Vite proxy is not involved in production. If you later host the frontend on a different domain, configure `CORS_ALLOWED_ORIGINS` for that exact origin.

The Express rate limiter uses in-memory storage; serverless function instances do not share counters, so the limit is best-effort rather than a global quota. For stronger production enforcement, configure a shared rate-limit store or Netlify edge controls.

## API safeguards

- API traffic is limited to 120 requests per IP per 15 minutes, and JSON request bodies are capped at 128 KB.
- CORS allows the configured `CORS_ALLOWED_ORIGINS` only. If running behind a reverse proxy, set `TRUST_PROXY_HOPS` to the exact trusted hop count and ensure the proxy overwrites forwarded-IP headers.
- The rate limiter uses in-memory storage, appropriate for a single server process. Use a shared rate-limit store for multi-process or horizontally scaled deployments.

## Legal data

The platform separates official source references, verified dates and enforceability. Automated strictness scores are intentionally not invented: comparative methodology must be jurisdiction-specific and source-verified.

## Homepage signals

Homepage signal records and AI-style summaries are static, curated sample content in `src/App.jsx`; topic filters search these records locally. Summaries are not generated at runtime and should be checked against linked sources. They are educational, not legal advice.
