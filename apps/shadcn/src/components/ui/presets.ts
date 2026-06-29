"use client";

import { useStyle } from "@/components/StyleProvider";
import { type VisualStyleId } from "@/lib/styles";

/**
 * Per-style component presets — the local stand-in for "shadcn generates a
 * component set per style". shadcn's CLI bakes a style's choices (control
 * heights, shadows, …) into the component source; here every style shares ONE
 * vendored set of `ui/*` primitives and instead supplies its differences as
 * class fragments, applied at render by the active `data-shadcn-style`
 * (via useStyle). Corner radius is NOT here — it rides the shared `--radius`
 * token (globals.css), which both these primitives and the survey bridge read,
 * so it stays flash-free and identical across the two columns.
 *
 * Values are DERIVED FROM the survey-core shadcn adapters (the same source of
 * truth the survey column uses), not invented:
 *   - `control`/`button` height N = the adapter's --sjs2-shadcn-input-height /
 *     --sjs2-shadcn-action-large-height (calc(var(--spacing) * N) === Tailwind h-N).
 *   - `shadow-none` on lyra/sera mirrors their flat (inset-border, no drop
 *     shadow) formbox treatment.
 * To add/adjust a style, pull N from its adapter — do not eyeball it.
 */
export type StylePreset = {
  /** Native field height/shadow — applied to <Input> and the native <select>. */
  control: string;
  /** Default-size <Button> height/shadow (h-N === action-large-height). */
  button: string;
};

export const STYLE_PRESETS: Record<VisualStyleId, StylePreset> = {
  default: { control: "h-10", button: "h-10" }, //                 input/action h-10
  "new-york": { control: "h-9", button: "h-9" }, //                h-9
  "base-nova": { control: "h-8", button: "h-8" }, //               compact h-8
  "base-vega": { control: "h-9", button: "h-9" }, //               h-9
  "base-maia": { control: "h-9", button: "h-9" }, //               h-9, rounded (radius)
  "base-lyra": { control: "h-8 shadow-none", button: "h-8 shadow-none" }, // square + flat, h-8
  "base-mira": { control: "h-7", button: "h-7" }, //               smallest, h-7
  "base-luma": { control: "h-9", button: "h-9" }, //               h-9, pill (radius)
  "base-sera": { control: "h-10 shadow-none", button: "h-10 shadow-none" }, // square + flat but roomy, h-10
  "base-rhea": { control: "h-8", button: "h-8" }, //               h-8, rounded (radius)
};

/** The active style's component preset (falls back to default's). */
export function useStylePreset(): StylePreset {
  const { style } = useStyle();
  return STYLE_PRESETS[style] ?? STYLE_PRESETS.default;
}
