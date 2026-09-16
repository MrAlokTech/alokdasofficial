"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface PageRangeInputProps {
  totalPages: number;
  onApplySelection: (selectedIndices: number[]) => void;
}

/**
 * Parses user input like "1-3, 5, 8-10" into 0-indexed page numbers [0, 1, 2, 4, 7, 8, 9]
 */
export function parseRangeString(input: string, totalPages: number): number[] {
  const clean = input.trim();
  if (!clean) return [];

  const parts = clean.split(",");
  const indices = new Set<number>();

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        indices.add(num - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

export const PageRangeInput: React.FC<PageRangeInputProps> = ({
  totalPages,
  onApplySelection,
}) => {
  const [rangeText, setRangeText] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseRangeString(rangeText, totalPages);
    onApplySelection(result);
  };

  const selectPreset = (type: "all" | "none" | "even" | "odd") => {
    const result: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      const pageNumber = i + 1;
      if (type === "all") result.push(i);
      else if (type === "even" && pageNumber % 2 === 0) result.push(i);
      else if (type === "odd" && pageNumber % 2 !== 0) result.push(i);
    }
    onApplySelection(result);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-secondary/50 border border-border/80 rounded-2xl">
      <form onSubmit={handleApply} className="flex items-center gap-2 flex-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={rangeText}
            onChange={(e) => setRangeText(e.target.value)}
            placeholder={`Range (e.g. 1-3, 5, 8-${Math.min(10, totalPages)})`}
            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="h-9 px-3 text-xs font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          Select Range
        </button>
      </form>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
          <SlidersHorizontal className="h-3 w-3" /> Quick:
        </span>
        <button
          type="button"
          onClick={() => selectPreset("all")}
          className="px-2 py-1 text-[11px] font-medium bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-colors"
        >
          All ({totalPages})
        </button>
        <button
          type="button"
          onClick={() => selectPreset("odd")}
          className="px-2 py-1 text-[11px] font-medium bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-colors"
        >
          Odd
        </button>
        <button
          type="button"
          onClick={() => selectPreset("even")}
          className="px-2 py-1 text-[11px] font-medium bg-card hover:bg-muted border border-border rounded-lg text-foreground transition-colors"
        >
          Even
        </button>
        <button
          type="button"
          onClick={() => selectPreset("none")}
          className="px-2 py-1 text-[11px] font-medium bg-card hover:bg-muted border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
