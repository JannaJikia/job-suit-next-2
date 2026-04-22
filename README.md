# JobSuit

**JobSuit** tailors your resume to any job description using **Claude** (Anthropic). It rewrites for clarity and ATS alignment, surfaces **live keyword match scoring**, and exports **`.docx`**, **`.pdf`**, or **`.txt`**.

Your **Anthropic API key stays on the server** — visitors never see it.

Stack: **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**, **Anthropic SDK**.

---

## Screenshots

Representative views of the app (marketing landing and tailor workspace).

| Landing | Tailor workspace |
| :-----: | :--------------: |
| ![JobSuit landing page — hero, features, and CTAs](docs/screenshots/landing.jpg) | ![JobSuit tailor UI — inputs, ATS score, tailored output and exports](docs/screenshots/tailor-workspace.jpg) |

---

## Features

- **Landing page** (`/`) — product overview and entry to the app.
- **Tailor** (`/tailor`) — paste resume + job description, pick tone and target length, generate.
- **ATS-style analysis** — extracts keywords from the JD and shows match % plus matched / missing terms (updates as you edit or after generation).
- **Exports** — copy to clipboard; download Word, PDF, or plain text with sensible section and bullet formatting.
- **Local persistence** — resume, JD, tone, and length are saved in `localStorage` so a refresh does not wipe your work.

---

## Requirements

- **Node.js ≥ 18.17** (Node 20 LTS recommended)
- An [Anthropic API key](https://console.anthropic.com/)

---

## Quick start

```bash
npm install
cp .env.example .env.local
# Edit .env.local — set ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Open App** or go to `/tailor`.

### Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `ANTHROPIC_API_KEY` | Yes | Server-side key for Claude. Never commit real keys. |
| `ANTHROPIC_MODEL` | No | Model id (default in code: `claude-sonnet-4-5`). |

Use `.env.local` locally; on **Vercel** (or similar), set the same variables in the project dashboard.

### Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint |

---

## Project layout

```
├── app/
│   ├── api/tailor/route.ts   # POST → Anthropic, returns tailored text + score
│   ├── tailor/page.tsx       # Tailor page metadata + app shell
│   ├── layout.tsx
│   ├── page.tsx              # Landing
│   └── globals.css
├── components/
│   └── ResumeTailorApp.tsx   # Main client UI + exports
├── lib/
│   ├── keywords.ts           # JD keyword extraction + match scoring
│   ├── parseResumeOutput.ts  # Shared line parsing for .docx / PDF
│   └── prompt.ts             # System prompt builder
├── docs/screenshots/         # README imagery
├── .env.example
└── package.json
```

---

## License

MIT — use and modify freely.
