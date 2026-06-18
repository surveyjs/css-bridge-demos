"use client";

import { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import type { SurveyJSON } from "@bridge/schemas";

// Layering, bottom → top, mirrors SurveyForm:
//   1. survey-core base      — the headless library's V3 stylesheet
//   2. survey-creator-core   — the Creator chrome, built ON TOP of (1) and
//                              consuming the SAME `--sjs2-*` custom properties
//                              on the SAME `.sjs-theme-overrides` theme root
//   3. the MUI bridge        — maps `--sjs2-* → --mui-*` on `.sjs-theme-overrides`
//
// KEY INSIGHT (prompt 4): there is intentionally NO separate Creator bridge.
// The Creator emits the same `.sjs-theme-overrides` theme root the form does, so
// the existing form bridge's variable overrides cascade into the Creator chrome
// (toolbar, tabs, toolbox, property grid, designer surface) automatically. This
// file authors zero new bridge CSS. The `--mui-*` variables the bridge reads
// exist only because the app theme was built with `cssVariables` (theme.ts), and
// the Creator renders inside that same ThemeProvider (Providers → AdminShell),
// so it re-themes in lockstep with the switcher.
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import "@/bridge/mui.css";

/**
 * Mounts the SurveyJS V3 Creator on the Builder route, seeded with a shared
 * schema from `@bridge/schemas` so the builder edits the very same definition
 * the other routes render.
 *
 * CSS-only, like the rest of the MUI bridge: it renders the stock
 * `survey-creator-react` component with no renderer/component overrides and no
 * Creator-specific theme code. Re-theming rides entirely on the shared
 * `--sjs2-*` overrides resolving against the active MUI scheme/palette.
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
    return <div aria-busy="true" style={{ minHeight: "70vh" }} />;
  }

  // The Creator is full-height chrome; give it a tall, bounded viewport so the
  // toolbox / designer / property grid lay out as they do in a real builder.
  return (
    <div style={{ height: "calc(100vh - 8rem)", minHeight: "40rem" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
