import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { AqueousHome } from "@/components/aqueous/pages/home";
import { getBestValueWaters, getTopRatedWaters } from "@/lib/content/aqueous/water-data";
import { aqueousImages } from "@/lib/content/aqueous/images";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(),
  claimReferral: vi.fn(),
}));

function renderHome() {
  return render(
    <AqueousProviders>
      <AqueousHome />
    </AqueousProviders>,
  );
}

async function subscribe(email: string, name = "") {
  if (name) fireEvent.change(screen.getByLabelText("Name (optional)"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Get My Free AWI Preview" }));
  });
}

describe("AqueousHome", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders every section with on-site links and the Sanity photos", () => {
    const { container } = renderHome();
    expect(screen.getByRole("heading", { level: 1, name: /Know What Flows/ })).toBeInTheDocument();
    for (const name of [
      "The Three Pillars of QPR",
      "Top Rated Waters",
      /The Price-to-Value/,
      /Conscious Consumption/,
      "The Wall of Shame",
      "Stop Paying for Plastic. Start Filtering.",
      "Every Drop Tells a Story",
      "Get Your Free Water Insight",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "See Your AWI Rankings" })).toHaveAttribute("href", "/aqueous/awi");
    expect(screen.getAllByRole("link", { name: /Check Your Tap Water/ })[0]).toHaveAttribute("href", "/aqueous/tap-water");
    expect(screen.getByRole("link", { name: /Read Our Philosophy/ })).toHaveAttribute("href", "/aqueous/philosophy");
    expect(screen.getByRole("link", { name: /See the Wall of Shame/ })).toHaveAttribute("href", "/aqueous/wall-of-shame");
    expect(screen.getByRole("link", { name: /Filter Guide/ })).toHaveAttribute("href", "/aqueous/filter-guide");
    expect(screen.getByRole("link", { name: /Compare Waters/ })).toHaveAttribute("href", "/aqueous/compare");
    expect(screen.getByRole("link", { name: /Read the Manifesto/ })).toHaveAttribute("href", "/aqueous/manifesto");
    expect(screen.getByRole("link", { name: /View All Waters/ })).toHaveAttribute("href", "/aqueous/explore");
    for (const w of getTopRatedWaters(4)) expect(screen.getAllByRole("heading", { name: w.name }).length).toBeGreaterThan(0);
    for (const w of getBestValueWaters(3)) {
      expect(container.querySelector(`a[href="/aqueous/water/${w.id}"]`)).not.toBeNull();
    }
    expect(screen.getByRole("img", { name: aqueousImages.waterTestingLab.alt })).toBeInTheDocument();
    const srcs = Array.from(container.querySelectorAll("img")).map((i) => i.getAttribute("src") ?? "");
    expect(srcs.some((s) => s.includes(aqueousImages.heroWaterSacred.src))).toBe(true);
    expect(srcs.some((s) => s.includes(aqueousImages.natureSpringSource.src))).toBe(true);
    expect(container.innerHTML).not.toMatch(/manus/i);
    expect(screen.getByText("QPR 89")).toHaveClass("text-emerald-600");
    expect(screen.getByText("QPR 48")).toHaveClass("text-red-500");
    expect(container.querySelector("#floating-share")).not.toBeNull();
  });

  it("subscribes through /api/subscribe and shows the share card", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    renderHome();
    await subscribe(" me@example.com ", "Ana");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/subscribe",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ email: "me@example.com", source: "aqueous-homepage", firstName: "Ana" }) }),
    );
    expect(toast.success).toHaveBeenCalledWith("Welcome! Check your inbox soon.");
    expect(await screen.findByRole("heading", { name: "You're In" })).toBeInTheDocument();
    expect(screen.getByText("Share the Flow")).toBeInTheDocument();
  });

  it("leaves out an empty first name", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    renderHome();
    await subscribe("me@example.com");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/subscribe",
      expect.objectContaining({ body: JSON.stringify({ email: "me@example.com", source: "aqueous-homepage" }) }),
    );
  });

  it("shows the app's error toast when the list refuses or the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ success: false, message: "nope" }), { status: 400 })));
    renderHome();
    await subscribe("me@example.com");
    expect(toast.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
    expect(screen.queryByRole("heading", { name: "You're In" })).toBeNull();

    vi.mocked(toast.error).mockClear();
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not json")));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Get My Free AWI Preview" }));
    });
    expect(toast.error).toHaveBeenCalledTimes(1);

    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Get My Free AWI Preview" }));
    });
    expect(toast.error).toHaveBeenCalledTimes(2);
  });

  it("checks the email before sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderHome();
    await subscribe("nope");
    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a valid email.");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
