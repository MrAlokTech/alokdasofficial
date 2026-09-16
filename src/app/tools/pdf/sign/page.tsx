import { Metadata } from "next";
import Link from "next/link";
import { SignWorkspace } from "@/components/tools/pdf/sign/SignWorkspace";
import { ToolFooter } from "@/components/tools/tool-footer";
import { PenTool, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign PDF Online | Draw, Type, or Stamp Signatures | Alok Das",
  description:
    "Sign PDF documents online securely. Draw smooth signatures, type cursive scripts, or upload photo signatures with auto-transparent background removal. 100% private.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/sign",
  },
};

export default function SignPdfPage() {
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
            <PenTool className="h-3.5 w-3.5 text-emerald-500" />
            <span>Digital Signature Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Sign PDF Document
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            Draw your signature with smooth natural ink, choose from elegant cursive calligraphy styles, or upload a photo of your handwritten signature. Drag, scale, and place stamps on any page.
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Processed 100% locally in your browser with zero server uploads.</span>
          </div>
        </header>

        {/* Sign Workspace */}
        <SignWorkspace />

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
