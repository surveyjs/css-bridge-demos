import type { ReactNode } from "react";
import ConstructionIcon from "@mui/icons-material/Construction";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * Shared scaffold for a route's content this stage. apps/mui ships only the
 * native MUI chrome — the SurveyJS form that will live in `children` arrives in
 * a later prompt. Pure MUI components so it re-themes with the shell.
 */
export function PagePlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderStyle: "dashed",
          borderWidth: 2,
          py: 6,
          px: 3,
          textAlign: "center",
        }}
      >
        <Stack spacing={1} alignItems="center" color="text.secondary">
          <ConstructionIcon fontSize="large" aria-hidden />
          <Typography fontWeight={500}>Native MUI chrome only</Typography>
          <Typography variant="body2">
            The SurveyJS form for this route is wired up in a later stage.
          </Typography>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
