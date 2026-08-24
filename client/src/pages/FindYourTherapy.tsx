/**
 * FIND YOUR THERAPY
 * 
 * A standalone assessment matching users to their ideal therapeutic modality.
 * 10 questions across 6 dimensions: cognitive, somatic, relational, depth,
 * altered-states, and integrative. Results map to specific therapy styles
 * with resources and next steps.
 * 
 * Design: Same dark contemplative glass-morphism as Find My.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
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
  stem: string;
  subtext: string;
  choices: Choice[];
}

interface TherapyModality {
  id: string;
  name: string;
  tagline: string;
  description: string;
  primaryDimension: string;
  howItWorks: string;
  bestFor: string[];
  notIdealFor: string[];
  pioneers: string[];
  resources: { title: string; url: string; type: string }[];
  relatedModalities: string[];
  shareText: string;
}

/* ── DIMENSION LABELS ── */

const DIMENSION_LABELS: Record<string, string> = {
  cognitive: "Cognitive",
  somatic: "Somatic",
  relational: "Relational",
  depth: "Depth / Unconscious",
  altered: "Altered States",
  integrative: "Integrative",
};

/* ── QUESTIONS ── */

const QUESTIONS: Question[] = [
  // ── COGNITIVE DIMENSION (Q1-4) ──
  {
    id: 1,
    stem: "When you're in pain, where does it live?",
    subtext: "Not the story about the pain. The pain itself.",
    choices: [
      { text: "In my thoughts — loops I can't stop running", dimensions: { cognitive: 3, depth: 1 } },
      { text: "In my body — tension, numbness, or restlessness I can't explain", dimensions: { somatic: 3, integrative: 1 } },
      { text: "In the space between me and other people", dimensions: { relational: 3, depth: 1 } },
      { text: "In a feeling I had before I had words for feelings", dimensions: { depth: 3, somatic: 1 } },
    ],
  },
  {
    id: 2,
    stem: "When something goes wrong, what's your first move?",
    subtext: "Before the coping kicks in. The raw reflex.",
    choices: [
      { text: "I replay the situation looking for what I missed — where the logic broke", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "I feel it in my chest or stomach before I can name what happened", dimensions: { somatic: 3, depth: 1 } },
      { text: "I reach for someone — I need to process it out loud with a person I trust", dimensions: { relational: 3, integrative: 1 } },
      { text: "I go quiet and inward — something deeper than thinking takes over", dimensions: { depth: 2, altered: 2 } },
    ],
  },
  {
    id: 3,
    stem: "What's your relationship with self-help books?",
    subtext: "Honest answer. No judgment.",
    choices: [
      { text: "I devour them — frameworks and models are how I make sense of myself", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "They make sense in my head but nothing changes in my life", dimensions: { cognitive: 1, somatic: 2, integrative: 1 } },
      { text: "I prefer conversations to books — I learn through people, not pages", dimensions: { relational: 3, cognitive: 1 } },
      { text: "The ones that changed me weren't self-help — they were poetry, myth, or something I can't categorize", dimensions: { depth: 2, altered: 2 } },
    ],
  },
  {
    id: 4,
    stem: "How do you relate to your own thinking?",
    subtext: "Your mind as instrument, obstacle, or both.",
    choices: [
      { text: "It's my superpower and my prison — I can't stop analyzing", dimensions: { cognitive: 3, depth: 1 } },
      { text: "My thinking disconnects me from what I actually feel", dimensions: { cognitive: 1, somatic: 2, depth: 1 } },
      { text: "I think clearly about other people's problems but go blank on my own", dimensions: { relational: 2, cognitive: 1, depth: 1 } },
      { text: "My best insights come when I stop thinking entirely", dimensions: { altered: 3, integrative: 1 } },
    ],
  },
  // ── SOMATIC DIMENSION (Q5-8) ──
  {
    id: 5,
    stem: "What's your relationship with your body?",
    subtext: "The vessel you've been negotiating with.",
    choices: [
      { text: "I live from the neck up — my body is transportation for my brain", dimensions: { cognitive: 2, somatic: 1, integrative: 1 } },
      { text: "My body holds things my mind won't admit", dimensions: { somatic: 3, depth: 1 } },
      { text: "I perform wellness but don't feel well", dimensions: { integrative: 2, somatic: 1, relational: 1 } },
      { text: "I've had experiences where my body knew things before I did", dimensions: { somatic: 2, altered: 2 } },
    ],
  },
  {
    id: 6,
    stem: "When was the last time you cried?",
    subtext: "And what happened in your body when you did — or couldn't.",
    choices: [
      { text: "I can't remember — I've gotten very good at not going there", dimensions: { depth: 2, somatic: 2 } },
      { text: "Recently, and it came from my body — shaking, heaving, not just tears", dimensions: { somatic: 3, depth: 1 } },
      { text: "When someone really saw me — the tears were about being witnessed", dimensions: { relational: 3, somatic: 1 } },
      { text: "During a meditation, ceremony, or experience that cracked something open", dimensions: { altered: 3, somatic: 1 } },
    ],
  },
  {
    id: 7,
    stem: "Where does stress show up in your body first?",
    subtext: "Before you've named it as stress.",
    choices: [
      { text: "Racing thoughts, insomnia, a mind that won't shut off", dimensions: { cognitive: 3, somatic: 1 } },
      { text: "Jaw clenching, shoulder tension, stomach knots — my body is a stress barometer", dimensions: { somatic: 3, integrative: 1 } },
      { text: "I get irritable with people close to me before I realize I'm stressed", dimensions: { relational: 2, somatic: 1, depth: 1 } },
      { text: "I dissociate — I leave my body and watch from somewhere else", dimensions: { somatic: 2, depth: 1, altered: 1 } },
    ],
  },
  {
    id: 8,
    stem: "How do you process difficult experiences?",
    subtext: "Your default, not your ideal.",
    choices: [
      { text: "I journal, research, and try to make meaning from it", dimensions: { cognitive: 2, integrative: 2 } },
      { text: "I move — run, yoga, hike — until my body releases it", dimensions: { somatic: 3, integrative: 1 } },
      { text: "I call someone I trust and talk until I can breathe again", dimensions: { relational: 3, integrative: 1 } },
      { text: "I go inward — meditation, silence, or something that takes me out of ordinary mind", dimensions: { altered: 2, depth: 2 } },
    ],
  },
  // ── RELATIONAL DIMENSION (Q9-12) ──
  {
    id: 9,
    stem: "What scares you most about going deeper?",
    subtext: "The resistance is the roadmap.",
    choices: [
      { text: "Losing control of the narrative I've built about myself", dimensions: { cognitive: 2, depth: 2 } },
      { text: "Feeling things I've spent years learning not to feel", dimensions: { somatic: 2, depth: 2 } },
      { text: "Being truly vulnerable with another human being", dimensions: { relational: 3, depth: 1 } },
      { text: "What I might find on the other side of ordinary consciousness", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  {
    id: 10,
    stem: "What happens when someone gets too close?",
    subtext: "Not the story you tell. The thing you do.",
    choices: [
      { text: "I intellectualize — I explain the relationship instead of being in it", dimensions: { cognitive: 2, relational: 1, depth: 1 } },
      { text: "My body tenses — I feel physically unsafe even when I'm logically fine", dimensions: { somatic: 3, relational: 1 } },
      { text: "I merge — I lose myself in the other person and forget what I need", dimensions: { relational: 3, depth: 1 } },
      { text: "I disappear — not physically, but something inside me goes offline", dimensions: { depth: 2, somatic: 1, altered: 1 } },
    ],
  },
  {
    id: 11,
    stem: "Who do you become in conflict?",
    subtext: "The version of you that shows up when it matters most.",
    choices: [
      { text: "The lawyer — I build my case, present evidence, argue my position", dimensions: { cognitive: 3, relational: 1 } },
      { text: "The ghost — I freeze, shut down, or leave my body", dimensions: { somatic: 2, depth: 2 } },
      { text: "The caretaker — I abandon my position to preserve the relationship", dimensions: { relational: 3, integrative: 1 } },
      { text: "The mirror — I reflect back what the other person can't see about themselves", dimensions: { depth: 2, relational: 1, integrative: 1 } },
    ],
  },
  {
    id: 12,
    stem: "What does trust feel like in your body?",
    subtext: "If you can feel it at all.",
    choices: [
      { text: "I'm not sure I've felt it — I trust data and track records, not feelings", dimensions: { cognitive: 3, relational: 1 } },
      { text: "A softening — my shoulders drop, my breath deepens, my guard comes down", dimensions: { somatic: 3, relational: 1 } },
      { text: "It feels like home — being with someone where I don't have to perform", dimensions: { relational: 3, depth: 1 } },
      { text: "I've felt it most in non-ordinary states — ceremony, deep meditation, peak experiences", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  // ── DEPTH / UNCONSCIOUS DIMENSION (Q13-16) ──
  {
    id: 13,
    stem: "What does healing look like to you?",
    subtext: "The honest version, not the aspirational one.",
    choices: [
      { text: "Understanding why I do what I do — insight as liberation", dimensions: { cognitive: 2, depth: 2 } },
      { text: "Feeling safe in my own skin again", dimensions: { somatic: 3, integrative: 1 } },
      { text: "Being seen without performing — real connection", dimensions: { relational: 3, integrative: 1 } },
      { text: "A single moment of clarity that rewrites everything before it", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  {
    id: 14,
    stem: "Do you dream? And do the dreams mean something?",
    subtext: "The unconscious has its own language.",
    choices: [
      { text: "I rarely remember dreams — my waking mind is busy enough", dimensions: { cognitive: 2, integrative: 1, depth: 1 } },
      { text: "I have vivid body-based dreams — falling, running, being chased", dimensions: { somatic: 2, depth: 2 } },
      { text: "My dreams are full of people — conversations, reunions, betrayals", dimensions: { relational: 2, depth: 2 } },
      { text: "My dreams feel like messages from somewhere deeper than my biography", dimensions: { depth: 3, altered: 1 } },
    ],
  },
  {
    id: 15,
    stem: "What pattern keeps showing up in your life?",
    subtext: "The one you're tired of recognizing.",
    choices: [
      { text: "I know what to do but can't make myself do it — the gap between insight and action", dimensions: { cognitive: 1, integrative: 2, somatic: 1 } },
      { text: "I attract the same relationship dynamics no matter who I'm with", dimensions: { relational: 2, depth: 2 } },
      { text: "My body breaks down when my life gets too intense", dimensions: { somatic: 3, depth: 1 } },
      { text: "I glimpse something profound and then can't hold onto it in daily life", dimensions: { altered: 2, integrative: 2 } },
    ],
  },
  {
    id: 16,
    stem: "What's your relationship with your family of origin?",
    subtext: "Not the holiday card version.",
    choices: [
      { text: "I've analyzed it thoroughly — I understand the dynamics intellectually", dimensions: { cognitive: 3, depth: 1 } },
      { text: "Being around them activates something in my nervous system I can't control", dimensions: { somatic: 2, depth: 2 } },
      { text: "I'm still playing a role I outgrew decades ago", dimensions: { relational: 2, depth: 2 } },
      { text: "There are things that happened that I've never fully processed — they live in the basement", dimensions: { depth: 3, somatic: 1 } },
    ],
  },
  // ── ALTERED STATES DIMENSION (Q17-20) ──
  {
    id: 17,
    stem: "When you've had breakthroughs before, what triggered them?",
    subtext: "The moments that actually shifted something.",
    choices: [
      { text: "A conversation where someone reflected back what I couldn't see", dimensions: { relational: 3, cognitive: 1 } },
      { text: "A physical experience — movement, breathwork, or touch", dimensions: { somatic: 3, altered: 1 } },
      { text: "A book, framework, or idea that reorganized everything", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "An altered state — meditation, ceremony, or spontaneous mystical experience", dimensions: { altered: 3, integrative: 1 } },
    ],
  },
  {
    id: 18,
    stem: "Have you ever had an experience that ordinary language can't describe?",
    subtext: "The kind that changes the operating system, not just the software.",
    choices: [
      { text: "No — and I'm skeptical of people who claim they have", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "Yes — through my body. A physical experience that transcended explanation", dimensions: { somatic: 2, altered: 2 } },
      { text: "Yes — through deep connection with another person. Love as a portal", dimensions: { relational: 2, altered: 2 } },
      { text: "Yes — and it's the most real thing that's ever happened to me", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  {
    id: 19,
    stem: "What's your relationship with meditation or contemplative practice?",
    subtext: "The actual practice, not the idea of it.",
    choices: [
      { text: "I've tried it but my mind won't stop — I need something more structured", dimensions: { cognitive: 2, integrative: 2 } },
      { text: "Body-based practices work better for me — yoga, tai chi, walking meditation", dimensions: { somatic: 3, altered: 1 } },
      { text: "Group practice or guided meditation with a teacher — I need the relational container", dimensions: { relational: 2, altered: 1, integrative: 1 } },
      { text: "I've gone deep — and what I found there changed my understanding of reality", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  {
    id: 20,
    stem: "How do you feel about psychedelic medicine?",
    subtext: "Not the politics. Your actual felt sense.",
    choices: [
      { text: "Curious but cautious — I want the evidence before I trust the experience", dimensions: { cognitive: 2, altered: 1, integrative: 1 } },
      { text: "Interested in the body-based aspects — the somatic release, the nervous system reset", dimensions: { somatic: 2, altered: 2 } },
      { text: "I'd only do it with someone I deeply trust — the relational container matters more than the molecule", dimensions: { relational: 2, altered: 2 } },
      { text: "I've experienced it — or I'm drawn to it — as the most direct path to what's underneath", dimensions: { altered: 3, depth: 1 } },
    ],
  },
  // ── INTEGRATIVE DIMENSION (Q21-24) ──
  {
    id: 21,
    stem: "What kind of guide do you need right now?",
    subtext: "Not forever. Right now.",
    choices: [
      { text: "A strategist — someone who helps me think differently", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "A witness — someone who can hold space without fixing", dimensions: { relational: 3, depth: 1 } },
      { text: "A body worker — someone who speaks the language of sensation", dimensions: { somatic: 3, integrative: 1 } },
      { text: "A sherpa — someone who's been to the edge and can take me there safely", dimensions: { altered: 2, depth: 2 } },
    ],
  },
  {
    id: 22,
    stem: "How many different approaches have you tried?",
    subtext: "The therapeutic resume.",
    choices: [
      { text: "One or two — I found what works and stuck with it", dimensions: { cognitive: 2, somatic: 2 } },
      { text: "Several — talk therapy, maybe some body work, maybe medication", dimensions: { integrative: 3, cognitive: 1 } },
      { text: "A lot — and I found truth in each of them but none was complete", dimensions: { integrative: 3, depth: 1 } },
      { text: "I've been on a long journey across modalities and I'm ready for something that holds all of it", dimensions: { integrative: 3, altered: 1 } },
    ],
  },
  {
    id: 23,
    stem: "What's missing from the therapy you've tried before?",
    subtext: "The thing it couldn't reach.",
    choices: [
      { text: "It was too slow — I need practical tools and measurable progress", dimensions: { cognitive: 3, integrative: 1 } },
      { text: "It stayed in my head — nothing changed in my body or my daily life", dimensions: { somatic: 2, integrative: 2 } },
      { text: "The therapist was competent but the relationship didn't feel safe enough to go deep", dimensions: { relational: 3, depth: 1 } },
      { text: "It couldn't hold the spiritual or transpersonal dimensions of my experience", dimensions: { altered: 2, depth: 1, integrative: 1 } },
    ],
  },
  {
    id: 24,
    stem: "How do you relate to your emotions?",
    subtext: "Right now. Not how you wish you did.",
    choices: [
      { text: "I analyze them — I need to understand before I can feel", dimensions: { cognitive: 3, depth: 1 } },
      { text: "They overwhelm me — too much, too fast, too often", dimensions: { somatic: 2, relational: 1, integrative: 1 } },
      { text: "I perform them for others but can't access them alone", dimensions: { relational: 2, depth: 2 } },
      { text: "I've numbed them — and I'm not sure how to get them back", dimensions: { depth: 2, somatic: 2 } },
    ],
  },
  // ── THE FINAL QUESTION ──
  {
    id: 25,
    stem: "If therapy could give you one thing, what would it be?",
    subtext: "The real answer. Not the one that sounds good.",
    choices: [
      { text: "A new operating system — different patterns, different outcomes", dimensions: { cognitive: 2, integrative: 2 } },
      { text: "To feel at home in my body for the first time", dimensions: { somatic: 3, depth: 1 } },
      { text: "To stop being afraid of intimacy — to let someone all the way in", dimensions: { relational: 3, depth: 1 } },
      { text: "To access the version of myself that exists beyond my defenses", dimensions: { depth: 2, altered: 2 } },
    ],
  },
];

/* ── THERAPY MODALITIES ── */

const MODALITIES: TherapyModality[] = [
  {
    id: "cognitive",
    name: "The Architect",
    tagline: "You heal by understanding. Insight is your medicine.",
    description: "Your mind is your primary instrument — and your primary obstacle. You need a therapy that respects your intelligence while teaching you that understanding alone isn't transformation. CBT, ACT, and structured approaches give you the framework your mind craves while building the bridge between knowing and doing.",
    primaryDimension: "cognitive",
    howItWorks: "Cognitive Behavioral Therapy (CBT) and Acceptance & Commitment Therapy (ACT) work by identifying the thought patterns that create suffering and systematically replacing them with more adaptive ones. It's not about positive thinking — it's about accurate thinking. You'll learn to catch the cognitive distortions in real-time and choose different responses.",
    bestFor: [
      "Anxiety and rumination loops",
      "Perfectionism and imposter syndrome",
      "Decision paralysis and overthinking",
      "Building practical coping strategies",
    ],
    notIdealFor: [
      "Deep childhood trauma (may need depth work first)",
      "Grief that needs to be felt, not analyzed",
      "Spiritual emergencies",
    ],
    pioneers: ["Aaron Beck", "Steven Hayes", "Albert Ellis", "Judith Beck"],
    resources: [
      { title: "Feeling Good by David Burns", url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336", type: "book" },
      { title: "The Happiness Trap by Russ Harris", url: "https://www.amazon.com/Happiness-Trap-Struggling-Start-Living/dp/1590305841", type: "book" },
      { title: "Psychology Today — Find a CBT Therapist", url: "https://www.psychologytoday.com/us/therapists/cognitive-behavioral-cbt", type: "directory" },
    ],
    relatedModalities: ["integrative", "depth"],
    shareText: "I'm The Architect — I heal by understanding. CBT and structured approaches match my wiring. Find your therapy style →",
  },
  {
    id: "somatic",
    name: "The Embodied",
    tagline: "Your body remembers what your mind forgot. Time to listen.",
    description: "You carry your history in your tissues. Talk therapy alone will never reach what lives below your neck. Somatic Experiencing, EMDR, and body-based approaches speak the language your nervous system actually understands — sensation, movement, breath, and the wisdom of the body that your culture taught you to ignore.",
    primaryDimension: "somatic",
    howItWorks: "Somatic therapies work with the body's innate capacity to process and release stored trauma. Through guided attention to physical sensations, pendulation between activation and calm, and gentle movement, your nervous system completes the survival responses that got frozen in time. EMDR uses bilateral stimulation to help the brain reprocess traumatic memories.",
    bestFor: [
      "PTSD and complex trauma",
      "Chronic pain with no clear medical cause",
      "Anxiety that lives in the body (chest tightness, stomach knots)",
      "Dissociation and feeling disconnected from your body",
      "Trauma stored before verbal memory",
    ],
    notIdealFor: [
      "Purely cognitive distortions without somatic component",
      "Situations requiring immediate behavioral strategies",
    ],
    pioneers: ["Peter Levine", "Bessel van der Kolk", "Pat Ogden", "Francine Shapiro"],
    resources: [
      { title: "The Body Keeps the Score by Bessel van der Kolk", url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748", type: "book" },
      { title: "Waking the Tiger by Peter Levine", url: "https://www.amazon.com/Waking-Tiger-Healing-Trauma-Innate/dp/155643233X", type: "book" },
      { title: "EMDRIA — Find an EMDR Therapist", url: "https://www.emdria.org/find-an-emdr-therapist/", type: "directory" },
    ],
    relatedModalities: ["depth", "altered"],
    shareText: "I'm The Embodied — my body remembers what my mind forgot. Somatic therapy speaks my language. Find your therapy style →",
  },
  {
    id: "relational",
    name: "The Mirror Seeker",
    tagline: "You heal in relationship. Connection is the medicine.",
    description: "Your wounds happened between people, and they'll heal between people. Attachment-based therapy, IFS, and relational psychodynamic approaches understand that the therapeutic relationship itself is the healing agent. You don't need more insight — you need the experience of being truly seen, held, and not abandoned.",
    primaryDimension: "relational",
    howItWorks: "Internal Family Systems (IFS) works with the different 'parts' of your psyche — the protectors, the exiles, the managers — helping you develop a compassionate relationship with all of them. Attachment-based therapy uses the therapeutic relationship as a corrective emotional experience, rewiring your attachment patterns through consistent, attuned presence.",
    bestFor: [
      "Attachment wounds and relationship patterns",
      "Fear of intimacy or abandonment",
      "People-pleasing and codependency",
      "Inner critic and self-sabotage",
      "Difficulty trusting or being vulnerable",
    ],
    notIdealFor: [
      "Acute crisis requiring immediate stabilization",
      "Those who need structured behavioral change first",
    ],
    pioneers: ["Richard Schwartz", "Sue Johnson", "John Bowlby", "Irvin Yalom"],
    resources: [
      { title: "No Bad Parts by Richard Schwartz", url: "https://www.amazon.com/No-Bad-Parts-Restoring-Wholeness/dp/1683646681", type: "book" },
      { title: "Attached by Amir Levine", url: "https://www.amazon.com/Attached-Science-Adult-Attachment-YouFind/dp/1585429139", type: "book" },
      { title: "IFS Institute — Find a Therapist", url: "https://ifs-institute.com/practitioners", type: "directory" },
    ],
    relatedModalities: ["depth", "integrative"],
    shareText: "I'm The Mirror Seeker — I heal in relationship. IFS and attachment therapy match my wiring. Find your therapy style →",
  },
  {
    id: "depth",
    name: "The Archaeologist",
    tagline: "You need to go down before you can go forward.",
    description: "Surface-level fixes insult your intelligence. You sense that your patterns have roots that go deeper than this lifetime's biography — into family systems, collective unconscious, and the archetypal layers of psyche. Psychodynamic therapy, Jungian analysis, and depth psychology honor the complexity you feel.",
    primaryDimension: "depth",
    howItWorks: "Depth psychology works with dreams, symbols, transference, and the unconscious material that drives behavior from below awareness. Jungian analysis explores archetypes, shadow work, and individuation — the process of becoming who you actually are beneath the adaptations. Psychodynamic therapy traces current patterns to their developmental origins.",
    bestFor: [
      "Recurring life patterns that resist surface-level change",
      "Existential questions and meaning-making",
      "Creative blocks and unlived life",
      "Family-of-origin patterns repeating across generations",
      "Integration of shadow material",
    ],
    notIdealFor: [
      "Those needing quick behavioral change",
      "Active substance abuse (stabilize first)",
      "Those uncomfortable with ambiguity and slow process",
    ],
    pioneers: ["Carl Jung", "James Hillman", "Marion Woodman", "Robert Johnson"],
    resources: [
      { title: "Man and His Symbols by Carl Jung", url: "https://www.amazon.com/Man-His-Symbols-Carl-Jung/dp/0440351839", type: "book" },
      { title: "The Soul's Code by James Hillman", url: "https://www.amazon.com/Souls-Code-Character-Calling/dp/0446673714", type: "book" },
      { title: "IAAP — Find a Jungian Analyst", url: "https://iaap.org/analysts/", type: "directory" },
    ],
    relatedModalities: ["altered", "relational"],
    shareText: "I'm The Archaeologist — I need to go down before I can go forward. Depth psychology matches my wiring. Find your therapy style →",
  },
  {
    id: "altered",
    name: "The Boundary Crosser",
    tagline: "Ordinary consciousness can't solve what ordinary consciousness created.",
    description: "You've tasted something beyond the default mode network — in meditation, ceremony, flow states, or spontaneous mystical experience — and you know that's where the real healing lives. Psychedelic-assisted therapy, holotropic breathwork, and contemplative approaches work at the edge of consciousness where transformation actually happens.",
    primaryDimension: "altered",
    howItWorks: "Psychedelic-assisted therapy (with psilocybin, MDMA, or ketamine) creates a window of neuroplasticity where deeply held patterns can be reorganized in hours rather than years. Holotropic breathwork uses accelerated breathing to access non-ordinary states. These approaches work best with proper preparation, skilled facilitation, and rigorous integration afterward.",
    bestFor: [
      "Treatment-resistant depression and PTSD",
      "End-of-life anxiety and existential distress",
      "Spiritual emergencies and integration",
      "Addiction (especially when other approaches have failed)",
      "Those who've plateaued in traditional therapy",
    ],
    notIdealFor: [
      "Active psychosis or family history of schizophrenia",
      "Those without access to legal, supervised settings",
      "Seeking escape rather than transformation",
      "Those not willing to do integration work afterward",
    ],
    pioneers: ["Stanislav Grof", "Rick Doblin", "Roland Griffiths", "Robin Carhart-Harris"],
    resources: [
      { title: "How to Change Your Mind by Michael Pollan", url: "https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/0735224153", type: "book" },
      { title: "The Way of the Psychonaut by Stanislav Grof", url: "https://www.amazon.com/Way-Psychonaut-Encyclopedia-Inner-Journeys/dp/0998276596", type: "book" },
      { title: "MAPS — Psychedelic Therapy Research", url: "https://maps.org", type: "research" },
      { title: "Ketamine Research Foundation", url: "https://www.ketamineresearchfoundation.org", type: "research" },
    ],
    relatedModalities: ["depth", "somatic"],
    shareText: "I'm The Boundary Crosser — ordinary consciousness can't solve what it created. Psychedelic-assisted therapy matches my wiring. Find your therapy style →",
  },
  {
    id: "integrative",
    name: "The Synthesizer",
    tagline: "You don't fit in one box. Neither should your healing.",
    description: "You've probably tried several approaches and found truth in each of them. Your healing path isn't linear — it's a web. Integrative and holistic approaches combine cognitive, somatic, relational, and contemplative elements into a personalized protocol. You need a therapist who can move fluidly between modalities based on what's alive in the moment.",
    primaryDimension: "integrative",
    howItWorks: "Integrative therapy draws from multiple evidence-based approaches — combining talk therapy with body work, mindfulness with behavioral strategies, depth exploration with practical tools. The therapist reads what's needed in each session and adapts accordingly. Approaches like Hakomi, Sensorimotor Psychotherapy, and eclectic practitioners work this way.",
    bestFor: [
      "Complex presentations that don't fit one diagnosis",
      "Those who've done significant personal work already",
      "Bridging the gap between insight and embodied change",
      "Life transitions requiring multiple levels of support",
      "Those who value both structure and intuition",
    ],
    notIdealFor: [
      "Those who need a very structured, manualized approach",
      "Acute crisis requiring a single focused intervention",
    ],
    pioneers: ["Ron Kurtz", "Daniel Siegel", "Gabor Maté", "Marsha Linehan"],
    resources: [
      { title: "The Myth of Normal by Gabor Maté", url: "https://www.amazon.com/Myth-Normal-Illness-Healing-Culture/dp/0593083881", type: "book" },
      { title: "Mindsight by Daniel Siegel", url: "https://www.amazon.com/Mindsight-New-Science-Personal-Transformation/dp/0553386395", type: "book" },
      { title: "Open Path Collective — Affordable Therapy", url: "https://openpathcollective.org", type: "directory" },
    ],
    relatedModalities: ["cognitive", "somatic", "relational"],
    shareText: "I'm The Synthesizer — I don't fit in one box, and neither should my healing. Integrative therapy matches my wiring. Find your therapy style →",
  },
];

/* ── SACRED GEOMETRY BG ── */

function SacredGeometryBg() {
  return (
    <>
    <ThemedBackground theme="therapy" />
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        {[500, 440, 560, 470, 530, 470, 530].map((cx, i) => {
          const cy = [500, 465, 465, 535, 535, 500, 500][i];
          return <circle key={i} cx={cx} cy={cy} r={60} fill="none" stroke="#D4B96A" strokeWidth="0.5" />;
        })}
        <circle cx="500" cy="500" r="120" fill="none" stroke="#D4B96A" strokeWidth="0.3" />
        <circle cx="500" cy="500" r="180" fill="none" stroke="#D4B96A" strokeWidth="0.2" />
        <circle cx="500" cy="500" r="250" fill="none" stroke="#D4B96A" strokeWidth="0.15" />
        <circle cx="500" cy="500" r="350" fill="none" stroke="#D4B96A" strokeWidth="0.1" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 500 + 180 * Math.cos(rad);
          const y = 500 + 180 * Math.sin(rad);
          return <line key={`l${i}`} x1="500" y1="500" x2={x} y2={y} stroke="#D4B96A" strokeWidth="0.2" />;
        })}
      </svg>
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(212, 185, 106, ${0.1 + Math.random() * 0.2})`,
              animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
    </>
  );
}

/* ── GLASS PANEL ── */

function GlassPanel({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(10, 10, 16, 0.6)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        border: "1px solid rgba(212, 185, 106, 0.12)",
        borderRadius: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── RADAR CHART ── */

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const dims = Object.keys(DIMENSION_LABELS);
  const size = 280;
  const center = size / 2;
  const maxR = 110;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / dims.length - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = dims.map((d, i) => getPoint(i, scores[d] || 0));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 280 }}>
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const points = dims.map((_, i) => getPoint(i, scale * 10));
        const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={scale} d={path} fill="none" stroke="rgba(212,185,106,0.15)" strokeWidth="0.5" />;
      })}
      {dims.map((_, i) => {
        const p = getPoint(i, 10);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(212,185,106,0.1)" strokeWidth="0.5" />;
      })}
      <path d={dataPath} fill="rgba(212,185,106,0.15)" stroke="#D4B96A" strokeWidth="1.5" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />
      ))}
      {dims.map((d, i) => {
        const p = getPoint(i, 12.5);
        return (
          <text key={d} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(212,185,106,0.7)" fontSize="8" fontFamily="'DM Mono', monospace">
            {DIMENSION_LABELS[d]}
          </text>
        );
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ── */

export default function FindYourTherapy() {
  const [phase, setPhase] = useState<"landing" | "assessment" | "results">("landing");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [emailGated, setEmailGated] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const { markComplete } = useJourneyProgress();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [fadeIn, setFadeIn] = useState(true);
  const [resultsFadeIn, setResultsFadeIn] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const currentQuestion = QUESTIONS[currentQ] || null;
  const totalQuestions = QUESTIONS.length;
  const progress = Object.keys(answers).length / totalQuestions;

  /* ── Score calculation ── */
  const dimensionScores = useMemo(() => {
    const raw: Record<string, number> = {};
    Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
      const q = QUESTIONS[Number(qIdx)];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, val]) => {
        raw[dim] = (raw[dim] || 0) + val;
      });
    });
    // Normalize to 0-10
    const maxPossible = 30; // rough max per dimension with 25 questions
    const normalized: Record<string, number> = {};
    Object.keys(DIMENSION_LABELS).forEach((dim) => {
      normalized[dim] = Math.min(10, ((raw[dim] || 0) / maxPossible) * 10);
    });
    return normalized;
  }, [answers]);

  const modality = useMemo(() => {
    if (Object.keys(answers).length < totalQuestions) return MODALITIES[0];
    let topDim = "cognitive";
    let topScore = 0;
    Object.entries(dimensionScores).forEach(([dim, score]) => {
      if (score > topScore) {
        topDim = dim;
        topScore = score;
      }
    });
    return MODALITIES.find((m) => m.primaryDimension === topDim) || MODALITIES[0];
  }, [dimensionScores, answers]);

  /* ── Handlers ── */
  const handleAnswer = useCallback((choiceIdx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [currentQ]: choiceIdx }));
      if (currentQ < totalQuestions - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setPhase("results");
        markComplete("find-your-therapy");
        // Store results for My Journey dashboard
        try {
          const finalAnswers = { ...answers, [currentQ]: choiceIdx } as Record<number, number>;
          const raw: Record<string, number> = {};
          Object.entries(finalAnswers).forEach(([qIdx, cIdx]) => {
            const q = QUESTIONS[Number(qIdx)];
            if (!q) return;
            const choice = q.choices[cIdx as number];
            if (!choice) return;
            Object.entries(choice.dimensions).forEach(([dim, val]) => { raw[dim] = (raw[dim] || 0) + val; });
          });
          const maxP = 30;
          const norm: Record<string, number> = {};
          Object.keys(DIMENSION_LABELS).forEach((dim) => { norm[dim] = Math.min(10, ((raw[dim] || 0) / maxP) * 10); });
          let topDim = "cognitive"; let topScore = 0;
          Object.entries(norm).forEach(([dim, score]) => { if (score > topScore) { topDim = dim; topScore = score; } });
          const mod = MODALITIES.find((m) => m.primaryDimension === topDim) || MODALITIES[0];
          localStorage.setItem("therapy_results", JSON.stringify({ archetype: mod.name, topModality: mod.name, scores: norm, timestamp: Date.now() }));
        } catch {}
        setTimeout(() => setResultsFadeIn(true), 100);
      }
      setFadeIn(true);
    }, 300);
  }, [currentQ, totalQuestions]);

  const handleShare = useCallback((platform: string) => {
    const url = window.location.href.replace(/^https?:\/\/[^/]+/, "https://tonygreenberg.com");
    const text = modality.shareText;
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent("Find Your Therapy")}&body=${encodeURIComponent(text + "\n\n" + url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard?.writeText(url);
        break;
    }
    setShareCount((prev) => prev + 1);
  }, [modality]);

  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentQ(0);
    setAnswers({});
    setFadeIn(true);
    setResultsFadeIn(false);
    setShareCount(0);
  }, []);

  /* ── Scroll to top on phase change ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#2C1810",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <SEO
        title="Find Your Therapy | Tony Greenberg"
        description="25 questions to match you with the therapeutic modality that fits your wiring — CBT, IFS, somatic, psychedelic-assisted, depth psychology, or integrative."
        path="/find-your-therapy"
        indexable={true}
      />

      <SacredGeometryBg />

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInSlow { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(212,185,106,0.05); } 50% { box-shadow: 0 0 40px rgba(212,185,106,0.15); } }
        @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
        .choice-btn { transition: all 0.3s ease; }
        .choice-btn:hover { transform: translateY(-2px); border-color: rgba(212,185,106,0.3) !important; box-shadow: 0 8px 32px rgba(212,185,106,0.1); }
      `}</style>

      {/* ── LANDING PHASE ── */}
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Therapy"
          subtitle="The right therapy isn't about fixing what's broken. It's about meeting who you actually are."
          description="CBT, psychodynamic, somatic, EMDR, psychedelic-assisted, IFS — the landscape of therapeutic modalities is vast and confusing. This assessment maps your psychological profile to find the approach that matches how your mind actually works, not just what's trending."
          stats={{ questions: 20, dimensions: 6, minutes: 7 }}
          whatYouGet={["Your therapeutic archetype and recommended modalities","A map of your psychological processing style","Understanding of what kind of therapeutic relationship you need","Curated resources for your specific journey"]}
          accentColor="#7B1FA2"
          onBegin={() => setPhase('assessment')}
        />
      )}

      {/* ── ASSESSMENT PHASE ── */}
      {phase === "assessment" && currentQuestion && (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Progress bar */}
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
            <div style={{ height: 2, background: "rgba(212,185,106,0.1)" }}>
              <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #8B6914, #D4B96A)", transition: "width 0.5s ease" }} />
            </div>
          </div>

          {/* Question counter */}
          <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.4)" }}>
              {currentQ + 1} / {totalQuestions}
            </span>
          </div>

          {/* Back to landing */}
          <div style={{ position: "fixed", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
            <button
              onClick={handleRestart}
              style={{ background: "none", border: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(212,185,106,0.4)", cursor: "pointer" }}
            >
              ← START OVER
            </button>
          </div>

          <div
            style={{
              maxWidth: 650,
              width: "100%",
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.4s ease",
            }}
          >
            {/* Question stem */}
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                fontWeight: 400,
                lineHeight: 1.4,
                textAlign: "center",
                marginBottom: "0.5rem",
                color: "#2C1810",
              }}
            >
              {currentQuestion.stem}
            </h2>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1rem",
                color: "rgba(232,228,220,0.4)",
                textAlign: "center",
                fontStyle: "italic",
                marginBottom: "2.5rem",
              }}
            >
              {currentQuestion.subtext}
            </p>

            {/* Choices */}
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {currentQuestion.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="choice-btn"
                  style={{
                    background: "rgba(10, 10, 16, 0.6)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: "1px solid rgba(212, 185, 106, 0.12)",
                    borderRadius: "12px",
                    padding: "1.25rem 1.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "rgba(232,228,220,0.75)",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    width: "100%",
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ── */}
      {phase === "results" && !emailGated && (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: 440, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔮</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#8B6914", marginBottom: "0.5rem" }}>
              Your results are ready.
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Enter your email to unlock your personalized therapeutic archetype and recommendations.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (gateEmail.includes("@")) setEmailGated(true); }} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: "0.7rem 1rem",
                  borderRadius: "4px",
                  border: "1px solid rgba(212,185,106,0.3)",
                  background: "rgba(255,255,255,0.05)",
                  color: "#2C1810",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
              <button type="submit" style={{
                padding: "0.7rem 1.5rem",
                background: "#D4B96A",
                color: "#0A0A10",
                border: "none",
                borderRadius: "4px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}>UNLOCK</button>
            </form>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.3)", marginTop: "0.8rem" }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      )}

      {phase === "results" && emailGated && (
        <div
          style={{
            minHeight: "100vh",
            padding: "4rem 1.5rem",
            position: "relative",
            zIndex: 1,
            opacity: resultsFadeIn ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Back link */}
            <div style={{ marginBottom: "2rem" }}>
              <Link href="/find-my" style={{ textDecoration: "none" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(212,185,106,0.4)", cursor: "pointer" }}>
                  ← BACK TO FIND MY
                </span>
              </Link>
            </div>

            {/* Eyebrow */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", textAlign: "center", marginBottom: "1rem" }}>
              Your Therapeutic Archetype
            </div>

            {/* Modality name */}
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, textAlign: "center", marginBottom: "0.5rem", color: "#8B6914" }}>
              {modality.name}
            </h1>

            {/* Tagline */}
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontStyle: "italic", textAlign: "center", color: "rgba(232,228,220,0.6)", maxWidth: 500, margin: "0 auto 3rem" }}>
              {modality.tagline}
            </p>

            {/* Radar + Description */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
              <GlassPanel style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RadarChart scores={dimensionScores} />
              </GlassPanel>

              <GlassPanel style={{ padding: "2rem" }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(232,228,220,0.75)" }}>
                  {modality.description}
                </p>
                <div style={{ marginTop: "1.5rem" }}>
                  {Object.entries(dimensionScores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dim, score]) => (
                      <div key={dim} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(212,185,106,0.5)", width: 80, textAlign: "right" }}>
                          {DIMENSION_LABELS[dim]}
                        </span>
                        <div style={{ flex: 1, height: 4, background: "rgba(212,185,106,0.1)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${score * 10}%`, background: "linear-gradient(90deg, #8B6914, #D4B96A)", borderRadius: 2, transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#8B6914", width: 30 }}>
                          {score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </GlassPanel>
            </div>

            {/* How It Works */}
            <GlassPanel style={{ padding: "2.5rem", marginBottom: "2rem", borderLeft: "2px solid rgba(212,185,106,0.3)" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,185,106,0.6)", marginBottom: "1rem" }}>
                How It Works
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(232,228,220,0.7)" }}>
                {modality.howItWorks}
              </p>
            </GlassPanel>

            {/* Best For / Not Ideal For */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
              <GlassPanel style={{ padding: "2rem" }}>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(123,201,164,0.7)", marginBottom: "1rem" }}>
                  Best For
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {modality.bestFor.map((item, i) => (
                    <li key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(232,228,220,0.6)", marginBottom: "0.5rem", paddingLeft: "1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "rgba(123,201,164,0.5)" }}>+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel style={{ padding: "2rem" }}>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,123,123,0.7)", marginBottom: "1rem" }}>
                  Consider Other Approaches If
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {modality.notIdealFor.map((item, i) => (
                    <li key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(232,228,220,0.6)", marginBottom: "0.5rem", paddingLeft: "1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "rgba(201,123,123,0.5)" }}>~</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </div>

            {/* Pioneers */}
            <GlassPanel style={{ padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", marginBottom: "1rem" }}>
                Pioneers of This Approach
              </h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
                {modality.pioneers.map((name) => (
                  <span key={name} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: "rgba(232,228,220,0.6)" }}>
                    {name}
                  </span>
                ))}
              </div>
            </GlassPanel>

            {/* Resources */}
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", marginBottom: "1.5rem" }}>
                Go Deeper
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {modality.resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <GlassPanel
                      className="choice-btn"
                      style={{
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#8B6914" }}>
                        {resource.title}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,185,106,0.4)", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "4px", padding: "2px 8px" }}>
                        {resource.type}
                      </span>
                    </GlassPanel>
                  </a>
                ))}
              </div>
            </div>

            {/* Share */}
            <GlassPanel style={{ padding: "2rem", textAlign: "center", marginBottom: "3rem", animation: "pulseGlow 3s ease infinite" }}>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#8B6914", marginBottom: "0.5rem" }}>
                Share your archetype. Start a conversation.
              </p>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.5)", marginBottom: "1.5rem" }}>
                The people who need this most won't search for it. Send it to them.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { platform: "twitter", label: "𝕏" },
                  { platform: "linkedin", label: "in" },
                  { platform: "email", label: "✉" },
                  { platform: "copy", label: "⎘" },
                ].map(({ platform, label }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "rgba(212,185,106,0.1)",
                      border: "1px solid rgba(139,105,20,0.2)",
                      color: "#8B6914",
                      fontSize: "1rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(212,185,106,0.25)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "rgba(212,185,106,0.1)"; }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {shareCount > 0 && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(212,185,106,0.4)", marginTop: "1rem" }}>
                  Shared {shareCount} time{shareCount > 1 ? "s" : ""}
                </p>
              )}
            </GlassPanel>

            {/* Also explore */}
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", marginBottom: "1.5rem" }}>
                Also Worth Exploring
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {modality.relatedModalities.map((relId) => {
                  const rel = MODALITIES.find((m) => m.id === relId);
                  if (!rel) return null;
                  return (
                    <GlassPanel
                      key={relId}
                      className="choice-btn"
                      style={{ padding: "1.25rem", cursor: "pointer" }}
                    >
                      <div
                        onClick={handleRestart}
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1rem", color: "#8B6914", marginBottom: "0.3rem" }}>
                          {rel.name}
                        </div>
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "rgba(232,228,220,0.4)", lineHeight: 1.4 }}>
                          {rel.tagline}
                        </div>
                      </div>
                    </GlassPanel>
                  );
                })}
              </div>
            </div>

            {/* ── JOURNEY PROGRESS TRACKER ── */}
            <div style={{ marginBottom: "2rem" }}>
              <JourneyTracker variant="dark" currentAssessmentId="find-your-therapy" />
            </div>

            {/* ── JOURNEY FLOW: Continue Your Discovery ── */}
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", marginBottom: "0.5rem", textAlign: "center" }}>
                The Journey Continues
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.4)", textAlign: "center", marginBottom: "2rem", lineHeight: 1.6 }}>
                You've mapped your therapeutic wiring. Now go deeper into the dimensions that shape it.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
                {[
                  { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions and 22 traditions.", url: "https://findmyassess-9eekxcob.manus.space/find-my-spirituality", badge: "35 Questions" },
                  { name: "Find Your Religion", hook: "Attachment, communication, values, emotional intelligence — mapped.", url: "https://findmyassess-9eekxcob.manus.space/find-my-religion", badge: "15 Questions" },
                  { name: "Find My", hook: "5 questions that reveal which dimension of life is pulling you hardest.", url: "/find-my", badge: "5 Questions" },
                  { name: "Find Your Purpose", hook: "The Dharma Finder — what you can't stop doing, even when nobody's paying.", url: "/assessments/dharma-finder", badge: "25 Questions" },
                  { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/assessments/consciousness-scale", badge: "25 Questions" },
                  { name: "Find Your Mirror", hook: "A radar chart that doesn't care about your feelings.", url: "/the-mirror", badge: "18 Questions" },
                ].map((next) => (
                  <a
                    key={next.name}
                    href={next.url}
                    style={{ textDecoration: "none" }}
                  >
                    <GlassPanel
                      className="choice-btn"
                      style={{ padding: "1.25rem", cursor: "pointer", height: "100%" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "0.95rem", color: "#8B6914" }}>
                          {next.name}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(212,185,106,0.5)", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "4px", padding: "2px 6px", whiteSpace: "nowrap" }}>
                          {next.badge}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "rgba(232,228,220,0.4)", lineHeight: 1.5, margin: 0 }}>
                        {next.hook}
                      </p>
                    </GlassPanel>
                  </a>
                ))}
              </div>
            </div>

          <WhatsNext />
            {/* Retake + Ecosystem */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleRestart}
                style={{
                  background: "none",
                  border: "1px solid rgba(139,105,20,0.2)",
                  borderRadius: "8px",
                  padding: "0.75rem 2rem",
                  color: "rgba(212,185,106,0.6)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(212,185,106,0.5)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(212,185,106,0.2)"; }}
              >
                Retake Assessment
              </button>

            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="therapy"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ archetype: modality.name, scores: dimensionScores })}
              totalScore={null}
            />

              <div style={{ marginTop: "1rem" }}>
                <Link href="/find-my" style={{ textDecoration: "none" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(212,185,106,0.4)", cursor: "pointer" }}>
                    Explore the full Find Your ___ ecosystem →
                  </span>
                </Link>
              </div>

              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(212,185,106,0.2)", marginTop: "3rem" }}>
                NOT MEDICAL ADVICE · FOR SELF-EXPLORATION ONLY · CONSULT A LICENSED PROFESSIONAL
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
