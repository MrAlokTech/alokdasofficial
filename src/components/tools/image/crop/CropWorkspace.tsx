"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { InteractiveCropper } from "../common/InteractiveCropper";
import { ProcessedImageItem, CropRect, ImageFormat } from "@/lib/image/types";
import { loadImage, renderProcessedCanvas, canvasToBlob, formatBytes } from "@/lib/image/canvas-utils";
import { generateOutputFileName } from "@/lib/image/file-naming";
import { Crop, Download, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Layers } from "lucide-react";

export const CropWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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
            quality: 92,
            crop: {
              x: Math.round(img.naturalWidth * 0.05),
              y: Math.round(img.naturalHeight * 0.05),
              width: Math.round(img.naturalWidth * 0.9),
              height: Math.round(img.naturalHeight * 0.9),
            },
          },
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load file:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleCropChange = (crop: CropRect | null) => {
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === selectedIndex
          ? {
              ...item,
              config: { ...item.config, crop },
              status: "idle",
            }
          : item
      )
    );
  };

  const processCrop = async () => {
    if (!activeItem) return;
    setIsProcessing(true);

    try {
      const sourceImg = await loadImage(activeItem.originalFile);
      const canvas = await renderProcessedCanvas(sourceImg, activeItem.config);
      const format = activeItem.config.targetFormat || "jpeg";
      const blob = await canvasToBlob(canvas, format, 0.92);
      const processedUrl = URL.createObjectURL(blob);

      setItems((prev) =>
        prev.map((item, idx) =>
          idx === selectedIndex
            ? {
                ...item,
                status: "ready",
                processedBlob: blob,
                processedUrl,
                processedWidth: canvas.width,
                processedHeight: canvas.height,
                processedSize: blob.size,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Crop error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!activeItem || !activeItem.processedBlob) return;
    const format = activeItem.config.targetFormat || "jpeg";
    const ext = format === "jpeg" ? "jpg" : format;
    const fileName = generateOutputFileName("crop", activeItem.originalFile.name, ext);

    const url = URL.createObjectURL(activeItem.processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <ImageDropzone
          onFilesSelected={handleFilesSelected}
          multiple={true}
          title="Select or drop images to crop"
          subtitle="Visual drag handles, popular aspect ratio presets (1:1, 16:9, Passport), and instant preview"
        />
      ) : (
        <div className="space-y-6">
          {/* Top Multi-item Selector Bar if multiple images */}
          {items.length > 1 && (
            <div className="flex items-center justify-between p-3 rounded-2xl border border-border/80 bg-card overflow-x-auto gap-2">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Images ({items.length}):</span>
                </span>
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      idx === selectedIndex
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-secondary text-secondary-foreground border-border/60 hover:bg-secondary/80"
                    }`}
                  >
                    {idx + 1}. {item.cleanName.substring(0, 12)}...
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedIndex === 0}
                  onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedIndex === items.length - 1}
                  onClick={() => setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1))}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Cropper Container */}
          {activeItem && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground truncate max-w-sm">
                      {activeItem.originalFile.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Original: {activeItem.originalWidth} &times; {activeItem.originalHeight} px &bull; {formatBytes(activeItem.originalSize)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={processCrop}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 min-h-[38px]"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Crop className="w-3.5 h-3.5" />
                    )}
                    <span>Apply Crop</span>
                  </button>
                </div>

                {/* Draggable interactive cropper */}
                <InteractiveCropper
                  imageSrc={activeItem.originalUrl}
                  originalWidth={activeItem.originalWidth}
                  originalHeight={activeItem.originalHeight}
                  cropRect={activeItem.config.crop || null}
                  onCropChange={handleCropChange}
                />
              </div>

              {/* Live Preview & Download Panel */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/60 pb-2">
                    Crop Preview
                  </h4>

                  {activeItem.processedUrl ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-border/60 max-h-56 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeItem.processedUrl}
                          alt="Cropped preview"
                          className="max-h-52 object-contain rounded"
                        />
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Output Resolution:</span>
                          <span className="font-bold text-foreground">
                            {activeItem.processedWidth} &times; {activeItem.processedHeight} px
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Output Size:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatBytes(activeItem.processedSize || 0)}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground truncate pt-1">
                          File: {generateOutputFileName("crop", activeItem.originalFile.name, "jpg")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground space-y-2">
                      <Crop className="w-6 h-6 mx-auto text-muted-foreground/60" />
                      <p>Adjust the crop box and click &ldquo;Apply Crop&rdquo; to view the preview.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!activeItem.processedBlob}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40 min-h-[42px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Cropped Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      items.forEach((i) => {
                        URL.revokeObjectURL(i.originalUrl);
                        if (i.processedUrl) URL.revokeObjectURL(i.processedUrl);
                      });
                      setItems([]);
                    }}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1"
                  >
                    Upload New Images
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
