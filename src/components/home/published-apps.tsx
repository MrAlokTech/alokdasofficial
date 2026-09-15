import Link from "next/link";
import { appsData } from "@/data/apps";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PublishedApps() {
  return (
    <section className="py-14 md:py-18 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
              03 &middot; Complementary Capability
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Also building with technology
            </h2>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              Alongside Chemistry, I build web and mobile applications, including published Flutter apps.
            </p>
          </div>
          <Link
            href="/apps"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline flex-shrink-0 min-h-[44px]"
          >
            <span>View All Apps</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 2 Featured Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {appsData.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={app.category === "Scientific Tool" ? "chem" : "tech"}>
                    {app.badge}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {app.platform}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-[19px] font-bold text-foreground tracking-tight">
                    <Link
                      href={`/apps/${app.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {app.name}
                    </Link>
                  </h3>
                  <p className="text-[13px] text-muted-foreground font-medium">
                    {app.tagline}
                  </p>
                </div>

                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {app.solution}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons (First click stays internal: Case Study is primary) */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/apps/${app.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm hover:brightness-105 transition-all min-h-[44px]"
                >
                  <span>Read Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  {app.playStoreUrl && (
                    <a
                      href={app.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors min-h-[44px]"
                    >
                      <span>Google Play</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {app.webUrl && (
                    <a
                      href={app.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors min-h-[44px]"
                    >
                      <span>Open App</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
