import { useEffect } from "react";
import { STORAGE_KEY } from "./constants";

export function useTailorPersistence(
  resume: string,
  jd: string,
  setResume: (v: string) => void,
  setJd: (v: string) => void
) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (typeof s.resume === "string") setResume(s.resume);
      if (typeof s.jd === "string") setJd(s.jd);
    } catch {
      /* ignore */
    }
  }, [setResume, setJd]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ resume, jd }));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [resume, jd]);
}
