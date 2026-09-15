import Link from "next/link";
import { FlaskConical, FolderGit2, Smartphone, FileText, Mail, ArrowRight } from "lucide-react";

export function ToolFooter() {
  const links = [
    { label: "Chemistry Research", href: "/chemistry", icon: FlaskConical },
    { label: "Selected Projects", href: "/projects", icon: FolderGit2 },
    { label: "Published Apps", href: "/apps", icon: Smartphone },
    { label: "Curriculum Vitae", href: "/resume", icon: FileText },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <div className="mt-16 pt-12 border-t border-border/60">
      <div className="rounded-2xl border border-border/80 bg-secondary/20 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              Professional Profile
            </span>
            <h4 className="text-lg font-bold text-foreground">
              More from Alok Das
            </h4>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
          >
            <span>Return to Overview</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="text-[13px] text-muted-foreground leading-relaxed">
          These interactive tools are personal side-projects built for exploration and utility.
          My primary professional commitment is in <strong>M.Sc. Chemistry</strong>, analytical research, and laboratory methodology.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card/80 hover:border-primary/40 hover:bg-card text-foreground transition-all text-[13px] font-medium min-h-[44px]"
              >
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
