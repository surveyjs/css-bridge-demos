"use client";

import { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import type { SurveyJSON } from "@bridge/schemas";

// Layering, bottom → top, mirrors SurveyForm:
//   1. survey-core base      — the headless library's V3 stylesheet
//   2. survey-creator-core   — the Creator chrome, built ON TOP of (1) and
//                              consuming the SAME `--sjs2-*` custom properties
//                              on the SAME `.sjs-theme-overrides` theme root
//   3. the shadcn bridge     — maps `--sjs2-* → shadcn tokens` on that root.
//                              TWO layers, exactly as SurveyForm imports them:
//                              `shadcn.css` is the always-on base map; each
//                              `shadcn-<style>.css` carries that visual style's
//                              deltas, scoped under `[data-shadcn-style="…"]`.
//
// KEY INSIGHT (prompt 4): there is intentionally NO separate Creator bridge.
// The Creator emits the same `.sjs-theme-overrides` theme root the form does, so
// the existing form bridge's variable overrides cascade into the Creator chrome
// (toolbar, tabs, toolbox, property grid, designer surface) automatically. This
// file authors zero new bridge CSS. The shadcn tokens the bridge reads
// (--background, --primary, --border, --ring, --radius, …) live on <html> under
// `.dark` and `[data-shadcn-style="…"]`, and the Creator renders in that same
// subtree (ThemeProvider → AdminShell), so it re-themes in lockstep with both
// the light/dark toggle and the visual-style switcher.
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import "@/bridge/shadcn.css";
import "@/bridge/shadcn-default.css";
import "@/bridge/shadcn-new-york.css";
import "@/bridge/shadcn-base-nova.css";
import "@/bridge/shadcn-base-vega.css";
import "@/bridge/shadcn-base-maia.css";
import "@/bridge/shadcn-base-lyra.css";
import "@/bridge/shadcn-base-mira.css";
import "@/bridge/shadcn-base-luma.css";
import "@/bridge/shadcn-base-sera.css";
import "@/bridge/shadcn-base-rhea.css";

/**
 * Mounts the SurveyJS V3 Creator on the Builder route, seeded with a shared
 * schema from `@bridge/schemas` so the builder edits the very same definition
 * the other routes render.
 *
 * CSS-only, like the rest of the shadcn bridge: it renders the stock
 * `survey-creator-react` component with no renderer/component overrides and no
 * Creator-specific theme code. Re-theming rides entirely on the shared
 * `--sjs2-*` overrides resolving against the active shadcn tokens.
 */
export function BuilderCreator({ json }: { json: SurveyJSON }) {
  // The Creator's constructor reaches for the browser DOM `environment`
  // (`navigator`), which is absent during Next's server prerender — so unlike
  // the headless SurveyModel it CANNOT be built at render/SSR time. Construct it
  // only after mount, client-side, and render nothing until it exists.
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  useEffect(() => {
    const instance = new SurveyCreator({
      showDesignerTab: true,
      showPreviewTab: true,
      showJSONEditorTab: true,
      showLogicTab: true,
      showTranslationTab: true,
      // Persisting is out of scope for the bridge proof — no save handler.
      isAutoSave: false,
    });
    instance.JSON = json;
    setCreator(instance);
  }, [json]);

  if (!creator) {
    return <div aria-busy="true" style={{ height: "100%", minHeight: "40rem" }} />;
  }

  // The Creator is full-height chrome. The Builder route renders edge-to-edge
  // (see AdminShell), so fill the parent's height outright — the toolbox /
  // designer / property grid then get the whole viewport below the header.
  return (
    <div style={{ height: "100%", minHeight: "40rem" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
