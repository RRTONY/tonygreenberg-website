import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/hall-of-fame/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/hall-of-fame page", () => {
  it("uses the page's own heading as its title, with a canonical under /soul-smoke", () => {
    expect(metadata.title).toBe("Hall of Fame | SoulSmoke");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/hall-of-fame");
  });

  it("renders the ported page", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Hall of/);
  });
});
