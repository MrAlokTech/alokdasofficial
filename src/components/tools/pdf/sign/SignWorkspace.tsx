"use client";

import React, { useState, useRef, useEffect } from "react";
import { PdfDropzone } from "../common/PdfDropzone";
import { SignaturePadModal } from "./SignaturePadModal";
import { getPdfJs, renderPageToCanvas } from "@/lib/pdf/pdfjs-loader";
import { formatBytes, formatDownloadFileName } from "@/lib/pdf/page-geometry";
import {
  Download,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface SignatureStamp {
  id: string;
  dataUrl: string;
  pageIndex: number; // 0-based
  xPct: number; // 0 to 100% of page width
  yPct: number; // 0 to 100% of page height from top
  widthPct: number; // 0 to 100% of page width
  aspectRatio: number;
}

export const SignWorkspace: React.FC = () => {
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1); // 1-based

  // Signatures placed
  const [stamps, setStamps] = useState<SignatureStamp[]>([]);
  const [activeStampId, setActiveStampId] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Canvas & render refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDocRef, setPdfDocRef] = useState<any>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 800,
  });

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [signedSize, setSignedSize] = useState<number>(0);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    setFileBuffer(buffer);

    try {
      const pdfjs = await getPdfJs();
      const doc = await pdfjs.getDocument({ data: buffer.slice(0) }).promise;
      setPdfDocRef(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }

    setStamps([]);
    setDownloadUrl(null);
  };

  // Render current page when page changes
  useEffect(() => {
    if (!pdfDocRef || !canvasRef.current) return;

    let isMounted = true;
    renderPageToCanvas(pdfDocRef, currentPage, canvasRef.current, 1.5).then((dims) => {
      if (isMounted) {
        setCanvasDimensions(dims);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pdfDocRef, currentPage]);

  const handleAddSignature = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const aspect = img.width / img.height;
      const initialWidthPct = 25; // default 25% page width
      const newStamp: SignatureStamp = {
        id: "stamp_" + Date.now(),
        dataUrl,
        pageIndex: currentPage - 1,
        xPct: 35,
        yPct: 75,
        widthPct: initialWidthPct,
        aspectRatio: aspect,
      };

      setStamps((prev) => [...prev, newStamp]);
      setActiveStampId(newStamp.id);
    };
    img.src = dataUrl;
  };

  const handleStampDrag = (e: React.MouseEvent, stampId: string) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const target = stamps.find((s) => s.id === stampId);
    if (!target) return;

    const initXPct = target.xPct;
    const initYPct = target.yPct;
    const rect = container.getBoundingClientRect();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const deltaXPct = (deltaX / rect.width) * 100;
      const deltaYPct = (deltaY / rect.height) * 100;

      const newXPct = Math.max(0, Math.min(100 - target.widthPct, initXPct + deltaXPct));
      const newYPct = Math.max(0, Math.min(95, initYPct + deltaYPct));

      setStamps((prev) =>
        prev.map((s) => (s.id === stampId ? { ...s, xPct: newXPct, yPct: newYPct } : s))
      );
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleExportSignedPdf = async () => {
    if (!fileBuffer) return;
    setIsExporting(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const docPages = pdfDoc.getPages();

      for (const stamp of stamps) {
        if (stamp.pageIndex >= docPages.length) continue;
        const page = docPages[stamp.pageIndex];
        const { width, height } = page.getSize();

        // Convert data URL to array buffer
        const pngBytes = await fetch(stamp.dataUrl).then((r) => r.arrayBuffer());
        const pngImage = await pdfDoc.embedPng(pngBytes);

        // Calculate points
        const stampWidthPts = (stamp.widthPct / 100) * width;
        const stampHeightPts = stampWidthPts / stamp.aspectRatio;

        const xPts = (stamp.xPct / 100) * width;
        // In PDF coordinate space, (0,0) is bottom-left
        const yPts = height - (stamp.yPct / 100) * height - stampHeightPts;

        page.drawImage(pngImage, {
          x: xPts,
          y: yPts,
          width: stampWidthPts,
          height: stampHeightPts,
        });
      }

      const signedBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([signedBytes as any], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setSignedSize(blob.size);
    } catch (err) {
      console.error("Export signed PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setFileBuffer(null);
    setFileName("");
    setPdfDocRef(null);
    setStamps([]);
    setDownloadUrl(null);
  };

  const pageStamps = stamps.filter((s) => s.pageIndex === currentPage - 1);

  return (
    <div className="space-y-8">
      {!fileBuffer ? (
        <PdfDropzone
          onFilesSelected={handleFile}
          multiple={false}
          title="Select a PDF to sign"
          subtitle="Add authentic signatures via draw, type, or photo stamp directly onto any page of your document."
        />
      ) : (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-xl border border-border hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary text-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-xl border border-border hover:bg-muted disabled:opacity-30 disabled:pointer-events-none text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Stamp / Signature Trigger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-sm transition-colors"
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>+ Add Signature Stamp</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-rose-500 border border-border rounded-xl transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Change PDF</span>
              </button>
            </div>
          </div>

          {/* Document Canvas Workspace */}
          <div className="flex justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950/50 rounded-3xl border border-border overflow-x-auto">
            <div
              ref={containerRef}
              className="relative shadow-2xl rounded-xl overflow-hidden bg-white max-w-full"
              style={{
                width: `${canvasDimensions.width}px`,
                maxWidth: "100%",
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-auto block select-none"
              />

              {/* Placed signature stamps on this page */}
              {pageStamps.map((stamp) => {
                const isActive = activeStampId === stamp.id;
                return (
                  <div
                    key={stamp.id}
                    onMouseDown={(e) => {
                      setActiveStampId(stamp.id);
                      handleStampDrag(e, stamp.id);
                    }}
                    style={{
                      left: `${stamp.xPct}%`,
                      top: `${stamp.yPct}%`,
                      width: `${stamp.widthPct}%`,
                    }}
                    className={`absolute cursor-move select-none transition-shadow ${
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 rounded-lg bg-primary/5"
                        : "hover:ring-1 hover:ring-primary/50"
                    }`}
                  >
                    {/* Delete stamp button */}
                    {isActive && (
                      <div className="absolute -top-7 right-0 flex items-center gap-1 bg-card border border-border rounded-lg shadow-sm p-1 z-30">
                        <input
                          type="range"
                          min={10}
                          max={60}
                          value={stamp.widthPct}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setStamps((prev) =>
                              prev.map((s) => (s.id === stamp.id ? { ...s, widthPct: val } : s))
                            );
                          }}
                          className="w-16 accent-primary h-2"
                          title="Resize signature"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStamps((prev) => prev.filter((s) => s.id !== stamp.id));
                          }}
                          className="p-1 hover:text-rose-500 rounded text-muted-foreground transition-colors"
                          title="Delete signature"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stamp.dataUrl}
                      alt="Signature"
                      className="w-full h-auto pointer-events-none block"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Export Bar */}
          <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-card/95 backdrop-blur-md border border-border rounded-3xl shadow-xl">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {stamps.length === 0
                  ? "Click '+ Add Signature Stamp' to place your signature"
                  : `${stamps.length} Signature stamp${stamps.length > 1 ? "s" : ""} placed`}
              </h4>
              <p className="text-xs text-muted-foreground">
                Bakes vector-crisp signatures directly into PDF content streams
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={formatDownloadFileName(fileName, "signed")}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all animate-in zoom-in-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Signed PDF ({formatBytes(signedSize)})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExportSignedPdf}
                  disabled={isExporting || stamps.length === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Embedding signatures...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Save &amp; Download Signed PDF</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      <SignaturePadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSignatureReady={handleAddSignature}
      />
    </div>
  );
};
