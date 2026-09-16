import { Metadata } from "next";
import Link from "next/link";
import { EditWorkspace } from "@/components/tools/pdf/edit/EditWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Eraser, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Redact & Edit PDF Online | Whiteout Eraser & Annotations | Alok Das",
  description:
    "Permanently erase elements from PDFs using Whiteout, redact confidential data with Blackout boxes, or add custom text and highlight annotations 100% in-browser.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/edit",
  },
};

export default function EditPdfPage() {
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
            <Eraser className="h-3.5 w-3.5 text-purple-500" />
            <span>Redaction &amp; Overlay Editor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Redact &amp; Edit PDF
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Permanently erase unwanted text, logos, or graphic elements using the Whiteout eraser, cover confidential information with Blackout redaction stamps, or add new text annotations.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Redactions are permanently flattened client-side so covered content cannot be recovered.</span>
          </div>
        </header>

        {/* Edit Workspace */}
        <EditWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
