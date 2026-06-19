/**
 * Base-color registry — the second, independent shadcn theming axis (the native
 * shadcn "base color" concept; see https://ui.shadcn.com/docs/theming).
 *
 * Each entry is a PURE-COLOR token preset applied to <html> via the
 * `data-shadcn-base-color` attribute (see src/app/globals.css). It only changes
 * the palette tokens the survey bridge already reads through `var()` — it sets
 * NO geometry (`--radius` stays the visual-style axis's job), so the two axes
 * compose: style sets geometry, base color sets the palette. Mirrors
 * src/lib/styles.ts. "neutral" is the default (the :root/.dark base palette).
 */
export const BASE_COLORS = [
  { id: "neutral", label: "Neutral" },
  { id: "gray", label: "Gray" },
  { id: "zinc", label: "Zinc" },
  { id: "stone", label: "Stone" },
  { id: "slate", label: "Slate" },
] as const;

export type BaseColorId = (typeof BASE_COLORS)[number]["id"];

export const DEFAULT_BASE_COLOR: BaseColorId = "neutral";

/** localStorage key — read by the pre-paint inline script AND the React provider. */
export const BASE_COLOR_STORAGE_KEY = "shadcn-base-color";

export function isBaseColorId(value: string | null): value is BaseColorId {
  return value !== null && BASE_COLORS.some((color) => color.id === value);
}
