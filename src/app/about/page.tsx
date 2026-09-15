import type { Metadata } from "next";
import Link from "next/link";
import { personalData } from "@/data/personal";
import { FlaskConical, Code2, Compass, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Alok Das",
  description: "Academic journey, scientific philosophy, and complementary technical skills of Alok Das, M.Sc. Chemistry student.",
};

export default function AboutPage() {
  return (
    <div className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>BACKGROUND &amp; PHILOSOPHY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
            About Alok Das
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            M.Sc. Chemistry student at Rabindranath Tagore University in Assam. Research-driven, analytically trained, with an active capability for software engineering and tool building.
          </p>
        </div>

        {/* Narrative Section: Who I Am */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
            Who I Am
          </h2>
          <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
            {personalData.bio.about.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        {/* Academic Journey Timeline */}
        <section className="space-y-6">
          <h2 className="text-[18px] font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
            The Academic Journey
          </h2>
          <div className="space-y-8 border-l border-border/80 pl-6 relative">
            <div className="space-y-1.5 relative">
              <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-background" />
              <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
                2025 – PRESENT
              </span>
              <h3 className="text-[16px] font-bold text-foreground">
                Master of Science in Chemistry &middot; RTU Hojai
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Advancing through postgraduate studies with in-depth focus on organic mechanisms, advanced coordination compounds, analytical instrumentation, and research methodology.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-border ring-4 ring-background" />
              <span className="text-[11px] font-mono font-medium text-muted-foreground">
                2022 – 2025
              </span>
              <h3 className="text-[16px] font-bold text-foreground">
                Bachelor of Science in Chemistry (69.07%) &middot; RTU Hojai
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Completed fundamental university chemistry curricula. Undertook my final-year dissertation researching the phytochemical properties of local medicinal flora, standardizing solvent extraction techniques, and performing Thin Layer Chromatography.
              </p>
            </div>

            <div className="space-y-1.5 relative">
              <span className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-border ring-4 ring-background" />
              <span className="text-[11px] font-mono font-medium text-muted-foreground">
                2015 – 2022
              </span>
              <h3 className="text-[16px] font-bold text-foreground">
                Secondary &amp; Higher Secondary Schooling &middot; JNV Karbi Anglong
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Developed disciplined scientific thinking within a residential Jawahar Navodaya Vidyalaya campus, scoring 78.80% in Senior Secondary Science (10+2).
              </p>
            </div>
          </div>
        </section>

        {/* Why Technology? */}
        <section className="rounded-2xl border border-border/80 bg-card p-7 sm:p-9 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Code2 className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Why Technology as a Complementary Skill?
            </h2>
          </div>

          <p className="text-[14px] text-muted-foreground leading-relaxed">
            During my laboratory studies, I realized how frequently researchers and students waste valuable time on manual stoichiometric equations, recurring volumetric dilutions, and repetitive calculations.
          </p>

          <p className="text-[14px] text-muted-foreground leading-relaxed">
            Instead of keeping software separate, I learned <strong>Flutter</strong> and <strong>TypeScript</strong> to build functional tools. Creating applications like <em>Alomole</em> (chemistry balancing engine) and <em>Mileage Tracker</em> (Google Play mobile utility) taught me how to approach problems from a builder&apos;s standpoint: identifying pain points, designing intuitive workflows, and ensuring mathematical reliability.
          </p>

          <div className="p-4 rounded-xl bg-secondary/50 text-[13px] italic text-muted-foreground border-l-2 border-primary">
            &ldquo;{personalData.bio.philosophy}&rdquo;
          </div>
        </section>

        {/* What I'm Working Toward */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
            What I&apos;m Working Toward
          </h2>
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            My primary goal is securing a role in the chemical, pharmaceutical, or research sector where I can contribute to laboratory analysis, quality control protocols, and scientific investigations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[13px]">
            {personalData.status.rolesInterested.map((role) => (
              <div
                key={role}
                className="flex items-center gap-2.5 p-3.5 rounded-xl border border-border/70 bg-card"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="font-medium text-foreground">{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Outside the Résumé */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold tracking-tight text-foreground border-b border-border/60 pb-2">
            Outside the Résumé
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-foreground">Scientific Reading</h3>
              <p className="text-muted-foreground leading-relaxed text-[12px]">
                Reading peer-reviewed publications on ethnopharmacology, green extraction methods, and analytical chromatography.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-foreground">Mobile Prototyping</h3>
              <p className="text-muted-foreground leading-relaxed text-[12px]">
                Experimenting with Flutter UI patterns, offline-first architectures, and clean software usability.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h3 className="font-bold text-foreground">Lifelong Learning</h3>
              <p className="text-muted-foreground leading-relaxed text-[12px]">
                Continuously preparing for national competitive benchmarks such as GATE Chemistry (CY).
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/chemistry"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:underline min-h-[44px]"
          >
            <FlaskConical className="h-4 w-4" />
            <span>Explore Chemistry Portfolio</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground shadow-sm hover:brightness-105 transition-all min-h-[44px]"
          >
            <span>Get in Touch</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
