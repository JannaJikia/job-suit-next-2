import type { TailorStatus } from "./types";
import { Card, StatusBanner } from "./ui";

type Props = {
  loading: boolean;
  status: TailorStatus;
  onGenerate: () => void | Promise<void>;
};

export function GenerateCard({ loading, status, onGenerate }: Props) {
  return (
    <Card>
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-base disabled:opacity-60 disabled:cursor-wait active:translate-y-px transition"
      >
        {loading ? (
          <span>
            <span className="spinner" /> Generating…
          </span>
        ) : (
          "✨ Generate ATS-optimized resume"
        )}
      </button>
      {status && <StatusBanner status={status} />}
    </Card>
  );
}
