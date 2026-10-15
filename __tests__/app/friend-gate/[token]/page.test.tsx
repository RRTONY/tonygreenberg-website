import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderServer, pageProps } from "@tests/helpers/render";
import GateStatusPage, { metadata } from "@/app/friend-gate/[token]/page";
import { getGateStatus } from "@/lib/friend-gate";

vi.mock("@/lib/friend-gate", () => ({ getGateStatus: vi.fn() }));
const status = vi.mocked(getGateStatus);
type Props = Parameters<typeof GateStatusPage>[0];
const TOKEN = "a".repeat(64);
const props = (token = TOKEN) => pageProps({ token }) as unknown as Props;
const gate = (over: object) => ({ status: "open", responded: 3, support: 0, wait: 0, unsure: 0, friends: [], messages: [], ...over }) as never;

describe("/friend-gate/[token]", () => {
  it("is private: noindex", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("404s a malformed token without looking it up, and an unknown one", async () => {
    await expect(GateStatusPage(props("short"))).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(GateStatusPage(props("Z".repeat(64)))).rejects.toThrow("NEXT_NOT_FOUND");
    expect(status).not.toHaveBeenCalled();
    status.mockResolvedValue(null as never);
    await expect(GateStatusPage(props())).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("while waiting: shows who has responded", async () => {
    status.mockResolvedValue(gate({ status: "pending", responded: 1, friends: [{ name: "Ann", responded: true }, { name: "Bo", responded: false }] }));
    await renderServer(GateStatusPage(props()));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Waiting for your three.");
    expect(screen.getByText("1 of 3 friends have responded")).toBeInTheDocument();
    expect(screen.getByText("Ann").closest("li")).toHaveTextContent("Responded");
    expect(screen.getByText("Bo").closest("li")).toHaveTextContent(/awaiting response/);
  });

  it("when supported: shows the count and the anonymous messages", async () => {
    status.mockResolvedValue(gate({ support: 2, wait: 1, messages: ["Go for it."] }));
    await renderServer(GateStatusPage(props()));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("2 of 3 support you moving forward.");
    expect(screen.getByText(/You have their support/)).toBeInTheDocument();
    expect(screen.getByText("Go for it.")).toBeInTheDocument();
  });

  it("when blocked: says the friends asked to wait", async () => {
    status.mockResolvedValue(gate({ status: "blocked", wait: 2, support: 1 }));
    await renderServer(GateStatusPage(props()));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your people asked you to wait.");
    expect(screen.getByText(/love with a longer/)).toBeInTheDocument();
    expect(screen.queryByText(/What your friends wanted you to know/)).not.toBeInTheDocument();
  });
});
