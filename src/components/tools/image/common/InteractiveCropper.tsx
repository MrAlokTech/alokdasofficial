"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { CropRect, AspectRatioPreset } from "@/lib/image/types";
import { Crop as CropIcon, Check, RotateCcw } from "lucide-react";

interface InteractiveCropperProps {
  imageSrc: string;
  originalWidth: number;
  originalHeight: number;
  cropRect: CropRect | null;
  onCropChange: (crop: CropRect | null) => void;
}

const PRESETS: { id: AspectRatioPreset; label: string; ratio?: number }[] = [
  { id: "free", label: "Freeform" },
  { id: "1:1", label: "1:1 Square", ratio: 1 },
  { id: "16:9", label: "16:9 Video", ratio: 16 / 9 },
  { id: "4:3", label: "4:3 Standard", ratio: 4 / 3 },
  { id: "9:16", label: "9:16 Story", ratio: 9 / 16 },
  { id: "3:2", label: "3:2 Photo", ratio: 3 / 2 },
  { id: "passport", label: "Passport (3.5:4.5)", ratio: 3.5 / 4.5 },
];

export const InteractiveCropper: React.FC<InteractiveCropperProps> = ({
  imageSrc,
  originalWidth,
  originalHeight,
  cropRect,
  onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<AspectRatioPreset>("free");

  // Normalized crop rectangle in percentage (0 to 100)
  const [crop, setCrop] = useState<{ x: number; y: number; w: number; h: number }>(() => {
    if (cropRect) {
      return {
        x: (cropRect.x / originalWidth) * 100,
        y: (cropRect.y / originalHeight) * 100,
        w: (cropRect.width / originalWidth) * 100,
        h: (cropRect.height / originalHeight) * 100,
      };
    }
    return { x: 5, y: 5, w: 90, h: 90 };
  });

  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const dragStartPos = useRef<{ clientX: number; clientY: number; crop: typeof crop }>({
    clientX: 0,
    clientY: 0,
    crop,
  });

  // Calculate actual pixel width/height of crop
  const pixelW = Math.round((crop.w / 100) * originalWidth);
  const pixelH = Math.round((crop.h / 100) * originalHeight);

  // Sync to parent
  const emitCrop = useCallback(
    (newCrop: typeof crop) => {
      const x = Math.round((newCrop.x / 100) * originalWidth);
      const y = Math.round((newCrop.y / 100) * originalHeight);
      const width = Math.round((newCrop.w / 100) * originalWidth);
      const height = Math.round((newCrop.h / 100) * originalHeight);
      onCropChange({ x, y, width, height });
    },
    [originalWidth, originalHeight, onCropChange]
  );

  const applyPreset = (preset: AspectRatioPreset) => {
    setSelectedPreset(preset);
    const item = PRESETS.find((p) => p.id === preset);
    if (!item || !item.ratio) {
      return;
    }

    const targetRatio = item.ratio;
    const imgRatio = originalWidth / originalHeight;

    let newW = 80;
    let newH = 80;

    if (targetRatio > imgRatio) {
      // Crop is wider than image
      newW = 90;
      newH = (newW * originalWidth) / (targetRatio * originalHeight);
    } else {
      newH = 90;
      newW = (newH * originalHeight * targetRatio) / originalWidth;
    }

    const newCrop = {
      x: Math.max(0, (100 - newW) / 2),
      y: Math.max(0, (100 - newH) / 2),
      w: Math.min(100, newW),
      h: Math.min(100, newH),
    };

    setCrop(newCrop);
    emitCrop(newCrop);
  };

  const handleReset = () => {
    const fullCrop = { x: 0, y: 0, w: 100, h: 100 };
    setCrop(fullCrop);
    setSelectedPreset("free");
    emitCrop(fullCrop);
  };

  const handleMouseDown = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(handle);
    dragStartPos.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      crop: { ...crop },
    };
  };

  const handleTouchStart = (handle: string, e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.stopPropagation();
      setActiveDrag(handle);
      dragStartPos.current = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        crop: { ...crop },
      };
    }
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!activeDrag || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((clientX - dragStartPos.current.clientX) / rect.width) * 100;
      const deltaYPercent = ((clientY - dragStartPos.current.clientY) / rect.height) * 100;
      const start = dragStartPos.current.crop;

      let nextCrop = { ...start };

      if (activeDrag === "move") {
        nextCrop.x = Math.max(0, Math.min(100 - start.w, start.x + deltaXPercent));
        nextCrop.y = Math.max(0, Math.min(100 - start.h, start.y + deltaYPercent));
      } else if (activeDrag === "br") {
        nextCrop.w = Math.max(10, Math.min(100 - start.x, start.w + deltaXPercent));
        nextCrop.h = Math.max(10, Math.min(100 - start.y, start.h + deltaYPercent));
      } else if (activeDrag === "tl") {
        const potentialX = Math.max(0, Math.min(start.x + start.w - 10, start.x + deltaXPercent));
        const potentialY = Math.max(0, Math.min(start.y + start.h - 10, start.y + deltaYPercent));
        nextCrop.w = start.x + start.w - potentialX;
        nextCrop.h = start.y + start.h - potentialY;
        nextCrop.x = potentialX;
        nextCrop.y = potentialY;
      } else if (activeDrag === "tr") {
        nextCrop.w = Math.max(10, Math.min(100 - start.x, start.w + deltaXPercent));
        const potentialY = Math.max(0, Math.min(start.y + start.h - 10, start.y + deltaYPercent));
        nextCrop.h = start.y + start.h - potentialY;
        nextCrop.y = potentialY;
      } else if (activeDrag === "bl") {
        const potentialX = Math.max(0, Math.min(start.x + start.w - 10, start.x + deltaXPercent));
        nextCrop.w = start.x + start.w - potentialX;
        nextCrop.x = potentialX;
        nextCrop.h = Math.max(10, Math.min(100 - start.y, start.h + deltaYPercent));
      }

      setCrop(nextCrop);
      emitCrop(nextCrop);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnd = () => setActiveDrag(null);

    if (activeDrag) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [activeDrag, emitCrop]);

  return (
    <div className="space-y-4">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Ratio:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedPreset === preset.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Full</span>
        </button>
      </div>

      {/* Visual Crop Box Area */}
      <div
        ref={containerRef}
        className="relative w-full max-h-[500px] overflow-hidden rounded-2xl bg-neutral-900 border border-border/80 flex items-center justify-center select-none"
        style={{ minHeight: "300px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Source to crop"
          className="w-full h-full object-contain pointer-events-none max-h-[500px]"
        />

        {/* Dark Dim Overlays */}
        {/* Top */}
        <div
          className="absolute left-0 top-0 right-0 bg-black/60 pointer-events-none"
          style={{ height: `${crop.y}%` }}
        />
        {/* Bottom */}
        <div
          className="absolute left-0 bottom-0 right-0 bg-black/60 pointer-events-none"
          style={{ height: `${100 - crop.y - crop.h}%` }}
        />
        {/* Left */}
        <div
          className="absolute left-0 bg-black/60 pointer-events-none"
          style={{
            top: `${crop.y}%`,
            height: `${crop.h}%`,
            width: `${crop.x}%`,
          }}
        />
        {/* Right */}
        <div
          className="absolute right-0 bg-black/60 pointer-events-none"
          style={{
            top: `${crop.y}%`,
            height: `${crop.h}%`,
            width: `${100 - crop.x - crop.w}%`,
          }}
        />

        {/* Active Crop Box with Handles */}
        <div
          onMouseDown={(e) => handleMouseDown("move", e)}
          onTouchStart={(e) => handleTouchStart("move", e)}
          className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] cursor-move transition-shadow"
          style={{
            left: `${crop.x}%`,
            top: `${crop.y}%`,
            width: `${crop.w}%`,
            height: `${crop.h}%`,
          }}
        >
          {/* Rule of Thirds Grid Lines */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-white/25" />
            <div className="border-r border-white/25" />
            <div />
          </div>

          {/* Corner Handles */}
          <div
            onMouseDown={(e) => handleMouseDown("tl", e)}
            onTouchStart={(e) => handleTouchStart("tl", e)}
            className="absolute -top-2 -left-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-md"
          />
          <div
            onMouseDown={(e) => handleMouseDown("tr", e)}
            onTouchStart={(e) => handleTouchStart("tr", e)}
            className="absolute -top-2 -right-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nesw-resize shadow-md"
          />
          <div
            onMouseDown={(e) => handleMouseDown("bl", e)}
            onTouchStart={(e) => handleTouchStart("bl", e)}
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nesw-resize shadow-md"
          />
          <div
            onMouseDown={(e) => handleMouseDown("br", e)}
            onTouchStart={(e) => handleTouchStart("br", e)}
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-md"
          />

          {/* Dimension badge badge overlay */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[11px] font-mono font-semibold text-white pointer-events-none backdrop-blur-xs">
            {pixelW} &times; {pixelH} px
          </div>
        </div>
      </div>
    </div>
  );
};
