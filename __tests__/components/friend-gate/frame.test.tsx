import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GateFrame, gateButton, gateH1 } from "@/components/friend-gate/frame";
import { FRIEND_GATE_FOOTER } from "@/lib/content/friend-gate";

describe("GateFrame", () => {
  it("wraps its children with the brand line and footer", () => {
    render(
      <GateFrame>
        <p>Inside the card</p>
      </GateFrame>,
    );
    expect(screen.getByText("Inside the card")).toBeInTheDocument();
    expect(screen.getByText("Only Time Buys Trust · onlytimebuystrust.com")).toBeInTheDocument();
    expect(screen.getByText(FRIEND_GATE_FOOTER)).toBeInTheDocument();
  });

  it("exports full literal class strings for the steps", () => {
    expect(gateH1).toContain("font-bold");
    expect(gateButton).toContain("min-h-12");
    expect(gateButton).toContain("disabled:opacity-70");
  });
});
