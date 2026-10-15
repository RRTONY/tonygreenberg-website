import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

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
});
