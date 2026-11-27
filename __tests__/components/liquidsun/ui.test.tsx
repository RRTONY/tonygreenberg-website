import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedBadge, TierBadge } from "@/components/liquidsun/badges";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  inputClasses,
  textareaClasses,
} from "@/components/liquidsun/ui";
import { LiquidsunJsonLd } from "@/components/liquidsun/liquidsun-json-ld";

describe("LiquidSun UI primitives (the app's own shadcn classes)", () => {
  it("renders card parts with the app's border and padding", () => {
    render(
      <Card className="extra">
        <CardHeader>
          <CardTitle as="h2">Title</CardTitle>
          <CardTitle>Plain</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toHaveClass("leading-none", "font-semibold");
    expect(screen.getByText("Plain").tagName).toBe("DIV");
    expect(screen.getByText("Body")).toHaveClass("px-6");
    expect(screen.getByText("Body").parentElement).toHaveClass("border", "py-6", "extra");
  });

  it("renders buttons in each variant and as a child link", () => {
    render(
      <>
        <Button>Default</Button>
        <Button variant="outline" size="sm">
          Outline
        </Button>
        <Button variant="link" size="lg">
          Link
        </Button>
        <Button asChild>
          <a href="/x">As link</a>
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Default" })).toHaveClass("bg-primary", "h-9");
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border", "h-8");
    expect(screen.getByRole("button", { name: "Link" })).toHaveClass("underline-offset-4", "h-10");
    expect(screen.getByRole("link", { name: "As link" })).toHaveClass("bg-primary");
  });

  it("renders badge, separator, table and the input/textarea classes", () => {
    render(
      <>
        <Badge>New</Badge>
        <Separator className="sep" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bottle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Fortaleza</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    );
    expect(screen.getByText("New")).toHaveClass("rounded-md", "border");
    expect(screen.getByRole("none")).toHaveClass("h-px", "sep");
    expect(screen.getByRole("columnheader", { name: "Bottle" })).toHaveClass("h-10");
    expect(screen.getByRole("cell", { name: "Fortaleza" })).toHaveClass("p-2");
    expect(inputClasses).toContain("h-9");
    expect(textareaClasses).toContain("min-h-16");
  });
});

describe("badges", () => {
  it.each(["Unicorn", "Legend", "Gateway"] as const)("shows the %s tier in both sizes", (tier) => {
    const { unmount } = render(
      <>
        <TierBadge tier={tier} />
        <TierBadge tier={tier} size="md" />
      </>,
    );
    const [sm, md] = screen.getAllByText(tier);
    expect(sm).toHaveClass("text-[10px]");
    expect(md).toHaveClass("text-xs");
    unmount();
  });

  it("shows each partner tier and nothing without one", () => {
    const { container } = render(<FeaturedBadge />);
    expect(container).toBeEmptyDOMElement();
    render(
      <>
        <FeaturedBadge partnerTier="featured" />
        <FeaturedBadge partnerTier="spotlight" />
        <FeaturedBadge partnerTier="altar" />
      </>,
    );
    expect(screen.getByText("Featured")).toHaveClass("text-amber-400");
    expect(screen.getByText("Spotlight Partner")).toHaveClass("text-purple-400");
    expect(screen.getByText("Altar Selection").querySelector("svg")).toHaveClass("animate-pulse");
  });
});

describe("LiquidsunJsonLd", () => {
  it("writes the page's structured data with < escaped", () => {
    const { container } = render(<LiquidsunJsonLd path="/altar" title="The Altar | LiquidSun" description="</script><b>" />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script.textContent!)["@graph"][0]).toMatchObject({ name: "The Altar", description: "</script><b>" });
  });
});
