import Link from "next/link";
import {
  FlaskConical,
  FolderGit2,
  Smartphone,
  FileText,
  Mail,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Lock,
} from "lucide-react";

export function ImageToolFooter() {
  const links = [
    { label: "Chemistry Research", href: "/chemistry", icon: FlaskConical },
    { label: "Selected Projects", href: "/projects", icon: FolderGit2 },
    { label: "Published Apps", href: "/apps", icon: Smartphone },
    { label: "PDF Studio Suite", href: "/tools/pdf", icon: FileText },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <div className="mt-16 pt-12 border-t border-border/60">
      <div className="rounded-2xl border border-border/80 bg-secondary/20 p-6 sm:p-8 space-y-6">
        {/* Privacy & Architecture Guarantee Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground">Zero Server Uploads</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Every pixel, filter, and compression pass is executed strictly in your device&apos;s local memory.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground">Hardware Accelerated</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Utilizes high-efficiency HTML5 Canvas 2D and modern browser graphics pipelines for instant results.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground">Complete Confidentiality</h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                Safe for sensitive identity photos, signature stamps, contracts, and confidential documents.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              Creator Portfolio
            </span>
            <h4 className="text-lg font-bold text-foreground">
              Built by Alok Das
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
          The Client-Side Image Studio is designed to provide professional-grade image editing and compression without compromising personal data privacy.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
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

        {/* Legal Links */}
        <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-muted-foreground">
          <span>Client-Side Image Studio &bull; 100% In-Browser Execution &bull; Zero Tracking</span>
          <div className="flex items-center gap-3">
            <Link href="/tools/image/privacy" className="hover:text-foreground hover:underline">
              Image Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/tools/image/terms" className="hover:text-foreground hover:underline">
              Image Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
