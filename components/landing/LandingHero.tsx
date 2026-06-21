import Link from "next/link";

export function LandingHero() {
  return (
    <section className="max-w-6xl mx-auto w-full px-6 pt-16 pb-20 lg:pt-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
      <div>
        <div className="animate-rise inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent dark:text-accent-soft text-xs font-medium mb-6">
          Offline algorithm. No AI required.
        </div>

        <h1 className="animate-rise text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-zinc-900 dark:text-zinc-100">
          Your resume, <span className="text-accent dark:text-accent-soft">tailored</span> to every job
        </h1>

        <p
          className="animate-rise mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-[52ch]"
          style={{ animationDelay: "80ms" }}
        >
          Paste your resume and a job post. JobSuit reorders, strengthens, and keyword-matches
          it for ATS, instantly in your browser.
        </p>

        <div
          className="animate-rise mt-9 flex flex-col sm:flex-row gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <Link
            href="/tailor"
            className="px-7 py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base text-center active:translate-y-px transition"
          >
            Tailor my resume
          </Link>
          <a
            href="https://github.com/JannaJikia/job-suit-next-2"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold text-base text-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <ResumePreview />
    </section>
  );
}

/** A real sample of tailored output — not a fake screenshot. */
function ResumePreview() {
  return (
    <div
      className="animate-rise relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/5 dark:shadow-black/30 p-7 font-mono text-[12.5px] leading-6"
      style={{ animationDelay: "120ms" }}
      aria-label="Example of a tailored resume"
    >
      <div className="absolute -top-3 right-6 rounded-full bg-accent text-white text-[11px] font-sans font-semibold px-3 py-1 shadow">
        Match 92% · sample
      </div>
      <p className="text-zinc-900 dark:text-zinc-100 font-semibold">Maya Okonkwo</p>
      <p className="text-zinc-400 dark:text-zinc-500">maya.okonkwo@mail.com · Berlin</p>

      <p className="mt-4 text-[11px] tracking-widest text-zinc-400">EXPERIENCE</p>
      <p className="mt-1 text-zinc-700 dark:text-zinc-300">
        Led a{" "}
        <mark className="bg-accent/15 text-accent dark:text-accent-soft rounded px-1">React</mark>{" "}
        dashboard rebuild, cutting load time 40%.
      </p>
      <p className="mt-1.5 text-zinc-700 dark:text-zinc-300">
        Built{" "}
        <mark className="bg-accent/15 text-accent dark:text-accent-soft rounded px-1">
          TypeScript
        </mark>{" "}
        services across three teams.
      </p>

      <p className="mt-4 text-[11px] tracking-widest text-zinc-400">SKILLS</p>
      <p className="mt-1 text-zinc-700 dark:text-zinc-300">
        React, TypeScript,{" "}
        <mark className="bg-accent/15 text-accent dark:text-accent-soft rounded px-1">GraphQL</mark>,
        CI/CD
      </p>
    </div>
  );
}
