import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { Directory } from "@/components/aqueous/pages/directory";
import {
  createProject,
  deleteProject,
  getAqueousMember,
  getMyReferral,
  getReferralLeaderboard,
  listProjects,
  type AqueousProject,
} from "@/app/aqueous/actions";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
  getReferralLeaderboard: vi.fn(async () => []),
  listProjects: vi.fn(async () => []),
  createProject: vi.fn(),
  deleteProject: vi.fn(),
}));

const OWNER = { signedIn: true, email: "tony@x.co", name: "Tony", isAdmin: true, subscriptionStatus: null };
const STATS = { code: "AQ-ABC123", shares: 2, signups: 3, credits: "15.00", freeReportUnlocked: false };
const PROJECTS: AqueousProject[] = [
  { id: 1, name: "LiquidSun", description: "Tequila", url: "/liquid-sun", tag: "Sister site", sortOrder: 1 },
  { id: 2, name: "Elsewhere", description: "Outside", url: "https://example.com/", tag: null, sortOrder: 2 },
];

const renderPage = () =>
  render(
    <AqueousProviders>
      <Directory />
    </AqueousProviders>,
  );

describe("Directory", () => {
  beforeEach(() => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("links every Aqueous page through /aqueous", async () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Every Page. One Place.");
    expect(screen.getByRole("link", { name: /AWI Index/ })).toHaveAttribute("href", "/aqueous/awi");
    expect(screen.getByRole("link", { name: /^Home/ })).toHaveAttribute("href", "/aqueous");
    expect(screen.getByRole("link", { name: /Pricing & Impact/ })).toHaveAttribute("href", "/aqueous/pricing");
    expect(screen.getByText("tonygreenberg.com/aqueous/wall-of-shame")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/aqueous");
    expect(screen.getByTestId("leaderboard-loading")).toBeInTheDocument();
    expect(await screen.findByText("No referrals yet. Be the first!")).toBeInTheDocument();
    expect(screen.getByText("Projects coming soon")).toBeInTheDocument();
  });

  it("shows the member's stats, copies the directory link and lists the leaders", async () => {
    vi.mocked(getMyReferral).mockResolvedValue(STATS);
    vi.mocked(getReferralLeaderboard).mockResolvedValue([
      { code: "AQ-AAAAAA", signups: 9, displayName: "j****@x.co" },
      { code: "AQ-BBBBBB", signups: 5, displayName: "k****@x.co" },
      { code: "AQ-CCCCCC", signups: 3, displayName: "Anonymous" },
      { code: "AQ-DDDDDD", signups: 1, displayName: "m****@x.co" },
    ]);
    const user = userEvent.setup();
    renderPage();
    expect(await screen.findByText("j****@x.co")).toBeInTheDocument();
    expect(getReferralLeaderboard).toHaveBeenCalledWith(5);
    expect(screen.getByLabelText("1st")).toBeInTheDocument();
    expect(screen.getByLabelText("2nd")).toBeInTheDocument();
    expect(screen.getByLabelText("3rd")).toBeInTheDocument();
    expect(screen.getByText("#4")).toBeInTheDocument();
    expect(await screen.findByText("3/10")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Copy Directory Link" }));
    expect(await navigator.clipboard.readText()).toBe("http://localhost:3000/aqueous/directory?ref=AQ-ABC123");
    expect(toast.success).toHaveBeenCalledWith("Directory link copied with your referral code!");
    // Both copy buttons (hero and bottom) show the shared "Copied!" state, as in the app.
    expect(screen.getAllByRole("button", { name: "Copied!" })).toHaveLength(2);
  });

  it("falls back to an empty leaderboard when it can't load", async () => {
    vi.mocked(getReferralLeaderboard).mockRejectedValue(new Error("down"));
    vi.mocked(listProjects).mockRejectedValue(new Error("down"));
    renderPage();
    expect(await screen.findByText("No referrals yet. Be the first!")).toBeInTheDocument();
  });

  it("lists projects: on-site paths with next/link, others in a new tab; no owner controls for visitors", async () => {
    vi.mocked(listProjects).mockResolvedValue(PROJECTS);
    renderPage();
    const onSite = await screen.findByRole("link", { name: /LiquidSun/ });
    expect(onSite).toHaveAttribute("href", "/liquid-sun");
    expect(onSite).not.toHaveAttribute("target");
    const outside = screen.getByRole("link", { name: /Elsewhere/ });
    expect(outside).toHaveAttribute("href", "https://example.com/");
    expect(outside).toHaveAttribute("target", "_blank");
    expect(within(outside).getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("Sister site")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Add New Project/ })).toBeNull();
    expect(screen.queryByText("Projects coming soon")).toBeNull();
  });

  it("lets the owner remove a project after confirming", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(OWNER);
    vi.mocked(listProjects).mockResolvedValue(PROJECTS);
    vi.mocked(deleteProject).mockResolvedValueOnce({ ok: true, data: null });
    vi.mocked(deleteProject).mockResolvedValueOnce({ ok: false, error: "Only the site owner can do that." });
    const user = userEvent.setup();
    renderPage();
    const remove = await screen.findByRole("button", { name: "Remove LiquidSun" });

    vi.mocked(window.confirm).mockReturnValueOnce(false);
    await user.click(remove);
    expect(deleteProject).not.toHaveBeenCalled();

    await user.click(remove);
    expect(window.confirm).toHaveBeenCalledWith('Remove "LiquidSun" from My Projects?');
    expect(deleteProject).toHaveBeenCalledWith(1);
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Project removed"));
    await waitFor(() => expect(listProjects).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole("button", { name: "Remove Elsewhere" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Only the site owner can do that."));
  });

  it("lets the owner add a project with the checked form", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(OWNER);
    vi.mocked(createProject).mockResolvedValueOnce({ ok: false, error: "Please enter a project name." });
    vi.mocked(createProject).mockResolvedValueOnce({ ok: true, data: { id: 3 } });
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole("button", { name: /Add New Project/ }));
    const add = screen.getByRole("button", { name: "Add" });
    expect(add).toBeDisabled();

    await user.type(screen.getByLabelText("Project name"), "New Site");
    await user.type(screen.getByLabelText("Project URL"), "ftp://nope");
    await user.click(add);
    expect(await screen.findByText("Please enter a full address (https://...) or a path starting with /.")).toBeInTheDocument();
    expect(createProject).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Project URL"));
    await user.type(screen.getByLabelText("Project URL"), "https://new.example");
    await user.type(screen.getByLabelText("Short description"), "Fresh");
    await user.type(screen.getByLabelText("Tag"), "Personal");
    await user.click(add);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Please enter a project name."));
    expect(createProject).toHaveBeenCalledWith({ name: "New Site", url: "https://new.example", description: "Fresh", tag: "Personal" });

    await user.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Project added!"));
    expect(await screen.findByRole("button", { name: /Add New Project/ })).toBeInTheDocument();
    expect(listProjects).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("button", { name: /Add New Project/ }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: /Add New Project/ })).toBeInTheDocument();
  });

  it("shows a fallback error when adding fails outright", async () => {
    vi.mocked(getAqueousMember).mockResolvedValue(OWNER);
    vi.mocked(createProject).mockRejectedValue(new Error("down"));
    vi.mocked(listProjects).mockResolvedValue(PROJECTS);
    vi.mocked(deleteProject).mockRejectedValue(new Error("down"));
    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByRole("button", { name: /Add New Project/ }));
    await user.type(screen.getByLabelText("Project name"), "X");
    await user.type(screen.getByLabelText("Project URL"), "/x");
    await user.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Couldn't add the project. Please try again."));
    await user.click(screen.getByRole("button", { name: "Remove LiquidSun" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Couldn't remove the project. Please try again."));
  });
});
