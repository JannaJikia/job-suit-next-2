"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Paragraph as DocxParagraph } from "docx";
import { extractKeywords, scoreMatch, type MatchResult } from "@/lib/keywords";
import { parseResumeOutputLines } from "@/lib/parseResumeOutput";

type Status = { kind: "info" | "err" | "ok"; text: string } | null;

const TONE_OPTIONS = [
  { value: "concise, metric-driven, impactful", label: "Concise & metric-driven" },
  { value: "warm, narrative, leadership-focused", label: "Narrative & leadership" },
  { value: "technical, precise, engineering-focused", label: "Technical & precise" },
];

const PAGES_OPTIONS = ["1 page", "1–2 pages", "2 pages"];

const STORAGE_KEY = "jobsuit.v1";

export default function ResumeTailorApp() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState(TONE_OPTIONS[0].value);
  const [pages, setPages] = useState("1–2 pages");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (typeof s.resume === "string") setResume(s.resume);
      if (typeof s.jd === "string") setJd(s.jd);
      if (typeof s.tone === "string") setTone(s.tone);
      if (typeof s.pages === "string") setPages(s.pages);
    } catch {
      /* ignore */
    }
  }, []);

  // Persist inputs
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ resume, jd, tone, pages })
        );
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [resume, jd, tone, pages]);

  // Live keyword extraction + match score (recomputes when output or inputs change)
  const { keywords, matchAgainstOutput, matchAgainstResume } = useMemo(() => {
    const kws = extractKeywords(jd);
    return {
      keywords: kws,
      matchAgainstOutput: scoreMatch(output || resume, kws),
      matchAgainstResume: scoreMatch(resume, kws),
    };
  }, [jd, resume, output]);

  const activeMatch: MatchResult = output ? matchAgainstOutput : matchAgainstResume;

  async function generate() {
    if (!resume.trim()) return setStatus({ kind: "err", text: "Please paste your resume." });
    if (!jd.trim()) return setStatus({ kind: "err", text: "Please paste the job description." });

    setLoading(true);
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
  }

  async function copyOutput() {
    if (!output) return setStatus({ kind: "err", text: "Nothing to copy yet." });
    await navigator.clipboard.writeText(output);
    setStatus({ kind: "ok", text: "Copied to clipboard." });
  }

  async function downloadTxt() {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    const { saveAs } = await import("file-saver");
    const blob = new Blob([output], { type: "text/plain" });
    saveAs(blob, "tailored-resume.txt");
  }

  async function downloadDocx() {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");
    const { saveAs } = await import("file-saver");

    const children: DocxParagraph[] = [];
    for (const row of parseResumeOutputLines(output)) {
      if (row.kind === "blank") {
        children.push(new Paragraph({ children: [new TextRun("")] }));
        continue;
      }
      if (row.kind === "title") {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: row.text, bold: true, size: 32 })],
          })
        );
        continue;
      }
      if (row.kind === "section") {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [new TextRun({ text: row.text.toUpperCase(), bold: true, size: 26 })],
          })
        );
        continue;
      }
      if (row.kind === "bullet") {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: row.text, size: 22 })],
          })
        );
        continue;
      }
      children.push(new Paragraph({ children: [new TextRun({ text: row.text, size: 22 })] }));
    }

    const doc = new Document({
      styles: { default: { document: { run: { font: "Calibri" } } } },
      sections: [
        {
          properties: {
            page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "tailored-resume.docx");
    setStatus({ kind: "ok", text: "Downloaded tailored-resume.docx" });
  }

  async function downloadPdf() {
    if (!output) return setStatus({ kind: "err", text: "Generate a resume first." });
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const marginX = 54;
    const marginY = 54;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const maxW = pageW - marginX * 2;
    let y = marginY;
    const lineH = 14;

    doc.setFont("helvetica", "normal");

    const writeLine = (
      text: string,
      opts: { center?: boolean; lineH?: number } = {}
    ) => {
      const wrapped = doc.splitTextToSize(text, maxW);
      (wrapped as string[]).forEach((w) => {
        if (y + lineH > pageH - marginY) {
          doc.addPage();
          y = marginY;
        }
        if (opts.center) doc.text(w, pageW / 2, y, { align: "center" });
        else doc.text(w, marginX, y);
        y += opts.lineH || lineH;
      });
    };

    for (const row of parseResumeOutputLines(output)) {
      if (row.kind === "blank") {
        y += lineH / 2;
        continue;
      }
      if (row.kind === "title") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        writeLine(row.text, { center: true, lineH: 22 });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        continue;
      }
      if (row.kind === "section") {
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        writeLine(row.text.toUpperCase());
        if (y - 12 < pageH - marginY) {
          doc.line(marginX, y - 10, pageW - marginX, y - 10);
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        continue;
      }
      if (row.kind === "bullet") {
        writeLine("• " + row.text);
        continue;
      }
      writeLine(row.text);
    }

    doc.save("tailored-resume.pdf");
    setStatus({ kind: "ok", text: "Downloaded tailored-resume.pdf" });
  }

  const scoreHint = (() => {
    const pct = activeMatch.pct;
    if (keywords.length === 0) return "Paste a job description to see matched keywords.";
    if (pct >= 80) return "Excellent match — your resume is well-aligned to this job.";
    if (pct >= 60) return "Good match — a few keywords could still be strengthened.";
    if (pct >= 40) return "Moderate match — weave in more of the missing keywords.";
    return "Low match — generate a tailored resume to improve your score.";
  })();

  return (
    <main className="max-w-[1400px] mx-auto px-8 pb-12">
      <header className="py-7 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold group-hover:opacity-80 transition">
            JS
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            JobSuit
          </div>
        </Link>
        <div className="text-sm text-slate-400">
          Tailor your resume to any job description — optimized for ATS
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="space-y-5">
          <Card>
            <SectionTitle num={1}>Your current resume</SectionTitle>
            <Label>Paste your resume as plain text</Label>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder={"Jane Doe\njane@example.com | 555-1234\n\nSUMMARY\n…\n\nEXPERIENCE\n…"}
            />
            <Hint>Include everything — summary, experience, skills, education. Claude will trim and reorder.</Hint>
          </Card>

          <Card>
            <SectionTitle num={2}>Target job description</SectionTitle>
            <Label>Paste the full job description</Label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Senior Software Engineer at Acme Corp…"
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <Label>Tone</Label>
                <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Target length</Label>
                <Select value={pages} onChange={(e) => setPages(e.target.value)}>
                  {PAGES_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          <Card>
            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-base disabled:opacity-60 disabled:cursor-wait active:translate-y-px transition"
            >
              {loading ? (
                <span>
                  <span className="spinner" /> Generating…
                </span>
              ) : (
                "✨ Generate ATS-optimized resume"
              )}
            </button>
            {status && (
              <div
                className={
                  "mt-3 text-sm px-3 py-2.5 rounded-lg border " +
                  (status.kind === "ok"
                    ? "bg-green-500/10 border-green-500/40 text-green-300"
                    : status.kind === "err"
                    ? "bg-red-500/10 border-red-500/40 text-red-300"
                    : "bg-indigo-500/10 border-indigo-500/40 text-indigo-200")
                }
              >
                {status.text}
              </div>
            )}
          </Card>
        </section>

        <section className="space-y-5">
          <Card>
            <SectionTitle num={3}>ATS match analysis</SectionTitle>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">Keyword match score</span>
                <span className="text-3xl font-bold">
                  {keywords.length === 0 ? "—" : `${activeMatch.pct}%`}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${keywords.length === 0 ? 0 : activeMatch.pct}%`,
                    background:
                      "linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)",
                  }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-2">{scoreHint}</div>
            </div>

            <details open>
              <summary className="cursor-pointer text-sm text-slate-400 select-none">
                Keywords from the job description ({keywords.length})
              </summary>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {keywords.length === 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                    Paste a job description to extract keywords
                  </span>
                )}
                {activeMatch.matched.map((k) => (
                  <span
                    key={"m-" + k}
                    className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/40 text-green-300"
                  >
                    ✓ {k}
                  </span>
                ))}
                {activeMatch.missing.map((k) => (
                  <span
                    key={"x-" + k}
                    className="text-xs px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300"
                  >
                    ✗ {k}
                  </span>
                ))}
              </div>
            </details>
          </Card>

          <Card>
            <SectionTitle num={4}>Your tailored resume</SectionTitle>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-[600px] min-h-[200px] overflow-y-auto whitespace-pre-wrap font-mono text-[13px] leading-6">
              {output || (
                <span className="italic text-slate-500">
                  Your tailored ATS-ready resume will appear here…
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              <GhostButton onClick={copyOutput}>📋 Copy</GhostButton>
              <GhostButton onClick={downloadDocx}>📄 .docx</GhostButton>
              <GhostButton onClick={downloadPdf}>📕 PDF</GhostButton>
              <GhostButton onClick={downloadTxt}>📝 .txt</GhostButton>
            </div>
          </Card>
        </section>
      </div>

      <footer className="text-center text-slate-500 text-xs py-5">
        JobSuit · powered by Claude · your data is sent only to your server
      </footer>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg shadow-black/20">
      {children}
    </div>
  );
}

function SectionTitle({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-xs font-bold">
        {num}
      </span>
      {children}
    </h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] text-slate-400 mb-1.5">{children}</label>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-slate-500 mt-1.5">{children}</div>;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm min-h-[140px] resize-y focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
    />
  );
}

function GhostButton({
  onClick,
  children,
}: {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium hover:bg-slate-800 active:translate-y-px transition"
    >
      {children}
    </button>
  );
}
