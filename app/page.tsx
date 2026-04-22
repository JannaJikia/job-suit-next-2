import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold text-sm select-none">
            JS
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            JobSuit
          </span>
        </div>
        <Link
          href="/tailor"
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
        >
          Open App
        </Link>
      </nav>

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
          Paste your resume and a job description. JobSuit uses AI to rewrite your resume so it
          passes ATS filters and highlights exactly what the hiring manager wants to see.
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

        <p className="text-slate-500 text-sm mt-6">
          No account needed · Your data stays on your server
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <FeatureCard
          icon="🎯"
          title="ATS keyword match"
          body="Instantly see which keywords from the job description are — and aren't — in your resume. Live score updates as you edit."
        />
        <FeatureCard
          icon="✍️"
          title="Claude rewrites your bullets"
          body="Every bullet point is rewritten using the STAR pattern: action verb, what you did, and quantified impact. Factual content is preserved."
        />
        <FeatureCard
          icon="📄"
          title="Download in any format"
          body="Export your polished resume as a .docx, PDF, or plain .txt — ready to attach to any application in seconds."
        />
      </section>

      <section className="bg-slate-800/50 border-y border-slate-700/60 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How it works</h2>
          <p className="text-slate-400">Three steps, under a minute.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { step: "1", title: "Paste your resume", body: "Drop in your current resume as plain text — the whole thing, nothing trimmed." },
            { step: "2", title: "Add the job description", body: "Paste the full job posting. Choose your preferred tone and target page length." },
            { step: "3", title: "Download & apply", body: "Claude tailors your resume in seconds. Download as .docx, PDF, or .txt and apply." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold text-sm">
                {step}
              </div>
              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get more interviews?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          It takes less than a minute. Paste, generate, download.
        </p>
        <Link
          href="/tailor"
          className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-[.98] transition"
        >
          Start tailoring →
        </Link>
      </section>

      <footer className="border-t border-slate-800 py-6 px-6 text-center text-slate-500 text-xs">
        JobSuit · powered by Claude · MIT license
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg shadow-black/20">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
