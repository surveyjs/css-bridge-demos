"use client";

import { createTheme, type CssVarsThemeOptions } from "@mui/material/styles";
import { palettes, type PalettePreset, type SchemeMode } from "./palettes";

/**
 * The single MUI theme for the whole shell.
 *
 * `cssVariables: true` is MANDATORY and load-bearing: it makes MUI emit its
 * tokens (`--mui-palette-*`, `--mui-shape-*`, `--mui-shadows-*`, …) as real CSS
 * custom properties on the document. The shell renders from those today, and the
 * eventual SurveyJS CSS bridge maps onto the exact same variables — so the form
 * will re-theme for free when the chrome does. (Validated in the Prompt 0 spike.)
 *
 * `colorSchemeSelector: "class"` pairs with `<InitColorSchemeScript attribute="class">`
 * so the persisted scheme is applied to <html> before paint (no flash).
 *
 * Every palette preset contributes a light + dark color scheme; the light/dark
 * toggle and the palette menu compose by selecting which scheme pair is active.
 */

/**
 * Build a COMPLETE palette (background, text, divider, action, …) from just a
 * primary + secondary. createTheme's `cssVariables` mode only auto-fills the
 * built-in `light` / `dark` schemes — arbitrary custom-named schemes
 * (`teal-dark`, …) keep exactly the palette they're given, so we augment each
 * one here by round-tripping through a plain (non-vars) theme.
 */
function fullPalette(mode: SchemeMode, primary: string, secondary: string) {
  return createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: secondary },
    },
  }).palette;
}

const colorSchemes = Object.fromEntries(
  palettes.flatMap((p: PalettePreset) =>
    (["light", "dark"] as SchemeMode[]).map((mode) => {
      const key = mode === "light" ? p.lightKey : p.darkKey;
      const tones = p[mode];
      return [key, { palette: fullPalette(mode, tones.primary, tones.secondary) }];
    }),
  ),
) as unknown as CssVarsThemeOptions["colorSchemes"];

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes,
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "Roboto, system-ui, -apple-system, Segoe UI, sans-serif",
    h1: { fontSize: "2rem", fontWeight: 600 },
  },
});
