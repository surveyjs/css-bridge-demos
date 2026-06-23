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

// Base V3 CSS FIRST, then the shadcn adapter from survey-core ON TOP so the
// bridge's `--sjs2-*` overrides win by source order. The active visual-style
// bundle is loaded by <ShadcnSurveyAdapterStyles /> (see ThemeProvider) and
// tracks `data-shadcn-style` on <html>; light/dark flips shadcn tokens via
// `.dark` on the same root.
import "survey-core/survey-core.min.css";

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
