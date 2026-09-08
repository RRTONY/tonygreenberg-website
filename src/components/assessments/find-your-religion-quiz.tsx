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

// Ported from legacy client/src/pages/FindYourReligion.tsx — a real
// 20-question assessment across 8 dimensions (transcendence/structure/
// community/mysticism/ethics/practice/pluralism/embodiment), mapping to 8
// real spiritual/philosophical archetypes. Every question, every
// archetype's real description/practices/key texts/figures/resonant
// traditions/growth-edge tensions, and the real scoring (normalize each
// dimension 0-100, pick the archetype whose primary dimension scores
// highest) are ported unchanged and verbatim. Legacy's own JSX had a real
// structural bug — `<AssessmentResultActions>` was rendered nested
// *inside* the "Retake Assessment" `<button>` element (a button inside a
// button, invalid HTML) — not reproduced; rendered as a sibling before
// the retake button instead, same fix already applied on
// `/find-your-spirit`. Uses the same simplified (PDF-only)
// `AssessmentResultActions` built for that page. Legacy's results screen
// used light grey/cream text on the real light pastel "religion" theme —
// same low-contrast bug already caught and fixed on several other
// assessments — normalized to dark ink here too.
type Dimension = "transcendence" | "structure" | "community" | "mysticism" | "ethics" | "practice" | "pluralism" | "embodiment";

const DIMENSION_LABELS: Record<Dimension, string> = {
  transcendence: "Transcendence",
  structure: "Structure & Tradition",
  community: "Community & Belonging",
  mysticism: "Mysticism & Direct Experience",
  ethics: "Ethics & Justice",
  practice: "Practice & Discipline",
  pluralism: "Pluralism & Openness",
  embodiment: "Embodiment & Presence",
};
const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const ACCENT = "#F9A825";

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
  { category: "TRANSCENDENCE", stem: "When you think about God, the divine, or ultimate reality — what shows up?", subtext: "Not what you were taught. What you actually feel.", choices: [
    c("A personal presence — something that knows me and cares", { transcendence: 3, community: 1 }),
    c("An impersonal force — consciousness, energy, the ground of being", { transcendence: 2, mysticism: 2 }),
    c("A useful metaphor — but not literally real", { ethics: 2, pluralism: 2 }),
    c("Nothing — and I'm at peace with that", { embodiment: 2, ethics: 2 }),
  ] },
  { category: "TRANSCENDENCE", stem: "Where do you most reliably encounter something larger than yourself?", subtext: "The moments when the membrane gets thin.", choices: [
    c("In nature — mountains, oceans, forests, the night sky", { transcendence: 2, embodiment: 2 }),
    c("In silence — meditation, prayer, contemplation", { mysticism: 3, practice: 1 }),
    c("In other people — love, service, collective action", { community: 3, ethics: 1 }),
    c("In art, music, or creative expression", { mysticism: 2, embodiment: 2 }),
  ] },
  { category: "TRANSCENDENCE", stem: "What happens to us after we die?", subtext: "Your honest answer, not the safe one.", choices: [
    c("Something continues — a soul, a consciousness, a return", { transcendence: 3, mysticism: 1 }),
    c("We merge back into the whole — individual identity dissolves", { mysticism: 3, transcendence: 1 }),
    c("I don't know, and I've made peace with not knowing", { pluralism: 3, embodiment: 1 }),
    c("Nothing — and that makes this life more precious, not less", { embodiment: 3, ethics: 1 }),
  ] },
  { category: "STRUCTURE", stem: "How do you feel about organized religion?", subtext: "The institution, not the impulse behind it.", choices: [
    c("It's essential — tradition carries wisdom that individuals can't generate alone", { structure: 3, community: 1 }),
    c("It's useful but needs constant reform — the container matters, but so does updating it", { structure: 2, pluralism: 2 }),
    c("It's mostly harmful — power structures dressed up as spirituality", { ethics: 2, pluralism: 2 }),
    c("I take what works and leave the rest — I'm building my own practice", { pluralism: 2, mysticism: 2 }),
  ] },
  { category: "STRUCTURE", stem: "Sacred texts — what are they to you?", subtext: "The Bible, the Quran, the Gita, the Tao Te Ching, or none of the above.", choices: [
    c("Divinely inspired — they carry authority that human reason alone can't match", { structure: 3, transcendence: 1 }),
    c("Profound human wisdom — not literally divine, but deeply true", { structure: 1, pluralism: 2, ethics: 1 }),
    c("Cultural artifacts — interesting but not binding on my life", { pluralism: 2, embodiment: 2 }),
    c("I find more truth in poetry, philosophy, or direct experience", { mysticism: 2, embodiment: 2 }),
  ] },
  { category: "COMMUNITY", stem: "What role does community play in your spiritual life?", subtext: "The people, not the building.", choices: [
    c("Central — I need to practice with others, worship together, belong to something", { community: 3, structure: 1 }),
    c("Important but not essential — I value spiritual friendship but don't need a congregation", { community: 2, pluralism: 2 }),
    c("My spiritual life is mostly private — community is for other things", { mysticism: 2, embodiment: 2 }),
    c("I find community in shared action — building, serving, creating together", { community: 2, ethics: 2 }),
  ] },
  { category: "COMMUNITY", stem: "When you're suffering, what helps most?", subtext: "Not what should help. What actually does.", choices: [
    c("Prayer — talking to something beyond myself", { transcendence: 3, community: 1 }),
    c("Being held — by a person, a community, a tradition", { community: 3, structure: 1 }),
    c("Sitting with it — meditation, breath, radical acceptance", { practice: 3, mysticism: 1 }),
    c("Doing something — service, work, physical movement", { embodiment: 3, ethics: 1 }),
  ] },
  { category: "COMMUNITY", stem: "How do you feel about ritual?", subtext: "Communion, chanting, Sabbath, ceremony, seasonal celebrations.", choices: [
    c("I crave it — ritual grounds me and connects me to something ancient", { structure: 3, community: 1 }),
    c("I appreciate it when it's authentic, not performative", { practice: 2, community: 2 }),
    c("I create my own — personal rituals that mean something to me specifically", { mysticism: 2, embodiment: 2 }),
    c("I don't need it — I find meaning in more spontaneous ways", { pluralism: 2, embodiment: 2 }),
  ] },
  { category: "MYSTICISM", stem: "Have you ever had an experience you'd call mystical, transcendent, or numinous?", subtext: "Something that cracked the ordinary open.", choices: [
    c("Yes — and it changed everything. I've been trying to get back there ever since.", { mysticism: 3, transcendence: 1 }),
    c("Yes — but I interpret it through a specific tradition or framework", { mysticism: 2, structure: 2 }),
    c("Maybe — I've had moments of awe or connection but I wouldn't call them mystical", { embodiment: 2, pluralism: 2 }),
    c("No — and I'm skeptical of people who claim they have", { ethics: 2, embodiment: 2 }),
  ] },
  { category: "MYSTICISM", stem: "What's your relationship with silence?", subtext: "Real silence. Not the absence of noise — the presence of something else.", choices: [
    c("It's where I meet God — or whatever I call the deepest thing", { mysticism: 3, transcendence: 1 }),
    c("It's uncomfortable but I know it's medicine — I'm learning to sit with it", { practice: 3, mysticism: 1 }),
    c("I prefer it to most conversation — silence is honest", { embodiment: 2, mysticism: 2 }),
    c("I'd rather be in dialogue — with people, with texts, with ideas", { community: 2, structure: 2 }),
  ] },
  { category: "MYSTICISM", stem: "Psychedelics, plant medicine, breathwork, ecstatic dance — what's your take?", subtext: "Not the politics. Your honest relationship with altered states.", choices: [
    c("They're sacred technologies — some of the most important tools we have", { mysticism: 3, embodiment: 1 }),
    c("Interesting but not my path — I prefer practices that don't require substances", { practice: 2, structure: 2 }),
    c("Dangerous without proper context — set, setting, and tradition matter enormously", { structure: 2, community: 2 }),
    c("Not for me — I trust reason and grounded experience over altered states", { ethics: 2, embodiment: 2 }),
  ] },
  { category: "ETHICS", stem: "Where does morality come from?", subtext: "The source code of right and wrong.", choices: [
    c("From God or divine revelation — there are absolute moral truths", { transcendence: 2, structure: 2 }),
    c("From human reason and empathy — we figure it out together", { ethics: 3, pluralism: 1 }),
    c("From the consequences of our actions — what reduces suffering is good", { ethics: 2, embodiment: 2 }),
    c("From the interconnection of all things — harm to one is harm to all", { mysticism: 2, ethics: 2 }),
  ] },
  { category: "ETHICS", stem: "What's the relationship between spirituality and social justice?", subtext: "Prayer and protest. Meditation and marching.", choices: [
    c("Inseparable — if your spirituality doesn't make you fight for justice, it's escapism", { ethics: 3, community: 1 }),
    c("Connected but distinct — inner work and outer work feed each other", { ethics: 2, practice: 2 }),
    c("Spirituality is primarily about inner transformation — the world changes when we change", { mysticism: 2, practice: 2 }),
    c("I'm skeptical of mixing the two — both get corrupted", { pluralism: 2, embodiment: 2 }),
  ] },
  { category: "ETHICS", stem: "How do you relate to suffering?", subtext: "Not avoiding it. Your philosophy of it.", choices: [
    c("It has meaning — suffering is a teacher, a crucible, part of a larger plan", { transcendence: 2, structure: 2 }),
    c("It's the first noble truth — life includes suffering, and liberation comes from understanding it", { practice: 2, mysticism: 2 }),
    c("It's mostly unnecessary — caused by systems we could change if we had the will", { ethics: 3, community: 1 }),
    c("It just is — not meaningful, not meaningless. The question is how we respond", { embodiment: 3, pluralism: 1 }),
  ] },
  { category: "PRACTICE", stem: "Do you have a daily spiritual practice?", subtext: "Something you do every day — or most days — that connects you to what matters.", choices: [
    c("Yes — prayer, meditation, or devotional reading. It's the anchor of my day.", { practice: 3, structure: 1 }),
    c("I try — but consistency is hard. I practice in seasons.", { practice: 2, pluralism: 2 }),
    c("My practice is embodied — yoga, walking, cooking, being in nature", { embodiment: 3, practice: 1 }),
    c("Not really — I'm more spontaneous than disciplined about these things", { pluralism: 2, embodiment: 2 }),
  ] },
  { category: "PRACTICE", stem: "What's your relationship with the body in spiritual life?", subtext: "Is the body a temple, a prison, a tool, or the whole point?", choices: [
    c("The body is sacred — incarnation is the point, not an obstacle", { embodiment: 3, mysticism: 1 }),
    c("The body is a vehicle — important but not the destination", { transcendence: 2, practice: 2 }),
    c("The body is where practice happens — posture, breath, sensation are the path", { practice: 3, embodiment: 1 }),
    c("I'm honestly disconnected from my body in spiritual contexts — it's mostly a head thing", { structure: 2, ethics: 2 }),
  ] },
  { category: "PRACTICE", stem: "How important is a teacher, guru, priest, or spiritual director to you?", subtext: "The question of authority in your spiritual life.", choices: [
    c("Essential — I need someone further along the path to guide me", { structure: 3, practice: 1 }),
    c("Helpful but not necessary — I learn from many sources", { pluralism: 2, practice: 2 }),
    c("Dangerous — too much spiritual authority leads to abuse", { ethics: 2, pluralism: 2 }),
    c("The best teacher is direct experience — everything else is commentary", { mysticism: 3, embodiment: 1 }),
  ] },
  { category: "PLURALISM", stem: "How many paths lead to truth?", subtext: "The perennial question.", choices: [
    c("One — my tradition has it right, and the differences matter", { structure: 3, transcendence: 1 }),
    c("Many — different traditions are different faces of the same mountain", { pluralism: 3, mysticism: 1 }),
    c("Some — not all paths are equal, but several are legitimate", { pluralism: 2, structure: 2 }),
    c("None — or all — truth isn't a destination, it's a way of being", { embodiment: 2, pluralism: 2 }),
  ] },
  { category: "PLURALISM", stem: "Could you marry or deeply partner with someone from a completely different spiritual tradition?", subtext: "Not in theory. In practice.", choices: [
    c("Yes — love transcends tradition, and the differences would enrich us", { pluralism: 3, community: 1 }),
    c("Maybe — it would depend on how important their practice is to them", { pluralism: 2, community: 2 }),
    c("It would be hard — shared spiritual life is too important to me", { community: 2, structure: 2 }),
    c("No — I need someone who shares my path at the deepest level", { structure: 3, community: 1 }),
  ] },
  { category: "INTEGRATION", stem: "If you could only keep one thing from your spiritual life, what would it be?", subtext: "Everything else burns. What survives?", choices: [
    c("The relationship — with God, with the divine, with whatever I call the deepest thing", { transcendence: 3, mysticism: 1 }),
    c("The community — the people who practice with me, who hold me accountable", { community: 3, structure: 1 }),
    c("The practice — meditation, prayer, the daily discipline that keeps me sane", { practice: 3, embodiment: 1 }),
    c("The ethics — the commitment to justice, compassion, and reducing suffering", { ethics: 3, pluralism: 1 }),
  ] },
];

interface Tradition {
  name: string;
  tagline: string;
  description: string;
  primaryDimension: Dimension;
  practices: string[];
  keyTexts: string[];
  figures: string[];
  resonatesWith: string[];
  tension: string[];
}

const TRADITIONS: Tradition[] = [
  { name: "The Devotee", tagline: "You seek the face of God. Not a concept — a presence.", primaryDimension: "transcendence",
    description: "Your spiritual life is organized around relationship with the divine. You pray, you worship, you surrender. Whether you call it God, Allah, Brahman, or the Beloved — there is a Someone or Something at the center of your universe, and your deepest impulse is to draw closer. Traditions that honor personal devotion, prayer, and divine relationship will feel like home.",
    practices: ["Prayer and contemplation", "Devotional reading and lectio divina", "Worship and liturgy", "Surrender practices"],
    keyTexts: ["The Psalms", "The Bhagavad Gita", "The Cloud of Unknowing", "Rumi's Masnavi"],
    figures: ["Teresa of Ávila", "Rumi", "Mirabai", "Thomas Merton", "A.W. Tozer"],
    resonatesWith: ["Christianity (contemplative)", "Bhakti Hinduism", "Sufism", "Hasidic Judaism"],
    tension: ["May struggle with doubt as betrayal rather than growth", "Can become dependent on emotional experiences of God"] },
  { name: "The Traditionalist", tagline: "The ancient paths are ancient for a reason. You trust the container.", primaryDimension: "structure",
    description: "You believe that spiritual wisdom is carried by tradition — in liturgy, in scripture, in the accumulated practice of centuries. You're not naive about institutional failures, but you know that individual spiritual freelancing loses something essential. The container matters. The lineage matters. You'd rather reform a tradition from within than abandon it for something untested.",
    practices: ["Regular worship attendance", "Liturgical calendar observance", "Scriptural study", "Sacramental participation"],
    keyTexts: ["The Bible", "The Quran", "The Torah and Talmud", "The Book of Common Prayer"],
    figures: ["Pope Francis", "Rabbi Jonathan Sacks", "C.S. Lewis", "Dietrich Bonhoeffer"],
    resonatesWith: ["Catholicism", "Orthodox Christianity", "Traditional Judaism", "Sunni Islam", "Confucianism"],
    tension: ["May confuse tradition with truth", "Can resist necessary evolution", "Risk of spiritual rigidity"] },
  { name: "The Communitarian", tagline: "Spirituality is a team sport. You find God in the 'we.'", primaryDimension: "community",
    description: "For you, the spiritual life is fundamentally communal. You don't just believe in community — you experience the divine through it. Singing together, serving together, breaking bread together — these aren't accessories to your faith, they're the substance of it. You know that isolation is the enemy of the soul, and that we become who we're meant to be only in relationship.",
    practices: ["Communal worship and singing", "Small group fellowship", "Shared meals and celebrations", "Service projects and mutual aid"],
    keyTexts: ["Acts 2 (early church community)", "The Rule of St. Benedict", "Ubuntu philosophy", "Martin Buber's I and Thou"],
    figures: ["Martin Luther King Jr.", "Dorothy Day", "Desmond Tutu", "Thich Nhat Hanh"],
    resonatesWith: ["Quakerism", "African-American church tradition", "Sangha Buddhism", "Intentional communities", "Liberation theology"],
    tension: ["May avoid solitary practice that's also necessary", "Can become codependent on community approval", "Risk of groupthink"] },
  { name: "The Mystic", tagline: "You don't believe in God. You've tasted God. Direct experience is everything.", primaryDimension: "mysticism",
    description: "You've had moments — maybe many — where the veil between ordinary and extraordinary dissolved. You're not interested in theology as an intellectual exercise. You want the real thing: direct, unmediated experience of ultimate reality. Whether through meditation, plant medicine, contemplative prayer, or spontaneous grace — you know that the map is not the territory, and you'd rather be lost in the territory than safe with the map.",
    practices: ["Deep meditation (vipassana, zazen, centering prayer)", "Contemplative prayer", "Plant medicine ceremony", "Ecstatic practices (breathwork, chanting, dance)"],
    keyTexts: ["The Tao Te Ching", "The Upanishads", "Meister Eckhart's sermons", "The Perennial Philosophy by Aldous Huxley"],
    figures: ["Meister Eckhart", "Ramana Maharshi", "Hildegard of Bingen", "Alan Watts", "Ram Dass"],
    resonatesWith: ["Zen Buddhism", "Advaita Vedanta", "Christian mysticism", "Sufism", "Taoism", "Perennial philosophy"],
    tension: ["May devalue the ordinary in pursuit of peak experiences", "Can become spiritually bypassing", "Risk of guru dependency"] },
  { name: "The Prophet", tagline: "If your spirituality doesn't make you dangerous to injustice, it's decoration.", primaryDimension: "ethics",
    description: "Your spiritual life is inseparable from your commitment to justice. You see the sacred in the struggle — in the fight for the marginalized, the oppressed, the forgotten. You might pray, but your deepest prayer is action. You're suspicious of spirituality that stays comfortable, that never confronts power, that mistakes inner peace for moral neutrality. The prophetic tradition — from Amos to Dorothy Day to MLK — is your lineage.",
    practices: ["Social justice activism", "Ethical living and simplicity", "Prophetic witness", "Community organizing"],
    keyTexts: ["The Hebrew Prophets (Amos, Isaiah, Micah)", "Letter from Birmingham Jail", "Pedagogy of the Oppressed", "The Tao of Liberation"],
    figures: ["Dorothy Day", "Martin Luther King Jr.", "Oscar Romero", "Vandana Shiva", "Cornel West"],
    resonatesWith: ["Liberation theology", "Engaged Buddhism", "Prophetic Judaism", "Quakerism", "Secular humanism", "Ethical Culture"],
    tension: ["May burn out from constant moral urgency", "Can become self-righteous", "Risk of reducing spirituality to politics"] },
  { name: "The Practitioner", tagline: "You don't talk about it. You do it. Every day. The practice is the path.", primaryDimension: "practice",
    description: "For you, spirituality is a discipline — not a feeling, not a belief, but a daily practice that shapes who you become. You meditate, you pray, you do yoga, you sit — not because it feels good (though sometimes it does) but because the practice itself is the transformation. You trust the process more than the peak experience. You know that showing up is 90% of enlightenment.",
    practices: ["Daily meditation or prayer", "Yoga or tai chi", "Fasting and ascetic practices", "Journaling and self-examination"],
    keyTexts: ["The Yoga Sutras of Patanjali", "The Rule of St. Benedict", "Zen Mind, Beginner's Mind", "The Spiritual Exercises of Ignatius"],
    figures: ["Thich Nhat Hanh", "Pema Chödrön", "Ignatius of Loyola", "B.K.S. Iyengar", "Sadhguru"],
    resonatesWith: ["Zen Buddhism", "Benedictine monasticism", "Yoga traditions", "Ignatian spirituality", "Vipassana"],
    tension: ["May become rigid or legalistic about practice", "Can mistake discipline for transformation", "Risk of spiritual pride"] },
  { name: "The Seeker", tagline: "You collect wisdom like a bee collects pollen. No single flower has it all.", primaryDimension: "pluralism",
    description: "You refuse to be contained by a single tradition. You've read the Tao Te Ching and the Gospel of Thomas and the Bhagavad Gita and found truth in all of them. You're not confused — you're comprehensive. You believe that the divine is too vast for any one tradition to capture, and your spiritual life is a creative synthesis of the best of what humanity has discovered about the sacred.",
    practices: ["Cross-tradition study and practice", "Interfaith dialogue", "Personal synthesis and experimentation", "Pilgrimage across traditions"],
    keyTexts: ["The Perennial Philosophy by Aldous Huxley", "The World's Religions by Huston Smith", "Be Here Now by Ram Dass", "Siddhartha by Hermann Hesse"],
    figures: ["Ram Dass", "Aldous Huxley", "Karen Armstrong", "Huston Smith", "Joseph Campbell"],
    resonatesWith: ["Unitarian Universalism", "Perennial philosophy", "Integral spirituality", "Bahá'í Faith", "Spiritual but not religious"],
    tension: ["May lack depth from lack of commitment", "Can become a spiritual tourist", "Risk of appropriation without accountability"] },
  { name: "The Grounded", tagline: "Heaven is a nice idea. You'd rather be fully alive right here.", primaryDimension: "embodiment",
    description: "Your spirituality is rooted in this world, this body, this moment. You're skeptical of otherworldly promises and transcendent escapes. For you, the sacred is in the ordinary — in a good meal, in honest work, in the feel of soil under your fingernails. You might not call yourself spiritual at all, but you live with a presence and intentionality that many religious people envy. You've found that paying attention is the highest form of prayer.",
    practices: ["Mindful daily living", "Nature immersion", "Cooking, gardening, craft", "Somatic awareness and movement"],
    keyTexts: ["Walden by Thoreau", "The Sabbath by Abraham Joshua Heschel", "Braiding Sweetgrass by Robin Wall Kimmerer", "Meditations by Marcus Aurelius"],
    figures: ["Henry David Thoreau", "Wendell Berry", "Mary Oliver", "Marcus Aurelius", "Robin Wall Kimmerer"],
    resonatesWith: ["Stoicism", "Secular Buddhism", "Nature spirituality", "Indigenous traditions", "Epicureanism", "Philosophical Taoism"],
    tension: ["May dismiss genuine transcendent experiences", "Can become spiritually isolated", "Risk of reducing the sacred to the material"] },
];

function computeResults(answers: Record<number, number>) {
  const dims = {} as Record<Dimension, number>;
  DIMENSIONS.forEach((d) => (dims[d] = 0));
  Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
    const choice = QUESTIONS[Number(qIdx)]?.choices[choiceIdx];
    if (!choice) return;
    for (const dim in choice.dimensions) {
      const d = dim as Dimension;
      dims[d] = (dims[d] || 0) + (choice.dimensions[d] ?? 0);
    }
  });
  const maxPossible = 10;
  const normalized = {} as Record<Dimension, number>;
  DIMENSIONS.forEach((d) => {
    normalized[d] = Math.min(100, Math.round((dims[d] / maxPossible) * 100));
  });
  const sorted = [...TRADITIONS].sort((a, b) => (normalized[b.primaryDimension] || 0) - (normalized[a.primaryDimension] || 0));
  return { scores: normalized, top: sorted[0], second: sorted[1] };
}

export function FindYourReligionQuiz() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ scores: Record<Dimension, number>; top: Tradition; second: Tradition } | null>(null);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const next = { ...answers, [currentQ]: choiceIdx };
      setAnswers(next);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setResult(computeResults(next));
        setPhase("results");
        markComplete("find-your-religion");
      }
    },
    [answers, currentQ, markComplete],
  );

  const displayScores = useMemo(() => {
    if (!result) return {};
    const out: Record<string, number> = {};
    for (const d of DIMENSIONS) out[DIMENSION_LABELS[d].split(" ")[0]] = result.scores[d] ?? 0;
    return out;
  }, [result]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="religion" />
        <AssessmentIntro
          title="Find Your Religion"
          subtitle="Faith isn't inherited. It's discovered."
          description="Whether you're deeply devout, spiritually curious, or militantly secular — this assessment maps your relationship with organized belief, ritual, community, ethics, mystery, and meaning. No judgment. No conversion. Just clarity about where you actually stand."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 10 }}
          whatYouGet={[
            "Your religious/philosophical archetype",
            "A dimensional map of your relationship with belief",
            "Understanding of what draws you to (or repels you from) organized faith",
            "Resources aligned with your actual worldview",
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
        <ThemedBackground theme="religion" />
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
            <button onClick={() => setCurrentQ(currentQ - 1)} className="mt-6 font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
              ← PREVIOUS
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="religion" />
        <EmailGate assessmentSlug="religion" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  const { top, second, scores } = result;

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="religion" />

      <div className="border-b border-brand-gold/10 p-6 text-center">
        <Link href="/find-my" className="font-mono text-[0.65rem] tracking-[0.1em] text-[#4A3A2A]">
          ← Back to Find My
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">Your Spiritual Archetype</div>
        <h1 className="mb-4 font-heading text-[clamp(2rem,5vw,3rem)] font-normal">{top.name}</h1>
        <p className="mb-8 font-heading text-lg text-brand-gold italic">{top.tagline}</p>
        <p className="mx-auto max-w-150 text-[1.05rem] leading-[1.8] text-[#5A4A3A]">{top.description}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12 text-center">
        <h3 className="mb-6 font-mono text-[0.65rem] tracking-[0.15em] text-[#888] uppercase">Your Spiritual Dimensions</h3>
        <div className="flex justify-center">
          <AssessmentRadarChart scores={displayScores} max={100} accentColor="#D4B96A" />
        </div>
        <div className="mt-8 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {DIMENSIONS.map((dim) => (
            <div key={dim} className={`rounded-lg border p-3 ${dim === top.primaryDimension ? "border-brand-gold-light/30" : "border-black/5"}`}>
              <div className="mb-1 font-mono text-[0.6rem] tracking-[0.05em] text-[#888]">{DIMENSION_LABELS[dim]}</div>
              <div className={`font-heading text-xl ${dim === top.primaryDimension ? "text-brand-gold" : "text-[#5A4A3A]"}`}>{scores[dim] || 0}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Practices That Fit</h3>
            {top.practices.map((p) => (
              <div key={p} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {p}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Key Texts</h3>
            {top.keyTexts.map((t) => (
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
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Traditions That Resonate</h3>
            {top.resonatesWith.map((t) => (
              <div key={t} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {t}
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Figures to Explore</h3>
            {top.figures.map((f) => (
              <div key={f} className="mb-2 border-l-2 border-brand-gold-light/20 pl-4 text-sm text-[#5A4A3A]">
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.1em] text-brand-gold uppercase">Your Growth Edge</h3>
        {top.tension.map((t) => (
          <div key={t} className="mb-3 border-l-2 border-[#C97B7B]/30 pl-4 text-[0.95rem] text-[#5A4A3A]">
            {t}
          </div>
        ))}
      </section>

      {second && (
        <section className="mx-auto max-w-3xl border-t border-brand-gold/10 px-6 py-8">
          <div className="mb-3 font-mono text-[0.6rem] tracking-[0.15em] text-[#888] uppercase">Your Secondary Archetype</div>
          <h3 className="mb-2 font-heading text-2xl font-normal">{second.name}</h3>
          <p className="mb-4 font-heading text-base text-brand-gold italic">{second.tagline}</p>
          <p className="text-[0.95rem] leading-[1.7] text-[#5A4A3A]">{second.description}</p>
        </section>
      )}

      <section className="mx-auto max-w-3xl border-t border-brand-gold/10 px-6 py-8">
        <div className="mb-6 text-center font-mono text-[0.6rem] tracking-[0.15em] text-[#888] uppercase">The Journey Continues</div>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {[
            { name: "Find Your Spirit", desc: "35 questions mapping your spiritual landscape across 10 dimensions", href: "/find-your-spirit" },
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
        <JourneyTracker variant="light" currentAssessmentId="find-your-religion" />
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-16 text-center">
        <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-religion" />
        <button
          onClick={() => {
            setPhase("landing");
            setCurrentQ(0);
            setAnswers({});
            setResult(null);
          }}
          className="rounded-lg border border-brand-gold/30 px-8 py-3 font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold uppercase"
        >
          Retake Assessment
        </button>
      </section>

      <footer className="border-t border-brand-gold/8 px-6 py-8 text-center">
        <div className="mb-2 font-heading text-sm text-[#555] italic">The resistance is the roadmap.</div>
        <div className="font-mono text-[0.6rem] tracking-[0.1em] text-[#444]">Part of the Find My Ecosystem by Tony Greenberg</div>
      </footer>
    </div>
  );
}
