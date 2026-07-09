import { toResumeDoc } from "@/lib/tailor/resumeDoc";

/**
 * Renders tailored resume text as a styled, single-column "Classic
 * professional" document — the same visual hierarchy the .docx and PDF
 * exporters produce, so the on-screen preview matches the download.
 */
export function ResumePreview({ output }: { output: string }) {
  const doc = toResumeDoc(output);

  return (
    <div className="mx-auto max-w-[820px] bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 rounded-md px-8 py-9 sm:px-10 sm:py-10 font-sans">
      {doc.title && (
        <h1 className="text-center text-[22px] font-bold tracking-wide leading-tight">
          {doc.title}
        </h1>
      )}
      {doc.contactLine && (
        <p className="text-center text-[11.5px] text-zinc-600 mt-1.5 leading-relaxed">
          {doc.contactLine}
        </p>
      )}
      {doc.intro.map((line, i) => (
        <p key={i} className="text-center text-[12.5px] text-zinc-700 mt-1 leading-relaxed">
          {line}
        </p>
      ))}

      {doc.sections.map((section, si) => (
        <section key={si} className="mt-5">
          <h2 className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-zinc-800 border-b border-zinc-300 pb-1">
            {section.name.toUpperCase()}
          </h2>
          <div className="mt-2 space-y-2.5">
            {section.entries.map((entry, ei) => (
              <div key={ei}>
                {entry.header && (
                  <p className="text-[13px] font-semibold text-zinc-900">{entry.header}</p>
                )}
                {entry.body.map((line, bi) => (
                  <p key={bi} className="text-[12.5px] text-zinc-700 leading-snug">
                    {line}
                  </p>
                ))}
                {entry.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 space-y-1 marker:text-zinc-500">
                    {entry.bullets.map((b, bi) => (
                      <li key={bi} className="text-[12.5px] text-zinc-800 leading-snug pl-0.5">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
