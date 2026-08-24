// @ts-nocheck
import React, { useState, useEffect } from 'react';
import JourneyTracker, { useJourneyProgress } from '@/components/JourneyTracker';
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const FindYourKitchen = () => {
  const [phase, setPhase] = useState('landing');
  const [emailGated, setEmailGated] = useState(false);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const { markComplete } = useJourneyProgress();

  const questions = [
    { id: 1, text: 'When sourcing ingredients, you prioritize:', options: [
      { text: 'Local, seasonal produce from the farmer\'s market.', score: { 'Farm-to-Table Purist': 3, 'Ingredient Sourcing': 3 } },
      { text: 'Perfecting a single, complex technique.', score: { 'Technique Mastery': 3 } },
      { text: 'Exploring international grocery stores for rare finds.', score: { 'Fusion Explorer': 3, 'Cultural Curiosity': 2 } },
      { text: 'Ingredients that can be preserved or fermented.', score: { 'The Fermentation Alchemist': 3 } },
    ]},
    { id: 2, text: 'A perfect meal for you is:', options: [
        { text: 'A beautifully plated dish that looks like a work of art.', score: { 'Pastry Architect': 2, 'Presentation': 3 } },
        { text: 'A communal feast where everyone shares and connects.', score: { 'The Communal Cook': 3, 'Hospitality': 3 } },
        { text: 'A dish that surprises with unexpected flavor combinations.', score: { 'Fusion Explorer': 3, 'Improvisation': 2 } },
        { text: 'Something slow-cooked or smoked to perfection.', score: { 'The Fire Master': 3 } },
    ]},
    { id: 3, text: 'Your kitchen\'s most essential tool is:', options: [
        { text: 'A high-quality chef\'s knife.', score: { 'Technique Mastery': 3 } },
        { text: 'A large, welcoming dining table.', score: { 'The Communal Cook': 3, 'Hospitality': 2 } },
        { text: 'A collection of spices from around the world.', score: { 'Fusion Explorer': 3, 'Cultural Curiosity': 2 } },
        { text: 'A smoker or a grill.', score: { 'The Fire Master': 3 } },
    ]},
    { id: 4, text: 'When you cook for others, your main goal is:', options: [
        { text: 'To create a warm, inviting atmosphere.', score: { 'The Communal Cook': 3, 'Hospitality': 3 } },
        { text: 'To impress them with your technical skills.', score: { 'Technique Mastery': 2, 'Presentation': 1 } },
        { text: 'To introduce them to new flavors and cultures.', score: { 'Fusion Explorer': 3, 'Cultural Curiosity': 2 } },
        { text: 'To serve something deeply satisfying and soulful.', score: { 'The Fire Master': 2, 'Farm-to-Table Purist': 1 } },
    ]},
    { id: 5, text: 'You find joy in:', options: [
        { text: 'The slow process of fermentation.', score: { 'The Fermentation Alchemist': 3 } },
        { text: 'The precision of pastry and baking.', score: { 'Pastry Architect': 3, 'Technique Mastery': 1 } },
        { text: 'The spontaneity of improvising a meal.', score: { 'Improvisation': 3, 'Fusion Explorer': 1 } },
        { text: 'The connection to nature through ingredients.', score: { 'Farm-to-Table Purist': 3, 'Ingredient Sourcing': 2 } },
    ]},
    { id: 6, text: 'A kitchen mistake is:', options: [
        { text: 'An opportunity to improvise and create something new.', score: { 'Improvisation': 3 } },
        { text: 'A failure of technique that needs to be corrected.', score: { 'Technique Mastery': 2 } },
        { text: 'A sign to use better quality ingredients next time.', score: { 'Ingredient Sourcing': 2 } },
        { text: 'A moment to laugh and share with your guests.', score: { 'Hospitality': 2 } },
    ]},
    { id: 7, text: 'The best part of a meal is:', options: [
        { text: 'The conversation and connection around the table.', score: { 'The Communal Cook': 3, 'Hospitality': 3 } },
        { text: 'The perfect execution of a difficult dish.', score: { 'Technique Mastery': 3 } },
        { text: 'The story behind the ingredients.', score: { 'Farm-to-Table Purist': 2, 'Ingredient Sourcing': 2 } },
        { text: 'The visual appeal of the plated food.', score: { 'Presentation': 3, 'Pastry Architect': 1 } },
    ]},
    { id: 8, text: 'You are most likely to cook:', options: [
        { text: 'A multi-course tasting menu.', score: { 'Technique Mastery': 2, 'Presentation': 2 } },
        { text: 'A large, one-pot meal for a crowd.', score: { 'The Communal Cook': 3 } },
        { text: 'Something you\'ve never made before.', score: { 'Improvisation': 3, 'Cultural Curiosity': 1 } },
        { text: 'A dish that requires hours of slow cooking.', score: { 'The Fire Master': 3 } },
    ]},
    { id: 9, text: 'Your cookbook collection is full of:', options: [
        { text: 'Books on specific techniques like butchery or charcuterie.', score: { 'Technique Mastery': 3, 'The Fermentation Alchemist': 1 } },
        { text: 'Travelogues with recipes from far-off lands.', score: { 'Fusion Explorer': 3, 'Cultural Curiosity': 3 } },
        { text: 'Books focused on a single ingredient or region.', score: { 'Farm-to-Table Purist': 3, 'Ingredient Sourcing': 2 } },
        { text: 'Handwritten notes and family recipes.', score: { 'The Communal Cook': 2, 'Hospitality': 1 } },
    ]},
    { id: 10, text: 'You feel most connected to your food when:', options: [
        { text: 'You know the farmer who grew it.', score: { 'Farm-to-Table Purist': 3, 'Ingredient Sourcing': 3 } },
        { text: 'You are using a traditional cooking method.', score: { 'The Fire Master': 2, 'Cultural Curiosity': 1 } },
        { text: 'You are creating a dish that is uniquely your own.', score: { 'Improvisation': 3, 'Fusion Explorer': 1 } },
        { text: 'You are sharing it with people you love.', score: { 'The Communal Cook': 3, 'Hospitality': 2 } },
    ]},
    { id: 11, text: 'The most important aspect of a dish is:', options: [
        { text: 'Flavor', score: { 'Fusion Explorer': 2, 'Improvisation': 1 } },
        { text: 'Texture', score: { 'Technique Mastery': 2, 'Pastry Architect': 1 } },
        { text: 'Aroma', score: { 'The Fire Master': 2 } },
        { text: 'Appearance', score: { 'Presentation': 3 } },
    ]},
    { id: 12, text: 'A kitchen should be:', options: [
        { text: 'A laboratory for experimentation.', score: { 'The Fermentation Alchemist': 2, 'Fusion Explorer': 2 } },
        { text: 'A studio for creative expression.', score: { 'Pastry Architect': 2, 'Presentation': 2 } },
        { text: 'A sanctuary for mindfulness and connection.', score: { 'Farm-to-Table Purist': 2 } },
        { text: 'The heart of the home.', score: { 'The Communal Cook': 3, 'Hospitality': 2 } },
    ]},
    { id: 13, text: 'When you travel, you are most excited about:', options: [
        { text: 'Trying street food and local delicacies.', score: { 'Cultural Curiosity': 3, 'Fusion Explorer': 2 } },
        { text: 'Visiting local markets and farms.', score: { 'Ingredient Sourcing': 3, 'Farm-to-Table Purist': 2 } },
        { text: 'Taking a cooking class to learn a new technique.', score: { 'Technique Mastery': 3 } },
        { text: 'Dining at a world-renowned restaurant.', score: { 'Presentation': 2 } },
    ]},
    { id: 14, text: 'The ideal kitchen gadget is one that:', options: [
        { text: 'Enhances a traditional cooking method.', score: { 'The Fire Master': 2 } },
        { text: 'Allows for precise and consistent results.', score: { 'Technique Mastery': 2, 'Pastry Architect': 2 } },
        { text: 'Opens up new possibilities for flavor combinations.', score: { 'Fusion Explorer': 2, 'Improvisation': 1 } },
        { text: 'Helps you make food for a large group of people.', score: { 'The Communal Cook': 2 } },
    ]},
    { id: 15, text: 'Your cooking style is best described as:', options: [
        { text: 'Intuitive and spontaneous.', score: { 'Improvisation': 3 } },
        { text: 'Methodical and precise.', score: { 'Technique Mastery': 3 } },
        { text: 'Rooted in tradition and heritage.', score: { 'Cultural Curiosity': 2, 'The Communal Cook': 1 } },
        { text: 'Constantly evolving and experimental.', score: { 'Fusion Explorer': 3 } },
    ]},
  ];

  const archetypes = {
    'The Fermentation Alchemist': 'You are a patient artist, transforming humble ingredients into complex flavors through the magic of time and microbes. Your kitchen is a laboratory of bubbling jars and earthy aromas.',
    'The Farm-to-Table Purist': 'You are a storyteller, connecting people to the land through the freshest, most seasonal ingredients. Your cooking is a celebration of nature\'s bounty and the hands that cultivate it.',
    'The Fusion Explorer': 'You are a culinary cartographer, charting new territories of taste by blending flavors, techniques, and traditions from around the globe. Your dishes are a delicious dialogue between cultures.',
    'The Pastry Architect': 'You are a meticulous builder, constructing edible masterpieces with precision, creativity, and a deep understanding of structure and chemistry. Your creations are as beautiful as they are delicious.',
    'The Fire Master': 'You are a primal force, harnessing the power of live fire to create smoky, soulful, and deeply satisfying food. Your cooking is a dance of heat, smoke, and intuition.',
    'The Communal Cook': 'You are a gatherer, using food as a medium to build community, foster connection, and create lasting memories. Your table is a place of warmth, laughter, and abundance.',
  };

  const dimensions = [
    'Technique Mastery',
    'Ingredient Sourcing',
    'Cultural Curiosity',
    'Presentation',
    'Improvisation',
    'Hospitality',
  ];

  const handleAnswer = (questionId, score) => {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    if (Object.keys(newAnswers).length === questions.length) {
      calculateResults(newAnswers);
      setPhase('results');
    } else {
      // Optional: move to next question, for now, we just collect answers
    }
  };

  const calculateResults = (currentAnswers) => {
    const scores = {};
    const dimensionScores = {};

    Object.values(currentAnswers).forEach(answerScore => {
      for (const key in answerScore) {
        if (archetypes[key]) {
          scores[key] = (scores[key] || 0) + answerScore[key];
        } else if (dimensions.includes(key)) {
          dimensionScores[key] = (dimensionScores[key] || 0) + answerScore[key];
        }
      }
    });

    const topArchetype = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    const finalResults = {
      archetype: topArchetype,
      scores: dimensionScores,
      dimensions: dimensions,
      completedAt: new Date().toISOString(),
    };

    setResults(finalResults);
    localStorage.setItem('kitchen_results', JSON.stringify(finalResults));
  };

  useEffect(() => {
    if (phase === 'results') {
      markComplete('find-your-kitchen');
    }
  }, [phase, markComplete]);

  const renderLanding = () => (
    <AssessmentIntro
          title="Find Your Kitchen"
          subtitle="The kitchen is the last honest room in the house."
          description="From fermentation alchemy to fire mastery, from farm-to-table purism to fusion exploration — this assessment maps your culinary identity across technique, sourcing, cultural curiosity, presentation, improvisation, and hospitality. Fifteen questions to find out who you really are when you cook."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your kitchen archetype (Alchemist, Purist, Explorer, Architect, Fire Master, or Communal Cook)","A radar chart of your culinary dimensions","Understanding of your cooking philosophy","Curated next steps in your culinary journey"]}
          accentColor="#E65100"
          onBegin={() => setPhase('questions')}
        />
  );

  const renderQuestions = () => (
    <div style={styles.container}>
        {questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
                <h2 style={styles.h2}>{index + 1}. {q.text}</h2>
                <div style={styles.optionsContainer}>
                    {q.options.map((option, i) => (
                        <button key={i} style={styles.optionButton} onClick={() => handleAnswer(q.id, option.score)}>
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    const radarPoints = results.dimensions.map((dim, i) => {
        const angle = (i / results.dimensions.length) * 2 * Math.PI;
        const value = results.scores[dim] || 0;
        const x = 150 + Math.cos(angle) * value * 2;
        const y = 150 - Math.sin(angle) * value * 2;
        return `${x},${y}`;
    }).join(' ');

    return (
    <>
    <SEO
        title="Find Your Kitchen"
        description="Discover your cooking style and the kitchen setup that matches how you actually cook."
        path="/find-my/kitchen"
        keywords="Tony Greenberg, find my kitchen, cooking style, kitchen setup"
        indexable={true}
      />
      <div style={styles.container}>
            <h1 style={styles.h1}>Your Archetype: {results.archetype}</h1>
            <p style={styles.description}>{archetypes[results.archetype]}</p>
            
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ display: 'block', margin: '40px auto' }}>
                <polygon points={radarPoints} fill="rgba(212, 185, 106, 0.5)" stroke="#D4B96A" strokeWidth="2" />
            </svg>

            <div style={styles.scoresContainer}>
                {results.dimensions.map(dim => (
                    <div key={dim} style={styles.scoreItem}>
                        <span style={styles.scoreLabel}>{dim}:</span>
                        <span style={styles.scoreValue}>{results.scores[dim] || 0}</span>
                    </div>
                ))}
            </div>

            <div style={styles.journeyContainer}>
                <h2 style={styles.h2}>The Journey Continues</h2>
                <a href="/find-your-diet" style={styles.journeyLink}>Find Your Diet</a>
                <a href="/find-my" style={styles.journeyLink}>Find Your Purpose</a>
                <a href="/find-your-style" style={styles.journeyLink}>Find Your Style</a>
            </div>
            <JourneyTracker variant="light" />
        </div>
    </>);
  };

  return (
    <div style={styles.main}>
      <ThemedBackground theme="kitchen" />
      {phase === 'landing' && renderLanding()}
      {phase === 'questions' && renderQuestions()}
      {phase === 'results' && !emailGated && (
        <EmailGate assessmentName="kitchen" onUnlock={() => setEmailGated(true)} />
      )}
      {phase === 'results' && emailGated && renderResults()}
          <WhatsNext />
    </div>
  );
};

const styles = {
  main: {
    backgroundColor: 'transparent', position: 'relative', zIndex: 1,
    color: '#2C1810',
    fontFamily: 'Source Sans 3, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'clamp(4rem, 6vw, 6rem) 2rem',
  },
  container: {
    textAlign: 'center',
    maxWidth: '800px',
  },
  h1: {
    fontFamily: 'Playfair Display, serif',
    color: '#8B6914',
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  h2: {
    fontFamily: 'Playfair Display, serif',
    color: '#8B6914',
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  tagline: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    marginBottom: '2rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '3rem',
    fontFamily: 'DM Mono, monospace',
    textTransform: 'uppercase',
  },
  statItem: {
    color: '#8B6914',
  },
  button: {
    backgroundColor: '#D4B96A',
    color: '#0A0A10',
    border: 'none',
    padding: '1rem 2rem',
    fontFamily: 'DM Mono, monospace',
    fontSize: '1rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  optionButton: {
    backgroundColor: 'transparent',
    color: '#2C1810',
    border: '1px solid #D4B96A',
    padding: '1.5rem',
    fontFamily: 'Source Sans 3, sans-serif',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'left',
    height: '100%',
  },
  description: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 2rem auto',
  },
  scoresContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem',
  },
  scoreItem: {
    fontFamily: 'DM Mono, monospace',
    fontSize: '1rem',
  },
  scoreLabel: {
    color: '#8B6914',
    marginRight: '0.5rem',
  },
  scoreValue: {},
  journeyContainer: {
    marginTop: '4rem',
    borderTop: '1px solid #D4B96A',
    paddingTop: '2rem',
  },
  journeyLink: {
    color: '#8B6914',
    textDecoration: 'none',
    margin: '0 1rem',
    fontFamily: 'DM Mono, monospace',
  },
};

export default FindYourKitchen;
