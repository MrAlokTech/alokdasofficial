export type ImageFormat = "jpeg" | "png" | "webp";

export type AspectRatioPreset = "free" | "1:1" | "16:9" | "4:3" | "9:16" | "3:2" | "passport";

export interface CropRect {
  x: number; // percentage (0 - 100) or pixel
  y: number;
  width: number;
  height: number;
}

export interface WatermarkConfig {
  type: "text" | "image";
  // Text watermark
  text: string;
  fontFamily: string;
  fontSize: number; // in pixels relative to base or scale
  color: string;
  opacity: number; // 0.0 - 1.0
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";
  // Image watermark
  imageSrc?: string; // data URL or blob URL
  imageScale?: number; // 0.1 - 1.0 (relative to target)
}

export interface ColorAdjustments {
  brightness: number; // -100 to 100, default 0
  contrast: number; // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  exposure: number; // -100 to 100, default 0
  hue: number; // -180 to 180, default 0
  blur: number; // 0 to 20 px, default 0
  sharpen: number; // 0 to 100 %, default 0
  lutFilter: string; // "none" | "cinematic" | "vintage" | "warm" | "cool" | "noir" | "sepia" | "dramatic" | "cyberpunk" | "forest" | "sunset" | "vibrant"
}

export interface PerImageConfig {
  targetFormat?: ImageFormat;
  quality?: number; // 1 - 100
  targetSizeKb?: number | null; // e.g. 50, 100, 200, 500 KB
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  rotation?: number; // 0, 90, 180, 270 or arbitrary
  flipH?: boolean;
  flipV?: boolean;
  crop?: CropRect | null;
  watermark?: WatermarkConfig | null;
  adjustments?: ColorAdjustments | null;
}

export interface ProcessedImageItem {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number; // in bytes
  cleanName: string;

  // Individual override config
  config: PerImageConfig;

  // Processed outcome
  status: "idle" | "processing" | "ready" | "error";
  processedBlob?: Blob;
  processedUrl?: string;
  processedWidth?: number;
  processedHeight?: number;
  processedSize?: number; // in bytes
  errorMessage?: string;
  progress?: number;
}

export interface PdfExportOptions {
  pageSize: "a4" | "letter" | "fit";
  orientation: "portrait" | "landscape" | "auto";
  margin: "none" | "small" | "normal"; // 0pt, 20pt, 40pt
  imageQuality: number; // 1 - 100
}
