import { checkoutSchema, getNavItem } from "@bridge/schemas";
import { SurveyForm } from "@/components/SurveyForm";

const nav = getNavItem("checkout")!;

/**
 * Checkout — the clean parity page. A single SurveyJS multi-page wizard
 * (per-page validation + masked card/expiry inputs) rendered straight through
 * the Bootstrap CSS bridge. The schema comes from `@bridge/schemas` unchanged;
 * there is nothing app-specific here beyond the chrome around the form.
 */
export default function CheckoutPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">{nav.label}</h1>
        <p className="text-body-secondary mb-0">{nav.description}</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-9 col-xxl-7">
          <SurveyForm schema={checkoutSchema} />
        </div>
      </div>
    </>
  );
}
