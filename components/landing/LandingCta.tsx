import Link from "next/link";

export function LandingCta() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to get more interviews?</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        It takes less than a minute. Paste, generate, download.
      </p>
      <Link
        href="/tailor"
        className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-[.98] transition"
      >
        Start tailoring →
      </Link>
    </section>
  );
}
