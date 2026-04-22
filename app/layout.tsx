import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobSuit — ATS Resume Tailor",
  description: "Tailor your resume to any job description with Claude. ATS-optimized DOCX and PDF output.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
