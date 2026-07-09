import type { MatchResult } from "@/lib/keywords";
import { Card, CardTitle } from "./ui";

type Props = {
  keywords: string[];
  activeMatch: MatchResult;
};

/**
 * Detail view of which job-description keywords the resume covers. The headline
 * score lives in ResultScoreCard; this card breaks it down term by term.
 */
export function MatchAnalysisCard({ keywords, activeMatch }: Props) {
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <CardTitle>Keyword coverage</CardTitle>
        {keywords.length > 0 && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
            {activeMatch.matched.length}/{keywords.length} matched
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
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
    </Card>
  );
}
