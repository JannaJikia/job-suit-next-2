export interface Entry {
  header?: string;
  bullets: string[];
  body: string[];
}

export interface Section {
  name: string;
  entries: Entry[];
}

export interface ParsedResume {
  title: string;
  contact: string[];
  preamble: string[];
  sections: Section[];
}
