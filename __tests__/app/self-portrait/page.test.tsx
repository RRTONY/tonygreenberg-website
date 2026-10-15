import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import SelfPortraitPage, { metadata } from "@/app/self-portrait/page";
import { cookieJar } from "@tests/helpers/next";
import { SELF_PORTRAIT_CATALOG } from "@/lib/content/self-portrait-catalog";

const done = (slugs: string[]) =>
  cookieJar.set("tg_assessment_results", JSON.stringify(slugs.map((slug, i) => ({ slug, completedAt: `2026-10-0${i + 1}T12:00:00Z` }))));

describe("/self-portrait", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("Your Self-Portrait");
    expect(metadata.alternates?.canonical).toBe("/self-portrait");
  });

  it("with nothing done: 0%, five brushstrokes needed, a way to start", async () => {
    await renderServer(SelfPortraitPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("img", { name: "0% complete" })).toBeInTheDocument();
    expect(screen.getByText(`0 of ${SELF_PORTRAIT_CATALOG.length} experiences completed`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "5 More Brushstrokes Needed" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue your journey/i })).toHaveAttribute("href", "/find-your-me");
  });

  it("lists completed assessments newest first with retake links, ignoring unknown slugs", async () => {
    const [a, b] = SELF_PORTRAIT_CATALOG;
    done([a.slug, "not-a-real-quiz", b.slug]);
    await renderServer(SelfPortraitPage());
    expect(screen.getByText(`2 of ${SELF_PORTRAIT_CATALOG.length} experiences completed`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3 More Brushstrokes Needed" })).toBeInTheDocument();
    const retakes = screen.getAllByRole("link").filter((l) => /Retake/.test(l.textContent ?? ""));
    expect(retakes.map((l) => l.getAttribute("href"))).toEqual([`/${b.slug}`, `/${a.slug}`]);
    expect(screen.getByText(/Completed October 3, 2026/)).toBeInTheDocument();
  });

  it("drops the lock once five are done", async () => {
    done(SELF_PORTRAIT_CATALOG.slice(0, 5).map((c) => c.slug));
    await renderServer(SelfPortraitPage());
    expect(screen.queryByText(/Brushstroke/)).not.toBeInTheDocument();
    expect(screen.getByText(/Every assessment you've completed, in one place/)).toBeInTheDocument();
  });

  it("treats a garbled cookie as nothing done", async () => {
    cookieJar.set("tg_assessment_results", "{not json");
    await renderServer(SelfPortraitPage());
    expect(screen.getByRole("img", { name: "0% complete" })).toBeInTheDocument();
  });
});
