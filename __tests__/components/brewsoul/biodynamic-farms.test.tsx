import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BiodynamicFarms, FARMS } from "@/components/brewsoul/biodynamic-farms";

describe("BiodynamicFarms", () => {
  it("lists the 3 Demeter farms with their certifications and impact numbers", () => {
    render(<BiodynamicFarms />);
    expect(FARMS).toHaveLength(3);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    for (const f of FARMS) {
      const card = screen.getByRole("button", { name: new RegExp(f.name) });
      expect(card).toHaveTextContent(f.co2);
      for (const c of f.cert) expect(card).toHaveTextContent(c);
    }
  });

  it("every farm is Demeter-certified", () => {
    for (const f of FARMS) expect(f.cert).toContain("Demeter");
  });

  it("opens one farm's story and roasters at a time", async () => {
    const user = userEvent.setup();
    render(<BiodynamicFarms />);
    const [a, b] = FARMS;
    expect(screen.queryByText(a.story)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(a.name) }));
    expect(screen.getByText(a.story)).toBeInTheDocument();
    expect(screen.getByText(`Supplies to: ${a.roasters.join(" · ")}`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(b.name) }));
    expect(screen.queryByText(a.story)).not.toBeInTheDocument();
    expect(screen.getByText(b.story)).toBeInTheDocument();
  });
});
