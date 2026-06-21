import type { ReactNode } from "react";

export function FeatureTile({
  title,
  body,
  className = "",
  tinted = false,
  children,
}: {
  title: string;
  body: string;
  className?: string;
  tinted?: boolean;
  children?: ReactNode;
}) {
  const base = tinted
    ? "bg-accent/[0.07] border-accent/20"
    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800";
  return (
    <div className={`rounded-2xl border ${base} p-6 flex flex-col ${className}`}>
      <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
      {children}
    </div>
  );
}
