import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPolls, getPollBySlug, getPollQuestions } from "@/lib/polls";
import { PollVoteCard } from "@/components/polls/poll-vote-card";
import { ChevronLeft, ShieldCheck, ArrowRight, FileText, FlaskConical } from "lucide-react";

interface PollPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const polls = await getAllPolls();
  if (polls.length === 0) {
    return [{ slug: "_" }];
  }
  return polls.map((poll) => ({
    slug: poll.slug,
  }));
}

export async function generateMetadata({ params }: PollPageProps): Promise<Metadata> {
  const poll = await getPollBySlug(params.slug);
  if (!poll) {
    return {
      title: "Poll Not Found | Alok Das",
    };
  }

  const url = `https://alokdasofficial.in/polls/${poll.slug}`;
  const isIndexable = poll.indexable !== false;

  return {
    title: `${poll.title} | Alok Das`,
    description: poll.description || `Anonymous community poll: ${poll.question}`,
    alternates: {
      canonical: url,
    },
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${poll.title} | Anonymous Poll`,
      description: poll.question,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: poll.title,
      description: poll.question,
    },
  };
}

export default async function IndividualPollPage({ params }: PollPageProps) {
  const poll = await getPollBySlug(params.slug);
  if (!poll) {
    notFound();
  }

  const pageUrl = `https://alokdasofficial.in/polls/${poll.slug}`;
  const questions = getPollQuestions(poll);
  const primaryOptions = questions[0]?.options || [];

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Question",
        name: poll.title,
        text: poll.question || poll.title,
        suggestedAnswer: primaryOptions.map((opt) => ({
          "@type": "Answer",
          text: opt.label,
        })),
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
            name: poll.title,
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
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/polls"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to all polls</span>
            </Link>
            <span className="text-[12px] font-medium text-muted-foreground">
              Anonymous Community Poll
            </span>
          </div>

          {/* Semantic Server-Rendered Header */}
          <header className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
              {poll.title}
            </h1>
            {poll.description && (
              <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed">
                {poll.description}
              </p>
            )}
          </header>

          {/* Interactive Client-Side Voting Component */}
          <PollVoteCard poll={poll} />

          {/* Accessible Server-Rendered Semantic Fallback for Crawlers & Non-JS Visitors */}
          <noscript>
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <h2 className="text-lg font-bold text-foreground">
                    {idx + 1}. {q.question}
                  </h2>
                  {q.options && q.options.length > 0 && (
                    <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                      {q.options.map((opt) => (
                        <li key={opt.id}>
                          <strong className="text-foreground">{opt.label}</strong>
                          {opt.description ? ` — ${opt.description}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                JavaScript is required to submit anonymous responses or inspect live results.
              </p>
            </div>
          </noscript>

          {/* Recruiter / Cross-Navigation Strip */}
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-[17px] font-bold text-foreground">
                More from Alok Das
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Inspect laboratory analytical chemistry research or try the virtual science labs.
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
      </div>
    </>
  );
}
