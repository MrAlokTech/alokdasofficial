"use client";

import React, { useState } from "react";
import { ImageDropzone } from "../common/ImageDropzone";
import { ProcessedImageItem, PdfExportOptions } from "@/lib/image/types";
import { loadImage, formatBytes } from "@/lib/image/canvas-utils";
import { exportImagesToPdf } from "@/lib/image/pdf-exporter";
import { generatePdfFileName } from "@/lib/image/file-naming";
import {
  FileText,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

export const ImageToPdfWorkspace: React.FC = () => {
  const [items, setItems] = useState<ProcessedImageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [customTitle, setCustomTitle] = useState<string>("");

  // Layout options
  const [pageSize, setPageSize] = useState<PdfExportOptions["pageSize"]>("a4");
  const [orientation, setOrientation] = useState<PdfExportOptions["orientation"]>("auto");
  const [margin, setMargin] = useState<PdfExportOptions["margin"]>("normal");
  const [quality, setQuality] = useState<number>(85);

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
          config: {},
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load file for PDF:", file.name, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setPdfBlob(null);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    setItems((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setPdfBlob(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      return prev.filter((i) => i.id !== id);
    });
    setPdfBlob(null);
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfItems = items.map((i) => ({
        blobOrUrl: i.originalFile,
        width: i.originalWidth,
        height: i.originalHeight,
      }));

      const blob = await exportImagesToPdf(pdfItems, {
        pageSize,
        orientation,
        margin,
        imageQuality: quality,
      });

      setPdfBlob(blob);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const fileName = generatePdfFileName(customTitle.trim() || undefined);
    const url = URL.createObjectURL(pdfBlob);
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
      {/* PDF Document Options */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              PDF Layout &amp; Page Setup
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            Client-side assembly via pdf-lib
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Page Size */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Page Format</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value as PdfExportOptions["pageSize"]);
                setPdfBlob(null);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
            >
              <option value="a4">ISO A4 (Standard)</option>
              <option value="letter">US Letter</option>
              <option value="fit">Auto-fit to Image Bounds</option>
            </select>
          </div>

          {/* Orientation */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => {
                setOrientation(e.target.value as PdfExportOptions["orientation"]);
                setPdfBlob(null);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
            >
              <option value="auto">Auto (Match Image Aspect)</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          {/* Margins */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">Page Margins</label>
            <select
              value={margin}
              onChange={(e) => {
                setMargin(e.target.value as PdfExportOptions["margin"]);
                setPdfBlob(null);
              }}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
            >
              <option value="normal">Normal (36 pt)</option>
              <option value="small">Small (20 pt)</option>
              <option value="none">Borderless (0 pt)</option>
            </select>
          </div>

          {/* Custom File Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground block">PDF Document Title</label>
            <input
              type="text"
              placeholder="e.g. portfolio_scans"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs"
            />
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        multiple={true}
        title="Drop images here to combine into a PDF"
        subtitle="Visual page reordering &bull; Customizable A4/Letter margins &bull; Zero uploads"
      />

      {/* Page Sequence List */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Page Sequence ({items.length} {items.length === 1 ? "page" : "pages"})
              </h4>
              <p className="text-xs text-muted-foreground">
                Reorder pages using the arrow buttons before generating the PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 min-h-[38px]"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                )}
                <span>{isGenerating ? "Compiling PDF..." : "Compile PDF"}</span>
              </button>

              {pdfBlob && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm min-h-[38px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF ({formatBytes(pdfBlob.size)})</span>
                </button>
              )}
            </div>
          </div>

          {/* Page Reordering Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-secondary/30 p-3 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                    Page {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, "up")}
                      className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                      title="Move earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, "down")}
                      className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                      title="Move later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Remove page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="h-36 rounded-lg overflow-hidden bg-background/60 border border-border/50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.originalUrl}
                    alt={item.cleanName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="text-[11px] text-muted-foreground truncate">
                  {item.originalFile.name}
                </div>
              </div>
            ))}
          </div>

          {pdfBlob && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  PDF created successfully &bull; {formatBytes(pdfBlob.size)} &bull; Output:{" "}
                  <code className="font-mono text-[11px]">
                    {generatePdfFileName(customTitle.trim() || undefined)}
                  </code>
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Now</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
