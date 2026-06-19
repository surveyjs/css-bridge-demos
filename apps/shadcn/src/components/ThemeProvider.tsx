"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StyleProvider } from "./StyleProvider";

/**
 * Client theming runtime. Two independent axes, both applied before paint:
 *  - light/dark via next-themes (`attribute="class"` → `.dark` on <html>)
 *  - visual style via StyleProvider (`data-shadcn-style` on <html>)
 *
 * No SurveyJS-specific code lives here — it's pure host chrome. The Prompt-2
 * bridge re-themes the survey through these same variables for free.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <StyleProvider>{children}</StyleProvider>
    </NextThemesProvider>
  );
}
