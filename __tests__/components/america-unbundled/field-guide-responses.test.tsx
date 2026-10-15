import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FieldGuideResponses } from "@/components/america-unbundled/field-guide-responses";

const KEY = "america-unbundled-responses-v1";

describe("FieldGuideResponses", () => {
  it("shows the ten numbered questions with labelled answer boxes", () => {
    render(<FieldGuideResponses />);
    expect(screen.getAllByRole("textbox")).toHaveLength(10);
    expect(screen.getByText(/01 · When the side you usually agree with is wrong/)).toBeInTheDocument();
    expect(screen.getByLabelText("Answer question ten")).toBeInTheDocument();
  });

  it("saves answers on this device only (same key as live), and restores them", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const { unmount } = render(<FieldGuideResponses />);
    await userEvent.type(screen.getByLabelText("Answer question one"), "  Yes, loudly  ");
    await userEvent.click(screen.getByRole("button", { name: "Save privately" }));
    expect(screen.getByRole("status")).toHaveTextContent("Saved privately on this device.");
    expect(JSON.parse(localStorage.getItem(KEY)!)).toMatchObject({ q1: "Yes, loudly", q2: "" });
    expect(fetch).not.toHaveBeenCalled();
    unmount();
    render(<FieldGuideResponses />);
    expect(screen.getByLabelText("Answer question one")).toHaveValue("Yes, loudly");
  });

  it("starts empty if saved data is broken", () => {
    localStorage.setItem(KEY, "{not json");
    render(<FieldGuideResponses />);
    expect(screen.getByLabelText("Answer question one")).toHaveValue("");
  });

  it("copies the answers as text, marking blanks", async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<FieldGuideResponses />);
    await userEvent.type(screen.getByLabelText("Answer question two"), "Speech");
    await userEvent.click(screen.getByRole("button", { name: "Copy answers" }));
    const text = (writeText.mock.calls[0] as unknown as [string])[0];
    expect(text).toContain("1. When the side you usually agree with is wrong, will you say so?\n[No response]");
    expect(text).toContain("2. Which liberty are you unwilling to trade away for convenience or victory?\nSpeech");
    expect(screen.getByRole("status")).toHaveTextContent("Answers copied.");
  });

  it("explains when copy is blocked", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn(async () => Promise.reject(new Error("x"))) }, configurable: true });
    render(<FieldGuideResponses />);
    await userEvent.click(screen.getByRole("button", { name: "Copy answers" }));
    expect(screen.getByRole("status")).toHaveTextContent("Copy was blocked by the browser. Try Download instead.");
  });

  it("downloads a .txt file", async () => {
    Object.assign(URL, { createObjectURL: vi.fn(() => "blob:x"), revokeObjectURL: vi.fn() });
    let name = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      name = this.download;
    });
    render(<FieldGuideResponses />);
    await userEvent.click(screen.getByRole("button", { name: "Download" }));
    expect(name).toBe("america-unbundled-90-day-commitment.txt");
    expect(screen.getByRole("status")).toHaveTextContent("Answers downloaded.");
  });
});
