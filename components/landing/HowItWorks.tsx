const STEPS = [
  { step: "1", title: "Paste your resume", body: "Drop in your current resume as plain text — the whole thing, nothing trimmed." },
  { step: "2", title: "Add the job description", body: "Paste the full job posting. Choose your preferred tone and target page length." },
  { step: "3", title: "Download & apply", body: "Claude tailors your resume in seconds. Download as .docx, PDF, or .txt and apply." },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-slate-800/50 border-y border-slate-700/60 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">How it works</h2>
        <p className="text-slate-400">Three steps, under a minute.</p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {STEPS.map(({ step, title, body }) => (
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
  );
}
