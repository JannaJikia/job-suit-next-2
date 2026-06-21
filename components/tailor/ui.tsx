import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import type { TailorStatus } from "./types";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      {children}
    </div>
  );
}

export function SectionTitle({ num, children }: { num: number; children: ReactNode }) {
  return (
    <h2 className="text-base font-semibold flex items-center gap-2.5 mb-3 text-zinc-900 dark:text-zinc-100">
      <span className="w-6 h-6 rounded-full bg-accent/10 text-accent dark:text-accent-soft grid place-items-center text-xs font-bold">
        {num}
      </span>
      {children}
    </h2>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[13px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
      {children}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5">{children}</div>;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-[140px] resize-y focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition"
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition"
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
      className="px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:translate-y-px transition"
    >
      {children}
    </button>
  );
}

export function StatusBanner({ status }: { status: Exclude<TailorStatus, null> }) {
  const cls =
    status.kind === "ok"
      ? "bg-accent/10 border-accent/30 text-accent dark:text-accent-soft"
      : status.kind === "err"
        ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
        : "bg-zinc-500/10 border-zinc-400/30 text-zinc-600 dark:text-zinc-300";
  return <div className={"mt-3 text-sm px-3 py-2.5 rounded-lg border " + cls}>{status.text}</div>;
}
