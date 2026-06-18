import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getNavItem, medicalFormSchema } from "@bridge/schemas";
import { SurveyForm } from "@/components/SurveyForm";
import { NativeControls } from "@/components/NativeControls";

const nav = getNavItem("claims")!;

/**
 * First (and, for this stage, only) route wired to SurveyJS — the proof point
 * for the MUI CSS bridge. The medical/insurance schema comes from
 * `@bridge/schemas` unchanged; styling is CSS-only via `src/bridge/mui.css`.
 *
 * The native-controls column sits beside the form so the bridge's fidelity is
 * verifiable by eye and re-themes in lockstep with the chrome.
 */
export default function ClaimsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          {nav.label}
        </Typography>
        <Typography color="text.secondary">{nav.description}</Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 4,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr", xl: "8fr 4fr" },
        }}
      >
        <SurveyForm schema={medicalFormSchema} />
        <Box sx={{ position: { lg: "sticky" }, top: { lg: "5rem" } }}>
          <NativeControls />
        </Box>
      </Box>
    </Box>
  );
}
