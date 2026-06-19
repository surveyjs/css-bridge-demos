import { medicalFormSchema } from "@bridge/schemas";
import { SurveyForm } from "@/components/SurveyForm";
import { NativeControls } from "@/components/NativeControls";

/**
 * First (and, for this stage, only) route wired to SurveyJS — the proof point
 * for the shadcn CSS bridge. The medical/insurance schema comes from
 * `@bridge/schemas` unchanged; styling is CSS-only via `src/bridge/shadcn*.css`.
 *
 * The native-controls column sits beside the form so the bridge's fidelity is
 * verifiable by eye and re-themes in lockstep with the chrome.
 */
export default function ClaimsPage() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[7fr_5fr]">
      <SurveyForm schema={medicalFormSchema} />
      <div className="lg:sticky lg:top-20">
        <NativeControls />
      </div>
    </div>
  );
}
