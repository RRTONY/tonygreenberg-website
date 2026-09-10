"use client";

import type { VisitorStateNamespace, VisitorStateValue } from "./visitor-state";

type StateResponse = { value: VisitorStateValue | null };

async function stateRequest(
  namespace: VisitorStateNamespace,
  init?: RequestInit,
): Promise<StateResponse> {
  const response = await fetch(`/api/visitor-state/${namespace}`, {
    cache: "no-store",
    credentials: "same-origin",
    ...init,
  });

  if (!response.ok) {
    throw new Error("Visitor state is unavailable.");
  }

  return (await response.json()) as StateResponse;
}

export async function readVisitorState<T extends VisitorStateValue>(
  namespace: VisitorStateNamespace,
) {
  const { value } = await stateRequest(namespace);
  return value as T | null;
}

export async function writeVisitorState<T extends VisitorStateValue>(
  namespace: VisitorStateNamespace,
  value: T,
) {
  return stateRequest(namespace, {
    body: JSON.stringify({ value }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  });
}
