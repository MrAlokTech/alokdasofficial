"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, PenTool, Type, Upload, Trash2, Check, Sparkles } from "lucide-react";
import { getSavedSignatures, saveSignature, deleteSavedSignature, SavedSignature } from "@/lib/pdf/storage";

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureReady: (dataUrl: string) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSignatureReady,
}) => {
  const [tab, setTab] = useState<"draw" | "type" | "upload" | "saved">("draw");
  const [inkColor, setInkColor] = useState<string>("#0f172a");
  const [lineWidth, setLineWidth] = useState<number>(2.5);
  const [saveToLibrary, setSaveToLibrary] = useState<boolean>(true);

  // Draw state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Type state
  const [typedName, setTypedName] = useState<string>("Alok Das");
  const [fontIndex, setFontIndex] = useState<number>(0);

  // Saved signatures state
  const [savedSigs, setSavedSigs] = useState<SavedSignature[]>([]);

  // Font options for typed signatures
  const cursiveFonts = [
    { name: "Elegant Script", style: "italic font-serif tracking-wide" },
    { name: "Modern Brush", style: "italic font-sans font-light tracking-widest" },
    { name: "Classic Formal", style: "italic font-mono uppercase tracking-widest" },
    { name: "Executive Signature", style: "font-serif tracking-normal" },
  ];

  useEffect(() => {
    if (isOpen) {
      setSavedSigs(getSavedSignatures());
    }
  }, [isOpen]);

  // Handle canvas drawing setup
  useEffect(() => {
    if (tab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [tab]);

  if (!isOpen) return null;

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Convert typed name to transparent PNG
  const renderTypedSignature = (): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = inkColor;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Calligraphic styling
    ctx.font = "italic 48px Georgia, 'Times New Roman', serif";
    if (fontIndex === 1) ctx.font = "italic 44px 'Brush Script MT', cursive, sans-serif";
    if (fontIndex === 2) ctx.font = "italic 38px 'Palatino Linotype', serif";
    if (fontIndex === 3) ctx.font = "italic 42px 'Great Vibes', cursive, serif";

    ctx.fillText(typedName || "Signature", 300, 100);

    // Decorative baseline flourish
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 140);
    ctx.bezierCurveTo(200, 145, 400, 135, 500, 138);
    ctx.stroke();

    return canvas.toDataURL("image/png");
  };

  // Remove white background from uploaded signature
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Auto background removal: Light pixels become transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 210) {
            data[i + 3] = 0; // Transparent
          } else {
            // Darken ink
            data[i] = Math.min(r, 40);
            data[i + 1] = Math.min(g, 40);
            data[i + 2] = Math.min(b, 50);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL("image/png");

        if (saveToLibrary) {
          saveSignature(file.name.replace(/\.[^/.]+$/, ""), transparentDataUrl);
        }
        onSignatureReady(transparentDataUrl);
        onClose();
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    let finalUrl = "";
    if (tab === "draw") {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      finalUrl = canvas.toDataURL("image/png");
    } else if (tab === "type") {
      finalUrl = renderTypedSignature();
    }

    if (finalUrl) {
      if (saveToLibrary) {
        saveSignature(tab === "type" ? typedName : "Signature", finalUrl);
      }
      onSignatureReady(finalUrl);
      onClose();
    }
  };

  const handleSelectSaved = (sig: SavedSignature) => {
    onSignatureReady(sig.dataUrl);
    onClose();
  };

  const handleDeleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSavedSignature(id);
    setSavedSigs(getSavedSignatures());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <PenTool className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Signature Studio</h3>
              <p className="text-xs text-muted-foreground">Create or choose a signature to stamp</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-border/50 bg-secondary/30 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab("draw")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              tab === "draw"
                ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Draw</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("type")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              tab === "type"
                ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            <span>Type</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              tab === "upload"
                ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Image</span>
          </button>
          {savedSigs.length > 0 && (
            <button
              type="button"
              onClick={() => setTab("saved")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                tab === "saved"
                  ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Saved ({savedSigs.length})</span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {tab === "draw" && (
            <div className="space-y-4">
              {/* Canvas area */}
              <div className="relative border border-dashed border-border rounded-2xl bg-neutral-50 dark:bg-neutral-950 overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={190}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[190px] touch-none cursor-crosshair"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-muted-foreground/40 text-sm italic font-serif">
                    Sign here with your finger or mouse
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Ink:</span>
                  {[
                    { label: "Black", color: "#0f172a" },
                    { label: "Blue", color: "#1d4ed8" },
                    { label: "Red", color: "#b91c1c" },
                  ].map((ink) => (
                    <button
                      key={ink.color}
                      type="button"
                      onClick={() => setInkColor(ink.color)}
                      style={{ backgroundColor: ink.color }}
                      className={`h-6 w-6 rounded-full border transition-transform ${
                        inkColor === ink.color ? "scale-110 ring-2 ring-primary ring-offset-2" : "opacity-80"
                      }`}
                      title={ink.label}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    Clear pad
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "type" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Enter your full name:
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Alok Das"
                  className="w-full h-10 px-3 text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Choose script style:</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {cursiveFonts.map((font, idx) => (
                    <div
                      key={font.name}
                      onClick={() => setFontIndex(idx)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        fontIndex === idx
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-muted-foreground/40 bg-card"
                      }`}
                    >
                      <div className="text-[10px] text-muted-foreground mb-1">{font.name}</div>
                      <div
                        className={`text-xl truncate ${font.style}`}
                        style={{ color: inkColor }}
                      >
                        {typedName || "Signature"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "upload" && (
            <div className="space-y-4 text-center py-4">
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 bg-secondary/20 transition-all">
                <Upload className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-semibold text-foreground">
                  Upload signature photo
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Supports PNG, JPG, or WEBP. Light backgrounds are automatically turned transparent.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {tab === "saved" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {savedSigs.map((sig) => (
                  <div
                    key={sig.id}
                    onClick={() => handleSelectSaved(sig)}
                    className="group relative p-3 rounded-2xl border border-border bg-card hover:border-primary cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sig.dataUrl}
                      alt={sig.name}
                      className="max-h-16 object-contain"
                    />
                    <span className="text-[10px] text-muted-foreground mt-2 truncate w-full text-center">
                      {sig.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSaved(e, sig.id)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete signature"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          {tab !== "saved" && tab !== "upload" ? (
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={saveToLibrary}
                onChange={(e) => setSaveToLibrary(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>Save for future documents</span>
            </label>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
            >
              Cancel
            </button>
            {tab !== "saved" && tab !== "upload" && (
              <button
                type="button"
                onClick={handleApply}
                disabled={tab === "draw" && !hasDrawn}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Use Signature</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
