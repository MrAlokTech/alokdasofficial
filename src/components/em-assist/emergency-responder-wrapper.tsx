"use client";

import dynamic from "next/dynamic";
import React from "react";

const EmergencyResponderClient = dynamic(
  () =>
    import("@/components/em-assist/emergency-responder-client").then(
      (mod) => mod.EmergencyResponderClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

interface EmergencyResponderWrapperProps {
  initialProfileId?: string;
}

export function EmergencyResponderWrapper({
  initialProfileId,
}: EmergencyResponderWrapperProps) {
  return <EmergencyResponderClient initialProfileId={initialProfileId} />;
}
