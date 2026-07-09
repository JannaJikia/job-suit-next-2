import { FeatureTile } from "./FeatureCard";

export function LandingFeatures() {
  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-20 lg:py-24">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-2xl">
        Everything the rewrite does, you can see and verify
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureTile
          tinted
          className="md:col-span-2"
          title="Tailoring without AI"
          body="A deterministic engine reorders your bullets by relevance, swaps weak verbs for strong ones, surfaces missing keywords, and drafts a role-specific summary. It runs entirely in your browser, with no API key and nothing sent to a server."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            {["Reorder", "Strengthen", "Keyword match", "Summary"].map((t) => (
              <span
                key={t}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent dark:text-accent-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </FeatureTile>

        <FeatureTile
          title="Live ATS match"
          body="Watch matched and missing keywords from the job post update the moment you edit, so you always know where you stand."
        />

        <FeatureTile
          title="Full transparency"
          body="A report shows exactly what changed: how many bullets moved, what was strengthened, and every keyword added, each flagged for your review."
        />

        <FeatureTile
          className="md:col-span-2"
          title="Export a polished, ATS-clean document"
          body="Download a styled, single-column resume as .docx, PDF, or .txt in one click — consistent headings, spacing, and bullets that parsers and recruiters both read cleanly. What you see in the preview is exactly what you download."
        />
      </div>
    </section>
  );
}
