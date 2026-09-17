"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { BulkActionHeader } from "../common/BulkActionHeader";
import { ImagePreviewCard } from "../common/ImagePreviewCard";
import { ProcessedImageItem, ImageFormat } from "@/lib/image/types";
import { loadImage } from "@/lib/image/canvas-utils";
import { compressImage } from "@/lib/image/compressor";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { downloadAsZip } from "@/lib/image/zip-helper";
import { generateOutputFileName, generatePdfFileName } from "@/lib/image/file-naming";
import { Zap, Sliders, Target, ShieldCheck, CheckCircle2 } from "lucide-react";

export const CompressWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Global settings applied by default to newly added items
  const [globalTargetKb, setGlobalTargetKb] = useState<number | null>(null);
  const [globalQuality, setGlobalQuality] = useState<number>(80);
  const [globalFormat, setGlobalFormat] = useState<ImageFormat>("jpeg");

  const handleFilesSelected = async (files: File[]) => {
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
            targetFormat: globalFormat,
            quality: globalQuality,
            targetSizeKb: globalTargetKb,
            maintainAspectRatio: true,
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
              // Reset ready status if config changed
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
      const result = await compressImage(sourceImg, item.config);

      const processedUrl = URL.createObjectURL(result.blob);

      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: "ready",
                processedBlob: result.blob,
                processedUrl,
                processedWidth: result.width,
                processedHeight: result.height,
                processedSize: result.sizeBytes,
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
                errorMessage: err instanceof Error ? err.message : "Compression failed.",
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

  const handleBatchApplyTargetKb = (kb: number | null) => {
    setGlobalTargetKb(kb);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, targetSizeKb: kb },
        status: "idle",
      }))
    );
  };

  const handleBatchApplyFormat = (format: ImageFormat) => {
    setGlobalFormat(format);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, targetFormat: format },
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
      const fileName = generateOutputFileName("compress", item.originalFile.name, ext);
      return {
        fileName,
        blob: item.processedBlob!,
      };
    });

    await downloadAsZip(entries, "compress");
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
      imageQuality: 85,
    });

    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = generatePdfFileName("compressed");
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
      {/* Top Global Compression Strategy Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              Smart Compression Controls
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Instant In-Memory Binary Search</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Target File Size Mode */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span>Target File Size Limit</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                {globalTargetKb ? `< ${globalTargetKb} KB` : "Auto Quality"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="e.g. 50, 100, 200"
                value={globalTargetKb ?? ""}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : null;
                  handleBatchApplyTargetKb(val);
                }}
                className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
              />
              <span className="text-xs font-semibold text-muted-foreground">KB</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap pt-0.5">
              {[50, 100, 200, 500].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => handleBatchApplyTargetKb(kb)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors ${
                    globalTargetKb === kb
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80"
                  }`}
                >
                  {kb} KB
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleBatchApplyTargetKb(null)}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-border/60 text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quality Slider (Active when no fixed KB) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Quality Level</span>
              </label>
              <span className="text-xs font-mono font-bold text-primary">
                {globalQuality}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={globalQuality}
              disabled={Boolean(globalTargetKb)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setGlobalQuality(val);
                setItems((prev) =>
                  prev.map((i) => ({
                    ...i,
                    config: { ...i.config, quality: val },
                    status: "idle",
                  }))
                );
              }}
              className="w-full accent-primary h-2 cursor-pointer disabled:opacity-40"
            />
            <p className="text-[11px] text-muted-foreground">
              {globalTargetKb
                ? "Overridden by Target KB binary-search optimizer."
                : "Higher quality retains finer details with larger file sizes."}
            </p>
          </div>

          {/* Target Format */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              Default Output Format
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["jpeg", "png", "webp"] as ImageFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleBatchApplyFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    globalFormat === fmt
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80"
                  }`}
                >
                  {fmt === "jpeg" ? "JPG" : fmt.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              JPG is recommended for photographic compression.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to compress (single or bulk)"
        subtitle="Binary-search target KB optimizer &bull; Zero server uploads &bull; 100% private"
      />

      {/* Bulk Action Header */}
      <BulkActionHeader
        itemCount={items.length}
        isProcessingAll={isProcessingAll}
        onProcessAll={processAllItems}
        onDownloadAllZip={handleDownloadAllZip}
        onExportToPdf={handleExportToPdf}
        onClearAll={handleClearAll}
        onBatchApplyTargetKb={handleBatchApplyTargetKb}
        onBatchApplyFormat={handleBatchApplyFormat}
        hasProcessedItems={hasProcessedItems}
      />

      {/* Image Cards Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
            <span>QUEUED IMAGES ({items.length})</span>
            <span>Independent overrides active</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="compress"
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
