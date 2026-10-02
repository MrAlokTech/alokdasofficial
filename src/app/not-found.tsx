"use client";

import * as React from "react";
import Link from "next/link";
import { FlaskConical, Home, FileText } from "lucide-react";

import { EmergencyResponderWrapper } from "@/components/em-assist/emergency-responder-wrapper";

export default function NotFound() {
  const [isEmergencyRoute, setIsEmergencyRoute] = React.useState(false);
  const [profileId, setProfileId] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/polls/")) {
        const slug = path.replace(/^\/polls\//, "").replace(/\/$/, "");
        if (slug) {
          window.location.replace(`/polls?poll=${encodeURIComponent(slug)}`);
        }
      } else if (path.startsWith("/u/")) {
        const parts = path.split("/").filter(Boolean);
        const uIdx = parts.indexOf("u");
        if (uIdx !== -1 && parts[uIdx + 1]) {
          setProfileId(parts[uIdx + 1]);
          setIsEmergencyRoute(true);
        }
      }
    }
  }, []);

  if (isEmergencyRoute) {
    return (
      <>
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <EmergencyResponderWrapper initialProfileId={profileId} />
      </>
    );
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <FlaskConical className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Error 404 &middot; Compound Not Found
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Page Not Synthesized
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The reaction pathway or URL you requested does not exist in this laboratory notebook.
            Please verify the address or return to the main pages.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/resume"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <FileText className="h-4 w-4" />
            View Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
