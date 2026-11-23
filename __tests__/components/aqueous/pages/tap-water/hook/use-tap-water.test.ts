import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { STEP, tapWaterResults, useTapWater } from "@/components/aqueous/pages/tap-water/hook/use-tap-water";
import { tapWaterData, surveyQuestions } from "@/components/aqueous/pages/tap-water/data/tap-water.data";
import { tapWaterDatabase } from "@/lib/content/aqueous/water-data";

type Success = (pos: { coords: { latitude: number; longitude: number } }) => void;
type Failure = () => void;

function stubGeolocation(impl?: (ok: Success, fail: Failure) => void) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: impl ? { getCurrentPosition: vi.fn(impl) } : undefined,
  });
}

function stubReverse(address: Record<string, string> | Error) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      if (address instanceof Error) throw address;
      return new Response(JSON.stringify({ address }));
    }),
  );
}

const at = (ok: Success) => ok({ coords: { latitude: 34, longitude: -118 } });

afterEach(() => {
  vi.unstubAllGlobals();
  stubGeolocation();
});

describe("tapWaterResults", () => {
  it("shows nothing for an empty query unless browsing all", () => {
    expect(tapWaterResults("", false)).toEqual([]);
    expect(tapWaterResults("", true)).toHaveLength(tapWaterDatabase.length);
  });

  it("maps a ZIP code to its city, then falls back to the city search", () => {
    expect(tapWaterResults("10002", false).map((c) => c.id)).toEqual(["new-york-ny"]);
    // A ZIP that isn't in the map still searches the database's own ZIPs.
    expect(tapWaterResults("90401", false).map((c) => c.id)).toEqual(["santa-monica-ca"]);
    expect(tapWaterResults(" flint ", false).map((c) => c.id)).toEqual(["flint-mi"]);
  });
});

describe("useTapWater", () => {
  it("moves between search, detail, survey and results", () => {
    const { result } = renderHook(() => useTapWater());
    expect(result.current.state.step).toBe(STEP.search);

    act(() => result.current.setQuery("10002"));
    expect(result.current.matchedViaZip).toBe(true);
    act(() => result.current.selectCity(result.current.results[0]));
    expect(result.current.state.step).toBe(STEP.detail);

    act(() => result.current.startSurvey());
    expect(result.current.state.step).toBe(STEP.survey);
    expect(result.current.progress).toBe(10);
    act(() => result.current.answer("healthPriority", 9));
    expect(result.current.state.survey.healthPriority).toBe(9);
    for (let i = 0; i < surveyQuestions.length; i++) act(() => result.current.nextQuestion());
    expect(result.current.state.step).toBe(STEP.results);

    act(() => result.current.back());
    expect(result.current.state).toMatchObject({ step: STEP.search, selectedCity: null });

    act(() => result.current.onNext());
    expect(result.current.state.step).toBe(STEP.detail);
    act(() => result.current.onNext(STEP.search));
    expect(result.current.state.step).toBe(STEP.search);
  });

  it("previous question steps back, and from the first question leaves the survey", () => {
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.startSurvey());
    act(() => result.current.nextQuestion());
    act(() => result.current.previousQuestion());
    expect(result.current.state.questionIndex).toBe(0);
    act(() => result.current.previousQuestion());
    expect(result.current.state.step).toBe(STEP.search);
  });

  it("reports a browser without geolocation", () => {
    stubGeolocation();
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.geolocate());
    expect(result.current.state).toMatchObject({ locating: false, locationError: tapWaterData.geo.unsupported });
  });

  it("reports a denied location", () => {
    stubGeolocation((_ok, fail) => fail());
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.geolocate());
    expect(result.current.state).toMatchObject({ locating: false, locationError: tapWaterData.geo.denied });
  });

  it("opens the city matched by the postcode", async () => {
    stubReverse({ city: "Santa Monica", postcode: "90401" });
    stubGeolocation(at);
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.geolocate());
    await waitFor(() => expect(result.current.state.step).toBe(STEP.detail));
    expect(result.current.state).toMatchObject({ query: "Santa Monica (90401)", locating: false });
    expect(result.current.state.selectedCity?.id).toBe("santa-monica-ca");
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("nominatim.openstreetmap.org/reverse?lat=34&lon=-118");
  });

  it("falls back to the town name: one match opens it, several just fill the search", async () => {
    stubReverse({ town: "Flint", postcode: "99999" });
    stubGeolocation(at);
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.geolocate());
    await waitFor(() => expect(result.current.state.locating).toBe(false));
    expect(result.current.state).toMatchObject({ step: STEP.detail, query: "Flint" });

    stubReverse({ county: "California" });
    const second = renderHook(() => useTapWater()).result;
    act(() => second.current.geolocate());
    await waitFor(() => expect(second.current.state.query).toBe("California"));
    expect(second.current.state.step).toBe(STEP.search);
    expect(second.current.state.locating).toBe(false);
  });

  it("says so when no city comes back or the lookup fails", async () => {
    stubReverse({ village: "" });
    stubGeolocation(at);
    const { result } = renderHook(() => useTapWater());
    act(() => result.current.geolocate());
    await waitFor(() => expect(result.current.state.locationError).toBe(tapWaterData.geo.noCity));

    stubReverse(new Error("offline"));
    act(() => result.current.geolocate());
    await waitFor(() => expect(result.current.state.locationError).toBe(tapWaterData.geo.failed));
    expect(result.current.state.locating).toBe(false);
  });
});
