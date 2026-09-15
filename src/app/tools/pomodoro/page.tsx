import { Metadata } from "next";
import { PomodoroTool } from "@/components/tools/pomodoro-tool";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Timer, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pomodoro Focus Timer | Alok Das",
  description:
    "Clean, distraction-free online Pomodoro timer with customizable focus intervals, break cycles, subtle audio notifications, and local session tracking.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/pomodoro",
  },
  openGraph: {
    title: "Pomodoro Focus Timer | Alok Das",
    description:
      "A calm, distraction-free focus timer built for deep study, laboratory work, and coding sessions.",
    url: "https://alokdasofficial.in/tools/pomodoro",
    type: "website",
  },
};

export default function PomodoroPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pomodoro Focus Timer",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "All",
    url: "https://alokdasofficial.in/tools/pomodoro",
    description:
      "A distraction-free, Apple HIG-inspired focus timer based on the Pomodoro Technique. Features customizable intervals and zero cloud tracking.",
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
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        {/* Page Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Timer className="h-3.5 w-3.5 text-primary" />
            <span>Productivity Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Pomodoro Focus Timer
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
            A minimalist, distraction-free productivity timer designed to support sustained deep concentration, laboratory data entry, and structured study intervals.
          </p>
        </header>

        {/* Interactive Timer Application */}
        <main>
          <PomodoroTool />
        </main>

        {/* Server-Rendered Explanatory & SEO Content */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              How the Pomodoro Technique Works
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique uses a timer to divide intellectual work into focused 25-minute sprints called <em>pomodoros</em>, separated by short 5-minute pauses. After four consecutive work intervals, a longer 15- to 30-minute rest is taken to facilitate mental recovery and consolidate learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[14px]">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Deep Focus
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                25 minutes of single-task immersion. Eliminates multitasking friction and reduces procrastination.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Strategic Rest
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Short 5-minute pauses disengage cognitive fatigue, rest the eyes, and maintain high decision accuracy.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Local Privacy
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Your session counts and custom interval preferences persist purely on your device via browser localStorage.
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
                  Can I customize interval durations?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Yes. Click the settings gear icon to configure custom focus minutes, short breaks, and long breaks to match your personal study or laboratory schedule.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  Does this timer run in the background?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Yes. The timer calculates elapsed seconds accurately even when switching tabs, and plays a gentle audio chime when each interval completes.
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
