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

Set `PORT` in the environment to override the default port. The production Express server serves the built Vite application and `/api` endpoints.

## API safeguards

- API traffic is limited to 120 requests per IP per 15 minutes, and JSON request bodies are capped at 128 KB.
- CORS allows the configured `CORS_ALLOWED_ORIGINS` only. If running behind a reverse proxy, set `TRUST_PROXY_HOPS` to the exact trusted hop count and ensure the proxy overwrites forwarded-IP headers.
- The rate limiter uses in-memory storage, appropriate for a single server process. Use a shared rate-limit store for multi-process or horizontally scaled deployments.

## Legal data

The platform separates official source references, verified dates and enforceability. Automated strictness scores are intentionally not invented: comparative methodology must be jurisdiction-specific and source-verified.
