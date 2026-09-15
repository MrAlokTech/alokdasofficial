import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsData, ProjectItem } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ExternalLink,
  Github,
  Calendar,
  User,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FileText,
  FlaskConical,
  Award,
} from "lucide-react";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

const SLUG_ALIASES: Record<string, string> = {
  "mileage-tracker": "mileage-tracker-app",
  "alomole": "alomole-chemistry-tool",
};

export async function generateStaticParams() {
  const baseSlugs = projectsData.map((project) => ({ slug: project.id }));
  const aliasSlugs = Object.keys(SLUG_ALIASES).map((slug) => ({ slug }));
  return [...baseSlugs, ...aliasSlugs];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const resolvedSlug = SLUG_ALIASES[params.slug] || params.slug;
  const project = projectsData.find((p) => p.id === resolvedSlug);
  if (!project) {
    return {
      title: "Project Not Found | Alok Das",
    };
  }

  const url = `https://alokdasofficial.in/projects/${project.id}`;

  return {
    title: `${project.title} — Case Study | Alok Das`,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${project.title} — Project Case Study | Alok Das`,
      description: project.description,
      url,
      type: "article",
    },
  };
}

export default function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const resolvedSlug = SLUG_ALIASES[params.slug] || params.slug;
  const projectIndex = projectsData.findIndex((p) => p.id === resolvedSlug);
  if (projectIndex === -1) {
    notFound();
  }

  const project = projectsData[projectIndex];
  const prevProject = projectIndex > 0 ? projectsData[projectIndex - 1] : null;
  const nextProject = projectIndex < projectsData.length - 1 ? projectsData[projectIndex + 1] : null;
  const pageUrl = `https://alokdasofficial.in/projects/${project.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.subtitle,
    description: project.description,
    url: pageUrl,
    creator: {
      "@type": "Person",
      name: "Alok Das",
      url: "https://alokdasofficial.in",
    },
    keywords: project.technologies.join(", "),
    dateCreated: project.year,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to all projects</span>
            </Link>
            <span className="text-[12px] font-medium text-muted-foreground">
              Case Study &middot; {project.year}
            </span>
          </div>

          {/* Header */}
          <header className="space-y-6 border-b border-border/60 pb-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-secondary text-foreground text-[11px] font-semibold uppercase tracking-wider border border-border/60">
                {project.categoryLabel}
              </span>
              {project.featured && (
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold border border-primary/20">
                  Featured Artifact
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
              {project.title}
            </h1>

            <p className="text-[18px] sm:text-[20px] text-muted-foreground leading-relaxed font-normal">
              {project.subtitle}
            </p>

            {/* Quick Metrics / Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 font-medium">
                  <User className="h-3 w-3" /> Role
                </span>
                <p className="text-[13px] font-semibold text-foreground truncate">{project.role}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" /> Year
                </span>
                <p className="text-[13px] font-semibold text-foreground">{project.year}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Layers className="h-3 w-3" /> Category
                </span>
                <p className="text-[13px] font-semibold text-foreground truncate">{project.categoryLabel}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1 font-medium">
                  <Award className="h-3 w-3" /> Status
                </span>
                <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">Completed &amp; Verified</p>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:brightness-105 active:brightness-95 transition-all"
                >
                  <span>Launch Live Tool</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {project.playStoreUrl && (
                <a
                  href={project.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:brightness-105 active:brightness-95 transition-all"
                >
                  <span>View on Google Play</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border border-border/80 bg-background text-foreground text-[13px] font-medium hover:bg-secondary/60 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>View Source</span>
                </a>
              )}
            </div>
          </header>

          {/* AEO Executive Summary / TL;DR */}
          <section
            aria-label="Executive Summary"
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-[15px]">
              <Sparkles className="h-4 w-4" />
              <span>Executive Summary &amp; Key Findings</span>
            </div>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              {project.description}
            </p>
            <div className="pt-2 border-t border-primary/10 flex items-start gap-2.5 text-[13px] text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span><strong>Primary Outcome:</strong> {project.outcome}</span>
            </div>
          </section>

          {/* Deep Narrative Sections */}
          <div className="space-y-10">
            {/* The Challenge */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-[20px]">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h2>The Problem &amp; Core Challenge</h2>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-6 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                {project.problem}
              </div>
            </section>

            {/* The Engineered Solution */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-[20px]">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h2>Methodological Approach &amp; Solution</h2>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-6 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                {project.solution}
              </div>
            </section>

            {/* Technologies & Domain Methodologies */}
            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-foreground">
                Applied Technologies &amp; Standards
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 rounded-xl border border-border/70 bg-secondary/40 text-[13px] font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Verified Outcome & Artifact Impact */}
            <section className="space-y-3">
              <h2 className="text-[20px] font-bold text-foreground">
                Measurable Outcome &amp; Defense
              </h2>
              <div className="rounded-xl border border-border/70 bg-card p-6 space-y-3">
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  {project.outcome}
                </p>
                <div className="pt-3 border-t border-border/50 flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
                  <span>Author: Alok Das</span>
                  <span>&middot;</span>
                  <span>Academic Standing: M.Sc. Candidate</span>
                  <span>&middot;</span>
                  <span>Verification: Documented Monograph / Code Repository</span>
                </div>
              </div>
            </section>

            {/* Related Research / Technical Article */}
            {project.relatedArticleSlug && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-[18px]">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2>Related Technical Article</h2>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-primary font-semibold uppercase tracking-wider">
                      Technical Deep Dive
                    </span>
                    <h3 className="text-[16px] font-bold text-foreground">
                      {project.relatedArticleTitle}
                    </h3>
                    <p className="text-[13px] text-muted-foreground">
                      Read the comprehensive methodology and architectural breakdown in the blog.
                    </p>
                  </div>
                  <Link
                    href={`/blog/${project.relatedArticleSlug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:brightness-105 transition-all shadow-sm shrink-0 min-h-[44px]"
                  >
                    <span>Read Related Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Navigation between Projects */}
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 pt-8 border-t border-border/60">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.id}`}
                className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all flex-1"
              >
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  &larr; Previous Case Study
                </span>
                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-1">
                  {prevProject.title}
                </span>
              </Link>
            ) : <div className="flex-1" />}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.id}`}
                className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all flex-1 text-right"
              >
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  Next Case Study &rarr;
                </span>
                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-1">
                  {nextProject.title}
                </span>
              </Link>
            ) : <div className="flex-1" />}
          </div>

          {/* Recruiter Conversion Strip */}
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-[17px] font-bold text-foreground">
                Interested in Alok&apos;s analytical or engineering methodologies?
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Download the print-optimized résumé or inspect full academic laboratory coursework.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/chemistry"
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl border border-border/80 bg-background text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors"
              >
                <FlaskConical className="h-4 w-4 text-primary" />
                <span>Chemistry Dossier</span>
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium hover:brightness-105 transition-all shadow-sm"
              >
                <FileText className="h-4 w-4" />
                <span>View Résumé</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
