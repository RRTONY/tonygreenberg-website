import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
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

  it("shows an arrow indicator under the open item when one is added", async () => {
    // Radix only draws the indicator once a ResizeObserver reports the active
    // trigger's size; the shared fake never reports, so this one does.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private cb: ResizeObserverCallback) {}
        observe() {
          this.cb([], this as unknown as ResizeObserver);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    const { container } = render(
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/framework">Framework</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuIndicator className="extra" />
        </NavigationMenuList>
      </NavigationMenu>,
    );
    expect(container.querySelector('[data-slot="navigation-menu-indicator"]')).toBeNull();
    await userEvent.setup().click(screen.getByRole("button", { name: "Explore" }));
    const indicator = await waitFor(() => {
      const el = container.querySelector('[data-slot="navigation-menu-indicator"]');
      expect(el).not.toBeNull();
      return el!;
    });
    expect(indicator).toHaveAttribute("data-state", "visible");
    expect(indicator).toHaveClass("extra");
    expect(indicator.firstElementChild).toHaveClass("rotate-45");
  });
});
