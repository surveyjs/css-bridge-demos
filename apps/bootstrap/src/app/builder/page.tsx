import { getNavItem, medicalFormJson } from "@bridge/schemas";
import { BuilderCreator } from "@/components/BuilderCreator";

const nav = getNavItem("builder")!;

/**
 * Builder route — the SurveyJS V3 Creator mounted against a SHARED schema from
 * `@bridge/schemas` (the same patient-intake definition the Claims route
 * renders), so the builder edits the one source of truth rather than a copy.
 *
 * The Creator is styled purely by the existing form-level Bootstrap bridge: its
 * chrome consumes the same `--sjs2-*` custom properties on the same theme root,
 * so it re-themes in lockstep with the switcher and ships zero Creator-specific
 * bridge CSS or component overrides. See `BuilderCreator` for the layering.
 */
export default function BuilderPage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">{nav.label}</h1>
        <p className="text-body-secondary mb-0">{nav.description}</p>
      </div>

      <BuilderCreator json={medicalFormJson} />
    </>
  );
}
