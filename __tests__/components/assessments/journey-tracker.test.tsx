import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JOURNEY_MAP, JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";
import { recordFinish } from "@/lib/assessments/record-finish";
import { setJourneyStep } from "@/app/assessments/actions";

vi.mock("@/lib/assessments/record-finish", () => ({ recordFinish: vi.fn() }));
vi.mock("@/app/assessments/actions", () => ({
  recordAssessmentResult: vi.fn(),
  syncJourneyProgress: vi.fn(async () => null),
  setJourneyStep: vi.fn(async () => undefined),
}));

const KEY = "findyour_journey_progress";

describe("JOURNEY_MAP", () => {
  it("has unique ids and internal urls", () => {
    expect(new Set(JOURNEY_MAP.map((e) => e.id)).size).toBe(JOURNEY_MAP.length);
    for (const e of JOURNEY_MAP) expect(e.isExternal || e.url.startsWith("/")).toBe(true);
  });
});

describe("useJourneyProgress", () => {
  it("markComplete stores the id in localStorage and saves the finish under the page address", () => {
    const { result } = renderHook(() => useJourneyProgress());
    expect(result.current.stats.done).toBe(0);
    act(() => result.current.markComplete("find-your-purpose", { summary: "x" }));
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(["find-your-purpose"]);
    expect(result.current.completed.has("find-your-purpose")).toBe(true);
    expect(recordFinish).toHaveBeenCalledWith({ assessment: "dharma-finder", journeyId: "find-your-purpose", summary: "x" });
    expect(result.current.stats).toMatchObject({
      total: JOURNEY_MAP.length,
      done: 1,
      remaining: JOURNEY_MAP.length - 1,
      pct: Math.round((1 / JOURNEY_MAP.length) * 100),
    });
  });

  it("toggleComplete flips an id and only syncs to the account when a session cookie exists", () => {
    const { result } = renderHook(() => useJourneyProgress());
    act(() => result.current.toggleComplete("soulscore"));
    expect(result.current.completed.has("soulscore")).toBe(true);
    expect(setJourneyStep).not.toHaveBeenCalled();
    document.cookie = "sb-test-auth-token=abc; path=/";
    act(() => result.current.toggleComplete("soulscore"));
    expect(result.current.completed.has("soulscore")).toBe(false);
    expect(setJourneyStep).toHaveBeenCalledWith("soulscore", false);
  });

  it("a signed-in visitor's progress is merged once with the progress saved on their account", async () => {
    // Fresh module copy: the account sync runs once per page load.
    vi.resetModules();
    const fresh = await import("@/components/assessments/journey-tracker");
    const actions = await import("@/app/assessments/actions");
    vi.mocked(actions.syncJourneyProgress).mockResolvedValue(["find-your-diet", "soulscore"]);
    localStorage.setItem(KEY, JSON.stringify(["soulscore"]));
    document.cookie = "sb-test-auth-token=abc; path=/";
    const { result } = renderHook(() => fresh.useJourneyProgress());
    expect(actions.syncJourneyProgress).toHaveBeenCalledWith(["soulscore"]);
    await vi.waitFor(() => expect(result.current.completed.has("find-your-diet")).toBe(true));
    expect(JSON.parse(localStorage.getItem(KEY)!).sort()).toEqual(["find-your-diet", "soulscore"]);
    // A second tracker on the same page doesn't ask the server again.
    renderHook(() => fresh.useJourneyProgress());
    expect(actions.syncJourneyProgress).toHaveBeenCalledTimes(1);
  });

  it("visitors without a session cookie never call the server for sync", async () => {
    vi.resetModules();
    const fresh = await import("@/components/assessments/journey-tracker");
    const actions = await import("@/app/assessments/actions");
    renderHook(() => fresh.useJourneyProgress());
    expect(actions.syncJourneyProgress).not.toHaveBeenCalled();
  });

  it("the server-rendered HTML shows no progress, so it matches the first browser render", () => {
    localStorage.setItem(KEY, JSON.stringify(JOURNEY_MAP.map((e) => e.id)));
    const html = renderToString(<JourneyTracker compact />);
    expect(html).toContain(`0<!-- -->/<!-- -->${JOURNEY_MAP.length}`);
    expect(html).not.toContain("Journey complete");
  });

  it("survives broken JSON in localStorage", () => {
    localStorage.setItem(KEY, "{not json");
    const { result } = renderHook(() => useJourneyProgress());
    expect(result.current.stats.done).toBe(0);
  });
});

describe("JourneyTracker", () => {
  it("shows the starting message and expands into the full map with the current one marked", async () => {
    const user = userEvent.setup();
    render(<JourneyTracker variant="light" currentAssessmentId="find-your-diet" />);
    expect(screen.getByText(`${JOURNEY_MAP.length} experiences. One complete picture of you.`)).toBeInTheDocument();
    expect(screen.getByText(`0 of ${JOURNEY_MAP.length} completed`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /view full journey map/i }));
    expect(screen.getByRole("link", { name: "Find Your Diet" })).toHaveAttribute("href", "/find-your-diet");
    expect(screen.getByText("Here")).toBeInTheDocument();
    expect(screen.getByText("Body & Temple")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /hide details/i }));
    expect(screen.queryByRole("link", { name: "Find Your Diet" })).not.toBeInTheDocument();
  });

  it("reflects progress from localStorage and lets the visitor tick items", async () => {
    localStorage.setItem(KEY, JSON.stringify(JOURNEY_MAP.slice(0, Math.ceil(JOURNEY_MAP.length / 2)).map((e) => e.id)));
    const user = userEvent.setup();
    render(<JourneyTracker />);
    expect(screen.getByText("More than halfway. The mirrors are getting clearer.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /view full journey map/i }));
    const link = screen.getByRole("link", { name: "Find Your Peptide" });
    const checkbox = link.closest("div")!.parentElement!.querySelector("button")!;
    await user.click(checkbox);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toContain("find-your-peptide");
  });

  it("compact mode shows the count and the 'complete' line when everything is done", () => {
    localStorage.setItem(KEY, JSON.stringify(JOURNEY_MAP.map((e) => e.id)));
    render(<JourneyTracker compact />);
    expect(screen.getByText(`${JOURNEY_MAP.length}/${JOURNEY_MAP.length} · 100%`)).toBeInTheDocument();
    expect(screen.getByText("Journey complete. You found yourself.")).toBeInTheDocument();
  });

  it("the compact tracker opens the full journey list when clicked, and closes again", async () => {
    const user = userEvent.setup();
    render(<JourneyTracker compact />);
    const bar = screen.getByRole("button", { name: /your journey/i });
    expect(bar).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Find Your Diet" })).not.toBeInTheDocument();
    await user.click(bar);
    expect(bar).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Find Your Diet" })).toBeInTheDocument();
    await user.click(bar);
    expect(screen.queryByRole("link", { name: "Find Your Diet" })).not.toBeInTheDocument();
  });
});
