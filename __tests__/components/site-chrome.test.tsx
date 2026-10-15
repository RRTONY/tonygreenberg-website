import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteChrome } from "@/components/site-chrome";
import { navigation } from "@tests/helpers/next";

describe("SiteChrome", () => {
  it("shows the header/footer on normal pages", () => {
    navigation.pathname = "/blog";
    render(<SiteChrome><p>chrome</p></SiteChrome>);
    expect(screen.getByText("chrome")).toBeInTheDocument();
  });

  it.each(["/brewsoul", "/brewsoul/beans", "/attention-theft", "/kava/x", "/humanos", "/oauth/authorize"])(
    "hides it on %s",
    (path) => {
      navigation.pathname = path;
      render(<SiteChrome><p>chrome</p></SiteChrome>);
      expect(screen.queryByText("chrome")).not.toBeInTheDocument();
    },
  );
});
