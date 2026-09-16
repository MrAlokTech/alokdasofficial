import { Metadata } from "next";
import Link from "next/link";
import { SplitWorkspace } from "@/components/tools/pdf/split/SplitWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Scissors, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Split PDF Pages Online | Extract & ZIP Bundling | Alok Das",
  description:
    "Split PDF pages online with visual selection and range syntax (e.g. 1-3, 5, 8-10). Extract pages, download individual files in a ZIP archive, or split by intervals.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/split",
  },
};

export default function SplitPdfPage() {
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
            <Scissors className="h-3.5 w-3.5 text-rose-500" />
            <span>Page Extractor &amp; Splitter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Split PDF Pages
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Extract custom page ranges into a single PDF, split every page into separate files packaged in a ZIP archive, or divide your document by fixed page intervals.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Processed 100% locally in your browser with zero server uploads.</span>
          </div>
        </header>

        {/* Split Workspace */}
        <SplitWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
