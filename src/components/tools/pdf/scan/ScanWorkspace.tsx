"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Wand2, Copy, Check, Sparkles, Download, Trash2, RotateCw, FileText, ChevronRight } from "lucide-react";
import { applyScannerFilter, ScannerFilterType } from "@/lib/pdf/image-filters";
import { calculatePageLayout, PageFormatKey, formatBytes } from "@/lib/pdf/page-geometry";
import { runOcr, OcrResult } from "@/lib/pdf/ocr-service";

interface ScannedPage {
  id: string;
  originalDataUrl: string;
  filteredDataUrl: string;
  filter: ScannerFilterType;
  width: number;
  height: number;
  ocrResult?: OcrResult;
  isOcrRunning?: boolean;
}

export const ScanWorkspace: React.FC = () => {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [pageFormat, setPageFormat] = useState<PageFormatKey>("A4");

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // OCR state
  const [globalOcrProgress, setGlobalOcrProgress] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Export state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generatedPdfSize, setGeneratedPdfSize] = useState<number>(0);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access denied or unavailable. You can still upload photos from your device.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    addScannedImage(dataUrl, canvas.width, canvas.height);
    stopCamera();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          addScannedImage(dataUrl, img.width, img.height);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const addScannedImage = (dataUrl: string, width: number, height: number) => {
    // Default to Magic Color for auto document enhancement
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    let filteredUrl = dataUrl;

    if (ctx) {
      const img = new Image();
      img.src = dataUrl;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, width, height);
      applyScannerFilter(imgData, "magic");
      ctx.putImageData(imgData, 0, 0);
      filteredUrl = canvas.toDataURL("image/jpeg", 0.9);
    }

    const newPage: ScannedPage = {
      id: "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      originalDataUrl: dataUrl,
      filteredDataUrl: filteredUrl,
      filter: "magic",
      width,
      height,
    };

    setPages((prev) => {
      const updated = [...prev, newPage];
      setActivePageIndex(updated.length - 1);
      return updated;
    });

    setDownloadUrl(null);
  };

  const handleApplyFilter = (filterType: ScannerFilterType) => {
    if (pages.length === 0) return;
    const target = pages[activePageIndex];
    if (!target) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = target.width;
      canvas.height = target.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      if (filterType !== "original") {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        applyScannerFilter(imgData, filterType);
        ctx.putImageData(imgData, 0, 0);
      }

      const updatedUrl = canvas.toDataURL("image/jpeg", 0.92);
      setPages((prev) =>
        prev.map((p, idx) =>
          idx === activePageIndex ? { ...p, filter: filterType, filteredDataUrl: updatedUrl } : p
        )
      );
    };
    img.src = target.originalDataUrl;
  };

  const handleRunOcr = async () => {
    if (pages.length === 0) return;
    const target = pages[activePageIndex];
    if (!target || target.isOcrRunning) return;

    setPages((prev) =>
      prev.map((p, idx) => (idx === activePageIndex ? { ...p, isOcrRunning: true } : p))
    );
    setGlobalOcrProgress(10);

    try {
      const res = await runOcr(target.filteredDataUrl, "eng", (progress) => {
        setGlobalOcrProgress(progress);
      });

      setPages((prev) =>
        prev.map((p, idx) =>
          idx === activePageIndex ? { ...p, ocrResult: res, isOcrRunning: false } : p
        )
      );
    } catch (err) {
      console.error("OCR error:", err);
      setPages((prev) =>
        prev.map((p, idx) => (idx === activePageIndex ? { ...p, isOcrRunning: false } : p))
      );
    } finally {
      setGlobalOcrProgress(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleGeneratePdf = async () => {
    if (pages.length === 0) return;
    setIsGeneratingPdf(true);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const pageItem of pages) {
        // Embed enhanced image
        const imgBytes = await fetch(pageItem.filteredDataUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(imgBytes);

        // Auto Page Layout calculation (A4 / Letter / Fit)
        const layout = calculatePageLayout(pageItem.width, pageItem.height, pageFormat);
        const pdfPage = pdfDoc.addPage([layout.pageWidth, layout.pageHeight]);

        pdfPage.drawImage(embeddedImg, {
          x: layout.imgX,
          y: layout.imgY,
          width: layout.drawWidth,
          height: layout.drawHeight,
        });

        // Embed invisible searchable OCR text layer if OCR was run
        if (pageItem.ocrResult && pageItem.ocrResult.words.length > 0) {
          const scaleX = layout.drawWidth / pageItem.width;
          const scaleY = layout.drawHeight / pageItem.height;

          for (const word of pageItem.ocrResult.words) {
            const wordX = layout.imgX + word.bbox.x0 * scaleX;
            // Invert Y coordinate for PDF space
            const wordY = layout.imgY + (pageItem.height - word.bbox.y1) * scaleY;
            const wordWidth = (word.bbox.x1 - word.bbox.x0) * scaleX;
            const wordHeight = (word.bbox.y1 - word.bbox.y0) * scaleY;

            const calculatedFontSize = Math.max(6, Math.min(32, wordHeight * 0.9));

            pdfPage.drawText(word.text, {
              x: wordX,
              y: wordY,
              size: calculatedFontSize,
              font,
              color: rgb(0, 0, 0),
              opacity: 0.0, // Invisible text layer for native search and selection!
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setGeneratedPdfSize(blob.size);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const activePage = pages[activePageIndex];

  return (
    <div className="space-y-8">
      {/* Top Capture Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCameraActive
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>{isCameraActive ? "Close Camera" : "Open Device Camera"}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="h-4 w-4 text-primary" />
            <span>Upload Document Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {pages.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Page Layout:</span>
            <select
              value={pageFormat}
              onChange={(e) => setPageFormat(e.target.value as PageFormatKey)}
              className="h-8 px-2 text-xs bg-background border border-border rounded-lg text-foreground font-medium"
            >
              <option value="A4">ISO A4 (Standard Document)</option>
              <option value="LETTER">US Letter</option>
              <option value="ORIGINAL">Original Photo Size</option>
            </select>
          </div>
        )}
      </div>

      {/* Camera Live Stream Modal / Section */}
      {isCameraActive && (
        <div className="relative p-4 bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="rounded-2xl max-h-[480px] w-auto shadow-md border border-neutral-800"
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="h-16 w-16 rounded-full bg-white hover:bg-neutral-200 ring-4 ring-white/30 flex items-center justify-center shadow-lg transition-transform active:scale-95"
              title="Capture Photo"
            >
              <div className="h-12 w-12 rounded-full border-2 border-neutral-900" />
            </button>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Align document within the frame and snap</p>
        </div>
      )}

      {cameraError && (
        <div className="p-3 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          {cameraError}
        </div>
      )}

      {/* Workspace Body */}
      {pages.length > 0 && activePage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scanned Document View (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Color Correction / Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-secondary/50 border border-border rounded-2xl">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
                  <Wand2 className="h-3.5 w-3.5 text-primary" /> Filter:
                </span>
                {[
                  { id: "magic", label: "Magic Color" },
                  { id: "bw", label: "B&W Document" },
                  { id: "grayscale", label: "Grayscale" },
                  { id: "enhanced", label: "Enhanced" },
                  { id: "original", label: "Original" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleApplyFilter(f.id as ScannerFilterType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activePage.filter === f.id
                        ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPages((prev) => prev.filter((_, idx) => idx !== activePageIndex));
                  setActivePageIndex((prev) => Math.max(0, prev - 1));
                }}
                className="p-1.5 text-muted-foreground hover:text-rose-500 rounded-lg transition-colors"
                title="Delete this page"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Document Preview Box */}
            <div className="flex items-center justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950/50 rounded-3xl border border-border min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePage.filteredDataUrl}
                alt="Scanned Document"
                className="max-h-[540px] w-auto object-contain rounded-xl shadow-2xl border border-border/60"
              />
            </div>

            {/* Multi-page Thumbnail Strip */}
            {pages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto p-2 bg-secondary/30 border border-border rounded-2xl">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => setActivePageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      activePageIndex === idx
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.filteredDataUrl}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-background/90 text-foreground text-[9px] font-mono text-center font-bold">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OCR Inspector & Text Panel (1 col) */}
          <div className="space-y-4 flex flex-col">
            <div className="p-5 bg-card border border-border rounded-3xl shadow-sm flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">OCR Text Inspector</h4>
                    <span className="text-[11px] text-muted-foreground">Searchable PDF Layer</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunOcr}
                  disabled={activePage.isOcrRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{activePage.isOcrRunning ? "Scanning..." : "Run OCR"}</span>
                </button>
              </div>

              {/* OCR Progress bar */}
              {globalOcrProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Recognizing characters...</span>
                    <span>{globalOcrProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${globalOcrProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* OCR Extracted Text Box */}
              <div className="flex-1 flex flex-col">
                {activePage.ocrResult ? (
                  <div className="flex-1 flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        Confidence: <strong>{Math.round(activePage.ocrResult.confidence)}%</strong> •{" "}
                        {activePage.ocrResult.words.length} words detected
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(activePage.ocrResult?.text || "")}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                      >
                        {copiedText ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedText ? "Copied!" : "Copy Text"}</span>
                      </button>
                    </div>

                    <textarea
                      readOnly
                      value={activePage.ocrResult.text}
                      className="w-full flex-1 min-h-[220px] p-3 text-xs font-mono bg-secondary/30 border border-border rounded-2xl text-foreground resize-none focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-secondary/20 text-muted-foreground">
                    <Sparkles className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-xs font-medium text-foreground">No OCR Data Yet</p>
                    <p className="text-[11px] text-muted-foreground mt-1 max-w-[200px]">
                      Click &quot;Run OCR&quot; to extract text and embed an invisible searchable layer into your PDF.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Generate Bar */}
      {pages.length > 0 && (
        <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-card/95 backdrop-blur-md border border-border rounded-3xl shadow-xl">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {pages.length} Scanned Page{pages.length > 1 ? "s" : ""} Ready
            </h4>
            <p className="text-xs text-muted-foreground">
              {pages.some((p) => p.ocrResult)
                ? "Searchable PDF enabled (invisible OCR text embedded)"
                : "Standard high-resolution PDF"}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                download="scanned_document.pdf"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all animate-in zoom-in-95"
              >
                <Download className="h-4 w-4" />
                <span>Download Scanned PDF ({formatBytes(generatedPdfSize)})</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
              >
                {isGeneratingPdf ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>Building PDF Document...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Create &amp; Download PDF</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
