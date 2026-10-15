import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SoulScorePage, { metadata } from "@/app/soulscore/page";
import { defaultOpenGraph } from "@/lib/seo-defaults";

describe("/soulscore", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("SoulScore™ — 12-Dimension Impact Measurement Engine");
    expect(metadata.description).toMatch(/Score consciousness, not just carbon, across 12 weighted dimensions/);
    expect(metadata.alternates?.canonical).toBe("/soulscore");
  });

  it("keeps the shared share image in its own openGraph", () => {
    expect(metadata.openGraph).toMatchObject({
      ...defaultOpenGraph,
      title: "SoulScore™ — 12-Dimension Impact Measurement Engine",
      url: "/soulscore",
    });
    expect((metadata.openGraph as { images: unknown[] }).images).toEqual(defaultOpenGraph.images);
  });

  it("renders one H1 and the landing copy", () => {
    const { container } = render(<SoulScorePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("SoulScore™");
    expect(container.textContent).toContain("The first impact measurement engine that scores consciousness, not just carbon.");
    expect(screen.getByText("Interactive · ~3 minutes · No account required")).toBeInTheDocument();
  });

  it("launches the tool and switches between its tabs", async () => {
    const user = userEvent.setup();
    render(<SoulScorePage />);
    await user.click(screen.getByRole("button", { name: /Launch SoulScore/ }));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/12 Dimensions × Any Entity × Real-Time/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "BENCHMARK" }));
    expect(screen.getByRole("heading", { level: 2, name: "Benchmark Comparison" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "FAILURES" }));
    expect(screen.getByRole("heading", { level: 2, name: "Why Every Impact System Failed" })).toBeInTheDocument();
  });
});
