import { Card, Hint, Label, SectionTitle, Textarea } from "./ui";

type Props = {
  resume: string;
  onResumeChange: (v: string) => void;
};

export function ResumeCard({ resume, onResumeChange }: Props) {
  return (
    <Card>
      <SectionTitle num={1}>Your current resume</SectionTitle>
      <Label>Paste your resume as plain text</Label>
      <Textarea
        value={resume}
        onChange={(e) => onResumeChange(e.target.value)}
        placeholder={"Jane Doe\njane@example.com | 555-1234\n\nSUMMARY\n…\n\nEXPERIENCE\n…"}
      />
      <Hint>Include everything — summary, experience, skills, education. Claude will trim and reorder.</Hint>
    </Card>
  );
}
