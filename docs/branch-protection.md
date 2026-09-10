# Main Branch Protection

The GitHub `main` branch is protected through repository settings. Pull requests must be current with `main` and pass both required checks before they can merge:

| Required check       | Purpose                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `quality-gates`      | Runs `pnpm quality`, which includes Prettier, ESLint, TypeScript, Vitest, and the Next.js production build.                                   |
| `review-declaration` | Verifies that the pull request body confirms shared-component review, a documented component-reuse decision, and a local `pnpm quality` pass. |

Administrators are subject to these requirements. Pull requests are required, unresolved review
conversations block merges, and force-push and branch-deletion permissions are disabled. The
repository pull-request template contains the declarations that the `review-declaration` workflow
validates.

## Enforcement Scope

GitHub Actions evaluates the declaration job when a pull request is opened or updated, and branch
protection requires its successful result before merge. This creates a machine-verifiable
pre-merge gate, but it does not independently establish that a human reviewed component reuse
before code was written. Reviewers remain responsible for checking the documented reuse decision
against the existing component system before approving a pull request.

> The checks protect merges into `main`. Developers should still create a `todo.md` entry and complete focused validation before opening a pull request, as required by `CONTRIBUTING.md`.
