import Link from "next/link";
import { Logo } from "@/components/Logo";

export function TailorHeader() {
  return (
    <header className="py-6 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-2.5 group">
        <Logo className="h-9 w-9 transition group-hover:opacity-90" />
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
