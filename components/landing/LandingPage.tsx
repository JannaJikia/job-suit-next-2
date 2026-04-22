import { LandingCta } from "./LandingCta";
import { LandingFeatures } from "./LandingFeatures";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";
import { LandingNav } from "./LandingNav";
import { HowItWorks } from "./HowItWorks";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <HowItWorks />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
