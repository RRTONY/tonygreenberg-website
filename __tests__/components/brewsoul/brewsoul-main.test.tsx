import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrewSoulMain } from "@/components/brewsoul/brewsoul-main";
import { navigation } from "../../helpers/next";
import { PAGE_CATEGORY_MAP } from "@/lib/content/brewsoul-directory";

function badgeFor(pathname: string) {
  navigation.pathname = pathname;
  const { unmount } = render(<BrewSoulMain>child</BrewSoulMain>);
  const badge = screen.getByRole("main").querySelector('a[href="/brewsoul/directory"]');
  const result = { badge: badge?.textContent ?? null, text: screen.getByRole("main").textContent };
  unmount();
  return result;
}

describe("BrewSoulMain", () => {
  it("renders its children inside <main>", () => {
    expect(badgeFor("/brewsoul/glossary").text).toContain("child");
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
