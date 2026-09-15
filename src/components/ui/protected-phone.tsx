"use client";

import * as React from "react";
import { Phone } from "lucide-react";
import { getPhoneFormatted, getPhoneRaw, getPhoneReversed } from "@/lib/contact-obfuscate";
import { cn } from "@/lib/utils";

interface ProtectedPhoneProps {
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  variant?: "default" | "resume";
}

export function ProtectedPhone({
  className,
  showIcon = false,
  iconClassName = "h-3.5 w-3.5 text-muted-foreground flex-shrink-0",
  variant = "default",
}: ProtectedPhoneProps) {
  const [href, setHref] = React.useState<string | undefined>(undefined);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const prepareCall = () => {
    if (!href) {
      setHref(`tel:${getPhoneRaw()}`);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const raw = getPhoneRaw();
    const tel = `tel:${raw}`;
    if (!href) {
      setHref(tel);
    }
    // Explicitly navigate to tel protocol on click/tap
    window.location.href = tel;
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const formatted = getPhoneFormatted();
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", formatted);
    }
  };

  // Reversed text rendered with CSS bidi-override so human eyes read left-to-right effortlessly,
  // while DOM scrapers and bots get reversed / decoy noise.
  const reversed = getPhoneReversed(); // "09809 01019 19+"

  return (
    <a
      href={href || "#call-protected"}
      onClick={handleClick}
      onMouseEnter={prepareCall}
      onTouchStart={prepareCall}
      onFocus={prepareCall}
      onCopy={handleCopy}
      aria-label="Call Alok Das"
      title="Call Alok Das"
      className={cn(
        "cursor-pointer select-text transition-colors",
        variant === "resume"
          ? "flex items-center gap-1.5 hover:text-foreground hover:underline"
          : "font-medium text-foreground hover:underline text-[14px]",
        className
      )}
    >
      {(showIcon || variant === "resume") && (
        <Phone className={iconClassName} aria-hidden="true" />
      )}
      <span
        style={{ unicodeBidi: "bidi-override", direction: "rtl" }}
        className="inline-block"
        aria-hidden="true"
      >
        <span>{reversed.slice(0, 5)}</span>
        <span style={{ display: "none" }} aria-hidden="true">
          bot-trap-9842
        </span>
        <span>{reversed.slice(5, 11)}</span>
        <span style={{ display: "none" }} aria-hidden="true">
          ai-shield
        </span>
        <span>{reversed.slice(11)}</span>
      </span>
      {/* Fallback for screen readers and accessibility */}
      <span className="sr-only">
        {isClient ? getPhoneFormatted() : "Protected Phone"}
      </span>
    </a>
  );
}
