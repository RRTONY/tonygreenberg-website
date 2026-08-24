// @ts-nocheck
import React, { useState, useEffect } from 'react';
import JourneyTracker, { useJourneyProgress } from '@/components/JourneyTracker';
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";


const FindYourLoveLanguage = () => {
  const [phase, setPhase] = useState('landing');
  const [emailGated, setEmailGated] = useState(false);
  const { markComplete } = useJourneyProgress();
  const [results, setResults] = useState(null);

  const [scores, setScores] = useState({ 'Words of Affirmation': 0, 'Acts of Service': 0, 'Receiving Gifts': 0, 'Quality Time': 0, 'Physical Touch': 0 });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (optionScores: any) => {
    const newScores = { ...scores };
    for (const dim in optionScores) {
      newScores[dim] += optionScores[dim];
    }
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScores = { ...scores };
      const sortedScores = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
      const primary = sortedScores[0][0];
      const secondary = sortedScores[1][0];
      const archetype = archetypes[primary];

      const resultsData = {
        archetype: archetype.name,
        primaryLanguage: primary,
        secondaryLanguage: secondary,
        scores: finalScores,
        completedAt: new Date().toISOString(),
      };

      localStorage.setItem('lovelanguage_results', JSON.stringify(resultsData));
      setResults(resultsData);
      setPhase('results');
    }
  };

  const archetypes = {
    'Words of Affirmation': {
      name: 'The Encourager',
      description: 'You feel love most deeply through spoken or written words. Compliments, encouragement, and heartfelt expressions of affection are your emotional currency. You value hearing \'I love you\' and the reasons behind it.',
      tips: 'Tell your partner specifically what you appreciate about them. Leave them a note. Verbally praise them in front of others.'
    },
    'Acts of Service': {
      name: 'The Helper',
      description: 'For you, actions speak louder than words. You feel loved when your partner does things for you, like taking care of chores, running errands, or helping you with a project. These gestures show you that they are on your team.',
      tips: 'Ask your partner, \'What can I do to make your day easier?\' Proactively take on a task you know they dislike. The key is to serve with a positive spirit.'
    },
    'Receiving Gifts': {
      name: 'The Giver',
      description: 'You see gifts as tangible, visual symbols of love. It\'s not about materialism, but the thought and effort behind the gift. A meaningful present shows you that you are known, cared for, and prized.',
      tips: 'Pick up small, thoughtful items that remind you of your partner. The value is in the thought, not the price. Make a big deal out of birthdays and anniversaries.'
    },
    'Quality Time': {
      name: 'The Companion',
      description: 'You feel most loved when you have your partner\'s undivided attention. This means no phones, no TV, just focused, quality conversation and shared activities. It\'s about being present and connected.',
      tips: 'Schedule daily time to talk without distractions. Plan a date night. Take a walk together. The goal is connection, not just proximity.'
    },
    'Physical Touch': {
      name: 'The Cuddler',
      description: 'You feel love through physical affection. Hugs, holding hands, a touch on the arm—these are your primary emotional connectors. Physical presence and accessibility are crucial for you to feel secure and loved.',
      tips: 'Be intentional about physical contact. Greet with a hug. Hold hands while walking. Offer a back rub. Physical touch can be a powerful emotional bridge.'
    }
  };

  const dimensions = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];

  const questions = [
    {
      text: 'Which of these makes you feel most loved?',
      options: [
        { text: 'Someone telling you how much they appreciate you.', scores: { 'Words of Affirmation': 3 } },
        { text: 'Someone running an errand for you.', scores: { 'Acts of Service': 3 } },
        { text: 'Receiving a thoughtful present.', scores: { 'Receiving Gifts': 3 } },
        { text: 'Spending an uninterrupted evening together.', scores: { 'Quality Time': 3 } },
      ],
    },
    {
      text: 'You feel most valued when your partner:',
      options: [
        { text: 'Gives you a hug or holds your hand.', scores: { 'Physical Touch': 3 } },
        { text: 'Says "I love you" unexpectedly.', scores: { 'Words of Affirmation': 3 } },
        { text: 'Helps you with a difficult project.', scores: { 'Acts of Service': 2, 'Quality Time': 1 } },
        { text: 'Surprises you with a small token of affection.', scores: { 'Receiving Gifts': 3 } },
      ],
    },
    {
      text: 'What would make a birthday feel special?',
      options: [
        { text: 'A heartfelt card with a personal message.', scores: { 'Words of Affirmation': 3, 'Receiving Gifts': 1 } },
        { text: 'Your partner taking care of all the planning for a celebration.', scores: { 'Acts of Service': 3 } },
        { text: 'A carefully chosen gift you mentioned wanting.', scores: { 'Receiving Gifts': 3 } },
        { text: 'A weekend getaway for just the two of you.', scores: { 'Quality Time': 3, 'Physical Touch': 1 } },
      ],
    },
    {
      text: 'After a long, stressful day, you would most appreciate:',
      options: [
        { text: 'A long hug.', scores: { 'Physical Touch': 3 } },
        { text: 'Hearing your partner say, "You handled that so well."', scores: { 'Words of Affirmation': 3 } },
        { text: 'Coming home to a clean house and a prepared meal.', scores: { 'Acts of Service': 3 } },
        { text: 'Your partner listening intently as you talk about your day.', scores: { 'Quality Time': 3 } },
      ],
    },
    {
      text: 'Which is most important to you in a relationship?',
      options: [
        { text: 'Feeling understood and listened to.', scores: { 'Quality Time': 2, 'Words of Affirmation': 1 } },
        { text: 'Receiving tangible symbols of love.', scores: { 'Receiving Gifts': 3 } },
        { text: 'Feeling supported through practical help.', scores: { 'Acts of Service': 3 } },
        { text: 'Frequent physical intimacy and affection.', scores: { 'Physical Touch': 3 } },
      ],
    },
    {
      text: 'You know your partner is thinking of you when:',
      options: [
        { text: 'They send you a text just to say they miss you.', scores: { 'Words of Affirmation': 3 } },
        { text: 'They pick up your favorite snack on their way home.', scores: { 'Acts of Service': 1, 'Receiving Gifts': 2 } },
        { text: 'They bring you a souvenir from a trip.', scores: { 'Receiving Gifts': 3 } },
        { text: 'They make time for a video call when you are apart.', scores: { 'Quality Time': 3 } },
      ],
    },
    {
      text: 'What does "I support you" mean to you?',
      options: [
        { text: '"I believe in you and your abilities."', scores: { 'Words of Affirmation': 3 } },
        { text: '"I will help you in any way I can."', scores: { 'Acts of Service': 3 } },
        { text: '"I am here to listen without judgment."', scores: { 'Quality Time': 3 } },
        { text: '"I am your rock, you can lean on me."', scores: { 'Physical Touch': 2, 'Words of Affirmation': 1 } },
      ],
    },
    {
      text: 'A perfect date night involves:',
      options: [
        { text: 'Deep conversation and connection.', scores: { 'Quality Time': 3 } },
        { text: 'Lots of cuddling and closeness.', scores: { 'Physical Touch': 3 } },
        { text: 'Your partner planning the entire evening.', scores: { 'Acts of Service': 2 } },
        { text: 'Exchanging small, meaningful gifts.', scores: { 'Receiving Gifts': 2 } },
      ],
    },
    {
      text: 'You feel a disconnect when your partner:',
      options: [
        { text: 'Is distracted by their phone when you are together.', scores: { 'Quality Time': -3 } },
        { text: 'Forgets an important anniversary or event.', scores: { 'Receiving Gifts': -2, 'Acts of Service': -1 } },
        { text: 'Is not physically affectionate.', scores: { 'Physical Touch': -3 } },
        { text: 'Rarely offers praise or encouragement.', scores: { 'Words of Affirmation': -3 } },
      ],
    },
    {
      text: 'Which compliment would mean the most?',
      options: [
        { text: '"You are so incredibly talented."', scores: { 'Words of Affirmation': 3 } },
        { text: '"I love how you take care of things."', scores: { 'Acts of Service': 3 } },
        { text: '"You have the best taste." (in reference to a gift)', scores: { 'Receiving Gifts': 3 } },
        { text: '"I love spending time with you."', scores: { 'Quality Time': 3 } },
      ],
    },
    {
      text: 'An apology is most meaningful when it includes:',
      options: [
        { text: 'A promise to do better and a plan for how.', scores: { 'Acts of Service': 3 } },
        { text: 'A sincere expression of regret and empathy.', scores: { 'Words of Affirmation': 3 } },
        { text: 'Making up for it with a special gesture.', scores: { 'Receiving Gifts': 2, 'Quality Time': 1 } },
        { text: 'A hug and reassurance.', scores: { 'Physical Touch': 3 } },
      ],
    },
    {
      text: 'You feel most secure in a relationship when:',
      options: [
        { text: 'You have your partner\'s undivided attention.', scores: { 'Quality Time': 3 } },
        { text: 'You are physically close to your partner.', scores: { 'Physical Touch': 3 } },
        { text: 'You hear words of love and affirmation regularly.', scores: { 'Words of Affirmation': 3 } },
        { text: 'You know you can count on your partner for practical help.', scores: { 'Acts of Service': 3 } },
      ],
    },
    {
      text: 'What makes you feel cherished?',
      options: [
        { text: 'A surprise gift that shows they know you well.', scores: { 'Receiving Gifts': 3 } },
        { text: 'Your partner doing a chore they know you hate.', scores: { 'Acts of Service': 3 } },
        { text: 'A spontaneous back rub.', scores: { 'Physical Touch': 3 } },
        { text: 'Your partner putting their phone away to talk to you.', scores: { 'Quality Time': 3 } },
      ],
    },
    {
      text: 'When you are away from your partner, you most like to:',
      options: [
        { text: 'Receive a "thinking of you" gift in the mail.', scores: { 'Receiving Gifts': 3 } },
        { text: 'Have long phone calls to catch up.', scores: { 'Quality Time': 2, 'Words of Affirmation': 1 } },
        { text: 'Know they are handling things at home so you don\'t have to worry.', scores: { 'Acts of Service': 3 } },
        { text: 'Look forward to a big hug when you reunite.', scores: { 'Physical Touch': 3 } },
      ],
    },
    {
      text: 'Which of these feels like the ultimate romantic gesture?',
      options: [
        { text: 'A surprise party planned with all your favorite people.', scores: { 'Acts of Service': 2, 'Quality Time': 1 } },
        { text: 'A public declaration of love and admiration.', scores: { 'Words of Affirmation': 3 } },
        { text: 'An incredibly thoughtful and personal gift.', scores: { 'Receiving Gifts': 3 } },
        { text: 'A quiet, intimate moment of connection.', scores: { 'Physical Touch': 2, 'Quality Time': 1 } },
      ],
    },
  ];

  useEffect(() => {
    if (phase === 'results') {
      markComplete('find-your-love-language');
    }
  }, [phase, markComplete]);

  return (
    <>
    <SEO
        title="Find Your Love Language"
        description="Discover your love language and how to use it to strengthen your relationships."
        path="/find-my/love-language"
        keywords="Tony Greenberg, love language, find my love language, relationship communication"
        indexable={true}
      />
      <>
    <ThemedBackground theme="love" />
    <div style={{ position: "relative", minHeight: "100vh" }}>
    <div style={{ backgroundColor: 'transparent', color: '#2C1810', position: 'relative', zIndex: 1, fontFamily: 'Source Sans 3' }}>
      {phase === 'landing' && (
        <AssessmentIntro
          title="Find Your Love Language"
          subtitle="Love isn't one language. It's five — and you've been mistranslating."
          description="Based on the five love languages framework, this assessment goes deeper than the standard quiz. It maps not just how you give love, but how you need to receive it — and where the gap between those two creates the loneliness you can't explain."
          stats={{ questions: 15, dimensions: 5, minutes: 3 }}
          whatYouGet={["Your primary and secondary love languages", "The gap between how you give and receive love", "Insight into your relationship communication patterns", "Practical steps for deeper connection"]}
          accentColor="#C62828"
          onBegin={() => setPhase('questions')}
        />
      )}
      {phase === 'questions' && 
<div>
  <p>Question {currentQuestion + 1} of 15</p>
  <div>
    <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: '1.5rem 0 clamp(2rem, 4vw, 3rem)' }}>{questions[currentQuestion].text}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {questions[currentQuestion].options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option.scores)} style={{ backgroundColor: 'transparent', border: '1px solid #D4B96A', color: '#2C1810', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'Source Sans 3', fontSize: '1.2rem' }}>
          {option.text}
        </button>
      ))}
    </div>
  </div>
</div>
}
      {phase === 'results' && !emailGated && (
            <EmailGate assessmentName="love language" onUnlock={() => setEmailGated(true)} />
          )}

          {phase === 'results' && emailGated && results && (
        <div style={{ textAlign: 'center', padding: 'clamp(6rem, 10vw, 8rem) 2rem' }}>
          <h2 style={{ fontFamily: 'DM Mono', textTransform: 'uppercase', color: '#8B6914' }}>Your Love Language is</h2>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '4rem', color: '#8B6914', margin: '0' }}>{results.archetype}</h1>
          <p style={{ maxWidth: '600px', margin: '20px auto 10px', fontSize: '1.2rem' }}>{archetypes[results.primaryLanguage].description}</p>
          <p style={{ maxWidth: '600px', margin: '0 auto 50px', fontSize: '1rem', fontStyle: 'italic' }}>{archetypes[results.primaryLanguage].tips}</p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', maxWidth: '1000px', margin: '0 auto' }}>
            <RadarChart scores={results.scores} dimensions={dimensions} />
            <div>
              <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem' }}>Your Languages</h3>
              <p><strong>Primary:</strong> {results.primaryLanguage}</p>
              <p><strong>Secondary:</strong> {results.secondaryLanguage}</p>
            </div>
          </div>

          <div style={{ maxWidth: '800px', margin: '50px auto 0', borderTop: '1px solid #D4B96A', paddingTop: '30px' }}>
            <h3 style={{ fontFamily: 'Playfair Display', fontSize: '2rem' }}>The Journey Continues</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="/find-my" style={{ color: '#8B6914', textDecoration: 'none' }}>Find Your Chronotype</a>
              <a href="/find-my" style={{ color: '#8B6914', textDecoration: 'none' }}>Find Your Ikigai</a>
              <a href="/find-my" style={{ color: '#8B6914', textDecoration: 'none' }}>Find Your Learning Style</a>
            </div>
             <p style={{fontSize: '0.8rem', marginTop: '30px', color: '#aaa'}}>This assessment is based on Dr. Gary Chapman's "The 5 Love Languages\u00ae" framework. It is intended for personal insight and is not a substitute for professional advice.</p>
          </div>
          <WhatsNext />
        </div>
      )}
    </div>
    </div>
    </>
    </>);
};

const RadarChart = ({ scores, dimensions }) => {
  const width = 300;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  const numLevels = 5;
  const angleSlice = (Math.PI * 2) / dimensions.length;

  const maxScore = Math.max(...Object.values(scores), 10);

  const getPoint = (angle, value) => {
    const r = (radius * value) / maxScore;
    return {
      x: centerX + r * Math.cos(angle - Math.PI / 2),
      y: centerY + r * Math.sin(angle - Math.PI / 2),
    };
  };

  const points = dimensions.map((dim, i) => {
    const angle = angleSlice * i;
    return getPoint(angle, scores[dim] || 0);
  });

  const pathData = points.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g>
        {[...Array(numLevels)].map((_, level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(radius * (level + 1)) / numLevels}
            fill="none"
            stroke="#333"
            strokeWidth="1"
          />
        ))}
        {dimensions.map((dim, i) => {
          const angle = angleSlice * i;
          const p = getPoint(angle, maxScore * 1.1);
          return (
            <text
              key={dim}
              x={p.x}
              y={p.y}
              dy="0.35em"
              textAnchor={Math.abs(p.x - centerX) < 1 ? 'middle' : p.x > centerX ? 'start' : 'end'}
              fill="#E8E4DC"
              fontFamily="DM Mono"
              fontSize="10"
            >
              {dim}
            </text>
          );
        })}
        <polygon points={pathData} fill="rgba(212, 185, 106, 0.5)" stroke="#D4B96A" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#D4B96A" />
        ))}
      </g>
    </svg>
  );
};

export default FindYourLoveLanguage;
