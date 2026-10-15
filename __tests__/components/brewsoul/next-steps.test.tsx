import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextSteps } from "@/components/brewsoul/next-steps";

const steps = [
  { label: "Glossary", path: "/brewsoul/glossary", description: "Speak coffee" },
  { label: "Farms", path: "/brewsoul/farms", description: "Meet growers" },
];

describe("NextSteps", () => {
  it("renders one link per step with its label and description", () => {
    render(<NextSteps steps={steps} />);
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/brewsoul/glossary", "/brewsoul/farms"]);
    expect(links[0]).toHaveTextContent("GlossarySpeak coffee");
  });

  it("uses the default title unless one is given", () => {
    const { unmount } = render(<NextSteps steps={steps} />);
    expect(screen.getByText("Continue Your Journey")).toBeInTheDocument();
    unmount();
    render(<NextSteps steps={steps} title="Keep going" />);
    expect(screen.getByText("Keep going")).toBeInTheDocument();
  });

  it("stacks to one column on phones and caps at three columns", () => {
    const four = [...steps, { label: "A", path: "/a", description: "a" }, { label: "B", path: "/b", description: "b" }];
    const { container } = render(<NextSteps steps={four} />);
    const grid = container.querySelector(".grid")!;
    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("sm:grid-cols-3");
  });
});
