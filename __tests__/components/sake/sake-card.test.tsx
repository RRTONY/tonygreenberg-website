import { afterEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeCard } from "@/components/sake/sake-card";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { SAKE_PRODUCTS } from "@/lib/content/sake/shop-data";
import { renderSake } from "./sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

afterEach(() => {
  window.localStorage.clear();
  vi.useRealTimers();
});

describe("SakeCard", () => {
  it("links a known sake to its page, shows its shop price and adds it to the cart", async () => {
    const product = SAKE_PRODUCTS[0];
    const user = userEvent.setup();
    const { container } = renderSake(
      <SakeCard
        id={product.id}
        name="Test Sake"
        nameJa="テスト"
        brewery="Brewery"
        type="Junmai Daiginjo"
        flavorNotes="Melon"
        aromas={["melon", "rice"]}
        highlightedAromas={["melon"]}
        matchLabel="1/2"
      />,
    );
    expect(screen.getByRole("heading", { name: "Test Sake" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Details/ })).toHaveAttribute("href", `/sake/bottle/${product.id}`);
    expect(screen.getByText(`$${product.priceCents / 100}`)).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("Melon")).toBeInTheDocument();
    expect(container.querySelector(".sk-image-wash")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: /Add Test Sake to cart/ }));
    expect(JSON.parse(window.localStorage.getItem("sake-cart")!)).toEqual([{ productId: product.id, quantity: 1 }]);
    expect(screen.getByRole("button", { name: "Added!" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Added!" }));
    expect(JSON.parse(window.localStorage.getItem("sake-cart")!)).toEqual([{ productId: product.id, quantity: 2 }]);
  });

  it("caps a bottle at 12 and the Added flash goes away", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const product = SAKE_PRODUCTS[0];
    window.localStorage.setItem("sake-cart", JSON.stringify([{ productId: product.id, quantity: 12 }]));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderSake(<SakeCard id={product.id} name="Capped" compact />);
    await user.click(screen.getByRole("button", { name: /Add Capped to cart/ }));
    expect(JSON.parse(window.localStorage.getItem("sake-cart")!)[0].quantity).toBe(12);
    await act(async () => {
      vi.advanceTimersByTime(1300);
    });
    expect(screen.queryByRole("button", { name: "Added!" })).toBeNull();
  });

  it("sends an unknown sake to the QPR list, uses a given price, Japanese names and the Austere look", async () => {
    const user = userEvent.setup();
    expect(qprSakeDatabase.some((s) => s.id === "not-a-sake")).toBe(false);
    const { container } = renderSake(<SakeCard id="not-a-sake" name="Other" nameJa="他" breweryJa="蔵" brewery="B" priceUS={30} />);
    expect(screen.getByRole("link", { name: /View Details/ })).toHaveAttribute("href", "/sake/qpr");
    expect(screen.getByText("$30")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cart/ })).toBeNull();
    await user.click(screen.getByTestId("toggle-lang"));
    expect(screen.getByRole("heading", { name: "他" })).toBeInTheDocument();
    expect(screen.getByText("蔵")).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".bg-stone-100")).not.toBeNull();
  });
});
