import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function Demo({ forceMount }: { forceMount?: true }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionContent forceMount={forceMount}>
          <a href="/hidden-link">Inside A</a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionContent>Inside B</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("opens and closes a section on click", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Section A" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Inside A")).toBeVisible();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Section A" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Section B" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Inside B")).toBeInTheDocument();
  });

  it("forceMount keeps closed content (and its links) in the HTML", () => {
    render(<Demo forceMount />);
    expect(screen.getByRole("button", { name: "Section A" })).toHaveAttribute("aria-expanded", "false");
    expect(document.querySelector('a[href="/hidden-link"]')).not.toBeNull();
    expect(screen.queryByText("Inside B")).not.toBeInTheDocument();
  });
});
