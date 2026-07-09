import type { TailorStatus } from "./types";
import { Card, StatusBanner } from "./ui";

type Props = {
  status: TailorStatus;
  onGenerate: () => void | Promise<void>;
};

export function GenerateCard({ status, onGenerate }: Props) {
  return (
    <Card>
      <button
        type="button"
        onClick={onGenerate}
        className="w-full py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:active:scale-100"
      >
        Tailor my resume
      </button>
      <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-500">
        Runs entirely in your browser — no account, no API key.
      </p>
      {status && <StatusBanner status={status} />}
    </Card>
  );
}
