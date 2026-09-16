/**
 * Client-Side Image Processing Filters for Document Scanning
 * Implements Magic Color (CamScanner style), Otsu-inspired B&W thresholding,
 * Grayscale, and Auto-contrast adjustments directly on HTML5 Canvas.
 */

export type ScannerFilterType = "original" | "magic" | "bw" | "grayscale" | "enhanced";

/**
 * Apply the selected scanner filter to an ImageData object in-place.
 */
export function applyScannerFilter(imageData: ImageData, filter: ScannerFilterType): ImageData {
  const data = imageData.data;
  const len = data.length;

  if (filter === "original") {
    return imageData;
  }

  if (filter === "grayscale") {
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    return imageData;
  }

  if (filter === "enhanced") {
    // Boost contrast and slight saturation
    const factor = 1.25; // 25% contrast increase
    for (let i = 0; i < len; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    return imageData;
  }

  if (filter === "magic") {
    // Magic Color (CamScanner style):
    // 1. Calculate min and max luminance for dynamic stretching
    // 2. Normalize paper background towards clean white while keeping ink/text dark
    let minLum = 255;
    let maxLum = 0;

    for (let i = 0; i < len; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    const range = Math.max(1, maxLum - minLum);
    // Lower threshold pushes near-whites directly to 255
    const whitePoint = minLum + range * 0.78;
    const blackPoint = minLum + range * 0.18;
    const span = Math.max(1, whitePoint - blackPoint);

    for (let i = 0; i < len; i += 4) {
      for (let c = 0; c < 3; c++) {
        const val = data[i + c];
        // Dynamic stretch with curve
        if (val >= whitePoint) {
          data[i + c] = 255;
        } else if (val <= blackPoint) {
          data[i + c] = Math.floor(val * 0.6); // enrich blacks
        } else {
          const norm = (val - blackPoint) / span;
          // Apply gamma curve (gamma > 1 brightens mids)
          const boosted = Math.pow(norm, 0.8) * 255;
          data[i + c] = Math.min(255, Math.max(0, Math.round(boosted)));
        }
      }
    }
    return imageData;
  }

  if (filter === "bw") {
    // Adaptive Otsu / Mean Binarization
    let sum = 0;
    for (let i = 0; i < len; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const mean = sum / (len / 4);
    const threshold = Math.max(90, Math.min(180, mean * 0.92));

    for (let i = 0; i < len; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const binary = lum >= threshold ? 255 : 0;
      data[i] = binary;
      data[i + 1] = binary;
      data[i + 2] = binary;
    }
    return imageData;
  }

  return imageData;
}

/**
 * Filter an HTMLImageElement or Canvas and return a data URL.
 */
export function filterImageToDataUrl(
  source: HTMLImageElement | HTMLCanvasElement,
  filter: ScannerFilterType,
  mimeType: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.92
): string {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.drawImage(source, 0, 0);
  if (filter !== "original") {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const filtered = applyScannerFilter(imgData, filter);
    ctx.putImageData(filtered, 0, 0);
  }

  return canvas.toDataURL(mimeType, quality);
}
