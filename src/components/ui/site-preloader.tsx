"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Section 32: Reusable route loading messages dictionary
export const ROUTE_LOADING_MESSAGES: Record<
  string,
  { title: string; subtitle?: string }
> = {
  "/": {
    title: "Alok welcomes you.",
    subtitle:
      "A little Chemistry. A little code. A few things worth exploring.",
  },
  "/about": {
    title: "Getting to know the person behind the work.",
    subtitle: "Academic foundation, journey, and technical exploration.",
  },
  "/chemistry": {
    title: "Exploring the science behind the work.",
    subtitle: "Analytical chemistry, instrumentation, and laboratory research.",
  },
  "/projects": {
    title: "Taking a look at what I've built.",
    subtitle: "Applications, research software, and digital experiments.",
  },
  "/apps": {
    title: "Opening the things I've shipped.",
    subtitle: "Practical utility software and mobile tools.",
  },
  "/tools": {
    title: "A few useful things to try.",
    subtitle: "Everyday interactive utilities and focus helpers.",
  },
  "/blog": {
    title: "A few things I've been learning and writing about.",
    subtitle: "Articles on chemistry, technology, and continuous discovery.",
  },
  "/resume": {
    title: "Here's the professional snapshot.",
    subtitle: "Education, core skills, research projects, and milestones.",
  },
  "/contact": {
    title: "Finding a way to get in touch.",
    subtitle:
      "Direct channels for scientific, research, and technical collaboration.",
  },
  "/polls": {
    title: "Community perspectives & feedback.",
    subtitle: "Anonymous voting on tools, features, and chemistry research.",
  },
};

export interface PreloaderContextType {
  showPreloader: (title?: string, subtitle?: string) => void;
  hidePreloader: () => void;
}

const PreloaderContext = React.createContext<PreloaderContextType>({
  showPreloader: () => {},
  hidePreloader: () => {},
});

export function usePreloader() {
  return React.useContext(PreloaderContext);
}

export function SitePreloaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [isRouteTransitioning, setIsRouteTransitioning] = React.useState(false);
  const [customMessage, setCustomMessage] = React.useState<{
    title: string;
    subtitle?: string;
  } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const lastPathnameRef = React.useRef<string | null>(null);
  const hideTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Manual trigger methods for programmatic user inputs
  const showPreloader = React.useCallback(
    (title?: string, subtitle?: string) => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (title) {
        setCustomMessage({ title, subtitle });
      } else {
        setCustomMessage(null);
      }
      setIsRouteTransitioning(true);
    },
    [],
  );

  const hidePreloader = React.useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(
      () => {
        setIsRouteTransitioning(false);
        setCustomMessage(null);
      },
      prefersReducedMotion ? 50 : 220,
    );
  }, [prefersReducedMotion]);

  // Check prefers-reduced-motion
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Initial welcome dismiss (zero artificial delay; brief ~350ms fade-out)
  React.useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      lastPathnameRef.current = pathname;
    }, 380);
    return () => clearTimeout(timer);
  }, [mounted, pathname]);

  // Handle route change completion (when destination page loads and pathname changes)
  React.useEffect(() => {
    if (!mounted || isInitialLoad) return;

    if (lastPathnameRef.current && lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      // Fade out transition overlay once the new route is active
      const timer = setTimeout(
        () => {
          setIsRouteTransitioning(false);
          setCustomMessage(null);
        },
        prefersReducedMotion ? 60 : 250,
      );
      return () => clearTimeout(timer);
    }
  }, [pathname, mounted, isInitialLoad, prefersReducedMotion]);

  // Intercept user link click inputs to trigger preloader immediately BEFORE destination data/route loads
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only handle internal navigation links, avoid hash anchor jumps, external, mailto, tel, downloads
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      // Check if target is internal URL
      let targetPath = href;
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return; // External link
        targetPath = url.pathname;
      } catch {
        return;
      }

      const currentPath = window.location.pathname;
      // If clicking same path without search params changes, skip
      if (targetPath === currentPath) return;

      // Match destination loading message
      const targetMsg =
        ROUTE_LOADING_MESSAGES[targetPath] ||
        (targetPath.startsWith("/tools/")
          ? {
              title: "A few useful things to try.",
              subtitle: "Interactive tools and scientific calculation.",
            }
          : targetPath.startsWith("/projects/")
            ? {
                title: "Taking a look at what I've built.",
                subtitle: "Project overview and technical details.",
              }
            : targetPath.startsWith("/blog/")
              ? {
                  title: "Reading article.",
                  subtitle: "Science, code, and reflections.",
                }
              : targetPath.startsWith("/polls/")
                ? {
                    title: "Community perspectives & feedback.",
                    subtitle: "Anonymous voting on tools and research.",
                  }
                : { title: "Loading content...", subtitle: "Preparing view." });

      setCustomMessage(targetMsg);
      setIsRouteTransitioning(true);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, []);

  const currentPath = pathname || "/";
  const displayedMessage =
    customMessage ||
    ROUTE_LOADING_MESSAGES[currentPath] ||
    (currentPath.startsWith("/tools/")
      ? {
          title: "A few useful things to try.",
          subtitle: "Interactive tools and scientific calculation.",
        }
      : currentPath.startsWith("/projects/")
        ? {
            title: "Taking a look at what I've built.",
            subtitle: "Project overview and technical details.",
          }
        : currentPath.startsWith("/blog/")
          ? {
              title: "Reading article.",
              subtitle: "Science, code, and reflections.",
            }
          : {
              title: "Alok welcomes you.",
              subtitle:
                "A little Chemistry. A little code. A few things worth exploring.",
            });

  const isVisible = mounted && (isInitialLoad || isRouteTransitioning);

  return (
    <PreloaderContext.Provider value={{ showPreloader, hidePreloader }}>
      {/* Visual Overlay */}
      {mounted && (
        <aside
          aria-live="polite"
          aria-atomic="true"
          aria-hidden={!isVisible}
          className={`no-print fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity ${
            prefersReducedMotion ? "duration-100" : "duration-300"
          } ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center text-center px-6 max-w-md mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Logo */}
            <div className="relative h-14 w-14 rounded-full overflow-hidden border border-border/80 bg-foreground/5 p-1.5 shadow-sm">
              <Image
                src="/logo.png"
                alt="Alok Das"
                width={56}
                height={56}
                className="h-full w-full object-contain rounded-full"
                priority
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {displayedMessage.title}
              </h2>
              {displayedMessage.subtitle && (
                <p className="text-sm text-muted-foreground font-normal leading-relaxed">
                  {displayedMessage.subtitle}
                </p>
              )}
            </div>

            {/* Apple HIG Refined Spinner */}
            <div className="flex items-center justify-center pt-2">
              <div
                className={`h-5 w-5 rounded-full border-2 border-primary/20 border-t-primary ${
                  prefersReducedMotion ? "" : "animate-spin"
                }`}
                role="status"
                aria-label="Loading"
              />
            </div>
          </div>
        </aside>
      )}

      {children}
    </PreloaderContext.Provider>
  );
}

// Alias for backward compatibility if imported directly
export function SitePreloader() {
  return null;
}
