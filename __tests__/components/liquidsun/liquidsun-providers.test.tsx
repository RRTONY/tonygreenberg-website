import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LiquidsunProviders, useLanguage, useMember } from "@/components/liquidsun/liquidsun-providers";
import { getLiquidsunMember } from "@/app/liquid-sun/actions";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn() }));

const premium = { signedIn: true, isPremium: true, subscriptionStatus: "active", currentPeriodEnd: null, hasCustomer: true };

function Probe() {
  const { language, setLanguage, t } = useLanguage();
  const member = useMember();
  return (
    <div>
      <p>lang:{language}</p>
      <p>{t("nav.home")}</p>
      <p>{t("missing.key")}</p>
      <p>loaded:{String(member.loaded)}</p>
      <p>signedIn:{String(member.signedIn)}</p>
      <p>premium:{String(member.isPremium)}</p>
      <button onClick={() => setLanguage(language === "en" ? "es" : "en")}>switch</button>
      <button onClick={member.refresh}>refresh</button>
    </div>
  );
}

beforeEach(() => {
  vi.mocked(getLiquidsunMember).mockResolvedValue(premium);
});

describe("LiquidsunProviders", () => {
  it("wraps the section in .liquidsun-root and loads the member", async () => {
    const { container } = render(
      <LiquidsunProviders>
        <Probe />
      </LiquidsunProviders>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass("liquidsun-root", "dark", "min-h-screen");
    expect(root).toHaveAttribute("lang", "en");
    expect(screen.getByText("loaded:false")).toBeInTheDocument();
    expect(await screen.findByText("loaded:true")).toBeInTheDocument();
    expect(screen.getByText("signedIn:true")).toBeInTheDocument();
    expect(screen.getByText("premium:true")).toBeInTheDocument();
  });

  it("switches language, translates with an English fallback, and remembers the choice", async () => {
    render(
      <LiquidsunProviders>
        <Probe />
      </LiquidsunProviders>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("missing.key")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "switch" }));
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("lang:es")).toBeInTheDocument();
    expect(window.localStorage.getItem("tequila-language")).toBe('"es"');
  });

  it("asks again on refresh and falls back to signed out when the check fails", async () => {
    render(
      <LiquidsunProviders>
        <Probe />
      </LiquidsunProviders>,
    );
    await screen.findByText("loaded:true");
    vi.mocked(getLiquidsunMember).mockRejectedValueOnce(new Error("offline"));
    await userEvent.click(screen.getByRole("button", { name: "refresh" }));
    await waitFor(() => expect(screen.getByText("signedIn:false")).toBeInTheDocument());
    expect(getLiquidsunMember).toHaveBeenCalledTimes(2);
  });

  it("ignores a late answer after unmounting", async () => {
    let resolve!: (v: typeof premium) => void;
    vi.mocked(getLiquidsunMember).mockReturnValueOnce(new Promise((r) => (resolve = r)));
    const { unmount } = render(
      <LiquidsunProviders>
        <Probe />
      </LiquidsunProviders>,
    );
    unmount();
    await act(async () => resolve(premium));
  });

  it("throws when a hook is used outside the providers", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useLanguage())).toThrow(/LiquidsunProviders/);
    expect(() => renderHook(() => useMember())).toThrow(/LiquidsunProviders/);
  });
});
