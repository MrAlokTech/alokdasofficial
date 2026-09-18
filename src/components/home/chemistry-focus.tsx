import Link from "next/link";
import { chemistrySkillsData, dissertationData } from "@/data/chemistry";
import { educationData } from "@/data/education";
import {
  FlaskConical,
  GraduationCap,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ChemistryFocus() {
  const msc = educationData.find((e) => e.id === "msc-chem");
  const bsc = educationData.find((e) => e.id === "bsc-chem");

  // Concise set of 6 key analytical skills directly from verified data
  const keySkills = [
    "Analytical Chemistry",
    "Laboratory Methodology",
    "Phytochemical Screening",
    "Thin Layer Chromatography (TLC)",
    "Volumetric & Titrimetric Assays",
    "Good Laboratory Practice (GLP)",
  ];

  return (
    <section className="py-14 md:py-18 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              Primary Field
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Chemistry &amp; Laboratory Research
            </h2>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              M.Sc. Chemistry candidate building expertise across academic,
              laboratory, and research-oriented work.
            </p>
          </div>
          <Link
            href="/chemistry"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline flex-shrink-0 min-h-[44px]"
          >
            <span>View Chemistry Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Compact 2-Column Overview: Education Snapshot + Core Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Education Snapshot */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                Education Snapshot
              </h3>
            </div>

            <div className="space-y-4 text-[13px]">
              {/* M.Sc. */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block text-[14px]">
                    {msc?.degree} in {msc?.field}
                  </span>
                  <span className="text-muted-foreground">
                    {msc?.institution}, {msc?.location}
                  </span>
                </div>
                <Badge variant="chem">Ongoing (2025–Present)</Badge>
              </div>

              {/* B.Sc. */}
              <div className="flex items-start justify-between gap-4 pt-2 border-t border-border/50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block text-[14px]">
                    {bsc?.degree} in {bsc?.field}
                  </span>
                  <span className="text-muted-foreground">
                    {bsc?.institution}, {bsc?.location}
                  </span>
                </div>
                <Badge variant="outline">2022–2025</Badge>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Academic training covers inorganic complex synthesis,
                spectroscopy, organic reaction mechanisms, and natural product
                separation.
              </p>
            </div>
          </div>

          {/* Core Competencies & Dissertation Proof */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                  Analytical &amp; Laboratory Focus
                </h3>
              </div>

              {/* Key Skill Tags */}
              <div className="flex flex-wrap gap-1.5">
                {keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[12px] px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Dissertation Proof Point Note */}
              <div className="pt-2 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Completed Dissertation
                </span>
                <p className="text-[13px] font-semibold text-foreground">
                  {dissertationData.title}
                </p>
                <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                  {dissertationData.overview}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <Link
                href="/chemistry#dissertation"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline min-h-[44px]"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Read Dissertation Methodology</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
