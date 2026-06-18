/**
 * Shared information architecture: routes + nav items.
 *
 * Apps render their navigation FROM this list so the IA is identical across the
 * Bootstrap / shadcn / MUI hosts. Apps must not redefine routes locally.
 */

export type NavId = "checkout" | "records" | "claims" | "builder";

export interface NavItem {
  /** Stable id, also used as a React key. */
  readonly id: NavId;
  /** Display label in the nav. */
  readonly label: string;
  /** App route path (Next.js App Router). */
  readonly path: string;
  /** One-line description for landing cards / page intros. */
  readonly description: string;
  /** Optional id of the schema this route primarily renders. */
  readonly schemaId?: string;
}

export const navItems: readonly NavItem[] = [
  {
    id: "claims",
    label: "Claims",
    path: "/claims",
    description: "Patient intake / medical-insurance form.",
    schemaId: "medical-form",
  },
  {
    id: "checkout",
    label: "Checkout",
    path: "/checkout",
    description: "Multi-step checkout wizard.",
    schemaId: "checkout",
  },
  {
    id: "records",
    label: "Records",
    path: "/records",
    description: "Browse and edit insurance-claim records.",
    schemaId: "insurance-claim",
  },
  {
    id: "builder",
    label: "Builder",
    path: "/builder",
    description: "Edit schemas live with SurveyJS Creator.",
  },
] as const;

/** Route path constants for type-safe linking from apps. */
export const routes = {
  home: "/",
  checkout: "/checkout",
  records: "/records",
  recordDetail: (id: string) => `/records/${id}`,
  claims: "/claims",
  builder: "/builder",
} as const;

export function getNavItem(id: NavId): NavItem | undefined {
  return navItems.find((item) => item.id === id);
}
