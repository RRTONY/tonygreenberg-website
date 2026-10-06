import * as Yup from "yup";

// Validation for each form step, shared by the client form and the server
// action. Messages and patterns match legacy SupplierIntakeForm.tsx. Optional
// fields accept an empty string (an untouched input sends "").
const req = (message: string) => Yup.string().trim().required(message);

export const STEP_SCHEMAS: Record<number, Yup.AnyObjectSchema> = {
  1: Yup.object({
    legal_entity_name: req("Legal entity name is required").max(256),
    state_country_of_incorporation: req("State country of incorporation is required").max(256),
    primary_contact_name: req("Primary contact name is required").max(256),
    email: req("Email is required").max(320).matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    phone: Yup.string()
      .trim()
      .max(64)
      .matches(/^[+\d][\d\s()\-+.]{4,}$/, { message: "Enter a valid phone number (e.g., +1 555-000-0000)", excludeEmptyString: true }),
    website: Yup.string()
      .trim()
      .max(512)
      .matches(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/, { message: "Enter a valid website (e.g., example.com or https://example.com)", excludeEmptyString: true }),
  }),
  2: Yup.object({
    current_peptide_products: req("Current peptide products is required").max(5000),
    facility_type: req("Facility type is required"),
    number_of_employees: req("Number of employees is required"),
    monthly_production_capacity: Yup.string()
      .trim()
      .max(256)
      .matches(/\d/, { message: "Enter a quantity with a number (e.g., 500 kg/month)", excludeEmptyString: true }),
    chain_of_custody_capability: req("Chain of custody capability is required"),
    pricing_model: req("Pricing model is required"),
  }),
  3: Yup.object({
    standard_lead_time: req("Standard lead time is required"),
    minimum_order_quantity: req("Minimum order quantity is required"),
    independent_testing_willingness: req("Independent testing willingness is required"),
    facility_classification: req("Facility classification is required"),
    product_labeling_sale_restrictions: req("Product labeling sale restrictions is required"),
    recall_capa_history: req("Recall capa history is required"),
  }),
};

export const FULL_SCHEMA = STEP_SCHEMAS[1].concat(STEP_SCHEMAS[2]).concat(STEP_SCHEMAS[3]);
