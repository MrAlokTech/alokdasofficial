"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initClarity, setClarityTag } from "@/lib/clarity";

/**
 * ClarityProvider mounts in RootLayout to ensure Microsoft Clarity
 * is initialized site-wide and captures all current and future routes.
 */
export function ClarityProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initClarity();
  }, []);

  useEffect(() => {
    if (pathname) {
      setClarityTag("page_path", pathname);
    }
  }, [pathname]);

  return null;
}
