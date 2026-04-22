import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { TailorStatus } from "./types";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg shadow-black/20">
      {children}
    </div>
  );
}

export function SectionTitle({ num, children }: { num: number; children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-xs font-bold">
        {num}
      </span>
      {children}
    </h2>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-[13px] text-slate-400 mb-1.5">{children}</label>;
}

export function Hint({ children }: { children: ReactNode }) {
  return <div className="text-xs text-slate-500 mt-1.5">{children}</div>;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm min-h-[140px] resize-y focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
    />
  );
}

export function GhostButton({
  onClick,
  children,
}: {
  onClick: () => void | Promise<void>;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium hover:bg-slate-800 active:translate-y-px transition"
    >
      {children}
    </button>
  );
}

export function StatusBanner({ status }: { status: Exclude<TailorStatus, null> }) {
  const cls =
    status.kind === "ok"
      ? "bg-green-500/10 border-green-500/40 text-green-300"
      : status.kind === "err"
        ? "bg-red-500/10 border-red-500/40 text-red-300"
        : "bg-indigo-500/10 border-indigo-500/40 text-indigo-200";
  return <div className={"mt-3 text-sm px-3 py-2.5 rounded-lg border " + cls}>{status.text}</div>;
}
