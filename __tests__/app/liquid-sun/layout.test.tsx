import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/liquid-sun/layout";

vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
}));

describe("/liquid-sun layout", () => {
  it("wraps pages in LiquidSun's own shell: scoped root, menu and main", () => {
    const { container } = render(
      <Layout params={Promise.resolve({})}>
        <p>Page body</p>
      </Layout>,
    );
    expect(container.querySelector(".liquidsun-root")).not.toBeNull();
    expect(screen.getAllByRole("navigation", { name: "LiquidSun" })).toHaveLength(2);
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
    const menu = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    document.dispatchEvent(menu);
    expect(menu.defaultPrevented).toBe(true);
  });
});
