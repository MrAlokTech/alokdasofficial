import { Metadata } from "next";
import Link from "next/link";
import { ReactionKineticsLab } from "@/components/labs/reaction-kinetics-lab";
import { LabNotes } from "@/components/labs/lab-notes";
import { ToolFooter } from "@/components/tools/tool-footer";
import { FlaskConical, ArrowLeft, CheckCircle2 } from "lucide-react";
import { virtualLabsData } from "@/data/labs";

export const metadata: Metadata = {
  title: "Chemical Reaction Kinetics Virtual Lab | Alok Das",
  description:
    "Interactive chemical reaction kinetics simulation exploring rate laws, the Arrhenius equation, temperature dependence, activation energy, and catalyst acceleration.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/labs/reaction-kinetics",
  },
  openGraph: {
    title: "Chemical Reaction Kinetics Virtual Lab | Alok Das",
    description:
      "Simulate chemical conversion rates, Arrhenius temperature dependence, and concentration decay curves.",
    url: "https://alokdasofficial.in/tools/labs/reaction-kinetics",
    type: "website",
  },
};

export default function ReactionKineticsLabPage() {
  const lab = virtualLabsData.find((l) => l.id === "reaction-kinetics")!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Chemical Reaction Kinetics Simulator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/labs/reaction-kinetics",
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
          <ReactionKineticsLab />
          <LabNotes labId="reaction-kinetics" />
        </main>

        {/* Scientific Formulation & Concept */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Rate Laws &amp; Arrhenius Activation Energy
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Chemical kinetics studies the rates of chemical processes. For a first-order decomposition reaction, the consumption of reactant [A] proceeds exponentially:
            </p>
            <div className="p-4 rounded-xl bg-secondary/40 font-mono text-[14px] text-foreground overflow-x-auto">
              {lab.equation}
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed pt-1">
              According to collision theory, molecules must possess kinetic energy exceeding the activation energy barrier (Ea) to react. Adding a catalyst opens an alternate reaction pathway with reduced Ea, substantially boosting the fraction of successful molecular collisions.
            </p>
          </div>

          {/* Model Assumptions */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/80 bg-card">
            <h3 className="text-[15px] font-bold text-foreground">
              Model Assumptions &amp; Kinetic Boundaries
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
