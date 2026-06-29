import type { VisualStyleId } from "@/lib/styles";

/** Per-style control geometry for raw elements (the native <select>) that can't
 *  use the vendored component sets. Mirrors styles/<id>/input.tsx. */
export const STYLE_GEOMETRY: Record<VisualStyleId, { control: string }> = {
  "default": { control: "h-10" },
  "new-york": { control: "h-9" },
  "base-nova": { control: "h-8" },
  "base-vega": { control: "h-9" },
  "base-maia": { control: "h-9" },
  "base-lyra": { control: "h-8 shadow-none" },
  "base-mira": { control: "h-7" },
  "base-luma": { control: "h-9" },
  "base-sera": { control: "h-10 shadow-none" },
  "base-rhea": { control: "h-8" },
};
