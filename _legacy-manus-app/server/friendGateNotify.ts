/**
 * Friend Gate Notification Helpers
 * Sends invitation emails and OTP codes to friends.
 * Uses the built-in notification infrastructure; SMS via future Twilio integration.
 */

import { ENV } from "./_core/env";

const BASE_URL = process.env.VITE_APP_URL ?? "https://tonygreenberg.com";

interface FriendInviteEmailParams {
  to: string;
  friendName: string;
  seekerName: string;
  surveyToken: string;
}

interface OtpEmailParams {
  to: string;
  otp: string;
  friendName: string;
}

interface OtpSmsParams {
  to: string;
  otp: string;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  // Use Google Apps Script (same channel as owner alerts) for reliable delivery
  const gasUrl = ENV.googleAppsScriptUrl;
  if (!gasUrl) {
    console.warn("[FriendGate] GOOGLE_APPS_SCRIPT_URL not set — skipping email");
    return;
  }
  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendEmail",
        to,
        subject,
        html,
        text: `Only Time Buys Trust — ${subject}`,
      }),
    });
    if (!res.ok) {
      console.warn(`[FriendGate] Email send failed: ${res.status}`);
    }
  } catch (err) {
    console.warn("[FriendGate] Failed to send email:", err);
    // Don't throw — log and continue so the gate doesn't break on email failure
  }
}

export async function sendFriendInviteEmail(params: FriendInviteEmailParams): Promise<void> {
  const surveyUrl = `${BASE_URL}/friend-survey/${params.surveyToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#FAFAF5;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:2rem auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#B45309 0%,#D97706 100%);padding:2rem 2rem 1.5rem;text-align:center;">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);margin-bottom:.5rem;">Only Time Buys Trust</div>
      <h1 style="color:#fff;font-size:22px;margin:0;font-weight:700;">Your friend needs your honest voice.</h1>
    </div>
    <div style="padding:2rem;">
      <p style="font-size:16px;color:#1A1208;line-height:1.7;margin-top:0;">
        Hi ${params.friendName},
      </p>
      <p style="font-size:15px;color:#1A1208;line-height:1.7;">
        <strong>${params.seekerName}</strong> is considering a significant inner journey — the kind that reshapes how a person moves through the world. Before they take another step, they've asked three people who know them well to weigh in honestly.
      </p>
      <p style="font-size:15px;color:#1A1208;line-height:1.7;">
        You are one of those three people.
      </p>
      <p style="font-size:15px;color:#1A1208;line-height:1.7;">
        This is a short, private survey — six questions, five minutes. Your response is anonymous. <strong>${params.seekerName}</strong> will see a summary, not your name or your specific answers.
      </p>
      <p style="font-size:14px;color:rgba(26,18,8,.6);line-height:1.6;font-style:italic;border-left:3px solid #D97706;padding-left:1rem;margin:1.5rem 0;">
        "You are not just you. You are an organism embedded in relationships. Those relationships deserve a vote."
      </p>
      <div style="text-align:center;margin:2rem 0;">
        <a href="${surveyUrl}" style="display:inline-block;background:linear-gradient(135deg,#D97706 0%,#F59E0B 100%);color:#1A1208;text-decoration:none;font-weight:700;font-size:15px;padding:.9rem 2rem;border-radius:8px;letter-spacing:.04em;">
          Share My Honest View →
        </a>
      </div>
      <p style="font-size:13px;color:rgba(26,18,8,.45);line-height:1.6;text-align:center;">
        This link is unique to you. It expires in 72 hours.<br />
        You will need to verify your identity with a one-time code before responding.
      </p>
    </div>
    <div style="background:#FAFAF5;padding:1rem 2rem;text-align:center;border-top:1px solid rgba(26,18,8,.08);">
      <p style="font-size:11px;color:rgba(26,18,8,.4);margin:0;">
        © 2026 Tony Greenberg · onlytimebuystrust.com · Only Time Buys Trust
      </p>
    </div>
  </div>
</body>
</html>`;

  await sendEmail(params.to, `${params.seekerName} needs your honest voice`, html);
}

export async function sendOtpEmail(params: OtpEmailParams): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#FAFAF5;font-family:Georgia,serif;">
  <div style="max-width:480px;margin:2rem auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#B45309 0%,#D97706 100%);padding:1.5rem 2rem;text-align:center;">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.75);">Only Time Buys Trust</div>
    </div>
    <div style="padding:2rem;text-align:center;">
      <p style="font-size:15px;color:#1A1208;line-height:1.7;">Hi ${params.friendName},</p>
      <p style="font-size:15px;color:#1A1208;line-height:1.7;">Your verification code is:</p>
      <div style="font-size:36px;font-weight:700;color:#B45309;letter-spacing:.2em;margin:1.5rem 0;font-family:monospace;">
        ${params.otp}
      </div>
      <p style="font-size:13px;color:rgba(26,18,8,.5);">This code expires in 15 minutes.</p>
    </div>
  </div>
</body>
</html>`;

  await sendEmail(params.to, `Your verification code: ${params.otp}`, html);
}

export async function sendOtpSms(params: OtpSmsParams): Promise<void> {
  // Future: integrate Twilio or similar
  // For now, log and skip — SMS will be added when Twilio credentials are provided
  console.log(`[FriendGate] SMS OTP for ${params.to}: ${params.otp} (SMS not yet wired — add Twilio)`);
}
