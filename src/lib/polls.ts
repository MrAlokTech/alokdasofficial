import { Poll, PollQuestion, PollResultSummary, PollStatus, PollSubmissionStatus } from "@/types/poll";
import { defaultPolls } from "@/data/polls";

/**
 * Parses pipe-delimited option strings safely.
 * e.g. "Yes|No|Maybe" -> ["Yes", "No", "Maybe"]
 */
export function splitOptions(str: string): string[] {
  if (!str || typeof str !== "string") return [];
  return str
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Joins an array of options with the standard pipe delimiter.
 * e.g. ["Yes", "No", "Maybe"] -> "Yes|No|Maybe"
 */
export function joinOptions(arr: string[]): string {
  if (!Array.isArray(arr)) return "";
  return arr
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0)
    .join("|");
}

/**
 * Auto-computes poll status from server timestamps.
 * Rule:
 * - now < startTime -> "DRAFT"
 * - now >= endTime  -> "CLOSED"
 * - otherwise       -> "ACTIVE"
 */
export function getPollStatus(poll: Poll, referenceTime: Date = new Date()): PollStatus {
  const now = referenceTime.getTime();
  const startIso = poll.startTime || poll.createdAt;
  const endIso = poll.endTime || poll.closesAt;

  if (startIso) {
    const startTime = new Date(startIso).getTime();
    if (now < startTime) return "DRAFT";
  }

  if (endIso) {
    const endTime = new Date(endIso).getTime();
    if (now >= endTime) return "CLOSED";
  }

  return "ACTIVE";
}

/**
 * Checks whether a poll is currently open (ACTIVE) based on its computed status.
 */
export function isPollOpen(poll: Poll, referenceTime: Date = new Date()): boolean {
  return getPollStatus(poll, referenceTime) === "ACTIVE";
}

/**
 * Maps server-side API error status codes to concise, identity-aligned user-facing strings.
 * As defined in Section 29 of polls.md.
 */
export function mapPollErrorToText(status: PollSubmissionStatus | string): string {
  switch (status) {
    case "closed":
      return "This poll is closed.";
    case "not_started":
      return "This poll hasn’t opened yet.";
    case "token_used":
      return "This vote token has already been used.";
    case "invalid_token":
      return "Your voting session is no longer valid.";
    case "invalid_answer":
      return "Please review your answer and try again.";
    case "server_error":
    default:
      return "We couldn’t record your vote. Please try again.";
  }
}

/**
 * Calculates remaining time until a poll deadline.
 */
export function getTimeRemaining(
  closesAtOrEndTime?: string,
  referenceTime: Date = new Date()
): {
  isClosed: boolean;
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
} {
  if (!closesAtOrEndTime) {
    return {
      isClosed: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "Poll closed",
    };
  }

  const deadline = new Date(closesAtOrEndTime).getTime();
  const current = referenceTime.getTime();
  const diff = deadline - current;

  if (diff <= 0) {
    return {
      isClosed: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: "Poll closed",
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatted = "";
  if (days > 0) {
    formatted = `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m remaining`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds}s remaining`;
  } else {
    formatted = `${seconds}s remaining`;
  }

  return {
    isClosed: false,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    formatted,
  };
}

/**
 * Normalizes a poll to ensure it has a valid questions array,
 * converting legacy single-question polls automatically.
 */
export function getPollQuestions(poll: Poll): PollQuestion[] {
  if (Array.isArray(poll.questions) && poll.questions.length > 0) {
    return poll.questions;
  }
  const opts = poll.options || [];
  return [
    {
      id: "q1",
      pollId: poll.id,
      qNo: 1,
      question: poll.question || poll.title,
      type: "choice",
      options: opts,
      required: true,
    },
  ];
}

/**
 * Computes percentage and total votes for a poll.
 */
export function computeAggregateResults(
  poll: Poll,
  votesRecord?: Record<string, number>,
  remoteQuestionsResults?: any[]
): PollResultSummary {
  const questions = getPollQuestions(poll);
  const primaryOptions = questions[0]?.options || poll.options || [];
  const votes = votesRecord || poll.initialVotes || {};
  let total = 0;

  primaryOptions.forEach((opt) => {
    total += votes[opt.id] || 0;
  });

  const options = primaryOptions.map((opt) => {
    const optVotes = votes[opt.id] || 0;
    const percentage = total > 0 ? Math.round((optVotes / total) * 100) : 0;
    return {
      optionId: opt.id,
      label: opt.label,
      votes: optVotes,
      percentage,
    };
  });

  return {
    pollId: poll.id,
    total,
    options,
    questions: remoteQuestionsResults,
  };
}

/**
 * Poll Repository — Database-Ready Abstraction Layer.
 * Future migrations (Google Sheets API, Supabase, Postgres) only require modifying this file.
 */
export async function getAllPolls(): Promise<Poll[]> {
  return [...defaultPolls];
}

export async function getPollBySlug(slug: string): Promise<Poll | undefined> {
  return defaultPolls.find((p) => p.slug === slug || p.id === slug);
}

export async function getOpenPolls(referenceTime: Date = new Date()): Promise<Poll[]> {
  const all = await getAllPolls();
  return all.filter((p) => isPollOpen(p, referenceTime));
}

export async function getClosedPolls(referenceTime: Date = new Date()): Promise<Poll[]> {
  const all = await getAllPolls();
  return all.filter((p) => !isPollOpen(p, referenceTime));
}
