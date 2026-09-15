import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FeaturedProjects() {
  const proofPoints = [
    {
      id: "dissertation",
      category: "ACADEMIC RESEARCH",
      year: "2025",
      badgeVariant: "chem" as const,
      title: "Phytochemical Analysis of Medicinal Plants",
      subtitle: "B.Sc. Research Dissertation (69.07% Distinction)",
      description:
        "Investigated bioactive phytochemical constituents of local medicinal flora via solvent extraction, TLC chromatography, and qualitative reagent assays.",
      actionLabel: "Read Case Study",
      actionHref: "/projects/phytochemical-screening",
      externalUrl: "/chemistry#dissertation",
      externalLabel: "Chemistry Lab",
    },
    {
      id: "mileage-tracker",
      category: "PUBLISHED ANDROID APP",
      year: "2024",
      badgeVariant: "tech" as const,
      title: "Mileage Tracker — Fuel & Cost",
      subtitle: "Google Play Store Release",
      description:
        "Production cross-platform mobile utility built with Flutter and SQLite for offline fuel logging, efficiency metrics, and monthly expense analytics.",
      actionLabel: "Read Case Study",
      actionHref: "/projects/mileage-tracker-app",
      externalUrl: "https://play.google.com/store/apps/details?id=in.alokdasofficial.mileage",
      externalLabel: "Google Play",
    },
    {
      id: "alomole",
      category: "SCIENTIFIC COMPUTATION",
      year: "2024",
      badgeVariant: "chem" as const,
      title: "Alomole — Chemistry Companion",
      subtitle: "Web Application",
      description:
        "Domain-specific web utility providing real-time chemical equation balancing, molar mass calculation, and stoichiometric reaction solvers.",
      actionLabel: "Read Case Study",
      actionHref: "/projects/alomole-chemistry-tool",
      externalUrl: "https://alomolecule.web.app",
      externalLabel: "Launch Tool",
    },
  ];

  return (
    <section className="py-14 md:py-18 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              02 &middot; Proof of Capability
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Selected Evidence
            </h2>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              Verified proof points spanning laboratory research, production mobile software, and computational chemistry tools.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline flex-shrink-0 min-h-[44px]"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3-Column Evidence Highlight Reel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {proofPoints.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-border transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={item.badgeVariant}>{item.category}</Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {item.year}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[18px] font-bold text-foreground leading-snug tracking-tight">
                    <Link
                      href={item.actionHref}
                      className="hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Links (44px min target) */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
                  >
                    <span>{item.externalLabel}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[12px] text-muted-foreground">Verified</span>
                )}
                <Link
                  href={item.actionHref}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline min-h-[44px]"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
