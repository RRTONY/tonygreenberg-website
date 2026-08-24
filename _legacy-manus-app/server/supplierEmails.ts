/**
 * Automated supplier intake emails — 3 templates
 * All fired server-side from routers.ts via sendSupplierEmail().
 *
 * Template 1: Stage 1 submission confirmation  → fires on submitStage1
 * Template 2: Stage 2 invite                   → fires on activateStage2
 * Template 3: Stage 2 completion confirmation  → fires on submitStage2
 *
 * Delivery: uses the Manus notifyOwner channel for owner alerts;
 * supplier-facing emails are sent via the Google Apps Script (which
 * has the Gmail/SendGrid credentials). We POST the email payload to
 * the same Apps Script URL used for form submissions.
 */

import { ENV } from "./_core/env";

/** Stage 1 review turnaround (18-field screen) — confirm with Rob before going live */
export const STAGE1_TURNAROUND_BUSINESS_DAYS = 3;
/** Stage 2 review turnaround (42-field deep-dive + documents) — confirm with Rob before going live */
export const STAGE2_TURNAROUND_BUSINESS_DAYS = 5;

/* ─── Types ─── */
export type EmailTemplate = "stage1_confirmation" | "stage2_invite" | "stage2_completion";

interface EmailPayload {
  to: string;
  contactName: string;
  legalEntityName: string;
  supplierId: string;
  stage2Url?: string; // only for stage2_invite
}

/* ─── HTML shell ─── */
function htmlShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #0A0A10; font-family: Georgia, 'Times New Roman', serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .logo-bar { border-bottom: 1px solid #2a2a38; padding-bottom: 20px; margin-bottom: 32px; }
    .logo-text { font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.2em; color: #D4B96A; text-transform: uppercase; }
    h1 { font-size: 26px; color: #F5F5F0; margin: 0 0 16px; font-weight: normal; line-height: 1.3; }
    p { font-size: 15px; color: #A0A0B0; line-height: 1.7; margin: 0 0 16px; }
    .highlight { color: #D4B96A; }
    .cta-btn {
      display: inline-block; margin: 24px 0; padding: 14px 32px;
      background: #D4B96A; color: #0A0A10; font-family: 'Courier New', monospace;
      font-size: 12px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase;
      text-decoration: none; border-radius: 4px;
    }
    .ref-box {
      background: #111118; border: 1px solid #2a2a38; border-radius: 6px;
      padding: 14px 18px; margin: 20px 0;
    }
    .ref-label { font-family: 'Courier New', monospace; font-size: 10px; color: #555568; text-transform: uppercase; letter-spacing: 0.15em; }
    .ref-value { font-family: 'Courier New', monospace; font-size: 13px; color: #D4B96A; margin-top: 4px; }
    .divider { border: none; border-top: 1px solid #1e1e2a; margin: 28px 0; }
    .footer { font-family: 'Courier New', monospace; font-size: 10px; color: #3a3a50; line-height: 1.6; }
    .footer a { color: #555568; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo-bar">
      <span class="logo-text">Tony Greenberg — Supplier Network</span>
    </div>
    ${bodyHtml}
    <hr class="divider" />
    <div class="footer">
      <p style="margin:0;">Tony Greenberg · <a href="https://tonygreenberg.com">tonygreenberg.com</a></p>
      <p style="margin:4px 0 0;">You are receiving this email because you submitted a supplier application. This is an automated message — please do not reply directly.</p>
    </div>
  </div>
</body>
</html>`;
}

/* ─── Template builders ─── */

function buildStage1Confirmation(p: EmailPayload): { subject: string; html: string; text: string } {
  const subject = `Supplier Application Received — ${p.legalEntityName}`;

  const html = htmlShell(
    subject,
    `<h1>Application Received</h1>
    <p>Hi ${p.contactName},</p>
    <p>
      We've received the Stage 1 supplier application for
      <span class="highlight">${p.legalEntityName}</span>.
      Every submission is reviewed personally — we don't run this through a filter farm.
    </p>
    <p>
      If we decide to move forward, you'll receive a private link to complete the full
      supplier profile (Stage 2). That link is unique to your application and expires
      after 90 days.
    </p>
    <p>
      Expect to hear back within
      <span class="highlight">${STAGE1_TURNAROUND_BUSINESS_DAYS} business days</span>
    </p>
    <div class="ref-box">
      <div class="ref-label">Your Reference ID</div>
      <div class="ref-value">${p.supplierId}</div>
    </div>
    <p style="color:#555568; font-size:13px;">Keep this ID — you'll need it if you contact us about your application.</p>`
  );

  const text = `Application Received — ${p.legalEntityName}

Hi ${p.contactName},

We've received the Stage 1 supplier application for ${p.legalEntityName}. Every submission is reviewed personally.

If we decide to move forward, you'll receive a private link to complete the full supplier profile (Stage 2). That link is unique to your application and expires after 90 days.

Expect to hear back within ${STAGE1_TURNAROUND_BUSINESS_DAYS} business days if there's a fit.

Your Reference ID: ${p.supplierId}

Keep this ID — you'll need it if you contact us about your application.

—
Tony Greenberg · tonygreenberg.com
This is an automated message. Please do not reply directly.`;

  return { subject, html, text };
}

function buildStage2Invite(p: EmailPayload): { subject: string; html: string; text: string } {
  const subject = `You're Invited to Complete Your Supplier Profile — ${p.legalEntityName}`;
  const stage2Url = p.stage2Url ?? "";

  const html = htmlShell(
    subject,
    `<h1>You're In — Complete Your Profile</h1>
    <p>Hi ${p.contactName},</p>
    <p>
      After reviewing your Stage 1 application for
      <span class="highlight">${p.legalEntityName}</span>,
      we'd like to learn more. Please complete the full supplier profile using
      the private link below.
    </p>
    <p>
      The form is a multi-step wizard — you can save your progress and return at any time.
      The link is unique to your application and valid for <span class="highlight">90 days</span>.
    </p>
    <a href="${stage2Url}" class="cta-btn">Complete Supplier Profile →</a>
    <p style="font-size:13px; color:#555568;">
      Or copy this URL: <span style="color:#D4B96A;">${stage2Url}</span>
    </p>
    <div class="ref-box">
      <div class="ref-label">Reference ID</div>
      <div class="ref-value">${p.supplierId}</div>
    </div>
    <p>
      If you have questions before completing the form, reply to this email or reach out
      directly via <a href="https://tonygreenberg.com" style="color:#D4B96A;">tonygreenberg.com</a>.
    </p>`
  );

  const text = `You're Invited to Complete Your Supplier Profile — ${p.legalEntityName}

Hi ${p.contactName},

After reviewing your Stage 1 application for ${p.legalEntityName}, we'd like to learn more.

Please complete the full supplier profile using the private link below. The form is a multi-step wizard — you can save your progress and return at any time. The link is valid for 90 days.

Complete your profile: ${stage2Url}

Reference ID: ${p.supplierId}

If you have questions, reach out via tonygreenberg.com.

—
Tony Greenberg · tonygreenberg.com
This is an automated message. Please do not reply directly.`;

  return { subject, html, text };
}

function buildStage2Completion(p: EmailPayload): { subject: string; html: string; text: string } {
  const subject = `Full Profile Received — ${p.legalEntityName}`;

  const html = htmlShell(
    subject,
    `<h1>Profile Complete — Thank You</h1>
    <p>Hi ${p.contactName},</p>
    <p>
      We've received the complete supplier profile for
      <span class="highlight">${p.legalEntityName}</span>.
      This is the final step in the intake process.
    </p>
    <p>
      Our team will review your full submission and reach out directly
      within <span class="highlight">${STAGE2_TURNAROUND_BUSINESS_DAYS} business days</span>
      to discuss next steps.
    </p>
    <div class="ref-box">
      <div class="ref-label">Reference ID</div>
      <div class="ref-value">${p.supplierId}</div>
    </div>
    <p style="color:#555568; font-size:13px;">
      If you need to update any information before we reach out, reply to this email
      with your reference ID.
    </p>`
  );

  const text = `Full Profile Received — ${p.legalEntityName}

Hi ${p.contactName},

We've received the complete supplier profile for ${p.legalEntityName}. This is the final step in the intake process.

Our team will review your full submission and reach out directly within ${STAGE2_TURNAROUND_BUSINESS_DAYS} business days to discuss next steps.

Reference ID: ${p.supplierId}

If you need to update any information before we reach out, reply to this email with your reference ID.

—
Tony Greenberg · tonygreenberg.com
This is an automated message. Please do not reply directly.`;

  return { subject, html, text };
}

/* ─── Dispatcher ─── */

export async function sendSupplierEmail(
  template: EmailTemplate,
  payload: EmailPayload
): Promise<void> {
  const gasUrl = ENV.googleAppsScriptUrl;
  if (!gasUrl) {
    console.warn("[supplierEmails] GOOGLE_APPS_SCRIPT_URL not set — skipping email send");
    return;
  }

  let emailData: { subject: string; html: string; text: string };
  switch (template) {
    case "stage1_confirmation":
      emailData = buildStage1Confirmation(payload);
      break;
    case "stage2_invite":
      emailData = buildStage2Invite(payload);
      break;
    case "stage2_completion":
      emailData = buildStage2Completion(payload);
      break;
  }

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendEmail",
        to: payload.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        supplierId: payload.supplierId,
      }),
    });
    if (!res.ok) {
      console.error(`[supplierEmails] Apps Script email send failed: ${res.status}`);
    }
  } catch (err) {
    console.error("[supplierEmails] Failed to send supplier email:", err);
  }
}
