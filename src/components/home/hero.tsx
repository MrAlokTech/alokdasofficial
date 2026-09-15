import Link from "next/link";
import { personalData } from "@/data/personal";
import { FileText, FlaskConical, ArrowRight, Linkedin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16 border-b border-border/60">
      {/* Subtle technical hairline grid in background */}
      <div className="absolute inset-0 bg-subtle-grid opacity-[0.22] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Identity, Heading, Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Status Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>M.Sc. Chemistry &middot; Open to Opportunities</span>
            </div>

            {/* Candidate Name & Apple-style Headline */}
            <div className="space-y-1.5">
              <span className="text-[14px] font-mono uppercase tracking-widest text-muted-foreground block">
                {personalData.name}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                Chemistry professional with a builder&apos;s mindset.
              </h1>
            </div>

            {/* Concise Supporting Statement (Strictly 2 short lines on desktop) */}
            <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-2xl font-normal">
              M.Sc. Chemistry candidate focused on research, laboratory
              analysis, and scientific work, with additional practical
              experience in web and mobile development.
            </p>

            {/* Subtle Professional Status Note */}
            <div className="text-[13px] text-muted-foreground flex items-center gap-2 pt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>
                Currently exploring Chemistry-related opportunities &middot;
                Hojai, Assam
              </span>
            </div>

            {/* Recruiter Priority CTAs (Apple HIG 44px Touch Targets) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/resume"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground shadow-sm hover:brightness-105 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <FileText className="h-4 w-4" />
                <span>View Resume</span>
              </Link>

              <Link
                href="/chemistry"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 backdrop-blur-md px-5 py-3 text-[14px] font-medium text-foreground hover:bg-secondary/60 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Explore Chemistry</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-[14px] font-medium text-muted-foreground hover:text-foreground active:scale-[0.98] transition-colors min-h-[44px]"
              >
                <span>Contact</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Compact Executive Profile Snapshot */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-none lg:max-w-md rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Candidate Profile
                  </span>
                  <span className="text-[16px] font-bold text-foreground">
                    {personalData.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  AVAILABLE
                </span>
              </div>

              {/* Snapshot Rows */}
              <div className="space-y-3 text-[13px]">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Education</span>
                  <span className="font-medium text-foreground text-right">
                    M.Sc. Chemistry (RTU Hojai)
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Primary Field</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-right">
                    Chemistry &amp; Analytical Research
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">B.Sc. Score</span>
                  <span className="font-medium text-foreground text-right">
                    69.07% &middot; Phytochemical Research
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Secondary Skill</span>
                  <span className="font-medium text-primary text-right">
                    Mobile &amp; Web Apps (Flutter, SQLite)
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Target Roles</span>
                  <span className="font-medium text-foreground text-right">
                    QC / QA Analyst &middot; Lab Assistant
                  </span>
                </div>
              </div>

              {/* Direct Recruiter Shortcuts */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[12px]">
                <a
                  href={personalData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
                >
                  <Linkedin className="h-3.5 w-3.5 text-primary" />
                  <span>LinkedIn Profile</span>
                </a>
                <Link
                  href="/resume"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline min-h-[44px]"
                >
                  <span>Complete Resume</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
