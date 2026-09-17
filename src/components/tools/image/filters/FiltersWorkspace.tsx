"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { BulkActionHeader } from "../common/BulkActionHeader";
import { ImagePreviewCard } from "../common/ImagePreviewCard";
import { ProcessedImageItem, ColorAdjustments, ImageFormat } from "@/lib/image/types";
import { FILTER_PRESETS, DEFAULT_ADJUSTMENTS, FilterPreset } from "@/lib/image/filters";
import { loadImage, renderProcessedCanvas, canvasToBlob } from "@/lib/image/canvas-utils";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { downloadAsZip } from "@/lib/image/zip-helper";
import { generateOutputFileName, generatePdfFileName } from "@/lib/image/file-naming";
import { Sparkles, Sliders, RotateCcw, Check } from "lucide-react";

export const FiltersWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Global Filter State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("none");
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({ ...DEFAULT_ADJUSTMENTS });

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
            targetFormat: "jpeg",
            quality: 92,
            adjustments: { ...adjustments },
          },
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load file:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const applyPreset = (preset: FilterPreset) => {
    setSelectedPresetId(preset.id);
    const updated: ColorAdjustments = {
      ...DEFAULT_ADJUSTMENTS,
      ...preset.adjustments,
      lutFilter: preset.adjustments.lutFilter || preset.id,
    };
    setAdjustments(updated);

    // Update all queued items
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, adjustments: updated },
        status: "idle",
      }))
    );
  };

  const updateAdjustmentField = (key: keyof ColorAdjustments, value: number | string) => {
    const next = { ...adjustments, [key]: value };
    setAdjustments(next);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, adjustments: next },
        status: "idle",
      }))
    );
  };

  const handleResetAdjustments = () => {
    setSelectedPresetId("none");
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        config: { ...item.config, adjustments: { ...DEFAULT_ADJUSTMENTS } },
        status: "idle",
      }))
    );
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
            ? { ...i, status: "error", errorMessage: err instanceof Error ? err.message : "Filter failed." }
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
      const fileName = generateOutputFileName("filter", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "filter");
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
    a.download = generatePdfFileName("filtered");
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
      {/* LUT Presets Selector */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Aesthetic LUT Presets
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetAdjustments}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedPresetId === preset.id
                  ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary shadow-xs"
                  : "bg-secondary/40 border-border/70 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground truncate">
                  {preset.name}
                </span>
                {selectedPresetId === preset.id && (
                  <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                {preset.category}
              </span>
            </button>
          ))}
        </div>

        {/* Fine-Tuning Sliders Accordion */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>Manual Color Adjustments</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-xs">
            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Brightness</span>
                <span className="font-mono">{adjustments.brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.brightness}
                onChange={(e) => updateAdjustmentField("brightness", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Contrast</span>
                <span className="font-mono">{adjustments.contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.contrast}
                onChange={(e) => updateAdjustmentField("contrast", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Saturation</span>
                <span className="font-mono">{adjustments.saturation}</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={adjustments.saturation}
                onChange={(e) => updateAdjustmentField("saturation", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* Exposure */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Exposure</span>
                <span className="font-mono">{adjustments.exposure}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustments.exposure}
                onChange={(e) => updateAdjustmentField("exposure", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* Sharpen */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Sharpen</span>
                <span className="font-mono">{adjustments.sharpen}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.sharpen}
                onChange={(e) => updateAdjustmentField("sharpen", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>

            {/* Hue Rotate */}
            <div className="space-y-1">
              <div className="flex justify-between font-medium text-muted-foreground">
                <span>Hue Rotate</span>
                <span className="font-mono">{adjustments.hue}&deg;</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={adjustments.hue}
                onChange={(e) => updateAdjustmentField("hue", parseInt(e.target.value, 10))}
                className="w-full accent-primary h-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to apply filters and LUT styles"
        subtitle="12+ film & aesthetic presets &bull; Hardware accelerated canvas processing"
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
            <span>FILTER QUEUE ({items.length})</span>
            <span>Batch applied with individual overrides</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <ImagePreviewCard
                key={item.id}
                item={item}
                toolName="filter"
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
