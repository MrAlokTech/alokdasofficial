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
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Compass } from "lucide-react";

export const RotateWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Global defaults
  const [globalRotation, setGlobalRotation] = useState<number>(0);
  const [globalFlipH, setGlobalFlipH] = useState<boolean>(false);
  const [globalFlipV, setGlobalFlipV] = useState<boolean>(false);
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
            quality: 92,
            rotation: globalRotation,
            flipH: globalFlipH,
            flipV: globalFlipV,
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
          ? { ...item, config: { ...item.config, ...updates }, status: "idle" }
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
      const blob = await canvasToBlob(canvas, format, 0.92);

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
            ? { ...i, status: "error", errorMessage: err instanceof Error ? err.message : "Rotate failed." }
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

  const rotateAllBy = (degrees: number) => {
    setItems((prev) =>
      prev.map((item) => {
        const nextRot = ((item.config.rotation || 0) + degrees + 360) % 360;
        return {
          ...item,
          config: { ...item.config, rotation: nextRot },
          status: "idle",
        };
      })
    );
  };

  const toggleFlipHAll = () => {
    setGlobalFlipH(!globalFlipH);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, flipH: !item.config.flipH },
        status: "idle",
      }))
    );
  };

  const toggleFlipVAll = () => {
    setGlobalFlipV(!globalFlipV);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, flipV: !item.config.flipV },
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
      const fileName = generateOutputFileName("rotate", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "rotate");
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
    a.download = generatePdfFileName("rotated");
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
      {/* Global Quick Action Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Rotate &amp; Flip Controls
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Apply 90&deg; steps or flip horizontally/vertically
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => rotateAllBy(90)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all min-h-[38px]"
          >
            <RotateCw className="w-3.5 h-3.5 text-primary" />
            <span>Rotate 90&deg; CW</span>
          </button>

          <button
            type="button"
            onClick={() => rotateAllBy(-90)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Rotate 90&deg; CCW</span>
          </button>

          <button
            type="button"
            onClick={() => rotateAllBy(180)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all min-h-[38px]"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>180&deg; Flip</span>
          </button>

          <button
            type="button"
            onClick={toggleFlipHAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all min-h-[38px]"
          >
            <FlipHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Flip Horizontal</span>
          </button>

          <button
            type="button"
            onClick={toggleFlipVAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold transition-all min-h-[38px]"
          >
            <FlipVertical className="w-3.5 h-3.5 text-primary" />
            <span>Flip Vertical</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to rotate and flip (single or bulk)"
        subtitle="Lossless rotation, mirror flips, and independent per-image orientation"
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

      {/* Images in Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
            <span>IMAGES IN QUEUE ({items.length})</span>
            <span>Independent orientation per card</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="rotate"
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
