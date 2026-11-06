import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrewSoulMain } from "@/components/brewsoul/brewsoul-main";
import { navigation } from "../../helpers/next";
import { PAGE_CATEGORY_MAP } from "@/lib/content/brewsoul-directory";

function badgeFor(pathname: string) {
  navigation.pathname = pathname;
  const { container, unmount } = render(<BrewSoulMain>child</BrewSoulMain>);
  const badge = container.querySelector('a[href="/brewsoul/directory"]');
  const result = { badge: badge?.textContent ?? null, text: container.textContent };
  unmount();
  return result;
}

describe("BrewSoulMain", () => {
  it("renders its children, without a second <main> inside the site's own", () => {
    expect(badgeFor("/brewsoul/glossary").text).toContain("child");
    navigation.pathname = "/brewsoul/glossary";
    render(<BrewSoulMain>child</BrewSoulMain>);
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("shows the page's category badge on framed pages", () => {
    expect(badgeFor("/brewsoul/glossary").badge).toBe(PAGE_CATEGORY_MAP["/brewsoul/glossary"].category);
  });

  it.each(["/brewsoul", "/brewsoul/", "/brewsoul/home", "/brewsoul/cities", "/brewsoul/cities/portland", "/brewsoul/directory", "/brewsoul/quiz"])(
    "never shows the badge on unframed %s",
    (path) => {
      expect(badgeFor(path).badge).toBeNull();
    },
  );
});
