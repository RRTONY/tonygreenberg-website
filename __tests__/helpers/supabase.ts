import { vi } from "vitest";

// A stand-in Supabase client. Every query-builder method returns the same
// chain, and awaiting the chain (or calling .single()/.maybeSingle()) gives
// `supabaseResult`, which a test can change:
//
//   supabaseResult.data = [{ id: 1 }];
//   expect(fakeSupabase.from).toHaveBeenCalledWith("cheshire_submissions");
//   expect(fakeSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({ city: "LA" }));
//
// resetFakeSupabase() runs before every test (see setup.ts).
export const supabaseResult: { data: unknown; error: unknown; count?: number | null } = {
  data: null,
  error: null,
  count: null,
};

const CHAIN_METHODS = [
  "select", "insert", "update", "upsert", "delete", "eq", "neq", "gt", "gte", "lt", "lte",
  "like", "ilike", "is", "in", "contains", "match", "not", "or", "filter", "order", "limit",
  "range", "returns", "throwOnError",
] as const;

type Chain = Record<(typeof CHAIN_METHODS)[number], ReturnType<typeof vi.fn>> & {
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => Promise<unknown>;
};

function makeFake() {
  const chain = {} as Chain;
  for (const m of CHAIN_METHODS) chain[m] = vi.fn(() => chain);
  chain.single = vi.fn(async () => ({ ...supabaseResult }));
  chain.maybeSingle = vi.fn(async () => ({ ...supabaseResult }));
  chain.then = (resolve, reject) => Promise.resolve({ ...supabaseResult }).then(resolve, reject);

  const auth = {
    getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
    signInWithOtp: vi.fn(async () => ({ data: {}, error: null })),
    signUp: vi.fn(async () => ({ data: {}, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
    resetPasswordForEmail: vi.fn(async () => ({ data: {}, error: null })),
    updateUser: vi.fn(async () => ({ data: {}, error: null })),
    exchangeCodeForSession: vi.fn(async () => ({ data: {}, error: null })),
    verifyOtp: vi.fn(async () => ({ data: {}, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  };

  // The client is NOT awaitable (only the query chain is), but it exposes the
  // chain's methods so a test can assert on fakeSupabase.insert etc.
  const { then: _then, ...chainMethods } = chain;
  void _then;
  return Object.assign(chainMethods, {
    chain,
    from: vi.fn(() => chain),
    rpc: vi.fn(() => chain),
    schema: vi.fn(() => ({ from: vi.fn(() => chain) })),
    auth,
    storage: { from: vi.fn(() => ({ upload: vi.fn(async () => ({ data: {}, error: null })), getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://supabase.test/file" } })) })) },
  });
}

export let fakeSupabase = makeFake();

export function resetFakeSupabase() {
  supabaseResult.data = null;
  supabaseResult.error = null;
  supabaseResult.count = null;
  fakeSupabase = makeFake();
}

export function getFakeSupabase() {
  return fakeSupabase;
}
