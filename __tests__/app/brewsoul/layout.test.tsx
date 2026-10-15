import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/brewsoul/layout";
import { navigation } from "../../helpers/next";

function renderLayout() {
  return render(
    <Layout params={Promise.resolve({})}>
      <p>page body</p>
    </Layout>,
  );
}

describe("/brewsoul layout", () => {
  it("wraps every BrewSoul page in its own nav, main and footer", () => {
    navigation.pathname = "/brewsoul/glossary";
    renderLayout();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page body");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("BrewSoul — The Coffee Intelligence Engine");
  });

  it("shows the category badge on a framed page but not on the landing page", () => {
    navigation.pathname = "/brewsoul/glossary";
    const { unmount } = renderLayout();
    expect(screen.getByRole("main").querySelector('a[href="/brewsoul/directory"]')).not.toBeNull();
    unmount();
    navigation.pathname = "/brewsoul";
    renderLayout();
    expect(screen.getByRole("main").querySelector('a[href="/brewsoul/directory"]')).toBeNull();
  });
});
