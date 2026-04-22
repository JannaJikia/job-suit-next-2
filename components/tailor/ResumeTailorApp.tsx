"use client";

import { useState } from "react";
import { TONE_OPTIONS } from "./constants";
import { GenerateCard } from "./GenerateCard";
import { JobDescriptionCard } from "./JobDescriptionCard";
import { MatchAnalysisCard } from "./MatchAnalysisCard";
import { OutputCard } from "./OutputCard";
import { ResumeCard } from "./ResumeCard";
import { TailorHeader } from "./TailorHeader";
import type { TailorStatus } from "./types";
import { useKeywordMatch } from "./useKeywordMatch";
import { useTailorActions } from "./useTailorActions";
import { useTailorPersistence } from "./useTailorPersistence";

export default function ResumeTailorApp() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<string>(TONE_OPTIONS[0].value);
  const [pages, setPages] = useState("1–2 pages");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<TailorStatus>(null);
  const [loading, setLoading] = useState(false);

  useTailorPersistence(resume, jd, tone, pages, setResume, setJd, setTone, setPages);
  const { keywords, activeMatch } = useKeywordMatch(jd, resume, output);
  const { generate, copyOutput, downloadTxt, downloadDocx, downloadPdf } = useTailorActions(
    resume,
    jd,
    tone,
    pages,
    output,
    setOutput,
    setStatus,
    setLoading
  );

  return (
    <main className="max-w-[1400px] mx-auto px-8 pb-12">
      <TailorHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="space-y-5">
          <ResumeCard resume={resume} onResumeChange={setResume} />
          <JobDescriptionCard
            jd={jd}
            tone={tone}
            pages={pages}
            onJdChange={setJd}
            onToneChange={setTone}
            onPagesChange={setPages}
          />
          <GenerateCard loading={loading} status={status} onGenerate={generate} />
        </section>

        <section className="space-y-5">
          <MatchAnalysisCard keywords={keywords} activeMatch={activeMatch} />
          <OutputCard
            output={output}
            onCopy={copyOutput}
            onDocx={downloadDocx}
            onPdf={downloadPdf}
            onTxt={downloadTxt}
          />
        </section>
      </div>

      <footer className="text-center text-slate-500 text-xs py-5">
        JobSuit · powered by Claude · your data is sent only to your server
      </footer>
    </main>
  );
}
