import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AqueousProviders } from "@/components/aqueous/aqueous-providers";
import { ReportViewer, renderReportMarkdown } from "@/components/aqueous/pages/report-viewer";
import { getReport, type AqueousReport } from "@/app/aqueous/actions";

vi.mock("@/lib/fonts/aqueous-fonts", () => ({ aqueousFontVariables: "" }));
vi.mock("@/app/aqueous/actions", () => ({
  getAqueousMember: vi.fn(async () => ({ signedIn: true, email: "a@b.co", name: "A", isAdmin: false, subscriptionStatus: null })),
  getMyReferral: vi.fn(async () => null),
  trackShare: vi.fn(async () => ({ ok: true })),
  claimReferral: vi.fn(),
  getReport: vi.fn(),
}));

const report = (over: Partial<AqueousReport> = {}): AqueousReport => ({
  id: 5,
  title: "Personalized AWI Report",
  status: "complete",
  reportContent: "# Your Personalized AWI Report\n\n## Top 5 Waters For You\n\n- **Mountain Valley**",
  createdAt: "2026-11-20T12:00:00Z",
  ...over,
});

/** A text stream the test pushes chunks into. */
function controlledStream() {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({ start: (c) => void (controller = c) });
  const enc = new TextEncoder();
  return {
    stream,
    push: (t: string) => controller.enqueue(enc.encode(t)),
    close: () => controller.close(),
    error: () => controller.error(new Error("dropped")),
  };
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const renderViewer = (id = 5) =>
  render(
    <AqueousProviders>
      <ReportViewer reportId={id} />
    </AqueousProviders>,
  );

describe("renderReportMarkdown", () => {
  it("renders markdown but escapes any HTML in the model's text", () => {
    const html = renderReportMarkdown('## Hi\n\n<script>alert(1)</script> <img src=x onerror="y"> **bold** & more');
    expect(html).toContain("<h2>Hi</h2>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).not.toMatch(/<script|<img/);
    expect(html).toContain("&lt;script");
  });

  it("keeps safe links, drops unsafe ones and images", () => {
    const html = renderReportMarkdown(
      '[ewg](https://ewg.org "EWG") [home](/aqueous) [bad](javascript:alert(1)) ![pic](https://x/y.png)',
    );
    expect(html).toContain('<a href="https://ewg.org" title="EWG" target="_blank" rel="noopener noreferrer">ewg</a>');
    expect(html).toContain('<a href="/aqueous">home</a>');
    expect(html).not.toContain("javascript:");
    expect(html).toContain("bad");
    expect(html).not.toContain("<img");
    expect(html).toContain("pic");
  });
});

describe("ReportViewer", () => {
  it("shows a finished report and downloads it as markdown", async () => {
    vi.mocked(getReport).mockResolvedValue({ ok: true, data: report() });
    const createObjectURL = vi.fn(() => "blob:x");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL, revokeObjectURL }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const user = userEvent.setup();
    renderViewer();
    expect(screen.getByText("Loading your report...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 2, name: "Top 5 Waters For You" })).toBeInTheDocument();
    expect(screen.getByText("Mountain Valley").tagName).toBe("STRONG");
    expect(screen.getByText(/Generated on November 20, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Dashboard/ })).toHaveAttribute("href", "/aqueous/dashboard");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getReport).toHaveBeenCalledWith(5);

    await user.click(screen.getByRole("button", { name: /Download/ }));
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:x");
    click.mockRestore();
  });

  it("says when the report isn't there, and when the visitor isn't signed in", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({ ok: false, error: "Report not found" });
    const { unmount } = renderViewer(9);
    expect(await screen.findByRole("heading", { name: "Report Not Found" })).toBeInTheDocument();
    unmount();

    vi.mocked(getReport).mockResolvedValueOnce({ ok: false, error: "Please sign in first.", signedOut: true });
    renderViewer(10);
    expect(await screen.findByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/login?next=%2Faqueous%2Freport%2F10",
    );
  });

  it("treats a bad id as not found without calling the server", () => {
    renderViewer(0);
    expect(screen.getByRole("heading", { name: "Report Not Found" })).toBeInTheDocument();
    expect(getReport).not.toHaveBeenCalled();
  });

  it("writes a pending report, showing the text as it streams in, then reloads it", async () => {
    const s = controlledStream();
    fetchMock.mockResolvedValue(new Response(s.stream, { status: 200 }));
    vi.mocked(getReport)
      .mockResolvedValueOnce({ ok: true, data: report({ status: "pending", reportContent: null }) })
      .mockResolvedValueOnce({ ok: true, data: report({ reportContent: "# Saved\n\nFinal text" }) });
    renderViewer();
    expect(await screen.findByText("Generating Your Report")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/aqueous/reports/5/generate", { method: "POST" });
    expect(screen.queryByRole("button", { name: /Download/ })).toBeNull();

    await act(async () => s.push("# Your Personalized AWI Report\n\nFirst <b>part"));
    expect(await screen.findByRole("heading", { level: 1, name: "Your Personalized AWI Report" })).toBeInTheDocument();
    expect(screen.getByText(/First <b>part/)).toBeInTheDocument();
    expect(screen.queryByText("Generating Your Report")).toBeNull();

    await act(async () => s.close());
    expect(await screen.findByText("Final text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download/ })).toBeInTheDocument();
  });

  it("keeps the streamed text when the reload fails after a dropped connection", async () => {
    const s = controlledStream();
    fetchMock.mockResolvedValue(new Response(s.stream, { status: 200 }));
    vi.mocked(getReport)
      .mockResolvedValueOnce({ ok: true, data: report({ status: "failed", reportContent: "old" }) })
      .mockRejectedValueOnce(new Error("down"));
    renderViewer();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(async () => s.push("Partial words"));
    await act(async () => s.error());
    expect(await screen.findByText("Partial words")).toBeInTheDocument();
  });

  it("shows the server's message when writing fails", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Reports are unavailable right now." }), { status: 503 }),
    );
    vi.mocked(getReport).mockResolvedValue({ ok: true, data: report({ status: "pending", reportContent: null }) });
    renderViewer();
    expect(await screen.findByText("Report Generation Failed")).toBeInTheDocument();
    expect(screen.getByText("Reports are unavailable right now.")).toBeInTheDocument();
  });

  it("shows a fallback message when the request fails or returns no JSON", async () => {
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    vi.mocked(getReport).mockResolvedValue({ ok: true, data: report({ status: "pending", reportContent: null }) });
    const { unmount } = renderViewer();
    expect(await screen.findByText("The report couldn't be written just now. Please try again.")).toBeInTheDocument();
    unmount();

    fetchMock.mockResolvedValueOnce(new Response("oops", { status: 502 }));
    renderViewer(6);
    expect(await screen.findByText("The report couldn't be written just now. Please try again.")).toBeInTheDocument();
  });

  it("polls every 3s while another tab writes it (409)", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "Your report is already being written." }), { status: 409 }));
    vi.mocked(getReport)
      .mockResolvedValueOnce({ ok: true, data: report({ status: "generating", reportContent: null }) })
      .mockResolvedValueOnce({ ok: true, data: report({ status: "generating", reportContent: null }) })
      .mockResolvedValueOnce({ ok: true, data: report({ reportContent: "Done now" }) });
    renderViewer();
    expect(await screen.findByText("Generating Your Report")).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(3000));
    expect(getReport).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Generating Your Report")).toBeInTheDocument();
    await act(async () => vi.advanceTimersByTime(3000));
    expect(await screen.findByText("Done now")).toBeInTheDocument();
    expect(screen.queryByText("Generating Your Report")).toBeNull();
  });

  it("shows the failed banner when the polled report failed", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchMock.mockResolvedValue(new Response("{}", { status: 409 }));
    vi.mocked(getReport)
      .mockResolvedValueOnce({ ok: true, data: report({ status: "generating", reportContent: null }) })
      .mockResolvedValueOnce({ ok: true, data: report({ status: "failed", reportContent: "err" }) });
    renderViewer();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(async () => vi.advanceTimersByTime(3000));
    expect(await screen.findByText("Report Generation Failed")).toBeInTheDocument();
    expect(screen.getByText("Please try generating a new report from your dashboard.")).toBeInTheDocument();
  });

  it("tries writing again once the other writer has gone quiet for 2 minutes", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchMock.mockResolvedValue(new Response("{}", { status: 409 }));
    vi.mocked(getReport).mockResolvedValue({ ok: true, data: report({ status: "generating", reportContent: null }) });
    const { unmount } = renderViewer();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    for (let i = 0; i < 40; i++) await act(async () => vi.advanceTimersByTime(3000));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    unmount();
  });
});
