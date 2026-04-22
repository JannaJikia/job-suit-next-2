import type { Paragraph as DocxParagraph } from "docx";
import { parseResumeOutputLines } from "@/lib/parseResumeOutput";

export async function exportTailoredDocx(output: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx");
  const { saveAs } = await import("file-saver");

  const children: DocxParagraph[] = [];
  for (const row of parseResumeOutputLines(output)) {
    if (row.kind === "blank") {
      children.push(new Paragraph({ children: [new TextRun("")] }));
      continue;
    }
    if (row.kind === "title") {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: row.text, bold: true, size: 32 })],
        })
      );
      continue;
    }
    if (row.kind === "section") {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: row.text.toUpperCase(), bold: true, size: 26 })],
        })
      );
      continue;
    }
    if (row.kind === "bullet") {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: row.text, size: 22 })],
        })
      );
      continue;
    }
    children.push(new Paragraph({ children: [new TextRun({ text: row.text, size: 22 })] }));
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "tailored-resume.docx");
}
