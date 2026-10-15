import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KavaBadge, KavaCard, KavaDisclaimer, KavaDivider, KavaHero, KavaSection, KavaSectionTitle } from "@/components/kava/kava-ui";

describe("Kava UI pieces", () => {
  it("KavaHero is the page's one H1, with optional eyebrow and subtitle", () => {
    const { rerender } = render(<KavaHero eyebrow="Module 1" title="Kava" subtitle="The root" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Kava");
    expect(screen.getByText("Module 1")).toBeInTheDocument();
    expect(screen.getByText("The root")).toBeInTheDocument();
    rerender(<KavaHero title="Only title" />);
    expect(screen.queryByText("Module 1")).not.toBeInTheDocument();
    expect(screen.queryByText("The root")).not.toBeInTheDocument();
  });

  it("KavaSection picks its background", () => {
    const { container, rerender } = render(<KavaSection bg="sand">x</KavaSection>);
    expect(container.firstElementChild!.className).toContain("bg-kava-sand");
    rerender(<KavaSection bg="white">x</KavaSection>);
    expect(container.firstElementChild!.className).toContain("bg-white");
  });

  it("KavaSectionTitle is an H2 and KavaCard passes clicks through", async () => {
    const onClick = vi.fn();
    render(
      <>
        <KavaSectionTitle>Section</KavaSectionTitle>
        <KavaCard onClick={onClick}>Card body</KavaCard>
      </>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Section");
    await userEvent.click(screen.getByText("Card body"));
    expect(onClick).toHaveBeenCalled();
  });

  it("KavaBadge uses the colour asked for, saffron by default", () => {
    render(
      <>
        <KavaBadge>Default</KavaBadge>
        <KavaBadge color="red">Red</KavaBadge>
      </>,
    );
    expect(screen.getByText("Default").className).toContain("text-[#7A461A]");
    expect(screen.getByText("Red").className).toContain("text-[#b91c1c]");
  });

  it("KavaDisclaimer says to consult a professional; KavaDivider has no text", () => {
    const { container } = render(<KavaDivider />);
    expect(container.textContent).toBe("");
    render(<KavaDisclaimer />);
    expect(screen.getByText(/Consult a licensed medical professional/)).toBeInTheDocument();
  });
});
