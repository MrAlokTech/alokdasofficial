import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cpu,
  ArrowLeft,
  FileCheck,
  Trash2,
  ServerOff,
  EyeOff,
  HardDrive,
  Scale,
  Mail,
} from "lucide-react";
import { ToolFooter } from "@/components/tools/tool-footer";
import { personalData } from "@/data/personal";

export const metadata: Metadata = {
  title: "Privacy Policy | Client-Side PDF Studio | Alok Das",
  description:
    "Privacy Policy for Client-Side PDF Studio. 100% private in-browser document processing with zero server uploads, zero telemetry, and complete data confidentiality.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/privacy",
  },
  openGraph: {
    title: "Privacy Policy - Client-Side PDF Studio | Alok Das",
    description:
      "Understand how Client-Side PDF Studio ensures total document privacy: zero server uploads, 100% in-browser WebAssembly processing.",
    url: "https://alokdasofficial.in/tools/pdf/privacy",
    type: "website",
  },
};

export default function PdfPrivacyPage() {
  const lastUpdated = "September 17, 2026";

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tools/pdf"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to PDF Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Privacy Policy
            </span>
            <Link
              href="/tools/pdf/terms"
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
            <span>Document Confidentiality Guarantee</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>

          <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
            Effective Date: {lastUpdated} &bull; Applicable to all tools within <strong>Client-Side PDF Studio</strong> (Merge, Split, Compress, Sign, Redact/Edit, and Scan/OCR).
          </p>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 flex items-start gap-3.5">
            <ServerOff className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-foreground">The Zero-Upload Commitment</p>
              <p className="text-muted-foreground leading-relaxed">
                Your PDF documents, photos, text overlays, and electronic signatures are <strong>never transmitted to any remote server or cloud infrastructure</strong>. All processing is executed solely in your device&apos;s local browser memory via WebAssembly and client-side JavaScript.
              </p>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-10 text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Cpu className="h-5 w-5 text-primary" />
              <h2>1. How the Architecture Protects Your Privacy</h2>
            </div>
            <p>
              Traditional online PDF utility websites require users to upload confidential documents (contracts, financial audits, medical records, identification papers) to third-party cloud servers. Once uploaded, those files are vulnerable to unauthorized inspection, breach, or server logging.
            </p>
            <p>
              <strong>Client-Side PDF Studio operates on an entirely distinct paradigm:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Client-Side Execution:</strong> All document manipulation algorithms (combining pages, slicing page ranges, resampling graphics, applying whiteout masks, and vector signature stamps) are executed strictly in your web browser through <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">pdf-lib</code> and <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">pdfjs-dist</code>.
              </li>
              <li>
                <strong>In-Browser OCR:</strong> Optical Character Recognition for camera scans is powered by <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">Tesseract.js</code> compiled to WebAssembly (Wasm). Text detection runs on your local CPU / Web Workers without streaming raw images or recognized text back to any server.
              </li>
              <li>
                <strong>Sandboxed Memory:</strong> Files exist solely in volatile browser Random Access Memory (RAM) or blob URLs managed directly by your browser engine.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <EyeOff className="h-5 w-5 text-primary" />
              <h2>2. Information We Do NOT Collect</h2>
            </div>
            <p>
              To eliminate any ambiguity, we explicitly declare that we do <strong>not</strong> collect, inspect, log, share, or monetize any of the following:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
                <span className="font-semibold text-xs text-foreground block">Uploaded Files &amp; Content</span>
                <p className="text-xs text-muted-foreground">
                  The actual binary PDF streams, page layouts, text, images, or forms in your documents.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
                <span className="font-semibold text-xs text-foreground block">Signatures &amp; Stamps</span>
                <p className="text-xs text-muted-foreground">
                  Your handwritten ink strokes, typed cursive glyphs, or uploaded stamp photos.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
                <span className="font-semibold text-xs text-foreground block">Camera Captures &amp; Images</span>
                <p className="text-xs text-muted-foreground">
                  Camera video streams, snapshots, and processed scan photos from the Scan &amp; OCR tool.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
                <span className="font-semibold text-xs text-foreground block">File Names &amp; Metadata</span>
                <p className="text-xs text-muted-foreground">
                  Original filenames, author tags, creation timestamps, page counts, or embedded exif tags.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Trash2 className="h-5 w-5 text-primary" />
              <h2>3. Data Retention and Destruction</h2>
            </div>
            <p>
              Because your documents are never transmitted across the network, our servers retain <strong>0 bytes</strong> of your data. The lifecycle of your files follows these clear bounds:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>During Active Session:</strong> The documents you drop into the tool exist as temporary <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">ArrayBuffer</code> or <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">Blob</code> objects inside your active browser tab.
              </li>
              <li>
                <strong>Upon Reset or Tab Close:</strong> Whenever you click &ldquo;Clear&rdquo;, navigate to another page, or close the browser tab, the browser automatically purges the memory heap and executes garbage collection.
              </li>
              <li>
                <strong>No Cloud Backups:</strong> There are no server databases, intermediate cache storage pools, or recovery logs holding your files. Once destroyed, they cannot be recovered by anyone.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <HardDrive className="h-5 w-5 text-primary" />
              <h2>4. Third-Party CDNs and Static Assets</h2>
            </div>
            <p>
              To run high-performance WebAssembly routines and OCR language models without excessive initial page load bundles, the tool may request static code libraries:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>PDF.js Worker &amp; Fonts:</strong> Loaded over secure HTTPS to parse and render vector PDF pages. Only standard static JavaScript and WebAssembly code files are requested.
              </li>
              <li>
                <strong>Tesseract OCR Trained Data:</strong> When running OCR, language recognition matrices (such as English traineddata) are downloaded directly to your browser&apos;s IndexedDB/Cache storage. No image data is shared with the hosting CDN.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Lock className="h-5 w-5 text-primary" />
              <h2>5. Cookies and Telemetry</h2>
            </div>
            <p>
              The PDF Studio suite does not place tracking cookies, advertising identifiers, or user surveillance beacons on your machine. We do not inspect user behaviour within the tool or link your document workflows to any personal profile.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Scale className="h-5 w-5 text-primary" />
              <h2>6. Global Privacy Regulations Compliance</h2>
            </div>
            <p>
              Because our architecture is founded on the principle of <em>Data Minimization and Privacy by Design</em>:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>General Data Protection Regulation (GDPR / UK GDPR):</strong> Under Articles 5, 25, and 32, no personal data from your documents is processed on our servers, satisfying rigorous data protection requirements by default.
              </li>
              <li>
                <strong>California Consumer Privacy Act (CCPA / CPRA):</strong> We do not sell, share, or retain personal information derived from PDF files.
              </li>
              <li>
                <strong>Digital Personal Data Protection Act, 2023 (DPDP India):</strong> As a zero-server processor, no personal data fiduciary or processing obligations arise concerning your document contents.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <FileCheck className="h-5 w-5 text-primary" />
              <h2>7. User Security Recommendations</h2>
            </div>
            <p>
              While Client-Side PDF Studio ensures that your documents never leave your machine, the security of your documents depends also on your local device environment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Do not use public or unverified shared computers when editing confidential documents.</li>
              <li>Ensure your web browser is updated with the latest security patches.</li>
              <li>Close your browser tab after completing sensitive redactions or signature stamping.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Mail className="h-5 w-5 text-primary" />
              <h2>8. Contact &amp; Inquiries</h2>
            </div>
            <p>
              If you have any questions regarding the security architecture or privacy posture of the PDF Studio suite, please contact the developer directly:
            </p>
            <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-foreground">{personalData.name}</p>
              <p>Email: <a href={`mailto:${personalData.contact.email}`} className="text-primary hover:underline">{personalData.contact.email}</a></p>
              <p>Location: {personalData.location.full}</p>
              <p>Website: <a href="https://alokdasofficial.in" className="text-primary hover:underline">alokdasofficial.in</a></p>
            </div>
          </section>
        </div>

        {/* Bottom Legal Navigation Bar */}
        <div className="p-6 rounded-2xl border border-border/70 bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Also read our:</span>
            <Link
              href="/tools/pdf/terms"
              className="font-semibold text-primary hover:underline"
            >
              Terms and Conditions
            </Link>
          </div>
          <Link
            href="/tools/pdf"
            className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span>Return to PDF Studio Tools</span>
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>

        {/* Tool Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
