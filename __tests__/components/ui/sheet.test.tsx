import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function Demo({ side }: { side?: "left" | "right" }) {
  return (
    <Sheet>
      <SheetTrigger>Menu</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Nav</SheetTitle>
          <SheetDescription>Links</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("opens as a named dialog on the right by default", async () => {
    render(<Demo />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Menu" }));
    const d = screen.getByRole("dialog", { name: "Nav" });
    expect(d).toHaveAttribute("data-side", "right");
  });

  it("uses the requested side", async () => {
    render(<Demo side="left" />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
  });

  it("closes with Escape, the X button and SheetClose", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
