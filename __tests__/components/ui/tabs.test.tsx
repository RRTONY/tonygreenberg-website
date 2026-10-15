import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants } from "@/components/ui/tabs";

function Demo() {
  return (
    <Tabs defaultValue="a">
      <TabsList variant="line">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the default tab's panel", () => {
    render(<Demo />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
  });

  it("switches tabs by click and by arrow keys", async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole("tab", { name: "Beta" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
  });

  it("applies the list variant", () => {
    render(<Demo />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", "line");
    expect(tabsListVariants({ variant: "default" })).toContain("bg-muted");
  });
});
