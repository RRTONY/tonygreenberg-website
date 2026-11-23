import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { Compare } from "@/components/aqueous/pages/compare";
import { bottledWaters } from "@/lib/content/aqueous/water-data";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

const [a, , b] = bottledWaters;

describe("Compare", () => {
  it("compares the app's default pair (waters 1 and 3)", async () => {
    render(<AqueousProviders><Compare /></AqueousProviders>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Compare Waters");
    const table = screen.getByRole("table");
    expect(within(table).getByRole("columnheader", { name: a.name })).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: b.name })).toBeInTheDocument();
    expect(within(table).getByText("Certifications")).toBeInTheDocument();
    expect(screen.getAllByText("QPR Engine Score")).toHaveLength(2);
    const bars = screen.getAllByTestId("compare-bar-fill");
    expect(bars).toHaveLength(24);
    await waitFor(() => expect(bars[0].style.width).not.toBe("0%"));
    expect(bars[1].style.transitionDelay).toBe("0.1s");
  });

  it("swaps a water from the selector, which leaves out the other side's pick", async () => {
    const user = userEvent.setup();
    render(<AqueousProviders><Compare /></AqueousProviders>);
    const pickA = screen.getByRole("button", { name: `Water A: ${a.name}. Change water` });
    await user.click(pickA);
    expect(pickA).toHaveAttribute("aria-expanded", "true");
    const options = screen.getAllByRole("button").filter((el) => el.closest(".max-h-64"));
    expect(options.map((o) => o.textContent)).not.toContain(expect.stringContaining(b.name));
    expect(options.some((o) => o.textContent?.includes(b.name))).toBe(false);
    const next = bottledWaters[1];
    await user.click(options.find((o) => o.textContent?.includes(next.name))!);
    expect(screen.getByRole("button", { name: `Water A: ${next.name}. Change water` })).toHaveAttribute("aria-expanded", "false");
    expect(within(screen.getByRole("table")).getByRole("columnheader", { name: next.name })).toBeInTheDocument();
  });

  it("renders certifications as None when a water has none", () => {
    const original = bottledWaters[0].certifications;
    bottledWaters[0].certifications = [];
    try {
      render(<AqueousProviders><Compare /></AqueousProviders>);
      expect(within(screen.getByRole("table")).getByText("None")).toBeInTheDocument();
    } finally {
      bottledWaters[0].certifications = original;
    }
  });
});
