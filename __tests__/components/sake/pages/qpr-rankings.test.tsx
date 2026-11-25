import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SakeQprRankings } from "@/components/sake/pages/qpr-rankings";
import { getAllLivePrices, getMyFavorites, getSakeMember, toggleFavorite } from "@/app/sake/actions";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(),
  getAllLivePrices: vi.fn(),
  getMyFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
}));

const SIGNED_OUT = { signedIn: false, id: null, email: null, name: null, isAdmin: false };
const SIGNED_IN = { signedIn: true, id: "u1", email: "me@example.com", name: "Mia", isAdmin: false };

const byQpr = [...qprSakeDatabase].sort((a, b) => b.qprUS - a.qprUS);
const top = byQpr[0];
const second = byQpr[1];

const rowNames = () =>
  screen
    .getAllByRole("button", { expanded: false })
    .concat(screen.queryAllByRole("button", { expanded: true }))
    .filter((b) => b.getAttribute("aria-controls")?.startsWith("sk-qpr-") && b.getAttribute("aria-controls") !== "sk-qpr-formula");

beforeEach(() => {
  vi.mocked(getSakeMember).mockResolvedValue(SIGNED_OUT);
  vi.mocked(getAllLivePrices).mockResolvedValue({
    prices: {
      [top.id]: { lowestPrice: 38.5, lowestRetailer: "Tippsy", priceDiffPct: -8, inStockCount: 4, estimated: true },
      [second.id]: { lowestPrice: null, lowestRetailer: "", priceDiffPct: 0, inStockCount: 0, estimated: true },
    },
    lastUpdated: "2026-11-26T00:00:00Z",
  });
  vi.mocked(getMyFavorites).mockResolvedValue({ ok: true, data: [] });
});

describe("SakeQprRankings", () => {
  it("lists every sake by US QPR, with tiers, tools links and the count", () => {
    renderSake(<SakeQprRankings />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("QPR Rankings");
    expect(screen.getByText(`Showing ${qprSakeDatabase.length} of ${qprSakeDatabase.length} sake`)).toBeInTheDocument();
    expect(rowNames()[0]).toHaveTextContent(top.name);
    expect(screen.getByRole("link", { name: "Sake Scanner" })).toHaveAttribute("href", "/sake/sake-scanner");
    expect(screen.getByRole("link", { name: "Dollar Maps" })).toHaveAttribute("href", "/sake/supply-chain");
    // Every row's details are in the page, hidden until opened.
    expect(document.getElementById(`sk-qpr-${top.id}`)).toHaveAttribute("hidden");
  });

  it("opens a row's details with its price box and links, and closes it again", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    await waitFor(() => expect(getAllLivePrices).toHaveBeenCalled());
    const button = rowNames()[0];
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const details = document.getElementById(`sk-qpr-${top.id}`)!;
    expect(details).not.toHaveAttribute("hidden");
    expect(await within(details).findByText("$38.50")).toBeInTheDocument();
    expect(within(details).getByText("-8%")).toBeInTheDocument();
    expect(within(details).getByRole("link", { name: /View & Buy/ })).toHaveAttribute("href", `/sake/bottle/${top.id}`);
    expect(within(details).getByRole("link", { name: /Dollar Map/ })).toHaveAttribute("href", `/sake/supply-chain?sake=${top.id}`);
    expect(within(details).queryByRole("button", { name: /Favorite/ })).not.toBeInTheDocument();
    await user.click(button);
    expect(details).toHaveAttribute("hidden");

    await user.click(rowNames()[1]);
    expect(within(document.getElementById(`sk-qpr-${second.id}`)!).getByText("Out of stock")).toBeInTheDocument();
  });

  it("shows the connoisseur numbers in Connoisseur mode", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    await user.click(screen.getByTestId("toggle-mode"));
    expect(within(document.getElementById(`sk-qpr-${top.id}`)!).getByText(/SMV:/)).toBeInTheDocument();
  });

  it("sorts by any column both ways", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    const qprHeader = screen.getByRole("columnheader", { name: /QPR/ });
    expect(qprHeader).toHaveAttribute("aria-sort", "descending");
    await user.click(within(qprHeader).getByRole("button"));
    expect(qprHeader).toHaveAttribute("aria-sort", "ascending");
    expect(rowNames()[0]).toHaveTextContent(byQpr[byQpr.length - 1].name);

    await user.click(screen.getByRole("button", { name: /^Sake/ }));
    const names = [...qprSakeDatabase].map((s) => s.name).sort((a, b) => b.localeCompare(a));
    expect(rowNames()[0]).toHaveTextContent(names[0]);
    await user.click(screen.getByRole("button", { name: /^Sake/ }));
    expect(rowNames()[0]).toHaveTextContent(names[names.length - 1]);

    for (const name of [/^Quality/, /^EXV/, /^Price/]) {
      await user.click(screen.getByRole("button", { name }));
      expect(screen.getByRole("columnheader", { name })).toHaveAttribute("aria-sort", "descending");
    }
  });

  it("switches to Japan prices and QPR", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    await user.click(screen.getByRole("button", { name: "JP" }));
    expect(screen.getByRole("button", { name: "JP" })).toHaveAttribute("aria-pressed", "true");
    await user.click(within(screen.getByRole("columnheader", { name: /QPR/ })).getByRole("button"));
    expect(screen.getByRole("columnheader", { name: /QPR/ })).toHaveAttribute("aria-sort", "descending");
    const jpTop = [...qprSakeDatabase].sort((a, b) => b.qprJapan - a.qprJapan)[0];
    expect(rowNames()[0]).toHaveTextContent(jpTop.name);
  });

  it("filters by search, type and tier, and clears", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    await user.type(screen.getByRole("searchbox"), "zzzz-none");
    expect(screen.getByText("No sake match your filters")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.getByText(`Showing ${qprSakeDatabase.length} of ${qprSakeDatabase.length} sake`)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "All Types" }), top.type);
    const ofType = qprSakeDatabase.filter((s) => s.type === top.type).length;
    expect(screen.getByText(`Showing ${ofType} of ${qprSakeDatabase.length} sake`)).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "All Types" }), "all");
    await user.selectOptions(screen.getByRole("combobox", { name: "All Tiers" }), top.qprTier);
    const ofTier = qprSakeDatabase.filter((s) => s.qprTier === top.qprTier).length;
    expect(screen.getByText(`Showing ${ofTier} of ${qprSakeDatabase.length} sake`)).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: "All Tiers" }), "all");
    await user.type(screen.getByRole("searchbox"), top.brewery);
    expect(rowNames().some((b) => b.textContent?.includes(top.name))).toBe(true);
  });

  it("opens the formula in the page language", async () => {
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    const toggle = screen.getByRole("button", { name: /How QPR Works/ });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/QPR = \(Quality Score/)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByText(/QPR = \(品質スコア/)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("font-light");
  });

  it("lets a member favorite and unfavorite a sake", async () => {
    const user = userEvent.setup();
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getMyFavorites).mockResolvedValue({ ok: true, data: [{ id: 1, sakeId: second.id, sakeName: second.name, targetPrice: null, createdAt: "x" }] });
    vi.mocked(toggleFavorite).mockResolvedValueOnce({ ok: true, data: { favorited: true } }).mockResolvedValueOnce({ ok: true, data: { favorited: false } });
    renderSake(<SakeQprRankings />);
    await waitFor(() => expect(getMyFavorites).toHaveBeenCalled());
    await user.click(rowNames()[0]);
    const details = document.getElementById(`sk-qpr-${top.id}`)!;
    const fav = await within(details).findByRole("button", { name: /Favorite/ });
    await user.click(fav);
    await waitFor(() => expect(within(details).getByRole("button", { name: /Favorited/ })).toHaveAttribute("aria-pressed", "true"));
    expect(toggleFavorite).toHaveBeenCalledWith(top.id);
    await user.click(within(details).getByRole("button", { name: /Favorited/ }));
    await waitFor(() => expect(within(details).getByRole("button", { name: /Favorite/ })).toHaveAttribute("aria-pressed", "false"));
    expect(within(document.getElementById(`sk-qpr-${second.id}`)!).getByRole("button", { name: /Favorited/, hidden: true })).toBeInTheDocument();
  });

  it("keeps working when prices or favorites fail to load", async () => {
    vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
    vi.mocked(getAllLivePrices).mockRejectedValue(new Error("down"));
    vi.mocked(getMyFavorites).mockRejectedValue(new Error("down"));
    vi.mocked(toggleFavorite).mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    const user = userEvent.setup();
    renderSake(<SakeQprRankings />);
    await waitFor(() => expect(getMyFavorites).toHaveBeenCalled());
    await user.click(rowNames()[0]);
    const details = document.getElementById(`sk-qpr-${top.id}`)!;
    await user.click(await within(details).findByRole("button", { name: /Favorite/ }));
    await waitFor(() => expect(within(details).getByRole("button", { name: /Favorite/ })).toHaveAttribute("aria-pressed", "false"));
    expect(within(details).queryByText("LIVE PRICES")).not.toBeInTheDocument();
  });
});
