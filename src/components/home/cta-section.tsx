import Link from "next/link";
import { Mail, FileText, ArrowRight } from "lucide-react";
import { personalData } from "@/data/personal";

export function HomeCta() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              04 &middot; Direct Contact
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Interested in working together?
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              I welcome discussions regarding laboratory roles, research projects, and scientific opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[14px] font-medium text-primary-foreground shadow-sm hover:brightness-105 active:scale-[0.98] transition-all min-h-[44px]"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Me</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/resume"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-6 py-3 text-[14px] font-medium text-foreground hover:bg-secondary/60 active:scale-[0.98] transition-colors min-h-[44px]"
            >
              <FileText className="h-4 w-4" />
              <span>View Résumé</span>
            </Link>
          </div>

          <p className="text-[13px] text-muted-foreground pt-1">
            Direct email:{" "}
            <a
              href={`mailto:${personalData.contact.email}`}
              className="text-foreground hover:underline font-mono font-medium"
            >
              {personalData.contact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
