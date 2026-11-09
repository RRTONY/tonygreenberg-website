import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowToGetAllocated } from "@/components/soulsmoke/pages/how-to-get-allocated";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("HowToGetAllocated", () => {
  it("shows the five steps, the rules and the events", () => {
    render(
      <SoulsmokeProviders>
        <HowToGetAllocated />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How to Get Allocated");
    for (const step of [
      "Start with What's Available",
      "Build Your Network at Home",
      "Go to Oaxaca",
      "Visit Palenques with Respect",
      "Play the Long Game",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: step })).toBeInTheDocument();
    }
    expect(screen.getByText("Never show up unannounced.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Feria del Mezcal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Meet the Producers/ })).toHaveAttribute("href", "/soul-smoke/producers");
    expect(screen.getByRole("link", { name: /Back to Home/ })).toHaveAttribute("href", "/soul-smoke");
  });
});
