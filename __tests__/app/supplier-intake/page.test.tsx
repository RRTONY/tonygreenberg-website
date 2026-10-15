import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SupplierIntakePage, { metadata } from "@/app/supplier-intake/page";

vi.mock("@/app/supplier-intake/actions", () => ({ submitSupplierIntake: vi.fn() }));
afterEach(() => {
  vi.unstubAllEnvs();
});
describe("/supplier-intake", () => {
  it("has an absolute title, description, canonical and share title", () => {
    expect(metadata.title).toEqual({ absolute: "Supplier Application — Peptide Supply Partner (Stage 1)" });
    expect(metadata.description).toMatch(/verified peptide supply partner/);
    expect(metadata.alternates?.canonical).toBe("/supplier-intake");
    expect(metadata.openGraph).toMatchObject({ url: "/supplier-intake", title: "Supplier Application — Peptide Supply Partner (Stage 1)" });
    expect((metadata.openGraph as { images?: unknown }).images).toBeDefined();
  });

  it("renders one H1, the first step of the form, and the RampRate hand-off", () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://script.google.test/exec");
    render(<SupplierIntakePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Stage 1: Supplier Profile");
    expect(screen.getByLabelText(/Legal Entity Name/)).toBeInTheDocument();
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href")?.includes("ramprate.com/biochain"))).toBe(true);
  });
});
