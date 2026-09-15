"use client";

import { useState } from "react";
import { usePomodoro, type Durations } from "@/context/pomodoro-context";
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Settings2 } from "lucide-react";

export function PomodoroTool() {
  const {
    mode,
    isRunning,
    formattedTime,
    progressPercent,
    completedSessions,
    soundEnabled,
    durations,
    toggle,
    reset,
    skip,
    switchMode,
    setDurations,
    setSoundEnabled,
  } = usePomodoro();

  const [showSettings, setShowSettings] = useState(false);

  const handleSaveDurations = (newDurations: Durations) => {
    setDurations(newDurations);
    setShowSettings(false);
  };

  return (
    <div className="space-y-6">
      {/* Central Timer Surface */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-8 flex flex-col items-center justify-center text-center">
        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center gap-1 bg-secondary/60 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => switchMode("focus")}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-colors min-h-[44px] ${
              mode === "focus"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Focus ({durations.focus}m)
          </button>
          <button
            type="button"
            onClick={() => switchMode("shortBreak")}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-colors min-h-[44px] ${
              mode === "shortBreak"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Short Break ({durations.shortBreak}m)
          </button>
          <button
            type="button"
            onClick={() => switchMode("longBreak")}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-colors min-h-[44px] ${
              mode === "longBreak"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Long Break ({durations.longBreak}m)
          </button>
        </div>

        {/* Big Apple HIG Clock Display */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-8xl lg:text-9xl font-mono font-bold tracking-tight text-foreground select-none">
            {formattedTime}
          </div>

          {/* Progress hairline bar */}
          <div className="w-64 sm:w-80 h-1.5 bg-secondary rounded-full overflow-hidden mx-auto">
            <div
              className={`h-full transition-all duration-300 ${
                mode === "focus" ? "bg-primary" : "bg-emerald-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[13px] font-mono text-muted-foreground pt-1">
            {mode === "focus"
              ? "Deep work interval &middot; Stay on task"
              : "Recovery period &middot; Rest your eyes and stretch"}
          </p>
        </div>

        {/* Primary Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-[16px] font-semibold shadow-md active:scale-95 transition-all min-h-[52px] min-w-[140px] ${
              isRunning
                ? "bg-secondary text-foreground hover:bg-secondary/80"
                : "bg-primary text-primary-foreground hover:brightness-105"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={reset}
            className="p-3.5 rounded-2xl border border-border/80 bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground active:scale-95 transition-all min-h-[52px] min-w-[52px] flex items-center justify-center"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={skip}
            className="p-3.5 rounded-2xl border border-border/80 bg-background hover:bg-secondary/60 text-muted-foreground hover:text-foreground active:scale-95 transition-all min-h-[52px] min-w-[52px] flex items-center justify-center"
            title="Skip to next session"
            aria-label="Skip to next session"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom Utility Bar (Sessions Count, Sound, Settings) */}
        <div className="w-full max-w-md pt-6 border-t border-border/60 flex items-center justify-between text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Sessions Completed:{" "}
              <strong className="text-foreground font-mono">{completedSessions}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={soundEnabled ? "Mute chimes" : "Enable chimes"}
              aria-label={soundEnabled ? "Mute chimes" : "Enable chimes"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Timer durations setting"
              aria-label="Timer durations setting"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Optional Duration Settings Modal/Accordion */}
        {showSettings && (
          <div className="w-full max-w-md p-5 rounded-2xl border border-border/80 bg-secondary/30 space-y-4 text-left animate-in fade-in">
            <h4 className="text-[14px] font-bold text-foreground">
              Customize Durations (Minutes)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-[12px]">
              <div className="space-y-1">
                <label className="text-muted-foreground">Focus</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  defaultValue={durations.focus}
                  id="pom-focus-input"
                  className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Short Break</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  defaultValue={durations.shortBreak}
                  id="pom-short-input"
                  className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Long Break</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  defaultValue={durations.longBreak}
                  id="pom-long-input"
                  className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const focus =
                    parseInt(
                      (document.getElementById("pom-focus-input") as HTMLInputElement)
                        ?.value,
                      10
                    ) || 25;
                  const shortBreak =
                    parseInt(
                      (document.getElementById("pom-short-input") as HTMLInputElement)
                        ?.value,
                      10
                    ) || 5;
                  const longBreak =
                    parseInt(
                      (document.getElementById("pom-long-input") as HTMLInputElement)
                        ?.value,
                      10
                    ) || 15;
                  handleSaveDurations({ focus, shortBreak, longBreak });
                }}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:brightness-105 min-h-[44px]"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
