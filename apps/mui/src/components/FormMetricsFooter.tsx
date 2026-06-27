import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

/**
 * "Code cost" comparison footer rendered ONCE below both /claims columns.
 *
 * Pure presentational host chrome — no SurveyJS involvement. It folds the two
 * forms' metrics into a single side-by-side table (SurveyJS vs Native MUI) so
 * the demo's thesis reads at a glance: SurveyJS reaches the same form with a
 * tiny, reusable renderer driving a visually-authored JSON schema, while the
 * native column needs a large block of form-specific code a developer rewrites
 * for every form.
 *
 * Rendered as a native <details>/<summary> disclosure (via `Box component="details"`)
 * — collapsed by default behind its title, expanding to the comparison table — so
 * it needs no client JS and stays a server component (an MUI <Accordion> would
 * pull in a "use client" boundary). This is a footer at the bottom of the page,
 * not a per-route page header, so it does not violate the "no page header"
 * invariant.
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
    <Box component="details" sx={{ mt: 1 }}>
      <Box
        component="summary"
        sx={{
          cursor: "pointer",
          color: "text.secondary",
          fontSize: "0.875rem",
          fontWeight: 600,
          mb: 1,
        }}
      >
        The same form, built two ways — what each approach actually costs.
      </Box>

      <TableContainer sx={{ mt: 2, mb: 2 }}>
        <Table size="small" sx={{ color: "text.secondary" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%", color: "text.secondary" }} />
              <TableCell sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 600 }}>
                SurveyJS
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>
                Native MUI
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell component="th" scope="row" sx={{ color: "text.secondary" }}>
                  {row.label}
                </TableCell>
                <TableCell sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  {row.surveyjs}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{row.native}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: "italic", mb: 0 }}
      >
        SurveyJS reaches the same form with a fraction of the code — written once
        and reused for every form — plus a JSON schema a non-developer can build
        visually. The native column must be hand-written, and re-written, by a
        developer for each new form.
      </Typography>
    </Box>
  );
}
