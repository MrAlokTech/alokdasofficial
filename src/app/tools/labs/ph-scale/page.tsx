import { Metadata } from "next";
import Link from "next/link";
import { PhScaleLab } from "@/components/labs/ph-scale-lab";
import { LabNotes } from "@/components/labs/lab-notes";
import { ToolFooter } from "@/components/tools/tool-footer";
import { FlaskConical, ArrowLeft, CheckCircle2 } from "lucide-react";
import { virtualLabsData } from "@/data/labs";

export const metadata: Metadata = {
  title: "pH Scale & Ion Equilibrium Virtual Lab | Alok Das",
  description:
    "Interactive virtual chemistry lab simulating the pH scale, hydronium ion concentration, hydroxide equilibrium, and universal indicator colors at 25°C.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/labs/ph-scale",
  },
  openGraph: {
    title: "pH Scale & Ion Equilibrium Virtual Lab | Alok Das",
    description:
      "Explore acid-base equilibria, calculate [H3O+] and [OH-], and observe color spectrum shifts in real time.",
    url: "https://alokdasofficial.in/tools/labs/ph-scale",
    type: "website",
  },
};

export default function PhScaleLabPage() {
  const lab = virtualLabsData.find((l) => l.id === "ph-scale")!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "pH Scale & Ion Equilibrium Virtual Lab",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/labs/ph-scale",
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
          <span className="text-foreground font-medium">Chemistry</span>
        </div>

        {/* Experiment Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <FlaskConical className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
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
          <PhScaleLab />
          <LabNotes labId="ph-scale" />
        </main>

        {/* Scientific Formulation & Model Assumptions */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Scientific Concept &amp; Governing Equations
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              The potential of hydrogen (pH) is defined as the negative logarithm (base 10) of the activity of hydronium ions in an aqueous solution. In dilute solutions, concentration in molarity approximates activity:
            </p>
            <div className="p-4 rounded-xl bg-secondary/40 font-mono text-[14px] text-foreground overflow-x-auto">
              {lab.equation}
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed pt-1">
              Water autoionizes according to the equilibrium 2H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq). At 25°C, Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴, requiring that pH + pOH always equals 14.00.
            </p>
          </div>

          {/* Model Assumptions */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/80 bg-card">
            <h3 className="text-[15px] font-bold text-foreground">
              Model Assumptions &amp; Boundary Conditions
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
