# Next.js Production Build Diagnostic

The production build currently fails during static prerendering with non-deterministic routes and an internal React hook error (`use` or `useContext` read from `null`). TypeScript, linting, and unit tests pass. The failures are not limited to an individual page and continue after isolating the shared layout, which is consistent with a dependency-installation or framework-renderer issue rather than a single route defect.

## Verified observations

| Observation                                                                   | Status                                    |
| ----------------------------------------------------------------------------- | ----------------------------------------- |
| The project uses Next.js 16.3.1 with React and React DOM 19.2.8.              | Verified from installed package metadata. |
| The build fails after compilation, during static page generation.             | Verified locally.                         |
| The reported failing route changes across builds.                             | Verified locally.                         |
| TypeScript checks, ESLint, and Vitest pass before the production build stage. | Verified locally.                         |
| Both default and webpack production build modes show the failure.             | Verified locally.                         |

## Relevant upstream guidance

Next.js documents that a prerender failure can arise from browser-only behavior, missing data, or incorrect component boundaries, and recommends its prerender diagnostics for tracing the source. [1]

An upstream issue documents the same non-deterministic React hook error during Next.js 16 static generation, including failures in pure server routes and error boundaries. The reporter confirmed that recreating the dependency installation resolved the issue in that case. [2]

## Next remediation step

The next controlled remediation is to clear only the generated Next.js build cache, perform a frozen-lockfile installation under the project root, and rerun the production build with `--debug-prerender`. This preserves the locked dependency graph while removing potentially stale compiled output. No deployment will be attempted unless the required quality command passes.

## References

[1]: https://nextjs.org/docs/messages/prerender-error "Next.js: Prerender Error with Next.js"
[2]: https://github.com/vercel/next.js/issues/85668 "Next.js Issue #85668: React hook errors during static generation"
