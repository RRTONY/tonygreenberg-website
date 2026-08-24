/**
 * Inbound Email Webhook for SpamArrest
 *
 * Accepts forwarded spam emails via Mailgun Inbound Routing (or SendGrid Inbound Parse).
 * When someone forwards a spam email to spam@tonygreenberg.com, the email provider
 * POSTs the parsed email here, and we auto-process it through the SpamArrest pipeline.
 *
 * Supported providers:
 *   - Mailgun Inbound Routes (multipart/form-data)
 *   - SendGrid Inbound Parse (multipart/form-data)
 *   - Manual JSON POST (for testing / custom integrations)
 *
 * Flow:
 *   1. Email forwarded to spam@tonygreenberg.com
 *   2. Mailgun/SendGrid parses it and POSTs to /api/spam-inbound
 *   3. We extract sender, subject, company, domain
 *   4. We call saveSpamForward() and submitSpamReport()
 *   5. We notify the owner
 *   6. The generated "You've Been Reported" URL is stored
 */
import type { Express, Request, Response } from "express";
import multer from "multer";
import { saveSpamForward, submitSpamReport } from "./db";
import { notifyOwner } from "./_core/notification";

// multer().any() handles multipart/form-data from Mailgun/SendGrid
// .any() is used instead of .none() because real spam emails have attachments
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

interface ParsedEmail {
  from: string;
  subject: string;
  body?: string;
  forwardedBy?: string;
}

/**
 * Extract company name and domain from an email address.
 */
function extractFromEmail(emailStr: string): { email: string; domain: string; company: string } {
  // Parse "Name <email@domain.com>" or just "email@domain.com"
  const emailMatch = emailStr.match(/<([^>]+)>/) || emailStr.match(/([^\s<]+@[^\s>]+)/);
  const email = emailMatch ? emailMatch[1] : emailStr.trim();
  const domain = email.split("@")[1] || "";
  // Derive company from domain (strip TLD, capitalize)
  const domainParts = domain.split(".");
  const company = domainParts.length > 1
    ? domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1)
    : domain;
  return { email, domain, company };
}

/**
 * Parse the "From" header of the ORIGINAL spam email from a forwarded message.
 * When someone forwards spam, the forwarded-from is in the body or headers.
 */
function parseForwardedFrom(body: string): { originalFrom: string; originalSubject: string } | null {
  // Common forward patterns:
  // "From: spammer@company.com"
  // "---------- Forwarded message ----------"
  // "From: John Smith <john@spam.co>"
  const fromMatch = body.match(/(?:From|De|Von|Da):\s*(.+?)(?:\n|$)/i);
  const subjectMatch = body.match(/(?:Subject|Sujet|Betreff|Oggetto):\s*(.+?)(?:\n|$)/i);
  if (fromMatch) {
    return {
      originalFrom: fromMatch[1].trim(),
      originalSubject: subjectMatch ? subjectMatch[1].trim() : "",
    };
  }
  return null;
}

/**
 * Process an inbound email and run it through the SpamArrest pipeline.
 */
async function processInboundEmail(parsed: ParsedEmail): Promise<{
  success: boolean;
  id?: number;
  generatedUrl?: string;
  company?: string;
  domain?: string;
  error?: string;
}> {
  try {
    // Try to extract the ORIGINAL spammer from forwarded content
    const forwarded = parsed.body ? parseForwardedFrom(parsed.body) : null;
    const spamFrom = forwarded?.originalFrom || parsed.from;
    const spamSubject = forwarded?.originalSubject || parsed.subject;

    const { email, domain, company } = extractFromEmail(spamFrom);

    // Build the personalized "You've Been Reported" URL
    const params = new URLSearchParams();
    if (company) params.set("company", company);
    if (domain) params.set("domain", domain);
    if (email) params.set("email", email);
    const generatedUrl = `/youve-been-reported${params.toString() ? `?${params.toString()}` : ""}`;

    // Save to database
    const result = await saveSpamForward({
      rawSubject: spamSubject,
      rawFrom: spamFrom,
      extractedCompany: company,
      extractedDomain: domain,
      extractedEmail: email,
      generatedUrl,
      forwardedBy: parsed.forwardedBy || parsed.from,
    });

    // Auto-submit spam report
    if (company && email) {
      await submitSpamReport({
        companyName: company,
        senderEmail: email,
        spamType: "cold-outreach",
        frequency: "one-time",
        description: `Auto-processed from inbound email webhook. Subject: ${spamSubject || "N/A"}. From: ${spamFrom || "N/A"}`,
      }).catch(() => {});
    }

    // Notify owner
    await notifyOwner({
      title: `📧 Spam Inbound Processed: ${company || domain || "Unknown"}`,
      content: `From: ${spamFrom}\nSubject: ${spamSubject}\nCompany: ${company}\nDomain: ${domain}\nEmail: ${email}\n\nGenerated URL: https://tonygreenberg.com${generatedUrl}\n\nForwarded by: ${parsed.forwardedBy || parsed.from}`,
    }).catch(() => {});

    return { success: true, id: result.id, generatedUrl, company, domain };
  } catch (err: any) {
    console.error("[Spam Inbound] Processing error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Register the inbound email webhook route.
 * MUST be called after express.urlencoded() is configured.
 */
export function registerSpamInboundWebhook(app: Express) {
  // Mailgun sends multipart/form-data or application/x-www-form-urlencoded
  // SendGrid sends multipart/form-data
  // We also accept JSON for testing
  app.post("/api/spam-inbound", upload.any(), async (req: Request, res: Response) => {
    try {
      let parsed: ParsedEmail;

      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        // JSON POST (manual/testing)
        parsed = {
          from: req.body.from || req.body.sender || "",
          subject: req.body.subject || "",
          body: req.body.body || req.body["body-plain"] || req.body.text || "",
          forwardedBy: req.body.forwardedBy || req.body.recipient || "",
        };
      } else {
        // Mailgun / SendGrid form-data (parsed by express.urlencoded or multer)
        parsed = {
          from: req.body.from || req.body.sender || "",
          subject: req.body.subject || "",
          body: req.body["body-plain"] || req.body.text || req.body["stripped-text"] || "",
          forwardedBy: req.body.recipient || req.body.to || "",
        };
      }

      if (!parsed.from && !parsed.subject && !parsed.body) {
        res.status(400).json({ error: "No email data found in request" });
        return;
      }

      console.log(`[Spam Inbound] Received email from: ${parsed.from}, subject: ${parsed.subject}`);

      const result = await processInboundEmail(parsed);

      if (result.success) {
        res.status(200).json({
          message: "Spam processed successfully",
          id: result.id,
          generatedUrl: result.generatedUrl,
          company: result.company,
          domain: result.domain,
        });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (err: any) {
      console.error("[Spam Inbound] Webhook error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check endpoint for Mailgun/SendGrid verification
  app.get("/api/spam-inbound", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "active",
      message: "SpamArrest inbound email webhook is operational",
      accepts: ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"],
      instructions: "Forward spam emails to spam@tonygreenberg.com or POST directly to this endpoint",
    });
  });
}
