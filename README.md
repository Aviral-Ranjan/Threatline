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

## AI research summaries

The AI Research page summarizes pasted legal text through the [Google Gemini API](https://ai.google.dev/gemini-api/docs/generate-content/text-generation). Configure `GEMINI_MODEL` and `GOOGLE_API_KEY` in the server environment; see `.env.example`. The default model is `gemini-4-hydrogen`, which Google currently lists with free-tier input/output pricing. Free-tier usage is limited and Google may use free-tier content to improve its products; check the current [pricing and terms](https://ai.google.dev/gemini-api/docs/pricing) before sending sensitive material. Create an API key in [Google AI Studio](https://aistudio.google.com/apikey), restrict it to the Gemini API, and keep it in server-side environment configuration—never commit it. The server does not fetch submitted source URLs: they are attached as citation metadata only. Users must confirm before their text is sent to Gemini, and summaries are always marked unverified.

## AI endpoint safeguards

- General API traffic is limited to 120 requests per IP per 15 minutes; Gemini summaries are limited to 5 per IP per 15 minutes, with at most 2 concurrent generations per server process.
- Summary input is capped at 30,000 characters, request bodies at 128 KB, provider timeouts at 30 seconds, and generated output at 1,200 tokens.
- The model receives explicit instructions to treat source text as untrusted data. No tools or URL fetching are enabled. Prompt-injection defenses reduce risk but cannot guarantee that a model is jailbreak-proof.
- CORS allows the configured `CORS_ALLOWED_ORIGINS` only. If running behind a reverse proxy, set `TRUST_PROXY_HOPS` to the exact trusted hop count and ensure the proxy overwrites forwarded-IP headers.
- The rate limiter uses in-memory storage, appropriate for a single server process. Use a shared rate-limit store for multi-process or horizontally scaled deployments.

## Legal data

The platform separates official source references, verified dates and enforceability. Automated strictness scores are intentionally not invented: comparative methodology must be jurisdiction-specific and source-verified.
