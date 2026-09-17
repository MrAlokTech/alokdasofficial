import JSZip from "jszip";
import { generateZipFileName } from "./file-naming";

export interface ZipEntry {
  fileName: string;
  blob: Blob;
}

/**
 * Creates and downloads a zip file from an array of blobs.
 */
export async function downloadAsZip(
  entries: ZipEntry[],
  toolName: string = "image"
): Promise<void> {
  if (entries.length === 0) return;

  const zip = new JSZip();

  for (const entry of entries) {
    zip.file(entry.fileName, entry.blob);
  }

  const content = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const zipFileName = generateZipFileName(toolName);
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
