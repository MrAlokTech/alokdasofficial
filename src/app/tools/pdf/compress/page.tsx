import { Metadata } from "next";
import Link from "next/link";
import { CompressWorkspace } from "@/components/tools/pdf/compress/CompressWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Zap, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Compress PDF Online | Up to 80% Reduction Client-Side | Alok Das",
  description:
    "Compress PDF files online in your browser. Extreme, Recommended, and Low compression presets with customizable DPI, JPEG quality, and live size savings preview.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/compress",
  },
};

export default function CompressPdfPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
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
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>In-Browser Stream &amp; Image Optimizer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Compress PDF
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Significantly reduce PDF file sizes for email attachments, university submissions, and web publishing—optimized directly inside your browser memory.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Processed 100% locally in your browser with zero server uploads.</span>
          </div>
        </header>

        {/* Compress Workspace */}
        <CompressWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
