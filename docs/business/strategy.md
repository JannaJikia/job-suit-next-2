# JobSuit — Business Perspective

> A working strategy doc, kept separate from the technical specs. Opinionated on
> purpose; revise as the product and market change.

## 1. What JobSuit is becoming

JobSuit started as an AI resume tailor. The direction now is a **privacy-first,
offline-by-default job-search toolkit**: resume tailoring, cover letters, and
interview prep, all running in the browser with no account and no data sent to a
server. AI is optional and **bring-your-own-key (BYOK)**, so the heavy lifting a
user wants from an LLM costs the operator nothing.

That combination — free, private, transparent, no login — is the whole strategy.
Everything below follows from it.

## 2. Who it's for (ICP)

- **Primary:** active job seekers in tech and knowledge work (engineers,
  designers, PMs, analysts, marketers) who apply to many roles and feel the pain
  of tailoring each one.
- **Secondary:** new grads and career switchers who need structure (what to say,
  what to prepare) more than polish.
- **Privacy-sensitive users** who don't want to paste their resume and salary
  history into a third-party SaaS that trains on it.
- **B2B channel (later):** university career centers, bootcamps, and
  outplacement firms that need a tool they can hand to cohorts without per-seat
  AI bills.

## 3. Positioning & differentiation

The market is crowded (Teal, Rezi, Kickresume, Jobscan, Huntr, Final Round AI,
and dozens of "AI resume builder" clones). Almost all are **subscription SaaS
with server-side AI** — they hold your data and meter your usage.

JobSuit's defensible angles:

1. **Free core, no login.** The algorithm path is genuinely useful on its own and
   costs nothing to run. Removes the #1 drop-off (signup wall).
2. **Privacy.** Nothing leaves the browser in algorithm mode; in AI mode the
   user's key calls Anthropic directly, never our server. This is a real, provable
   claim — not marketing.
3. **Transparency.** The "what changed" report and the no-fabrication guarantee
   are the opposite of black-box AI tools that quietly invent achievements.
4. **BYOK economics.** Users who want AI quality bring their own key; we carry no
   variable AI cost for them. Competitors can't easily match free-AI-for-users
   without eating margin.

One-line positioning: **"Tailor your resume, cover letter, and interview prep —
free, private, and instant. Bring your own AI if you want more."**

## 4. Monetization options

The core is free and offline by design, so revenue has to come from the edges.
Ranked by fit:

1. **Managed AI tier (recommended primary).** Most users won't have an Anthropic
   key. Offer a paid tier where *we* supply the AI (we pay Anthropic, charge a
   subscription or credit pack with margin). BYOK stays free for power users; the
   managed tier monetizes the majority who won't set up a key. This is the single
   biggest lever and the cleanest fit.
2. **B2B / education licensing.** Seat or site licenses for career centers and
   bootcamps. They get the toolkit for a cohort; we get predictable revenue. The
   offline+privacy story sells well to institutions.
3. **Premium templates & exports.** One-time or low-tier subscription for
   designed resume/letter templates and richer export formats. Low effort, low
   ceiling, but pure margin.
4. **Affiliate / partnerships.** Referrals to job boards, courses, paid
   human resume review, mock-interview services. Aligned with user intent.
5. **Open-source sponsorship / donations.** Low yield, but reinforces the
   trust/privacy brand and the "free forever core" promise.

Avoid: ads (erodes the premium/trust positioning), and selling user data (kills
the entire differentiation — it must never happen, and we should say so loudly).

**Pricing intuition:** a Managed-AI tier around $6–12/mo or a credit pack
(e.g. $5 for N tailorings) undercuts the $20–40/mo incumbents while staying
profitable on Anthropic costs, especially with a cheaper model default for the
managed tier.

## 5. Go-to-market

- **SEO is the main channel.** Job-search queries have massive, durable search
  volume. Build:
  - Evergreen guides ("how to tailor a resume to a job description", "cover
    letter for X role", "Y interview questions").
  - **Programmatic pages** per role and per company (the algorithm + JD data make
    these cheap to generate at quality). This is the highest-leverage growth play
    and fits the existing toolkit.
- **Free-tool virality.** The free, no-login tool is inherently shareable. Make
  sharing/output frictionless; add subtle "made with JobSuit" provenance.
- **Launch moments.** Product Hunt, Hacker News (the privacy/offline/BYOK angle
  is HN-friendly), relevant subreddits (r/jobs, r/cscareerquestions,
  r/resumes), LinkedIn.
- **Directories & backlinks.** Submit to AI-tool and SaaS directories for DR and
  discovery.
- **Community.** Show up where job seekers already are with genuinely useful
  answers, not spam.

## 6. Key risks

- **Commoditization.** "AI resume tool" is a red ocean. Mitigation: lean hard on
  privacy + transparency + free core; don't try to out-feature incumbents.
- **BYOK friction.** Most users don't have an API key — if AI is the perceived
  value and it's gated behind setup, conversion suffers. Mitigation: make the
  *algorithm* genuinely good (so free mode delivers real value) and offer the
  Managed-AI tier for everyone else.
- **Trust is load-bearing.** The privacy claim is the brand. One leak or a
  sloppy analytics integration that ships resume text off-device would be fatal.
  Keep the data path auditable and say exactly what we do and don't collect.
- **Maintenance & accuracy.** The algorithm must stay honest (no fabrication) and
  ATS-correct, or the differentiation evaporates.

## 7. Strategic recommendation

1. **Lead free, private, no-login** across resume + cover letter + interview prep.
   That's the wedge.
2. **Two AI paths:** BYOK (free, for power users) **and** a Managed-AI paid tier
   (for everyone else) — the latter is the primary revenue engine.
3. **Grow through SEO + programmatic role/company pages** as the main channel;
   launch loud on the privacy/offline angle.
4. **Open a B2B education/outplacement channel** once the consumer product and the
   managed tier are proven.
5. **Protect trust above all.** Make the data-handling promise explicit and never
   break it.
