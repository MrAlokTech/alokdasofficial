"use client";

import { useCallback } from "react";
import {
  trackClarityEvent,
  setClarityTag,
  identifyClarityUser,
  setClarityConsent,
  setClarityConsentV2,
  upgradeClaritySession,
  isClarityInitialized,
} from "@/lib/clarity";

/**
 * Custom React hook to interact with Microsoft Clarity in client components.
 * Future-ready for tracking events, user identifiers, tags, and consent.
 */
export function useClarity() {
  const trackEvent = useCallback((eventName: string) => {
    trackClarityEvent(eventName);
  }, []);

  const setTag = useCallback((key: string, value: string | string[]) => {
    setClarityTag(key, value);
  }, []);

  const identify = useCallback(
    (
      customId: string,
      customSessionId?: string,
      customPageId?: string,
      friendlyName?: string
    ) => {
      identifyClarityUser(customId, customSessionId, customPageId, friendlyName);
    },
    []
  );

  const consent = useCallback((hasConsent: boolean = true) => {
    setClarityConsent(hasConsent);
  }, []);

  const consentV2 = useCallback(
    (options: {
      ad_Storage: "granted" | "denied";
      analytics_Storage: "granted" | "denied";
    }) => {
      setClarityConsentV2(options);
    },
    []
  );

  const upgrade = useCallback((reason: string) => {
    upgradeClaritySession(reason);
  }, []);

  return {
    trackEvent,
    setTag,
    identify,
    consent,
    consentV2,
    upgrade,
    isReady: isClarityInitialized,
  };
}
