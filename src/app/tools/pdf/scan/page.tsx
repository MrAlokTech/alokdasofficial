import { Metadata } from "next";
import Link from "next/link";
import { ScanWorkspace } from "@/components/tools/pdf/scan/ScanWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Camera, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Scan & OCR to PDF Online | Photos to Searchable PDF | Alok Das",
  description:
    "Convert device camera photos or pictures into searchable PDFs with client-side OCR (Tesseract.js). Includes Magic Color correction, B&W binarization, and auto A4/Letter page fitting.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/scan",
  },
};

export default function ScanPdfPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/tools/pdf"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to PDF Studio</span>
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Camera className="h-3.5 w-3.5 text-cyan-500" />
            <span>Photo Scanner &amp; OCR Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Scan &amp; OCR to PDF
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Capture photos directly from your phone or webcam, apply CamScanner-grade Magic Color filters, automatically fit to standard ISO A4 or US Letter dimensions, and embed searchable OCR text layers.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>OCR runs in a local browser Web Worker with Tesseract.js. No images leave your device.</span>
          </div>
        </header>

        {/* Scan Workspace */}
        <ScanWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
