"use client";
import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider(props: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted && <NextThemeProvider {...props} />;
}
