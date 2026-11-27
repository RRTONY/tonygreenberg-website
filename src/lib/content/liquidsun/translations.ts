// LiquidSun's EN/ES strings, ported unchanged from the LiquidSun Manus app's
// client/src/contexts/LanguageContext.tsx (2026-11-21). Read through useLanguage().t(key).

export type LiquidsunLanguage = "en" | "es";

export const liquidsunTranslations: Record<LiquidsunLanguage, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.evolution": "The Evolution",
    "nav.agaves": "The Tequilas",
    "nav.process": "The Process",
    "nav.explore": "Explore",
    "nav.more": "More",
    
    // Hero
    "hero.tagline": "What enters the mouth must speak to the mind and stay with the heart.",
    "hero.subtitle": "The Soul of Tequila",
    "hero.cta.scent": "Find Your Tequila by Flavor",
    "hero.cta.collection": "Explore the Collection",
    "hero.cta.enter": "ENTER THE VOID",
    
    // Be the Glitch section
    "glitch.title": "Be the Glitch",
    "glitch.p1": "This is not a guide to the 'Patron of Tequila.' We have no interest in the ordinary, the reliable, or the safe.",
    "glitch.p2": "We are here for the glitches—the highland agaves, the tahona-crushed fibers, the tequileros who refuse to compromise.",
    "glitch.p3": "We are here for the bottles that challenge your palate, tell a wild story, and feel like a rupture in the matrix of mass-produced spirits.",
    
    // EVI/EEI section
    "magic.title": "Two Ways to Measure Magic",
    "evi.title": "Extraordinary Value Index",
    "evi.description": "Bang for your weirdness buck. Hidden gems that punch above their weight.",
    "eei.title": "Extraordinary Experience Index",
    "eei.description": "Pure intensity. The most mind-bending bottles, regardless of price.",
    
    // Newsletter
    "newsletter.title": "Join the Hunt",
    "newsletter.description": "Get notified about rare bottle drops, producer stories, and insider tips.",
    "newsletter.cta": "Subscribe to the List",
    
    // Footer
    "footer.tagline": "Liquids that touch your mouth must touch your mind.",
    "footer.rights": "Drink with reverence.",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.evolution": "La Evolución",
    "nav.agaves": "Los Tequilas",
    "nav.process": "El Proceso",
    "nav.explore": "Explorar",
    "nav.more": "Más",
    
    // Hero
    "hero.tagline": "Lo que entra por la boca debe hablarle a la mente y quedarse en el corazón.",
    "hero.subtitle": "El Alma del Tequila",
    "hero.cta.scent": "Encuentra Tu Tequila por Sabor",
    "hero.cta.collection": "Explora la Colección",
    "hero.cta.enter": "ENTRAR AL VACÍO",
    
    // Be the Glitch section
    "glitch.title": "Sé el Glitch",
    "glitch.p1": "Esta no es una guía del 'Patrón del Tequila.' No nos interesa lo ordinario, lo confiable, ni lo seguro.",
    "glitch.p2": "Estamos aquí por los glitches—los agaves de los altos, las tahonas, los tequileros que se niegan a comprometerse.",
    "glitch.p3": "Estamos aquí por las botellas que desafían tu paladar y cuentan una historia salvaje.",
    
    // EVI/EEI section
    "magic.title": "Dos Formas de Medir la Magia",
    "evi.title": "Índice de Valor Extraordinario",
    "evi.description": "Máximo rendimiento por tu inversión en rareza.",
    "eei.title": "Índice de Experiencia Extraordinaria",
    "eei.description": "Intensidad pura. Las botellas más alucinantes.",
    
    // Newsletter
    "newsletter.title": "Únete a la Cacería",
    "newsletter.description": "Recibe alertas sobre lanzamientos raros y secretos de productores.",
    "newsletter.cta": "Suscríbete",
    
    // Footer
    "footer.tagline": "Líquidos que tocan tu boca deben tocar tu mente.",
    "footer.rights": "Bebe con reverencia.",
  },
};
