import { useEffect } from "react";
import { STORAGE_KEY } from "./constants";

export function useTailorPersistence(
  resume: string,
  jd: string,
  tone: string,
  pages: string,
  setResume: (v: string) => void,
  setJd: (v: string) => void,
  setTone: (v: string) => void,
  setPages: (v: string) => void
) {
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
  }, [setResume, setJd, setTone, setPages]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ resume, jd, tone, pages }));
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [resume, jd, tone, pages]);
}
