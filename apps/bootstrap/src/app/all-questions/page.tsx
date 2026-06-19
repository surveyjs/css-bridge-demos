import { AllQuestionsGallery } from "@/components/AllQuestionsGallery";

/**
 * All-questions gallery route — every SurveyJS V3 question type, grouped into
 * TOC pages that mirror the Creator toolbox categories one-for-one. Rendered
 * through the EXISTING Bootstrap bridge (CSS-only); the schema and IA come from
 * `@bridge/schemas` unchanged. This is the broadest stress test of the bridge.
 */
export default function AllQuestionsPage() {
  return <AllQuestionsGallery />;
}
