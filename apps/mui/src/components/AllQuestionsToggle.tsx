"use client";

import { usePathname } from "next/navigation";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { routes } from "@adapter/schemas";
import { useAllQuestionsMode } from "./AllQuestionsMode";

/**
 * Header control for the All-Questions gallery's read-only ⇄ editable mode.
 *
 * It lives in the top menu (AppBar) but is route-scoped: on every route except
 * `/all-questions` it renders nothing. The state is shared with the page's live
 * SurveyModel through AllQuestionsModeContext. A native MUI <Switch> in a
 * <FormControlLabel> — host chrome, not a SurveyJS control.
 */
export function AllQuestionsToggle() {
  const pathname = usePathname();
  const { readOnly, setReadOnly } = useAllQuestionsMode();

  if (pathname !== routes.allQuestions) return null;

  return (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <Switch
          checked={readOnly}
          onChange={(e) => setReadOnly(e.target.checked)}
        />
      }
      label="Read-only"
    />
  );
}
