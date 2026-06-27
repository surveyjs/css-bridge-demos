/**
 * Shared content for the "code cost" comparison footer (`FormMetricsFooter`)
 * rendered below the /claims columns in every app.
 *
 * Renderer-agnostic: pure strings + a row builder, no SurveyJS and no host/CSS
 * framework. Each app owns only its own markup and the native-framework label;
 * the copy below is the single source of truth so the three apps never drift.
 */

/** Format a byte count as KB with one decimal, e.g. 2662 → "2,6 KB". */
export function formatKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
}

/** Disclosure summary shown collapsed above the comparison table. */
export const FORM_METRICS_SUMMARY =
  "The same form, built two ways — what each approach actually costs.";

/** Column header for the SurveyJS side of the table. */
export const FORM_METRICS_SURVEYJS_LABEL = "SurveyJS";

/** Italic caption rendered below the comparison table. */
export const FORM_METRICS_CAPTION =
  "SurveyJS reaches the same form with a fraction of the code — written once " +
  "and reused for every form — plus a JSON schema a non-developer can build " +
  "visually. The native column must be hand-written, and re-written, by a " +
  "developer for each new form.";

/** One comparison row: a label and the SurveyJS vs native cell text. */
export interface FormMetricsRow {
  label: string;
  surveyjs: string;
  native: string;
}

/** Inputs that vary per form/app for the comparison table. */
export interface FormMetricsInput {
  /** Line count of the reusable SurveyJS renderer (`SurveyForm.tsx`). */
  surveyjsLines: number;
  /** Line count of the hand-written native form component. */
  nativeLines: number;
  /** Byte size of the form's JSON schema. */
  jsonBytes: number;
}

/** Build the comparison rows from a form's metrics. */
export function buildFormMetricsRows({
  surveyjsLines,
  nativeLines,
  jsonBytes,
}: FormMetricsInput): FormMetricsRow[] {
  return [
    {
      label: "Code you write & maintain",
      surveyjs: `${surveyjsLines} lines — one reusable renderer`,
      native: `${nativeLines} lines — specific to this one form`,
    },
    {
      label: "Form definition",
      surveyjs: `A JSON schema · ${formatKB(jsonBytes)}`,
      native: "None — the form only exists as code",
    },
    {
      label: "Cost of the next form",
      surveyjs: "Just another JSON — the renderer is reused as-is",
      native: "Hand-write a comparable block all over again",
    },
    {
      label: "Changing the form later",
      surveyjs:
        "Edit the JSON (commonly stored in a database) — no app rebuild or redeploy",
      native: "Change the code, then rebuild & redeploy the app",
    },
    {
      label: "Who can build & edit it",
      surveyjs: "Non-developers, visually",
      native: "Developers only",
    },
  ];
}
