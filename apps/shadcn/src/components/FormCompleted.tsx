import { Button } from "@/components/ui/button";

/**
 * Shared "form submitted" screen rendered by BOTH the SurveyJS column
 * (SurveyForm) and the native column (NativeControls), so the two are identical.
 *
 * shadcn/ui ships no Alert primitive, so this is a simple green-tinted success
 * box built with Tailwind in the shadcn idiom.
 *
 * It lives in its own file on purpose: the /claims "code cost" footer measures
 * the form-BUILDING code in each column, so this shared completion chrome is
 * deliberately kept OUT of either form's line count.
 */
export function FormCompleted({
  message,
  onEdit,
}: {
  message: string;
  /** "Edit Response" — return to the editable form with answers intact. */
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-green-600/30 bg-green-500/10 p-6 text-green-900 dark:text-green-200">
      <p className="font-semibold">{message}</p>
      <Button variant="outline" className="mt-4" onClick={onEdit}>
        Edit Response
      </Button>
    </div>
  );
}
