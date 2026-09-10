import { NextResponse, type NextRequest } from "next/server";

import {
  createVisitorId,
  getVisitorStateById,
  isVisitorStateNamespace,
  saveVisitorState,
  VISITOR_COOKIE_NAME,
  visitorCookieOptions,
  type VisitorStateValue,
} from "@/lib/visitor-state";

type RouteContext = { params: Promise<{ namespace: string }> };

const MAX_STATE_BYTES = 24 * 1024;

function isStateValue(value: unknown): value is VisitorStateValue {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;
  return Buffer.byteLength(JSON.stringify(value), "utf8") <= MAX_STATE_BYTES;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { namespace } = await params;
  if (!isVisitorStateNamespace(namespace)) {
    return NextResponse.json({ error: "Unknown visitor state namespace." }, { status: 404 });
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE_NAME)?.value;
  const value = visitorId ? await getVisitorStateById(visitorId, namespace) : null;
  return NextResponse.json({ value });
}

async function writeState(request: NextRequest, { params }: RouteContext, merge: boolean) {
  const { namespace } = await params;
  if (!isVisitorStateNamespace(namespace)) {
    return NextResponse.json({ error: "Unknown visitor state namespace." }, { status: 404 });
  }

  let payload: { value?: unknown };
  try {
    payload = (await request.json()) as { value?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isStateValue(payload.value)) {
    return NextResponse.json(
      { error: "Visitor state must be a small JSON object." },
      { status: 400 },
    );
  }

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE_NAME)?.value;
  const visitorId = existingVisitorId || createVisitorId();
  const existingValue =
    merge && existingVisitorId ? await getVisitorStateById(visitorId, namespace) : null;
  const value = merge ? { ...existingValue, ...payload.value } : payload.value;
  if (!isStateValue(value)) {
    return NextResponse.json({ error: "Visitor state is too large." }, { status: 400 });
  }
  await saveVisitorState(visitorId, namespace, value);

  const response = NextResponse.json({ value });
  if (!existingVisitorId) {
    response.cookies.set(VISITOR_COOKIE_NAME, visitorId, visitorCookieOptions());
  }
  return response;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return writeState(request, context, false);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return writeState(request, context, true);
}
