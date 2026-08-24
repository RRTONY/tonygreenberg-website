/**
 * FIND YOUR SPIRIT
 * 
 * A comprehensive 35-question assessment mapping your spiritual landscape
 * across 10 dimensions. Discovers which of 12 spiritual traditions most
 * closely align with your authentic beliefs and practices.
 * 
 * Design: Same dark contemplative glass-morphism as Find My.
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ── TYPES ── */

interface Choice {
  text: string;
  dimensions: Record<string, number>;
}

interface Question {
  id: number;
  category: string;
  stem: string;
  subtext: string;
  choices: Choice[];
}

interface SpiritualTradition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  topDimensions: string[];
  practices: string[];
  keyTexts: string[];
  figures: string[];
  modernExpressions: string[];
  growthEdge: string[];
  shareText: string;
}

/* ── DIMENSION LABELS ── */

const DIMENSION_LABELS: Record<string, string> = {
  heritage: "Heritage & Roots",
  theism: "Concept of Divine",
  afterlife: "Afterlife & Beyond",
  scripture: "Sacred Authority",
  practice: "Spiritual Practice",
  ethics: "Ethics & Morality",
  mysticism: "Mysticism & Experience",
  pluralism: "Religious Pluralism",
  society: "Faith & Society",
  trajectory: "Future Path",
};

/* ── QUESTIONS (35) ── */

const QUESTIONS: Question[] = [
  // ── HERITAGE & ROOTS (Q1-3) ──
  {
    id: 1, category: "BACKGROUND & HERITAGE",
    stem: "What spiritual tradition were you raised in?",
    subtext: "Not what you chose. What chose you first.",
    choices: [
      { text: "Christianity — in one of its many forms", dimensions: { heritage: 3, scripture: 1 } },
      { text: "Islam, Judaism, or another Abrahamic tradition", dimensions: { heritage: 3, ethics: 1 } },
      { text: "Hinduism, Buddhism, or an Eastern tradition", dimensions: { heritage: 3, mysticism: 1 } },
      { text: "Secular, atheist, agnostic — or spiritual but not religious", dimensions: { heritage: 1, pluralism: 2, trajectory: 1 } },
    ],
  },
  {
    id: 2, category: "BACKGROUND & HERITAGE",
    stem: "How do you relate to the tradition you were raised in?",
    subtext: "The inheritance you didn't ask for.",
    choices: [
      { text: "I still practice it — it's deepened, not diminished, with age", dimensions: { heritage: 3, scripture: 1 } },
      { text: "I've left it but it left fingerprints on everything I believe", dimensions: { heritage: 2, trajectory: 2 } },
      { text: "I've actively rejected it — and I'm building something different", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "I was never really given one — I'm starting from scratch", dimensions: { trajectory: 3, pluralism: 1 } },
    ],
  },
  {
    id: 3, category: "BACKGROUND & HERITAGE",
    stem: "If you could sit with any spiritual figure for an hour, who would it be?",
    subtext: "Living, dead, or mythological. The one who pulls you.",
    choices: [
      { text: "Jesus, Muhammad, or Moses — a prophet who changed civilization", dimensions: { heritage: 2, scripture: 2 } },
      { text: "The Buddha, Lao Tzu, or Krishna — a sage who transcended the world", dimensions: { mysticism: 2, practice: 2 } },
      { text: "Rumi, Hafiz, or Hildegard — a mystic who dissolved into the divine", dimensions: { mysticism: 3, heritage: 1 } },
      { text: "Carl Jung, Alan Watts, or Ram Dass — a modern bridge-builder", dimensions: { pluralism: 2, trajectory: 2 } },
    ],
  },
  // ── CONCEPT OF GOD/DIVINE (Q4-8) ──
  {
    id: 4, category: "CONCEPT OF THE DIVINE",
    stem: "Is there a God?",
    subtext: "The question behind every other question.",
    choices: [
      { text: "Yes — a personal God who knows me, hears me, and acts in the world", dimensions: { theism: 3, heritage: 1 } },
      { text: "Yes — but not a person. A force, a consciousness, the ground of being", dimensions: { theism: 2, mysticism: 2 } },
      { text: "Maybe — I'm genuinely uncertain, and I've stopped pretending otherwise", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "No — and the question itself might be the wrong one", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 5, category: "CONCEPT OF THE DIVINE",
    stem: "When you say 'God' — or deliberately don't — what image comes up?",
    subtext: "Not the theology. The felt sense.",
    choices: [
      { text: "A father, a mother, a beloved — someone who loves me specifically", dimensions: { theism: 3, heritage: 1 } },
      { text: "Light, energy, vibration — something impersonal but alive", dimensions: { theism: 1, mysticism: 3 } },
      { text: "The universe itself — everything is sacred, nothing is separate", dimensions: { mysticism: 2, pluralism: 2 } },
      { text: "Nothing — and that's not a loss, it's a liberation", dimensions: { ethics: 2, trajectory: 2 } },
    ],
  },
  {
    id: 6, category: "CONCEPT OF THE DIVINE",
    stem: "Does God intervene in human affairs?",
    subtext: "Miracles, answered prayers, divine providence — real or projection?",
    choices: [
      { text: "Yes — I've experienced it. Providence is real.", dimensions: { theism: 3, heritage: 1 } },
      { text: "Not directly — but there's a pattern, a flow, a synchronicity that guides", dimensions: { theism: 1, mysticism: 2, practice: 1 } },
      { text: "No — but the belief itself can be transformative, and that matters", dimensions: { pluralism: 2, ethics: 2 } },
      { text: "No — and believing otherwise is dangerous. We're on our own.", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 7, category: "CONCEPT OF THE DIVINE",
    stem: "Is the divine masculine, feminine, both, or neither?",
    subtext: "The gender of God. Or the genderlessness.",
    choices: [
      { text: "God transcends gender — but the masculine metaphors carry real meaning", dimensions: { theism: 2, heritage: 2 } },
      { text: "The divine feminine has been suppressed — and reclaiming it is essential", dimensions: { mysticism: 2, society: 2 } },
      { text: "Both and neither — the divine contains all polarities", dimensions: { mysticism: 2, pluralism: 2 } },
      { text: "The question is anthropomorphic — consciousness doesn't have a gender", dimensions: { trajectory: 2, pluralism: 2 } },
    ],
  },
  {
    id: 8, category: "CONCEPT OF THE DIVINE",
    stem: "Can you know God — or only believe?",
    subtext: "The epistemology of the sacred.",
    choices: [
      { text: "You can know God — through revelation, scripture, and faith", dimensions: { theism: 2, scripture: 2 } },
      { text: "You can know God — through direct mystical experience", dimensions: { mysticism: 3, practice: 1 } },
      { text: "You can approach but never arrive — the mystery is the point", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "Knowledge requires evidence — and the evidence isn't there", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  // ── AFTERLIFE & SALVATION (Q9-12) ──
  {
    id: 9, category: "AFTERLIFE & SALVATION",
    stem: "What happens when we die?",
    subtext: "Your honest answer. Not the comforting one.",
    choices: [
      { text: "Heaven, hell, or judgment — there's a reckoning, and it matters how we live", dimensions: { afterlife: 3, ethics: 1 } },
      { text: "Reincarnation — consciousness continues in new forms based on karma", dimensions: { afterlife: 2, mysticism: 2 } },
      { text: "We return to the source — individual identity dissolves into the whole", dimensions: { afterlife: 1, mysticism: 3 } },
      { text: "Nothing — and accepting that is the beginning of real freedom", dimensions: { ethics: 2, trajectory: 2 } },
    ],
  },
  {
    id: 10, category: "AFTERLIFE & SALVATION",
    stem: "What does 'salvation' or 'liberation' mean to you?",
    subtext: "Being saved from what? Freed into what?",
    choices: [
      { text: "Being saved by grace — forgiven, redeemed, made whole by something beyond myself", dimensions: { afterlife: 2, theism: 2 } },
      { text: "Enlightenment — waking up from the dream of separation", dimensions: { mysticism: 3, practice: 1 } },
      { text: "Freedom from suffering — through wisdom, compassion, and right action", dimensions: { ethics: 2, practice: 2 } },
      { text: "There's nothing to be saved from — just a life to be lived fully", dimensions: { trajectory: 2, society: 2 } },
    ],
  },
  {
    id: 11, category: "AFTERLIFE & SALVATION",
    stem: "Is there evil in the world?",
    subtext: "Not bad behavior. Actual evil. A force, a presence, a reality.",
    choices: [
      { text: "Yes — there are forces of darkness, and spiritual warfare is real", dimensions: { afterlife: 2, theism: 2 } },
      { text: "Evil is the absence of consciousness — ignorance, not malice", dimensions: { mysticism: 2, ethics: 2 } },
      { text: "Evil is a human construct — but the suffering it names is real", dimensions: { ethics: 2, society: 2 } },
      { text: "There's no evil — only unconsciousness, trauma, and systems that perpetuate harm", dimensions: { society: 2, trajectory: 2 } },
    ],
  },
  {
    id: 12, category: "AFTERLIFE & SALVATION",
    stem: "Does your spiritual life give you comfort about death?",
    subtext: "Honest answer.",
    choices: [
      { text: "Yes — I know where I'm going, and it gives me peace", dimensions: { afterlife: 3, theism: 1 } },
      { text: "Somewhat — I trust the process even if I don't know the details", dimensions: { mysticism: 2, practice: 2 } },
      { text: "Not really — but it helps me live more fully right now", dimensions: { trajectory: 2, ethics: 2 } },
      { text: "No — and I don't think it should. Death is the great unknown.", dimensions: { pluralism: 2, trajectory: 2 } },
    ],
  },
  // ── SACRED TEXTS & AUTHORITY (Q13-16) ──
  {
    id: 13, category: "SACRED TEXTS & AUTHORITY",
    stem: "Is there a book that's more than a book to you?",
    subtext: "Scripture, revelation, or just really good writing?",
    choices: [
      { text: "Yes — the Bible, Quran, Torah, or Gita carries divine authority", dimensions: { scripture: 3, heritage: 1 } },
      { text: "Several — I find revelation scattered across many traditions and texts", dimensions: { scripture: 1, pluralism: 3 } },
      { text: "Poetry and philosophy move me more than scripture", dimensions: { mysticism: 2, trajectory: 2 } },
      { text: "No book is sacred — but many are profound", dimensions: { ethics: 2, pluralism: 2 } },
    ],
  },
  {
    id: 14, category: "SACRED TEXTS & AUTHORITY",
    stem: "When scripture contradicts science, which do you trust?",
    subtext: "The collision that defines modernity.",
    choices: [
      { text: "Scripture — it speaks to truths that science can't measure", dimensions: { scripture: 3, theism: 1 } },
      { text: "Both — they're answering different questions and both are valid", dimensions: { scripture: 1, pluralism: 2, heritage: 1 } },
      { text: "Science — but I respect the metaphorical wisdom in sacred texts", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "Science — scripture is a human product, not a divine one", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 15, category: "SACRED TEXTS & AUTHORITY",
    stem: "Who has spiritual authority in your life?",
    subtext: "Whose voice do you trust on the deepest questions?",
    choices: [
      { text: "A priest, pastor, imam, or rabbi — ordained authority matters", dimensions: { scripture: 2, heritage: 2 } },
      { text: "A teacher or guru — someone further along the path", dimensions: { practice: 2, mysticism: 2 } },
      { text: "My own experience — I'm my own authority", dimensions: { trajectory: 2, mysticism: 2 } },
      { text: "A community of peers — we figure it out together", dimensions: { society: 2, ethics: 2 } },
    ],
  },
  {
    id: 16, category: "SACRED TEXTS & AUTHORITY",
    stem: "Can spiritual truth change — or is it eternal?",
    subtext: "The tension between revelation and evolution.",
    choices: [
      { text: "Eternal — God's truth doesn't change with the times", dimensions: { scripture: 3, theism: 1 } },
      { text: "The core is eternal, but our understanding of it evolves", dimensions: { scripture: 1, pluralism: 2, heritage: 1 } },
      { text: "Truth is always evolving — including spiritual truth", dimensions: { trajectory: 3, pluralism: 1 } },
      { text: "There is no 'spiritual truth' — only human meaning-making", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  // ── SPIRITUAL PRACTICES (Q17-21) ──
  {
    id: 17, category: "SPIRITUAL PRACTICES",
    stem: "What's your primary spiritual practice?",
    subtext: "The thing you actually do. Not the thing you wish you did.",
    choices: [
      { text: "Prayer — talking to God, listening for God, surrendering to God", dimensions: { practice: 3, theism: 1 } },
      { text: "Meditation — sitting, breathing, observing the mind", dimensions: { practice: 3, mysticism: 1 } },
      { text: "Service — my practice is how I show up for other people", dimensions: { practice: 2, ethics: 2 } },
      { text: "I don't have one — and I'm either at peace with that or looking for one", dimensions: { trajectory: 2, pluralism: 2 } },
    ],
  },
  {
    id: 18, category: "SPIRITUAL PRACTICES",
    stem: "How important is weekly worship or gathering?",
    subtext: "Church, temple, mosque, sangha, circle — or none.",
    choices: [
      { text: "Essential — I need the rhythm and the community", dimensions: { practice: 2, heritage: 2 } },
      { text: "Nice but not necessary — I go when it feeds me", dimensions: { practice: 1, pluralism: 2, trajectory: 1 } },
      { text: "I've replaced it with my own practice — solo or with a small group", dimensions: { mysticism: 2, practice: 2 } },
      { text: "I don't gather for spiritual purposes — and I don't miss it", dimensions: { trajectory: 2, society: 2 } },
    ],
  },
  {
    id: 19, category: "SPIRITUAL PRACTICES",
    stem: "Fasting, pilgrimage, retreat — do these call to you?",
    subtext: "The body as a spiritual instrument.",
    choices: [
      { text: "Deeply — I've done them and they've transformed me", dimensions: { practice: 3, mysticism: 1 } },
      { text: "I'm curious — I haven't tried but I'm drawn to the intensity", dimensions: { practice: 2, trajectory: 2 } },
      { text: "I prefer gentler practices — yoga, walking meditation, nature immersion", dimensions: { practice: 1, mysticism: 2, pluralism: 1 } },
      { text: "Not really — I find spiritual meaning in everyday life, not special experiences", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 20, category: "SPIRITUAL PRACTICES",
    stem: "Do you pray? And if so — to whom or what?",
    subtext: "The most intimate question in spirituality.",
    choices: [
      { text: "Yes — to God, by name, with words and sometimes tears", dimensions: { theism: 3, practice: 1 } },
      { text: "Yes — but it's more like meditation or intention-setting than petition", dimensions: { practice: 2, mysticism: 2 } },
      { text: "Sometimes — in crisis, in gratitude, in moments of awe", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "No — I don't believe there's anyone listening", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 21, category: "SPIRITUAL PRACTICES",
    stem: "What's your relationship with psychedelics or plant medicine as spiritual tools?",
    subtext: "Ayahuasca, psilocybin, DMT — sacred or dangerous?",
    choices: [
      { text: "They're among the most powerful spiritual technologies available to us", dimensions: { mysticism: 3, trajectory: 1 } },
      { text: "Interesting but I prefer practices that don't require substances", dimensions: { practice: 2, heritage: 2 } },
      { text: "They need proper ceremonial context — set, setting, and lineage matter", dimensions: { heritage: 2, mysticism: 2 } },
      { text: "I'm skeptical — altered states aren't the same as spiritual growth", dimensions: { ethics: 2, scripture: 2 } },
    ],
  },
  // ── ETHICS & MORALITY (Q22-25) ──
  {
    id: 22, category: "ETHICS & MORALITY",
    stem: "Where does morality come from?",
    subtext: "The source code of right and wrong.",
    choices: [
      { text: "From God — divine commandments are the foundation of ethics", dimensions: { ethics: 2, theism: 2 } },
      { text: "From human reason and empathy — we figure it out together", dimensions: { ethics: 3, society: 1 } },
      { text: "From the interconnection of all things — harm to one is harm to all", dimensions: { ethics: 2, mysticism: 2 } },
      { text: "From evolution — morality is adaptive, not absolute", dimensions: { trajectory: 2, society: 2 } },
    ],
  },
  {
    id: 23, category: "ETHICS & MORALITY",
    stem: "Is there absolute right and wrong — or is it all context?",
    subtext: "The moral relativism question.",
    choices: [
      { text: "There are moral absolutes — some things are always wrong", dimensions: { ethics: 2, scripture: 2 } },
      { text: "There are principles, but application requires wisdom and context", dimensions: { ethics: 2, pluralism: 2 } },
      { text: "Morality is culturally constructed — but suffering is universal", dimensions: { society: 2, pluralism: 2 } },
      { text: "Everything is context — and anyone who says otherwise is selling something", dimensions: { trajectory: 2, society: 2 } },
    ],
  },
  {
    id: 24, category: "ETHICS & MORALITY",
    stem: "What's the relationship between personal transformation and social change?",
    subtext: "Inner work vs. outer work. Or both.",
    choices: [
      { text: "Change yourself first — the world changes when individuals change", dimensions: { practice: 2, mysticism: 2 } },
      { text: "Both — inner and outer transformation feed each other", dimensions: { ethics: 2, practice: 2 } },
      { text: "Social change is more urgent — personal growth is a luxury", dimensions: { society: 3, ethics: 1 } },
      { text: "Neither — I'm skeptical of both spiritual bypassing and activist burnout", dimensions: { trajectory: 2, pluralism: 2 } },
    ],
  },
  {
    id: 25, category: "ETHICS & MORALITY",
    stem: "How do you relate to forgiveness?",
    subtext: "Not the concept. The practice.",
    choices: [
      { text: "It's central — forgiveness is the heart of my spiritual life", dimensions: { theism: 2, ethics: 2 } },
      { text: "It's important but it can't be forced — some things take time", dimensions: { ethics: 2, practice: 2 } },
      { text: "I prefer 'release' to 'forgiveness' — letting go without condoning", dimensions: { mysticism: 2, trajectory: 2 } },
      { text: "Some things shouldn't be forgiven — accountability matters more", dimensions: { society: 2, ethics: 2 } },
    ],
  },
  // ── MYSTICISM & EXPERIENCE (Q26-29) ──
  {
    id: 26, category: "MYSTICISM & EXPERIENCE",
    stem: "Have you ever experienced something you'd call 'mystical'?",
    subtext: "Unity, dissolution, the numinous — whatever cracked the ordinary open.",
    choices: [
      { text: "Yes — and it's the most real thing that's ever happened to me", dimensions: { mysticism: 3, theism: 1 } },
      { text: "Yes — but I interpret it through a specific tradition", dimensions: { mysticism: 2, heritage: 2 } },
      { text: "Maybe — I've had moments of deep awe or connection", dimensions: { mysticism: 1, pluralism: 2, trajectory: 1 } },
      { text: "No — and I'm skeptical of the concept", dimensions: { ethics: 2, society: 2 } },
    ],
  },
  {
    id: 27, category: "MYSTICISM & EXPERIENCE",
    stem: "Is enlightenment real?",
    subtext: "Awakening, satori, union with God — achievable or mythological?",
    choices: [
      { text: "Yes — and it's the goal of human existence", dimensions: { mysticism: 3, practice: 1 } },
      { text: "Yes — but it's not what most people think. It's ordinary, not extraordinary.", dimensions: { mysticism: 2, trajectory: 2 } },
      { text: "It's a useful concept but probably not a permanent state", dimensions: { pluralism: 2, practice: 2 } },
      { text: "No — it's a spiritual fantasy that keeps people from engaging with reality", dimensions: { society: 2, ethics: 2 } },
    ],
  },
  {
    id: 28, category: "MYSTICISM & EXPERIENCE",
    stem: "What's your relationship with silence?",
    subtext: "Not the absence of noise. The presence of something else.",
    choices: [
      { text: "It's where I meet the divine — silence is the language of God", dimensions: { mysticism: 3, theism: 1 } },
      { text: "It's medicine — uncomfortable but necessary for growth", dimensions: { practice: 3, mysticism: 1 } },
      { text: "I prefer it to most conversation — silence is honest", dimensions: { trajectory: 2, mysticism: 2 } },
      { text: "I'd rather be in dialogue — with people, with texts, with ideas", dimensions: { society: 2, heritage: 2 } },
    ],
  },
  {
    id: 29, category: "MYSTICISM & EXPERIENCE",
    stem: "Is consciousness fundamental — or an accident of biology?",
    subtext: "The hard problem. The one science can't solve.",
    choices: [
      { text: "Consciousness is God — or at least the closest thing we have to God", dimensions: { mysticism: 3, theism: 1 } },
      { text: "Consciousness is fundamental — the universe is aware, not just alive", dimensions: { mysticism: 2, trajectory: 2 } },
      { text: "We don't know yet — and I'm comfortable with the mystery", dimensions: { pluralism: 3, trajectory: 1 } },
      { text: "It's an emergent property of complex systems — beautiful but not magical", dimensions: { society: 2, ethics: 2 } },
    ],
  },
  // ── RELIGIOUS PLURALISM (Q30-32) ──
  {
    id: 30, category: "RELIGIOUS PLURALISM",
    stem: "How many paths lead to truth?",
    subtext: "The perennial question.",
    choices: [
      { text: "One — my tradition has it right, and the differences matter", dimensions: { heritage: 3, scripture: 1 } },
      { text: "Many — different traditions are different faces of the same mountain", dimensions: { pluralism: 3, mysticism: 1 } },
      { text: "Some — not all paths are equal, but several are legitimate", dimensions: { pluralism: 2, heritage: 2 } },
      { text: "None — or all. Truth isn't a destination, it's a way of being.", dimensions: { trajectory: 2, pluralism: 2 } },
    ],
  },
  {
    id: 31, category: "RELIGIOUS PLURALISM",
    stem: "Should children be raised in a specific tradition — or left to choose?",
    subtext: "The inheritance question.",
    choices: [
      { text: "Raised in one — roots matter, and you can always branch out later", dimensions: { heritage: 3, scripture: 1 } },
      { text: "Exposed to many — let them find their own way with a broad foundation", dimensions: { pluralism: 3, trajectory: 1 } },
      { text: "Raised with values and ethics, not specific religious content", dimensions: { ethics: 2, society: 2 } },
      { text: "Left alone — religion is a personal choice, not a parental one", dimensions: { trajectory: 2, pluralism: 2 } },
    ],
  },
  {
    id: 32, category: "RELIGIOUS PLURALISM",
    stem: "Can you be deeply committed to one tradition while respecting all others?",
    subtext: "Depth vs. breadth in spiritual life.",
    choices: [
      { text: "Yes — that's exactly my aspiration. Deep roots, open branches.", dimensions: { heritage: 2, pluralism: 2 } },
      { text: "I've tried — but commitment to one tradition means believing it's truest", dimensions: { heritage: 2, scripture: 2 } },
      { text: "I can't commit to just one — I need the freedom to draw from many", dimensions: { pluralism: 3, trajectory: 1 } },
      { text: "I'm committed to none — and that's its own kind of freedom", dimensions: { trajectory: 3, society: 1 } },
    ],
  },
  // ── RELIGION & SOCIETY (Q33-34) ──
  {
    id: 33, category: "RELIGION & SOCIETY",
    stem: "Should religion influence politics?",
    subtext: "The separation question.",
    choices: [
      { text: "Yes — faith should inform how we govern and build society", dimensions: { society: 2, heritage: 2 } },
      { text: "Values yes, institutions no — the wall of separation matters", dimensions: { society: 2, ethics: 2 } },
      { text: "Religion should stay out of politics entirely", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "The question is backwards — politics has corrupted religion, not the other way around", dimensions: { ethics: 2, mysticism: 2 } },
    ],
  },
  {
    id: 34, category: "RELIGION & SOCIETY",
    stem: "Is the world getting more spiritual — or less?",
    subtext: "The trajectory of the sacred in modern life.",
    choices: [
      { text: "Less — secularism is winning, and something precious is being lost", dimensions: { heritage: 2, scripture: 2 } },
      { text: "More — but differently. Spirituality is evolving beyond traditional religion.", dimensions: { trajectory: 3, pluralism: 1 } },
      { text: "Neither — the hunger for meaning is constant, only the forms change", dimensions: { mysticism: 2, pluralism: 2 } },
      { text: "I hope less — religion has caused more harm than good", dimensions: { society: 2, ethics: 2 } },
    ],
  },
  // ── FUTURE TRAJECTORY (Q35) ──
  {
    id: 35, category: "FUTURE TRAJECTORY",
    stem: "Where is your spiritual life heading?",
    subtext: "Not where it's been. Where it's going.",
    choices: [
      { text: "Deeper into my tradition — I'm going further in, not further out", dimensions: { heritage: 3, scripture: 1 } },
      { text: "Toward synthesis — integrating the best of multiple traditions into something new", dimensions: { pluralism: 2, trajectory: 2 } },
      { text: "Toward direct experience — less belief, more practice, more presence", dimensions: { mysticism: 2, practice: 2 } },
      { text: "Away from religion entirely — toward philosophy, ethics, and human connection", dimensions: { society: 2, ethics: 2 } },
    ],
  },
];

/* ── SPIRITUAL TRADITIONS ── */

const TRADITIONS: SpiritualTradition[] = [
  {
    id: "contemplative-theist",
    name: "The Contemplative Theist",
    tagline: "You believe in a personal God — and you've met that God in silence.",
    description: "Your spiritual life is built on a living relationship with the divine. You pray, you worship, you surrender — but you've gone deeper than Sunday morning. You've found the contemplative heart of your tradition, where theology becomes experience and belief becomes encounter. The mystics within your tradition — Teresa of Ávila, Rumi, the Baal Shem Tov — are your true teachers.",
    topDimensions: ["theism", "heritage", "scripture"],
    practices: ["Centering prayer and contemplation", "Lectio divina", "Liturgical worship", "Devotional reading", "Pilgrimage"],
    keyTexts: ["The Interior Castle — Teresa of Ávila", "The Cloud of Unknowing", "The Confessions — Augustine", "Masnavi — Rumi"],
    figures: ["Thomas Merton", "Teresa of Ávila", "Rumi", "Abraham Joshua Heschel", "Richard Rohr"],
    modernExpressions: ["Contemplative Christianity", "Progressive Orthodoxy", "Sufi-influenced Islam", "Jewish Renewal"],
    growthEdge: ["May struggle with doubt — experiencing it as betrayal rather than deepening", "Can become attached to spiritual experiences rather than the Source behind them"],
    shareText: "I'm The Contemplative Theist — I believe in a personal God, and I've met that God in silence. Find your spiritual tradition →",
  },
  {
    id: "mystic-seeker",
    name: "The Mystic Seeker",
    tagline: "You don't believe in the divine. You've tasted it. Maps are not the territory.",
    description: "Direct experience is your north star. You've had moments — through meditation, plant medicine, spontaneous grace, or the raw intensity of being alive — where the veil between ordinary and extraordinary dissolved. You're not interested in theology as an intellectual exercise. You want the real thing. The perennial philosophers, the nondual teachers, the consciousness explorers — these are your people.",
    topDimensions: ["mysticism", "practice", "pluralism"],
    practices: ["Deep meditation (vipassana, zazen, centering prayer)", "Breathwork and somatic practices", "Plant medicine ceremony", "Contemplative inquiry", "Ecstatic dance"],
    keyTexts: ["The Tao Te Ching", "The Upanishads", "Be Here Now — Ram Dass", "The Perennial Philosophy — Aldous Huxley"],
    figures: ["Ramana Maharshi", "Meister Eckhart", "Alan Watts", "Ram Dass", "Hildegard of Bingen"],
    modernExpressions: ["Nondual spirituality", "Integral spirituality", "Consciousness studies", "Psychedelic-assisted awakening"],
    growthEdge: ["May devalue the ordinary in pursuit of peak experiences", "Can become a spiritual tourist — breadth without depth", "Risk of bypassing emotional work for transcendent states"],
    shareText: "I'm The Mystic Seeker — I don't believe in the divine, I've tasted it. Find your spiritual tradition →",
  },
  {
    id: "ethical-humanist",
    name: "The Ethical Humanist",
    tagline: "You don't need God to be good. Compassion is your religion.",
    description: "You've found that meaning, morality, and even a kind of sacredness are available without supernatural belief. You're not angry at religion — you've simply moved beyond it. Your commitment to human flourishing, justice, and compassion is as deep as any believer's faith. You find the sacred in human connection, in the struggle for justice, in the everyday miracle of consciousness itself.",
    topDimensions: ["ethics", "society", "trajectory"],
    practices: ["Ethical reflection and journaling", "Community service and activism", "Philosophical study", "Mindfulness (secular)", "Meaningful conversation"],
    keyTexts: ["Meditations — Marcus Aurelius", "The Myth of Sisyphus — Camus", "Sapiens — Yuval Noah Harari", "The Good Life — Robert Waldinger"],
    figures: ["Marcus Aurelius", "Albert Camus", "Simone de Beauvoir", "Carl Sagan", "Brené Brown"],
    modernExpressions: ["Secular humanism", "Ethical Culture", "Stoicism revival", "Effective altruism", "Philosophical naturalism"],
    growthEdge: ["May dismiss genuine transcendent experiences too quickly", "Can become morally rigid without the softening of mystery", "Risk of intellectual arrogance about 'outgrowing' religion"],
    shareText: "I'm The Ethical Humanist — compassion is my religion, and I don't need God to be good. Find your spiritual tradition →",
  },
  {
    id: "rooted-reformer",
    name: "The Rooted Reformer",
    tagline: "You love your tradition enough to fight with it. Reform from within.",
    description: "You're deeply committed to a specific tradition — but you're not naive about its failures. You believe the container matters, the lineage matters, the accumulated wisdom of centuries matters — and you also believe that traditions must evolve or die. You're the progressive Catholic, the reform Muslim, the reconstructionist Jew, the engaged Buddhist who loves the tradition enough to push it forward.",
    topDimensions: ["heritage", "pluralism", "ethics"],
    practices: ["Regular worship with critical engagement", "Interfaith dialogue", "Social justice within tradition", "Scriptural study with historical-critical lens"],
    keyTexts: ["A New Earth — Eckhart Tolle", "The Heart of Christianity — Marcus Borg", "No god but God — Reza Aslan", "Judaism Without Illusions"],
    figures: ["Pope Francis", "Rabbi Abraham Joshua Heschel", "Tariq Ramadan", "Diana Butler Bass"],
    modernExpressions: ["Progressive Christianity", "Reform/Reconstructionist Judaism", "Progressive Islam", "Engaged Buddhism"],
    growthEdge: ["May exhaust yourself fighting battles the institution won't change", "Can become defined by what you're against rather than what you're for"],
    shareText: "I'm The Rooted Reformer — I love my tradition enough to fight with it. Find your spiritual tradition →",
  },
  {
    id: "embodied-naturalist",
    name: "The Embodied Naturalist",
    tagline: "Heaven is a nice idea. You'd rather be fully alive right here, right now.",
    description: "Your spirituality is rooted in this world, this body, this moment. You find the sacred in a good meal, in honest work, in the feel of soil under your fingernails, in the night sky. You might not call yourself spiritual at all — but you live with a presence and intentionality that many religious people envy. Nature is your cathedral. Attention is your prayer. Being fully alive is your salvation.",
    topDimensions: ["trajectory", "pluralism", "practice"],
    practices: ["Nature immersion and forest bathing", "Mindful daily living", "Gardening, cooking, craft", "Walking meditation", "Somatic awareness"],
    keyTexts: ["Walden — Thoreau", "Braiding Sweetgrass — Robin Wall Kimmerer", "The Sabbath — Heschel", "Pilgrim at Tinker Creek — Annie Dillard"],
    figures: ["Henry David Thoreau", "Mary Oliver", "Wendell Berry", "Robin Wall Kimmerer", "Marcus Aurelius"],
    modernExpressions: ["Nature spirituality", "Secular Buddhism", "Deep ecology", "Philosophical Taoism", "Animism revival"],
    growthEdge: ["May dismiss transcendent experiences that don't fit the naturalist frame", "Can become spiritually isolated without community", "Risk of reducing the sacred to the aesthetic"],
    shareText: "I'm The Embodied Naturalist — the sacred is right here, right now, in this body, on this earth. Find your spiritual tradition →",
  },
  {
    id: "disciplined-practitioner",
    name: "The Disciplined Practitioner",
    tagline: "You don't talk about it. You do it. Every single day.",
    description: "For you, spirituality is a discipline — not a feeling, not a belief, but a daily practice that shapes who you become. You sit, you pray, you practice — not because it feels good (though sometimes it does) but because the practice itself is the transformation. You trust the process more than the peak experience. You know that showing up is 90% of awakening.",
    topDimensions: ["practice", "mysticism", "heritage"],
    practices: ["Daily meditation (30+ minutes)", "Yoga or martial arts", "Fasting and ascetic practices", "Retreat and intensive practice", "Journaling and self-examination"],
    keyTexts: ["Zen Mind, Beginner's Mind — Shunryu Suzuki", "The Yoga Sutras — Patanjali", "The Rule of St. Benedict", "The Spiritual Exercises — Ignatius"],
    figures: ["Thich Nhat Hanh", "Pema Chödrön", "B.K.S. Iyengar", "Ignatius of Loyola", "Dōgen"],
    modernExpressions: ["Zen Buddhism", "Vipassana movement", "Ashtanga yoga", "Benedictine oblates", "Ignatian spirituality"],
    growthEdge: ["May become rigid or legalistic about practice", "Can mistake discipline for transformation", "Risk of spiritual pride in consistency"],
    shareText: "I'm The Disciplined Practitioner — I don't talk about it, I do it. Every single day. Find your spiritual tradition →",
  },
];

/* ── COMPONENT ── */

export default function FindYourSpirit() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [topResult, setTopResult] = useState<SpiritualTradition | null>(null);
  const [secondResult, setSecondResult] = useState<SpiritualTradition | null>(null);
  const { markComplete } = useJourneyProgress();

  /* ── Calculate results ── */
  const computeResults = useCallback((finalAnswers: Record<number, number>) => {
    const dims: Record<string, number> = {};
    Object.keys(DIMENSION_LABELS).forEach((d) => (dims[d] = 0));

    Object.entries(finalAnswers).forEach(([qIdx, choiceIdx]) => {
      const q = QUESTIONS[parseInt(qIdx)];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, val]) => {
        dims[dim] = (dims[dim] || 0) + val;
      });
    });

    // Normalize to 0-100
    const maxPossible = 12; // max ~3pts * 4 questions per dimension
    const normalized: Record<string, number> = {};
    Object.entries(dims).forEach(([dim, val]) => {
      normalized[dim] = Math.min(100, Math.round((val / maxPossible) * 100));
    });

    setScores(normalized);

    // Match to traditions by scoring each tradition against the user's top dimensions
    const traditionScores = TRADITIONS.map((t) => {
      const score = t.topDimensions.reduce((sum, dim, idx) => {
        const weight = 3 - idx; // first dimension weighted most
        return sum + (normalized[dim] || 0) * weight;
      }, 0);
      return { tradition: t, score };
    });

    traditionScores.sort((a, b) => b.score - a.score);
    setTopResult(traditionScores[0].tradition);
    setSecondResult(traditionScores[1].tradition);
    setPhase("results");
    markComplete("find-your-spirit");
    // Store results for My Journey dashboard
    try {
      localStorage.setItem("spirit_results", JSON.stringify({ archetype: traditionScores[0].tradition.name, primaryPath: traditionScores[0].tradition.name, scores: normalized, timestamp: Date.now() }));
    } catch {}
  }, [markComplete]);

  /* ── Answer handler ── */
  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const newAnswers = { ...answers, [currentQ]: choiceIdx };
      setAnswers(newAnswers);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        computeResults(newAnswers);
      }
    },
    [answers, currentQ, computeResults]
  );

  /* ── Radar chart ── */
  const RadarChart = useMemo(() => {
    if (Object.keys(scores).length === 0) return null;
    const dims = Object.keys(DIMENSION_LABELS);
    const cx = 150, cy = 150, r = 110;
    const angleStep = (2 * Math.PI) / dims.length;

    const points = dims.map((d, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const val = (scores[d] || 0) / 100;
      return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
    });

    const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

    return (
      <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: "320px" }}>
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={dims.map((_, i) => {
              const angle = angleStep * i - Math.PI / 2;
              return `${cx + r * ring * Math.cos(angle)},${cy + r * ring * Math.sin(angle)}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(212,185,106,0.1)"
            strokeWidth="0.5"
          />
        ))}
        {dims.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return (
            <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(212,185,106,0.08)" strokeWidth="0.5" />
          );
        })}
        <polygon points={polygon} fill="rgba(212,185,106,0.15)" stroke="#D4B96A" strokeWidth="1.5" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />
        ))}
        {dims.map((d, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const lx = cx + (r + 22) * Math.cos(angle);
          const ly = cy + (r + 22) * Math.sin(angle);
          const label = DIMENSION_LABELS[d]?.split(" ")[0] || d;
          return (
            <text key={d} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#999" fontSize="5.5" fontFamily="'DM Mono', monospace">
              {label}
            </text>
          );
        })}
      </svg>
    );
  }, [scores]);

  /* ── LANDING ── */
  if (phase === "landing") {
    return (
      <>
        <SEO title="Find Your Spirit | Tony Greenberg" description="A comprehensive 35-question assessment mapping your spiritual landscape across 10 dimensions." path="/find-your-spirit"
        indexable={true} />
        <AssessmentIntro
          title="Find Your Spirit"
          subtitle="The spirit doesn't need to be found. It needs to be remembered."
          description="Not religion. Not dogma. The raw, unmediated experience of something larger than yourself. This assessment maps your spiritual orientation across contemplation, service, nature, creativity, community, and transcendence — revealing the practice that will actually nourish your soul."
          stats={{ questions: 35, dimensions: 10, minutes: 18 }}
          whatYouGet={["Your spiritual archetype and primary orientation", "A dimensional map of your spiritual landscape", "Understanding of your relationship with transcendence", "Curated practices aligned with your spiritual DNA"]}
          accentColor="#00838F"
          onBegin={() => setPhase('quiz')}
        />
      </>
    );
  }

  /* ── QUIZ ── */
  if (phase === "quiz") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    return (
      <div style={{ minHeight: "100vh", background: "transparent", position: "relative", zIndex: 1, color: "#2C1810", fontFamily: "'Source Sans 3', sans-serif", display: "flex", flexDirection: "column" }}>
        {/* Progress */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
          <div style={{ height: "3px", background: "rgba(212,185,106,0.1)" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #8B6914, #D4B96A)", transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#4A3A2A", letterSpacing: "0.1em" }}>
            <span style={{ cursor: "pointer" }} onClick={() => setPhase("landing")}>← EXIT</span>
            <span>{currentQ + 1} / {QUESTIONS.length}</span>
          </div>
        </div>

        {/* Question */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "5rem 1.5rem 2rem", maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1.5rem" }}>
            {q.category}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)", fontWeight: 400, lineHeight: 1.3, textAlign: "center", margin: "0 0 0.75rem" }}>
            {q.stem}
          </h2>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontStyle: "italic", color: "#888", textAlign: "center", marginBottom: "2.5rem" }}>
            {q.subtext}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
            {q.choices.map((choice, ci) => (
              <button
                key={ci}
                onClick={() => handleAnswer(ci)}
                style={{
                  padding: "1rem 1.25rem",
                  background: answers[currentQ] === ci ? "rgba(212,185,106,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${answers[currentQ] === ci ? "rgba(212,185,106,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "8px",
                  color: "#2C1810",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.92rem",
                  lineHeight: 1.5,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              style={{ marginTop: "1.5rem", background: "none", border: "none", color: "#4A3A2A", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", cursor: "pointer" }}
            >
              ← PREVIOUS
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── RESULTS ── */
  if (!topResult) return null;

  if (!emailGated) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent", position: "relative", zIndex: 1, color: "#2C1810", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <EmailGate assessmentName="spirit animal" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <>
      <ThemedBackground theme="spirit" />
      <SEO title={`${topResult.name} | Find Your Spirit`} description={topResult.tagline} path="/find-your-spirit"
        indexable={true} />
      <div style={{ minHeight: "100vh", background: "transparent", position: "relative", zIndex: 1, color: "#2C1810", fontFamily: "'Source Sans 3', sans-serif" }}>
        {/* Header */}
        <div style={{ padding: "1.5rem", textAlign: "center", borderBottom: "1px solid rgba(212,185,106,0.1)" }}>
          <Link href="/find-my" className="no-underline" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#4A3A2A", textDecoration: "none" }}>
            ← Back to Find My
          </Link>
        </div>

        {/* Primary result */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
            Your Spiritual Tradition
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 400, margin: "0 0 1rem" }}>
            {topResult.name}
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontStyle: "italic", color: "#8B6914", margin: "0 0 2rem" }}>
            {topResult.tagline}
          </p>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#BBB", maxWidth: "580px", margin: "0 auto 2.5rem" }}>
            {topResult.description}
          </p>
        </section>

        {/* Radar */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#888", marginBottom: "1.5rem" }}>
            Your Spiritual Dimensions
          </h3>
          <div style={{ display: "flex", justifyContent: "center" }}>{RadarChart}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem", marginTop: "2rem" }}>
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
              <div key={key} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: topResult.topDimensions.includes(key) ? "1px solid rgba(212,185,106,0.3)" : "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#888", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: topResult.topDimensions.includes(key) ? "#D4B96A" : "#F5F0E0" }}>{scores[key] || 0}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Practices & Texts */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>Practices</h3>
              {topResult.practices.map((p, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>{p}</div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>Key Texts</h3>
              {topResult.keyTexts.map((t, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Expressions & Figures */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>Modern Expressions</h3>
              {topResult.modernExpressions.map((e, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>{e}</div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>Figures to Explore</h3>
              {topResult.figures.map((f, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>{f}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth edge */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>Your Growth Edge</h3>
          {topResult.growthEdge.map((g, i) => (
            <div key={i} style={{ fontSize: "0.95rem", color: "#5A4A3A", marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(201,123,123,0.3)" }}>{g}</div>
          ))}
        </section>

        {/* Secondary */}
        {secondResult && (
          <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem", borderTop: "1px solid rgba(212,185,106,0.1)" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#888", marginBottom: "0.75rem" }}>Your Secondary Tradition</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 400, margin: "0 0 0.5rem" }}>{secondResult.name}</h3>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#8B6914", margin: "0 0 1rem" }}>{secondResult.tagline}</p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#5A4A3A" }}>{secondResult.description}</p>
          </section>
        )}

        {/* Journey continues */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem", borderTop: "1px solid rgba(212,185,106,0.1)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#888", marginBottom: "1.5rem", textAlign: "center" }}>
            The Journey Continues
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { name: "Find Your Religion", desc: "20 questions mapping your spiritual archetype across 8 dimensions", href: "/find-your-religion" },
              { name: "Find Your Therapy", desc: "25 questions matching you to your ideal therapeutic modality", href: "/find-your-therapy" },
              { name: "Find Your Purpose", desc: "The Dharma Finder — 25 questions revealing the work you were built for", href: "/assessments/dharma-finder" },
              { name: "Ecosystem Map", desc: "See all experiences and track your journey progress", href: "/ecosystem-map" },
            ].map((next) => (
              <Link key={next.name} href={next.href} className="no-underline" style={{ display: "block", padding: "1.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", textDecoration: "none", transition: "all 0.2s" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 600, color: "#8B6914", marginBottom: "0.5rem" }}>{next.name}</div>
                <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.5 }}>{next.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Journey Tracker */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <JourneyTracker variant="dark" currentAssessmentId="find-your-spirit" />
        </section>

          <WhatsNext />
        {/* Retake */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem", textAlign: "center" }}>
          {/* Save / Share / PDF Actions */}
          <AssessmentResultActions
            assessmentType="spirit"
            sessionId={sessionId}
            answers={JSON.stringify(answers)}
            resultSummary={JSON.stringify({ tradition: topResult?.name })}
            totalScore={null}
          />

          <button
            onClick={() => { setPhase("landing"); setCurrentQ(0); setAnswers({}); setScores({}); setTopResult(null); setSecondResult(null); }}
            style={{ padding: "0.75rem 2rem", background: "none", border: "1px solid rgba(212,185,106,0.3)", borderRadius: "8px", color: "#8B6914", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer" }}
          >

            Retake Assessment
          </button>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(212,185,106,0.08)", padding: "2rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontStyle: "italic", color: "#555", marginBottom: "0.5rem" }}>
            "The wound is the place where the Light enters you."
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#444" }}>
            Part of the Find My Ecosystem by Tony Greenberg
          </div>
        </footer>
      </div>
    </>
  );
}
