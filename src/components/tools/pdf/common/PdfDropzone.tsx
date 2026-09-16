"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, AlertCircle } from "lucide-react";

interface PdfDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  accept?: string;
  maxFiles?: number;
}

export const PdfDropzone: React.FC<PdfDropzoneProps> = ({
  onFilesSelected,
  multiple = false,
  title = "Select or drag PDF files here",
  subtitle = "All processing happens 100% locally in your browser. No files are uploaded to any server.",
  accept = "application/pdf",
  maxFiles = 20,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      if (accept.includes("image") && file.type.startsWith("image/")) {
        validFiles.push(file);
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setError("Please select valid PDF file(s).");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      onFilesSelected([validFiles[0]]);
      return;
    }

    if (validFiles.length > maxFiles) {
      setError(`You can select a maximum of ${maxFiles} files at once.`);
      onFilesSelected(validFiles.slice(0, maxFiles));
      return;
    }

    onFilesSelected(validFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 text-center ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-border/80 hover:border-primary/50 bg-card hover:bg-muted/40 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="h-16 w-16 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">{subtitle}</p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium border border-border/60">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>{multiple ? "Choose multiple files or drag them here" : "Choose file or drag here"}</span>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
