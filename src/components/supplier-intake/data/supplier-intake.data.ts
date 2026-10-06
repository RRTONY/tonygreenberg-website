// Fields, option lists and UI copy for the Stage 1 supplier intake
// (/supplier-intake). Ported from legacy client/src/pages/SupplierIntakeForm.tsx;
// copy, labels, placeholders and option lists are unchanged (checked against
// live tonygreenberg.com/supplier-intake on 2026-10-07). The option lists must
// stay in step with RampRate's scoring rules, since submissions feed the same
// review pipeline as ramprate.com/biochain/supplier-intake.

export const FACILITY_TYPES = ["Own Manufacturing", "Contract Manufacturer (CMO)", "Hybrid (Own + CMO)", "White Label", "Private Label"];
export const EMPLOYEE_RANGES = ["1–10", "11–50", "51–200", "201+"];
export const CHAIN_OF_CUSTODY = ["Currently live", "Can implement on request", "Not currently capable"];
export const PRICING_MODELS = ["Per Unit", "Tiered Volume Pricing", "Annual Contract", "Custom-Negotiable"];
export const LEAD_TIMES = ["Under 2 weeks", "2–4 weeks", "4–8 weeks", "8+ weeks"];
export const MOQ_OPTIONS = ["No minimum", "Small (under $5K)", "Moderate ($5K–$25K)", "Large ($25K+)"];
export const INDEPENDENT_TESTING = ["Yes, ongoing", "Yes, one-time per new listing", "No"];
export const FACILITY_CLASSIFICATIONS = ["FDA Registered", "cGMP Certified", "ISO 13485/9001", "503B", "503A", "Other"];
export const LABELING_RESTRICTIONS = ["Research-Use-Only", "Compounded Pharmacy", "Both, depending on product"];
export const RECALL_CAPA = ["No recalls or CAPAs", "Minor CAPAs resolved", "Active CAPA in progress", "Recall history (disclose)"];

export type SupplierIntakeValues = {
  legal_entity_name: string;
  state_country_of_incorporation: string;
  primary_contact_name: string;
  email: string;
  phone: string;
  website: string;
  current_peptide_products: string;
  facility_type: string;
  number_of_employees: string;
  monthly_production_capacity: string;
  chain_of_custody_capability: string;
  pricing_model: string;
  standard_lead_time: string;
  minimum_order_quantity: string;
  independent_testing_willingness: string;
  facility_classification: string;
  product_labeling_sale_restrictions: string;
  recall_capa_history: string;
  /** Honeypot: hidden from people, bots fill it in. */
  website_url: string;
};

export type FieldName = Exclude<keyof SupplierIntakeValues, "website_url">;

export const EMPTY_VALUES: SupplierIntakeValues = {
  legal_entity_name: "",
  state_country_of_incorporation: "",
  primary_contact_name: "",
  email: "",
  phone: "",
  website: "",
  current_peptide_products: "",
  facility_type: "",
  number_of_employees: "",
  monthly_production_capacity: "",
  chain_of_custody_capability: "",
  pricing_model: "",
  standard_lead_time: "",
  minimum_order_quantity: "",
  independent_testing_willingness: "",
  facility_classification: "",
  product_labeling_sale_restrictions: "",
  recall_capa_history: "",
  website_url: "",
};

export type FieldDef = {
  name: FieldName;
  label: string;
  required?: boolean;
  sub?: string;
  placeholder: string;
  kind: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  wide?: boolean;
};

/** Fields per form step (1 to 3), in live's order. */
export const STEP_FIELDS: Record<number, FieldDef[]> = {
  1: [
    { name: "legal_entity_name", label: "Legal Entity Name", required: true, placeholder: "Acme Peptides Inc.", kind: "text" },
    { name: "state_country_of_incorporation", label: "State / Country of Incorporation", required: true, placeholder: "Delaware, USA", kind: "text" },
    { name: "primary_contact_name", label: "Primary Contact Name", required: true, placeholder: "Jane Smith", kind: "text" },
    { name: "email", label: "Email", required: true, placeholder: "jane@acmepeptides.com", kind: "email" },
    { name: "phone", label: "Phone", sub: "Optional", placeholder: "+1 (302) 555-0100", kind: "tel" },
    { name: "website", label: "Website", sub: "Optional", placeholder: "acmepeptides.com", kind: "text" },
  ],
  2: [
    {
      name: "current_peptide_products",
      label: "Current Peptide Products",
      required: true,
      sub: "List the peptides you currently manufacture or supply (e.g., BPC-157, TB-500, Semaglutide)",
      placeholder: "BPC-157, TB-500, Semaglutide, Tirzepatide...",
      kind: "textarea",
      wide: true,
    },
    { name: "facility_type", label: "Facility Type", required: true, placeholder: "Select facility type", kind: "select", options: FACILITY_TYPES },
    { name: "number_of_employees", label: "Number of Employees", required: true, placeholder: "Select range", kind: "select", options: EMPLOYEE_RANGES },
    { name: "monthly_production_capacity", label: "Monthly Production Capacity", sub: "Optional — e.g., 500 kg/month", placeholder: "500 kg/month", kind: "text" },
    {
      name: "chain_of_custody_capability",
      label: "Chain-of-Custody Capability",
      required: true,
      sub: "Lot-level traceability from raw material to finished product",
      placeholder: "Select capability",
      kind: "select",
      options: CHAIN_OF_CUSTODY,
    },
    { name: "pricing_model", label: "Pricing Model", required: true, placeholder: "Select pricing model", kind: "select", options: PRICING_MODELS },
  ],
  3: [
    { name: "standard_lead_time", label: "Standard Lead Time", required: true, sub: "Typical lead time from order to delivery", placeholder: "Select lead time", kind: "select", options: LEAD_TIMES },
    { name: "minimum_order_quantity", label: "Minimum Order Quantity (MOQ)", required: true, sub: "Smallest order size you can fulfill", placeholder: "Select MOQ range", kind: "select", options: MOQ_OPTIONS },
    {
      name: "independent_testing_willingness",
      label: "Independent Testing Willingness",
      required: true,
      sub: "Would you allow us to independently test your products?",
      placeholder: "Select option",
      kind: "select",
      options: INDEPENDENT_TESTING,
    },
    {
      name: "facility_classification",
      label: "Facility Classification",
      required: true,
      sub: "Select your highest applicable classification",
      placeholder: "Select classification",
      kind: "select",
      options: FACILITY_CLASSIFICATIONS,
    },
    {
      name: "product_labeling_sale_restrictions",
      label: "Product Labeling & Sale Restrictions",
      required: true,
      sub: "How are your products labeled and sold?",
      placeholder: "Select option",
      kind: "select",
      options: LABELING_RESTRICTIONS,
    },
    { name: "recall_capa_history", label: "Recall / CAPA History", required: true, sub: "Corrective and Preventive Action history", placeholder: "Select option", kind: "select", options: RECALL_CAPA },
  ],
};

export const TOTAL_FORM_STEPS = 3;

export const supplierIntakeData = {
  stepLabels: ["Company & Contact", "Offer & Scale", "Terms & Track Record"],
  termsNote: "Select the option that most accurately describes your current capabilities — not aspirational ones.",
  back: "Back",
  continue: "Continue",
  submit: "Submit Application",
  stepOf: (n: number) => `Step ${n} of ${TOTAL_FORM_STEPS}`,
  missingFields: "Please fill in all required fields before continuing.",
  missingFieldsFinal: "Please fill in all required fields.",
  privacy: "Submissions are reviewed manually. We do not share your information with third parties.",
  // Shown in place of the submit button when the site has no submission
  // destination configured (GOOGLE_APPS_SCRIPT_URL unset), so the form never
  // pretends to send anything.
  handoff: {
    text: "Online submission from this page is paused. Please send your application through RampRate's supplier intake, the same review pipeline.",
    cta: "Continue at ramprate.com/biochain",
    href: "https://ramprate.com/biochain/supplier-intake",
  },
  received: {
    title: "Application Received",
    body: "Thank you for applying. We review every submission and will reach out directly if we decide to move forward. If selected, you'll receive a private link to complete the full supplier profile.",
    reference: "Reference:",
    home: "Return Home",
  },
};
