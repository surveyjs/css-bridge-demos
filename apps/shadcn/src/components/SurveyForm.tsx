"use client";

import { useEffect, useMemo, useState } from "react";
import { Survey } from "survey-react-ui";
import {
  createSurveyModel,
  type SchemaInput,
  type SurveyData,
  type SurveyMode,
} from "@bridge/schemas";

// Base V3 CSS FIRST, then the shadcn bridge ON TOP so the bridge's `--sjs2-*`
// overrides (declared on the same `.sjs-theme-overrides` root that survey-core
// emits) win by source order. The bridge maps those variables onto shadcn
// tokens (--background, --primary, --border, --ring, --radius, …) — there is NO
// SurveyJS-specific theme code: the form re-skins automatically whenever the
// active visual style (`data-shadcn-style` on <html>) or light/dark (`.dark`)
// flips a shadcn variable.
//
// The bridge is TWO layers: `shadcn.css` is the always-on base map; each
// `shadcn-<style>.css` carries only that visual style's deltas and is scoped
// under `[data-shadcn-style="<style>"]`, so they can all be loaded at once and
// the attribute on <html> picks the active one — the SAME switch that drives the
// chrome token presets (see StyleProvider) thus drives the survey bridge too.
import "survey-core/survey-core.min.css";
import "@/bridge/shadcn.css";
import "@/bridge/shadcn-default.css";
import "@/bridge/shadcn-new-york.css";
import "@/bridge/shadcn-base-nova.css";
import "@/bridge/shadcn-base-vega.css";

/**
 * Renders a SurveyJS V3 model with the shadcn CSS bridge applied.
 *
 * CSS-only: it imports the bridge stylesheets and renders the headless model
 * from `@bridge/schemas` through the stock `survey-react-ui` <Survey> — no
 * component swaps, no custom renderer registration.
 */
export function SurveyForm({
  schema,
  data,
  mode,
  onComplete,
}: {
  schema: SchemaInput;
  data?: SurveyData;
  /** `edit` (default) for an interactive form, `display` for read-only. */
  mode?: SurveyMode;
  /** Called with the response data when the survey is submitted. */
  onComplete?: (data: SurveyData) => void;
}) {
  const model = useMemo(
    () => createSurveyModel(schema, { data, mode }),
    [schema, data, mode],
  );

  // Bridge stays CSS-only: completion is a model event on the headless model,
  // not a renderer/component override.
  useEffect(() => {
    if (!onComplete) return;
    const handler = (sender: typeof model) => onComplete(sender.data);
    model.onComplete.add(handler);
    return () => model.onComplete.remove(handler);
  }, [model, onComplete]);

  // SurveyJS renders against the browser `environment` (the DOM root), which is
  // absent during Next's server prerender. Render the form only after mount so
  // the bridge stays CSS-only — no SSR shim or renderer override.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  }

  return <Survey model={model} />;
}
