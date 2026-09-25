@AGENTS.md

# Deployment
- This project deploys to **Vercel** (auto-deploys on push to `main`).
- Do NOT use `output: "export"` in next.config.ts — the site uses server-side SQLite API routes which require a Node.js server.
- The GitHub Actions workflow (`.github/workflows/deploy.yml`) is CI-only (build check). Vercel handles the actual deployment.
- The SQLite database (`data.db`) is gitignored and ephemeral on Vercel — `lib/seed.ts` seeds it fresh on every cold start via `seedIfEmpty()`.
- Product images go in `public/uploads/` and are committed to git so Vercel serves them.
