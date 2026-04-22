import ResumeTailorApp from "@/components/ResumeTailorApp";

export const metadata = {
  title: "Tailor My Resume — JobSuit",
  description: "Paste your resume and job description. Claude rewrites it to pass ATS and land interviews.",
};

export default function TailorPage() {
  return <ResumeTailorApp />;
}
