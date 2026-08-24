# Unified Vendor Intake Form Spec — Reference

Source: unified_two_stage_form_spec.pdf (updated)
Goal: both tonygreenberg.com and ramprate.com run the EXACT same 2-stage form.

---

## Part A — Source Tracking

Add one hidden/auto-populated field per site:
- Field name: `source_site`
- Type: hidden, auto-set
- Values: `tonygreenberg` or `ramprate`
- Purpose: clean filterable tag for downstream reports

---

## Part B — Stage 1 (18 fields, identical on both sites)

| # | Field | Type | Options | Required |
|---|-------|------|---------|----------|
| 1 | Legal Entity Name | text | — | Yes |
| 2 | State / Country of Incorporation | text | — | Yes |
| 3 | Website | text | — | No |
| 4 | Primary Contact Name | text | — | Yes |
| 5 | Email | text | — | Yes |
| 6 | Phone | text | — | No |
| 7 | Current Peptide Products | textarea | — | Yes |
| 8 | Facility Type | select | Own Manufacturing / Contract Manufacturer (CMO) / White Label / Hybrid | Yes |
| 9 | Number of Employees | select | 1–10 / 11–50 / 51–200 / 201+ (standardized as dropdown) | Yes |
| 10 | Monthly Production Capacity | text | — | No |
| 11 | Facility Classification | select | FDA Registered / cGMP Certified / ISO 13485/9001 / 503B / 503A / Other | Yes |
| 12 | Chain-of-Custody Capability | select | Currently live / Can implement on request / Not currently capable | Yes |
| 13 | Pricing Model | select | Per Unit / Tiered Volume Pricing / Annual Contract / Custom-Negotiable | Yes |
| 14 | Standard Lead Time | text | — | Yes |
| 15 | Minimum Order Quantity (MOQ) | text | — | Yes |
| 16 | Independent Testing Willingness | select | Yes, ongoing / Yes, one-time per new listing / No | Yes |
| 17 | Product Labeling & Sale Restrictions | select | Research-Use-Only / Compounded Pharmacy / Both, depending on product | Yes |
| 18 | Recall / CAPA History | select | No recalls or CAPAs / Minor CAPAs resolved / Active CAPA in progress / Recall history (disclose) | Yes |

Structure: 3 steps of 6 fields each (per stage1_form_structure_design.md)

---

## Part C — Stage 2 (42 fields, identical on both sites)

Everything not in Stage 1, plus one field promoted from ramprate.com (COA Public Link).
Grouped by section, matching the existing 6-tab pattern.
Required-field standard: use tonygreenberg.com's stricter pattern (11/11 Quality Assurance fields required).

### Company Information (remaining)
1. DBA/Trade Name
2. Year Founded
3. Headquarters Address
4. Manufacturing Facility Address
5. Ownership Structure
6. Title/Role
7. Principals/Founders *(consolidate Ownership Structure + Principals/Founders into one field — they overlap)*

### Manufacturing & Capabilities (remaining)
8. Peptide Synthesis Method
9. Purity Levels Achieved
10. Sterile Fill Capability
11. Cold Chain/Storage Capabilities

### Quality Assurance (remaining) — ALL 11 required (stricter standard)
12. Quality Management System
13. Third-Party Testing
14. Testing Lab Name
15. COA Lot/Batch-Specific
16. COA Publicly Viewable Before Purchase
17. **COA Public Link** *(new — promoted from ramprate.com)*
18. Identity Confirmation Method
19. Testing Protocols
20. Stability Testing Program
21. Batch Documentation

### Commercial Terms (remaining)
22. Payment Terms
23. Existing Distribution Channels
24. References
25. Pricing for Top Compounds
26. Full Price List/Catalog

### Regulatory & Compliance (remaining)
27. FDA Registration Number
28. DEA Registration
29. State Licenses
30. Buyer Eligibility
31. Shipping Jurisdictions
32. Last FDA Inspection Date
33. FDA Inspection Outcome
34. Manufacturing Certifications
35. Warning Letters/Regulatory Disclosure
36. Insurance Coverage

### Document Upload (all)
37. Certificate of Analysis (COA)
38. cGMP/Quality Certification
39. FDA Registration Documentation
40. Certificate of Insurance
41. Sample SOP Document
42. Additional Documentation

---

## Part D — Specific Fixes to Reconcile

| Issue | Fix |
|-------|-----|
| Ownership Structure missing on ramprate.com | Add it — consolidate with Principals/Founders into single field |
| Number of Employees: free text on tonygreenberg.com, dropdown on ramprate.com | Standardize as dropdown (ramprate.com's version) on both |
| COA Public Link: exists only on ramprate.com | Add to tonygreenberg.com — genuinely useful field |
| Quality Assurance required-field mismatch (11/11 vs 6/12) | Standardize to tonygreenberg.com's stricter set for Stage 2 |
| Label inconsistencies | Use: "Company LinkedIn" (not "LinkedIn Profile"), "Manufacturing Facility Address" (not "Manufacturing Address"), "Testing Lab Name" (not "Third-Party Testing Lab Name") |

---

## Key Field Name Mapping (DB column names — must match scoring_rules.json)

### Stage 1 DB columns
- legal_entity_name
- state_country_of_incorporation
- website
- primary_contact_name
- email
- phone
- current_peptide_products
- facility_type
- number_of_employees
- monthly_production_capacity
- facility_classification
- chain_of_custody_capability
- pricing_model
- standard_lead_time
- minimum_order_quantity
- independent_testing_willingness
- product_labeling_sale_restrictions
- recall_capa_history
- source_site (hidden, auto-set)

### Stage 2 DB columns (42 fields)
- dba_name
- year_founded
- headquarters_address
- manufacturing_facility_address
- ownership_principals (consolidated)
- contact_title
- peptide_synthesis_method
- purity_levels_achieved
- sterile_fill_capability
- cold_chain_storage_capabilities
- quality_management_system
- third_party_testing
- testing_lab_name
- coa_lot_specific
- coa_publicly_viewable
- coa_public_link (NEW — from ramprate.com)
- identity_confirmation_method
- testing_protocols
- stability_testing_program
- batch_documentation
- payment_terms
- existing_distribution_channels
- references
- pricing_for_top_compounds
- full_price_list_catalog
- fda_registration_number
- dea_registration
- state_licenses
- buyer_eligibility
- shipping_jurisdictions
- last_fda_inspection_date
- fda_inspection_outcome
- manufacturing_certifications
- warning_letters_regulatory_disclosure
- insurance_coverage
- upload_coa
- upload_cgmp_cert
- upload_fda_docs
- upload_insurance_cert
- upload_sop
- upload_additional

---

## Scoring Rules Updates (from updated spec)

### Facility Classification (5 pts) — NEW options
- "FDA Registered" → 5
- "cGMP Certified" → 5
- "ISO 13485/9001" → 3
- "503B" → 4
- "503A" → 4
- "Other" → 1

### Chain-of-Custody Capability (10 pts) — NEW options
- "Currently live" → 10
- "Can implement on request" → 5
- "Not currently capable" → 0

### Pricing Model (10 pts) — NEW options
- "Per Unit" → 6
- "Tiered Volume Pricing" → 10
- "Annual Contract" → 8
- "Custom-Negotiable" → 4

### Independent Testing Willingness (5 pts) — NEW options
- "Yes, ongoing" → 5
- "Yes, one-time per new listing" → 3
- "No" → 0

### Product Labeling & Sale Restrictions (5 pts) — NEW options
- "Research-Use-Only" → 5
- "Compounded Pharmacy" → 4
- "Both, depending on product" → 3

### Recall / CAPA History (5 pts) — NEW options
- "No recalls or CAPAs" → 5
- "Minor CAPAs resolved" → 3
- "Active CAPA in progress" → 1
- "Recall history (disclose)" → 0

### Standard Lead Time (7 pts) — now FREE TEXT (not dropdown)
### Minimum Order Quantity (7 pts) — now FREE TEXT (not dropdown)
(These two are text fields per the updated spec — no dropdown scoring for them)
