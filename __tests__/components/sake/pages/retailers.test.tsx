import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeRetailers } from "@/components/sake/pages/retailers";
import { sakeRetailers } from "@/lib/content/sake/education-data";
import { renderSake } from "../sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeRetailers", () => {
  it("lists every retailer and links the partner offer inside the guide", () => {
    renderSake(<SakeRetailers />);
    expect(screen.getByRole("heading", { level: 1, name: /Where to/ })).toBeInTheDocument();
    expect(screen.getByText(`${sakeRetailers.length} retailers found`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Apply for Partnership/ })).toHaveAttribute("href", "/sake/producers");
    const withUrl = sakeRetailers.filter((r) => r.url).length;
    expect(screen.getAllByRole("link", { name: /Visit Store/ })).toHaveLength(withUrl);
  });

  it("filters by region and type", async () => {
    const user = userEvent.setup();
    renderSake(<SakeRetailers />);
    await user.click(screen.getByRole("button", { name: "Japan" }));
    const japan = sakeRetailers.filter((r) => r.region === "Japan");
    expect(screen.getByText(`${japan.length} retailers found`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Japan" })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "All Regions" }));
    await user.click(within(screen.getByRole("group", { name: "Store type" })).getByRole("button", { name: "Online" }));
    const online = sakeRetailers.filter((r) => r.type === "online");
    expect(screen.getByText(`${online.length} retailers found`)).toBeInTheDocument();
  });

  it("switches to the Austere colors", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeRetailers />);
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".bg-stone-50")).not.toBeNull();
    expect(screen.getByRole("link", { name: /Apply for Partnership/ }).className).toContain("text-red-800");
  });
});
