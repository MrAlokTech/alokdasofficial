import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Layers,
  Scissors,
  Zap,
  PenTool,
  Eraser,
  Camera,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
  Scale,
} from "lucide-react";
import { ToolFooter } from "@/components/tools/tool-footer";

export const metadata: Metadata = {
  title: "Client-Side PDF Studio | 100% Private In-Browser Tools",
  description:
    "Compress, merge, split, sign, redact, and convert camera photos to searchable PDFs with OCR. 100% client-side WebAssembly processing—zero server uploads.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf",
  },
  openGraph: {
    title: "Client-Side PDF Studio | Alok Das",
    description:
      "A complete, private in-browser PDF power suite. Merge, split, compress, sign, redact, and scan with OCR. No files are ever sent to a server.",
    url: "https://alokdasofficial.in/tools/pdf",
    type: "website",
  },
};

const pdfTools = [
  {
    id: "merge",
    name: "Merge PDF",
    tagline: "Combine multiple documents with page-to-page visual reordering.",
    description:
      "Drag-and-drop page organizer. Rearrange pages across multiple files, rotate individual pages, duplicate or delete, and interleave two-sided scans into a single PDF.",
    href: "/tools/pdf/merge",
    icon: Layers,
    badge: "Page-by-Page",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "split",
    name: "Split PDF",
    tagline: "Extract custom page ranges or split into individual documents.",
    description:
      "Visual page selector with instant range syntax (e.g. 1-3, 5, 8-10). Extract marked pages, split every page into a ZIP archive, or divide by fixed intervals.",
    href: "/tools/pdf/split",
    icon: Scissors,
    badge: "Extract & ZIP",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "compress",
    name: "Compress PDF",
    tagline: "Dramatic file size reduction with zero server latency.",
    description:
      "Multi-preset image & stream optimizer with Extreme, Recommended, and Low compression tiers. Real-time DPI adjustment and live file size savings preview.",
    href: "/tools/pdf/compress",
    icon: Zap,
    badge: "Up to 80% Smaller",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "sign",
    name: "Sign PDF",
    tagline: "Draw, type, or stamp authentic signatures on any page.",
    description:
      "Draw with smooth ink, generate cursive calligraphy signatures, or upload photo signatures with auto-transparent background removal. Drag & scale stamps onto pages.",
    href: "/tools/pdf/sign",
    icon: PenTool,
    badge: "Digital Signature",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "edit",
    name: "Redact & Edit PDF",
    tagline: "Permanently erase content with Whiteout or add custom annotations.",
    description:
      "Whiteout eraser tool to securely erase unwanted elements, Blackout redaction boxes for sensitive data, text annotations, and highlight overlays permanently flattened.",
    href: "/tools/pdf/edit",
    icon: Eraser,
    badge: "Whiteout & Redact",
    color: "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "scan",
    name: "Scan & OCR to PDF",
    tagline: "Snap camera photos or images into searchable documents.",
    description:
      "Live device camera capture, scanner enhancement filters (Magic Color, B&W threshold, Grayscale), auto ISO A4 / Letter page fitting, and client-side Tesseract.js OCR.",
    href: "/tools/pdf/scan",
    icon: Camera,
    badge: "Camera & OCR",
    color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400",
  },
];

export default function PdfSuiteHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Client-Side PDF Studio",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/pdf",
    description:
      "A complete, private in-browser PDF power suite. Compress, merge, split, sign, redact, and create PDFs from photos with OCR client-side.",
    creator: {
      "@type": "Person",
      name: "Alok Das",
      url: "https://alokdasofficial.in",
    },
  };

  return (
    <div className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>100% In-Browser Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Client-Side PDF Studio
          </h1>

          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            A fast, private, browser-based PDF suite. Merge, split, compress, sign, redact, and scan documents with OCR—executed entirely on your device with zero server uploads.
          </p>

          {/* Privacy Guarantee Pill Row */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Zero Server Uploads</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Lock className="h-4 w-4 text-blue-500" />
              <span>End-to-End Local Privacy</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Cpu className="h-4 w-4 text-purple-500" />
              <span>Hardware-Accelerated WebAssembly</span>
            </div>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pdfTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary text-secondary-foreground border border-border/60">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                    {tool.name}
                  </h3>

                  <p className="text-xs font-semibold text-foreground/80 mb-2">
                    {tool.tagline}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Security / Architecture Card & Legals */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-gradient-to-br from-secondary/40 via-card to-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Why Client-Side Matters</h3>
                <p className="text-xs text-muted-foreground">Absolute data confidentiality by architectural design</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/tools/pdf/privacy"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:border-emerald-500/40 hover:text-foreground text-xs font-semibold text-muted-foreground transition-all"
              >
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/tools/pdf/terms"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:border-primary/40 hover:text-foreground text-xs font-semibold text-muted-foreground transition-all"
              >
                <Scale className="h-3.5 w-3.5 text-primary" />
                <span>Terms &amp; Conditions</span>
              </Link>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Most online PDF tools upload your contracts, tax returns, and confidential receipts to third-party cloud servers for processing. This PDF Studio uses client-side JavaScript, WebAssembly, HTML5 Canvas, and Web Workers. Your documents remain strictly inside your device&apos;s memory and are destroyed the moment you close the tab.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground border-t border-border/40">
            <span className="font-semibold text-foreground/80">Legal &amp; Compliance:</span>
            <Link href="/tools/pdf/privacy" className="hover:text-primary underline">
              Zero-Server Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/tools/pdf/terms" className="hover:text-primary underline">
              Terms &amp; Disclaimers
            </Link>
          </div>
        </div>

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
