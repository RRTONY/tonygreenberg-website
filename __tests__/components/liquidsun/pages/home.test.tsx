import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiquidsunHome } from "@/components/liquidsun/pages/home";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { getLiquidsunMember } from "@/app/liquid-sun/actions";
import { getLegends, getUnicorns } from "@/lib/content/liquidsun/producers";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/app/liquid-sun/actions", () => ({
  getLiquidsunMember: vi.fn(async () => ({ signedIn: false, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false })),
}));

const SIGNED_IN = { signedIn: true, isPremium: false, subscriptionStatus: null, currentPeriodEnd: null, hasCustomer: false };

function renderHome() {
  return render(
    <LiquidsunProviders>
      <LiquidsunHome />
    </LiquidsunProviders>,
  );
}

function setReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
}

describe("LiquidsunHome", () => {
  beforeEach(() => setReducedMotion(false));
  afterEach(() => vi.unstubAllGlobals());

  it("renders the hero, manifesto, collection, gateway and email sections", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1, name: "LiquidSun" })).toBeInTheDocument();
    expect(screen.getByText("Est. 2026 • Jalisco, Mexico")).toHaveClass("ls-tracking-in");
    expect(screen.getByRole("heading", { name: "The Glitch in the Matrix" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Collection" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Start Here" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Join the/ })).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play ambient sound" })).toBeInTheDocument();
  });

  it("filters the collection by tier", async () => {
    const user = userEvent.setup();
    renderHome();
    const unicorns = getUnicorns();
    const legends = getLegends();
    expect(screen.getAllByRole("link", { name: /Full Profile/ })).toHaveLength(unicorns.length + legends.length);
    await user.click(screen.getByRole("button", { name: "Unicorn" }));
    expect(screen.getByRole("button", { name: "Unicorn" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("link", { name: /Full Profile/ })).toHaveLength(unicorns.length);
    await user.click(screen.getByRole("button", { name: "Legend" }));
    expect(screen.getAllByRole("link", { name: /Full Profile/ })).toHaveLength(legends.length);
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("link", { name: /Full Profile/ })[0]).toHaveAttribute("href", "/liquid-sun/tequila-encyclopedia");
  });

  it("keeps buy links and panel scores behind a free sign-in until the visitor is signed in", async () => {
    vi.mocked(getLiquidsunMember).mockResolvedValue(SIGNED_IN);
    const { unmount } = renderHome();
    await waitFor(() => expect(screen.getAllByRole("link", { name: /Buy — \$\d+/ }).length).toBeGreaterThan(0));
    expect(screen.queryByRole("link", { name: "Sign in free to see where to buy" })).not.toBeInTheDocument();
    unmount();

    vi.mocked(getLiquidsunMember).mockResolvedValue({ ...SIGNED_IN, signedIn: false });
    renderHome();
    await waitFor(() => expect(getLiquidsunMember).toHaveBeenCalledTimes(2));
    const gates = screen.getAllByRole("link", { name: "Sign in free to see where to buy" });
    expect(gates[0]).toHaveAttribute("href", expect.stringContaining("/login?next="));
    expect(screen.getAllByRole("link", { name: "Sign in free to see panel scores" }).length).toBeGreaterThan(0);
  });

  it("scrolls to the manifesto from the hero button and the arrow", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole("button", { name: "Enter the Void" }));
    await user.click(screen.getByRole("button", { name: "Scroll to the manifesto" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("fades the hero text and grows the background as the hero scrolls away, and moves the glow with the pointer", () => {
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section") as HTMLElement;
    hero.getBoundingClientRect = () => ({ top: -200, height: 800 }) as DOMRect;
    act(() => {
      fireEvent.scroll(window);
    });
    const text = screen.getByRole("heading", { level: 1 }).parentElement as HTMLElement;
    expect(text.style.opacity).toBe("0.5");
    expect(text.style.transform).toBe("translateY(50px)");

    act(() => {
      fireEvent.mouseMove(window, { clientX: 0, clientY: 0 });
    });
    const glow = hero.firstElementChild as HTMLElement;
    expect(glow.style.transform).toBe("translate(15px, 15px)");
  });

  it("leaves the hero still when the visitor asks for reduced motion", () => {
    setReducedMotion(true);
    renderHome();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section") as HTMLElement;
    hero.getBoundingClientRect = () => ({ top: -400, height: 800 }) as DOMRect;
    act(() => {
      fireEvent.scroll(window);
      fireEvent.mouseMove(window, { clientX: 0, clientY: 0 });
    });
    const text = screen.getByRole("heading", { level: 1 }).parentElement as HTMLElement;
    expect(text.style.opacity).toBe("");
    expect((hero.firstElementChild as HTMLElement).style.transform).toBe("");
  });
});
