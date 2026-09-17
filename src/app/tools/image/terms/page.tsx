import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  Gavel,
  Mail,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { ImageToolFooter } from "@/components/tools/image/common/ImageToolFooter";
import { personalData } from "@/data/personal";

export const metadata: Metadata = {
  title: "Terms and Conditions | Client-Side Image Studio | Alok Das",
  description:
    "Terms and Conditions for Client-Side Image Studio. Permitted uses, user responsibilities, client-side execution disclaimers, and intellectual property terms.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/image/terms",
  },
  openGraph: {
    title: "Terms and Conditions - Client-Side Image Studio | Alok Das",
    description:
      "Terms of service, user rights, and liability limitations for Client-Side Image Studio.",
    url: "https://alokdasofficial.in/tools/image/terms",
    type: "website",
  },
};

export default function ImageTermsPage() {
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
            <Link
              href="/tools/image/privacy"
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
            Image Studio Terms &amp; Conditions
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Please review these terms governing the use of the Client-Side Image Studio software.
            By utilizing the tools on this website, you agree to these terms.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span>Last Updated: {lastUpdated}</span>
            <span>&bull;</span>
            <span>Applies to all /tools/image/* routes</span>
          </div>
        </header>

        {/* Highlight Alert */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span>Important Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The Image Studio operates 100% inside your local web browser without cloud processing.
            You are exclusively responsible for the content you edit, compress, or export, ensuring you possess all lawful rights to the media you process.
          </p>
        </div>

        {/* Terms Articles */}
        <div className="space-y-8 text-sm text-foreground/90 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>1. Permitted Uses &amp; Scope of Service</span>
            </h2>
            <p>
              Client-Side Image Studio provides free in-browser utilities for compressing images, resizing dimensions, cropping aspect ratios, rotating/mirroring, adding watermarks, applying aesthetic LUT color filters, and compiling images into PDF documents. You may use this software for both personal and commercial image workflows.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>2. Intellectual Property &amp; Copyright</span>
            </h2>
            <p>
              You certify that any media, photographs, graphical logos, or text watermarks you load into the tool are either owned by you, licensed to you, or in the public domain. You agree not to use the tool to violate copyright laws, trademark rights, or defame individuals.
            </p>
            <p className="text-muted-foreground">
              Alok Das claims no ownership over the images processed. All rights, title, and interest in your generated images remain solely with you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>3. Target File Size &amp; Compression Disclaimer</span>
            </h2>
            <p>
              While our iterative binary-search compression algorithm aims to satisfy strict KB limit targets (such as portals requiring images under 50KB or 200KB), compression results depend on the source image complexity and browser canvas precision. Users are advised to inspect downloaded files to ensure they meet their specific submission guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              <span>4. Disclaimer of Warranty &amp; Limitation of Liability</span>
            </h2>
            <p>
              This software is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, either express or implied.
            </p>
            <p className="text-muted-foreground">
              Because all calculations take place within your local device environment, the site owner (Alok Das) shall not be held liable for any data loss, local browser crashes, device resource exhaustion from high-resolution files, or missed portal deadlines resulting from the use of these free utilities.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border/60">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>5. Inquiries &amp; Legal Notices</span>
            </h2>
            <p>
              For legal inquiries or notices regarding this service, please reach out directly:
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
