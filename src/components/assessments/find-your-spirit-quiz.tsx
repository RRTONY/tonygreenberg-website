"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourSpirit.tsx — a real
// 35-question, 10-dimension assessment mapping spiritual orientation to
// one of 6 real traditions (legacy's own file-header comment claims "12
// archetypes," but only 6 `TRADITIONS` objects actually exist in the
// code — the header was aspirational/stale, ported the real 6). Every
// question, dimension label, tradition description/practices/key texts/
// figures/modern expressions/growth edge, and the real weighted
// tradition-matching logic (top 3 dimensions per tradition, weighted 3/2/1)
// are ported unchanged and verbatim. Legacy's `AssessmentResultActions`
// ("Download PDF" — real, backend-free — plus "Send to Tony"/"Keep
// Private," both posting to an unbuilt `trpc.assessments.submit`) is
// ported in a simplified form (`result-actions.tsx`) keeping only the
// real PDF export; the two backend-dependent buttons aren't reproduced,
// same honest-degradation pattern used throughout this migration. The
// `crypto.randomUUID()` session ID and `AssessmentResultActions`'
// answers/resultSummary/totalScore props existed only to feed that same
// dropped submit call, so neither is needed here. Legacy's own radar
// chart is replaced with the shared `AssessmentRadarChart`, fed short
// display labels (e.g. "Heritage" instead of raw `heritage`) to match
// legacy's own truncated axis labels.
type Dimension = "heritage" | "theism" | "afterlife" | "scripture" | "practice" | "ethics" | "mysticism" | "pluralism" | "society" | "trajectory";

const DIMENSION_LABELS: Record<Dimension, string> = {
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
const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const ACCENT = "#00838F";

interface Choice {
  text: string;
  dimensions: Partial<Record<Dimension, number>>;
}
interface Question {
  category: string;
  stem: string;
  subtext: string;
  choices: Choice[];
}

function c(text: string, dimensions: Partial<Record<Dimension, number>>): Choice {
  return { text, dimensions };
}

const QUESTIONS: Question[] = [
  { category: "BACKGROUND & HERITAGE", stem: "What spiritual tradition were you raised in?", subtext: "Not what you chose. What chose you first.", choices: [
    c("Christianity — in one of its many forms", { heritage: 3, scripture: 1 }),
    c("Islam, Judaism, or another Abrahamic tradition", { heritage: 3, ethics: 1 }),
    c("Hinduism, Buddhism, or an Eastern tradition", { heritage: 3, mysticism: 1 }),
    c("Secular, atheist, agnostic — or spiritual but not religious", { heritage: 1, pluralism: 2, trajectory: 1 }),
  ] },
  { category: "BACKGROUND & HERITAGE", stem: "How do you relate to the tradition you were raised in?", subtext: "The inheritance you didn't ask for.", choices: [
    c("I still practice it — it's deepened, not diminished, with age", { heritage: 3, scripture: 1 }),
    c("I've left it but it left fingerprints on everything I believe", { heritage: 2, trajectory: 2 }),
    c("I've actively rejected it — and I'm building something different", { pluralism: 2, trajectory: 2 }),
    c("I was never really given one — I'm starting from scratch", { trajectory: 3, pluralism: 1 }),
  ] },
  { category: "BACKGROUND & HERITAGE", stem: "If you could sit with any spiritual figure for an hour, who would it be?", subtext: "Living, dead, or mythological. The one who pulls you.", choices: [
    c("Jesus, Muhammad, or Moses — a prophet who changed civilization", { heritage: 2, scripture: 2 }),
    c("The Buddha, Lao Tzu, or Krishna — a sage who transcended the world", { mysticism: 2, practice: 2 }),
    c("Rumi, Hafiz, or Hildegard — a mystic who dissolved into the divine", { mysticism: 3, heritage: 1 }),
    c("Carl Jung, Alan Watts, or Ram Dass — a modern bridge-builder", { pluralism: 2, trajectory: 2 }),
  ] },
  { category: "CONCEPT OF THE DIVINE", stem: "Is there a God?", subtext: "The question behind every other question.", choices: [
    c("Yes — a personal God who knows me, hears me, and acts in the world", { theism: 3, heritage: 1 }),
    c("Yes — but not a person. A force, a consciousness, the ground of being", { theism: 2, mysticism: 2 }),
    c("Maybe — I'm genuinely uncertain, and I've stopped pretending otherwise", { pluralism: 2, trajectory: 2 }),
    c("No — and the question itself might be the wrong one", { ethics: 2, society: 2 }),
  ] },
  { category: "CONCEPT OF THE DIVINE", stem: "When you say 'God' — or deliberately don't — what image comes up?", subtext: "Not the theology. The felt sense.", choices: [
    c("A father, a mother, a beloved — someone who loves me specifically", { theism: 3, heritage: 1 }),
    c("Light, energy, vibration — something impersonal but alive", { theism: 1, mysticism: 3 }),
    c("The universe itself — everything is sacred, nothing is separate", { mysticism: 2, pluralism: 2 }),
    c("Nothing — and that's not a loss, it's a liberation", { ethics: 2, trajectory: 2 }),
  ] },
  { category: "CONCEPT OF THE DIVINE", stem: "Does God intervene in human affairs?", subtext: "Miracles, answered prayers, divine providence — real or projection?", choices: [
    c("Yes — I've experienced it. Providence is real.", { theism: 3, heritage: 1 }),
    c("Not directly — but there's a pattern, a flow, a synchronicity that guides", { theism: 1, mysticism: 2, practice: 1 }),
    c("No — but the belief itself can be transformative, and that matters", { pluralism: 2, ethics: 2 }),
    c("No — and believing otherwise is dangerous. We're on our own.", { ethics: 2, society: 2 }),
  ] },
  { category: "CONCEPT OF THE DIVINE", stem: "Is the divine masculine, feminine, both, or neither?", subtext: "The gender of God. Or the genderlessness.", choices: [
    c("God transcends gender — but the masculine metaphors carry real meaning", { theism: 2, heritage: 2 }),
    c("The divine feminine has been suppressed — and reclaiming it is essential", { mysticism: 2, society: 2 }),
    c("Both and neither — the divine contains all polarities", { mysticism: 2, pluralism: 2 }),
    c("The question is anthropomorphic — consciousness doesn't have a gender", { trajectory: 2, pluralism: 2 }),
  ] },
  { category: "CONCEPT OF THE DIVINE", stem: "Can you know God — or only believe?", subtext: "The epistemology of the sacred.", choices: [
    c("You can know God — through revelation, scripture, and faith", { theism: 2, scripture: 2 }),
    c("You can know God — through direct mystical experience", { mysticism: 3, practice: 1 }),
    c("You can approach but never arrive — the mystery is the point", { pluralism: 2, trajectory: 2 }),
    c("Knowledge requires evidence — and the evidence isn't there", { ethics: 2, society: 2 }),
  ] },
  { category: "AFTERLIFE & SALVATION", stem: "What happens when we die?", subtext: "Your honest answer. Not the comforting one.", choices: [
    c("Heaven, hell, or judgment — there's a reckoning, and it matters how we live", { afterlife: 3, ethics: 1 }),
    c("Reincarnation — consciousness continues in new forms based on karma", { afterlife: 2, mysticism: 2 }),
    c("We return to the source — individual identity dissolves into the whole", { afterlife: 1, mysticism: 3 }),
    c("Nothing — and accepting that is the beginning of real freedom", { ethics: 2, trajectory: 2 }),
  ] },
  { category: "AFTERLIFE & SALVATION", stem: "What does 'salvation' or 'liberation' mean to you?", subtext: "Being saved from what? Freed into what?", choices: [
    c("Being saved by grace — forgiven, redeemed, made whole by something beyond myself", { afterlife: 2, theism: 2 }),
    c("Enlightenment — waking up from the dream of separation", { mysticism: 3, practice: 1 }),
    c("Freedom from suffering — through wisdom, compassion, and right action", { ethics: 2, practice: 2 }),
    c("There's nothing to be saved from — just a life to be lived fully", { trajectory: 2, society: 2 }),
  ] },
  { category: "AFTERLIFE & SALVATION", stem: "Is there evil in the world?", subtext: "Not bad behavior. Actual evil. A force, a presence, a reality.", choices: [
    c("Yes — there are forces of darkness, and spiritual warfare is real", { afterlife: 2, theism: 2 }),
    c("Evil is the absence of consciousness — ignorance, not malice", { mysticism: 2, ethics: 2 }),
    c("Evil is a human construct — but the suffering it names is real", { ethics: 2, society: 2 }),
    c("There's no evil — only unconsciousness, trauma, and systems that perpetuate harm", { society: 2, trajectory: 2 }),
  ] },
  { category: "AFTERLIFE & SALVATION", stem: "Does your spiritual life give you comfort about death?", subtext: "Honest answer.", choices: [
    c("Yes — I know where I'm going, and it gives me peace", { afterlife: 3, theism: 1 }),
    c("Somewhat — I trust the process even if I don't know the details", { mysticism: 2, practice: 2 }),
    c("Not really — but it helps me live more fully right now", { trajectory: 2, ethics: 2 }),
    c("No — and I don't think it should. Death is the great unknown.", { pluralism: 2, trajectory: 2 }),
  ] },
  { category: "SACRED TEXTS & AUTHORITY", stem: "Is there a book that's more than a book to you?", subtext: "Scripture, revelation, or just really good writing?", choices: [
    c("Yes — the Bible, Quran, Torah, or Gita carries divine authority", { scripture: 3, heritage: 1 }),
    c("Several — I find revelation scattered across many traditions and texts", { scripture: 1, pluralism: 3 }),
    c("Poetry and philosophy move me more than scripture", { mysticism: 2, trajectory: 2 }),
    c("No book is sacred — but many are profound", { ethics: 2, pluralism: 2 }),
  ] },
  { category: "SACRED TEXTS & AUTHORITY", stem: "When scripture contradicts science, which do you trust?", subtext: "The collision that defines modernity.", choices: [
    c("Scripture — it speaks to truths that science can't measure", { scripture: 3, theism: 1 }),
    c("Both — they're answering different questions and both are valid", { scripture: 1, pluralism: 2, heritage: 1 }),
    c("Science — but I respect the metaphorical wisdom in sacred texts", { pluralism: 2, trajectory: 2 }),
    c("Science — scripture is a human product, not a divine one", { ethics: 2, society: 2 }),
  ] },
  { category: "SACRED TEXTS & AUTHORITY", stem: "Who has spiritual authority in your life?", subtext: "Whose voice do you trust on the deepest questions?", choices: [
    c("A priest, pastor, imam, or rabbi — ordained authority matters", { scripture: 2, heritage: 2 }),
    c("A teacher or guru — someone further along the path", { practice: 2, mysticism: 2 }),
    c("My own experience — I'm my own authority", { trajectory: 2, mysticism: 2 }),
    c("A community of peers — we figure it out together", { society: 2, ethics: 2 }),
  ] },
  { category: "SACRED TEXTS & AUTHORITY", stem: "Can spiritual truth change — or is it eternal?", subtext: "The tension between revelation and evolution.", choices: [
    c("Eternal — God's truth doesn't change with the times", { scripture: 3, theism: 1 }),
    c("The core is eternal, but our understanding of it evolves", { scripture: 1, pluralism: 2, heritage: 1 }),
    c("Truth is always evolving — including spiritual truth", { trajectory: 3, pluralism: 1 }),
    c("There is no 'spiritual truth' — only human meaning-making", { ethics: 2, society: 2 }),
  ] },
  { category: "SPIRITUAL PRACTICES", stem: "What's your primary spiritual practice?", subtext: "The thing you actually do. Not the thing you wish you did.", choices: [
    c("Prayer — talking to God, listening for God, surrendering to God", { practice: 3, theism: 1 }),
    c("Meditation — sitting, breathing, observing the mind", { practice: 3, mysticism: 1 }),
    c("Service — my practice is how I show up for other people", { practice: 2, ethics: 2 }),
    c("I don't have one — and I'm either at peace with that or looking for one", { trajectory: 2, pluralism: 2 }),
  ] },
  { category: "SPIRITUAL PRACTICES", stem: "How important is weekly worship or gathering?", subtext: "Church, temple, mosque, sangha, circle — or none.", choices: [
    c("Essential — I need the rhythm and the community", { practice: 2, heritage: 2 }),
    c("Nice but not necessary — I go when it feeds me", { practice: 1, pluralism: 2, trajectory: 1 }),
    c("I've replaced it with my own practice — solo or with a small group", { mysticism: 2, practice: 2 }),
    c("I don't gather for spiritual purposes — and I don't miss it", { trajectory: 2, society: 2 }),
  ] },
  { category: "SPIRITUAL PRACTICES", stem: "Fasting, pilgrimage, retreat — do these call to you?", subtext: "The body as a spiritual instrument.", choices: [
    c("Deeply — I've done them and they've transformed me", { practice: 3, mysticism: 1 }),
    c("I'm curious — I haven't tried but I'm drawn to the intensity", { practice: 2, trajectory: 2 }),
    c("I prefer gentler practices — yoga, walking meditation, nature immersion", { practice: 1, mysticism: 2, pluralism: 1 }),
    c("Not really — I find spiritual meaning in everyday life, not special experiences", { ethics: 2, society: 2 }),
  ] },
  { category: "SPIRITUAL PRACTICES", stem: "Do you pray? And if so — to whom or what?", subtext: "The most intimate question in spirituality.", choices: [
    c("Yes — to God, by name, with words and sometimes tears", { theism: 3, practice: 1 }),
    c("Yes — but it's more like meditation or intention-setting than petition", { practice: 2, mysticism: 2 }),
    c("Sometimes — in crisis, in gratitude, in moments of awe", { pluralism: 2, trajectory: 2 }),
    c("No — I don't believe there's anyone listening", { ethics: 2, society: 2 }),
  ] },
  { category: "SPIRITUAL PRACTICES", stem: "What's your relationship with psychedelics or plant medicine as spiritual tools?", subtext: "Ayahuasca, psilocybin, DMT — sacred or dangerous?", choices: [
    c("They're among the most powerful spiritual technologies available to us", { mysticism: 3, trajectory: 1 }),
    c("Interesting but I prefer practices that don't require substances", { practice: 2, heritage: 2 }),
    c("They need proper ceremonial context — set, setting, and lineage matter", { heritage: 2, mysticism: 2 }),
    c("I'm skeptical — altered states aren't the same as spiritual growth", { ethics: 2, scripture: 2 }),
  ] },
  { category: "ETHICS & MORALITY", stem: "Where does morality come from?", subtext: "The source code of right and wrong.", choices: [
    c("From God — divine commandments are the foundation of ethics", { ethics: 2, theism: 2 }),
    c("From human reason and empathy — we figure it out together", { ethics: 3, society: 1 }),
    c("From the interconnection of all things — harm to one is harm to all", { ethics: 2, mysticism: 2 }),
    c("From evolution — morality is adaptive, not absolute", { trajectory: 2, society: 2 }),
  ] },
  { category: "ETHICS & MORALITY", stem: "Is there absolute right and wrong — or is it all context?", subtext: "The moral relativism question.", choices: [
    c("There are moral absolutes — some things are always wrong", { ethics: 2, scripture: 2 }),
    c("There are principles, but application requires wisdom and context", { ethics: 2, pluralism: 2 }),
    c("Morality is culturally constructed — but suffering is universal", { society: 2, pluralism: 2 }),
    c("Everything is context — and anyone who says otherwise is selling something", { trajectory: 2, society: 2 }),
  ] },
  { category: "ETHICS & MORALITY", stem: "What's the relationship between personal transformation and social change?", subtext: "Inner work vs. outer work. Or both.", choices: [
    c("Change yourself first — the world changes when individuals change", { practice: 2, mysticism: 2 }),
    c("Both — inner and outer transformation feed each other", { ethics: 2, practice: 2 }),
    c("Social change is more urgent — personal growth is a luxury", { society: 3, ethics: 1 }),
    c("Neither — I'm skeptical of both spiritual bypassing and activist burnout", { trajectory: 2, pluralism: 2 }),
  ] },
  { category: "ETHICS & MORALITY", stem: "How do you relate to forgiveness?", subtext: "Not the concept. The practice.", choices: [
    c("It's central — forgiveness is the heart of my spiritual life", { theism: 2, ethics: 2 }),
    c("It's important but it can't be forced — some things take time", { ethics: 2, practice: 2 }),
    c("I prefer 'release' to 'forgiveness' — letting go without condoning", { mysticism: 2, trajectory: 2 }),
    c("Some things shouldn't be forgiven — accountability matters more", { society: 2, ethics: 2 }),
  ] },
  { category: "MYSTICISM & EXPERIENCE", stem: "Have you ever experienced something you'd call 'mystical'?", subtext: "Unity, dissolution, the numinous — whatever cracked the ordinary open.", choices: [
    c("Yes — and it's the most real thing that's ever happened to me", { mysticism: 3, theism: 1 }),
    c("Yes — but I interpret it through a specific tradition", { mysticism: 2, heritage: 2 }),
    c("Maybe — I've had moments of deep awe or connection", { mysticism: 1, pluralism: 2, trajectory: 1 }),
    c("No — and I'm skeptical of the concept", { ethics: 2, society: 2 }),
  ] },
  { category: "MYSTICISM & EXPERIENCE", stem: "Is enlightenment real?", subtext: "Awakening, satori, union with God — achievable or mythological?", choices: [
    c("Yes — and it's the goal of human existence", { mysticism: 3, practice: 1 }),
    c("Yes — but it's not what most people think. It's ordinary, not extraordinary.", { mysticism: 2, trajectory: 2 }),
    c("It's a useful concept but probably not a permanent state", { pluralism: 2, practice: 2 }),
    c("No — it's a spiritual fantasy that keeps people from engaging with reality", { society: 2, ethics: 2 }),
  ] },
  { category: "MYSTICISM & EXPERIENCE", stem: "What's your relationship with silence?", subtext: "Not the absence of noise. The presence of something else.", choices: [
    c("It's where I meet the divine — silence is the language of God", { mysticism: 3, theism: 1 }),
    c("It's medicine — uncomfortable but necessary for growth", { practice: 3, mysticism: 1 }),
    c("I prefer it to most conversation — silence is honest", { trajectory: 2, mysticism: 2 }),
    c("I'd rather be in dialogue — with people, with texts, with ideas", { society: 2, heritage: 2 }),
  ] },
  { category: "MYSTICISM & EXPERIENCE", stem: "Is consciousness fundamental — or an accident of biology?", subtext: "The hard problem. The one science can't solve.", choices: [
    c("Consciousness is God — or at least the closest thing we have to God", { mysticism: 3, theism: 1 }),
    c("Consciousness is fundamental — the universe is aware, not just alive", { mysticism: 2, trajectory: 2 }),
    c("We don't know yet — and I'm comfortable with the mystery", { pluralism: 3, trajectory: 1 }),
    c("It's an emergent property of complex systems — beautiful but not magical", { society: 2, ethics: 2 }),
  ] },
  { category: "RELIGIOUS PLURALISM", stem: "How many paths lead to truth?", subtext: "The perennial question.", choices: [
    c("One — my tradition has it right, and the differences matter", { heritage: 3, scripture: 1 }),
    c("Many — different traditions are different faces of the same mountain", { pluralism: 3, mysticism: 1 }),
    c("Some — not all paths are equal, but several are legitimate", { pluralism: 2, heritage: 2 }),
    c("None — or all. Truth isn't a destination, it's a way of being.", { trajectory: 2, pluralism: 2 }),
  ] },
  { category: "RELIGIOUS PLURALISM", stem: "Should children be raised in a specific tradition — or left to choose?", subtext: "The inheritance question.", choices: [
    c("Raised in one — roots matter, and you can always branch out later", { heritage: 3, scripture: 1 }),
    c("Exposed to many — let them find their own way with a broad foundation", { pluralism: 3, trajectory: 1 }),
    c("Raised with values and ethics, not specific religious content", { ethics: 2, society: 2 }),
    c("Left alone — religion is a personal choice, not a parental one", { trajectory: 2, pluralism: 2 }),
  ] },
  { category: "RELIGIOUS PLURALISM", stem: "Can you be deeply committed to one tradition while respecting all others?", subtext: "Depth vs. breadth in spiritual life.", choices: [
    c("Yes — that's exactly my aspiration. Deep roots, open branches.", { heritage: 2, pluralism: 2 }),
    c("I've tried — but commitment to one tradition means believing it's truest", { heritage: 2, scripture: 2 }),
    c("I can't commit to just one — I need the freedom to draw from many", { pluralism: 3, trajectory: 1 }),
    c("I'm committed to none — and that's its own kind of freedom", { trajectory: 3, society: 1 }),
  ] },
  { category: "RELIGION & SOCIETY", stem: "Should religion influence politics?", subtext: "The separation question.", choices: [
    c("Yes — faith should inform how we govern and build society", { society: 2, heritage: 2 }),
    c("Values yes, institutions no — the wall of separation matters", { society: 2, ethics: 2 }),
    c("Religion should stay out of politics entirely", { pluralism: 2, trajectory: 2 }),
    c("The question is backwards — politics has corrupted religion, not the other way around", { ethics: 2, mysticism: 2 }),
  ] },
  { category: "RELIGION & SOCIETY", stem: "Is the world getting more spiritual — or less?", subtext: "The trajectory of the sacred in modern life.", choices: [
    c("Less — secularism is winning, and something precious is being lost", { heritage: 2, scripture: 2 }),
    c("More — but differently. Spirituality is evolving beyond traditional religion.", { trajectory: 3, pluralism: 1 }),
    c("Neither — the hunger for meaning is constant, only the forms change", { mysticism: 2, pluralism: 2 }),
    c("I hope less — religion has caused more harm than good", { society: 2, ethics: 2 }),
  ] },
  { category: "FUTURE TRAJECTORY", stem: "Where is your spiritual life heading?", subtext: "Not where it's been. Where it's going.", choices: [
    c("Deeper into my tradition — I'm going further in, not further out", { heritage: 3, scripture: 1 }),
    c("Toward synthesis — integrating the best of multiple traditions into something new", { pluralism: 2, trajectory: 2 }),
    c("Toward direct experience — less belief, more practice, more presence", { mysticism: 2, practice: 2 }),
    c("Away from religion entirely — toward philosophy, ethics, and human connection", { society: 2, ethics: 2 }),
  ] },
];

interface SpiritualTradition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  topDimensions: Dimension[];
  practices: string[];
  keyTexts: string[];
  figures: string[];
  modernExpressions: string[];
  growthEdge: string[];
}

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
  },
];

export function FindYourSpiritQuiz() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<Dimension, number>>({} as Record<Dimension, number>);
  const [topResult, setTopResult] = useState<SpiritualTradition | null>(null);
  const [secondResult, setSecondResult] = useState<SpiritualTradition | null>(null);
  const { markComplete } = useJourneyProgress();

  const computeResults = useCallback(
    (finalAnswers: Record<number, number>) => {
      const dims = {} as Record<Dimension, number>;
      DIMENSIONS.forEach((d) => (dims[d] = 0));

      Object.entries(finalAnswers).forEach(([qIdx, choiceIdx]) => {
        const q = QUESTIONS[parseInt(qIdx)];
        const choice = q?.choices[choiceIdx];
        if (!choice) return;
        for (const dim in choice.dimensions) {
          const d = dim as Dimension;
          dims[d] = (dims[d] || 0) + (choice.dimensions[d] ?? 0);
        }
      });

      const maxPossible = 12;
      const normalized = {} as Record<Dimension, number>;
      DIMENSIONS.forEach((d) => {
        normalized[d] = Math.min(100, Math.round((dims[d] / maxPossible) * 100));
      });
      setScores(normalized);

      const traditionScores = TRADITIONS.map((t) => {
        const score = t.topDimensions.reduce((sum, dim, idx) => sum + (normalized[dim] || 0) * (3 - idx), 0);
        return { tradition: t, score };
      }).sort((a, b) => b.score - a.score);

      setTopResult(traditionScores[0].tradition);
      setSecondResult(traditionScores[1].tradition);
      setPhase("results");
      markComplete("find-your-spirit");
    },
    [markComplete],
  );

  const handleAnswer = (choiceIdx: number) => {
    const next = { ...answers, [currentQ]: choiceIdx };
    setAnswers(next);
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
    else computeResults(next);
  };

  const displayScores = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of DIMENSIONS) out[DIMENSION_LABELS[d].split(" ")[0]] = scores[d] ?? 0;
    return out;
  }, [scores]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="spirit" />
        <AssessmentIntro
          title="Find Your Spirit"
          subtitle="The spirit doesn't need to be found. It needs to be remembered."
          description="Not religion. Not dogma. The raw, unmediated experience of something larger than yourself. This assessment maps your spiritual orientation across contemplation, service, nature, creativity, community, and transcendence — revealing the practice that will actually nourish your soul."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 18 }}
          whatYouGet={[
            "Your spiritual archetype and primary orientation",
            "A dimensional map of your spiritual landscape",
            "Understanding of your relationship with transcendence",
            "Curated practices aligned with your spiritual DNA",
          ]}
          accentColor={ACCENT}
          onBegin={() => setPhase("quiz")}
        />
      </div>
    );
  }

  if (phase === "quiz") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    return (
      <div className="relative z-1 flex min-h-screen flex-col font-sans text-[#2C1810]">
        <ThemedBackground theme="spirit" />
        <div className="fixed inset-x-0 top-0 z-50">
          <div className="h-[3px] bg-brand-gold/10">
            <div
              className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between px-6 py-3 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
            <button onClick={() => setPhase("landing")}>← EXIT</button>
            <span>
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>
        </div>

        <div className="relative z-1 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pt-20 pb-8">
          <div className="mb-6 font-mono text-[0.6rem] tracking-[0.15em] text-brand-gold uppercase">{q.category}</div>
          <h2 className="mb-3 text-center font-heading text-[clamp(1.3rem,3.5vw,1.8rem)] leading-[1.3] font-normal">{q.stem}</h2>
          <p className="mb-10 text-center text-sm text-[#888] italic">{q.subtext}</p>

          <div className="flex w-full flex-col gap-3">
            {q.choices.map((choice, ci) => (
              <button
                key={choice.text}
                onClick={() => handleAnswer(ci)}
                className={`rounded-lg border px-5 py-4 text-left text-[0.92rem] leading-relaxed transition-all ${
                  answers[currentQ] === ci ? "border-brand-gold-light/40 bg-brand-gold-light/15" : "border-black/8 bg-white/40"
                }`}
              >
                {choice.text}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              className="mt-6 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]"
            >
              ← PREVIOUS
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!topResult) return null;

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="spirit" />
        <EmailGate assessmentSlug="spirit" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="spirit" />

      <div className="border-b border-brand-gold/10 p-6 text-center">
        <Link href="/find-my" className="font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
          ← Back to Find My
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">Your Spiritual Tradition</div>
        <h1 className="mb-4 font-heading text-[clamp(2rem,5vw,3rem)] font-normal">{topResult.name}</h1>
        <p className="mb-8 font-heading text-lg text-brand-gold italic">{topResult.tagline}</p>
        <p className="mx-auto max-w-150 text-[1.05rem] leading-[1.8] text-[#5A4A3A]">{topResult.description}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12 text-center">
        <h3 className="mb-6 font-mono text-[0.65rem] tracking-[0.15em] text-[#888] uppercase">Your Spiritual Dimensions</h3>
        <div className="flex justify-center">
          <AssessmentRadarChart scores={displayScores} max={100} accentColor="#D4B96A" />
        </div>
        <div className="mt-8 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
          {DIMENSIONS.map((dim) => (
            <div
              key={dim}
              className={`rounded-lg border p-3 ${topResult.topDimensions.includes(dim) ? "border-brand-gold-light/30" : "border-black/5"}`}
            >
              <div className="mb-1 font-mono text-[0.55rem] tracking-[0.05em] text-[#888]">{DIMENSION_LABELS[dim]}</div>
              <div className={`font-heading text-xl ${topResult.topDimensions.includes(dim) ? "text-brand-gold" : "text-[#5A4A3A]"}`}>
                {scores[dim] || 0}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Practices</h3>
            {topResult.practices.map((p) => (
              <div key={p} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {p}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Key Texts</h3>
            {topResult.keyTexts.map((t) => (
              <div key={t} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Modern Expressions</h3>
            {topResult.modernExpressions.map((e) => (
              <div key={e} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {e}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Figures to Explore</h3>
            {topResult.figures.map((f) => (
              <div key={f} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Your Growth Edge</h3>
        {topResult.growthEdge.map((g) => (
          <div key={g} className="mb-3 border-l-2 border-[#C97B7B]/30 pl-4 text-[0.95rem] text-[#5A4A3A]">
            {g}
          </div>
        ))}
      </section>

      {secondResult && (
        <section className="mx-auto max-w-3xl border-t border-brand-gold/10 px-6 py-8">
          <div className="mb-3 font-mono text-[0.6rem] tracking-[0.15em] text-[#888] uppercase">Your Secondary Tradition</div>
          <h3 className="mb-2 font-heading text-2xl font-normal">{secondResult.name}</h3>
          <p className="mb-4 font-heading text-base text-brand-gold italic">{secondResult.tagline}</p>
          <p className="text-[0.95rem] leading-[1.7] text-[#5A4A3A]">{secondResult.description}</p>
        </section>
      )}

      <section className="mx-auto max-w-3xl border-t border-brand-gold/10 px-6 py-8">
        <div className="mb-6 text-center font-mono text-[0.6rem] tracking-[0.15em] text-[#888] uppercase">The Journey Continues</div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {[
            { name: "Find Your Religion", desc: "20 questions mapping your spiritual archetype across 8 dimensions", href: "/find-your-religion" },
            { name: "Find Your Therapy", desc: "25 questions matching you to your ideal therapeutic modality", href: "/find-your-therapy" },
            { name: "Find Your Purpose", desc: "The Dharma Finder — 25 questions revealing the work you were built for", href: "/assessments/dharma-finder" },
            { name: "Ecosystem Map", desc: "See all experiences and track your journey progress", href: "/ecosystem-map" },
          ].map((next) => (
            <Link key={next.name} href={next.href} className="block rounded-lg border border-black/6 bg-white/40 p-5">
              <div className="mb-2 font-mono text-[0.7rem] font-semibold text-brand-gold">{next.name}</div>
              <div className="text-[0.82rem] leading-relaxed text-[#888]">{next.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <JourneyTracker variant="light" currentAssessmentId="find-your-spirit" />
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <AssessmentResultActions accentColor={ACCENT} />
        <button
          onClick={() => {
            setPhase("landing");
            setCurrentQ(0);
            setAnswers({});
            setScores({} as Record<Dimension, number>);
            setTopResult(null);
            setSecondResult(null);
          }}
          className="rounded-lg border border-brand-gold/30 px-8 py-3 font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold uppercase"
        >
          Retake Assessment
        </button>
      </section>

      <footer className="border-t border-brand-gold/8 px-6 py-8 text-center">
        <div className="mb-2 font-heading text-sm text-[#555] italic">&quot;The wound is the place where the Light enters you.&quot;</div>
        <div className="font-mono text-[0.6rem] tracking-[0.1em] text-[#444]">Part of the Find My Ecosystem by Tony Greenberg</div>
      </footer>
    </div>
  );
}
