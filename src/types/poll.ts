export interface PollOption {
  id: string;
  label: string;
  description?: string;
}

export type PollStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type PollResultsVisibility = "always" | "afterVote" | "afterClose" | "never";

export type PollQuestionType = "choice" | "multiple_choice" | "descriptive";

export interface PollQuestion {
  id: string; // e.g. "q1", "q2"
  pollId: string;
  qNo: number;
  question: string;
  type: PollQuestionType;
  options: PollOption[];
  required?: boolean;
  helpText?: string;
  placeholder?: string;
}

export interface Poll {
  id: string;
  slug: string;
  title: string;
  description?: string;
  question?: string;
  options?: PollOption[];
  questions?: PollQuestion[];
  startTime?: string; // ISO 8601 string, e.g. "2026-09-01T10:00:00+05:30"
  endTime?: string;   // ISO 8601 string, e.g. "2026-12-31T23:59:59+05:30"
  createdAt?: string; // Backwards-compatible alias for startTime
  closesAt?: string;  // Backwards-compatible alias for endTime
  status?: PollStatus;
  allowMultiple?: boolean;
  showResults?: boolean;
  resultsVisibility?: PollResultsVisibility;
  minimumResultsCount?: number;
  indexable?: boolean;
  category?: "Tools" | "Chemistry" | "Community" | "General" | string;
  author?: string;
  version?: number;
  endpointUrl?: string; // Optional custom endpoint override
  initialVotes?: Record<string, number>; // Baseline seed votes for demo/visualization
}

export interface PollQuestionResult {
  qNo: number;
  id?: string;
  type: PollQuestionType;
  total: number;
  options?: Array<{
    optionId: string;
    label: string;
    votes: number;
    percentage: number;
  }>;
  descriptiveCount?: number;
}

export interface PollResultSummary {
  pollId: string;
  total: number;
  options: Array<{
    optionId: string;
    label: string;
    votes: number;
    percentage: number;
  }>;
  questions?: PollQuestionResult[];
}

export interface PollSubmissionPayload {
  poll_id: string;
  vote_token: string;
  answers: Record<string, string | string[]>; // e.g. { "q1": "optionId", "q2": ["opt1", "opt2"], "q3": "text" }
  pollVersion?: number;
}

export type PollSubmissionStatus =
  | "recorded"
  | "closed"
  | "not_started"
  | "token_used"
  | "invalid_token"
  | "invalid_answer"
  | "server_error";

export interface PollSubmissionResponse {
  ok: boolean;
  status: PollSubmissionStatus;
  message?: string;
  pollId?: string;
}

export interface PollTokenResponse {
  ok: boolean;
  token?: string;
  status?: "active" | "closed" | "not_started" | "error";
  message?: string;
}
