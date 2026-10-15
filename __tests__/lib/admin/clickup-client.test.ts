import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CLICKUP_LIST_ALIASES,
  CLICKUP_NOT_CONFIGURED,
  createClickupTask,
  deleteClickupTask,
  isClickupConfigured,
  updateClickupTask,
} from "@/lib/admin/clickup-client";

const task = { id: "86abc", name: "Fix footer", url: "https://app.clickup.com/t/86abc", status: { status: "to do" } };

function stubFetch(body: unknown = task, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
const call = (m: ReturnType<typeof stubFetch>, i = 0) => {
  const [url, init] = m.mock.calls[i] as unknown as [string, RequestInit];
  return { url, init, body: init.body ? JSON.parse(init.body as string) : undefined };
};

beforeEach(() => {
  vi.stubEnv("CLICKUP_API_TOKEN", "pk_test");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isClickupConfigured", () => {
  it("follows CLICKUP_API_TOKEN", () => {
    expect(isClickupConfigured()).toBe(true);
    vi.stubEnv("CLICKUP_API_TOKEN", "");
    expect(isClickupConfigured()).toBe(false);
  });
});

describe("createClickupTask", () => {
  it("posts to the tonygreenberg.com list by default with the token and mapped fields", async () => {
    const f = stubFetch();
    const r = await createClickupTask({ name: "Fix footer", description: "Links are grey", priority: "high", dueDate: "2026-11-10" });
    expect(r).toEqual({ id: "86abc", name: "Fix footer", url: "https://app.clickup.com/t/86abc", status: "to do" });
    const { url, init, body } = call(f);
    expect(url).toBe("https://api.clickup.com/api/v2/list/901114763560/task");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "pk_test", "Content-Type": "application/json" });
    expect(body).toEqual({ name: "Fix footer", description: "Links are grey", priority: 2, due_date: Date.parse("2026-11-10") });
  });

  it("resolves the alias and passes a raw list id through", async () => {
    expect(CLICKUP_LIST_ALIASES["tonygreenberg.com"]).toBe("901114763560");
    expect(Object.keys(CLICKUP_LIST_ALIASES)).toEqual(["tonygreenberg.com"]);
    const f = stubFetch();
    await createClickupTask({ name: "a", listId: "tonygreenberg.com" });
    await createClickupTask({ name: "b", listId: "555" });
    expect(call(f, 0).url).toBe("https://api.clickup.com/api/v2/list/901114763560/task");
    expect(call(f, 1).url).toBe("https://api.clickup.com/api/v2/list/555/task");
  });

  it("drops an unparseable due date and an unknown priority, and tolerates a missing status", async () => {
    const f = stubFetch({ id: 1, name: "a", url: "u" });
    const r = await createClickupTask({ name: "a", dueDate: "next week", priority: "someday" as never });
    expect(call(f).body).toEqual({ name: "a" });
    expect(r.status).toBe("");
  });

  it("never calls ClickUp without a token", async () => {
    vi.stubEnv("CLICKUP_API_TOKEN", "");
    const f = stubFetch();
    await expect(createClickupTask({ name: "a" })).rejects.toThrow(CLICKUP_NOT_CONFIGURED);
    expect(f).not.toHaveBeenCalled();
  });

  it("surfaces ClickUp's own error, or the status code", async () => {
    stubFetch({ err: "List deleted", ECODE: "x" }, 404);
    await expect(createClickupTask({ name: "a" })).rejects.toThrow("List deleted");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not json", { status: 500 })));
    await expect(createClickupTask({ name: "a" })).rejects.toThrow("ClickUp API error (500)");
  });
});

describe("updateClickupTask", () => {
  it("PUTs only the fields given, including status", async () => {
    const f = stubFetch({ ...task, status: { status: "complete" } });
    const r = await updateClickupTask("86abc", { status: "complete", priority: "urgent", description: "" });
    expect(r.status).toBe("complete");
    const { url, init, body } = call(f);
    expect(url).toBe("https://api.clickup.com/api/v2/task/86abc");
    expect(init.method).toBe("PUT");
    expect(body).toEqual({ status: "complete", priority: 1, description: "" });
  });

  it("encodes the task id so it can't reach another endpoint", async () => {
    const f = stubFetch();
    await updateClickupTask("../list/1", { name: "x" });
    expect(call(f).url).toBe("https://api.clickup.com/api/v2/task/..%2Flist%2F1");
  });
});

describe("deleteClickupTask", () => {
  it("sends a DELETE for that task", async () => {
    const f = stubFetch({});
    await expect(deleteClickupTask("86abc")).resolves.toBeUndefined();
    const { url, init } = call(f);
    expect(url).toBe("https://api.clickup.com/api/v2/task/86abc");
    expect(init.method).toBe("DELETE");
    expect(init.body).toBeUndefined();
  });
});
