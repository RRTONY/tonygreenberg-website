# Supplier Intake Handoff Notes — July 2026

## Source Documents
- `pasted_content.txt` — Backend Apps Script handoff from Chitraket
- `Stage2SupplierIntakeFormPlan.pdf` — Stage 2 form plan (4 steps, 42 fields)

---

## Key Decisions from pasted_content.txt

### 1. Shared Apps Script Architecture
- ramprate.com and tonygreenberg.com BOTH post to the SAME Apps Script `/exec` URL
- If they share the same deployment: **no code change needed** — Chitraket's redeploy handles everything
- If tonygreenberg.com has its OWN copy: replicate the changes (SHEET_ID / DRIVE_FOLDER_ID at top)

### 2. What the Updated Script Adds (automatically, no frontend change needed)
- Sequential Supplier ID: `SUP-2026-0001` (scoped per Sheet tab)
- Source Site column: auto-derived from `projectName` param (tonygreenberg or ramprate)
- Stage column: `Stage 1 Submitted` → `Approved for Stage 2` / `Rejected` → `Stage 2 Complete`
- Automatic personalized email to supplier when Stage flipped to `Approved for Stage 2`
- Automatic scoring on every submission (replaces separate score_suppliers.py manual workflow)
- Score columns: Total Score / Band / Achievable Max / Is Partial

### 3. Scoring Model in the Apps Script (CANONICAL — overrides our local scoring_rules.json)
Max Stage 1 score: 54 points (NOT 45 or 50 as previously implemented)
Max full score (Stage 1 + Stage 2 bonus): 59 points

Field points:
- chain_of_custody_capability: 10 pts
- pricing_model: 10 pts
- standard_lead_time: 7 pts
- minimum_order_quantity: 7 pts
- independent_testing_willingness: 5 pts
- facility_classification: 5 pts
- product_labeling_sale_restrictions: 5 pts
- recall_capa_history: 5 pts
- testing_protocols (mass-spec keyword bonus): 5 pts (Stage 2)

Band thresholds (% of achievableMax):
- Index-leading: >= 85%
- Qualified: >= 65%
- Conditional: >= 40%
- Not currently matched: < 40%

Scoring rules (CANONICAL option values):
```
chain_of_custody_capability:
  'Currently live': 10
  'Can implement on request': 6
  'Not currently capable': 0

pricing_model:
  'Tiered Volume Pricing': 10
  'Annual Contract': 8
  'Per Unit': 6
  'Custom-Negotiable': 4

standard_lead_time:
  'Under 2 weeks': 7
  '2–4 weeks': 5
  '4–8 weeks': 3
  '8+ weeks': 1

minimum_order_quantity:
  'No minimum': 7
  'Small (under $5K)': 5
  'Moderate ($5K–$25K)': 3
  'Large ($25K+)': 1

independent_testing_willingness:
  'Yes, ongoing': 5
  'Yes, one-time per new listing': 3
  'No': 0

facility_classification:
  'FDA Registered': 5
  'cGMP Certified': 5
  'ISO 13485/9001': 4
  '503B': 4
  '503A': 3
  'Other': 1

product_labeling_sale_restrictions:
  'Compounded Pharmacy': 5
  'Both, depending on product': 4
  'Research-Use-Only': 3

recall_capa_history:
  'No recalls or CAPAs': 5
  'Minor CAPAs resolved': 3
  'Active CAPA in progress': 1
  'Recall history (disclose)': 0
```

### 4. CRITICAL: stage2UrlBase requirement
- tonygreenberg.com Stage 1 proxy route MUST send `stage2UrlBase: 'https://tonygreenberg.com/supplier-intake-long/'`
- Without this, auto-email will send suppliers a ramprate.com link instead of tonygreenberg.com link

### 5. HOLD: Stage 2 form restructuring
- **DO NOT implement the "4 steps, 42 fields" plan from the PDF yet**
- The plan doc's per-step field counts don't add up internally (one step says "7 fields" but lists 6; another says "13" but lists 14)
- Current live structure (6 steps, 41 fields) stays as-is until Rob/Tony confirm the actual intended field list
- The PDF is provided for reference only

---

## Stage 2 Form Plan PDF — For Reference Only (ON HOLD)

### Structure: 4 steps, 42 fields (HOLD — DO NOT IMPLEMENT YET)

Step 1 — Company & Ownership Detail (6 fields, header says 7):
1. DBA / Trade Name
2. Year Founded
3. Headquarters Address
4. Manufacturing Facility Address
5. Title / Role
6. Principals / Founders (consolidated — replaces separate Ownership Structure field)

Step 2 — Manufacturing & Quality (14 fields, header says 13):
7. Peptide Synthesis Method
8. Purity Levels Achieved
9. Sterile Fill Capability
10. Cold Chain / Storage Capabilities
11. Quality Management System
12. Third-Party Testing
13. Testing Lab Name
14. COA Lot/Batch-Specific
15. COA Publicly Viewable Before Purchase
16. COA Public Link
17. Identity Confirmation Method
18. Testing Protocols
19. Stability Testing Program
20. Batch Documentation

Step 3 — Commercial & Regulatory (15 fields):
21. Payment Terms
22. Existing Distribution Channels
23. References
24. Pricing for Top Compounds
25. Full Price List / Catalog
26. FDA Registration Number
27. DEA Registration
28. State Licenses
29. Buyer Eligibility
30. Shipping Jurisdictions
31. Last FDA Inspection Date
32. FDA Inspection Outcome
33. Manufacturing Certifications
34. Warning Letters / Regulatory Disclosure
35. Insurance Coverage

Step 4 — Documents (6 fields):
36. Certificate of Analysis (COA)
37. cGMP / Quality Certification
38. FDA Registration Documentation
39. Certificate of Insurance
40. Sample SOP Document
41. Additional Documentation

Note: Field count discrepancy — header says 42 but only 41 are listed. Step 2 header says 13 but lists 14. Step 1 header says 7 but lists 6. This is why the restructure is on hold.

---

## Action Items for tonygreenberg.com

### MUST DO (required for shared-script compatibility):
1. Verify/fix: Does the Stage 1 form send `stage2UrlBase: 'https://tonygreenberg.com/supplier-intake-long/'`?
2. Verify/fix: Does the Stage 1 form send `projectName: 'tonygreenberg'` (or similar) so Source Site is auto-derived correctly?
3. Verify/fix: Does the Stage 1 form send `formStage: 'stage1-supplier-intake'`?
4. Verify/fix: Does the Stage 2 form send `formStage: 'stage2-supplier-intake'` and `supplierToken`?
5. Verify/fix: Are the scoring field option labels EXACTLY matching the canonical scoring rules above?
   - Key change: `standard_lead_time` and `minimum_order_quantity` are now DROPDOWNS (not free text)
   - New option values differ from what we previously had

### DO NOT DO (on hold):
- Do NOT restructure Stage 2 into 4 steps
- Do NOT change Stage 2 field count or order
- Do NOT implement the PDF plan as-is
