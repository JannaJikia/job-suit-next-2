import { Card, GhostButton, SectionTitle } from "./ui";

type Props = {
  output: string;
  onCopy: () => void | Promise<void>;
  onDocx: () => void | Promise<void>;
  onPdf: () => void | Promise<void>;
  onTxt: () => void | Promise<void>;
};

export function OutputCard({ output, onCopy, onDocx, onPdf, onTxt }: Props) {
  return (
    <Card>
      <SectionTitle num={6}>Your tailored resume</SectionTitle>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-4 max-h-[600px] min-h-[200px] overflow-y-auto whitespace-pre-wrap font-mono text-[13px] leading-6 text-zinc-800 dark:text-zinc-200">
        {output || (
          <span className="italic text-zinc-400 dark:text-zinc-600">
            Your tailored ATS-ready resume will appear here…
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        <GhostButton onClick={onCopy}>Copy</GhostButton>
        <GhostButton onClick={onDocx}>.docx</GhostButton>
        <GhostButton onClick={onPdf}>PDF</GhostButton>
        <GhostButton onClick={onTxt}>.txt</GhostButton>
      </div>
    </Card>
  );
}
