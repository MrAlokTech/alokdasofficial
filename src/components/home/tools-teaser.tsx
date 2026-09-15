import Link from "next/link";
import { Radio, Timer, Clock, Atom, FlaskConical, ArrowRight } from "lucide-react";

export function ToolsTeaser() {
  const tools = [
    {
      name: "Morse Code",
      description: "Practice audio Morse and decode messages",
      href: "/tools/morse",
      icon: Radio,
    },
    {
      name: "Pomodoro Timer",
      description: "A calm, distraction-free focus timer",
      href: "/tools/pomodoro",
      icon: Timer,
    },
    {
      name: "World Clock",
      description: "Track accurate time across global cities",
      href: "/tools/world-clock",
      icon: Clock,
    },
    {
      name: "Chemistry Challenge",
      description: "Test your elemental and periodic recall",
      href: "/tools/chemistry-challenge",
      icon: Atom,
    },
  ];

  return (
    <section className="py-14 md:py-18 border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              04 &middot; Workshop &amp; Utilities
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Tools &amp; Experiments
            </h2>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              Small browser-based utilities I&apos;ve built for learning, productivity, and scientific curiosity.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/tools/labs"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline min-h-[44px]"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Virtual Labs</span>
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline min-h-[44px]"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 4 Compact Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="rounded-2xl border border-border/80 bg-card p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-primary/40 hover:bg-card/80 transition-all group min-h-[120px]"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">
                    {tool.name}
                  </h3>
                  <p className="text-[12px] text-muted-foreground pt-0.5">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
