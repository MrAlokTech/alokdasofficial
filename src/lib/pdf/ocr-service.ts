/**
 * Client-Side OCR Service using Tesseract.js Web Worker
 * Extracts text and word bounding boxes directly in the browser
 */

export interface OcrWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OcrResult {
  text: string;
  confidence: number;
  words: OcrWord[];
}

export type OcrProgressCallback = (progress: number, status: string) => void;

/**
 * Perform OCR on an image file, Canvas, or Data URL
 */
export async function runOcr(
  imageSource: string | HTMLCanvasElement | File,
  language = "eng",
  onProgress?: OcrProgressCallback
): Promise<OcrResult> {
  if (typeof window === "undefined") {
    throw new Error("OCR can only run in the browser.");
  }

  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker(language, 1, {
    logger: (m) => {
      if (onProgress && m && typeof m.progress === "number") {
        onProgress(Math.round(m.progress * 100), m.status || "Processing");
      }
    },
  });

  try {
    const result = await worker.recognize(imageSource);
    const words: OcrWord[] = [];

    // Extract word-level bounding boxes if available
    const rawWords = (result.data as any).words || [];
    for (const w of rawWords) {
      if (w.text && w.bbox) {
        words.push({
          text: w.text,
          confidence: w.confidence,
          bbox: {
            x0: w.bbox.x0,
            y0: w.bbox.y0,
            x1: w.bbox.x1,
            y1: w.bbox.y1,
          },
        });
      }
    }

    return {
      text: result.data.text || "",
      confidence: result.data.confidence || 0,
      words,
    };
  } finally {
    await worker.terminate();
  }
}
