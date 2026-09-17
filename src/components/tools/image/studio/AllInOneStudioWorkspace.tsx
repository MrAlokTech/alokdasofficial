"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { BulkActionHeader } from "../common/BulkActionHeader";
import { ImagePreviewCard } from "../common/ImagePreviewCard";
import { InteractiveCropper } from "../common/InteractiveCropper";
import {
  ProcessedImageItem,
  ImageFormat,
  CropRect,
  WatermarkConfig,
  ColorAdjustments,
} from "@/lib/image/types";
import { FILTER_PRESETS, DEFAULT_ADJUSTMENTS } from "@/lib/image/filters";
import {
  loadImage,
  renderProcessedCanvas,
  canvasToBlob,
  formatBytes,
} from "@/lib/image/canvas-utils";
import { compressImage } from "@/lib/image/compressor";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { downloadAsZip } from "@/lib/image/zip-helper";
import { generateOutputFileName, generatePdfFileName } from "@/lib/image/file-naming";
import {
  Sparkles,
  Zap,
  Maximize2,
  Crop,
  RotateCw,
  RefreshCw,
  Stamp,
  Sliders,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
} from "lucide-react";

export const AllInOneStudioWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "compress" | "resize" | "crop" | "rotate" | "watermark" | "filters" | "convert"
  >("compress");

  const activeItem = items[selectedIndex] || null;

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
            quality: 85,
            maintainAspectRatio: true,
            adjustments: { ...DEFAULT_ADJUSTMENTS },
          },
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load image:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const updateActiveConfig = (updates: Partial<ProcessedImageItem["config"]>) => {
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === selectedIndex
          ? {
              ...item,
              config: { ...item.config, ...updates },
              status: "idle",
            }
          : item
      )
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
            ? { ...i, status: "error", errorMessage: err instanceof Error ? err.message : "Processing failed." }
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
      const fileName = generateOutputFileName("studio", item.originalFile.name, ext);
      return { fileName, blob: item.processedBlob! };
    });

    await downloadAsZip(entries, "studio");
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
    a.download = generatePdfFileName("studio_processed");
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
      {items.length === 0 ? (
        <ImageDropzone
          onFilesSelected={handleFilesSelected}
          multiple={true}
          title="Open images in All-in-One Studio"
          subtitle="Compress, resize, crop, rotate, filter, watermark, transcode, and export to PDF"
        />
      ) : (
        <div className="space-y-6">
          {/* Active Image Navigation Header if multi-image */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border/80 bg-card">
            <div className="flex items-center gap-2 overflow-x-auto min-w-0">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Layers className="w-3.5 h-3.5" />
                <span>Selected Image:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                      idx === selectedIndex
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80"
                    }`}
                  >
                    {idx + 1}. {item.cleanName.substring(0, 14)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => processSingleItem(activeItem.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Process Active</span>
              </button>
            </div>
          </div>

          {/* All-in-One Workspace: Controls on Left, Preview on Right */}
          {activeItem && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                {/* Feature Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/60 text-xs">
                  {[
                    { id: "compress" as const, label: "Compress", icon: Zap },
                    { id: "resize" as const, label: "Resize", icon: Maximize2 },
                    { id: "crop" as const, label: "Crop", icon: Crop },
                    { id: "rotate" as const, label: "Rotate", icon: RotateCw },
                    { id: "filters" as const, label: "Filters & LUT", icon: Sparkles },
                    { id: "watermark" as const, label: "Watermark", icon: Stamp },
                    { id: "convert" as const, label: "Format", icon: RefreshCw },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-secondary text-primary font-bold shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: Compress */}
                {activeTab === "compress" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground block">
                          Target File Size Limit (KB)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 100, 200, 500"
                          value={activeItem.config.targetSizeKb ?? ""}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : null;
                            updateActiveConfig({ targetSizeKb: val });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                        />
                        <div className="flex gap-1 pt-1">
                          {[50, 100, 200, 500].map((kb) => (
                            <button
                              key={kb}
                              type="button"
                              onClick={() => updateActiveConfig({ targetSizeKb: kb })}
                              className="px-2 py-0.5 rounded bg-secondary text-[10px] font-medium border border-border hover:bg-secondary/80"
                            >
                              {kb}KB
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>Quality Slider</span>
                          <span className="font-mono">{activeItem.config.quality ?? 85}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={activeItem.config.quality ?? 85}
                          disabled={Boolean(activeItem.config.targetSizeKb)}
                          onChange={(e) =>
                            updateActiveConfig({ quality: parseInt(e.target.value, 10) })
                          }
                          className="w-full accent-primary h-2"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          {activeItem.config.targetSizeKb
                            ? "Overridden by Target KB binary-search."
                            : "Standard compression level."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Resize */}
                {activeTab === "resize" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground block">Width (px)</label>
                        <input
                          type="number"
                          placeholder={`${activeItem.originalWidth} (Original)`}
                          value={activeItem.config.width ?? ""}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            updateActiveConfig({ width: val, maintainAspectRatio: true });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground block">Height (px)</label>
                        <input
                          type="number"
                          placeholder={`${activeItem.originalHeight} (Original)`}
                          value={activeItem.config.height ?? ""}
                          onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            updateActiveConfig({ height: val, maintainAspectRatio: true });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Crop */}
                {activeTab === "crop" && (
                  <div className="space-y-3">
                    <InteractiveCropper
                      imageSrc={activeItem.originalUrl}
                      originalWidth={activeItem.originalWidth}
                      originalHeight={activeItem.originalHeight}
                      cropRect={activeItem.config.crop || null}
                      onCropChange={(crop) => updateActiveConfig({ crop })}
                    />
                  </div>
                )}

                {/* Tab 4: Rotate */}
                {activeTab === "rotate" && (
                  <div className="space-y-4 text-xs">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const rot = ((activeItem.config.rotation || 0) + 90) % 360;
                          updateActiveConfig({ rotation: rot });
                        }}
                        className="px-3 py-2 rounded-xl bg-secondary border border-border font-semibold hover:bg-secondary/80 flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-primary" />
                        <span>Rotate 90&deg; CW</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateActiveConfig({ flipH: !activeItem.config.flipH })}
                        className={`px-3 py-2 rounded-xl border font-semibold transition-all ${
                          activeItem.config.flipH
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                        }`}
                      >
                        Flip Horizontal
                      </button>

                      <button
                        type="button"
                        onClick={() => updateActiveConfig({ flipV: !activeItem.config.flipV })}
                        className={`px-3 py-2 rounded-xl border font-semibold transition-all ${
                          activeItem.config.flipV
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                        }`}
                      >
                        Flip Vertical
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 5: Filters & LUT */}
                {activeTab === "filters" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {FILTER_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            const adj: ColorAdjustments = {
                              ...DEFAULT_ADJUSTMENTS,
                              ...preset.adjustments,
                              lutFilter: preset.adjustments.lutFilter || preset.id,
                            };
                            updateActiveConfig({ adjustments: adj });
                          }}
                          className={`p-2 rounded-xl border text-left text-xs font-semibold ${
                            (activeItem.config.adjustments?.lutFilter || "none") === preset.id
                              ? "bg-primary/10 border-primary text-foreground"
                              : "bg-secondary/40 border-border/70 hover:bg-secondary"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 6: Watermark */}
                {activeTab === "watermark" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-semibold text-foreground block">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={activeItem.config.watermark?.text ?? "© Alok Das"}
                          onChange={(e) =>
                            updateActiveConfig({
                              watermark: {
                                type: "text",
                                text: e.target.value,
                                fontFamily: "sans-serif",
                                fontSize: activeItem.config.watermark?.fontSize ?? 32,
                                color: activeItem.config.watermark?.color ?? "#ffffff",
                                opacity: activeItem.config.watermark?.opacity ?? 0.65,
                                position: activeItem.config.watermark?.position ?? "bottom-right",
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-foreground block">Pattern</label>
                        <select
                          value={activeItem.config.watermark?.position ?? "bottom-right"}
                          onChange={(e) => {
                            const pos = e.target.value as WatermarkConfig["position"];
                            updateActiveConfig({
                              watermark: {
                                type: "text",
                                text: activeItem.config.watermark?.text ?? "© Alok Das",
                                fontFamily: "sans-serif",
                                fontSize: activeItem.config.watermark?.fontSize ?? 32,
                                color: activeItem.config.watermark?.color ?? "#ffffff",
                                opacity: activeItem.config.watermark?.opacity ?? 0.65,
                                position: pos,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                        >
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="center">Center</option>
                          <option value="top-right">Top Right</option>
                          <option value="tile">Repeating Diagonal Tile</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 7: Format */}
                {activeTab === "convert" && (
                  <div className="space-y-4 text-xs">
                    <label className="font-semibold text-foreground block">
                      Target File Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["jpeg", "png", "webp"] as ImageFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => updateActiveConfig({ targetFormat: fmt })}
                          className={`py-2 rounded-xl font-bold border ${
                            (activeItem.config.targetFormat || "jpeg") === fmt
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary text-secondary-foreground border-border"
                          }`}
                        >
                          {fmt === "jpeg" ? "JPG" : fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Panel */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-sm font-bold text-foreground">Output Preview</h4>
                    {activeItem.status === "ready" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Processed</span>
                      </span>
                    )}
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-border/60 max-h-64 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeItem.processedUrl || activeItem.originalUrl}
                      alt="Preview"
                      className="max-h-60 object-contain rounded"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Original:</span>
                      <span className="font-medium">
                        {formatBytes(activeItem.originalSize)} ({activeItem.originalWidth}&times;
                        {activeItem.originalHeight})
                      </span>
                    </div>

                    {activeItem.processedSize && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Output:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatBytes(activeItem.processedSize)} ({activeItem.processedWidth}&times;
                          {activeItem.processedHeight})
                        </span>
                      </div>
                    )}

                    <div className="text-[11px] font-mono text-muted-foreground truncate pt-1">
                      File:{" "}
                      {generateOutputFileName(
                        "studio",
                        activeItem.originalFile.name,
                        activeItem.config.targetFormat === "jpeg"
                          ? "jpg"
                          : activeItem.config.targetFormat || "jpg"
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => processSingleItem(activeItem.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm min-h-[42px]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Process &amp; Update Preview</span>
                  </button>

                  {activeItem.processedBlob && (
                    <button
                      type="button"
                      onClick={() => {
                        const fmt = activeItem.config.targetFormat || "jpeg";
                        const ext = fmt === "jpeg" ? "jpg" : fmt;
                        const url = URL.createObjectURL(activeItem.processedBlob!);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = generateOutputFileName("studio", activeItem.originalFile.name, ext);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* Queued Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-1">
              <span>QUEUED IMAGES ({items.length})</span>
              <span>Each item customizable independently</span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <ImagePreviewCard
                  key={item.id}
                  item={item}
                  toolName="studio"
                  onUpdateConfig={updateItemConfig}
                  onProcessItem={processSingleItem}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
