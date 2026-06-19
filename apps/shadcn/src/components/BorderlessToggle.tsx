"use client";

import { usePathname } from "next/navigation";
import { routes } from "@bridge/schemas";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBorderlessMode } from "./BorderlessMode";

/**
 * Header control for the "Borderless questions" mode (survey-core `isCompact`).
 *
 * It lives in the top menu and shows only where it does something: the Dashboard
 * (no survey), the Builder (the Creator owns its own chrome) and Records (its
 * questions all live inside a panel, so `isCompact` has no visible effect there)
 * render nothing. The state is shared with the pages' live SurveyModels through
 * BorderlessModeContext. A native shadcn/ui <Switch> with a <Label> — host
 * chrome, not a SurveyJS control.
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
    <Label htmlFor="borderless-questions" className="gap-2">
      <Switch
        id="borderless-questions"
        checked={borderless}
        onCheckedChange={setBorderless}
      />
      <span className="hidden sm:inline">Borderless questions</span>
    </Label>
  );
}
