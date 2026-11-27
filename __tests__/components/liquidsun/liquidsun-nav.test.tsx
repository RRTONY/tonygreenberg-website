import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LiquidsunNav } from "@/components/liquidsun/liquidsun-nav";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { navigation } from "@tests/helpers/next";
import { getLiquidsunMember } from "@/app/liquid-sun/actions";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn() }));

beforeEach(() => {
  vi.mocked(getLiquidsunMember).mockResolvedValue({
    signedIn: false,
    isPremium: false,
    subscriptionStatus: null,
    currentPeriodEnd: null,
    hasCustomer: false,
  });
});

const renderNav = () =>
  render(
    <LiquidsunProviders>
      <LiquidsunNav />
    </LiquidsunProviders>,
  );

describe("LiquidsunNav", () => {
  it("has the four menus, Premium and the logo linking home", () => {
    renderNav();
    const [desktop] = screen.getAllByRole("navigation", { name: "LiquidSun" });
    for (const name of ["The Spirit", "The Hunt", "The Culture", "The Industry"]) {
      expect(within(desktop).getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
    }
    expect(within(desktop).getByRole("link", { name: "LiquidSun" })).toHaveAttribute("href", "/liquid-sun");
    expect(within(desktop).getByRole("link", { name: "Premium" })).toHaveAttribute("href", "/liquid-sun/premium");
    expect(within(desktop).getByRole("link", { name: "The Altar" })).toHaveAttribute("href", "/liquid-sun/altar");
  });

  it("opens a dropdown on hover, click and focus, and closes it on leave and blur", async () => {
    renderNav();
    const [desktop] = screen.getAllByRole("navigation", { name: "LiquidSun" });
    const spirit = within(desktop).getByRole("button", { name: /The Spirit/ });
    const group = spirit.parentElement!;
    expect(spirit).toHaveAttribute("aria-expanded", "false");
    fireEvent.mouseEnter(group);
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseLeave(group);
    expect(spirit).toHaveAttribute("aria-expanded", "false");
    // A tap on a touch screen: mouseenter then click must leave it open.
    await userEvent.click(spirit);
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(spirit);
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(spirit, { key: "Enter" });
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(spirit, { key: "Escape" });
    expect(spirit).toHaveAttribute("aria-expanded", "false");
    fireEvent.focus(spirit);
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    const inside = within(group).getByRole("link", { name: "The Evolution" });
    fireEvent.blur(spirit, { relatedTarget: inside });
    expect(spirit).toHaveAttribute("aria-expanded", "true");
    fireEvent.blur(spirit, { relatedTarget: document.body });
    expect(spirit).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the current page", async () => {
    navigation.pathname = "/liquid-sun/quadrant";
    renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const links = screen.getAllByRole("link", { name: "The Quadrant" });
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(links[1]).toHaveClass("text-amber-200");
    expect(screen.getAllByRole("link", { name: "The Altar" })[0]).not.toHaveAttribute("aria-current");
  });

  it("opens and closes the phone menu, and closes it when a link is used", async () => {
    renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("link", { name: "Go Premium" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("link", { name: "Go Premium" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("link", { name: "Go Premium" }));
    expect(screen.queryByRole("link", { name: "Go Premium" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getAllByRole("navigation", { name: "LiquidSun" })[1];
    fireEvent.click(within(mobileNav).getByRole("link", { name: "The Altar" }));
    expect(screen.queryByRole("link", { name: "Go Premium" })).not.toBeInTheDocument();
  });

  it("closes the menus when the page changes", async () => {
    const view = renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    navigation.pathname = "/liquid-sun/altar";
    view.rerender(
      <LiquidsunProviders>
        <LiquidsunNav />
      </LiquidsunProviders>,
    );
    expect(screen.queryByRole("link", { name: "Go Premium" })).not.toBeInTheDocument();
  });

  it("switches the menu to Spanish and back", async () => {
    renderNav();
    const [toggle] = screen.getAllByRole("button", { name: "Cambiar a Español" });
    await userEvent.click(toggle);
    expect(screen.getAllByRole("button", { name: /El Espíritu/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "El Altar" }).length).toBeGreaterThan(0);
    await userEvent.click(screen.getAllByRole("button", { name: "Switch to English" })[0]);
    expect(screen.getAllByRole("button", { name: /The Spirit/ }).length).toBeGreaterThan(0);
  });
});
