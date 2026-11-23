import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { WaterExplorer } from "@/components/aqueous/pages/water-explorer";
import { bottledWaters } from "@/lib/content/aqueous/water-data";
import { calculateAWI, defaultProfile } from "@/lib/content/aqueous/awi-engine";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));
// The card itself is tested in water-card.test.tsx; here only the order and count matter.
vi.mock("@/components/aqueous/water-card", () => ({
  WaterCard: ({ water }: { water: { name: string } }) => <div data-testid="card">{water.name}</div>,
}));

const renderPage = () => render(<AqueousProviders><WaterExplorer /></AqueousProviders>);
const cards = () => screen.queryAllByTestId("card").map((c) => c.textContent);
const names = (list: typeof bottledWaters) => list.map((w) => w.name);
const awi = (w: (typeof bottledWaters)[number]) => calculateAWI(w, defaultProfile).personalScore;

describe("WaterExplorer", () => {
  it("lists every water, best AWI first", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Water Explorer");
    expect(screen.getByText(`${bottledWaters.length} waters found`)).toBeInTheDocument();
    expect(cards()).toEqual(names([...bottledWaters].sort((a, b) => awi(a) - awi(b))));
  });

  it("searches by name, brand or location, with a no-results message", async () => {
    const user = userEvent.setup();
    renderPage();
    const box = screen.getByLabelText("Search waters");
    await user.type(box, "fiji");
    const hits = bottledWaters.filter((w) => `${w.name} ${w.brand} ${w.sourceLocation}`.toLowerCase().includes("fiji"));
    expect(hits.length).toBeGreaterThan(0);
    expect([...cards()].sort()).toEqual(names(hits).sort());
    await user.clear(box);
    await user.type(box, "zzzz-nothing");
    expect(screen.getByText("0 waters found")).toBeInTheDocument();
    expect(screen.getByText("No waters match your search criteria.")).toBeInTheDocument();
  });

  it("filters by source and applies every sort", async () => {
    const user = userEvent.setup();
    renderPage();
    const source = screen.getByLabelText("Filter by source");
    await user.selectOptions(source, "spring");
    const springs = bottledWaters.filter((w) => w.type === "spring");
    expect(cards()).toHaveLength(springs.length);
    expect(screen.getByText(`${springs.length} water${springs.length !== 1 ? "s" : ""} found`)).toBeInTheDocument();
    await user.selectOptions(source, "all");

    const sort = screen.getByLabelText("Sort by");
    const cases: [string, (a: (typeof bottledWaters)[number], b: (typeof bottledWaters)[number]) => number][] = [
      ["awi-worst", (a, b) => awi(b) - awi(a)],
      ["qpr-high", (a, b) => b.qpr.overall - a.qpr.overall],
      ["qpr-low", (a, b) => a.qpr.overall - b.qpr.overall],
      ["price-low", (a, b) => a.pricePerGallon - b.pricePerGallon],
      ["price-high", (a, b) => b.pricePerGallon - a.pricePerGallon],
      ["value-high", (a, b) => b.qpr.valueRatio - a.qpr.valueRatio],
      ["awi-best", (a, b) => awi(a) - awi(b)],
    ];
    for (const [value, cmp] of cases) {
      await user.selectOptions(sort, value);
      expect(cards()).toEqual(names([...bottledWaters].sort(cmp)));
    }
  });

  it("opens the mobile filters, which drive the same state", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByLabelText("Sort by (mobile)")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.selectOptions(screen.getByLabelText("Sort by (mobile)"), "price-low");
    expect(cards()[0]).toBe([...bottledWaters].sort((a, b) => a.pricePerGallon - b.pricePerGallon)[0].name);
    await user.selectOptions(screen.getByLabelText("Filter by source (mobile)"), "purified");
    expect(screen.getByLabelText("Filter by source")).toHaveValue("purified");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.queryByLabelText("Sort by (mobile)")).toBeNull();
  });
});
