import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import FriendSurveyPage, { metadata } from "@/app/friend-survey/[token]/page";
import { getSlot } from "@/lib/friend-gate";
import { FriendSurvey } from "@/components/friend-survey/friend-survey";

vi.mock("@/lib/friend-gate", () => ({ getSlot: vi.fn() }));
type Props = Parameters<typeof FriendSurveyPage>[0];
const props = pageProps({ token: "tok" }) as unknown as Props;

describe("/friend-survey/[token]", () => {
  it("is private: noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("explains a bad or expired link", async () => {
    vi.mocked(getSlot).mockResolvedValue(null as never);
    await renderServer(FriendSurveyPage(props));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("This link isn't working.");
  });

  it("says thanks instead of the survey when already answered", async () => {
    vi.mocked(getSlot).mockResolvedValue({ responded_at: "2026-10-01", seekerName: "Tony", friend_name: "Ann", verified: true } as never);
    await renderServer(FriendSurveyPage(props));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Already submitted");
    expect(screen.getByText(/showing up for Tony/)).toBeInTheDocument();
  });

  it("opens the survey for that friend", async () => {
    vi.mocked(getSlot).mockResolvedValue({ responded_at: null, seekerName: "Tony", friend_name: null, verified: false } as never);
    const el = await FriendSurveyPage(props);
    expect(el.type).toBe(FriendSurvey);
    expect(el.props).toEqual({ token: "tok", seekerName: "Tony", friendName: "friend", verified: false });
    render(el);
    expect(screen.getAllByText(/Tony/).length).toBeGreaterThan(0);
  });
});
