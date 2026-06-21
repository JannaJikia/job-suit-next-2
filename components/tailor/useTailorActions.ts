import { useCallback } from "react";
import { tailorResume, type TailorReport } from "@/lib/tailor";
import type { TailorMode, TailorStatus } from "./types";
import { exportTailoredDocx } from "./exportDocx";
import { exportTailoredPdf } from "./exportPdf";
import { exportTailoredTxt } from "./exportTxt";

type SetStatus = (s: TailorStatus) => void;

export function useTailorActions(
  resume: string,
  jd: string,
  tone: string,
  pages: string,
  output: string,
  mode: TailorMode,
  setOutput: (v: string) => void,
  setStatus: SetStatus,
  setLoading: (v: boolean) => void,
  setReport: (r: TailorReport | null) => void
) {
  const generate = useCallback(async () => {
    if (!resume.trim()) return setStatus({ kind: "err", text: "Please paste your resume." });
    if (!jd.trim()) return setStatus({ kind: "err", text: "Please paste the job description." });

    if (mode === "algorithm") {
      // Pure, offline tailoring — no network, no API key.
      const { tailored, report } = tailorResume({ resume, jd });
      setOutput(tailored);
      setReport(report);
      setStatus({
        kind: "ok",
        text: `Tailored offline. Match ${report.matchBefore}% → ${report.matchAfter}%. Review before sending.`,
      });
      return;
    }

    setLoading(true);
    setReport(null);
    setStatus({ kind: "info", text: "Contacting Claude…" });
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd, tone, pages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      setOutput(data.tailored || "");
      const pct = data?.score?.pct ?? 0;
      setStatus({
        kind: "ok",
        text: `Done. Match score: ${pct}%. Review carefully before sending.`,
      });
    } catch (e) {
      setStatus({ kind: "err", text: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [resume, jd, tone, pages, mode, setOutput, setStatus, setLoading, setReport]);

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
