import { useCallback } from "react";
import { tailorResume, type TailorReport } from "@/lib/tailor";
import type { TailorStatus } from "./types";
import { exportTailoredDocx } from "./exportDocx";
import { exportTailoredPdf } from "./exportPdf";
import { exportTailoredTxt } from "./exportTxt";

type SetStatus = (s: TailorStatus) => void;

export function useTailorActions(
  resume: string,
  jd: string,
  output: string,
  setOutput: (v: string) => void,
  setStatus: SetStatus,
  setReport: (r: TailorReport | null) => void
) {
  const generate = useCallback(() => {
    if (!resume.trim()) return setStatus({ kind: "err", text: "Please paste your resume." });
    if (!jd.trim()) return setStatus({ kind: "err", text: "Please paste the job description." });

    // Pure, offline tailoring — no network, no API key.
    try {
      const { tailored, report } = tailorResume({ resume, jd });
      setOutput(tailored);
      setReport(report);
      setStatus({
        kind: "ok",
        text: `Tailored offline. Match ${report.matchBefore}% → ${report.matchAfter}%. Review before sending.`,
      });
    } catch (e) {
      setStatus({ kind: "err", text: (e as Error).message || "Could not tailor the resume." });
    }
  }, [resume, jd, setOutput, setStatus, setReport]);

  const copyOutput = useCallback(async () => {
    if (!output) return setStatus({ kind: "err", text: "Nothing to copy yet." });
    await navigator.clipboard.writeText(output);
    setStatus({ kind: "ok", text: "Copied to clipboard." });
  }, [output, setStatus]);

  const downloadTxt = useCallback(async () => {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    await exportTailoredTxt(output);
  }, [output, setStatus]);

  const downloadDocx = useCallback(async () => {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    try {
      await exportTailoredDocx(output);
      setStatus({ kind: "ok", text: "Downloaded tailored-resume.docx" });
    } catch (e) {
      setStatus({ kind: "err", text: (e as Error).message });
    }
  }, [output, setStatus]);

  const downloadPdf = useCallback(async () => {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    try {
      await exportTailoredPdf(output);
      setStatus({ kind: "ok", text: "Downloaded tailored-resume.pdf" });
    } catch (e) {
      setStatus({ kind: "err", text: (e as Error).message });
    }
  }, [output, setStatus]);

  return { generate, copyOutput, downloadTxt, downloadDocx, downloadPdf };
}
