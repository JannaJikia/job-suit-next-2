import { Card, CardTitle, GhostButton } from "./ui";
import { ResumePreview } from "./ResumePreview";

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
      <CardTitle>Your tailored resume</CardTitle>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-6 max-h-[640px] min-h-[200px] overflow-y-auto">
        {output.trim() ? (
          <ResumePreview output={output} />
        ) : (
          <span className="block py-16 text-center italic text-zinc-400 dark:text-zinc-600">
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
