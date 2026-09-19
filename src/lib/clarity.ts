import Clarity from "@microsoft/clarity";

/**
 * Checks whether Clarity should run in the current runtime environment.
 * Runs in production by default, or in development if NEXT_PUBLIC_CLARITY_DEBUG === "true".
 */
export const shouldRunClarity = (): boolean => {
  if (typeof window === "undefined") return false;

  const isProduction = process.env.NODE_ENV === "production";
  const isDebugEnabled = process.env.NEXT_PUBLIC_CLARITY_DEBUG === "true";

  return isProduction || isDebugEnabled;
};

/**
 * Returns the configured Clarity Project ID.
 */
export const getClarityProjectId = (): string | undefined => {
  return process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
};

/**
 * Checks if Clarity has been initialized and is ready on window.
 */
export const isClarityInitialized = (): boolean => {
  if (typeof window === "undefined") return false;
  return typeof (window as unknown as { clarity?: unknown }).clarity === "function";
};

let isInitialized = false;

/**
 * Initializes Microsoft Clarity tracking.
 * Safe to call multiple times; initialization is idempotent.
 */
export const initClarity = (projectId?: string): boolean => {
  if (typeof window === "undefined") return false;

  if (isInitialized || isClarityInitialized()) {
    return true;
  }

  const id = projectId || getClarityProjectId();

  if (!id) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Clarity] Project ID is missing. Set NEXT_PUBLIC_CLARITY_PROJECT_ID.");
    }
    return false;
  }

  if (!shouldRunClarity()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[Clarity] Tracking disabled in development. Set NEXT_PUBLIC_CLARITY_DEBUG=true to enable locally.");
    }
    return false;
  }

  try {
    Clarity.init(id);
    isInitialized = true;
    return true;
  } catch (err) {
    console.error("[Clarity] Failed to initialize Microsoft Clarity:", err);
    return false;
  }
};

/**
 * Records a custom Clarity event.
 * Useful for tracking user actions, button clicks, form submissions, and milestone achievements.
 */
export const trackClarityEvent = (eventName: string): void => {
  if (!shouldRunClarity() || !isClarityInitialized()) return;

  try {
    Clarity.event(eventName);
  } catch (err) {
    console.error(`[Clarity] Failed to dispatch event "${eventName}":`, err);
  }
};

/**
 * Sets a custom tag (key-value pair) on the Clarity session.
 * Used for segmenting recordings and heatmaps by user attributes, page types, or app states.
 */
export const setClarityTag = (key: string, value: string | string[]): void => {
  if (!shouldRunClarity() || !isClarityInitialized()) return;

  try {
    Clarity.setTag(key, value);
  } catch (err) {
    console.error(`[Clarity] Failed to set tag "${key}":`, err);
  }
};

/**
 * Associates user-specific identifiers with the Clarity session.
 * Useful when users authenticate or perform distinct session actions.
 */
export const identifyClarityUser = (
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
): void => {
  if (!shouldRunClarity() || !isClarityInitialized()) return;

  try {
    Clarity.identify(customId, customSessionId, customPageId, friendlyName);
  } catch (err) {
    console.error("[Clarity] Failed to identify user:", err);
  }
};

/**
 * Updates consent state for Microsoft Clarity.
 */
export const setClarityConsent = (consent: boolean = true): void => {
  if (typeof window === "undefined") return;

  try {
    Clarity.consent(consent);
  } catch (err) {
    console.error("[Clarity] Failed to set consent:", err);
  }
};

/**
 * Updates granular consent v2 state for Microsoft Clarity.
 */
export const setClarityConsentV2 = (consentOptions: {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
}): void => {
  if (typeof window === "undefined") return;

  try {
    Clarity.consentV2(consentOptions);
  } catch (err) {
    console.error("[Clarity] Failed to set consentV2:", err);
  }
};

/**
 * Upgrades session priority in Clarity (e.g. for high-value user actions or bug reports).
 */
export const upgradeClaritySession = (reason: string): void => {
  if (!shouldRunClarity() || !isClarityInitialized()) return;

  try {
    Clarity.upgrade(reason);
  } catch (err) {
    console.error("[Clarity] Failed to upgrade session:", err);
  }
};

export default Clarity;
