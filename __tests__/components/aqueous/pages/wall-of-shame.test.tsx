import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { WallOfShame, brandMatrixData, formatMarketing, plasticArticles, shameData } from "@/components/aqueous/pages/wall-of-shame";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

describe("formatMarketing", () => {
  it("formats millions, billions and zero as the app did", () => {
    expect(formatMarketing(0)).toBe("$0");
    expect(formatMarketing(200)).toBe("$200M");
    expect(formatMarketing(5100)).toBe("$5.1B");
  });
});

describe("WallOfShame", () => {
  it("renders the matrix, offenders, articles and calls to action", async () => {
    render(<AqueousProviders><WallOfShame /></AqueousProviders>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Wall of Shame");

    // Matrix: biggest spender first, bar widths relative to the biggest.
    const bars = screen.getAllByTestId("marketing-bar");
    expect(bars).toHaveLength(brandMatrixData.length);
    expect(bars[0].style.width).toBe("100%");
    expect(bars.at(-1)!.style.width).toBe("0%");
    expect(screen.getAllByText("RECOMMENDED").length).toBe(brandMatrixData.filter((d) => d.qpr >= 80).length);
    expect(screen.getAllByText("MEDIOCRE").length).toBe(brandMatrixData.filter((d) => d.qpr >= 55 && d.qpr < 80).length);
    expect(screen.getAllByText("SHAMEFUL").length).toBe(brandMatrixData.filter((d) => d.qpr < 55).length);
    expect(screen.getAllByText("Plastic").length).toBe(brandMatrixData.filter((d) => d.plastic).length);
    expect(screen.getAllByText("$5.1B").length).toBeGreaterThan(0);

    // Offenders, worst QPR first; only those with a water page link to it.
    const offenders = screen.getAllByRole("heading", { level: 3 }).filter((h) => shameData.some((s) => s.brand === h.textContent));
    expect(offenders.map((h) => h.textContent)).toEqual([...shameData].sort((x, y) => x.waterQPR - y.waterQPR).map((s) => s.brand));
    const breakdownLinks = screen.getAllByRole("link", { name: /View Full QPR Breakdown/ });
    expect(breakdownLinks.map((l) => l.getAttribute("href"))).toContain("/aqueous/water/dasani");
    expect(breakdownLinks).toHaveLength(shameData.filter((s) => s.waterId).length);

    // Articles: outside sources open in a new tab; Tony's own essay is this site's post.
    const pnas = screen.getByRole("link", { name: new RegExp(plasticArticles[0].title) });
    expect(pnas).toHaveAttribute("target", "_blank");
    const essay = screen.getByRole("link", { name: /Forever Chemicals in My Blood/ });
    expect(essay).toHaveAttribute("href", "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics");
    expect(essay).not.toHaveAttribute("target");

    expect(screen.getByRole("link", { name: /See Our RO Filter Guide/ })).toHaveAttribute("href", "/aqueous/filter-guide");
    expect(within(screen.getByText("What You Can Do Right Now").parentElement!).getByText("Share the Truth")).toBeInTheDocument();
  });
});
