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
import { RefreshCw, ArrowRightLeft, FileCheck } from "lucide-react";

export const ConvertWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [globalFormat, setGlobalFormat] = useState<ImageFormat>("png");

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
            quality: 95,
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
      const format = item.config.targetFormat || "png";
      const blob = await canvasToBlob(canvas, format, (item.config.quality || 95) / 100);

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
            ? { ...i, status: "error", errorMessage: err instanceof Error ? err.message : "Convert failed." }
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

  const handleApplyGlobalFormat = (fmt: ImageFormat) => {
    setGlobalFormat(fmt);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, targetFormat: fmt },
        status: "idle",
      }))
    );
  };

  const handleDownloadAllZip = async () => {
    const readyItems = items.filter((i) => i.status === "ready" && i.processedBlob);
    if (readyItems.length === 0) return;

    const entries = readyItems.map((item) => {
      const format = item.config.targetFormat || "png";
      const ext = format === "jpeg" ? "jpg" : format;
      const fileName = generateOutputFileName("convert", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "convert");
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
    a.download = generatePdfFileName("converted");
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
      {/* Target Format Strategy Banner */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Select Universal Target Format
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Fast client-side canvas transcode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              format: "jpeg" as ImageFormat,
              title: "JPG / JPEG",
              desc: "Best for photographs and general web sharing.",
            },
            {
              format: "png" as ImageFormat,
              title: "PNG",
              desc: "Lossless with full alpha transparency support.",
            },
            {
              format: "webp" as ImageFormat,
              title: "WEBP",
              desc: "Next-gen web format with high compression ratio.",
            },
          ].map((item) => (
            <button
              key={item.format}
              type="button"
              onClick={() => handleApplyGlobalFormat(item.format)}
              className={`p-4 rounded-xl border text-left transition-all ${
                globalFormat === item.format
                  ? "bg-primary/10 border-primary text-foreground shadow-xs"
                  : "bg-secondary/40 border-border/70 hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">
                  {item.title}
                </span>
                {globalFormat === item.format && (
                  <FileCheck className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to convert (single or bulk)"
        subtitle="Batch convert between JPG, PNG, and WEBP with zero quality loss"
      />

      {/* Bulk Action Header */}
      <BulkActionHeader
        itemCount={items.length}
        isProcessingAll={isProcessingAll}
        onProcessAll={processAllItems}
        onDownloadAllZip={handleDownloadAllZip}
        onExportToPdf={handleExportToPdf}
        onClearAll={handleClearAll}
        onBatchApplyFormat={handleApplyGlobalFormat}
        hasProcessedItems={hasProcessedItems}
      />

      {/* Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
            <span>CONVERSION QUEUE ({items.length})</span>
            <span>Independent target formats allowed</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="convert"
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
