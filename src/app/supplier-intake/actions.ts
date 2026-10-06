"use server";

import { FULL_SCHEMA } from "@/components/supplier-intake/data/supplier-intake.schema";
import { STEP_FIELDS, type SupplierIntakeValues } from "@/components/supplier-intake/data/supplier-intake.data";

// Sends a Stage 1 supplier application to the Google Apps Script intake that
// RampRate's own form (ramprate.com/biochain/supplier-intake, its
// /api/supplier-intake route) posts to, with the same payload shape, so it
// lands in the same review pipeline. Live tonygreenberg.com used a tRPC call
// on the old Manus host for this; that backend is gone.
//
// GOOGLE_APPS_SCRIPT_URL is server-only. When it isn't set the page shows a
// hand-off link to RampRate instead of a submit button (see page.tsx).
const STAGE2_URL_BASE = "https://ramprate.com/supplier-intake-long/";
const SOURCE_URL = "https://tonygreenberg.com/supplier-intake";

export async function submitSupplierIntake(
  input: SupplierIntakeValues,
): Promise<{ ok: true; supplierId?: string } | { ok: false; error: string }> {
  // Honeypot filled in: act as if it worked, send nothing.
  if (input.website_url) return { ok: true };

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) return { ok: false, error: "Online submission is paused. Please use ramprate.com/biochain/supplier-intake." };

  let values: Record<string, string>;
  try {
    values = await FULL_SCHEMA.validate(input, { abortEarly: true, stripUnknown: true });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Please check the form and try again." };
  }

  // Dropdown answers must be one of the listed options.
  for (const field of Object.values(STEP_FIELDS).flat()) {
    if (field.options && !field.options.includes(values[field.name])) {
      return { ok: false, error: `Please choose a ${field.label} from the list.` };
    }
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formStage: "stage1-supplier-intake",
        stage2UrlBase: STAGE2_URL_BASE,
        formData: { ...values, source_site: "tonygreenberg" },
        files: [],
        sourceUrl: SOURCE_URL,
        projectName: "tonygreenberg.com",
      }),
    });
    if (!res.ok) {
      console.error("[supplier-intake] Apps Script returned", res.status);
      return { ok: false, error: "Submission failed. Please try again." };
    }
    const data: unknown = await res.json().catch(() => null);
    const supplierId =
      data && typeof data === "object" && "supplierId" in data && typeof data.supplierId === "string" ? data.supplierId : undefined;
    return { ok: true, supplierId };
  } catch (err) {
    console.error("[supplier-intake] submit failed:", err);
    return { ok: false, error: "Submission failed. Please try again." };
  }
}
