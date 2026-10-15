import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { TrackLastBlogVisit } from "@/components/blog/track-last-blog-visit";

describe("TrackLastBlogVisit", () => {
  it("renders nothing and remembers the essay in cookies", () => {
    const { container } = render(<TrackLastBlogVisit slug="five-cups" title="Five Cups; & more" />);
    expect(container).toBeEmptyDOMElement();
    expect(document.cookie).toContain("tg_last_blog_slug=five-cups");
    expect(document.cookie).toContain(`tg_last_blog_title=${encodeURIComponent("Five Cups; & more")}`);
  });
});
