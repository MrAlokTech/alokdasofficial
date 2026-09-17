import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cpu,
  ArrowLeft,
  FileCheck,
  ServerOff,
  EyeOff,
  HardDrive,
  Scale,
  Mail,
  Zap,
} from "lucide-react";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { personalData } from "@/data/personal";

export const metadata: Metadata = {
  title: "Privacy Policy | Client-Side Image Studio | Alok Das",
  description:
    "Privacy Policy for Client-Side Image Studio. 100% private in-browser image processing, HTML5 Canvas 2D manipulation, zero server uploads, zero telemetry, and complete data confidentiality.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/privacy",
  },
  openGraph: {
    title: "Privacy Policy - Client-Side Image Studio | Alok Das",
    description:
      "Understand how Client-Side Image Studio guarantees complete photo privacy: zero server uploads, 100% in-browser Canvas execution.",
    url: "https://alokdasofficial.in/tools/image/privacy",
    type: "website",
  },
};

export default function ImagePrivacyPage() {
  const lastUpdated = "September 17, 2026";

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tools/image"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Image Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Privacy Policy
            </span>
            <Link
              href="/tools/image/terms"
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>

        {/* Header */}
        <header className="space-y-4 border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Privacy-First Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Image Studio Privacy Policy
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Your images, photographs, personal signatures, and documents never leave your device.
            This policy articulates our mathematical guarantee of zero data transmission, zero server-side storage, and zero telemetry.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span>Last Updated: {lastUpdated}</span>
            <span>&bull;</span>
            <span>Effective Immediately</span>
          </div>
        </header>

        {/* Core Privacy Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ServerOff className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Zero Server Uploads</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Files are loaded directly into your browser&apos;s volatile RAM. No server endpoints exist to receive or store your image files.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Local Canvas Pipeline</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All pixel transformations, LUT matrix calculations, and watermarking run using native HTML5 Canvas 2D and Web Workers.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <EyeOff className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Zero Image Telemetry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No tracking pixels, third-party analytics on image data, or training on user images occurs. Your creative output is yours alone.
            </p>
          </div>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm text-foreground/90 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <span>1. Technical Architecture &amp; Data Flow</span>
            </h2>
            <p>
              Unlike conventional cloud image compressors and online editors that transmit your files to remote backends for processing, <strong>Client-Side Image Studio</strong> executes every operation directly within the client environment:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Local Memory Allocation:</strong> When you drag, drop, or paste an image, the browser assigns a local memory buffer using <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">URL.createObjectURL()</code> or direct Blob reference.
              </li>
              <li>
                <strong className="text-foreground">In-Memory Canvas Transformation:</strong> Resizing, cropping, 90&deg; step rotations, LUT filter applications, and watermarking are computed by the browser&apos;s graphics pipeline inside an offscreen <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">HTMLCanvasElement</code>.
              </li>
              <li>
                <strong className="text-foreground">Binary-Search Compression:</strong> The target KB optimizer iteratively adjusts the canvas encoding quality and dimension scaling directly on your machine until the specified file size limit is reached.
              </li>
              <li>
                <strong className="text-foreground">Client-Side PDF Compilation:</strong> When exporting images to PDF, <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">pdf-lib</code> compiles the raw image bytes into a PDF binary entirely in JavaScript without network requests.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>2. No Cookies, No Identifiers, No Remote Logging</span>
            </h2>
            <p>
              Client-Side Image Studio does not create tracking cookies, does not log IP addresses alongside processed images, and does not retain metadata extracted from images (such as EXIF camera data, GPS coordinates, or timestamps). All temporary memory allocations are wiped clean when you close or refresh the browser tab.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>3. User Ownership &amp; Intellectual Property</span>
            </h2>
            <p>
              You maintain 100% ownership, copyright, and control over any images, watermarks, graphics, or logos processed in this studio. The site creator (Alok Das) claims zero rights, licenses, or title to any content you upload or export.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span>4. Verifiable Security</span>
            </h2>
            <p>
              You can verify this privacy model yourself at any moment:
            </p>
            <ol className="list-decimal pl-6 space-y-1.5 text-muted-foreground">
              <li>Open your browser Developer Tools (<kbd className="text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">F12</kbd> or <kbd className="text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+Shift+I</kbd>).</li>
              <li>Navigate to the <strong>Network</strong> tab.</li>
              <li>Drop an image, compress it, apply filters, and click Download.</li>
              <li>Observe that <strong>zero outbound network requests</strong> or payloads containing your file bytes are transmitted.</li>
            </ol>
          </section>

          <section className="space-y-3 pt-4 border-t border-border/60">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>5. Contact &amp; Questions</span>
            </h2>
            <p>
              If you have any questions regarding the security architecture or privacy implementation of these tools, feel free to contact:
            </p>
            <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 text-xs space-y-1">
              <p className="font-bold text-foreground">Alok Das</p>
              <p className="text-muted-foreground">Website: <Link href="/" className="text-primary hover:underline">alokdasofficial.in</Link></p>
              <p className="text-muted-foreground">Email: <a href={`mailto:${personalData.contact.email}`} className="text-primary hover:underline">{personalData.contact.email}</a></p>
            </div>
          </section>
        </div>

        <ImageToolFooter />
      </div>
    </div>
  );
}
