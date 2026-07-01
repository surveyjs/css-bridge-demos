"use client";

import { useEffect, useMemo } from "react";
import { Survey } from "survey-react-ui";
import { allQuestionsSchema, createSurveyModel } from "@adapter/schemas";
import { useAllQuestionsMode } from "./AllQuestionsMode";
import { useBorderlessMode } from "./BorderlessMode";

// Same import order as SurveyForm: base V3 CSS first; the active shadcn adapter
// bundle is loaded by <ShadcnSurveyAdapterStyles /> in ThemeProvider.
import "survey-core/survey-core.min.css";

/**
 * All-questions gallery — the adapter's widest fidelity sweep. Builds ONE
 * survey-core model from the shared `all-questions` schema (showTOC is in the
 * JSON) and renders it through the stock `survey-react-ui` <Survey>, styled by
 * the existing shadcn adapter. No component swaps, no custom renderers.
 *
 * The read-only ⇄ editable switch is host chrome (a native shadcn/ui <Switch>)
 * that lives in the top menu (AllQuestionsToggle), shared with this page through
 * AllQuestionsModeContext. Toggling it sets `mode` on the LIVE model —
 * survey-core is reactive, so the form re-renders in place without a rebuild or
 * remount, preserving every answer.
 */
export function AllQuestionsGallery() {
  // Build the model exactly once for the component's lifetime.
  const model = useMemo(() => {
    const m = createSurveyModel(allQuestionsSchema);
    m.showCompleteButton = false;
    return m;
  }, []);

  // The switch lives in the header; its state arrives via context.
  const { readOnly } = useAllQuestionsMode();

  // Drive the live model's mode from the switch — no rebuild, no remount.
  useEffect(() => {
    model.mode = readOnly ? "display" : "edit";
  }, [model, readOnly]);

  // "Borderless questions" switch (top menu) → survey-core's `isCompact`, set on
  // the LIVE model (non-serializable runtime flag — never baked into the schema).
  const { borderless } = useBorderlessMode();
  useEffect(() => {
    model.isCompact = borderless;
  }, [model, borderless]);

  // Server-rendered and hydrated — no mount gate. survey-core guards all DOM
  // access, so the model builds and <Survey> renders to HTML during Next's
  // prerender (unlike the Creator, which stays client-only).
  return <Survey model={model} />;
}
