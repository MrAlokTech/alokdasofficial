import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export function AvailabilityBanner() {
  return (
    <section className="py-12 md:py-16 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-border/80 bg-secondary/30 backdrop-blur-md p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-mono uppercase tracking-wider text-[11px]">
                  Professional Availability
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                Currently exploring Chemistry-related opportunities
              </h2>

              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Prepared for appointments including Quality Control (QC)
                Analyst, Quality Assurance (QA) Associate, Laboratory Assistant,
                or Research Project Fellow.
              </p>
            </div>

            {/* Actions (44px min touch target) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/resume"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground shadow-sm hover:brightness-105 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <FileText className="h-4 w-4" />
                <span>View Resume</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-4 py-3 text-[14px] font-medium text-foreground hover:bg-secondary/60 active:scale-[0.98] transition-colors min-h-[44px]"
              >
                <span>Contact</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
