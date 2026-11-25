import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeQuizHero } from "@/components/sake/sake-quiz-hero/sake-quiz-hero";
import { getRecommendations, sakeQuizHeroData } from "@/components/sake/sake-quiz-hero/data/sake-quiz-hero.data";
import type { QPRSake } from "@/lib/content/sake/qpr-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

describe("getRecommendations", () => {
  it("returns the three best-scoring sakes for the answers", () => {
    const base = {
      flavorProfile: [],
      aromaProfile: [],
      type: "Junmai",
      description: "",
      smv: 0,
      acidity: 1,
      priceUS: 80,
      qprTier: "good",
      qualityScore: 70,
      usAvailability: "widely",
      qprUS: 50,
      prefecture: "Niigata",
      experienceScore: 50,
    };
    const db = [
      { ...base, id: "a" },
      { ...base, id: "local", prefecture: "California, USA", priceUS: 30 },
      { ...base, id: "value", qprUS: 90, qprTier: "legendary" },
      { ...base, id: "b" },
    ] as unknown as QPRSake[];
    const picks = getRecommendations({ mood: "light", experience: "new", values: "local" }, db);
    expect(picks).toHaveLength(3);
    expect(picks[0].id).toBe("local");
    expect(getRecommendations({ values: "value" }, db)[0].id).toBe("value");
  });
});

describe("SakeQuizHero", () => {
  it("walks through the three questions to three linked bottles, and starts over", async () => {
    const user = userEvent.setup();
    render(
      <SakeProviders>
        <SakeQuizHero />
      </SakeProviders>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Find Your Perfect Bottle" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Let's Go/ }));

    for (const [i, q] of sakeQuizHeroData.questions.entries()) {
      expect(screen.getByText(`Question ${i + 1} of 3`)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3, name: q.en })).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: q.options[0].en }));
    }

    expect(screen.getByRole("heading", { level: 2, name: "Your 3 Perfect Bottles" })).toBeInTheDocument();
    const bottles = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/sake/bottle/"));
    expect(bottles).toHaveLength(3);
    expect(screen.getByRole("link", { name: /See All QPR Rankings/ })).toHaveAttribute("href", "/sake/qpr");

    await user.click(screen.getByRole("button", { name: /Try Again/ }));
    expect(screen.getByRole("button", { name: /Let's Go/ })).toBeInTheDocument();
  });
});
