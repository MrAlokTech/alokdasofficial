"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Poll } from "@/types/poll";
import { getPollStatus, getTimeRemaining } from "@/lib/polls";
import { PollVoteCard } from "@/components/polls/poll-vote-card";
import {
  Clock,
  ArrowRight,
  Calendar,
  RefreshCw,
  ChevronLeft,
  Sparkles,
  HelpCircle,
  Vote,
} from "lucide-react";

const POLLS_STORAGE_KEY = "alok_polls_cached_data_v2";

function readCachedPolls(): Poll[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(POLLS_STORAGE_KEY) || localStorage.getItem(POLLS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.polls)) {
      return parsed.polls;
    }
  } catch {}
  return null;
}

function writeCachedPolls(polls: Poll[]) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({ polls, savedAt: Date.now() });
    sessionStorage.setItem(POLLS_STORAGE_KEY, payload);
    localStorage.setItem(POLLS_STORAGE_KEY, payload);
  } catch {}
}

function PollsListInner() {
  const searchParams = useSearchParams();
  const selectedPollParam = searchParams ? searchParams.get("poll") : null;

  const [polls, setPolls] = React.useState<Poll[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const endpoint = process.env.NEXT_PUBLIC_POLLS_ENDPOINT || "";

  // Restore cached polls immediately on client mount
  React.useEffect(() => {
    const cached = readCachedPolls();
    if (cached) {
      setPolls(cached);
      setLoading(false);
    }
  }, []);

  // Live clock tick
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dynamic polls from GAS endpoint with 8s timeout & background revalidation
  const fetchDynamicPolls = React.useCallback(async (manual = false) => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    if (manual) setIsRefreshing(true);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${endpoint}?action=list_polls`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data.ok && Array.isArray(data.polls)) {
        const remotePolls: Poll[] = data.polls.map((p: any) => ({
          id: p.id,
          slug: p.slug || p.id,
          title: p.title,
          description: p.description,
          question: p.question,
          options: p.options || (p.questions?.[0]?.options || []),
          questions: Array.isArray(p.questions) && p.questions.length > 0 ? p.questions : undefined,
          startTime: p.startTime,
          endTime: p.endTime,
          category: p.category || "Community",
          showResults: true,
          resultsVisibility: "afterVote",
          minimumResultsCount: 1,
          indexable: true,
        }));

        setPolls(remotePolls);
        writeCachedPolls(remotePolls);
      } else {
        setPolls([]);
        writeCachedPolls([]);
      }
    } catch {
      // On timeout or network error, keep current state (or cache)
      setPolls((prev) => prev);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [endpoint]);

  React.useEffect(() => {
    fetchDynamicPolls(false);
  }, [fetchDynamicPolls]);

  // Is a specific poll targeted via ?poll= query param?
  const targetedPoll = React.useMemo(() => {
    if (!selectedPollParam) return null;
    return (
      polls.find(
        (p) =>
          p.id.toLowerCase() === selectedPollParam.toLowerCase() ||
          p.slug.toLowerCase() === selectedPollParam.toLowerCase()
      ) || null
    );
  }, [selectedPollParam, polls]);

  const getPollHref = (poll: Poll) => {
    return `/polls?poll=${encodeURIComponent(poll.slug || poll.id)}`;
  };

  // If a specific poll is requested via query string, render dedicated interactive vote view
  if (selectedPollParam) {
    if (loading && !targetedPoll) {
      return (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-4 shadow-sm">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h3 className="text-lg font-bold text-foreground">Loading Poll...</h3>
          <p className="text-sm text-muted-foreground">
            Fetching the latest poll configuration from Google Sheets.
          </p>
        </div>
      );
    }

    if (!targetedPoll) {
      return (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-5 shadow-sm">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Poll Not Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The requested poll (<code>{selectedPollParam}</code>) could not be found or has been removed from the Google Sheet.
          </p>
          <div>
            <Link
              href="/polls"
              className="inline-flex items-center gap-1.5 min-h-[42px] px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow hover:brightness-105 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>View All Active Polls</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/polls"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to all polls</span>
          </Link>
          <span className="text-[12px] font-medium text-muted-foreground">
            Live Community Poll
          </span>
        </div>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>{targetedPoll.category || "Community Poll"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            {targetedPoll.title}
          </h1>
          {targetedPoll.description && (
            <p className="text-[16px] sm:text-[18px] text-muted-foreground leading-relaxed">
              {targetedPoll.description}
            </p>
          )}
        </header>

        <PollVoteCard poll={targetedPoll} />
      </div>
    );
  }

  if (loading && polls.length === 0) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-12 text-center space-y-4 shadow-sm">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
        <h3 className="text-lg font-bold text-foreground">Loading Polls...</h3>
        <p className="text-sm text-muted-foreground">
          Checking for active community polls and surveys.
        </p>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-10 sm:p-14 text-center space-y-5 shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-secondary/80 text-muted-foreground flex items-center justify-center mx-auto">
          <Vote className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            No Active Polls
          </h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            There are currently no active polls or community surveys available. New polls will appear here as soon as they are launched.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchDynamicPolls(true);
            }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-background text-[13px] font-medium text-foreground hover:bg-secondary/60 transition-colors cursor-pointer min-h-[40px] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>{isRefreshing ? "Checking Sheet..." : "Check Again"}</span>
          </button>
        </div>
      </div>
    );
  }

  const activePolls = polls.filter((p) => getPollStatus(p, currentTime) === "ACTIVE");
  const draftPolls = polls.filter((p) => getPollStatus(p, currentTime) === "DRAFT");
  const closedPolls = polls.filter((p) => getPollStatus(p, currentTime) === "CLOSED");

  return (
    <div className="space-y-14">
      {/* Active Polls Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Active Polls ({activePolls.length})
            </h2>
          </div>
          {isRefreshing ? (
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Updating...</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => fetchDynamicPolls(true)}
              className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer p-1 rounded-md"
              title="Refresh polls from Google Sheet"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {activePolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePolls.map((poll) => {
              const timer = getTimeRemaining(poll.endTime || poll.closesAt, currentTime);
              const href = getPollHref(poll);
              return (
                <div
                  key={poll.id}
                  className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-border transition-all shadow-sm group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-semibold uppercase tracking-wider border border-border/60">
                        {poll.category || "General"}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{timer.formatted}</span>
                      </span>
                    </div>

                    <h3 className="text-[19px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                      <Link href={href}>
                        {poll.title}
                      </Link>
                    </h3>

                    {poll.description && (
                      <p className="text-[14px] text-muted-foreground leading-relaxed">
                        {poll.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[12px] text-muted-foreground">
                      {poll.questions && poll.questions.length > 1
                        ? `${poll.questions.length} questions`
                        : `${poll.options?.length || 0} options`}
                    </span>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium shadow-sm hover:brightness-105 active:scale-95 transition-all"
                    >
                      <span>Vote Anonymously</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-muted-foreground text-[14px]">
            There are no open polls accepting submissions right now.
          </div>
        )}
      </section>

      {/* Upcoming / Draft Polls Section */}
      {draftPolls.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-amber-500" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Opening Soon ({draftPolls.length})
              </h2>
            </div>
            <span className="text-[12px] text-muted-foreground">
              Scheduled upcoming votes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {draftPolls.map((poll) => (
              <div
                key={poll.id}
                className="rounded-2xl border border-border/60 bg-secondary/20 p-6 flex flex-col justify-between space-y-4 opacity-85"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-semibold uppercase tracking-wider border border-border/60">
                      {poll.category || "Upcoming"}
                    </span>
                    <span className="text-[12px] text-amber-600 dark:text-amber-400 font-medium">
                      Scheduled
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-foreground">
                    {poll.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground">
                    {poll.description}
                  </p>
                </div>
                <div className="text-[12px] text-muted-foreground pt-3 border-t border-border/40">
                  Starts:{" "}
                  {poll.startTime
                    ? new Date(poll.startTime).toLocaleDateString()
                    : "Coming soon"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Closed Polls Section */}
      {closedPolls.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Archived &amp; Concluded Polls ({closedPolls.length})
            </h2>
            <span className="text-[12px] text-muted-foreground">
              Historical results
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {closedPolls.map((poll) => {
              const href = getPollHref(poll);
              return (
                <div
                  key={poll.id}
                  className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col justify-between space-y-4 opacity-75"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground font-semibold uppercase tracking-wider border border-border/60">
                        {poll.category || "Archived"}
                      </span>
                      <span className="text-muted-foreground">Concluded</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-foreground">
                      {poll.title}
                    </h3>
                    {poll.description && (
                      <p className="text-[13px] text-muted-foreground">
                        {poll.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[12px] text-muted-foreground">
                      {poll.questions && poll.questions.length > 1
                        ? `${poll.questions.length} questions`
                        : `${poll.options?.length || 0} options`}
                    </span>
                    <Link
                      href={href}
                      className="text-[13px] font-medium text-primary hover:underline"
                    >
                      View Final Results &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export function PollsListClient() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
          Loading polls...
        </div>
      }
    >
      <PollsListInner />
    </React.Suspense>
  );
}
