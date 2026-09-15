import { Metadata } from "next";
import Link from "next/link";
import { MeasurementSigFigsLab } from "@/components/labs/measurement-sigfigs-lab";
import { LabNotes } from "@/components/labs/lab-notes";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Atom, ArrowLeft, CheckCircle2 } from "lucide-react";
import { virtualLabsData } from "@/data/labs";

export const metadata: Metadata = {
  title: "Measurement & Significant Figures Virtual Lab | Alok Das",
  description:
    "Interactive scientific measurement workbench for learning significant figures rules, decimal precision, and uncertainty propagation in chemistry and physics.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/labs/measurement-sigfigs",
  },
  openGraph: {
    title: "Measurement & Significant Figures Virtual Lab | Alok Das",
    description:
      "Master experimental measurement precision, decimal uncertainty, and standard scientific rounding conventions.",
    url: "https://alokdasofficial.in/tools/labs/measurement-sigfigs",
    type: "website",
  },
};

export default function MeasurementSigFigsLabPage() {
  const lab = virtualLabsData.find((l) => l.id === "measurement-sigfigs")!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Measurement & Significant Figures Simulator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/labs/measurement-sigfigs",
    description: lab.description,
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
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Link
            href="/tools/labs"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors min-h-[44px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Virtual Labs Hub</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">General Science</span>
        </div>

        {/* Experiment Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Atom className="h-3.5 w-3.5 text-primary" />
            <span>{lab.subject} &middot; {lab.level}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {lab.name}
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
            {lab.objective}
          </p>
        </header>

        {/* Interactive Experiment Interface */}
        <main className="space-y-8">
          <MeasurementSigFigsLab />
          <LabNotes labId="measurement-sigfigs" />
        </main>

        {/* Scientific Formulation & Concept */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Significance, Uncertainty &amp; Data Integrity
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              In experimental science and analytical chemistry, a numerical reading is meaningless without an understanding of its measurement precision. Significant figures reflect the certainty of measuring apparatus (buret, analytical balance, spectrophotometer):
            </p>
            <div className="p-4 rounded-xl bg-secondary/40 font-mono text-[14px] text-foreground overflow-x-auto">
              {lab.equation}
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed pt-1">
              When propagating experimental measurements through mathematical equations, the output cannot express greater certainty than the least precise instrument employed during data acquisition.
            </p>
          </div>

          {/* Model Assumptions */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/80 bg-card">
            <h3 className="text-[15px] font-bold text-foreground">
              Conventions &amp; Reporting Guidelines
            </h3>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              {lab.assumptions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {lab.faq.map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                  <h4 className="font-semibold text-foreground text-[14px]">
                    {f.question}
                  </h4>
                  <p className="text-muted-foreground text-[13px] leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
