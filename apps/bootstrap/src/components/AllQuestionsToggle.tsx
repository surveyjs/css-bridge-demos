"use client";

import { usePathname } from "next/navigation";
import { Form } from "react-bootstrap";
import { routes } from "@bridge/schemas";
import { useAllQuestionsMode } from "./AllQuestionsMode";

/**
 * Header control for the All-Questions gallery's read-only ⇄ editable mode.
 *
 * It lives in the top menu but is route-scoped: on every route except
 * `/all-questions` it renders nothing. The state is shared with the page's live
 * SurveyModel through AllQuestionsModeContext. A native react-bootstrap
 * <Form.Check type="switch"> — host chrome, not a SurveyJS control.
 */
export function AllQuestionsToggle() {
  const pathname = usePathname();
  const { readOnly, setReadOnly } = useAllQuestionsMode();

  if (pathname !== routes.allQuestions) return null;

  return (
    <Form.Check
      type="switch"
      id="all-questions-readonly"
      className="mb-0"
      checked={readOnly}
      onChange={(e) => setReadOnly(e.target.checked)}
      label={readOnly ? "Read-only" : "Editable"}
    />
  );
}
