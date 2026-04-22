import { useMemo } from "react";
import { extractKeywords, scoreMatch, type MatchResult } from "@/lib/keywords";

export function useKeywordMatch(jd: string, resume: string, output: string) {
  return useMemo(() => {
    const keywords = extractKeywords(jd);
    const matchAgainstOutput = scoreMatch(output || resume, keywords);
    const matchAgainstResume = scoreMatch(resume, keywords);
    const activeMatch: MatchResult = output ? matchAgainstOutput : matchAgainstResume;
    return { keywords, activeMatch };
  }, [jd, resume, output]);
}
