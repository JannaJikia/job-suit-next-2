// Phrase replacements (checked first, longest phrases win) then single-word swaps.
export const WEAK_PHRASE_MAP: Record<string, string> = {
  "responsible for managing": "Led",
  "responsible for leading": "Led",
  "responsible for": "Owned",
  "worked on": "Built",
  "helped with": "Supported",
  "in charge of": "Directed",
  "tasked with": "Drove",
};

export const WEAK_VERB_MAP: Record<string, string> = {
  managed: "Led",
  made: "Built",
  did: "Executed",
  used: "Leveraged",
  handled: "Managed",
  created: "Built",
  helped: "Supported",
  worked: "Built",
};

export const STRONG_VERBS = new Set([
  "led",
  "built",
  "designed",
  "launched",
  "drove",
  "owned",
  "delivered",
  "improved",
  "reduced",
  "increased",
  "architected",
  "shipped",
  "scaled",
  "automated",
  "directed",
]);
