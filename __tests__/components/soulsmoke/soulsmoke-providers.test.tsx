import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SoulsmokeProviders,
  useFavorites,
  useLanguage,
  useViewMode,
} from "@/components/soulsmoke/soulsmoke-providers";
import { useLocalStore, writeLocalStore } from "@/components/soulsmoke/hooks/use-local-store";

function Probe() {
  const { language, setLanguage, t } = useLanguage();
  const { mode, toggleMode, setMode, isSoulSmoke, isAficionado } = useViewMode();
  const { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, clearFavorites } = useFavorites();
  return (
    <div>
      <p data-testid="lang">{language}</p>
      <p data-testid="subtitle">{t("hero.subtitle")}</p>
      <p data-testid="missing">{t("no.such.key")}</p>
      <p data-testid="mode">{`${mode} ${isSoulSmoke} ${isAficionado}`}</p>
      <p data-testid="favs">{favorites.join(",")}</p>
      <p data-testid="is-a">{String(isFavorite("a"))}</p>
      <button onClick={() => setLanguage(language === "en" ? "es" : "en")}>lang</button>
      <button onClick={toggleMode}>mode</button>
      <button onClick={() => setMode("soulsmoke")}>reset-mode</button>
      <button onClick={() => addFavorite("a")}>add-a</button>
      <button onClick={() => toggleFavorite("b")}>toggle-b</button>
      <button onClick={() => removeFavorite("a")}>remove-a</button>
      <button onClick={clearFavorites}>clear</button>
    </div>
  );
}

describe("SoulsmokeProviders", () => {
  it("defaults to English and SoulSmoke mode, inside the scoped wrapper", () => {
    const { container } = render(
      <SoulsmokeProviders>
        <Probe />
      </SoulsmokeProviders>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("soulsmoke-root");
    expect(root).toHaveAttribute("data-mode", "soulsmoke");
    expect(root).toHaveAttribute("lang", "en");
    expect(screen.getByTestId("subtitle")).toHaveTextContent("The Miracle of Mezcal");
    expect(screen.getByTestId("missing")).toHaveTextContent("no.such.key");
  });

  it("switches language and mode, and remembers them in the browser", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SoulsmokeProviders>
        <Probe />
      </SoulsmokeProviders>,
    );
    await user.click(screen.getByText("lang"));
    expect(screen.getByTestId("lang")).toHaveTextContent("es");
    expect(window.localStorage.getItem("soulsmoke-language")).toBe('"es"');
    await user.click(screen.getByText("mode"));
    expect(screen.getByTestId("mode")).toHaveTextContent("aficionado false true");
    expect(container.firstElementChild).toHaveAttribute("data-mode", "aficionado");
    await user.click(screen.getByText("reset-mode"));
    expect(screen.getByTestId("mode")).toHaveTextContent("soulsmoke true false");
  });

  it("reads a plain-string value saved by the old Manus app", () => {
    window.localStorage.setItem("soulsmoke-language", "es");
    render(
      <SoulsmokeProviders>
        <Probe />
      </SoulsmokeProviders>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("es");
  });

  it("adds, toggles, removes and clears favorites", async () => {
    const user = userEvent.setup();
    render(
      <SoulsmokeProviders>
        <Probe />
      </SoulsmokeProviders>,
    );
    await user.click(screen.getByText("add-a"));
    await user.click(screen.getByText("add-a"));
    await user.click(screen.getByText("toggle-b"));
    expect(screen.getByTestId("favs")).toHaveTextContent("a,b");
    expect(screen.getByTestId("is-a")).toHaveTextContent("true");
    await user.click(screen.getByText("toggle-b"));
    await user.click(screen.getByText("remove-a"));
    expect(screen.getByTestId("favs")).toHaveTextContent("");
    await user.click(screen.getByText("add-a"));
    await user.click(screen.getByText("clear"));
    expect(screen.getByTestId("favs")).toHaveTextContent("");
  });

  it("throws a clear error when a hook is used outside the provider", () => {
    const Lang = () => <p>{useLanguage().language}</p>;
    const Mode = () => <p>{useViewMode().mode}</p>;
    const Favs = () => <p>{useFavorites().favorites.length}</p>;
    const quiet = console.error;
    console.error = () => {};
    try {
      expect(() => render(<Lang />)).toThrow(/SoulsmokeProviders/);
      expect(() => render(<Mode />)).toThrow(/SoulsmokeProviders/);
      expect(() => render(<Favs />)).toThrow(/SoulsmokeProviders/);
    } finally {
      console.error = quiet;
    }
  });
});

describe("useLocalStore", () => {
  function Counter({ storageKey }: { storageKey: string }) {
    const [count, setCount] = useLocalStore(storageKey, 0);
    return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
  }

  it("shares one value between components and follows changes from other tabs", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Counter storageKey="t-count" />
        <Counter storageKey="t-count" />
      </>,
    );
    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["1", "1"]);
    act(() => {
      window.localStorage.setItem("t-count", "5");
      window.dispatchEvent(new StorageEvent("storage", { key: "t-count" }));
    });
    expect(screen.getAllByRole("button")[0]).toHaveTextContent("5");
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "other" }));
      writeLocalStore("t-count", 7, 0);
    });
    expect(screen.getAllByRole("button")[0]).toHaveTextContent("7");
  });

  it("keeps working in memory when the browser refuses to save", async () => {
    const user = userEvent.setup();
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("QuotaExceeded");
    };
    try {
      render(<Counter storageKey="t-full" />);
      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveTextContent("1");
    } finally {
      Storage.prototype.setItem = setItem;
    }
  });

  it("falls back when reading storage throws", () => {
    const getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("SecurityError");
    };
    try {
      render(<Counter storageKey="t-blocked" />);
      expect(screen.getByRole("button")).toHaveTextContent("0");
    } finally {
      Storage.prototype.getItem = getItem;
    }
  });
});
