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
      <SectionTitle num={4}>Your tailored resume</SectionTitle>
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-[600px] min-h-[200px] overflow-y-auto whitespace-pre-wrap font-mono text-[13px] leading-6">
        {output || (
          <span className="italic text-slate-500">Your tailored ATS-ready resume will appear here…</span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap mt-3">
        <GhostButton onClick={onCopy}>📋 Copy</GhostButton>
        <GhostButton onClick={onDocx}>📄 .docx</GhostButton>
        <GhostButton onClick={onPdf}>📕 PDF</GhostButton>
        <GhostButton onClick={onTxt}>📝 .txt</GhostButton>
      </div>
    </Card>
  );
}
