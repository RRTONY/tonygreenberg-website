# Mailgun Inbound Routing Setup for SpamArrest

**For:** Darryl (webmaster) and Kim (admin)
**Purpose:** Connect `spam@tonygreenberg.com` to the SpamArrest auto-processing webhook
**Time required:** 10-15 minutes (one-time setup)
**Cost:** Free (Mailgun free tier handles up to 100 emails/day)

---

## How It Works

Once configured, the flow is:

1. Kim (or anyone on the team) **forwards a spam email** to `spam@tonygreenberg.com`
2. Mailgun receives it and **POSTs the parsed email** to `https://tonygreenberg.com/api/spam-inbound`
3. The webhook **automatically extracts** the original spammer's email, company, and domain
4. It **generates a personalized "You've Been Reported" URL** and saves it to the database
5. Tony gets a **notification** with the details
6. Kim can view all processed spam in the **Admin Spam Tracking** dashboard

No manual data entry. No copy-pasting. Just forward and forget.

---

## Step 1: Create a Mailgun Account

1. Go to [https://signup.mailgun.com/new/signup](https://signup.mailgun.com/new/signup)
2. Sign up with an email (use a team email, not personal)
3. You do **not** need to enter a credit card for the free tier (100 emails/day)
4. Verify your email address

---

## Step 2: Add and Verify the Domain

1. In Mailgun dashboard, go to **Sending → Domains**
2. Click **"Add New Domain"**
3. Enter: `tonygreenberg.com`
4. Mailgun will give you DNS records to add. You need:

| Record Type | Name | Value | Purpose |
|-------------|------|-------|---------|
| **MX** | `tonygreenberg.com` | `mxa.mailgun.org` (priority 10) | Receives email |
| **MX** | `tonygreenberg.com` | `mxb.mailgun.org` (priority 10) | Backup receiver |
| **TXT** | `tonygreenberg.com` | `v=spf1 include:mailgun.org ~all` | SPF verification |

**Important:** If tonygreenberg.com already has MX records (e.g., for Google Workspace), you have two options:

**Option A (Recommended): Use a subdomain instead**
- Add `spam.tonygreenberg.com` as the domain in Mailgun
- Set MX records only on the subdomain
- The forwarding address becomes `report@spam.tonygreenberg.com`
- This avoids disrupting existing email

**Option B: Use Mailgun Routes with existing MX**
- If you already use Mailgun for sending, just add a Route (skip to Step 3)
- If you use Google Workspace, you can set up a forwarding rule in Gmail to forward to a Mailgun-managed address

---

## Step 3: Create an Inbound Route

This is the key step that connects incoming email to our webhook.

1. In Mailgun dashboard, go to **Receiving → Routes**
2. Click **"Create Route"**
3. Configure:

| Field | Value |
|-------|-------|
| **Expression Type** | Match Recipient |
| **Recipient** | `spam@tonygreenberg.com` (or `report@spam.tonygreenberg.com` if using subdomain) |
| **Action: Forward** | `https://tonygreenberg.com/api/spam-inbound` |
| **Action: Store** | Check this box (keeps a copy in Mailgun for debugging) |
| **Priority** | 0 (highest) |
| **Description** | SpamArrest auto-processor |

4. Click **"Create Route"**

---

## Step 4: Test It

### Quick Test (No Email Required)

Run this from any terminal to verify the webhook is working:

```bash
curl -X POST https://tonygreenberg.com/api/spam-inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test-spammer@fake-company.io",
    "subject": "URGENT: Partnership Opportunity",
    "body": "Hi Tony, I wanted to reach out about...",
    "forwardedBy": "kim@tonygreenberg.com"
  }'
```

You should get back:
```json
{
  "message": "Spam processed successfully",
  "id": 12345,
  "generatedUrl": "/youve-been-reported?company=Fake-company&domain=fake-company.io&email=test-spammer%40fake-company.io",
  "company": "Fake-company",
  "domain": "fake-company.io"
}
```

### Full Email Test

1. Forward any spam email to `spam@tonygreenberg.com`
2. Wait 30 seconds
3. Check the Admin Spam Tracking dashboard at `tonygreenberg.com/admin/spam-tracking`
4. You should see the new entry with the spammer's details extracted

---

## Step 5: Verify the Health Check

Visit this URL in your browser to confirm the endpoint is live:

```
https://tonygreenberg.com/api/spam-inbound
```

It should return:
```json
{
  "status": "active",
  "message": "SpamArrest inbound email webhook is operational",
  "accepts": ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"],
  "instructions": "Forward spam emails to spam@tonygreenberg.com or POST directly to this endpoint"
}
```

---

## Daily Operations (For Kim)

Once set up, Kim's workflow is simple:

1. **See spam in the inbox?** Forward it to `spam@tonygreenberg.com`
2. **That's it.** The system handles everything else automatically:
   - Extracts the spammer's company, domain, and email
   - Creates a personalized "You've Been Reported" confrontation page
   - Logs it in the admin dashboard
   - Notifies Tony
3. **To send the confrontation link:** Go to Admin → Spam Tracking, find the entry, copy the generated URL
4. **To check status:** Visit `tonygreenberg.com/admin/spam-tracking`

---

## Alternative: Manual JSON POST (No Mailgun)

If you don't want to set up Mailgun, Kim can also manually POST spam data using the Admin UI's existing "SpamToast Link Generator" at `/admin/spam-link`. The Mailgun setup just automates what Kim already does manually.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not arriving at webhook | Check Mailgun → Logs for delivery status. Verify MX records propagated (use `dig MX tonygreenberg.com`). |
| Webhook returns 500 | Check server logs. The spammer's email might be malformed. |
| "No email data found" error | The forwarded email body is empty. Try forwarding as attachment instead of inline. |
| Duplicate entries | Normal if the same spam is forwarded twice. The system deduplicates by generated URL. |
| Mailgun shows "unverified domain" | DNS records haven't propagated yet. Wait 24-48 hours. Use "Check DNS Records Now" in Mailgun. |

---

## Security Notes

- The `/api/spam-inbound` endpoint accepts POST from any source (no auth required) because Mailgun doesn't support custom auth headers on routes
- Rate limiting is applied (300 req/min per IP) to prevent abuse
- No sensitive data is stored — only the spammer's public email/company/domain
- The webhook does not execute any code from the email body — it only extracts text metadata

---

*Last updated: May 27, 2026*
*Webhook endpoint: `https://tonygreenberg.com/api/spam-inbound`*
*Health check: `GET https://tonygreenberg.com/api/spam-inbound`*
