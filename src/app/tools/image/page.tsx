import { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Maximize2,
  Crop,
  RotateCw,
  RefreshCw,
  Stamp,
  Sparkles,
  FileText,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  Layers,
} from "lucide-react";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { AllInOneStudioWorkspace } from "@/components/tools/image/studio/AllInOneStudioWorkspace";

export const metadata: Metadata = {
  title: "Client-Side Image Studio | 100% Private In-Browser Image Tools",
  description:
    "Compress, resize, crop, rotate, transcode, watermark, and apply LUT filters to images directly in your browser. 100% client-side Web Canvas processing with zero server uploads.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image",
  },
  openGraph: {
    title: "Client-Side Image Studio | Alok Das",
    description:
      "A complete, private in-browser image power suite. Compress to target KB, resize, crop, rotate, apply 12+ LUT filters, add custom watermarks, and export bulk images to PDF with zero server latency.",
    url: "https://alokdasofficial.in/tools/image",
    type: "website",
  },
};

const imageTools = [
  {
    id: "compress",
    name: "Compress Image",
    tagline: "Reduce MB to strict KB with binary-search optimization.",
    description:
      "Target file size in KB (e.g. < 50KB or < 200KB for exam/govt portals) or manual quality slider. Batch support with independent file limits and live savings preview.",
    href: "/tools/image/compress",
    icon: Zap,
    badge: "Target KB Matching",
    color:
      "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    id: "resize",
    name: "Resize Image",
    tagline: "Scale dimensions, maintain aspect ratio, or choose presets.",
    description:
      "Pixel-precise dimensions, percentage scaling (25%, 50%, 75%, 200%), and standard presets (Full HD, Social Square, Passport 350x450, Banner).",
    href: "/tools/image/resize",
    icon: Maximize2,
    badge: "Presets & Scale %",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "crop",
    name: "Crop Image",
    tagline: "Visual interactive drag box with rule-of-thirds grid.",
    description:
      "Draggable crop handles with standard aspect ratios (1:1, 16:9, 4:3, 9:16, 3:2, Passport photo 3.5:4.5) and freeform cropping.",
    href: "/tools/image/crop",
    icon: Crop,
    badge: "Interactive Overlay",
    color:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "rotate",
    name: "Rotate & Flip",
    tagline:
      "90° step rotations, 180° flip, and horizontal/vertical mirroring.",
    description:
      "Correct image orientation, mirror selfie photos, and apply custom angle adjustments across single or queued bulk images.",
    href: "/tools/image/rotate",
    icon: RotateCw,
    badge: "Mirror & Steps",
    color:
      "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    id: "convert",
    name: "Convert Format",
    tagline: "Instant transcode between JPG, PNG, and WEBP formats.",
    description:
      "High-speed client-side image conversion. Handles transparency for JPG safely with white background fill. Download as single files or ZIP.",
    href: "/tools/image/convert",
    icon: RefreshCw,
    badge: "JPG / PNG / WEBP",
    color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "watermark",
    name: "Add Watermark",
    tagline:
      "Stamp copyright text, logos, and repeating diagonal tile patterns.",
    description:
      "Protect your photos with customizable text, typography, color, opacity, 9-anchor positions, and diagonal repeating tile security grids.",
    href: "/tools/image/watermark",
    icon: Stamp,
    badge: "Text & Logo Stamps",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    id: "filters",
    name: "Filters & LUT Studio",
    tagline: "12+ aesthetic LUT presets plus manual color grading.",
    description:
      "Cinematic Teal & Orange, Vintage 1980s, Golden Warmth, Classic Noir, Cyberpunk, and manual brightness, contrast, saturation, and sharpen sliders.",
    href: "/tools/image/filters",
    icon: Sparkles,
    badge: "12+ Film Presets",
    color:
      "from-fuchsia-500/10 to-purple-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    id: "to-pdf",
    name: "Export to PDF",
    tagline: "Compile single or bulk images into a clean multi-page document.",
    description:
      "Visual page reordering, ISO A4 / US Letter / Auto-fit page sizes, configurable margins, and instant client-side PDF compilation via pdf-lib.",
    href: "/tools/image/to-pdf",
    icon: FileText,
    badge: "Bulk Multi-Page",
    color:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export default function ImageStudioPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Client-Side Image Studio</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser &bull; Zero Server Uploads</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Complete Browser-Native Image Studio
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Compress MB to KB, resize, crop, rotate, transcode formats, apply
            aesthetic LUT filters, stamp custom watermarks, and export bulk
            images to PDF—powered 100% by your device&apos;s graphics engine.
          </p>
        </div>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Exact Target KB Optimization</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Iterative binary-search compression hits exact file size limits
              (under 50KB, 100KB, 200KB) required for official portals.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Bulk Queue with Independent Overrides</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Process dozens of images at once, apply batch watermarks/filters,
              and customize output dimensions or KB size per file.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-border/80 bg-card/60 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Strict Client Side Privacy</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Files are processed entirely on your device with zero cloud
              transmission.
            </p>
          </div>
        </div>

        {/* All-in-One Studio Workspace Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                All-in-One Image Studio Workspace
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Drag and drop your images below to edit all parameters in a
                single unified interface.
              </p>
            </div>
          </div>

          <AllInOneStudioWorkspace />
        </div>

        {/* Dedicated Focused Tools Catalog */}
        <div className="space-y-6 pt-8 border-t border-border/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Dedicated Focused Tools
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Direct access to dedicated specialized workflows for high-volume
              tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {imageTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group relative rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary text-secondary-foreground border border-border/60">
                        {tool.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        <span>{tool.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {tool.tagline}
                      </p>
                    </div>

                    <p className="text-[12px] text-muted-foreground/80 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center text-[11px] font-semibold text-primary">
                    <span>Open Tool</span>
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Privacy Architecture FAQ */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              Security &amp; Architecture
            </span>
            <h3 className="text-xl font-bold text-foreground">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground">
                Are my photos or images sent to any server?
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                No. All image operations, pixel manipulation, filter
                convolutions, and compression passes execute 100% locally inside
                your browser memory using HTML5 Canvas 2D and modern browser
                graphics APIs. Zero bytes are uploaded.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground">
                How does the Target File Size (KB) feature work?
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                The compressor runs an iterative binary-search algorithm
                directly on your browser canvas to discover the highest quality
                tier that remains strictly beneath your specified KB threshold,
                downscaling dimensions only if necessary.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground">
                Can I edit dozens of images in bulk?
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Yes! You can drop multiple images simultaneously. Apply
                watermarks, LUT filters, or formats across all images at once,
                while customizing individual target sizes, dimensions, or
                rotations independently.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-foreground">
                How does exporting images to PDF work?
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Using{" "}
                <code className="font-mono text-[11px] bg-secondary px-1 rounded">
                  pdf-lib
                </code>
                , the tool compiles your images into a PDF with configurable
                page sizes (A4, Letter, Auto-fit), margins, and orientation
                directly in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <ImageToolFooter />
      </div>
    </div>
  );
}
