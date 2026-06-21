import type { TailorMode, TailorStatus } from "./types";
import { Card, StatusBanner } from "./ui";

type Props = {
  loading: boolean;
  status: TailorStatus;
  mode: TailorMode;
  onModeChange: (m: TailorMode) => void;
  onGenerate: () => void | Promise<void>;
};

const MODES: { value: TailorMode; label: string; hint: string }[] = [
  { value: "algorithm", label: "Algorithm", hint: "offline · no API key" },
  { value: "ai", label: "AI (Claude)", hint: "needs API key" },
];

export function GenerateCard({ loading, status, mode, onModeChange, onGenerate }: Props) {
  return (
    <Card>
      <div className="grid grid-cols-2 gap-1 p-1 mb-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onModeChange(m.value)}
            aria-pressed={mode === m.value}
            className={
              "rounded-md py-2 text-sm font-medium transition " +
              (mode === m.value
                ? "bg-accent text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100")
            }
          >
            {m.label}
            <span className="block text-[10px] font-normal opacity-80">{m.hint}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base disabled:opacity-60 disabled:cursor-wait active:translate-y-px transition"
      >
        {loading ? (
          <span>
            <span className="spinner" /> Generating…
          </span>
        ) : (
          "Tailor my resume"
        )}
      </button>
      {status && <StatusBanner status={status} />}
    </Card>
  );
}
