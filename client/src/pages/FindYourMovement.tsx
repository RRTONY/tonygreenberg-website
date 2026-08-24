// @ts-nocheck
import React, { useState, useEffect } from 'react';
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import ThemedBackground from '@/components/ThemedBackground';
import AssessmentIntro from '@/components/AssessmentIntro';
import SEO from "@/components/SEO";

const FindYourMovement = () => {
  const [phase, setPhase] = useState<"landing" | "questions" | "results">("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ Strength: 0, Flexibility: 0, Endurance: 0, Mindfulness: 0, Community: 0, Adventure: 0 });

  const questions = [
    {
      question: "What kind of physical challenge excites you most?",
      options: [
        { text: "Lifting heavy weights", scores: { Strength: 3 } },
        { text: "Flowing through a series of complex poses", scores: { Flexibility: 3 } },
        { text: "Running a long-distance race", scores: { Endurance: 3 } },
        { text: "Mastering a new, intricate technique", scores: { Mindfulness: 3 } },
      ],
    },
    {
      question: "When you work out, you prefer to be:",
      options: [
        { text: "Alone, focused on my own progress", scores: { Strength: 2, Mindfulness: 1 } },
        { text: "In a class, feeding off the group energy", scores: { Community: 3 } },
        { text: "Outdoors, surrounded by nature", scores: { Adventure: 3 } },
        { text: "With a partner or small group", scores: { Community: 2, Adventure: 1 } },
      ],
    },
    {
        question: "What's your ideal post-workout feeling?",
        options: [
            { text: "Powerful and accomplished", scores: { Strength: 3 } },
            { text: "Centered and serene", scores: { Mindfulness: 3, Flexibility: 1 } },
            { text: "Exhausted but exhilarated", scores: { Endurance: 3 } },
            { text: "Connected with my training partners", scores: { Community: 3 } },
        ],
    },
    {
        question: "Which environment calls to you for movement?",
        options: [
            { text: "A well-equipped gym", scores: { Strength: 2 } },
            { text: "A peaceful, open studio", scores: { Flexibility: 2, Mindfulness: 1 } },
            { text: "A sprawling natural landscape", scores: { Adventure: 3, Endurance: 1 } },
            { text: "A martial arts dojo or boxing ring", scores: { Mindfulness: 2, Strength: 1 } },
        ],
    },
    {
        question: "Your fitness goal is more about:",
        options: [
            { text: "Building visible muscle and raw power", scores: { Strength: 3 } },
            { text: "Improving mobility and grace", scores: { Flexibility: 3 } },
            { text: "Pushing your physical limits over time", scores: { Endurance: 3 } },
            { text: "Achieving a mind-body connection", scores: { Mindfulness: 3 } },
        ],
    },
    {
        question: "What sounds like a perfect weekend activity?",
        options: [
            { text: "A long hike in the mountains", scores: { Adventure: 3, Endurance: 1 } },
            { text: "A competitive game of soccer or basketball", scores: { Community: 3, Endurance: 1 } },
            { text: "A silent retreat with meditation and yoga", scores: { Mindfulness: 3, Flexibility: 1 } },
            { text: "A weightlifting competition", scores: { Strength: 3, Community: 1 } },
        ],
    },
    {
        question: "When facing a physical barrier, you:",
        options: [
            { text: "Power through it with sheer force", scores: { Strength: 3 } },
            { text: "Find a way to move around it gracefully", scores: { Flexibility: 2, Mindfulness: 1 } },
            { text: "Pace yourself and wear it down over time", scores: { Endurance: 3 } },
            { text: "Analyze it and find a technical solution", scores: { Mindfulness: 2 } },
        ],
    },
    {
        question: "You feel most alive when you are:",
        options: [
            { text: "Exploring a new trail or path", scores: { Adventure: 3 } },
            { text: "Working in sync with a team", scores: { Community: 3 } },
            { text: "In deep focus, perfecting a single movement", scores: { Mindfulness: 3 } },
            { text: "Pushing your body to its absolute peak", scores: { Strength: 2, Endurance: 1 } },
        ],
    },
    {
        question: "Which of these best describes your approach to fitness?",
        options: [
            { text: "A spiritual practice", scores: { Mindfulness: 3, Flexibility: 1 } },
            { text: "A competitive sport", scores: { Community: 2, Strength: 1 } },
            { text: "A personal journey of discovery", scores: { Adventure: 2, Endurance: 1 } },
            { text: "A disciplined routine", scores: { Strength: 2, Mindfulness: 1 } },
        ],
    },
    {
        question: "The most rewarding part of physical activity for you is:",
        options: [
            { text: "Seeing measurable gains in strength or speed", scores: { Strength: 2, Endurance: 1 } },
            { text: "The feeling of belonging to a community", scores: { Community: 3 } },
            { text: "The sense of peace and mental clarity it brings", scores: { Mindfulness: 3 } },
            { text: "The beauty of the natural world around you", scores: { Adventure: 3 } },
        ],
    },
    {
        question: "What role does equipment play in your ideal workout?",
        options: [
            { text: "It's essential for my training (weights, machines)", scores: { Strength: 3 } },
            { text: "Minimal and functional (yoga mat, resistance bands)", scores: { Flexibility: 2, Strength: 1 } },
            { text: "Just my own body and the ground beneath me", scores: { Endurance: 2, Adventure: 1 } },
            { text: "Specialized gear for a specific sport or art", scores: { Mindfulness: 2, Community: 1 } },
        ],
    },
    {
        question: "You are most drawn to movements that are:",
        options: [
            { text: "Explosive and powerful", scores: { Strength: 3 } },
            { text: "Fluid and controlled", scores: { Flexibility: 3, Mindfulness: 1 } },
            { text: "Repetitive and meditative", scores: { Endurance: 3, Mindfulness: 1 } },
            { text: "Unpredictable and adventurous", scores: { Adventure: 3 } },
        ],
    },
    {
        question: "Which phrase resonates most with you?",
        options: [
            { text: "Stronger than yesterday", scores: { Strength: 3 } },
            { text: "Go with the flow", scores: { Flexibility: 2, Mindfulness: 1 } },
            { text: "The journey is the destination", scores: { Adventure: 2, Endurance: 1 } },
            { text: "One team, one dream", scores: { Community: 3 } },
        ],
    },
    {
        question: "Your ideal workout space has:",
        options: [
            { text: "Mirrors to check your form", scores: { Strength: 2, Mindfulness: 1 } },
            { text: "An open floor and calming music", scores: { Flexibility: 3 } },
            { text: "A finish line and a cheering crowd", scores: { Endurance: 2, Community: 1 } },
            { text: "A rugged, natural terrain", scores: { Adventure: 3 } },
        ],
    },
    {
        question: "How do you measure progress?",
        options: [
            { text: "By how much weight I can lift or how fast I can run", scores: { Strength: 2, Endurance: 1 } },
            { text: "By how connected I feel to my body and mind", scores: { Mindfulness: 3, Flexibility: 1 } },
            { text: "By the new places I've explored", scores: { Adventure: 3 } },
            { text: "By how well I work with my teammates", scores: { Community: 3 } },
        ],
    }
  ];

  const handleAnswer = (answerScores: any) => {
    const newScores = { ...scores };
    for (const dim in answerScores) {
      // @ts-ignore
      newScores[dim] += answerScores[dim];
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setPhase("results");
    }
  };

  const styles = {
    container: {
      backgroundColor: 'transparent', position: 'relative', zIndex: 1,
      color: '#2C1810',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Source Sans 3", sans-serif',
    },
    title: {
        fontFamily: '"Playfair Display", serif',
        color: '#8B6914',
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    tagline: {
        fontSize: '1.2rem',
        marginBottom: '2rem',
        fontStyle: 'italic',
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '300px',
        marginBottom: '3rem',
        fontFamily: '"DM Mono", monospace',
    },
    beginButton: {
        backgroundColor: '#D4B96A',
        color: '#0A0A10',
        border: 'none',
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        cursor: 'pointer',
        fontFamily: '"Source Sans 3", sans-serif',
    },
    questionContainer: {
        textAlign: 'center',
    },
    questionText: {
        fontSize: '2rem',
        marginBottom: '3rem',
        fontFamily: '"Playfair Display", serif',
    },
    optionsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    optionButton: {
        backgroundColor: 'transparent',
        border: '1px solid #D4B96A',
        color: '#8B6914',
        padding: '1.5rem',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
  };

  return (
    <>
    <SEO
        title="Find Your Movement"
        description="A personalized movement assessment to find the exercise approach that fits your body and lifestyle."
        path="/find-my/movement"
        keywords="Tony Greenberg, find my movement, exercise finder, personalized fitness"
        indexable={true}
      />
      <>
    <ThemedBackground theme="movement" />
    <div style={styles.container}>
      {phase === "landing" && (
        <AssessmentIntro
          title="Find Your Movement"
          subtitle="The body moves the way the soul needs to go."
          description="Not a fitness quiz. A movement philosophy assessment. Fifteen questions that map how your body wants to express itself — through strength, flow, endurance, play, stillness, or rhythm. Your movement archetype reveals the practice that will actually stick."
          stats={{ questions: 15, dimensions: 6, minutes: 5 }}
          whatYouGet={["Your movement archetype and primary dimension","Understanding of your body's natural movement language","Personalized practice recommendations","Connection to deeper movement resources"]}
          accentColor="#E65100"
          onBegin={() => setPhase('questions')}
        />
      )}

      {phase === "questions" && (
        <div style={styles.questionContainer}>
          <p style={styles.questionText}>{questions[currentQuestionIndex].question}</p>
          <div style={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                style={styles.optionButton}
                onClick={() => handleAnswer(option.scores)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "results" && !emailGated && (
        <EmailGate assessmentName="movement" onUnlock={() => setEmailGated(true)} />
      )}

      {phase === "results" && emailGated && (() => {
        const topDim = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
        return (
          <div style={{ textAlign: 'center', maxWidth: 600 }}>
            <h1 style={styles.title}>Your Movement Archetype</h1>
            <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#8B6914', fontSize: '2rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              The {topDim?.[0] || 'Explorer'} Path
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#2C1810', marginBottom: '2rem' }}>
              Your body wants to move with purpose. Your highest dimension is {topDim?.[0]}, suggesting a movement practice that honors both physical capacity and inner alignment.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
              {Object.entries(scores).map(([dim, val]) => (
                <div key={dim} style={{ background: 'rgba(212,185,106,0.1)', border: '1px solid rgba(139,105,20,0.2)', borderRadius: '6px', padding: '0.6rem 1rem', fontFamily: '"DM Mono", monospace', fontSize: '0.8rem' }}>
                  {dim}: {val}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
          <WhatsNext />
    </div>
    </>
    </>);
};

export default FindYourMovement;
