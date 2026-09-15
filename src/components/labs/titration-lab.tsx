"use client";

import { useState, useMemo } from "react";
import { RotateCcw, Plus } from "lucide-react";

export function TitrationLab() {
  const [acidType, setAcidType] = useState<"strong" | "weak">("strong");
  const [indicator, setIndicator] = useState<"phenolphthalein" | "methylOrange">("phenolphthalein");
  const [titrantVolume, setTitrantVolume] = useState(0); // mL NaOH added

  // Analyte parameters
  const ca = 0.1; // mol/L acid
  const va = 25.0; // mL acid
  const cb = 0.1; // mol/L NaOH titrant

  // Equivalence volume (mL)
  const vEquiv = (ca * va) / cb; // 25.0 mL

  // Calculate current pH based on volume of NaOH added
  const currentPh = useMemo(() => {
    const v = titrantVolume;
    const totalVolume = va + v;

    if (v === 0) {
      if (acidType === "strong") return -Math.log10(ca);
      // Weak acid (CH3COOH, Ka = 1.8e-5, pKa = 4.74): [H+] ~ sqrt(Ka * C)
      const h = Math.sqrt(1.8e-5 * ca);
      return -Math.log10(h);
    }

    if (v < vEquiv) {
      // Before equivalence point
      const remainingMolesAcid = (ca * va - cb * v) / 1000;
      if (acidType === "strong") {
        const concH = remainingMolesAcid / (totalVolume / 1000);
        return -Math.log10(concH);
      } else {
        // Buffer region: Henderson-Hasselbalch pH = pKa + log([A-]/[HA])
        const molesSalt = (cb * v) / 1000;
        const pKa = 4.74;
        return pKa + Math.log10(molesSalt / remainingMolesAcid);
      }
    }

    if (Math.abs(v - vEquiv) < 0.05) {
      // At equivalence point
      if (acidType === "strong") return 7.0;
      // Weak acid conjugate base hydrolysis: [OH-] ~ sqrt((Kw/Ka) * [A-])
      const concSalt = (ca * va) / totalVolume;
      const kb = 1e-14 / 1.8e-5;
      const oh = Math.sqrt(kb * concSalt);
      const poh = -Math.log10(oh);
      return 14.0 - poh;
    }

    // Past equivalence point: excess NaOH dominates
    const excessMolesBase = (cb * (v - vEquiv)) / 1000;
    const concOH = excessMolesBase / (totalVolume / 1000);
    const poh = -Math.log10(concOH);
    return Math.min(14.0, 14.0 - poh);
  }, [acidType, titrantVolume]);

  // Determine solution indicator color in flask
  const flaskColor = useMemo(() => {
    if (indicator === "phenolphthalein") {
      // Colorless below pH 8.2, pink above pH 8.2
      if (currentPh < 8.2) return "rgba(255, 255, 255, 0.4)";
      if (currentPh < 10.0) return "rgba(244, 114, 182, 0.5)"; // light pink
      return "rgba(236, 72, 153, 0.85)"; // vivid magenta pink
    } else {
      // Methyl Orange: Red below pH 3.1, orange 3.1-4.4, yellow above 4.4
      if (currentPh < 3.1) return "rgba(239, 68, 68, 0.8)";
      if (currentPh < 4.4) return "rgba(249, 115, 22, 0.8)";
      return "rgba(234, 179, 8, 0.8)";
    }
  }, [indicator, currentPh]);

  // Generate SVG points for titration curve (0 to 50 mL)
  const curvePoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let v = 0; v <= 50; v += 1) {
      let ph = 7;
      const totalVol = va + v;
      if (v === 0) {
        ph = acidType === "strong" ? 1.0 : 2.87;
      } else if (v < vEquiv) {
        const remAcid = (ca * va - cb * v) / 1000;
        if (acidType === "strong") {
          ph = -Math.log10(remAcid / (totalVol / 1000));
        } else {
          ph = 4.74 + Math.log10(((cb * v) / 1000) / remAcid);
        }
      } else if (Math.abs(v - vEquiv) < 0.05) {
        ph = acidType === "strong" ? 7.0 : 8.72;
      } else {
        const excess = (cb * (v - vEquiv)) / 1000;
        const poh = -Math.log10(excess / (totalVol / 1000));
        ph = 14.0 - poh;
      }
      // Scale: x in [0, 50] -> [30, 270], y in [0, 14] -> [170, 20]
      const x = 30 + (v / 50) * 240;
      const y = 170 - (ph / 14) * 150;
      points.push([x, y]);
    }
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }, [acidType]);

  const currentDotX = 30 + (titrantVolume / 50) * 240;
  const currentDotY = 170 - (currentPh / 14) * 150;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-muted-foreground uppercase">Acid:</span>
            <button
              type="button"
              onClick={() => {
                setAcidType("strong");
                setTitrantVolume(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors min-h-[44px] ${
                acidType === "strong"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              HCl (Strong)
            </button>
            <button
              type="button"
              onClick={() => {
                setAcidType("weak");
                setTitrantVolume(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-colors min-h-[44px] ${
                acidType === "weak"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              CH₃COOH (Weak)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-muted-foreground uppercase">Indicator:</span>
            <select
              value={indicator}
              onChange={(e) => setIndicator(e.target.value as "phenolphthalein" | "methylOrange")}
              className="rounded-xl border border-border/80 bg-background px-3 py-2 text-[13px] text-foreground focus:outline-none min-h-[44px]"
            >
              <option value="phenolphthalein">Phenolphthalein (pH 8.2–10.0)</option>
              <option value="methylOrange">Methyl Orange (pH 3.1–4.4)</option>
            </select>
          </div>
        </div>

        {/* Experiment Visual Grid: Flask/Buret + Titration Curve Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Flask & Buret Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-40 flex flex-col items-center">
              {/* Buret Tube */}
              <div className="w-5 h-28 border-2 border-foreground/40 bg-secondary/20 rounded-t relative flex flex-col justify-end">
                <div
                  className="w-full bg-primary/30 transition-all duration-150"
                  style={{ height: `${Math.max(0, 100 - (titrantVolume / 50) * 100)}%` }}
                />
                <span className="absolute -right-14 top-2 text-[10px] font-mono text-muted-foreground">
                  0.1 M NaOH
                </span>
              </div>

              {/* Stopcock valve */}
              <div className="w-8 h-2 bg-foreground/70 my-0.5 rounded" />

              {/* Droplet animation stream */}
              <div className="h-5 w-0.5 bg-primary/40 my-0.5" />

              {/* Erlenmeyer Flask */}
              <div className="w-36 h-36 relative flex flex-col items-center justify-end">
                {/* SVG Flask container */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Flask neck and body */}
                  <polygon
                    points="42,5 58,5 58,25 90,85 10,85 42,25"
                    fill="rgba(120, 120, 120, 0.08)"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-foreground/40"
                  />
                  {/* Liquid Fill */}
                  <polygon
                    points="32,45 68,45 86,83 14,83"
                    fill={flaskColor}
                    className="transition-colors duration-300"
                  />
                </svg>
                <div className="absolute bottom-3 text-center">
                  <span className="text-[10px] font-mono font-bold text-foreground">
                    {va} mL {acidType === "strong" ? "HCl" : "CH₃COOH"}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[12px] font-mono text-muted-foreground">
              Analyte Flask ({indicator})
            </span>
          </div>

          {/* Real-Time Titration Curve Graph */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/10">
              <div className="flex items-center justify-between text-[12px] font-mono text-muted-foreground pb-2">
                <span>Titration Curve (pH vs. Vol NaOH)</span>
                <span className="text-foreground font-bold">
                  Equivalence: {vEquiv.toFixed(1)} mL
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <svg viewBox="0 0 300 190" className="w-full h-48 bg-card rounded-xl border border-border/60">
                {/* Grid Lines */}
                <line x1="30" y1="20" x2="270" y2="20" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="95" x2="270" y2="95" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="170" x2="270" y2="170" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="30" y1="20" x2="30" y2="170" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="150" y1="20" x2="150" y2="170" stroke="currentColor" strokeDasharray="3,3" strokeOpacity="0.3" />

                {/* Y-Axis Labels */}
                <text x="10" y="24" fontSize="9" fill="currentColor" opacity="0.6">14</text>
                <text x="14" y="99" fontSize="9" fill="currentColor" opacity="0.6">7</text>
                <text x="14" y="172" fontSize="9" fill="currentColor" opacity="0.6">0</text>

                {/* X-Axis Labels */}
                <text x="26" y="184" fontSize="9" fill="currentColor" opacity="0.6">0</text>
                <text x="140" y="184" fontSize="9" fill="currentColor" opacity="0.6">25 mL</text>
                <text x="255" y="184" fontSize="9" fill="currentColor" opacity="0.6">50 mL</text>

                {/* Titration Curve Polyline */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  points={curvePoints}
                />

                {/* Current Point Marker */}
                <circle
                  cx={currentDotX}
                  cy={currentDotY}
                  r="5"
                  className="fill-emerald-500 stroke-white stroke-2"
                />
              </svg>
            </div>

            {/* Readouts & Buret Titrant Delivery Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <span className="text-[11px] font-mono text-muted-foreground block">NaOH Added</span>
                <strong className="text-lg font-mono text-foreground">{titrantVolume.toFixed(1)} mL</strong>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <span className="text-[11px] font-mono text-muted-foreground block">Current pH</span>
                <strong className="text-lg font-mono text-foreground">{currentPh.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card col-span-2 sm:col-span-1">
                <span className="text-[11px] font-mono text-muted-foreground block">State</span>
                <strong className="text-[13px] font-semibold text-primary">
                  {titrantVolume < vEquiv
                    ? "Excess Acid"
                    : Math.abs(titrantVolume - vEquiv) < 0.1
                    ? "Equivalence Point"
                    : "Excess Base"}
                </strong>
              </div>
            </div>

            {/* Titrant Delivery Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTitrantVolume((v) => Math.min(50, Number((v + 0.5).toFixed(1))))}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium hover:brightness-105 min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+0.5 mL (Drop)</span>
              </button>

              <button
                type="button"
                onClick={() => setTitrantVolume((v) => Math.min(50, Number((v + 2.0).toFixed(1))))}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-border/80 bg-secondary text-foreground text-[13px] font-medium hover:bg-secondary/70 min-h-[44px]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+2.0 mL</span>
              </button>

              <button
                type="button"
                onClick={() => setTitrantVolume(vEquiv)}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-border/80 bg-secondary text-foreground text-[13px] font-medium hover:bg-secondary/70 min-h-[44px]"
              >
                <span>Jump to Equiv ({vEquiv} mL)</span>
              </button>

              <button
                type="button"
                onClick={() => setTitrantVolume(0)}
                className="p-2.5 rounded-xl border border-border/80 bg-background hover:bg-secondary text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center ml-auto"
                title="Reset titration buret"
                aria-label="Reset titration buret"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
