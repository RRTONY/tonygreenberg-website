import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeWater } from "@/components/sake/pages/water";
import { waterSources } from "@/lib/content/sake/deep-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

vi.mock("@/components/sake/ambient-sound", () => ({ AmbientSound: ({ label }: { label?: { en: string } }) => <button type="button">{label?.en}</button> }));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeWater />
    </SakeProviders>,
  );

describe("SakeWater", () => {
  it("shows the first source, then the one picked, with its hardness", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Water Atlas/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: waterSources[0].name })).toBeInTheDocument();
    const second = waterSources[1];
    await user.click(screen.getByRole("button", { name: second.name }));
    expect(screen.getByRole("heading", { level: 2, name: second.name })).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Hardness" })).toHaveAttribute("aria-valuenow", String(Math.min(second.hardness, 200)));
  });
});
