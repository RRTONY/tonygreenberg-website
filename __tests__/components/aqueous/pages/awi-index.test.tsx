import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { AWIIndex } from "@/components/aqueous/pages/awi-index";
import { bottledWaters } from "@/lib/content/aqueous/water-data";
import { calculateAWI, defaultProfile } from "@/lib/content/aqueous/awi-engine";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
}));

const renderPage = () => render(<AqueousProviders><AWIIndex /></AqueousProviders>);

const byScore = [...bottledWaters].sort(
  (a, b) => calculateAWI(a, defaultProfile).personalScore - calculateAWI(b, defaultProfile).personalScore,
);

function rowNames() {
  // Desktop rows only (each water also has a mobile row).
  return screen
    .getAllByRole("button", { name: /show dimension breakdown/ })
    .filter((_, i) => i % 2 === 0)
    .map((el) => el.getAttribute("aria-label")!.replace(": show dimension breakdown", ""));
}

describe("AWIIndex", () => {
  it("renders the hero, grade scale and the default-profile ranking, best first", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Water. Your Score.");
    expect(screen.getByText("1 (PERFECT)")).toBeInTheDocument();
    expect(screen.getByText(/Using default balanced profile/)).toBeInTheDocument();
    expect(rowNames()).toEqual(byScore.map((w) => w.name));
    const details = screen.getAllByRole("link", { name: /Details/ });
    expect(details[0]).toHaveAttribute("href", `/aqueous/water/${byScore[0].id}`);
    expect(screen.getByRole("link", { name: /Read the Manifesto/ })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByRole("link", { name: /Take the Survey/ })).toHaveAttribute("href", "/aqueous/tap-water");
  });

  it("flips the sort order", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Best First" }));
    expect(screen.getByRole("button", { name: "Worst First" })).toBeInTheDocument();
    const worstFirst = [...bottledWaters].sort(
      (a, b) => calculateAWI(b, defaultProfile).personalScore - calculateAWI(a, defaultProfile).personalScore,
    );
    expect(rowNames()).toEqual(worstFirst.map((w) => w.name));
    await user.click(screen.getByRole("button", { name: "Worst First" }));
    expect(rowNames()[0]).toBe(byScore[0].name);
  });

  it("tunes and resets weights", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Tune Weights" }));
    const slider = screen.getByLabelText("Health Priority");
    expect(slider).toHaveValue(String(defaultProfile.healthPriority));
    fireEvent.change(slider, { target: { value: "10" } });
    expect(screen.getByLabelText("Health Priority")).toHaveValue("10");
    expect(screen.getByText(/Scores reflect your Water Profile survey/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset to Default" }));
    expect(screen.getByLabelText("Health Priority")).toHaveValue(String(defaultProfile.healthPriority));
    await user.click(screen.getByRole("button", { name: "Hide Weights" }));
    expect(screen.queryByLabelText("Health Priority")).toBeNull();
  });

  it("opens a water's breakdown by click or keyboard, and the Details link doesn't toggle it", async () => {
    const user = userEvent.setup();
    renderPage();
    const [desktopRow, mobileRow] = screen.getAllByRole("button", { name: `${byScore[0].name}: show dimension breakdown` });
    await user.click(desktopRow);
    expect(desktopRow).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: `${byScore[0].name} — Dimension Breakdown` })).toBeInTheDocument();
    expect(screen.getByText("Sustainability")).toBeInTheDocument();
    await user.click(desktopRow);
    expect(screen.queryByText(/— Dimension Breakdown/)).toBeNull();

    fireEvent.keyDown(mobileRow, { key: "Enter" });
    expect(screen.getByText(/— Dimension Breakdown/)).toBeInTheDocument();
    fireEvent.keyDown(mobileRow, { key: " " });
    expect(screen.queryByText(/— Dimension Breakdown/)).toBeNull();
    fireEvent.keyDown(mobileRow, { key: "a" });
    expect(screen.queryByText(/— Dimension Breakdown/)).toBeNull();

    const link = within(desktopRow).getByRole("link", { name: /Details/ });
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: "Enter" });
    fireEvent.click(within(mobileRow).getByRole("link", { name: /Details/ }));
    fireEvent.keyDown(within(mobileRow).getByRole("link", { name: /Details/ }), { key: "Enter" });
    expect(screen.queryByText(/— Dimension Breakdown/)).toBeNull();
  });
});
