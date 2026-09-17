"use client";

import React from "react";
import {
  Download,
  FileArchive,
  FileText,
  Play,
  Trash2,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { ImageFormat } from "@/lib/image/types";

interface BulkActionHeaderProps {
  itemCount: number;
  isProcessingAll: boolean;
  onProcessAll: () => void;
  onDownloadAllZip: () => void;
  onExportToPdf: () => void;
  onClearAll: () => void;
  onBatchApplyTargetKb?: (kb: number | null) => void;
  onBatchApplyFormat?: (format: ImageFormat) => void;
  hasProcessedItems: boolean;
}

export const BulkActionHeader: React.FC<BulkActionHeaderProps> = ({
  itemCount,
  isProcessingAll,
  onProcessAll,
  onDownloadAllZip,
  onExportToPdf,
  onClearAll,
  onBatchApplyTargetKb,
  onBatchApplyFormat,
  hasProcessedItems,
}) => {
  if (itemCount === 0) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Count & Info */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {itemCount}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              {itemCount} {itemCount === 1 ? "Image" : "Images"} in Queue
            </h4>
            <p className="text-xs text-muted-foreground">
              Customize each image independently below or apply actions in bulk.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onProcessAll}
            disabled={isProcessingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 min-h-[38px]"
          >
            {isProcessingAll ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isProcessingAll ? "Processing..." : "Process All"}</span>
          </button>

          <button
            type="button"
            onClick={onDownloadAllZip}
            disabled={!hasProcessedItems || isProcessingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border/80 transition-all disabled:opacity-40 min-h-[38px]"
            title="Download all processed files in a single ZIP"
          >
            <FileArchive className="w-3.5 h-3.5 text-primary" />
            <span>Download ZIP</span>
          </button>

          <button
            type="button"
            onClick={onExportToPdf}
            disabled={!hasProcessedItems || isProcessingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 border border-border/80 transition-all disabled:opacity-40 min-h-[38px]"
            title="Combine all images into a single PDF document"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Export to PDF</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            disabled={isProcessingAll}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all min-h-[38px]"
            title="Clear all images"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Batch Preset Shortcuts */}
      {(onBatchApplyTargetKb || onBatchApplyFormat) && (
        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Apply to All:</span>
          </span>

          {onBatchApplyTargetKb && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-muted-foreground">Target Size:</span>
              {[50, 100, 200, 500].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => onBatchApplyTargetKb(kb)}
                  className="px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-primary/20 hover:text-primary text-[11px] font-medium border border-border/60 transition-colors"
                >
                  &lt; {kb} KB
                </button>
              ))}
              <button
                type="button"
                onClick={() => onBatchApplyTargetKb(null)}
                className="px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-secondary text-[11px] font-medium border border-border/60 transition-colors text-muted-foreground"
              >
                Auto
              </button>
            </div>
          )}

          {onBatchApplyFormat && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">Format:</span>
              {(["jpeg", "png", "webp"] as ImageFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onBatchApplyFormat(fmt)}
                  className="px-2 py-0.5 rounded-md bg-secondary/80 hover:bg-primary/20 hover:text-primary text-[11px] font-medium border border-border/60 transition-colors uppercase"
                >
                  {fmt === "jpeg" ? "JPG" : fmt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
