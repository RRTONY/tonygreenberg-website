import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitSupplierIntake } from "@/app/supplier-intake/actions";
import { EMPTY_VALUES, STEP_FIELDS, type SupplierIntakeValues } from "@/components/supplier-intake/data/supplier-intake.data";

// A complete, valid application: the first listed option for every dropdown.
function validValues(): SupplierIntakeValues {
  const v: Record<string, string> = { ...EMPTY_VALUES };
  for (const f of Object.values(STEP_FIELDS).flat()) v[f.name] = f.options ? f.options[0] : f.required ? `Test ${f.name}` : "";
  v.email = "jane@acme.com";
  return v as SupplierIntakeValues;
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://script.google.test/exec");
  fetchMock = vi.fn(async () => Response.json({ supplierId: "SUP-1" }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("submitSupplierIntake", () => {
  it("quietly accepts and drops a bot that filled the hidden field", async () => {
    await expect(submitSupplierIntake({ ...validValues(), website_url: "http://spam" })).resolves.toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says submission is paused when the Apps Script URL isn't set", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "");
    await expect(submitSupplierIntake(validValues())).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/paused/) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-validates on the server: required fields, email format and dropdown values", async () => {
    await expect(submitSupplierIntake({ ...validValues(), legal_entity_name: " " })).resolves.toEqual({ ok: false, error: "Legal entity name is required" });
    await expect(submitSupplierIntake({ ...validValues(), email: "nope" })).resolves.toEqual({ ok: false, error: "Invalid email address" });
    await expect(submitSupplierIntake({ ...validValues(), facility_type: "Garage" })).resolves.toEqual({
      ok: false,
      error: "Please choose a Facility Type from the list.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts the optional fields left empty", async () => {
    await expect(submitSupplierIntake({ ...validValues(), phone: "", website: "", monthly_production_capacity: "" })).resolves.toEqual({
      ok: true,
      supplierId: "SUP-1",
    });
  });

  it("posts RampRate's Stage 1 payload and returns the supplier id", async () => {
    await submitSupplierIntake(validValues());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://script.google.test/exec");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      formStage: "stage1-supplier-intake",
      stage2UrlBase: "https://ramprate.com/supplier-intake-long/",
      sourceUrl: "https://tonygreenberg.com/supplier-intake",
      files: [],
      formData: { email: "jane@acme.com", source_site: "tonygreenberg" },
    });
    expect(body.formData).not.toHaveProperty("website_url");
  });

  it("reports a failed or unreachable intake, and tolerates a non-JSON reply", async () => {
    fetchMock.mockResolvedValue(new Response("err", { status: 500 }));
    await expect(submitSupplierIntake(validValues())).resolves.toEqual({ ok: false, error: "Submission failed. Please try again." });
    fetchMock.mockRejectedValue(new Error("offline"));
    await expect(submitSupplierIntake(validValues())).resolves.toMatchObject({ ok: false });
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    await expect(submitSupplierIntake(validValues())).resolves.toEqual({ ok: true, supplierId: undefined });
  });
});
