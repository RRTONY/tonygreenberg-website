import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

describe("Popover", () => {
  it("opens on click, shows its parts, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Info</PopoverTrigger>
        <PopoverContent className="w-96">
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Details</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Info" });
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Title")).toHaveAttribute("data-slot", "popover-title");
    expect(screen.getByText("Details").closest('[data-slot="popover-content"]')).toHaveClass("w-96");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Details")).not.toBeInTheDocument());
  });

  it("positions against an anchor other than the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverAnchor className="anchor">Anchor here</PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Anchored</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText("Anchor here")).toHaveAttribute("data-slot", "popover-anchor");
    await user.click(screen.getByRole("button", { name: "Open" }));
    const content = screen.getByText("Anchored");
    expect(content).toHaveAttribute("data-slot", "popover-content");
    // Defaults: centred, 4px off the anchor (Radix reports the alignment it used).
    expect(content).toHaveAttribute("data-align", "center");
  });
});
