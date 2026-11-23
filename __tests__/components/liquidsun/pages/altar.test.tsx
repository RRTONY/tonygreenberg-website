import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Altar, pinnacleBottles } from "@/components/liquidsun/pages/altar";

vi.mock("@/app/liquid-sun/actions", () => ({ getLiquidsunMember: vi.fn() }));

describe("Altar", () => {
  it("shows the three pinnacle bottles with price, notes and their bottle photo, alternating sides", async () => {
    render(<Altar />);
    expect(screen.getByRole("heading", { level: 1, name: "The Altar" })).toBeInTheDocument();
    for (const b of pinnacleBottles) {
      expect(screen.getByRole("heading", { level: 2, name: b.name })).toBeInTheDocument();
      expect(screen.getByText(b.price)).toBeInTheDocument();
      expect(screen.getByAltText(b.name)).toBeInTheDocument();
      for (const n of b.notes) expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getByText("Only the worthy may drink")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tears of Llorona" }).parentElement).toHaveClass("md:order-1");
    expect(await screen.findByRole("button", { name: "Play ambient sound" })).toBeInTheDocument();
  });
});
