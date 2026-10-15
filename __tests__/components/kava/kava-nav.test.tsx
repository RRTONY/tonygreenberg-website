import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigation } from "../../helpers/next";
import { KavaFooter, KavaNav } from "@/components/kava/kava-nav";

const PATHS = ["/kava", "/kava/origins", "/kava/interactions", "/kava/science", "/kava/assessment", "/kava/hawaii", "/kava/myths", "/kava/caffeine", "/kava/products", "/kava/certification"];

describe("KavaNav", () => {
  it("links all ten Kava pages and back to the main site", () => {
    render(<KavaNav />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    PATHS.forEach((p) => expect(hrefs).toContain(p));
    expect(screen.getByRole("link", { name: "Back to TonyGreenberg.com" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /PRI KAVA/ })).toHaveAttribute("href", "/kava");
  });

  it("highlights the current page", () => {
    navigation.pathname = "/kava/myths";
    render(<KavaNav />);
    expect(screen.getByRole("link", { name: "Myths" }).className).toContain("bg-kava-saffron");
    expect(screen.getByRole("link", { name: "Science" }).className).not.toContain("bg-kava-saffron");
  });

  it("opens the mobile menu with full labels and closes it on a pick", async () => {
    render(<KavaNav />);
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
    const menu = screen.getAllByRole("navigation")[1];
    expect(within(menu).getByRole("link", { name: "Facilitator Certification" })).toHaveAttribute("href", "/kava/certification");
    await userEvent.click(within(menu).getByRole("link", { name: "Drug Interactions" }));
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });
});

describe("KavaFooter", () => {
  it("says it isn't medical advice and links Kava home, the full PRI and the main site", () => {
    render(<KavaFooter />);
    expect(screen.getByText(/Not medical advice/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kava Home" })).toHaveAttribute("href", "/kava");
    expect(screen.getByRole("link", { name: "Full PRI" })).toHaveAttribute("href", "/psychedelic-readiness-index");
    expect(screen.getByRole("link", { name: "TonyGreenberg.com" })).toHaveAttribute("href", "/");
  });
});
