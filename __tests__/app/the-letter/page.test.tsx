import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderServer } from "@tests/helpers/render";
import TheLetterPage, { metadata } from "@/app/the-letter/page";
import { sanityFetch } from "@/lib/sanity/client";
import { postCountQuery } from "@/lib/sanity/queries";
import { postHref } from "@/lib/content/post-redirects";

describe("/the-letter", () => {
  beforeEach(() => {
    vi.mocked(sanityFetch).mockResolvedValue(212);
  });

  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Letter");
    expect(metadata.description).toMatch(/25 years exposing broken systems and building what replaces them/);
    expect(metadata.alternates?.canonical).toBe("/the-letter");
  });

  it("renders one H1 and the hero proof point", async () => {
    await renderServer(TheLetterPage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("I expose broken systems.Then I build what comes next.");
    expect(screen.getByText(/\$10B\+ in enterprise contracts priced, audited, and renegotiated/)).toBeInTheDocument();
  });

  it("uses the real essay count from Sanity", async () => {
    await renderServer(TheLetterPage());
    expect(sanityFetch).toHaveBeenCalledWith({ query: postCountQuery, tags: ["post"] });
    expect(screen.getAllByText("212 Essays", { exact: false }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /All 212 essays/ })).toHaveAttribute("href", "/articles");
  });

  it("links the start-here essays and the Most Read list to their posts", async () => {
    await renderServer(TheLetterPage());
    expect(screen.getByRole("link", { name: /When Healing Becomes Extraction.*clearest statement/ })).toHaveAttribute(
      "href",
      postHref("when-healing-becomes-extraction"),
    );
    expect(screen.getByRole("heading", { level: 2, name: "Most Read" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Customer Service: The Key to Business Success/ })).toHaveAttribute(
      "href",
      postHref("customer-service-key-to-business-success"),
    );
  });

  it("links the main doors", async () => {
    await renderServer(TheLetterPage());
    expect(screen.getByRole("link", { name: "Find Your Fit" })).toHaveAttribute("href", "/find-my");
    expect(screen.getByRole("link", { name: /^Work with Tony/ })).toHaveAttribute("href", "/engage");
    expect(screen.getByRole("link", { name: /^Explore What Tony Builds/ })).toHaveAttribute("href", "/ecosystem");
    expect(screen.getByRole("link", { name: /Enter BrewSoul/ })).toHaveAttribute("href", "/brewsoul");
    expect(screen.getByRole("link", { name: "tony@impactsoul.is" })).toHaveAttribute("href", "mailto:tony@impactsoul.is");
  });

  it("signs a reader up for The Dispatch from the homepage form", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    await renderServer(TheLetterPage());
    await user.type(screen.getByPlaceholderText("your@email.com"), "reader@example.com");
    await user.click(screen.getByRole("button", { name: /I'm in/ }));

    expect(await screen.findByRole("status")).toHaveTextContent("You're in. New essays will arrive in your inbox.");
    expect(fetchMock).toHaveBeenCalledWith("/api/subscribe", expect.objectContaining({ method: "POST" }));
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ email: "reader@example.com", source: "homepage" });
    expect(localStorage.getItem("tg_subscribed")).toBe("true");
  });
});
