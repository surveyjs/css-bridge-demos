"use client";

import { usePathname } from "next/navigation";
import { routes } from "@adapter/schemas";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAllQuestionsMode } from "./AllQuestionsMode";

/**
 * Header control for the All-Questions gallery's read-only ⇄ editable mode.
 *
 * It lives in the top menu but is route-scoped: on every route except
 * `/all-questions` it renders nothing. The state is shared with the page's live
 * SurveyModel through AllQuestionsModeContext. A native shadcn/ui <Switch> with a
 * <Label> — host chrome, not a SurveyJS control.
 */
export function AllQuestionsToggle() {
  const pathname = usePathname();
  const { readOnly, setReadOnly } = useAllQuestionsMode();

  if (pathname !== routes.allQuestions) return null;

  return (
    <Label htmlFor="all-questions-readonly" className="gap-2">
      <Switch
        id="all-questions-readonly"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <span className="hidden sm:inline">
        {readOnly ? "Read-only" : "Editable"}
      </span>
    </Label>
  );
}
