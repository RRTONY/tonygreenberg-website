import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/brewsoul/layout";
import { BADGE_LINK_SUFFIX } from "@/components/brewsoul/category-badge";
import { navigation } from "../../helpers/next";

const badge = () => screen.queryByRole("link", { name: new RegExp(`: ${BADGE_LINK_SUFFIX}$`) });

function renderLayout() {
  return render(
    <Layout params={Promise.resolve({})}>
      <p>page body</p>
    </Layout>,
  );
}

describe("/brewsoul layout", () => {
  it("wraps every BrewSoul page in its own nav and footer, inside the site's single <main>", () => {
    navigation.pathname = "/brewsoul/glossary";
    renderLayout();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("page body")).toBeInTheDocument();
    expect(screen.queryByRole("main")).toBeNull();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("BrewSoul — The Coffee Intelligence Engine");
  });

  it("shows the category badge on a framed page but not on the landing page", () => {
    navigation.pathname = "/brewsoul/glossary";
    const { unmount } = renderLayout();
    expect(badge()).not.toBeNull();
    unmount();
    navigation.pathname = "/brewsoul";
    renderLayout();
    expect(badge()).toBeNull();
  });
});
