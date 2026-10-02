import { Metadata } from "next";
import React, { Suspense } from "react";
import { EmergencyResponderWrapper } from "@/components/em-assist/emergency-responder-wrapper";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profileId = decodeURIComponent(params.id || "").toUpperCase();
  return {
    title: `Emergency Medical Profile (${profileId}) | EM Assist`,
    description: `Emergency identity profile ${profileId} on EM Assist. Scan verified response portal with real-time access logging.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

// Next.js static export generator using native edge REST fetch (zero Firebase SDK server bundling)
export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://firestore.googleapis.com/v1/projects/alokdasofficial/databases/(default)/documents/em_profiles",
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      const docs = data.documents || [];
      const list = docs.map((doc: any) => {
        const parts = doc.name.split("/");
        return { id: parts[parts.length - 1] };
      });
      if (list.length > 0) {
        return list;
      }
    }
  } catch {
    // Offline / build fallback
  }

  return [
    { id: "EM-SAMPLE" },
    { id: "demo" },
  ];
}

export default function EmergencyResponderPage({ params }: Props) {
  return (
    <>
      <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <EmergencyResponderWrapper initialProfileId={params.id} />
      </Suspense>
    </>
  );
}
