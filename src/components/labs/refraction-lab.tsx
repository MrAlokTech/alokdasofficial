"use client";

import { useState, useMemo } from "react";

interface MediumOption {
  name: string;
  n: number;
}

const MEDIA: MediumOption[] = [
  { name: "Air (Vacuum)", n: 1.0 },
  { name: "Water (20°C)", n: 1.333 },
  { name: "Crown Glass", n: 1.52 },
  { name: "Diamond", n: 2.417 },
];

export function RefractionLab() {
  const [medium1Index, setMedium1Index] = useState(0); // default Air
  const [medium2Index, setMedium2Index] = useState(1); // default Water
  const [incidentAngleDeg, setIncidentAngleDeg] = useState(30); // degrees

  const m1 = MEDIA[medium1Index];
  const m2 = MEDIA[medium2Index];

  // Calculations: Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const theta1Rad = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);

  // Critical angle for total internal reflection: sin(theta_c) = n2 / n1 (if n1 > n2)
  const criticalAngleDeg =
    m1.n > m2.n ? (Math.asin(m2.n / m1.n) * 180) / Math.PI : null;

  const isTotalInternalReflection =
    criticalAngleDeg !== null && incidentAngleDeg > criticalAngleDeg;

  // Refracted angle theta2
  const sinTheta2 = (m1.n * sinTheta1) / m2.n;
  const refractedAngleDeg =
    isTotalInternalReflection || sinTheta2 > 1.0
      ? null
      : (Math.asin(sinTheta2) * 180) / Math.PI;

  // Ray Tracing SVG Coordinates (Center is x=150, y=100)
  const rayLength = 90;

  // Incident ray: coming from upper left toward (150, 100)
  // Angle with normal (vertical axis).
  const incidentX = 150 - rayLength * Math.sin(theta1Rad);
  const incidentY = 100 - rayLength * Math.cos(theta1Rad);

  // Reflected ray: bounces off boundary into upper right
  const reflectedX = 150 + rayLength * Math.sin(theta1Rad);
  const reflectedY = 100 - rayLength * Math.cos(theta1Rad);

  // Refracted ray: passes through into lower right
  const theta2Rad =
    refractedAngleDeg !== null ? (refractedAngleDeg * Math.PI) / 180 : 0;
  const refractedX = 150 + rayLength * Math.sin(theta2Rad);
  const refractedY = 100 + rayLength * Math.cos(theta2Rad);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* Readouts Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Incident Angle (θ₁)
            </span>
            <strong className="text-xl font-mono text-foreground">
              {incidentAngleDeg.toFixed(1)}°
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Refracted Angle (θ₂)
            </span>
            <strong className="text-xl font-mono text-primary">
              {refractedAngleDeg !== null ? `${refractedAngleDeg.toFixed(1)}°` : "None (TIR)"}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Critical Angle (θ_c)
            </span>
            <strong className="text-xl font-mono text-foreground">
              {criticalAngleDeg !== null ? `${criticalAngleDeg.toFixed(1)}°` : "N/A (n₁ ≤ n₂)"}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl border border-border/70 bg-card space-y-0.5">
            <span className="text-[11px] font-mono text-muted-foreground block">
              Optical Regime
            </span>
            <strong
              className={`text-[13px] font-semibold ${
                isTotalInternalReflection
                  ? "text-amber-500"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isTotalInternalReflection ? "Total Internal Reflection" : "Refraction & Transmission"}
            </strong>
          </div>
        </div>

        {/* Ray-Tracing Visual Canvas */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/80 bg-secondary/15 space-y-4">
          <div className="relative w-full max-w-lg h-56 bg-card rounded-2xl border border-border/60 overflow-hidden shadow-inner">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              {/* Medium 1 (Upper Half) */}
              <rect x="0" y="0" width="300" height="100" fill="rgba(14, 165, 233, 0.04)" />
              <text x="12" y="24" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.6">
                Medium 1: {m1.name} (n = {m1.n})
              </text>

              {/* Medium 2 (Lower Half) */}
              <rect x="0" y="100" width="300" height="100" fill="rgba(14, 165, 233, 0.12)" />
              <text x="12" y="184" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.6">
                Medium 2: {m2.name} (n = {m2.n})
              </text>

              {/* Dielectric Boundary Line */}
              <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />

              {/* Normal Line (Perpendicular) */}
              <line
                x1="150"
                y1="10"
                x2="150"
                y2="190"
                stroke="currentColor"
                strokeDasharray="4,4"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
              <text x="154" y="20" fontSize="9" fontFamily="monospace" fill="currentColor" opacity="0.5">
                Normal
              </text>

              {/* Incident Laser Ray (Red/Amber) */}
              <line
                x1={incidentX}
                y1={incidentY}
                x2="150"
                y2="100"
                stroke="#f43f5e"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Reflected Ray */}
              <line
                x1="150"
                y1="100"
                x2={reflectedX}
                y2={reflectedY}
                stroke="#f43f5e"
                strokeWidth={isTotalInternalReflection ? "3" : "1.5"}
                strokeOpacity={isTotalInternalReflection ? "1" : "0.4"}
                strokeLinecap="round"
              />

              {/* Refracted Ray (if not TIR) */}
              {!isTotalInternalReflection && refractedAngleDeg !== null && (
                <line
                  x1="150"
                  y1="100"
                  x2={refractedX}
                  y2={refractedY}
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Incident Point Dot */}
              <circle cx="150" cy="100" r="4" fill="#f43f5e" />
            </svg>
          </div>
          <span className="text-[12px] font-mono text-muted-foreground">
            Ray Optics Diagram &middot; Incident (Red), Reflected, and Refracted (Cyan)
          </span>
        </div>

        {/* Media Selectors and Incident Angle Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <label className="text-[12px] font-mono text-muted-foreground uppercase block">
              Medium 1 (Incident)
            </label>
            <select
              value={medium1Index}
              onChange={(e) => setMedium1Index(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-[13px] text-foreground focus:outline-none min-h-[44px]"
            >
              {MEDIA.map((m, idx) => (
                <option key={m.name} value={idx}>
                  {m.name} (n = {m.n})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-mono text-muted-foreground uppercase block">
              Medium 2 (Refracting)
            </label>
            <select
              value={medium2Index}
              onChange={(e) => setMedium2Index(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-[13px] text-foreground focus:outline-none min-h-[44px]"
            >
              {MEDIA.map((m, idx) => (
                <option key={m.name} value={idx}>
                  {m.name} (n = {m.n})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-foreground font-medium">Incident Angle (θ₁)</span>
              <span className="font-mono font-bold text-foreground">{incidentAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="85"
              step="1"
              value={incidentAngleDeg}
              onChange={(e) => setIncidentAngleDeg(parseInt(e.target.value, 10))}
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
