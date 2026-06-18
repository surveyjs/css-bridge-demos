import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getNavItem } from "@bridge/schemas";
import { AllQuestionsGallery } from "@/components/AllQuestionsGallery";

const nav = getNavItem("all-questions")!;

/**
 * All-questions gallery route — every SurveyJS V3 question type, grouped into
 * TOC pages that mirror the Creator toolbox categories one-for-one. Rendered
 * through the EXISTING MUI bridge (CSS-only); the schema and IA come from
 * `@bridge/schemas` unchanged. This is the broadest stress test of the bridge.
 */
export default function AllQuestionsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          {nav.label}
        </Typography>
        <Typography color="text.secondary">{nav.description}</Typography>
      </Box>

      <AllQuestionsGallery />
    </Box>
  );
}
