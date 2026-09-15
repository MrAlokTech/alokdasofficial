"use client";

import * as React from "react";
import {
  Poll,
  PollQuestion,
  PollQuestionResult,
  PollResultSummary,
  PollSubmissionPayload,
} from "@/types/poll";
import {
  getTimeRemaining,
  getPollStatus,
  getPollQuestions,
  computeAggregateResults,
  mapPollErrorToText,
} from "@/lib/polls";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Vote,
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Calendar,
  Check,
  MessageSquare,
  ListFilter,
  CheckSquare,
} from "lucide-react";
import { usePreloader } from "@/components/ui/site-preloader";

interface PollVoteCardProps {
  poll: Poll;
}

export function PollVoteCard({ poll }: PollVoteCardProps) {
  const questions: PollQuestion[] = React.useMemo(() => {
    return getPollQuestions(poll);
  }, [poll]);

  // Answers keyed by question id (e.g. q1, q2)
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [hasVoted, setHasVoted] = React.useState<boolean>(false);
  const [activeToken, setActiveToken] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
  const [localVotes, setLocalVotes] = React.useState<Record<string, number>>(
    poll.initialVotes || {}
  );
  const [remoteQuestionResults, setRemoteQuestionResults] = React.useState<
    PollQuestionResult[] | null
  >(null);
  const { showPreloader, hidePreloader } = usePreloader();

  const endpoint =
    poll.endpointUrl ||
    process.env.NEXT_PUBLIC_POLLS_ENDPOINT ||
    "";

  // Live timer tick every second for authoritative state recalculation
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const status = React.useMemo(() => {
    return getPollStatus(poll, currentTime);
  }, [poll, currentTime]);

  const isOpen = status === "ACTIVE";
  const closeDeadline = poll.endTime || poll.closesAt;
  const startDeadline = poll.startTime || poll.createdAt;

  const timeState = React.useMemo(() => {
    return getTimeRemaining(closeDeadline, currentTime);
  }, [closeDeadline, currentTime]);

  // Request an opaque anonymous vote token from GAS backend
  const requestToken = React.useCallback(async () => {
    if (!endpoint) {
      const localOpaqueToken = "sim_tok_" + Math.random().toString(36).substring(2, 15);
      try {
        localStorage.setItem(`vote_token_${poll.id}`, localOpaqueToken);
      } catch {
        // Ignore
      }
      setActiveToken(localOpaqueToken);
      return;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${endpoint}?action=token&poll_id=${encodeURIComponent(poll.id)}`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (data.ok && data.token) {
        try {
          localStorage.setItem(`vote_token_${poll.id}`, data.token);
        } catch {
          // Ignore
        }
        setActiveToken(data.token);
        return;
      }
    } catch {
      // Timeout or network error fallback
    }
    const fallbackToken = "fallback_tok_" + Math.random().toString(36).substring(2, 15);
    setActiveToken(fallbackToken);
  }, [endpoint, poll.id]);

  // Fetch real-time aggregate poll results from Google Apps Script endpoint
  const fetchPollResults = React.useCallback(async () => {
    if (!endpoint) return;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `${endpoint}?action=results&poll_id=${encodeURIComponent(poll.id)}`,
        { method: "GET", signal: controller.signal }
      );
      clearTimeout(timer);
      const data = await res.json();
      if (data.ok) {
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setRemoteQuestionResults(data.questions);
        }

        if (Array.isArray(data.options)) {
          const remoteMap: Record<string, number> = {};
          data.options.forEach((item: { optionId: string; votes: number }) => {
            if (item.optionId) {
              remoteMap[item.optionId] = item.votes || 0;
            }
          });
          setLocalVotes(remoteMap);
        }
      }
    } catch {
      // Retain local votes if network request fails or times out
    }
  }, [endpoint, poll.id]);

  // Lazy Token & Voted UX Deterrent
  React.useEffect(() => {
    try {
      const voted =
        localStorage.getItem(`voted_${poll.id}`) ||
        localStorage.getItem(`poll_voted_${poll.id}`);
      if (voted === "true") {
        setHasVoted(true);
        return;
      }

      const existingToken = localStorage.getItem(`vote_token_${poll.id}`);
      if (existingToken) {
        setActiveToken(existingToken);
      }
    } catch {
      // Ignore private-browsing localStorage restrictions
    }
  }, [poll.id]);


  // Handle option selection for single choice
  const handleSingleChoice = (qId: string, optionId: string) => {
    if (!activeToken) requestToken();
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionId,
    }));
  };

  // Handle option toggle for multiple choice
  const handleMultipleChoice = (qId: string, optionId: string) => {
    if (!activeToken) requestToken();
    setAnswers((prev) => {
      const currentList: string[] = Array.isArray(prev[qId]) ? [...prev[qId]] : [];
      const existsIndex = currentList.indexOf(optionId);
      if (existsIndex > -1) {
        currentList.splice(existsIndex, 1);
      } else {
        currentList.push(optionId);
      }
      return {
        ...prev,
        [qId]: currentList,
      };
    });
  };

  // Handle text input for descriptive
  const handleDescriptiveChange = (qId: string, text: string) => {
    if (!activeToken) requestToken();
    setAnswers((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  // Check validity across all required questions
  const isFormComplete = React.useMemo(() => {
    if (questions.length === 0) return false;
    for (const q of questions) {
      if (q.required !== false) {
        const val = answers[q.id];
        if (q.type === "multiple_choice") {
          if (!Array.isArray(val) || val.length === 0) return false;
        } else if (q.type === "descriptive") {
          if (!val || typeof val !== "string" || val.trim().length === 0) return false;
        } else {
          // single choice
          if (!val || typeof val !== "string") return false;
        }
      }
    }
    return true;
  }, [questions, answers]);

  // Aggregate results computation
  const resultsSummary = React.useMemo(() => {
    return computeAggregateResults(poll, localVotes, remoteQuestionResults || undefined);
  }, [poll, localVotes, remoteQuestionResults]);

  const canShowResults = React.useMemo(() => {
    if (poll.showResults === false) return false;
    const visibility = poll.resultsVisibility || "afterVote";

    if (visibility === "always") return true;
    if (visibility === "afterVote" && hasVoted) return true;
    if (visibility === "afterClose" && status === "CLOSED") return true;
    return false;
  }, [poll.showResults, poll.resultsVisibility, hasVoted, status]);

  // Load results ONLY when results can be shown to the user (e.g. after voting or always)
  React.useEffect(() => {
    if (canShowResults) {
      fetchPollResults();
    }
  }, [canShowResults, fetchPollResults]);

  const minCount = poll.minimumResultsCount || 1;
  const isSampleSufficient = resultsSummary.total >= minCount;

  // Submission Flow
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || !isOpen || hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    showPreloader("Recording anonymous responses...", "Validating cryptographic token.");

    const token = activeToken || "sub_tok_" + Math.random().toString(36).substring(2, 15);

    const payload: PollSubmissionPayload = {
      poll_id: poll.id,
      vote_token: token,
      answers: answers,
      pollVersion: poll.version || 1,
    };

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.ok) {
          recordSuccess();
        } else {
          const message = mapPollErrorToText(data.status);
          setErrorMessage(message);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        recordSuccess();
      }
    } catch {
      setErrorMessage("We couldn’t record your vote. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      hidePreloader();
    }
  };

  const recordSuccess = () => {
    try {
      localStorage.setItem(`voted_${poll.id}`, "true");
      localStorage.setItem(`poll_voted_${poll.id}`, "true");
    } catch {
      // Ignore
    }
    setHasVoted(true);
    setSuccessMessage("Your responses have been recorded anonymously. Thank you for participating!");

    // Update local preview votes for primary question
    const q1 = questions[0];
    if (q1 && answers[q1.id]) {
      const q1Val = answers[q1.id];
      if (typeof q1Val === "string") {
        setLocalVotes((prev) => ({
          ...prev,
          [q1Val]: (prev[q1Val] || 0) + 1,
        }));
      }
    }

    fetchPollResults();
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary text-foreground text-[11px] font-semibold uppercase tracking-wider border border-border/60">
              {poll.category || "Anonymous Poll"}
            </span>
            <span className="text-[12px] text-muted-foreground">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {poll.title || poll.question}
          </h2>
        </div>

        {/* Live Status Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-medium border shrink-0 ${
            status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : status === "DRAFT"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
              : "bg-muted text-muted-foreground border-border/60"
          }`}
        >
          {status === "ACTIVE" ? (
            <>
              <Clock className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span>{timeState.formatted}</span>
            </>
          ) : status === "DRAFT" ? (
            <>
              <Calendar className="h-3.5 w-3.5 text-amber-500" />
              <span>Opening soon</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>Poll closed</span>
            </>
          )}
        </div>
      </div>

      {/* DRAFT State Notice */}
      {status === "DRAFT" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 flex items-start gap-3.5 text-amber-900 dark:text-amber-200">
          <Calendar className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <span className="text-[15px] font-semibold">
              This poll hasn’t opened yet.
            </span>
            <p className="text-[13px] text-muted-foreground">
              Voting will open on{" "}
              {startDeadline
                ? new Date(startDeadline).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "the scheduled start date"}
              . Please check back then.
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE State Form */}
      {status === "ACTIVE" && !hasVoted ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Open &middot; Anonymous survey &middot; No name or email is requested.</span>
            </div>
          </div>

          {/* Dynamic Questions List */}
          <div className="space-y-8 divide-y divide-border/60">
            {questions.map((q, qIndex) => {
              const qId = q.id;
              const currentVal = answers[qId];

              return (
                <div key={qId} className={qIndex > 0 ? "pt-8 space-y-4" : "space-y-4"}>
                  {/* Question Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                        {qIndex + 1}
                      </span>
                      <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground leading-snug">
                        {q.question}
                        {q.required !== false && (
                          <span className="text-primary ml-1" title="Required">
                            *
                          </span>
                        )}
                      </h3>
                    </div>

                    {q.type === "multiple_choice" && (
                      <p className="text-[12px] text-muted-foreground pl-7 flex items-center gap-1">
                        <CheckSquare className="h-3 w-3 text-primary" />
                        <span>Select all that apply</span>
                      </p>
                    )}

                    {q.type === "choice" && questions.length > 1 && (
                      <p className="text-[12px] text-muted-foreground pl-7 flex items-center gap-1">
                        <ListFilter className="h-3 w-3 text-primary" />
                        <span>Select one option</span>
                      </p>
                    )}

                    {q.helpText && (
                      <p className="text-[12px] text-muted-foreground pl-7">
                        {q.helpText}
                      </p>
                    )}
                  </div>

                  {/* Question Input by Type */}
                  <div className="pl-0 sm:pl-7">
                    {/* 1. Single Choice Options */}
                    {q.type === "choice" && (
                      <div role="radiogroup" aria-label={q.question} className="space-y-2.5">
                        {q.options.map((option) => {
                          const isSelected = currentVal === option.id;
                          return (
                            <label
                              key={option.id}
                              onClick={() => handleSingleChoice(qId, option.id)}
                              className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none min-h-[52px] ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                                  : "border-border/70 bg-card hover:border-border hover:bg-secondary/30"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40 bg-background group-hover:border-foreground"
                                }`}
                              >
                                {isSelected && (
                                  <div className="h-2 w-2 rounded-full bg-white dark:bg-primary-foreground" />
                                )}
                              </div>

                              <input
                                type="radio"
                                name={`poll-${poll.id}-${qId}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleSingleChoice(qId, option.id)}
                                className="sr-only"
                              />

                              <div className="space-y-0.5 flex-1">
                                <span className="text-[14px] sm:text-[15px] font-semibold text-foreground leading-snug block">
                                  {option.label}
                                </span>
                                {option.description && (
                                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. Multiple Choice Options */}
                    {q.type === "multiple_choice" && (
                      <div className="space-y-2.5">
                        {q.options.map((option) => {
                          const selectedList: string[] = Array.isArray(currentVal)
                            ? currentVal
                            : [];
                          const isSelected = selectedList.includes(option.id);

                          return (
                            <label
                              key={option.id}
                              onClick={() => handleMultipleChoice(qId, option.id)}
                              className={`group relative flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none min-h-[52px] ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                                  : "border-border/70 bg-card hover:border-border hover:bg-secondary/30"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40 bg-background group-hover:border-foreground"
                                }`}
                              >
                                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>

                              <input
                                type="checkbox"
                                name={`poll-${poll.id}-${qId}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() => handleMultipleChoice(qId, option.id)}
                                className="sr-only"
                              />

                              <div className="space-y-0.5 flex-1">
                                <span className="text-[14px] sm:text-[15px] font-semibold text-foreground leading-snug block">
                                  {option.label}
                                </span>
                                {option.description && (
                                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* 3. Descriptive / Text Feedback */}
                    {q.type === "descriptive" && (
                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={typeof currentVal === "string" ? currentVal : ""}
                          onChange={(e) => handleDescriptiveChange(qId, e.target.value)}
                          placeholder={
                            q.placeholder || "Type your thoughts, ideas, or comments here..."
                          }
                          maxLength={1000}
                          className="w-full rounded-2xl border border-border/80 bg-background p-4 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-y"
                        />
                        <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                          <span>Responses remain 100% anonymous</span>
                          <span>
                            {(typeof currentVal === "string" ? currentVal.length : 0)} / 1000
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action & Feedback */}
          <div className="space-y-3 pt-4 border-t border-border/60">
            <button
              type="submit"
              disabled={!isFormComplete || isSubmitting}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] px-8 rounded-xl text-[14px] font-medium shadow-sm transition-all ${
                isFormComplete && !isSubmitting
                  ? "bg-primary text-primary-foreground hover:brightness-105 active:scale-[0.99] cursor-pointer"
                  : "bg-secondary text-muted-foreground border border-border/60 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Submitting responses...</span>
                </>
              ) : (
                <>
                  <Vote className="h-4 w-4" />
                  <span>Submit Anonymous Responses</span>
                </>
              )}
            </button>

            {!isFormComplete && (
              <p className="text-[12px] text-muted-foreground">
                Please complete all required questions to enable submission.
              </p>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-[13px]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </form>
      ) : null}

      {/* Already Voted / Post-Vote Confirmation */}
      {hasVoted && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-500" />
          <div className="space-y-0.5">
            <span className="text-[14px] font-semibold">
              {successMessage || "You have completed this poll."}
            </span>
            <p className="text-[12px] text-muted-foreground">
              Your response has been stored anonymously without user accounts or tracking identifiers.
            </p>
          </div>
        </div>
      )}

      {/* CLOSED Notice */}
      {status === "CLOSED" && !hasVoted && (
        <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 flex items-start gap-3 text-muted-foreground">
          <Lock className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
          <div className="space-y-0.5">
            <span className="text-[14px] font-semibold text-foreground">
              This poll is closed.
            </span>
            <p className="text-[12px] text-muted-foreground">
              Voting concluded on{" "}
              {closeDeadline
                ? new Date(closeDeadline).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "the scheduled cutoff"}
              . No further submissions are accepted.
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {canShowResults && (
        <div className="space-y-8 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Aggregate Results</span>
            </div>
            <span className="text-muted-foreground font-mono text-[12px]">
              {resultsSummary.total} total submissions
            </span>
          </div>

          {isSampleSufficient ? (
            <div className="space-y-8 divide-y divide-border/50">
              {/* If we have per-question remote results */}
              {remoteQuestionResults && remoteQuestionResults.length > 0 ? (
                remoteQuestionResults.map((qr, idx) => {
                  return (
                    <div key={idx} className={idx > 0 ? "pt-6 space-y-3.5" : "space-y-3.5"}>
                      <h4 className="text-[14px] font-semibold text-foreground">
                        Question {qr.qNo} Results
                      </h4>

                      {qr.type === "descriptive" ? (
                        <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 text-[13px] text-muted-foreground flex items-center gap-2.5">
                          <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                          <span>
                            {qr.total || qr.descriptiveCount || 0} descriptive feedback responses recorded securely.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {qr.options?.map((opt) => (
                            <div key={opt.optionId} className="space-y-1.5">
                              <div className="flex items-center justify-between text-[13px]">
                                <span className="font-medium text-foreground">{opt.label}</span>
                                <div className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                                  <span>{opt.votes} votes</span>
                                  <span className="font-bold text-foreground w-10 text-right">
                                    {opt.percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden border border-border/40">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${opt.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                /* Fallback single question options rendering */
                <div className="space-y-3.5">
                  {resultsSummary.options.map((opt) => (
                    <div key={opt.optionId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-medium text-foreground">{opt.label}</span>
                        <div className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                          <span>{opt.votes} votes</span>
                          <span className="font-bold text-foreground w-10 text-right">
                            {opt.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-secondary/80 overflow-hidden border border-border/40">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${opt.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 bg-secondary/20 p-4 text-center text-[13px] text-muted-foreground">
              Results will appear after more responses are recorded.
            </div>
          )}
        </div>
      )}

      {/* Privacy Notice Footer */}
      <div className="pt-4 border-t border-border/60 flex items-start gap-2.5 text-[12px] text-muted-foreground leading-relaxed">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong>Anonymous poll.</strong> No name or email is requested. Your response is recorded without an account or identity tracking.
        </p>
      </div>
    </div>
  );
}
