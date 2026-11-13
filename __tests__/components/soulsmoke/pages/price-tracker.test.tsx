import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PriceTracker, type PriceAlert } from "@/components/soulsmoke/pages/price-tracker";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { addPriceAlert, deletePriceAlert, listPriceAlerts } from "@/app/soul-smoke/actions";

vi.mock("@/app/soul-smoke/actions", () => ({
  listPriceAlerts: vi.fn(),
  addPriceAlert: vi.fn(),
  deletePriceAlert: vi.fn(),
}));

const list = vi.mocked(listPriceAlerts);
const add = vi.mocked(addPriceAlert);
const remove = vi.mocked(deletePriceAlert);

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <PriceTracker />
    </SoulsmokeProviders>,
  );

let nextId = 1;
const asAlert = (input: { mezcalName: string; targetPrice: number | null }): PriceAlert => ({
  ...input,
  id: String(nextId++),
  createdAt: "2026-01-01T00:00:00Z",
});

beforeEach(() => {
  list.mockReset();
  add.mockReset();
  remove.mockReset();
});

describe("PriceTracker", () => {
  it("shows the public price cards to everyone, and the sign-in section when signed out", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof listPriceAlerts>>) => void;
    list.mockReturnValue(new Promise((r) => (resolve = r)));
    renderPage();
    expect(screen.getByLabelText("Checking your alerts")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Price Tracker" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(screen.getAllByLabelText("Price rising")).toHaveLength(2);
    expect(screen.getByLabelText("Price falling")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Price stable")).toHaveLength(2);
    expect(screen.getByTitle("2025-08: $169")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "K&L Wine" })).toHaveAttribute("href", "https://klwines.com");
    fireEvent.change(screen.getByRole("textbox", { name: "Search bottles" }), { target: { value: "vago" } });
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Vago Elote"]);

    resolve({ ok: false, error: "Please sign in first.", signedOut: true });
    expect(await screen.findByRole("heading", { name: "Never Miss a Deal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In to Set Alerts" })).toHaveAttribute(
      "href",
      "/login?next=/soul-smoke/price-tracker",
    );
    expect(screen.queryByRole("button", { name: "Set Price Alert" })).toBeNull();
  });

  it("lets a member create alerts through the server, newest first, and remove them", async () => {
    list.mockResolvedValue({ ok: true, data: [] });
    add.mockImplementation(async (input) => ({ ok: true, data: asAlert(input) }));
    remove.mockResolvedValue({ ok: true, data: null });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Set Price Alert" }));
    expect(screen.queryByText("Your Active Alerts")).toBeNull();
    expect(screen.queryByText("Never Miss a Deal")).toBeNull();
    expect(screen.getByRole("button", { name: "Create Alert" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Largo" } });
    fireEvent.change(screen.getByLabelText("Target Price (optional)"), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    expect(await screen.findByText("Under $150")).toBeInTheDocument();
    expect(add).toHaveBeenCalledWith({ mezcalName: "Largo", targetPrice: 15000 });

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Tobalá" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Remove alert for Tobalá" })).toBeInTheDocument());
    expect(add).toHaveBeenLastCalledWith({ mezcalName: "Tobalá", targetPrice: null });
    expect(screen.getAllByRole("button", { name: /^Remove alert for/ }).map((b) => b.getAttribute("aria-label"))).toEqual([
      "Remove alert for Tobalá",
      "Remove alert for Largo",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove alert for Largo" }));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Remove alert for Largo" })).toBeNull());
    expect(remove).toHaveBeenCalledWith("1");
  });

  it("shows a member's saved alerts and the server's errors", async () => {
    list.mockResolvedValue({ ok: true, data: [{ id: "9", mezcalName: "Pechuga", targetPrice: null, createdAt: "" }] });
    remove.mockResolvedValue({ ok: false, error: "Try again." });
    add.mockResolvedValue({ ok: false, error: "That's a lot at once." });
    renderPage();
    expect(await screen.findByText("Your Active Alerts")).toBeInTheDocument();
    expect(screen.queryByText(/^Under/)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove alert for Pechuga" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Try again.");
    expect(screen.getByRole("button", { name: "Remove alert for Pechuga" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Set Price Alert" }));
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Largo" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    expect(await screen.findByText("That's a lot at once.")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows a load error and still lets a member try again", async () => {
    list.mockResolvedValue({ ok: false, error: "This couldn't be saved just now." });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("This couldn't be saved just now.");
    expect(screen.getByRole("button", { name: "Set Price Alert" })).toBeInTheDocument();
  });

  it("explains a dropped connection instead of failing silently", async () => {
    list.mockRejectedValue(new TypeError("Failed to fetch"));
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't reach the server");
    expect(screen.getByRole("button", { name: "Set Price Alert" })).toBeInTheDocument();
  });

  it("falls back to the sign-in section when the session ends before saving", async () => {
    list.mockResolvedValue({ ok: true, data: [] });
    add.mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Set Price Alert" }));
    fireEvent.change(screen.getByLabelText("Select Mezcal"), { target: { value: "Largo" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Alert" }));
    expect(await screen.findByRole("link", { name: "Sign In to Set Alerts" })).toBeInTheDocument();
  });

  it("ignores a list result that arrives after leaving the page", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof listPriceAlerts>>) => void;
    list.mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = renderPage();
    unmount();
    resolve({ ok: true, data: [{ id: "1", mezcalName: "Late", targetPrice: null, createdAt: "" }] });
    await Promise.resolve();
    expect(screen.queryByText("Late")).toBeNull();
  });
});
