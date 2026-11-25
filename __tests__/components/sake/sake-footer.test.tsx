import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SakeFooter } from "@/components/sake/sake-footer";
import { SakeBottomNav } from "@/components/sake/sake-bottom-nav";
import { SocialShare } from "@/components/sake/social-share";
import { SakeProviders } from "@/components/sake/sake-providers";
import { getSakeMember } from "@/app/sake/actions";
import { navigation } from "@tests/helpers/next";

vi.mock("@/app/sake/actions", () => ({ getSakeMember: vi.fn() }));

const wrap = (ui: React.ReactNode) => render(<SakeProviders>{ui}</SakeProviders>);
const saveOne = () =>
  window.localStorage.setItem(
    "sake-favorites-v1",
    JSON.stringify(Array.from({ length: 12 }, (_, i) => ({ id: `s${i}`, type: "sake", name: "S", nameJa: "S", path: "/sake", addedAt: i }))),
  );

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(getSakeMember).mockResolvedValue({ signedIn: false, id: null, email: null, name: null, isAdmin: false });
  navigation.pathname = "/sake/rice";
});

describe("SakeFooter", () => {
  it("shares the page with the app's default title, and shows the copyright and legal links", () => {
    wrap(<SakeFooter />);
    const x = screen.getByRole("link", { name: "Share on X (Twitter)" });
    expect(decodeURIComponent(x.getAttribute("href")!)).toContain("Sake for Sake's Sake — The world's deepest sake guide.");
    expect(decodeURIComponent(x.getAttribute("href")!)).toContain("https://tonygreenberg.com/sake/rice");
    expect(screen.getByText(/© 2026 Sake for Sake's Sake™/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/sake/terms");
    expect(screen.getByRole("link", { name: "For Producers" })).toHaveAttribute("href", "/sake/producers");
    expect(screen.queryByText(/saved/)).not.toBeInTheDocument();
  });

  it("uses a page's own share title and line, and links the saved count", () => {
    navigation.pathname = "/sake/menu-analyzer";
    saveOne();
    wrap(<SakeFooter />);
    const mail = screen.getByRole("link", { name: "Share on Email" });
    expect(decodeURIComponent(mail.getAttribute("href")!)).toContain("Menu Analyzer — Calculate restaurant sake markup");
    expect(screen.getByRole("link", { name: /12 saved/ })).toHaveAttribute("href", "/sake/favorites");
  });

  it("uses a share title alone when the page set no line", () => {
    navigation.pathname = "/sake/compare";
    wrap(<SakeFooter />);
    const fb = screen.getByRole("link", { name: "Share on Facebook" });
    expect(decodeURIComponent(fb.getAttribute("href")!)).toContain("Compare Sakes — The world's deepest sake guide.");
  });
});

describe("SocialShare", () => {
  it("copies the link and confirms it", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    wrap(<SocialShare title="Rice" url="https://tonygreenberg.com/sake/rice" />);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://tonygreenberg.com/sake/rice");
    expect(await screen.findByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("does nothing more when the clipboard is blocked", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("blocked"));
    wrap(<SocialShare title="Rice" url="https://tonygreenberg.com/sake/rice" className="mt-2" />);
    await user.click(screen.getByRole("button", { name: "Copy Link" }));
    expect(screen.queryByRole("button", { name: "Copied!" })).not.toBeInTheDocument();
  });

  it("opens the compact menu with every network and copies from it", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    wrap(<SocialShare compact className="ml-2" title="Home" url="https://tonygreenberg.com/sake" hashtags={["Sake"]} />);
    const share = screen.getByRole("button", { name: /Share/ });
    expect(share).toHaveAttribute("aria-expanded", "false");
    await user.click(share);
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("target", "_blank");
    await user.click(screen.getByRole("link", { name: /WhatsApp/ }));
    expect(share).toHaveAttribute("aria-expanded", "false");
    await user.click(share);
    await user.click(screen.getByRole("button", { name: /Copy Link/ }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://tonygreenberg.com/sake");
    await user.click(share);
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });
});

describe("SakeBottomNav", () => {
  it("links the five destinations under /sake, marks the current one, and caps the badge at 9+", () => {
    navigation.pathname = "/sake/qpr";
    saveOne();
    wrap(<SakeBottomNav />);
    const shop = screen.getByRole("link", { name: "Shop" });
    expect(shop).toHaveAttribute("href", "/sake/qpr");
    expect(shop).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/sake");
    expect(screen.getByRole("link", { name: /Saved/ })).toHaveTextContent("9+");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/sake/sake-quiz");
  });

  it("shows the exact count under ten", () => {
    window.localStorage.setItem(
      "sake-favorites-v1",
      JSON.stringify([{ id: "a", type: "page", name: "A", nameJa: "A", path: "/sake", addedAt: 1 }]),
    );
    wrap(<SakeBottomNav />);
    expect(screen.getByRole("link", { name: /Saved/ })).toHaveTextContent("1");
  });
});
