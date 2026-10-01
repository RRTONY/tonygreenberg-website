# Claude API cost control (if AI calls are ever added)

> Rules from a real $900-in-3-weeks overrun on another RampRate app. This site makes no Claude API calls today (the FauxTony chatbot, Phase 10, was cancelled 2026-09-10), so these apply only if that changes.

1. **Cheapest model that does the job** by default (Haiku tier). A stronger model needs a code
   comment saying why. Never a top-tier model as a default.
2. **No polling.** Never call the API from a `setInterval`/timer loop, only on a user action or a
   webhook. (45-second polling was the main cause of the overrun.)
3. **Always set `max_tokens`**: 128 to 256 for classification, 1024 for summaries, 2048 for
   drafts, 4096 for long reports (with a reason).
4. **One API key per app**, with its own monthly spend limit in the Anthropic console.
5. **Prompt caching** (`cache_control: { type: "ephemeral" }`) on long, repeated system prompts
   or grounding content.
6. API keys only on the server (a Route Handler), never in client code. New dependency
   (`@anthropic-ai/sdk`) needs a yes first (CONTRIBUTING.md rule 16).
