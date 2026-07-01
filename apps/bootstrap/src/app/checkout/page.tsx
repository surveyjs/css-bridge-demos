import { checkoutSchema } from "@adapter/schemas";
import { SurveyForm } from "@/components/SurveyForm";

/**
 * Checkout — the clean parity page. A single SurveyJS multi-page wizard
 * (per-page validation + masked card/expiry inputs) rendered straight through
 * the Bootstrap theme adapter. The schema comes from `@adapter/schemas` unchanged;
 * there is nothing app-specific here beyond the chrome around the form.
 */
export default function CheckoutPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-9 col-xxl-7">
        <SurveyForm schema={checkoutSchema} />
      </div>
    </div>
  );
}
