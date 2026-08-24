// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import JourneyTracker, { useJourneyProgress } from '@/components/JourneyTracker';
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const ASSESSMENT_ID = 'find-your-sleep';
const LOCAL_STORAGE_KEY = 'sleep_results';

const dimensions = [
  'Circadian Alignment',
  'Sleep Architecture',
  'Dream Quality',
  'Recovery Depth',
  'Environment Sensitivity',
  'Wind-Down Ritual',
];

const questions = [
  {
    question: "When do you feel most naturally alert and energetic?",
    options: [
      { text: "Early morning, as the sun rises.", scores: { "Circadian Alignment": 2 } },
      { text: "Mid-day, after I've had some time to wake up.", scores: { "Circadian Alignment": 1 } },
      { text: "Late afternoon or early evening.", scores: { "Circadian Alignment": -1 } },
      { text: "Late at night, when the world is quiet.", scores: { "Circadian Alignment": -2 } }
    ]
  },
  {
    question: "How would you describe your typical night's sleep?",
    options: [
      { text: "Deep and uninterrupted.", scores: { "Sleep Architecture": 2, "Recovery Depth": 1 } },
      { text: "I wake up a few times, but fall back asleep easily.", scores: { "Sleep Architecture": -1 } },
      { text: "Restless and light; I toss and turn a lot.", scores: { "Sleep Architecture": -2, "Recovery Depth": -1 } },
      { text: "A wild ride of vivid dreams.", scores: { "Dream Quality": 2 } }
    ]
  },
  {
    question: "How often do you remember your dreams?",
    options: [
      { text: "Almost every night, in vivid detail.", scores: { "Dream Quality": 2 } },
      { text: "Frequently, but the details are often hazy.", scores: { "Dream Quality": 1 } },
      { text: "Occasionally, maybe once or twice a week.", scores: { "Dream Quality": -1 } },
      { text: "Rarely, if ever.", scores: { "Dream Quality": -2 } }
    ]
  },
  {
    question: "How do you feel upon waking up most mornings?",
    options: [
      { text: "Refreshed, energized, and ready for the day.", scores: { "Recovery Depth": 2 } },
      { text: "Generally okay, but I need coffee to get started.", scores: { "Recovery Depth": 1 } },
      { text: "Slightly groggy and slow to start.", scores: { "Recovery Depth": -1 } },
      { text: "Tired, as if I haven't slept at all.", scores: { "Recovery Depth": -2 } }
    ]
  },
  {
    question: "How sensitive are you to your sleep environment (light, noise, temperature)?",
    options: [
      { text: "Extremely sensitive. Everything needs to be perfect.", scores: { "Environment Sensitivity": 2 } },
      { text: "Moderately sensitive. Minor disturbances can wake me.", scores: { "Environment Sensitivity": 1 } },
      { text: "Not very sensitive. I can sleep through most things.", scores: { "Environment Sensitivity": -1 } },
      { text: "I could sleep through a rock concert.", scores: { "Environment Sensitivity": -2 } }
    ]
  },
  {
    question: "What does your hour before bed typically look like?",
    options: [
      { text: "A consistent, relaxing routine: reading, stretching, etc.", scores: { "Wind-Down Ritual": 2 } },
      { text: "I try to wind down, but often get distracted by screens.", scores: { "Wind-Down Ritual": -1 } },
      { text: "It varies wildly depending on the day.", scores: { "Wind-Down Ritual": -1 } },
      { text: "Working or watching stimulating TV until the last minute.", scores: { "Wind-Down Ritual": -2 } }
    ]
  },
  {
    question: "Do you use any aids to help you sleep (e.g., meditation, white noise, supplements)?",
    options: [
      { text: "Yes, I have a well-established meditation or mindfulness practice.", scores: { "Wind-Down Ritual": 2 } },
      { text: "I use a white noise machine or app.", scores: { "Environment Sensitivity": 1 } },
      { text: "Occasionally, I'll take something like melatonin.", scores: { "Sleep Architecture": 1 } },
      { text: "No, I just try to power through.", scores: { "Wind-Down Ritual": -1 } }
    ]
  },
  {
    question: "How do you feel about napping?",
    options: [
      { text: "I love a good power nap; it's a key part of my routine.", scores: { "Circadian Alignment": 1, "Sleep Architecture": 1 } },
      { text: "I nap occasionally on weekends.", scores: { "Circadian Alignment": 0 } },
      { text: "Naps make me feel groggy and worse off.", scores: { "Sleep Architecture": -1 } },
      { text: "I never have time to nap.", scores: { "Circadian Alignment": -1 } }
    ]
  },
  {
    question: "The content of your dreams is typically...",
    options: [
      { text: "Creative, bizarre, and story-like.", scores: { "Dream Quality": 2 } },
      { text: "Related to my daily life and anxieties.", scores: { "Dream Quality": -1, "Recovery Depth": -1 } },
      { text: "Mostly positive and pleasant.", scores: { "Dream Quality": 1 } },
      { text: "I don't remember them enough to say.", scores: { "Dream Quality": 0 } }
    ]
  },
  {
    question: "How consistent is your sleep schedule, even on weekends?",
    options: [
      { text: "Very consistent. I go to bed and wake up at the same time every day.", scores: { "Circadian Alignment": 2 } },
      { text: "Fairly consistent, but I allow for some flexibility on weekends.", scores: { "Circadian Alignment": 1 } },
      { text: "It's a bit chaotic; my schedule is all over the place.", scores: { "Circadian Alignment": -2 } },
      { text: "I have a different schedule for weekdays and weekends.", scores: { "Circadian Alignment": -1 } }
    ]
  },
  {
    question: "How important is a cool, dark, and quiet room for your sleep?",
    options: [
      { text: "Absolutely essential. I've optimized my bedroom for it.", scores: { "Environment Sensitivity": 2 } },
      { text: "Very important, but I can manage without it for a night or two.", scores: { "Environment Sensitivity": 1 } },
      { text: "It helps, but it's not a deal-breaker.", scores: { "Environment Sensitivity": -1 } },
      { text: "I don't really notice a difference.", scores: { "Environment Sensitivity": -2 } }
    ]
  },
  {
    question: "How long does it typically take you to fall asleep?",
    options: [
      { text: "Less than 15 minutes.", scores: { "Sleep Architecture": 2 } },
      { text: "15-30 minutes.", scores: { "Sleep Architecture": 1 } },
      { text: "30-60 minutes.", scores: { "Sleep Architecture": -1 } },
      { text: "More than an hour.", scores: { "Sleep Architecture": -2 } }
    ]
  },
  {
    question: "Do you feel your sleep quality has a significant impact on your mood and productivity?",
    options: [
      { text: "Absolutely, it's the foundation of my well-being.", scores: { "Recovery Depth": 2 } },
      { text: "Yes, a bad night's sleep definitely affects me.", scores: { "Recovery Depth": 1 } },
      { text: "Somewhat, but I can usually push through.", scores: { "Recovery Depth": -1 } },
      { text: "Not really, I seem to function the same regardless.", scores: { "Recovery Depth": -2 } }
    ]
  },
  {
    question: "Which statement best describes your relationship with technology before bed?",
    options: [
      { text: "I have a strict 'no screens' rule for at least an hour before sleep.", scores: { "Wind-Down Ritual": 2 } },
      { text: "I use blue-light filters and try to limit my usage.", scores: { "Wind-Down Ritual": 1 } },
      { text: "I often fall asleep while scrolling on my phone or watching something.", scores: { "Wind-Down Ritual": -2 } },
      { text: "I need it to help me fall asleep, like listening to a podcast.", scores: { "Wind-Down Ritual": -1, "Environment Sensitivity": 1 } }
    ]
  },
  {
    question: "If you wake up in the middle of the night, what is your typical reaction?",
    options: [
      { text: "I practice a breathing exercise or meditation to fall back asleep.", scores: { "Wind-Down Ritual": 2, "Sleep Architecture": 1 } },
      { text: "I lie in bed and try to force myself back to sleep, often getting frustrated.", scores: { "Sleep Architecture": -2 } },
      { text: "I get up for a little while and do something relaxing until I feel sleepy again.", scores: { "Sleep Architecture": 1 } },
      { text: "I check my phone.", scores: { "Wind-Down Ritual": -2 } }
    ]
  }
];

const archetypes = {
  'The Dawn Walker': 'You are an early chronotype, naturally rising with the sun and finding your peak energy in the morning. Your internal clock is well-aligned with the natural light-dark cycle.',
  'The Night Architect': 'You are a late chronotype, a classic "night owl" who finds their peak creativity and energy in the evening hours. Your internal clock is shifted later in the day.',
  'The Power Napper': 'You thrive on polyphasic sleep, leveraging short, strategic bursts of rest to maintain high performance throughout the day. Your sleep is flexible and efficient.',
  'The Deep Diver': 'Your sleep is dominated by deep, restorative slow-wave stages. You wake up feeling profoundly refreshed, having given your body the ultimate recovery time.',
  'The Dream Weaver': 'You experience a rich and vivid dream life, indicating a dominance of REM sleep. Your mind is a canvas for creative, emotional, and memory-processing work during the night.',
  'The Zen Sleeper': 'Your sleep quality is deeply connected to your state of mind. You have mastered the art of the wind-down, using mindfulness and relaxation to pave the way for peaceful rest.',
};

const calculateArchetype = (scores) => {
  const primaryDimension = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

  if (scores['Circadian Alignment'] >= 3) return 'The Dawn Walker';
  if (scores['Circadian Alignment'] <= -3) return 'The Night Architect';
  if (scores['Wind-Down Ritual'] >= 4) return 'The Zen Sleeper';
  if (scores['Dream Quality'] >= 4) return 'The Dream Weaver';
  if (scores['Recovery Depth'] >= 4) return 'The Deep Diver';
  if (scores['Sleep Architecture'] >= 3 && scores['Circadian Alignment'] >= 1) return 'The Power Napper';

  // Fallback based on highest score
  switch (primaryDimension) {
    case 'Circadian Alignment': return scores['Circadian Alignment'] > 0 ? 'The Dawn Walker' : 'The Night Architect';
    case 'Sleep Architecture': return 'The Power Napper';
    case 'Dream Quality': return 'The Dream Weaver';
    case 'Recovery Depth': return 'The Deep Diver';
    case 'Wind-Down Ritual': return 'The Zen Sleeper';
    default: return 'The Zen Sleeper';
  }
};

const RadarChart = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const radius = center - 30;
  const angleSlice = (Math.PI * 2) / dimensions.length;

  const maxScore = 8; // Estimated max possible score for a dimension

  const points = dimensions.map((dim, i) => {
    const score = scores[dim] || 0;
    const normalizedScore = Math.max(0, score + maxScore / 2) / maxScore; // Normalize score to 0-1 range
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * normalizedScore * Math.cos(angle);
    const y = center + radius * normalizedScore * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const axisPoints = dimensions.map((dim, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, label: dim };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        {/* Concentric circles */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={radius * r}
            fill="none"
            stroke="#D4B96A"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        ))}
        {/* Axes */}
        {axisPoints.map((p, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#D4B96A"
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />
        ))}
        {/* Labels */}
        {axisPoints.map((p, i) => (
          <text
            key={i}
            x={center + (radius + 10) * Math.cos(angleSlice * i - Math.PI / 2)}
            y={center + (radius + 10) * Math.sin(angleSlice * i - Math.PI / 2)}
            fill="#D4B96A"
            fontSize="10"
            fontFamily="DM Mono"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {p.label}
          </text>
        ))}
        {/* Data Polygon */}
        <polygon points={points} fill="#D4B96A" fillOpacity="0.6" stroke="#D4B96A" strokeWidth="2" />
      </g>
    </svg>
  );
};

const FindYourSleep = () => {
  const [phase, setPhase] = useState('landing');
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState(dimensions.reduce((acc, dim) => ({ ...acc, [dim]: 0 }), {}));
  const { markComplete } = useJourneyProgress();

  const archetype = useMemo(() => calculateArchetype(scores), [scores]);

  useEffect(() => {
    if (phase === 'results') {
      markComplete(ASSESSMENT_ID);
      const resultData = {
        archetype,
        scores,
        dimensions,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resultData));
    }
  }, [phase, archetype, scores, markComplete]);

  const handleAnswer = (optionScores) => {
    const newScores = { ...scores };
    for (const dim in optionScores) {
      newScores[dim] = (newScores[dim] || 0) + optionScores[dim];
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setPhase('results');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  return (
    <>
    <SEO
        title="Find Your Sleep"
        description="A personalized sleep assessment to optimize your sleep for your chronotype and lifestyle."
        path="/find-my/sleep"
        keywords="Tony Greenberg, find my sleep, sleep assessment, sleep optimization, chronotype"
        indexable={true}
      />
      <>
    <ThemedBackground theme="sleep" />
    <div style={{ backgroundColor: 'transparent', color: '#2C1810', position: 'relative', zIndex: 1, fontFamily: 'Source Sans 3', minHeight: '100vh' }}>
      <JourneyTracker variant="light" />
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Sleep"
          subtitle="The night knows things the day refuses to admit."
          description="Your sleep architecture is as unique as your fingerprint. This assessment maps your chronotype, sleep environment needs, dream patterns, wind-down rituals, and the hidden anxieties that keep you staring at the ceiling. Fifteen questions to decode your relationship with the dark."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your sleep archetype and chronotype profile","A map of your sleep dimensions","Personalized sleep environment recommendations","Insight into your circadian rhythm patterns"]}
          accentColor="#7E57C2"
          onBegin={() => setPhase('questions')}
        />
      )}
      {phase === 'questions' && (
        <div style={{ padding: 'clamp(3rem, 5vw, 4rem) 2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'DM Mono', color: '#8B6914', marginBottom: '0.5rem' }}>Question {currentQuestionIndex + 1} of {questions.length}</div>
            <div style={{ backgroundColor: 'rgba(139,105,20,0.15)', height: '4px', width: '100%' }}>
              <div style={{ backgroundColor: '#D4B96A', height: '4px', width: `${progress}%`, transition: 'width 0.5s ease' }}></div>
            </div>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '3rem' }}>{currentQuestion.question}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {currentQuestion.options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(option.scores)} 
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(139,105,20,0.3)',
                  color: '#2C1810',
                  padding: '1.5rem',
                  textAlign: 'left',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#D4B96A20'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === 'results' && !emailGated && (
            <EmailGate assessmentName="sleep" onUnlock={() => setEmailGated(true)} />
          )}

          {phase === 'results' && emailGated && (
        <div style={{ padding: 'clamp(4rem, 6vw, 6rem) 2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'DM Mono', color: '#8B6914', fontSize: '1.2rem', marginBottom: '1rem' }}>Your Sleep Archetype is...</h2>
          <h1 style={{ fontFamily: 'Playfair Display', color: '#8B6914', fontSize: '5rem', marginBottom: '1rem' }}>{archetype}</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>{archetypes[archetype]}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <RadarChart scores={scores} />
            <div style={{ textAlign: 'left', fontFamily: 'DM Mono', fontSize: '1rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display', color: '#8B6914', marginBottom: '1rem' }}>Dimension Scores</h3>
              {dimensions.map(dim => (
                <div key={dim} style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#8B6914' }}>{dim}:</span> {scores[dim]}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '4rem', borderTop: '1px solid #D4B96A40', paddingTop: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: '#8B6914', marginBottom: '1.5rem' }}>The Journey Continues</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <a href="/find-your-diet" style={{ color: '#2C1810', textDecoration: 'none', border: '1px solid rgba(139,105,20,0.3)', padding: '0.75rem 1.5rem', fontFamily: 'DM Mono' }}>Find Your Diet</a>
              <a href="/find-my" style={{ color: '#2C1810', textDecoration: 'none', border: '1px solid rgba(139,105,20,0.3)', padding: '0.75rem 1.5rem', fontFamily: 'DM Mono' }}>Find Your Focus</a>
              <a href="/find-my" style={{ color: '#2C1810', textDecoration: 'none', border: '1px solid rgba(139,105,20,0.3)', padding: '0.75rem 1.5rem', fontFamily: 'DM Mono' }}>Find Your Flow</a>
            </div>
          </div>
        </div>
      )}
          <WhatsNext />
    </div>
    </>
    </>);
};

export default FindYourSleep;
