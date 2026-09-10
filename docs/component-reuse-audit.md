# Shared Component Reuse Audit

## Scope

The restoration changes were reviewed for reuse of the existing Next.js design system and for justified additions.

| Change                                 | Existing component or pattern reused                 | Rationale                                                                                                                                                            |
| -------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage door actions                  | `FourDoors`, `Dialog`, `next/image`, and `next/link` | The existing component already provided the correct modal and card behavior; it was repaired rather than replaced.                                                   |
| Homepage and editorial media           | `next/image`                                         | Preserves optimized, responsive media rendering and the existing application convention.                                                                             |
| Public navigation and internal actions | `next/link`                                          | Retains Next.js client navigation and accessible routing behavior.                                                                                                   |
| BrewSoul navigation controls           | Existing Lucide package                              | Replaces text symbols and emoji without introducing an icon library.                                                                                                 |
| Legacy-wide arrow and status cleanup   | Existing Lucide package and `next/link`              | Existing page and interaction components were retained; only their raw glyph children were replaced with semantic Lucide icons.                                      |
| Direction-icon rendering               | Existing Lucide package                              | `inline-icons.tsx` is a minimal shared wrapper for repeated accessible left/right affordances; no existing project component exposed this exact reusable primitive.  |
| Global provider boundary               | `RootProviders`                                      | A narrowly scoped new component required to isolate existing client-only theme, toast, and progress providers from the server layout during production prerendering. |
| Cookie-backed feature state            | Existing route and library boundaries                | New modules were necessary to replace Supabase and browser storage with server-managed cookies and the managed database.                                             |

## Exceptions

No duplicate visual components or alternate navigation primitives were introduced. The new provider and visitor-state modules are infrastructure boundaries rather than competing user-interface components. The single new `inline-icons.tsx` component is a presentation-only adapter around the already installed Lucide package; it was introduced only after the source audit found repeated direction-control glyphs across existing components.
