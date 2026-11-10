import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { navigation } from "@tests/helpers/next";
import { VersionSwitcher } from "@/components/gemspark/version-switcher";

describe("VersionSwitcher", () => {
  it("links the three versions and marks the current one", () => {
    navigation.pathname = "/gem-spark/short";
    render(<VersionSwitcher />);
    expect(screen.getByRole("link", { name: "Long" })).toHaveAttribute("href", "/gem-spark");
    expect(screen.getByRole("link", { name: "ES" })).toHaveAttribute("href", "/gem-spark/es/short");
    const short = screen.getByRole("link", { name: "Short" });
    expect(short).toHaveAttribute("href", "/gem-spark/short");
    expect(short).toHaveAttribute("aria-current", "page");
    expect(short).toHaveClass("bg-[#2C3E50]");
    expect(screen.getByRole("link", { name: "Long" })).not.toHaveAttribute("aria-current");
  });
});
