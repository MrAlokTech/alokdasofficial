import { Metadata } from "next";
import Link from "next/link";
import { toolsData } from "@/data/tools";
import { Badge } from "@/components/ui/badge";
import { Radio, Timer, Clock, Atom, FlaskConical, ArrowRight, Vote, FileText } from "lucide-react";
import { ToolFooter } from "@/components/tools/tool-footer";

export const metadata: Metadata = {
  title: "Tools & Experiments | Alok Das",
  description:
    "A collection of browser-based utilities and experiments built for learning, productivity, and scientific curiosity by Alok Das.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools",
  },
  openGraph: {
    title: "Tools & Experiments | Alok Das",
    description:
      "Interactive web tools, focus timers, Morse code trainers, and virtual science labs created by Alok Das.",
    url: "https://alokdasofficial.in/tools",
    type: "website",
  },
};

const iconMap: Record<string, React.ElementType> = {
  Radio,
  Timer,
  Clock,
  Atom,
  FileText,
};

export default function ToolsHubPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Interactive Workshop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Tools &amp; Experiments
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
            A collection of small browser-based utilities I&apos;ve built for learning, productivity, and scientific curiosity.
          </p>
        </div>

        {/* Featured Banner: Virtual Science Labs */}
        <div className="mb-10 rounded-2xl border border-border/80 bg-gradient-to-br from-emerald-500/5 via-card to-card p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
                  Interactive Science Simulations
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Virtual Science Labs
                </h2>
              </div>
            </div>
            <Link
              href="/tools/labs"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[14px] font-medium transition-colors min-h-[44px] flex-shrink-0"
            >
              <span>Explore Virtual Labs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Interactive, browser-based experiments exploring the pH scale, acid-base titrations, spectrophotometry (Beer-Lambert Law), reaction kinetics, and fundamental physics.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[12px]">
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              pH Scale
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              Titration Simulator
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              Beer-Lambert Law
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              Reaction Kinetics
            </span>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
              Ohm&apos;s Law
            </span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toolsData.map((tool) => {
            const Icon = iconMap[tool.iconName] || Radio;
            return (
              <div
                key={tool.id}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-border transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground uppercase">
                        {tool.category}
                      </span>
                    </div>
                    <Badge variant={tool.category === "Science" ? "chem" : "tech"}>
                      {tool.badge}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[20px] font-bold text-foreground tracking-tight">
                      {tool.name}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {tool.tagline}
                    </p>
                  </div>

                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="space-y-1.5 pt-1 text-[12px] text-muted-foreground">
                    {tool.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground font-mono">
                    Free &middot; Local in browser
                  </span>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline min-h-[44px]"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Feedback & Polls Banner */}
        <div className="mt-10 rounded-2xl border border-border/80 bg-secondary/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-[12px] uppercase tracking-wider">
              <Vote className="h-4 w-4" />
              <span>Community Voice</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Help Decide What I Build Next
            </h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Vote anonymously in active polls on upcoming browser tools, laboratory simulations, and study utilities.
            </p>
          </div>
          <Link
            href="/polls"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-[14px] font-medium shadow-sm hover:brightness-105 active:scale-95 transition-all min-h-[44px] flex-shrink-0"
          >
            <span>View Open Polls</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
