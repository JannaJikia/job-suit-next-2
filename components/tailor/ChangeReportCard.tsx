import type { TailorReport } from "@/lib/tailor";
import { Card, SectionTitle } from "./ui";

export function ChangeReportCard({ report }: { report: TailorReport | null }) {
  if (!report) return null;
  return (
    <Card>
      <SectionTitle num={5}>What changed</SectionTitle>
      <ul className="text-sm space-y-1.5 text-slate-300">
        <li>Bullets reordered by relevance: <strong>{report.reorderedBullets}</strong></li>
        <li>Bullets strengthened: <strong>{report.strengthenedBullets}</strong></li>
        <li>Summary generated: <strong>{report.generatedSummary ? "yes" : "no"}</strong></li>
        <li>
          Keyword match:{" "}
          <strong>
            {report.matchBefore}% → {report.matchAfter}%
          </strong>
        </li>
      </ul>
      {report.injectedKeywords.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-200">
            Keywords added to Skills — review for accuracy:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {report.injectedKeywords.map((k) => (
              <span
                key={k}
                className="rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-200 px-2 py-0.5 text-xs"
              >
                {k}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Remove any in the output above that aren&apos;t true for you.
          </p>
        </div>
      )}
    </Card>
  );
}
