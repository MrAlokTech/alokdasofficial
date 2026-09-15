"use client";

import { useState } from "react";
import { Droplet, RotateCcw } from "lucide-react";

interface PresetSolution {
  name: string;
  ph: number;
  category: "Acidic" | "Neutral" | "Basic";
}

const PRESETS: PresetSolution[] = [
  { name: "Gastric Juice", ph: 1.5, category: "Acidic" },
  { name: "Lemon Juice", ph: 2.3, category: "Acidic" },
  { name: "Black Coffee", ph: 5.0, category: "Acidic" },
  { name: "Pure Water (25°C)", ph: 7.0, category: "Neutral" },
  { name: "Human Blood", ph: 7.4, category: "Basic" },
  { name: "Baking Soda Sol.", ph: 8.5, category: "Basic" },
  { name: "Household Ammonia", ph: 11.5, category: "Basic" },
  { name: "Bleach Solution", ph: 13.0, category: "Basic" },
];

export function PhScaleLab() {
  const [phValue, setPhValue] = useState(7.0);
  const [dilutionWaterMl, setDilutionWaterMl] = useState(0);

  // Dilution physics: adding pure water (pH 7) pulls pH toward 7.0
  const effectivePh =
    dilutionWaterMl === 0
      ? phValue
      : Number((phValue + (7.0 - phValue) * (dilutionWaterMl / 1000)).toFixed(2));

  const hPlus = Math.pow(10, -effectivePh);
  const pohValue = Number((14.0 - effectivePh).toFixed(2));
  const ohMinus = Math.pow(10, -pohValue);

  // Universal indicator color gradient interpolator
  const getPhColor = (ph: number) => {
    if (ph <= 2) return "rgb(239, 68, 68)"; // red
    if (ph <= 4) return "rgb(249, 115, 22)"; // orange
    if (ph <= 6) return "rgb(234, 179, 8)"; // yellow
    if (ph <= 7.5) return "rgb(34, 197, 94)"; // green (neutral)
    if (ph <= 9) return "rgb(14, 165, 233)"; // light blue
    if (ph <= 11) return "rgb(59, 130, 246)"; // deep blue
    return "rgb(147, 51, 234)"; // purple
  };

  const currentColor = getPhColor(effectivePh);

  return (
    <div className="space-y-6">
      {/* Simulation Workspace Container */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Solution Presets Bar */}
        <div className="space-y-2">
          <label className="text-[12px] font-mono text-muted-foreground uppercase tracking-wider block">
            Select Standard Solution Preset:
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setPhValue(preset.ph);
                  setDilutionWaterMl(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all min-h-[44px] ${
                  phValue === preset.ph && dilutionWaterMl === 0
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "border border-border/70 bg-secondary/40 text-foreground hover:bg-secondary"
                }`}
              >
                {preset.name} (pH {preset.ph})
              </button>
            ))}
          </div>
        </div>

        {/* Dual Interactive Display: Beaker Graphic & Live Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Dynamic SVG Beaker with Universal Indicator Color */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-foreground/30 rounded-b-3xl bg-secondary/10 overflow-hidden flex flex-col justify-end p-2 shadow-inner">
              {/* Fluid Volume */}
              <div
                className="w-full rounded-b-2xl transition-all duration-300 relative"
                style={{
                  height: `${Math.min(92, 50 + (dilutionWaterMl / 1000) * 40)}%`,
                  backgroundColor: currentColor,
                  opacity: 0.85,
                }}
              >
                {/* Surface reflection line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
              </div>

              {/* Beaker graduation measurement markings */}
              <div className="absolute left-2 inset-y-4 flex flex-col justify-between text-[9px] font-mono text-muted-foreground/60 select-none">
                <span>500 mL</span>
                <span>400 mL</span>
                <span>300 mL</span>
                <span>200 mL</span>
                <span>100 mL</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[12px] font-mono text-muted-foreground">
                Universal Indicator Color
              </span>
            </div>
          </div>

          {/* Right: Live Computational Readouts */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-border/80 bg-secondary/30 space-y-1">
                <span className="text-[11px] font-mono uppercase text-muted-foreground">
                  Measured pH
                </span>
                <div className="text-4xl font-mono font-extrabold text-foreground">
                  {effectivePh.toFixed(2)}
                </div>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: currentColor }}
                >
                  {effectivePh < 7 ? "Acidic" : effectivePh === 7 ? "Neutral" : "Basic / Alkaline"}
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-border/80 bg-secondary/30 space-y-1">
                <span className="text-[11px] font-mono uppercase text-muted-foreground">
                  Calculated pOH
                </span>
                <div className="text-4xl font-mono font-extrabold text-foreground">
                  {pohValue.toFixed(2)}
                </div>
                <span className="text-[12px] text-muted-foreground font-mono">
                  pH + pOH = 14.00
                </span>
              </div>
            </div>

            {/* Scientific Ion Concentrations */}
            <div className="space-y-3 p-4 rounded-2xl border border-border/80 bg-card">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Hydronium [H₃O⁺]:</span>
                <span className="font-mono font-bold text-foreground">
                  {hPlus.toExponential(2)} mol L⁻¹
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] border-t border-border/50 pt-2">
                <span className="text-muted-foreground">Hydroxide [OH⁻]:</span>
                <span className="font-mono font-bold text-foreground">
                  {ohMinus.toExponential(2)} mol L⁻¹
                </span>
              </div>
            </div>

            {/* Sliders: Manual pH & Distilled Water Dilution */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Adjust Solution pH</span>
                  <span className="font-mono font-bold text-foreground">{phValue.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={phValue}
                  onChange={(e) => setPhValue(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5 text-sky-500" />
                    <span>Add Distilled Water (Dilution Effect)</span>
                  </span>
                  <span className="font-mono font-bold text-foreground">+{dilutionWaterMl} mL</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={dilutionWaterMl}
                  onChange={(e) => setDilutionWaterMl(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
