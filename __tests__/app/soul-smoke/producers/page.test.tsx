import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/producers/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/producers page", () => {
  it("uses the page's own heading as its title, with a canonical under /soul-smoke", () => {
    expect(metadata.title).toBe("The Makers | SoulSmoke");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/producers");
  });

  it("renders the ported page", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The Makers/);
  });
});
