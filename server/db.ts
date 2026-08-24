import { eq, and, desc, sql, count, sum, gte, isNotNull, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, riddleAttempts, riddleSolvers, shareEvents, pageViews, emailSubscribers, blogRatings, postReactions, fauxTonyChats, clockKeeperResponses, InsertClockKeeperResponse, engagementAudits, InsertEngagementAudit, vendorIntake, InsertVendorIntake, VendorIntake, priConsents, InsertPriConsent, priCorrections, InsertPriCorrection, cheshireSubmissions, InsertCheshireSubmission, spamReports, InsertSpamReport, spamPageViews, InsertSpamPageView, spamForwards, InsertSpamForward, notifications, notificationReads, readingStreaks, highlights, sharedConversations, microCommitments, dailyProvocations, referrals, referralCodes, shortUrls, articleReadCounts, blogComments, InsertBlogComment, priCalibrations, guestArticleEdits } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Riddle Queries ──

export async function recordRiddleAttempt(userId: number, postSlug: string, attemptNum: number, answer: string, correct: boolean) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(riddleAttempts).values({ userId, postSlug, attempt: attemptNum, answer, correct }).$returningId();
  if (correct) {
    await db.insert(riddleSolvers).values({ userId, postSlug, solvedOnAttempt: attemptNum });
  }
  return result;
}

export async function getUserRiddleAttempts(userId: number, postSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(riddleAttempts).where(and(eq(riddleAttempts.userId, userId), eq(riddleAttempts.postSlug, postSlug))).orderBy(riddleAttempts.attempt);
}

export async function getRiddleLeaderboard(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const results = await db
    .select({
      userId: riddleSolvers.userId,
      solved: count(riddleSolvers.id),
    })
    .from(riddleSolvers)
    .groupBy(riddleSolvers.userId)
    .orderBy(desc(count(riddleSolvers.id)))
    .limit(limit);
  
  // Enrich with user names
  const enriched = [];
  for (const r of results) {
    const [user] = await db.select({ name: users.name }).from(users).where(eq(users.id, r.userId)).limit(1);
    enriched.push({ userId: r.userId, name: user?.name || 'Anonymous', solved: Number(r.solved) });
  }
  return enriched;
}

// ── Share Queries ──

export async function recordShare(postSlug: string, shareType: string, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(shareEvents).values({ postSlug, shareType, userId: userId ?? null }).$returningId();
  return result;
}

export async function getShareCounts(postSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ shareType: shareEvents.shareType, count: count(shareEvents.id) })
    .from(shareEvents)
    .where(eq(shareEvents.postSlug, postSlug))
    .groupBy(shareEvents.shareType);
}

export async function getShareAnalytics(days: number = 30) {
  const db = await getDb();
  if (!db) return { totalShares: 0, byPlatform: [], byPost: [], dailyTrend: [] };
  const since = new Date(Date.now() - days * 86400000);

  // Total shares in period
  const [total] = await db
    .select({ totalShares: count(shareEvents.id) })
    .from(shareEvents)
    .where(gte(shareEvents.createdAt, since));

  // Shares by platform
  const byPlatform = await db
    .select({
      shareType: shareEvents.shareType,
      count: count(shareEvents.id),
    })
    .from(shareEvents)
    .where(gte(shareEvents.createdAt, since))
    .groupBy(shareEvents.shareType)
    .orderBy(sql`COUNT(${shareEvents.id}) DESC`);

  // Top shared posts
  const byPost = await db
    .select({
      postSlug: shareEvents.postSlug,
      count: count(shareEvents.id),
    })
    .from(shareEvents)
    .where(gte(shareEvents.createdAt, since))
    .groupBy(shareEvents.postSlug)
    .orderBy(sql`COUNT(${shareEvents.id}) DESC`)
    .limit(25);

  // Daily share trend
  const dailyTrend = await db
    .select({
      date: sql<string>`DATE(${shareEvents.createdAt})`,
      count: count(shareEvents.id),
    })
    .from(shareEvents)
    .where(gte(shareEvents.createdAt, since))
    .groupBy(sql`DATE(${shareEvents.createdAt})`)
    .orderBy(sql`DATE(${shareEvents.createdAt})`);

  return {
    totalShares: Number(total?.totalShares || 0),
    byPlatform,
    byPost,
    dailyTrend,
  };
}

// ── Analytics Queries ──

export async function recordPageView(data: {
  path: string;
  postSlug?: string;
  sessionId: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  // Bot scoring — pattern-match userAgent
  const ua = (data.userAgent || "").toLowerCase();
  const BOT_UA_STRINGS = [
    "bot", "crawl", "spider", "slurp", "fetch", "scan",
    "python-requests", "go-http-client", "java/", "libwww",
    "curl/", "wget/", "httpclient", "okhttp", "axios/",
    "scrapy", "mechanize", "phantom", "headless",
    "bytespider", "petalbot", "semrush", "ahref", "mj12",
    "dotbot", "rogerbot", "yandex", "baiduspider", "sogou",
    "gptbot", "chatgpt-user", "claudebot", "anthropic-ai", "perplexitybot",
    "googlebot", "bingbot", "duckduckbot", "applebot",
    "facebookexternalhit", "twitterbot", "linkedinbot",
    "ccbot", "google-extended", "oai-searchbot",
  ];
  const isBot = BOT_UA_STRINGS.some(s => ua.includes(s)) ? 1 : 0;
  const [result] = await db.insert(pageViews).values({
    path: data.path,
    postSlug: data.postSlug ?? null,
    sessionId: data.sessionId,
    referrer: data.referrer ?? null,
    userAgent: data.userAgent ?? null,
    isBot,
    country: data.country ?? null,
  }).$returningId();
  return result;
}

export async function updateReadTime(pageViewId: number, readTimeMs: number, scrollDepth: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(pageViews).set({ readTimeMs, scrollDepth }).where(eq(pageViews.id, pageViewId));
}

export async function getPostAnalytics(postSlug: string) {
  const db = await getDb();
  if (!db) return { views: 0, avgReadTime: 0, avgScrollDepth: 0 };
  const [stats] = await db
    .select({
      views: count(pageViews.id),
      totalReadTime: sum(pageViews.readTimeMs),
      totalScrollDepth: sum(pageViews.scrollDepth),
    })
    .from(pageViews)
    .where(eq(pageViews.postSlug, postSlug));
  const views = Number(stats?.views || 0);
  return {
    views,
    avgReadTime: views > 0 ? Math.round(Number(stats?.totalReadTime || 0) / views / 1000) : 0,
    avgScrollDepth: views > 0 ? Math.round(Number(stats?.totalScrollDepth || 0) / views) : 0,
  };
}

// ── Analytics Dashboard Queries ──

export async function getAnalyticsDashboard(days: number = 30) {
  const db = await getDb();
  if (!db) return null;
  const since = new Date(Date.now() - days * 86400000);

  // Total views + unique sessions in period
  const [summary] = await db
    .select({
      totalViews: count(pageViews.id),
      uniqueSessions: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
      uniquePaths: sql<number>`COUNT(DISTINCT ${pageViews.path})`,
      avgReadTime: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.readTimeMs} > 0 THEN ${pageViews.readTimeMs} ELSE NULL END) / 1000)`,
      avgScrollDepth: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.scrollDepth} > 0 THEN ${pageViews.scrollDepth} ELSE NULL END))`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since));

  // Top pages by views
  const topPages = await db
    .select({
      path: pageViews.path,
      views: count(pageViews.id),
      uniqueVisitors: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
      avgReadTimeSec: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.readTimeMs} > 0 THEN ${pageViews.readTimeMs} ELSE NULL END) / 1000)`,
      avgScrollPct: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.scrollDepth} > 0 THEN ${pageViews.scrollDepth} ELSE NULL END))`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(pageViews.path)
    .orderBy(sql`COUNT(${pageViews.id}) DESC`)
    .limit(50);

  // Daily views trend
  const dailyViews = await db
    .select({
      date: sql<string>`DATE(${pageViews.createdAt})`,
      views: count(pageViews.id),
      sessions: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`DATE(${pageViews.createdAt})`)
    .orderBy(sql`DATE(${pageViews.createdAt})`);

  // Top referrers
  const topReferrers = await db
    .select({
      referrer: pageViews.referrer,
      views: count(pageViews.id),
    })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), isNotNull(pageViews.referrer), sql`${pageViews.referrer} != ''`))
    .groupBy(pageViews.referrer)
    .orderBy(sql`COUNT(${pageViews.id}) DESC`)
    .limit(20);

  // Hourly distribution
  const hourlyDistribution = await db
    .select({
      hour: sql<number>`HOUR(${pageViews.createdAt})`,
      views: count(pageViews.id),
    })
    .from(pageViews)
    .where(gte(pageViews.createdAt, since))
    .groupBy(sql`HOUR(${pageViews.createdAt})`)
    .orderBy(sql`HOUR(${pageViews.createdAt})`);

  // Human-only metrics
  const humanFilter = and(gte(pageViews.createdAt, since), sql`${pageViews.isBot} = 0`);
  const [humanSummary] = await db
    .select({
      totalViews: count(pageViews.id),
      uniqueSessions: sql<number>`COUNT(DISTINCT ${pageViews.sessionId})`,
      avgReadTime: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.readTimeMs} > 0 THEN ${pageViews.readTimeMs} ELSE NULL END) / 1000)`,
      avgScrollDepth: sql<number>`ROUND(AVG(CASE WHEN ${pageViews.scrollDepth} > 0 THEN ${pageViews.scrollDepth} ELSE NULL END))`,
      engagedSessions: sql<number>`COUNT(DISTINCT CASE WHEN ${pageViews.readTimeMs} >= 45000 OR ${pageViews.scrollDepth} >= 50 THEN ${pageViews.sessionId} END)`,
    })
    .from(pageViews)
    .where(humanFilter);

  // Second-page rate
  const sessionPageCounts = await db
    .select({
      sessionId: pageViews.sessionId,
      pageCount: sql<number>`COUNT(${pageViews.id})`,
    })
    .from(pageViews)
    .where(humanFilter)
    .groupBy(pageViews.sessionId);
  const totalHumanSessions = sessionPageCounts.length;
  const secondPageSessions = sessionPageCounts.filter((s: any) => Number(s.pageCount) >= 2).length;
  const secondPageRate = totalHumanSessions > 0 ? Math.round((secondPageSessions / totalHumanSessions) * 100) : 0;

  // Bot count
  const [botCount] = await db
    .select({ bots: count(pageViews.id) })
    .from(pageViews)
    .where(and(gte(pageViews.createdAt, since), sql`${pageViews.isBot} = 1`));

  return {
    summary: {
      totalViews: Number(summary?.totalViews || 0),
      uniqueSessions: Number(summary?.uniqueSessions || 0),
      uniquePaths: Number(summary?.uniquePaths || 0),
      avgReadTimeSec: Number(summary?.avgReadTime || 0),
      avgScrollDepth: Number(summary?.avgScrollDepth || 0),
    },
    humanSummary: {
      totalViews: Number(humanSummary?.totalViews || 0),
      uniqueSessions: Number(humanSummary?.uniqueSessions || 0),
      avgReadTimeSec: Number(humanSummary?.avgReadTime || 0),
      avgScrollDepth: Number(humanSummary?.avgScrollDepth || 0),
      engagedSessions: Number(humanSummary?.engagedSessions || 0),
      secondPageRate,
      botViews: Number(botCount?.bots || 0),
    },
    topPages: topPages.map(p => ({
      path: p.path,
      views: Number(p.views),
      uniqueVisitors: Number(p.uniqueVisitors),
      avgReadTimeSec: Number(p.avgReadTimeSec || 0),
      avgScrollPct: Number(p.avgScrollPct || 0),
    })),
    dailyViews: dailyViews.map(d => ({
      date: String(d.date),
      views: Number(d.views),
      sessions: Number(d.sessions),
    })),
    topReferrers: topReferrers.map(r => ({
      referrer: r.referrer || "(direct)",
      views: Number(r.views),
    })),
    hourlyDistribution: hourlyDistribution.map(h => ({
      hour: Number(h.hour),
      views: Number(h.views),
    })),
  };
}

// ── Email Subscriber Queries ──

export async function addEmailSubscriber(email: string, source: string) {
  const db = await getDb();
  if (!db) return null;
  try {
    const [result] = await db.insert(emailSubscribers).values({ email, source }).$returningId();
    return result;
  } catch (err: any) {
    if (err?.code === 'ER_DUP_ENTRY') return { id: -1 }; // already subscribed
    throw err;
  }
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count(emailSubscribers.id) }).from(emailSubscribers);
  return Number(result?.count || 0);
}

// ── Blog Rating Queries ──

export async function recordBlogRating(postSlug: string, rating: string, sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(blogRatings).values({ postSlug, rating, sessionId }).$returningId();
  return result;
}

export async function getBlogRatings(postSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ rating: blogRatings.rating, count: count(blogRatings.id) })
    .from(blogRatings)
    .where(eq(blogRatings.postSlug, postSlug))
    .groupBy(blogRatings.rating);
}

// ── Post Reaction Queries ──

export async function addPostReaction(postSlug: string, reaction: "up" | "down" | "neutral", sessionId: string, comment?: string, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(postReactions).values({
    postSlug,
    reaction,
    comment: comment ?? null,
    sessionId,
    userId: userId ?? null,
  }).$returningId();
  return result;
}

export async function getPostReactions(postSlug: string) {
  const db = await getDb();
  if (!db) return { up: 0, down: 0, neutral: 0, total: 0, comments: [] as { reaction: string; comment: string; createdAt: Date }[] };
  const counts = await db
    .select({ reaction: postReactions.reaction, count: count(postReactions.id) })
    .from(postReactions)
    .where(eq(postReactions.postSlug, postSlug))
    .groupBy(postReactions.reaction);
  const breakdown: Record<string, number> = { up: 0, down: 0, neutral: 0 };
  for (const c of counts) breakdown[c.reaction] = Number(c.count);
  const total = breakdown.up + breakdown.down + breakdown.neutral;

  // Get recent comments (last 20)
  const comments = await db
    .select({
      reaction: postReactions.reaction,
      comment: postReactions.comment,
      createdAt: postReactions.createdAt,
    })
    .from(postReactions)
    .where(and(eq(postReactions.postSlug, postSlug), sql`${postReactions.comment} IS NOT NULL AND ${postReactions.comment} != ''`))
    .orderBy(desc(postReactions.createdAt))
    .limit(20);

  return { ...breakdown, total, comments: comments as { reaction: string; comment: string; createdAt: Date }[] };
}

export async function hasSessionReacted(postSlug: string, sessionId: string) {
  const db = await getDb();
  if (!db) return null;
  const [existing] = await db
    .select({ id: postReactions.id, reaction: postReactions.reaction })
    .from(postReactions)
    .where(and(eq(postReactions.postSlug, postSlug), eq(postReactions.sessionId, sessionId)))
    .limit(1);
  return existing ?? null;
}

// ── FauxTony Chat Queries ──

export async function saveFauxTonyMessage(sessionId: string, role: "user" | "assistant", content: string, questionNumber?: number, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(fauxTonyChats).values({
    sessionId,
    userId: userId ?? null,
    role,
    content,
    questionNumber: questionNumber ?? null,
  }).$returningId();
  return result;
}

export async function getFauxTonyChatHistory(sessionId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      role: fauxTonyChats.role,
      content: fauxTonyChats.content,
      questionNumber: fauxTonyChats.questionNumber,
      createdAt: fauxTonyChats.createdAt,
    })
    .from(fauxTonyChats)
    .where(eq(fauxTonyChats.sessionId, sessionId))
    .orderBy(fauxTonyChats.createdAt)
    .limit(limit);
}

export async function getFauxTonyQuestionCount(sessionId: string) {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db
    .select({ count: count(fauxTonyChats.id) })
    .from(fauxTonyChats)
    .where(and(eq(fauxTonyChats.sessionId, sessionId), eq(fauxTonyChats.role, "user")));
  return Number(result?.count || 0);
}

// ── Chat Digest (for daily summary) ──

export async function getRecentChatSessions(sinceHoursAgo: number = 24) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date(Date.now() - sinceHoursAgo * 60 * 60 * 1000);
  // Get all messages from the past N hours, grouped by session
  const messages = await db
    .select({
      sessionId: fauxTonyChats.sessionId,
      role: fauxTonyChats.role,
      content: fauxTonyChats.content,
      createdAt: fauxTonyChats.createdAt,
    })
    .from(fauxTonyChats)
    .where(gte(fauxTonyChats.createdAt, since))
    .orderBy(fauxTonyChats.createdAt);

  // Group by session
  const sessions = new Map<string, Array<{ role: string; content: string; createdAt: Date }>>(); 
  for (const msg of messages) {
    if (!sessions.has(msg.sessionId)) sessions.set(msg.sessionId, []);
    sessions.get(msg.sessionId)!.push({ role: msg.role, content: msg.content, createdAt: msg.createdAt });
  }
  return Array.from(sessions.entries()).map(([sessionId, msgs]) => ({ sessionId, messages: msgs }));
}

// ── Assessment Results ──

export async function saveAssessmentResult(
  assessmentType: string,
  sessionId: string,
  answers: string,
  resultSummary: string,
  totalScore: number | null,
  userId?: number,
  sharedWithTony?: boolean,
  userName?: string,
  userEmail?: string,
) {
  const db = await getDb();
  if (!db) return null;
  const { assessmentResults } = await import("../drizzle/schema");
  const [result] = await db.insert(assessmentResults).values({
    assessmentType: assessmentType as any,
    sessionId,
    userId: userId ?? null,
    answers,
    resultSummary,
    totalScore,
    sharedWithTony: sharedWithTony ?? false,
    userName: userName ?? null,
    userEmail: userEmail ?? null,
  }).$returningId();
  return result;
}

export async function getAssessmentHistory(
  assessmentType: string,
  sessionId: string,
) {
  const db = await getDb();
  if (!db) return [];
  const { assessmentResults } = await import("../drizzle/schema");
  const { eq, and, desc } = await import("drizzle-orm");
  return db.select().from(assessmentResults)
    .where(and(
      eq(assessmentResults.assessmentType, assessmentType as any),
      eq(assessmentResults.sessionId, sessionId),
    ))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(20);
}

export async function getAssessmentHistoryByUser(
  assessmentType: string,
  userId: number,
) {
  const db = await getDb();
  if (!db) return [];
  const { assessmentResults } = await import("../drizzle/schema");
  const { eq, and, desc } = await import("drizzle-orm");
  return db.select().from(assessmentResults)
    .where(and(
      eq(assessmentResults.assessmentType, assessmentType as any),
      eq(assessmentResults.userId, userId),
    ))
    .orderBy(desc(assessmentResults.createdAt))
    .limit(20);
}

// ── MANIFESTO ──

export async function saveManifestoResponse(data: {
  userId?: number | null;
  name?: string;
  email?: string;
  biggestChallenge?: string;
  whatToMeasure?: string;
  referenceSites?: string;
  newIndices?: string;
  howToParticipate?: string;
  abundantLife?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { manifestoResponses } = await import("../drizzle/schema");
  const result = await db.insert(manifestoResponses).values({
    userId: data.userId ?? undefined,
    name: data.name || null,
    email: data.email || null,
    biggestChallenge: data.biggestChallenge || null,
    whatToMeasure: data.whatToMeasure || null,
    referenceSites: data.referenceSites || null,
    newIndices: data.newIndices || null,
    howToParticipate: data.howToParticipate || null,
    abundantLife: data.abundantLife || null,
  });
  return result;
}

// ── COMMUNITY ──

export async function upsertCommunityMember(data: {
  userId: number;
  displayName: string;
  bio?: string;
  lookingFor?: string[];
  interests?: string[];
  location?: string;
  website?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { communityMembers } = await import("../drizzle/schema");
  const existing = await db.select().from(communityMembers).where(eq(communityMembers.userId, data.userId)).limit(1);
  if (existing.length > 0) {
    await db.update(communityMembers).set({
      displayName: data.displayName,
      bio: data.bio || null,
      lookingFor: data.lookingFor ? JSON.stringify(data.lookingFor) : null,
      interests: data.interests ? JSON.stringify(data.interests) : null,
      location: data.location || null,
      website: data.website || null,
    }).where(eq(communityMembers.userId, data.userId));
    return existing[0];
  }
  await db.insert(communityMembers).values({
    userId: data.userId,
    displayName: data.displayName,
    bio: data.bio || null,
    lookingFor: data.lookingFor ? JSON.stringify(data.lookingFor) : null,
    interests: data.interests ? JSON.stringify(data.interests) : null,
    location: data.location || null,
    website: data.website || null,
  });
  const newMember = await db.select().from(communityMembers).where(eq(communityMembers.userId, data.userId)).limit(1);
  return newMember[0] || null;
}

export async function getCommunityMember(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const { communityMembers } = await import("../drizzle/schema");
  const result = await db.select().from(communityMembers).where(eq(communityMembers.userId, userId)).limit(1);
  return result[0] || null;
}

export async function getCommunityMembers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  const { communityMembers } = await import("../drizzle/schema");
  return db.select().from(communityMembers).orderBy(desc(communityMembers.joinedAt)).limit(limit).offset(offset);
}

export async function uploadContacts(userId: number, contacts: Array<{
  name: string;
  email?: string;
  phone?: string;
  relationship?: string;
  note?: string;
}>) {
  const db = await getDb();
  if (!db) return [];
  const { communityContacts } = await import("../drizzle/schema");
  const values = contacts.map(c => ({
    uploadedBy: userId,
    name: c.name,
    email: c.email || null,
    phone: c.phone || null,
    relationship: c.relationship || null,
    note: c.note || null,
  }));
  await db.insert(communityContacts).values(values);
  return values;
}

export async function getMyContacts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { communityContacts } = await import("../drizzle/schema");
  return db.select().from(communityContacts).where(eq(communityContacts.uploadedBy, userId)).orderBy(desc(communityContacts.createdAt));
}

export async function sendInvitation(data: {
  inviterId: number;
  contactId?: number;
  email: string;
  message?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { communityInvitations, communityContacts } = await import("../drizzle/schema");
  const inviteCode = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  await db.insert(communityInvitations).values({
    inviterId: data.inviterId,
    contactId: data.contactId ?? undefined,
    email: data.email,
    inviteCode,
    message: data.message || null,
  });
  if (data.contactId) {
    await db.update(communityContacts).set({
      invited: true,
      invitedAt: new Date(),
    }).where(eq(communityContacts.id, data.contactId));
  }
  return inviteCode;
}

export async function getMyInvitations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { communityInvitations } = await import("../drizzle/schema");
  return db.select().from(communityInvitations).where(eq(communityInvitations.inviterId, userId)).orderBy(desc(communityInvitations.sentAt));
}

export async function getCommunityStats() {
  const db = await getDb();
  if (!db) return { members: 0, contacts: 0, invitations: 0 };
  const { communityMembers, communityContacts, communityInvitations } = await import("../drizzle/schema");
  const [membersResult] = await db.select({ count: count() }).from(communityMembers);
  const [contactsResult] = await db.select({ count: count() }).from(communityContacts);
  const [invitesResult] = await db.select({ count: count() }).from(communityInvitations);
  return {
    members: membersResult?.count || 0,
    contacts: contactsResult?.count || 0,
    invitations: invitesResult?.count || 0,
  };
}

/* ── Journey Progress ── */

export async function getJourneyProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { journeyProgress } = await import("../drizzle/schema");
  return db.select().from(journeyProgress).where(eq(journeyProgress.userId, userId));
}

export async function saveJourneyCompletion(userId: number, experienceId: string, resultData?: string) {
  const db = await getDb();
  if (!db) return null;
  const { journeyProgress } = await import("../drizzle/schema");
  // Check if already exists
  const existing = await db.select().from(journeyProgress)
    .where(and(eq(journeyProgress.userId, userId), eq(journeyProgress.experienceId, experienceId)));
  if (existing.length > 0) {
    // Update resultData if provided
    if (resultData) {
      await db.update(journeyProgress)
        .set({ resultData })
        .where(eq(journeyProgress.id, existing[0].id));
    }
    return existing[0];
  }
  const [result] = await db.insert(journeyProgress).values({
    userId,
    experienceId,
    resultData: resultData || null,
  }).$returningId();
  return result;
}

export async function syncJourneyFromLocal(userId: number, completedIds: string[], resultDataMap?: Record<string, string>) {
  const db = await getDb();
  if (!db) return [];
  const { journeyProgress } = await import("../drizzle/schema");
  // Get existing DB progress
  const existing = await db.select().from(journeyProgress).where(eq(journeyProgress.userId, userId));
  const existingIds = new Set(existing.map(e => e.experienceId));
  // Insert any that are in localStorage but not in DB
  const toInsert = completedIds.filter(id => !existingIds.has(id));
  for (const id of toInsert) {
    await db.insert(journeyProgress).values({
      userId,
      experienceId: id,
      resultData: resultDataMap?.[id] || null,
    });
  }
  // Return the full merged set
  return db.select().from(journeyProgress).where(eq(journeyProgress.userId, userId));
}

export async function removeJourneyCompletion(userId: number, experienceId: string) {
  const db = await getDb();
  if (!db) return;
  const { journeyProgress } = await import("../drizzle/schema");
  await db.delete(journeyProgress)
    .where(and(eq(journeyProgress.userId, userId), eq(journeyProgress.experienceId, experienceId)));
}


// ── Clock Keeper Responses ──

export async function saveClockKeeperResponse(data: Omit<InsertClockKeeperResponse, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(clockKeeperResponses).values(data).$returningId();
  return result;
}

export async function getClockKeeperResponses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clockKeeperResponses).orderBy(desc(clockKeeperResponses.createdAt));
}

export async function getClockKeeperResponseCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count() }).from(clockKeeperResponses);
  return result?.count ?? 0;
}

// ── Engagement Audits ──

export async function saveEngagementAudit(data: Omit<InsertEngagementAudit, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(engagementAudits).values(data).$returningId();
  return result;
}

export async function getEngagementAudits() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(engagementAudits).orderBy(desc(engagementAudits.createdAt));
}

export async function getEngagementAuditCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count() }).from(engagementAudits);
  return result?.count ?? 0;
}

// ── Vendor Intake (Two-Stage) ──

export async function createVendorIntakeStage1(
  data: Omit<InsertVendorIntake, "id" | "createdAt" | "updatedAt" | "stage" | "adminStatus">
) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(vendorIntake).values({
    ...data,
    stage: "stage1_submitted",
    adminStatus: "new",
  }).$returningId();
  return result;
}

export async function getVendorIntakeByToken(token: string): Promise<VendorIntake | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(vendorIntake).where(eq(vendorIntake.stage2Token, token)).limit(1);
  return rows[0] ?? null;
}

export async function getVendorIntakeBySupplierId(supplierId: string): Promise<VendorIntake | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(vendorIntake).where(eq(vendorIntake.supplierId, supplierId)).limit(1);
  return rows[0] ?? null;
}

export async function updateVendorIntakeStage2(
  token: string,
  data: Partial<Omit<InsertVendorIntake, "id" | "supplierId" | "stage2Token" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) return null;
  await db.update(vendorIntake).set({ ...data, updatedAt: new Date() }).where(eq(vendorIntake.stage2Token, token));
  return true;
}

export async function getAllVendorIntake() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendorIntake).orderBy(desc(vendorIntake.createdAt));
}

export async function getVendorIntakeCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count() }).from(vendorIntake);
  return result?.count ?? 0;
}

export async function updateVendorIntakeAdminStatus(
  supplierId: string,
  adminStatus: VendorIntake["adminStatus"],
  adminNotes?: string
) {
  const db = await getDb();
  if (!db) return null;
  await db.update(vendorIntake)
    .set({ adminStatus, ...(adminNotes !== undefined ? { adminNotes } : {}), updatedAt: new Date() })
    .where(eq(vendorIntake.supplierId, supplierId));
  return true;
}

// ── PRI Consent ──

export async function savePriConsent(data: Omit<InsertPriConsent, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(priConsents).values(data).$returningId();
  return result;
}

export async function hasPriConsent(sessionId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const [result] = await db.select({ count: count() }).from(priConsents).where(eq(priConsents.sessionId, sessionId));
  return (result?.count ?? 0) > 0;
}

// ── PRI Community Corrections ──

export async function savePriCorrection(data: Omit<InsertPriCorrection, "id" | "createdAt" | "updatedAt" | "status" | "adminNotes">) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(priCorrections).values(data).$returningId();
  return result;
}

export async function getPriCorrections(status?: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(priCorrections).where(eq(priCorrections.status, status)).orderBy(desc(priCorrections.createdAt));
  }
  return db.select().from(priCorrections).orderBy(desc(priCorrections.createdAt));
}

export async function getPriCorrectionCount() {
  const db = await getDb();
  if (!db) return 0;
  const [result] = await db.select({ count: count() }).from(priCorrections);
  return result?.count ?? 0;
}

/* ── CheshireGrin Submissions ── */

export async function createCheshireSubmission(data: InsertCheshireSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cheshireSubmissions).values(data);
  return result;
}

export async function listCheshireSubmissions(status?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (status) {
    return db.select().from(cheshireSubmissions).where(eq(cheshireSubmissions.status, status as any)).orderBy(desc(cheshireSubmissions.createdAt));
  }
  return db.select().from(cheshireSubmissions).orderBy(desc(cheshireSubmissions.createdAt));
}

export async function updateCheshireSubmissionStatus(id: number, status: "new" | "reviewed" | "actionable" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(cheshireSubmissions).set({ status }).where(eq(cheshireSubmissions.id, id));
}

export async function getCheshireSubmissionStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const all = await db.select().from(cheshireSubmissions);
  const total = all.length;
  const byCity: Record<string, number> = {};
  const byRelationship: Record<string, number> = {};
  const withDocs = all.filter(s => s.hasDocumentation && !s.hasDocumentation.toLowerCase().includes("no")).length;
  for (const s of all) {
    if (s.city) byCity[s.city] = (byCity[s.city] || 0) + 1;
    byRelationship[s.relationship] = (byRelationship[s.relationship] || 0) + 1;
  }
  return { total, byCity, byRelationship, withDocs, pctWithDocs: total > 0 ? Math.round((withDocs / total) * 100) : 0 };
}

// ── Spam Report Queries ──

export async function submitSpamReport(data: {
  companyName: string;
  senderEmail: string;
  spamType: "cold-outreach" | "unsolicited-newsletter" | "ai-generated-spam" | "phishing-scam";
  frequency: "one-time" | "weekly" | "daily" | "multiple-daily";
  description: string;
  reporterEmail?: string;
  ipHash?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(spamReports).values({
    companyName: data.companyName,
    senderEmail: data.senderEmail,
    spamType: data.spamType,
    frequency: data.frequency,
    description: data.description,
    reporterEmail: data.reporterEmail ?? null,
    ipHash: data.ipHash ?? null,
  }).$returningId();
  return result;
}

export async function getWallOfShame(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  const results = await db
    .select({
      companyName: spamReports.companyName,
      reportCount: count(spamReports.id),
      latestReport: sql<Date>`MAX(${spamReports.createdAt})`,
      worstType: sql<string>`(
        SELECT sr2.spamType FROM spam_reports sr2 
        WHERE sr2.companyName = ${spamReports.companyName} 
        GROUP BY sr2.spamType 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
      )`,
      worstFrequency: sql<string>`(
        SELECT sr3.frequency FROM spam_reports sr3 
        WHERE sr3.companyName = ${spamReports.companyName} 
        GROUP BY sr3.frequency 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
      )`,
    })
    .from(spamReports)
    .groupBy(spamReports.companyName)
    .orderBy(desc(count(spamReports.id)))
    .limit(limit);
  return results.map(r => ({
    companyName: r.companyName,
    reportCount: Number(r.reportCount),
    latestReport: r.latestReport,
    worstType: r.worstType,
    worstFrequency: r.worstFrequency,
  }));
}

export async function getSpamReportsByCompany(companyName: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: spamReports.id,
      senderEmail: spamReports.senderEmail,
      spamType: spamReports.spamType,
      frequency: spamReports.frequency,
      description: spamReports.description,
      createdAt: spamReports.createdAt,
    })
    .from(spamReports)
    .where(eq(spamReports.companyName, companyName))
    .orderBy(desc(spamReports.createdAt));
}

export async function getSpamReportStats() {
  const db = await getDb();
  if (!db) return { totalReports: 0, uniqueCompanies: 0, topType: "cold-outreach" };
  const [stats] = await db
    .select({
      totalReports: count(spamReports.id),
      uniqueCompanies: sql<number>`COUNT(DISTINCT ${spamReports.companyName})`,
    })
    .from(spamReports);
  return {
    totalReports: Number(stats?.totalReports || 0),
    uniqueCompanies: Number(stats?.uniqueCompanies || 0),
  };
}

// ── Spam Page View Tracking ──

export async function trackSpamPageView(data: {
  company?: string;
  domain?: string;
  email?: string;
  ipHash?: string;
  userAgent?: string;
  referer?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Check if this company/domain combo already has a view record
  const key = data.company || data.domain || data.email || "anonymous";
  const existing = await db
    .select()
    .from(spamPageViews)
    .where(
      and(
        data.company ? eq(spamPageViews.company, data.company) : sql`1=1`,
        data.domain ? eq(spamPageViews.domain, data.domain) : sql`1=1`,
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Increment view count
    await db
      .update(spamPageViews)
      .set({
        viewCount: sql`${spamPageViews.viewCount} + 1`,
        lastViewedAt: new Date(),
        userAgent: data.userAgent || existing[0].userAgent,
      })
      .where(eq(spamPageViews.id, existing[0].id));
    return { ...existing[0], viewCount: existing[0].viewCount + 1 };
  }

  // New view
  const [result] = await db.insert(spamPageViews).values({
    company: data.company || null,
    domain: data.domain || null,
    email: data.email || null,
    ipHash: data.ipHash || null,
    userAgent: data.userAgent || null,
    referer: data.referer || null,
    viewCount: 1,
  }).$returningId();
  return result;
}

export async function getSpamPageViewStats(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(spamPageViews)
    .orderBy(desc(spamPageViews.lastViewedAt))
    .limit(limit);
}

export async function getSpamPageViewByCompany(company: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(spamPageViews)
    .where(eq(spamPageViews.company, company))
    .limit(1);
  return results[0] || null;
}

// ── Spam Email Forwarding ──

export async function saveSpamForward(data: {
  rawSubject?: string;
  rawFrom?: string;
  extractedCompany?: string;
  extractedDomain?: string;
  extractedEmail?: string;
  generatedUrl?: string;
  forwardedBy?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(spamForwards).values({
    rawSubject: data.rawSubject || null,
    rawFrom: data.rawFrom || null,
    extractedCompany: data.extractedCompany || null,
    extractedDomain: data.extractedDomain || null,
    extractedEmail: data.extractedEmail || null,
    generatedUrl: data.generatedUrl || null,
    forwardedBy: data.forwardedBy || null,
    processed: true,
  }).$returningId();
  return result;
}

export async function getSpamForwards(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(spamForwards)
    .orderBy(desc(spamForwards.createdAt))
    .limit(limit);
}

// ── Report Endorsements ──

export async function createReportEndorsement(data: {
  reportSlug: string;
  bkAnswer1: string;
  bkAnswer2: string;
  bkAnswer3: string;
  bkAnswer4: string;
  endorsementStatement: string;
  sessionHash: string;
}) {
  const db = await getDb();
  if (!db) return null;
  const { reportEndorsements } = await import("../drizzle/schema");
  const [result] = await db.insert(reportEndorsements).values(data).$returningId();
  return result;
}

export async function getReportEndorsementCount(reportSlug: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const { reportEndorsements } = await import("../drizzle/schema");
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reportEndorsements)
    .where(eq(reportEndorsements.reportSlug, reportSlug));
  return Number(result?.count ?? 0);
}

export async function hasSessionEndorsed(reportSlug: string, sessionHash: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const { reportEndorsements } = await import("../drizzle/schema");
  const result = await db
    .select({ id: reportEndorsements.id })
    .from(reportEndorsements)
    .where(
      and(
        eq(reportEndorsements.reportSlug, reportSlug),
        eq(reportEndorsements.sessionHash, sessionHash)
      )
    )
    .limit(1);
  return result.length > 0;
}


/* ── Notifications ── */

export async function createNotification(data: {
  type: "broadcast" | "personal";
  category: string;
  title: string;
  message: string;
  link?: string;
  targetUserId?: number;
  createdBy?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(notifications).values(data).$returningId();
  return result;
}

export async function getNotificationsForUser(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  // Get broadcasts + personal notifications for this user
  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      category: notifications.category,
      title: notifications.title,
      message: notifications.message,
      link: notifications.link,
      createdAt: notifications.createdAt,
      readAt: notificationReads.readAt,
    })
    .from(notifications)
    .leftJoin(
      notificationReads,
      and(
        eq(notificationReads.notificationId, notifications.id),
        eq(notificationReads.userId, userId)
      )
    )
    .where(
      or(
        eq(notifications.type, "broadcast"),
        eq(notifications.targetUserId, userId)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
  
  return rows;
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .leftJoin(
      notificationReads,
      and(
        eq(notificationReads.notificationId, notifications.id),
        eq(notificationReads.userId, userId)
      )
    )
    .where(
      and(
        or(
          eq(notifications.type, "broadcast"),
          eq(notifications.targetUserId, userId)
        ),
        isNull(notificationReads.readAt)
      )
    );
  
  return Number(result?.count ?? 0);
}

export async function markNotificationRead(userId: number, notificationId: number) {
  const db = await getDb();
  if (!db) return;
  
  // Upsert — don't duplicate reads
  const existing = await db
    .select({ id: notificationReads.id })
    .from(notificationReads)
    .where(
      and(
        eq(notificationReads.userId, userId),
        eq(notificationReads.notificationId, notificationId)
      )
    )
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(notificationReads).values({ userId, notificationId });
  }
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  // Find all unread notifications for this user
  const unread = await db
    .select({ id: notifications.id })
    .from(notifications)
    .leftJoin(
      notificationReads,
      and(
        eq(notificationReads.notificationId, notifications.id),
        eq(notificationReads.userId, userId)
      )
    )
    .where(
      and(
        or(
          eq(notifications.type, "broadcast"),
          eq(notifications.targetUserId, userId)
        ),
        isNull(notificationReads.readAt)
      )
    );
  
  if (unread.length > 0) {
    await db.insert(notificationReads).values(
      unread.map(n => ({ userId, notificationId: n.id }))
    );
  }
}

export async function listAllNotifications(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) return;
  // Delete reads first, then the notification
  await db.delete(notificationReads).where(eq(notificationReads.notificationId, notificationId));
  await db.delete(notifications).where(eq(notifications.id, notificationId));
}


// ═══════════════════════════════════════════════════════════
// ENGAGEMENT FEATURES — DB Helpers
// ═══════════════════════════════════════════════════════════

// ── 1. Reading Streaks ──
export async function updateReadingStreak(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const today = new Date().toISOString().slice(0, 10);
  const [existing] = await db.select().from(readingStreaks).where(eq(readingStreaks.userId, userId)).limit(1);
  if (!existing) {
    await db.insert(readingStreaks).values({ userId, currentStreak: 1, longestStreak: 1, lastReadDate: today, totalDaysRead: 1 });
    return { currentStreak: 1, longestStreak: 1, totalDaysRead: 1, milestone: null };
  }
  if (existing.lastReadDate === today) return { ...existing, milestone: null }; // already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = existing.lastReadDate === yesterday ? existing.currentStreak + 1 : 1;
  const longest = Math.max(newStreak, existing.longestStreak);
  const totalDays = existing.totalDaysRead + 1;
  await db.update(readingStreaks).set({ currentStreak: newStreak, longestStreak: longest, lastReadDate: today, totalDaysRead: totalDays }).where(eq(readingStreaks.userId, userId));

  // Streak milestone notifications
  let milestone: number | null = null;
  if ([7, 30].includes(newStreak)) {
    milestone = newStreak;
    const milestoneMessages: Record<number, { title: string; message: string; reward: string }> = {
      7: {
        title: "7-Day Reading Streak!",
        message: "You've read for 7 consecutive days. That's rare. As a reward, you've unlocked a hidden essay: 'The Nightstand' — only available to committed readers.",
        reward: "the-nightstand",
      },
      30: {
        title: "30-Day Reading Streak!",
        message: "A month of daily reading. You're in the top 1% of this site's readers. You've unlocked the hidden essay: 'The Open Door' — reserved for those who show up.",
        reward: "the-open-door",
      },
    };
    const msg = milestoneMessages[newStreak];
    if (msg) {
      await createNotification({
        type: "personal",
        category: "streak-milestone",
        title: msg.title,
        message: msg.message,
        link: `/essays/${msg.reward}`,
        targetUserId: userId,
      });
    }
  }
  return { currentStreak: newStreak, longestStreak: longest, totalDaysRead: totalDays, milestone };
}

export async function getReadingStreak(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(readingStreaks).where(eq(readingStreaks.userId, userId)).limit(1);
  return row ?? null;
}

// ── 3. Highlights ──
export async function saveHighlight(userId: number, postSlug: string, text_: string, context?: string) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(highlights).values({ userId, postSlug, text: text_, context: context ?? null }).$returningId();
  return result;
}

export async function getUserHighlights(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(highlights).where(eq(highlights.userId, userId)).orderBy(desc(highlights.createdAt)).limit(limit);
}

export async function deleteHighlight(userId: number, highlightId: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(highlights).where(and(eq(highlights.id, highlightId), eq(highlights.userId, userId)));
  return true;
}

// ── 5. Shared Conversations ──
export async function createSharedConversation(userId: number, sessionId: string, shareId: string, title: string, messageCount: number) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(sharedConversations).values({ shareId, userId, sessionId, title, messageCount });
  return { shareId };
}

export async function getSharedConversation(shareId: string) {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.select().from(sharedConversations).where(eq(sharedConversations.shareId, shareId)).limit(1);
  return row ?? null;
}

export async function incrementShareViewCount(shareId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(sharedConversations).set({ viewCount: sql`${sharedConversations.viewCount} + 1` }).where(eq(sharedConversations.shareId, shareId));
}

export async function getConversationMessages(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ role: fauxTonyChats.role, content: fauxTonyChats.content, createdAt: fauxTonyChats.createdAt }).from(fauxTonyChats).where(eq(fauxTonyChats.sessionId, sessionId)).orderBy(fauxTonyChats.createdAt);
}

// ── 6. Micro-Commitments ──
export async function saveMicroCommitment(postSlug: string, commitment: string, sessionId: string, userId?: number) {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.insert(microCommitments).values({ postSlug, commitment, sessionId, userId: userId ?? null }).$returningId();
  return result;
}

export async function getPostCommitments(postSlug: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ commitment: microCommitments.commitment, createdAt: microCommitments.createdAt }).from(microCommitments).where(eq(microCommitments.postSlug, postSlug)).orderBy(desc(microCommitments.createdAt)).limit(limit);
}

// ── 9. Provocation of the Day ──
export async function getTodayProvocation() {
  const db = await getDb();
  if (!db) return null;
  const today = new Date().toISOString().slice(0, 10);
  const [row] = await db.select().from(dailyProvocations).where(eq(dailyProvocations.date, today)).limit(1);
  return row ?? null;
}

export async function saveProvocation(date: string, text_: string, sourceSlug?: string) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(dailyProvocations).values({ date, text: text_, sourceSlug: sourceSlug ?? null }).onDuplicateKeyUpdate({ set: { text: text_, sourceSlug: sourceSlug ?? null } });
  return { date, text: text_, sourceSlug };
}

// ── 10. Referrals ──
export async function getOrCreateReferralCode(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const [existing] = await db.select().from(referralCodes).where(eq(referralCodes.userId, userId)).limit(1);
  if (existing) return existing.code;
  const code = `tg_${Math.random().toString(36).slice(2, 10)}`;
  await db.insert(referralCodes).values({ userId, code });
  return code;
}

export async function recordReferral(referralCode: string, referredUserId: number) {
  const db = await getDb();
  if (!db) return null;
  const [codeRow] = await db.select().from(referralCodes).where(eq(referralCodes.code, referralCode)).limit(1);
  if (!codeRow) return null;
  if (codeRow.userId === referredUserId) return null; // can't refer yourself
  // Check if already referred
  const [existing] = await db.select().from(referrals).where(and(eq(referrals.referredUserId, referredUserId), eq(referrals.referrerId, codeRow.userId))).limit(1);
  if (existing) return existing;
  await db.insert(referrals).values({ referrerId: codeRow.userId, referredUserId, referralCode, depthScore: 0 });
  return { referrerId: codeRow.userId, referredUserId };
}

export async function incrementReferralDepth(referredUserId: number, points: number = 1) {
  const db = await getDb();
  if (!db) return;
  await db.update(referrals).set({ depthScore: sql`${referrals.depthScore} + ${points}` }).where(eq(referrals.referredUserId, referredUserId));
}

export async function getReferralStats(userId: number) {
  const db = await getDb();
  if (!db) return { code: null, referralCount: 0, totalDepth: 0, referrals: [] };
  const code = await getOrCreateReferralCode(userId);
  const refs = await db.select({
    referredUserId: referrals.referredUserId,
    depthScore: referrals.depthScore,
    createdAt: referrals.createdAt,
  }).from(referrals).where(eq(referrals.referrerId, userId)).orderBy(desc(referrals.depthScore));
  const totalDepth = refs.reduce((s, r) => s + r.depthScore, 0);
  return { code, referralCount: refs.length, totalDepth, referrals: refs };
}

// ── Short URLs ──
function generateShortCode(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // no confusing chars
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function createShortUrl(targetPath: string): Promise<{ code: string; shortUrl: string }> {
  const db = await getDb();
  if (!db) throw new Error("No DB");
  // Check if this path already has a short URL
  const existing = await db.select().from(shortUrls).where(eq(shortUrls.targetPath, targetPath)).limit(1);
  if (existing.length > 0) {
    return { code: existing[0].code, shortUrl: `/s/${existing[0].code}` };
  }
  // Generate unique code
  let code = generateShortCode();
  let attempts = 0;
  while (attempts < 10) {
    const dup = await db.select().from(shortUrls).where(eq(shortUrls.code, code)).limit(1);
    if (dup.length === 0) break;
    code = generateShortCode();
    attempts++;
  }
  await db.insert(shortUrls).values({ code, targetPath });
  return { code, shortUrl: `/s/${code}` };
}

export async function resolveShortUrl(code: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(shortUrls).where(eq(shortUrls.code, code)).limit(1);
  if (rows.length === 0) return null;
  // Increment click count
  await db.update(shortUrls).set({ clicks: sql`${shortUrls.clicks} + 1` }).where(eq(shortUrls.code, code));
  return rows[0].targetPath;
}

// ── Article Read Counters ──

export async function getArticleReadCount(postSlug: string, version: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(articleReadCounts)
    .where(and(eq(articleReadCounts.postSlug, postSlug), eq(articleReadCounts.version, version)))
    .limit(1);
  return rows.length > 0 ? rows[0].count : 0;
}

export async function incrementArticleReadCount(postSlug: string, version: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  // Upsert: increment if exists, insert with 1 if not
  const existing = await db.select().from(articleReadCounts)
    .where(and(eq(articleReadCounts.postSlug, postSlug), eq(articleReadCounts.version, version)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(articleReadCounts)
      .set({ count: sql`${articleReadCounts.count} + 1` })
      .where(and(eq(articleReadCounts.postSlug, postSlug), eq(articleReadCounts.version, version)));
    return existing[0].count + 1;
  } else {
    await db.insert(articleReadCounts).values({ postSlug, version, count: 1 });
    return 1;
  }
}

export async function getBothReadCounts(postSlug: string): Promise<{ short: number; long: number }> {
  const db = await getDb();
  if (!db) return { short: 0, long: 0 };
  const rows = await db.select().from(articleReadCounts)
    .where(eq(articleReadCounts.postSlug, postSlug));
  let short = 0, long = 0;
  for (const row of rows) {
    if (row.version === 'short') short = row.count;
    if (row.version === 'long') long = row.count;
  }
  return { short, long };
}

// ── Blog Comments ──

export async function getComments(postSlug: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogComments)
    .where(eq(blogComments.postSlug, postSlug))
    .orderBy(desc(blogComments.createdAt));
}

export async function getAllComments(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogComments)
    .orderBy(desc(blogComments.createdAt))
    .limit(limit);
}
export async function addComment(comment: InsertBlogComment) {
  const db = await getDb();
  if (!db) throw new Error("No DB");
  await db.insert(blogComments).values(comment);
  return { success: true };
}

export async function deleteComment(commentId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("No DB");
  // Only allow deleting own comments
  await db.delete(blogComments)
    .where(and(eq(blogComments.id, commentId), eq(blogComments.userId, userId)));
  return { success: true };
}

// ── PRI Calibration Helpers ──
export async function savePriCalibration(data: {
  sessionId: string;
  userId?: number;
  rankings: string;
  pairwiseChoices: string;
  dimScores: string;
  researchOptIn: boolean;
}) {
  const db = await getDb();
  if (!db) return null;
  const { priCalibrations } = await import("../drizzle/schema");
  const [result] = await db.insert(priCalibrations).values({
    sessionId: data.sessionId,
    userId: data.userId ?? null,
    rankings: data.rankings,
    pairwiseChoices: data.pairwiseChoices,
    dimScores: data.dimScores,
    researchOptIn: data.researchOptIn,
  }).$returningId();
  return { id: result.id };
}

export async function getPriCalibrationStats() {
  const db = await getDb();
  if (!db) return { total: 0, researchOptIn: 0, avgScores: {} as Record<string, number> };
  const { priCalibrations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  const all = await db.select().from(priCalibrations);
  const total = all.length;
  const researchOptIn = all.filter(r => r.researchOptIn).length;
  const dimTotals: Record<string, number[]> = {};
  for (const row of all) {
    try {
      const scores = JSON.parse(row.dimScores) as Record<string, number>;
      for (const [dim, score] of Object.entries(scores)) {
        if (!dimTotals[dim]) dimTotals[dim] = [];
        dimTotals[dim].push(score);
      }
    } catch {}
  }
  const avgScores: Record<string, number> = {};
  for (const [dim, scores] of Object.entries(dimTotals)) {
    avgScores[dim] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  return { total, researchOptIn, avgScores };
}

export async function getPriResearchData() {
  const db = await getDb();
  if (!db) return [];
  const { priCalibrations } = await import("../drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");
  const results = await db.select().from(priCalibrations)
    .where(eq(priCalibrations.researchOptIn, true))
    .orderBy(desc(priCalibrations.createdAt))
    .limit(500);
  return results.map(r => ({
    id: r.id,
    rankings: r.rankings,
    pairwiseChoices: r.pairwiseChoices,
    dimScores: r.dimScores,
    createdAt: r.createdAt,
  }));
}

// ── GUEST ARTICLE EDITS ──

export async function getGuestArticleEdit(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(guestArticleEdits).where(eq(guestArticleEdits.articleSlug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function saveGuestArticleEdit(slug: string, content: string) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(guestArticleEdits)
    .set({ content, isLive: true, updatedAt: new Date() })
    .where(eq(guestArticleEdits.articleSlug, slug));
}
