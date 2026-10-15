import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

describe("Select", () => {
  it("opens, picks an option and reports the value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Roast">
          <SelectValue placeholder="Pick a roast" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roasts</SelectLabel>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Roast" });
    expect(trigger).toHaveTextContent("Pick a roast");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Dark" }, { timeout: 5000 }));
    expect(onValueChange).toHaveBeenCalledWith("dark");
    expect(trigger).toHaveTextContent("Dark");
  });
});
