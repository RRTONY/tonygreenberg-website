import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ThanksDoingPage, { metadata } from "@/app/thanksdoing/page";

vi.mock("@/app/thanksdoing/share-video-button", () => ({
  ShareVideoButton: ({ src }: { src: string }) => <button type="button">Share video {src}</button>,
}));

describe("/thanksdoing", () => {
  it("has its own title, canonical and a video share preview", () => {
    expect(metadata.title).toBe("Happy ThanksDOING");
    expect(metadata.alternates?.canonical).toBe("/thanksdoing");
    expect(metadata.openGraph).toMatchObject({ type: "video.other", videos: [{ url: "https://tonygreenberg.com/thanksdoing.mp4", type: "video/mp4" }] });
    expect((metadata.openGraph as { images?: unknown }).images).toBeTruthy();
  });

  it("shows the video, a real download link, the share button and the essay link", () => {
    const { container } = render(<ThanksDoingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Happy ThanksDOING");
    expect(container.querySelector("video")).toHaveAttribute("src", "/thanksdoing.mp4");
    expect(screen.getByRole("link", { name: /download mp4/i })).toHaveAttribute("download", "ThanksDOING.mp4");
    expect(screen.getByRole("button", { name: /share video \/thanksdoing.mp4/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /2014 essay/i })).toHaveAttribute("href", "/blog/grateful-smuggest-sentiment-or-selfish-act");
  });
});
