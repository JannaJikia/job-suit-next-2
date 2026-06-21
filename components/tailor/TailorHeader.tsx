import Link from "next/link";

export function TailorHeader() {
  return (
    <header className="py-6 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-lg bg-accent grid place-items-center text-white font-bold text-sm group-hover:bg-accent-hover transition">
          JS
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          JobSuit
        </span>
      </Link>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Tailor your resume to any job description, optimized for ATS
      </p>
    </header>
  );
}
