import Link from "next/link";

export function TailorHeader() {
  return (
    <header className="py-7 flex items-center justify-between flex-wrap gap-3">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold group-hover:opacity-80 transition">
          JS
        </div>
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          JobSuit
        </div>
      </Link>
      <div className="text-sm text-slate-400">
        Tailor your resume to any job description — optimized for ATS
      </div>
    </header>
  );
}
