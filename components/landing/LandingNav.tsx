import Link from "next/link";

export function LandingNav() {
  return (
    <nav className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white font-bold text-sm select-none">
          JS
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          JobSuit
        </span>
      </div>
      <Link
        href="/tailor"
        className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-700 transition"
      >
        Open App
      </Link>
    </nav>
  );
}
