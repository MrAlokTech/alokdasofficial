"use client";

import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";

export function MeasurementSigFigsLab() {
  const [testNumber, setTestNumber] = useState("0.0450");
  const [val1, setVal1] = useState("12.4");
  const [val2, setVal2] = useState("3.1415");
  const [operation, setOperation] = useState<"multiply" | "add">("multiply");

  // Analyze significant figures for a given string
  const analyzeSigFigs = (numStr: string): { count: number; scientific: string; rule: string } => {
    const trimmed = numStr.trim();
    if (!trimmed || isNaN(Number(trimmed))) {
      return { count: 0, scientific: "-", rule: "Invalid numeric input" };
    }

    const num = parseFloat(trimmed);
    const scientific = num.toExponential();

    // Rule detection
    let clean = trimmed.replace(/^-/, ""); // ignore negative
    if (clean.includes(".")) {
      // With decimal
      if (/^0\.0*/.test(clean)) {
        // Leading zeros are NOT significant
        const significantPart = clean.replace(/^0\.0*/, "");
        return {
          count: significantPart.length,
          scientific,
          rule: "Leading zeros after decimal are placeholders; remaining digits are significant.",
        };
      } else {
        const significantPart = clean.replace(".", "");
        return {
          count: significantPart.length,
          scientific,
          rule: "All non-zero digits and trailing zeros with a decimal point are significant.",
        };
      }
    } else {
      // Without decimal (trailing zeros ambiguous, conventionally non-significant)
      const stripped = clean.replace(/0+$/, "");
      return {
        count: stripped.length,
        scientific,
        rule: "Integers without decimals: trailing zeros are non-significant placeholders.",
      };
    }
  };

  const analysis = analyzeSigFigs(testNumber);

  // Arithmetic calculation
  const n1 = parseFloat(val1) || 0;
  const n2 = parseFloat(val2) || 0;
  const rawResult = operation === "multiply" ? n1 * n2 : n1 + n2;

  // Significant figures rounding logic
  const roundedResult = (() => {
    if (operation === "multiply") {
      const sig1 = analyzeSigFigs(val1).count;
      const sig2 = analyzeSigFigs(val2).count;
      const minSig = Math.min(sig1, sig2);
      return rawResult.toPrecision(minSig);
    } else {
      // Decimal places
      const dec1 = (val1.split(".")[1] || "").length;
      const dec2 = (val2.split(".")[1] || "").length;
      const minDec = Math.min(dec1, dec2);
      return rawResult.toFixed(minDec);
    }
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Module 1: Live Significant Figures Analyzer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Significant Figures Digit Analyzer
            </h3>
            <span className="text-[12px] font-mono text-muted-foreground">
              IUPAC / ISO Reporting Rules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 space-y-2">
              <label htmlFor="sigfig-test-input" className="text-[12px] font-mono text-muted-foreground uppercase">
                Input Laboratory Reading:
              </label>
              <input
                id="sigfig-test-input"
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="e.g. 0.0450"
                className="w-full h-12 rounded-xl border border-border/80 bg-background px-4 font-mono text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                {["0.0450", "120.0", "0.003", "1.0080", "4500"].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setTestNumber(sample)}
                    className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground hover:bg-secondary/70 min-h-[44px]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Readout Card */}
            <div className="sm:col-span-7 p-4 rounded-2xl border border-border/80 bg-secondary/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono text-muted-foreground uppercase">
                  Count of Significant Figures
                </span>
                <span className="text-3xl font-mono font-extrabold text-primary">
                  {analysis.count}
                </span>
              </div>
              <div className="text-[12px] text-muted-foreground pt-1 border-t border-border/50">
                Scientific Notation: <strong className="font-mono text-foreground">{analysis.scientific}</strong>
              </div>
              <p className="text-[12px] text-muted-foreground italic">
                Rule: {analysis.rule}
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: Experimental Arithmetic Rounding Simulator */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-lg font-bold text-foreground">
              Laboratory Arithmetic &amp; Uncertainty Propagation
            </h3>
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg text-[12px]">
              <button
                type="button"
                onClick={() => setOperation("multiply")}
                className={`px-3 py-1 rounded-md transition-colors min-h-[44px] ${
                  operation === "multiply" ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                Multiplication (×)
              </button>
              <button
                type="button"
                onClick={() => setOperation("add")}
                className={`px-3 py-1 rounded-md transition-colors min-h-[44px] ${
                  operation === "add" ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground"
                }`}
              >
                Addition (+)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="sigfig-measurement-1" className="text-[12px] font-mono text-muted-foreground">
                Measurement 1 ({analyzeSigFigs(val1).count} sig figs)
              </label>
              <input
                id="sigfig-measurement-1"
                type="text"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full h-11 rounded-xl border border-border/80 bg-background px-3 font-mono text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="sigfig-measurement-2" className="text-[12px] font-mono text-muted-foreground">
                Measurement 2 ({analyzeSigFigs(val2).count} sig figs)
              </label>
              <input
                id="sigfig-measurement-2"
                type="text"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
                className="w-full h-11 rounded-xl border border-border/80 bg-background px-3 font-mono text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Result Comparison: Raw Calculator vs Significant Figures Convention */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
              <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                Raw Unrounded Calculator Output
              </span>
              <div className="text-xl font-mono text-muted-foreground">
                {isNaN(rawResult) ? "-" : rawResult}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Exceeds experimentally validated precision.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-[11px] font-mono uppercase text-emerald-700 dark:text-emerald-400 block font-semibold">
                Correct Scientific Report Value
              </span>
              <div className="text-2xl font-mono font-bold text-foreground">
                {roundedResult}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {operation === "multiply"
                  ? "Limited to fewest significant figures among factors."
                  : "Limited to fewest decimal places among addends."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
