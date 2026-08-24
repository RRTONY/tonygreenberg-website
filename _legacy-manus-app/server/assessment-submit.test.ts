import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock notifyOwner
const mockNotifyOwner = vi.fn().mockResolvedValue(true);
vi.mock("./_core/notification", () => ({
  notifyOwner: (...args: any[]) => mockNotifyOwner(...args),
}));

// Mock db functions
const mockSaveAssessmentResult = vi.fn().mockResolvedValue({ id: 1 });
const mockGetAssessmentHistory = vi.fn().mockResolvedValue([]);
const mockGetAssessmentHistoryByUser = vi.fn().mockResolvedValue([]);
const mockCreateNotification = vi.fn().mockResolvedValue({ id: 1 });

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  saveAssessmentResult: (...args: any[]) => mockSaveAssessmentResult(...args),
  getAssessmentHistory: (...args: any[]) => mockGetAssessmentHistory(...args),
  getAssessmentHistoryByUser: (...args: any[]) => mockGetAssessmentHistoryByUser(...args),
  createNotification: (...args: any[]) => mockCreateNotification(...args),
}));

// Mock drizzle schema
vi.mock("../drizzle/schema", () => ({
  assessmentResults: {},
}));

// Mock drizzle-orm
vi.mock("drizzle-orm", () => ({
  desc: vi.fn(),
  eq: vi.fn(),
}));

import { appRouter } from "./routers";

function createCaller(user?: { id: number; name: string; role: string; openId: string }) {
  return appRouter.createCaller({
    user: user ?? null,
    req: {} as any,
    res: {} as any,
  });
}

describe("assessments.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves assessment without sharing", async () => {
    const caller = createCaller();
    const result = await caller.assessments.submit({
      assessmentType: "therapy",
      sessionId: "test-123",
      answers: JSON.stringify({ q1: 0, q2: 1 }),
      resultSummary: JSON.stringify({ archetype: "CBT Explorer" }),
      totalScore: 42,
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
    expect(mockSaveAssessmentResult).toHaveBeenCalledWith(
      "therapy",
      "test-123",
      expect.any(String),
      expect.any(String),
      42,
      undefined, // no userId for anonymous
      undefined, // sharedWithTony not set
      undefined, // userName
      undefined, // userEmail
    );
    expect(mockNotifyOwner).not.toHaveBeenCalled();
  });

  it("saves and notifies Tony when shared", async () => {
    const caller = createCaller();
    const result = await caller.assessments.submit({
      assessmentType: "dharma",
      sessionId: "test-456",
      answers: JSON.stringify({ q1: 2 }),
      resultSummary: JSON.stringify({ archetype: "The Sage" }),
      totalScore: 85,
      sharedWithTony: true,
      userName: "Jane Doe",
      userEmail: "jane@example.com",
    });

    expect(result.success).toBe(true);
    expect(mockSaveAssessmentResult).toHaveBeenCalledWith(
      "dharma",
      "test-456",
      expect.any(String),
      expect.any(String),
      85,
      undefined,
      true,
      "Jane Doe",
      "jane@example.com",
    );
    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "Assessment Shared: Dharma",
      content: expect.stringContaining("Jane Doe"),
    });
    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "Assessment Shared: Dharma",
      content: expect.stringContaining("jane@example.com"),
    });
  });

  it("does not notify Tony when sharedWithTony is false", async () => {
    const caller = createCaller();
    await caller.assessments.submit({
      assessmentType: "coffee",
      sessionId: "test-789",
      answers: JSON.stringify({}),
      resultSummary: JSON.stringify({ primaryType: "Pour Over Purist" }),
      totalScore: null,
      sharedWithTony: false,
    });

    expect(mockSaveAssessmentResult).toHaveBeenCalled();
    expect(mockNotifyOwner).not.toHaveBeenCalled();
  });

  it("accepts all new assessment types", async () => {
    const newTypes = ["peptide", "sexuality", "soulscore", "self-portrait", "kava", "brewsoul-quiz"] as const;
    for (const type of newTypes) {
      mockSaveAssessmentResult.mockResolvedValueOnce({ id: 1 });
      const caller = createCaller();
      const result = await caller.assessments.submit({
        assessmentType: type,
        sessionId: `test-${type}`,
        answers: "{}",
        resultSummary: "{}",
        totalScore: null,
      });
      expect(result.success).toBe(true);
    }
  });

  it("includes user ID when logged in", async () => {
    const caller = createCaller({ id: 42, name: "Tony", role: "admin", openId: "abc" });
    await caller.assessments.submit({
      assessmentType: "mirror",
      sessionId: "test-auth",
      answers: "{}",
      resultSummary: "{}",
      totalScore: 100,
      sharedWithTony: true,
      userName: "Tony",
    });

    expect(mockSaveAssessmentResult).toHaveBeenCalledWith(
      "mirror",
      "test-auth",
      "{}",
      "{}",
      100,
      42, // userId from ctx
      true,
      "Tony",
      undefined,
    );
    // Notification should use the provided userName
    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "Assessment Shared: Mirror",
      content: expect.stringContaining("Tony"),
    });
  });

  it("extracts archetype from resultSummary for notification", async () => {
    const caller = createCaller();
    await caller.assessments.submit({
      assessmentType: "spirit",
      sessionId: "test-archetype",
      answers: "{}",
      resultSummary: JSON.stringify({ archetype: "The Alchemist" }),
      totalScore: null,
      sharedWithTony: true,
      userName: "Test User",
    });

    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "Assessment Shared: Spirit",
      content: expect.stringContaining("Archetype: The Alchemist"),
    });
  });

  it("extracts primaryType from resultSummary for notification", async () => {
    const caller = createCaller();
    await caller.assessments.submit({
      assessmentType: "coffee",
      sessionId: "test-primarytype",
      answers: "{}",
      resultSummary: JSON.stringify({ primaryType: "Espresso Devotee" }),
      totalScore: null,
      sharedWithTony: true,
    });

    expect(mockNotifyOwner).toHaveBeenCalledWith({
      title: "Assessment Shared: Coffee",
      content: expect.stringContaining("Type: Espresso Devotee"),
    });
  });
});

describe("assessments.getHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets history by sessionId for anonymous users", async () => {
    mockGetAssessmentHistory.mockResolvedValueOnce([
      { id: 1, totalScore: 50, resultSummary: "{}", createdAt: new Date() },
    ]);
    const caller = createCaller();
    const results = await caller.assessments.getHistory({
      assessmentType: "therapy",
      sessionId: "test-123",
    });

    expect(results).toHaveLength(1);
    expect(mockGetAssessmentHistory).toHaveBeenCalledWith("therapy", "test-123");
  });

  it("gets history by userId for logged-in users", async () => {
    mockGetAssessmentHistoryByUser.mockResolvedValueOnce([
      { id: 1, totalScore: 75, resultSummary: "{}", createdAt: new Date() },
    ]);
    const caller = createCaller({ id: 42, name: "Tony", role: "admin", openId: "abc" });
    const results = await caller.assessments.getHistory({
      assessmentType: "dharma",
      sessionId: "test-456",
    });

    expect(results).toHaveLength(1);
    expect(mockGetAssessmentHistoryByUser).toHaveBeenCalledWith("dharma", 42);
  });
});
