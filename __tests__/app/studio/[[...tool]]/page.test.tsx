import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StudioPage from "@/app/studio/[[...tool]]/page";

// The real Studio is a huge client bundle; check only that it gets this
// project's config.
vi.mock("../../../../sanity.config", () => ({ default: { name: "tonyg-test-config" } }));
vi.mock("next-sanity/studio", () => ({
  NextStudio: ({ config }: { config: { name: string } }) => <div data-testid="studio">{config.name}</div>,
}));

describe("/studio", () => {
  it("loads Sanity Studio with this project's config", async () => {
    render(<StudioPage />);
    expect(await screen.findByTestId("studio")).toHaveTextContent("tonyg-test-config");
  });
});
