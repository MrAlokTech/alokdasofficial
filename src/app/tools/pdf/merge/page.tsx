import { Metadata } from "next";
import Link from "next/link";
import { MergeWorkspace } from "@/components/tools/pdf/merge/MergeWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Layers, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Merge PDF Files Online | Page-by-Page Visual Organizer | Alok Das",
  description:
    "Combine multiple PDF documents online with granular page-to-page visual reordering, page rotation, duplicate/delete, and two-sided scan interleaving. 100% private.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/merge",
  },
};

export default function MergePdfPage() {
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
            <Layers className="h-3.5 w-3.5 text-blue-500" />
            <span>Visual Organizer &amp; Combiner</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Merge PDF Files
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Select multiple PDF files, visually arrange and reorder pages across documents, rotate orientation, or interleave two-sided scans into a single polished document.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Processed 100% locally in your browser with zero server uploads.</span>
          </div>
        </header>

        {/* Merge Workspace */}
        <MergeWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
