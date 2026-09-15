"use client";

import { useState, useMemo } from "react";
import { Zap } from "lucide-react";

export function ReactionKineticsLab() {
  const [temperatureCelsius, setTemperatureCelsius] = useState(25.0); // °C
  const [initialConc, setInitialConc] = useState(1.0); // mol/L
  const [baseEa, setBaseEa] = useState(50.0); // kJ/mol
  const [catalystActive, setCatalystActive] = useState(false);

  // Constants
  const R = 8.314; // J/(mol*K)
  const A_pre = 1e7; // Pre-exponential factor s^-1

  // Effective Ea (catalyst reduces activation energy by 20 kJ/mol)
  const effectiveEa = catalystActive ? Math.max(15.0, baseEa - 20.0) : baseEa;
  const tempKelvin = temperatureCelsius + 273.15;

  // Rate constant k = A * exp(-Ea / (R * T))
  const kRate = useMemo(() => {
    const eaJoules = effectiveEa * 1000;
    return A_pre * Math.exp(-eaJoules / (R * tempKelvin));
  }, [effectiveEa, tempKelvin]);

  // Half-life t_1/2 = ln(2) / k
  const halfLifeSeconds = Math.log(2) / kRate;

  // Initial reaction rate r0 = k * [A]0
  const initialRate = kRate * initialConc;

  // Generate concentration vs time curve points for t from 0 to 60 seconds
  const curvePoints = useMemo(() => {
    const points: [number, number][] = [];
    const maxTime = 60; // seconds
    for (let t = 0; t <= maxTime; t += 1) {
      const conc = initialConc * Math.exp(-kRate * t);
      // Map t [0, 60] -> x [30, 270], conc [0, 2.0] -> y [170, 20]
      const x = 30 + (t / maxTime) * 240;
      const y = 170 - (conc / 2.0) * 150;
      points.push([x, y]);
    }
    return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  }, [initialConc, kRate]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Controls & Metrics Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Rate Constant (k)
            </span>
            <strong className="text-lg font-mono text-foreground">
              {kRate < 0.001 ? kRate.toExponential(2) : kRate.toFixed(3)} s⁻¹
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Initial Rate (r₀)
            </span>
            <strong className="text-lg font-mono text-foreground">
              {initialRate < 0.001 ? initialRate.toExponential(2) : initialRate.toFixed(3)} M s⁻¹
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Half-Life (t½)
            </span>
            <strong className="text-lg font-mono text-foreground">
              {halfLifeSeconds > 1000 ? halfLifeSeconds.toExponential(1) : halfLifeSeconds.toFixed(1)} s
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Effective Eₐ
            </span>
            <strong className="text-lg font-mono text-foreground">
              {effectiveEa.toFixed(1)} kJ mol⁻¹
            </strong>
          </div>
        </div>

        {/* Experiment Layout: Controls + Kinetics Curve */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Catalyst Toggle */}
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/30 flex items-center justify-between">
              <div>
                <span className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className={`h-4 w-4 ${catalystActive ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                  <span>Heterogeneous Catalyst</span>
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Lowers activation barrier by 20 kJ mol⁻¹
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCatalystActive(!catalystActive)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-colors min-h-[44px] ${
                  catalystActive
                    ? "bg-amber-500 text-white"
                    : "border border-border/80 bg-background text-foreground"
                }`}
              >
                {catalystActive ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Temperature (T)</span>
                  <span className="font-mono font-bold text-foreground">
                    {temperatureCelsius}°C ({tempKelvin.toFixed(1)} K)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={temperatureCelsius}
                  onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Initial Concentration [A]₀</span>
                  <span className="font-mono font-bold text-foreground">
                    {initialConc.toFixed(1)} mol L⁻¹
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={initialConc}
                  onChange={(e) => setInitialConc(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[13px]">
                  <span className="text-foreground font-medium">Uncatalyzed Activation Energy (Eₐ)</span>
                  <span className="font-mono font-bold text-foreground">{baseEa} kJ mol⁻¹</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="80"
                  step="5"
                  value={baseEa}
                  onChange={(e) => setBaseEa(parseInt(e.target.value, 10))}
                  className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Concentration vs Time Plot */}
          <div className="lg:col-span-7 space-y-2">
            <div className="p-4 rounded-2xl border border-border/80 bg-secondary/10 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-mono text-muted-foreground">
                <span>Concentration Decay Curve ([A] vs t)</span>
                <span className="text-foreground font-semibold">1st Order Kinetics</span>
              </div>

              <svg viewBox="0 0 300 190" className="w-full h-52 bg-card rounded-xl border border-border/60">
                {/* Grid Lines */}
                <line x1="30" y1="20" x2="270" y2="20" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="95" x2="270" y2="95" stroke="currentColor" strokeOpacity="0.1" />
                <line x1="30" y1="170" x2="270" y2="170" stroke="currentColor" strokeOpacity="0.2" />
                <line x1="30" y1="20" x2="30" y2="170" stroke="currentColor" strokeOpacity="0.2" />

                {/* Y-Axis Labels ([A] 0 to 2.0 mol/L) */}
                <text x="10" y="24" fontSize="9" fill="currentColor" opacity="0.6">2.0</text>
                <text x="10" y="99" fontSize="9" fill="currentColor" opacity="0.6">1.0</text>
                <text x="14" y="172" fontSize="9" fill="currentColor" opacity="0.6">0</text>

                {/* X-Axis Labels (Time 0 to 60 s) */}
                <text x="26" y="184" fontSize="9" fill="currentColor" opacity="0.6">0</text>
                <text x="142" y="184" fontSize="9" fill="currentColor" opacity="0.6">30 s</text>
                <text x="256" y="184" fontSize="9" fill="currentColor" opacity="0.6">60 s</text>

                {/* Kinetics Curve Polyline */}
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  points={curvePoints}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
