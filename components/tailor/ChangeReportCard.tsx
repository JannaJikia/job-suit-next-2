import type { TailorReport } from "@/lib/tailor";
import { Card, SectionTitle } from "./ui";

export function ChangeReportCard({ report }: { report: TailorReport | null }) {
  if (!report) return null;
  return (
    <Card>
      <SectionTitle num={4}>What changed</SectionTitle>
      <ul className="text-sm space-y-1.5 text-zinc-600 dark:text-zinc-400">
        <li>
          Bullets reordered by relevance:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{report.reorderedBullets}</strong>
        </li>
        <li>
          Bullets strengthened:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">{report.strengthenedBullets}</strong>
        </li>
        <li>
          Summary generated:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            {report.generatedSummary ? "yes" : "no"}
          </strong>
        </li>
        <li>
          Keyword match:{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            {report.matchBefore}% → {report.matchAfter}%
          </strong>
        </li>
      </ul>
      {report.injectedKeywords.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Keywords added to Skills — review for accuracy:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {report.injectedKeywords.map((k) => (
              <span
                key={k}
                className="rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-xs"
              >
                {k}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Remove any in the output above that aren&apos;t true for you.
          </p>
        </div>
      )}
    </Card>
  );
}
