# CLAUDE.md — SurveyJS V3 Bridge Demos

This monorepo demonstrates SurveyJS V3 CSS bridges across **Bootstrap, shadcn, and MUI**. `apps/bootstrap` is the Bootstrap app — first of three and the architecture proving ground.

## Invariants (do not violate)

- **Single source of truth.** All SurveyJS schemas, seed data, validation/logic, the SurveyModel factory, and the shared information architecture (routes + nav items) live in `packages/schemas`. Apps consume it and **never copy or redefine schemas**. A schema change happens in the package, never in an app.

- **`packages/schemas` dependency rule.** It may depend on **`survey-core` only** (the headless model — that's the shared model layer, not a UI framework). It must **not** depend on `survey-react-ui`, react-bootstrap, MUI, Tailwind, or any host/CSS framework. Keep it renderer-agnostic.

- **Allowed per-app differences, and only these:** (1) the CSS bridge, (2) the host chrome/components, (3) framework-specific renderer registration. Everything model/logic stays shared.

- **Bootstrap bridge is CSS-ONLY.** Zero SurveyJS **component/renderer (JS) overrides** in `apps/bootstrap` — no swapping React components or registering custom renderers. The bridge is a stylesheet: it maps SurveyJS V3's `--sjs2-*` custom properties (declared on the `.sjs-theme-overrides` theme root, which V3 emits automatically) onto Bootstrap `--bs-*` tokens. A small number of plain CSS selector rules on `.sd-*` elements (e.g. checkbox/radio decorator SVGs, focus/pressed states) are part of the bridge and allowed — what's forbidden is reaching into SurveyJS's component layer. **Do not author this bridge from scratch:** the canonical, hand-authored bridge lives at `C:\survey.js\Examples\css-bridges\bootstrap.css`; copy it in. If you think a *component/renderer* override is required, **STOP and flag it** rather than adding one.

- **Identical IA across apps.** Routes + nav are defined in `packages/schemas` so shadcn and MUI reuse them unchanged.

- **Theme propagation is the core proof.** When the Bootstrap theme changes (light/dark via `data-bs-theme`, or a Bootswatch theme), the SurveyJS form must re-theme **automatically** through the same CSS variables, with **no SurveyJS-specific theme code**. Protect this.

## Stack
- pnpm workspaces + Turborepo. TypeScript everywhere. Next.js App Router. react-bootstrap + Bootstrap 5 for chrome (no jQuery).
- SurveyJS V3 consumed from **local builds** via pnpm `link:` (see `package.json`). `transpilePackages` is set for all four SurveyJS packages, and `react`/`react-dom` are deduped to a single instance.
