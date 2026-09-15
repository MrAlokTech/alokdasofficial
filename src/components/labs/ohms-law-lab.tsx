"use client";

import { useState, useMemo } from "react";
import { Lightbulb } from "lucide-react";

export function OhmsLawLab() {
  const [voltage, setVoltage] = useState(9.0); // Volts
  const [resistance, setResistance] = useState(100.0); // Ohms

  // Current I = V / R (Amperes)
  const currentAmp = voltage / resistance;
  const currentMilliAmp = currentAmp * 1000;

  // Power P = V * I (Watts)
  const powerWatts = voltage * currentAmp;
  const powerMilliWatts = powerWatts * 1000;

  // Visual bulb brightness (0 to 1)
  const brightness = Math.min(1.0, Math.max(0.1, powerWatts / 2.0));

  // Generate V-I line coordinates for voltage 0 to 24 V
  const curvePoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let v = 0; v <= 24; v += 2) {
      const i = (v / resistance) * 1000; // mA
      // Map v [0, 24] -> x [30, 270], i [0, 250 mA] -> y [170, 20]
      const x = 30 + (v / 24) * 240;
      const y = 170 - (Math.min(250, i) / 250) * 150;
      points.push([x, y]);
    }
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }, [resistance]);

  const currentDotX = 30 + (voltage / 24) * 240;
  const currentDotY = 170 - (Math.min(250, currentMilliAmp) / 250) * 150;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Real-time Electrical Readouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Voltage (V)
            </span>
            <strong className="text-xl font-mono text-foreground">
              {voltage.toFixed(1)} V
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Resistance (R)
            </span>
            <strong className="text-xl font-mono text-foreground">
              {resistance.toFixed(0)} Ω
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Current (I)
            </span>
            <strong className="text-xl font-mono text-primary">
              {currentMilliAmp < 1000 ? `${currentMilliAmp.toFixed(1)} mA` : `${currentAmp.toFixed(3)} A`}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Power (P = VI)
            </span>
            <strong className="text-xl font-mono text-foreground">
              {powerWatts < 1.0 ? `${powerMilliWatts.toFixed(0)} mW` : `${powerWatts.toFixed(2)} W`}
            </strong>
          </div>
        </div>

        {/* Experiment Layout: Circuit Visualization + V-I Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Schematic Circuit Animation Graphic */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl border border-border/80 bg-secondary/15 space-y-4">
            <div className="relative w-full max-w-sm h-48 border-2 border-dashed border-foreground/40 rounded-2xl flex items-center justify-between px-6">
              {/* DC Voltage Source (Left) */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-12 h-14 rounded-lg bg-card border-2 border-foreground/70 flex flex-col items-center justify-center font-mono text-[11px] font-bold text-foreground">
                  <span className="text-emerald-600 dark:text-emerald-400">+</span>
                  <span>{voltage}V</span>
                  <span className="text-muted-foreground">-</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">DC Source</span>
              </div>

              {/* Digital Ammeter (Center Top) */}
              <div className="absolute top-0 -translate-y-1/2 inset-x-0 flex justify-center">
                <div className="px-3 py-1 rounded-md bg-card border border-border text-[11px] font-mono font-bold text-primary shadow-sm">
                  Ammeter: {currentMilliAmp.toFixed(1)} mA
                </div>
              </div>

              {/* Resistor / Lightbulb Load (Right) */}
              <div className="flex flex-col items-center space-y-1">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
                  style={{
                    backgroundColor: `rgba(251, 191, 36, ${Math.max(0.15, brightness)})`,
                    boxShadow:
                      brightness > 0.2
                        ? `0 0 ${brightness * 25}px rgba(251, 191, 36, 0.7)`
                        : "none",
                  }}
                >
                  <Lightbulb
                    className="h-7 w-7 text-amber-500 transition-transform"
                    style={{ transform: `scale(${1 + brightness * 0.15})` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  Load ({resistance} Ω)
                </span>
              </div>
            </div>

            <span className="text-[12px] font-mono text-muted-foreground">
              Bulb Glow &middot; Joule Dissipation: {powerWatts.toFixed(2)} W
            </span>
          </div>

          {/* V-I Characteristics Line Graph */}
          <div className="lg:col-span-6 space-y-3">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/10 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-mono text-muted-foreground">
                <span>Ohmic V-I Relationship (I vs V)</span>
                <span className="text-foreground font-semibold">
                  Slope = {(1 / resistance).toFixed(4)} Ω⁻¹
                </span>
              </div>

              <svg viewBox="0 0 300 190" className="w-full h-48 bg-card rounded-xl border border-border/60">
                {/* Grid Lines */}
                <line x1="30" y1="20" x2="270" y2="20" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="95" x2="270" y2="95" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="170" x2="270" y2="170" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="30" y1="20" x2="30" y2="170" stroke="currentColor" strokeOpacity="0.2" />

                {/* Y-Axis (Current 0 to 250 mA) */}
                <text x="6" y="24" fontSize="9" fill="currentColor" opacity="0.6">250mA</text>
                <text x="6" y="99" fontSize="9" fill="currentColor" opacity="0.6">125mA</text>
                <text x="14" y="172" fontSize="9" fill="currentColor" opacity="0.6">0</text>

                {/* X-Axis (Voltage 0 to 24 V) */}
                <text x="26" y="184" fontSize="9" fill="currentColor" opacity="0.6">0V</text>
                <text x="144" y="184" fontSize="9" fill="currentColor" opacity="0.6">12V</text>
                <text x="256" y="184" fontSize="9" fill="currentColor" opacity="0.6">24V</text>

                {/* Linear Polyline */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  points={curvePoints}
                />

                {/* Operating Point */}
                <circle
                  cx={currentDotX}
                  cy={currentDotY}
                  r="5"
                  className="fill-amber-500 stroke-white stroke-2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-foreground font-medium">Voltage (V)</span>
              <span className="font-mono font-bold text-foreground">{voltage.toFixed(1)} Volts</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="24.0"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-foreground font-medium">Resistance (R)</span>
              <span className="font-mono font-bold text-foreground">{resistance} Ohms</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(parseInt(e.target.value, 10))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
