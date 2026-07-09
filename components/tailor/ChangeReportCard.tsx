import type { TailorReport } from "@/lib/tailor";
import { Card, CardTitle } from "./ui";

/**
 * Actionable follow-up after tailoring: the keywords the engine injected into
 * Skills, flagged so the user can remove anything untrue. The headline counts
 * (reordered / strengthened / summary) live in ResultScoreCard; this card is
 * only shown when there is something to review.
 */
export function ChangeReportCard({ report }: { report: TailorReport | null }) {
  if (!report || report.injectedKeywords.length === 0) return null;
  return (
    <Card>
      <CardTitle>Review added keywords</CardTitle>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        These were added to your Skills section to match the job description. Remove any in the
        resume above that aren&apos;t true for you.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {report.injectedKeywords.map((k) => (
          <span
            key={k}
            className="rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-xs"
          >
            {k}
          </span>
        ))}
      </div>
    </Card>
  );
}
