import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { WaterDetail } from "@/components/aqueous/pages/water-detail";
import { bottledWaters, type WaterProduct } from "@/lib/content/aqueous/water-data";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

const base = bottledWaters[0];

describe("WaterDetail", () => {
  it("renders the water's facts, AWI breakdown, QPR bars, contaminants, minerals and sources", async () => {
    render(<AqueousProviders><WaterDetail water={base} /></AqueousProviders>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(base.name);
    expect(screen.getByText(base.sourceDescription)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Explorer/ })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("img", { name: base.name })).toBeInTheDocument();
    expect(screen.getByText(`$${base.pricePerGallon.toFixed(2)}/gal`)).toBeInTheDocument();
    expect(screen.getByText("Your Personalized AWI Breakdown")).toBeInTheDocument();
    for (const c of base.contaminants) expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Mineral Profile" })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Year tested: ${base.yearTested}`))).toBeInTheDocument();

    const bars = screen.getAllByTestId("score-bar-fill");
    expect(bars).toHaveLength(12);
    const pct = (base.qpr.qualityBreakdown.sourceIntegrity / 25) * 100;
    await waitFor(() => expect(bars[0].style.width).toBe(`${pct}%`));
  });

  it("shows each contaminant status and hides empty minerals and certifications", () => {
    const water: WaterProduct = {
      ...base,
      certifications: [],
      minerals: [],
      contaminants: [
        { ...base.contaminants[0], name: "Safe one", status: "safe", epaLimit: 1, ewgLimit: 1 },
        { ...base.contaminants[0], name: "Caution one", status: "caution", epaLimit: 0, ewgLimit: 0 },
        { ...base.contaminants[0], name: "Danger one", status: "danger" as WaterProduct["contaminants"][number]["status"] },
      ],
    };
    render(<AqueousProviders><WaterDetail water={water} /></AqueousProviders>);
    expect(screen.getByText("safe")).toHaveClass("bg-green-100");
    expect(screen.getByText("caution")).toHaveClass("bg-amber-100");
    expect(screen.getByText("danger")).toHaveClass("bg-red-100");
    expect(screen.getByText("No limit set")).toBeInTheDocument();
    expect(screen.getByText("No guideline")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Mineral Profile" })).toBeNull();
  });
});
