import {
  loadImage,
  renderProcessedCanvas,
  canvasToBlob,
} from "./canvas-utils";
import { PerImageConfig, ImageFormat } from "./types";

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  finalQuality: number;
}

/**
 * Smart Dual-Mode Image Compressor:
 * 1. Manual Quality Slider (0.01 - 1.0)
 * 2. Binary-Search Target Size Matcher (MB to strict KB) with dimension stepping
 */
export async function compressImage(
  sourceImg: HTMLImageElement,
  config: PerImageConfig,
  onProgress?: (percent: number) => void
): Promise<CompressionResult> {
  const format: ImageFormat = config.targetFormat || "jpeg";

  // Case 1: Target File Size Mode (KB limit binary search)
  if (config.targetSizeKb && config.targetSizeKb > 0) {
    const targetBytes = config.targetSizeKb * 1024;
    return await compressToTargetSize(sourceImg, config, targetBytes, format, onProgress);
  }

  // Case 2: Manual Quality Mode
  onProgress?.(25);
  const canvas = await renderProcessedCanvas(sourceImg, config);
  onProgress?.(60);

  const quality = (config.quality || 80) / 100;
  const blob = await canvasToBlob(canvas, format, quality);
  onProgress?.(100);

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    sizeBytes: blob.size,
    finalQuality: quality,
  };
}

/**
 * Binary search for the highest quality that fits under targetBytes.
 * If image is too large even at minimum quality, incrementally downscales resolution.
 */
async function compressToTargetSize(
  sourceImg: HTMLImageElement,
  config: PerImageConfig,
  targetBytes: number,
  format: ImageFormat,
  onProgress?: (percent: number) => void
): Promise<CompressionResult> {
  let currentConfig: PerImageConfig = { ...config };
  let canvas = await renderProcessedCanvas(sourceImg, currentConfig);

  let low = 0.05;
  let high = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  const maxIterations = 7;

  for (let iter = 0; iter < maxIterations; iter++) {
    onProgress?.(Math.round(((iter + 1) / maxIterations) * 70));
    const mid = (low + high) / 2;
    const blob = await canvasToBlob(canvas, format, mid);

    if (blob.size <= targetBytes) {
      // It fits! Record as potential best, then try higher quality
      bestBlob = blob;
      bestQuality = mid;
      low = mid;
    } else {
      // Too large, try lower quality
      high = mid;
    }

    // Stop early if we are within 5% of target size
    if (bestBlob && bestBlob.size >= targetBytes * 0.92 && bestBlob.size <= targetBytes) {
      break;
    }
  }

  // If even at low quality (0.05) it is still larger than targetBytes,
  // we must downsample the resolution to achieve strict KB compliance!
  if (!bestBlob || bestBlob.size > targetBytes) {
    const currentSize = bestBlob ? bestBlob.size : (await canvasToBlob(canvas, format, 0.05)).size;
    // Scale factor based on area ratio with safety margin
    const scale = Math.min(0.9, Math.sqrt(targetBytes / currentSize) * 0.92);

    const downscaledW = Math.max(100, Math.round(canvas.width * scale));
    const downscaledH = Math.max(100, Math.round(canvas.height * scale));

    currentConfig = {
      ...currentConfig,
      width: downscaledW,
      height: downscaledH,
      maintainAspectRatio: true,
    };

    onProgress?.(80);
    canvas = await renderProcessedCanvas(sourceImg, currentConfig);

    // One more binary search pass on the downscaled canvas
    low = 0.3;
    high = 0.95;
    for (let iter = 0; iter < 5; iter++) {
      const mid = (low + high) / 2;
      const blob = await canvasToBlob(canvas, format, mid);
      if (blob.size <= targetBytes) {
        bestBlob = blob;
        bestQuality = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  // Fallback if still null (extremely aggressive target like 5KB)
  if (!bestBlob) {
    bestBlob = await canvasToBlob(canvas, format, 0.1);
    bestQuality = 0.1;
  }

  onProgress?.(100);

  return {
    blob: bestBlob,
    width: canvas.width,
    height: canvas.height,
    sizeBytes: bestBlob.size,
    finalQuality: bestQuality,
  };
}
