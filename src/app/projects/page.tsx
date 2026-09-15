"use client";

import * as React from "react";
import Link from "next/link";
import { projectsData, ProjectItem } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code2, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "chemistry", label: "Chemistry & Academic" },
  { id: "flutter", label: "Flutter & Mobile" },
  { id: "tools", label: "Tools & Utilities" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredProjects = React.useMemo(() => {
    if (activeCategory === "all") return projectsData;
    if (activeCategory === "chemistry") {
      return projectsData.filter((p) => p.category === "chemistry");
    }
    if (activeCategory === "flutter") {
      return projectsData.filter((p) => p.category === "flutter");
    }
    if (activeCategory === "tools") {
      return projectsData.filter((p) => p.category === "tools" || p.category === "web");
    }
    return projectsData;
  }, [activeCategory]);

  return (
    <div className="py-14 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            <span>PORTFOLIO OF ARTIFACTS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
            Selected Projects &amp; Research
          </h1>
          <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            Detailed case studies across natural product chemistry research, mobile software engineering, and scientific computation tools.
          </p>
        </div>

        {/* Apple-Style Segmented Control Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="inline-flex p-1 bg-secondary/60 rounded-xl border border-border/60 max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-muted-foreground font-mono">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} listed
          </span>
        </div>

        {/* Project Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="scroll-mt-24 rounded-2xl border border-border/80 bg-card p-7 sm:p-9 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6 hover:border-primary/40 transition-all"
            >
              <div className="space-y-4">
                {/* Meta Bar */}
                <div className="flex items-center justify-between">
                  <Badge variant={project.category === "chemistry" ? "chem" : "tech"}>
                    {project.categoryLabel}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {project.year}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground leading-snug tracking-tight">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="text-[13px] font-medium text-primary">
                    {project.subtitle}
                  </p>
                </div>

                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Structured Problem & Solution */}
                <div className="space-y-3 pt-2 text-[13px]">
                  <div className="p-4 rounded-xl bg-secondary/40 space-y-1">
                    <span className="font-semibold text-foreground block text-[12px]">
                      The Challenge / Problem:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.problem}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/10 space-y-1">
                    <span className="font-semibold text-foreground block text-[12px]">
                      The Implemented Solution:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="pt-2 text-[13px]">
                  <span className="font-semibold text-foreground block text-[12px]">
                    Outcome &amp; Contribution:
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    {project.outcome}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] text-muted-foreground">
                  Role: <strong className="text-foreground font-medium">{project.role}</strong>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-secondary/80 transition-colors min-h-[44px]"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors min-h-[44px]"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.playStoreUrl && (
                    <a
                      href={project.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-medium text-primary-foreground shadow-sm hover:brightness-105 transition-all min-h-[44px]"
                    >
                      <span>Google Play</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors min-h-[44px]"
                    >
                      <span>Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
