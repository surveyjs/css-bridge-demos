import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
 */

/** Format a byte count as KB with one decimal, e.g. 2662 → "2,6 KB". */
function formatKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
}

export function FormMetricsFooter({
  surveyjsLines,
  nativeLines,
  jsonBytes,
}: {
  /** Line count of the reusable SurveyJS renderer (`SurveyForm.tsx`). */
  surveyjsLines: number;
  /** Line count of the hand-written native form component. */
  nativeLines: number;
  /** Byte size of the form's JSON schema. */
  jsonBytes: number;
}) {
  const rows: { label: string; surveyjs: string; native: string }[] = [
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

  return (
    <details className="mt-2 rounded-xl border bg-card p-4">
      <summary className="text-muted-foreground cursor-pointer text-sm font-semibold">
        The same form, built two ways — what each approach actually costs.
      </summary>

      <Table className="mt-4 text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4" />
            <TableHead className="bg-primary/10 text-foreground font-semibold">
              SurveyJS
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
        SurveyJS reaches the same form with a fraction of the code — written once
        and reused for every form — plus a JSON schema a non-developer can build
        visually. The native column must be hand-written, and re-written, by a
        developer for each new form.
      </p>
    </details>
  );
}
