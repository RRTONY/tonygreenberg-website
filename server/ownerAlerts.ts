/**
 * ownerAlerts.ts
 * Sends immediate email alerts to tony@tonygreenberg.com for key site events:
 *   - New reader comment on an article
 *   - New newsletter subscriber
 *   - New "Ask Tony" direct question
 */

import { ENV } from "./_core/env";

const OWNER_EMAIL = "tony@tonygreenberg.com";
const GAS_URL = () => ENV.googleAppsScriptUrl;

async function sendOwnerEmail(subject: string, html: string, text: string): Promise<boolean> {
  const gasUrl = GAS_URL();
  if (!gasUrl) {
    console.warn("[ownerAlerts] GOOGLE_APPS_SCRIPT_URL not set — skipping alert");
    return false;
  }
  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendEmail",
        to: OWNER_EMAIL,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.warn(`[ownerAlerts] Email send failed: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[ownerAlerts] Failed to send alert:", err);
    return false;
  }
}

/* ── NEW COMMENT ALERT ── */
export async function alertNewComment(opts: {
  name: string;
  email?: string | null;
  postTitle: string;
  postSlug: string;
  content: string;
}): Promise<boolean> {
  const preview = opts.content.length > 300 ? opts.content.slice(0, 300) + "…" : opts.content;
  const postUrl = `https://tonygreenberg.com/blog/${opts.postSlug}`;
  const replyTo = opts.email ? `mailto:${opts.email}?subject=Re: Your comment on "${opts.postTitle}"` : null;

  const subject = `💬 New comment on "${opts.postTitle}"`;
  const text = `From: ${opts.name}${opts.email ? ` <${opts.email}>` : ""}\n\n"${preview}"\n\nRead the full article: ${postUrl}${replyTo ? `\n\nReply directly: ${opts.email}` : ""}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <div style="border-left: 3px solid #8B6914; padding-left: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #8B6914; font-family: monospace;">New Reader Comment</p>
        <h2 style="margin: 0; font-size: 18px; font-weight: normal;">${opts.postTitle}</h2>
      </div>
      <p style="margin: 0 0 8px; font-size: 13px; color: #555;">
        <strong>${opts.name}</strong>${opts.email ? ` · <a href="mailto:${opts.email}" style="color: #8B6914;">${opts.email}</a>` : ""}
      </p>
      <blockquote style="margin: 16px 0; padding: 16px 20px; background: #FAFAF7; border-left: 2px solid rgba(139,105,20,0.3); font-size: 15px; line-height: 1.7; color: #333;">
        ${preview.replace(/\n/g, "<br>")}
      </blockquote>
      <div style="margin-top: 20px; display: flex; gap: 12px;">
        <a href="${postUrl}" style="display: inline-block; padding: 10px 20px; background: #111; color: #F5F0E0; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.08em;">VIEW ARTICLE →</a>
        ${opts.email ? `<a href="mailto:${opts.email}?subject=Re: Your comment on &quot;${opts.postTitle}&quot;" style="display: inline-block; padding: 10px 20px; background: #8B6914; color: #fff; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.08em;">REPLY TO READER →</a>` : ""}
      </div>
      <p style="margin-top: 24px; font-size: 11px; color: #aaa; font-family: monospace;">tonygreenberg.com · reader engagement alert</p>
    </div>
  `;
  return sendOwnerEmail(subject, html, text);
}

/* ── NEW SUBSCRIBER ALERT ── */
export async function alertNewSubscriber(opts: {
  email: string;
  source?: string;
  firstName?: string;
}): Promise<boolean> {
  const subject = `✉️ New subscriber: ${opts.email}`;
  const text = `New newsletter subscriber\n\nEmail: ${opts.email}${opts.firstName ? `\nName: ${opts.firstName}` : ""}${opts.source ? `\nSource: ${opts.source}` : ""}\n\nView in Kit: https://app.kit.com/subscribers`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <div style="border-left: 3px solid #2E8B57; padding-left: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #2E8B57; font-family: monospace;">New Newsletter Subscriber</p>
        <h2 style="margin: 0; font-size: 18px; font-weight: normal;">${opts.email}</h2>
      </div>
      ${opts.firstName ? `<p style="margin: 0 0 8px; font-size: 14px; color: #555;">Name: <strong>${opts.firstName}</strong></p>` : ""}
      ${opts.source ? `<p style="margin: 0 0 8px; font-size: 14px; color: #555;">Source: <strong>${opts.source}</strong></p>` : ""}
      <div style="margin-top: 20px;">
        <a href="https://app.kit.com/subscribers" style="display: inline-block; padding: 10px 20px; background: #111; color: #F5F0E0; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.08em;">VIEW IN KIT →</a>
      </div>
      <p style="margin-top: 24px; font-size: 11px; color: #aaa; font-family: monospace;">tonygreenberg.com · subscriber alert</p>
    </div>
  `;
  return sendOwnerEmail(subject, html, text);
}

/* ── NEW ASK TONY ALERT ── */
export async function alertAskTony(opts: {
  name: string;
  email?: string | null;
  question: string;
  postTitle?: string;
  postSlug?: string;
}): Promise<boolean> {
  const preview = opts.question.length > 400 ? opts.question.slice(0, 400) + "…" : opts.question;
  const context = opts.postTitle ? ` (from "${opts.postTitle}")` : "";
  const subject = `❓ Direct question from ${opts.name}${context}`;
  const text = `From: ${opts.name}${opts.email ? ` <${opts.email}>` : ""}\n\n"${preview}"${opts.postSlug ? `\n\nContext: https://tonygreenberg.com/blog/${opts.postSlug}` : ""}`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
      <div style="border-left: 3px solid #6A5ACD; padding-left: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #6A5ACD; font-family: monospace;">Direct Question for Tony</p>
        <h2 style="margin: 0; font-size: 18px; font-weight: normal;">${opts.name}${opts.postTitle ? ` · re: "${opts.postTitle}"` : ""}</h2>
      </div>
      <p style="margin: 0 0 8px; font-size: 13px; color: #555;">
        <strong>${opts.name}</strong>${opts.email ? ` · <a href="mailto:${opts.email}" style="color: #6A5ACD;">${opts.email}</a>` : ""}
      </p>
      <blockquote style="margin: 16px 0; padding: 16px 20px; background: #f8f7ff; border-left: 2px solid rgba(106,90,205,0.3); font-size: 15px; line-height: 1.7; color: #333;">
        ${preview.replace(/\n/g, "<br>")}
      </blockquote>
      ${opts.email ? `<div style="margin-top: 20px;"><a href="mailto:${opts.email}?subject=Re: Your question for Tony" style="display: inline-block; padding: 10px 20px; background: #6A5ACD; color: #fff; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.08em;">REPLY TO ${opts.name.toUpperCase()} →</a></div>` : ""}
      <p style="margin-top: 24px; font-size: 11px; color: #aaa; font-family: monospace;">tonygreenberg.com · direct question alert</p>
    </div>
  `;
  return sendOwnerEmail(subject, html, text);
}
