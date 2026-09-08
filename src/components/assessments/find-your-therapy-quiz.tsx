"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { AssessmentIntro } from "@/components/assessments/assessment-intro";
import { EmailGate } from "@/components/assessments/email-gate";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker, useJourneyProgress } from "@/components/assessments/journey-tracker";

// Ported from legacy client/src/pages/FindYourTherapy.tsx — a real
// 25-question assessment across 6 dimensions (cognitive/somatic/
// relational/depth/altered states/integrative), mapping to 6 real
// therapeutic modalities each with a real description, "how it works,"
// best-for/not-ideal-for lists, real named pioneers, and real
// book/directory resources. Every question and every modality's content
// ported unchanged and verbatim. **Three real stale-count bugs found and
// fixed**: legacy's own file-header comment claimed "10 questions,"
// its `AssessmentIntro` stats prop claimed 20 — neither matches the real
// 25-item `QUESTIONS` array (the scoring code's own `maxPossible = 30 //
// rough max per dimension with 25 questions` comment confirms 25 is the
// real count) — replaced both with the live `QUESTIONS.length`. **Real
// dead-link bug fixed**: legacy's "Journey Continues" grid linked "Find
// Your Spirit" and "Find Your Religion" to external
// `findmyassess-9eekxcob.manus.space` stub URLs (dead Manus domain) even
// though this migration already has real, fully-built internal pages at
// `/find-your-spirit` and `/find-your-religion` — repointed to the real
// internal routes (and corrected Religion's stale "15 Questions" badge to
// the real 20). **Real accent-color inconsistency fixed**: legacy passed
// `accentColor="#7B1FA2"` (purple) only to the landing `AssessmentIntro`
// call, then hardcoded brand-gold (`#8B6914`/`#D4B96A`) throughout the
// entire results screen instead — every other assessment in this
// migration threads one `ACCENT` constant through the intro, radar chart,
// and result actions consistently, so this port does too. The "Also Worth
// Exploring" related-modality cards were dropped: in legacy they render
// real modality names/taglines but clicking one silently restarts the
// whole assessment instead of navigating anywhere related — with no
// per-modality page to link to, keeping that would just be a misleading
// button, not a real feature. `SacredGeometryBg`'s SVG/floating-dot
// overlay dropped, same decoration call made repeatedly elsewhere. The
// dark `GlassPanel` treatment (near-black translucent cards, light cream
// text, on `ThemedBackground`'s light "therapy" pastel) is kept as a real
// intentional design choice, same reasoning as `/find-your-sake`'s
// `GlassPanel` — the text sits inside its own correctly-contrasted dark
// card, unlike the light-text-directly-on-page-background bugs found and
// fixed elsewhere. The real Twitter/LinkedIn/email/clipboard share row is
// genuinely backend-free (`window.open` intents + `navigator.clipboard`)
// so it's ported as a real feature, not dropped.
type Dimension = "cognitive" | "somatic" | "relational" | "depth" | "altered" | "integrative";
const DIMENSION_LABELS: Record<Dimension, string> = {
  cognitive: "Cognitive",
  somatic: "Somatic",
  relational: "Relational",
  depth: "Depth / Unconscious",
  altered: "Altered States",
  integrative: "Integrative",
};
const DIMENSIONS = Object.keys(DIMENSION_LABELS) as Dimension[];
const ACCENT = "#7B1FA2";

function c(text: string, dimensions: Partial<Record<Dimension, number>>) {
  return { text, dimensions };
}

const QUESTIONS: { stem: string; subtext: string; choices: { text: string; dimensions: Partial<Record<Dimension, number>> }[] }[] = [
  { stem: "When you're in pain, where does it live?", subtext: "Not the story about the pain. The pain itself.", choices: [
    c("In my thoughts — loops I can't stop running", { cognitive: 3, depth: 1 }),
    c("In my body — tension, numbness, or restlessness I can't explain", { somatic: 3, integrative: 1 }),
    c("In the space between me and other people", { relational: 3, depth: 1 }),
    c("In a feeling I had before I had words for feelings", { depth: 3, somatic: 1 }),
  ] },
  { stem: "When something goes wrong, what's your first move?", subtext: "Before the coping kicks in. The raw reflex.", choices: [
    c("I replay the situation looking for what I missed — where the logic broke", { cognitive: 3, integrative: 1 }),
    c("I feel it in my chest or stomach before I can name what happened", { somatic: 3, depth: 1 }),
    c("I reach for someone — I need to process it out loud with a person I trust", { relational: 3, integrative: 1 }),
    c("I go quiet and inward — something deeper than thinking takes over", { depth: 2, altered: 2 }),
  ] },
  { stem: "What's your relationship with self-help books?", subtext: "Honest answer. No judgment.", choices: [
    c("I devour them — frameworks and models are how I make sense of myself", { cognitive: 3, integrative: 1 }),
    c("They make sense in my head but nothing changes in my life", { cognitive: 1, somatic: 2, integrative: 1 }),
    c("I prefer conversations to books — I learn through people, not pages", { relational: 3, cognitive: 1 }),
    c("The ones that changed me weren't self-help — they were poetry, myth, or something I can't categorize", { depth: 2, altered: 2 }),
  ] },
  { stem: "How do you relate to your own thinking?", subtext: "Your mind as instrument, obstacle, or both.", choices: [
    c("It's my superpower and my prison — I can't stop analyzing", { cognitive: 3, depth: 1 }),
    c("My thinking disconnects me from what I actually feel", { cognitive: 1, somatic: 2, depth: 1 }),
    c("I think clearly about other people's problems but go blank on my own", { relational: 2, cognitive: 1, depth: 1 }),
    c("My best insights come when I stop thinking entirely", { altered: 3, integrative: 1 }),
  ] },
  { stem: "What's your relationship with your body?", subtext: "The vessel you've been negotiating with.", choices: [
    c("I live from the neck up — my body is transportation for my brain", { cognitive: 2, somatic: 1, integrative: 1 }),
    c("My body holds things my mind won't admit", { somatic: 3, depth: 1 }),
    c("I perform wellness but don't feel well", { integrative: 2, somatic: 1, relational: 1 }),
    c("I've had experiences where my body knew things before I did", { somatic: 2, altered: 2 }),
  ] },
  { stem: "When was the last time you cried?", subtext: "And what happened in your body when you did — or couldn't.", choices: [
    c("I can't remember — I've gotten very good at not going there", { depth: 2, somatic: 2 }),
    c("Recently, and it came from my body — shaking, heaving, not just tears", { somatic: 3, depth: 1 }),
    c("When someone really saw me — the tears were about being witnessed", { relational: 3, somatic: 1 }),
    c("During a meditation, ceremony, or experience that cracked something open", { altered: 3, somatic: 1 }),
  ] },
  { stem: "Where does stress show up in your body first?", subtext: "Before you've named it as stress.", choices: [
    c("Racing thoughts, insomnia, a mind that won't shut off", { cognitive: 3, somatic: 1 }),
    c("Jaw clenching, shoulder tension, stomach knots — my body is a stress barometer", { somatic: 3, integrative: 1 }),
    c("I get irritable with people close to me before I realize I'm stressed", { relational: 2, somatic: 1, depth: 1 }),
    c("I dissociate — I leave my body and watch from somewhere else", { somatic: 2, depth: 1, altered: 1 }),
  ] },
  { stem: "How do you process difficult experiences?", subtext: "Your default, not your ideal.", choices: [
    c("I journal, research, and try to make meaning from it", { cognitive: 2, integrative: 2 }),
    c("I move — run, yoga, hike — until my body releases it", { somatic: 3, integrative: 1 }),
    c("I call someone I trust and talk until I can breathe again", { relational: 3, integrative: 1 }),
    c("I go inward — meditation, silence, or something that takes me out of ordinary mind", { altered: 2, depth: 2 }),
  ] },
  { stem: "What scares you most about going deeper?", subtext: "The resistance is the roadmap.", choices: [
    c("Losing control of the narrative I've built about myself", { cognitive: 2, depth: 2 }),
    c("Feeling things I've spent years learning not to feel", { somatic: 2, depth: 2 }),
    c("Being truly vulnerable with another human being", { relational: 3, depth: 1 }),
    c("What I might find on the other side of ordinary consciousness", { altered: 3, depth: 1 }),
  ] },
  { stem: "What happens when someone gets too close?", subtext: "Not the story you tell. The thing you do.", choices: [
    c("I intellectualize — I explain the relationship instead of being in it", { cognitive: 2, relational: 1, depth: 1 }),
    c("My body tenses — I feel physically unsafe even when I'm logically fine", { somatic: 3, relational: 1 }),
    c("I merge — I lose myself in the other person and forget what I need", { relational: 3, depth: 1 }),
    c("I disappear — not physically, but something inside me goes offline", { depth: 2, somatic: 1, altered: 1 }),
  ] },
  { stem: "Who do you become in conflict?", subtext: "The version of you that shows up when it matters most.", choices: [
    c("The lawyer — I build my case, present evidence, argue my position", { cognitive: 3, relational: 1 }),
    c("The ghost — I freeze, shut down, or leave my body", { somatic: 2, depth: 2 }),
    c("The caretaker — I abandon my position to preserve the relationship", { relational: 3, integrative: 1 }),
    c("The mirror — I reflect back what the other person can't see about themselves", { depth: 2, relational: 1, integrative: 1 }),
  ] },
  { stem: "What does trust feel like in your body?", subtext: "If you can feel it at all.", choices: [
    c("I'm not sure I've felt it — I trust data and track records, not feelings", { cognitive: 3, relational: 1 }),
    c("A softening — my shoulders drop, my breath deepens, my guard comes down", { somatic: 3, relational: 1 }),
    c("It feels like home — being with someone where I don't have to perform", { relational: 3, depth: 1 }),
    c("I've felt it most in non-ordinary states — ceremony, deep meditation, peak experiences", { altered: 3, depth: 1 }),
  ] },
  { stem: "What does healing look like to you?", subtext: "The honest version, not the aspirational one.", choices: [
    c("Understanding why I do what I do — insight as liberation", { cognitive: 2, depth: 2 }),
    c("Feeling safe in my own skin again", { somatic: 3, integrative: 1 }),
    c("Being seen without performing — real connection", { relational: 3, integrative: 1 }),
    c("A single moment of clarity that rewrites everything before it", { altered: 3, depth: 1 }),
  ] },
  { stem: "Do you dream? And do the dreams mean something?", subtext: "The unconscious has its own language.", choices: [
    c("I rarely remember dreams — my waking mind is busy enough", { cognitive: 2, integrative: 1, depth: 1 }),
    c("I have vivid body-based dreams — falling, running, being chased", { somatic: 2, depth: 2 }),
    c("My dreams are full of people — conversations, reunions, betrayals", { relational: 2, depth: 2 }),
    c("My dreams feel like messages from somewhere deeper than my biography", { depth: 3, altered: 1 }),
  ] },
  { stem: "What pattern keeps showing up in your life?", subtext: "The one you're tired of recognizing.", choices: [
    c("I know what to do but can't make myself do it — the gap between insight and action", { cognitive: 1, integrative: 2, somatic: 1 }),
    c("I attract the same relationship dynamics no matter who I'm with", { relational: 2, depth: 2 }),
    c("My body breaks down when my life gets too intense", { somatic: 3, depth: 1 }),
    c("I glimpse something profound and then can't hold onto it in daily life", { altered: 2, integrative: 2 }),
  ] },
  { stem: "What's your relationship with your family of origin?", subtext: "Not the holiday card version.", choices: [
    c("I've analyzed it thoroughly — I understand the dynamics intellectually", { cognitive: 3, depth: 1 }),
    c("Being around them activates something in my nervous system I can't control", { somatic: 2, depth: 2 }),
    c("I'm still playing a role I outgrew decades ago", { relational: 2, depth: 2 }),
    c("There are things that happened that I've never fully processed — they live in the basement", { depth: 3, somatic: 1 }),
  ] },
  { stem: "When you've had breakthroughs before, what triggered them?", subtext: "The moments that actually shifted something.", choices: [
    c("A conversation where someone reflected back what I couldn't see", { relational: 3, cognitive: 1 }),
    c("A physical experience — movement, breathwork, or touch", { somatic: 3, altered: 1 }),
    c("A book, framework, or idea that reorganized everything", { cognitive: 3, integrative: 1 }),
    c("An altered state — meditation, ceremony, or spontaneous mystical experience", { altered: 3, integrative: 1 }),
  ] },
  { stem: "Have you ever had an experience that ordinary language can't describe?", subtext: "The kind that changes the operating system, not just the software.", choices: [
    c("No — and I'm skeptical of people who claim they have", { cognitive: 3, integrative: 1 }),
    c("Yes — through my body. A physical experience that transcended explanation", { somatic: 2, altered: 2 }),
    c("Yes — through deep connection with another person. Love as a portal", { relational: 2, altered: 2 }),
    c("Yes — and it's the most real thing that's ever happened to me", { altered: 3, depth: 1 }),
  ] },
  { stem: "What's your relationship with meditation or contemplative practice?", subtext: "The actual practice, not the idea of it.", choices: [
    c("I've tried it but my mind won't stop — I need something more structured", { cognitive: 2, integrative: 2 }),
    c("Body-based practices work better for me — yoga, tai chi, walking meditation", { somatic: 3, altered: 1 }),
    c("Group practice or guided meditation with a teacher — I need the relational container", { relational: 2, altered: 1, integrative: 1 }),
    c("I've gone deep — and what I found there changed my understanding of reality", { altered: 3, depth: 1 }),
  ] },
  { stem: "How do you feel about psychedelic medicine?", subtext: "Not the politics. Your actual felt sense.", choices: [
    c("Curious but cautious — I want the evidence before I trust the experience", { cognitive: 2, altered: 1, integrative: 1 }),
    c("Interested in the body-based aspects — the somatic release, the nervous system reset", { somatic: 2, altered: 2 }),
    c("I'd only do it with someone I deeply trust — the relational container matters more than the molecule", { relational: 2, altered: 2 }),
    c("I've experienced it — or I'm drawn to it — as the most direct path to what's underneath", { altered: 3, depth: 1 }),
  ] },
  { stem: "What kind of guide do you need right now?", subtext: "Not forever. Right now.", choices: [
    c("A strategist — someone who helps me think differently", { cognitive: 3, integrative: 1 }),
    c("A witness — someone who can hold space without fixing", { relational: 3, depth: 1 }),
    c("A body worker — someone who speaks the language of sensation", { somatic: 3, integrative: 1 }),
    c("A sherpa — someone who's been to the edge and can take me there safely", { altered: 2, depth: 2 }),
  ] },
  { stem: "How many different approaches have you tried?", subtext: "The therapeutic resume.", choices: [
    c("One or two — I found what works and stuck with it", { cognitive: 2, somatic: 2 }),
    c("Several — talk therapy, maybe some body work, maybe medication", { integrative: 3, cognitive: 1 }),
    c("A lot — and I found truth in each of them but none was complete", { integrative: 3, depth: 1 }),
    c("I've been on a long journey across modalities and I'm ready for something that holds all of it", { integrative: 3, altered: 1 }),
  ] },
  { stem: "What's missing from the therapy you've tried before?", subtext: "The thing it couldn't reach.", choices: [
    c("It was too slow — I need practical tools and measurable progress", { cognitive: 3, integrative: 1 }),
    c("It stayed in my head — nothing changed in my body or my daily life", { somatic: 2, integrative: 2 }),
    c("The therapist was competent but the relationship didn't feel safe enough to go deep", { relational: 3, depth: 1 }),
    c("It couldn't hold the spiritual or transpersonal dimensions of my experience", { altered: 2, depth: 1, integrative: 1 }),
  ] },
  { stem: "How do you relate to your emotions?", subtext: "Right now. Not how you wish you did.", choices: [
    c("I analyze them — I need to understand before I can feel", { cognitive: 3, depth: 1 }),
    c("They overwhelm me — too much, too fast, too often", { somatic: 2, relational: 1, integrative: 1 }),
    c("I perform them for others but can't access them alone", { relational: 2, depth: 2 }),
    c("I've numbed them — and I'm not sure how to get them back", { depth: 2, somatic: 2 }),
  ] },
  { stem: "If therapy could give you one thing, what would it be?", subtext: "The real answer. Not the one that sounds good.", choices: [
    c("A new operating system — different patterns, different outcomes", { cognitive: 2, integrative: 2 }),
    c("To feel at home in my body for the first time", { somatic: 3, depth: 1 }),
    c("To stop being afraid of intimacy — to let someone all the way in", { relational: 3, depth: 1 }),
    c("To access the version of myself that exists beyond my defenses", { depth: 2, altered: 2 }),
  ] },
];

interface Modality {
  id: Dimension;
  name: string;
  tagline: string;
  description: string;
  howItWorks: string;
  bestFor: string[];
  notIdealFor: string[];
  pioneers: string[];
  resources: { title: string; url: string; type: string }[];
  relatedModalities: Dimension[];
  shareText: string;
}

const MODALITIES: Modality[] = [
  { id: "cognitive", name: "The Architect", tagline: "You heal by understanding. Insight is your medicine.",
    description: "Your mind is your primary instrument — and your primary obstacle. You need a therapy that respects your intelligence while teaching you that understanding alone isn't transformation. CBT, ACT, and structured approaches give you the framework your mind craves while building the bridge between knowing and doing.",
    howItWorks: "Cognitive Behavioral Therapy (CBT) and Acceptance & Commitment Therapy (ACT) work by identifying the thought patterns that create suffering and systematically replacing them with more adaptive ones. It's not about positive thinking — it's about accurate thinking. You'll learn to catch the cognitive distortions in real-time and choose different responses.",
    bestFor: ["Anxiety and rumination loops", "Perfectionism and imposter syndrome", "Decision paralysis and overthinking", "Building practical coping strategies"],
    notIdealFor: ["Deep childhood trauma (may need depth work first)", "Grief that needs to be felt, not analyzed", "Spiritual emergencies"],
    pioneers: ["Aaron Beck", "Steven Hayes", "Albert Ellis", "Judith Beck"],
    resources: [
      { title: "Feeling Good by David Burns", url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336", type: "book" },
      { title: "The Happiness Trap by Russ Harris", url: "https://www.amazon.com/Happiness-Trap-Struggling-Start-Living/dp/1590305841", type: "book" },
      { title: "Psychology Today — Find a CBT Therapist", url: "https://www.psychologytoday.com/us/therapists/cognitive-behavioral-cbt", type: "directory" },
    ],
    relatedModalities: ["integrative", "depth"],
    shareText: "I'm The Architect — I heal by understanding. CBT and structured approaches match my wiring. Find your therapy style →" },
  { id: "somatic", name: "The Embodied", tagline: "Your body remembers what your mind forgot. Time to listen.",
    description: "You carry your history in your tissues. Talk therapy alone will never reach what lives below your neck. Somatic Experiencing, EMDR, and body-based approaches speak the language your nervous system actually understands — sensation, movement, breath, and the wisdom of the body that your culture taught you to ignore.",
    howItWorks: "Somatic therapies work with the body's innate capacity to process and release stored trauma. Through guided attention to physical sensations, pendulation between activation and calm, and gentle movement, your nervous system completes the survival responses that got frozen in time. EMDR uses bilateral stimulation to help the brain reprocess traumatic memories.",
    bestFor: ["PTSD and complex trauma", "Chronic pain with no clear medical cause", "Anxiety that lives in the body (chest tightness, stomach knots)", "Dissociation and feeling disconnected from your body", "Trauma stored before verbal memory"],
    notIdealFor: ["Purely cognitive distortions without somatic component", "Situations requiring immediate behavioral strategies"],
    pioneers: ["Peter Levine", "Bessel van der Kolk", "Pat Ogden", "Francine Shapiro"],
    resources: [
      { title: "The Body Keeps the Score by Bessel van der Kolk", url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748", type: "book" },
      { title: "Waking the Tiger by Peter Levine", url: "https://www.amazon.com/Waking-Tiger-Healing-Trauma-Innate/dp/155643233X", type: "book" },
      { title: "EMDRIA — Find an EMDR Therapist", url: "https://www.emdria.org/find-an-emdr-therapist/", type: "directory" },
    ],
    relatedModalities: ["depth", "altered"],
    shareText: "I'm The Embodied — my body remembers what my mind forgot. Somatic therapy speaks my language. Find your therapy style →" },
  { id: "relational", name: "The Mirror Seeker", tagline: "You heal in relationship. Connection is the medicine.",
    description: "Your wounds happened between people, and they'll heal between people. Attachment-based therapy, IFS, and relational psychodynamic approaches understand that the therapeutic relationship itself is the healing agent. You don't need more insight — you need the experience of being truly seen, held, and not abandoned.",
    howItWorks: "Internal Family Systems (IFS) works with the different 'parts' of your psyche — the protectors, the exiles, the managers — helping you develop a compassionate relationship with all of them. Attachment-based therapy uses the therapeutic relationship as a corrective emotional experience, rewiring your attachment patterns through consistent, attuned presence.",
    bestFor: ["Attachment wounds and relationship patterns", "Fear of intimacy or abandonment", "People-pleasing and codependency", "Inner critic and self-sabotage", "Difficulty trusting or being vulnerable"],
    notIdealFor: ["Acute crisis requiring immediate stabilization", "Those who need structured behavioral change first"],
    pioneers: ["Richard Schwartz", "Sue Johnson", "John Bowlby", "Irvin Yalom"],
    resources: [
      { title: "No Bad Parts by Richard Schwartz", url: "https://www.amazon.com/No-Bad-Parts-Restoring-Wholeness/dp/1683646681", type: "book" },
      { title: "Attached by Amir Levine", url: "https://www.amazon.com/Attached-Science-Adult-Attachment-YouFind/dp/1585429139", type: "book" },
      { title: "IFS Institute — Find a Therapist", url: "https://ifs-institute.com/practitioners", type: "directory" },
    ],
    relatedModalities: ["depth", "integrative"],
    shareText: "I'm The Mirror Seeker — I heal in relationship. IFS and attachment therapy match my wiring. Find your therapy style →" },
  { id: "depth", name: "The Archaeologist", tagline: "You need to go down before you can go forward.",
    description: "Surface-level fixes insult your intelligence. You sense that your patterns have roots that go deeper than this lifetime's biography — into family systems, collective unconscious, and the archetypal layers of psyche. Psychodynamic therapy, Jungian analysis, and depth psychology honor the complexity you feel.",
    howItWorks: "Depth psychology works with dreams, symbols, transference, and the unconscious material that drives behavior from below awareness. Jungian analysis explores archetypes, shadow work, and individuation — the process of becoming who you actually are beneath the adaptations. Psychodynamic therapy traces current patterns to their developmental origins.",
    bestFor: ["Recurring life patterns that resist surface-level change", "Existential questions and meaning-making", "Creative blocks and unlived life", "Family-of-origin patterns repeating across generations", "Integration of shadow material"],
    notIdealFor: ["Those needing quick behavioral change", "Active substance abuse (stabilize first)", "Those uncomfortable with ambiguity and slow process"],
    pioneers: ["Carl Jung", "James Hillman", "Marion Woodman", "Robert Johnson"],
    resources: [
      { title: "Man and His Symbols by Carl Jung", url: "https://www.amazon.com/Man-His-Symbols-Carl-Jung/dp/0440351839", type: "book" },
      { title: "The Soul's Code by James Hillman", url: "https://www.amazon.com/Souls-Code-Character-Calling/dp/0446673714", type: "book" },
      { title: "IAAP — Find a Jungian Analyst", url: "https://iaap.org/analysts/", type: "directory" },
    ],
    relatedModalities: ["altered", "relational"],
    shareText: "I'm The Archaeologist — I need to go down before I can go forward. Depth psychology matches my wiring. Find your therapy style →" },
  { id: "altered", name: "The Boundary Crosser", tagline: "Ordinary consciousness can't solve what ordinary consciousness created.",
    description: "You've tasted something beyond the default mode network — in meditation, ceremony, flow states, or spontaneous mystical experience — and you know that's where the real healing lives. Psychedelic-assisted therapy, holotropic breathwork, and contemplative approaches work at the edge of consciousness where transformation actually happens.",
    howItWorks: "Psychedelic-assisted therapy (with psilocybin, MDMA, or ketamine) creates a window of neuroplasticity where deeply held patterns can be reorganized in hours rather than years. Holotropic breathwork uses accelerated breathing to access non-ordinary states. These approaches work best with proper preparation, skilled facilitation, and rigorous integration afterward.",
    bestFor: ["Treatment-resistant depression and PTSD", "End-of-life anxiety and existential distress", "Spiritual emergencies and integration", "Addiction (especially when other approaches have failed)", "Those who've plateaued in traditional therapy"],
    notIdealFor: ["Active psychosis or family history of schizophrenia", "Those without access to legal, supervised settings", "Seeking escape rather than transformation", "Those not willing to do integration work afterward"],
    pioneers: ["Stanislav Grof", "Rick Doblin", "Roland Griffiths", "Robin Carhart-Harris"],
    resources: [
      { title: "How to Change Your Mind by Michael Pollan", url: "https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/0735224153", type: "book" },
      { title: "The Way of the Psychonaut by Stanislav Grof", url: "https://www.amazon.com/Way-Psychonaut-Encyclopedia-Inner-Journeys/dp/0998276596", type: "book" },
      { title: "MAPS — Psychedelic Therapy Research", url: "https://maps.org", type: "research" },
      { title: "Ketamine Research Foundation", url: "https://www.ketamineresearchfoundation.org", type: "research" },
    ],
    relatedModalities: ["depth", "somatic"],
    shareText: "I'm The Boundary Crosser — ordinary consciousness can't solve what it created. Psychedelic-assisted therapy matches my wiring. Find your therapy style →" },
  { id: "integrative", name: "The Synthesizer", tagline: "You don't fit in one box. Neither should your healing.",
    description: "You've probably tried several approaches and found truth in each of them. Your healing path isn't linear — it's a web. Integrative and holistic approaches combine cognitive, somatic, relational, and contemplative elements into a personalized protocol. You need a therapist who can move fluidly between modalities based on what's alive in the moment.",
    howItWorks: "Integrative therapy draws from multiple evidence-based approaches — combining talk therapy with body work, mindfulness with behavioral strategies, depth exploration with practical tools. The therapist reads what's needed in each session and adapts accordingly. Approaches like Hakomi, Sensorimotor Psychotherapy, and eclectic practitioners work this way.",
    bestFor: ["Complex presentations that don't fit one diagnosis", "Those who've done significant personal work already", "Bridging the gap between insight and embodied change", "Life transitions requiring multiple levels of support", "Those who value both structure and intuition"],
    notIdealFor: ["Those who need a very structured, manualized approach", "Acute crisis requiring a single focused intervention"],
    pioneers: ["Ron Kurtz", "Daniel Siegel", "Gabor Maté", "Marsha Linehan"],
    resources: [
      { title: "The Myth of Normal by Gabor Maté", url: "https://www.amazon.com/Myth-Normal-Illness-Healing-Culture/dp/0593083881", type: "book" },
      { title: "Mindsight by Daniel Siegel", url: "https://www.amazon.com/Mindsight-New-Science-Personal-Transformation/dp/0553386395", type: "book" },
      { title: "Open Path Collective — Affordable Therapy", url: "https://openpathcollective.org", type: "directory" },
    ],
    relatedModalities: ["cognitive", "somatic", "relational"],
    shareText: "I'm The Synthesizer — I don't fit in one box, and neither should my healing. Integrative therapy matches my wiring. Find your therapy style →" },
];

const JOURNEY_CONTINUES = [
  { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions and 6 traditions.", url: "/find-your-spirit", badge: "35 Questions" },
  { name: "Find Your Religion", hook: "8 real spiritual/philosophical archetypes, mapped.", url: "/find-your-religion", badge: "20 Questions" },
  { name: "Find My", hook: "5 questions that reveal which dimension of life is pulling you hardest.", url: "/find-my", badge: "5 Questions" },
  { name: "Find Your Purpose", hook: "The Dharma Finder — what you can't stop doing, even when nobody's paying.", url: "/assessments/dharma-finder", badge: "25 Questions" },
  { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/assessments/consciousness-scale", badge: "25 Questions" },
  { name: "Find Your Mirror", hook: "A radar chart that doesn't care about your feelings.", url: "/the-mirror", badge: "18 Questions" },
];

function GlassPanel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`rounded-2xl border border-brand-gold-light/12 bg-[#0A0A10]/60 backdrop-blur-xl ${className}`} style={style}>
      {children}
    </div>
  );
}

export function FindYourTherapyQuiz() {
  const [phase, setPhase] = useState<"landing" | "quiz" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [shareCount, setShareCount] = useState(0);
  const { markComplete } = useJourneyProgress();

  const dimensionScores = useMemo(() => {
    const raw: Record<Dimension, number> = {} as Record<Dimension, number>;
    DIMENSIONS.forEach((d) => (raw[d] = 0));
    Object.entries(answers).forEach(([qIdx, cIdx]) => {
      const choice = QUESTIONS[Number(qIdx)]?.choices[cIdx];
      if (!choice) return;
      for (const dim in choice.dimensions) {
        const d = dim as Dimension;
        raw[d] = (raw[d] || 0) + (choice.dimensions[d] ?? 0);
      }
    });
    const maxPossible = 30;
    const normalized: Record<Dimension, number> = {} as Record<Dimension, number>;
    DIMENSIONS.forEach((d) => (normalized[d] = Math.min(10, (raw[d] / maxPossible) * 10)));
    return normalized;
  }, [answers]);

  const modality = useMemo(() => {
    let topDim: Dimension = "cognitive";
    let topScore = 0;
    for (const dim of DIMENSIONS) {
      if (dimensionScores[dim] > topScore) {
        topScore = dimensionScores[dim];
        topDim = dim;
      }
    }
    return MODALITIES.find((m) => m.id === topDim) ?? MODALITIES[0];
  }, [dimensionScores]);

  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      const next = { ...answers, [currentQ]: choiceIdx };
      setAnswers(next);
      if (currentQ < QUESTIONS.length - 1) setCurrentQ((prev) => prev + 1);
      else setPhase("results");
    },
    [answers, currentQ],
  );

  useEffect(() => {
    if (phase === "results") markComplete("find-your-therapy");
  }, [phase, markComplete]);

  const handleShare = useCallback(
    (platform: string) => {
      const url = typeof window !== "undefined" ? window.location.href : "https://tonygreenberg.com/find-your-therapy";
      const text = modality.shareText;
      if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
      else if (platform === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
      else if (platform === "email") window.open(`mailto:?subject=${encodeURIComponent("Find Your Therapy")}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank");
      else if (platform === "copy") navigator.clipboard?.writeText(url);
      setShareCount((prev) => prev + 1);
    },
    [modality],
  );

  const displayScores = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of DIMENSIONS) out[DIMENSION_LABELS[d]] = dimensionScores[d];
    return out;
  }, [dimensionScores]);

  if (phase === "landing") {
    return (
      <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
        <ThemedBackground theme="therapy" />
        <AssessmentIntro
          title="Find Your Therapy"
          subtitle="The right therapy isn't about fixing what's broken. It's about meeting who you actually are."
          description="CBT, psychodynamic, somatic, EMDR, psychedelic-assisted, IFS — the landscape of therapeutic modalities is vast and confusing. This assessment maps your psychological profile to find the approach that matches how your mind actually works, not just what's trending."
          stats={{ questions: QUESTIONS.length, dimensions: DIMENSIONS.length, minutes: 7 }}
          whatYouGet={[
            "Your therapeutic archetype and recommended modalities",
            "A map of your psychological processing style",
            "Understanding of what kind of therapeutic relationship you need",
            "Curated resources for your specific journey",
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
      <div className="relative z-1 flex min-h-screen flex-col items-center justify-center px-6 font-sans text-[#2C1810]">
        <ThemedBackground theme="therapy" />
        <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-brand-gold/10">
          <div className="h-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="fixed top-6 right-6 font-mono text-[0.7rem] tracking-[0.15em] text-brand-gold/60">
          {currentQ + 1} / {QUESTIONS.length}
        </div>

        <div className="w-full max-w-2xl py-16">
          <h2 className="mb-2 text-center font-heading text-[clamp(1.6rem,4vw,2.2rem)] leading-[1.4] font-normal text-[#2C1810]">{q.stem}</h2>
          <p className="mb-10 text-center text-base text-[#2C1810]/45 italic">{q.subtext}</p>

          <div className="grid gap-3">
            {q.choices.map((choice) => (
              <button
                key={choice.text}
                onClick={() => handleAnswer(q.choices.indexOf(choice))}
                className="rounded-xl border border-brand-gold-light/10 bg-[#0A0A10]/60 px-6 py-5 text-left text-[1.02rem] leading-relaxed text-[#F5F0E0]/85 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-brand-gold-light/30 hover:shadow-[0_8px_32px_rgba(212,185,106,0.1)]"
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!emailGated) {
    return (
      <div className="relative z-1 flex min-h-screen items-center justify-center text-[#2C1810]">
        <ThemedBackground theme="therapy" />
        <EmailGate assessmentSlug="therapy" onUnlock={() => setEmailGated(true)} />
      </div>
    );
  }

  return (
    <div className="relative z-1 min-h-screen py-16 font-sans text-[#2C1810]">
      <ThemedBackground theme="therapy" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-2 text-center font-mono text-[0.7rem] tracking-[0.3em] text-brand-gold/50 uppercase">Your Therapeutic Archetype</div>
        <h1 className="mb-2 text-center font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.2] font-normal" style={{ color: ACCENT }}>
          {modality.name}
        </h1>
        <p className="mx-auto mb-12 max-w-125 text-center font-heading text-[1.15rem] text-[#5C4A3A] italic">{modality.tagline}</p>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <GlassPanel className="flex items-center justify-center p-8">
            <AssessmentRadarChart scores={displayScores} max={10} accentColor={ACCENT} />
          </GlassPanel>

          <GlassPanel className="p-8">
            <p className="text-[1.02rem] leading-[1.8] text-[#F5F0E0]/85">{modality.description}</p>
            <div className="mt-6 flex flex-col gap-2">
              {DIMENSIONS.slice()
                .sort((a, b) => dimensionScores[b] - dimensionScores[a])
                .map((dim) => (
                  <div key={dim} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-right font-mono text-[0.65rem] text-brand-gold-light/50">{DIMENSION_LABELS[dim]}</span>
                    <div className="h-1 flex-1 rounded-full bg-brand-gold-light/10">
                      <div className="h-full rounded-full bg-linear-to-r from-brand-gold to-brand-gold-light transition-[width] duration-700" style={{ width: `${dimensionScores[dim] * 10}%` }} />
                    </div>
                    <span className="w-8 shrink-0 font-mono text-[0.65rem] text-brand-gold-light">{dimensionScores[dim].toFixed(1)}</span>
                  </div>
                ))}
            </div>
          </GlassPanel>
        </div>

        <GlassPanel className="mb-8 border-l-2 p-10" style={{ borderLeftColor: ACCENT }}>
          <h3 className="mb-4 font-mono text-[0.7rem] tracking-[0.25em] text-brand-gold-light/60 uppercase">How It Works</h3>
          <p className="text-[1.02rem] leading-[1.8] text-[#F5F0E0]/80">{modality.howItWorks}</p>
        </GlassPanel>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <GlassPanel className="p-8">
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.2em] text-[#7BC9A4]/80 uppercase">Best For</h3>
            <ul className="flex list-none flex-col gap-2 p-0">
              {modality.bestFor.map((item) => (
                <li key={item} className="relative pl-4 text-[0.95rem] leading-relaxed text-[#F5F0E0]/70">
                  <span className="absolute left-0 text-[#7BC9A4]/60">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>

          <GlassPanel className="p-8">
            <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.2em] text-[#C97B7B]/80 uppercase">Consider Other Approaches If</h3>
            <ul className="flex list-none flex-col gap-2 p-0">
              {modality.notIdealFor.map((item) => (
                <li key={item} className="relative pl-4 text-[0.95rem] leading-relaxed text-[#F5F0E0]/70">
                  <span className="absolute left-0 text-[#C97B7B]/60">~</span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>

        <GlassPanel className="mb-8 p-8 text-center">
          <h3 className="mb-4 font-mono text-[0.65rem] tracking-[0.2em] text-brand-gold-light/50 uppercase">Pioneers of This Approach</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {modality.pioneers.map((name) => (
              <span key={name} className="font-heading text-[1.1rem] text-[#F5F0E0]/70">
                {name}
              </span>
            ))}
          </div>
        </GlassPanel>

        <div className="mb-8">
          <h3 className="mb-5 font-mono text-[0.75rem] tracking-[0.25em] text-brand-gold-light/50 uppercase">Go Deeper</h3>
          <div className="grid gap-3">
            {modality.resources.map((resource) => (
              <a key={resource.title} href={resource.url} target="_blank" rel="noopener noreferrer">
                <GlassPanel className="flex items-center justify-between px-6 py-5 transition-colors hover:border-brand-gold-light/30">
                  <span className="text-base text-brand-gold-light">{resource.title}</span>
                  <span className="rounded-sm border border-brand-gold/15 px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] text-brand-gold-light/40 uppercase">{resource.type}</span>
                </GlassPanel>
              </a>
            ))}
          </div>
        </div>

        <GlassPanel className="mb-8 p-8 text-center">
          <p className="mb-2 font-heading text-[1.3rem] text-brand-gold-light">Share your archetype. Start a conversation.</p>
          <p className="mb-6 text-[0.95rem] text-[#F5F0E0]/50">The people who need this most won&apos;t search for it. Send it to them.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { platform: "twitter", label: "𝕏" },
              { platform: "linkedin", label: "in" },
              { platform: "email", label: "✉" },
              { platform: "copy", label: "⎘" },
            ].map(({ platform, label }) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="flex size-11 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold-light/10 text-base text-brand-gold-light transition-colors hover:bg-brand-gold-light/25"
              >
                {label}
              </button>
            ))}
          </div>
          {shareCount > 0 && <p className="mt-4 font-mono text-[0.7rem] text-brand-gold-light/40">Shared {shareCount} time{shareCount > 1 ? "s" : ""}</p>}
        </GlassPanel>

        <div className="mb-8">
          <h3 className="mb-1 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold-light/50 uppercase">The Journey Continues</h3>
          <p className="mb-6 text-center text-[0.95rem] leading-relaxed text-[#2C1810]/50">You&apos;ve mapped your therapeutic wiring. Now go deeper into the dimensions that shape it.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNEY_CONTINUES.map((item) => (
              <a key={item.name} href={item.url}>
                <GlassPanel className="h-full p-5 transition-colors hover:border-brand-gold-light/30">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <span className="font-heading text-[0.95rem] text-brand-gold-light">{item.name}</span>
                    <span className="shrink-0 rounded-sm border border-brand-gold/15 px-1.5 py-0.5 font-mono text-[0.5rem] tracking-[0.08em] text-brand-gold-light/50 uppercase">{item.badge}</span>
                  </div>
                  <p className="m-0 text-[0.82rem] leading-relaxed text-[#F5F0E0]/40">{item.hook}</p>
                </GlassPanel>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <JourneyTracker variant="dark" currentAssessmentId="find-your-therapy" />
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setPhase("landing");
              setCurrentQ(0);
              setAnswers({});
              setEmailGated(false);
              setShareCount(0);
            }}
            className="mb-6 rounded-lg border border-brand-gold/20 px-8 py-3 font-mono text-[0.75rem] tracking-[0.15em] text-brand-gold-light/60 uppercase transition-colors hover:border-brand-gold-light/50 hover:text-brand-gold-light"
          >
            Retake Assessment
          </button>

          <AssessmentResultActions accentColor={ACCENT} resultSlug="find-your-therapy" />

          <div className="mt-4">
            <Link href="/find-my" className="font-mono text-[0.7rem] tracking-[0.1em] text-brand-gold-light/40 hover:text-brand-gold-light">
              Explore the full Find Your ___ ecosystem →
            </Link>
          </div>

          <p className="mt-12 font-mono text-[0.6rem] tracking-[0.15em] text-brand-gold-light/20 uppercase">
            Not medical advice · For self-exploration only · Consult a licensed professional
          </p>
        </div>
      </div>

      <WhatsNext />
    </div>
  );
}
