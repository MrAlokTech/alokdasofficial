import { PerImageConfig, ImageFormat, CropRect, WatermarkConfig, ColorAdjustments } from "./types";

/**
 * Safely load an image from File or URL string
 */
export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    let urlToRevoke: string | null = null;
    if (typeof source === "string") {
      img.src = source;
    } else {
      urlToRevoke = URL.createObjectURL(source);
      img.src = urlToRevoke;
    }

    img.onload = () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      resolve(img);
    };

    img.onerror = (err) => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      reject(new Error("Failed to load image into browser memory: " + err));
    };
  });
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Convert Canvas to Blob with specified format and quality (0.01 - 1.0)
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat = "jpeg",
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType =
      format === "png"
        ? "image/png"
        : format === "webp"
        ? "image/webp"
        : "image/jpeg";

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob failed to produce image data."));
        }
      },
      mimeType,
      Math.min(Math.max(quality, 0.01), 1.0)
    );
  });
}

/**
 * Apply pixel-level LUT filters and sharpness
 */
export function applyPixelFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: ColorAdjustments
) {
  const { lutFilter, sharpen, exposure } = adjustments;
  if (lutFilter === "none" && sharpen === 0 && exposure === 0) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Exposure adjustment (-100 to 100)
  if (exposure !== 0) {
    const expFactor = Math.pow(2, exposure / 50);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] * expFactor));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * expFactor));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * expFactor));
    }
  }

  // LUT Presets
  switch (lutFilter) {
    case "cinematic": {
      // Teal and Orange / High contrast movie look
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.15); // boost reds/warmth in highlights
        data[i + 1] = Math.min(255, g * 0.95);
        data[i + 2] = Math.min(255, b * 1.1 + (b < 128 ? 20 : -10)); // teal shadows
      }
      break;
    }
    case "vintage": {
      // Warm faded nostalgic look
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.1 + 20);
        data[i + 1] = Math.min(255, g * 1.05 + 10);
        data[i + 2] = Math.min(255, b * 0.85);
      }
      break;
    }
    case "warm": {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.12);
        data[i + 2] = Math.min(255, data[i + 2] * 0.88);
      }
      break;
    }
    case "cool": {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.88);
        data[i + 2] = Math.min(255, data[i + 2] * 1.15);
      }
      break;
    }
    case "noir": {
      // High contrast dramatic black & white
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrasted = (gray - 128) * 1.4 + 128;
        const clamped = Math.min(255, Math.max(0, contrasted));
        data[i] = clamped;
        data[i + 1] = clamped;
        data[i + 2] = clamped;
      }
      break;
    }
    case "sepia": {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;
    }
    case "dramatic": {
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          const val = data[i + c];
          data[i + c] = Math.min(255, Math.max(0, (val - 128) * 1.35 + 128));
        }
      }
      break;
    }
    case "cyberpunk": {
      // Neon magenta highlights, deep cyan shadows
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 1.25 + 15);
        data[i + 1] = Math.min(255, g * 0.85);
        data[i + 2] = Math.min(255, b * 1.35 + 25);
      }
      break;
    }
    case "forest": {
      // Emerald rich greens & muted warm tones
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.9);
        data[i + 1] = Math.min(255, data[i + 1] * 1.2);
        data[i + 2] = Math.min(255, data[i + 2] * 0.95);
      }
      break;
    }
    case "sunset": {
      // Golden hour gradient & rich amber glow
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.25 + 15);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05 + 5);
        data[i + 2] = Math.min(255, data[i + 2] * 0.75);
      }
      break;
    }
    case "vibrant": {
      // Pop saturation
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        data[i] = Math.min(255, Math.max(0, avg + (r - avg) * 1.4));
        data[i + 1] = Math.min(255, Math.max(0, avg + (g - avg) * 1.4));
        data[i + 2] = Math.min(255, Math.max(0, avg + (b - avg) * 1.4));
      }
      break;
    }
  }

  // Sharpening (convolution 3x3 kernel)
  if (sharpen > 0) {
    const amount = (sharpen / 100) * 1.5;
    const copy = new Uint8ClampedArray(data);
    const w4 = width * 4;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) {
          const current = copy[idx + c];
          const top = copy[idx - w4 + c];
          const bottom = copy[idx + w4 + c];
          const left = copy[idx - 4 + c];
          const right = copy[idx + 4 + c];
          const sharpVal = current * (1 + 4 * amount) - (top + bottom + left + right) * amount;
          data[idx + c] = Math.min(255, Math.max(0, sharpVal));
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply watermark onto canvas
 */
export async function applyWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  watermark: WatermarkConfig
) {
  ctx.save();

  if (watermark.type === "text") {
    const { text, fontFamily, fontSize, color, opacity, position } = watermark;
    if (!text.trim()) {
      ctx.restore();
      return;
    }

    ctx.globalAlpha = opacity;
    ctx.font = `bold ${fontSize}px ${fontFamily || "sans-serif"}`;
    ctx.fillStyle = color || "#ffffff";
    ctx.textBaseline = "middle";

    if (position === "tile") {
      ctx.textAlign = "center";
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const stepX = textWidth + 120;
      const stepY = fontSize * 3 + 60;

      ctx.rotate((-25 * Math.PI) / 180);
      for (let y = -canvasHeight; y < canvasHeight * 2; y += stepY) {
        for (let x = -canvasWidth; x < canvasWidth * 2; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
    } else {
      let x = canvasWidth / 2;
      let y = canvasHeight / 2;
      ctx.textAlign = "center";

      const margin = 30 + fontSize / 2;
      if (position === "top-left") {
        ctx.textAlign = "left";
        x = margin;
        y = margin;
      } else if (position === "top-right") {
        ctx.textAlign = "right";
        x = canvasWidth - margin;
        y = margin;
      } else if (position === "bottom-left") {
        ctx.textAlign = "left";
        x = margin;
        y = canvasHeight - margin;
      } else if (position === "bottom-right") {
        ctx.textAlign = "right";
        x = canvasWidth - margin;
        y = canvasHeight - margin;
      }

      // Add soft shadow for readability
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(text, x, y);
    }
  } else if (watermark.type === "image" && watermark.imageSrc) {
    try {
      const wmImg = await loadImage(watermark.imageSrc);
      const scale = watermark.imageScale || 0.25;
      const wmWidth = Math.max(40, canvasWidth * scale);
      const wmHeight = (wmImg.naturalHeight / wmImg.naturalWidth) * wmWidth;

      ctx.globalAlpha = watermark.opacity || 0.7;

      let x = (canvasWidth - wmWidth) / 2;
      let y = (canvasHeight - wmHeight) / 2;
      const margin = 20;

      if (watermark.position === "top-left") {
        x = margin;
        y = margin;
      } else if (watermark.position === "top-right") {
        x = canvasWidth - wmWidth - margin;
        y = margin;
      } else if (watermark.position === "bottom-left") {
        x = margin;
        y = canvasHeight - wmHeight - margin;
      } else if (watermark.position === "bottom-right") {
        x = canvasWidth - wmWidth - margin;
        y = canvasHeight - wmHeight - margin;
      }

      ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
    } catch {
      // Ignore image watermark load failure gracefully
    }
  }

  ctx.restore();
}

/**
 * Main rendering pipeline:
 * Takes source image and per-image config, performs:
 * 1. Cropping
 * 2. Rotation & Flips
 * 3. Resizing
 * 4. CSS filters (brightness, contrast, saturation, hue, blur)
 * 5. Pixel-level LUT & sharpness
 * 6. Watermark
 */
export async function renderProcessedCanvas(
  sourceImg: HTMLImageElement,
  config: PerImageConfig
): Promise<HTMLCanvasElement> {
  const {
    crop,
    rotation = 0,
    flipH = false,
    flipV = false,
    width,
    height,
    adjustments,
    watermark,
    targetFormat,
  } = config;

  // 1. Calculate Crop source coordinates
  let srcX = 0;
  let srcY = 0;
  let srcW = sourceImg.naturalWidth;
  let srcH = sourceImg.naturalHeight;

  if (crop) {
    srcX = Math.max(0, Math.min(srcW, crop.x));
    srcY = Math.max(0, Math.min(srcH, crop.y));
    srcW = Math.max(1, Math.min(srcW - srcX, crop.width));
    srcH = Math.max(1, Math.min(srcH - srcY, crop.height));
  }

  // 2. Determine target dimensions after rotation
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotatedW = Math.round(srcW * cos + srcH * sin);
  const rotatedH = Math.round(srcW * sin + srcH * cos);

  // 3. Determine final output dimensions
  let destW = width && width > 0 ? width : rotatedW;
  let destH = height && height > 0 ? height : rotatedH;

  if (config.maintainAspectRatio && (width || height)) {
    const ratio = rotatedW / rotatedH;
    if (width && !height) {
      destH = Math.round(width / ratio);
    } else if (height && !width) {
      destW = Math.round(height * ratio);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, destW);
  canvas.height = Math.max(1, destH);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Could not create 2D canvas context.");

  // Fill white background if target is JPEG (avoids black transparency artifacts)
  if (targetFormat === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, destW, destH);
  }

  // 4. Apply CSS filters before drawing
  if (adjustments) {
    const { brightness, contrast, saturation, hue, blur } = adjustments;
    const filterParts: string[] = [];
    if (brightness !== 0) filterParts.push(`brightness(${100 + brightness}%)`);
    if (contrast !== 0) filterParts.push(`contrast(${100 + contrast}%)`);
    if (saturation !== 0) filterParts.push(`saturate(${100 + saturation}%)`);
    if (hue !== 0) filterParts.push(`hue-rotate(${hue}deg)`);
    if (blur > 0) filterParts.push(`blur(${blur}px)`);

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(" ");
    }
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 5. Transform: Translate, Rotate, Flip, and Scale
  ctx.save();
  ctx.translate(destW / 2, destH / 2);

  if (rotation !== 0) {
    ctx.rotate(rad);
  }
  ctx.scale(
    (flipH ? -1 : 1) * (destW / rotatedW),
    (flipV ? -1 : 1) * (destH / rotatedH)
  );

  // Draw cropped region centered
  ctx.drawImage(
    sourceImg,
    srcX,
    srcY,
    srcW,
    srcH,
    -srcW / 2,
    -srcH / 2,
    srcW,
    srcH
  );
  ctx.restore();

  // Reset filter for subsequent operations
  ctx.filter = "none";

  // 6. Apply Pixel LUT presets & sharpness
  if (adjustments) {
    applyPixelFilters(ctx, destW, destH, adjustments);
  }

  // 7. Apply Watermark
  if (watermark) {
    await applyWatermark(ctx, destW, destH, watermark);
  }

  return canvas;
}
