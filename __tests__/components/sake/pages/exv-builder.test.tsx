import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeExvBuilder } from "@/components/sake/pages/exv-builder";
import { exvDimensions } from "@/lib/content/sake/experience-data";
import { renderSake } from "@tests/components/sake/sake-test-utils";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("SakeExvBuilder", () => {
  it("scores the seven dimensions, reveals the tier and resets", async () => {
    const user = userEvent.setup();
    renderSake(<SakeExvBuilder />);
    expect(screen.getByRole("heading", { level: 1, name: /Build Your\s*Soul Print/ })).toBeInTheDocument();
    expect(screen.getByText("35")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: exvDimensions[0].name }), { target: { value: "10" } });
    expect(screen.getByText("40")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Sake Name (optional)"), "Dassai 23");
    expect(screen.getAllByText("Dassai 23").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /Reveal Soul Print/ }));
    expect(screen.getByText(/TAKUMI/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn the EXV System/ })).toHaveAttribute("href", "/sake/exv");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText("35")).toBeInTheDocument();
    expect(screen.queryByText(/TAKUMI/)).toBeNull();
  });

  it("opens a dimension's guide question, with the description in Connoisseur mode and Austere colors", async () => {
    const user = userEvent.setup();
    const { container } = renderSake(<SakeExvBuilder />);
    const dim = exvDimensions[1];
    const header = screen.getByRole("button", { name: new RegExp(dim.name) });
    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(dim.guideQuestion)).toBeInTheDocument();
    expect(screen.queryByText(dim.description)).toBeNull();
    await user.click(screen.getByTestId("toggle-mode"));
    expect(screen.getByText(dim.description)).toBeInTheDocument();
    await user.click(screen.getByTestId("toggle-austere"));
    expect(container.querySelector(".bg-\\[\\#f5f0e8\\]")).not.toBeNull();
    await user.click(header);
    expect(screen.queryByText(dim.guideQuestion)).toBeNull();
  });
});
