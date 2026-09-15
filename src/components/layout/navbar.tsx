"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { personalData } from "@/data/personal";
import { cn } from "@/lib/utils";
import { usePomodoro } from "@/context/pomodoro-context";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];

function PomodoroNavBadge() {
  const { isRunning, formattedTime, mode } = usePomodoro();

  if (!isRunning) return null;

  return (
    <Link
      href="/tools/pomodoro"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 transition-all min-h-[32px] shrink-0"
      title={`Pomodoro ${mode === "focus" ? "Focus" : "Break"} active — click to view timer`}
      aria-label={`Pomodoro timer active, ${formattedTime} remaining`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="tabular-nums font-semibold">{formattedTime}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "no-print sticky top-0 z-50 w-full transition-all duration-200 h-16 flex items-center",
          scrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            : "bg-background/90 backdrop-blur-lg border-b border-border/50",
        )}
      >
        <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] min-w-0 shrink"
            aria-label="Alok Das — Home"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-border/80 bg-foreground/5 p-0.5 group-hover:border-primary/50 transition-colors">
              <Image
                src="/logo.png"
                alt={personalData.name}
                width={32}
                height={32}
                className="h-full w-full object-cover rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] sm:text-[15px] font-semibold tracking-tight text-foreground whitespace-nowrap">
                {personalData.name}
              </span>
              <span className="text-[11px] font-normal text-muted-foreground leading-none whitespace-nowrap">
                Chemistry &middot; Research
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-secondary/40 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/50"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-150 min-h-[34px] flex items-center gap-1.5",
                    isActive
                      ? "text-foreground bg-background shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <PomodoroNavBadge />
            <ThemeToggle />
            <Link
              href="/resume"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-medium text-primary-foreground shadow-sm hover:brightness-105 active:brightness-95 transition-all min-h-[36px]"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Resume</span>
            </Link>
          </div>

          {/* Mobile menu, timer badge and theme toggle */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <PomodoroNavBadge />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border/70 bg-card text-foreground active:scale-95 transition-transform"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Liquid Glass Sheet Drawer (Decoupled from header backdrop-filter stacking context) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-background/98 backdrop-blur-2xl border-t border-border/80 flex flex-col justify-between p-5 sm:p-6 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200"
          style={{ height: "calc(100dvh - 4rem)" }}
        >
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between min-h-[48px] px-4 rounded-xl text-[15px] font-medium transition-colors",
                pathname === "/"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
              )}
            >
              <span>Home</span>
            </Link>
            {NAV_LINKS.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between min-h-[48px] px-4 rounded-xl text-[15px] font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                  )}
                >
                  <span className="flex items-center gap-2">{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/60" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-border/60 space-y-3 mt-4">
            <Link
              href="/resume"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl bg-primary text-primary-foreground font-medium text-[14px] shadow-sm active:scale-[0.99]"
            >
              <FileText className="h-4 w-4" />
              <span>View Resume (Print Ready)</span>
            </Link>
            <p className="text-center text-[12px] text-muted-foreground pt-1">
              {personalData.location.full}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
