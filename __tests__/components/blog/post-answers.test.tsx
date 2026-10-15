import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { POST_FAQ_ID, PostFaq, ShortAnswer } from "@/components/blog/post-answers";

describe("ShortAnswer", () => {
  it("renders the text, or nothing when blank", () => {
    const { rerender, container } = render(<ShortAnswer text="Five cups is fine." />);
    expect(screen.getByRole("complementary", { name: "Short answer" })).toHaveTextContent("Five cups is fine.");
    rerender(<ShortAnswer text="   " />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("PostFaq", () => {
  it("lists complete questions under an anchored heading and drops empty ones", () => {
    render(
      <PostFaq
        items={[
          { question: "Is it safe?", answer: "Mostly." },
          { question: "  ", answer: "orphan" },
          { question: "No answer", answer: "" },
        ]}
      />,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Questions and Answers" });
    expect(heading).toHaveAttribute("id", POST_FAQ_ID);
    expect(screen.getAllByRole("term").map((t) => t.textContent)).toEqual(["Is it safe?"]);
    expect(screen.getByRole("definition")).toHaveTextContent("Mostly.");
  });

  it("renders nothing without items", () => {
    const { container } = render(<PostFaq items={[{ question: "", answer: "" }]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
