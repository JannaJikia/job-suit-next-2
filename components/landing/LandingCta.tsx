import Link from "next/link";

export function LandingCta() {
  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-24">
      <div className="rounded-3xl bg-zinc-900 dark:bg-zinc-800 px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Ready to get more interviews?
        </h2>
        <p className="mt-3 text-zinc-300 max-w-md mx-auto">
          It takes less than a minute. Paste, tailor, download.
        </p>
        <Link
          href="/tailor"
          className="mt-8 inline-block px-8 py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-base active:translate-y-px transition"
        >
          Tailor my resume
        </Link>
      </div>
    </section>
  );
}
