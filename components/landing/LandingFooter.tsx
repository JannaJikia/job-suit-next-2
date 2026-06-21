export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
        <span>JobSuit · offline resume tailoring. MIT license.</span>
        <a
          href="https://github.com/JannaJikia/job-suit-next-2"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 dark:hover:text-zinc-300 transition"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
