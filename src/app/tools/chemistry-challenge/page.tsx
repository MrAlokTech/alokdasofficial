import { Metadata } from "next";
import { ChemistryChallengeTool } from "@/components/tools/chemistry-challenge-tool";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Atom, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Chemistry Periodic Challenge & Elemental Quiz | Alok Das",
  description:
    "Interactive chemical elements and periodic table challenge testing atomic numbers, elemental symbols, and periodic trends by Alok Das.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/chemistry-challenge",
  },
  openGraph: {
    title: "Chemistry Periodic Challenge & Elemental Quiz | Alok Das",
    description:
      "Test and sharpen your recall of chemical elements, atomic numbers, and periodic properties.",
    url: "https://alokdasofficial.in/tools/chemistry-challenge",
    type: "website",
  },
};

export default function ChemistryChallengePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Chemistry Periodic Challenge",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/chemistry-challenge",
    description:
      "Interactive chemistry quiz testing elemental recall, atomic numbers, symbols, and periodic trends crafted by an M.Sc. Chemistry scholar.",
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
        {/* Page Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Atom className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Chemistry Recall</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Chemistry Periodic Challenge
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
            Test and sharpen your active recall of chemical elements, atomic numbers, periodic groups, and elemental properties with instant scientific explanations.
          </p>
        </header>

        {/* Interactive Client Challenge */}
        <main>
          <ChemistryChallengeTool />
        </main>

        {/* Server-Rendered Explanatory & SEO Content */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Mastering the Periodic Table Through Active Recall
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Active recall is the most effective cognitive technique for committing elemental properties, valence states, and periodic trends to long-term memory. Rather than passive re-reading, testing memory retrieval strengthens neural pathways and sharpens quick recognition needed during laboratory quantitative calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Atomic Numbers
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Connect nuclear charge (Z) directly to identity, nuclear stability, and subshell electron filling.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Periodic Groups
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Reinforce valence family behaviors including alkali reactivity, halogen electronegativity, and noble gas octets.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Chemical History
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Learn the etymological origins of classical elemental symbols such as Wolfram (W), Aurum (Au), and Hydrargyrum (Hg).
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  How does scoring and streak tracking work?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Each correct answer adds 10 points and increments your current streak. Streaks reset upon an incorrect answer, encouraging accuracy over rushed guessing.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  Are there more chemistry tools available?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Yes. Explore the <strong>Virtual Science Labs</strong> for interactive simulations of the pH scale, acid-base titrations, and spectrophotometry (Beer-Lambert law).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
