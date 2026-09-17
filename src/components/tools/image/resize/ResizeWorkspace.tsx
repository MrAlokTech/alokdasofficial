"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { BulkActionHeader } from "../common/BulkActionHeader";
import { ImagePreviewCard } from "../common/ImagePreviewCard";
import { ProcessedImageItem, ImageFormat } from "@/lib/image/types";
import { loadImage, renderProcessedCanvas, canvasToBlob } from "@/lib/image/canvas-utils";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { downloadAsZip } from "@/lib/image/zip-helper";
import { generateOutputFileName, generatePdfFileName } from "@/lib/image/file-naming";
import { Maximize2, Lock, Unlock, Percent, RefreshCw } from "lucide-react";

const PRESETS = [
  { name: "Full HD", width: 1920, height: 1080 },
  { name: "Social Square", width: 1080, height: 1080 },
  { name: "Web Banner (OG)", width: 1200, height: 630 },
  { name: "Passport Photo", width: 350, height: 450 },
  { name: "Avatar / Profile", width: 512, height: 512 },
  { name: "Compact Thumbnail", width: 640, height: 480 },
];

export const ResizeWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Global Resize Settings
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [globalWidth, setGlobalWidth] = useState<string>("");
  const [globalHeight, setGlobalHeight] = useState<string>("");
  const [globalFormat, setGlobalFormat] = useState<ImageFormat>("jpeg");

  const handleFilesSelected = async (files: File[]) => {
    const newItems: ProcessedImageItem[] = [];

    for (const file of files) {
      try {
        const img = await loadImage(file);
        const url = URL.createObjectURL(file);
        const id = Math.random().toString(36).substring(2, 9) + Date.now();

        // Calculate initial resized dimensions based on scalePercent
        const w = Math.round(img.naturalWidth * (scalePercent / 100));
        const h = Math.round(img.naturalHeight * (scalePercent / 100));

        newItems.push({
          id,
          originalFile: file,
          originalUrl: url,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          originalSize: file.size,
          cleanName: file.name,
          config: {
            targetFormat: globalFormat,
            quality: 90,
            width: w,
            height: h,
            maintainAspectRatio: maintainAspect,
          },
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load file:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const updateItemConfig = (
    id: string,
    updates: Partial<ProcessedImageItem["config"]>
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              config: { ...item.config, ...updates },
              status: "idle",
            }
          : item
      )
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
      const blob = await canvasToBlob(canvas, format, (item.config.quality || 90) / 100);

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
            ? {
                ...i,
                status: "error",
                errorMessage: err instanceof Error ? err.message : "Resize failed.",
              }
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

  const applyScaleToAll = (pct: number) => {
    setScalePercent(pct);
    setGlobalWidth("");
    setGlobalHeight("");
    setItems((prev) =>
      prev.map((item) => {
        const w = Math.round(item.originalWidth * (pct / 100));
        const h = Math.round(item.originalHeight * (pct / 100));
        return {
          ...item,
          config: {
            ...item.config,
            width: w,
            height: h,
            maintainAspectRatio: maintainAspect,
          },
          status: "idle",
        };
      })
    );
  };

  const applyPresetToAll = (preset: (typeof PRESETS)[0]) => {
    setGlobalWidth(preset.width.toString());
    setGlobalHeight(preset.height.toString());
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: {
          ...item.config,
          width: preset.width,
          height: preset.height,
          maintainAspectRatio: maintainAspect,
        },
        status: "idle",
      }))
    );
  };

  const handleDownloadAllZip = async () => {
    const readyItems = items.filter((i) => i.status === "ready" && i.processedBlob);
    if (readyItems.length === 0) return;

    const entries = readyItems.map((item) => {
      const format = item.config.targetFormat || "jpeg";
      const ext = format === "jpeg" ? "jpg" : format;
      const fileName = generateOutputFileName("resize", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "resize");
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
      imageQuality: 90,
    });

    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = generatePdfFileName("resized");
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
      {/* Top Global Resize Controls */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Global Resize &amp; Scale Presets
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setMaintainAspect(!maintainAspect)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              maintainAspect
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-secondary text-muted-foreground border-border/60"
            }`}
          >
            {maintainAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{maintainAspect ? "Aspect Ratio Locked" : "Aspect Ratio Free"}</span>
          </button>
        </div>

        {/* Scaling Percentage Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-primary" />
              <span>Scale Factor:</span>
            </span>
            <span className="font-mono text-primary font-bold">{scalePercent}%</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[25, 50, 75, 100, 150, 200].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => applyScaleToAll(pct)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  scalePercent === pct
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Standard Dimension Presets */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground block">
            Popular Target Resolutions:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPresetToAll(p)}
                className="p-2 rounded-xl border border-border/70 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/70 text-left transition-all"
              >
                <div className="text-[11px] font-bold text-foreground truncate">{p.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {p.width} &times; {p.height}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to resize (single or bulk)"
        subtitle="Downscale, upscale, lock aspect ratio, and customize dimensions independently"
      />

      {/* Bulk Action Header */}
      <BulkActionHeader
        itemCount={items.length}
        isProcessingAll={isProcessingAll}
        onProcessAll={processAllItems}
        onDownloadAllZip={handleDownloadAllZip}
        onExportToPdf={handleExportToPdf}
        onClearAll={handleClearAll}
        onBatchApplyFormat={(fmt) => {
          setGlobalFormat(fmt);
          setItems((prev) =>
            prev.map((i) => ({
              ...i,
              config: { ...i.config, targetFormat: fmt },
              status: "idle",
            }))
          );
        }}
        hasProcessedItems={hasProcessedItems}
      />

      {/* Image Cards Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
            <span>IMAGES IN RESIZE QUEUE ({items.length})</span>
            <span>Independent dimensions per item</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="resize"
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
