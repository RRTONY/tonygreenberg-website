import { describe, expect, it, vi } from "vitest";
import { startGate } from "@/app/friend-gate/actions";
import { createGate } from "@/lib/friend-gate";
import { headerJar } from "@tests/helpers/next";

vi.mock("@/lib/friend-gate", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/friend-gate")>()),
  createGate: vi.fn(),
}));

const friends = [
  { name: "Ann", email: "ann@example.com" },
  { name: "Bo", email: "bo@example.com" },
  { name: "Cy", email: "cy@example.com" },
];

describe("startGate", () => {
  it("needs a first name and exactly three named friends", async () => {
    await expect(startGate({ seekerName: " ", friends })).resolves.toEqual({ error: "Please enter your first name." });
    await expect(startGate({ seekerName: "Tony", friends: friends.slice(0, 2) })).resolves.toEqual({ error: "Add all three friends." });
    await expect(startGate({ seekerName: "Tony", friends: [{ name: "", email: "x@example.com" }, ...friends.slice(1)] })).resolves.toEqual({
      error: "Give each friend a name.",
    });
    expect(createGate).not.toHaveBeenCalled();
  });

  it("rejects a bad email (naming the friend) and duplicate addresses", async () => {
    await expect(startGate({ seekerName: "Tony", friends: [{ name: "Ann", email: "nope" }, ...friends.slice(1)] })).resolves.toEqual({
      error: "Ann: Enter a valid email address.",
    });
    await expect(startGate({ seekerName: "Tony", friends: [friends[0], { name: "Bo", email: "ANN@example.com" }, friends[2]] })).resolves.toEqual({
      error: "Use three different email addresses.",
    });
    expect(createGate).not.toHaveBeenCalled();
  });

  it("creates the gate with this site's address and returns the private token", async () => {
    headerJar.set("host", "tonygreenberg.com");
    vi.mocked(createGate).mockResolvedValue("tok123");
    await expect(startGate({ seekerName: " Tony ", friends })).resolves.toEqual({ token: "tok123" });
    expect(createGate).toHaveBeenCalledWith("https://tonygreenberg.com", "Tony", friends);
  });

  it("returns a friendly error when saving fails", async () => {
    vi.mocked(createGate).mockRejectedValue(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(startGate({ seekerName: "Tony", friends })).resolves.toEqual({ error: "Something went wrong. Please try again." });
  });
});
