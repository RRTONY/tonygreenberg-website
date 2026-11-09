import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TASTING_JOURNAL_KEY, TastingJournal, toTastingEntry } from "@/components/soulsmoke/pages/tasting-journal";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

const renderPage = () =>
  render(
    <SoulsmokeProviders>
      <TastingJournal />
    </SoulsmokeProviders>,
  );
const saved = () => JSON.parse(window.localStorage.getItem(TASTING_JOURNAL_KEY) ?? "[]");

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

describe("toTastingEntry", () => {
  it("mirrors the server checks: name required, ratings 1 to 5, blanks dropped", () => {
    expect(toTastingEntry({ ...form, mezcalName: "   " })).toBeNull();
    const entry = toTastingEntry(form, new Date("2026-01-02T00:00:00Z"))!;
    expect(entry).toMatchObject({
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
  it("shows the intro and empty journal to a first-time visitor, no sign-in", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Your Tasting Journal" })).toBeInTheDocument();
    expect(screen.getByText(/Track every mezcal you taste/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your journal is empty" })).toBeInTheDocument();
    expect(screen.queryByText(/Sign In/)).toBeNull();
  });

  it("logs a full tasting, shows it, and deletes it", () => {
    renderPage();
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

    expect(saved()).toEqual([
      expect.objectContaining({ mezcalName: "Tepextate", rating: 4, smokeLevel: 5, sweetnessLevel: 1, complexityLevel: 4, wouldBuyAgain: true }),
    ]);
    expect(screen.getByText("1 mezcals tasted • Welcome back, explorer")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Tepextate" })).toBeInTheDocument();
    expect(screen.getByLabelText("Rated 4 of 5")).toBeInTheDocument();
    expect(screen.getByText("Green chile, wet stone")).toBeInTheDocument();
    expect(screen.getByText("Would buy again")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete Tepextate" }));
    expect(saved()).toEqual([]);
  });

  it("shows a minimal saved entry and a would-not-buy entry, and cancels the form", () => {
    window.localStorage.setItem(
      TASTING_JOURNAL_KEY,
      JSON.stringify([{ id: "1", mezcalName: "Bare", wouldBuyAgain: false, tastedAt: "2026-01-01T00:00:00Z" }]),
    );
    renderPage();
    expect(screen.getByText("Would not buy again")).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Rated/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("won't save a blank name", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }));
    fireEvent.change(screen.getByLabelText("Mezcal Name *"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("button", { name: "Save Entry" }).closest("form")!);
    expect(saved()).toEqual([]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
