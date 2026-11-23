import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Encyclopedia } from "@/components/liquidsun/pages/encyclopedia";
import { LiquidsunProviders } from "@/components/liquidsun/liquidsun-providers";
import { producers } from "@/lib/content/liquidsun/producers";

const renderPage = () =>
  render(
    <LiquidsunProviders>
      <Encyclopedia />
    </LiquidsunProviders>,
  );

describe("Encyclopedia", () => {
  it("lists every producer with its rescued image, then filters by region and search", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "The Tequilas" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(producers.length);
    expect(screen.getAllByRole("img")[0].getAttribute("src")).toContain("cdn.sanity.io");

    await user.click(screen.getByRole("button", { name: "Highlands" }));
    expect(screen.getByRole("button", { name: "Highlands" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(producers.filter((p) => p.region === "Highlands").length);

    await user.click(screen.getByRole("button", { name: "All" }));
    await user.type(screen.getByRole("textbox", { name: /Search by brand/ }), "guillermo");
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toContain("Fortaleza");
    expect(screen.queryByRole("heading", { level: 2, name: "Cascahuín Tahona" })).not.toBeInTheDocument();
  });

  it("uses the Spanish menu label for its heading in Spanish", () => {
    window.localStorage.setItem("tequila-language", JSON.stringify("es"));
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: "Los Tequilas" })).toBeInTheDocument();
    window.localStorage.removeItem("tequila-language");
  });
});
