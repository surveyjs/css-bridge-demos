/**
 * Visual-style registry — the shadcn analog of Bootswatch themes / MUI palettes.
 *
 * Each entry is a TOKEN PRESET applied to <html> via the `data-shadcn-style`
 * attribute (see src/app/globals.css). Every shadcn style that ships a matching
 * `shadcn-<id>.css` survey bridge in C:\survey.js\Examples\css-bridges\ is wired
 * here (all 10), so the chrome and the SurveyJS bridge stay paired. Order mirrors
 * the canonical demo (C:\survey.js\Examples\css-bridges\demos\shadcn).
 */
export const VISUAL_STYLES = [
  { id: "default", label: "Default" },
  { id: "new-york", label: "New York" },
  { id: "base-nova", label: "Base Nova" },
  { id: "base-vega", label: "Base Vega" },
  { id: "base-maia", label: "Base Maia" },
  { id: "base-lyra", label: "Base Lyra" },
  { id: "base-mira", label: "Base Mira" },
  { id: "base-luma", label: "Base Luma" },
  { id: "base-sera", label: "Base Sera" },
  { id: "base-rhea", label: "Base Rhea" },
] as const;

export type VisualStyleId = (typeof VISUAL_STYLES)[number]["id"];

export const DEFAULT_STYLE_ID: VisualStyleId = "default";

/** localStorage key — read by the pre-paint inline script AND the React provider. */
export const STYLE_STORAGE_KEY = "shadcn-style";

export function isVisualStyleId(value: string | null): value is VisualStyleId {
  return value !== null && VISUAL_STYLES.some((style) => style.id === value);
}
