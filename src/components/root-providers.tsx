"use client";

import { NavProgressBar } from "@/components/nav-progress-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NavProgressBar />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
