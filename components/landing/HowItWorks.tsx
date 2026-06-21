const STEPS = [
  {
    n: "1",
    title: "Paste your resume",
    body: "Drop in your current resume as plain text. The whole thing, nothing trimmed.",
  },
  {
    n: "2",
    title: "Add the job description",
    body: "Paste the full posting. JobSuit pulls the keywords that matter and scores your match.",
  },
  {
    n: "3",
    title: "Tailor and download",
    body: "Get an ATS-ready resume in seconds, then export as .docx, PDF, or .txt and apply.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 py-20 lg:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Three steps, under a minute
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map(({ n, title, body }) => (
            <div key={n}>
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent dark:text-accent-soft grid place-items-center font-bold tabular-nums">
                {n}
              </div>
              <h3 className="mt-4 font-semibold text-base text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-[40ch]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
