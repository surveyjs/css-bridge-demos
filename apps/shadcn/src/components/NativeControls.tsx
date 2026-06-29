"use client";

import {
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStylePreset } from "@/components/ui/presets";
import { medicalFormJson } from "@bridge/schemas";
import { FormCompleted } from "./FormCompleted";

/**
 * Hand-built shadcn/ui twin of the SurveyJS medical-intake form
 * (`medicalFormJson` in @bridge/schemas), grouped into the SAME four sections —
 * Patient, Insurance, History, Consent — and PAGED into them as a wizard to
 * match the SurveyJS form's `showProgressBar` / `progressBarType: "pages"`.
 *
 * Mirrors the SAME chrome (the survey title + description) and the SAME
 * behaviours: controlled inputs, per-page required-field validation that blocks
 * Next, a conditional secondary-insurance section, dynamic add/remove allergy
 * rows, a drawable signature pad, and a final Complete that validates the whole
 * form and shows a success state.
 *
 * This column is deliberately UNBRIDGED: it is the "what you'd hand-write per
 * form" baseline the comparison footer measures against (see FormMetricsFooter).
 * SurveyJS pages from the JSON for free; here every step is wired by hand — that
 * gap is the point. Pure host chrome — shadcn/ui primitives + Tailwind-styled
 * native elements (shadcn ships no select/radio/checkbox), zero SurveyJS
 * involvement (the imported `medicalFormJson` is read only for its description
 * string, so the two columns share the exact same wording).
 *
 * Its line count is cited by the comparison footer — measured in claims/page.tsx
 * (a server component) rather than exported from here, because a plain value
 * exported from a "use client" module can't be read on the server.
 */

type Sex = "f" | "m" | "";
type Relationship = "self" | "spouse" | "dependent";
type HistoryAnswer = "yes" | "no" | "unsure";

type Allergy = { allergen: string; severity: string; reaction: string };

const PAGES = ["Patient", "Insurance", "History", "Consent"] as const;
const LAST_PAGE = PAGES.length - 1;

const HISTORY_ROWS = [
  { value: "diabetes", text: "Diabetes" },
  { value: "hypertension", text: "High blood pressure" },
  { value: "asthma", text: "Asthma" },
  { value: "heart", text: "Heart disease" },
] as const;

// Tailwind-styled native <select>, matching the original sample's shadcn idiom.
// Height tracks the visual-style preset (--control-height), like <Input>.
const selectClass =
  "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-[var(--control-height,2.25rem)] w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]";

/** Mask a raw phone string into the +1 (999) 999-9999 pattern. */
function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);
  let out = "+1";
  if (area) out += ` (${area}`;
  if (area.length === 3) out += ")";
  if (prefix) out += ` ${prefix}`;
  if (line) out += `-${line}`;
  return out;
}

export function NativeControls() {
  // Native <select> tracks the active style's control preset, like <Input>.
  const fieldClass = cn(selectClass, useStylePreset().control);
  // Wizard paging — render ONE section at a time (Patient → … → Consent).
  const [currentPage, setCurrentPage] = useState(0);
  const [attempted, setAttempted] = useState([false, false, false, false]);

  // Patient
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<Sex>("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState("");

  // Insurance
  const [carrier, setCarrier] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("self");
  const [hasSecondary, setHasSecondary] = useState(false);
  const [carrier2, setCarrier2] = useState("");
  const [memberId2, setMemberId2] = useState("");

  // History
  const [history, setHistory] = useState<Record<string, HistoryAnswer>>({});
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [currentMedications, setCurrentMedications] = useState("");

  // Consent
  const [consentTreatment, setConsentTreatment] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [signedDate, setSignedDate] = useState("");

  const [submitted, setSubmitted] = useState(false);

  // Signature pad
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  function pointerPos(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function startStroke(e: PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const { x, y } = pointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvasRef.current?.setPointerCapture(e.pointerId);
  }

  function moveStroke(e: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pointerPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "currentColor";
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endStroke() {
    drawing.current = false;
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Dynamic allergy rows
  function addAllergy() {
    setAllergies((rows) => [...rows, { allergen: "", severity: "", reaction: "" }]);
  }
  function removeAllergy(index: number) {
    setAllergies((rows) => rows.filter((_, i) => i !== index));
  }
  function updateAllergy(index: number, field: keyof Allergy, value: string) {
    setAllergies((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  // Required-field validation — mirrors the SurveyJS schema's `isRequired` flags.
  const errors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    dob: !dob,
    carrier: !carrier.trim(),
    memberId: !memberId.trim(),
    carrier2: hasSecondary && !carrier2.trim(),
    memberId2: hasSecondary && !memberId2.trim(),
    allergens: allergies.map((a) => !a.allergen.trim()),
    consentTreatment: !consentTreatment,
    consentPrivacy: !consentPrivacy,
  };

  // Which required fields belong to which wizard page.
  function isPageValid(page: number): boolean {
    switch (page) {
      case 0:
        return !errors.firstName && !errors.lastName && !errors.dob;
      case 1:
        return !errors.carrier && !errors.memberId && !errors.carrier2 && !errors.memberId2;
      case 2:
        return !errors.allergens.some(Boolean);
      case 3:
        return !errors.consentTreatment && !errors.consentPrivacy;
      default:
        return true;
    }
  }

  // Show inline errors on the current page only once it has been attempted
  // (Next/Complete pressed), so the user isn't yelled at before they act.
  const showErrors = attempted[currentPage];

  function markAttempted(page: number) {
    setAttempted((a) => (a[page] ? a : a.map((v, i) => (i === page ? true : v))));
  }

  function goBack() {
    setCurrentPage((p) => Math.max(0, p - 1));
  }

  function goNext() {
    markAttempted(currentPage);
    if (isPageValid(currentPage)) setCurrentPage((p) => Math.min(LAST_PAGE, p + 1));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted([true, true, true, true]);
    // By construction earlier pages were valid to reach here, but re-check the
    // whole form and jump back to the first offending page if anything changed.
    const firstInvalid = PAGES.findIndex((_, i) => !isPageValid(i));
    if (firstInvalid >= 0) {
      setCurrentPage(firstInvalid);
      return;
    }
    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setCurrentPage(0);
    setAttempted([false, false, false, false]);
  }

  if (submitted) {
    return (
      <FormCompleted
        message="Thank you. Your intake form has been submitted."
        onEdit={resetForm}
      />
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        {/* Survey title + description — mirrors the SurveyJS column's header,
            sharing the schema's exact description so only the "(…)" suffix
            differs between the two forms. */}
        <div>
          <h2 className="text-2xl font-semibold">Patient Intake (Native shadcn)</h2>
          <p className="text-muted-foreground mt-1">
            {medicalFormJson.description as string}
          </p>
        </div>

        {/* ── Wizard progress (mirrors SurveyJS progressBarType: "pages") ── */}
        <ol className="flex items-center gap-2">
          {PAGES.map((title, index) => {
            const active = index === currentPage;
            const done = index < currentPage;
            return (
              <li key={title} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    active && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/10 text-primary",
                    !active && !done && "text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:inline",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {title}
                </span>
                {index < LAST_PAGE && (
                  <span className="bg-border ml-1 hidden h-px flex-1 sm:block" />
                )}
              </li>
            );
          })}
        </ol>

        {/* Per-page title — the SurveyJS pages each carry a title, so the
            native wizard shows the active page's title too. */}
        <h3 className="text-lg font-semibold">{PAGES[currentPage]}</h3>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ── Patient ───────────────────────────────────────────── */}
          {currentPage === 0 && (
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nf-first">First name</Label>
                  <Input
                    id="nf-first"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={showErrors && errors.firstName}
                  />
                  {showErrors && errors.firstName && (
                    <p className="text-destructive text-sm">First name is required.</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nf-last">Last name</Label>
                  <Input
                    id="nf-last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-invalid={showErrors && errors.lastName}
                  />
                  {showErrors && errors.lastName && (
                    <p className="text-destructive text-sm">Last name is required.</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nf-dob">Date of birth</Label>
                  <Input
                    id="nf-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    aria-invalid={showErrors && errors.dob}
                  />
                  {showErrors && errors.dob && (
                    <p className="text-destructive text-sm">Date of birth is required.</p>
                  )}
                </div>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium">
                    Sex assigned at birth
                  </legend>
                  <div className="flex gap-6">
                    <Label className="font-normal">
                      <input
                        type="radio"
                        name="nf-sex"
                        checked={sex === "f"}
                        onChange={() => setSex("f")}
                        className="accent-primary size-4"
                      />
                      Female
                    </Label>
                    <Label className="font-normal">
                      <input
                        type="radio"
                        name="nf-sex"
                        checked={sex === "m"}
                        onChange={() => setSex("m")}
                        className="accent-primary size-4"
                      />
                      Male
                    </Label>
                  </div>
                </fieldset>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nf-phone">Mobile phone</Label>
                  <Input
                    id="nf-phone"
                    type="tel"
                    placeholder="+1 (___) ___-____"
                    value={phone}
                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nf-contact">Preferred contact method</Label>
                  <select
                    id="nf-contact"
                    className={fieldClass}
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an option…
                    </option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Text message">Text message</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Insurance ─────────────────────────────────────────── */}
          {currentPage === 1 && (
            <div className="flex flex-col gap-5">
              <fieldset className="bg-muted/40 flex flex-col gap-4 rounded-lg border p-4">
                <legend className="px-1 text-sm font-medium">Primary insurance</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nf-carrier">Insurance carrier</Label>
                    <Input
                      id="nf-carrier"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      aria-invalid={showErrors && errors.carrier}
                    />
                    {showErrors && errors.carrier && (
                      <p className="text-destructive text-sm">Insurance carrier is required.</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nf-member">Member ID</Label>
                    <Input
                      id="nf-member"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      aria-invalid={showErrors && errors.memberId}
                    />
                    {showErrors && errors.memberId && (
                      <p className="text-destructive text-sm">Member ID is required.</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nf-group">Group number</Label>
                    <Input
                      id="nf-group"
                      value={groupNumber}
                      onChange={(e) => setGroupNumber(e.target.value)}
                    />
                  </div>
                </div>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium">Patient is the…</legend>
                  <div className="flex flex-wrap gap-6">
                    {(
                      [
                        { value: "self", text: "Policyholder" },
                        { value: "spouse", text: "Spouse" },
                        { value: "dependent", text: "Dependent" },
                      ] as const
                    ).map((opt) => (
                      <Label key={opt.value} className="font-normal">
                        <input
                          type="radio"
                          name="nf-rel"
                          checked={relationship === opt.value}
                          onChange={() => setRelationship(opt.value)}
                          className="accent-primary size-4"
                        />
                        {opt.text}
                      </Label>
                    ))}
                  </div>
                </fieldset>
              </fieldset>

              <Label className="font-normal">
                <Switch checked={hasSecondary} onCheckedChange={setHasSecondary} />
                Do you have secondary insurance?
              </Label>

              {hasSecondary && (
                <fieldset className="bg-muted/40 flex flex-col gap-4 rounded-lg border p-4">
                  <legend className="px-1 text-sm font-medium">Secondary insurance</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nf-carrier2">Insurance carrier</Label>
                      <Input
                        id="nf-carrier2"
                        value={carrier2}
                        onChange={(e) => setCarrier2(e.target.value)}
                        aria-invalid={showErrors && errors.carrier2}
                      />
                      {showErrors && errors.carrier2 && (
                        <p className="text-destructive text-sm">Insurance carrier is required.</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nf-member2">Member ID</Label>
                      <Input
                        id="nf-member2"
                        value={memberId2}
                        onChange={(e) => setMemberId2(e.target.value)}
                        aria-invalid={showErrors && errors.memberId2}
                      />
                      {showErrors && errors.memberId2 && (
                        <p className="text-destructive text-sm">Member ID is required.</p>
                      )}
                    </div>
                  </div>
                </fieldset>
              )}
            </div>
          )}

          {/* ── History ───────────────────────────────────────────── */}
          {currentPage === 2 && (
            <div className="flex flex-col gap-5">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium">
                  Have you ever been diagnosed with any of the following?
                </legend>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead />
                      <TableHead className="text-center">Yes</TableHead>
                      <TableHead className="text-center">No</TableHead>
                      <TableHead className="text-center">Unsure</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {HISTORY_ROWS.map((row) => (
                      <TableRow key={row.value}>
                        <TableCell className="font-medium whitespace-normal">
                          {row.text}
                        </TableCell>
                        {(["yes", "no", "unsure"] as const).map((answer) => (
                          <TableCell key={answer} className="text-center">
                            <input
                              type="radio"
                              name={`nf-history-${row.value}`}
                              aria-label={`${row.text}: ${answer}`}
                              checked={history[row.value] === answer}
                              onChange={() =>
                                setHistory((h) => ({ ...h, [row.value]: answer }))
                              }
                              className="accent-primary size-4"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </fieldset>

              <div className="flex flex-col gap-2">
                <Label>Allergies</Label>
                {allergies.length === 0 && (
                  <p className="text-muted-foreground text-sm">No allergies added.</p>
                )}
                {allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 sm:flex-row sm:items-start"
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <Input
                        aria-label="Allergen"
                        placeholder="Allergen"
                        value={allergy.allergen}
                        onChange={(e) => updateAllergy(index, "allergen", e.target.value)}
                        aria-invalid={showErrors && errors.allergens[index]}
                      />
                      {showErrors && errors.allergens[index] && (
                        <p className="text-destructive text-sm">Allergen is required.</p>
                      )}
                    </div>
                    <select
                      aria-label="Severity"
                      className={cn(fieldClass, "sm:w-32")}
                      value={allergy.severity}
                      onChange={(e) => updateAllergy(index, "severity", e.target.value)}
                    >
                      <option value="" disabled>
                        Severity…
                      </option>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                    <Input
                      aria-label="Reaction"
                      placeholder="Reaction"
                      className="flex-1"
                      value={allergy.reaction}
                      onChange={(e) => updateAllergy(index, "reaction", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      aria-label={`Remove allergy ${index + 1}`}
                      onClick={() => removeAllergy(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <div>
                  <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
                    Add allergy
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nf-meds">Current medications</Label>
                <Textarea
                  id="nf-meds"
                  rows={3}
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── Consent ───────────────────────────────────────────── */}
          {currentPage === 3 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label className="font-normal">
                  <input
                    type="checkbox"
                    checked={consentTreatment}
                    onChange={(e) => setConsentTreatment(e.target.checked)}
                    className="accent-primary size-4"
                  />
                  I consent to treatment
                </Label>
                {showErrors && errors.consentTreatment && (
                  <p className="text-destructive text-sm">Consent to treatment is required.</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="font-normal">
                  <input
                    type="checkbox"
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="accent-primary size-4"
                  />
                  I acknowledge the privacy practices (HIPAA)
                </Label>
                {showErrors && errors.consentPrivacy && (
                  <p className="text-destructive text-sm">Acknowledgement is required.</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Signature</Label>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={140}
                  className="border-input bg-background text-foreground w-full max-w-full cursor-crosshair touch-none rounded-md border"
                  onPointerDown={startStroke}
                  onPointerMove={moveStroke}
                  onPointerUp={endStroke}
                  onPointerLeave={endStroke}
                />
                <div>
                  <Button type="button" variant="link" size="sm" className="px-0" onClick={clearSignature}>
                    Clear signature
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:max-w-[calc(50%-0.5rem)]">
                <Label htmlFor="nf-signed">Date</Label>
                <Input
                  id="nf-signed"
                  type="date"
                  value={signedDate}
                  onChange={(e) => setSignedDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {showErrors && !isPageValid(currentPage) && (
            <p className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm">
              Please fix the highlighted fields before continuing.
            </p>
          )}

          {/* ── Wizard navigation ─────────────────────────────────── */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            {currentPage < LAST_PAGE ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit">Complete</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
