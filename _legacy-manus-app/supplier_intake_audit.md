# Supplier Intake Audit — Diffs from Canonical Spec (pasted_content_2.txt, 2026-07-15)

## Stage 1 Diffs

### 1. facility_type options — WRONG (4 options, need 5)
Current: "Own Manufacturing", "Contract Manufacturer (CMO)", "White Label", "Hybrid"
Spec:    "Own Manufacturing", "Contract Manufacturer (CMO)", "Hybrid (Own + CMO)", "White Label", "Private Label"

### 2. Website validation — TOO STRICT
Current: requires https:// protocol prefix
Spec:    lenient regex — accepts bare domains ("example.com") as well as full URLs

---

## Stage 2 Diffs

### 1. shipping_jurisdictions — WRONG TYPE
Current: Select dropdown with hardcoded options (US only / US + Canada / US + EU / North America / Global / Other)
Spec:    textarea — suppliers list multiple jurisdictions freely

### 2. full_price_list_catalog — WRONG TYPE
Current: textarea (paste text)
Spec:    multi-file upload (native <input type="file" multiple>, accumulating files, not replacing)

### 3. pricing_for_top_compounds — WRONG TYPE
Current: textarea
Spec:    repeatable row group (compound / unit size / price per unit / MOQ tier, 1-5 rows, at least 1 required)

### 4. coa_lot_batch_specific options — WRONG
Current: "Yes — lot-specific COA", "Generic COA only", "No COA available"
Spec:    "Yes", "No"

### 5. coa_publicly_viewable options — WRONG
Current: "Yes", "On request only", "No"
Spec:    "Yes", "No"

### 6. stability_testing_program options — WRONG
Current: "ICH-compliant stability program", "Accelerated stability testing", "Basic shelf-life testing", "None"
Spec:    "ICH guidelines", "Accelerated only", "Real-time only", "None"

### 7. payment_terms options — WRONG
Current: "Net 30", "Net 60", "Net 90", "Prepayment required", "50% deposit / 50% on delivery", "Custom"
Spec:    "Net 30", "Net 60", "50% upfront", "50% on delivery", "100% upfront", "Other"

### 8. fda_inspection_outcome options — WRONG
Current: "No Action Indicated (NAI)", "Voluntary Action Indicated (VAI)", "Official Action Indicated (OAI)", "Warning Letter issued", "Not yet inspected"
Spec:    "NAI", "VAI", "OAI", "Never Inspected"

---

## Emails — ALL MISSING (3 to add)

### Shared constant
SUPPLIER_TURNAROUND_BUSINESS_DAYS = 3
Referenced in Email 1 and Email 3 subject/body.

### Email 1 — Stage 1 Submission Confirmation
Trigger: fires immediately on submitStage1
Recipient: supplier's email from form
Subject: "Confirmation of Your Supplier Application to RampRate"
Body (plain text):
  Dear {{contactName}},
  Thank you for submitting your supplier application to RampRate on behalf of {{legalEntityName}}.
  We've received your submission and our team will review it shortly. We will be in touch within [X business days] with next steps.
  If you have any questions in the meantime, feel free to reply directly to this email.
  Thank you again for your interest in partnering with RampRate.
  Best regards,
  The RampRate Team

HTML: branded shell — dark #0a0f1a header with gold #d4a843 wordmark, white card body, warm #f5f0e8 footer
Escape supplier-submitted text (contactName, legalEntityName) before interpolating into HTML.
Inline CSS only (no <style> blocks).

### Email 2 — Stage 2 Invite
Trigger: fires when activateStage2 is called (admin approves)
Recipient: supplier's email from Stage 1 record
Subject: "You're Moving Forward — Next Steps for Your RampRate Supplier Application"
Body (plain text):
  Dear {{contactName}},
  Thank you for your patience while we reviewed your application on behalf of {{legalEntityName}}.
  We're pleased to let you know that we'd like to move forward with your application. Based on what you've shared so far, we see a strong potential fit between {{legalEntityName}} and the RampRate supplier network, and we're excited about the possibility of working together.
  To continue, we'll need a bit more detail to finalize onboarding — covering manufacturing, quality, commercial terms, and compliance documentation. This should take about 15–20 minutes, and your progress is saved automatically as you go, so you're welcome to complete it in more than one sitting.
  Complete Your Supplier Onboarding → {{stage2Link}}
  If you have any questions along the way, or need more time to gather documentation, just reply to this email — we're happy to help.
  We look forward to taking the next step with {{legalEntityName}}.
  Best regards,
  The RampRate Team

HTML: same branded shell. Stage 2 link renders as solid gold button (no raw URL visible in HTML).
stage2Link = stage2UrlBase + token (already stored on the record).

### Email 3 — Stage 2 Completion Confirmation
Trigger: fires immediately on submitStage2 (final submit)
Recipient: supplier's email from Stage 1 record (Stage 2 never collects email)
Subject: "Thank You for Completing Your RampRate Supplier Onboarding"
Body (plain text):
  Dear {{contactName}},
  Thank you for completing the onboarding details for {{legalEntityName}}. We've received your submission, including all supporting documentation.
  Our team will now conduct a final review of the information provided. We will be in touch within [X business days] regarding next steps.
  If we need any clarification or additional documentation in the meantime, we'll reach out directly. Should you have any questions, feel free to reply to this email.
  Thank you again for the time and effort you've put into this process — we look forward to being in touch soon.
  Best regards,
  The RampRate Team

HTML: same branded shell.

### HTML Design Rules
- Dark #0a0f1a header with gold #d4a843 wordmark
- White card body
- Warm #f5f0e8 footer
- Inline CSS only (no <style> blocks, email clients strip them)
- Escape supplier-submitted text (contactName, legalEntityName) with escapeHtml() before interpolating
- Email 2's CTA is a solid gold button, not a pasted link

### Implementation Notes
- All three are fire-and-forget — wrap in try/catch, never block form write
- Email 1 and 3: pull contactName, legalEntityName, email from Stage 1 record
- Stage 2 never collects email — read it from the existing record

---

## Scoring Engine — ALREADY CORRECT
Current ceiling: 59 points. Grade bands: Index-leading / Qualified / Conditional / Not currently matched.
No changes needed.

---

## Backend Schema Changes Needed
- pricing_for_top_compounds: change from text to JSON (array of row objects) OR keep as text and serialize
  Recommendation: keep as text (JSON.stringify the rows array) for simplicity
- full_price_list_catalog: change from text to text (comma-separated URLs from multi-file upload)
  Backend already handles file uploads via UploadField — just need to allow multiple files and concatenate URLs

## Router Changes Needed
- coa_lot_batch_specific enum: update to ["Yes", "No"]
- coa_publicly_viewable enum: update to ["Yes", "No"]
- stability_testing_program enum: update to ["ICH guidelines", "Accelerated only", "Real-time only", "None"]
- payment_terms enum: update to ["Net 30", "Net 60", "50% upfront", "50% on delivery", "100% upfront", "Other"]
- fda_inspection_outcome enum: update to ["NAI", "VAI", "OAI", "Never Inspected"]
- Add email sending to submitStage1, activateStage2, submitStage2
