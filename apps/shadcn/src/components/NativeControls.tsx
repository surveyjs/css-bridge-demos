import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Stock shadcn/ui form controls shown beside the (future) SurveyJS form so the
 * bridge's fidelity is verifiable by eye: each control here is the native shadcn
 * rendering the bridged SurveyJS field should be indistinguishable from. Pure
 * chrome — no SurveyJS involvement. Field set mirrors apps/bootstrap and
 * apps/mui's NativeControls so the three demos compare like-for-like.
 */
export function NativeControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Native shadcn/ui</CardTitle>
        <CardDescription>
          Stock shadcn/ui controls — the bridged form should match these.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nc-first-name">First name</Label>
          <Input id="nc-first-name" placeholder="Enter text…" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nc-contact">Preferred contact method</Label>
          <select
            id="nc-contact"
            defaultValue=""
            className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          >
            <option value="" disabled>
              Select an option…
            </option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="text">Text message</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nc-meds">Current medications</Label>
          <Textarea id="nc-meds" rows={3} placeholder="Enter longer text…" />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">
            Sex assigned at birth
          </legend>
          <div className="flex gap-6">
            <Label className="font-normal">
              <input
                type="radio"
                name="nc-sex"
                defaultChecked
                className="accent-primary size-4"
              />
              Female
            </Label>
            <Label className="font-normal">
              <input
                type="radio"
                name="nc-sex"
                className="accent-primary size-4"
              />
              Male
            </Label>
          </div>
        </fieldset>

        <Label className="font-normal">
          <input
            type="checkbox"
            defaultChecked
            className="accent-primary size-4"
          />
          I consent to treatment
        </Label>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nc-required">Required field (invalid state)</Label>
          <Input id="nc-required" aria-invalid defaultValue="" />
          <p className="text-destructive text-sm">This field is required.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button>Complete</Button>
          <Button variant="outline">Check</Button>
        </div>
      </CardContent>
    </Card>
  );
}
