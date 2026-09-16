/**
 * Client-Side PDF Compression Engine
 * Dynamically re-renders and re-encodes PDF pages with customizable DPI and JPEG quality,
 * yielding dramatic file size reductions 100% in-browser.
 */

import { getPdfJs } from "./pdfjs-loader";

export interface CompressionPreset {
  id: "extreme" | "recommended" | "low" | "custom";
  name: string;
  description: string;
  targetDpi: number;
  quality: number;
}

export const COMPRESSION_PRESETS: Record<string, CompressionPreset> = {
  extreme: {
    id: "extreme",
    name: "Extreme Compression",
    description: "Lowest file size (72 DPI, 50% quality). Best for email and online forms.",
    targetDpi: 72,
    quality: 0.5,
  },
  recommended: {
    id: "recommended",
    name: "Recommended",
    description: "Good quality and high compression (150 DPI, 72% quality). Best for viewing.",
    targetDpi: 150,
    quality: 0.72,
  },
  low: {
    id: "low",
    name: "Low Compression",
    description: "High quality (220 DPI, 85% quality). Best for high-res printing.",
    targetDpi: 220,
    quality: 0.85,
  },
};

export interface CompressionProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
}

export async function compressPdf(
  fileBuffer: ArrayBuffer,
  dpi = 150,
  quality = 0.72,
  onProgress?: (p: CompressionProgress) => void
): Promise<{
  compressedBytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}> {
  const originalSize = fileBuffer.byteLength;
  const pdfjs = await getPdfJs();
  const { PDFDocument } = await import("pdf-lib");

  const loadingTask = pdfjs.getDocument({ data: fileBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const newDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) {
      onProgress({
        currentPage: pageNum,
        totalPages,
        percentage: Math.round((pageNum / totalPages) * 100),
      });
    }

    const page = await pdfDoc.getPage(pageNum);
    // Standard PDF 1pt = 1/72 inch
    const scale = Math.max(0.5, Math.min(3.0, dpi / 72));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
    const imageBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());
    const embeddedImg = await newDoc.embedJpg(imageBytes);

    // Create page with original dimensions in points
    const originalViewport = page.getViewport({ scale: 1.0 });
    const newPage = newDoc.addPage([originalViewport.width, originalViewport.height]);

    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  const compressedBytes = await newDoc.save({ useObjectStreams: true });
  const compressedSize = compressedBytes.byteLength;
  const ratio = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

  return {
    compressedBytes,
    originalSize,
    compressedSize,
    ratio,
  };
}
