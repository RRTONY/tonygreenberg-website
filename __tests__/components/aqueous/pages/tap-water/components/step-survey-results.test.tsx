import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { scoreSurvey, StepSurveyResults } from "@/components/aqueous/pages/tap-water/components/step-survey-results";
import { STEP, useTapWater, type TapWaterState } from "@/components/aqueous/pages/tap-water/hook/use-tap-water";
import { defaultSurvey, type SurveyAnswers } from "@/components/aqueous/pages/tap-water/data/tap-water.data";
import { getTapWaterById } from "@/lib/content/aqueous/water-data";

function Harness({ init }: { init: Partial<TapWaterState> }) {
  const tap = useTapWater();
  // Put the flow on the results step with the given answers, once (during the first render).
  const [done, setDone] = useState(false);
  if (!done) {
    setDone(true);
    tap.updateState({ step: STEP.results, ...init });
  }
  return (
    <>
      <span data-testid="step">{tap.state.step}</span>
      <StepSurveyResults tap={tap} />
    </>
  );
}

const all = (n: number): SurveyAnswers =>
  Object.fromEntries(Object.keys(defaultSurvey).map((k) => [k, n])) as SurveyAnswers;

describe("scoreSurvey", () => {
  it("picks each archetype", () => {
    expect(scoreSurvey(all(8), null).profileType).toBe("The Conscious Satisfier");
    expect(scoreSurvey({ ...all(8), lifestyleAlignment: 1 }, null).profileType).toBe("The Regenerative Guardian");
    expect(scoreSurvey({ ...all(8), environmentalConcern: 1, glassPreference: 1 }, null).profileType).toBe(
      "The Health Optimizer",
    );
    expect(scoreSurvey({ ...all(3), environmentalConcern: 8, glassPreference: 8, carbonFootprint: 8 }, null).profileType).toBe(
      "The Eco Warrior",
    );
    expect(scoreSurvey(all(3), null).profileType).toBe("The Smart Economist");
    expect(scoreSurvey(defaultSurvey, null).profileType).toBe("The Awakening Explorer");
  });

  it("recommends RO for a poor city score or a health priority", () => {
    expect(scoreSurvey(defaultSurvey, 50).needsRO).toBe(true);
    expect(scoreSurvey(defaultSurvey, 80).needsRO).toBe(false);
    expect(scoreSurvey({ ...defaultSurvey, healthPriority: 7 }, null).needsRO).toBe(true);
    expect(scoreSurvey(defaultSurvey, null).needsRO).toBe(false);
  });
});

describe("StepSurveyResults", () => {
  it("shows a budget RO pick, glass, conscious card and a critical city note", () => {
    const init = { survey: { ...all(8), budgetRange: 2 }, selectedCity: getTapWaterById("flint-mi") };
    render(<Harness init={init} />);
    expect(screen.getByRole("heading", { name: "The Conscious Satisfier" })).toBeInTheDocument();
    expect(screen.getByText(/You embody the Great Simplification/)).toBeInTheDocument();
    expect(screen.getByText("For Flint, Michigan (QPR: 22)").parentElement).toHaveClass("bg-red-50");
    expect(screen.getByText(/critically low.*4 contaminants exceed/)).toBeInTheDocument();
    expect(screen.getByText(/Best value: iSpring RCC7AK/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View our Filter Guide" })).toHaveAttribute("href", "/aqueous/filter-guide");
    expect(screen.getByRole("link", { name: "Explore glass-bottled waters" })).toHaveAttribute("href", "/aqueous/explore");
    expect(screen.getByRole("link", { name: "Learn about conscious satisfaction" })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByRole("link", { name: "View Filter Recommendations" })).toHaveAttribute("href", "/aqueous/filter-guide");
  });

  it("shows the premium RO pick and a concerned city note", () => {
    const init = { survey: { ...defaultSurvey, healthPriority: 9 }, selectedCity: getTapWaterById("santa-monica-ca") };
    render(<Harness init={init} />);
    expect(screen.getByText(/Premium pick: APEC ROES-PH75/)).toBeInTheDocument();
    expect(screen.getByText(/significant concerns/).parentElement).toHaveClass("bg-amber-50");
  });

  it("without RO or glass needs shows only the always-on card, a good-city note and the cost table", () => {
    render(<Harness init={{ survey: all(1), selectedCity: getTapWaterById("seattle-wa") }} />);
    expect(screen.queryByText("Install a Reverse Osmosis System")).toBeNull();
    expect(screen.queryByText("Switch to Glass-Bottled Water")).toBeNull();
    expect(screen.queryByText("Join the Conscious Satisfier Movement")).toBeNull();
    expect(screen.getByText("Reduce, Do Not Replace")).toBeInTheDocument();
    expect(screen.getByText(/relatively good/).parentElement).toHaveClass("bg-green-50");
    expect(screen.getByText("Best Value")).toBeInTheDocument();
    expect(screen.getByText("0 (adds ~60/mo)")).toHaveClass("text-red-600");
  });

  it("works without a city, and both back buttons return to the search", async () => {
    const user = userEvent.setup();
    render(<Harness init={{}} />);
    expect(screen.queryByText(/^For /)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Back to Search" }));
    expect(screen.getByTestId("step")).toHaveTextContent(String(STEP.search));
  });
});
