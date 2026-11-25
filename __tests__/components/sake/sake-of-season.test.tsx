import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeOfSeason, microseasonIndexFor } from "@/components/sake/sake-of-season";
import { microseasons } from "@/lib/content/sake/culture-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("microseasonIndexFor", () => {
  it("maps the day of the year onto the list, as the app did", () => {
    expect(microseasonIndexFor(new Date(2026, 0, 1))).toBe(0);
    expect(microseasonIndexFor(new Date(2026, 11, 31))).toBe(microseasons.length - 1);
    expect(microseasonIndexFor(new Date(2026, 6, 2))).toBe(Math.floor((183 / 365) * microseasons.length));
  });
});

describe("SakeOfSeason", () => {
  it("shows today's microseason in the browser and links to all 72", () => {
    render(
      <SakeProviders>
        <SakeOfSeason />
      </SakeProviders>,
    );
    const season = microseasons[microseasonIndexFor(new Date())];
    expect(screen.getByRole("heading", { level: 3, name: season.period })).toBeInTheDocument();
    expect(screen.getByText(season.sake)).toBeInTheDocument();
    expect(screen.getByText(season.food)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /All 72 Seasons/ })).toHaveAttribute("href", "/sake/microseasons");
  });

  it("leaves its space empty on the server, where today's date isn't known", () => {
    const html = renderToString(
      <SakeProviders>
        <SakeOfSeason />
      </SakeProviders>,
    );
    expect(html).not.toContain("Sake of the Season");
  });
});
