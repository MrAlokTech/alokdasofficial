import { PdfExportOptions } from "./types";
import { loadImage } from "./canvas-utils";

// Standard ISO A4 and US Letter points (72 points per inch)
const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612.0, height: 792.0 },
};

export interface ImageToPdfItem {
  blobOrUrl: Blob | string;
  width?: number;
  height?: number;
  title?: string;
}

/**
 * Export a list of images into a single client-side PDF document.
 */
export async function exportImagesToPdf(
  items: ImageToPdfItem[],
  options: PdfExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  if (items.length === 0) {
    throw new Error("No images provided for PDF generation.");
  }

  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();

  // Set standard margins
  const marginPt =
    options.margin === "none" ? 0 : options.margin === "small" ? 20 : 36;

  for (let i = 0; i < items.length; i++) {
    onProgress?.(i + 1, items.length);
    const item = items[i];

    // Load image element to inspect natural dimensions and convert to JPEG/PNG bytes
    let imgElement: HTMLImageElement;
    if (typeof item.blobOrUrl === "string") {
      imgElement = await loadImage(item.blobOrUrl);
    } else {
      imgElement = await loadImage(item.blobOrUrl);
    }

    const imgWidth = imgElement.naturalWidth || item.width || 800;
    const imgHeight = imgElement.naturalHeight || item.height || 600;

    // Render image to canvas to ensure standard JPEG bytes (compatible with pdf-lib)
    const canvas = document.createElement("canvas");
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to create canvas context for PDF export");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, imgWidth, imgHeight);
    ctx.drawImage(imgElement, 0, 0);

    const quality = Math.min(1.0, Math.max(0.4, options.imageQuality / 100));
    const jpgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
        "image/jpeg",
        quality
      );
    });

    const jpgBytes = await jpgBlob.arrayBuffer();
    const embeddedImg = await pdfDoc.embedJpg(jpgBytes);

    // Calculate Page and Image bounds
    let pageW: number;
    let pageH: number;

    if (options.pageSize === "fit") {
      // Fit page to exact image aspect ratio (scaled to sensible dimensions)
      pageW = imgWidth * 0.75 + marginPt * 2;
      pageH = imgHeight * 0.75 + marginPt * 2;
    } else {
      const base = PAGE_SIZES[options.pageSize] || PAGE_SIZES.a4;
      const isLandscape =
        options.orientation === "landscape" ||
        (options.orientation === "auto" && imgWidth > imgHeight);

      pageW = isLandscape ? base.height : base.width;
      pageH = isLandscape ? base.width : base.height;
    }

    // Usable printable area inside margins
    const printableW = Math.max(1, pageW - marginPt * 2);
    const printableH = Math.max(1, pageH - marginPt * 2);

    // Scale image maintaining aspect ratio within printable area
    const scale = Math.min(printableW / imgWidth, printableH / imgHeight);
    const drawW = imgWidth * scale;
    const drawH = imgHeight * scale;

    // Center image on page
    const drawX = marginPt + (printableW - drawW) / 2;
    const drawY = marginPt + (printableH - drawH) / 2;

    const page = pdfDoc.addPage([pageW, pageH]);
    page.drawImage(embeddedImg, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
}
