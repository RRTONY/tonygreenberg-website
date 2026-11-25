import * as Yup from "yup";

// Sake for Sake's Sake form rules, shared by the forms (Formik) and the server actions, which check
// every input again. Fields and limits follow the Sake Manus app's tRPC zod inputs
// (server/routers/reviews.ts, priceAlerts.ts). Optional fields accept "" (CONTRIBUTING rule 17).

const optionalText = (max: number) => Yup.string().trim().max(max, `Please keep this under ${max} characters.`).optional();

/** reviews.create */
export const reviewSchema = Yup.object({
  sakeId: Yup.string().trim().min(1).max(128).required(),
  rating: Yup.number().integer().min(1, "Please choose a rating.").max(5).required("Please choose a rating."),
  tastingNote: optionalText(2000),
  flavorTags: Yup.array(Yup.string().trim().min(1).max(40).required()).max(8, "Choose up to 8 flavors.").optional(),
  servingTemp: optionalText(64),
  purchaseLocation: optionalText(256),
  pricePaidCents: Yup.number().integer().min(0).max(100000).nullable().optional(),
  wouldBuyAgain: Yup.boolean().default(true),
});
export type ReviewValues = Yup.InferType<typeof reviewSchema>;

/** priceAlerts.createAlert, as the Deal Alerts form fills it in (numbers typed as text). */
export const alertSchema = Yup.object({
  alertType: Yup.string().oneOf(["specific", "category", "all"] as const).required(),
  sakeId: Yup.string()
    .trim()
    .max(128)
    .when("alertType", { is: "specific", then: (s) => s.required("Please choose a sake."), otherwise: (s) => s.optional() }),
  sakeCategory: Yup.string()
    .trim()
    .max(128)
    .when("alertType", { is: "category", then: (s) => s.required("Please choose a type."), otherwise: (s) => s.optional() }),
  priceThreshold: Yup.string()
    .trim()
    .optional()
    .test("price", "Please enter a price between 0 and 100,000.", (v) => !v || (/^\d+(\.\d{1,2})?$/.test(v) && Number(v) <= 100000)),
  minDiscountPct: Yup.number()
    .typeError("Please enter a number from 1 to 90.")
    .integer()
    .min(1, "Please enter a number from 1 to 90.")
    .max(90, "Please enter a number from 1 to 90.")
    .required(),
  zipCode: Yup.string()
    .trim()
    .optional()
    .test("zip", "Please enter a 5-digit ZIP code.", (v) => !v || /^\d{5}$/.test(v)),
});
export type AlertValues = Yup.InferType<typeof alertSchema>;

/** priceAlerts.recordSnapshot (site owner only). */
export const snapshotSchema = Yup.object({
  sakeId: Yup.string().trim().min(1).max(128).required(),
  retailerId: Yup.string().trim().min(1).max(128).required(),
  retailerName: Yup.string().trim().min(1).max(256).required(),
  price: Yup.number().min(0).max(100000).required(),
  previousPrice: Yup.number().min(0).max(100000).optional(),
  inStock: Yup.boolean().default(true),
  bottleSizeMl: Yup.number().integer().min(1).max(10000).default(720),
  sourceUrl: Yup.string().trim().url().max(1000).optional(),
});
export type SnapshotValues = Yup.InferType<typeof snapshotSchema>;
