import { describe, expect, it } from "vitest";
import FriendGatePage, { metadata } from "@/app/friend-gate/page";
import { FriendGate } from "@/components/friend-gate/friend-gate";

describe("/friend-gate", () => {
  it("has its own title, description and canonical", () => {
    expect(metadata.title).toBe("The Three Friends Gate");
    expect(metadata.description).toMatch(/Only time buys trust/);
    expect(metadata.alternates?.canonical).toBe("/friend-gate");
  });

  it("renders the Three Friends Gate flow", () => {
    expect(FriendGatePage().type).toBe(FriendGate);
  });
});
