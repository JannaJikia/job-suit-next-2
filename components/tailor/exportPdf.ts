import { parseResumeOutputLines } from "@/lib/parseResumeOutput";

export async function exportTailoredPdf(output: string): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const marginX = 54;
  const marginY = 54;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - marginX * 2;
  let y = marginY;
  const lineH = 14;

  doc.setFont("helvetica", "normal");

  const writeLine = (text: string, opts: { center?: boolean; lineH?: number } = {}) => {
    const wrapped = doc.splitTextToSize(text, maxW);
    (wrapped as string[]).forEach((w) => {
      if (y + lineH > pageH - marginY) {
        doc.addPage();
        y = marginY;
      }
      if (opts.center) doc.text(w, pageW / 2, y, { align: "center" });
      else doc.text(w, marginX, y);
      y += opts.lineH || lineH;
    });
  };

  for (const row of parseResumeOutputLines(output)) {
    if (row.kind === "blank") {
      y += lineH / 2;
      continue;
    }
    if (row.kind === "title") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      writeLine(row.text, { center: true, lineH: 22 });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      continue;
    }
    if (row.kind === "section") {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      writeLine(row.text.toUpperCase());
      if (y - 12 < pageH - marginY) {
        doc.line(marginX, y - 10, pageW - marginX, y - 10);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      continue;
    }
    if (row.kind === "bullet") {
      writeLine("• " + row.text);
      continue;
    }
    writeLine(row.text);
  }

  doc.save("tailored-resume.pdf");
}
