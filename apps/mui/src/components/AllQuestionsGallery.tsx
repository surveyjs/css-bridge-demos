"use client";

import { useEffect, useMemo, useState } from "react";
import { Survey } from "survey-react-ui";
import { allQuestionsSchema, createSurveyModel } from "@bridge/schemas";
import { useAllQuestionsMode } from "./AllQuestionsMode";

// Same import order as SurveyForm: base V3 CSS first, MUI bridge on top.
// This page adds NO bridge code — it reuses the existing stylesheet verbatim.
import "survey-core/survey-core.min.css";
import "@/bridge/mui.css";

/**
 * All-questions gallery — the bridge's widest fidelity sweep. Builds ONE
 * survey-core model from the shared `all-questions` schema (showTOC is in the
 * JSON) and renders it through the stock `survey-react-ui` <Survey>, styled by
 * the existing MUI bridge. No component swaps, no custom renderers.
 *
 * The read-only ⇄ editable switch is host chrome (a native MUI <Switch> in a
 * <FormControlLabel>) that lives in the top menu (AllQuestionsToggle), shared
 * with this page through AllQuestionsModeContext. Toggling it sets `mode` on the
 * LIVE model — survey-core is reactive, so the form re-renders in place without
 * a rebuild or remount, preserving every answer.
 */
export function AllQuestionsGallery() {
  // Build the model exactly once for the component's lifetime.
  const model = useMemo(() => createSurveyModel(allQuestionsSchema), []);

  // The switch lives in the header; its state arrives via context.
  const { readOnly } = useAllQuestionsMode();

  // Drive the live model's mode from the switch — no rebuild, no remount.
  useEffect(() => {
    model.mode = readOnly ? "display" : "edit";
  }, [model, readOnly]);

  // SurveyJS renders against the DOM root, absent during Next's prerender;
  // render only after mount so the bridge stays CSS-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return mounted ? (
    <Survey model={model} />
  ) : (
    <div aria-busy="true" style={{ minHeight: "60vh" }} />
  );
}
