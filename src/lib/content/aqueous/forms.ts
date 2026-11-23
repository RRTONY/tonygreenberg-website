import * as Yup from "yup";

// Aqueous form rules, shared by the forms (Formik) and the server actions, which check every input
// again. Fields and limits follow the Aqueous Manus app (ReferralClaimModal, Directory's "Add
// Project" form) and its tRPC zod inputs. Optional fields accept "" (CONTRIBUTING rule 17).

export const claimSchema = Yup.object({
  name: Yup.string().trim().max(255, "That name is too long.").optional(),
  email: Yup.string().trim().email("Please enter a valid email.").max(320).required("Please enter your email."),
});
export type ClaimValues = Yup.InferType<typeof claimSchema>;

export const projectSchema = Yup.object({
  name: Yup.string().trim().min(1).max(255).required("Please enter a project name."),
  url: Yup.string()
    .trim()
    .max(500)
    .required("Please enter a URL.")
    .test("url", "Please enter a full address (https://...) or a path starting with /.", (v) => {
      if (!v) return false;
      if (v.startsWith("/") && !v.startsWith("//")) return true;
      try {
        const u = new URL(v);
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    }),
  description: Yup.string().trim().max(2000).optional(),
  tag: Yup.string().trim().max(50).optional(),
});
export type ProjectValues = Yup.InferType<typeof projectSchema>;
