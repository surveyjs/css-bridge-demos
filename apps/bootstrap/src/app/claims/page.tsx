import { medicalFormSchema } from "@bridge/schemas";
import { SurveyForm } from "@/components/SurveyForm";
import { NativeControls } from "@/components/NativeControls";

/**
 * First (and, for this stage, only) route wired to SurveyJS — the proof point
 * for the Bootstrap CSS bridge. The medical/insurance schema comes from
 * `@bridge/schemas` unchanged; styling is CSS-only via survey-core/themes/adapters.
 *
 * The native-controls column sits beside the form so the bridge's fidelity is
 * verifiable by eye and re-themes in lockstep with the chrome.
 */
export default function ClaimsPage() {
  return (
    <div className="row g-4">
      <div className="col-lg-7 col-xxl-8">
        <SurveyForm schema={medicalFormSchema} />
      </div>
      <div className="col-lg-5 col-xxl-4">
        <div className="position-sticky" style={{ top: "5rem" }}>
          <NativeControls />
        </div>
      </div>
    </div>
  );
}
