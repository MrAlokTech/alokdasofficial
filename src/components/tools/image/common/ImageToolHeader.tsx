"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  Zap,
  Maximize2,
  Crop,
  RotateCw,
  RefreshCw,
  Stamp,
  Sparkles,
  FileText,
  Layers,
} from "lucide-react";

interface ImageToolHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

const NAV_ITEMS = [
  { href: "/tools/image", label: "Studio Hub", icon: Layers },
  { href: "/tools/image/compress", label: "Compress", icon: Zap },
  { href: "/tools/image/resize", label: "Resize", icon: Maximize2 },
  { href: "/tools/image/crop", label: "Crop", icon: Crop },
  { href: "/tools/image/rotate", label: "Rotate & Flip", icon: RotateCw },
  { href: "/tools/image/convert", label: "Convert", icon: RefreshCw },
  { href: "/tools/image/watermark", label: "Watermark", icon: Stamp },
  { href: "/tools/image/filters", label: "Filters & LUT", icon: Sparkles },
  { href: "/tools/image/to-pdf", label: "To PDF", icon: FileText },
];

export const ImageToolHeader: React.FC<ImageToolHeaderProps> = ({
  title,
  description,
  badge = "100% Client-Side",
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-5 mb-8">
      {/* Top Bar: Navigation & Privacy */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools Hub</span>
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link
            href="/tools/image"
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Image Studio
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Server Uploads</span>
          </span>
          <Link
            href="/tools/image/privacy"
            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            Privacy
          </Link>
          <span className="text-muted-foreground/40">&bull;</span>
          <Link
            href="/tools/image/terms"
            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Horizontal Nav Bar for Quick Tool Switching */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 min-w-max p-1 bg-secondary/40 border border-border/60 rounded-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border/80 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
