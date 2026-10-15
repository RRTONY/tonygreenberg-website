import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders a span with the default variant", () => {
    render(<Badge>New</Badge>);
    const b = screen.getByText("New");
    expect(b.tagName).toBe("SPAN");
    expect(b).toHaveAttribute("data-variant", "default");
    expect(b).toHaveClass("bg-primary");
  });

  it("applies the outline variant and extra classes", () => {
    render(<Badge variant="outline" className="uppercase">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("border-border", "uppercase");
  });

  it("asChild renders a link", () => {
    render(<Badge asChild><a href="/x">Link</a></Badge>);
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("data-slot", "badge");
  });
});
