"use client";

import React, { useState, useRef } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { BulkActionHeader } from "../common/BulkActionHeader";
import { ImagePreviewCard } from "../common/ImagePreviewCard";
import { ProcessedImageItem, WatermarkConfig, ImageFormat } from "@/lib/image/types";
import { loadImage, renderProcessedCanvas, canvasToBlob } from "@/lib/image/canvas-utils";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { downloadAsZip } from "@/lib/image/zip-helper";
import { generateOutputFileName, generatePdfFileName } from "@/lib/image/file-naming";
import { Stamp, Type, Image as ImageIcon, Grid, Layers, Upload } from "lucide-react";

export const WatermarkWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Watermark Configuration
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [text, setText] = useState<string>("© Alok Das");
  const [fontSize, setFontSize] = useState<number>(36);
  const [fontFamily, setFontFamily] = useState<string>("sans-serif");
  const [color, setColor] = useState<string>("#ffffff");
  const [opacity, setOpacity] = useState<number>(0.65);
  const [position, setPosition] = useState<WatermarkConfig["position"]>("bottom-right");

  // Image watermark logo
  const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);
  const [logoScale, setLogoScale] = useState<number>(0.25);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const getWatermarkConfig = (): WatermarkConfig => ({
    type: watermarkType,
    text,
    fontFamily,
    fontSize,
    color,
    opacity,
    position,
    imageSrc: logoSrc,
    imageScale: logoScale,
  });

  const handleFilesSelected = async (files: File[]) => {
    const wmConfig = getWatermarkConfig();
    const newItems: ProcessedImageItem[] = [];

    for (const file of files) {
      try {
        const img = await loadImage(file);
        const url = URL.createObjectURL(file);
        const id = Math.random().toString(36).substring(2, 9) + Date.now();

        newItems.push({
          id,
          originalFile: file,
          originalUrl: url,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          originalSize: file.size,
          cleanName: file.name,
          config: {
            targetFormat: "jpeg",
            quality: 92,
            watermark: wmConfig,
          },
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load file:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setLogoSrc(url);
    }
  };

  const updateItemConfig = (
    id: string,
    updates: Partial<ProcessedImageItem["config"]>
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, config: { ...item.config, ...updates }, status: "idle" }
          : item
      )
    );
  };

  const applyWatermarkToAll = () => {
    const wmConfig = getWatermarkConfig();
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, watermark: wmConfig },
        status: "idle",
      }))
    );
  };

  const processSingleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "processing", errorMessage: undefined } : i))
    );

    try {
      const sourceImg = await loadImage(item.originalFile);
      const canvas = await renderProcessedCanvas(sourceImg, item.config);
      const format = item.config.targetFormat || "jpeg";
      const blob = await canvasToBlob(canvas, format, (item.config.quality || 92) / 100);

      const processedUrl = URL.createObjectURL(blob);

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "ready",
                processedBlob: blob,
                processedUrl,
                processedWidth: canvas.width,
                processedHeight: canvas.height,
                processedSize: blob.size,
              }
            : i
        )
      );
    } catch (err) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: "error", errorMessage: err instanceof Error ? err.message : "Watermark failed." }
            : i
        )
      );
    }
  };

  const processAllItems = async () => {
    if (items.length === 0 || isProcessingAll) return;
    setIsProcessingAll(true);

    for (const item of items) {
      await processSingleItem(item.id);
    }

    setIsProcessingAll(false);
  };

  const handleDownloadAllZip = async () => {
    const readyItems = items.filter((i) => i.status === "ready" && i.processedBlob);
    if (readyItems.length === 0) return;

    const entries = readyItems.map((item) => {
      const format = item.config.targetFormat || "jpeg";
      const ext = format === "jpeg" ? "jpg" : format;
      const fileName = generateOutputFileName("watermark", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "watermark");
  };

  const handleExportToPdf = async () => {
    const readyItems = items.filter((i) => i.status === "ready" && i.processedBlob);
    if (readyItems.length === 0) return;

    const pdfItems = readyItems.map((item) => ({
      blobOrUrl: item.processedBlob!,
      width: item.processedWidth,
      height: item.processedHeight,
    }));

    const pdfBlob = await exportImagesToPdf(pdfItems, {
      pageSize: "a4",
      orientation: "auto",
      margin: "normal",
      imageQuality: 92,
    });

    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = generatePdfFileName("watermarked");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(pdfUrl);
  };

  const handleClearAll = () => {
    items.forEach((i) => {
      if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
      if (i.processedUrl) URL.revokeObjectURL(i.processedUrl);
    });
    setItems([]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      if (target?.processedUrl) URL.revokeObjectURL(target.processedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const hasProcessedItems = items.some((i) => i.status === "ready" && i.processedBlob);

  return (
    <div className="space-y-6">
      {/* Watermark Design Studio Controls */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Stamp className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Watermark Designer
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-secondary/80 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => setWatermarkType("text")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                watermarkType === "text"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text Watermark</span>
            </button>
            <button
              type="button"
              onClick={() => setWatermarkType("image")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                watermarkType === "image"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image / Logo Stamp</span>
            </button>
          </div>
        </div>

        {/* Text Mode Controls */}
        {watermarkType === "text" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground block">
                Watermark Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. © 2026 Alok Das"
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>Font Size</span>
                <span className="font-mono text-muted-foreground">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-primary h-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>Opacity</span>
                <span className="font-mono text-muted-foreground">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary h-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-border/80 cursor-pointer p-0.5 bg-background"
                />
                <span className="text-xs font-mono uppercase text-muted-foreground">{color}</span>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-3">
              <label className="text-xs font-semibold text-foreground block">
                Position &amp; Pattern
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "bottom-right", label: "Bottom Right" },
                  { id: "bottom-left", label: "Bottom Left" },
                  { id: "center", label: "Center" },
                  { id: "top-right", label: "Top Right" },
                  { id: "top-left", label: "Top Left" },
                  { id: "tile", label: "Diagonal Repeat Tile (Pattern)" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as WatermarkConfig["position"])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      position === pos.id
                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                        : "bg-secondary text-secondary-foreground border-border/70 hover:bg-secondary/80"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Image / Logo Stamp Controls */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Upload Logo Stamp (PNG / SVG)
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/80 bg-secondary/30 hover:bg-secondary/60 text-xs font-semibold text-foreground transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>{logoSrc ? "Replace Logo" : "Choose Logo File"}</span>
              </button>
              {logoSrc && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  &bull; Logo loaded successfully
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>Logo Scale</span>
                <span className="font-mono text-muted-foreground">{Math.round(logoScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                className="w-full accent-primary h-2"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span>Logo Opacity</span>
                <span className="font-mono text-muted-foreground">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-primary h-2"
              />
            </div>
          </div>
        )}

        {/* Apply across existing queue button */}
        {items.length > 0 && (
          <div className="pt-2 border-t border-border/50 flex justify-end">
            <button
              type="button"
              onClick={applyWatermarkToAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all"
            >
              <Stamp className="w-3.5 h-3.5 text-primary" />
              <span>Apply this Watermark to All Queued Images</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to add watermarks (single or bulk)"
        subtitle="Custom text or logo stamp &bull; Diagonal repeating tiles &bull; Zero server uploads"
      />

      {/* Bulk Action Header */}
      <BulkActionHeader
        itemCount={items.length}
        isProcessingAll={isProcessingAll}
        onProcessAll={processAllItems}
        onDownloadAllZip={handleDownloadAllZip}
        onExportToPdf={handleExportToPdf}
        onClearAll={handleClearAll}
        hasProcessedItems={hasProcessedItems}
      />

      {/* Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
            <span>IMAGES IN WATERMARK QUEUE ({items.length})</span>
            <span>Live preview &amp; download</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="watermark"
                onUpdateConfig={updateItemConfig}
                onProcessItem={processSingleItem}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
