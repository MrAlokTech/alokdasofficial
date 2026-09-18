import type { Metadata } from "next";
import Link from "next/link";
import { educationData } from "@/data/education";
import { dissertationData, chemistrySkillsData, academicFocusData } from "@/data/chemistry";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, GraduationCap, CheckCircle2, FileText, ArrowRight, Microscope } from "lucide-react";

export const metadata: Metadata = {
  title: "Chemistry Profile & Research — Alok Das (alokdasofficial)",
  description:
    "Academic background, M.Sc. coursework, laboratory analytical skills, TLC chromatography, and phytochemical dissertation research of Alok Das, chemistry graduate.",
  keywords: [
    "Alok Das Chemistry",
    "chemistry graduate",
    "alokdasofficial",
    "alokdasoffiical",
    "Analytical Chemistry",
    "Phytochemical Screening",
    "Rabindranath Tagore University Chemistry",
    "Thin Layer Chromatography",
    "Quality Control Analyst",
  ],
  alternates: {
    canonical: "https://alokdasofficial.in/chemistry",
  },
};

export default function ChemistryPage() {
  const msc = educationData.find((e) => e.id === "msc-chem");
  const bsc = educationData.find((e) => e.id === "bsc-chem");

  return (
    <div className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 space-y-16 lg:space-y-20">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <span>PRIMARY PROFESSIONAL DISCIPLINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
            Chemistry Profile &amp; Research
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            I am currently pursuing a Master of Science in Chemistry at Rabindranath Tagore University, Assam. My training encompasses qualitative and quantitative chemical analysis, natural product phytochemical extraction, and rigorous laboratory standard operating procedures.
          </p>
        </div>

        {/* 1. Academic Qualifications Timeline */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">
              Academic Qualifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* M.Sc. Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-7 sm:p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <Badge variant="chem">ONGOING POSTGRADUATE</Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  2025 – Present
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {msc?.degree} in {msc?.field}
                </h3>
                <p className="text-[13px] font-medium text-emerald-700 dark:text-emerald-300">
                  {msc?.institution}, {msc?.location}
                </p>
              </div>
              <ul className="space-y-2 text-[13px] text-muted-foreground pt-1">
                {msc?.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* B.Sc. Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-7 sm:p-8 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">GRADUATED DEGREE</Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  2022 – 2025
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  {bsc?.degree} in {bsc?.field}
                </h3>
                <p className="text-[13px] font-medium text-muted-foreground">
                  {bsc?.institution}, {bsc?.location}
                </p>
              </div>
              <ul className="space-y-2 text-[13px] text-muted-foreground pt-1">
                {bsc?.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Dissertation Deep-Dive */}
        <section id="dissertation" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Microscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">
              Dissertation Research Project
            </h2>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-7 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="chem">{dissertationData.degree}</Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {dissertationData.year} &middot; {dissertationData.institution}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                {dissertationData.title}
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {dissertationData.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
              <div className="p-5 rounded-xl bg-secondary/40 space-y-2">
                <h4 className="font-semibold text-foreground text-[12px] uppercase tracking-wider">
                  Problem &amp; Scientific Objective
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {dissertationData.problemStatement}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-secondary/40 space-y-2">
                <h4 className="font-semibold text-foreground text-[12px] uppercase tracking-wider">
                  Analytical Methodology
                </h4>
                <ul className="space-y-1.5 text-muted-foreground">
                  {dissertationData.methodology.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key Findings &amp; Outcomes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dissertationData.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/60 bg-background text-[12px] text-muted-foreground space-y-1"
                  >
                    <span className="font-semibold text-foreground block">
                      Observation {idx + 1}
                    </span>
                    <p className="leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
              <div className="flex flex-wrap gap-1.5">
                {dissertationData.skillsApplied.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-[11px]">
                    {skill}
                  </Badge>
                ))}
              </div>
              <span className="text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
                Evaluation: Defended with Distinction
              </span>
            </div>
          </div>
        </section>

        {/* 3. Categorized Laboratory Skills */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">
              Categorized Laboratory &amp; Analytical Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chemistrySkillsData.map((category) => (
              <div
                key={category.category}
                className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <div className="space-y-3">
                  <h3 className="text-[16px] font-bold text-foreground tracking-tight">
                    {category.category}
                  </h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                  <div className="space-y-2 pt-2">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-2.5 rounded-lg bg-secondary/50 text-[12px] space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background text-muted-foreground">
                            {skill.level}
                          </span>
                        </div>
                        {skill.description && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Advanced Coursework */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-[18px] font-bold tracking-tight text-foreground">
              M.Sc. Coursework &amp; Academic Focus
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {academicFocusData.map((focus) => (
              <div
                key={focus.title}
                className="rounded-xl border border-border/70 bg-card p-5 space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              >
                <h3 className="text-[14px] font-bold text-foreground tracking-tight">
                  {focus.title}
                </h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  {focus.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Action Bar */}
        <div className="rounded-2xl border border-border/80 bg-secondary/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Review Full Curriculum Vitae
            </h3>
            <p className="text-[13px] text-muted-foreground">
              Download or print a comprehensive, single-page A4 document tailored for recruiters and laboratory managers.
            </p>
          </div>
          <Link
            href="/resume"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground shadow-sm hover:brightness-105 transition-all min-h-[44px] flex-shrink-0"
          >
            <FileText className="h-4 w-4" />
            <span>Open Résumé</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
