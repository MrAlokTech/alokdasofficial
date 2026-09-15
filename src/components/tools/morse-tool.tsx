"use client";

import { useState, useEffect, useCallback } from "react";
import { playMorseDot, playMorseDash, playTone } from "@/lib/audio";
import { Volume2, VolumeX, RotateCcw, Check, X, ArrowRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const MORSE_CODE_MAP: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
};

const CHARACTERS = Object.keys(MORSE_CODE_MAP).filter((c) => /^[A-Z0-9]$/.test(c));

export function MorseTool() {
  const [activeTab, setActiveTab] = useState<"practice" | "translate" | "reference">("practice");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Practice state
  const [currentQuestion, setCurrentQuestion] = useState("A");
  const [quizMode, setQuizMode] = useState<"char-to-morse" | "morse-to-char">("char-to-morse");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Translation state
  const [inputText, setInputText] = useState("SOS");
  const [translatedMorse, setTranslatedMorse] = useState("... --- ...");

  // Play Morse string with accurate standard timing
  const playMorseSequence = useCallback(
    async (code: string) => {
      if (!soundEnabled) return;
      const dotTime = 60; // ms
      const dashTime = 180; // ms
      const elementGap = 60; // ms

      for (const symbol of code) {
        if (symbol === ".") {
          playMorseDot();
          await new Promise((r) => setTimeout(r, dotTime + elementGap));
        } else if (symbol === "-") {
          playMorseDash();
          await new Promise((r) => setTimeout(r, dashTime + elementGap));
        } else if (symbol === " ") {
          await new Promise((r) => setTimeout(r, 180));
        }
      }
    },
    [soundEnabled]
  );

  // Pick new random question
  const pickNewQuestion = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    const nextChar = CHARACTERS[randomIndex];
    setCurrentQuestion(nextChar);
    setUserAnswer("");
    setFeedback(null);
  }, []);

  // Check user answer in practice mode
  const handleCheckAnswer = (answer: string) => {
    const expected =
      quizMode === "char-to-morse" ? MORSE_CODE_MAP[currentQuestion] : currentQuestion;

    const isMatch = answer.trim().toUpperCase() === expected.toUpperCase();
    setAttempts((prev) => prev + 1);

    if (isMatch) {
      setFeedback("correct");
      setScore((prev) => prev + 1);
      if (soundEnabled) playTone(880, 100, 0.15); // pleasant success chime
      setTimeout(() => {
        pickNewQuestion();
      }, 1000);
    } else {
      setFeedback("incorrect");
      if (soundEnabled) playTone(250, 180, 0.15); // low buzz
    }
  };

  // Live text translation
  const handleTextChange = (text: string) => {
    setInputText(text);
    const morse = text
      .toUpperCase()
      .split("")
      .map((char) => {
        if (char === " ") return "  ";
        return MORSE_CODE_MAP[char] || "?";
      })
      .join(" ");
    setTranslatedMorse(morse);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors min-h-[44px] ${
              activeTab === "practice"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Practice Trainer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("translate")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors min-h-[44px] ${
              activeTab === "translate"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Translator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reference")}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors min-h-[44px] ${
              activeTab === "reference"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Alphabet Chart
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/70 bg-card hover:bg-secondary/60 text-[13px] font-medium text-foreground transition-colors min-h-[44px]"
          aria-label={soundEnabled ? "Mute audio tones" : "Unmute audio tones"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Audio On</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4 text-muted-foreground" />
              <span>Audio Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Mode 1: Practice Trainer */}
      {activeTab === "practice" && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Practice Header & Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuizMode("char-to-morse");
                  pickNewQuestion();
                }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors min-h-[44px] ${
                  quizMode === "char-to-morse"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Letter → Morse
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuizMode("morse-to-char");
                  pickNewQuestion();
                }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors min-h-[44px] ${
                  quizMode === "morse-to-char"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Morse → Letter
              </button>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center gap-4 text-[13px] font-mono">
              <span>
                Score: <strong className="text-foreground">{score}</strong>
              </span>
              <span className="text-muted-foreground">
                Accuracy:{" "}
                <strong className="text-foreground">
                  {attempts > 0 ? Math.round((score / attempts) * 100) : 100}%
                </strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setScore(0);
                  setAttempts(0);
                  pickNewQuestion();
                }}
                className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Reset score"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Flashcard Challenge Area */}
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <span className="text-[12px] font-mono text-muted-foreground uppercase tracking-wider">
              {quizMode === "char-to-morse" ? "Enter Morse code for:" : "Identify the character:"}
            </span>

            <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-widest text-foreground min-h-[80px] flex items-center justify-center">
              {quizMode === "char-to-morse"
                ? currentQuestion
                : MORSE_CODE_MAP[currentQuestion]}
            </div>

            <button
              type="button"
              onClick={() => playMorseSequence(MORSE_CODE_MAP[currentQuestion])}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:underline min-h-[44px]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Listen to Tone</span>
            </button>
          </div>

          {/* Answer Input Controls */}
          <div className="max-w-md mx-auto space-y-4">
            {quizMode === "char-to-morse" ? (
              <div className="space-y-3">
                {/* Visual Dot/Dash Keyer Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playMorseDot();
                      setUserAnswer((prev) => prev + ".");
                    }}
                    className="h-16 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary active:scale-[0.98] text-2xl font-mono font-bold transition-all flex items-center justify-center min-h-[44px]"
                  >
                    &bull; (Dot)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playMorseDash();
                      setUserAnswer((prev) => prev + "-");
                    }}
                    className="h-16 rounded-xl border border-border/80 bg-secondary/40 hover:bg-secondary active:scale-[0.98] text-2xl font-mono font-bold transition-all flex items-center justify-center min-h-[44px]"
                  >
                    &mdash; (Dash)
                  </button>
                </div>

                {/* Display Current Input + Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-12 rounded-xl border border-border/80 bg-background px-4 flex items-center font-mono text-xl tracking-widest text-foreground">
                    {userAnswer || (
                      <span className="text-muted-foreground text-sm font-sans tracking-normal">
                        Tap dot/dash buttons or type on keyboard
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setUserAnswer("")}
                    className="px-3.5 h-12 rounded-xl border border-border/80 bg-card hover:bg-secondary text-[13px] font-medium text-foreground transition-colors min-h-[44px]"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckAnswer(userAnswer)}
                    disabled={!userAnswer}
                    className="px-5 h-12 rounded-xl bg-primary text-primary-foreground text-[14px] font-medium hover:brightness-105 disabled:opacity-50 transition-all min-h-[44px]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              /* Morse-to-Char text input */
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={1}
                  value={userAnswer}
                  onChange={(e) => {
                    const char = e.target.value.toUpperCase();
                    setUserAnswer(char);
                    if (char) handleCheckAnswer(char);
                  }}
                  placeholder="Type letter (e.g. A)"
                  className="flex-1 h-12 rounded-xl border border-border/80 bg-background px-4 font-mono text-xl text-center text-foreground uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleCheckAnswer(userAnswer)}
                  className="px-5 h-12 rounded-xl bg-primary text-primary-foreground text-[14px] font-medium hover:brightness-105 transition-all min-h-[44px]"
                >
                  Check
                </button>
              </div>
            )}

            {/* Feedback Message */}
            {feedback === "correct" && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-[14px] font-semibold animate-in fade-in">
                <Check className="h-4 w-4" />
                <span>Correct! Excellent recall.</span>
              </div>
            )}
            {feedback === "incorrect" && (
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-[14px] font-semibold animate-in fade-in">
                <X className="h-4 w-4" />
                <span>
                  Not quite. Expected:{" "}
                  <strong>
                    {quizMode === "char-to-morse"
                      ? MORSE_CODE_MAP[currentQuestion]
                      : currentQuestion}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Bidirectional Translator */}
      {activeTab === "translate" && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              Real-time Morse Code Translator
            </h3>
            <p className="text-[13px] text-muted-foreground">
              Type plain English text below to convert into standardized dots and dashes with audio playback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Text Box */}
            <div className="space-y-2">
              <label htmlFor="morse-input-text" className="text-[12px] font-mono text-muted-foreground uppercase">
                Plain English Text
              </label>
              <textarea
                id="morse-input-text"
                rows={4}
                value={inputText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Type your message here..."
                className="w-full rounded-xl border border-border/80 bg-background p-4 text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
              />
            </div>

            {/* Morse Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-mono text-muted-foreground uppercase">
                  Morse Code Output
                </label>
                <button
                  type="button"
                  onClick={() => playMorseSequence(translatedMorse)}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline min-h-[44px]"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Play Sequence</span>
                </button>
              </div>
              <div className="w-full h-32 rounded-xl border border-border/80 bg-secondary/30 p-4 font-mono text-lg tracking-widest text-foreground overflow-y-auto leading-relaxed break-all">
                {translatedMorse || "..."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Alphabet Chart */}
      {activeTab === "reference" && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              International Morse Code Chart
            </h3>
            <p className="text-[13px] text-muted-foreground">
              Click on any letter or number to hear its standardized auditory sequence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {Object.entries(MORSE_CODE_MAP).map(([char, morse]) => (
              <button
                key={char}
                type="button"
                onClick={() => playMorseSequence(morse)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-secondary/40 active:scale-95 transition-all text-left min-h-[44px]"
              >
                <span className="text-[16px] font-bold text-foreground">{char}</span>
                <span className="text-[13px] font-mono text-muted-foreground">{morse}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
