import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects & Applications | Alok Das",
  description: "All published applications and digital tools by Alok Das are unified under the Projects portfolio.",
  robots: { index: false, follow: true },
};

export default function AppsRedirectPage() {
  return (
    <div className="py-24 container mx-auto px-4 text-center max-w-xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Applications Moved to Projects
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          All published applications, scientific tools, and mobile software are now unified under the Projects portfolio.
        </p>
      </div>
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[14px] shadow-sm hover:brightness-105 transition-all"
        >
          <span>Explore All Projects &amp; Apps</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/projects');`,
        }}
      />
    </div>
  );
}
