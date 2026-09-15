import { Metadata } from "next";
import Link from "next/link";
import { virtualLabsData } from "@/data/labs";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Atom, Compass, ArrowRight, Sparkles } from "lucide-react";
import { ToolFooter } from "@/components/tools/tool-footer";

export const metadata: Metadata = {
  title: "Virtual Science Labs & Simulations | Alok Das",
  description:
    "Interactive browser-based science simulations for chemistry, physics, and measurement. Explore the pH scale, acid-base titrations, spectrophotometry, reaction kinetics, and Ohm's law.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/labs",
  },
  openGraph: {
    title: "Virtual Science Labs & Simulations | Alok Das",
    description:
      "Interactive scientific experiments and simulations built to explore fundamental concepts through hands-on parameter manipulation.",
    url: "https://alokdasofficial.in/tools/labs",
    type: "website",
  },
};

const subjectIcons: Record<string, React.ElementType> = {
  Chemistry: FlaskConical,
  Physics: Compass,
  "General Science": Atom,
};

export default function VirtualLabsHubPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
        {/* Hub Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <FlaskConical className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Digital Laboratory Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Virtual Labs
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-3xl">
            Interactive science experiments and simulations built to explore concepts through experimentation. Manipulate independent variables, observe real-time reactions, and inspect quantitative data plots.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {virtualLabsData.map((lab) => {
            const Icon = subjectIcons[lab.subject] || FlaskConical;
            return (
              <div
                key={lab.id}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-border transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[11px] font-mono text-muted-foreground uppercase">
                        {lab.subject}
                      </span>
                    </div>
                    <Badge variant={lab.subject === "Chemistry" ? "chem" : "tech"}>
                      {lab.level}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[20px] font-bold text-foreground tracking-tight">
                      {lab.name}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {lab.tagline}
                    </p>
                  </div>

                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {lab.objective}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Governing Formulation
                    </span>
                    <code className="text-[12px] font-mono p-2 rounded-lg bg-secondary/50 text-foreground block overflow-x-auto">
                      {lab.equation}
                    </code>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground font-mono">
                    Accurate Model
                  </span>
                  <Link
                    href={`/tools/labs/${lab.slug}`}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline min-h-[44px]"
                  >
                    <span>Launch Simulation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
