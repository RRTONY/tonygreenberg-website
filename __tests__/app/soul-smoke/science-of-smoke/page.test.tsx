import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/soul-smoke/science-of-smoke/page";
import { SoulsmokeProviders } from "@/components/soulsmoke/soulsmoke-providers";

describe("/soul-smoke/science-of-smoke page", () => {
  it("uses the page's own heading as its title, with a canonical under /soul-smoke", () => {
    expect(metadata.title).toBe("The Science of Smoke | SoulSmoke");
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe("/soul-smoke/science-of-smoke");
  });

  it("renders the ported page", () => {
    render(
      <SoulsmokeProviders>
        <Page />
      </SoulsmokeProviders>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/The Science of Smoke/);
  });
});
