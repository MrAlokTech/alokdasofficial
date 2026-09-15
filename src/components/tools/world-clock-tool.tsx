"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus, Trash2, Globe } from "lucide-react";
import { CityZone, INITIAL_CITIES, AVAILABLE_CITIES } from "@/data/tools";

export function WorldClockTool() {
  const [cities, setCities] = useState<CityZone[]>(INITIAL_CITIES);
  const [use24Hour, setUse24Hour] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedCityId, setSelectedCityId] = useState("");

  // Synchronize live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load / save selected cities in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("alokdas_world_clock_cities");
      if (saved) {
        setCities(JSON.parse(saved));
      }
      const savedFormat = localStorage.getItem("alokdas_world_clock_format");
      if (savedFormat) {
        setUse24Hour(savedFormat === "24h");
      }
    } catch {}
  }, []);

  const handleToggleFormat = () => {
    const next = !use24Hour;
    setUse24Hour(next);
    try {
      localStorage.setItem("alokdas_world_clock_format", next ? "24h" : "12h");
    } catch {}
  };

  const handleAddCity = (cityId: string) => {
    if (!cityId) return;
    const cityToAdd = AVAILABLE_CITIES.find((c) => c.id === cityId);
    if (!cityToAdd) return;
    if (cities.some((c) => c.id === cityToAdd.id)) return;

    const nextList = [...cities, cityToAdd];
    setCities(nextList);
    try {
      localStorage.setItem("alokdas_world_clock_cities", JSON.stringify(nextList));
    } catch {}
    setSelectedCityId("");
  };

  const handleRemoveCity = (id: string) => {
    if (cities.length <= 1) return; // Keep at least one city
    const nextList = cities.filter((c) => c.id !== id);
    setCities(nextList);
    try {
      localStorage.setItem("alokdas_world_clock_cities", JSON.stringify(nextList));
    } catch {}
  };

  // Helper to format time for a specific timeZone
  const getTimeString = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !use24Hour,
      }).format(currentTime);
    } catch {
      return "--:--:--";
    }
  };

  // Helper to format date
  const getDateString = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(currentTime);
    } catch {
      return "";
    }
  };

  // Helper to check if it's daytime (6 AM to 6 PM) in the target timeZone
  const isDaytime = (timeZone: string) => {
    try {
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      }).format(currentTime);
      const hour = parseInt(hourStr, 10);
      return hour >= 6 && hour < 18;
    } catch {
      return true;
    }
  };

  // Helper to get UTC offset label
  const getOffsetString = (timeZone: string) => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "shortOffset",
      }).formatToParts(currentTime);
      const tzPart = parts.find((p) => p.type === "timeZoneName");
      return tzPart ? tzPart.value : timeZone;
    } catch {
      return timeZone;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md">
        {/* Add City Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCityId}
            onChange={(e) => handleAddCity(e.target.value)}
            className="rounded-xl border border-border/80 bg-background px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          >
            <option value="">+ Add another metropolitan city...</option>
            {AVAILABLE_CITIES.filter((ac) => !cities.some((c) => c.id === ac.id)).map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}, {city.country}
              </option>
            ))}
          </select>
        </div>

        {/* 12h / 24h Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-mono text-muted-foreground">Display:</span>
          <button
            type="button"
            onClick={handleToggleFormat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/80 bg-background hover:bg-secondary text-[13px] font-mono font-medium text-foreground transition-colors min-h-[44px]"
          >
            <span>{use24Hour ? "24-Hour (Military)" : "12-Hour (AM/PM)"}</span>
          </button>
        </div>
      </div>

      {/* Responsive World Clock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cities.map((city) => {
          const day = isDaytime(city.timeZone);
          const time = getTimeString(city.timeZone);
          const date = getDateString(city.timeZone);
          const offset = getOffsetString(city.timeZone);

          return (
            <div
              key={city.id}
              className="rounded-2xl border border-border/80 bg-card p-5 flex flex-col justify-between space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-border transition-colors relative group"
            >
              <div className="space-y-2">
                {/* Header: City, Country, and Day/Night indicator */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[17px] font-bold text-foreground leading-tight">
                      {city.name}
                    </h3>
                    <p className="text-[12px] text-muted-foreground">{city.country}</p>
                  </div>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      day
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    }`}
                    title={day ? "Daytime (06:00 - 18:00)" : "Nighttime (18:00 - 06:00)"}
                  >
                    {day ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </div>
                </div>

                {/* Big Live Digital Clock Display */}
                <div className="py-2">
                  <div className="text-3xl font-mono font-bold tracking-tight text-foreground">
                    {time}
                  </div>
                  <div className="text-[12px] font-medium text-muted-foreground pt-0.5">
                    {date}
                  </div>
                </div>
              </div>

              {/* Footer: Offset & Remove Action */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="truncate max-w-[140px]">{offset}</span>
                {cities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(city.id)}
                    className="opacity-60 group-hover:opacity-100 hover:text-red-500 p-1 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-end"
                    title={`Remove ${city.name}`}
                    aria-label={`Remove ${city.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
