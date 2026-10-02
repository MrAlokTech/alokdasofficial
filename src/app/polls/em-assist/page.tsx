import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  ExternalLink,
  HeartPulse,
  Clock,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Vote,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "EM Assist — Idea Validation Survey & Community Feedback | Alok Das",
  description:
    "Participate in the 2-minute idea validation survey for EM Assist. Help shape India's dynamic emergency medical identity and responder network.",
  alternates: {
    canonical: "https://alokdasofficial.in/polls/em-assist",
  },
  openGraph: {
    title: "EM Assist Idea Validation Survey | Community Poll",
    description:
      "Help shape the future of emergency medical identity in India. Share your feedback in a quick 2-minute survey.",
    url: "https://alokdasofficial.in/polls/em-assist",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EM Assist Idea Validation Survey",
    description:
      "Help shape India's dynamic emergency medical identity network. 2-minute public survey.",
  },
};

export default function EmAssistSurveyPage() {
  const pageUrl = "https://alokdasofficial.in/polls/em-assist";
  const externalFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScvxaXUwOFxWSHKsAMNFri8xb1_W7zZ_JehAktG8viXmlz3ew/viewform";

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "EM Assist Idea Validation Survey",
        description:
          "Public validation survey to gather community and responder input on emergency medical identity systems in India.",
        url: pageUrl,
        author: {
          "@type": "Person",
          name: "Alok Das",
          url: "https://alokdasofficial.in",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://alokdasofficial.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Polls",
            item: "https://alokdasofficial.in/polls",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "EM Assist Survey",
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/polls"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to all polls</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <Sparkles className="h-3 w-3" />
              <span>Beta Product Validation</span>
            </div>
          </div>

          {/* Semantic Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black border border-border/80 p-2 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/em-assist-logo.png"
                  alt="EM Assist Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                  EM Assist — Idea Validation Survey
                </h1>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Emergency Medical Identity &amp; Responder Network
                </p>
              </div>
            </div>

            <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed">
              In severe collisions and sudden medical crises, unconscious victims cannot speak to tell paramedics their blood group, critical allergies, or emergency contacts. We are validating a modern, zero-friction medical identity platform for India. Your 2 minutes of feedback directly steers what we build.
            </p>

            {/* Quick Context Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[12px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground font-medium border border-border/70">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>2-Minute Survey</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground font-medium border border-border/70">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Anonymous Feedback</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground font-medium border border-border/70">
                <HeartPulse className="h-3.5 w-3.5 text-rose-500" />
                <span>Public Healthcare Initiative</span>
              </span>
            </div>
          </header>

          {/* Embedded Google Form Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-2 sm:p-5 shadow-xl relative overflow-hidden">
            {/* Top Bar with Direct External Link */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 mb-2 border-b border-border/60 text-xs text-muted-foreground">
              <span>Google Form Embed</span>
              <a
                href={externalFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <span>Open in full tab</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Responsive Iframe Container */}
            <div className="w-full flex justify-center overflow-x-auto">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScvxaXUwOFxWSHKsAMNFri8xb1_W7zZ_JehAktG8viXmlz3ew/viewform?embedded=true"
                width="640"
                height="1828"
                className="w-full max-w-[640px] min-h-[1850px] border-0 rounded-2xl bg-background"
                title="EM Assist Idea Validation Survey"
              >
                Loading survey form…
              </iframe>
            </div>

            {/* Bottom Form Helper Note */}
            <div className="mt-4 p-4 rounded-2xl bg-secondary/40 border border-border/70 text-center text-xs text-muted-foreground space-y-1">
              <p>
                Having trouble interacting with the form above? You can also complete it directly on Google Forms:
              </p>
              <p>
                <a
                  href={externalFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Launch survey in a separate browser tab</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Context Banner: Problem Statement & App Links */}
          <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-secondary/50 via-card to-secondary/30 p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                Learn More About EM Assist
              </span>
              <h3 className="text-xl font-bold text-foreground">
                Understand the Problem Behind the Initiative
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                Read our in-depth essay exploring trauma triage, the golden hour, why locked phones fail in highway collisions, and how dynamic physical QR cards bridge the information black hole.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/blog/emergency-medical-identity-golden-hour"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:brightness-105 transition-all shadow-sm min-h-[42px]"
              >
                <BookOpen className="h-4 w-4" />
                <span>Read Essay: Silence of the Golden Hour</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/em-assist"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 bg-background text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors min-h-[42px]"
              >
                <HeartPulse className="h-4 w-4 text-rose-600" />
                <span>Explore EM Assist Beta</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
