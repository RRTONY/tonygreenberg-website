import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CypProfile, InteractionsExplorer } from "@/components/kava/interactions-explorer";

const search = () => screen.getByPlaceholderText("Search medications or substances...");
const substances = () => screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("InteractionsExplorer", () => {
  it("lists all 24 substances and no hard-stop banner before searching", () => {
    render(<InteractionsExplorer />);
    expect(substances()).toHaveLength(24);
    expect(screen.queryByText("Hard Stop / Critical Flag Detected")).not.toBeInTheDocument();
  });

  it("finds a substance by a brand-name alias and raises the hard-stop banner", async () => {
    render(<InteractionsExplorer />);
    await userEvent.type(search(), "Xanax");
    expect(substances()).toEqual(["Alprazolam (Xanax)"]);
    expect(screen.getByText("CRITICAL", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("Hard Stop / Critical Flag Detected")).toBeInTheDocument();
  });

  it("no banner for a safe match, and an empty-state message for no match", async () => {
    render(<InteractionsExplorer />);
    await userEvent.type(search(), "theanine");
    expect(substances()).toEqual(["L-Theanine"]);
    expect(screen.queryByText("Hard Stop / Critical Flag Detected")).not.toBeInTheDocument();
    await userEvent.clear(search());
    await userEvent.type(search(), "zzzz");
    expect(screen.getByText("No matching substances found")).toBeInTheDocument();
  });

  it("filters by severity, and pressing the same chip again clears it", async () => {
    render(<InteractionsExplorer />);
    await userEvent.click(screen.getByRole("button", { name: "RESEARCH FRONTIER" }));
    expect(substances()).toEqual(["Peyote (Mescaline)", "Psilocybin mushrooms"]);
    await userEvent.click(screen.getByRole("button", { name: "RESEARCH FRONTIER" }));
    expect(substances()).toHaveLength(24);
  });

  it("combines search and severity", async () => {
    render(<InteractionsExplorer />);
    await userEvent.type(search(), "meth");
    await userEvent.click(screen.getByRole("button", { name: "COMPLEX" }));
    expect(substances()).toEqual(["Methamphetamine (ICE)"]);
  });

  it("the clear-search (X) button has an accessible name", async () => {
    render(<InteractionsExplorer />);
    await userEvent.type(search(), "a");
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });
});

describe("CypProfile", () => {
  it("shows each enzyme's inhibition and the unaffected ones", () => {
    render(<CypProfile />);
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual(["CYP1A2", "CYP2C9", "CYP2C19", "CYP2D6", "CYP3A4"]);
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("CYP2A6, CYP2C8, CYP2E1")).toBeInTheDocument();
  });
});
