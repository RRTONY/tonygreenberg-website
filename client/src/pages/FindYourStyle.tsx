// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

// Style constants
const colors = {
  background: 'transparent', position: 'relative', zIndex: 1,
  gold: '#D4B96A',
  text: '#E8E4DC',
  textMuted: '#A09C94',
  border: '#2A2A30',
};

const fonts = {
  heading: "'Playfair Display', serif",
  body: "'Source Sans 3', sans-serif",
  label: "'DM Mono', monospace",
};

// Data structures
const dimensions = [
  { id: 'silhouette', name: 'Silhouette' },
  { id: 'colorPhilosophy', name: 'Color Philosophy' },
  { id: 'textureSensitivity', name: 'Texture Sensitivity' },
  { id: 'culturalReference', name: 'Cultural Reference' },
  { id: 'sustainability', name: 'Sustainability' },
  { id: 'selfExpression', name: 'Self-Expression' },
];

const archetypes = {
  minimalist: { name: "The Minimalist", description: "Purity of form, clarity of purpose. You appreciate clean lines, muted palettes, and the power of reduction." },
  maximalist: { name: "The Maximalist", description: "More is more. Life is a canvas, and you paint it with bold colors, vibrant patterns, and expressive layers." },
  vintageCurator: { name: "The Vintage Curator", description: "Every piece tells a story. You are drawn to the history, craftsmanship, and soul of secondhand and heritage garments." },
  streetwearArchitect: { name: "The Streetwear Architect", description: "The city is your runway. You build your identity from the ground up with iconic brands, cultural codes, and urban functionality." },
  tailoredClassic: { name: "The Tailored Classic", description: "Enduring elegance, crafted to last. You invest in timeless silhouettes, impeccable tailoring, and the quiet confidence of quality." },
  avantGarde: { name: "The Avant-Garde", description: "Dress to challenge, not to conform. You use clothing as a medium for artistic experimentation, pushing boundaries of form and function." },
};

const questions = [
  {
    question: "When you enter a clothing store, what are you first drawn to?",
    options: [
      { text: "The overall color story and palette.", scores: { colorPhilosophy: 2 } },
      { text: "The unique shapes and cuts of the garments.", scores: { silhouette: 2 } },
      { text: "The feel of the fabrics on the rack.", scores: { textureSensitivity: 2 } },
      { text: "Pieces that evoke a specific era or film.", scores: { culturalReference: 2 } },
    ],
  },
  {
    question: "Your ideal weekend outfit is...",
    options: [
        { text: "Perfectly tailored trousers and a crisp shirt.", scores: { silhouette: 1, sustainability: 1 } },
        { text: "A rare band t-shirt and worn-in jeans.", scores: { culturalReference: 2, sustainability: 1 } },
        { text: "A deconstructed jacket that plays with proportion.", scores: { selfExpression: 2, silhouette: 1 } },
        { text: "A monochrome sweatsuit in luxurious cotton.", scores: { textureSensitivity: 1, colorPhilosophy: -1 } },
    ],
  },
  {
    question: "How do you approach color in your wardrobe?",
    options: [
      { text: "A strict, curated palette of neutrals.", scores: { colorPhilosophy: -2, silhouette: 1 } },
      { text: "Bold, unexpected color combinations.", scores: { colorPhilosophy: 2, selfExpression: 1 } },
      { text: "Colors with a vintage or faded quality.", scores: { culturalReference: 1, sustainability: 1 } },
      { text: "Color is secondary to texture and material.", scores: { textureSensitivity: 2, colorPhilosophy: -1 } },
    ],
  },
    {
    question: "The most important factor when buying a new piece is...",
    options: [
      { text: "Will I be able to wear this in 10 years?", scores: { sustainability: 2 } },
      { text: "Does this piece feel like a work of art?", scores: { selfExpression: 2 } },
      { text: "Is it made from a natural, interesting material?", scores: { textureSensitivity: 2 } },
      { text: "Does it fit a specific aesthetic I love?", scores: { culturalReference: 2 } },
    ],
  },
  {
    question: "A friend asks for your style advice. You tell them...",
    options: [
      { text: "'Invest in classics. Quality over quantity.'", scores: { sustainability: 2, silhouette: 1 } },
      { text: "'Don't be afraid to clash patterns and colors.'", scores: { selfExpression: 1, colorPhilosophy: 2 } },
      { text: "'Your clothes should be a conversation starter.'", scores: { selfExpression: 2 } },
      { text: "'Find a uniform and perfect it.'", scores: { silhouette: 2, colorPhilosophy: -1 } },
    ],
  },
  {
    question: "Which accessory resonates most with you?",
    options: [
      { text: "A single, beautifully crafted leather belt.", scores: { silhouette: 1, sustainability: 1 } },
      { text: "A stack of mismatched, colorful bracelets.", scores: { colorPhilosophy: 1, selfExpression: 1 } },
      { text: "A vintage silk scarf with a story.", scores: { culturalReference: 2, sustainability: 1 } },
      { text: "An architecturally interesting piece of jewelry.", scores: { silhouette: 2, selfExpression: 1 } },
    ],
  },
  {
    question: "Your closet is organized by...",
    options: [
      { text: "Color, creating a visual rainbow.", scores: { colorPhilosophy: 2 } },
      { text: "Garment type, then by neutral shade.", scores: { silhouette: 1 } },
      { text: "Era or aesthetic.", scores: { culturalReference: 2 } },
      { text: "It's a creative chaos I understand.", scores: { selfExpression: 1 } },
    ],
  },
  {
    question: "What's your opinion on logos?",
    options: [
      { text: "I prefer them to be invisible or non-existent.", scores: { silhouette: 1 } },
      { text: "I appreciate them as part of a design's history.", scores: { culturalReference: 1, selfExpression: 1 } },
      { text: "I like them big and bold, as a graphic element.", scores: { colorPhilosophy: 1, selfExpression: 1 } },
      { text: "The only name that matters is the tailor's.", scores: { sustainability: 1, silhouette: 1 } },
    ],
  },
  {
    question: "The texture you love most is...",
    options: [
      { text: "Smooth, crisp, cool-to-the-touch cotton.", scores: { textureSensitivity: 2, silhouette: 1 } },
      { text: "Chunky, hand-knit wool or complex jacquard.", scores: { textureSensitivity: 2, colorPhilosophy: 1 } },
      { text: "Soft, worn-in denim or buttery, aged leather.", scores: { sustainability: 2, culturalReference: 1 } },
      { text: "Unconventional materials like neoprene or vinyl.", scores: { selfExpression: 2, silhouette: 1 } },
    ],
  },
  {
    question: "When you think of an 'investment piece,' you think of...",
    options: [
      { text: "A perfectly tailored wool coat.", scores: { sustainability: 2, silhouette: 2 } },
      { text: "A rare, archival designer piece.", scores: { culturalReference: 2, sustainability: 1 } },
      { text: "A piece of wearable art from a new designer.", scores: { selfExpression: 2 } },
      { text: "The most comfortable, high-quality cashmere.", scores: { textureSensitivity: 2 } },
    ],
  },
  {
    question: "Your style icon is likely...",
    options: [
      { text: "An old Hollywood star or a historical figure.", scores: { culturalReference: 2 } },
      { text: "A modern artist or architect.", scores: { selfExpression: 2 } },
      { text: "A fashion editor known for timeless taste.", scores: { silhouette: 2 } },
      { text: "Someone anonymous who looks amazing.", scores: { selfExpression: 1 } },
    ],
  },
  {
    question: "How do you feel about trends?",
    options: [
      { text: "I follow them and enjoy interpreting them.", scores: { culturalReference: 1, selfExpression: 1 } },
      { text: "I'm more interested in timeless pieces.", scores: { sustainability: 2, silhouette: 1 } },
      { text: "I'm usually ahead of them or ignoring them.", scores: { selfExpression: 2 } },
      { text: "I prefer styles from the past over what's current.", scores: { culturalReference: 2, sustainability: 1 } },
    ],
  },
  {
    question: "The silhouette that appeals most is...",
    options: [
      { text: "Sharp, clean lines and structured shapes.", scores: { silhouette: 2 } },
      { text: "Flowing, draped, and voluminous.", scores: { silhouette: 1, selfExpression: 1 } },
      { text: "Asymmetrical, deconstructed, and unexpected.", scores: { silhouette: 2, selfExpression: 2 } },
      { text: "A comfortable, functional, utilitarian shape.", scores: { silhouette: 1, sustainability: 1 } },
    ],
  },
  {
    question: "You're shopping for a special occasion. You choose...",
    options: [
      { text: "A stunning vintage gown no one else will have.", scores: { culturalReference: 2, sustainability: 2 } },
      { text: "A sleek, minimalist jumpsuit in a bold color.", scores: { silhouette: 2, colorPhilosophy: 1 } },
      { text: "A custom-tailored suit that fits like a glove.", scores: { silhouette: 2, sustainability: 1 } },
      { text: "A riot of color, pattern, and texture.", scores: { colorPhilosophy: 2, selfExpression: 2 } },
    ],
  },
  {
    question: "Your philosophy on getting dressed is:",
    options: [
      { text: "'Less is more.'", scores: { silhouette: 1, colorPhilosophy: -1 } },
      { text: "'Dress for the job you want.'", scores: { silhouette: 1, sustainability: 1 } },
      { text: "'Why blend in when you were born to stand out?'", scores: { selfExpression: 2, colorPhilosophy: 1 } },
      { text: "'My clothes are my armor and my biography.'", scores: { culturalReference: 2, selfExpression: 1 } },
    ],
  },
];

const RadarChart = ({ scores, dimensions }) => {
  const size = 300;
  const center = size / 2;
  const maxScore = 10; // Assuming a max score to normalize

  const points = dimensions.map((dim, i) => {
    const score = scores[dim.id] || 0;
    const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
    const radius = (score / maxScore) * (center - 20);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axisPoints = dimensions.map((dim, i) => {
    const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
    const x = center + (center - 20) * Math.cos(angle);
    const y = center + (center - 20) * Math.sin(angle);
    return { x, y, label: dim.name };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: 'auto' }}>
      <polygon points={points} fill={colors.gold + '40'} stroke={colors.gold} strokeWidth="2" />
      {axisPoints.map((point, i) => (
        <g key={i}>
          <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={colors.border} strokeWidth="1" />
          <text x={point.x + (point.x > center ? 10 : -10)} y={point.y + 5} fill={colors.textMuted} fontSize="10" textAnchor={point.x > center ? 'start' : 'end'} style={{ fontFamily: fonts.label }}>{point.label}</text>
        </g>
      ))}
    </svg>
  );
};

export default function FindYourStyle() {
  const [phase, setPhase] = useState('landing');
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ silhouette: 0, colorPhilosophy: 0, textureSensitivity: 0, culturalReference: 0, sustainability: 0, selfExpression: 0 });
  const { markComplete } = useJourneyProgress();

  const handleBegin = () => setPhase('questions');

  const handleAnswer = (answerScores) => {
    const newScores = { ...scores };
    for (const dim in answerScores) {
      newScores[dim] = (newScores[dim] || 0) + answerScores[dim];
    }
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setPhase('results');
    }
  };

  const resultArchetype = useMemo(() => {
    if (phase !== 'results') return null;

    const scoreEntries = Object.entries(scores);
    if (scoreEntries.length === 0) return archetypes.minimalist; // Default

    // Simple mapping for demonstration
    if (scores.silhouette > 5 && scores.sustainability > 4) return archetypes.tailoredClassic;
    if (scores.culturalReference > 5 && scores.sustainability > 4) return archetypes.vintageCurator;
    if (scores.selfExpression > 5 && scores.silhouette > 4) return archetypes.avantGarde;
    if (scores.colorPhilosophy > 4 && scores.selfExpression > 4) return archetypes.maximalist;
    if (scores.culturalReference > 4 && scores.selfExpression > 3) return archetypes.streetwearArchitect;
    
    return archetypes.minimalist;

  }, [phase, scores]);

  useEffect(() => {
    if (phase === 'results' && resultArchetype) {
      markComplete("find-your-style");
      const resultData = {
        archetype: resultArchetype.name,
        scores,
        dimensions,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('style_results', JSON.stringify(resultData));
    }
  }, [phase, resultArchetype, markComplete, scores]);

  const containerStyle = {
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: fonts.body,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2rem',
  };

  const buttonStyle = {
    background: colors.gold,
    color: colors.background,
    fontFamily: fonts.label,
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  return (
    <>
    <SEO
        title="Find Your Style"
        description="Discover your personal style and the aesthetic that authentically represents you."
        path="/find-my/style"
        keywords="Tony Greenberg, find my style, personal style, style assessment"
        indexable={true}
      />
      <>
    <ThemedBackground theme="style" />
    <div style={containerStyle}>
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Style"
          subtitle="Style isn't what you wear. It's what you can't hide."
          description="Beyond trends, beyond brands, beyond what the algorithm thinks you should buy. This assessment maps your aesthetic identity across six dimensions — revealing the visual language that's authentically yours. Fifteen questions to find the style that was always there."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your style archetype and aesthetic DNA","A dimensional map of your visual identity","Understanding of your relationship with self-expression","Curated style direction that actually fits who you are"]}
          accentColor="#AD1457"
          onBegin={() => setPhase('questions')}
        />
      )}

      {phase === 'questions' && (
        <>
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', fontFamily: fonts.label, color: colors.textMuted }}>
            Question {currentQuestion + 1} / {questions.length}
          </div>
          <h2 style={{ fontFamily: fonts.heading, fontSize: '2.5rem', maxWidth: '800px' }}>{questions[currentQuestion].question}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem', width: '100%', maxWidth: '900px' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option.scores)} style={{
                background: 'none', 
                border: `1px solid ${colors.border}`,
                color: colors.text,
                padding: '2rem',
                textAlign: 'left',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }} onMouseOver={e => e.currentTarget.style.backgroundColor = colors.border} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                {option.text}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'results' && !emailGated && (
        <EmailGate assessmentName="style" onUnlock={() => setEmailGated(true)} />
      )}
      {phase === 'results' && emailGated && resultArchetype && (
        <>
          <h2 style={{ fontFamily: fonts.label, color: colors.textMuted, fontSize: '1rem' }}>Your Style Archetype is</h2>
          <h1 style={{ fontFamily: fonts.heading, fontSize: '5rem', color: colors.gold, margin: '0.5rem 0' }}>{resultArchetype.name}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', color: colors.textMuted, marginBottom: '3rem' }}>{resultArchetype.description}</p>
          
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
            <RadarChart scores={scores} dimensions={dimensions} />
            <div>
              <h3 style={{ fontFamily: fonts.heading, color: colors.gold, textAlign: 'left', marginBottom: '1rem' }}>Dimension Scores</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', fontFamily: fonts.label }}>
                {dimensions.map(dim => (
                  <li key={dim.id} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: colors.textMuted }}>{dim.name}:</span> {scores[dim.id] || 0}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '4rem', borderTop: `1px solid ${colors.border}`, paddingTop: '2rem' }}>
            <h3 style={{ fontFamily: fonts.heading, color: colors.gold }}>The Journey Continues</h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                <a href="/find-my" style={{ color: colors.textMuted, textDecoration: 'none' }}>Find Your Signature Scent</a>
                <a href="/find-my" style={{ color: colors.textMuted, textDecoration: 'none' }}>Find Your Perfect Pen</a>
                <a href="/find-my" style={{ color: colors.textMuted, textDecoration: 'none' }}>Find Your Ideal Workspace</a>
            </div>
          </div>
          <JourneyTracker />
        </>
      )}
          <WhatsNext />
    </div>
    </>
    </>);
}
