"use client";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "./auth-context";
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
        <SessionProvider basePath="/auth">
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </CookiesProvider>
    </ThemeProvider>
  );
}
