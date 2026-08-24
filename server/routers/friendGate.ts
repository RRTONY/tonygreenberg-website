/**
 * Three Friends Permission Gate
 *
 * Flow:
 * 1. Seeker calls createSession with their name + 3 friend contacts
 * 2. System sends each friend a unique survey link via email
 * 3. Friend clicks link → requestOtp → verifyOtp → submitSurvey
 * 4. Seeker polls getStatus until gate opens
 * 5. Seeker calls getResults to see anonymized summary
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { friendGateSessions, friendGateSlots, FriendGateSlot } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendFriendInviteEmail, sendOtpEmail, sendOtpSms } from "../friendGateNotify";

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashContact(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

async function hashOtp(otp: string): Promise<string> {
  // Simple SHA-256 for OTP (short-lived, no need for bcrypt overhead)
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function verifyOtpHash(otp: string, hash: string): Promise<boolean> {
  const computed = crypto.createHash("sha256").update(otp).digest("hex");
  return computed === hash;
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwam.com",
  "yopmail.com", "sharklasers.com", "spam4.me", "trashmail.com",
  "trashmail.me", "trashmail.net", "dispostable.com", "mailnull.com",
  "maildrop.cc", "discard.email", "fakeinbox.com", "tempinbox.com",
  "throwaway.email", "getairmail.com", "filzmail.com",
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s\-().]/g, ""));
}

// ── The 6 Friend Survey Questions ────────────────────────────────────────────

export const FRIEND_SURVEY_QUESTIONS = [
  {
    id: "q1",
    question: "In your honest view, is your friend in a stable, grounded place right now — emotionally, physically, and in their relationships?",
    hint: "Think about the last few months, not just today.",
    type: "scale" as const,
    labels: ["Definitely not", "Somewhat", "Mostly yes", "Yes", "Absolutely"],
  },
  {
    id: "q2",
    question: "Have you seen your friend handle difficulty or stress well recently — without falling apart or making decisions they later regret?",
    hint: "This is about resilience, not perfection.",
    type: "scale" as const,
    labels: ["Not really", "Sometimes", "Usually", "Yes", "Consistently"],
  },
  {
    id: "q3",
    question: "Is there anything unresolved in their life right now — a loss, a conflict, a major transition — that you think they should work through first?",
    hint: "Be honest. This is private.",
    type: "scale" as const,
    labels: ["Yes, significant things", "A few things", "Minor things", "Not much", "Nothing I can think of"],
  },
  {
    id: "q4",
    question: "Do you believe your friend is doing this for the right reasons — genuine curiosity, healing, or growth — rather than escape, pressure, or impulse?",
    hint: "Trust your gut here.",
    type: "scale" as const,
    labels: ["I'm not sure", "Somewhat", "Mostly yes", "Yes", "Without a doubt"],
  },
  {
    id: "q5",
    question: "Do you support your friend moving forward with this kind of inner work at this time in their life?",
    hint: "This is the core question. Your answer matters.",
    type: "verdict" as const,
    options: [
      { value: "support", label: "Yes — I support them moving forward" },
      { value: "wait", label: "Not yet — I think they need more time" },
      { value: "unsure", label: "I'm genuinely unsure" },
    ],
  },
  {
    id: "q6",
    question: "Is there anything you want your friend to know before they proceed? (Optional — they will not know this came from you.)",
    hint: "This is your chance to say what you might not say to their face.",
    type: "text" as const,
  },
];

// ── Router ────────────────────────────────────────────────────────────────────

export const friendGateRouter = router({

  /** Seeker creates a gate session and nominates 3 friends. */
  createSession: publicProcedure
    .input(z.object({
      seekerName: z.string().min(1).max(128),
      friends: z.array(z.object({
        name: z.string().min(1).max(128),
        contactType: z.enum(["email", "phone"]),
        contactValue: z.string().min(1).max(320),
      })).length(3),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Validate contacts
      for (const friend of input.friends) {
        if (friend.contactType === "email") {
          if (!friend.contactValue.includes("@")) {
            throw new Error(`Invalid email for ${friend.name}`);
          }
          if (isDisposableEmail(friend.contactValue)) {
            throw new Error(`Disposable email addresses are not accepted. Please use a real email for ${friend.name}.`);
          }
        } else {
          if (!isValidPhone(friend.contactValue)) {
            throw new Error(`Invalid phone number for ${friend.name}`);
          }
        }
      }

      const seekerToken = generateToken();
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

      await db.insert(friendGateSessions).values({
        seekerToken,
        seekerName: input.seekerName,
        status: "pending",
        expiresAt,
      });

      const sessions = await db
        .select()
        .from(friendGateSessions)
        .where(eq(friendGateSessions.seekerToken, seekerToken))
        .limit(1);

      const session = sessions[0];
      if (!session) throw new Error("Failed to create session");

      for (let i = 0; i < 3; i++) {
        const friend = input.friends[i];
        const surveyToken = generateToken();
        const contactHash = hashContact(friend.contactValue);

        await db.insert(friendGateSlots).values({
          sessionId: session.id,
          slotIndex: i,
          friendName: friend.name,
          contactType: friend.contactType,
          contactValue: friend.contactValue,
          contactHash,
          surveyToken,
          verified: false,
        });

        try {
          if (friend.contactType === "email") {
            await sendFriendInviteEmail({
              to: friend.contactValue,
              friendName: friend.name,
              seekerName: input.seekerName,
              surveyToken,
            });
          }
        } catch (e) {
          console.error(`Failed to send invite to friend ${i}:`, e);
        }
      }

      return { seekerToken, expiresAt };
    }),

  /** Friend requests an OTP to verify their identity. */
  requestOtp: publicProcedure
    .input(z.object({
      surveyToken: z.string().length(64),
      contactValue: z.string().min(1).max(320),
      contactType: z.enum(["email", "phone"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.surveyToken, input.surveyToken))
        .limit(1);

      const slot = slots[0];
      if (!slot) throw new Error("Invalid survey link. Please check the link you received.");
      if (slot.respondedAt) throw new Error("This survey has already been completed.");

      const providedHash = hashContact(input.contactValue);
      if (providedHash !== slot.contactHash) {
        throw new Error("The contact information you entered does not match what was registered for this link.");
      }

      const otp = generateOtp();
      const otpHash = await hashOtp(otp);
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db
        .update(friendGateSlots)
        .set({ otpHash, otpExpiresAt })
        .where(eq(friendGateSlots.id, slot.id));

      try {
        if (input.contactType === "email") {
          await sendOtpEmail({ to: input.contactValue, otp, friendName: slot.friendName ?? "Friend" });
        } else {
          await sendOtpSms({ to: input.contactValue, otp });
        }
      } catch (e) {
        console.error("Failed to send OTP:", e);
        throw new Error("Failed to send verification code. Please try again.");
      }

      return { sent: true };
    }),

  /** Friend submits their OTP to unlock the survey. */
  verifyOtp: publicProcedure
    .input(z.object({
      surveyToken: z.string().length(64),
      otp: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.surveyToken, input.surveyToken))
        .limit(1);

      const slot = slots[0];
      if (!slot) throw new Error("Invalid survey link.");
      if (slot.respondedAt) throw new Error("This survey has already been completed.");
      if (!slot.otpHash || !slot.otpExpiresAt) throw new Error("Please request a verification code first.");
      if (new Date() > slot.otpExpiresAt) throw new Error("Verification code expired. Please request a new one.");

      const valid = await verifyOtpHash(input.otp, slot.otpHash);
      if (!valid) throw new Error("Incorrect code. Please try again.");

      await db
        .update(friendGateSlots)
        .set({ verified: true, verifiedAt: new Date() })
        .where(eq(friendGateSlots.id, slot.id));

      return { verified: true, friendName: slot.friendName };
    }),

  /** Friend submits their survey responses. */
  submitSurvey: publicProcedure
    .input(z.object({
      surveyToken: z.string().length(64),
      responses: z.record(z.string(), z.union([z.number(), z.string()])),
      verdict: z.enum(["support", "wait", "unsure"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.surveyToken, input.surveyToken))
        .limit(1);

      const slot = slots[0];
      if (!slot) throw new Error("Invalid survey link.");
      if (!slot.verified) throw new Error("Please verify your identity first.");
      if (slot.respondedAt) throw new Error("You have already submitted this survey.");

      await db
        .update(friendGateSlots)
        .set({
          surveyResponse: JSON.stringify(input.responses),
          verdict: input.verdict,
          respondedAt: new Date(),
        })
        .where(eq(friendGateSlots.id, slot.id));

      // Check if all 3 slots responded — resolve session if so
      const allSlots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.sessionId, slot.sessionId));

      const responded = allSlots.filter((s: FriendGateSlot) => s.respondedAt !== null);
      if (responded.length === 3) {
        const waitCount = allSlots.filter((s: FriendGateSlot) => s.verdict === "wait").length;
        const newStatus = waitCount >= 2 ? "blocked" : "open";
        await db
          .update(friendGateSessions)
          .set({ status: newStatus, resolvedAt: new Date() })
          .where(eq(friendGateSessions.id, slot.sessionId));
      }

      return { submitted: true };
    }),

  /** Seeker polls for gate status. */
  getStatus: publicProcedure
    .input(z.object({ seekerToken: z.string().length(64) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const sessions = await db
        .select()
        .from(friendGateSessions)
        .where(eq(friendGateSessions.seekerToken, input.seekerToken))
        .limit(1);

      const session = sessions[0];
      if (!session) throw new Error("Session not found.");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.sessionId, session.id));

      // Auto-open on timeout
      let status = session.status;
      if (status === "pending" && new Date() > session.expiresAt) {
        await db
          .update(friendGateSessions)
          .set({ status: "open", resolvedAt: new Date() })
          .where(eq(friendGateSessions.id, session.id));
        status = "open";
      }

      return {
        status,
        expiresAt: session.expiresAt,
        slots: slots.map((s: FriendGateSlot) => ({
          index: s.slotIndex,
          friendName: s.friendName,
          responded: s.respondedAt !== null,
        })),
        respondedCount: slots.filter((s: FriendGateSlot) => s.respondedAt !== null).length,
        totalSlots: 3,
      };
    }),

  /** Seeker retrieves anonymized results after gate opens. */
  getResults: publicProcedure
    .input(z.object({ seekerToken: z.string().length(64) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const sessions = await db
        .select()
        .from(friendGateSessions)
        .where(eq(friendGateSessions.seekerToken, input.seekerToken))
        .limit(1);

      const session = sessions[0];
      if (!session) throw new Error("Session not found.");
      if (session.status === "pending") throw new Error("Your friends have not all responded yet.");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.sessionId, session.id));

      const supportCount = slots.filter((s: FriendGateSlot) => s.verdict === "support").length;
      const waitCount = slots.filter((s: FriendGateSlot) => s.verdict === "wait").length;
      const unsureCount = slots.filter((s: FriendGateSlot) => s.verdict === "unsure").length;
      const respondedCount = slots.filter((s: FriendGateSlot) => s.respondedAt !== null).length;

      const messages = slots
        .filter((s: FriendGateSlot) => s.surveyResponse !== null)
        .map((s: FriendGateSlot) => {
          try {
            const r = JSON.parse(s.surveyResponse!) as Record<string, unknown>;
            return typeof r.q6 === "string" ? r.q6 : undefined;
          } catch { return undefined; }
        })
        .filter((m: string | undefined): m is string => typeof m === "string" && m.trim().length > 0);

      return {
        status: session.status,
        respondedCount,
        supportCount,
        waitCount,
        unsureCount,
        messages,
        resolvedAt: session.resolvedAt,
      };
    }),

  /** Get the survey questions (public). */
  getSurveyQuestions: publicProcedure
    .query(() => FRIEND_SURVEY_QUESTIONS),

  /** Get slot info by survey token (for the friend survey page header). */
  getSlotInfo: publicProcedure
    .input(z.object({ surveyToken: z.string().length(64) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const slots = await db
        .select()
        .from(friendGateSlots)
        .where(eq(friendGateSlots.surveyToken, input.surveyToken))
        .limit(1);

      const slot = slots[0];
      if (!slot) throw new Error("Invalid survey link.");

      const sessions = await db
        .select()
        .from(friendGateSessions)
        .where(eq(friendGateSessions.id, slot.sessionId))
        .limit(1);

      const session = sessions[0];

      return {
        friendName: slot.friendName,
        seekerName: session?.seekerName ?? "Someone you know",
        alreadyResponded: slot.respondedAt !== null,
        verified: slot.verified,
      };
    }),
});
