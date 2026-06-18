import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { checkoutSchema, getNavItem } from "@bridge/schemas";
import { SurveyForm } from "@/components/SurveyForm";

const nav = getNavItem("checkout")!;

/**
 * Checkout — the clean parity page. A single SurveyJS multi-page wizard
 * (per-page validation + masked card/expiry inputs) rendered straight through
 * the MUI CSS bridge. The schema comes from `@bridge/schemas` unchanged; there
 * is nothing app-specific here beyond the MUI chrome around the form.
 */
export default function CheckoutPage() {
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
          mx: "auto",
          maxWidth: { xs: "100%", xl: 760 },
        }}
      >
        <SurveyForm schema={checkoutSchema} />
      </Box>
    </Box>
  );
}
