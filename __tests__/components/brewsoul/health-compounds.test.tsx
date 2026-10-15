import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HealthCompounds } from "@/components/brewsoul/health-compounds";

const compounds = [
  { name: "Chlorogenic acid", amount: "70-350mg", effect: "Antioxidant", source: "Smith 2020", preserved: true },
  { name: "Caffeine", amount: "95mg", effect: "Stimulant", source: "Jones 2019", preserved: false },
];

describe("HealthCompounds", () => {
  it("labels whether each compound survives decaf", () => {
    render(<HealthCompounds compounds={compounds} />);
    expect(screen.getByRole("button", { name: /Chlorogenic acid/ })).toHaveTextContent("Preserved in Decaf");
    expect(screen.getByRole("button", { name: /Caffeine/ })).toHaveTextContent("Lost in Decaf");
  });

  it("opens one compound's effect and citation at a time", async () => {
    const user = userEvent.setup();
    render(<HealthCompounds compounds={compounds} />);
    expect(screen.queryByText("Smith 2020")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Chlorogenic acid/ }));
    expect(screen.getByText("Smith 2020")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Caffeine/ }));
    expect(screen.queryByText("Smith 2020")).not.toBeInTheDocument();
    expect(screen.getByText("Jones 2019")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Caffeine/ }));
    expect(screen.queryByText("Jones 2019")).not.toBeInTheDocument();
  });
});
