import type { VisualStyleId } from "./styles";

/** Lazy loaders for the self-contained shadcn adapter bundles in survey-core. */
export const SURVEY_ADAPTER_STYLE_LOADERS: Record<
  VisualStyleId,
  () => Promise<unknown>
> = {
  default: () => import("survey-core/themes/adapters/shadcn-default.min.css"),
  "new-york": () => import("survey-core/themes/adapters/shadcn-new-york.min.css"),
  "base-nova": () => import("survey-core/themes/adapters/shadcn-base-nova.min.css"),
  "base-vega": () => import("survey-core/themes/adapters/shadcn-base-vega.min.css"),
  "base-maia": () => import("survey-core/themes/adapters/shadcn-base-maia.min.css"),
  "base-lyra": () => import("survey-core/themes/adapters/shadcn-base-lyra.min.css"),
  "base-mira": () => import("survey-core/themes/adapters/shadcn-base-mira.min.css"),
  "base-luma": () => import("survey-core/themes/adapters/shadcn-base-luma.min.css"),
  "base-sera": () => import("survey-core/themes/adapters/shadcn-base-sera.min.css"),
  "base-rhea": () => import("survey-core/themes/adapters/shadcn-base-rhea.min.css"),
};
