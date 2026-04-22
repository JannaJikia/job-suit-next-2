import { FeatureCard } from "./FeatureCard";

export function LandingFeatures() {
  return (
    <section className="max-w-5xl mx-auto w-full px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-5">
      <FeatureCard
        icon="🎯"
        title="ATS keyword match"
        body="Instantly see which keywords from the job description are — and aren't — in your resume. Live score updates as you edit."
      />
      <FeatureCard
        icon="✍️"
        title="Claude rewrites your bullets"
        body="Every bullet point is rewritten using the STAR pattern: action verb, what you did, and quantified impact. Factual content is preserved."
      />
      <FeatureCard
        icon="📄"
        title="Download in any format"
        body="Export your polished resume as a .docx, PDF, or plain .txt — ready to attach to any application in seconds."
      />
    </section>
  );
}
