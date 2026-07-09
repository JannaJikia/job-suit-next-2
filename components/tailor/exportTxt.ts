export async function exportTailoredTxt(output: string): Promise<void> {
  const fileSaver = await import("file-saver");
  const saveAs = fileSaver.saveAs ?? fileSaver.default;
  const blob = new Blob([output], { type: "text/plain" });
  saveAs(blob, "tailored-resume.txt");
}
