import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer } from "@tests/helpers/render";
import SubscribePage, { generateMetadata } from "@/app/subscribe/page";
import { sanityFetch } from "@/lib/sanity/client";

describe("/subscribe", () => {
  it("uses the real essay count in the description, with its own canonical", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(117 as never);
    const meta = await generateMetadata();
    expect(meta.title).toBe("Subscribe — The Throughline");
    expect(meta.description).toMatch(/^117 essays\. 15 years\. Zero algorithm\./);
    expect(meta.alternates?.canonical).toBe("/subscribe");
  });

  it("renders one H1 with the count, the free signup form and the paid tiers as not-yet-available", async () => {
    vi.mocked(sanityFetch).mockResolvedValue(117 as never);
    await renderServer(SubscribePage());
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("117 essays. 15 years.Zero algorithm.");
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Paid Membership" })).toBeInTheDocument();
    expect(screen.getAllByText(/Not available yet/)).toHaveLength(2);
    expect(screen.getByText("Quarterly Q&A with Tony")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the essays now/i })).toHaveAttribute("href", "/essays");
  });
});
