/**
 * Visual-style registry — the shadcn analog of Bootswatch themes / MUI palettes.
 *
 * Each entry is a TOKEN PRESET applied to <html> via the `data-shadcn-style`
 * attribute (see src/app/globals.css). Only styles that also ship a matching
 * `shadcn-<id>.css` survey bridge in C:\survey.js\Examples\css-bridges\ are
 * wired here, so the chrome and the (later) SurveyJS bridge stay paired.
 */
export const VISUAL_STYLES = [
  { id: "default", label: "Default" },
  { id: "new-york", label: "New York" },
  { id: "base-nova", label: "Base Nova" },
  { id: "base-vega", label: "Base Vega" },
] as const;

export type VisualStyleId = (typeof VISUAL_STYLES)[number]["id"];

export const DEFAULT_STYLE_ID: VisualStyleId = "default";

/** localStorage key — read by the pre-paint inline script AND the React provider. */
export const STYLE_STORAGE_KEY = "shadcn-style";

export function isVisualStyleId(value: string | null): value is VisualStyleId {
  return value !== null && VISUAL_STYLES.some((style) => style.id === value);
}
