import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  buildFormMetricsRows,
  FORM_METRICS_CAPTION,
  FORM_METRICS_SUMMARY,
  FORM_METRICS_SURVEYJS_LABEL,
  type FormMetricsInput,
} from "@bridge/schemas";

/**
 * "Code cost" comparison footer rendered ONCE below both /claims columns.
 *
 * Pure presentational host chrome — no SurveyJS involvement. It folds the two
 * forms' metrics into a single side-by-side table (SurveyJS vs Native shadcn) so
 * the demo's thesis reads at a glance: SurveyJS reaches the same form with a
 * tiny, reusable renderer driving a visually-authored JSON schema, while the
 * native column needs a large block of form-specific code a developer rewrites
 * for every form.
 *
 * Rendered as a native <details>/<summary> disclosure — collapsed by default
 * behind its title, expanding to the comparison table — so it needs no client JS
 * and stays a server component. This is a footer at the bottom of the page, not a
 * per-route page header, so it does not violate the "no page header" invariant.
 *
 * Copy (row text, summary, caption) is shared across all apps via
 * `@bridge/schemas`; this component owns only the shadcn markup.
 */

export function FormMetricsFooter(props: FormMetricsInput) {
  const rows = buildFormMetricsRows(props);

  return (
    <details className="mt-2 rounded-xl border bg-card p-4">
      <summary className="text-muted-foreground cursor-pointer text-sm font-semibold">
        {FORM_METRICS_SUMMARY}
      </summary>

      <Table className="mt-4 text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4" />
            <TableHead className="bg-primary/10 text-foreground font-semibold">
              {FORM_METRICS_SURVEYJS_LABEL}
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold">
              Native shadcn
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="text-muted-foreground align-top font-medium whitespace-normal">
                {row.label}
              </TableCell>
              <TableCell className="bg-primary/5 text-foreground align-top whitespace-normal">
                {row.surveyjs}
              </TableCell>
              <TableCell className="text-muted-foreground align-top whitespace-normal">
                {row.native}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-muted-foreground mt-4 text-sm italic">
        {FORM_METRICS_CAPTION}
      </p>
    </details>
  );
}
