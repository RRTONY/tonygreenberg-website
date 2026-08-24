import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Mock the db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    getNotificationsForUser: vi.fn(),
    getUnreadNotificationCount: vi.fn(),
    markNotificationRead: vi.fn(),
    markAllNotificationsRead: vi.fn(),
    createNotification: vi.fn(),
    listAllNotifications: vi.fn(),
    deleteNotification: vi.fn(),
  };
});

import {
  getNotificationsForUser,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification,
  listAllNotifications,
  deleteNotification,
} from "./db";

function createUserContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 42,
    openId: "test-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    stripeCustomerId: null,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("notifications.unreadCount", () => {
  it("returns unread count for authenticated user", async () => {
    vi.mocked(getUnreadNotificationCount).mockResolvedValue(5);

    const caller = appRouter.createCaller(createUserContext());
    const count = await caller.notifications.unreadCount();

    expect(count).toBe(5);
    expect(getUnreadNotificationCount).toHaveBeenCalledWith(42);
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createUnauthContext());
    await expect(caller.notifications.unreadCount()).rejects.toThrow();
  });
});

describe("notifications.list", () => {
  it("returns notifications with read status for authenticated user", async () => {
    const mockNotifications = [
      {
        id: 1,
        type: "broadcast" as const,
        category: "announcement",
        title: "Welcome!",
        message: "Welcome to the site",
        link: null,
        createdAt: new Date("2026-01-01"),
        readAt: null,
      },
      {
        id: 2,
        type: "personal" as const,
        category: "signup",
        title: "You signed up",
        message: "Thanks for joining",
        link: "/profile",
        createdAt: new Date("2026-01-02"),
        readAt: new Date("2026-01-03"),
      },
    ];

    vi.mocked(getNotificationsForUser).mockResolvedValue(mockNotifications);

    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.notifications.list({ limit: 10 });

    expect(result).toHaveLength(2);
    expect(result[0].read).toBe(false);
    expect(result[1].read).toBe(true);
    expect(getNotificationsForUser).toHaveBeenCalledWith(42, 10);
  });

  it("uses default limit of 20 when not specified", async () => {
    vi.mocked(getNotificationsForUser).mockResolvedValue([]);

    const caller = appRouter.createCaller(createUserContext());
    await caller.notifications.list();

    expect(getNotificationsForUser).toHaveBeenCalledWith(42, 20);
  });
});

describe("notifications.markRead", () => {
  it("marks a notification as read", async () => {
    vi.mocked(markNotificationRead).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.notifications.markRead({ notificationId: 7 });

    expect(result).toEqual({ success: true });
    expect(markNotificationRead).toHaveBeenCalledWith(42, 7);
  });
});

describe("notifications.markAllRead", () => {
  it("marks all notifications as read", async () => {
    vi.mocked(markAllNotificationsRead).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.notifications.markAllRead();

    expect(result).toEqual({ success: true });
    expect(markAllNotificationsRead).toHaveBeenCalledWith(42);
  });
});

describe("notifications.create (admin only)", () => {
  it("allows admin to create a broadcast notification", async () => {
    vi.mocked(createNotification).mockResolvedValue({ id: 99 });

    const caller = appRouter.createCaller(createUserContext("admin"));
    const result = await caller.notifications.create({
      type: "broadcast",
      category: "announcement",
      title: "New essay published",
      message: "Check out the latest essay on consciousness.",
      link: "/essays/consciousness",
    });

    expect(result).toEqual({ id: 99 });
    expect(createNotification).toHaveBeenCalledWith({
      type: "broadcast",
      category: "announcement",
      title: "New essay published",
      message: "Check out the latest essay on consciousness.",
      link: "/essays/consciousness",
      createdBy: 42,
    });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    await expect(
      caller.notifications.create({
        title: "Sneaky broadcast",
        message: "Should not work",
      })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createUnauthContext());
    await expect(
      caller.notifications.create({
        title: "Anon broadcast",
        message: "Should not work",
      })
    ).rejects.toThrow();
  });
});

describe("notifications.delete (admin only)", () => {
  it("allows admin to delete a notification", async () => {
    vi.mocked(deleteNotification).mockResolvedValue(undefined);

    const caller = appRouter.createCaller(createUserContext("admin"));
    const result = await caller.notifications.delete({ notificationId: 5 });

    expect(result).toEqual({ success: true });
    expect(deleteNotification).toHaveBeenCalledWith(5);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    await expect(
      caller.notifications.delete({ notificationId: 5 })
    ).rejects.toThrow();
  });
});

describe("notifications.listAll (admin only)", () => {
  it("allows admin to list all notifications", async () => {
    const mockAll = [
      {
        id: 1,
        type: "broadcast" as const,
        category: "announcement",
        title: "Test",
        message: "Test message",
        link: null,
        targetUserId: null,
        createdBy: 42,
        createdAt: new Date(),
      },
    ];
    vi.mocked(listAllNotifications).mockResolvedValue(mockAll);

    const caller = appRouter.createCaller(createUserContext("admin"));
    const result = await caller.notifications.listAll({ limit: 10 });

    expect(result).toHaveLength(1);
    expect(listAllNotifications).toHaveBeenCalledWith(10);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));
    await expect(caller.notifications.listAll()).rejects.toThrow();
  });
});
