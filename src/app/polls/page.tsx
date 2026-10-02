import { Metadata } from "next";
import Link from "next/link";
import { getAllPolls } from "@/lib/polls";
import { PollsListClient } from "@/components/polls/polls-client-list";
import {
  Vote,
  ShieldCheck,
  FileText,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Community Polls & Feedback | Alok Das",
  description:
    "Participate in anonymous polls to help decide future browser tools, chemistry simulations, and explore community perspectives.",
  alternates: {
    canonical: "https://alokdasofficial.in/polls",
  },
  openGraph: {
    title: "Community Polls & Feedback | Alok Das",
    description:
      "Vote anonymously on upcoming tools, scientific features, and study formats.",
    url: "https://alokdasofficial.in/polls",
    type: "website",
  },
};

export default async function PollsPage() {
  const polls = await getAllPolls();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Community Polls & Feedback | Alok Das",
    description:
      "Anonymous community polls to help steer software tools and chemistry simulations built by Alok Das.",
    url: "https://alokdasofficial.in/polls",
    hasPart: polls.map((poll) => ({
      "@type": "Question",
      name: poll.title,
      text: poll.question,
      url: `https://alokdasofficial.in/polls/${poll.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 space-y-14">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3 py-1 text-[12px] font-medium text-foreground">
              <Vote className="h-3.5 w-3.5 text-primary" />
              <span>COMMUNITY PERSPECTIVES &amp; FEEDBACK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15]">
              Anonymous Polls
            </h1>
            <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
              Help choose which browser tools to build next, share opinions on laboratory learning methods, and participate in brief, anonymous votes with zero account requirements.
            </p>
          </div>

          {/* Featured Active Survey Banner: EM Assist */}
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-card to-rose-500/5 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <Sparkles className="h-3 w-3" />
                <span>Featured Product Survey</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                EM Assist — Emergency Medical Identity Validation
              </h2>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Help validate India&apos;s dynamic emergency medical identity network. 2-minute public feedback survey to ensure responders have the life-saving data they need in the golden hour.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Link
                href="/polls/em-assist"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[13px] font-bold shadow-md transition-all min-h-[44px]"
              >
                <span>Take Survey (2 min)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Dynamic Google Sheet / Client-Side Poll List with Fallback */}
          <PollsListClient />

          {/* Privacy Note Banner */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex items-start gap-3.5 text-muted-foreground text-[13px] leading-relaxed">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block mb-1">
                Privacy-First Architecture
              </strong>
              No personal identity (names, emails, accounts, phone numbers, or cross-site tracking cookies) is requested or recorded. Poll deadlines are enforced server-side.
            </div>
          </div>

          {/* Cross-Link Strip */}
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-[17px] font-bold text-foreground">
                Explore Alok&apos;s interactive tools and research
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Try the virtual science lab simulations or inspect the M.Sc. Chemistry research dossier.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl border border-border/80 bg-background text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors"
              >
                <span>Tools &amp; Labs</span>
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
      </div>
    </>
  );
}
