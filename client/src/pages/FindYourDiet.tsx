// @ts-nocheck
import React, { useState, useEffect } from 'react';
import JourneyTracker, { useJourneyProgress } from '@/components/JourneyTracker';
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const FindYourDiet = () => {
  const [phase, setPhase] = useState('landing');
  const [emailGated, setEmailGated] = useState(false);

  const styles = {
    container: {
      backgroundColor: 'transparent',
      color: '#2C1810',
      fontFamily: "'Source Sans 3', sans-serif",
      padding: '2rem',
      minHeight: '100vh',
      position: 'relative' as const,
      zIndex: 1,
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      color: '#8B6914',
      fontSize: '3rem',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    tagline: {
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '2rem',
    },
    stats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '3rem',
      fontFamily: "'DM Mono', monospace",
    },
    stat: {
      textAlign: 'center',
    },
    beginButton: {
      display: 'block',
      margin: '0 auto',
      padding: '1rem 2rem',
      backgroundColor: '#D4B96A',
      color: '#0A0A10',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1.2rem',
      cursor: 'pointer',
    },
  };

  const questions = [
    {
      text: "How do you feel after eating a high-carb meal?",
      options: [
        { text: "Energized and satisfied", scores: { "Metabolic Type": 4 } },
        { text: "A little sluggish", scores: { "Metabolic Type": 2 } },
        { text: "Sleepy and bloated", scores: { "Metabolic Type": 1 } },
        { text: "No significant change", scores: { "Metabolic Type": 3 } },
      ],
    },
    {
      text: "How often do you experience digestive discomfort (bloating, gas, etc.)?",
      options: [
        { text: "Rarely or never", scores: { "Gut Health": 4 } },
        { text: "Occasionally, after certain foods", scores: { "Gut Health": 3 } },
        { text: "Frequently, a few times a week", scores: { "Gut Health": 2 } },
        { text: "Almost daily", scores: { "Gut Health": 1 } },
      ],
    },
    {
      text: "How would you describe your energy levels throughout the day?",
      options: [
        { text: "Stable and consistent", scores: { "Energy Patterns": 4 } },
        { text: "I have a mid-day slump", scores: { "Energy Patterns": 2 } },
        { text: "Up and down like a rollercoaster", scores: { "Energy Patterns": 1 } },
        { text: "Generally low", scores: { "Energy Patterns": 0 } },
      ],
    },
    {
      text: "How often do you consume processed or packaged foods?",
      options: [
        { text: "Rarely, I prefer whole foods", scores: { "Nutrient Density": 4, "Inflammation": 4 } },
        { text: "A few times a week", scores: { "Nutrient Density": 2, "Inflammation": 2 } },
        { text: "It\'s a regular part of my diet", scores: { "Nutrient Density": 1, "Inflammation": 1 } },
        { text: "I rely on them for most meals", scores: { "Nutrient Density": 0, "Inflammation": 0 } },
      ],
    },
    {
      text: "When you eat, are you typically...",
      options: [
        { text: "Focused on the meal, savoring each bite", scores: { "Mindful Eating": 4 } },
        { text: "Distracted by my phone, TV, or work", scores: { "Mindful Eating": 1 } },
        { text: "Eating quickly on the go", scores: { "Mindful Eating": 0 } },
        { text: "A mix of focused and distracted eating", scores: { "Mindful Eating": 2 } },
      ],
    },
    {
        text: "How does your body feel when you wake up in the morning?",
        options: [
            { text: "Rested and refreshed", scores: { "Inflammation": 4, "Energy Patterns": 4 } },
            { text: "A bit stiff, but it passes quickly", scores: { "Inflammation": 3, "Energy Patterns": 3 } },
            { text: "Stiff and achy for a while", scores: { "Inflammation": 2, "Energy Patterns": 2 } },
            { text: "Sore and exhausted", scores: { "Inflammation": 1, "Energy Patterns": 1 } },
        ],
    },
    {
        text: "How many different types of vegetables do you eat in a typical week?",
        options: [
            { text: "A wide variety, 10+ types", scores: { "Nutrient Density": 4, "Gut Health": 4 } },
            { text: "A decent mix, 5-9 types", scores: { "Nutrient Density": 3, "Gut Health": 3 } },
            { text: "Just a few staples, 2-4 types", scores: { "Nutrient Density": 2, "Gut Health": 2 } },
            { text: "One or two, if any", scores: { "Nutrient Density": 1, "Gut Health": 1 } },
        ],
    },
    {
        text: "How do you respond to hunger cues?",
        options: [
            { text: "I eat when I feel gentle hunger and stop when satisfied", scores: { "Mindful Eating": 4, "Metabolic Type": 4 } },
            { text: "I often ignore hunger until I\'m ravenous", scores: { "Mindful Eating": 1, "Metabolic Type": 1 } },
            { text: "I eat on a strict schedule, regardless of hunger", scores: { "Mindful Eating": 2, "Metabolic Type": 2 } },
            { text: "I tend to snack or graze throughout the day", scores: { "Mindful Eating": 3, "Metabolic Type": 3 } },
        ],
    },
    {
        text: "How often do you consume sugary drinks (soda, sweetened teas, fruit juice)?",
        options: [
            { text: "Almost never", scores: { "Inflammation": 4, "Nutrient Density": 4 } },
            { text: "Once or twice a week", scores: { "Inflammation": 3, "Nutrient Density": 2 } },
            { text: "A few times a week", scores: { "Inflammation": 2, "Nutrient Density": 1 } },
            { text: "Daily", scores: { "Inflammation": 1, "Nutrient Density": 0 } },
        ],
    },
    {
        text: "How would you describe your relationship with food?",
        options: [
            { text: "Positive and nourishing", scores: { "Mindful Eating": 4 } },
            { text: "It\'s complicated and sometimes stressful", scores: { "Mindful Eating": 2 } },
            { text: "Strictly functional, for fuel only", scores: { "Mindful Eating": 3 } },
            { text: "Often a source of guilt or anxiety", scores: { "Mindful Eating": 1 } },
        ],
    },
    {
        text: "How does your skin typically look and feel?",
        options: [
            { text: "Clear and calm", scores: { "Inflammation": 4, "Gut Health": 4 } },
            { text: "Prone to dryness or oiliness", scores: { "Inflammation": 3, "Gut Health": 3 } },
            { text: "Occasional breakouts or redness", scores: { "Inflammation": 2, "Gut Health": 2 } },
            { text: "Consistently irritated, red, or broken out", scores: { "Inflammation": 1, "Gut Health": 1 } },
        ],
    },
    {
        text: "How do you feel after eating a meal rich in healthy fats (avocado, nuts, olive oil)?",
        options: [
            { text: "Full, focused, and satiated for hours", scores: { "Metabolic Type": 4, "Energy Patterns": 4 } },
            { text: "Satisfied, but hungry again in a few hours", scores: { "Metabolic Type": 3, "Energy Patterns": 3 } },
            { text: "A bit heavy or sluggish", scores: { "Metabolic Type": 2, "Energy Patterns": 2 } },
            { text: "I don\'t typically eat high-fat meals", scores: { "Metabolic Type": 1, "Energy Patterns": 1 } },
        ],
    },
    {
        text: "How often do you incorporate fermented foods (yogurt, kefir, kimchi) into your diet?",
        options: [
            { text: "Daily or several times a week", scores: { "Gut Health": 4 } },
            { text: "Occasionally, once or twice a week", scores: { "Gut Health": 3 } },
            { text: "Rarely", scores: { "Gut Health": 2 } },
            { text: "Never", scores: { "Gut Health": 1 } },
        ],
    },
    {
        text: "How sensitive are you to caffeine?",
        options: [
            { text: "Very sensitive, a little goes a long way", scores: { "Metabolic Type": 2, "Energy Patterns": 2 } },
            { text: "I can have it in the morning but not afternoon", scores: { "Metabolic Type": 3, "Energy Patterns": 3 } },
            { text: "Not very sensitive, I can drink it any time", scores: { "Metabolic Type": 4, "Energy Patterns": 4 } },
            { text: "I avoid it completely", scores: { "Metabolic Type": 1, "Energy Patterns": 1 } },
        ],
    },
    {
        text: "When you feel stressed or emotional, how does it impact your eating habits?",
        options: [
            { text: "I tend to lose my appetite", scores: { "Mindful Eating": 2 } },
            { text: "I crave comfort foods or sweets", scores: { "Mindful Eating": 1 } },
            { text: "It doesn\'t really affect my eating habits", scores: { "Mindful Eating": 4 } },
            { text: "I might snack more, but on healthy things", scores: { "Mindful Eating": 3 } },
        ],
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    "Metabolic Type": 0,
    "Gut Health": 0,
    "Inflammation": 0,
    "Energy Patterns": 0,
    "Nutrient Density": 0,
    "Mindful Eating": 0,
  });

  const handleAnswer = (optionScores) => {
    const newScores = { ...scores };
    for (const dimension in optionScores) {
      newScores[dimension] += optionScores[dimension];
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setPhase("results");
    }
  };

  const QuestionsPage = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
    <>
    <SEO
        title="Find Your Diet"
        description="A personalized diet assessment to find the nutritional approach that fits your biology and goals."
        path="/find-my/diet"
        keywords="Tony Greenberg, find my diet, personalized diet, nutrition assessment"
        indexable={true}
      />
      <div style={styles.container}>
        <h2 style={styles.title}>{currentQuestion.text}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "3rem" }}>
          {currentQuestion.options.map((option, index) => (
            <button key={index} style={styles.beginButton} onClick={() => handleAnswer(option.scores)}>
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </>);
  };

  const archetypes = {
    "The Ancestral Eater": { "Metabolic Type": 4, "Gut Health": 3, "Inflammation": 4, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 2 },
    "The Plant Alchemist": { "Metabolic Type": 2, "Gut Health": 4, "Inflammation": 3, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 4 },
    "The Intuitive Grazer": { "Metabolic Type": 3, "Gut Health": 3, "Inflammation": 2, "Energy Patterns": 4, "Nutrient Density": 3, "Mindful Eating": 4 },
    "The Performance Fueler": { "Metabolic Type": 4, "Gut Health": 2, "Inflammation": 2, "Energy Patterns": 4, "Nutrient Density": 3, "Mindful Eating": 1 },
    "The Mediterranean Soul": { "Metabolic Type": 3, "Gut Health": 4, "Inflammation": 4, "Energy Patterns": 3, "Nutrient Density": 4, "Mindful Eating": 3 },
    "The Fasting Philosopher": { "Metabolic Type": 1, "Gut Health": 2, "Inflammation": 3, "Energy Patterns": 2, "Nutrient Density": 2, "Mindful Eating": 3 },
  };

  const getArchetype = (scores) => {
    let bestMatch = "";
    let minDifference = Infinity;

    for (const archetype in archetypes) {
      let difference = 0;
      for (const dimension in scores) {
        difference += Math.abs(scores[dimension] - archetypes[archetype][dimension]);
      }
      if (difference < minDifference) {
        minDifference = difference;
        bestMatch = archetype;
      }
    }
    return bestMatch;
  };

  const ResultsPage = () => {
    const { markComplete } = useJourneyProgress();
    const archetype = getArchetype(scores);

    useEffect(() => {
      markComplete("find-your-diet");
      localStorage.setItem("diet_results", JSON.stringify({ archetype, scores, dimensions: Object.keys(scores), completedAt: new Date() }));
    }, []);

    const RadarChart = () => {
      const size = 300;
      const center = size / 2;
      const points = Object.values(scores).map((score, i) => {
        const angle = (i / 6) * 2 * Math.PI;
        const x = center + (score * 10) * Math.cos(angle);
        const y = center + (score * 10) * Math.sin(angle);
        return `${x},${y}`;
      }).join(" ");

      return (
        <svg height={size} width={size}>
          <polygon points={points} fill="rgba(212, 185, 106, 0.5)" stroke="#D4B96A" strokeWidth="2" />
        </svg>
      );
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>{archetype}</h1>
        <p style={styles.tagline}>{
        {
          "The Ancestral Eater": "You thrive on a diet rich in whole, unprocessed foods, similar to what our ancestors ate. Think high-quality meats, fish, vegetables, fruits, and healthy fats. Grains, legumes, and dairy may not be your best friends.",
          "The Plant Alchemist": "Your body flourishes on a vibrant, plant-based diet. You have a knack for turning vegetables, fruits, legumes, and whole grains into delicious and nourishing meals. You may be more sensitive to animal products.",
          "The Intuitive Grazer": "You\'re in tune with your body\'s subtle cues, preferring to eat smaller, more frequent meals throughout the day. You do best when you listen to your hunger and fullness signals rather than sticking to a rigid schedule.",
          "The Performance Fueler": "You see food as fuel for your active lifestyle. You likely need a steady supply of complex carbohydrates and lean proteins to maintain your energy levels and support muscle recovery.",
          "The Mediterranean Soul": "Your body responds well to a diet inspired by the Mediterranean coast—rich in olive oil, fish, fresh vegetables, and whole grains. This anti-inflammatory way of eating supports your overall well-being.",
          "The Fasting Philosopher": "Your digestive system benefits from periods of rest. Intermittent fasting or time-restricted eating can help improve your energy, mental clarity, and metabolic health. You\'re not one for constant snacking."
        }[archetype]
      }</p>
        <RadarChart />
        <div style={{ marginTop: "2rem" }}>
          {Object.entries(scores).map(([dimension, score]) => (
            <div key={dimension} style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{dimension}</div>
              <div>{score}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "3rem" }}>
          <h2 style={styles.title}>Journey Continues</h2>
          <a href="/find-my" style={{ color: "#8B6914", display: "block", marginBottom: "1rem" }}>Find Your Purpose</a>
          <a href="/find-my" style={{ color: "#8B6914", display: "block", marginBottom: "1rem" }}>Find Your Calling</a>
          <a href="/find-my" style={{ color: "#8B6914", display: "block", marginBottom: "1rem" }}>Find Your Truth</a>
        </div>
      </div>
    );
  };

  const LandingPage = () => (
    <AssessmentIntro
          title="Find Your Diet"
          subtitle="Your body has been trying to tell you what it needs. Time to listen."
          description="This isn't another meal plan quiz. It's a deep dive into your metabolic type, gut health patterns, inflammation markers, energy cycles, and relationship with food. Fifteen questions that decode the conversation your body's been having without you."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your unique dietary archetype (one of six)","A personalized nutrition dimension map","Insight into your metabolic type and energy patterns","Actionable next steps for your body's actual needs"]}
          accentColor="#7CB342"
          onBegin={() => setPhase('questions')}
        />
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ThemedBackground theme="diet" />
      {phase === 'landing' && <LandingPage />}
      {phase === 'questions' && <QuestionsPage />}
      {phase === 'results' && !emailGated && (
            <EmailGate assessmentName="diet" onUnlock={() => setEmailGated(true)} />
          )}
          {phase === 'results' && emailGated && <ResultsPage />}
          <WhatsNext />
    </div>
  );
};

export default FindYourDiet;
