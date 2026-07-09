"use client";

import { useState } from "react";
import type { TailorReport } from "@/lib/tailor";
import { ChangeReportCard } from "./ChangeReportCard";
import { GenerateCard } from "./GenerateCard";
import { JobDescriptionCard } from "./JobDescriptionCard";
import { MatchAnalysisCard } from "./MatchAnalysisCard";
import { OutputCard } from "./OutputCard";
import { ResultScoreCard } from "./ResultScoreCard";
import { ResumeCard } from "./ResumeCard";
import { TailorHeader } from "./TailorHeader";
import type { TailorStatus } from "./types";
import { useKeywordMatch } from "./useKeywordMatch";
import { useTailorActions } from "./useTailorActions";
import { useTailorPersistence } from "./useTailorPersistence";

export default function ResumeTailorApp() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<TailorStatus>(null);
  const [report, setReport] = useState<TailorReport | null>(null);

  useTailorPersistence(resume, jd, setResume, setJd);
  const { keywords, activeMatch } = useKeywordMatch(jd, resume, output);
  const { generate, copyOutput, downloadTxt, downloadDocx, downloadPdf } = useTailorActions(
    resume,
    jd,
    output,
    setOutput,
    setStatus,
    setReport
  );

  return (
    <main className="max-w-[1400px] mx-auto px-6 sm:px-8 pb-12">
      <TailorHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Setup rail — inputs + action, pinned while the result scrolls */}
        <aside className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-6">
          <ResumeCard resume={resume} onResumeChange={setResume} />
          <JobDescriptionCard jd={jd} onJdChange={setJd} />
          <GenerateCard status={status} onGenerate={generate} />
        </aside>

        {/* Result stage — score, the tailored document, then the details */}
        <section className="lg:col-span-7 xl:col-span-8 space-y-5">
          <ResultScoreCard keywords={keywords} activeMatch={activeMatch} report={report} />
          <OutputCard
            output={output}
            onCopy={copyOutput}
            onDocx={downloadDocx}
            onPdf={downloadPdf}
            onTxt={downloadTxt}
          />
          <ChangeReportCard report={report} />
          <MatchAnalysisCard keywords={keywords} activeMatch={activeMatch} />
        </section>
      </div>

      <footer className="text-center text-slate-500 text-xs py-5">
        JobSuit · deterministic and fully offline. Your data stays in your browser.
      </footer>
    </main>
  );
}
