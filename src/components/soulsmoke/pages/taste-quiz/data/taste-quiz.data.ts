// SoulSmoke taste quiz: the eight questions and every piece of UI copy (EN and ES), ported
// unchanged from the SoulSmoke app's client/src/pages/TasteQuiz.tsx (2026-11-10).

export interface QuizQuestion {
  id: string;
  question: string;
  questionEs: string;
  subtext: string;
  subtextEs: string;
  dimension: keyof typeof dimensionWeights;
  options: {
    label: string;
    labelEs: string;
    value: number;
    description: string;
    descriptionEs: string;
  }[];
}

export const dimensionWeights = {
  smoke: 1,
  sweetness: 1,
  funk: 1,
  herbal: 1,
  fruit: 1,
  spice: 1,
  mineral: 1,
  complexity: 1,
};

export const questions: QuizQuestion[] = [
  {
    id: 'smoke',
    question: 'How do you feel about smoke?',
    questionEs: '¿Cómo te sientes con el humo?',
    subtext: 'The signature of mezcal — from whisper to bonfire',
    subtextEs: 'La firma del mezcal — de susurro a fogata',
    dimension: 'smoke',
    options: [
      { label: 'Keep it clean', labelEs: 'Mantenlo limpio', value: 2, description: 'I prefer spirits without smoke', descriptionEs: 'Prefiero destilados sin humo' },
      { label: 'Just a whisper', labelEs: 'Solo un susurro', value: 4, description: 'Subtle smoke that doesn\'t dominate', descriptionEs: 'Humo sutil que no domina' },
      { label: 'Balanced fire', labelEs: 'Fuego equilibrado', value: 6, description: 'Noticeable smoke, but not overwhelming', descriptionEs: 'Humo notable, pero no abrumador' },
      { label: 'Bring the heat', labelEs: 'Trae el calor', value: 8, description: 'I want to taste the palenque', descriptionEs: 'Quiero saborear el palenque' },
      { label: 'Burn it down', labelEs: 'Quémalo todo', value: 10, description: 'Maximum smoke, no apologies', descriptionEs: 'Máximo humo, sin disculpas' },
    ],
  },
  {
    id: 'sweetness',
    question: 'Sweet or austere?',
    questionEs: '¿Dulce o austero?',
    subtext: 'From bone-dry to honey-kissed',
    subtextEs: 'De seco como hueso a besado por miel',
    dimension: 'sweetness',
    options: [
      { label: 'Bone dry', labelEs: 'Seco total', value: 2, description: 'No sweetness, pure agave austerity', descriptionEs: 'Sin dulzura, pura austeridad de agave' },
      { label: 'Barely there', labelEs: 'Apenas presente', value: 4, description: 'Just a hint of natural sweetness', descriptionEs: 'Solo un toque de dulzura natural' },
      { label: 'Balanced', labelEs: 'Equilibrado', value: 6, description: 'Sweet enough to round the edges', descriptionEs: 'Suficiente dulzura para suavizar' },
      { label: 'Fruit-forward', labelEs: 'Frutal', value: 8, description: 'Noticeable sweetness, like ripe fruit', descriptionEs: 'Dulzura notable, como fruta madura' },
      { label: 'Dessert vibes', labelEs: 'Vibras de postre', value: 10, description: 'Rich, honeyed, almost candied', descriptionEs: 'Rico, meloso, casi confitado' },
    ],
  },
  {
    id: 'funk',
    question: 'How funky do you like it?',
    questionEs: '¿Qué tan funky te gusta?',
    subtext: 'The wild side of fermentation — cheese, barnyard, tropical rot',
    subtextEs: 'El lado salvaje de la fermentación — queso, establo, putrefacción tropical',
    dimension: 'funk',
    options: [
      { label: 'Keep it clean', labelEs: 'Mantenlo limpio', value: 2, description: 'No funk, polished and refined', descriptionEs: 'Sin funk, pulido y refinado' },
      { label: 'Hint of wild', labelEs: 'Toque salvaje', value: 4, description: 'Subtle earthiness, nothing crazy', descriptionEs: 'Terroso sutil, nada loco' },
      { label: 'Interesting', labelEs: 'Interesante', value: 6, description: 'Some funk adds character', descriptionEs: 'Algo de funk añade carácter' },
      { label: 'Get weird', labelEs: 'Ponte raro', value: 8, description: 'I like spirits with personality', descriptionEs: 'Me gustan los destilados con personalidad' },
      { label: 'Full barnyard', labelEs: 'Establo completo', value: 10, description: 'Bring the cheese, the funk, the wild', descriptionEs: 'Trae el queso, el funk, lo salvaje' },
    ],
  },
  {
    id: 'herbal',
    question: 'How green should it be?',
    questionEs: '¿Qué tan verde debe ser?',
    subtext: 'Vegetal, earthy, herbaceous — the plant\'s voice',
    subtextEs: 'Vegetal, terroso, herbáceo — la voz de la planta',
    dimension: 'herbal',
    options: [
      { label: 'Not green', labelEs: 'Nada verde', value: 2, description: 'Minimal vegetal character', descriptionEs: 'Carácter vegetal mínimo' },
      { label: 'Touch of herbs', labelEs: 'Toque de hierbas', value: 4, description: 'Subtle green notes', descriptionEs: 'Notas verdes sutiles' },
      { label: 'Garden fresh', labelEs: 'Fresco del jardín', value: 6, description: 'Noticeable herbal presence', descriptionEs: 'Presencia herbal notable' },
      { label: 'Very green', labelEs: 'Muy verde', value: 8, description: 'Strong vegetal, earthy notes', descriptionEs: 'Notas vegetales y terrosas fuertes' },
      { label: 'Jungle floor', labelEs: 'Suelo de selva', value: 10, description: 'Intense green, almost medicinal', descriptionEs: 'Verde intenso, casi medicinal' },
    ],
  },
  {
    id: 'fruit',
    question: 'Fruit or no fruit?',
    questionEs: '¿Fruta o sin fruta?',
    subtext: 'Tropical, citrus, stone fruit — nature\'s candy',
    subtextEs: 'Tropical, cítrico, fruta de hueso — el dulce de la naturaleza',
    dimension: 'fruit',
    options: [
      { label: 'No fruit', labelEs: 'Sin fruta', value: 2, description: 'Pure agave, no fruity notes', descriptionEs: 'Puro agave, sin notas frutales' },
      { label: 'Subtle hints', labelEs: 'Toques sutiles', value: 4, description: 'Maybe a whisper of citrus', descriptionEs: 'Quizás un susurro de cítrico' },
      { label: 'Fruit-kissed', labelEs: 'Besado por fruta', value: 6, description: 'Noticeable fruit character', descriptionEs: 'Carácter frutal notable' },
      { label: 'Tropical', labelEs: 'Tropical', value: 8, description: 'Strong fruit presence', descriptionEs: 'Fuerte presencia frutal' },
      { label: 'Fruit bomb', labelEs: 'Bomba frutal', value: 10, description: 'Mango, pineapple, the works', descriptionEs: 'Mango, piña, todo' },
    ],
  },
  {
    id: 'spice',
    question: 'How spicy?',
    questionEs: '¿Qué tan picante?',
    subtext: 'Pepper, warming, heat — the agave\'s fire',
    subtextEs: 'Pimienta, calidez, calor — el fuego del agave',
    dimension: 'spice',
    options: [
      { label: 'No heat', labelEs: 'Sin calor', value: 2, description: 'Smooth, no spice', descriptionEs: 'Suave, sin especias' },
      { label: 'Gentle warmth', labelEs: 'Calidez suave', value: 4, description: 'Subtle pepper notes', descriptionEs: 'Notas de pimienta sutiles' },
      { label: 'Balanced spice', labelEs: 'Especias equilibradas', value: 6, description: 'Noticeable but not dominant', descriptionEs: 'Notable pero no dominante' },
      { label: 'Peppery', labelEs: 'Picante', value: 8, description: 'Strong spice presence', descriptionEs: 'Fuerte presencia de especias' },
      { label: 'Fire walk', labelEs: 'Camino de fuego', value: 10, description: 'Intense warming spice', descriptionEs: 'Especias intensamente cálidas' },
    ],
  },
  {
    id: 'mineral',
    question: 'Mineral character?',
    questionEs: '¿Carácter mineral?',
    subtext: 'Wet stone, chalk, terroir — the land speaks',
    subtextEs: 'Piedra mojada, tiza, terroir — la tierra habla',
    dimension: 'mineral',
    options: [
      { label: 'Soft', labelEs: 'Suave', value: 2, description: 'No mineral notes', descriptionEs: 'Sin notas minerales' },
      { label: 'Subtle stone', labelEs: 'Piedra sutil', value: 4, description: 'Hint of minerality', descriptionEs: 'Toque de mineralidad' },
      { label: 'Terroir-driven', labelEs: 'Impulsado por terroir', value: 6, description: 'Clear mineral presence', descriptionEs: 'Clara presencia mineral' },
      { label: 'Rocky', labelEs: 'Rocoso', value: 8, description: 'Strong wet stone character', descriptionEs: 'Fuerte carácter de piedra mojada' },
      { label: 'Lick a rock', labelEs: 'Lame una roca', value: 10, description: 'Intense mineral, volcanic', descriptionEs: 'Mineral intenso, volcánico' },
    ],
  },
  {
    id: 'complexity',
    question: 'Simple or complex?',
    questionEs: '¿Simple o complejo?',
    subtext: 'Direct and clean vs. layered and evolving',
    subtextEs: 'Directo y limpio vs. capas y evolución',
    dimension: 'complexity',
    options: [
      { label: 'Keep it simple', labelEs: 'Mantenlo simple', value: 2, description: 'Clean, direct, easy to understand', descriptionEs: 'Limpio, directo, fácil de entender' },
      { label: 'Straightforward', labelEs: 'Directo', value: 4, description: 'Clear flavors, not too complex', descriptionEs: 'Sabores claros, no muy complejo' },
      { label: 'Interesting', labelEs: 'Interesante', value: 6, description: 'Some layers to explore', descriptionEs: 'Algunas capas para explorar' },
      { label: 'Complex', labelEs: 'Complejo', value: 8, description: 'Multiple layers, evolving', descriptionEs: 'Múltiples capas, evolucionando' },
      { label: 'PhD level', labelEs: 'Nivel doctorado', value: 10, description: 'Maximum complexity, endless discovery', descriptionEs: 'Máxima complejidad, descubrimiento infinito' },
    ],
  },
];

export const tasteQuizData = {
  brand: "MEZCAL",
  en: {
    skip: "Skip to Quadrant",
    questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
    back: "Back",
    seeResults: "See My Recommendations",
    retake: "Retake Quiz",
    eyebrow: "Your Personalized Picks",
    title: "Your Top 10 Quest List",
    intro:
      "Based on your preferences, these are the bottles that will speak to your palate. Hunt them down, one by one.",
    profile: "Your Flavor Profile",
    match: "match",
    saved: "Saved",
    save: "Save",
    quadrant: "Explore the Quadrant",
    huntList: "View My Hunt List",
  },
  es: {
    skip: "Saltar al Cuadrante",
    questionOf: (n: number, total: number) => `Pregunta ${n} de ${total}`,
    back: "Atrás",
    seeResults: "Ver Mis Recomendaciones",
    retake: "Repetir Quiz",
    eyebrow: "Tus Selecciones Personalizadas",
    title: "Tu Lista de 10 Búsquedas",
    intro:
      "Basado en tus preferencias, estas son las botellas que hablarán a tu paladar. Cázalas, una por una.",
    profile: "Tu Perfil de Sabor",
    match: "coincidencia",
    saved: "Guardado",
    save: "Guardar",
    quadrant: "Explorar el Cuadrante",
    huntList: "Ver Mi Lista de Búsqueda",
  },
  market: { us: "US", mexico: "MX", both: "Both" },
};
