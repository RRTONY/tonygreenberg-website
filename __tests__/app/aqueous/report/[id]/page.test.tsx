import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { generateMetadata } from "@/app/aqueous/report/[id]/page";

vi.mock("@/components/aqueous/pages/report-viewer", () => ({
  ReportViewer: ({ reportId }: { reportId: number }) => <div data-testid="viewer">{reportId}</div>,
}));

const props = (id: string) => ({ params: Promise.resolve({ id }) });

describe("/aqueous/report/[id]", () => {
  it("passes the numeric id to the client viewer (no notFound: reports are private)", async () => {
    const { unmount } = render(await Page(props("42")));
    expect(screen.getByTestId("viewer")).toHaveTextContent("42");
    unmount();
    render(await Page(props("abc")));
    expect(screen.getByTestId("viewer")).toHaveTextContent("0");
  });

  it("is noindex with the app's report title", async () => {
    const meta = await generateMetadata(props("42"));
    expect(meta.title).toBe("Your Personalized AWI Report | Aqueous");
    expect(meta.alternates?.canonical).toBe("/aqueous/report/42");
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});
