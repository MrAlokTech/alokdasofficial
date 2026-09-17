"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  accept?: string;
  maxFiles?: number;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFilesSelected,
  multiple = true,
  title = "Select or drop images here",
  subtitle = "100% private in-browser processing. JPG, PNG, WEBP, and more supported.",
  accept = "image/*",
  maxFiles = 50,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | File[] | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|avif|bmp|gif|svg)$/i.test(file.name)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setError("Please select valid image files (JPG, PNG, WEBP, etc.).");
      return;
    }

    if (!multiple && validFiles.length > 1) {
      onFilesSelected([validFiles[0]]);
      return;
    }

    if (validFiles.length > maxFiles) {
      setError(`You can select a maximum of ${maxFiles} images at once.`);
      onFilesSelected(validFiles.slice(0, maxFiles));
      return;
    }

    onFilesSelected(validFiles);
  };

  // Support Ctrl+V paste anywhere in dropzone
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const pastedImages: File[] = [];
        for (let i = 0; i < e.clipboardData.files.length; i++) {
          const file = e.clipboardData.files[i];
          if (file.type.startsWith("image/")) {
            pastedImages.push(file);
          }
        }
        if (pastedImages.length > 0) {
          handleFiles(pastedImages);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [multiple, maxFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.008] shadow-md"
            : "border-border/80 hover:border-primary/50 hover:bg-secondary/40 bg-card/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center space-y-4 max-w-md">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragOver
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary text-primary"
            }`}
          >
            {isDragOver ? (
              <UploadCloud className="w-7 h-7 animate-bounce" />
            ) : (
              <ImageIcon className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-muted-foreground">
            <span className="px-2.5 py-1 rounded-md bg-secondary/80 font-medium">
              Drag &amp; Drop
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary/80 font-medium">
              Browse Files
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary/80 font-medium">
              Ctrl+V to Paste
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 px-3.5 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
