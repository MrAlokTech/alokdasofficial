"use client";

import * as React from "react";
import { playChime } from "@/lib/audio";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface Durations {
  focus: number; // minutes
  shortBreak: number;
  longBreak: number;
}

export const DEFAULT_DURATIONS: Durations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export interface PomodoroPersistedState {
  mode: TimerMode;
  isRunning: boolean;
  endAt: number | null; // Absolute Unix millisecond timestamp when current session expires
  durationSeconds: number; // Total duration in seconds for progress calculation
  remainingSeconds: number; // Paused remaining time or fallback
  completedSessions: number;
  durations: Durations;
  soundEnabled: boolean;
}

export interface PomodoroContextType {
  mode: TimerMode;
  isRunning: boolean;
  timeLeft: number; // Current remaining seconds
  totalSeconds: number; // Session total seconds
  progressPercent: number;
  formattedTime: string;
  completedSessions: number;
  soundEnabled: boolean;
  durations: Durations;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  switchMode: (newMode: TimerMode) => void;
  setDurations: (newDurations: Durations) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const PomodoroContext = React.createContext<PomodoroContextType | null>(null);

const STORAGE_KEY = "pomodoro_state";
const LEGACY_COMPLETED_KEY = "alokdas_pomodoro_completed";
const LEGACY_DURATIONS_KEY = "alokdas_pomodoro_durations";

function validateStoredState(raw: unknown): PomodoroPersistedState | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const validModes: TimerMode[] = ["focus", "shortBreak", "longBreak"];
  const mode = validModes.includes(obj.mode as TimerMode) ? (obj.mode as TimerMode) : "focus";

  const isRunning = Boolean(obj.isRunning);
  const endAt = typeof obj.endAt === "number" && !isNaN(obj.endAt) ? obj.endAt : null;
  const durationSeconds = typeof obj.durationSeconds === "number" && obj.durationSeconds > 0 ? obj.durationSeconds : 25 * 60;
  const remainingSeconds = typeof obj.remainingSeconds === "number" && obj.remainingSeconds >= 0 ? obj.remainingSeconds : durationSeconds;
  const completedSessions = typeof obj.completedSessions === "number" && obj.completedSessions >= 0 ? obj.completedSessions : 0;

  const rawDur = obj.durations as Record<string, unknown> | undefined;
  const durations: Durations = {
    focus: typeof rawDur?.focus === "number" && rawDur.focus > 0 ? rawDur.focus : DEFAULT_DURATIONS.focus,
    shortBreak: typeof rawDur?.shortBreak === "number" && rawDur.shortBreak > 0 ? rawDur.shortBreak : DEFAULT_DURATIONS.shortBreak,
    longBreak: typeof rawDur?.longBreak === "number" && rawDur.longBreak > 0 ? rawDur.longBreak : DEFAULT_DURATIONS.longBreak,
  };

  const soundEnabled = typeof obj.soundEnabled === "boolean" ? obj.soundEnabled : true;

  return {
    mode,
    isRunning,
    endAt,
    durationSeconds,
    remainingSeconds,
    completedSessions,
    durations,
    soundEnabled,
  };
}

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<TimerMode>("focus");
  const [durations, setDurationsState] = React.useState<Durations>(DEFAULT_DURATIONS);
  const [isRunning, setIsRunningState] = React.useState<boolean>(false);
  const [endAt, setEndAtState] = React.useState<number | null>(null);
  const [durationSeconds, setDurationSecondsState] = React.useState<number>(DEFAULT_DURATIONS.focus * 60);
  const [timeLeft, setTimeLeftState] = React.useState<number>(DEFAULT_DURATIONS.focus * 60);
  const [completedSessions, setCompletedSessionsState] = React.useState<number>(0);
  const [soundEnabled, setSoundEnabledState] = React.useState<boolean>(true);
  const [hasHydrated, setHasHydrated] = React.useState<boolean>(false);

  const baseTitleRef = React.useRef<string>("");

  // Helper to persist state to localStorage
  const saveState = React.useCallback(
    (nextState: Partial<PomodoroPersistedState>) => {
      try {
        const current: PomodoroPersistedState = {
          mode: nextState.mode !== undefined ? nextState.mode : mode,
          isRunning: nextState.isRunning !== undefined ? nextState.isRunning : isRunning,
          endAt: nextState.endAt !== undefined ? nextState.endAt : endAt,
          durationSeconds: nextState.durationSeconds !== undefined ? nextState.durationSeconds : durationSeconds,
          remainingSeconds: nextState.remainingSeconds !== undefined ? nextState.remainingSeconds : timeLeft,
          completedSessions: nextState.completedSessions !== undefined ? nextState.completedSessions : completedSessions,
          durations: nextState.durations !== undefined ? nextState.durations : durations,
          soundEnabled: nextState.soundEnabled !== undefined ? nextState.soundEnabled : soundEnabled,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        localStorage.setItem(LEGACY_COMPLETED_KEY, current.completedSessions.toString());
        localStorage.setItem(LEGACY_DURATIONS_KEY, JSON.stringify(current.durations));
      } catch {
        // Ignore localStorage restrictions
      }
    },
    [mode, isRunning, endAt, durationSeconds, timeLeft, completedSessions, durations, soundEnabled]
  );

  // 1. Initial State Hydration on Client Mount
  React.useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        baseTitleRef.current = document.title || "Alok Das";
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      let parsed: PomodoroPersistedState | null = null;
      if (stored) {
        parsed = validateStoredState(JSON.parse(stored));
      }

      // Check legacy values if main storage not found
      if (!parsed) {
        const legacyCompleted = localStorage.getItem(LEGACY_COMPLETED_KEY);
        const legacyDurations = localStorage.getItem(LEGACY_DURATIONS_KEY);
        let parsedDurations = DEFAULT_DURATIONS;
        if (legacyDurations) {
          try {
            parsedDurations = JSON.parse(legacyDurations);
          } catch {}
        }
        parsed = {
          mode: "focus",
          isRunning: false,
          endAt: null,
          durationSeconds: parsedDurations.focus * 60,
          remainingSeconds: parsedDurations.focus * 60,
          completedSessions: legacyCompleted ? parseInt(legacyCompleted, 10) || 0 : 0,
          durations: parsedDurations,
          soundEnabled: true,
        };
      }

      if (parsed) {
        setModeState(parsed.mode);
        setDurationsState(parsed.durations);
        setCompletedSessionsState(parsed.completedSessions);
        setSoundEnabledState(parsed.soundEnabled);
        setDurationSecondsState(parsed.durationSeconds);

        if (parsed.isRunning && parsed.endAt) {
          const now = Date.now();
          const diffMs = parsed.endAt - now;
          if (diffMs > 0) {
            const calculatedSecs = Math.ceil(diffMs / 1000);
            setEndAtState(parsed.endAt);
            setIsRunningState(true);
            setTimeLeftState(calculatedSecs);
          } else {
            // Session expired while tab/browser was closed
            setIsRunningState(false);
            setEndAtState(null);
            const nextCompleted = parsed.mode === "focus" ? parsed.completedSessions + 1 : parsed.completedSessions;
            setCompletedSessionsState(nextCompleted);
            const nextMode: TimerMode =
              parsed.mode === "focus"
                ? nextCompleted % 4 === 0
                  ? "longBreak"
                  : "shortBreak"
                : "focus";
            setModeState(nextMode);
            const newDuration = parsed.durations[nextMode] * 60;
            setDurationSecondsState(newDuration);
            setTimeLeftState(newDuration);
          }
        } else {
          setIsRunningState(false);
          setEndAtState(null);
          setTimeLeftState(parsed.remainingSeconds || parsed.durationSeconds);
        }
      }
    } catch {
      // Ignore private browsing errors
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Multi-tab synchronization via StorageEvent (Section 17)
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const remoteState = validateStoredState(JSON.parse(e.newValue));
        if (!remoteState) return;

        setModeState(remoteState.mode);
        setDurationsState(remoteState.durations);
        setCompletedSessionsState(remoteState.completedSessions);
        setSoundEnabledState(remoteState.soundEnabled);
        setDurationSecondsState(remoteState.durationSeconds);

        if (remoteState.isRunning && remoteState.endAt) {
          const now = Date.now();
          const diffMs = remoteState.endAt - now;
          if (diffMs > 0) {
            setEndAtState(remoteState.endAt);
            setIsRunningState(true);
            setTimeLeftState(Math.ceil(diffMs / 1000));
          } else {
            setIsRunningState(false);
            setEndAtState(null);
            setTimeLeftState(0);
          }
        } else {
          setIsRunningState(false);
          setEndAtState(null);
          setTimeLeftState(remoteState.remainingSeconds);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Section 10: Timer completion handler
  const handleComplete = React.useCallback(() => {
    setIsRunningState(false);
    setEndAtState(null);

    if (soundEnabled) {
      try {
        playChime();
      } catch {}
    }

    let nextCompleted = completedSessions;
    let nextMode: TimerMode = "focus";

    if (mode === "focus") {
      nextCompleted = completedSessions + 1;
      setCompletedSessionsState(nextCompleted);
      if (nextCompleted % 4 === 0) {
        nextMode = "longBreak";
      } else {
        nextMode = "shortBreak";
      }
    } else {
      nextMode = "focus";
    }

    setModeState(nextMode);
    const nextDuration = durations[nextMode] * 60;
    setDurationSecondsState(nextDuration);
    setTimeLeftState(nextDuration);

    saveState({
      mode: nextMode,
      isRunning: false,
      endAt: null,
      durationSeconds: nextDuration,
      remainingSeconds: nextDuration,
      completedSessions: nextCompleted,
    });
  }, [mode, completedSessions, soundEnabled, durations, saveState]);

  // Section 7 & 41: Absolute endAt tick interval & Document Visibility handling
  React.useEffect(() => {
    if (!isRunning || !endAt) return;

    const tick = () => {
      const now = Date.now();
      const remainingMs = endAt - now;

      if (remainingMs <= 0) {
        setTimeLeftState(0);
        handleComplete();
      } else {
        const calculatedSeconds = Math.ceil(remainingMs / 1000);
        setTimeLeftState(calculatedSeconds);
      }
    };

    // Immediate calculation
    tick();

    const interval = setInterval(tick, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning, endAt, handleComplete]);

  // Section 11, 12, 13, 40: Dynamic Document Title Updates
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    // Grab current route title if it doesn't already have timer prefix
    const currentDocTitle = document.title;
    if (!currentDocTitle.includes("•") && !currentDocTitle.includes("Paused")) {
      baseTitleRef.current = currentDocTitle;
    }

    const cleanBase = baseTitleRef.current
      .replace(/^[0-9]{2}:[0-9]{2}\s*•\s*/, "")
      .replace(/^Paused\s*•\s*/, "")
      .trim() || "Alok Das";

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (isRunning) {
      document.title = `${formatted} • ${cleanBase}`;
    } else if (hasHydrated && endAt !== null) {
      document.title = `Paused • ${cleanBase}`;
    } else {
      document.title = cleanBase;
    }

    return () => {
      // Don't clear on every second tick
    };
  }, [timeLeft, isRunning, endAt, hasHydrated]);

  // Action methods
  const start = React.useCallback(() => {
    const targetEnd = Date.now() + timeLeft * 1000;
    setEndAtState(targetEnd);
    setIsRunningState(true);

    saveState({
      isRunning: true,
      endAt: targetEnd,
      remainingSeconds: timeLeft,
      durationSeconds: durationSeconds,
    });
  }, [timeLeft, durationSeconds, saveState]);

  const pause = React.useCallback(() => {
    setIsRunningState(false);
    setEndAtState(null);

    saveState({
      isRunning: false,
      endAt: null,
      remainingSeconds: timeLeft,
    });
  }, [timeLeft, saveState]);

  const toggle = React.useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, pause, start]);

  const reset = React.useCallback(() => {
    setIsRunningState(false);
    setEndAtState(null);
    const initialSecs = durations[mode] * 60;
    setTimeLeftState(initialSecs);
    setDurationSecondsState(initialSecs);

    saveState({
      isRunning: false,
      endAt: null,
      durationSeconds: initialSecs,
      remainingSeconds: initialSecs,
    });
  }, [mode, durations, saveState]);

  const skip = React.useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const switchMode = React.useCallback(
    (newMode: TimerMode) => {
      setIsRunningState(false);
      setEndAtState(null);
      setModeState(newMode);
      const newDuration = durations[newMode] * 60;
      setDurationSecondsState(newDuration);
      setTimeLeftState(newDuration);

      saveState({
        mode: newMode,
        isRunning: false,
        endAt: null,
        durationSeconds: newDuration,
        remainingSeconds: newDuration,
      });
    },
    [durations, saveState]
  );

  const updateDurations = React.useCallback(
    (newDurations: Durations) => {
      setDurationsState(newDurations);
      const currentModeDuration = newDurations[mode] * 60;
      setDurationSecondsState(currentModeDuration);
      setTimeLeftState(currentModeDuration);
      setIsRunningState(false);
      setEndAtState(null);

      saveState({
        durations: newDurations,
        isRunning: false,
        endAt: null,
        durationSeconds: currentModeDuration,
        remainingSeconds: currentModeDuration,
      });
    },
    [mode, saveState]
  );

  const updateSoundEnabled = React.useCallback(
    (enabled: boolean) => {
      setSoundEnabledState(enabled);
      saveState({ soundEnabled: enabled });
    },
    [saveState]
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progressPercent = durationSeconds > 0
    ? Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / durationSeconds) * 100))
    : 0;

  const value: PomodoroContextType = {
    mode,
    isRunning,
    timeLeft,
    totalSeconds: durationSeconds,
    progressPercent,
    formattedTime,
    completedSessions,
    soundEnabled,
    durations,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
    setDurations: updateDurations,
    setSoundEnabled: updateSoundEnabled,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro(): PomodoroContextType {
  const context = React.useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
}
