/**
 * PDF Page Geometry & Aspect Ratio Normalization Utilities
 * Points (pt) are standard 1/72 inch units used in PDFs.
 */

export interface PageDimension {
  width: number;
  height: number;
  name: string;
}

export const PAGE_FORMATS = {
  A4: { width: 595.28, height: 841.89, name: "ISO A4 (210 x 297 mm)" },
  LETTER: { width: 612.0, height: 792.0, name: "US Letter (8.5 x 11 in)" },
  LEGAL: { width: 612.0, height: 1008.0, name: "US Legal (8.5 x 14 in)" },
  A3: { width: 841.89, height: 1190.55, name: "ISO A3 (297 x 420 mm)" },
  A5: { width: 419.53, height: 595.28, name: "ISO A5 (148 x 210 mm)" },
};

export type PageFormatKey = keyof typeof PAGE_FORMATS | "AUTO_FIT" | "ORIGINAL";

/**
 * Calculate the optimal target page size and image draw rect based on image dimensions and chosen format.
 */
export function calculatePageLayout(
  imgWidth: number,
  imgHeight: number,
  format: PageFormatKey = "AUTO_FIT",
  margin = 20
): {
  pageWidth: number;
  pageHeight: number;
  imgX: number;
  imgY: number;
  drawWidth: number;
  drawHeight: number;
} {
  const isLandscape = imgWidth > imgHeight;

  if (format === "ORIGINAL") {
    // 1:1 image points
    return {
      pageWidth: imgWidth,
      pageHeight: imgHeight,
      imgX: 0,
      imgY: 0,
      drawWidth: imgWidth,
      drawHeight: imgHeight,
    };
  }

  // Base standard template (default A4)
  let standard = PAGE_FORMATS.A4;
  if (format in PAGE_FORMATS) {
    standard = PAGE_FORMATS[format as keyof typeof PAGE_FORMATS];
  }

  let baseWidth = standard.width;
  let baseHeight = standard.height;

  // Auto-rotate page to match image orientation
  if (isLandscape && baseHeight > baseWidth) {
    [baseWidth, baseHeight] = [baseHeight, baseWidth];
  } else if (!isLandscape && baseWidth > baseHeight) {
    [baseWidth, baseHeight] = [baseHeight, baseWidth];
  }

  const availWidth = Math.max(10, baseWidth - margin * 2);
  const availHeight = Math.max(10, baseHeight - margin * 2);

  const imgAspect = imgWidth / imgHeight;
  const availAspect = availWidth / availHeight;

  let drawWidth = availWidth;
  let drawHeight = availHeight;

  if (imgAspect > availAspect) {
    // Image is wider than available slot
    drawWidth = availWidth;
    drawHeight = availWidth / imgAspect;
  } else {
    // Image is taller
    drawHeight = availHeight;
    drawWidth = availHeight * imgAspect;
  }

  const imgX = margin + (availWidth - drawWidth) / 2;
  const imgY = margin + (availHeight - drawHeight) / 2;

  return {
    pageWidth: baseWidth,
    pageHeight: baseHeight,
    imgX,
    imgY,
    drawWidth,
    drawHeight,
  };
}

/**
 * Format bytes into human readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format download filename with custom action prefix and the standard '_alokdasofficial.in' suffix.
 * Example: original 'invoice.pdf' with prefix 'signed' -> 'invoice_signed_alokdasofficial.in.pdf'
 * Example: original 'report.pdf' with prefix 'compressed' -> 'report_compressed_alokdasofficial.in.pdf'
 */
export function formatDownloadFileName(
  originalFileName: string,
  actionPrefix?: string,
  extension = "pdf"
): string {
  const cleanName = originalFileName.replace(/\.[^/.]+$/, "").trim() || "document";
  const ext = extension.startsWith(".") ? extension : `.${extension}`;
  if (actionPrefix) {
    return `${cleanName}_${actionPrefix}_alokdasofficial.in${ext}`;
  }
  return `${cleanName}_alokdasofficial.in${ext}`;
}
