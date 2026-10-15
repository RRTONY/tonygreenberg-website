import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

function Demo({ viewport }: { viewport?: boolean }) {
  return (
    <NavigationMenu viewport={viewport}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/framework">Framework</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("opens a dropdown from its trigger and shows its links", async () => {
    render(<Demo viewport={false} />);
    const trigger = screen.getByRole("button", { name: "Explore" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.setup().click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Framework" })).toHaveAttribute("href", "/framework");
  });

  it("records whether it uses a shared viewport", () => {
    const { container, rerender } = render(<Demo />);
    expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute("data-viewport", "true");
    rerender(<Demo viewport={false} />);
    expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveAttribute("data-viewport", "false");
  });

  it("is a labelled navigation landmark", () => {
    render(<Demo />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
