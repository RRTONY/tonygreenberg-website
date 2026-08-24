/**
 * postIntervention.ts
 * tRPC router for Post-Intervention Assessment.
 * Anonymous — no auth required. Sends email to tony@tonygreenberg.com on submit.
 */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { postInterventionAssessments } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

const OWNER_EMAIL = "tony@tonygreenberg.com";

async function sendPostInterventionEmail(data: {
  dayChoice: number;
  facilitatorRef: string | null;
  interventionType: string;
  integrationScore: number | null;
  safetyScore: number | null;
  trustScore: number | null;
  wouldRecommend: string | null;
  wentWell: string | null;
  couldImprove: string | null;
  messageToFacilitator: string | null;
  responses: Record<string, unknown> | null;
}): Promise<boolean> {
  const gasUrl = ENV.googleAppsScriptUrl;
  if (!gasUrl) {
    console.warn("[postIntervention] GOOGLE_APPS_SCRIPT_URL not set — skipping email");
    return false;
  }

  const dayLabel = `Day ${data.dayChoice}`;
  const facilitator = data.facilitatorRef || "Not specified";
  const recommend = data.wouldRecommend === "yes" ? "Yes" : data.wouldRecommend === "no" ? "No" : "Unsure";

  const subject = `🍄 Post-Intervention Assessment — ${dayLabel} · Facilitator: ${facilitator}`;

  const text = [
    `POST-INTERVENTION ASSESSMENT — ${dayLabel}`,
    `Facilitator: ${facilitator}`,
    `Intervention type: ${data.interventionType}`,
    ``,
    `SCORES`,
    `Integration: ${data.integrationScore ?? "N/A"}/10`,
    `Safety: ${data.safetyScore ?? "N/A"}/10`,
    `Trust in facilitator: ${data.trustScore ?? "N/A"}/10`,
    `Would recommend: ${recommend}`,
    ``,
    `WHAT WENT WELL`,
    data.wentWell || "(not provided)",
    ``,
    `WHAT COULD IMPROVE`,
    data.couldImprove || "(not provided)",
    ``,
    `MESSAGE TO FACILITATOR (anonymous)`,
    data.messageToFacilitator || "(not provided)",
  ].join("\n");

  const html = `
<div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #1a1208; background: #fffdf7;">
  <div style="border-left: 4px solid #D97706; padding-left: 16px; margin-bottom: 24px;">
    <p style="margin: 0 0 4px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #D97706; font-family: monospace;">Post-Intervention Assessment</p>
    <h2 style="margin: 0; font-size: 22px; font-weight: normal;">${dayLabel} Report</h2>
    <p style="margin: 4px 0 0; font-size: 13px; color: #78350F;">Facilitator: <strong>${facilitator}</strong> &nbsp;·&nbsp; Type: <strong>${data.interventionType}</strong></p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 12px; background: #FEF3C7; border-radius: 6px; font-size: 13px; width: 33%;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #92400E; margin-bottom: 2px;">Integration</div>
        <div style="font-size: 24px; font-weight: 700; color: #B45309;">${data.integrationScore ?? "—"}<span style="font-size: 14px; color: #92400E;">/10</span></div>
      </td>
      <td style="padding: 8px 12px; background: #FEF3C7; border-radius: 6px; font-size: 13px; width: 33%;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #92400E; margin-bottom: 2px;">Safety</div>
        <div style="font-size: 24px; font-weight: 700; color: #B45309;">${data.safetyScore ?? "—"}<span style="font-size: 14px; color: #92400E;">/10</span></div>
      </td>
      <td style="padding: 8px 12px; background: #FEF3C7; border-radius: 6px; font-size: 13px; width: 33%;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .1em; color: #92400E; margin-bottom: 2px;">Trust</div>
        <div style="font-size: 24px; font-weight: 700; color: #B45309;">${data.trustScore ?? "—"}<span style="font-size: 14px; color: #92400E;">/10</span></div>
      </td>
    </tr>
  </table>

  <p style="font-size: 13px; margin-bottom: 16px;"><strong>Would recommend this facilitator:</strong> ${recommend}</p>

  ${data.wentWell ? `
  <div style="margin-bottom: 16px;">
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #059669; margin: 0 0 6px;">What went well</p>
    <p style="font-size: 14px; line-height: 1.7; margin: 0; padding: 12px; background: #F0FDF4; border-radius: 6px; border-left: 3px solid #059669;">${data.wentWell}</p>
  </div>` : ""}

  ${data.couldImprove ? `
  <div style="margin-bottom: 16px;">
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #DC2626; margin: 0 0 6px;">What could improve</p>
    <p style="font-size: 14px; line-height: 1.7; margin: 0; padding: 12px; background: #FEF2F2; border-radius: 6px; border-left: 3px solid #DC2626;">${data.couldImprove}</p>
  </div>` : ""}

  ${data.messageToFacilitator ? `
  <div style="margin-bottom: 16px;">
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #6D28D9; margin: 0 0 6px;">Anonymous message to facilitator</p>
    <p style="font-size: 14px; line-height: 1.7; margin: 0; padding: 12px; background: #F5F3FF; border-radius: 6px; border-left: 3px solid #6D28D9; font-style: italic;">"${data.messageToFacilitator}"</p>
  </div>` : ""}

  <p style="font-size: 11px; color: #92400E; margin-top: 24px; border-top: 1px solid #FDE68A; padding-top: 12px;">
    Submitted anonymously via tonygreenberg.com/post-intervention &nbsp;·&nbsp; Only Time Buys Trust
  </p>
</div>`;

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sendEmail", to: OWNER_EMAIL, subject, html, text }),
    });
    if (!res.ok) {
      console.warn(`[postIntervention] Email failed: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[postIntervention] Email error:", err);
    return false;
  }
}

export const postInterventionRouter = router({
  submit: publicProcedure
    .input(z.object({
      dayChoice: z.union([z.literal(1), z.literal(3), z.literal(7)]),
      facilitatorRef: z.string().max(256).optional(),
      interventionType: z.enum(["psychedelic", "meditation", "breathwork", "ceremony", "other"]).default("psychedelic"),
      integrationScore: z.number().int().min(1).max(10).optional(),
      safetyScore: z.number().int().min(1).max(10).optional(),
      trustScore: z.number().int().min(1).max(10).optional(),
      wouldRecommend: z.enum(["yes", "no", "unsure"]).optional(),
      wentWell: z.string().max(2000).optional(),
      couldImprove: z.string().max(2000).optional(),
      messageToFacilitator: z.string().max(2000).optional(),
      responses: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const id = randomUUID();
      const sessionToken = randomUUID();

      await db.insert(postInterventionAssessments).values({
        id,
        sessionToken,
        dayChoice: input.dayChoice,
        facilitatorRef: input.facilitatorRef ?? null,
        interventionType: input.interventionType,
        integrationScore: input.integrationScore ?? null,
        safetyScore: input.safetyScore ?? null,
        trustScore: input.trustScore ?? null,
        wouldRecommend: input.wouldRecommend ?? null,
        responses: input.responses ? JSON.stringify(input.responses) : null,
        wentWell: input.wentWell ?? null,
        couldImprove: input.couldImprove ?? null,
        messageToFacilitator: input.messageToFacilitator ?? null,
        notified: false,
      });

      // Send email to Tony
      const ownerAlertSent = await sendPostInterventionEmail({
        dayChoice: input.dayChoice,
        facilitatorRef: input.facilitatorRef ?? null,
        interventionType: input.interventionType,
        integrationScore: input.integrationScore ?? null,
        safetyScore: input.safetyScore ?? null,
        trustScore: input.trustScore ?? null,
        wouldRecommend: input.wouldRecommend ?? null,
        wentWell: input.wentWell ?? null,
        couldImprove: input.couldImprove ?? null,
        messageToFacilitator: input.messageToFacilitator ?? null,
        responses: input.responses ?? null,
      });

      // Only mark notified after the mail service confirms a successful response.
      await db
        .update(postInterventionAssessments)
        .set({ notified: ownerAlertSent })
        .where(eq(postInterventionAssessments.id, id));

      return { success: true, id, ownerAlertSent };
    }),
});
