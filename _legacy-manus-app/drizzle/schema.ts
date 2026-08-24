import { int, tinyint, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Purchases — tracks completed Stripe purchases.
 * Minimal: just Stripe IDs + product key + user reference.
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 256 }).notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  productKey: varchar("productKey", { length: 128 }).notNull(), // matches PRODUCTS keys
  amountCents: int("amountCents").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("usd"),
  status: mysqlEnum("status", ["completed", "refunded"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

/**
 * Subscriptions — tracks active Stripe subscriptions.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 256 }).notNull(),
  productKey: varchar("productKey", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "unpaid"]).default("active").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Riddle attempts — tracks each user's attempts at blog post riddles.
 */
export const riddleAttempts = mysqlTable("riddle_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  attempt: int("attempt").notNull(), // 1, 2, or 3
  answer: text("answer").notNull(),
  correct: boolean("correct").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RiddleAttempt = typeof riddleAttempts.$inferSelect;

/**
 * Riddle solvers — leaderboard of users who solved riddles.
 */
export const riddleSolvers = mysqlTable("riddle_solvers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  solvedOnAttempt: int("solvedOnAttempt").notNull(), // which attempt (1-3) they got it right
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RiddleSolver = typeof riddleSolvers.$inferSelect;

/**
 * Share events — tracks when users share blog posts.
 */
export const shareEvents = mysqlTable("share_events", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  shareType: varchar("shareType", { length: 64 }).notNull(), // twitter, linkedin, email, copy, whatsapp, etc.
  userId: int("userId"), // nullable — anonymous shares allowed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShareEvent = typeof shareEvents.$inferSelect;

/**
 * Page views — tracks every page visit for analytics.
 */
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 512 }).notNull(),
  postSlug: varchar("postSlug", { length: 256 }), // nullable — only for blog posts
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  referrer: varchar("referrer", { length: 512 }),
  userAgent: varchar("userAgent", { length: 512 }),
  readTimeMs: int("readTimeMs").default(0), // time spent reading in ms
  scrollDepth: int("scrollDepth").default(0), // max scroll depth percentage 0-100
  isBot: tinyint("isBot").default(0), // 1 = likely bot/crawler, 0 = likely human
  country: varchar("country", { length: 8 }), // ISO country code from CF-IPCountry header
  eventName: varchar("eventName", { length: 128 }), // named event (e.g. article_50_scroll, assessment_start)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;

/**
 * Email subscribers — newsletter signups.
 */
export const emailSubscribers = mysqlTable("email_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  source: varchar("source", { length: 128 }), // where they signed up: footer, exit-intent, blog, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;

/**
 * Blog ratings — "Rate This Thinking" micro-survey responses.
 */
export const blogRatings = mysqlTable("blog_ratings", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  rating: varchar("rating", { length: 32 }).notNull(), // 'completely', 'partially', 'not-yet'
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogRating = typeof blogRatings.$inferSelect;

/**
 * Post reactions — thumbs up / down / neutral with optional short comment.
 */
export const postReactions = mysqlTable("post_reactions", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  reaction: mysqlEnum("reaction", ["up", "down", "neutral"]).notNull(),
  comment: text("comment"), // optional short comment
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable — anonymous reactions allowed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PostReaction = typeof postReactions.$inferSelect;
export type InsertPostReaction = typeof postReactions.$inferInsert;

/**
 * FauxTony chat messages — persists conversation history per session/user.
 */
export const fauxTonyChats = mysqlTable("faux_tony_chats", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable — anonymous chats allowed
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  questionNumber: int("questionNumber"), // tracks which question this was (1, 2, 3)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FauxTonyChat = typeof fauxTonyChats.$inferSelect;
export type InsertFauxTonyChat = typeof fauxTonyChats.$inferInsert;

/**
 * Assessment results — stores completed assessments (Dharma Finder, Hawkins Consciousness, Grant Study).
 * Tracks progress over time so users can retake and see their growth.
 */
export const assessmentResults = mysqlTable("assessment_results", {
  id: int("id").autoincrement().primaryKey(),
  assessmentType: mysqlEnum("assessmentType", [
    "dharma", "consciousness", "grant-study", "mirror", "find-your-me",
    "therapy", "sake", "spirit", "religion",
    "diet", "movement", "sleep", "coffee", "kitchen", "style", "attachment", "love-language",
    "psychedelic-readiness", "peptide", "sexuality", "soulscore", "self-portrait", "kava", "brewsoul-quiz",
    "iboga-compass"
  ]).notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable — anonymous allowed
  answers: text("answers").notNull(), // JSON stringified array of { questionId, answer, score }
  resultSummary: text("resultSummary").notNull(), // JSON stringified result object
  totalScore: int("totalScore"), // numeric score where applicable
  sharedWithTony: boolean("sharedWithTony").default(false), // user opted to share results with Tony
  userName: varchar("userName", { length: 255 }), // optional name for shared results
  userEmail: varchar("userEmail", { length: 255 }), // optional email for shared results
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type InsertAssessmentResult = typeof assessmentResults.$inferInsert;

/**
 * Journey progress — tracks which Find Your ___ experiences a user has completed.
 * Syncs with localStorage for anonymous users, DB for logged-in users.
 */
export const journeyProgress = mysqlTable("journey_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  experienceId: varchar("experienceId", { length: 128 }).notNull(), // matches JourneyExperience.id
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  resultData: text("resultData"), // JSON stringified result snapshot (archetype, scores, etc.)
});

export type JourneyProgress = typeof journeyProgress.$inferSelect;
export type InsertJourneyProgress = typeof journeyProgress.$inferInsert;

/**
 * Manifesto responses — questionnaire submissions from the manifesto page.
 */
export const manifestoResponses = mysqlTable("manifesto_responses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // nullable — anonymous allowed
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 320 }),
  biggestChallenge: text("biggestChallenge"),
  whatToMeasure: text("whatToMeasure"),
  referenceSites: text("referenceSites"),
  newIndices: text("newIndices"),
  howToParticipate: text("howToParticipate"),
  abundantLife: text("abundantLife"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ManifestoResponse = typeof manifestoResponses.$inferSelect;
export type InsertManifestoResponse = typeof manifestoResponses.$inferInsert;

/**
 * Community members — users who've joined the community platform.
 */
export const communityMembers = mysqlTable("community_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 256 }).notNull(),
  bio: text("bio"),
  lookingFor: text("lookingFor"), // JSON array: ["tribe", "partner", "business-partner", "collaborator"]
  interests: text("interests"), // JSON array of interest tags
  location: varchar("location", { length: 256 }),
  website: varchar("website", { length: 512 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CommunityMember = typeof communityMembers.$inferSelect;
export type InsertCommunityMember = typeof communityMembers.$inferInsert;

/**
 * Community contacts — uploaded contacts (friends, address book) for invite/matching.
 */
export const communityContacts = mysqlTable("community_contacts", {
  id: int("id").autoincrement().primaryKey(),
  uploadedBy: int("uploadedBy").notNull(), // userId of uploader
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  relationship: varchar("relationship", { length: 128 }), // friend, colleague, family, etc.
  note: text("note"),
  invited: boolean("invited").default(false).notNull(),
  invitedAt: timestamp("invitedAt"),
  joinedUserId: int("joinedUserId"), // links to users.id if they joined
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunityContact = typeof communityContacts.$inferSelect;
export type InsertCommunityContact = typeof communityContacts.$inferInsert;

/**
 * Community invitations — sent invites to contacts.
 */
export const communityInvitations = mysqlTable("community_invitations", {
  id: int("id").autoincrement().primaryKey(),
  inviterId: int("inviterId").notNull(), // userId of person who invited
  contactId: int("contactId"), // links to communityContacts.id if from uploaded contacts
  email: varchar("email", { length: 320 }).notNull(),
  inviteCode: varchar("inviteCode", { length: 64 }).notNull(),
  message: text("message"), // personal message from inviter
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
});
export type CommunityInvitation = typeof communityInvitations.$inferSelect;
export type InsertCommunityInvitation = typeof communityInvitations.$inferInsert;

/**
 * Community connections — matched/connected members.
 */
export const communityConnections = mysqlTable("community_connections", {
  id: int("id").autoincrement().primaryKey(),
  memberAId: int("memberAId").notNull(),
  memberBId: int("memberBId").notNull(),
  connectionType: varchar("connectionType", { length: 64 }), // tribe, partner, business, collaborator
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CommunityConnection = typeof communityConnections.$inferSelect;
export type InsertCommunityConnection = typeof communityConnections.$inferInsert;

/**
 * Clock Keeper responses — Part II answers to the 12 questions.
 * Each row is one submission (a respondent may answer some or all questions).
 */
export const clockKeeperResponses = mysqlTable("clock_keeper_responses", {
  id: int("id").autoincrement().primaryKey(),
  respondentName: varchar("respondentName", { length: 256 }),
  respondentEmail: varchar("respondentEmail", { length: 320 }),
  q1: text("q1"),  // The One Practice
  q2: text("q2"),  // The Meta-Pattern
  q3: text("q3"),  // The Integration Architecture
  q4: text("q4"),  // Most Destructive Belief
  q5: text("q5"),  // Method for Testing Wisdom
  q6: text("q6"),  // Observer's Transformation
  q7: text("q7"),  // Technology of Multi-Awareness
  q8: text("q8"),  // Practice of Expanding Space
  q9: text("q9"),  // Structure Enabling Emergence
  q10: text("q10"), // Synthesis of Paths
  q11: text("q11"), // The One Pattern That Changes Everything
  q12: text("q12"), // Your Medicine
  reframe: text("reframe"), // Optional: if they chose to reframe the questions entirely
  userId: int("userId"), // nullable — anonymous allowed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ClockKeeperResponse = typeof clockKeeperResponses.$inferSelect;
export type InsertClockKeeperResponse = typeof clockKeeperResponses.$inferInsert;

/**
 * Engagement audit submissions — pre-qualification gate for booking meetings.
 * 7 out of 10 don't qualify. Only qualified leads get the Calendly link.
 */
export const engagementAudits = mysqlTable("engagement_audits", {
  id: int("id").autoincrement().primaryKey(),
  // Contact info
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organization: varchar("organization", { length: 256 }),
  // Qualification questions
  impactInitiative: text("impactInitiative").notNull(), // What is the impact initiative?
  impactOutcomes: text("impactOutcomes").notNull(), // What are the intended impact outcomes?
  whyTony: text("whyTony").notNull(), // Why Tony / RampRate / ImpactSoul?
  priorAction: text("priorAction").notNull(), // What have they already done?
  resourcesCommitted: text("resourcesCommitted").notNull(), // Budget, team, timeline
  // Scoring
  totalScore: int("totalScore").notNull(), // 0-100
  outcome: mysqlEnum("outcome", ["qualified", "not-ready", "wrong-fit"]).notNull(),
  // Admin
  adminNotes: text("adminNotes"), // Tony's notes after review
  stage: mysqlEnum("stage", ["submitted", "reviewed", "meeting-booked", "30-day-review", "stage-2", "declined"]).default("submitted").notNull(),
  userId: int("userId"), // nullable — may not be logged in
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type EngagementAudit = typeof engagementAudits.$inferSelect;
export type InsertEngagementAudit = typeof engagementAudits.$inferInsert;

/**
 * Vendor intake — two-stage supplier qualification for the RampRate peptide network.
 *
 * Stage 1 (/supplier-intake): 18 public fields, submitted immediately.
 *   Generates supplier_id (UUID) + stage2_token for the gated Stage 2 link.
 *   8 scoring-signal dropdowns unlock 54 of 59 achievable scoring points.
 *
 * Stage 2 (/supplier-intake-long/:token): 42 additional fields, save-and-resume.
 *   Updates this same record — does NOT create a new row.
 *   testing_protocols mass-spec keyword check adds the remaining 5 pts.
 *
 * Field names match field_mapping.json and scoring_rules.json exactly.
 */
export const vendorIntake = mysqlTable("vendor_intake", {
  id: int("id").autoincrement().primaryKey(),

  // ── Identifiers ──────────────────────────────────────────────────────────
  supplierId: varchar("supplier_id", { length: 36 }).notNull().unique(), // UUID
  stage2Token: varchar("stage2_token", { length: 24 }).notNull().unique(), // short URL-safe token

  // ── Stage tracking ───────────────────────────────────────────────────────
  stage: mysqlEnum("stage", ["stage1_submitted", "stage2_invited", "stage2_in_progress", "stage2_submitted"]).default("stage1_submitted").notNull(),
  stage2LastSavedAt: timestamp("stage2_last_saved_at"),

  // ── Admin ────────────────────────────────────────────────────────────────
  adminStatus: mysqlEnum("admin_status", ["new", "reviewing", "pursue", "pass", "approved", "rejected"]).default("new").notNull(),
  adminNotes: text("admin_notes"),
  stage1Score: int("stage1_score"),           // computed after Stage 1 submit
  totalScore: int("total_score"),             // recomputed after Stage 2 submit
  scoreGrade: varchar("score_grade", { length: 2 }), // A/B/C/D/F

  // ── Stage 1: Identity & Contact (5 fields) ───────────────────────────────
  legal_entity_name: varchar("legal_entity_name", { length: 256 }).notNull(),
  state_country_of_incorporation: varchar("state_country_of_incorporation", { length: 128 }).notNull(),
  primary_contact_name: varchar("primary_contact_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),                                    // optional

  // ── Stage 1: Offer / Scale (4 fields) ────────────────────────────────────
  website: varchar("website", { length: 512 }),                               // optional
  current_peptide_products: text("current_peptide_products").notNull(),
  facility_type: varchar("facility_type", { length: 64 }).notNull(),          // Own Manufacturing / CMO / Hybrid / White Label
  number_of_employees: varchar("number_of_employees", { length: 32 }).notNull(), // dropdown range
  monthly_production_capacity: varchar("monthly_production_capacity", { length: 256 }), // optional

  // ── Meta ─────────────────────────────────────────────────────────────────
  source_site: varchar("source_site", { length: 64 }).notNull().default("tonygreenberg"), // 'tonygreenberg' or 'ramprate'

  // ── Stage 1: Scoring-Signal Dropdowns (8 fields) ─────────────────────────
  chain_of_custody_capability: varchar("chain_of_custody_capability", { length: 128 }).notNull(),
  pricing_model: varchar("pricing_model", { length: 128 }).notNull(),
  standard_lead_time: varchar("standard_lead_time", { length: 64 }).notNull(),
  minimum_order_quantity: varchar("minimum_order_quantity", { length: 64 }).notNull(),
  independent_testing_willingness: varchar("independent_testing_willingness", { length: 128 }).notNull(),
  facility_classification: varchar("facility_classification", { length: 128 }).notNull(),
  product_labeling_sale_restrictions: varchar("product_labeling_sale_restrictions", { length: 128 }).notNull(),
  recall_capa_history: varchar("recall_capa_history", { length: 128 }).notNull(),

  // ── Stage 2: Company Information ─────────────────────────────────────────
  dba_name: varchar("dba_name", { length: 256 }),
  year_founded: varchar("year_founded", { length: 8 }),
  headquarters_address: text("headquarters_address"),
  manufacturing_facility_address: text("manufacturing_facility_address"),
  contact_title: varchar("contact_title", { length: 256 }),
  ownership_principals: text("ownership_principals"),

  // ── Stage 2: Manufacturing & Capabilities ────────────────────────────────
  peptide_synthesis_method: varchar("peptide_synthesis_method", { length: 256 }),
  purity_levels_achieved: varchar("purity_levels_achieved", { length: 256 }),
  sterile_fill_capability: varchar("sterile_fill_capability", { length: 32 }),
  cold_chain_storage_capabilities: text("cold_chain_storage_capabilities"),
  batch_documentation: text("batch_documentation"),

  // ── Stage 2: Quality Assurance ───────────────────────────────────────────
  quality_management_system: varchar("quality_management_system", { length: 128 }),
  third_party_testing: varchar("third_party_testing", { length: 64 }),
  testing_lab_name: varchar("testing_lab_name", { length: 256 }),
  coa_lot_specific: varchar("coa_lot_specific", { length: 32 }),
  coa_publicly_viewable: varchar("coa_publicly_viewable", { length: 32 }),
  coa_public_link: varchar("coa_public_link", { length: 512 }),               // new: public URL to COA page
  identity_confirmation_method: varchar("identity_confirmation_method", { length: 256 }),
  testing_protocols: text("testing_protocols"),
  stability_testing_program: varchar("stability_testing_program", { length: 64 }),

  // ── Stage 2: Commercial Terms ─────────────────────────────────────────────
  payment_terms: varchar("payment_terms", { length: 256 }),
  existing_distribution_channels: text("existing_distribution_channels"),
  references: text("references"),
  pricing_for_top_compounds: text("pricing_for_top_compounds"),
  full_price_list_catalog: text("full_price_list_catalog"),

  // ── Stage 2: Regulatory & Compliance ─────────────────────────────────────
  fda_registration_number: varchar("fda_registration_number", { length: 128 }),
  dea_registration: varchar("dea_registration", { length: 32 }),
  state_licenses: text("state_licenses"),
  buyer_eligibility: text("buyer_eligibility"),
  shipping_jurisdictions: text("shipping_jurisdictions"),
  last_fda_inspection_date: varchar("last_fda_inspection_date", { length: 32 }),
  fda_inspection_outcome: varchar("fda_inspection_outcome", { length: 128 }),
  manufacturing_certifications: text("manufacturing_certifications"),
  warning_letters_regulatory_disclosure: text("warning_letters_regulatory_disclosure"),
  insurance_coverage: text("insurance_coverage"),

  // ── Stage 2: Document Upload URLs (stored as S3 URLs) ────────────────────
  upload_coa: text("upload_coa"),
  upload_cgmp_cert: text("upload_cgmp_cert"),
  upload_fda_docs: text("upload_fda_docs"),
  upload_insurance_cert: text("upload_insurance_cert"),
  upload_sop: text("upload_sop"),
  upload_additional: text("upload_additional"),

  // ── Timestamps ───────────────────────────────────────────────────────────
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VendorIntake = typeof vendorIntake.$inferSelect;
export type InsertVendorIntake = typeof vendorIntake.$inferInsert;

/**
 * PRI Consent — tracks legal disclaimer acknowledgments with initials.
 */
export const priConsents = mysqlTable("pri_consents", {
  id: int("id").autoincrement().primaryKey(),
  initials: varchar("initials", { length: 10 }).notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable — anonymous allowed
  ipHash: varchar("ipHash", { length: 64 }), // hashed IP for audit trail
  consentVersion: varchar("consentVersion", { length: 16 }).notNull().default("1.0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PriConsent = typeof priConsents.$inferSelect;
export type InsertPriConsent = typeof priConsents.$inferInsert;

/**
 * PRI Community Corrections — user-submitted corrections/improvements to medicine data.
 */
export const priCorrections = mysqlTable("pri_corrections", {
  id: int("id").autoincrement().primaryKey(),
  medicineId: varchar("medicineId", { length: 64 }).notNull(), // matches Medicine.id
  fieldName: varchar("fieldName", { length: 64 }).notNull(), // which field: overview, contraindications, sideEffects, etc.
  currentContent: text("currentContent"), // snapshot of what's currently shown
  suggestedContent: text("suggestedContent").notNull(), // what the user suggests
  sourceUrl: varchar("sourceUrl", { length: 512 }), // optional citation/source
  submitterName: varchar("submitterName", { length: 256 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PriCorrection = typeof priCorrections.$inferSelect;
export type InsertPriCorrection = typeof priCorrections.$inferInsert;

/**
 * CheshireGrin — Anonymous community evidence submissions
 */
export const cheshireSubmissions = mysqlTable("cheshire_submissions", {
  id: int("id").autoincrement().primaryKey(),
  relationship: varchar("relationship", { length: 128 }).notNull(),
  city: varchar("city", { length: 256 }),
  dateRange: varchar("dateRange", { length: 128 }),
  promisedVsDelivered: text("promisedVsDelivered").notNull(),
  receivedPayment: mysqlEnum("receivedPayment", ["yes", "partial", "no"]).notNull(),
  amountOwed: varchar("amountOwed", { length: 64 }),
  hasDocumentation: varchar("hasDocumentation", { length: 128 }),
  willingToContact: boolean("willingToContact").default(false),
  contactEmail: varchar("contactEmail", { length: 320 }),
  howHeard: text("howHeard"),
  status: mysqlEnum("status", ["new", "reviewed", "actionable", "archived"]).default("new").notNull(),
  ipHash: varchar("ipHash", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CheshireSubmission = typeof cheshireSubmissions.$inferSelect;
export type InsertCheshireSubmission = typeof cheshireSubmissions.$inferInsert;

/**
 * Spam Reports — public accountability database for the Attention Theft Manifesto.
 * Tracks reported spammers, aggregated into the Wall of Shame leaderboard.
 */
export const spamReports = mysqlTable("spam_reports", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 256 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  spamType: mysqlEnum("spamType", [
    "cold-outreach",
    "unsolicited-newsletter",
    "ai-generated-spam",
    "phishing-scam",
  ]).notNull(),
  frequency: mysqlEnum("frequency", [
    "one-time",
    "weekly",
    "daily",
    "multiple-daily",
  ]).notNull(),
  description: text("description").notNull(),
  reporterEmail: varchar("reporterEmail", { length: 320 }),
  ipHash: varchar("ipHash", { length: 64 }),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SpamReport = typeof spamReports.$inferSelect;
export type InsertSpamReport = typeof spamReports.$inferInsert;

/**
 * Tracks when a spammer opens the "You've Been Reported" page.
 * Logs company, domain, IP, user-agent, and timestamp.
 */
export const spamPageViews = mysqlTable("spam_page_views", {
  id: int("id").autoincrement().primaryKey(),
  company: varchar("company", { length: 256 }),
  domain: varchar("domain", { length: 256 }),
  email: varchar("email", { length: 320 }),
  ipHash: varchar("ipHash", { length: 64 }),
  userAgent: text("userAgent"),
  referer: text("referer"),
  viewCount: int("viewCount").default(1).notNull(),
  firstViewedAt: timestamp("firstViewedAt").defaultNow().notNull(),
  lastViewedAt: timestamp("lastViewedAt").defaultNow().notNull(),
});

export type SpamPageView = typeof spamPageViews.$inferSelect;
export type InsertSpamPageView = typeof spamPageViews.$inferInsert;

/**
 * Tracks forwarded spam emails that auto-generate personalized URLs.
 * Stores extracted sender details and the generated confrontation URL.
 */
export const spamForwards = mysqlTable("spam_forwards", {
  id: int("id").autoincrement().primaryKey(),
  rawSubject: text("rawSubject"),
  rawFrom: varchar("rawFrom", { length: 512 }),
  extractedCompany: varchar("extractedCompany", { length: 256 }),
  extractedDomain: varchar("extractedDomain", { length: 256 }),
  extractedEmail: varchar("extractedEmail", { length: 320 }),
  generatedUrl: text("generatedUrl"),
  forwardedBy: varchar("forwardedBy", { length: 320 }),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SpamForward = typeof spamForwards.$inferSelect;
export type InsertSpamForward = typeof spamForwards.$inferInsert;

/**
 * Report Endorsements — anonymous verification signatures for VerifiedTribe reports.
 * 3 endorsements required before a report can be published.
 * Endorsers confirm they've done Byron Katie's 4 Questions on this and believe it's true.
 * No names required — just anonymous verification that this wasn't one person acting alone.
 */
export const reportEndorsements = mysqlTable("report_endorsements", {
  id: int("id").autoincrement().primaryKey(),
  reportSlug: varchar("reportSlug", { length: 128 }).notNull(),
  /** Byron Katie Q1: Is it true? */
  bkAnswer1: text("bkAnswer1").notNull(),
  /** Byron Katie Q2: Can you absolutely know it's true? */
  bkAnswer2: text("bkAnswer2").notNull(),
  /** Byron Katie Q3: How do you react when you believe that thought? */
  bkAnswer3: text("bkAnswer3").notNull(),
  /** Byron Katie Q4: Who would you be without that thought? */
  bkAnswer4: text("bkAnswer4").notNull(),
  /** Free-form statement of endorsement */
  endorsementStatement: text("endorsementStatement").notNull(),
  /** Anonymous session hash — prevents duplicate endorsements */
  sessionHash: varchar("sessionHash", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReportEndorsement = typeof reportEndorsements.$inferSelect;
export type InsertReportEndorsement = typeof reportEndorsements.$inferInsert;

/**
 * Notifications — in-app notifications (broadcasts + targeted).
 * Broadcasts go to everyone; targeted notifications go to a specific user.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["broadcast", "personal"]).notNull().default("broadcast"),
  category: varchar("category", { length: 64 }).notNull().default("announcement"), // announcement, fraud-story, signup, assessment, system
  title: varchar("title", { length: 512 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 512 }), // optional deep link
  targetUserId: int("targetUserId"), // null = broadcast to all; set = personal notification
  createdBy: int("createdBy"), // userId of admin who created it (null for system-generated)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification reads — tracks which user has read which notification.
 * Absence of a row means unread.
 */
export const notificationReads = mysqlTable("notification_reads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  notificationId: int("notificationId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
});

export type NotificationRead = typeof notificationReads.$inferSelect;
export type InsertNotificationRead = typeof notificationReads.$inferInsert;


// ═══════════════════════════════════════════════════════════
// ENGAGEMENT FEATURES — 10 new tables
// ═══════════════════════════════════════════════════════════

/**
 * 1. Reading Streaks — tracks daily reading activity per user
 */
export const readingStreaks = mysqlTable("reading_streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastReadDate: varchar("lastReadDate", { length: 10 }).notNull(), // YYYY-MM-DD
  totalDaysRead: int("totalDaysRead").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ReadingStreak = typeof readingStreaks.$inferSelect;

/**
 * 3. Highlights — user-saved passages from essays
 */
export const highlights = mysqlTable("highlights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  text: text("text").notNull(),
  context: text("context"), // surrounding paragraph for display
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Highlight = typeof highlights.$inferSelect;

/**
 * 5. Shared Conversations — public links to Ask Tony chats
 */
export const sharedConversations = mysqlTable("shared_conversations", {
  id: int("id").autoincrement().primaryKey(),
  shareId: varchar("shareId", { length: 64 }).notNull().unique(), // public URL slug
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  title: varchar("title", { length: 512 }), // first question as title
  messageCount: int("messageCount").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type SharedConversation = typeof sharedConversations.$inferSelect;

/**
 * 6. Micro-Commitments — "What will you do differently?"
 */
export const microCommitments = mysqlTable("micro_commitments", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  commitment: text("commitment").notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MicroCommitment = typeof microCommitments.$inferSelect;

/**
 * 9. Provocation of the Day — cached daily homepage provocation
 */
export const dailyProvocations = mysqlTable("daily_provocations", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD
  text: text("text").notNull(),
  sourceSlug: varchar("sourceSlug", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type DailyProvocation = typeof dailyProvocations.$inferSelect;

/**
 * 10. Referrals — tracks who referred whom and engagement depth
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredUserId: int("referredUserId").notNull(),
  referralCode: varchar("referralCode", { length: 64 }).notNull(),
  depthScore: int("depthScore").default(0).notNull(), // essays read + assessments + chats
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Referral = typeof referrals.$inferSelect;

/**
 * 10b. Referral codes — each user gets a unique code
 */
export const referralCodes = mysqlTable("referral_codes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ReferralCode = typeof referralCodes.$inferSelect;

export const honeypotBans = mysqlTable("honeypot_bans", {
  id: int("id").autoincrement().primaryKey(),
  ip: varchar("ip", { length: 45 }).notNull().unique(),
  userAgent: text("user_agent"),
  path: varchar("path", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
export type HoneypotBan = typeof honeypotBans.$inferSelect;

// ── Short URLs for sharing ──
export const shortUrls = mysqlTable("short_urls", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  targetPath: text("target_path").notNull(), // e.g. /blog/human-operating-system
  clicks: int("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Article Read Counters ──
export const articleReadCounts = mysqlTable("article_read_counts", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  version: varchar("version", { length: 32 }).notNull().default("short"), // 'short' or 'long'
  count: int("count").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ArticleReadCount = typeof articleReadCounts.$inferSelect;

// ── Blog Comments (requires sign-in) ──
export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postSlug: varchar("postSlug", { length: 256 }).notNull(),
  userId: int("userId"), // nullable — anonymous comments allowed
  userName: varchar("userName", { length: 256 }).notNull(),
  anonEmail: varchar("anonEmail", { length: 320 }), // for anonymous commenters
  content: text("content").notNull(),
  parentId: int("parentId"), // nullable — for threaded replies
  approved: boolean("approved").default(false).notNull(), // Tony approves before public display
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

// ── PRI Calibrations (Forced-Rank Deep Calibration) ──
export const priCalibrations = mysqlTable("pri_calibrations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  userId: int("userId"), // nullable — anonymous allowed
  rankings: text("rankings").notNull(), // JSON: ordered array of dimension keys from most to least ready
  pairwiseChoices: text("pairwiseChoices").notNull(), // JSON: array of { pair: [dimA, dimB], chosen: dimKey }
  dimScores: text("dimScores").notNull(), // JSON: calibrated scores per dimension
  researchOptIn: boolean("researchOptIn").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PriCalibration = typeof priCalibrations.$inferSelect;
export type InsertPriCalibration = typeof priCalibrations.$inferInsert;

// ═══════════════════════════════════════════════════════════
// FULL-TEXT SEARCH ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * Search index — every indexable piece of content on the site.
 * Uses MySQL FULLTEXT indexes for fast matching.
 */
export const searchIndex = mysqlTable("search_index", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique key for dedup: e.g. "blog:human-operating-system" or "page:/brewsoul/health" */
  contentKey: varchar("content_key", { length: 512 }).notNull().unique(),
  /** Display title */
  title: varchar("title", { length: 512 }).notNull(),
  /** URL path on the site */
  path: varchar("path", { length: 512 }).notNull(),
  /** Short description / excerpt for search results */
  excerpt: text("excerpt"),
  /** Full searchable body text (stripped of HTML/markdown) */
  body: text("body"),
  /** Category for filtering: blog, brewsoul, kava, peptide, humanos, assessment, page, etc. */
  category: varchar("category", { length: 64 }).notNull(),
  /** Optional subcategory */
  subcategory: varchar("subcategory", { length: 128 }),
  /** Comma-separated tags/keywords for boosting */
  tags: text("tags"),
  /** Optional image URL for search result cards */
  imageUrl: text("image_url"),
  /** Boost factor: higher = more important in results (default 1.0) */
  boost: int("boost").default(1).notNull(),
  /** When the source content was last modified */
  contentUpdatedAt: timestamp("content_updated_at").defaultNow().notNull(),
  indexedAt: timestamp("indexed_at").defaultNow().notNull(),
});
export type SearchIndexEntry = typeof searchIndex.$inferSelect;
export type InsertSearchIndexEntry = typeof searchIndex.$inferInsert;

/**
 * Search queries — analytics: what people search for.
 */
export const searchQueries = mysqlTable("search_queries", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 512 }).notNull(),
  resultCount: int("result_count").default(0).notNull(),
  /** Which result the user clicked (null if none) */
  clickedPath: varchar("clicked_path", { length: 512 }),
  sessionId: varchar("session_id", { length: 128 }),
  userId: int("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = typeof searchQueries.$inferInsert;

/**
 * Canon Project — Article v2 Drafts
 * Stores LLM-generated editorial drafts for each article.
 * Originals are NEVER modified. Drafts deploy only by explicit human approval.
 */
export const articleDrafts = mysqlTable("article_drafts", {
  id: int("id").autoincrement().primaryKey(),
  /** Slug of the source article — matches blogData.json slug */
  articleSlug: varchar("article_slug", { length: 256 }).notNull(),
  /** Original article title at time of draft creation */
  originalTitle: varchar("original_title", { length: 512 }).notNull(),
  /** v2 edited content (full prose) */
  v2Content: text("v2_content"),
  /** One-sentence central idea */
  centralIdea: text("central_idea"),
  /** The soul sentence */
  soulSentence: text("soul_sentence"),
  /** JSON scorecard: {opening, momentum, depthReach, quotability, ending} */
  scorecard: text("scorecard"),
  /** JSON: five highest-impact improvements */
  improvements: text("improvements"),
  /** Change log explaining what changed and why */
  changeLog: text("change_log"),
  /** NEW PROSE table — sentences not in original, with justifications */
  newProseTable: text("new_prose_table"),
  /** JSON: three title options */
  titleOptions: text("title_options"),
  /** JSON: three subtitle options */
  subtitleOptions: text("subtitle_options"),
  /** JSON: five pull quotes */
  pullQuotes: text("pull_quotes"),
  /** JSON: three social excerpts */
  socialExcerpts: text("social_excerpts"),
  /** One illustration idea */
  illustrationIdea: text("illustration_idea"),
  /** Journey stage: recognition|machinery|reframe|human_cost|what_compounds */
  journeyStage: varchar("journey_stage", { length: 64 }),
  /** Stage assignment justification from text */
  stageJustification: text("stage_justification"),
  /** The single navigation line for the journey map, in Tony's voice */
  journeyLine: text("journey_line"),
  /** Divergence notes: where this article drifts from the Voice Spec */
  divergenceNotes: text("divergence_notes"),
  /** draft | approved | published | rejected */
  status: varchar("status", { length: 32 }).default("draft").notNull(),
  /** Completed workstreams: comma-separated (edit,journey,divergence) */
  completedWorkstreams: varchar("completed_workstreams", { length: 128 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
  createdBy: int("created_by"),
});
export type ArticleDraft = typeof articleDrafts.$inferSelect;
export type InsertArticleDraft = typeof articleDrafts.$inferInsert;

/**
 * Guest Article Edits — password-protected contributor edits.
 * Allows a named contributor to edit a specific article via a passphrase.
 * The edit is served live and overrides originalContent at render time.
 */
export const guestArticleEdits = mysqlTable("guest_article_edits", {
  id: int("id").autoincrement().primaryKey(),
  /** Slug of the article this edit applies to */
  articleSlug: varchar("article_slug", { length: 256 }).notNull().unique(),
  /** Display name of the contributor */
  contributorName: varchar("contributor_name", { length: 128 }).notNull(),
  /** Bcrypt hash of the passphrase */
  passphraseHash: varchar("passphrase_hash", { length: 256 }).notNull(),
  /** The edited content — replaces originalContent when present */
  content: text("content"),
  /** Whether this edit is currently live */
  isLive: boolean("is_live").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type GuestArticleEdit = typeof guestArticleEdits.$inferSelect;
export type InsertGuestArticleEdit = typeof guestArticleEdits.$inferInsert;

/**
 * Facilitator Index Submissions — anonymous practitioner responses.
 * Each row is one completed submission from a facilitator.
 */
export const facilitatorSubmissions = mysqlTable("facilitator_submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** Anonymous coded identity (e.g. "Cedar-7") */
  codedIdentity: varchar("coded_identity", { length: 128 }),
  /** JSON blob of all 108 item responses {itemId: value} */
  responses: text("responses").notNull(),
  /** JSON blob of pathway/access preferences */
  pathwayResponses: text("pathway_responses"),
  /** Referral consent: did they opt in to a personal intro */
  referralConsent: boolean("referral_consent").default(false).notNull(),
  /** Region for referral matching */
  referralRegion: varchar("referral_region", { length: 256 }),
  /** Contact info if referral consent given */
  referralContact: varchar("referral_contact", { length: 512 }),
  /** ISO country code or timezone hint */
  locale: varchar("locale", { length: 64 }),
  /** Submission status: pending | reviewed | matched */
  status: varchar("status", { length: 32 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FacilitatorSubmission = typeof facilitatorSubmissions.$inferSelect;
export type InsertFacilitatorSubmission = typeof facilitatorSubmissions.$inferInsert;

/**
 * Facilitator Index Votes — "What gets built next" poll.
 */
export const facilitatorVotes = mysqlTable("facilitator_votes", {
  id: int("id").autoincrement().primaryKey(),
  option: varchar("option", { length: 100 }).notNull(),
  voterFingerprint: varchar("voter_fingerprint", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FacilitatorVote = typeof facilitatorVotes.$inferSelect;

/**
 * Facilitator Index Usage — tracks views, completions, and shares.
 * Seeded with 160 baseline views.
 */
export const facilitatorUsage = mysqlTable("facilitator_usage", {
  id: int("id").autoincrement().primaryKey(),
  event: varchar("event", { length: 50 }).notNull(), // 'view' | 'complete' | 'share'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FacilitatorUsageEvent = typeof facilitatorUsage.$inferSelect;

/**
 * Three Friends Permission Gate — Sessions
 * One session per seeker. Holds 3 friend slots.
 * Status: pending (waiting for friends) | open (all responded or timeout) | blocked (majority said wait)
 */
export const friendGateSessions = mysqlTable("friend_gate_sessions", {
  id: int("id").autoincrement().primaryKey(),
  /** Seeker's PRI session ID or anonymous session token */
  seekerToken: varchar("seeker_token", { length: 128 }).notNull().unique(),
  /** Optional: link to a PRI assessment session */
  priSessionId: int("pri_session_id"),
  /** Seeker's first name (for friend email copy) */
  seekerName: varchar("seeker_name", { length: 128 }),
  /** Gate status */
  status: mysqlEnum("status", ["pending", "open", "blocked"]).default("pending").notNull(),
  /** When all 3 responded or timeout fired */
  resolvedAt: timestamp("resolved_at"),
  /** 72-hour expiry from creation */
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FriendGateSession = typeof friendGateSessions.$inferSelect;
export type InsertFriendGateSession = typeof friendGateSessions.$inferInsert;

/**
 * Three Friends Permission Gate — Slots
 * One row per friend (3 per session).
 */
export const friendGateSlots = mysqlTable("friend_gate_slots", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("session_id").notNull(),
  /** 0, 1, 2 */
  slotIndex: int("slot_index").notNull(),
  /** Friend's display name (provided by seeker) */
  friendName: varchar("friend_name", { length: 128 }),
  /** 'email' | 'phone' */
  contactType: varchar("contact_type", { length: 16 }).notNull(),
  /** Actual email or phone (stored for sending only, never shown to seeker) */
  contactValue: varchar("contact_value", { length: 320 }).notNull(),
  /** SHA-256 hash of contactValue — permanent identity record */
  contactHash: varchar("contact_hash", { length: 64 }).notNull(),
  /** Unique survey access token (in the link sent to friend) */
  surveyToken: varchar("survey_token", { length: 128 }).notNull().unique(),
  /** Bcrypt hash of 6-digit OTP */
  otpHash: varchar("otp_hash", { length: 256 }),
  otpExpiresAt: timestamp("otp_expires_at"),
  /** Whether friend verified their identity via OTP */
  verified: boolean("verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  /** JSON blob of 6 survey question responses */
  surveyResponse: text("survey_response"),
  /** Overall verdict: 'support' | 'wait' | 'unsure' */
  verdict: mysqlEnum("verdict", ["support", "wait", "unsure"]),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type FriendGateSlot = typeof friendGateSlots.$inferSelect;
export type InsertFriendGateSlot = typeof friendGateSlots.$inferInsert;

// ── Post-Intervention Assessment ─────────────────────────────────────────────
export const postInterventionAssessments = mysqlTable("post_intervention_assessments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionToken: varchar("session_token", { length: 128 }).notNull(),
  dayChoice: int("day_choice").notNull(),
  facilitatorRef: varchar("facilitator_ref", { length: 256 }),
  interventionType: mysqlEnum("intervention_type", ["psychedelic", "meditation", "breathwork", "ceremony", "other"]).default("psychedelic").notNull(),
  integrationScore: int("integration_score"),
  safetyScore: int("safety_score"),
  trustScore: int("trust_score"),
  wouldRecommend: mysqlEnum("would_recommend", ["yes", "no", "unsure"]),
  responses: text("responses"),
  wentWell: text("went_well"),
  couldImprove: text("could_improve"),
  messageToFacilitator: text("message_to_facilitator"),
  notified: boolean("notified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type PostInterventionAssessment = typeof postInterventionAssessments.$inferSelect;
export type InsertPostInterventionAssessment = typeof postInterventionAssessments.$inferInsert;
