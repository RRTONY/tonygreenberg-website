import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderServer } from "@tests/helpers/render";
import { cookieJar } from "@tests/helpers/next";
import { unlockReport } from "@/app/alex-azzi/unlock-action";
import { FAQ, SUBJECT, TOC } from "@/lib/content/alex-azzi";
import AlexAzziPage, { metadata } from "@/app/alex-azzi/page";

// A big page: give each render room on a busy machine.
vi.setConfig({ testTimeout: 45_000 });

// The lock form's server action is replaced; unlock-action.test.ts covers it.
vi.mock("@/app/alex-azzi/unlock-action", () => ({ unlockReport: vi.fn() }));

const PASSWORD = "test-password";
const unlock = () =>
  cookieJar.set("tg_unlocked_alex-azzi", createHash("sha256").update(`alex-azzi:${PASSWORD}`).digest("hex"));

describe("/alex-azzi", () => {
  beforeEach(() => {
    vi.stubEnv("GATED_POST_PASSWORD", PASSWORD);
    vi.mocked(unlockReport).mockResolvedValue({ error: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps the locked report out of search and share previews", () => {
    expect(metadata.title).toBe("Restricted Access");
    expect(metadata.description).toBe("This report is password-protected.");
    expect(metadata.alternates?.canonical).toBe("/alex-azzi");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.openGraph).toBeUndefined();
  });

  it("shows only the password lock until unlocked, with none of the report in the HTML", async () => {
    const { container } = await renderServer(AlexAzziPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Restricted Access");
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(container).not.toHaveTextContent(SUBJECT.totalDocumented);
    expect(container).not.toHaveTextContent("XRWorkout");
  });

  it("stays locked with a cookie made from a different password", async () => {
    cookieJar.set("tg_unlocked_alex-azzi", createHash("sha256").update("alex-azzi:old-password").digest("hex"));
    await renderServer(AlexAzziPage());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Restricted Access");
  });

  it("sends the typed password to the unlock action and shows its error", async () => {
    const user = userEvent.setup();
    await renderServer(AlexAzziPage());
    await user.type(screen.getByPlaceholderText("Enter password"), "guess");
    await user.click(screen.getByRole("button", { name: /Unlock Report/ }));
    await waitFor(() => expect(unlockReport).toHaveBeenCalled());
    const form = vi.mocked(unlockReport).mock.calls[0][1] as FormData;
    expect(form.get("password")).toBe("guess");
    expect(form.get("key")).toBe("alex-azzi");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("shows the full report once unlocked, with one H1 and every section", async () => {
    unlock();
    const { container } = await renderServer(AlexAzziPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(`Alex Azzi Owes ${SUBJECT.totalDocumented}. He Hasn't Paid.`);
    expect(container).toHaveTextContent("Built on the SunlightProtocol: verify, don't gossip;");
    for (const item of TOC) {
      expect(container.querySelector(`#${item.id}`)).not.toBeNull();
      expect(screen.getAllByRole("link", { name: item.label })[0]).toHaveAttribute("href", `#${item.id}`);
    }
  });

  it("includes the FAQ in the page and in FAQPage structured data", async () => {
    unlock();
    const { container } = await renderServer(AlexAzziPage());
    expect(container).toHaveTextContent(FAQ[0].q);
    expect(container).toHaveTextContent(FAQ[0].a);
    const ld = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!) as { "@type": string; mainEntity?: unknown[] }[];
    const faq = ld.find((d) => d["@type"] === "FAQPage");
    expect(faq?.mainEntity).toHaveLength(FAQ.length);
  });
});
