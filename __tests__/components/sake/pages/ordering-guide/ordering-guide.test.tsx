import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeOrderingGuide } from "@/components/sake/pages/ordering-guide/ordering-guide";
import { integrityClasses } from "@/components/sake/pages/ordering-guide/data/ordering-guide.data";
import { SakeProviders, useAesthetic } from "@/components/sake/sake-providers";
import { orderingGuideQuestions, restaurantIntegrityProfiles } from "@/lib/content/sake/supply-chain-engine";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

function LookSwitch() {
  const { toggleAesthetic } = useAesthetic();
  return (
    <button type="button" onClick={toggleAesthetic}>
      switch look
    </button>
  );
}

const renderPage = () =>
  render(
    <SakeProviders>
      <LookSwitch />
      <SakeOrderingGuide />
    </SakeProviders>,
  );

/** Answer every question with the option at `pick` (clamped to the question's options). */
async function answerAll(user: ReturnType<typeof userEvent.setup>, pick: number) {
  for (const q of orderingGuideQuestions) {
    expect(screen.getByRole("heading", { level: 3, name: q.question })).toBeInTheDocument();
    const option = q.options[Math.min(pick, q.options.length - 1)];
    await user.click(screen.getByRole("button", { name: new RegExp(option.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
  }
}

describe("SakeOrderingGuide", () => {
  it("renders the hero and the restaurant integrity cards with their flags in the page", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /The Ordering\s+Guide/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Restaurant Integrity" })).toBeInTheDocument();
    const first = restaurantIntegrityProfiles[0];
    const panel = container.querySelector(`#restaurant-${first.sakeStrategy}`) as HTMLElement;
    expect(panel).toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(first.examples);
    const card = screen.getByRole("button", { name: new RegExp(first.type) });
    await user.click(card);
    expect(panel).not.toHaveAttribute("hidden");
    expect(card).toHaveAttribute("aria-expanded", "true");
  });

  it("walks intro → five questions → result, then starts over", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 3, name: "What Should You Drink Tonight?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Begin" }));
    expect(screen.getByText(`Question 1 of ${orderingGuideQuestions.length}`)).toBeInTheDocument();
    await answerAll(user, 0);

    expect(screen.getByRole("heading", { level: 3, name: "Your Sake Path" })).toBeInTheDocument();
    expect(screen.getByText("Your Carbon Consciousness")).toBeInTheDocument();
    const buy = screen.getAllByRole("link", { name: /View & Buy/ });
    expect(buy).toHaveLength(4);
    expect(buy[0].getAttribute("href")).toMatch(/^\/sake\/bottle\//);
    expect(screen.getAllByRole("link", { name: /^Dollar Map$/ })[0].getAttribute("href")).toMatch(/^\/sake\/supply-chain\?sake=/);
    expect(screen.getByRole("link", { name: /Set Deal Alerts/ })).toHaveAttribute("href", "/sake/deal-alerts");
    expect(screen.getByRole("link", { name: /QPR Rankings/ })).toHaveAttribute("href", "/sake/qpr");

    await user.click(screen.getByRole("button", { name: "Start Over" }));
    expect(screen.getByRole("button", { name: "Begin" })).toBeInTheDocument();
  });

  it("labels the carbon mindset from the answers and works in the Austere look", async () => {
    const user = userEvent.setup();
    const { container } = renderPage();
    await user.click(screen.getByRole("button", { name: "switch look" }));
    expect(container.querySelector(".bg-stone-50")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Begin" }));
    await answerAll(user, 99);
    expect(screen.getByText(/^(Eco-Warrior|Conscious|Experience-First)$/)).toBeInTheDocument();
  });

  it("colors integrity scores green, amber or red", () => {
    expect(integrityClasses(90).text).toContain("#22c55e");
    expect(integrityClasses(60).text).toContain("#eab308");
    expect(integrityClasses(20).text).toContain("#ef4444");
  });
});
