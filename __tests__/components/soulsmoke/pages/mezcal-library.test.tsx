import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MezcalLibrary, libraryBooks } from "@/components/soulsmoke/pages/mezcal-library";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("MezcalLibrary", () => {
  it("lists the ten books with outside links that open in a new tab", () => {
    render(
      <SoulsmokeProviders>
        <MezcalLibrary />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The Essential\s*Mezcal Reading List/);
    for (const book of libraryBooks) {
      expect(screen.getByRole("heading", { level: 2, name: book.title })).toBeInTheDocument();
    }
    const bookLinks = screen.getAllByRole("link", { name: /Find This Book/ });
    expect(bookLinks).toHaveLength(9);
    expect(bookLinks[0]).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /Visit Website/ })).toHaveAttribute("href", "https://www.mezcalistas.com");
    expect(screen.getByText("DEEP DIVE")).toHaveClass("bg-indigo");
    expect(screen.getByRole("link", { name: /Find Your Agave by Scent/ })).toHaveAttribute(
      "href",
      "/soul-smoke/scent-finder",
    );
    expect(screen.getByRole("link", { name: "Explore US Bottles" })).toHaveAttribute("href", "/soul-smoke/us-hunt");
  });
});
