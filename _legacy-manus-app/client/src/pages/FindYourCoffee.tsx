// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import EmailGate from "@/components/EmailGate";
import WhatsNext from "@/components/WhatsNext";
import SEO from "@/components/SEO";

const assessmentId = 'find-your-coffee';
const localStorageKey = 'coffee_results';

const HERO_IMG = "/api/img/coffee-orig_a935f111.jpg";
const BEANS_BG = "/api/img/coffee-orig_a935f111.jpg";

const dimensions = [
  'Roast Preference',
  'Origin Curiosity',
  'Brewing Ritual',
  'Social Context',
  'Caffeine Sensitivity',
  'Flavor Complexity',
];

const questions = [
  {
    text: 'When you think of your ideal coffee, what first comes to mind?',
    options: [
      { text: 'A deep, dark, and intense flavor', scores: { 'Roast Preference': 2 } },
      { text: 'A rare bean from a specific farm in Ethiopia', scores: { 'Origin Curiosity': 2 } },
      { text: 'The calming process of grinding and brewing', scores: { 'Brewing Ritual': 2 } },
      { text: 'A complex, multi-layered taste experience', scores: { 'Flavor Complexity': 2 } },
    ],
  },
  {
    text: 'How do you typically enjoy your coffee?',
    options: [
      { text: 'Alone, as a moment of quiet contemplation', scores: { 'Social Context': -1 } },
      { text: 'With friends at a bustling cafe', scores: { 'Social Context': 1 } },
      { text: 'As a quick fuel-up during a busy day', scores: { 'Caffeine Sensitivity': 1 } },
      { text: 'As a post-dinner treat', scores: { 'Caffeine Sensitivity': -1 } },
    ],
  },
  {
    text: 'Which brewing method are you most drawn to?',
    options: [
      { text: 'A classic espresso machine', scores: { 'Brewing Ritual': 1, 'Flavor Complexity': 1 } },
      { text: 'A meticulous pour-over setup', scores: { 'Brewing Ritual': 2, 'Origin Curiosity': 1 } },
      { text: 'A simple, reliable drip coffee maker', scores: { 'Brewing Ritual': -1 } },
      { text: 'An ancient, traditional method like a cezve', scores: { 'Origin Curiosity': 1, 'Brewing Ritual': 1 } },
    ],
  },
  {
    text: 'How much caffeine do you prefer in your coffee?',
    options: [
      { text: 'As much as possible!', scores: { 'Caffeine Sensitivity': 2 } },
      { text: 'A moderate amount to get me going', scores: { 'Caffeine Sensitivity': 0 } },
      { text: 'I prefer decaf or low-caffeine options', scores: { 'Caffeine Sensitivity': -2 } },
      { text: 'It depends on the time of day', scores: { 'Caffeine Sensitivity': 0 } },
    ],
  },
  {
    text: 'What kind of flavors do you seek in a coffee?',
    options: [
      { text: 'Earthy, chocolatey, and nutty notes', scores: { 'Flavor Complexity': -1, 'Roast Preference': 1 } },
      { text: 'Bright, fruity, and floral notes', scores: { 'Flavor Complexity': 1, 'Origin Curiosity': 1 } },
      { text: 'A balanced, clean, and simple cup', scores: { 'Flavor Complexity': -2 } },
      { text: 'Spicy, exotic, and unconventional flavors', scores: { 'Flavor Complexity': 2 } },
    ],
  },
  {
    text: 'How important is the origin of your coffee beans to you?',
    options: [
      { text: 'Extremely important; I want to know the farm and varietal', scores: { 'Origin Curiosity': 2 } },
      { text: 'Somewhat important; I like to know the country or region', scores: { 'Origin Curiosity': 1 } },
      { text: 'Not very important; I just want it to taste good', scores: { 'Origin Curiosity': -1 } },
      { text: "I'm curious to learn more about it", scores: { 'Origin Curiosity': 0 } },
    ],
  },
  {
    text: 'Describe your ideal coffee-making process.',
    options: [
      { text: 'Quick and efficient, under 5 minutes', scores: { 'Brewing Ritual': -2 } },
      { text: 'A precise, multi-step process I can perfect', scores: { 'Brewing Ritual': 2 } },
      { text: 'A social activity to do with others', scores: { 'Social Context': 1, 'Brewing Ritual': 0 } },
      { text: 'An automated process I can set and forget', scores: { 'Brewing Ritual': -1 } },
    ],
  },
  {
    text: 'Where is your favorite place to drink coffee?',
    options: [
      { text: 'A cozy corner in my home', scores: { 'Social Context': -2 } },
      { text: 'A trendy, third-wave coffee shop', scores: { 'Social Context': 1, 'Origin Curiosity': 1 } },
      { text: 'Outdoors, in nature', scores: { 'Social Context': 0 } },
      { text: 'At my desk while I work', scores: { 'Social Context': -1 } },
    ],
  },
  {
    text: 'How do you feel about adding milk or sugar to your coffee?',
    options: [
      { text: 'Never! I drink it black to appreciate the pure flavor.', scores: { 'Flavor Complexity': 1, 'Roast Preference': 1 } },
      { text: 'I enjoy a little milk to balance the acidity.', scores: { 'Flavor Complexity': -1 } },
      { text: 'I love a sweet, creamy latte or cappuccino.', scores: { 'Flavor Complexity': -2, 'Social Context': 1 } },
      { text: 'It depends on the coffee and my mood.', scores: { 'Flavor Complexity': 0 } },
    ],
  },
  {
    text: 'What roast level do you gravitate towards?',
    options: [
      { text: "Light roast, to preserve the bean's delicate nuances.", scores: { 'Roast Preference': -2, 'Origin Curiosity': 1 } },
      { text: 'Medium roast, for a balanced and versatile cup.', scores: { 'Roast Preference': 0 } },
      { text: 'Dark roast, for a bold and smoky flavor.', scores: { 'Roast Preference': 2 } },
      { text: "I'm not sure, I'm open to all roast levels.", scores: { 'Roast Preference': 0 } },
    ],
  },
  {
    text: 'How willing are you to experiment with your coffee routine?',
    options: [
      { text: 'I have my go-to method and I stick with it.', scores: { 'Brewing Ritual': -1 } },
      { text: "I'm always trying new beans, methods, and recipes.", scores: { 'Brewing Ritual': 1, 'Origin Curiosity': 1, 'Flavor Complexity': 1 } },
      { text: "I'll try something new if a friend recommends it.", scores: { 'Social Context': 1 } },
      { text: 'I like to experiment, but I have a few trusted favorites.', scores: { 'Brewing Ritual': 0 } },
    ],
  },
  {
    text: 'What role does coffee play in your social life?',
    options: [
      { text: "It's the centerpiece of my social gatherings.", scores: { 'Social Context': 2 } },
      { text: "It's a good excuse to catch up with a friend.", scores: { 'Social Context': 1 } },
      { text: 'I prefer to drink coffee alone.', scores: { 'Social Context': -2 } },
      { text: "It doesn't play a significant role.", scores: { 'Social Context': -1 } },
    ],
  },
  {
    text: 'How does coffee affect your energy levels?',
    options: [
      { text: 'It gives me a powerful, immediate boost.', scores: { 'Caffeine Sensitivity': 2 } },
      { text: 'It provides a gentle, sustained lift.', scores: { 'Caffeine Sensitivity': 1 } },
      { text: "I'm very sensitive; a little goes a long way.", scores: { 'Caffeine Sensitivity': -1 } },
      { text: 'I can drink it right before bed and still sleep soundly.', scores: { 'Caffeine Sensitivity': -2 } },
    ],
  },
  {
    text: "You're at a cafe with a huge menu. What do you order?",
    options: [
      { text: 'The single-origin pour-over of the day.', scores: { 'Origin Curiosity': 2, 'Flavor Complexity': 1 } },
      { text: 'A perfectly pulled shot of their house espresso.', scores: { 'Roast Preference': 1, 'Flavor Complexity': 1 } },
      { text: "An iced cold brew, even if it's cold outside.", scores: { 'Brewing Ritual': 1, 'Caffeine Sensitivity': 1 } },
      { text: 'A beautifully crafted latte with intricate art.', scores: { 'Social Context': 1, 'Flavor Complexity': -1 } },
    ],
  },
  {
    text: 'The story behind the bean is...',
    options: [
      { text: '...as important as the taste itself.', scores: { 'Origin Curiosity': 2 } },
      { text: '...a nice bonus, but not essential.', scores: { 'Origin Curiosity': 1 } },
      { text: "...something I've never really thought about.", scores: { 'Origin Curiosity': -1 } },
      { text: '...less important than the brewing technique.', scores: { 'Brewing Ritual': 1 } },
    ],
  }
];

const archetypes = {
  'The Single Origin Purist': {
    description: 'You are a connoisseur, a seeker of authenticity. For you, coffee is about terroir and transparency. You want to taste the place in your cup\u2014the soil, the altitude, the climate. Each brew is a celebration of a single, exceptional bean.',
    dimensions: ['Origin Curiosity', 'Flavor Complexity'],
    recommendations: [
      { name: 'Ethiopian Yirgacheffe Kochere', origin: 'Kochere, Gedeo Zone, Ethiopia', roast: 'Light', notes: 'Jasmine, bergamot, lemon zest, raw honey', why: 'The gold standard for single-origin transparency. Heirloom varietals grown at 1,800–2,200m with traceable lot numbers. Each sip is a postcard from the birthplace of coffee.' },
      { name: 'Gesha Village Estate Lot', origin: 'Bench Maji, Ethiopia', roast: 'Light', notes: 'Tropical fruit, champagne effervescence, rose water', why: 'The rarest cultivar on earth, grown at its genetic origin. Competition-grade lots with full traceability from seed to cup. This is terroir at its most profound.' },
      { name: 'Kenya AA Nyeri Peaberry', origin: 'Nyeri County, Kenya', roast: 'Light–Medium', notes: 'Blackcurrant, grapefruit, brown sugar, tomato-like acidity', why: 'Peaberry beans develop as a single round seed, concentrating flavor. Kenyan AA grading ensures the largest, most complex beans. The SL-28 varietal delivers unmistakable origin character.' },
      { name: 'Panama Hacienda La Esmeralda', origin: 'Boquete, Chiriqu\u00ed, Panama', roast: 'Light', notes: 'Mandarin orange, jasmine, papaya, silky body', why: 'The farm that launched the Gesha revolution. Micro-lot auctions regularly exceed $1,000/lb. Each harvest is a vintage, and the terroir of Volc\u00e1n Bar\u00fa is unmistakable.' },
      { name: 'Colombian Huila Supremo', origin: 'Huila Department, Colombia', roast: 'Medium', notes: 'Caramel, red apple, milk chocolate, walnut', why: 'Huila\'s volcanic soil and ideal altitude produce Colombia\'s most celebrated single-origin. Supremo grade ensures bean size and consistency. A purist\'s everyday luxury.' },
    ],
  },
  'The Espresso Architect': {
    description: 'Precision, intensity, and structure define your coffee philosophy. You appreciate the science and art of a perfectly extracted espresso\u2014the rich crema, the syrupy body, the powerful, concentrated flavor. You see coffee as a craft to be mastered.',
    dimensions: ['Roast Preference', 'Flavor Complexity'],
    recommendations: [
      { name: 'Lavazza Super Crema', origin: 'Brazil, Colombia, India, Indonesia (Blend)', roast: 'Medium', notes: 'Hazelnut, brown sugar, mild dried fruit, velvety crema', why: 'The Italian bar standard. Engineered for espresso extraction with a blend ratio that produces thick, persistent crema and a balanced, never-bitter shot every time.' },
      { name: 'Illy Classico Espresso', origin: 'Brazil, Ethiopia, India, Guatemala (Blend)', roast: 'Medium', notes: 'Caramel, orange blossom, toasted bread, chocolate', why: 'Nine origins, one perfect balance. Illy\'s proprietary blend is pressure-packed in nitrogen to preserve freshness. The definition of architectural precision in a cup.' },
      { name: 'Intelligentsia Black Cat Espresso', origin: 'Brazil, Colombia (Seasonal Blend)', roast: 'Medium', notes: 'Dark chocolate, molasses, cherry, syrupy body', why: 'A third-wave classic designed for the 25-second pull. The blend shifts seasonally but the profile stays locked: thick body, sweet finish, zero bitterness.' },
      { name: 'Blue Bottle Giant Steps', origin: 'Ethiopia, Uganda, Sumatra (Blend)', roast: 'Medium–Dark', notes: 'Fudge, stone fruit, smoky undertone, heavy body', why: 'Named after Coltrane\'s masterpiece. Designed to shine as espresso with or without milk. The kind of shot that makes you close your eyes.' },
      { name: 'Stumptown Hair Bender', origin: 'Latin America, East Africa, Indonesia (Blend)', roast: 'Medium', notes: 'Citrus, dark chocolate, toffee, sweet smoke', why: 'Portland\'s most iconic espresso blend. Complex enough to drink straight, structured enough to cut through milk. A masterclass in blend architecture.' },
    ],
  },
  'The Pour-Over Monk': {
    description: 'For you, coffee is a meditation. The slow, deliberate ritual of the pour-over is as important as the final cup. You find beauty in the process, the control, and the clarity of flavor that this mindful method produces.',
    dimensions: ['Brewing Ritual', 'Origin Curiosity'],
    recommendations: [
      { name: 'Counter Culture Hologram', origin: 'Ethiopia, Colombia (Seasonal Blend)', roast: 'Light', notes: 'Stone fruit, floral, citrus, clean finish', why: 'Designed specifically for pour-over clarity. The light roast preserves delicate aromatics that bloom during a slow, controlled pour. Each cup rewards patience.' },
      { name: 'Onyx Coffee Lab Monarch', origin: 'Ethiopia (Single Origin)', roast: 'Light', notes: 'Blueberry, dark chocolate, lavender, wine-like body', why: 'A competition-winning natural process Ethiopian that transforms during a V60 pour-over. The 4-minute brew time unlocks layers that faster methods miss entirely.' },
      { name: 'George Howell Mamuto AA', origin: 'Nyeri, Kenya', roast: 'Light', notes: 'Raspberry, grapefruit, brown sugar, silky mouthfeel', why: 'George Howell pioneered specialty coffee in America. This Kenyan lot is selected specifically for filter brewing. The clarity in a Chemex is transcendent.' },
      { name: 'Verve Sermon', origin: 'Latin America (Seasonal Blend)', roast: 'Light–Medium', notes: 'Milk chocolate, nougat, orange, round sweetness', why: 'A pour-over-friendly blend that forgives minor technique variations while still rewarding precision. The monk\'s daily practice bean.' },
      { name: 'Tim Wendelboe Finca Tamana', origin: 'Huila, Colombia', roast: 'Light', notes: 'Caramel, red grape, jasmine, buttery body', why: 'From the World Barista Champion\'s own roastery in Oslo. Roasted specifically for filter methods. The kind of bean that makes a pour-over feel like a ceremony.' },
    ],
  },
  'The Cold Brew Rebel': {
    description: 'You walk your own path, unbound by tradition. You prefer the smooth, low-acid, and highly caffeinated kick of cold brew. Your approach is patient, unconventional, and yields a result that is both potent and refreshing.',
    dimensions: ['Caffeine Sensitivity', 'Brewing Ritual'],
    recommendations: [
      { name: 'Bizzy Organic Cold Brew Blend', origin: 'Central & South America (Blend)', roast: 'Medium–Dark', notes: 'Smooth chocolate, caramel, low acidity, clean finish', why: 'Purpose-built for cold extraction. Coarse-ground and optimized for 12–24 hour steeping. The result is impossibly smooth with zero bitterness and maximum caffeine.' },
      { name: 'Stone Street Cold Brew Reserve', origin: 'Colombia (Single Origin)', roast: 'Dark', notes: 'Dark chocolate, cherry, smoky, full body', why: 'Colombian supremo beans dark-roasted specifically for cold water extraction. The 100% Arabica beans deliver a concentrate that\'s bold enough to stand up to ice and milk.' },
      { name: 'Chameleon Cold Brew Whole Bean', origin: 'Peru, Mexico, Guatemala (Blend)', roast: 'Medium–Dark', notes: 'Cocoa, brown sugar, nutty, mellow acidity', why: 'Organic, fair-trade, and engineered for the rebel\'s 24-hour steep. Makes a concentrate so smooth you can drink it straight from the jar.' },
      { name: 'Death Wish Coffee', origin: 'India, Peru (Blend)', roast: 'Dark', notes: 'Cherry, chocolate, bold, extremely high caffeine', why: 'The world\'s strongest coffee, cold-brewed. For the rebel who wants maximum potency. A single concentrate serving packs roughly 300mg of caffeine.' },
      { name: 'Stumptown Cold Brew Blend', origin: 'Latin America, Africa (Blend)', roast: 'Medium', notes: 'Citrus, chocolate, sweet, clean', why: 'The blend that helped launch the cold brew revolution. Stumptown\'s roast profile is calibrated for cold extraction\'s slower chemistry. Rebellion tastes this good.' },
    ],
  },
  'The Turkish Traditionalist': {
    description: 'You are drawn to the ancient, communal roots of coffee. You appreciate the thick, potent, and unfiltered brew of the cezve, a method steeped in history and ceremony. For you, coffee is a shared experience that connects generations.',
    dimensions: ['Social Context', 'Brewing Ritual'],
    recommendations: [
      { name: 'Kurukahveci Mehmet Efendi', origin: 'Brazil, Central America (Blend)', roast: 'Medium', notes: 'Earthy, cardamom-friendly, thick body, lingering finish', why: 'The definitive Turkish coffee since 1871. Pre-ground to the powder-fine consistency that cezve brewing demands. This is the brand served in Istanbul\'s grand bazaar.' },
      { name: 'Nuri Toplar T\u00fcrk Kahvesi', origin: 'Brazil, Ethiopia (Blend)', roast: 'Medium–Dark', notes: 'Smoky, spiced, full body, bittersweet chocolate', why: 'From Istanbul\'s oldest coffee roaster (est. 1890). Stone-ground to the exact fineness required for proper foam formation. The taste of Ottoman tradition.' },
      { name: 'Al Ameed Turkish Coffee with Cardamom', origin: 'Brazil, Colombia (Blend)', roast: 'Medium', notes: 'Cardamom, sweet spice, creamy, aromatic', why: 'Pre-blended with cardamom in the Gulf tradition. The spice is integrated during roasting, not after. Perfect for the traditionalist who honors the communal ritual.' },
      { name: 'Najjar Selection Turkish Coffee', origin: 'Brazil (Single Origin)', roast: 'Dark', notes: 'Intense, earthy, thick sediment, bold', why: 'A Lebanese institution since 1957. The extra-fine grind produces the thick, fortune-telling sediment that makes Turkish coffee a ceremony, not just a drink.' },
      { name: 'Kocatepe Dibek Coffee', origin: 'Turkey (Traditional Blend)', roast: 'Medium', notes: 'Mastic, salep, chocolate, creamy, aromatic', why: 'Dibek is the ancient stone-mortar grinding method. This blend includes traditional Turkish additions like mastic and salep root. Coffee as your great-grandmother made it.' },
    ],
  },
  'The Latte Artist': {
    description: 'You see coffee as a canvas for creativity and connection. The social atmosphere of a cafe and the aesthetic beauty of a well-made latte are what you cherish. For you, coffee is a comforting, beautiful, and shared pleasure.',
    dimensions: ['Social Context', 'Flavor Complexity'],
    recommendations: [
      { name: 'La Colombe Corsica', origin: 'Brazil, Colombia, Honduras (Blend)', roast: 'Medium–Dark', notes: 'Bittersweet chocolate, caramel, bold, creamy', why: 'Designed to shine through milk. The dark chocolate and caramel notes become even more pronounced when steamed milk is added. The latte artist\'s workhorse.' },
      { name: 'Oatly x Intelligentsia Collab Blend', origin: 'Seasonal (Blend)', roast: 'Medium', notes: 'Vanilla, toffee, round sweetness, milk-friendly', why: 'Co-developed with oat milk in mind. The roast profile is calibrated so the coffee\'s sweetness harmonizes with plant milk rather than fighting it. Modern latte perfection.' },
      { name: 'Stumptown Holler Mountain', origin: 'Latin America, East Africa (Blend)', roast: 'Medium', notes: 'Caramel, citrus, creamy body, sweet finish', why: 'A crowd-pleasing blend that makes beautiful latte art thanks to its compatibility with properly textured milk. Sweet enough to skip the syrup.' },
      { name: 'Blue Bottle Bella Donovan', origin: 'Ethiopia, Sumatra (Blend)', roast: 'Medium', notes: 'Jammy fruit, chocolate, heavy body, sweet', why: 'Named after a beloved regular. The fruit-forward Ethiopian component creates stunning contrast when poured into a rosetta. Coffee as visual art.' },
      { name: 'Ceremony Coffee Thesis', origin: 'Seasonal (Blend)', roast: 'Medium', notes: 'Chocolate, stone fruit, balanced, versatile', why: 'A thesis on what espresso-based drinks should taste like. Pulls a beautiful shot with golden crema that holds latte art for minutes. The social media darling.' },
    ],
  },
};

/* ── Floating Coffee Bean Particle System ── */
const CoffeeParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 4 + 2;
        this.speedY = -(Math.random() * 1.5 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        // Coffee-colored particles: browns, ambers, golds
        const colors = ['#8B6914', '#D4B96A', '#6F4E37', '#C4A882', '#3E2723', '#A0522D', '#D2691E'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.rotation += this.rotSpeed;
        this.opacity -= 0.001;
        if (this.y < -20 || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        // Draw a coffee bean shape (oval with a line)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        // Center line of the bean
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.quadraticCurveTo(this.size * 0.3, 0, 0, this.size * 1.2);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 40; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // Start scattered
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
};

/* ── Steam Effect ── */
const SteamEffect = () => {
  const wisps = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 35 + Math.random() * 30,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    size: 40 + Math.random() * 60,
  })), []);

  return (
    <>
    <SEO
        title="Find Your Coffee — BrewSoul"
        description="A personalized coffee finder based on your taste preferences and lifestyle."
        path="/find-my/coffee"
        keywords="Tony Greenberg, find my coffee, coffee finder, personalized coffee"
        indexable={true}
      />
      <div style={{ position: 'absolute', bottom: '30%', left: 0, right: 0, pointerEvents: 'none', zIndex: 3 }}>
      {wisps.map(w => (
        <div
          key={w.id}
          style={{
            position: 'absolute',
            left: `${w.left}%`,
            bottom: 0,
            width: `${w.size}px`,
            height: `${w.size * 2}px`,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: `steamRise ${w.duration}s ease-out ${w.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes steamRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-200px) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
    </>);
};

/* ── Sacred Geometry Overlay ── */
const SacredGeometry = () => (
  <svg
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '500px',
      height: '500px',
      opacity: 0.06,
      pointerEvents: 'none',
      zIndex: 1,
    }}
    viewBox="0 0 200 200"
  >
    {/* Flower of Life pattern */}
    {[
      [100, 100], [100, 70], [100, 130],
      [74, 85], [74, 115], [126, 85], [126, 115],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="30" fill="none" stroke="#D4B96A" strokeWidth="0.3" />
    ))}
    {/* Outer ring */}
    <circle cx="100" cy="100" r="60" fill="none" stroke="#D4B96A" strokeWidth="0.2" />
    <circle cx="100" cy="100" r="90" fill="none" stroke="#D4B96A" strokeWidth="0.15" />
  </svg>
);

const FindYourCoffee = () => {
  const [phase, setPhase] = useState("landing");
  const [emailGated, setEmailGated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState(() => {
    const initialScores = {};
    dimensions.forEach(dim => initialScores[dim] = 0);
    return initialScores;
  });
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const { markComplete } = useJourneyProgress();

  const handleAnswer = (optionScores, idx) => {
    setSelectedOption(idx);
    setTimeout(() => {
      const newScores = { ...scores };
      for (const dim in optionScores) {
        newScores[dim] += optionScores[dim];
      }
      setScores(newScores);
      setSelectedOption(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setPhase("results");
      }
    }, 300);
  };

  useEffect(() => {
    if (phase === 'results' && !results) {
      const calculateArchetype = () => {
        let maxScore = -Infinity;
        let bestArchetype = null;

        for (const archetype in archetypes) {
          const primaryDimensions = archetypes[archetype].dimensions;
          const score = primaryDimensions.reduce((acc, dim) => acc + scores[dim], 0);

          if (score > maxScore) {
            maxScore = score;
            bestArchetype = archetype;
          }
        }
        return bestArchetype;
      };

      const archetype = calculateArchetype();
      const resultData = {
        archetype,
        scores,
        dimensions,
        completedAt: new Date().toISOString(),
      };

      setResults(resultData);
      markComplete(assessmentId);
    }
  }, [phase, scores, results, markComplete]);

  const RadarChart = ({ scores }) => {
    const size = 300;
    const center = size / 2;
    const radius = center - 30;
    const angleSlice = (Math.PI * 2) / dimensions.length;
    const maxScore = Math.max(...Object.values(scores).map(Math.abs)) || 5;

    const points = dimensions.map((dim, i) => {
      const value = Math.abs(scores[dim] || 0);
      const normalizedValue = (value / maxScore) * radius;
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + normalizedValue * Math.cos(angle);
      const y = center + normalizedValue * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 0 20px rgba(212,185,106,0.3))' }}>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle key={i} cx={center} cy={center} r={radius * scale} fill="none" stroke="rgba(212,185,106,0.15)" strokeWidth="0.5" />
        ))}
        {/* Axis lines and labels */}
        {dimensions.map((dim, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          const labelX = center + (radius + 18) * Math.cos(angle);
          const labelY = center + (radius + 18) * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x2} y2={y2} stroke="rgba(212,185,106,0.2)" strokeWidth="0.5" />
              <text x={labelX} y={labelY} fill="#C4A882" fontSize="8" fontFamily="'DM Mono', monospace" textAnchor="middle" dominantBaseline="middle">{dim}</text>
            </g>
          );
        })}
        {/* Data polygon */}
        <polygon points={points} fill="rgba(212,185,106,0.25)" stroke="#D4B96A" strokeWidth="1.5" />
        {/* Data points */}
        {dimensions.map((dim, i) => {
          const value = Math.abs(scores[dim] || 0);
          const normalizedValue = (value / maxScore) * radius;
          const angle = angleSlice * i - Math.PI / 2;
          const x = center + normalizedValue * Math.cos(angle);
          const y = center + normalizedValue * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="3" fill="#D4B96A" />;
        })}
      </svg>
    );
  };

  /* ── LANDING SCREEN ── */
  if (phase === "landing") {
    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Background image — the kintsugi cup with sacred geometry */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          zIndex: 0,
        }} />
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,16,0.5) 0%, rgba(10,10,16,0.3) 40%, rgba(10,10,16,0.7) 100%)',
          zIndex: 1,
        }} />

        <CoffeeParticles />
        <SteamEffect />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '600px',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C4A882',
            marginBottom: '1rem',
            opacity: 0.8,
          }}>
            A Tony Greenberg Assessment
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 400,
            color: '#FAFAF7',
            lineHeight: 1.05,
            margin: '0 0 1.5rem',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}>
            Find Your<br />
            <span style={{ color: '#D4B96A', fontStyle: 'italic' }}>Coffee</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#E8E4DC',
            fontStyle: 'italic',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            opacity: 0.9,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}>
            Every cup is a conversation between<br />the bean and the drinker.
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            marginBottom: '2.5rem',
          }}>
            {[
              { num: questions.length, label: 'Questions' },
              { num: dimensions.length, label: 'Dimensions' },
              { num: '~5', label: 'Minutes' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  color: '#D4B96A',
                  lineHeight: 1,
                }}>{stat.num}</div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '11px',
                  color: '#C4A882',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setPhase("questions")}
            style={{
              background: 'linear-gradient(135deg, #D4B96A 0%, #8B6914 100%)',
              color: '#0A0A10',
              border: 'none',
              padding: '18px 60px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '14px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 30px rgba(212,185,106,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(212,185,106,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 30px rgba(212,185,106,0.3)';
            }}
          >
            Begin the Ritual
          </button>

          {/* Scroll hint */}
          <div style={{
            marginTop: '3rem',
            opacity: 0.4,
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#C4A882', letterSpacing: '0.2em' }}>
              DISCOVER YOUR ARCHETYPE
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  /* ── QUESTIONS SCREEN ── */
  if (phase === "questions") {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BEANS_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,16,0.85) 0%, rgba(30,20,10,0.8) 50%, rgba(10,10,16,0.9) 100%)',
          zIndex: 1,
        }} />

        <CoffeeParticles />
        <SacredGeometry />

        {/* Progress bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(212,185,106,0.1)',
          zIndex: 100,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B6914, #D4B96A)',
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(212,185,106,0.5)',
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '2rem',
          maxWidth: '700px',
          width: '100%',
        }}>
          {/* Question counter */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#C4A882',
            letterSpacing: '0.2em',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </div>

          {/* Question text */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#FAFAF7',
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            textAlign: 'center',
            fontWeight: 400,
            lineHeight: 1.4,
            marginBottom: '2.5rem',
            textShadow: '0 2px 15px rgba(0,0,0,0.5)',
          }}>
            {question.text}
          </h2>

          {/* Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 600 ? '1fr 1fr' : '1fr',
            gap: '12px',
          }}>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.scores, index)}
                style={{
                  background: selectedOption === index
                    ? 'linear-gradient(135deg, rgba(212,185,106,0.3), rgba(139,105,20,0.3))'
                    : 'rgba(255,255,255,0.04)',
                  color: '#E8E4DC',
                  border: selectedOption === index
                    ? '1px solid rgba(212,185,106,0.6)'
                    : '1px solid rgba(212,185,106,0.15)',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '15px',
                  lineHeight: 1.5,
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (selectedOption !== index) {
                    e.currentTarget.style.background = 'rgba(212,185,106,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(212,185,106,0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedOption !== index) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(212,185,106,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '10px',
                  color: '#D4B96A',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '4px',
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── EMAIL GATE ── */
  if (phase === "results" && !emailGated) {
    return (
      <div style={{
        minHeight: "100vh",
        position: 'relative',
        overflow: 'hidden',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BEANS_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,16,0.88)',
        }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <EmailGate assessmentName="coffee" onUnlock={() => setEmailGated(true)} />
        </div>
      </div>
    );
  }

  /* ── RESULTS SCREEN ── */
  if (phase === "results" && emailGated) {
    if (!results) return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#D4B96A',
        fontFamily: "'DM Mono', monospace",
      }}>
        Brewing your results...
      </div>
    );

    const { archetype, scores } = results;
    const archetypeInfo = archetypes[archetype];

    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${BEANS_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,16,0.9) 0%, rgba(30,20,10,0.85) 50%, rgba(10,10,16,0.95) 100%)',
          zIndex: 1,
        }} />

        <CoffeeParticles />

        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: 'clamp(3rem, 6vw, 5rem) 2rem',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C4A882',
            marginBottom: '1rem',
          }}>
            Your Coffee Archetype
          </div>

          {/* Archetype name */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
            fontWeight: 400,
            color: '#D4B96A',
            fontStyle: 'italic',
            lineHeight: 1.1,
            margin: '0 0 1.5rem',
            textShadow: '0 4px 30px rgba(212,185,106,0.3)',
          }}>
            {archetype}
          </h1>

          {/* Description */}
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '18px',
            color: '#E8E4DC',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 3rem',
            opacity: 0.9,
          }}>
            {archetypeInfo.description}
          </p>

          {/* Radar chart + scores */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 600 ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            <RadarChart scores={scores} />
            <div style={{ textAlign: 'left' }}>
              <h3 style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                color: '#C4A882',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}>
                Dimension Scores
              </h3>
              {dimensions.map(dim => {
                const val = scores[dim];
                const maxVal = 6;
                const pct = Math.min(Math.abs(val) / maxVal * 100, 100);
                return (
                  <div key={dim} style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '12px',
                      color: '#C4A882',
                      marginBottom: '3px',
                    }}>
                      <span>{dim}</span>
                      <span style={{ color: '#D4B96A' }}>{val > 0 ? '+' : ''}{val}</span>
                    </div>
                    <div style={{
                      width: '200px',
                      height: '3px',
                      background: 'rgba(212,185,106,0.1)',
                      borderRadius: '2px',
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #8B6914, #D4B96A)',
                        borderRadius: '2px',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── COFFEE RECOMMENDATIONS ── */}
          {archetypeInfo.recommendations && archetypeInfo.recommendations.length > 0 && (
            <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#C4A882',
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}>
                Curated For You
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                fontWeight: 400,
                color: '#D4B96A',
                textAlign: 'center',
                marginBottom: '2rem',
                fontStyle: 'italic',
              }}>
                Your Coffees
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {archetypeInfo.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,185,106,0.12)',
                      padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(212,185,106,0.35)';
                      e.currentTarget.style.background = 'rgba(212,185,106,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(212,185,106,0.12)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        color: '#FAFAF7',
                        margin: 0,
                      }}>
                        {rec.name}
                      </h3>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        color: '#D4B96A',
                        background: 'rgba(212,185,106,0.08)',
                        padding: '4px 10px',
                        border: '1px solid rgba(212,185,106,0.15)',
                        whiteSpace: 'nowrap',
                      }}>
                        {rec.roast} Roast
                      </span>
                    </div>

                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '11px',
                      color: '#C4A882',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}>
                      {rec.origin}
                    </div>

                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '14px',
                      color: '#D4B96A',
                      fontStyle: 'italic',
                      marginBottom: '0.75rem',
                      opacity: 0.9,
                    }}>
                      {rec.notes}
                    </div>

                    <p style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '15px',
                      color: '#E8E4DC',
                      lineHeight: 1.65,
                      margin: 0,
                      opacity: 0.85,
                    }}>
                      {rec.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #D4B96A, transparent)',
            margin: '2rem auto',
          }} />

          {/* Continue */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              color: '#FAFAF7',
              fontSize: '1.3rem',
              fontWeight: 400,
              marginBottom: '1rem',
            }}>
              The Journey Continues
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Find Your Diet', href: '/find-your-diet' },
                { label: 'Find Your Movement', href: '/find-your-movement' },
                { label: 'Find Your Sake', href: '/find-your-sake' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  style={{
                    color: '#D4B96A',
                    textDecoration: 'none',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    padding: '8px 16px',
                    border: '1px solid rgba(212,185,106,0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,185,106,0.5)';
                    e.currentTarget.style.background = 'rgba(212,185,106,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,185,106,0.2)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <WhatsNext />
        </div>
      </div>
    );
  }

  return null;
};

export default FindYourCoffee;
