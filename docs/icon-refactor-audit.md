# Legacy Interface Icon Refactor Audit

## Scope

The pre-release interface review distinguishes **interactive controls and status indicators** from editorial prose. The repository rule is to use the installed Lucide icon package for controls, navigation indicators, status cues, and visual markers. Decorative or instructional prose is preserved unless it functions as a control.

## Completed Work

All emoji occurrences were removed from active `.tsx` files under `src/app` and `src/components`. The affected interfaces now use existing icon components, including the BrewSoul welcome and taste quizzes, prescription wizard, city tabs, home cards, first-sip cards, health timing cards, coffee detail, Shanita interview sharing controls, Journeys accordion, Find Your Me assessment, Find Your Peptide assessment, SoulScore statistics, shared assessment routes, and the Engagement Audit.

Shared data passed from Server Components to Client Components retains serializable icon keys where necessary; the existing Client Component resolves those keys to Lucide components. This avoids passing component functions across a Next.js server-to-client boundary.

## Verification

The source audit command reported **no emoji** in active page and component `.tsx` files after the completed conversion. TypeScript and ESLint checks passed after each conversion batch.

Representative desktop visual checks passed for `/brewsoul/first-sip`, `/brewsoul/health`, `/find-your-me`, `/find-your-peptide`, and `/engage`, followed by `/find-my`, `/kava`, `/iboga-ibogaine`, `/brewsoul/cities/portland`, and `/psychedelic-readiness-index`. The reviewed pages retained their existing responsive typography, page hierarchy, imagery, and card structure after icon substitutions; the semantic icons render as supporting interface affordances rather than replacing editorial copy.

The permanent `src/test/ui-symbols.test.ts` policy now rejects emoji and raw arrow glyphs in interactive controls, as well as short rendered status and indicator labels. It deliberately excludes internal string-processing delimiters and longer editorial prose, allowing necessary content semantics to remain intact.

## Remaining Review

The final active-source audit after the Facilitator, assessment, BrewSoul, PRI, public-link, Search modal, SoulScore, and Peptide Matrix batches confirms that remaining occurrences are limited to internal string-processing delimiters, longer editorial prose, informational notation, research language, comments, or test assertions. The automated policy blocks future regressions in interactive controls and short rendered status or indicator labels. Further conversion must not rewrite those non-interface content uses merely because an arrow character appears in source text.
