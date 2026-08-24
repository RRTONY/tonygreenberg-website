// @ts-nocheck
import React, { useState, useEffect } from 'react';
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const ASSESSMENT_ID = "find-your-attachment";
const LOCAL_STORAGE_KEY = "attachment_results";

const questions = [
  {
    question: "When a partner is distant, my immediate reaction is to...",
    options: [
      { text: "Give them space, trusting they'll return.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
      { text: "Feel a surge of anxiety and try to close the distance.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
      { text: "Retreat myself, feeling they don't really need me.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
      { text: "Feel a confusing mix of wanting them close and pushing them away.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "In moments of conflict, I tend to...",
    options: [
        { text: "Stay present and work towards a resolution.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Worry excessively about the relationship ending.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Shut down and withdraw to avoid more conflict.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Alternate between angry outbursts and fearful withdrawal.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "I believe that in a relationship, emotional intimacy is...",
    options: [
        { text: "A source of comfort and strength.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Something I crave, but I worry I want it more than my partner.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Often overwhelming and I prefer to keep some emotional distance.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Both deeply desired and frightening.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "When I think about my need for affection, I feel...",
    options: [
        { text: "Comfortable expressing my needs and receiving affection.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Anxious that my needs might be too much for others.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Independent and self-reliant, not needing much affection.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Confused; I want affection but also feel uncomfortable with it.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "A partner telling me they need space makes me feel...",
    options: [
        { text: "Understanding and I respect their need.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Rejected and fearful of abandonment.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Relieved, as I also value my independence.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Suspicious and worried, but I might not show it.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "My past relationships have often ended because...",
    options: [
        { text: "We grew apart, but the endings were generally amicable.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Of my intense emotional needs and fear of being left.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "I felt suffocated and needed more freedom.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "They were tumultuous and chaotic.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "When I am single, I generally feel...",
    options: [
        { text: "Content and open to a new relationship when the time is right.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Incomplete and anxious to find a partner.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Self-sufficient and comfortable on my own.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "A mix of loneliness and relief.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "Relying on a partner for support is...",
    options: [
        { text: "A natural part of a healthy relationship.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Something I do, but I worry about being a burden.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Difficult for me; I prefer to handle things myself.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Something I want, but I find it hard to trust.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "When a relationship gets serious, I feel...",
    options: [
        { text: "Excited and ready to build a future together.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "A mix of excitement and fear that it might not last.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "A need to pull back and maintain my independence.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Scared and may look for reasons to end it.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "My view of love is that it is...",
    options: [
        { text: "A partnership based on mutual respect and support.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "An all-consuming and sometimes painful experience.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Something that can compromise my freedom.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Often confusing and unpredictable.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "I express affection through...",
    options: [
        { text: "Words, actions, and physical touch comfortably.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Grand gestures, hoping to secure the relationship.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Practical acts of service more than emotional expression.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Inconsistent bursts of affection.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "When a partner is upset with me, I...",
    options: [
        { text: "Listen to their concerns and try to understand their perspective.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Immediately feel guilty and try to fix things, even if it's not my fault.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Feel criticized and withdraw to protect myself.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Can become defensive or blame them back.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "The thought of being vulnerable with a partner makes me feel...",
    options: [
        { text: "It's a necessary part of a deep connection.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Eager, but also terrified of being hurt.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Uncomfortable and I avoid it as much as possible.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Deeply conflicted; I want to but I can't seem to let my guard down.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "I believe my partner's role is to...",
    options: [
        { text: "Be a companion with whom I can share my life.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Complete me and make me feel whole.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Respect my independence and not make too many demands.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "I'm not sure what to expect from a partner.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "When I feel insecure in a relationship, I am most likely to...",
    options: [
        { text: "Communicate my feelings to my partner.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Seek constant reassurance from my partner.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Create distance to show that I am not needy.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Start a fight or act out to get a reaction.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "My ideal relationship provides a balance of...",
    options: [
        { text: "Intimacy and independence.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Constant connection and reassurance.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Personal space and autonomy.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Passion and drama, even if it's unstable.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "I handle my emotions in a relationship by...",
    options: [
        { text: "Processing them and expressing them constructively.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Feeling them very intensely and sometimes being overwhelmed by them.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Suppressing them to maintain peace and control.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Experiencing them in a chaotic and unpredictable way.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  },
  {
    question: "Reflecting on my childhood, my relationship with my caregivers was...",
    options: [
        { text: "Generally stable and supportive.", score: { security: 3, anxiety: 0, avoidance: 0, disorganization: 0 } },
        { text: "Inconsistent; sometimes they were available, sometimes not.", score: { security: 0, anxiety: 3, avoidance: 0, disorganization: 0 } },
        { text: "Emotionally distant or they encouraged self-reliance.", score: { security: 0, anxiety: 0, avoidance: 3, disorganization: 0 } },
        { text: "Frightening or unpredictable.", score: { security: 0, anxiety: 1, avoidance: 1, disorganization: 3 } },
    ],
  }
];

const archetypes = {
  "Secure": {
    name: "The Anchor",
    description: "You are the bedrock of relationships—stable, trusting, and comfortable with intimacy. You navigate love with a steady hand, valuing both connection and autonomy. For you, love is a safe harbor, not a stormy sea.",
  },
  "Anxious-Preoccupied": {
    name: "The Seeker",
    description: "You crave deep connection and intimacy, but a fear of abandonment can create a current of anxiety in your relationships. Your heart is a passionate, hopeful vessel, always seeking reassurance that it has found a safe port.",
  },
  "Dismissive-Avoidant": {
    name: "The Fortress",
    description: "You are a self-sufficient island, valuing independence and autonomy above all. You protect your heart with high walls, finding it safer to rely on yourself than to let others in. Intimacy can feel like a threat to your cherished freedom.",
  },
  "Fearful-Avoidant": {
    name: "The Shapeshifter",
    description: "You are caught in a push-and-pull of wanting love and fearing it. You desire intimacy but are terrified of being hurt, leading to a confusing dance of approach and retreat. Your inner world is a complex landscape of conflicting desires.",
  },
};

const RadarChart = ({ scores, dimensions }) => {
  const size = 120;
  const center = size / 2;
  const points = dimensions.map((dim, i) => {
    const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
    const score = scores[dim.toLowerCase()] || 0;
    const maxScore = questions.length * 3;
    const value = (score / maxScore) * (center - 10);
    const x = center + value * Math.cos(angle);
    const y = center + value * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: '0 auto' }}>
      <g>
        {dimensions.map((_, i) => {
          const angle = (i / dimensions.length) * 2 * Math.PI - Math.PI / 2;
          const x2 = center + (center - 10) * Math.cos(angle);
          const y2 = center + (center - 10) * Math.sin(angle);
          return <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="#333" strokeWidth="0.5" />;
        })}
        <polygon points={points} fill="rgba(212, 185, 106, 0.5)" stroke="#D4B96A" strokeWidth="1" />
      </g>
    </svg>
  );
};

const FindYourAttachmentStyle = () => {
  const [phase, setPhase] = useState("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const { markComplete } = useJourneyProgress();

  useEffect(() => {
    if (phase === "results" && results) {
      markComplete(ASSESSMENT_ID);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...results, completedAt: new Date().toISOString() }));
    }
  }, [phase, results, markComplete]);

  const handleStart = () => {
    setPhase("questions");
  };

  const handleAnswer = (score) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(nextAnswers);
      setPhase("results");
    }
  };

  const calculateResults = (finalAnswers) => {
    const totalScores = finalAnswers.reduce((acc, score) => {
      for (const dim in score) {
        acc[dim] = (acc[dim] || 0) + score[dim];
      }
      return acc;
    }, { security: 0, anxiety: 0, avoidance: 0, disorganization: 0 });

    const primaryDimension = Object.keys(totalScores).reduce((a, b) => totalScores[a] > totalScores[b] ? a : b);

    let archetypeKey;
    if (primaryDimension === 'security') {
        archetypeKey = "Secure";
    } else if (primaryDimension === 'anxiety') {
        archetypeKey = "Anxious-Preoccupied";
    } else if (primaryDimension === 'avoidance') {
        archetypeKey = "Dismissive-Avoidant";
    } else { // disorganization
        archetypeKey = "Fearful-Avoidant";
    }

    setResults({
      archetype: archetypes[archetypeKey],
      scores: totalScores,
      dimensions: ["Security", "Anxiety", "Avoidance", "Disorganization"],
    });
  };

  const styles = {
    container: {
      backgroundColor: "transparent", position: "relative", zIndex: 1,
      color: "#2C1810",
      fontFamily: "'Source Sans 3', sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
    },
    heading: {
      fontFamily: "'Playfair Display', serif",
      color: "#8B6914",
      fontSize: "3rem",
      marginBottom: "0.5rem",
    },
    tagline: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1.2rem",
      fontStyle: "italic",
      marginBottom: "2rem",
    },
    stats: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginBottom: "2rem",
      fontFamily: "'DM Mono', monospace",
      textTransform: "uppercase",
    },
    button: {
      backgroundColor: "#D4B96A",
      color: "#0A0A10",
      border: "none",
      padding: "1rem 2rem",
      fontFamily: "'DM Mono', monospace",
      fontSize: "1rem",
      cursor: "pointer",
      textTransform: "uppercase",
    },
    questionContainer: {
        width: '100%',
        maxWidth: '600px'
    },
    question: {
      fontSize: "1.5rem",
      marginBottom: "2rem",
    },
    optionButton: {
      display: "block",
      width: "100%",
      backgroundColor: "transparent",
      color: "#2C1810",
      border: "1px solid #D4B96A",
      padding: "1rem",
      marginBottom: "1rem",
      cursor: "pointer",
      textAlign: "left",
      "&:hover": {
        backgroundColor: "rgba(212, 185, 106, 0.1)",
      },
    },
    resultsContainer: {
        maxWidth: '600px'
    },
    archetype: {
        fontFamily: "'Playfair Display', serif",
        color: "#8B6914",
        fontSize: "2.5rem",
        marginBottom: "1rem",
    },
    description: {
        marginBottom: "2rem",
    },
    note: {
        fontSize: '0.9rem',
        fontStyle: 'italic',
        maxWidth: '500px',
        margin: '2rem auto',
        opacity: 0.8
    },
    journey: {
        marginTop: '3rem',
        borderTop: '1px solid #333',
        paddingTop: '2rem'
    },
    journeyTitle: {
        fontFamily: "'DM Mono', monospace",
        textTransform: 'uppercase',
        color: '#8B6914',
        marginBottom: '1rem'
    },
    journeyLink: {
        display: 'block',
        color: '#2C1810',
        textDecoration: 'none',
        marginBottom: '0.5rem'
    }
  };

  return (
    <>
    <SEO
        title="Find Your Attachment Style"
        description="Discover your attachment style and how it shapes your relationships."
        path="/find-my/attachment-style"
        keywords="Tony Greenberg, attachment style, attachment theory, relationship patterns"
        indexable={true}
      />
      <>
    <ThemedBackground theme="attachment" />
    <div style={styles.container}>
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Attachment Style"
          subtitle="How you love is how you were loved. Until you choose differently."
          description="Rooted in attachment theory, this assessment maps the invisible architecture of your relationships. Secure, anxious, avoidant, or disorganized — and more importantly, the specific patterns that keep you repeating what you swore you'd never repeat."
          stats={{ questions: 15, dimensions: 4, minutes: 5 }}
          whatYouGet={["Your attachment style profile across four dimensions","Understanding of your relationship patterns","Insight into your triggers and defense mechanisms","A path toward earned secure attachment"]}
          accentColor="#AD1457"
          onBegin={() => setPhase('questions')}
        />
      )}

      {phase === "questions" && (
        <div style={styles.questionContainer}>
          <p style={styles.question}>{questions[currentQuestionIndex].question}</p>
          <div>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} style={styles.optionButton} onClick={() => handleAnswer(option.score)}>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && (
            <EmailGate assessmentName="attachment style" onUnlock={() => setEmailGated(true)} />
          )}

          {phase === "results" && emailGated && results && (
        <div style={styles.resultsContainer}>
          <h2 style={styles.archetype}>{results.archetype.name}</h2>
          <p style={styles.description}>{results.archetype.description}</p>
          <RadarChart scores={results.scores} dimensions={results.dimensions} />
          <div style={{...styles.stats, marginTop: '2rem'}}>
              {results.dimensions.map(dim => (
                  <span key={dim}>{dim}: {results.scores[dim.toLowerCase()]}</span>
              ))}
          </div>
          <p style={styles.note}>A note on attachment: Your attachment style is a map of your past, not a blueprint for your future. It reflects how you learned to connect, but it is not a fixed identity. With awareness and therapeutic work, a secure attachment style can be earned at any stage of life.</p>
          <div style={styles.journey}>
            <h3 style={styles.journeyTitle}>The Journey Continues</h3>
            <a href="/find-my" style={styles.journeyLink}>Find Your Purpose</a>
            <a href="/find-my" style={styles.journeyLink}>Find Your Archetype</a>
            <a href="/find-my" style={styles.journeyLink}>Find Your Leadership Style</a>
          </div>
          <JourneyTracker variant="light" />
        </div>
      )}
          <WhatsNext />
    </div>
    </>
    </>);
};

export default FindYourAttachmentStyle;
