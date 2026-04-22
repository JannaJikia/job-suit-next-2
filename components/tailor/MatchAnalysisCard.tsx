import type { MatchResult } from "@/lib/keywords";
import { scoreHintText } from "./scoreHint";
import { Card, SectionTitle } from "./ui";

type Props = {
  keywords: string[];
  activeMatch: MatchResult;
};

export function MatchAnalysisCard({ keywords, activeMatch }: Props) {
  const hint = scoreHintText(keywords.length, activeMatch.pct);

  return (
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
              background: "linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)",
            }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-2">{hint}</div>
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
  );
}
