import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FourDoors, type Door } from "@/components/marketing/four-doors";

const DOORS: Door[] = [
  { num: "01", title: "Fix Myself", sub: "Assessments", href: "/find-my", headline: "Know yourself first", body: "Start with the mirror.", bullets: ["Twenty quizzes", "Free"], cta: "Open the door" },
  { num: "02", title: "Fix My Company", sub: "Amplifier", href: "/amplifier", headline: "Fix the company", body: "Contracts.", bullets: [], cta: "Go" },
];

describe("FourDoors", () => {
  it("each door is a real link to its page", () => {
    render(<FourDoors doors={DOORS} />);
    expect(screen.getByRole("link", { name: /Fix Myself/ })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: /Fix My Company/ })).toHaveAttribute("href", "/amplifier");
  });

  it("a plain click opens the door's detail window", async () => {
    render(<FourDoors doors={DOORS} />);
    await userEvent.setup().click(screen.getByRole("link", { name: /Fix Myself/ }));
    const dialog = screen.getByRole("dialog", { name: "Know yourself first" });
    expect(dialog).toHaveAccessibleDescription("Start with the mirror.");
    expect(dialog).toHaveTextContent("Door 01");
    expect(dialog).toHaveTextContent("Twenty quizzes");
    expect(screen.getByRole("link", { name: /Open the door/ })).toHaveAttribute("href", "/find-my");
  });

  it("closes on Escape and with the Close button", async () => {
    const user = userEvent.setup();
    render(<FourDoors doors={DOORS} />);
    await user.click(screen.getByRole("link", { name: /Fix Myself/ }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(screen.getByRole("link", { name: /Fix My Company/ }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("Cmd/Ctrl-click leaves the browser to open the link in a new tab", () => {
    render(<FourDoors doors={DOORS} />);
    fireEvent.click(screen.getByRole("link", { name: /Fix Myself/ }), { metaKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
