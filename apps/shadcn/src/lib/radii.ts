/**
 * Radius registry — the THIRD, independent shadcn theming axis (native shadcn
 * "radius"; see https://ui.shadcn.com/create). Each entry overrides ONLY the
 * `--radius` token on <html> via the `data-shadcn-radius` attribute (see
 * src/app/globals.css); the whole `--radius-sm…4xl` scale derives from it, so
 * the chrome AND the survey bridge (which reads `--radius` through `var()`)
 * re-round together. It composes with style × base color: those set the
 * palette + geometry presets, an explicit radius here overrides just the corner
 * rounding. Mirrors src/lib/styles.ts / src/lib/baseColors.ts.
 *
 * "default" is the SENTINEL — it sets no override, so the visual style's own
 * `--radius` stays in effect (style × radius compose). The numeric ids are rem
 * values, matching shadcn create's 0 / 0.25 / 0.5 / 0.75 / 1.0 scale.
 */
export const RADII = [
  { id: "default", label: "Default" },
  { id: "0", label: "0" },
  { id: "0.25", label: "0.25" },
  { id: "0.5", label: "0.5" },
  { id: "0.75", label: "0.75" },
  { id: "1", label: "1.0" },
] as const;

export type RadiusId = (typeof RADII)[number]["id"];

export const DEFAULT_RADIUS: RadiusId = "default";

/** localStorage key — read by the pre-paint inline script AND the React provider. */
export const RADIUS_STORAGE_KEY = "shadcn-radius";

export function isRadiusId(value: string | null): value is RadiusId {
  return value !== null && RADII.some((radius) => radius.id === value);
}
