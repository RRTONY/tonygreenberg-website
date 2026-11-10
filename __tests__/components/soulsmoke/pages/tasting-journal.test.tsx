import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TastingJournal, toTastingEntry, type TastingEntry } from "@/components/soulsmoke/pages/tasting-journal";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { addTastingEntry, deleteTastingEntry, listTastingEntries } from "@/app/soul-smoke/actions";

vi.mock("@/app/soul-smoke/actions", () => ({
  listTastingEntries: vi.fn(),
  addTastingEntry: vi.fn(),
  deleteTastingEntry: vi.fn(),
}));

const list = vi.mocked(listTastingEntries);
const add = vi.mocked(addTastingEntry);
const remove = vi.mocked(deleteTastingEntry);

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <TastingJournal />
    </SoulsmokeProviders>,
  );

const entry = (over: Partial<TastingEntry> = {}): TastingEntry => ({
  id: "1",
  mezcalName: "Bare",
  wouldBuyAgain: false,
  tastedAt: "2026-01-01T00:00:00Z",
  ...over,
});

const form = {
  mezcalName: "  Real Minero Largo ",
  producer: "Real Minero",
  agaveType: "",
  region: "",
  abv: "",
  rating: 0,
  notes: "",
  smokeLevel: 9,
  sweetnessLevel: 3,
  complexityLevel: 3,
  wouldBuyAgain: false,
};

beforeEach(() => {
  list.mockReset();
  add.mockReset();
  remove.mockReset();
});

describe("toTastingEntry", () => {
  it("mirrors the server checks: name required, ratings 1 to 5, blanks dropped", () => {
    expect(toTastingEntry({ ...form, mezcalName: "   " })).toBeNull();
    expect(toTastingEntry(form, new Date("2026-01-02T00:00:00Z"))).toMatchObject({
      mezcalName: "Real Minero Largo",
      producer: "Real Minero",
      agaveType: undefined,
      rating: undefined,
      smokeLevel: undefined,
      sweetnessLevel: 3,
      wouldBuyAgain: false,
      tastedAt: "2026-01-02T00:00:00.000Z",
    });
  });
});

describe("TastingJournal", () => {
  it("shows a spinner, then the original sign-in screen to a signed-out visitor", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof listTastingEntries>>) => void;
    list.mockReturnValue(new Promise((r) => (resolve = r)));
    renderPage();
    expect(screen.getByLabelText("Loading your journal")).toBeInTheDocument();
    resolve({ ok: false, error: "Please sign in first.", signedOut: true });
    expect(await screen.findByRole("link", { name: "Sign In to Start Your Journal" })).toHaveAttribute(
      "href",
      "/login?next=/soul-smoke/tasting-journal",
    );
    expect(screen.getByRole("heading", { level: 1, name: "Your Tasting Journal" })).toBeInTheDocument();
    expect(screen.getByText(/Track every mezcal you taste/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add Entry" })).toBeNull();
  });

  it("shows a member's empty journal, logs a full tasting through the server, and deletes it", async () => {
    list.mockResolvedValue({ ok: true, data: [] });
    add.mockImplementation(async (input) => ({
      ok: true,
      data: { ...input, id: "42", tastedAt: "2026-02-01T00:00:00Z" } as TastingEntry,
    }));
    remove.mockResolvedValue({ ok: true, data: null });
    renderPage();
    expect(await screen.findByRole("heading", { name: "Your journal is empty" })).toBeInTheDocument();
    expect(screen.getByText("0 mezcals tasted • Welcome back, explorer")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add Your First Entry" }));
    expect(screen.getByRole("dialog", { name: "Log a Tasting" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Tepextate" } });
    fireEvent.change(screen.getByLabelText("Producer"), { target: { value: "Rey Campero" } });
    fireEvent.change(screen.getByLabelText("Agave Type"), { target: { value: "Tepextate" } });
    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "Candelaria Yegolé" } });
    fireEvent.change(screen.getByLabelText("ABV"), { target: { value: "49%" } });
    fireEvent.change(screen.getByLabelText("Tasting Notes"), { target: { value: "Green chile, wet stone" } });
    fireEvent.click(screen.getByRole("button", { name: "Overall Rating: 4 of 5" }));
    fireEvent.click(screen.getByRole("button", { name: "Smoke: 5 of 5" }));
    fireEvent.click(screen.getByRole("button", { name: "Sweetness: 1 of 5" }));
    fireEvent.click(screen.getByRole("button", { name: "Complexity: 4 of 5" }));
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Entry" }));

    expect(await screen.findByRole("heading", { level: 3, name: "Tepextate" })).toBeInTheDocument();
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        mezcalName: "Tepextate",
        producer: "Rey Campero",
        rating: 4,
        smokeLevel: 5,
        sweetnessLevel: 1,
        complexityLevel: 4,
        wouldBuyAgain: true,
      }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("1 mezcals tasted • Welcome back, explorer")).toBeInTheDocument();
    expect(screen.getByLabelText("Rated 4 of 5")).toBeInTheDocument();
    expect(screen.getByText("Green chile, wet stone")).toBeInTheDocument();
    expect(screen.getByText("Would buy again")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Tepextate" }));
    await waitFor(() => expect(screen.queryByRole("heading", { level: 3, name: "Tepextate" })).toBeNull());
    expect(remove).toHaveBeenCalledWith("42");
  });

  it("shows a minimal saved entry and a would-not-buy entry, and cancels the form", async () => {
    list.mockResolvedValue({ ok: true, data: [entry()] });
    renderPage();
    expect(await screen.findByText("Would not buy again")).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Rated/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("won't send a blank name", async () => {
    list.mockResolvedValue({ ok: true, data: [] });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Add Entry" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: "Save Entry" }).closest("form")!);
    expect(add).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows the server's errors when loading, saving or deleting fails", async () => {
    list.mockResolvedValue({ ok: false, error: "This couldn't be saved just now." });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("This couldn't be saved just now.");
    expect(screen.getByRole("heading", { name: "Your journal is empty" })).toBeInTheDocument();

    add.mockResolvedValue({ ok: false, error: "That's a lot at once." });
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Largo" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Entry" }));
    expect(await screen.findByText("That's a lot at once.")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("keeps an entry when deleting fails", async () => {
    list.mockResolvedValue({ ok: true, data: [entry({ mezcalName: "Keep" })] });
    remove.mockResolvedValue({ ok: false, error: "Try again." });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Delete Keep" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Try again.");
    expect(screen.getByRole("heading", { level: 3, name: "Keep" })).toBeInTheDocument();
  });

  it("switches to the sign-in screen when the session ends before saving", async () => {
    list.mockResolvedValue({ ok: true, data: [] });
    add.mockResolvedValue({ ok: false, error: "Please sign in first.", signedOut: true });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Add Entry" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "Largo" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Entry" }));
    expect(await screen.findByRole("link", { name: "Sign In to Start Your Journal" })).toBeInTheDocument();
  });

  it("ignores a list result that arrives after leaving the page", async () => {
    let resolve!: (v: Awaited<ReturnType<typeof listTastingEntries>>) => void;
    list.mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = renderPage();
    unmount();
    resolve({ ok: true, data: [entry()] });
    await Promise.resolve();
    expect(screen.queryByText("Bare")).toBeNull();
  });
});
