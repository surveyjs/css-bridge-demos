"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StyleProvider } from "./StyleProvider";
import { BaseColorProvider } from "./BaseColorProvider";
import { RadiusProvider } from "./RadiusProvider";

/**
 * Client theming runtime. Four independent axes, all applied before paint:
 *  - light/dark via next-themes (`attribute="class"` → `.dark` on <html>)
 *  - visual style via StyleProvider (`data-shadcn-style` on <html>, geometry)
 *  - base color via BaseColorProvider (`data-shadcn-base-color` on <html>, palette)
 *  - radius via RadiusProvider (`data-shadcn-radius` on <html>, corner rounding)
 *
 * The axes are non-overlapping (geometry vs. pure color vs. corner radius), so
 * they compose freely. No SurveyJS-specific code lives here — it's pure host
 * chrome. The Prompt-2 bridge re-themes the survey through these same variables
 * for free.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <StyleProvider>
        <BaseColorProvider>
          <RadiusProvider>{children}</RadiusProvider>
        </BaseColorProvider>
      </StyleProvider>
    </NextThemesProvider>
  );
}
