import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SoulsmokeNav } from "@/components/soulsmoke/soulsmoke-nav";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";
import { soulsmokeExploreNav, soulsmokeMainNav, soulsmokeMoreNav } from "@/lib/content/soulsmoke/nav";
import { navigation } from "../../helpers/next";

function renderNav() {
  return render(
    <SoulsmokeProviders>
      <SoulsmokeNav />
    </SoulsmokeProviders>,
  );
}

describe("SoulsmokeNav", () => {
  it("puts every menu link in the HTML (crawlable), under /soul-smoke", () => {
    navigation.pathname = "/soul-smoke";
    renderNav();
    const desktop = screen.getByRole("navigation", { name: "SoulSmoke" });
    for (const item of [...soulsmokeMainNav, ...soulsmokeExploreNav, ...soulsmokeMoreNav]) {
      const link = within(desktop).getByRole("link", { name: item.label });
      expect(link.getAttribute("href")).toMatch(/^\/soul-smoke/);
    }
    expect(within(desktop).getByRole("link", { name: "Home" }).className).toContain("text-terracotta");
  });

  it("marks the Explore menu when one of its pages is open", () => {
    navigation.pathname = "/soul-smoke/us-hunt";
    renderNav();
    const desktop = screen.getByRole("navigation", { name: "SoulSmoke" });
    expect(within(desktop).getByRole("button", { name: "Explore" }).className).toContain("text-terracotta");
    expect(within(desktop).getByRole("button", { name: "More" }).className).not.toContain("text-terracotta");
  });

  it("marks the More menu for its pages", () => {
    navigation.pathname = "/soul-smoke/cocktails";
    renderNav();
    const desktop = screen.getByRole("navigation", { name: "SoulSmoke" });
    expect(within(desktop).getByRole("button", { name: "More" }).className).toContain("text-terracotta");
  });

  it("opens and closes the mobile menu, and closes it after navigating", async () => {
    const user = userEvent.setup();
    navigation.pathname = "/soul-smoke";
    const { rerender } = renderNav();
    const menu = document.getElementById("soulsmoke-mobile-menu")!;
    expect(menu.className).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(menu.className).not.toBe("hidden");
    await user.click(within(menu).getByRole("link", { name: "Cocktails" }));
    expect(menu.className).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(menu.className).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    navigation.pathname = "/soul-smoke/library";
    rerender(
      <SoulsmokeProviders>
        <SoulsmokeNav />
      </SoulsmokeProviders>,
    );
    expect(menu.className).toBe("hidden");
  });

  it("switches to Spanish labels and to Aficionado mode", async () => {
    const user = userEvent.setup();
    renderNav();
    await user.click(screen.getAllByRole("button", { name: "Cambiar a Español" })[0]);
    expect(screen.getAllByRole("link", { name: "Inicio" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Explorar" }).length).toBeGreaterThan(0);
    expect(screen.getByText("EL VIAJE")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Switch to English" })[0]);
    await user.click(screen.getAllByRole("button", { name: "Switch to Aficionado Mode" })[0]);
    expect(screen.getAllByRole("button", { name: "Switch to SoulSmoke Mode" }).length).toBeGreaterThan(0);
  });
});
