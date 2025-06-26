"use client";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "./theme-provider";

/**
 * Providers component that wraps the application with necessary providers
 * @param param0
 * @returns
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CookiesProvider>
          {children}
      </CookiesProvider>
    </ThemeProvider>
  );
}
