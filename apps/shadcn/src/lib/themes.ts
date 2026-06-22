/**
 * Theme (accent) registry — the FOURTH, independent shadcn theming axis (the
 * chromatic "themes" from shadcn's customizer; see https://ui.shadcn.com/themes).
 *
 * Where base color (src/lib/baseColors.ts) swaps the NEUTRAL surface palette,
 * this axis swaps only the ACCENT: the `--primary` / `--ring` family (and their
 * sidebar twins) for a colored hue. Applied to <html> via the `data-shadcn-theme`
 * attribute (see src/app/globals.css). It sets NO geometry and NO surface colors,
 * so it composes freely with style × base color × radius — base color picks the
 * greys, theme tints the accent on top. Mirrors src/lib/baseColors.ts /
 * src/lib/radii.ts.
 *
 * "default" is the SENTINEL — it sets no override, so the active base color's own
 * neutral `--primary` stays in effect (base color × theme compose). The colored
 * ids match shadcn's registry accent themes.
 */
export const THEMES = [
  { id: "default", label: "Default" },
  { id: "red", label: "Red" },
  { id: "rose", label: "Rose" },
  { id: "orange", label: "Orange" },
  { id: "green", label: "Green" },
  { id: "blue", label: "Blue" },
  { id: "yellow", label: "Yellow" },
  { id: "violet", label: "Violet" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME_ID: ThemeId = "default";

/** localStorage key — read by the pre-paint inline script AND the React provider. */
export const THEME_STORAGE_KEY = "shadcn-theme";

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && THEMES.some((theme) => theme.id === value);
}
