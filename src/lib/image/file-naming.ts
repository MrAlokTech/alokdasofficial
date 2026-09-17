/**
 * Centralized filename generator for the Client-Side Image Studio.
 * Strict naming convention: imagetoolused_actual_file_name_alokdasofficial.in
 */

export function sanitizeFileName(name: string): string {
  // Strip extension and replace spaces/special characters with underscores or hyphens
  const base = name.replace(/\.[^/.]+$/, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "") || "image"
  );
}

export function generateOutputFileName(
  tool: string,
  originalFileName: string,
  extension: string
): string {
  const cleanName = sanitizeFileName(originalFileName);
  const ext = extension.replace(/^\./, "").toLowerCase();
  const cleanTool = tool.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Format: imagetoolused_actual_file_name_alokdasofficial.in.ext
  return `${cleanTool}_${cleanName}_alokdasofficial.in.${ext}`;
}

export function generateZipFileName(tool: string = "image"): string {
  const cleanTool = tool.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `bulk_${cleanTool}_alokdasofficial.in.zip`;
}

export function generatePdfFileName(customTitle?: string): string {
  if (customTitle) {
    const clean = sanitizeFileName(customTitle);
    return `images_to_pdf_${clean}_alokdasofficial.in.pdf`;
  }
  return `images_to_pdf_alokdasofficial.in.pdf`;
}
