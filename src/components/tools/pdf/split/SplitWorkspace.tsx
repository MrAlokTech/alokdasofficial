"use client";

import React, { useState } from "react";
import { PdfDropzone } from "../common/PdfDropzone";
import { PageThumbnailGrid, PageItem } from "../common/PageThumbnailGrid";
import { PageRangeInput } from "../common/PageRangeInput";
import { getPdfJs, renderPageThumbnail } from "@/lib/pdf/pdfjs-loader";
import { formatBytes, formatDownloadFileName } from "@/lib/pdf/page-geometry";
import {
  Download,
  Scissors,
  Sparkles,
  Archive,
  FileCheck,
  RefreshCw,
  Sliders,
} from "lucide-react";

export const SplitWorkspace: React.FC = () => {
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [splitMode, setSplitMode] = useState<"extract" | "all_individual" | "interval">("extract");
  const [intervalPages, setIntervalPages] = useState<number>(2);

  // Result state
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [resultSize, setResultSize] = useState<number>(0);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileName(file.name);
    setIsProcessing(true);
    setStatusMessage("Rendering pages...");

    try {
      const buffer = await file.arrayBuffer();
      setFileBuffer(buffer);

      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument({ data: buffer.slice(0) });
      const doc = await loadingTask.promise;
      const numPages = doc.numPages;

      const loadedPages: PageItem[] = [];
      for (let p = 1; p <= numPages; p++) {
        setStatusMessage(`Rendering page ${p} of ${numPages}...`);
        const thumb = await renderPageThumbnail(doc, p, 240);
        loadedPages.push({
          id: `split_${p}_${Date.now()}`,
          sourceFileId: "src_file",
          sourceFileName: file.name,
          sourcePageIndex: p,
          rotation: 0,
          thumbnailUrl: thumb,
          selected: true, // select all by default
        });
      }

      setPages(loadedPages);
    } catch (err) {
      console.error("Error loading PDF for split:", err);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
      setDownloadUrl(null);
    }
  };

  const handleToggleSelect = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleRotatePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const handleDeletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicatePage = (id: string) => {
    const index = pages.findIndex((p) => p.id === id);
    if (index === -1) return;
    const target = pages[index];
    const clone = { ...target, id: `split_dup_${Date.now()}` };
    const updated = [...pages];
    updated.splice(index + 1, 0, clone);
    setPages(updated);
  };

  const handleMovePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const updated = [...pages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPages(updated);
  };

  const handleApplyRangeSelection = (selectedIndices: number[]) => {
    const indexSet = new Set(selectedIndices);
    setPages((prev) =>
      prev.map((p, idx) => ({
        ...p,
        selected: indexSet.has(idx),
      }))
    );
  };

  const handleExecuteSplit = async () => {
    if (!fileBuffer || pages.length === 0) return;
    setIsProcessing(true);
    setStatusMessage("Preparing document split...");

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const srcDoc = await PDFDocument.load(fileBuffer);
      const baseName = fileName.replace(/\.[^/.]+$/, "");

      if (splitMode === "extract") {
        // Extract selected pages into one new PDF
        const targetPages = pages.filter((p) => p.selected);
        if (targetPages.length === 0) {
          alert("Please select at least one page to extract.");
          setIsProcessing(false);
          return;
        }

        const newDoc = await PDFDocument.create();
        for (const item of targetPages) {
          const [copiedPage] = await newDoc.copyPages(srcDoc, [item.sourcePageIndex - 1]);
          if (item.rotation !== 0) {
            const rot = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((rot + item.rotation) % 360));
          }
          newDoc.addPage(copiedPage);
        }

        const outBytes = await newDoc.save({ useObjectStreams: true });
        const blob = new Blob([outBytes as any], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setDownloadName(formatDownloadFileName(fileName, "extracted"));
        setResultSize(blob.size);
      } else if (splitMode === "all_individual") {
        // Package individual pages into a ZIP
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        const activePages = pages.filter((p) => p.selected);
        for (let i = 0; i < activePages.length; i++) {
          const item = activePages[i];
          setStatusMessage(`Packaging page ${i + 1} of ${activePages.length}...`);

          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [item.sourcePageIndex - 1]);
          if (item.rotation !== 0) {
            const rot = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((rot + item.rotation) % 360));
          }
          singleDoc.addPage(copiedPage);

          const bytes = await singleDoc.save({ useObjectStreams: true });
          zip.file(`${baseName}_page_${item.sourcePageIndex}.pdf`, bytes);
        }

        setStatusMessage("Compressing ZIP archive...");
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setDownloadUrl(URL.createObjectURL(zipBlob));
        setDownloadName(formatDownloadFileName(fileName, "split_pages", "zip"));
        setResultSize(zipBlob.size);
      } else if (splitMode === "interval") {
        // Split by interval (e.g. every 2 pages) into a ZIP
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        const activePages = pages.filter((p) => p.selected);
        const chunkSize = Math.max(1, intervalPages);

        let partNum = 1;
        for (let i = 0; i < activePages.length; i += chunkSize) {
          const chunk = activePages.slice(i, i + chunkSize);
          const chunkDoc = await PDFDocument.create();

          for (const item of chunk) {
            const [copiedPage] = await chunkDoc.copyPages(srcDoc, [item.sourcePageIndex - 1]);
            if (item.rotation !== 0) {
              const rot = copiedPage.getRotation().angle;
              copiedPage.setRotation(degrees((rot + item.rotation) % 360));
            }
            chunkDoc.addPage(copiedPage);
          }

          const bytes = await chunkDoc.save({ useObjectStreams: true });
          zip.file(`${baseName}_part_${partNum}.pdf`, bytes);
          partNum++;
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        setDownloadUrl(URL.createObjectURL(zipBlob));
        setDownloadName(formatDownloadFileName(fileName, "parts", "zip"));
        setResultSize(zipBlob.size);
      }
    } catch (err) {
      console.error("Split failed:", err);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  const handleReset = () => {
    setFileBuffer(null);
    setFileName("");
    setPages([]);
    setDownloadUrl(null);
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="space-y-8">
      {!fileBuffer ? (
        <PdfDropzone
          onFilesSelected={handleFile}
          multiple={false}
          title="Select a PDF to split or extract pages"
          subtitle="Extract specific pages, divide your document into separate files, or download all pages in a ZIP."
        />
      ) : (
        <div className="space-y-6">
          {/* Split Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 bg-secondary/40 border border-border rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setSplitMode("extract");
                setDownloadUrl(null);
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl transition-all text-left ${
                splitMode === "extract"
                  ? "bg-card text-foreground shadow-sm border border-border font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Scissors className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold">Extract Selected</div>
                <div className="text-[11px] text-muted-foreground">Save marked pages into 1 PDF</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplitMode("all_individual");
                setDownloadUrl(null);
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl transition-all text-left ${
                splitMode === "all_individual"
                  ? "bg-card text-foreground shadow-sm border border-border font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Archive className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold">Individual Pages (ZIP)</div>
                <div className="text-[11px] text-muted-foreground">Every page as separate PDF</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplitMode("interval");
                setDownloadUrl(null);
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl transition-all text-left ${
                splitMode === "interval"
                  ? "bg-card text-foreground shadow-sm border border-border font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold">Fixed Interval (ZIP)</div>
                <div className="text-[11px] text-muted-foreground">Split every N pages</div>
              </div>
            </button>
          </div>

          {/* Interval Configuration if selected */}
          {splitMode === "interval" && (
            <div className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-2xl">
              <span className="text-xs text-foreground font-medium">Split document every:</span>
              <input
                type="number"
                min={1}
                max={Math.max(1, pages.length)}
                value={intervalPages}
                onChange={(e) => setIntervalPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 h-8 px-2 text-xs bg-background border border-border rounded-lg text-center font-bold text-foreground"
              />
              <span className="text-xs text-muted-foreground">pages into separate files</span>
            </div>
          )}

          {/* Page Range Quick Selector */}
          <PageRangeInput
            totalPages={pages.length}
            onApplySelection={handleApplyRangeSelection}
          />

          {/* Top Bar with Selection Count */}
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
            <div>
              Selected: <span className="font-semibold text-foreground">{selectedCount}</span> of{" "}
              <span>{pages.length}</span> pages
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 hover:text-rose-500 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Choose different PDF</span>
            </button>
          </div>

          {/* Thumbnail Grid with Checkboxes */}
          <PageThumbnailGrid
            pages={pages}
            showSelection={true}
            onToggleSelect={handleToggleSelect}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onMovePage={handleMovePage}
          />

          {/* Sticky Bottom Split Trigger */}
          <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-card/95 backdrop-blur-md border border-border rounded-3xl shadow-xl">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {splitMode === "extract"
                  ? `Extract ${selectedCount} Pages`
                  : splitMode === "all_individual"
                  ? `Split into ${selectedCount} PDFs`
                  : `Split into ~${Math.ceil(selectedCount / intervalPages)} PDF files`}
              </h4>
              <p className="text-xs text-muted-foreground">
                Instant client-side split • Secure and private
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download={downloadName}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all animate-in zoom-in-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Result ({formatBytes(resultSize)})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExecuteSplit}
                  disabled={isProcessing || selectedCount === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>{statusMessage || "Splitting..."}</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Execute Split</span>
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
