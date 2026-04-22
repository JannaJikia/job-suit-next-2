import { TONE_OPTIONS, PAGES_OPTIONS } from "./constants";
import { Card, Label, SectionTitle, Select, Textarea } from "./ui";

type Props = {
  jd: string;
  tone: string;
  pages: string;
  onJdChange: (v: string) => void;
  onToneChange: (v: string) => void;
  onPagesChange: (v: string) => void;
};

export function JobDescriptionCard({ jd, tone, pages, onJdChange, onToneChange, onPagesChange }: Props) {
  return (
    <Card>
      <SectionTitle num={2}>Target job description</SectionTitle>
      <Label>Paste the full job description</Label>
      <Textarea
        value={jd}
        onChange={(e) => onJdChange(e.target.value)}
        placeholder="Senior Software Engineer at Acme Corp…"
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <Label>Tone</Label>
          <Select value={tone} onChange={(e) => onToneChange(e.target.value)}>
            {TONE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Target length</Label>
          <Select value={pages} onChange={(e) => onPagesChange(e.target.value)}>
            {PAGES_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Card>
  );
}
