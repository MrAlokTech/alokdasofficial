"use client";

import React, { useState } from "react";
import {
  Download,
  Trash2,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ProcessedImageItem, ImageFormat } from "@/lib/image/types";
import { formatBytes } from "@/lib/image/canvas-utils";
import { generateOutputFileName } from "@/lib/image/file-naming";

interface ImagePreviewCardProps {
  item: ProcessedImageItem;
  toolName: string;
  onUpdateConfig: (id: string, updates: Partial<ProcessedImageItem["config"]>) => void;
  onProcessItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  item,
  toolName,
  onUpdateConfig,
  onProcessItem,
  onRemoveItem,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    id,
    originalFile,
    originalUrl,
    originalWidth,
    originalHeight,
    originalSize,
    cleanName,
    config,
    status,
    processedBlob,
    processedUrl,
    processedWidth,
    processedHeight,
    processedSize,
    errorMessage,
  } = item;

  // Calculate size change
  const hasSavings = processedSize && processedSize < originalSize;
  const savingsPercent =
    processedSize && originalSize
      ? Math.round(((originalSize - processedSize) / originalSize) * 100)
      : 0;

  const targetFormat = config.targetFormat || "jpeg";
  const outputFileName = generateOutputFileName(
    toolName,
    originalFile.name,
    targetFormat === "jpeg" ? "jpg" : targetFormat
  );

  const handleDownload = () => {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all hover:border-border">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Thumbnail */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary/40 border border-border/60 flex-shrink-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={processedUrl || originalUrl}
            alt={cleanName}
            className="w-full h-full object-contain"
          />
          {status === "processing" && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Info & Stats */}
        <div className="flex-1 min-w-0 space-y-1.5 w-full">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-bold text-foreground truncate" title={originalFile.name}>
              {originalFile.name}
            </h5>
            {status === "ready" && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready</span>
              </span>
            )}
            {status === "error" && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                <AlertCircle className="w-3 h-3" />
                <span>Failed</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div>
              <span className="text-muted-foreground/60">Original: </span>
              <span className="font-medium text-foreground">{formatBytes(originalSize)}</span>
              <span className="text-muted-foreground/50 ml-1">
                ({originalWidth} &times; {originalHeight})
              </span>
            </div>

            {status === "ready" && processedSize && (
              <div>
                <span className="text-muted-foreground/60">&rarr; Output: </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBytes(processedSize)}
                </span>
                {processedWidth && processedHeight && (
                  <span className="text-muted-foreground/50 ml-1">
                    ({processedWidth} &times; {processedHeight})
                  </span>
                )}
                {hasSavings && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    -{savingsPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Target filename preview */}
          <div className="text-[11px] text-muted-foreground/70 font-mono truncate">
            Out: {outputFileName}
          </div>

          {errorMessage && (
            <div className="text-xs text-destructive font-medium">{errorMessage}</div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Customize individual settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {status === "ready" && processedBlob ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
              title="Download processed file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onProcessItem(id)}
              disabled={status === "processing"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border/80 transition-all"
            >
              {status === "processing" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCw className="w-3.5 h-3.5" />
              )}
              <span>Process</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemoveItem(id)}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove from queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion: Independent Controls per Image */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-border/60 bg-secondary/15 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span>Independent Settings for this Image</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Overrides batch defaults
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Target Size in KB */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground block">
                Target File Size (KB)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Auto"
                  value={config.targetSizeKb ?? ""}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : null;
                    onUpdateConfig(id, { targetSizeKb: val });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border/80 bg-background text-foreground text-xs"
                />
                <span className="text-muted-foreground text-[11px]">KB</span>
              </div>
            </div>

            {/* Target Format */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground block">
                Target Format
              </label>
              <select
                value={targetFormat}
                onChange={(e) =>
                  onUpdateConfig(id, { targetFormat: e.target.value as ImageFormat })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-border/80 bg-background text-foreground text-xs"
              >
                <option value="jpeg">JPG / JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

            {/* Quality Slider (if no target size) */}
            {!config.targetSizeKb && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground">Quality</label>
                  <span className="text-[11px] font-mono">{config.quality ?? 80}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.quality ?? 80}
                  onChange={(e) =>
                    onUpdateConfig(id, { quality: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-primary h-1.5"
                />
              </div>
            )}

            {/* Custom Output Width */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground block">
                Output Width (px)
              </label>
              <input
                type="number"
                placeholder={`${originalWidth} (Auto)`}
                value={config.width ?? ""}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  onUpdateConfig(id, { width: val, maintainAspectRatio: true });
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border/80 bg-background text-foreground text-xs"
              >
              </input>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const currentRot = config.rotation || 0;
                  onUpdateConfig(id, { rotation: (currentRot + 90) % 360 });
                }}
                className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-secondary text-[11px] font-medium transition-colors inline-flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>Rotate 90&deg;</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateConfig(id, { flipH: !config.flipH })}
                className={`px-2.5 py-1 rounded-lg border border-border text-[11px] font-medium transition-colors ${
                  config.flipH ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"
                }`}
              >
                Flip H
              </button>
            </div>

            <button
              type="button"
              onClick={() => onProcessItem(id)}
              className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
            >
              Re-process this Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
