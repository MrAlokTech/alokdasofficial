import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldAlert,
  ArrowLeft,
  PenTool,
  Eraser,
  Camera,
  AlertTriangle,
  Gavel,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { ToolFooter } from "@/components/tools/tool-footer";
import { personalData } from "@/data/personal";

export const metadata: Metadata = {
  title: "Terms and Conditions | Client-Side PDF Studio | Alok Das",
  description:
    "Terms and Conditions for Client-Side PDF Studio. Understand the permitted uses, signature disclaimers, redaction verifications, and liability terms.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pdf/terms",
  },
  openGraph: {
    title: "Terms and Conditions - Client-Side PDF Studio | Alok Das",
    description:
      "Terms of service, electronic signature disclaimers, and user responsibilities for Client-Side PDF Studio.",
    url: "https://alokdasofficial.in/tools/pdf/terms",
    type: "website",
  },
};

export default function PdfTermsPage() {
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
            <Link
              href="/tools/pdf/privacy"
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Terms &amp; Conditions
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="space-y-4 border-b border-border/60 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Scale className="h-3.5 w-3.5 text-primary" />
            <span>Service Agreement &amp; Usage Rules</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Terms and Conditions
          </h1>

          <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
            Effective Date: {lastUpdated} &bull; Governing use of the <strong>Client-Side PDF Studio</strong> suite available at <code className="text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">alokdasofficial.in/tools/pdf</code>.
          </p>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3.5">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-semibold text-foreground">Agreement Summary</p>
              <p className="text-muted-foreground leading-relaxed">
                By loading, manipulating, or processing documents through Client-Side PDF Studio, you confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree with any provision, please discontinue using this software suite.
              </p>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-10 text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <FileText className="h-5 w-5 text-primary" />
              <h2>1. Scope of Utilities Provided</h2>
            </div>
            <p>
              Client-Side PDF Studio provides a collection of free, browser-executed utilities designed to assist users with common PDF file management tasks, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Merge PDF:</strong> Combining multi-page documents and reordering page sequences.</li>
              <li><strong>Split PDF:</strong> Extracting discrete page subsets or batch-packaging pages into ZIP archives.</li>
              <li><strong>Compress PDF:</strong> Downsampling embedded images and optimizing object streams to reduce file size.</li>
              <li><strong>Sign PDF:</strong> Stamping handwritten ink, cursive typography, or image signatures onto document pages.</li>
              <li><strong>Redact &amp; Edit PDF:</strong> Applying Whiteout eraser patches and blackout boxes directly into the PDF content stream.</li>
              <li><strong>Scan &amp; OCR to PDF:</strong> Capturing photos via camera, applying scanner filters, and embedding searchable OCR text layers.</li>
            </ul>
            <p>
              The service is provided entirely free of charge for lawful personal, educational, research, and commercial applications.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h2>2. User Responsibilities &amp; Document Ownership</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Document Ownership:</strong> You retain complete, unencumbered ownership, copyright, and intellectual property rights in all documents, images, and text you process through this tool. We claim no title, license, or right over your materials.
              </li>
              <li>
                <strong>Authorization:</strong> You represent and warrant that you hold all required legal rights, licenses, or authorizations to process, edit, redact, or sign any documents submitted into the tool.
              </li>
              <li>
                <strong>Prohibited Uses:</strong> You agree not to utilize this tool to create fraudulent documents, forge signatures of unauthorized individuals, distribute malicious files, or violate any applicable municipal, state, national, or international statutes.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <PenTool className="h-5 w-5 text-primary" />
              <h2>3. Electronic Signature Disclaimer</h2>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs sm:text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Important Notice Regarding Legal Validity of Signatures</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The <strong>Sign PDF</strong> feature produces a visual/graphical representation of a signature (ink drawing, cursive font rendering, or image stamp) embedded directly into the document&apos;s visual layer.
              </p>
            </div>
            <p>
              Please take note of the following distinctions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Not a Certificate Authority (CA):</strong> Client-Side PDF Studio does <em>not</em> issue Public Key Infrastructure (PKI) X.509 digital certificates, hardware cryptographic tokens, or timestamped audit trail tokens.
              </li>
              <li>
                <strong>Statutory Compliance:</strong> The legal enforceability of electronic signatures differs substantially by jurisdiction (e.g., the <em>Information Technology Act, 2000</em> in India, the <em>ESIGN Act / UETA</em> in the United States, and <em>eIDAS Regulation</em> in the European Union).
              </li>
              <li>
                <strong>Excluded Document Classes:</strong> Certain instruments (such as wills, powers of attorney, trusts, real estate conveyances, and negotiable instruments) often legally mandate physical notarization or qualified digital signatures with cryptographic certificates. It is your sole responsibility to ensure that a visual signature fulfills the statutory prerequisites of your jurisdiction and counterparty.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Eraser className="h-5 w-5 text-primary" />
              <h2>4. Redaction, Whiteout &amp; OCR Disclaimers</h2>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">A. Redaction &amp; Whiteout Verification</h3>
                <p className="text-xs sm:text-sm pt-1">
                  The Whiteout and Redaction tools place opaque, permanently flattened graphical rectangles over designated page coordinates. Although this visually conceals the underlying content, users dealing with confidential, classified, or legally sensitive records must independently verify the generated output in a standard PDF viewer before public dissemination to confirm that no underlying text objects or selectable layers remain accessible.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">B. OCR Recognition Accuracy</h3>
                <p className="text-xs sm:text-sm pt-1">
                  Optical Character Recognition (OCR) is performed client-side using neural models. Output accuracy depends heavily on input image resolution, ambient lighting, font legibility, orientation, and language complexity. Alok Das provides no warranty that converted text layers are 100% error-free or suitable for evidentiary verification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Camera className="h-5 w-5 text-primary" />
              <h2>5. Device Memory &amp; Session Continuity</h2>
            </div>
            <p>
              Because all calculations execute locally within your device&apos;s browser sandbox:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Heavy operations (such as processing high-resolution scans or documents exceeding several hundred pages) rely directly on your device&apos;s available RAM and CPU performance.
              </li>
              <li>
                In the event of unexpected browser crashes, tab closures, or power interruption, un-downloaded files cannot be recovered, as no server backups exist. Users are strongly encouraged to save intermediate work frequently.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2>6. &ldquo;AS-IS&rdquo; Disclaimer of Warranties</h2>
            </div>
            <p>
              THE CLIENT-SIDE PDF STUDIO SUITE AND ALL ACCOMPANYING SOFTWARE CODE ARE PROVIDED ON AN <strong>&ldquo;AS IS&rdquo;</strong> AND <strong>&ldquo;AS AVAILABLE&rdquo;</strong> BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, OR NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SUITE WILL OPERATE UNINTERRUPTED, BUG-FREE, OR COMPATIBLE WITH EVERY CORRUPTED OR NON-STANDARD PDF FILE FORMAT.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Gavel className="h-5 w-5 text-primary" />
              <h2>7. Limitation of Liability</h2>
            </div>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ALOK DAS OR ASSOCIATED CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING LOSS OF DATA, LOSS OF PROFITS, BUSINESS INTERRUPTION, OR LEGAL DISPUTES ARISING FROM SIGNED DOCUMENTS) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THIS SOFTWARE.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Scale className="h-5 w-5 text-primary" />
              <h2>8. Governing Law and Jurisdiction</h2>
            </div>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of <strong>India</strong>, without regard to conflict of law principles. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in the competent courts situated in Assam, India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2.5 text-foreground font-bold text-lg sm:text-xl">
              <Mail className="h-5 w-5 text-primary" />
              <h2>9. Inquiries &amp; Contact</h2>
            </div>
            <p>
              If you have any questions or require clarification regarding these Terms and Conditions, please communicate with us at:
            </p>
            <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-2 text-xs sm:text-sm">
              <p className="font-semibold text-foreground">{personalData.name}</p>
              <p>Email: <a href={`mailto:${personalData.contact.email}`} className="text-primary hover:underline">{personalData.contact.email}</a></p>
              <p>Address: {personalData.location.full}</p>
              <p>Website: <a href="https://alokdasofficial.in" className="text-primary hover:underline">alokdasofficial.in</a></p>
            </div>
          </section>
        </div>

        {/* Bottom Legal Navigation Bar */}
        <div className="p-6 rounded-2xl border border-border/70 bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Also read our:</span>
            <Link
              href="/tools/pdf/privacy"
              className="font-semibold text-primary hover:underline"
            >
              Privacy Policy
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
