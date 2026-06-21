import { LandingCta } from "./LandingCta";
import { LandingFeatures } from "./LandingFeatures";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingNav } from "./LandingNav";
import { HowItWorks } from "./HowItWorks";

const TRUST = ["Runs fully offline", "No account needed", "Free and open source"];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <LandingHero />

      <div className="border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto w-full px-6 py-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-2 text-sm font-medium text-zinc-500">
          {TRUST.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <LandingFeatures />
      <HowItWorks />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
