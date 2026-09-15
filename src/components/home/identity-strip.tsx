import { GraduationCap, FlaskConical, TestTube2, Smartphone } from "lucide-react";

export function IdentityStrip() {
  const facts = [
    {
      label: "Current Academic Status",
      value: "M.Sc. Chemistry",
      detail: "RTU Hojai (Ongoing)",
      icon: GraduationCap,
      accent: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Primary Career Direction",
      value: "Chemistry",
      detail: "Analytical & Research Focus",
      icon: FlaskConical,
      accent: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Core Professional Focus",
      value: "Research & Laboratory",
      detail: "GLP, Volumetric, TLC Analysis",
      icon: TestTube2,
      accent: "text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Secondary Technical Skill",
      value: "Web + Flutter",
      detail: "Cross-Platform & Offline Apps",
      icon: Smartphone,
      accent: "text-primary",
    },
  ];

  return (
    <section className="py-8 md:py-10 border-b border-border/60 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* 4-Item Compact Professional Snapshot Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {facts.map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={fact.label}
                className={`flex flex-col space-y-1.5 ${
                  idx === 0 ? "" : "sm:pl-6 pt-4 sm:pt-0"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${fact.accent}`} />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </span>
                </div>
                <div className="text-[18px] sm:text-[20px] font-bold tracking-tight text-foreground">
                  {fact.value}
                </div>
                <p className="text-[12px] text-muted-foreground font-medium">
                  {fact.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
