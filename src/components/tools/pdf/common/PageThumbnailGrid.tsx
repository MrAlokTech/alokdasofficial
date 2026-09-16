"use client";

import React from "react";
import { RotateCw, Trash2, Copy, ChevronLeft, ChevronRight, Check } from "lucide-react";

export interface PageItem {
  id: string;
  sourceFileId: string;
  sourceFileName: string;
  sourcePageIndex: number;
  rotation: number;
  thumbnailUrl: string;
  selected?: boolean;
}

interface PageThumbnailGridProps {
  pages: PageItem[];
  onRotatePage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onMovePage: (fromIndex: number, toIndex: number) => void;
  onToggleSelect?: (id: string) => void;
  showSelection?: boolean;
}

export const PageThumbnailGrid: React.FC<PageThumbnailGridProps> = ({
  pages,
  onRotatePage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  onToggleSelect,
  showSelection = false,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {pages.map((page, index) => {
        return (
          <div
            key={page.id}
            className={`group relative flex flex-col bg-card border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${
              page.selected
                ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                : "border-border/80 hover:border-border"
            }`}
          >
            {/* Header with index badge and selection */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-muted/40 border-b border-border/40 text-[11px] font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {showSelection && (
                  <button
                    type="button"
                    onClick={() => onToggleSelect && onToggleSelect(page.id)}
                    className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                      page.selected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40 hover:border-primary"
                    }`}
                  >
                    {page.selected && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                )}
                <span className="font-mono font-semibold text-foreground">
                  #{index + 1}
                </span>
              </div>
              <span
                className="truncate max-w-[80px] text-[10px] text-muted-foreground/80"
                title={`${page.sourceFileName} (p. ${page.sourcePageIndex})`}
              >
                p.{page.sourcePageIndex}
              </span>
            </div>

            {/* Thumbnail Canvas / Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-2 overflow-hidden">
              {page.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.thumbnailUrl}
                  alt={`Page ${index + 1}`}
                  className="max-h-full max-w-full object-contain shadow-sm transition-transform duration-200"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground text-xs animate-pulse">
                  <span>Rendering...</span>
                </div>
              )}

              {/* Quick Hover Reorder Buttons */}
              <div className="absolute inset-x-1 bottom-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMovePage(index, index - 1)}
                  className="p-1 rounded-md bg-background/90 hover:bg-background text-foreground shadow disabled:opacity-30 disabled:pointer-events-none"
                  title="Move left"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === pages.length - 1}
                  onClick={() => onMovePage(index, index + 1)}
                  className="p-1 rounded-md bg-background/90 hover:bg-background text-foreground shadow disabled:opacity-30 disabled:pointer-events-none"
                  title="Move right"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-around py-1.5 px-1 bg-card border-t border-border/40 text-muted-foreground">
              <button
                type="button"
                onClick={() => onRotatePage(page.id)}
                className="p-1.5 hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDuplicatePage(page.id)}
                className="p-1.5 hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                title="Duplicate page"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeletePage(page.id)}
                className="p-1.5 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete page"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
