import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MythsExplorer } from "@/components/kava/myths-explorer";

describe("MythsExplorer", () => {
  it("lists all seven myths with their verdicts", () => {
    render(<MythsExplorer />);
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles).toHaveLength(7);
    expect(titles[0]).toHaveTextContent("Myth 1: “Kava damages the liver — it was banned in Europe for a reason”");
    expect(screen.getAllByText("DEBUNKED")).toHaveLength(2);
    expect(screen.getAllByText("NUANCED")).toHaveLength(4);
    expect(screen.getByText("FALSE AND DANGEROUS").className).toContain("text-[#b91c1c]");
  });

  it("opens one myth's evidence at a time and closes it again", async () => {
    render(<MythsExplorer />);
    expect(screen.queryByText(/German Administrative Court overturned/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByText(/Kava damages the liver/));
    expect(screen.getByText(/German Administrative Court overturned the 2002 ban on June 10, 2014/)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Kava is a psychedelic/));
    expect(screen.queryByText(/German Administrative Court/)).not.toBeInTheDocument();
    expect(screen.getByText(/Kava is psychoactive but not psychedelic/)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Kava is a psychedelic/));
    expect(screen.queryByText(/Kava is psychoactive but not psychedelic/)).not.toBeInTheDocument();
  });

  it.fails("BUG: myth cards are clickable divs, so keyboard users can't open them (no button)", () => {
    render(<MythsExplorer />);
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });
});
