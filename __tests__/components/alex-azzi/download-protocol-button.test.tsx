import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DownloadProtocolButton } from "@/components/alex-azzi/download-protocol-button";
import { RED_FLAGS, VERIFICATION_STEPS } from "@/lib/content/alex-azzi";

describe("DownloadProtocolButton", () => {
  it("downloads the protocol as a text file with every red flag and step, with no email asked", async () => {
    let blob: Blob | undefined;
    const create = vi.fn((b: Blob) => {
      blob = b;
      return "blob:test";
    });
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    let downloadName = "";
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      downloadName = this.download;
    });

    render(<DownloadProtocolButton />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Download the SunlightProtocol/ }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(downloadName).toBe("Community-Protection-Verification-Protocol.txt");
    expect(revoke).toHaveBeenCalledWith("blob:test");
    expect(blob?.type).toBe("text/plain");
    const text = await blob!.text();
    expect(text.startsWith("THE SUNLIGHT PROTOCOL")).toBe(true);
    RED_FLAGS.forEach((rf) => expect(text).toContain(rf.flag));
    VERIFICATION_STEPS.forEach((s) => expect(text).toContain(s.title));
    expect(text).toContain("Get. It. In. Writing.");
    expect(text).toContain("tonygreenberg.com/alex-azzi");
  });
});
