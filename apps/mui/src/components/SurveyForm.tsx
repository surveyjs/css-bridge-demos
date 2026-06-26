"use client";

import { useEffect, useMemo, useState } from "react";
import { Survey } from "survey-react-ui";
import {
  createSurveyModel,
  type SchemaInput,
  type SurveyData,
  type SurveyMode,
} from "@bridge/schemas";
import { useBorderlessMode } from "./BorderlessMode";

// Base V3 CSS FIRST, then the MUI bridge ON TOP so the bridge's `--sjs2-*`
// overrides (declared on the same `.sjs-theme-overrides` root that survey-core
// emits) win by source order. The bridge maps those variables onto MUI `--mui-*`
// tokens — there is NO SurveyJS-specific theme code: the form re-skins
// automatically whenever the active MUI scheme/palette changes. The `--mui-*`
// variables it reads exist only because the app's theme was built with
// `cssVariables` (see src/theme/theme.ts) — do not remove that flag.
import "survey-core/survey-core.min.css";
import "survey-core/themes/adapters/mui.min.css";

/**
 * Renders a SurveyJS V3 model with the MUI CSS bridge applied.
 *
 * CSS-only: it imports the bridge stylesheet and renders the headless model from
 * `@bridge/schemas` through the stock `survey-react-ui` <Survey> — no component
 * swaps, no custom renderer registration.
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

  // "Borderless questions" switch (top menu) → survey-core's `isCompact`. It is
  // a non-serializable runtime flag, so it's set on the LIVE model here rather
  // than baked into the schema; survey-core is reactive, so the form re-renders
  // in place. Re-applied if the model is rebuilt (schema/data/mode change).
  const { borderless } = useBorderlessMode();
  useEffect(() => {
    model.isCompact = borderless;
  }, [model, borderless]);

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
