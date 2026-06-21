import Image from "next/image";
import Link from "next/link";

export function TailorHeader() {
  return (
    <header className="py-6 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-2.5 group">
        <Image
          src="/logo-mark.png"
          alt="JobSuit"
          width={36}
          height={36}
          className="rounded-lg transition group-hover:opacity-90"
          priority
        />
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
