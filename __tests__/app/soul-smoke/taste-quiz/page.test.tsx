import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/taste-quiz/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/taste-quiz page", () => {
  it("uses the page's own heading as its title, with a canonical under /soul-smoke", () => {
    expect(metadata.title).toBe("Your Top 10 Quest List | SoulSmoke");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/taste-quiz");
  });

  it("renders the ported page", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/How do you feel about smoke/);
  });
});
