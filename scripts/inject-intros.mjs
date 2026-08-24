/**
 * Script to inject AssessmentIntro component into all assessment landing pages.
 * 
 * For each assessment, this script:
 * 1. Adds the AssessmentIntro import if missing
 * 2. Replaces the existing landing page content with <AssessmentIntro ... />
 * 
 * Run: node scripts/inject-intros.mjs
 */
import fs from 'fs';
import path from 'path';

const ASSESSMENTS = [
  {
    file: 'FindYourDiet.tsx',
    title: 'Find Your Diet',
    subtitle: "Your body has been trying to tell you what it needs. Time to listen.",
    description: "This isn't another meal plan quiz. It's a deep dive into your metabolic type, gut health patterns, inflammation markers, energy cycles, and relationship with food. Fifteen questions that decode the conversation your body's been having without you.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your unique dietary archetype (one of six)",
      "A personalized nutrition dimension map",
      "Insight into your metabolic type and energy patterns",
      "Actionable next steps for your body's actual needs",
    ],
    accentColor: '#7CB342',
    landingPattern: 'LandingPage',
  },
  {
    file: 'FindYourKitchen.tsx',
    title: 'Find Your Kitchen',
    subtitle: "The kitchen is the last honest room in the house.",
    description: "From fermentation alchemy to fire mastery, from farm-to-table purism to fusion exploration — this assessment maps your culinary identity across technique, sourcing, cultural curiosity, presentation, improvisation, and hospitality. Fifteen questions to find out who you really are when you cook.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your kitchen archetype (Alchemist, Purist, Explorer, Architect, Fire Master, or Communal Cook)",
      "A radar chart of your culinary dimensions",
      "Understanding of your cooking philosophy",
      "Curated next steps in your culinary journey",
    ],
    accentColor: '#E65100',
    landingPattern: 'renderLanding',
  },
  {
    file: 'FindYourMovement.tsx',
    title: 'Find Your Movement',
    subtitle: "The body moves the way the soul needs to go.",
    description: "Not a fitness quiz. A movement philosophy assessment. Fifteen questions that map how your body wants to express itself — through strength, flow, endurance, play, stillness, or rhythm. Your movement archetype reveals the practice that will actually stick.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your movement archetype and primary dimension",
      "Understanding of your body's natural movement language",
      "Personalized practice recommendations",
      "Connection to deeper movement resources",
    ],
    accentColor: '#E65100',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourSleep.tsx',
    title: 'Find Your Sleep',
    subtitle: "The night knows things the day refuses to admit.",
    description: "Your sleep architecture is as unique as your fingerprint. This assessment maps your chronotype, sleep environment needs, dream patterns, wind-down rituals, and the hidden anxieties that keep you staring at the ceiling. Fifteen questions to decode your relationship with the dark.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your sleep archetype and chronotype profile",
      "A map of your sleep dimensions",
      "Personalized sleep environment recommendations",
      "Insight into your circadian rhythm patterns",
    ],
    accentColor: '#7E57C2',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourStyle.tsx',
    title: 'Find Your Style',
    subtitle: "Style isn't what you wear. It's what you can't hide.",
    description: "Beyond trends, beyond brands, beyond what the algorithm thinks you should buy. This assessment maps your aesthetic identity across six dimensions — revealing the visual language that's authentically yours. Fifteen questions to find the style that was always there.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your style archetype and aesthetic DNA",
      "A dimensional map of your visual identity",
      "Understanding of your relationship with self-expression",
      "Curated style direction that actually fits who you are",
    ],
    accentColor: '#AD1457',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourLoveLanguage.tsx',
    title: 'Find Your Love Language',
    subtitle: "Love isn't one language. It's five — and you've been mistranslating.",
    description: "Based on the five love languages framework, this assessment goes deeper than the standard quiz. It maps not just how you give love, but how you need to receive it — and where the gap between those two creates the loneliness you can't explain.",
    stats: { questions: 15, dimensions: 5, minutes: 3 },
    whatYouGet: [
      "Your primary and secondary love languages",
      "The gap between how you give and receive love",
      "Insight into your relationship communication patterns",
      "Practical steps for deeper connection",
    ],
    accentColor: '#C62828',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourAttachmentStyle.tsx',
    title: 'Find Your Attachment Style',
    subtitle: "How you love is how you were loved. Until you choose differently.",
    description: "Rooted in attachment theory, this assessment maps the invisible architecture of your relationships. Secure, anxious, avoidant, or disorganized — and more importantly, the specific patterns that keep you repeating what you swore you'd never repeat.",
    stats: { questions: 15, dimensions: 4, minutes: 5 },
    whatYouGet: [
      "Your attachment style profile across four dimensions",
      "Understanding of your relationship patterns",
      "Insight into your triggers and defense mechanisms",
      "A path toward earned secure attachment",
    ],
    accentColor: '#AD1457',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourSexuality.tsx',
    title: 'Find Your Sexuality',
    subtitle: "The body knows what the mind is still debating.",
    description: "A thoughtful, research-informed exploration of desire, identity, and intimacy. This assessment maps your relationship with your own sexuality across multiple dimensions — without judgment, without labels, without the noise. Just honest questions and honest answers.",
    stats: { questions: 20, dimensions: 7, minutes: 7 },
    whatYouGet: [
      "Your sexuality profile across seven dimensions",
      "Understanding of your desire patterns and intimacy style",
      "Insight into the relationship between identity and expression",
      "Resources for deeper exploration",
    ],
    accentColor: '#C2185B',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourSpirit.tsx',
    title: 'Find Your Spirit',
    subtitle: "The spirit doesn't need to be found. It needs to be remembered.",
    description: "Not religion. Not dogma. The raw, unmediated experience of something larger than yourself. This assessment maps your spiritual orientation across contemplation, service, nature, creativity, community, and transcendence — revealing the practice that will actually nourish your soul.",
    stats: { questions: 18, dimensions: 6, minutes: 6 },
    whatYouGet: [
      "Your spiritual archetype and primary orientation",
      "A dimensional map of your spiritual landscape",
      "Understanding of your relationship with transcendence",
      "Curated practices aligned with your spiritual DNA",
    ],
    accentColor: '#00838F',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourTherapy.tsx',
    title: 'Find Your Therapy',
    subtitle: "The right therapy isn't about fixing what's broken. It's about meeting who you actually are.",
    description: "CBT, psychodynamic, somatic, EMDR, psychedelic-assisted, IFS — the landscape of therapeutic modalities is vast and confusing. This assessment maps your psychological profile to find the approach that matches how your mind actually works, not just what's trending.",
    stats: { questions: 20, dimensions: 6, minutes: 7 },
    whatYouGet: [
      "Your therapeutic archetype and recommended modalities",
      "A map of your psychological processing style",
      "Understanding of what kind of therapeutic relationship you need",
      "Curated resources for your specific journey",
    ],
    accentColor: '#7B1FA2',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourReligion.tsx',
    title: 'Find Your Religion',
    subtitle: "Faith isn't inherited. It's discovered.",
    description: "Whether you're deeply devout, spiritually curious, or militantly secular — this assessment maps your relationship with organized belief, ritual, community, ethics, mystery, and meaning. No judgment. No conversion. Just clarity about where you actually stand.",
    stats: { questions: 20, dimensions: 6, minutes: 7 },
    whatYouGet: [
      "Your religious/philosophical archetype",
      "A dimensional map of your relationship with belief",
      "Understanding of what draws you to (or repels you from) organized faith",
      "Resources aligned with your actual worldview",
    ],
    accentColor: '#F9A825',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourSake.tsx',
    title: 'Find Your Sake',
    subtitle: "Every cup holds a thousand years of intention.",
    description: "Sake is not just a drink — it's a philosophy of water, rice, craft, and time. This assessment maps your palate, your aesthetic sensibility, and your relationship with Japanese culture to find the sake that was made for someone exactly like you.",
    stats: { questions: 15, dimensions: 6, minutes: 5 },
    whatYouGet: [
      "Your sake archetype and flavor profile",
      "A dimensional map of your palate preferences",
      "Understanding of your aesthetic relationship with craft",
      "Curated sake recommendations for your profile",
    ],
    accentColor: '#8D6E63',
    landingPattern: 'inline-landing',
  },
  {
    file: 'FindYourPeptide.tsx',
    title: 'Find Your Peptide',
    subtitle: "Your biology is speaking in molecules. Time to learn the language.",
    description: "Peptides are the body's signaling molecules — tiny chains of amino acids that regulate everything from sleep to inflammation to cognitive function. This assessment maps your biological needs to find the peptide protocols that match your specific optimization goals.",
    stats: { questions: 18, dimensions: 6, minutes: 6 },
    whatYouGet: [
      "Your peptide profile and primary biological needs",
      "A dimensional map of your optimization priorities",
      "Understanding of which peptide protocols match your goals",
      "Evidence-based resources for informed decisions",
    ],
    accentColor: '#00838F',
    landingPattern: 'inline-landing',
  },
];

// Process each assessment file
for (const assessment of ASSESSMENTS) {
  const filePath = path.join(process.cwd(), 'client/src/pages', assessment.file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Add import if missing
  if (!content.includes('AssessmentIntro')) {
    // Add import after the last existing import
    const lastImportIndex = content.lastIndexOf("import ");
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfLastImport + 1) +
      "import AssessmentIntro from '@/components/AssessmentIntro';\n" +
      content.slice(endOfLastImport + 1);
  }
  
  // 2. Build the AssessmentIntro JSX
  const introJSX = `<AssessmentIntro
          title="${assessment.title}"
          subtitle="${assessment.subtitle}"
          description="${assessment.description}"
          stats={{ questions: ${assessment.stats.questions}, dimensions: ${assessment.stats.dimensions}, minutes: ${assessment.stats.minutes} }}
          whatYouGet={${JSON.stringify(assessment.whatYouGet)}}
          accentColor="${assessment.accentColor}"
          onBegin={() => setPhase('questions')}
        />`;
  
  // 3. Replace existing landing content based on pattern type
  if (assessment.landingPattern === 'LandingPage') {
    // Pattern: const LandingPage = () => ( ... );
    // Replace the LandingPage component body
    const lpStart = content.indexOf('const LandingPage = () =>');
    if (lpStart !== -1) {
      // Find the matching closing
      const lpBodyStart = content.indexOf('(', lpStart);
      let depth = 0;
      let i = lpBodyStart;
      for (; i < content.length; i++) {
        if (content[i] === '(') depth++;
        if (content[i] === ')') depth--;
        if (depth === 0) break;
      }
      // Find the semicolon after the closing paren
      const lpEnd = content.indexOf(';', i) + 1;
      content = content.slice(0, lpStart) +
        `const LandingPage = () => (\n    ${introJSX}\n  );` +
        content.slice(lpEnd);
    }
  } else if (assessment.landingPattern === 'renderLanding') {
    // Pattern: const renderLanding = () => ( ... );
    const lpStart = content.indexOf('const renderLanding = () =>');
    if (lpStart !== -1) {
      const lpBodyStart = content.indexOf('(', lpStart);
      let depth = 0;
      let i = lpBodyStart;
      for (; i < content.length; i++) {
        if (content[i] === '(') depth++;
        if (content[i] === ')') depth--;
        if (depth === 0) break;
      }
      const lpEnd = content.indexOf(';', i) + 1;
      content = content.slice(0, lpStart) +
        `const renderLanding = () => (\n    ${introJSX}\n  );` +
        content.slice(lpEnd);
    }
  } else if (assessment.landingPattern === 'inline-landing') {
    // Pattern: {phase === "landing" && ( <> ... </> )} or similar inline JSX
    // We need to find the landing phase block and replace its content
    
    // Try multiple patterns
    const patterns = [
      // Pattern 1: {phase === "landing" && ( <> ... </> )}
      /\{phase\s*===\s*["']landing["']\s*&&\s*\(\s*<>/,
      // Pattern 2: {phase === "landing" && ( <div ... </div> )}
      /\{phase\s*===\s*["']landing["']\s*&&\s*\(\s*<div/,
      // Pattern 3: {phase === 'landing' && <> ... </>}
      /\{phase\s*===\s*["']landing["']\s*&&\s*<>/,
    ];
    
    let found = false;
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const startIdx = match.index;
        // Find the end of this JSX block by counting braces
        let braceDepth = 0;
        let i = startIdx;
        for (; i < content.length; i++) {
          if (content[i] === '{') braceDepth++;
          if (content[i] === '}') {
            braceDepth--;
            if (braceDepth === 0) break;
          }
        }
        content = content.slice(0, startIdx) +
          `{phase === "landing" && (\n        ${introJSX}\n      )}` +
          content.slice(i + 1);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log(`WARNING: Could not find landing pattern in ${assessment.file}`);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated ${assessment.file}`);
}

console.log('\nDone! All assessment intros injected.');
