import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderServer } from "@tests/helpers/render";
import TheMirrorPage, { metadata } from "@/app/the-mirror/page";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { MIRROR_ARTICLE_SLUGS, MIRROR_ARTICLES, MIRROR_DIMENSIONS, MIRROR_QUESTIONS } from "@/lib/content/mirror-data";
import { postHref } from "@/lib/content/post-redirects";
import { theMirrorData } from "@/components/assessments/the-mirror-quiz/data/the-mirror.data";

// Expected result when every question gets its first option, worked out the
// same way the quiz does: per-dimension rounded mean, then the rounded mean of those.
const dimScores = MIRROR_DIMENSIONS.map((d) => {
  const vals = MIRROR_QUESTIONS.filter((q) => q.dimension === d.id).map((q) => q.options[0].score);
  return { id: d.id, score: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) };
});
const OVERALL = Math.round(dimScores.reduce((a, d) => a + d.score, 0) / dimScores.length);
const WEAKEST: string[] = [...dimScores].sort((a, b) => a.score - b.score).slice(0, 3).map((d) => d.id);
const RECOMMENDED_SLUG = Object.entries(MIRROR_ARTICLES).find(([, a]) => WEAKEST.includes(a.dimension))![0];
const UNRESOLVED_SLUG = Object.entries(MIRROR_ARTICLES).filter(([, a]) => WEAKEST.includes(a.dimension))[1]?.[0];

describe("/the-mirror", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue([{ slug: RECOMMENDED_SLUG, title: "A Real Mirror Essay" }]);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Mirror");
    expect(metadata.description).toMatch(/^A six-dimension life assessment\. Eighteen questions/);
    expect(metadata.alternates?.canonical).toBe("/the-mirror");
  });

  it("looks up the recommended essays' titles in Sanity", async () => {
    await renderServer(TheMirrorPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: postsBySlugsQuery, params: { slugs: MIRROR_ARTICLE_SLUGS }, tags: ["post"] });
  });

  it("renders one H1 and the six dimensions it measures", async () => {
    await renderServer(TheMirrorPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How Far Are YouFrom Yourself?");
    expect(screen.getByText(/This isn't a personality quiz\. It's a measurement\./)).toBeInTheDocument();
    for (const d of MIRROR_DIMENSIONS) expect(screen.getByText(d.name)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Flow Circuit" })).toHaveAttribute("href", "https://flow.tonygreenberg.com");
    expect(screen.getByRole("link", { name: "Human OS" })).toHaveAttribute("href", "/humanos");
  });

  it("answers all 18 questions, unlocks with an email and shows the score and resolved essays", { timeout: 40000 }, async () => {
    const fetchMock = vi.fn(async () => new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    await renderServer(TheMirrorPage());
    await user.click(screen.getAllByRole("button", { name: /Begin The Mirror/ })[0]);

    for (let i = 0; i < MIRROR_QUESTIONS.length; i++) {
      const q = MIRROR_QUESTIONS[i];
      await screen.findByRole("heading", { level: 2, name: q.stem });
      expect(screen.getByText(new RegExp(`${i + 1} / ${MIRROR_QUESTIONS.length}$`))).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: q.options[0].text }));
    }

    const email = await screen.findByPlaceholderText("Your email address", {}, { timeout: 2000 });
    await user.type(email, "reader@example.com");
    await user.click(screen.getByRole("button", { name: "Get My Results" }));

    await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your Distance From Flow"));
    expect(screen.getByText("/ 9").previousElementSibling).toHaveTextContent(String(OVERALL));
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ email: "reader@example.com", source: "find-your-mirror" });

    expect(screen.getByRole("link", { name: /A Real Mirror Essay/ })).toHaveAttribute("href", postHref(RECOMMENDED_SLUG));
    if (UNRESOLVED_SLUG) {
      const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
      expect(hrefs).not.toContain(postHref(UNRESOLVED_SLUG));
    }
  });

  it("goes back a question and can exit to the intro", async () => {
    const user = userEvent.setup();
    await renderServer(TheMirrorPage());
    await user.click(screen.getAllByRole("button", { name: /Begin The Mirror/ })[0]);
    await user.click(screen.getByRole("button", { name: MIRROR_QUESTIONS[0].options[1].text }));
    await screen.findByRole("heading", { level: 2, name: MIRROR_QUESTIONS[1].stem });
    await user.click(screen.getByRole("button", { name: theMirrorData.questions.previous }));
    expect(screen.getByRole("heading", { level: 2, name: MIRROR_QUESTIONS[0].stem })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: theMirrorData.questions.exit }));
    expect(screen.getAllByRole("button", { name: /Begin The Mirror/ }).length).toBeGreaterThan(0);
  });
});
