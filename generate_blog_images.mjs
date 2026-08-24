import { readFileSync, writeFileSync } from 'fs';

// Image prompts for each post without an image - Japanese minimalism meets sacred geometry, metaphorical
const prompts = {
  "forever-chemicals-in-my-blood-pfas-and-microplastics": "Minimalist Japanese ink wash painting of a human figure with translucent skin revealing geometric molecular structures inside the bloodstream, dark indigo and crimson tones, sacred geometry patterns dissolving into water droplets, zen aesthetic with scientific precision",
  "elixir-of-life-device-and-journey": "Sacred geometry mandala made of golden light rays emanating from an ancient vessel, Japanese minimalist composition, warm amber and deep teal, the vessel sits on a zen stone garden, ethereal healing energy radiating outward",
  "luz-lounge-where-loyalty-goes-to-die-groupon": "Japanese minimalist still life of a broken loyalty card dissolving into origami cranes, warm restaurant lighting fading to cold blue, geometric patterns of trust fracturing, wabi-sabi aesthetic",
  "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud": "Dark minimalist composition of a beautiful gilded cage shaped like a gym, sacred geometry patterns in the bars, a single golden key floating outside, Japanese ink wash style with metallic gold accents",
  "dmn8-the-most-beautiful-crooked-gym-in-the-world": "Striking Japanese minimalist image of a perfectly beautiful building with subtly tilted geometric foundations, sacred geometry patterns revealing hidden asymmetry, gold leaf on dark slate, architectural deception rendered beautifully",
  "the-way-of-dao": "Ethereal Japanese ink painting of the Dao symbol rendered in sacred geometry, flowing water and mountain mist, gold and deep black, minimalist zen landscape with geometric overlays, contemplative and vast",
  "an-ode-to-kusaki-where-plants-become-culinary-masterpieces": "Japanese minimalist food art composition of delicate plant-based dishes arranged in sacred geometric patterns on dark ceramic plates, soft natural light, zen garden elements, fresh greens and earth tones",
  "mastering-bd-the-art-of-the-no-that-opens-the-real-door": "Japanese minimalist painting of a closed door with golden light streaming through the cracks forming sacred geometry patterns, dark wood and gold leaf, the word NO dissolving into an open pathway, zen aesthetic",
  "productivity-apps-that-rocked-my-world-in-2024": "Minimalist Japanese composition of floating holographic app interfaces arranged in sacred geometry formation, soft blue and gold light, zen stone garden below, digital meets analog aesthetic",
  "innovative-thinking-with-tony-greenberg-scale-up-show": "Japanese minimalist portrait composition of a microphone and headphones arranged with sacred geometry patterns, podcast studio lighting in warm gold and deep charcoal, zen simplicity meets modern media",
  "more-ignorance-or-indignance-in-the-wake-of-covid-19": "Dark Japanese ink wash of two opposing waves colliding, one representing ignorance and one indignance, sacred geometry patterns in the spray, deep indigo and crimson, powerful and contemplative",
  "the-arithmetic-of-relationships": "Japanese minimalist composition of two intersecting golden circles forming a vesica piscis, sacred geometry of human connection, warm amber light on dark background, mathematical beauty of relationships",
  "save-entrepreneurs-big-business-buying-startup-2": "Japanese minimalist painting of a small bonsai tree being overshadowed by a massive corporate building, sacred geometry patterns connecting them, gold leaf details, the small tree radiating more light than the building",
  "marc-andreessen-rebuttal-2020": "Striking minimalist composition of a chess board with one piece standing against many, Japanese ink wash style, sacred geometry in the board pattern, bold contrast of light and shadow, intellectual confrontation",
  "covid-deniers-need-to-take-a-breath": "Japanese minimalist painting of lungs rendered in sacred geometry patterns, one side clear and golden, one side clouded, zen breath visualization, deep contemplative blue and warm gold",
  "6-act-of-speech-speaking-as-a-tool": "Japanese minimalist composition of six concentric sound waves emanating from a single point, sacred geometry patterns, gold on dark indigo, the power of voice rendered as architectural structure",
  "mastering-human-and-business-development": "Japanese minimalist painting of a human figure and a building growing from the same root system, sacred geometry connecting them, gold and earth tones, zen garden setting, growth as unified concept",
  "forward-health-is-a-sideway-step-at-best": "Japanese minimalist composition of footprints going sideways instead of forward, sacred geometry compass rose, subtle irony in the composition, warm gold on cool grey, zen simplicity",
  "the-decay-of-modern-day-communication": "Japanese minimalist painting of a telephone dissolving into digital particles, sacred geometry patterns fragmenting, warm analog gold fading to cold digital blue, wabi-sabi of communication decay",
  "hiding-fees-tips-in-the-transparent-age": "Japanese minimalist composition of a transparent glass revealing hidden geometric layers beneath, gold coins partially concealed by sacred geometry patterns, dark background, revelation aesthetic",
  "the-tug-of-war-ethical-vs-economic-decisions": "Japanese minimalist painting of a rope in tension forming a sacred geometry pattern, one end gold (ethical) and one end silver (economic), zen balance point in the center, dramatic lighting",
  "eco-vegan-realities-seriesethical-economic": "Japanese minimalist composition of a leaf and a coin balanced on a zen stone, sacred geometry connecting nature and commerce, earth greens and gold, contemplative ecological balance"
};

console.log(JSON.stringify(prompts, null, 2));
console.log('\nTotal prompts:', Object.keys(prompts).length);
