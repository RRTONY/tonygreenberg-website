import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  SakeProviders,
  useAesthetic,
  useFavorites,
  useLanguage,
  useMember,
  useMode,
  useSakePortalClass,
} from "@/components/sake/sake-providers";
import { getSakeMember } from "@/app/sake/actions";

vi.mock("@/app/sake/actions", () => ({ getSakeMember: vi.fn() }));

const SIGNED_IN = { signedIn: true, id: "u1", email: "me@example.com", name: "Mia", isAdmin: false };
const item = { id: "born-gold", type: "sake" as const, name: "Born Gold", nameJa: "梵 ゴールド", path: "/sake/bottle/born-gold" };

function Probe() {
  const { isAustere, toggleAesthetic } = useAesthetic();
  const { lang, t, toggleLang } = useLanguage();
  const { mode, isConnoisseur, toggleMode } = useMode();
  const fav = useFavorites();
  const m = useMember();
  const portal = useSakePortalClass();
  return (
    <div>
      <p>austere:{String(isAustere)}</p>
      <p>lang:{lang}</p>
      <p>t:{t("Hello", "こんにちは")}</p>
      <p>mode:{mode}</p>
      <p>connoisseur:{String(isConnoisseur)}</p>
      <p>count:{fav.count}</p>
      <p>isFav:{String(fav.isFavorite("born-gold"))}</p>
      <p>note:{fav.favorites[0]?.note ?? "none"}</p>
      <p>signedIn:{String(m.signedIn)}</p>
      <p>loaded:{String(m.loaded)}</p>
      <p>portal:{portal}</p>
      <button onClick={toggleAesthetic}>aesthetic</button>
      <button onClick={toggleLang}>lang</button>
      <button onClick={toggleMode}>mode</button>
      <button onClick={() => fav.toggleFavorite(item)}>toggle</button>
      <button onClick={() => fav.addFavorite(item)}>add</button>
      <button onClick={() => fav.updateNote("born-gold", "pair with sashimi")}>note</button>
      <button onClick={() => fav.removeFavorite("born-gold")}>remove</button>
      <button onClick={fav.clearAll}>clear</button>
      <button onClick={m.refresh}>refresh</button>
    </div>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(getSakeMember).mockResolvedValue(SIGNED_IN);
});

describe("SakeProviders", () => {
  it("wraps the section in .sake-root with the fonts, and switches the Austere look on the wrapper", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("sake-root");
    expect(root).not.toHaveClass("sake-austere");
    expect(root).toHaveAttribute("lang", "en");
    expect(screen.getByText(/^portal:/).textContent).toContain("sake-portal");
    expect(screen.getByText(/^portal:/).textContent).not.toContain("sake-austere");

    await user.click(screen.getByRole("button", { name: "aesthetic" }));
    expect(screen.getByText("austere:true")).toBeInTheDocument();
    expect(root).toHaveClass("sake-root", "sake-austere");
    expect(screen.getByText(/^portal:/).textContent).toContain("sake-austere");
    await user.click(screen.getByRole("button", { name: "aesthetic" }));
    expect(root).not.toHaveClass("sake-austere");
  });

  it("switches language and mode like the app's contexts", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    expect(screen.getByText("t:Hello")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "lang" }));
    expect(screen.getByText("lang:ja")).toBeInTheDocument();
    expect(screen.getByText("t:こんにちは")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("lang", "ja");

    expect(screen.getByText("mode:beginner")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "mode" }));
    expect(screen.getByText("mode:connoisseur")).toBeInTheDocument();
    expect(screen.getByText("connoisseur:true")).toBeInTheDocument();
  });

  it("keeps favorites in the browser under the app's key", async () => {
    const user = userEvent.setup();
    render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByText("count:1")).toBeInTheDocument();
    expect(screen.getByText("isFav:true")).toBeInTheDocument();
    const saved = JSON.parse(window.localStorage.getItem("sake-favorites-v1") ?? "[]");
    expect(saved[0]).toMatchObject(item);
    expect(typeof saved[0].addedAt).toBe("number");

    await user.click(screen.getByRole("button", { name: "add" }));
    expect(screen.getByText("count:1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "note" }));
    expect(screen.getByText("note:pair with sashimi")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByText("count:0")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "add" }));
    await user.click(screen.getByRole("button", { name: "remove" }));
    expect(screen.getByText("count:0")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "add" }));
    await user.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByText("count:0")).toBeInTheDocument();
  });

  it("reads a saved favorites list and ignores a damaged one", () => {
    window.localStorage.setItem("sake-favorites-v1", JSON.stringify([{ ...item, addedAt: 1 }]));
    const { unmount } = render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    expect(screen.getByText("count:1")).toBeInTheDocument();
    unmount();
    window.localStorage.setItem("sake-favorites-v1", JSON.stringify({ not: "a list" }));
    render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    expect(screen.getByText("count:0")).toBeInTheDocument();
  });

  it("loads the member, refreshes on request, and falls back to signed out on failure", async () => {
    const user = userEvent.setup();
    render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    await waitFor(() => expect(screen.getByText("signedIn:true")).toBeInTheDocument());
    expect(screen.getByText("loaded:true")).toBeInTheDocument();
    vi.mocked(getSakeMember).mockRejectedValue(new Error("down"));
    await user.click(screen.getByRole("button", { name: "refresh" }));
    await waitFor(() => expect(screen.getByText("signedIn:false")).toBeInTheDocument());
    expect(getSakeMember).toHaveBeenCalledTimes(2);
  });

  it("ignores a member answer that arrives after unmounting", async () => {
    let resolve: (v: typeof SIGNED_IN) => void = () => {};
    vi.mocked(getSakeMember).mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = render(
      <SakeProviders>
        <Probe />
      </SakeProviders>,
    );
    unmount();
    await act(async () => resolve(SIGNED_IN));
    expect(getSakeMember).toHaveBeenCalledTimes(1);
  });

  it("throws a clear error when a hook is used outside the provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAesthetic())).toThrow(/SakeProviders/);
    expect(() => renderHook(() => useLanguage())).toThrow(/SakeProviders/);
    expect(() => renderHook(() => useMode())).toThrow(/SakeProviders/);
    expect(() => renderHook(() => useFavorites())).toThrow(/SakeProviders/);
    expect(() => renderHook(() => useMember())).toThrow(/SakeProviders/);
  });
});
