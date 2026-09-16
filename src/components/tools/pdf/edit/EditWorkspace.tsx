"use client";

import React, { useState, useRef, useEffect } from "react";
import { PdfDropzone } from "../common/PdfDropzone";
import { getPdfJs, renderPageToCanvas } from "@/lib/pdf/pdfjs-loader";
import { formatBytes } from "@/lib/pdf/page-geometry";
import {
  Download,
  Eraser,
  Type,
  Highlighter,
  Square,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export type EditToolType = "select" | "whiteout" | "blackout" | "text" | "highlight" | "rectangle";

export interface EditElement {
  id: string;
  type: EditToolType;
  pageIndex: number;
  xPct: number; // 0-100%
  yPct: number; // 0-100%
  widthPct: number; // 0-100%
  heightPct: number; // 0-100%
  text?: string;
  fontSize?: number;
  color?: string;
  fillColor?: string;
  opacity?: number;
}

export const EditWorkspace: React.FC = () => {
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active Tool
  const [activeTool, setActiveTool] = useState<EditToolType>("whiteout");
  const [textColor, setTextColor] = useState<string>("#0f172a");
  const [fontSize, setFontSize] = useState<number>(16);

  // Elements
  const [elements, setElements] = useState<EditElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDocRef, setPdfDocRef] = useState<any>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 800,
  });

  // Drag creation state
  const [isDrawingElement, setIsDrawingElement] = useState(false);
  const [drawStart, setDrawStart] = useState<{ xPct: number; yPct: number } | null>(null);
  const [currentDragBox, setCurrentDragBox] = useState<{
    xPct: number;
    yPct: number;
    widthPct: number;
    heightPct: number;
  } | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [editedSize, setEditedSize] = useState<number>(0);

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

    setElements([]);
    setDownloadUrl(null);
  };

  useEffect(() => {
    if (!pdfDocRef || !canvasRef.current) return;
    let isMounted = true;

    renderPageToCanvas(pdfDocRef, currentPage, canvasRef.current, 1.5).then((dims) => {
      if (isMounted) setCanvasDimensions(dims);
    });

    return () => {
      isMounted = false;
    };
  }, [pdfDocRef, currentPage]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select") return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawingElement(true);
    setDrawStart({ xPct, yPct });
    setCurrentDragBox({ xPct, yPct, widthPct: 0, heightPct: 0 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingElement || !drawStart || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const currentYPct = ((e.clientY - rect.top) / rect.height) * 100;

    const xPct = Math.min(drawStart.xPct, currentXPct);
    const yPct = Math.min(drawStart.yPct, currentYPct);
    const widthPct = Math.abs(currentXPct - drawStart.xPct);
    const heightPct = Math.abs(currentYPct - drawStart.yPct);

    setCurrentDragBox({ xPct, yPct, widthPct, heightPct });
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawingElement || !currentDragBox) return;

    // Minimum size check (if click without dragging, assign default size)
    let finalBox = { ...currentDragBox };
    if (finalBox.widthPct < 2 && finalBox.heightPct < 2) {
      if (activeTool === "text") {
        finalBox.widthPct = 25;
        finalBox.heightPct = 5;
      } else {
        finalBox.widthPct = 15;
        finalBox.heightPct = 6;
      }
    }

    const newElement: EditElement = {
      id: "elem_" + Date.now(),
      type: activeTool,
      pageIndex: currentPage - 1,
      xPct: finalBox.xPct,
      yPct: finalBox.yPct,
      widthPct: Math.max(3, finalBox.widthPct),
      heightPct: Math.max(2, finalBox.heightPct),
      text: activeTool === "text" ? "Type text here" : undefined,
      fontSize: activeTool === "text" ? fontSize : undefined,
      color: activeTool === "text" ? textColor : undefined,
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);

    setIsDrawingElement(false);
    setDrawStart(null);
    setCurrentDragBox(null);
  };

  const handleExportEditedPdf = async () => {
    if (!fileBuffer) return;
    setIsExporting(true);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const docPages = pdfDoc.getPages();

      for (const elem of elements) {
        if (elem.pageIndex >= docPages.length) continue;
        const page = docPages[elem.pageIndex];
        const { width, height } = page.getSize();

        const x = (elem.xPct / 100) * width;
        const elemWidth = (elem.widthPct / 100) * width;
        const elemHeight = (elem.heightPct / 100) * height;
        // In PDF coordinate space, (0,0) is bottom-left
        const y = height - (elem.yPct / 100) * height - elemHeight;

        if (elem.type === "whiteout") {
          // Permanently cover element with opaque white rectangle
          page.drawRectangle({
            x,
            y,
            width: elemWidth,
            height: elemHeight,
            color: rgb(1, 1, 1),
            opacity: 1.0,
          });
        } else if (elem.type === "blackout") {
          // Permanent blackout redaction
          page.drawRectangle({
            x,
            y,
            width: elemWidth,
            height: elemHeight,
            color: rgb(0, 0, 0),
            opacity: 1.0,
          });
        } else if (elem.type === "highlight") {
          // Yellow highlight
          page.drawRectangle({
            x,
            y,
            width: elemWidth,
            height: elemHeight,
            color: rgb(1, 0.95, 0.2),
            opacity: 0.45,
          });
        } else if (elem.type === "rectangle") {
          page.drawRectangle({
            x,
            y,
            width: elemWidth,
            height: elemHeight,
            borderColor: rgb(0.1, 0.1, 0.1),
            borderWidth: 1.5,
            opacity: 0,
          });
        } else if (elem.type === "text" && elem.text) {
          const ptSize = elem.fontSize || 14;
          page.drawText(elem.text, {
            x,
            y: y + 4,
            size: ptSize,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
      }

      const outBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
      setEditedSize(blob.size);
    } catch (err) {
      console.error("Export edited PDF failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setFileBuffer(null);
    setFileName("");
    setPdfDocRef(null);
    setElements([]);
    setDownloadUrl(null);
  };

  const pageElements = elements.filter((e) => e.pageIndex === currentPage - 1);

  return (
    <div className="space-y-8">
      {!fileBuffer ? (
        <PdfDropzone
          onFilesSelected={handleFile}
          multiple={false}
          title="Select a PDF to redact or edit"
          subtitle="Permanently erase unwanted elements with Whiteout, apply Blackout redactions, or add text and highlight boxes."
        />
      ) : (
        <div className="space-y-6">
          {/* Main Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
            {/* Page Nav */}
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

            {/* Tools */}
            <div className="flex flex-wrap items-center gap-1.5 bg-secondary/50 p-1 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTool("whiteout")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTool === "whiteout"
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Whiteout / Eraser: permanently covers and erases unwanted PDF text or graphics"
              >
                <Eraser className="h-3.5 w-3.5 text-rose-500" />
                <span>Whiteout Eraser</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("blackout")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTool === "blackout"
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Blackout: confidential redaction block"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-neutral-800 dark:text-neutral-200" />
                <span>Blackout</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("text")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTool === "text"
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Type className="h-3.5 w-3.5 text-blue-500" />
                <span>Add Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("highlight")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTool === "highlight"
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Highlighter className="h-3.5 w-3.5 text-amber-500" />
                <span>Highlight</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("rectangle")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTool === "rectangle"
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Square className="h-3.5 w-3.5 text-indigo-500" />
                <span>Rectangle</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-rose-500 border border-border rounded-xl transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Change PDF</span>
            </button>
          </div>

          {/* Hint bar */}
          <div className="px-4 py-2 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground flex items-center justify-between">
            <span>
              <strong>Tip:</strong> Click and drag on the document to place a{" "}
              <span className="text-foreground font-semibold uppercase">{activeTool}</span> box.
            </span>
            <span>{pageElements.length} element(s) on this page</span>
          </div>

          {/* Canvas Workspace */}
          <div className="flex justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950/50 rounded-3xl border border-border overflow-x-auto">
            <div
              ref={containerRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="relative shadow-2xl rounded-xl overflow-hidden bg-white max-w-full cursor-crosshair select-none"
              style={{
                width: `${canvasDimensions.width}px`,
                maxWidth: "100%",
              }}
            >
              <canvas ref={canvasRef} className="w-full h-auto block pointer-events-none" />

              {/* Render placed elements */}
              {pageElements.map((elem) => {
                const isSelected = selectedElementId === elem.id;

                return (
                  <div
                    key={elem.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(elem.id);
                    }}
                    style={{
                      left: `${elem.xPct}%`,
                      top: `${elem.yPct}%`,
                      width: `${elem.widthPct}%`,
                      height: `${elem.heightPct}%`,
                    }}
                    className={`absolute select-none cursor-pointer transition-all ${
                      elem.type === "whiteout"
                        ? "bg-white border border-neutral-300 shadow-sm"
                        : elem.type === "blackout"
                        ? "bg-black text-white flex items-center justify-center text-[10px] font-mono tracking-widest uppercase font-bold"
                        : elem.type === "highlight"
                        ? "bg-yellow-300/40 border border-yellow-400/50"
                        : elem.type === "rectangle"
                        ? "border-2 border-neutral-900 bg-transparent"
                        : "bg-transparent"
                    } ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}`}
                  >
                    {elem.type === "blackout" && (
                      <span className="select-none opacity-40 text-[9px]">REDACTED</span>
                    )}

                    {elem.type === "text" && (
                      <input
                        type="text"
                        value={elem.text || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setElements((prev) =>
                            prev.map((item) => (item.id === elem.id ? { ...item, text: val } : item))
                          );
                        }}
                        style={{
                          fontSize: `${elem.fontSize || 14}px`,
                          color: elem.color || "#0f172a",
                        }}
                        className="w-full h-full bg-transparent border-none outline-none font-sans font-medium px-1"
                      />
                    )}

                    {/* Delete element button */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setElements((prev) => prev.filter((item) => item.id !== elem.id));
                        }}
                        className="absolute -top-7 right-0 p-1 rounded-md bg-card border border-border shadow text-muted-foreground hover:text-rose-500 z-30 transition-colors"
                        title="Delete element"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Drag box preview */}
              {isDrawingElement && currentDragBox && (
                <div
                  style={{
                    left: `${currentDragBox.xPct}%`,
                    top: `${currentDragBox.yPct}%`,
                    width: `${currentDragBox.widthPct}%`,
                    height: `${currentDragBox.heightPct}%`,
                  }}
                  className={`absolute pointer-events-none border-2 border-dashed ${
                    activeTool === "whiteout"
                      ? "border-rose-500 bg-white/80"
                      : activeTool === "blackout"
                      ? "border-neutral-900 bg-black/80"
                      : "border-primary bg-primary/20"
                  }`}
                />
              )}
            </div>
          </div>

          {/* Sticky Bottom Export Bar */}
          <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-card/95 backdrop-blur-md border border-border rounded-3xl shadow-xl">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {elements.length === 0
                  ? "Drag on the document to redact or annotate"
                  : `${elements.length} Redaction/Overlay item${elements.length > 1 ? "s" : ""} applied`}
              </h4>
              <p className="text-xs text-muted-foreground">
                Permanent flattening • Redacted content cannot be retrieved or copied
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={`redacted_${fileName}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all animate-in zoom-in-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Redacted PDF ({formatBytes(editedSize)})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExportEditedPdf}
                  disabled={isExporting || elements.length === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
                >
                  {isExporting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>Flattening &amp; Redacting...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Flatten &amp; Save PDF</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
