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
      <div className="grid grid-cols-2 gap-1 p-1 mb-3 rounded-lg bg-slate-900 border border-slate-700">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onModeChange(m.value)}
            className={
              "rounded-md py-2 text-sm font-medium transition " +
              (mode === m.value
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                : "text-slate-400 hover:text-slate-200")
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
