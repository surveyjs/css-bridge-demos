/**
 * @bridge/schemas — single source of truth for SurveyJS V3 across all bridge demos.
 *
 * Renderer-agnostic: depends on `survey-core` only. Apps consume these exports
 * and never copy or redefine schemas.
 */

// Types
export type {
  SurveyJSON,
  SurveyData,
  SurveyMode,
  SchemaDefinition,
} from "./types";

// Schemas
export { checkoutJson, checkoutSchema } from "./schemas/checkout";
export { insuranceClaimJson, insuranceClaimSchema } from "./schemas/insurance-claim";
export { medicalFormJson, medicalFormSchema } from "./schemas/medical-form";

// Seed data
export {
  insuranceClaimSeed,
  type ClaimRecord,
} from "./data/insurance-claim-seed";

// Model factory
export {
  createSurveyModel,
  type CreateSurveyModelOptions,
  type SchemaInput,
} from "./model/createSurveyModel";

// Information architecture (routes + nav)
export {
  navItems,
  routes,
  getNavItem,
  type NavItem,
  type NavId,
} from "./ia/navigation";

import { checkoutSchema } from "./schemas/checkout";
import { insuranceClaimSchema } from "./schemas/insurance-claim";
import { medicalFormSchema } from "./schemas/medical-form";
import type { SchemaDefinition } from "./types";

/** Registry of all schemas keyed by id, for lookups from app routes. */
export const schemaRegistry: Record<string, SchemaDefinition> = {
  [checkoutSchema.id]: checkoutSchema,
  [insuranceClaimSchema.id]: insuranceClaimSchema,
  [medicalFormSchema.id]: medicalFormSchema,
};

/** All schemas as an array (e.g. for a landing page gallery). */
export const allSchemas: readonly SchemaDefinition[] = [
  checkoutSchema,
  insuranceClaimSchema,
  medicalFormSchema,
];
