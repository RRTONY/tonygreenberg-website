import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";

describe("Avatar", () => {
  it("shows the fallback while the image hasn't loaded (jsdom never loads images)", () => {
    render(
      <Avatar>
        <AvatarImage src="/tony.jpg" alt="Tony" />
        <AvatarFallback>TG</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("TG")).toHaveAttribute("data-slot", "avatar-fallback");
  });

  it("sets the size data attribute", () => {
    const { container } = render(<Avatar size="lg"><AvatarFallback>A</AvatarFallback></Avatar>);
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-size", "lg");
  });

  it("renders group, count and badge parts with extra classes", () => {
    render(
      <AvatarGroup className="g">
        <AvatarGroupCount>+3</AvatarGroupCount>
        <AvatarBadge data-testid="badge" className="bg-green-500" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+3")).toHaveAttribute("data-slot", "avatar-group-count");
    expect(screen.getByTestId("badge")).toHaveClass("bg-green-500");
  });
});
