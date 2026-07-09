import { Card, Label, SectionTitle, Textarea } from "./ui";

type Props = {
  jd: string;
  onJdChange: (v: string) => void;
};

export function JobDescriptionCard({ jd, onJdChange }: Props) {
  return (
    <Card>
      <SectionTitle num={2}>Target job description</SectionTitle>
      <Label>Paste the full job description</Label>
      <Textarea
        value={jd}
        onChange={(e) => onJdChange(e.target.value)}
        placeholder="Senior Software Engineer at Acme Corp…"
      />
    </Card>
  );
}
