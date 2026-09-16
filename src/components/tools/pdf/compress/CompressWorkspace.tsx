"use client";

import React, { useState } from "react";
import { PdfDropzone } from "../common/PdfDropzone";
import { compressPdf, COMPRESSION_PRESETS, CompressionPreset } from "@/lib/pdf/compress-engine";
import { formatBytes } from "@/lib/pdf/page-geometry";
import { getPdfJs } from "@/lib/pdf/pdfjs-loader";
import {
  Download,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  RefreshCw,
  FileText,
  Sliders,
} from "lucide-react";

export const CompressWorkspace: React.FC = () => {
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  // Settings
  const [selectedPreset, setSelectedPreset] = useState<string>("recommended");
  const [customDpi, setCustomDpi] = useState<number>(150);
  const [customQuality, setCustomQuality] = useState<number>(75);

  // Compression state
  const [isCompressing, setIsCompressing] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{ current: number; total: number; pct: number }>({
    current: 0,
    total: 0,
    pct: 0,
  });

  // Result state
  const [compressedResult, setCompressedResult] = useState<{
    url: string;
    size: number;
    ratio: number;
  } | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    setFileSize(file.size);

    const buffer = await file.arrayBuffer();
    setFileBuffer(buffer);

    try {
      const pdfjs = await getPdfJs();
      const doc = await pdfjs.getDocument({ data: buffer.slice(0) }).promise;
      setPageCount(doc.numPages);
    } catch (e) {
      console.error(e);
    }

    setCompressedResult(null);
  };

  const handleStartCompression = async () => {
    if (!fileBuffer) return;
    setIsCompressing(true);
    setCompressedResult(null);

    let targetDpi = customDpi;
    let targetQuality = customQuality / 100;

    if (selectedPreset !== "custom") {
      const p = COMPRESSION_PRESETS[selectedPreset];
      targetDpi = p.targetDpi;
      targetQuality = p.quality;
    }

    try {
      const result = await compressPdf(
        fileBuffer.slice(0),
        targetDpi,
        targetQuality,
        (progress) => {
          setProgressInfo({
            current: progress.currentPage,
            total: progress.totalPages,
            pct: progress.percentage,
          });
        }
      );

      const blob = new Blob([result.compressedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setCompressedResult({
        url,
        size: result.compressedSize,
        ratio: result.ratio,
      });
    } catch (err) {
      console.error("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setFileBuffer(null);
    setFileName("");
    setFileSize(0);
    setPageCount(0);
    setCompressedResult(null);
  };

  return (
    <div className="space-y-8">
      {!fileBuffer ? (
        <PdfDropzone
          onFilesSelected={handleFile}
          multiple={false}
          title="Select a PDF to compress"
          subtitle="Reduce PDF file size while maintaining sharp text and visual clarity—100% locally in your browser."
        />
      ) : (
        <div className="space-y-6">
          {/* File Overview Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
                  {fileName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Original: <span className="font-semibold text-foreground">{formatBytes(fileSize)}</span> • {pageCount} Pages
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border rounded-xl transition-colors self-start sm:self-center"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          {/* Preset Selector */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Compression Level
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {Object.values(COMPRESSION_PRESETS).map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset.id);
                      setCompressedResult(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-foreground">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>DPI: {preset.targetDpi}</span>
                      <span>Quality: {Math.round(preset.quality * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Mode Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPreset("custom");
                  setCompressedResult(null);
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors ${
                  selectedPreset === "custom"
                    ? "bg-card text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Custom DPI &amp; Quality</span>
              </button>

              {selectedPreset === "custom" && (
                <div className="mt-3 p-4 bg-secondary/30 border border-border rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground flex justify-between mb-1">
                      <span>Target Resolution (DPI):</span>
                      <span className="font-mono font-bold text-primary">{customDpi} DPI</span>
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={300}
                      step={10}
                      value={customDpi}
                      onChange={(e) => setCustomDpi(parseInt(e.target.value, 10))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground flex justify-between mb-1">
                      <span>JPEG Compression Quality:</span>
                      <span className="font-mono font-bold text-primary">{customQuality}%</span>
                    </label>
                    <input
                      type="range"
                      min={30}
                      max={95}
                      step={5}
                      value={customQuality}
                      onChange={(e) => setCustomQuality(parseInt(e.target.value, 10))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action or Result Card */}
          {compressedResult ? (
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-card to-card border border-emerald-500/30 rounded-3xl shadow-lg space-y-5 animate-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      <span>{compressedResult.ratio}% Size Reduction</span>
                    </div>
                    <h4 className="text-base font-bold text-foreground mt-1">
                      Optimization Complete!
                    </h4>
                  </div>
                </div>

                <a
                  href={compressedResult.url}
                  download={`compressed_${fileName}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Compressed PDF</span>
                </a>
              </div>

              {/* Size metrics comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-card border border-border/80 rounded-xl">
                  <span className="text-muted-foreground block text-[11px]">Original Size</span>
                  <span className="text-sm font-bold text-foreground">{formatBytes(fileSize)}</span>
                </div>
                <div className="p-3 bg-card border border-emerald-500/30 rounded-xl">
                  <span className="text-muted-foreground block text-[11px]">Compressed Size</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(compressedResult.size)}
                  </span>
                </div>
                <div className="p-3 bg-card border border-border/80 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-muted-foreground block text-[11px]">Saved</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatBytes(fileSize - compressedResult.size)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-card border border-border rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Optimize Document Streams &amp; Images
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Estimated reduction: 40% - 80% depending on embedded images
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartCompression}
                disabled={isCompressing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
              >
                {isCompressing ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>
                      Compressing page {progressInfo.current} of {progressInfo.total} ({progressInfo.pct}%)
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Compress PDF Now</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
