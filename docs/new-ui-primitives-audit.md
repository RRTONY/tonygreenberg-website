# New Interface Primitive Audit

## Scope

The release candidate was compared with the repository `main` baseline using added-file status under `src/app` and `src/components`. Four additions were found. Each is listed below; none introduces an alternate design system, navigation primitive, icon library, or client-storage model.

| Added file                                       | Classification                               | Existing component or pattern reused                            | Decision and rationale                                                                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/subscribe/route.test.ts`            | Test file, not a user-interface component    | Existing Vitest configuration and route-handler boundary        | **Retain.** Adds isolated newsletter success, unavailable-provider, and validation coverage without rendering a new interface.                                                                           |
| `src/app/api/visitor-state/[namespace]/route.ts` | Server route, not a user-interface component | Existing Next.js App Router route-handler architecture          | **Retain.** Replaces browser storage with the approved server-managed cookie and database boundary.                                                                                                      |
| `src/components/root-providers.tsx`              | Client-provider boundary                     | Existing theme, toast, and navigation-progress providers        | **Retain.** The thin wrapper keeps existing provider components client-only while allowing the root layout to remain server-rendered during production builds.                                           |
| `src/components/ui/inline-icons.tsx`             | Reusable presentation component              | Installed Lucide icon package and existing `next/link` controls | **Intentional exception.** No prior reusable directional-icon wrapper existed. This small adapter replaces repeated raw arrow glyphs while preserving established links, buttons, and layout components. |

## Conclusion

The audit identified no added page-level interface, duplicate card, duplicate navigation, alternate image component, or replacement interaction library. Existing Next.js page components, `next/link`, `next/image`, shadcn/Radix controls, and Lucide icons remain the default. The sole new reusable visual primitive is the documented `inline-icons.tsx` adapter, justified by the final source-level interface symbol policy.
