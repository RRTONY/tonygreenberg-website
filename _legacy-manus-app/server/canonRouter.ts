/**
 * CANON ROUTER
 * Three workstreams for the Tony Greenberg Canon Project.
 * All LLM calls use the permanent spine spec from shared/TONY_CANON_SPEC.md.
 * Originals are NEVER modified. Drafts deploy only by explicit human approval.
 */
import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { adminProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import {
  getAllArticleDrafts,
  getArticleDraft,
  upsertArticleDraft,
  setArticleDraftStatus,
} from "./canonHelpers";
import { readFileSync } from "fs";
import { join } from "path";

// Load the Canon Spec once at startup — this is the spine
let CANON_SPEC = "";
try {
  CANON_SPEC = readFileSync(join(process.cwd(), "shared/TONY_CANON_SPEC.md"), "utf-8");
} catch {
  CANON_SPEC = "Tony Greenberg Canon Spec: no em-dashes, no italics, plainspoken, profound over salesy.";
}

const CANON_SYSTEM_PROMPT = `You are an editor working exclusively on Tony Greenberg's essays.

${CANON_SPEC}

CRITICAL: Return ONLY valid JSON matching the requested schema. No markdown fences, no preamble, no commentary outside the JSON object.`;

export const canonRouter = router({
  // ── LIST ALL DRAFTS ──
  listDrafts: adminProcedure.query(async () => {
    return getAllArticleDrafts();
  }),

  // ── GET SINGLE DRAFT ──
  getDraft: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getArticleDraft(input.slug);
    }),

  // ── WORKSTREAM ONE: THE EDIT ──
  runEdit: adminProcedure
    .input(z.object({
      slug: z.string(),
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      const wordCount = input.content.split(/\s+/).length;
      const maxNewWords = Math.floor(wordCount * 0.02);

      const prompt = `Run WORKSTREAM ONE — THE EDIT on this essay.

ESSAY TITLE: ${input.title}
ESSAY SLUG: ${input.slug}
WORD COUNT: ${wordCount}
MAX NET-NEW WORDS ALLOWED: ${maxNewWords}

ESSAY CONTENT:
${input.content}

Return a JSON object with exactly these fields:
{
  "centralIdea": "one sentence",
  "soulSentence": "the single sentence that holds the soul of the piece",
  "scorecard": {
    "opening": <1-10>,
    "momentum": <1-10>,
    "depthReach": <1-10>,
    "quotability": <1-10>,
    "ending": <1-10>
  },
  "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"],
  "v2Content": "the full edited essay text — cuts only, net-new words under ${maxNewWords}",
  "changeLog": "explanation of what changed and why",
  "newProseTable": "table of any net-new sentences with justification (should be nearly empty)",
  "titleOptions": ["title 1", "title 2", "title 3"],
  "subtitleOptions": ["subtitle 1", "subtitle 2", "subtitle 3"],
  "pullQuotes": ["quote 1", "quote 2", "quote 3", "quote 4", "quote 5"],
  "socialExcerpts": ["excerpt 1", "excerpt 2", "excerpt 3"],
  "illustrationIdea": "one illustration concept"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: CANON_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const raw = (response.choices[0].message.content as string) ?? "{}";
      let parsed: any = {};
      try { parsed = JSON.parse(raw); } catch { parsed = { v2Content: raw }; }

      await upsertArticleDraft(input.slug, input.title, {
        v2Content: parsed.v2Content ?? null,
        centralIdea: parsed.centralIdea ?? null,
        soulSentence: parsed.soulSentence ?? null,
        scorecard: parsed.scorecard ? JSON.stringify(parsed.scorecard) : null,
        improvements: parsed.improvements ? JSON.stringify(parsed.improvements) : null,
        changeLog: parsed.changeLog ?? null,
        newProseTable: parsed.newProseTable ?? null,
        titleOptions: parsed.titleOptions ? JSON.stringify(parsed.titleOptions) : null,
        subtitleOptions: parsed.subtitleOptions ? JSON.stringify(parsed.subtitleOptions) : null,
        pullQuotes: parsed.pullQuotes ? JSON.stringify(parsed.pullQuotes) : null,
        socialExcerpts: parsed.socialExcerpts ? JSON.stringify(parsed.socialExcerpts) : null,
        illustrationIdea: parsed.illustrationIdea ?? null,
        completedWorkstreams: "edit",
        status: "draft",
      });

      return { success: true, result: parsed };
    }),

  // ── WORKSTREAM TWO: THE JOURNEY ──
  runJourney: adminProcedure
    .input(z.object({
      slug: z.string(),
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Run WORKSTREAM TWO — THE JOURNEY on this essay.

ESSAY TITLE: ${input.title}
ESSAY SLUG: ${input.slug}

ESSAY CONTENT:
${input.content}

The five journey stages are:
- recognition: something is off and you already felt it
- machinery: here is the system that made it so
- reframe: a tool for seeing it differently
- human_cost: what it takes from people
- what_compounds: what to build instead

Return a JSON object with exactly these fields:
{
  "journeyStage": "recognition|machinery|reframe|human_cost|what_compounds",
  "stageJustification": "justify from the text, not the title",
  "journeyLine": "the single sentence for the journey navigation — in Tony's voice, makes someone at that stage click"
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: CANON_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const raw = (response.choices[0].message.content as string) ?? "{}";
      let parsed: any = {};
      try { parsed = JSON.parse(raw); } catch { parsed = {}; }

      const existing = await getArticleDraft(input.slug);
      const currentWorkstreams = existing?.completedWorkstreams ?? "";
      const newWorkstreams = currentWorkstreams.includes("journey")
        ? currentWorkstreams
        : [currentWorkstreams, "journey"].filter(Boolean).join(",");

      await upsertArticleDraft(input.slug, input.title, {
        journeyStage: parsed.journeyStage ?? null,
        stageJustification: parsed.stageJustification ?? null,
        journeyLine: parsed.journeyLine ?? null,
        completedWorkstreams: newWorkstreams,
      });

      return { success: true, result: parsed };
    }),

  // ── WORKSTREAM THREE: DIVERGENCE ──
  runDivergence: adminProcedure
    .input(z.object({
      slug: z.string(),
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Run WORKSTREAM THREE — DIVERGENCE on this essay.

ESSAY TITLE: ${input.title}
ESSAY SLUG: ${input.slug}

ESSAY CONTENT:
${input.content}

Compare this essay against the Voice Spec. Report divergences in:
- Sentence rhythm
- Paragraph rhythm  
- Favorite transitions
- Recurring metaphors
- Words overused
- Words conspicuously absent
- Humor register
- Question patterns
- How trust gets built in the prose

Flag any place a stated rule is broken in a way that WORKS. Those are the interesting ones.

Return a JSON object:
{
  "divergenceNotes": "full divergence report as readable prose",
  "rulesBrokenWell": ["rule broken well 1", "rule broken well 2"],
  "wordsOverused": ["word1", "word2"],
  "wordsAbsent": ["word1", "word2"],
  "antiPanderVerdict": {
    "argumentForCutting": "one paragraph arguing to cut this from the canon",
    "argumentForKeeping": "one paragraph defending keeping it"
  }
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: CANON_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const raw = (response.choices[0].message.content as string) ?? "{}";
      let parsed: any = {};
      try { parsed = JSON.parse(raw); } catch { parsed = {}; }

      const existing = await getArticleDraft(input.slug);
      const currentWorkstreams = existing?.completedWorkstreams ?? "";
      const newWorkstreams = currentWorkstreams.includes("divergence")
        ? currentWorkstreams
        : [currentWorkstreams, "divergence"].filter(Boolean).join(",");

      await upsertArticleDraft(input.slug, input.title, {
        divergenceNotes: parsed.divergenceNotes ?? null,
        completedWorkstreams: newWorkstreams,
      });

      return { success: true, result: parsed };
    }),

  // ── RUN ALL THREE WORKSTREAMS ──
  runAll: adminProcedure
    .input(z.object({
      slug: z.string(),
      title: z.string(),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Run all three in parallel for speed
      const [editRes, journeyRes, divergenceRes] = await Promise.all([
        (async () => {
          const wordCount = input.content.split(/\s+/).length;
          const maxNewWords = Math.floor(wordCount * 0.02);
          const r = await invokeLLM({
            messages: [
              { role: "system", content: CANON_SYSTEM_PROMPT },
              { role: "user", content: `Run WORKSTREAM ONE on: TITLE: ${input.title}\n\nCONTENT:\n${input.content}\n\nReturn JSON with: centralIdea, soulSentence, scorecard (5 axes 1-10), improvements (5 items), v2Content (cuts only max ${maxNewWords} new words), changeLog, newProseTable, titleOptions (3), subtitleOptions (3), pullQuotes (5), socialExcerpts (3), illustrationIdea` },
            ],
            response_format: { type: "json_object" },
          });
          return JSON.parse((r.choices[0].message.content as string) ?? "{}");
        })(),
        (async () => {
          const r = await invokeLLM({
            messages: [
              { role: "system", content: CANON_SYSTEM_PROMPT },
              { role: "user", content: `Run WORKSTREAM TWO on: TITLE: ${input.title}\n\nCONTENT:\n${input.content}\n\nReturn JSON with: journeyStage (recognition|machinery|reframe|human_cost|what_compounds), stageJustification, journeyLine` },
            ],
            response_format: { type: "json_object" },
          });
          return JSON.parse((r.choices[0].message.content as string) ?? "{}");
        })(),
        (async () => {
          const r = await invokeLLM({
            messages: [
              { role: "system", content: CANON_SYSTEM_PROMPT },
              { role: "user", content: `Run WORKSTREAM THREE on: TITLE: ${input.title}\n\nCONTENT:\n${input.content}\n\nReturn JSON with: divergenceNotes, rulesBrokenWell (array), wordsOverused (array), wordsAbsent (array), antiPanderVerdict {argumentForCutting, argumentForKeeping}` },
            ],
            response_format: { type: "json_object" },
          });
          return JSON.parse((r.choices[0].message.content as string) ?? "{}");
        })(),
      ]);

      await upsertArticleDraft(input.slug, input.title, {
        v2Content: editRes.v2Content ?? null,
        centralIdea: editRes.centralIdea ?? null,
        soulSentence: editRes.soulSentence ?? null,
        scorecard: editRes.scorecard ? JSON.stringify(editRes.scorecard) : null,
        improvements: editRes.improvements ? JSON.stringify(editRes.improvements) : null,
        changeLog: editRes.changeLog ?? null,
        newProseTable: editRes.newProseTable ?? null,
        titleOptions: editRes.titleOptions ? JSON.stringify(editRes.titleOptions) : null,
        subtitleOptions: editRes.subtitleOptions ? JSON.stringify(editRes.subtitleOptions) : null,
        pullQuotes: editRes.pullQuotes ? JSON.stringify(editRes.pullQuotes) : null,
        socialExcerpts: editRes.socialExcerpts ? JSON.stringify(editRes.socialExcerpts) : null,
        illustrationIdea: editRes.illustrationIdea ?? null,
        journeyStage: journeyRes.journeyStage ?? null,
        stageJustification: journeyRes.stageJustification ?? null,
        journeyLine: journeyRes.journeyLine ?? null,
        divergenceNotes: divergenceRes.divergenceNotes ?? null,
        completedWorkstreams: "edit,journey,divergence",
        status: "draft",
      });

      return { success: true, edit: editRes, journey: journeyRes, divergence: divergenceRes };
    }),

  // ── APPROVE DRAFT ──
  approveDraft: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await setArticleDraftStatus(input.id, "approved");
      return { success: true };
    }),

  // ── REJECT DRAFT ──
  rejectDraft: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await setArticleDraftStatus(input.id, "rejected");
      return { success: true };
    }),

  // ── PUBLISH DRAFT (swap v2 content into live article) ──
  // NOTE: This writes to blogData.json. The original content is preserved in the DB.
  publishDraft: adminProcedure
    .input(z.object({ id: z.number(), slug: z.string() }))
    .mutation(async ({ input }) => {
      const draft = await getArticleDraft(input.slug);
      if (!draft || !draft.v2Content) {
        throw new Error("No v2 content found for this draft");
      }
      if (draft.status !== "approved") {
        throw new Error("Draft must be approved before publishing");
      }
      // Mark as published in DB — actual content swap happens via the admin UI
      // which downloads the v2 and the webmaster deploys it
      await setArticleDraftStatus(input.id, "published");
      return { success: true, v2Content: draft.v2Content };
    }),
});
