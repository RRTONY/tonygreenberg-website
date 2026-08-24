import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-manifesto-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("manifesto.submit", () => {
  it("accepts a manifesto response with all fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.manifesto.submit({
      biggestChallenge: "Finding alignment between purpose and profit",
      whatToMeasure: "The velocity of personal transformation",
      referenceSites: "https://example.com",
      newIndices: "A Happiness Index",
      howToParticipate: "Builder and connector",
      abundantLife: "Health, love, purpose, impact all in flow",
      email: "test@example.com",
      name: "Test Submitter",
    });
    expect(result).toEqual({ success: true });
  });

  it("accepts a minimal manifesto response with no fields", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.manifesto.submit({});
    expect(result).toEqual({ success: true });
  });
});

describe("community.stats", () => {
  it("returns community statistics as a public query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const stats = await caller.community.stats();
    expect(stats).toHaveProperty("members");
    expect(stats).toHaveProperty("contacts");
    expect(stats).toHaveProperty("invitations");
    expect(typeof stats.members).toBe("number");
    expect(typeof stats.contacts).toBe("number");
    expect(typeof stats.invitations).toBe("number");
  });
});

describe("community.members", () => {
  it("returns a list of community members as a public query", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const members = await caller.community.members({ limit: 10, offset: 0 });
    expect(Array.isArray(members)).toBe(true);
  });
});

describe("community.updateProfile", () => {
  it("creates or updates a community profile for an authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.community.updateProfile({
      displayName: "Test User",
      bio: "Building a better future",
      lookingFor: ["My Tribe", "Business Partner"],
      interests: ["Consciousness", "Impact Investing", "AI"],
      location: "New York, USA",
      website: "https://example.com",
    });
    expect(result).toBeDefined();
  });

  it("rejects profile update without authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.community.updateProfile({
        displayName: "Anonymous",
      })
    ).rejects.toThrow();
  });
});

describe("community.uploadContacts", () => {
  it("uploads contacts for an authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.community.uploadContacts({
      contacts: [
        { name: "Alice Smith", email: "alice@example.com", relationship: "Friend", note: "Met at conference" },
        { name: "Bob Jones", email: "bob@example.com", phone: "+1234567890" },
      ],
    });
    expect(result).toHaveProperty("uploaded");
    expect(result.uploaded).toBe(2);
  });

  it("rejects contact upload without authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.community.uploadContacts({
        contacts: [{ name: "Test" }],
      })
    ).rejects.toThrow();
  });
});

describe("community.myProfile", () => {
  it("returns profile for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    // Should not throw — returns null or the profile
    const profile = await caller.community.myProfile();
    // After updateProfile test above, this should return something
    expect(profile === null || typeof profile === "object").toBe(true);
  });

  it("rejects unauthenticated access", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.community.myProfile()).rejects.toThrow();
  });
});

describe("community.myContacts", () => {
  it("returns contacts for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const contacts = await caller.community.myContacts();
    expect(Array.isArray(contacts)).toBe(true);
  });

  it("rejects unauthenticated access", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.community.myContacts()).rejects.toThrow();
  });
});
