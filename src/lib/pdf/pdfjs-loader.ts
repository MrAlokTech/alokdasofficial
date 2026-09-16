/**
 * Safe client-side loader for Mozilla PDF.js
 */

export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be loaded in the browser.");
  }

  const pdfjs = await import("pdfjs-dist");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // Use unpkg / cdnjs CDN for worker script matching exact version
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  return pdfjs;
}

/**
 * Render a single page of a PDF document to an HTML Canvas
 */
export async function renderPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale = 1.0,
  rotation = 0
): Promise<{ width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale, rotation });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas 2d context");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return { width: viewport.width, height: viewport.height };
}

/**
 * Extract low-res thumbnail data URL for a given page
 */
export async function renderPageThumbnail(
  pdfDoc: any,
  pageNumber: number,
  thumbWidth = 200,
  rotation = 0
): Promise<string> {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
  const scale = thumbWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale, rotation });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  return canvas.toDataURL("image/jpeg", 0.75);
}
