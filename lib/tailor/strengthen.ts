import { WEAK_PHRASE_MAP, WEAK_VERB_MAP } from "./verbs";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function strengthenBullet(bullet: string): { text: string; changed: boolean } {
  let text = bullet.trim();
  const original = text;
  const lower = text.toLowerCase();

  // 1. phrase replacement at start (longest match first)
  const phrases = Object.keys(WEAK_PHRASE_MAP).sort((a, b) => b.length - a.length);
  for (const p of phrases) {
    if (lower.startsWith(p)) {
      text = WEAK_PHRASE_MAP[p] + text.slice(p.length);
      return { text: cap(text.trim()), changed: true };
    }
  }

  // 2. single weak lead verb — slice by the ORIGINAL token length so trailing
  // punctuation on the first word doesn't shift the cut point.
  const token = text.split(/\s+/)[0];
  const key = token.toLowerCase().replace(/[^a-z]/g, "");
  if (WEAK_VERB_MAP[key]) {
    text = WEAK_VERB_MAP[key] + text.slice(token.length);
  }
  text = cap(text);
  return { text, changed: text !== original };
}
