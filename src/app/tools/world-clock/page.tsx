import { Metadata } from "next";
import { WorldClockTool } from "@/components/tools/world-clock-tool";
import { INITIAL_CITIES } from "@/data/tools";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Clock, Globe2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "World Clock & International Time Zones | Alok Das",
  description:
    "Live synchronized world clock tracking accurate international local times across major global time zones with day/night indicators and daylight saving adjustments.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/world-clock",
  },
  openGraph: {
    title: "World Clock & International Time Zones | Alok Das",
    description:
      "Accurate international time tracking using native browser IANA time zones with day/night indicators.",
    url: "https://alokdasofficial.in/tools/world-clock",
    type: "website",
  },
};

export default function WorldClockPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "World Clock & International Time Zones",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/world-clock",
    description:
      "Live synchronized international world clock calculating accurate local times across global metropolitan centers using verified IANA standards.",
    creator: {
      "@type": "Person",
      name: "Alok Das",
      url: "https://alokdasofficial.in",
    },
  };

  return (
    <div className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
        {/* Page Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>International Time Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            World Clock &amp; Time Zones
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed max-w-3xl">
            Track real-time synchronized international local times, UTC offsets, and day/night status across major metropolitan cities without location tracking.
          </p>
        </header>

        {/* Interactive Client Application */}
        <main>
          <WorldClockTool />
        </main>

        {/* Server-Rendered Semantic SEO Content & Initial City Index */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Current Time by City &amp; Supported Time Zones
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              This world clock utilizes standard International Components for Unicode (ICU) and the Internet Assigned Numbers Authority (IANA) time zone database. Below are the default metropolitan regions monitored:
            </p>
          </div>

          {/* Semantic HTML City Table for Crawlers */}
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/40 border-b border-border/60 font-mono text-[11px] uppercase text-muted-foreground">
                <tr>
                  <th className="p-3.5 pl-5">City</th>
                  <th className="p-3.5">Country</th>
                  <th className="p-3.5 pr-5">IANA Identifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {INITIAL_CITIES.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 pl-5 font-semibold">{c.name}</td>
                    <td className="p-3.5 text-muted-foreground">{c.country}</td>
                    <td className="p-3.5 pr-5 font-mono text-muted-foreground">{c.timeZone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How World Time Zones Work */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Automatic Daylight Saving (DST)
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Calculations handle daylight saving transitions automatically according to each jurisdiction&apos;s legal seasonal rules without manual offset adjustments.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Zero Location Tracking
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                The clock functions entirely by parsing standard time zone identifiers without prompting for or storing your precise GPS coordinates.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  How does the clock determine day and night status?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  The tool evaluates the current civil hour in each specific time zone, rendering a daytime sun indicator between 06:00 and 18:00 and an evening moon indicator during nighttime hours.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  Can I customize which cities are shown?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Yes. Use the dropdown selector to add cities or click the trash icon to remove any card. Your chosen list persists locally in your browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
