import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SakeProviders } from "@/components/sake/sake-providers";
import { SakeTemperature } from "@/components/sake/pages/temperature";
import { temperatureSpectrum } from "@/lib/content/sake/deep-data";

vi.mock("@/app/sake/actions", () => ({
  getSakeMember: vi.fn(async () => ({ signedIn: false, id: null, email: null, name: null, isAdmin: false })),
}));

const renderPage = () =>
  render(
    <SakeProviders>
      <SakeTemperature />
    </SakeProviders>,
  );

describe("SakeTemperature", () => {
  it("lists every temperature, then shows one when picked", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: /Temperature Spectrum/ })).toBeInTheDocument();
    const first = temperatureSpectrum[0];
    expect(screen.getByText(first.name)).toBeInTheDocument();
    await user.click(screen.getByText(first.name).closest("button")!);
    expect(screen.getByRole("heading", { level: 2, name: first.name })).toBeInTheDocument();
    expect(screen.getByText(first.description)).toBeInTheDocument();
    const point = screen.getAllByRole("button", { pressed: true })[0];
    await user.click(point);
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });
});
