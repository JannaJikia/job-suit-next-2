import Link from "next/link";

export function LandingHero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        Powered by Claude · Free to self-host
      </div>

      <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-5 max-w-3xl">
        Your resume,{" "}
        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          tailored perfectly
        </span>{" "}
        for every job
      </h1>

      <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
        Paste your resume and a job description. JobSuit uses AI to rewrite your resume so it passes
        ATS filters and highlights exactly what the hiring manager wants to see.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Link
          href="/tailor"
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-[.98] transition"
        >
          ✨ Tailor my resume — free
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base hover:bg-slate-700 transition"
        >
          View on GitHub
        </a>
      </div>

      <p className="text-slate-500 text-sm mt-6">No account needed · Your data stays on your server</p>
    </section>
  );
}
