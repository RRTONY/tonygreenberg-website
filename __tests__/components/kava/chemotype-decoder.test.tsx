import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChemotypeDecoder } from "@/components/kava/chemotype-decoder";

const input = () => screen.getByPlaceholderText("e.g. 4-2-6-5-3-1");

describe("ChemotypeDecoder", () => {
  it("decodes a chemotype in order, marks the dominant one and the ceremony grade for kavain", async () => {
    render(<ChemotypeDecoder />);
    await userEvent.type(input(), "4-2-6-5-3-1");
    await userEvent.click(screen.getByRole("button", { name: "Decode" }));
    expect(screen.getByText("DOMINANT: Kavain")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    const names = ["Kavain", "Dihydrokavain", "Methysticin", "Dihydromethysticin", "Yangonin", "Desmethoxyyangonin"];
    const text = document.body.textContent!;
    const positions = names.map((n) => text.indexOf(n));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(screen.getByText(/PRI Ceremony Grade:/)).toBeInTheDocument();
  });

  it("ignores repeats and characters outside 1-6, and Enter also decodes", async () => {
    render(<ChemotypeDecoder />);
    await userEvent.type(input(), "2 2 9 x 3{Enter}");
    expect(screen.getByText("DOMINANT: Dihydrokavain")).toBeInTheDocument();
    expect(screen.getByText("Yangonin")).toBeInTheDocument();
    expect(screen.getAllByText(/Dihydrokavain/)).toHaveLength(1);
    expect(screen.queryByText(/PRI Ceremony Grade:/)).not.toBeInTheDocument();
  });

  it("shows nothing for input with no valid numbers", async () => {
    render(<ChemotypeDecoder />);
    await userEvent.type(input(), "789");
    await userEvent.click(screen.getByRole("button", { name: "Decode" }));
    expect(screen.queryByText(/DOMINANT:/)).not.toBeInTheDocument();
  });
});
