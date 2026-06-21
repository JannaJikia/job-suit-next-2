# JobSuit

**JobSuit** tailors your resume to any job description with a **deterministic, no-AI algorithm** that runs entirely in your browser. It reorders bullets by relevance, strengthens weak verbs, surfaces missing keywords, drafts a role-specific summary, and shows a **live ATS keyword match score**. Export **`.docx`**, **`.pdf`**, or **`.txt`**.

No API key, no account, and nothing leaves your browser. An optional **AI mode** (Claude) is available if you add an Anthropic API key.

Stack: **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **Vitest**. Anthropic SDK is used only for the optional AI mode.

## How tailoring works

The offline engine (`lib/tailor/`) is a pure pipeline with no network calls:

1. **Reorder** bullets within Experience/Projects/Skills by relevance to the job description.
2. **Strengthen** bullets: weak lead verbs are swapped for strong action verbs (no facts or numbers are invented).
3. **Inject** missing keywords into Skills (skill-like terms only), each flagged in a review panel so you can remove anything untrue.
4. **Summarize**: a role-specific summary is drafted from the job title and your top matching skills.

Every run returns a **transparency report** showing exactly what changed and the before/after match score.

---
## Deployed Preview
https://job-suit-next-2.vercel.app/

## Screenshots

Representative views of the app (marketing landing and tailor workspace).

| Landing | Tailor workspace |
| :-----: | :--------------: |
| ![JobSuit landing page: hero, features, and CTAs](docs/screenshots/redesign-landing.jpeg) | ![JobSuit tailor UI: inputs, ATS score, change report, tailored output and exports](docs/screenshots/redesign-tailor.jpeg) |

---

## Features

- **Offline tailoring** (`/tailor`) — paste resume + job description and tailor it in the browser, no key required.
- **Mode toggle** — default **Algorithm** (offline) or optional **AI (Claude)** when an API key is present.
- **ATS-style analysis** — extracts keywords from the JD and shows match % plus matched / missing terms (updates as you edit or after generation).
- **Transparency report** — see how many bullets were reordered/strengthened, the summary status, and every injected keyword flagged for review.
- **Exports** — copy to clipboard; download Word, PDF, or plain text with sensible section and bullet formatting.
- **Local persistence** — resume, JD, tone, and length are saved in `localStorage` so a refresh does not wipe your work.

---

## Requirements

- **Node.js ≥ 18.17** (Node 20 LTS recommended). If `node -v` shows 16.x, use Homebrew’s Node 20, e.g. `export PATH="/usr/local/opt/node@20/bin:$PATH"` (Apple Silicon: `/opt/homebrew/opt/node@20/bin`).
- An [Anthropic API key](https://console.anthropic.com/) — **optional**, only for AI mode.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and go to `/tailor`. The offline algorithm works immediately, no setup required.

For optional **AI mode**, add a key:

```bash
cp .env.example .env.local
# Edit .env.local — set ANTHROPIC_API_KEY
```

### Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `ANTHROPIC_API_KEY` | No | Server-side key for Claude. Only needed for the optional AI mode; the algorithm runs without it. |
| `ANTHROPIC_MODEL` | No | Model id (default in code: `claude-sonnet-4-5`). |

Use `.env.local` locally; on **Vercel** (or similar), set the same variables in the project dashboard.

### What belongs in Git

**Commit:** application source, `package.json` / lockfile, `README.md`, `.env.example`, `docs/`, and `next-env.d.ts` (TypeScript refs for Next — regenerate with `next dev` or `next build` if missing).

**Do not commit:** anything ignored by `.gitignore`, including:

- **Secrets:** any `.env*` file except `.env.example` (see `.gitignore`)
- **Dependencies:** `node_modules/`
- **Build output:** `.next/`, `out/`, `dist/`
- **Deploy metadata:** `.vercel/`
- **OS / editor noise:** `.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`
- **Local AI tooling:** `.claude/` (Claude Code machine-specific settings)
- **Caches:** `*.tsbuildinfo`, `.eslintcache`, `.turbo`

If you are unsure, run `git status` before committing and never `git add .env*`.

### Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest unit suite (`lib/tailor`) |

---

## Deploy

The app is a standard **Next.js 14** project. The easiest path is **[Vercel](https://vercel.com)** (same team as Next.js).

### Vercel (recommended)

1. Push this repo to **GitHub** (or GitLab / Bitbucket).
2. In [vercel.com/new](https://vercel.com/new), **Import** the repository. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add (at least for **Production**; add Preview if you want previews to call Claude too):
   - `ANTHROPIC_API_KEY` — your server key from [Anthropic Console](https://console.anthropic.com/).
   - `ANTHROPIC_MODEL` — optional; defaults to `claude-sonnet-4-5` in code if unset.
4. **Deploy**. Your site will get a `*.vercel.app` URL; attach a custom domain in Project → **Domains** if you like. With the default Git integration, each push to your production branch triggers a new deploy.

**CLI (optional):** install the [Vercel CLI](https://vercel.com/docs/cli), run `vercel login`, then from the repo root run `vercel` (preview) or `vercel --prod`. Add secrets with `vercel env add ANTHROPIC_API_KEY` or in the dashboard under **Settings → Environment Variables**.

`vercel.json` requests up to **60s** for `app/api/tailor/route.ts`. On **Hobby**, serverless timeouts are shorter than on **Pro**, so very slow Claude calls may time out until you upgrade or the model responds faster. Redeploy after changing env vars.

### Smoke test before / after deploy

```bash
PATH="/usr/local/opt/node@20/bin:$PATH" npm run build && npm run start
```

Then open `/` and `/tailor`, run one generation, and confirm downloads work.

### Other hosts

Any platform that can run **Node 18+** and a **Next.js** production build (`npm run build` → `npm run start`) works (Docker, Railway, Fly.io, AWS, etc.). Set the same environment variables as on Vercel. For serverless platforms, mirror the **function timeout** and **Node** version settings so `/api/tailor` can finish.

---

## Project layout

```
├── app/
│   ├── api/tailor/route.ts   # POST → Anthropic (AI mode only); 503 if no key
│   ├── tailor/page.tsx       # Tailor page metadata + app shell
│   ├── layout.tsx            # Geist fonts + theme
│   ├── page.tsx              # Re-exports landing page
│   └── globals.css
├── components/
│   ├── landing/              # Marketing page sections
│   ├── tailor/               # Resume tailor UI, hooks, export helpers
│   └── ResumeTailorApp.tsx   # Re-export of tailor/ResumeTailorApp
├── lib/
│   ├── tailor/               # Offline tailoring pipeline (parse, score,
│   │                         #   reorder, strengthen, inject, summary, serialize)
│   ├── keywords.ts           # JD keyword extraction + match scoring
│   ├── parseResumeOutput.ts  # Shared line parsing for .docx / PDF
│   └── prompt.ts             # AI-mode prompt builder
├── docs/screenshots/         # README imagery
├── .env.example
├── vercel.json               # Serverless maxDuration for /api/tailor (Vercel)
└── package.json
```

---

## License

MIT — use and modify freely.
