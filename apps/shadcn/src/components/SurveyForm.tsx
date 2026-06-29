"use client";

import { useEffect, useMemo, useState } from "react";
import { Survey } from "survey-react-ui";
import { Card } from "@/components/ui/card";
import {
  createSurveyModel,
  type SchemaInput,
  type SurveyData,
  type SurveyMode,
} from "@bridge/schemas";
import { useBorderlessMode } from "./BorderlessMode";
import { FormCompleted } from "./FormCompleted";

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
  completedMessage = "Thank you. Your response has been submitted.",
  prefillData,
  prefillLabel = "Prefill demo data",
}: {
  schema: SchemaInput;
  data?: SurveyData;
  /** `edit` (default) for an interactive form, `display` for read-only. */
  mode?: SurveyMode;
  /** Called with the response data when the survey is submitted. */
  onComplete?: (data: SurveyData) => void;
  /** Message shown on the custom completion screen (see below). */
  completedMessage?: string;
  /**
   * When provided, a custom "Prefill demo data" button is added to the survey's
   * navigation bar that fills every page's answers in one click.
   */
  prefillData?: SurveyData;
  /** Label for the prefill button (see `prefillData`). */
  prefillLabel?: string;
}) {
  const model = useMemo(
    () => createSurveyModel(schema, { data, mode }),
    [schema, data, mode],
  );

  // Optional "Prefill demo data" custom button. Added to the survey's OWN
  // navigation bar through the public `addNavigationItem` API (it renders a
  // stock `sv-nav-btn` — host-level use of the model API, NOT a renderer/
  // component override, so the bridge stays CSS-only). One click fills every
  // page's answers so the end-user can page straight through without typing;
  // `mergeData` keeps anything already entered and fills the rest. Re-added if
  // the model is rebuilt (schema/data/mode change).
  useEffect(() => {
    if (!prefillData) return;
    const id = "sv-prefill-demo";
    model.addNavigationItem({
      id,
      title: prefillLabel,
      action: () => model.mergeData(prefillData),
    });
    return () => {
      model.navigationBar.removeActionById(id);
    };
  }, [model, prefillData, prefillLabel]);

  // "Borderless questions" switch (top menu) → survey-core's `isCompact`. It is
  // a non-serializable runtime flag, so it's set on the LIVE model here rather
  // than baked into the schema; survey-core is reactive, so the form re-renders
  // in place. Re-applied if the model is rebuilt (schema/data/mode change).
  const { borderless } = useBorderlessMode();
  useEffect(() => {
    model.isCompact = borderless;
  }, [model, borderless]);

  // On completion, hide the SurveyJS widget and show our own success screen
  // (matching the native column's submitted state) instead of the model's
  // default completed page. This is host-level React reacting to a model
  // event — NOT a SurveyJS renderer/component override, so the bridge stays
  // CSS-only. Reset when the model is rebuilt (schema/data/mode change).
  const [completed, setCompleted] = useState(false);
  useEffect(() => setCompleted(false), [model]);
  useEffect(() => {
    const handler = (sender: typeof model) => {
      setCompleted(true);
      onComplete?.(sender.data);
    };
    model.onComplete.add(handler);
    return () => model.onComplete.remove(handler);
  }, [model, onComplete]);

  // "Edit Response" — keep the answers (clear(false) leaves data intact, just
  // flips the model out of its completed state) and show the widget again.
  const handleEdit = () => {
    model.clear(false);
    setCompleted(false);
  };

  // SurveyJS renders against the browser `environment` (the DOM root), which is
  // absent during Next's server prerender. Render the form only after mount so
  // the bridge stays CSS-only — no SSR shim or renderer override.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-busy="true" style={{ minHeight: "60vh" }} />;
  }

  if (completed) {
    return <FormCompleted message={completedMessage} onEdit={handleEdit} />;
  }

  // Wrap the live form in the same bordered Card as the native column (and as
  // this column's own completion screen) so the SurveyJS root sits in identical
  // chrome. `py-0 gap-0` strips the Card's built-in vertical padding — the
  // survey body already supplies its own inner padding; `overflow-hidden` clips
  // the form's title bar to the radius.
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <Survey model={model} />
    </Card>
  );
}
