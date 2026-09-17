"use client";

import React, { useState } from "react";
import { PdfDropzone } from "../common/PdfDropzone";
import { PageThumbnailGrid, PageItem } from "../common/PageThumbnailGrid";
import { getPdfJs, renderPageThumbnail } from "@/lib/pdf/pdfjs-loader";
import { formatBytes, formatDownloadFileName } from "@/lib/pdf/page-geometry";
import {
  Download,
  Plus,
  RefreshCw,
  Shuffle,
  RotateCw,
  FileCheck,
  ArrowUpDown,
  Sparkles,
  Layers,
  FileUp,
  GripVertical,
  Loader2,
} from "lucide-react";

interface UploadedFileRef {
  id: string;
  name: string;
  buffer: ArrayBuffer;
  pageCount: number;
}

interface ImportDialogState {
  isOpen: boolean;
  totalFiles: number;
  currentFileIndex: number;
  currentFileName: string;
  currentPage: number;
  totalPagesInCurrentFile: number;
  renderedTotal: number;
}

export const MergeWorkspace: React.FC = () => {
  const [sourceFiles, setSourceFiles] = useState<UploadedFileRef[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mergedStats, setMergedStats] = useState<{ size: number; pageCount: number } | null>(null);

  const [importDialog, setImportDialog] = useState<ImportDialogState>({
    isOpen: false,
    totalFiles: 0,
    currentFileIndex: 0,
    currentFileName: "",
    currentPage: 0,
    totalPagesInCurrentFile: 0,
    renderedTotal: 0,
  });

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setLoadingStatus("Reading and rendering pages...");

    setImportDialog({
      isOpen: true,
      totalFiles: files.length,
      currentFileIndex: 1,
      currentFileName: files[0].name,
      currentPage: 0,
      totalPagesInCurrentFile: 0,
      renderedTotal: 0,
    });

    const pdfjs = await getPdfJs();
    const newFiles: UploadedFileRef[] = [];
    const newPages: PageItem[] = [];
    let pageCounter = 0;

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx];
      const fileId = "file_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
      const buffer = await file.arrayBuffer();

      const loadingTask = pdfjs.getDocument({ data: buffer.slice(0) });
      const doc = await loadingTask.promise;
      const numPages = doc.numPages;

      setImportDialog((prev) => ({
        ...prev,
        currentFileIndex: fIdx + 1,
        currentFileName: file.name,
        totalPagesInCurrentFile: numPages,
      }));

      newFiles.push({
        id: fileId,
        name: file.name,
        buffer,
        pageCount: numPages,
      });

      for (let p = 1; p <= numPages; p++) {
        pageCounter++;
        setLoadingStatus(`Rendering ${file.name} (page ${p}/${numPages})...`);
        setImportDialog((prev) => ({
          ...prev,
          currentPage: p,
          renderedTotal: pageCounter,
        }));

        const thumb = await renderPageThumbnail(doc, p, 240);
        newPages.push({
          id: `p_${fileId}_${p}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          sourceFileId: fileId,
          sourceFileName: file.name,
          sourcePageIndex: p,
          rotation: 0,
          thumbnailUrl: thumb,
        });
      }
    }

    setSourceFiles((prev) => [...prev, ...newFiles]);
    setPages((prev) => [...prev, ...newPages]);
    setIsProcessing(false);
    setLoadingStatus("");
    setDownloadUrl(null);

    // Brief delay so user sees 100% completion in dialog
    setTimeout(() => {
      setImportDialog((prev) => ({ ...prev, isOpen: false }));
    }, 450);
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
    const target = pages.find((p) => p.id === id);
    if (!target) return;
    const clone: PageItem = {
      ...target,
      id: `p_${target.sourceFileId}_${target.sourcePageIndex}_copy_${Date.now()}`,
    };
    const index = pages.findIndex((p) => p.id === id);
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

  const handleRotateAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  };

  const handleReverseOrder = () => {
    setPages((prev) => [...prev].reverse());
  };

  // Interleave if multiple documents exist (e.g. Doc A: 1, 2, 3; Doc B: 1, 2, 3 -> A1, B1, A2, B2, A3, B3)
  const handleInterleave = () => {
    const fileIds = Array.from(new Set(pages.map((p) => p.sourceFileId)));
    if (fileIds.length < 2) return;

    const grouped: Record<string, PageItem[]> = {};
    fileIds.forEach((id) => {
      grouped[id] = pages.filter((p) => p.sourceFileId === id);
    });

    const maxLen = Math.max(...fileIds.map((id) => grouped[id].length));
    const interleaved: PageItem[] = [];

    for (let i = 0; i < maxLen; i++) {
      for (const id of fileIds) {
        if (grouped[id][i]) {
          interleaved.push(grouped[id][i]);
        }
      }
    }
    setPages(interleaved);
  };

  const handleExportMergedPdf = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    setLoadingStatus("Merging pages and baking PDF document...");

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const mergedDoc = await PDFDocument.create();

      // Cache parsed source documents to avoid re-parsing
      const docCache = new Map<string, any>();
      for (const fileRef of sourceFiles) {
        const doc = await PDFDocument.load(fileRef.buffer);
        docCache.set(fileRef.id, doc);
      }

      for (const pageItem of pages) {
        const srcDoc = docCache.get(pageItem.sourceFileId);
        if (!srcDoc) continue;

        // 0-indexed page in pdf-lib
        const [copiedPage] = await mergedDoc.copyPages(srcDoc, [pageItem.sourcePageIndex - 1]);
        if (pageItem.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + pageItem.rotation) % 360));
        }
        mergedDoc.addPage(copiedPage);
      }

      const mergedBytes = await mergedDoc.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setMergedStats({
        size: blob.size,
        pageCount: pages.length,
      });
    } catch (err) {
      console.error("Failed to merge PDF:", err);
    } finally {
      setIsProcessing(false);
      setLoadingStatus("");
    }
  };

  const handleReset = () => {
    setPages([]);
    setSourceFiles([]);
    setDownloadUrl(null);
    setMergedStats(null);
  };

  return (
    <div className="space-y-8">
      {pages.length === 0 ? (
        <PdfDropzone
          onFilesSelected={processFiles}
          multiple={true}
          title="Drop 2 or more PDF files to merge"
          subtitle="Arrange pages across multiple documents, rotate or duplicate, and merge into a single PDF in seconds."
        />
      ) : (
        <div className="space-y-6">
          {/* Top Control Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                {pages.length} Pages
              </span>
              <span className="text-xs text-muted-foreground">
                across {sourceFiles.length} file{sourceFiles.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Add more files */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary hover:bg-muted text-foreground border border-border rounded-xl cursor-pointer transition-colors">
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>Add Files</span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleRotateAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-card hover:bg-muted text-foreground border border-border rounded-xl transition-colors"
                title="Rotate all pages 90° clockwise"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Rotate All</span>
              </button>

              <button
                type="button"
                onClick={handleReverseOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-card hover:bg-muted text-foreground border border-border rounded-xl transition-colors"
                title="Reverse page sequence"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reverse</span>
              </button>

              {sourceFiles.length >= 2 && (
                <button
                  type="button"
                  onClick={handleInterleave}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-card hover:bg-muted text-foreground border border-border rounded-xl transition-colors"
                  title="Interleave pages alternately from uploaded documents"
                >
                  <Shuffle className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Interleave</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-rose-500 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Drag & Reorder UX Hint Banner */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/5 border border-primary/15 text-xs text-primary font-medium">
            <GripVertical className="h-4 w-4 shrink-0 text-primary/70" />
            <span>
              <strong>Tip:</strong> Drag and drop any page thumbnail to reorder. Use the rotate, duplicate, or delete buttons on each page card for fine-grained control.
            </span>
          </div>

          {/* Interactive Thumbnail Grid */}
          <PageThumbnailGrid
            pages={pages}
            onRotatePage={handleRotatePage}
            onDeletePage={handleDeletePage}
            onDuplicatePage={handleDuplicatePage}
            onMovePage={handleMovePage}
          />

          {/* Bottom Action / Export Bar */}
          <div className="sticky bottom-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-card/95 backdrop-blur-md border border-border rounded-3xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Ready to Merge {pages.length} Pages
                </h4>
                <p className="text-xs text-muted-foreground">
                  Processed in memory • Zero server upload
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {downloadUrl && mergedStats ? (
                <a
                  href={downloadUrl}
                  download={formatDownloadFileName(sourceFiles[0]?.name || "merged", "merged")}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all animate-in zoom-in-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Merged PDF ({formatBytes(mergedStats.size)})</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleExportMergedPdf}
                  disabled={isProcessing || pages.length === 0}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-md disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>{loadingStatus || "Merging..."}</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Merge &amp; Save PDF</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Importing Progress Dialog */}
      {importDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground truncate">
                  Importing Documents
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  File {importDialog.currentFileIndex} of {importDialog.totalFiles} • {importDialog.currentFileName}
                </p>
              </div>
            </div>

            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">
                  {importDialog.totalPagesInCurrentFile > 0
                    ? `Rendering page ${importDialog.currentPage} of ${importDialog.totalPagesInCurrentFile}`
                    : "Reading document structure..."}
                </span>
                <span className="text-primary font-mono">
                  {importDialog.totalPagesInCurrentFile > 0
                    ? `${Math.round((importDialog.currentPage / importDialog.totalPagesInCurrentFile) * 100)}%`
                    : "..."}
                </span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
                  style={{
                    width: importDialog.totalPagesInCurrentFile > 0
                      ? `${Math.min(100, Math.max(5, (importDialog.currentPage / importDialog.totalPagesInCurrentFile) * 100))}%`
                      : "25%",
                  }}
                />
              </div>
            </div>

            {/* Info badge */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
              <span>Total pages loaded: <strong className="text-foreground">{importDialog.renderedTotal}</strong></span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ 100% In-Browser Privacy
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
