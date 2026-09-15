import { Metadata } from "next";
import { MorseTool } from "@/components/tools/morse-tool";
import { ToolFooter } from "@/components/tools/tool-footer";
import { Radio, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Morse Code Practice Tool & Audio Trainer | Alok Das",
  description:
    "Free interactive online Morse code practice trainer and translator with Web Audio tones, quiz challenges, and an international Morse alphabet chart.",
  alternates: {
    canonical: "https://alokdasofficial.in/tools/morse",
  },
  openGraph: {
    title: "Morse Code Practice Tool & Audio Trainer | Alok Das",
    description:
      "Practice, encode and decode Morse code with audio feedback, character flashcards, and live text translation.",
    url: "https://alokdasofficial.in/tools/morse",
    type: "website",
  },
};

export default function MorsePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Practice Tool & Trainer",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    browserRequirements: "Requires Web Audio API support",
    url: "https://alokdasofficial.in/tools/morse",
    description:
      "Browser-based Morse code learning utility with real-time audio synthesis, practice mode, and bidirectional text translation.",
    creator: {
      "@type": "Person",
      name: "Alok Das",
      url: "https://alokdasofficial.in",
    },
  };

  return (
    <div className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-10">
        {/* Page Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-[12px] font-medium text-foreground/90">
            <Radio className="h-3.5 w-3.5 text-primary" />
            <span>Interactive Learning Utility</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Morse Code Practice Tool
          </h1>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
            Practice, encode, and decode International Morse Code through interactive flashcard quizzes, real-time Web Audio tones, and live bidirectional translation.
          </p>
        </header>

        {/* Interactive Client Application */}
        <main>
          <MorseTool />
        </main>

        {/* Server-Rendered Explanatory & SEO Content */}
        <section className="space-y-8 pt-8 border-t border-border/60">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              How to Use the Morse Code Trainer
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              International Morse Code encodes text characters as standardized sequences of two distinct signal durations: dots (short marks) and dashes (long marks). A dash duration equals three dots, and the space between individual dots and dashes within a character equals one dot length.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px]">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Practice Mode
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Test your instantaneous recall. Convert displayed letters to dots and dashes or listen to audio tones to identify corresponding alphabet characters.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1.5">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Live Translator
              </span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Type any sentence or message to see the instantaneous Morse transcription and play the complete sequence as standard audio beeps.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  What characters does this Morse tool support?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  The tool supports all 26 uppercase Latin alphabet letters (A through Z), numerals 0 through 9, and standard punctuation (periods, commas, and question marks).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                <h4 className="font-semibold text-foreground text-[14px]">
                  How does audio synthesis work without downloads?
                </h4>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Audio is generated client-side using the browser&apos;s Web Audio API, synthesizing precise 700 Hz sine waves with zero external audio assets or latency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter Backlink Footer */}
        <ToolFooter />
      </div>
    </div>
  );
}
