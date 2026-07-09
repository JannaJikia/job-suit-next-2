import { toResumeDoc } from "@/lib/tailor/resumeDoc";

/**
 * Export the tailored resume as a styled PDF in the "Classic professional"
 * layout: centered name, muted contact line, small-caps section headings with
 * an underline rule, bold entry headers, and hanging-indent bullets. Single
 * column, ATS-safe Helvetica, 0.75in margins, with pagination.
 */
export async function exportTailoredPdf(output: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const resume = toResumeDoc(output);

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginX = 54; // 0.75in
  const marginY = 54;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - marginX * 2;
  let y = marginY;

  const ensure = (h: number) => {
    if (y + h > pageH - marginY) {
      doc.addPage();
      y = marginY;
    }
  };

  const para = (
    text: string,
    opts: {
      size?: number;
      style?: "normal" | "bold";
      center?: boolean;
      color?: [number, number, number];
      indent?: number;
      hanging?: string;
      gap?: number;
    } = {}
  ) => {
    const size = opts.size ?? 10;
    const lineH = size * 1.32;
    const [r, g, b] = opts.color ?? [30, 30, 30];
    const indent = opts.indent ?? 0;
    const prefix = opts.hanging ?? "";

    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(size);
    doc.setTextColor(r, g, b);

    const prefixW = prefix ? doc.getTextWidth(prefix) : 0;
    const wrapped = doc.splitTextToSize(text, maxW - indent - prefixW) as string[];
    wrapped.forEach((line, i) => {
      ensure(lineH);
      const x = marginX + indent;
      if (opts.center) {
        doc.text(line, pageW / 2, y, { align: "center" });
      } else if (prefix) {
        if (i === 0) doc.text(prefix, x, y);
        doc.text(line, x + prefixW, y);
      } else {
        doc.text(line, x, y);
      }
      y += lineH;
    });
    if (opts.gap) y += opts.gap;
  };

  if (resume.title) para(resume.title, { size: 17, style: "bold", center: true, gap: 2 });
  if (resume.contactLine) para(resume.contactLine, { size: 9, center: true, color: [90, 90, 90] });
  resume.intro.forEach((line) => para(line, { size: 10, center: true, color: [60, 60, 60] }));

  for (const section of resume.sections) {
    y += 10;
    ensure(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(section.name.toUpperCase(), marginX, y);
    y += 4;
    doc.setDrawColor(170, 170, 170);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, pageW - marginX, y);
    y += 13;

    for (const entry of section.entries) {
      if (entry.header) para(entry.header, { size: 10.5, style: "bold", gap: 1 });
      entry.body.forEach((line) => para(line, { size: 10, color: [60, 60, 60] }));
      entry.bullets.forEach((b) => para(b, { size: 10, indent: 12, hanging: "•  " }));
      y += 4;
    }
  }

  doc.save("tailored-resume.pdf");
}
