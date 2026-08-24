/**
 * FIND YOUR RELIGION
 * 
 * A standalone assessment mapping users to their spiritual/philosophical tradition.
 * 20 questions across 8 dimensions: transcendence, structure, community, mysticism,
 * ethics, practice, pluralism, and embodiment.
 * Results map to 8 spiritual archetypes with tradition recommendations.
 * 
 * Design: Same dark contemplative glass-morphism as Find My.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
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

interface Tradition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  primaryDimension: string;
  practices: string[];
  keyTexts: string[];
  figures: string[];
  resonatesWith: string[];
  tension: string[];
  shareText: string;
}

/* ── DIMENSION LABELS ── */

const DIMENSION_LABELS: Record<string, string> = {
  transcendence: "Transcendence",
  structure: "Structure & Tradition",
  community: "Community & Belonging",
  mysticism: "Mysticism & Direct Experience",
  ethics: "Ethics & Justice",
  practice: "Practice & Discipline",
  pluralism: "Pluralism & Openness",
  embodiment: "Embodiment & Presence",
};

/* ── QUESTIONS ── */

const QUESTIONS: Question[] = [
  // ── TRANSCENDENCE (Q1-3) ──
  {
    id: 1,
    category: "TRANSCENDENCE",
    stem: "When you think about God, the divine, or ultimate reality — what shows up?",
    subtext: "Not what you were taught. What you actually feel.",
    choices: [
      { text: "A personal presence — something that knows me and cares", dimensions: { transcendence: 3, community: 1 } },
      { text: "An impersonal force — consciousness, energy, the ground of being", dimensions: { transcendence: 2, mysticism: 2 } },
      { text: "A useful metaphor — but not literally real", dimensions: { ethics: 2, pluralism: 2 } },
      { text: "Nothing — and I'm at peace with that", dimensions: { embodiment: 2, ethics: 2 } },
    ],
  },
  {
    id: 2,
    category: "TRANSCENDENCE",
    stem: "Where do you most reliably encounter something larger than yourself?",
    subtext: "The moments when the membrane gets thin.",
    choices: [
      { text: "In nature — mountains, oceans, forests, the night sky", dimensions: { transcendence: 2, embodiment: 2 } },
      { text: "In silence — meditation, prayer, contemplation", dimensions: { mysticism: 3, practice: 1 } },
      { text: "In other people — love, service, collective action", dimensions: { community: 3, ethics: 1 } },
      { text: "In art, music, or creative expression", dimensions: { mysticism: 2, embodiment: 2 } },
    ],
  },
  {
    id: 3,
    category: "TRANSCENDENCE",
    stem: "What happens to us after we die?",
    subtext: "Your honest answer, not the safe one.",
    choices: [
      { text: "Something continues — a soul, a consciousness, a return", dimensions: { transcendence: 3, mysticism: 1 } },
      { text: "We merge back into the whole — individual identity dissolves", dimensions: { mysticism: 3, transcendence: 1 } },
      { text: "I don't know, and I've made peace with not knowing", dimensions: { pluralism: 3, embodiment: 1 } },
      { text: "Nothing — and that makes this life more precious, not less", dimensions: { embodiment: 3, ethics: 1 } },
    ],
  },
  // ── STRUCTURE & TRADITION (Q4-5) ──
  {
    id: 4,
    category: "STRUCTURE",
    stem: "How do you feel about organized religion?",
    subtext: "The institution, not the impulse behind it.",
    choices: [
      { text: "It's essential — tradition carries wisdom that individuals can't generate alone", dimensions: { structure: 3, community: 1 } },
      { text: "It's useful but needs constant reform — the container matters, but so does updating it", dimensions: { structure: 2, pluralism: 2 } },
      { text: "It's mostly harmful — power structures dressed up as spirituality", dimensions: { ethics: 2, pluralism: 2 } },
      { text: "I take what works and leave the rest — I'm building my own practice", dimensions: { pluralism: 2, mysticism: 2 } },
    ],
  },
  {
    id: 5,
    category: "STRUCTURE",
    stem: "Sacred texts — what are they to you?",
    subtext: "The Bible, the Quran, the Gita, the Tao Te Ching, or none of the above.",
    choices: [
      { text: "Divinely inspired — they carry authority that human reason alone can't match", dimensions: { structure: 3, transcendence: 1 } },
      { text: "Profound human wisdom — not literally divine, but deeply true", dimensions: { structure: 1, pluralism: 2, ethics: 1 } },
      { text: "Cultural artifacts — interesting but not binding on my life", dimensions: { pluralism: 2, embodiment: 2 } },
      { text: "I find more truth in poetry, philosophy, or direct experience", dimensions: { mysticism: 2, embodiment: 2 } },
    ],
  },
  // ── COMMUNITY & BELONGING (Q6-8) ──
  {
    id: 6,
    category: "COMMUNITY",
    stem: "What role does community play in your spiritual life?",
    subtext: "The people, not the building.",
    choices: [
      { text: "Central — I need to practice with others, worship together, belong to something", dimensions: { community: 3, structure: 1 } },
      { text: "Important but not essential — I value spiritual friendship but don't need a congregation", dimensions: { community: 2, pluralism: 2 } },
      { text: "My spiritual life is mostly private — community is for other things", dimensions: { mysticism: 2, embodiment: 2 } },
      { text: "I find community in shared action — building, serving, creating together", dimensions: { community: 2, ethics: 2 } },
    ],
  },
  {
    id: 7,
    category: "COMMUNITY",
    stem: "When you're suffering, what helps most?",
    subtext: "Not what should help. What actually does.",
    choices: [
      { text: "Prayer — talking to something beyond myself", dimensions: { transcendence: 3, community: 1 } },
      { text: "Being held — by a person, a community, a tradition", dimensions: { community: 3, structure: 1 } },
      { text: "Sitting with it — meditation, breath, radical acceptance", dimensions: { practice: 3, mysticism: 1 } },
      { text: "Doing something — service, work, physical movement", dimensions: { embodiment: 3, ethics: 1 } },
    ],
  },
  {
    id: 8,
    category: "COMMUNITY",
    stem: "How do you feel about ritual?",
    subtext: "Communion, chanting, Sabbath, ceremony, seasonal celebrations.",
    choices: [
      { text: "I crave it — ritual grounds me and connects me to something ancient", dimensions: { structure: 3, community: 1 } },
      { text: "I appreciate it when it's authentic, not performative", dimensions: { practice: 2, community: 2 } },
      { text: "I create my own — personal rituals that mean something to me specifically", dimensions: { mysticism: 2, embodiment: 2 } },
      { text: "I don't need it — I find meaning in more spontaneous ways", dimensions: { pluralism: 2, embodiment: 2 } },
    ],
  },
  // ── MYSTICISM & DIRECT EXPERIENCE (Q9-11) ──
  {
    id: 9,
    category: "MYSTICISM",
    stem: "Have you ever had an experience you'd call mystical, transcendent, or numinous?",
    subtext: "Something that cracked the ordinary open.",
    choices: [
      { text: "Yes — and it changed everything. I've been trying to get back there ever since.", dimensions: { mysticism: 3, transcendence: 1 } },
      { text: "Yes — but I interpret it through a specific tradition or framework", dimensions: { mysticism: 2, structure: 2 } },
      { text: "Maybe — I've had moments of awe or connection but I wouldn't call them mystical", dimensions: { embodiment: 2, pluralism: 2 } },
      { text: "No — and I'm skeptical of people who claim they have", dimensions: { ethics: 2, embodiment: 2 } },
    ],
  },
  {
    id: 10,
    category: "MYSTICISM",
    stem: "What's your relationship with silence?",
    subtext: "Real silence. Not the absence of noise — the presence of something else.",
    choices: [
      { text: "It's where I meet God — or whatever I call the deepest thing", dimensions: { mysticism: 3, transcendence: 1 } },
      { text: "It's uncomfortable but I know it's medicine — I'm learning to sit with it", dimensions: { practice: 3, mysticism: 1 } },
      { text: "I prefer it to most conversation — silence is honest", dimensions: { embodiment: 2, mysticism: 2 } },
      { text: "I'd rather be in dialogue — with people, with texts, with ideas", dimensions: { community: 2, structure: 2 } },
    ],
  },
  {
    id: 11,
    category: "MYSTICISM",
    stem: "Psychedelics, plant medicine, breathwork, ecstatic dance — what's your take?",
    subtext: "Not the politics. Your honest relationship with altered states.",
    choices: [
      { text: "They're sacred technologies — some of the most important tools we have", dimensions: { mysticism: 3, embodiment: 1 } },
      { text: "Interesting but not my path — I prefer practices that don't require substances", dimensions: { practice: 2, structure: 2 } },
      { text: "Dangerous without proper context — set, setting, and tradition matter enormously", dimensions: { structure: 2, community: 2 } },
      { text: "Not for me — I trust reason and grounded experience over altered states", dimensions: { ethics: 2, embodiment: 2 } },
    ],
  },
  // ── ETHICS & JUSTICE (Q12-14) ──
  {
    id: 12,
    category: "ETHICS",
    stem: "Where does morality come from?",
    subtext: "The source code of right and wrong.",
    choices: [
      { text: "From God or divine revelation — there are absolute moral truths", dimensions: { transcendence: 2, structure: 2 } },
      { text: "From human reason and empathy — we figure it out together", dimensions: { ethics: 3, pluralism: 1 } },
      { text: "From the consequences of our actions — what reduces suffering is good", dimensions: { ethics: 2, embodiment: 2 } },
      { text: "From the interconnection of all things — harm to one is harm to all", dimensions: { mysticism: 2, ethics: 2 } },
    ],
  },
  {
    id: 13,
    category: "ETHICS",
    stem: "What's the relationship between spirituality and social justice?",
    subtext: "Prayer and protest. Meditation and marching.",
    choices: [
      { text: "Inseparable — if your spirituality doesn't make you fight for justice, it's escapism", dimensions: { ethics: 3, community: 1 } },
      { text: "Connected but distinct — inner work and outer work feed each other", dimensions: { ethics: 2, practice: 2 } },
      { text: "Spirituality is primarily about inner transformation — the world changes when we change", dimensions: { mysticism: 2, practice: 2 } },
      { text: "I'm skeptical of mixing the two — both get corrupted", dimensions: { pluralism: 2, embodiment: 2 } },
    ],
  },
  {
    id: 14,
    category: "ETHICS",
    stem: "How do you relate to suffering?",
    subtext: "Not avoiding it. Your philosophy of it.",
    choices: [
      { text: "It has meaning — suffering is a teacher, a crucible, part of a larger plan", dimensions: { transcendence: 2, structure: 2 } },
      { text: "It's the first noble truth — life includes suffering, and liberation comes from understanding it", dimensions: { practice: 2, mysticism: 2 } },
      { text: "It's mostly unnecessary — caused by systems we could change if we had the will", dimensions: { ethics: 3, community: 1 } },
      { text: "It just is — not meaningful, not meaningless. The question is how we respond", dimensions: { embodiment: 3, pluralism: 1 } },
    ],
  },
  // ── PRACTICE & DISCIPLINE (Q15-17) ──
  {
    id: 15,
    category: "PRACTICE",
    stem: "Do you have a daily spiritual practice?",
    subtext: "Something you do every day — or most days — that connects you to what matters.",
    choices: [
      { text: "Yes — prayer, meditation, or devotional reading. It's the anchor of my day.", dimensions: { practice: 3, structure: 1 } },
      { text: "I try — but consistency is hard. I practice in seasons.", dimensions: { practice: 2, pluralism: 2 } },
      { text: "My practice is embodied — yoga, walking, cooking, being in nature", dimensions: { embodiment: 3, practice: 1 } },
      { text: "Not really — I'm more spontaneous than disciplined about these things", dimensions: { pluralism: 2, embodiment: 2 } },
    ],
  },
  {
    id: 16,
    category: "PRACTICE",
    stem: "What's your relationship with the body in spiritual life?",
    subtext: "Is the body a temple, a prison, a tool, or the whole point?",
    choices: [
      { text: "The body is sacred — incarnation is the point, not an obstacle", dimensions: { embodiment: 3, mysticism: 1 } },
      { text: "The body is a vehicle — important but not the destination", dimensions: { transcendence: 2, practice: 2 } },
      { text: "The body is where practice happens — posture, breath, sensation are the path", dimensions: { practice: 3, embodiment: 1 } },
      { text: "I'm honestly disconnected from my body in spiritual contexts — it's mostly a head thing", dimensions: { structure: 2, ethics: 2 } },
    ],
  },
  {
    id: 17,
    category: "PRACTICE",
    stem: "How important is a teacher, guru, priest, or spiritual director to you?",
    subtext: "The question of authority in your spiritual life.",
    choices: [
      { text: "Essential — I need someone further along the path to guide me", dimensions: { structure: 3, practice: 1 } },
      { text: "Helpful but not necessary — I learn from many sources", dimensions: { pluralism: 2, practice: 2 } },
      { text: "Dangerous — too much spiritual authority leads to abuse", dimensions: { ethics: 2, pluralism: 2 } },
      { text: "The best teacher is direct experience — everything else is commentary", dimensions: { mysticism: 3, embodiment: 1 } },
    ],
  },
  // ── PLURALISM & OPENNESS (Q18-19) ──
  {
    id: 18,
    category: "PLURALISM",
    stem: "How many paths lead to truth?",
    subtext: "The perennial question.",
    choices: [
      { text: "One — my tradition has it right, and the differences matter", dimensions: { structure: 3, transcendence: 1 } },
      { text: "Many — different traditions are different faces of the same mountain", dimensions: { pluralism: 3, mysticism: 1 } },
      { text: "Some — not all paths are equal, but several are legitimate", dimensions: { pluralism: 2, structure: 2 } },
      { text: "None — or all — truth isn't a destination, it's a way of being", dimensions: { embodiment: 2, pluralism: 2 } },
    ],
  },
  {
    id: 19,
    category: "PLURALISM",
    stem: "Could you marry or deeply partner with someone from a completely different spiritual tradition?",
    subtext: "Not in theory. In practice.",
    choices: [
      { text: "Yes — love transcends tradition, and the differences would enrich us", dimensions: { pluralism: 3, community: 1 } },
      { text: "Maybe — it would depend on how important their practice is to them", dimensions: { pluralism: 2, community: 2 } },
      { text: "It would be hard — shared spiritual life is too important to me", dimensions: { community: 2, structure: 2 } },
      { text: "No — I need someone who shares my path at the deepest level", dimensions: { structure: 3, community: 1 } },
    ],
  },
  // ── THE FINAL QUESTION ──
  {
    id: 20,
    category: "INTEGRATION",
    stem: "If you could only keep one thing from your spiritual life, what would it be?",
    subtext: "Everything else burns. What survives?",
    choices: [
      { text: "The relationship — with God, with the divine, with whatever I call the deepest thing", dimensions: { transcendence: 3, mysticism: 1 } },
      { text: "The community — the people who practice with me, who hold me accountable", dimensions: { community: 3, structure: 1 } },
      { text: "The practice — meditation, prayer, the daily discipline that keeps me sane", dimensions: { practice: 3, embodiment: 1 } },
      { text: "The ethics — the commitment to justice, compassion, and reducing suffering", dimensions: { ethics: 3, pluralism: 1 } },
    ],
  },
];

/* ── SPIRITUAL ARCHETYPES ── */

const TRADITIONS: Tradition[] = [
  {
    id: "transcendence",
    name: "The Devotee",
    tagline: "You seek the face of God. Not a concept — a presence.",
    description: "Your spiritual life is organized around relationship with the divine. You pray, you worship, you surrender. Whether you call it God, Allah, Brahman, or the Beloved — there is a Someone or Something at the center of your universe, and your deepest impulse is to draw closer. Traditions that honor personal devotion, prayer, and divine relationship will feel like home.",
    primaryDimension: "transcendence",
    practices: ["Prayer and contemplation", "Devotional reading and lectio divina", "Worship and liturgy", "Surrender practices"],
    keyTexts: ["The Psalms", "The Bhagavad Gita", "The Cloud of Unknowing", "Rumi's Masnavi"],
    figures: ["Teresa of Ávila", "Rumi", "Mirabai", "Thomas Merton", "A.W. Tozer"],
    resonatesWith: ["Christianity (contemplative)", "Bhakti Hinduism", "Sufism", "Hasidic Judaism"],
    tension: ["May struggle with doubt as betrayal rather than growth", "Can become dependent on emotional experiences of God"],
    shareText: "I'm The Devotee — my spiritual life is built on relationship with the divine. Find your spiritual archetype →",
  },
  {
    id: "structure",
    name: "The Traditionalist",
    tagline: "The ancient paths are ancient for a reason. You trust the container.",
    description: "You believe that spiritual wisdom is carried by tradition — in liturgy, in scripture, in the accumulated practice of centuries. You're not naive about institutional failures, but you know that individual spiritual freelancing loses something essential. The container matters. The lineage matters. You'd rather reform a tradition from within than abandon it for something untested.",
    primaryDimension: "structure",
    practices: ["Regular worship attendance", "Liturgical calendar observance", "Scriptural study", "Sacramental participation"],
    keyTexts: ["The Bible", "The Quran", "The Torah and Talmud", "The Book of Common Prayer"],
    figures: ["Pope Francis", "Rabbi Jonathan Sacks", "C.S. Lewis", "Dietrich Bonhoeffer"],
    resonatesWith: ["Catholicism", "Orthodox Christianity", "Traditional Judaism", "Sunni Islam", "Confucianism"],
    tension: ["May confuse tradition with truth", "Can resist necessary evolution", "Risk of spiritual rigidity"],
    shareText: "I'm The Traditionalist — I trust the container that centuries of practice have built. Find your spiritual archetype →",
  },
  {
    id: "community",
    name: "The Communitarian",
    tagline: "Spirituality is a team sport. You find God in the 'we.'",
    description: "For you, the spiritual life is fundamentally communal. You don't just believe in community — you experience the divine through it. Singing together, serving together, breaking bread together — these aren't accessories to your faith, they're the substance of it. You know that isolation is the enemy of the soul, and that we become who we're meant to be only in relationship.",
    primaryDimension: "community",
    practices: ["Communal worship and singing", "Small group fellowship", "Shared meals and celebrations", "Service projects and mutual aid"],
    keyTexts: ["Acts 2 (early church community)", "The Rule of St. Benedict", "Ubuntu philosophy", "Martin Buber's I and Thou"],
    figures: ["Martin Luther King Jr.", "Dorothy Day", "Desmond Tutu", "Thich Nhat Hanh"],
    resonatesWith: ["Quakerism", "African-American church tradition", "Sangha Buddhism", "Intentional communities", "Liberation theology"],
    tension: ["May avoid solitary practice that's also necessary", "Can become codependent on community approval", "Risk of groupthink"],
    shareText: "I'm The Communitarian — I find the divine in the 'we,' not just the 'I.' Find your spiritual archetype →",
  },
  {
    id: "mysticism",
    name: "The Mystic",
    tagline: "You don't believe in God. You've tasted God. Direct experience is everything.",
    description: "You've had moments — maybe many — where the veil between ordinary and extraordinary dissolved. You're not interested in theology as an intellectual exercise. You want the real thing: direct, unmediated experience of ultimate reality. Whether through meditation, plant medicine, contemplative prayer, or spontaneous grace — you know that the map is not the territory, and you'd rather be lost in the territory than safe with the map.",
    primaryDimension: "mysticism",
    practices: ["Deep meditation (vipassana, zazen, centering prayer)", "Contemplative prayer", "Plant medicine ceremony", "Ecstatic practices (breathwork, chanting, dance)"],
    keyTexts: ["The Tao Te Ching", "The Upanishads", "Meister Eckhart's sermons", "The Perennial Philosophy by Aldous Huxley"],
    figures: ["Meister Eckhart", "Ramana Maharshi", "Hildegard of Bingen", "Alan Watts", "Ram Dass"],
    resonatesWith: ["Zen Buddhism", "Advaita Vedanta", "Christian mysticism", "Sufism", "Taoism", "Perennial philosophy"],
    tension: ["May devalue the ordinary in pursuit of peak experiences", "Can become spiritually bypassing", "Risk of guru dependency"],
    shareText: "I'm The Mystic — I don't believe in the divine, I've tasted it. Direct experience is everything. Find your archetype →",
  },
  {
    id: "ethics",
    name: "The Prophet",
    tagline: "If your spirituality doesn't make you dangerous to injustice, it's decoration.",
    description: "Your spiritual life is inseparable from your commitment to justice. You see the sacred in the struggle — in the fight for the marginalized, the oppressed, the forgotten. You might pray, but your deepest prayer is action. You're suspicious of spirituality that stays comfortable, that never confronts power, that mistakes inner peace for moral neutrality. The prophetic tradition — from Amos to Dorothy Day to MLK — is your lineage.",
    primaryDimension: "ethics",
    practices: ["Social justice activism", "Ethical living and simplicity", "Prophetic witness", "Community organizing"],
    keyTexts: ["The Hebrew Prophets (Amos, Isaiah, Micah)", "Letter from Birmingham Jail", "Pedagogy of the Oppressed", "The Tao of Liberation"],
    figures: ["Dorothy Day", "Martin Luther King Jr.", "Oscar Romero", "Vandana Shiva", "Cornel West"],
    resonatesWith: ["Liberation theology", "Engaged Buddhism", "Prophetic Judaism", "Quakerism", "Secular humanism", "Ethical Culture"],
    tension: ["May burn out from constant moral urgency", "Can become self-righteous", "Risk of reducing spirituality to politics"],
    shareText: "I'm The Prophet — spirituality without justice is decoration. Find your spiritual archetype →",
  },
  {
    id: "practice",
    name: "The Practitioner",
    tagline: "You don't talk about it. You do it. Every day. The practice is the path.",
    description: "For you, spirituality is a discipline — not a feeling, not a belief, but a daily practice that shapes who you become. You meditate, you pray, you do yoga, you sit — not because it feels good (though sometimes it does) but because the practice itself is the transformation. You trust the process more than the peak experience. You know that showing up is 90% of enlightenment.",
    primaryDimension: "practice",
    practices: ["Daily meditation or prayer", "Yoga or tai chi", "Fasting and ascetic practices", "Journaling and self-examination"],
    keyTexts: ["The Yoga Sutras of Patanjali", "The Rule of St. Benedict", "Zen Mind, Beginner's Mind", "The Spiritual Exercises of Ignatius"],
    figures: ["Thich Nhat Hanh", "Pema Chödrön", "Ignatius of Loyola", "B.K.S. Iyengar", "Sadhguru"],
    resonatesWith: ["Zen Buddhism", "Benedictine monasticism", "Yoga traditions", "Ignatian spirituality", "Vipassana"],
    tension: ["May become rigid or legalistic about practice", "Can mistake discipline for transformation", "Risk of spiritual pride"],
    shareText: "I'm The Practitioner — I don't talk about it, I do it. Every day. Find your spiritual archetype →",
  },
  {
    id: "pluralism",
    name: "The Seeker",
    tagline: "You collect wisdom like a bee collects pollen. No single flower has it all.",
    description: "You refuse to be contained by a single tradition. You've read the Tao Te Ching and the Gospel of Thomas and the Bhagavad Gita and found truth in all of them. You're not confused — you're comprehensive. You believe that the divine is too vast for any one tradition to capture, and your spiritual life is a creative synthesis of the best of what humanity has discovered about the sacred.",
    primaryDimension: "pluralism",
    practices: ["Cross-tradition study and practice", "Interfaith dialogue", "Personal synthesis and experimentation", "Pilgrimage across traditions"],
    keyTexts: ["The Perennial Philosophy by Aldous Huxley", "The World's Religions by Huston Smith", "Be Here Now by Ram Dass", "Siddhartha by Hermann Hesse"],
    figures: ["Ram Dass", "Aldous Huxley", "Karen Armstrong", "Huston Smith", "Joseph Campbell"],
    resonatesWith: ["Unitarian Universalism", "Perennial philosophy", "Integral spirituality", "Bahá'í Faith", "Spiritual but not religious"],
    tension: ["May lack depth from lack of commitment", "Can become a spiritual tourist", "Risk of appropriation without accountability"],
    shareText: "I'm The Seeker — no single tradition has it all, so I collect wisdom from everywhere. Find your archetype →",
  },
  {
    id: "embodiment",
    name: "The Grounded",
    tagline: "Heaven is a nice idea. You'd rather be fully alive right here.",
    description: "Your spirituality is rooted in this world, this body, this moment. You're skeptical of otherworldly promises and transcendent escapes. For you, the sacred is in the ordinary — in a good meal, in honest work, in the feel of soil under your fingernails. You might not call yourself spiritual at all, but you live with a presence and intentionality that many religious people envy. You've found that paying attention is the highest form of prayer.",
    primaryDimension: "embodiment",
    practices: ["Mindful daily living", "Nature immersion", "Cooking, gardening, craft", "Somatic awareness and movement"],
    keyTexts: ["Walden by Thoreau", "The Sabbath by Abraham Joshua Heschel", "Braiding Sweetgrass by Robin Wall Kimmerer", "Meditations by Marcus Aurelius"],
    figures: ["Henry David Thoreau", "Wendell Berry", "Mary Oliver", "Marcus Aurelius", "Robin Wall Kimmerer"],
    resonatesWith: ["Stoicism", "Secular Buddhism", "Nature spirituality", "Indigenous traditions", "Epicureanism", "Philosophical Taoism"],
    tension: ["May dismiss genuine transcendent experiences", "Can become spiritually isolated", "Risk of reducing the sacred to the material"],
    shareText: "I'm The Grounded — the sacred is in the ordinary, and I'd rather be fully alive right here. Find your archetype →",
  },
];

/* ── COMPONENT ── */

export default function FindYourReligion() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [topTradition, setTopTradition] = useState<Tradition | null>(null);
  const [secondTradition, setSecondTradition] = useState<Tradition | null>(null);
  const { markComplete } = useJourneyProgress();

  /* ── Score calculation ── */
  const calculateResults = useCallback(() => {
    const dims: Record<string, number> = {};
    Object.keys(DIMENSION_LABELS).forEach((d) => (dims[d] = 0));

    Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
      const q = QUESTIONS[parseInt(qIdx)];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, val]) => {
        dims[dim] = (dims[dim] || 0) + val;
      });
    });

    // Normalize to 0-100
    const maxPossible = 10; // ~3pts * 3 questions per dimension
    const normalized: Record<string, number> = {};
    Object.entries(dims).forEach(([dim, val]) => {
      normalized[dim] = Math.min(100, Math.round((val / maxPossible) * 100));
    });

    setScores(normalized);

    // Find top tradition
    const sorted = TRADITIONS.sort((a, b) => (normalized[b.primaryDimension] || 0) - (normalized[a.primaryDimension] || 0));
    setTopTradition(sorted[0]);
    setSecondTradition(sorted[1]);
    setPhase("results");
    markComplete("find-your-religion");
    try { localStorage.setItem("religion_results", JSON.stringify({ archetype: sorted[0].name, primaryPath: sorted[0].name, scores: normalized, timestamp: Date.now() })); } catch {}
  }, [answers, markComplete]);

  /* ── Answer handler ── */
  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const newAnswers = { ...answers, [currentQ]: choiceIdx };
      setAnswers(newAnswers);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Trigger calculation with updated answers
        const dims: Record<string, number> = {};
        Object.keys(DIMENSION_LABELS).forEach((d) => (dims[d] = 0));
        Object.entries(newAnswers).forEach(([qIdx, cIdx]) => {
          const q = QUESTIONS[parseInt(qIdx)];
          if (!q) return;
          const choice = q.choices[cIdx];
          if (!choice) return;
          Object.entries(choice.dimensions).forEach(([dim, val]) => {
            dims[dim] = (dims[dim] || 0) + val;
          });
        });
        const maxPossible = 10;
        const normalized: Record<string, number> = {};
        Object.entries(dims).forEach(([dim, val]) => {
          normalized[dim] = Math.min(100, Math.round((val / maxPossible) * 100));
        });
        setScores(normalized);
        const sorted = [...TRADITIONS].sort((a, b) => (normalized[b.primaryDimension] || 0) - (normalized[a.primaryDimension] || 0));
        setTopTradition(sorted[0]);
        setSecondTradition(sorted[1]);
        setPhase("results");
        markComplete("find-your-religion");
        try { localStorage.setItem("religion_results", JSON.stringify({ archetype: sorted[0].name, primaryPath: sorted[0].name, scores: normalized, timestamp: Date.now() })); } catch {}
      }
    },
    [answers, currentQ, markComplete]
  );

  /* ── Radar chart (SVG) ── */
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
        {/* Grid rings */}
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
        {/* Axis lines */}
        {dims.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="rgba(212,185,106,0.08)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Data polygon */}
        <polygon points={polygon} fill="rgba(212,185,106,0.15)" stroke="#D4B96A" strokeWidth="1.5" />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />
        ))}
        {/* Labels */}
        {dims.map((d, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const lx = cx + (r + 22) * Math.cos(angle);
          const ly = cy + (r + 22) * Math.sin(angle);
          return (
            <text
              key={d}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#999"
              fontSize="6.5"
              fontFamily="'DM Mono', monospace"
            >
              {DIMENSION_LABELS[d]?.split(" ")[0]}
            </text>
          );
        })}
      </svg>
    );
  }, [scores]);

  /* ── LANDING PHASE ── */
  if (phase === "landing") {
    return (
      <>
        <SEO
          title="Find Your Religion | Tony Greenberg"
          description="A 20-question assessment mapping your spiritual archetype across 8 dimensions."
          path="/find-your-religion"
        indexable={true}
        />
        <AssessmentIntro
          title="Find Your Religion"
          subtitle="Faith isn't inherited. It's discovered."
          description="Whether you're deeply devout, spiritually curious, or militantly secular — this assessment maps your relationship with organized belief, ritual, community, ethics, mystery, and meaning. No judgment. No conversion. Just clarity about where you actually stand."
          stats={{ questions: 20, dimensions: 8, minutes: 10 }}
          whatYouGet={["Your religious/philosophical archetype", "A dimensional map of your relationship with belief", "Understanding of what draws you to (or repels you from) organized faith", "Resources aligned with your actual worldview"]}
          accentColor="#F9A825"
          onBegin={() => setPhase('quiz')}
        />
      </>
    );
  }

  /* ── QUIZ PHASE ── */
  if (phase === "quiz") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "transparent", position: "relative", zIndex: 1,
          color: "#2C1810",
          fontFamily: "'Source Sans 3', sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Progress bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
          <div style={{ height: "3px", background: "rgba(212,185,106,0.1)" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.75rem 1.5rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "#4A3A2A",
              letterSpacing: "0.1em",
            }}
          >
            <span style={{ cursor: "pointer" }} onClick={() => setPhase("landing")}>
              ← EXIT
            </span>
            <span>
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5rem 1.5rem 2rem",
            maxWidth: "640px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1.5rem",
            }}
          >
            {q.category}
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
              fontWeight: 400,
              lineHeight: 1.3,
              textAlign: "center",
              margin: "0 0 0.75rem",
            }}
          >
            {q.stem}
          </h2>

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#888",
              textAlign: "center",
              marginBottom: "2.5rem",
            }}
          >
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

          {/* Back button */}
          {currentQ > 0 && (
            <button
              onClick={() => setCurrentQ(currentQ - 1)}
              style={{
                marginTop: "1.5rem",
                background: "none",
                border: "none",
                color: "#4A3A2A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              ← PREVIOUS
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── RESULTS PHASE ── */
  if (!topTradition) return null;

  if (!emailGated) {
    return (
      <div style={{ minHeight: "100vh", background: "transparent", position: "relative", zIndex: 1, color: "#2C1810", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <EmailGate assessmentName="spiritual path" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <>
      <ThemedBackground theme="religion" />
      <SEO
        title={`You're ${topTradition.name} | Find Your Religion`}
        description={topTradition.tagline}
        path="/find-your-religion"
        indexable={true}
      />
      <div
        style={{
          minHeight: "100vh",
          background: "transparent", position: "relative", zIndex: 1,
          color: "#2C1810",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ padding: "1.5rem", textAlign: "center", borderBottom: "1px solid rgba(212,185,106,0.1)" }}>
          <Link
            href="/find-my"
            className="no-underline"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "#4A3A2A",
              textDecoration: "none",
            }}
          >
            ← Back to Find My
          </Link>
        </div>

        {/* Primary result */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#8B6914",
              marginBottom: "1rem",
            }}
          >
            Your Spiritual Archetype
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400,
              margin: "0 0 1rem",
            }}
          >
            {topTradition.name}
          </h1>

          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              color: "#8B6914",
              margin: "0 0 2rem",
            }}
          >
            {topTradition.tagline}
          </p>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "#BBB",
              maxWidth: "580px",
              margin: "0 auto 2.5rem",
            }}
          >
            {topTradition.description}
          </p>
        </section>

        {/* Radar chart */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem", textAlign: "center" }}>
          <h3
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#888",
              marginBottom: "1.5rem",
            }}
          >
            Your Spiritual Dimensions
          </h3>
          <div style={{ display: "flex", justifyContent: "center" }}>{RadarChart}</div>

          {/* Dimension scores */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "2rem" }}>
            {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
              <div
                key={key}
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                  border: key === topTradition.primaryDimension ? "1px solid rgba(212,185,106,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#888", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                  {label}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: key === topTradition.primaryDimension ? "#D4B96A" : "#F5F0E0" }}>
                  {scores[key] || 0}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practices & Texts */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
                Practices That Fit
              </h3>
              {topTradition.practices.map((p, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>
                  {p}
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
                Key Texts
              </h3>
              {topTradition.keyTexts.map((t, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditions & Figures */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
                Traditions That Resonate
              </h3>
              {topTradition.resonatesWith.map((t, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>
                  {t}
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
                Figures to Explore
              </h3>
              {topTradition.figures.map((f, i) => (
                <div key={i} style={{ fontSize: "0.9rem", color: "#BBB", marginBottom: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(212,185,106,0.2)" }}>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth edge */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B6914", marginBottom: "1rem" }}>
            Your Growth Edge
          </h3>
          {topTradition.tension.map((t, i) => (
            <div key={i} style={{ fontSize: "0.95rem", color: "#5A4A3A", marginBottom: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(201,123,123,0.3)" }}>
              {t}
            </div>
          ))}
        </section>

        {/* Secondary archetype */}
        {secondTradition && (
          <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem", borderTop: "1px solid rgba(212,185,106,0.1)" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#888", marginBottom: "0.75rem" }}>
              Your Secondary Archetype
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 400, margin: "0 0 0.5rem" }}>
              {secondTradition.name}
            </h3>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#8B6914", margin: "0 0 1rem" }}>
              {secondTradition.tagline}
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#5A4A3A" }}>
              {secondTradition.description}
            </p>
          </section>
        )}

        {/* Journey continues */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 3rem", borderTop: "1px solid rgba(212,185,106,0.1)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#888", marginBottom: "1.5rem", textAlign: "center" }}>
            The Journey Continues
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { name: "Find Your Spirit", desc: "35 questions mapping your spiritual landscape across 10 dimensions", href: "/find-your-spirit", internal: true },
              { name: "Find Your Therapy", desc: "25 questions matching you to your ideal therapeutic modality", href: "/find-your-therapy", internal: true },
              { name: "Find Your Purpose", desc: "The Dharma Finder — 25 questions revealing the work you were built for", href: "/assessments/dharma-finder", internal: true },
              { name: "Ecosystem Map", desc: "See all experiences and track your journey progress", href: "/ecosystem-map", internal: true },
            ].map((next) => (
              <Link
                key={next.name}
                href={next.href}
                className="no-underline"
                style={{
                  display: "block",
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 600, color: "#8B6914", marginBottom: "0.5rem" }}>
                  {next.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.5 }}>
                  {next.desc}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Journey Tracker */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
          <JourneyTracker variant="light" currentAssessmentId="find-your-religion" />
        </section>

          <WhatsNext />
        {/* Retake */}
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem", textAlign: "center" }}>
          <button
            onClick={() => {
              setPhase("landing");
              setCurrentQ(0);
              setAnswers({});
              setScores({});
              setTopTradition(null);
              setSecondTradition(null);
            }}
            style={{
              padding: "0.75rem 2rem",
              background: "none",
              border: "1px solid rgba(212,185,106,0.3)",
              borderRadius: "8px",
              color: "#8B6914",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="religion"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ style: topTradition?.name, scores })}
              totalScore={null}
            />

            Retake Assessment
          </button>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(212,185,106,0.08)", padding: "2rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontStyle: "italic", color: "#555", marginBottom: "0.5rem" }}>
            The resistance is the roadmap.
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#444" }}>
            Part of the Find My Ecosystem by Tony Greenberg
          </div>
        </footer>
      </div>
    </>
  );
}
