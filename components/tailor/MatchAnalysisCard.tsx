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
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Keyword match score</span>
          <span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {keywords.length === 0 ? "—" : `${activeMatch.pct}%`}
          </span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${keywords.length === 0 ? 0 : activeMatch.pct}%` }}
          />
        </div>
        <div className="text-xs text-zinc-500 mt-2">{hint}</div>
      </div>

      <details open>
        <summary className="cursor-pointer text-sm text-zinc-600 dark:text-zinc-400 select-none">
          Keywords from the job description ({keywords.length})
        </summary>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {keywords.length === 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500">
              Paste a job description to extract keywords
            </span>
          )}
          {activeMatch.matched.map((k) => (
            <span
              key={"m-" + k}
              className="text-xs px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent dark:text-accent-soft"
            >
              {k}
            </span>
          ))}
          {activeMatch.missing.map((k) => (
            <span
              key={"x-" + k}
              className="text-xs px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 line-through"
            >
              {k}
            </span>
          ))}
        </div>
      </details>
    </Card>
  );
}
