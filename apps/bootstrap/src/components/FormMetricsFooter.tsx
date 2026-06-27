/**
 * "Code cost" comparison footer rendered ONCE below both /claims columns.
 *
 * Pure presentational host chrome — no SurveyJS involvement. It folds the two
 * forms' metrics into a single side-by-side table (SurveyJS vs Native Bootstrap)
 * so the demo's thesis reads at a glance: SurveyJS reaches the same form with a
 * tiny, reusable renderer driving a visually-authored JSON schema, while the
 * native column needs a large block of form-specific code a developer rewrites
 * for every form.
 *
 * Rendered as a native <details>/<summary> disclosure — collapsed by default
 * behind its title, expanding to the comparison table — so it needs no client
 * JS and stays a server component. This is a footer at the bottom of the page,
 * not a per-route page header, so it does not violate the "no page header"
 * invariant.
 *
 * Copy (row text, summary, caption) is shared across all apps via
 * `@bridge/schemas`; this component owns only the Bootstrap markup.
 */

import {
  buildFormMetricsRows,
  FORM_METRICS_CAPTION,
  FORM_METRICS_SUMMARY,
  FORM_METRICS_SURVEYJS_LABEL,
  type FormMetricsInput,
} from "@bridge/schemas";

export function FormMetricsFooter(props: FormMetricsInput) {
  const rows = buildFormMetricsRows(props);

  return (
    <details className="mt-2">
      <summary
        className="text-body-secondary small fw-semibold mb-2"
        style={{ cursor: "pointer" }}
      >
        {FORM_METRICS_SUMMARY}
      </summary>
      <table className="table table-sm align-middle small mb-2 mt-2">
        <thead>
          <tr>
            <th scope="col" className="w-25 fw-normal text-body-secondary">
              &nbsp;
            </th>
            <th scope="col" className="table-primary">
              {FORM_METRICS_SURVEYJS_LABEL}
            </th>
            <th scope="col">Native Bootstrap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="fw-normal text-body-secondary">
                {row.label}
              </th>
              <td className="table-primary">{row.surveyjs}</td>
              <td>{row.native}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-body-secondary small fst-italic mb-0">
        {FORM_METRICS_CAPTION}
      </p>
    </details>
  );
}
