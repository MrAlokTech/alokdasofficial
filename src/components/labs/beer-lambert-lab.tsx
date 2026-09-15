"use client";

import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";

export function BeerLambertLab() {
  const [concentrationMm, setConcentrationMm] = useState(0.05); // mmol/L (0.00005 mol/L)
  const [pathLengthCm, setPathLengthCm] = useState(1.0); // cm
  const [molarAbsorptivity, setMolarAbsorptivity] = useState(15000); // L/(mol*cm)

  // Calculations:
  // c in mol/L = concentrationMm / 1000
  const cMolar = concentrationMm / 1000;
  const absorbance = molarAbsorptivity * cMolar * pathLengthCm;
  // Transmittance T = 10^(-A)
  const transmittanceRatio = Math.pow(10, -absorbance);
  const transmittancePercent = Math.max(0, Math.min(100, transmittanceRatio * 100));

  // Visual opacity of solution in cuvette (higher concentration = deeper blue)
  const solutionOpacity = Math.min(0.95, Math.max(0.1, (concentrationMm / 0.15) * 0.8));

  // Calibration curve coordinates (0 to 0.15 mmol/L)
  const curvePoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let c = 0; c <= 0.15; c += 0.01) {
      const a = molarAbsorptivity * (c / 1000) * pathLengthCm;
      // Map c [0, 0.15] -> x [30, 270], a [0, 2.5] -> y [170, 20]
      const x = 30 + (c / 0.15) * 240;
      const y = 170 - (Math.min(2.5, a) / 2.5) * 150;
      points.push([x, y]);
    }
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }, [molarAbsorptivity, pathLengthCm]);

  const currentMarkerX = 30 + (Math.min(0.15, concentrationMm) / 0.15) * 240;
  const currentMarkerY = 170 - (Math.min(2.5, absorbance) / 2.5) * 150;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Spectrophotometer Visual Stage */}
        <div className="p-6 rounded-2xl border border-border/80 bg-secondary/15 flex flex-col items-center justify-center space-y-6">
          <div className="text-[12px] font-mono text-muted-foreground uppercase tracking-wider">
            Double-Beam Optical Chamber Simulation
          </div>

          <div className="relative w-full max-w-xl h-44 flex items-center justify-between px-6 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-inner">
            {/* Light Source */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                <div className="w-4 h-4 rounded-full bg-amber-400" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Source (I₀)</span>
            </div>

            {/* Incident Light Beam (Full Brightness) */}
            <div className="flex-1 h-2 bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] mx-2" />

            {/* Cuvette Optical Cell */}
            <div
              className="border-2 border-foreground/50 rounded-lg relative flex flex-col justify-end p-1 transition-all duration-300"
              style={{
                width: `${Math.max(40, pathLengthCm * 45)}px`,
                height: "110px",
              }}
            >
              {/* Absorbing Solution */}
              <div
                className="w-full h-full rounded bg-cyan-600 dark:bg-cyan-500 transition-opacity duration-300"
                style={{ opacity: solutionOpacity }}
              />
              <span className="absolute -bottom-6 inset-x-0 text-center text-[10px] font-mono text-muted-foreground">
                l = {pathLengthCm.toFixed(1)} cm
              </span>
            </div>

            {/* Transmitted Light Beam (Attenuated based on transmittance) */}
            <div
              className="flex-1 h-2 bg-amber-300 mx-2 transition-all duration-300"
              style={{
                opacity: Math.max(0.05, transmittanceRatio),
                boxShadow:
                  transmittanceRatio > 0.1
                    ? `0 0 ${transmittanceRatio * 10}px rgba(251,191,36,0.6)`
                    : "none",
              }}
            />

            {/* Photodetector */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-14 rounded-lg bg-secondary border border-border flex items-center justify-center font-mono text-[10px] font-bold text-foreground">
                DET
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Sensor (I)</span>
            </div>
          </div>
        </div>

        {/* Readouts & Live Linear Calibration Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Readout Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/30 space-y-1">
              <span className="text-[11px] font-mono uppercase text-muted-foreground">
                Optical Absorbance (A)
              </span>
              <div className="text-4xl font-mono font-extrabold text-foreground">
                {absorbance.toFixed(3)}
              </div>
              <p className="text-[12px] text-muted-foreground">
                Dimensionless optical density
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <span className="text-[11px] font-mono text-muted-foreground block">
                  Transmittance (T%)
                </span>
                <strong className="text-lg font-mono text-foreground">
                  {transmittancePercent.toFixed(1)}%
                </strong>
              </div>
              <div className="p-3 rounded-xl border border-border/70 bg-card">
                <span className="text-[11px] font-mono text-muted-foreground block">
                  Path Length
                </span>
                <strong className="text-lg font-mono text-foreground">
                  {pathLengthCm.toFixed(1)} cm
                </strong>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Solute Concentration (c)</span>
                  <span className="font-mono font-bold text-foreground">
                    {concentrationMm.toFixed(3)} mmol L⁻¹
                  </span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.15"
                  step="0.005"
                  value={concentrationMm}
                  onChange={(e) => setConcentrationMm(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Cuvette Path Length (l)</span>
                  <span className="font-mono font-bold text-foreground">{pathLengthCm.toFixed(1)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={pathLengthCm}
                  onChange={(e) => setPathLengthCm(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Molar Absorptivity (ε)</span>
                  <span className="font-mono font-bold text-foreground">
                    {molarAbsorptivity.toLocaleString()} L mol⁻¹ cm⁻¹
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="40000"
                  step="1000"
                  value={molarAbsorptivity}
                  onChange={(e) => setMolarAbsorptivity(parseInt(e.target.value, 10))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Linear Calibration Plot (A vs c) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/10 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-mono text-muted-foreground">
                <span>Beer-Lambert Calibration Line (A vs c)</span>
                <span className="text-foreground font-semibold">
                  Slope = {(molarAbsorptivity * pathLengthCm).toLocaleString()}
                </span>
              </div>

              <svg viewBox="0 0 300 190" className="w-full h-52 bg-card rounded-xl border border-border/60">
                {/* Grid Lines */}
                <line x1="30" y1="20" x2="270" y2="20" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="95" x2="270" y2="95" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="170" x2="270" y2="170" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="30" y1="20" x2="30" y2="170" stroke="currentColor" strokeOpacity="0.2" />

                {/* Y-Axis Labels (Absorbance 0 to 2.5) */}
                <text x="10" y="24" fontSize="9" fill="currentColor" opacity="0.6">2.5</text>
                <text x="10" y="99" fontSize="9" fill="currentColor" opacity="0.6">1.25</text>
                <text x="14" y="172" fontSize="9" fill="currentColor" opacity="0.6">0</text>

                {/* X-Axis Labels (Concentration 0 to 0.15 mM) */}
                <text x="26" y="184" fontSize="9" fill="currentColor" opacity="0.6">0</text>
                <text x="135" y="184" fontSize="9" fill="currentColor" opacity="0.6">0.075 mM</text>
                <text x="245" y="184" fontSize="9" fill="currentColor" opacity="0.6">0.15 mM</text>

                {/* Linear Polyline */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  points={curvePoints}
                />

                {/* Current Data Point */}
                <circle
                  cx={currentMarkerX}
                  cy={currentMarkerY}
                  r="5.5"
                  className="fill-cyan-500 stroke-white stroke-2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
