# JobSuit

**JobSuit** tailors your resume to any job description with a **deterministic, no-AI algorithm** that runs entirely in your browser. It reorders bullets by relevance (BM25), strengthens weak verbs, surfaces missing keywords, drafts a role-specific summary, and shows a **live ATS keyword match score**. Export a styled, single-column, ATS-clean **`.docx`**, **`.pdf`**, or **`.txt`**.

No API key, no account, no server — nothing leaves your browser.

Stack: **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **Vitest**.

## How tailoring works

The offline engine (`lib/tailor/`) is a pure pipeline with no network calls:

1. **Reorder** bullets within Experience/Projects/Skills by relevance to the job description, ranked with **BM25** (IDF-weighted, length-normalized) so genuinely distinguishing bullets rise to the top.
2. **Strengthen** bullets: weak lead verbs are swapped for strong action verbs (no facts or numbers are invented).
3. **Inject** missing keywords into Skills (skill-like terms only), each flagged in a review panel so you can remove anything untrue.
4. **Summarize**: a role-specific summary is drafted from the job title and your top matching skills.

Every run returns a **transparency report** showing exactly what changed and the before/after match score.

### Styled output

The tailored resume is parsed into a structured document model (title → contact → sections → entries → bullets) and rendered identically three ways — the on-screen preview, the `.docx`, and the PDF — in a **"Classic professional"** layout: centered name, muted contact line, small-caps section headings with a rule, bold entry headers, and disc bullets. Single column and ATS-safe fonts throughout, so what you see in the preview is exactly what you download.

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
- **BM25 relevance ranking** — bullets are reordered by an IDF-weighted, length-normalized score, not a naive keyword count.
- **ATS-style analysis** — extracts keywords from the JD and shows match % plus matched / missing terms (updates as you edit or after generation).
- **Transparency report** — see how many bullets were reordered/strengthened, the summary status, and every injected keyword flagged for review.
- **Styled exports** — copy to clipboard; download a single-column, ATS-clean Word, PDF, or plain-text document with consistent headings and bullets.
- **Local persistence** — resume and JD are saved in `localStorage` so a refresh does not wipe your work.

---

## Requirements

- **Node.js ≥ 18.17** (Node 20 LTS recommended). If `node -v` shows 16.x, use Homebrew’s Node 20, e.g. `export PATH="/usr/local/opt/node@20/bin:$PATH"` (Apple Silicon: `/opt/homebrew/opt/node@20/bin`).

No API keys or environment variables are required — the app is fully client-side.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and go to `/tailor`. The offline algorithm works immediately, no setup required.

### What belongs in Git

**Commit:** application source, `package.json` / lockfile, `README.md`, `docs/`, and `next-env.d.ts` (TypeScript refs for Next — regenerate with `next dev` or `next build` if missing).

**Do not commit:** anything ignored by `.gitignore`, including:

- **Dependencies:** `node_modules/`
- **Build output:** `.next/`, `out/`, `dist/`
- **Deploy metadata:** `.vercel/`
- **OS / editor noise:** `.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`
- **Caches:** `*.tsbuildinfo`, `.eslintcache`, `.turbo`

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

The app is a standard **Next.js 14** project with no server-side secrets or API routes. The easiest path is **[Vercel](https://vercel.com)** (same team as Next.js).

### Vercel (recommended)

1. Push this repo to **GitHub** (or GitLab / Bitbucket).
2. In [vercel.com/new](https://vercel.com/new), **Import** the repository. Vercel detects Next.js automatically.
3. **Deploy**. Your site will get a `*.vercel.app` URL; attach a custom domain in Project → **Domains** if you like. With the default Git integration, each push to your production branch triggers a new deploy. No environment variables are needed.

**CLI (optional):** install the [Vercel CLI](https://vercel.com/docs/cli), run `vercel login`, then from the repo root run `vercel` (preview) or `vercel --prod`.

### Smoke test before / after deploy

```bash
PATH="/usr/local/opt/node@20/bin:$PATH" npm run build && npm run start
```

Then open `/` and `/tailor`, run one generation, and confirm downloads work.

### Other hosts

Any platform that can run **Node 18+** and a **Next.js** production build (`npm run build` → `npm run start`) works (Docker, Railway, Fly.io, AWS, etc.). Because everything runs client-side, no extra configuration is required.

---

## Project layout

```
├── app/
│   ├── tailor/page.tsx       # Tailor page metadata + app shell
│   ├── layout.tsx            # Geist fonts + theme
│   ├── page.tsx              # Re-exports landing page
│   └── globals.css
├── components/
│   ├── landing/              # Marketing page sections
│   ├── tailor/               # Resume tailor UI, hooks, export helpers
│   │                         #   (ResumePreview + exportDocx/Pdf/Txt render the
│   │                         #    structured "Classic professional" layout)
│   └── ResumeTailorApp.tsx   # Re-export of tailor/ResumeTailorApp
├── lib/
│   ├── tailor/               # Offline tailoring pipeline (parse, score/BM25,
│   │                         #   reorder, strengthen, inject, summary, serialize)
│   ├── keywords.ts           # JD keyword extraction + match scoring
│   └── parseResumeOutput.ts  # Shared line parsing for the structured renderers
├── docs/screenshots/         # README imagery
└── package.json
```

---

## License

MIT — use and modify freely.
