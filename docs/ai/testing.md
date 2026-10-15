# Tests (Vitest + Testing Library)

Added 2026-10-16 (owner's yes to the dev dependencies: `vitest`, `jsdom`, `@testing-library/react`,
`@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`). They're dev-only
and never ship to visitors.

```bash
pnpm test                      # run everything once (about 1.5 minutes)
pnpm test:watch                # re-run on save
pnpm exec vitest run __tests__/components/cheshire   # one folder
```

Needs **Node 24** (the repo's version): Node 22 crashes Vitest's workers with "Cannot read
properties of undefined (reading 'bind')". On this Mac the default `node` is 22, so use
`PATH=~/.nvm/versions/node/v24.18.0/bin:$PATH` (which also puts `pnpm` on the PATH).

## Where tests go

`__tests__/` mirrors `src/`, one test file per source file:

| Source | Test |
| --- | --- |
| `src/lib/utils.ts` | `__tests__/lib/utils.test.ts` |
| `src/components/cheshire/story-form.tsx` | `__tests__/components/cheshire/story-form.test.tsx` |
| `src/app/blog/[slug]/page.tsx` | `__tests__/app/blog/[slug]/page.test.tsx` |
| `src/app/(auth)/login/page.tsx` | `__tests__/app/(auth)/login/page.test.tsx` |
| `src/proxy.ts` | `__tests__/proxy.test.ts` |

Use `.test.tsx` whenever the test contains JSX. Import source with `@/...`, test helpers with
`@tests/helpers/...`.

## What's faked for every test (`__tests__/setup.ts`)

No test reads real data, sends an email, or reaches the internet.

- **Next.js:** `next/navigation`, `next/headers`, `next/cache`, `next/image` (plain `<img>`),
  `next/link` (plain `<a>`), `next/script`, `next/dynamic` (renders the real component once loaded:
  use `findBy*`), `next/font/*`, `next-themes`. Steer them through `@tests/helpers/next`:
  `navigation.pathname`, `navigation.searchParams`, `navigation.params`, `navigation.router.push`,
  `cookieJar`, `headerJar`. `notFound()` throws `NEXT_NOT_FOUND`; `redirect(url)` throws
  `NEXT_REDIRECT:<url>`.
- **Sanity:** `sanityFetch` and `client.fetch` resolve `[]`; `writeClient` is a stub. Give a test
  real-looking data with `vi.mocked(sanityFetch).mockResolvedValue(...)` (or `mockImplementation`
  keyed on the query) inside the test or a `beforeEach`.
- **Supabase:** all three `@/lib/supabase/*` clients return `fakeSupabase` from
  `@tests/helpers/supabase`. Set `supabaseResult.data / .error / .count` for what queries return;
  assert with `fakeSupabase.from`, `.insert`, `.eq`, `fakeSupabase.auth.getUser`, etc.
- **Email:** `sendEmail` from `@/lib/email` is a stub that returns `true` (`esc` is real).
- **`server-only`** is an empty module.
- **`fetch`** is blocked: an unstubbed call throws. Stub it per test with
  `vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(...))))`.
- jsdom gaps filled: `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `scrollTo`,
  `scrollIntoView`, pointer capture, canvas `getContext` (returns null).
- localStorage, sessionStorage and `document.cookie` are cleared after every test.

**Gotcha:** `mockReset` runs before every test, so every `vi.fn()` goes back to the behaviour it
was created with. Set per-test behaviour (`mockResolvedValue`, `mockReturnValue`) inside the test or
a `beforeEach`, never at the top level of the file, or it only applies to the first test.

**Gotcha:** always give `beforeEach` braces: `beforeEach(() => { mock.mockResolvedValue(x); })`.
Without them the arrow returns the mock, Vitest treats a returned function as clean-up and calls it
after the test, and a test that switched the mock to reject or hang then fails or times out for
no visible reason.

**Gotcha:** the fake Supabase client itself must never be awaitable (only its query chain is), or
`await createClient()` resolves to the query result instead of the client. Never build a fake
module from a `Proxy`: it answers `then` (so importing it hangs forever) and Vitest can't see its
named exports. The `next/font/google` fake lists every font the site uses (`GOOGLE_FONTS` in
`__tests__/helpers/next.tsx`): add a new face there when the site starts using one.

## Patterns

**Async Server Component page:**

```tsx
import { renderServer, pageProps } from "@tests/helpers/render";
await renderServer(Page(pageProps({ slug: "five-cups" })));
expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Five Cups");
await expect(Page(pageProps({ slug: "missing" }))).rejects.toThrow("NEXT_NOT_FOUND");
const meta = await generateMetadata(pageProps({ slug: "five-cups" }));
```

**Form:** fill it in with `userEvent`, check the error messages, check exactly what the submit
handler or server action receives, and check the success and failure states. Mock the server action
module in the form's test; test the server action itself (validation, what it saves, the email it
sends) in its own test file. Reference: `__tests__/components/cheshire/story-form.test.tsx` and
`__tests__/app/forms/actions.test.ts`.

**Quiz / step flow:** answer every question through the UI, check the progress, back button and
reset, and that the result matches the scoring logic (test the scoring function directly too).

Quizzes that move on by themselves after a pause (coffee, mirror, find-your-me, dharma): use
`vi.useFakeTimers({ shouldAdvanceTime: true })` with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.
On very long walk-throughs, `getByRole` gets slow; `getByText` or a plain DOM lookup is much
faster. Mock `@/lib/assessments/record-finish` and `@/app/assessments/actions` in quiz tests.

**Route handler:** build a `new Request(url, { method, headers, body })`, call `GET`/`POST`, and
check the status code and JSON. Cover the unauthorised and bad-input cases.

**Data module (`src/lib/content/*`):** integrity checks: unique ids/slugs, required fields present
and non-empty, internal links start with `/`, no Manus URLs (`manuscdn`, `/manus-storage/`,
`/api/img/`), cross-references point at entries that exist, and any helper functions it exports.

**Static page:** metadata (title, description, canonical), exactly one H1, a few lines of the real
copy, and the main links' `href`s.

**Type-only file:** `expectTypeOf` checks on the exported types.

No snapshot tests: they break on every copy change and prove nothing about behaviour.

## When a test finds a real bug

Don't change `src/` from inside a test pass. Write the test for the correct behaviour as
`it.fails("BUG: <what's wrong>", ...)` so the suite stays green while the bug is recorded, and list
it in `NEXTJS-MIGRATION-TODO.md`. When the bug is fixed, the `it.fails` starts failing: switch it
to `it`.
