"use client";

import { usePathname } from "next/navigation";
import { Form } from "react-bootstrap";
import { routes } from "@bridge/schemas";
import { useBorderlessMode } from "./BorderlessMode";

/**
 * Header control for the "Borderless questions" mode (survey-core `isCompact`).
 *
 * It lives in the top menu and shows only where it does something: the Dashboard
 * (no survey), the Builder (the Creator owns its own chrome) and Records (its
 * questions all live inside a panel, so `isCompact` has no visible effect there)
 * render nothing. The state is shared with the pages' live SurveyModels through
 * BorderlessModeContext. A native react-bootstrap <Form.Check type="switch"> —
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
    <Form.Check
      type="switch"
      id="borderless-questions"
      className="mb-0"
      checked={borderless}
      onChange={(e) => setBorderless(e.target.checked)}
      label="Borderless questions"
    />
  );
}
