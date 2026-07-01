"use client";

import { usePathname } from "next/navigation";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { routes } from "@adapter/schemas";
import { useBorderlessMode } from "./BorderlessMode";

/**
 * Header control for the "Borderless questions" mode (survey-core `isCompact`).
 *
 * It lives in the top menu (AppBar) and shows only where it does something: the
 * Dashboard (no survey), the Builder (the Creator owns its own chrome) and Records
 * (its questions all live inside a panel, so `isCompact` has no visible effect
 * there) render nothing. The state is shared with the pages' live SurveyModels
 * through BorderlessModeContext. A native MUI <Switch> in a <FormControlLabel> —
 * host chrome, not a SurveyJS control.
 */
export function BorderlessToggle() {
  const pathname = usePathname();
  const { borderless, setBorderless } = useBorderlessMode();

  if (
    pathname === routes.home ||
    pathname === routes.builder ||
    pathname === routes.records
  ) {
    return null;
  }

  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <Switch
          checked={borderless}
          onChange={(e) => setBorderless(e.target.checked)}
        />
      }
      label="Borderless questions"
    />
  );
}
