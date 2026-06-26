"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { StyleProvider } from "./StyleProvider";
import { BaseColorProvider } from "./BaseColorProvider";
import { ThemeColorProvider } from "./ThemeColorProvider";
import { RadiusProvider } from "./RadiusProvider";
import { ShadcnSurveyAdapterStyles } from "./ShadcnSurveyAdapterStyles";

/**
 * Client theming runtime. Five independent axes, all applied before paint:
 *  - light/dark via next-themes (`attribute="class"` → `.dark` on <html>)
 *  - visual style via StyleProvider (`data-shadcn-style` on <html>, geometry)
 *  - base color via BaseColorProvider (`data-shadcn-base-color` on <html>, neutral palette)
 *  - theme (accent) via ThemeColorProvider (`data-shadcn-theme` on <html>, --primary/--ring hue)
 *  - radius via RadiusProvider (`data-shadcn-radius` on <html>, corner rounding)
 *
 * The axes are non-overlapping (geometry vs. neutral surfaces vs. accent hue vs.
 * corner radius), so they compose freely. No SurveyJS-specific code lives here —
 * it's pure host chrome. The Prompt-2 bridge re-themes the survey through these
 * same variables for free.
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
        <ShadcnSurveyAdapterStyles />
        <BaseColorProvider>
          <ThemeColorProvider>
            <RadiusProvider>{children}</RadiusProvider>
          </ThemeColorProvider>
        </BaseColorProvider>
      </StyleProvider>
    </NextThemesProvider>
  );
}
