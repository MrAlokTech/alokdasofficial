"use client";

import { useState, useEffect } from "react";
import { BookOpen, Save, Check } from "lucide-react";

interface LabNotesProps {
  labId: string;
}

export function LabNotes({ labId }: LabNotesProps) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(`alokdas_lab_notes_${labId}`);
      if (savedNotes) setNotes(savedNotes);
    } catch {}
  }, [labId]);

  const handleSave = () => {
    try {
      localStorage.setItem(`alokdas_lab_notes_${labId}`, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-semibold text-[14px]">
          <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Local Laboratory Notebook</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          Private to your browser
        </span>
      </div>

      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Record observations, anomalous readings, or calculations here..."
        className="w-full rounded-xl border border-border/70 bg-background p-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 text-[12px] font-medium transition-colors min-h-[44px]"
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Saved to Device</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Save Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
