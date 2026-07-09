import type { MatchResult } from "@/lib/keywords";
import type { TailorReport } from "@/lib/tailor";
import { scoreHintText } from "./scoreHint";
import { Card } from "./ui";

type Props = {
  keywords: string[];
  activeMatch: MatchResult;
  report: TailorReport | null;
};

/**
 * The result stage's header: the ATS match score at a glance, the before→after
 * lift after tailoring, and a compact row of what the engine did. This is the
 * motivating "did it work?" surface, so it leads the result column.
 */
export function ResultScoreCard({ keywords, activeMatch, report }: Props) {
  const hasKeywords = keywords.length > 0;
  const hint = scoreHintText(keywords.length, activeMatch.pct);
  const lift = report ? report.matchAfter - report.matchBefore : 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
            ATS keyword match
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {hasKeywords ? `${activeMatch.pct}%` : "—"}
            </span>
            {report && lift > 0 && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400 tabular-nums">
                up from {report.matchBefore}%
              </span>
            )}
          </div>
        </div>
        {report && lift > 0 && (
          <span className="shrink-0 rounded-full bg-accent/10 text-accent dark:text-accent-soft text-xs font-semibold px-2.5 py-1 tabular-nums">
            +{lift} pts
          </span>
        )}
      </div>

      <div
        className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
        role="progressbar"
        aria-valuenow={hasKeywords ? activeMatch.pct : 0}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${hasKeywords ? activeMatch.pct : 0}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>

      {report && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Reordered" value={report.reorderedBullets} />
          <Stat label="Strengthened" value={report.strengthenedBullets} />
          <Stat label="Summary" value={report.generatedSummary ? "Added" : "—"} />
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2">
      <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 dark:text-zinc-500">{label}</div>
    </div>
  );
}
