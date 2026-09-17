import React, { useState } from "react";
import { RotateCw, Trash2, Copy, ChevronLeft, ChevronRight, Check, GripVertical } from "lucide-react";

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Ref to track touch dragging state across window events
  const touchStateRef = React.useRef<{
    fromIndex: number;
    activeTargetIndex: number | null;
  } | null>(null);

  // Desktop HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMovePage(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>, index: number) => {
    // Only engage if single finger touch
    if (e.touches.length !== 1) return;
    touchStateRef.current = { fromIndex: index, activeTargetIndex: null };
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLSpanElement>) => {
    if (!touchStateRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    // Detect card element under current touch position
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = elem?.closest("[data-page-index]");
    if (card) {
      const targetIdxStr = card.getAttribute("data-page-index");
      if (targetIdxStr !== null) {
        const targetIdx = parseInt(targetIdxStr, 10);
        if (!isNaN(targetIdx)) {
          touchStateRef.current.activeTargetIndex = targetIdx;
          setDragOverIndex(targetIdx);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStateRef.current) {
      const { fromIndex, activeTargetIndex } = touchStateRef.current;
      if (activeTargetIndex !== null && fromIndex !== activeTargetIndex) {
        onMovePage(fromIndex, activeTargetIndex);
      }
    }
    touchStateRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {pages.map((page, index) => {
        const isBeingDragged = draggedIndex === index;
        const isDropTarget = dragOverIndex === index && draggedIndex !== index;

        return (
          <div
            key={page.id}
            data-page-index={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={() => {
              if (dragOverIndex === index) setDragOverIndex(null);
            }}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative flex flex-col bg-card border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm cursor-grab active:cursor-grabbing ${
              isBeingDragged
                ? "opacity-30 scale-95 border-dashed border-primary"
                : isDropTarget
                ? "border-primary ring-2 ring-primary scale-105 shadow-lg"
                : page.selected
                ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                : "border-border/80 hover:border-border hover:shadow-md"
            }`}
          >
            {/* Header with drag handle, index badge, and selection */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-muted/40 border-b border-border/40 text-[11px] font-medium text-muted-foreground select-none">
              <div className="flex items-center gap-1.5">
                <span
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className="p-1 -ml-1 text-muted-foreground/60 hover:text-foreground active:text-primary cursor-grab active:cursor-grabbing touch-none select-none"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </span>
                {showSelection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect && onToggleSelect(page.id);
                    }}
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
                className="truncate max-w-[75px] text-[10px] text-muted-foreground/80"
                title={`${page.sourceFileName} (p. ${page.sourcePageIndex})`}
              >
                p.{page.sourcePageIndex}
              </span>
            </div>

            {/* Thumbnail Canvas / Image */}
            <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-2 overflow-hidden pointer-events-none">
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
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-around py-1.5 px-1 bg-card border-t border-border/40 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
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
                disabled={index === 0}
                onClick={() => onMovePage(index, index - 1)}
                className="p-1.5 hover:text-foreground hover:bg-muted/80 rounded-lg disabled:opacity-20 transition-colors"
                title="Move left"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={index === pages.length - 1}
                onClick={() => onMovePage(index, index + 1)}
                className="p-1.5 hover:text-foreground hover:bg-muted/80 rounded-lg disabled:opacity-20 transition-colors"
                title="Move right"
              >
                <ChevronRight className="h-3.5 w-3.5" />
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

