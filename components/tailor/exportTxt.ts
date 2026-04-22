export async function exportTailoredTxt(output: string): Promise<void> {
  const { saveAs } = await import("file-saver");
  const blob = new Blob([output], { type: "text/plain" });
  saveAs(blob, "tailored-resume.txt");
}
