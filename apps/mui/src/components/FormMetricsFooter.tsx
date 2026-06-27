import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
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
 *
 * Copy (row text, summary, caption) is shared across all apps via
 * `@bridge/schemas`; this component owns only the MUI markup.
 */

export function FormMetricsFooter(props: FormMetricsInput) {
  const rows = buildFormMetricsRows(props);

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
        {FORM_METRICS_SUMMARY}
      </Box>

      <TableContainer sx={{ mt: 2, mb: 2 }}>
        <Table size="small" sx={{ color: "text.secondary" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%", color: "text.secondary" }} />
              <TableCell sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 600 }}>
                {FORM_METRICS_SURVEYJS_LABEL}
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
        {FORM_METRICS_CAPTION}
      </Typography>
    </Box>
  );
}
