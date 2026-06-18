"use client";

import { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { Survey } from "survey-react-ui";
import { allQuestionsSchema, createSurveyModel } from "@bridge/schemas";

// Same import order as SurveyForm: base V3 CSS first, Bootstrap bridge on top.
// This page adds NO bridge code — it reuses the existing stylesheet verbatim.
import "survey-core/survey-core.min.css";
import "@/bridge/bootstrap.css";

/**
 * All-questions gallery — the bridge's widest fidelity sweep. Builds ONE
 * survey-core model from the shared `all-questions` schema (showTOC is in the
 * JSON) and renders it through the stock `survey-react-ui` <Survey>, styled by
 * the existing Bootstrap bridge. No component swaps, no custom renderers.
 *
 * The read-only ⇄ editable switch is host chrome (a native react-bootstrap
 * <Form.Switch>), not a SurveyJS control. Toggling it sets `mode` on the LIVE
 * model — survey-core is reactive, so the form re-renders in place without a
 * rebuild or remount, preserving every answer.
 */
export function AllQuestionsGallery() {
  // Build the model exactly once for the component's lifetime.
  const model = useMemo(() => createSurveyModel(allQuestionsSchema), []);

  const [readOnly, setReadOnly] = useState(false);

  // Drive the live model's mode from the switch — no rebuild, no remount.
  useEffect(() => {
    model.mode = readOnly ? "display" : "edit";
  }, [model, readOnly]);

  // SurveyJS renders against the DOM root, absent during Next's prerender;
  // render only after mount so the bridge stays CSS-only.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Form.Check
        type="switch"
        id="all-questions-readonly"
        className="mb-4"
        checked={readOnly}
        onChange={(e) => setReadOnly(e.target.checked)}
        label={readOnly ? "Read-only" : "Editable"}
      />

      {mounted ? (
        <Survey model={model} />
      ) : (
        <div aria-busy="true" style={{ minHeight: "60vh" }} />
      )}
    </>
  );
}
