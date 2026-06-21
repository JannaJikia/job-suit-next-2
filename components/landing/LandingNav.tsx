import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-[#fafafa]/80 dark:bg-[#09090b]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            JobSuit
          </span>
        </div>
        <Link
          href="/tailor"
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition"
        >
          Tailor my resume
        </Link>
      </div>
    </nav>
  );
}
