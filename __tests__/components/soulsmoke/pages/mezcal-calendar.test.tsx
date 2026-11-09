import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MezcalCalendar } from "@/components/soulsmoke/pages/mezcal-calendar";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

function renderCalendar() {
  return render(
    <SoulsmokeProviders>
      <MezcalCalendar />
    </SoulsmokeProviders>,
  );
}

const eventNames = () => screen.queryAllByRole("heading", { level: 2 }).map((h) => h.textContent);

describe("MezcalCalendar", () => {
  afterEach(() => vi.restoreAllMocks());

  it("lists every event by date, with UTC dates (no off-by-one day)", () => {
    renderCalendar();
    expect(screen.getByRole("heading", { level: 1, name: "Mezcal Calendar" })).toBeInTheDocument();
    expect(eventNames()).toEqual([
      "PM Spirits Producer Tasting",
      "Mexico in a Bottle / Mezcal Week",
      "Mezcal Sommelier Certification",
      "Agave Heritage Festival",
      "Del Maguey Village Tour",
      "Feria Internacional del Mezcal",
      "Tales of the Cocktail",
      "Agave Spirits Summit",
    ]);
    expect(screen.getByText("Jul 15, 2026 - Jul 26, 2026")).toBeInTheDocument();
    expect(screen.getAllByText("Annual")).toHaveLength(4);
    expect(screen.getByText("producer visit")).toHaveClass("text-emerald-300");
    expect(screen.getByRole("link", { name: "Submit an Event" })).toHaveAttribute("href", "mailto:events@mezcal.com");
  });

  it("filters by type and location, and says when nothing matches", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.selectOptions(screen.getByLabelText("Event Type"), "conference");
    expect(eventNames()).toEqual(["Tales of the Cocktail", "Agave Spirits Summit"]);
    await user.selectOptions(screen.getByLabelText("Location"), "mexico");
    expect(eventNames()).toEqual([]);
    expect(screen.getByText("No events match your filters")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Event Type"), "all");
    expect(eventNames()).toHaveLength(3);
    for (const type of ["festival", "tasting", "education"]) {
      await user.selectOptions(screen.getByLabelText("Event Type"), type);
    }
  });

  it("opens Google Calendar with the event filled in", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();
    renderCalendar();
    const tasting = screen.getByRole("heading", { level: 2, name: "PM Spirits Producer Tasting" }).parentElement!;
    await user.click(within(tasting).getByRole("button", { name: "Add to Calendar" }));
    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("dates=20260220T000000Z/20260220T000000Z"),
      "_blank",
    );
    const feria = screen.getByRole("heading", { level: 2, name: "Feria Internacional del Mezcal" }).parentElement!;
    await user.click(within(feria).getByRole("button", { name: "Add to Calendar" }));
    expect(open).toHaveBeenLastCalledWith(
      expect.stringContaining("text=Feria%20Internacional%20del%20Mezcal&dates=20260715T000000Z/20260726T000000Z"),
      "_blank",
    );
  });
});
