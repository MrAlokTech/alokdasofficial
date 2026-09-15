"use client";

import { useState, useEffect, useCallback } from "react";
import { playTone } from "@/lib/audio";
import { Atom, Check, X, RotateCcw, Award, Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChemistryQuestion {
  id: number;
  prompt: string;
  clue: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: "Element" | "Atomic Number" | "Group & Trends" | "Valence";
}

const QUESTION_BANK: ChemistryQuestion[] = [
  {
    id: 1,
    prompt: "Which element has atomic number 17?",
    clue: "Halogen gas with distinctive yellow-green coloration.",
    options: ["Fluorine (F)", "Chlorine (Cl)", "Bromine (Br)", "Argon (Ar)"],
    correctAnswer: "Chlorine (Cl)",
    explanation: "Chlorine (Cl, Z = 17) is a Group 17 halogen with electron configuration [Ne] 3s² 3p⁵.",
    category: "Atomic Number",
  },
  {
    id: 2,
    prompt: "What is the chemical symbol for Tungsten?",
    clue: "Derived from the historical German mineral name Wolfram.",
    options: ["Tu", "Tn", "W", "Tg"],
    correctAnswer: "W",
    explanation: "Tungsten uses the atomic symbol W, originating from Wolfram (wolframite).",
    category: "Element",
  },
  {
    id: 3,
    prompt: "Which group of elements possesses a stable octet valence configuration?",
    clue: "Inert monoatomic gases under standard conditions.",
    options: ["Alkali Metals", "Halogens", "Noble Gases", "Chalcogens"],
    correctAnswer: "Noble Gases",
    explanation: "Noble gases (Group 18) possess fully populated valence s and p subshells (ns² np⁶), granting remarkable thermodynamic stability.",
    category: "Group & Trends",
  },
  {
    id: 4,
    prompt: "What is the atomic number of Carbon?",
    clue: "The foundational tetravalent element of organic chemistry.",
    options: ["4", "6", "12", "14"],
    correctAnswer: "6",
    explanation: "Carbon has atomic number 6, forming the structural backbone of all organic and phytochemical compounds.",
    category: "Atomic Number",
  },
  {
    id: 5,
    prompt: "Which transition metal is liquid at standard room temperature (25°C)?",
    clue: "Historically called quicksilver, used in classical thermometers.",
    options: ["Bromine (Br)", "Mercury (Hg)", "Gallium (Ga)", "Cesium (Cs)"],
    correctAnswer: "Mercury (Hg)",
    explanation: "Mercury (Hg, Z = 80) is the only transition metallic element that remains liquid at standard ambient temperature and pressure.",
    category: "Element",
  },
  {
    id: 6,
    prompt: "Which element has the highest electronegativity on the Pauling scale?",
    clue: "Smallest halogen with an intense attraction for bonding electrons.",
    options: ["Oxygen (O)", "Fluorine (F)", "Chlorine (Cl)", "Nitrogen (N)"],
    correctAnswer: "Fluorine (F)",
    explanation: "Fluorine has the highest Pauling electronegativity (approx. 3.98) due to its high nuclear charge and minimal atomic radius.",
    category: "Group & Trends",
  },
  {
    id: 7,
    prompt: "What is the atomic number of Iron?",
    clue: "Central transition metal in hemoglobin and industrial steelmaking.",
    options: ["24", "26", "28", "30"],
    correctAnswer: "26",
    explanation: "Iron (Fe) has atomic number 26 and electron configuration [Ar] 3d⁶ 4s².",
    category: "Atomic Number",
  },
  {
    id: 8,
    prompt: "Which element has atomic symbol 'Au'?",
    clue: "Precious coinage metal named from the Latin word 'Aurum'.",
    options: ["Silver", "Gold", "Copper", "Platinum"],
    correctAnswer: "Gold",
    explanation: "Gold is denoted by 'Au' from the Latin Aurum, meaning glowing dawn.",
    category: "Element",
  },
];

export function ChemistryChallengeTool() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const question = QUESTION_BANK[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 10);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      playTone(880, 100, 0.2); // Success tone
    } else {
      setStreak(0);
      playTone(220, 200, 0.2); // Miss tone
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % QUESTION_BANK.length);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md">
        <div className="flex items-center gap-4 text-[13px]">
          <div className="flex items-center gap-1.5 font-mono">
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Score:</span>
            <strong className="text-foreground">{score}</strong>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Streak:</span>
            <strong className="text-foreground">{streak}</strong>
          </div>
          <span className="text-muted-foreground hidden sm:inline text-[12px]">
            (Best: {bestStreak})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono text-muted-foreground">
            Question {currentIndex + 1} of {QUESTION_BANK.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Restart quiz"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Flashcard Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-9 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6">
        {/* Category & Clue */}
        <div className="flex items-center justify-between">
          <Badge variant="chem">{question.category}</Badge>
          <span className="text-[12px] font-mono text-muted-foreground">
            Recall Practice
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
            {question.prompt}
          </h2>
          <p className="text-[14px] text-muted-foreground italic flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Clue: {question.clue}</span>
          </p>
        </div>

        {/* Multiple Choice Options Grid (44px min touch targets) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {question.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === question.correctAnswer;

            let buttonStyle =
              "border-border/80 bg-background hover:bg-secondary/60 text-foreground";

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle =
                  "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold";
              } else if (isSelected) {
                buttonStyle =
                  "border-red-500 bg-red-500/10 text-red-900 dark:text-red-300 font-semibold";
              } else {
                buttonStyle = "opacity-50 border-border/60 bg-background";
              }
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left text-[15px] font-medium transition-all flex items-center justify-between active:scale-[0.99] min-h-[56px] ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && (
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <X className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Button */}
        {isAnswered && (
          <div className="p-4 rounded-2xl border border-border/80 bg-secondary/30 space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                Scientific Explanation
              </span>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground shadow-sm hover:brightness-105 transition-all min-h-[44px]"
              >
                <span>Next Question</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
