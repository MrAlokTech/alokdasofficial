import { Poll } from "@/types/poll";

/**
 * Authoritative poll registry.
 * Fallback static polls have been removed in favor of purely dynamic
 * Google Apps Script / Google Sheets backend configuration.
 */
export const defaultPolls: Poll[] = [];
