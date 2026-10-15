import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostIntervention } from "@/components/post-intervention/post-intervention";
import { submitPostIntervention } from "@/app/post-intervention/actions";

vi.mock("@/app/post-intervention/actions", () => ({ submitPostIntervention: vi.fn() }));

describe("PostIntervention (whole flow)", () => {
  beforeEach(() => {
    vi.mocked(submitPostIntervention).mockResolvedValue({ ok: true });
  });

  it("day -> type -> survey -> done -> start over", async () => {
    const user = userEvent.setup();
    render(<PostIntervention />);
    await user.click(screen.getByRole("button", { name: /Day 1/ }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("What Did You Go Through?");
    await user.click(screen.getByRole("radio", { name: "Meditation / Retreat" }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Honest Assessment");
    const groups = screen.getAllByRole("group");
    for (let i = 0; i < 3; i++) await user.click(within(groups[i]).getByRole("button", { name: "5, Neutral" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: /Submit Anonymously/ }));

    expect(await screen.findByRole("heading", { name: "Thank You for Your Honesty" })).toBeInTheDocument();
    expect(screen.getByText(/Come back at Day 3 /)).toBeInTheDocument();
    expect(submitPostIntervention).toHaveBeenCalledWith(expect.objectContaining({ dayChoice: 1, interventionType: "meditation", integrationScore: 5, wouldRecommend: "yes" }));

    await user.click(screen.getByRole("button", { name: "Take Another Assessment" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How Are You, Really?");
  });
});
