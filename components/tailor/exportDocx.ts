import type { Paragraph as DocxParagraph } from "docx";
import { toResumeDoc } from "@/lib/tailor/resumeDoc";

/**
 * Export the tailored resume as a styled .docx in the "Classic professional"
 * layout: centered name, muted contact line, small-caps section headings with
 * a bottom rule, bold entry headers, and disc bullets. Single column, ATS-safe
 * Calibri, 0.6–0.75in margins. Sizes are half-points (e.g. 22 = 11pt).
 */
export async function exportTailoredDocx(output: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = await import("docx");
  const fileSaver = await import("file-saver");
  const saveAs = fileSaver.saveAs ?? fileSaver.default;

  const resume = toResumeDoc(output);
  const children: DocxParagraph[] = [];

  if (resume.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: resume.title, bold: true, size: 34 })],
      })
    );
  }

  if (resume.contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: resume.intro.length ? 40 : 60 },
        children: [new TextRun({ text: resume.contactLine, size: 18, color: "555555" })],
      })
    );
  }

  resume.intro.forEach((line, i) => {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: i === resume.intro.length - 1 ? 60 : 20 },
        children: [new TextRun({ text: line, size: 20, color: "333333" })],
      })
    );
  });

  for (const section of resume.sections) {
    children.push(
      new Paragraph({
        spacing: { before: 220, after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "AAAAAA", space: 1 } },
        children: [new TextRun({ text: section.name.toUpperCase(), bold: true, size: 24 })],
      })
    );
    for (const entry of section.entries) {
      if (entry.header) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [new TextRun({ text: entry.header, bold: true, size: 22 })],
          })
        );
      }
      entry.body.forEach((line) =>
        children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22, color: "333333" })] }))
      );
      entry.bullets.forEach((b) =>
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: b, size: 22 })],
          })
        )
      );
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 900, bottom: 900, left: 1080, right: 1080 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "tailored-resume.docx");
}
