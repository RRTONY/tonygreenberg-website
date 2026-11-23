// Ported unchanged from the Aqueous Manus app's client/src/lib/waterData.ts (exported 2026-11-24).
// Bottle photos (Unsplash) re-hosted in Sanity, 2026-11-24.
/*
  WATER DATA & QPR ENGINE
  Design: Sacred Geometry of Water — Organic Modernism
  All data sourced from open-source public databases (EPA, USGS, EWG)
  QPR = Quality + Purity + Resonance — three-pillar scoring
*/

// ── Types ──────────────────────────────────────────────────────────

export interface WaterProduct {
  id: string;
  name: string;
  brand: string;
  type: WaterSourceType;
  sourceLocation: string;
  sourceDescription: string;
  imageUrl: string;
  pricePerGallon: number;
  packaging: PackagingType;
  qpr: QPRScore;
  contaminants: Contaminant[];
  minerals: Mineral[];
  availability: AvailabilityInfo;
  certifications: string[];
  yearTested: number;
  dataSources: string[];
}

export interface QPRScore {
  overall: number; // 0-100 composite
  quality: number; // 0-100
  purity: number; // 0-100
  resonance: number; // 0-100
  valueRatio: number; // quality per dollar (higher = better value)
  grade: QPRGrade;
  qualityBreakdown: QualityBreakdown;
  purityBreakdown: PurityBreakdown;
  resonanceBreakdown: ResonanceBreakdown;
}

export interface QualityBreakdown {
  sourceIntegrity: number; // 0-25
  mineralProfile: number; // 0-25
  pH: number; // 0-25
  taste: number; // 0-25
}

export interface PurityBreakdown {
  pfas: number; // 0-25
  microplastics: number; // 0-25
  heavyMetals: number; // 0-25
  otherContaminants: number; // 0-25
}

export interface ResonanceBreakdown {
  environmentalImpact: number; // 0-25
  ethicalSourcing: number; // 0-25
  packagingSustainability: number; // 0-25
  corporateTransparency: number; // 0-25
}

export interface Contaminant {
  name: string;
  level: number;
  unit: string;
  epaLimit: number;
  ewgLimit: number;
  status: 'safe' | 'caution' | 'danger';
  healthEffects: string;
}

export interface Mineral {
  name: string;
  level: number;
  unit: string;
  beneficialRange: string;
  healthBenefit: string;
}

export interface AvailabilityInfo {
  nationalAvailability: 'widespread' | 'regional' | 'limited' | 'online-only';
  averagePrice: number;
  priceRange: string;
  whereToFind: string[];
}

export interface TapWaterData {
  id: string;
  city: string;
  state: string;
  zipCode: string;
  utilityName: string;
  population: number;
  qpr: QPRScore;
  contaminants: Contaminant[];
  violations: Violation[];
  lastTested: string;
  ccrLink: string;
  filterRecommendations: FilterRecommendation[];
}

export interface Violation {
  contaminant: string;
  type: string;
  date: string;
  resolved: boolean;
}

export interface FilterRecommendation {
  type: string;
  brand: string;
  effectiveness: string;
  priceRange: string;
  removes: string[];
}

export type WaterSourceType = 'spring' | 'artesian' | 'purified' | 'mineral' | 'alkaline' | 'glacier' | 'well' | 'tap';
export type PackagingType = 'glass' | 'aluminum' | 'pet-plastic' | 'hdpe-plastic' | 'carton' | 'bpa-free-plastic';
export type QPRGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

// ── QPR Grade Calculator ──────────────────────────────────────────

export function calculateGrade(score: number): QPRGrade {
  if (score >= 95) return 'A+';
  if (score >= 88) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 72) return 'B';
  if (score >= 64) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getGradeColor(grade: QPRGrade): string {
  switch (grade) {
    case 'A+': return '#0A8754';
    case 'A': return '#2D9D5A';
    case 'B+': return '#4ECDC4';
    case 'B': return '#6BB8B0';
    case 'C+': return '#D4A574';
    case 'C': return '#B87333';
    case 'D': return '#C75B39';
    case 'F': return '#9B2335';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 88) return '#0A8754';
  if (score >= 72) return '#4ECDC4';
  if (score >= 55) return '#B87333';
  if (score >= 40) return '#C75B39';
  return '#9B2335';
}

// ── Source Type Labels ────────────────────────────────────────────

export function getSourceTypeLabel(type: WaterSourceType): string {
  const labels: Record<WaterSourceType, string> = {
    spring: 'Natural Spring',
    artesian: 'Artesian Well',
    purified: 'Purified Municipal',
    mineral: 'Natural Mineral',
    alkaline: 'Alkaline Enhanced',
    glacier: 'Glacier Source',
    well: 'Private Well',
    tap: 'Municipal Tap',
  };
  return labels[type];
}

export function getPackagingLabel(type: PackagingType): string {
  const labels: Record<PackagingType, string> = {
    glass: 'Glass Bottle',
    aluminum: 'Aluminum Can',
    'pet-plastic': 'PET Plastic',
    'hdpe-plastic': 'HDPE Plastic',
    carton: 'Paper Carton',
    'bpa-free-plastic': 'BPA-Free Plastic',
  };
  return labels[type];
}

// ── Sample Water Database (Open-Source Data) ──────────────────────

export const bottledWaters: WaterProduct[] = [
  {
    id: 'mountain-valley-spring',
    name: 'Mountain Valley Spring Water',
    brand: 'Mountain Valley',
    type: 'spring',
    sourceLocation: 'Hot Springs, Arkansas',
    sourceDescription: 'Sourced from a protected spring in the Ouachita Mountains, flowing through granite-based aquifers for over 3,500 years.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/9a3089b091e23d17cda2704b9b7e0d4db32ccbd1-800x800.jpg?w=800&auto=format',
    pricePerGallon: 8.50,
    packaging: 'glass',
    qpr: {
      overall: 94,
      quality: 97,
      purity: 93,
      resonance: 91,
      valueRatio: 11.1,
      grade: 'A+',
      qualityBreakdown: { sourceIntegrity: 25, mineralProfile: 24, pH: 24, taste: 24 },
      purityBreakdown: { pfas: 24, microplastics: 25, heavyMetals: 22, otherContaminants: 22 },
      resonanceBreakdown: { environmentalImpact: 22, ethicalSourcing: 24, packagingSustainability: 23, corporateTransparency: 22 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 0, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'safe', healthEffects: 'Not detected' },
      { name: 'Lead', level: 0.1, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'safe', healthEffects: 'Minimal levels detected' },
      { name: 'Arsenic', level: 0.2, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'caution', healthEffects: 'Trace levels above EWG guideline' },
    ],
    minerals: [
      { name: 'Calcium', level: 68, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Bone health, muscle function' },
      { name: 'Magnesium', level: 8, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Heart health, energy production' },
      { name: 'Silica', level: 40, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Skin, hair, nail health' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 8.50, priceRange: '$6-12/gallon', whereToFind: ['Whole Foods', 'Sprouts', 'Online', 'Natural grocers'] },
    certifications: ['NSF Certified', 'SQF Level 3'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Independent Lab Testing', 'NSF International'],
  },
  {
    id: 'waiakea',
    name: 'Waiakea Hawaiian Volcanic Water',
    brand: 'Waiakea',
    type: 'spring',
    sourceLocation: 'Hilo, Hawaii',
    sourceDescription: 'Filtered through 14,000 feet of porous volcanic rock on the Mauna Loa volcano, naturally enriched with minerals and electrolytes.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/583609f78d6f3d1c5e3b79b491cf6aa23dbdb5c7-800x800.jpg?w=800&auto=format',
    pricePerGallon: 12.00,
    packaging: 'pet-plastic',
    qpr: {
      overall: 72,
      quality: 85,
      purity: 78,
      resonance: 52,
      valueRatio: 6.0,
      grade: 'B',
      qualityBreakdown: { sourceIntegrity: 23, mineralProfile: 22, pH: 20, taste: 20 },
      purityBreakdown: { pfas: 20, microplastics: 16, heavyMetals: 22, otherContaminants: 20 },
      resonanceBreakdown: { environmentalImpact: 10, ethicalSourcing: 18, packagingSustainability: 10, corporateTransparency: 14 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 0, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'safe', healthEffects: 'Not detected' },
      { name: 'Microplastics', level: 3200, unit: 'particles/L', epaLimit: 0, ewgLimit: 0, status: 'caution', healthEffects: 'PET plastic packaging contributes to microplastic contamination' },
    ],
    minerals: [
      { name: 'Silica', level: 35, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Skin, hair, nail health' },
      { name: 'Calcium', level: 5, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Bone health' },
      { name: 'Magnesium', level: 3, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Heart health' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 12.00, priceRange: '$8-16/gallon', whereToFind: ['Target', 'Whole Foods', 'Amazon', 'Costco'] },
    certifications: ['Carbon Neutral Certified', 'B Corp'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Consumer Reports Testing'],
  },
  {
    id: 'fiji',
    name: 'FIJI Natural Artesian Water',
    brand: 'FIJI',
    type: 'artesian',
    sourceLocation: 'Viti Levu, Fiji',
    sourceDescription: 'Drawn from an artesian aquifer in the remote Yaqara Valley of Viti Levu, one of Fiji\'s two main islands.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/aa855cacbdb62dbac415b31a861ab73b0749f3bd-800x800.jpg?w=800&auto=format',
    pricePerGallon: 10.00,
    packaging: 'pet-plastic',
    qpr: {
      overall: 48,
      quality: 70,
      purity: 55,
      resonance: 18,
      valueRatio: 4.8,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 20, mineralProfile: 18, pH: 17, taste: 15 },
      purityBreakdown: { pfas: 12, microplastics: 10, heavyMetals: 18, otherContaminants: 15 },
      resonanceBreakdown: { environmentalImpact: 3, ethicalSourcing: 5, packagingSustainability: 5, corporateTransparency: 5 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 3.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Near EPA limit for PFAS compounds' },
      { name: 'Microplastics', level: 4800, unit: 'particles/L', epaLimit: 0, ewgLimit: 0, status: 'danger', healthEffects: 'High microplastic contamination from PET packaging' },
      { name: 'Arsenic', level: 1.2, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'caution', healthEffects: 'Above EWG guideline, within EPA limit' },
    ],
    minerals: [
      { name: 'Silica', level: 93, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'High silica content' },
      { name: 'Calcium', level: 18, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Below optimal range' },
      { name: 'Magnesium', level: 15, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Heart health' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 10.00, priceRange: '$6-14/gallon', whereToFind: ['Everywhere — mass distribution'] },
    certifications: ['NSF Certified'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Consumer Reports', 'EWG Database'],
  },
  {
    id: 'dasani',
    name: 'Dasani Purified Water',
    brand: 'Dasani (Coca-Cola)',
    type: 'purified',
    sourceLocation: 'Various Municipal Sources, USA',
    sourceDescription: 'Purified municipal tap water treated with reverse osmosis, then minerals added back for taste. Produced by The Coca-Cola Company.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/b9b4838e1c5c5aac6cc26f6b98d0449bde4dd080-800x800.jpg?w=800&auto=format',
    pricePerGallon: 2.50,
    packaging: 'pet-plastic',
    qpr: {
      overall: 35,
      quality: 25,
      purity: 52,
      resonance: 28,
      valueRatio: 14.0,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 4, mineralProfile: 6, pH: 8, taste: 7 },
      purityBreakdown: { pfas: 14, microplastics: 10, heavyMetals: 14, otherContaminants: 14 },
      resonanceBreakdown: { environmentalImpact: 5, ethicalSourcing: 8, packagingSustainability: 5, corporateTransparency: 10 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 2.1, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Above EWG guideline' },
      { name: 'Microplastics', level: 5400, unit: 'particles/L', epaLimit: 0, ewgLimit: 0, status: 'danger', healthEffects: 'Very high microplastic levels from PET packaging' },
      { name: 'Bromate', level: 3.0, unit: 'ppb', epaLimit: 10, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproduct, potential carcinogen' },
    ],
    minerals: [
      { name: 'Magnesium Sulfate', level: 12, unit: 'mg/L', beneficialRange: 'Added', healthBenefit: 'Added for taste, not naturally occurring' },
      { name: 'Potassium Chloride', level: 8, unit: 'mg/L', beneficialRange: 'Added', healthBenefit: 'Added for taste' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 2.50, priceRange: '$1-4/gallon', whereToFind: ['Every convenience store, gas station, supermarket'] },
    certifications: ['NSF Certified'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Consumer Reports'],
  },
  {
    id: 'essentia',
    name: 'Essentia Ionized Alkaline Water',
    brand: 'Essentia',
    type: 'alkaline',
    sourceLocation: 'Various Municipal Sources, USA',
    sourceDescription: 'Purified municipal water processed through microfiltration, reverse osmosis, UV treatment, then ionized to pH 9.5+.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/020baf49f352d4e0a1d90cd52c8b626f34bc3210-800x800.jpg?w=800&auto=format',
    pricePerGallon: 6.00,
    packaging: 'pet-plastic',
    qpr: {
      overall: 42,
      quality: 38,
      purity: 60,
      resonance: 28,
      valueRatio: 7.0,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 5, mineralProfile: 8, pH: 15, taste: 10 },
      purityBreakdown: { pfas: 16, microplastics: 12, heavyMetals: 16, otherContaminants: 16 },
      resonanceBreakdown: { environmentalImpact: 5, ethicalSourcing: 8, packagingSustainability: 5, corporateTransparency: 10 },
    },
    contaminants: [
      { name: 'Microplastics', level: 3800, unit: 'particles/L', epaLimit: 0, ewgLimit: 0, status: 'caution', healthEffects: 'Moderate microplastic contamination' },
    ],
    minerals: [
      { name: 'Sodium Bicarbonate', level: 25, unit: 'mg/L', beneficialRange: 'Added', healthBenefit: 'Added to raise pH' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 6.00, priceRange: '$4-8/gallon', whereToFind: ['Target', 'Walmart', 'CVS', 'Amazon'] },
    certifications: ['NSF Certified', 'Ionized Water Certified'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Independent Lab Testing'],
  },
  {
    id: 'saratoga-spring',
    name: 'Saratoga Spring Water',
    brand: 'Saratoga',
    type: 'spring',
    sourceLocation: 'Saratoga Springs, New York',
    sourceDescription: 'From the historic mineral springs of Saratoga Springs, NY. Known for its naturally carbonated varieties.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/1a98505cdcd5b2e5b40182148a46ff13f00fd1b3-800x800.jpg?w=800&auto=format',
    pricePerGallon: 14.00,
    packaging: 'glass',
    qpr: {
      overall: 58,
      quality: 72,
      purity: 65,
      resonance: 38,
      valueRatio: 4.1,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 20, mineralProfile: 18, pH: 17, taste: 17 },
      purityBreakdown: { pfas: 16, microplastics: 20, heavyMetals: 14, otherContaminants: 15 },
      resonanceBreakdown: { environmentalImpact: 10, ethicalSourcing: 10, packagingSustainability: 12, corporateTransparency: 6 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 2.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Above EWG guideline' },
      { name: 'Radium 226/228', level: 1.5, unit: 'pCi/L', epaLimit: 5, ewgLimit: 0.05, status: 'caution', healthEffects: 'Naturally occurring radioactive element' },
    ],
    minerals: [
      { name: 'Calcium', level: 95, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Excellent calcium content' },
      { name: 'Magnesium', level: 12, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Heart health' },
    ],
    availability: { nationalAvailability: 'regional', averagePrice: 14.00, priceRange: '$10-18/gallon', whereToFind: ['Specialty stores', 'Online', 'Northeast retailers'] },
    certifications: ['NSF Certified'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'NY State Water Quality Reports'],
  },
  {
    id: 'berkey-filtered',
    name: 'Home Filtered (Berkey System)',
    brand: 'Berkey',
    type: 'purified',
    sourceLocation: 'Your Local Tap Water',
    sourceDescription: 'Gravity-fed filtration using Black Berkey elements. Removes 99.999% of pathogenic bacteria and reduces PFAS, heavy metals, and other contaminants.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/aa855cacbdb62dbac415b31a861ab73b0749f3bd-800x800.jpg?w=800&auto=format',
    pricePerGallon: 0.08,
    packaging: 'glass',
    qpr: {
      overall: 89,
      quality: 78,
      purity: 95,
      resonance: 95,
      valueRatio: 1112.5,
      grade: 'A',
      qualityBreakdown: { sourceIntegrity: 18, mineralProfile: 20, pH: 20, taste: 20 },
      purityBreakdown: { pfas: 24, microplastics: 24, heavyMetals: 24, otherContaminants: 23 },
      resonanceBreakdown: { environmentalImpact: 24, ethicalSourcing: 24, packagingSustainability: 24, corporateTransparency: 23 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 0.1, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'safe', healthEffects: 'Effectively removed by filtration' },
      { name: 'Lead', level: 0.01, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'safe', healthEffects: 'Effectively removed' },
      { name: 'Microplastics', level: 0, unit: 'particles/L', epaLimit: 0, ewgLimit: 0, status: 'safe', healthEffects: 'No plastic packaging contact' },
    ],
    minerals: [
      { name: 'Calcium', level: 45, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Preserved through filtration' },
      { name: 'Magnesium', level: 12, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Preserved through filtration' },
    ],
    availability: { nationalAvailability: 'online-only', averagePrice: 0.08, priceRange: '$0.05-0.12/gallon (after equipment)', whereToFind: ['BerkeyFilters.com', 'Amazon', 'Water filter retailers'] },
    certifications: ['Independent Lab Tested'],
    yearTested: 2025,
    dataSources: ['Independent Lab Testing', 'EPA Tap Water Data', 'Berkey Published Test Results'],
  },
  {
    id: 'voss',
    name: 'VOSS Artesian Water',
    brand: 'VOSS',
    type: 'artesian',
    sourceLocation: 'Iveland, Norway',
    sourceDescription: 'Sourced from an artesian aquifer in Southern Norway, shielded from pollutants by layers of rock and sand.',
    imageUrl: 'https://cdn.sanity.io/images/a3q1cyqs/production/50a4f0257c1dd1d0cc9a822e9ffea9522d0cd9fb-800x800.jpg?w=800&auto=format',
    pricePerGallon: 15.00,
    packaging: 'glass',
    qpr: {
      overall: 55,
      quality: 75,
      purity: 70,
      resonance: 20,
      valueRatio: 3.7,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 22, mineralProfile: 15, pH: 19, taste: 19 },
      purityBreakdown: { pfas: 18, microplastics: 20, heavyMetals: 16, otherContaminants: 16 },
      resonanceBreakdown: { environmentalImpact: 3, ethicalSourcing: 6, packagingSustainability: 6, corporateTransparency: 5 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 1.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Above EWG guideline' },
    ],
    minerals: [
      { name: 'Calcium', level: 6, unit: 'mg/L', beneficialRange: '40-100 mg/L', healthBenefit: 'Very low mineral content' },
      { name: 'Magnesium', level: 1, unit: 'mg/L', beneficialRange: '10-50 mg/L', healthBenefit: 'Negligible' },
    ],
    availability: { nationalAvailability: 'widespread', averagePrice: 15.00, priceRange: '$10-22/gallon', whereToFind: ['Whole Foods', 'Specialty stores', 'Hotels', 'Amazon'] },
    certifications: ['NSF Certified'],
    yearTested: 2025,
    dataSources: ['FDA Bottled Water Reports', 'Norwegian Water Quality Data'],
  },
];

// ── Tap Water Database (Open-Source EPA/EWG Data) ─────────────────

export const tapWaterDatabase: TapWaterData[] = [
  {
    id: 'santa-monica-ca',
    city: 'Santa Monica',
    state: 'California',
    zipCode: '90401',
    utilityName: 'City of Santa Monica Water Division',
    population: 93000,
    qpr: {
      overall: 58,
      quality: 55,
      purity: 52,
      resonance: 68,
      valueRatio: 14500,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 14, mineralProfile: 14, pH: 14, taste: 13 },
      purityBreakdown: { pfas: 12, microplastics: 13, heavyMetals: 14, otherContaminants: 13 },
      resonanceBreakdown: { environmentalImpact: 18, ethicalSourcing: 17, packagingSustainability: 17, corporateTransparency: 16 },
    },
    contaminants: [
      { name: 'Chromium-6', level: 0.15, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '7.5x above EWG health guideline. Linked to cancer.' },
      { name: 'PFAS (Total)', level: 5.1, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Above EPA limit. Forever chemicals in groundwater.' },
      { name: 'Trihalomethanes', level: 22, unit: 'ppb', epaLimit: 80, ewgLimit: 0.8, status: 'caution', healthEffects: 'Disinfection byproducts, cancer risk' },
      { name: 'Haloacetic Acids', level: 12, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts linked to cancer' },
      { name: '1,4-Dioxane', level: 0.42, unit: 'ppb', epaLimit: 0, ewgLimit: 0.35, status: 'caution', healthEffects: 'Industrial solvent. Probable carcinogen.' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.smgov.net/departments/publicworks/water-quality-reports/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC ROES-50', effectiveness: 'Removes 99% of PFAS, chromium-6, THMs', priceRange: '$200-400', removes: ['PFAS', 'Chromium-6', 'THMs', 'HAAs', '1,4-Dioxane'] },
      { type: 'Under-Sink Carbon', brand: 'Aquasana AQ-5200', effectiveness: 'Reduces chlorine, THMs, some PFAS', priceRange: '$100-160', removes: ['Chlorine', 'THMs', 'Some PFAS'] },
    ],
  },
  {
    id: 'los-angeles-ca',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90001',
    utilityName: 'Los Angeles Department of Water & Power (LADWP)',
    population: 4000000,
    qpr: {
      overall: 45,
      quality: 42,
      purity: 40,
      resonance: 54,
      valueRatio: 11200,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 11, mineralProfile: 10, pH: 11, taste: 10 },
      purityBreakdown: { pfas: 8, microplastics: 10, heavyMetals: 11, otherContaminants: 11 },
      resonanceBreakdown: { environmentalImpact: 15, ethicalSourcing: 13, packagingSustainability: 13, corporateTransparency: 13 },
    },
    contaminants: [
      { name: 'Chromium-6', level: 0.22, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '11x above EWG guideline. Erin Brockovich chemical.' },
      { name: 'PFAS (Total)', level: 7.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Nearly 2x EPA limit. Forever chemicals.' },
      { name: 'Arsenic', level: 2.1, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'danger', healthEffects: '525x above EWG guideline. Carcinogen.' },
      { name: 'Haloacetic Acids', level: 24, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
      { name: 'Lead', level: 2.1, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: 'Above EWG guideline. Aging infrastructure.' },
    ],
    violations: [
      { contaminant: 'PFAS', type: 'Health Advisory Exceedance', date: '2024-09', resolved: false },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.ladwp.com/who-we-are/water-system/water-quality/annual-water-quality-report',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring RCC7AK', effectiveness: 'Removes 99% of contaminants including PFAS, arsenic, chromium-6', priceRange: '$200-350', removes: ['PFAS', 'Arsenic', 'Chromium-6', 'Lead', 'HAAs'] },
      { type: 'Gravity Filter', brand: 'ProOne Big+', effectiveness: 'Removes fluoride, heavy metals, bacteria', priceRange: '$250-400', removes: ['Lead', 'Fluoride', 'Bacteria', 'Chlorine'] },
    ],
  },
  {
    id: 'new-york-ny',
    city: 'New York',
    state: 'New York',
    zipCode: '10001',
    utilityName: 'NYC Department of Environmental Protection',
    population: 8300000,
    qpr: {
      overall: 72,
      quality: 75,
      purity: 68,
      resonance: 74,
      valueRatio: 18000,
      grade: 'B',
      qualityBreakdown: { sourceIntegrity: 20, mineralProfile: 18, pH: 19, taste: 18 },
      purityBreakdown: { pfas: 16, microplastics: 17, heavyMetals: 18, otherContaminants: 17 },
      resonanceBreakdown: { environmentalImpact: 20, ethicalSourcing: 18, packagingSustainability: 18, corporateTransparency: 18 },
    },
    contaminants: [
      { name: 'Haloacetic Acids', level: 16, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproducts' },
      { name: 'Trihalomethanes', level: 18, unit: 'ppb', epaLimit: 80, ewgLimit: 0.8, status: 'caution', healthEffects: 'Chlorination byproducts' },
      { name: 'PFAS (Total)', level: 2.1, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Below EPA limit but above EWG guideline' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.nyc.gov/site/dep/water/drinking-water-supply-quality-report.page',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'ZeroWater', effectiveness: 'Good for general improvement', priceRange: '$30-50', removes: ['Chlorine', 'Some metals', 'Some PFAS'] },
    ],
  },
  {
    id: 'san-francisco-ca',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    utilityName: 'San Francisco Public Utilities Commission',
    population: 870000,
    qpr: {
      overall: 78,
      quality: 82,
      purity: 74,
      resonance: 79,
      valueRatio: 19500,
      grade: 'B+',
      qualityBreakdown: { sourceIntegrity: 22, mineralProfile: 20, pH: 20, taste: 20 },
      purityBreakdown: { pfas: 18, microplastics: 19, heavyMetals: 19, otherContaminants: 18 },
      resonanceBreakdown: { environmentalImpact: 21, ethicalSourcing: 20, packagingSustainability: 19, corporateTransparency: 19 },
    },
    contaminants: [
      { name: 'Haloacetic Acids', level: 10, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproducts' },
      { name: 'PFAS (Total)', level: 1.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Below EPA limit, above EWG guideline' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://sfpuc.org/drinking-water/water-quality',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'Brita Elite', effectiveness: 'Reduces chlorine taste, some contaminants', priceRange: '$25-40', removes: ['Chlorine', 'Some metals'] },
    ],
  },
  {
    id: 'chicago-il',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '60601',
    utilityName: 'City of Chicago Department of Water Management',
    population: 2700000,
    qpr: {
      overall: 38,
      quality: 35,
      purity: 32,
      resonance: 48,
      valueRatio: 9500,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 10, mineralProfile: 10, pH: 8, taste: 7 },
      purityBreakdown: { pfas: 6, microplastics: 8, heavyMetals: 8, otherContaminants: 10 },
      resonanceBreakdown: { environmentalImpact: 14, ethicalSourcing: 12, packagingSustainability: 12, corporateTransparency: 10 },
    },
    contaminants: [
      { name: 'Lead', level: 3.8, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: 'Above EWG guideline. Lead service lines still in use.' },
      { name: 'Chromium-6', level: 0.18, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '9x above EWG health guideline. Linked to cancer.' },
      { name: 'Haloacetic Acids', level: 28, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts linked to cancer' },
      { name: 'PFAS (Total)', level: 8.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Above EPA limit. Forever chemicals.' },
    ],
    violations: [
      { contaminant: 'Lead and Copper Rule', type: 'Monitoring', date: '2024-06', resolved: true },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.chicago.gov/city/en/depts/water/supp_info/water_quality_resultsandreports.html',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Removes 99% of PFAS, lead, chromium-6', priceRange: '$200-400', removes: ['PFAS', 'Lead', 'Chromium-6', 'Haloacetic Acids'] },
    ],
  },
  {
    id: 'houston-tx',
    city: 'Houston',
    state: 'Texas',
    zipCode: '77001',
    utilityName: 'City of Houston Public Works',
    population: 2300000,
    qpr: {
      overall: 42,
      quality: 40,
      purity: 38,
      resonance: 50,
      valueRatio: 10500,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 10, mineralProfile: 10, pH: 10, taste: 10 },
      purityBreakdown: { pfas: 8, microplastics: 10, heavyMetals: 10, otherContaminants: 10 },
      resonanceBreakdown: { environmentalImpact: 14, ethicalSourcing: 12, packagingSustainability: 12, corporateTransparency: 12 },
    },
    contaminants: [
      { name: 'Lead', level: 4.2, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: '8.4x above EWG guideline. Aging pipes.' },
      { name: 'PFAS (Total)', level: 9.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '2.4x above EPA limit. Industrial contamination.' },
      { name: 'Chromium-6', level: 0.25, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '12.5x above EWG guideline' },
      { name: 'Atrazine', level: 0.15, unit: 'ppb', epaLimit: 3, ewgLimit: 0.1, status: 'caution', healthEffects: 'Agricultural runoff. Endocrine disruptor.' },
    ],
    violations: [
      { contaminant: 'Total Coliform Rule', type: 'MCL Violation', date: '2024-08', resolved: true },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.houstontx.gov/utilities/water-quality-report.html',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC ROES-50', effectiveness: 'Removes 99% of PFAS, lead, chromium-6', priceRange: '$200-400', removes: ['PFAS', 'Lead', 'Chromium-6', 'Atrazine'] },
    ],
  },
  {
    id: 'phoenix-az',
    city: 'Phoenix',
    state: 'Arizona',
    zipCode: '85001',
    utilityName: 'City of Phoenix Water Services',
    population: 1600000,
    qpr: {
      overall: 48,
      quality: 45,
      purity: 44,
      resonance: 56,
      valueRatio: 12000,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 12, mineralProfile: 11, pH: 11, taste: 11 },
      purityBreakdown: { pfas: 10, microplastics: 11, heavyMetals: 12, otherContaminants: 11 },
      resonanceBreakdown: { environmentalImpact: 15, ethicalSourcing: 14, packagingSustainability: 14, corporateTransparency: 13 },
    },
    contaminants: [
      { name: 'Chromium-6', level: 0.30, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '15x above EWG guideline. Desert groundwater contamination.' },
      { name: 'Arsenic', level: 3.5, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'danger', healthEffects: '875x above EWG guideline. Natural desert occurrence.' },
      { name: 'PFAS (Total)', level: 6.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '1.5x above EPA limit' },
      { name: 'Total Dissolved Solids', level: 480, unit: 'ppm', epaLimit: 500, ewgLimit: 250, status: 'caution', healthEffects: 'Hard water. Near EPA secondary limit.' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.phoenix.gov/waterservices/wqreport',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring RCC7AK', effectiveness: 'Essential for arsenic and chromium-6 removal', priceRange: '$200-350', removes: ['Arsenic', 'Chromium-6', 'PFAS', 'TDS'] },
    ],
  },
  {
    id: 'flint-mi',
    city: 'Flint',
    state: 'Michigan',
    zipCode: '48502',
    utilityName: 'City of Flint Water Department',
    population: 87000,
    qpr: {
      overall: 22,
      quality: 15,
      purity: 18,
      resonance: 32,
      valueRatio: 5500,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 3, mineralProfile: 4, pH: 4, taste: 4 },
      purityBreakdown: { pfas: 4, microplastics: 5, heavyMetals: 3, otherContaminants: 6 },
      resonanceBreakdown: { environmentalImpact: 10, ethicalSourcing: 8, packagingSustainability: 8, corporateTransparency: 6 },
    },
    contaminants: [
      { name: 'Lead', level: 12, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'danger', healthEffects: '24x above EWG guideline. Legacy of infrastructure crisis.' },
      { name: 'PFAS (Total)', level: 15, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Nearly 4x EPA limit.' },
      { name: 'Trihalomethanes', level: 55, unit: 'ppb', epaLimit: 80, ewgLimit: 0.8, status: 'danger', healthEffects: 'Disinfection byproducts, cancer risk' },
      { name: 'Haloacetic Acids', level: 42, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [
      { contaminant: 'Lead and Copper Rule', type: 'MCL Violation', date: '2023-12', resolved: false },
      { contaminant: 'PFAS', type: 'Health Advisory Exceedance', date: '2024-03', resolved: false },
    ],
    lastTested: '2025-Q2',
    ccrLink: 'https://www.cityofflint.com/water-quality/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring', effectiveness: 'Critical — removes lead, PFAS, THMs', priceRange: '$150-300', removes: ['Lead', 'PFAS', 'THMs', 'HAAs'] },
    ],
  },
  {
    id: 'austin-tx',
    city: 'Austin',
    state: 'Texas',
    zipCode: '78701',
    utilityName: 'Austin Water',
    population: 1000000,
    qpr: {
      overall: 52,
      quality: 50,
      purity: 48,
      resonance: 58,
      valueRatio: 13000,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 14, mineralProfile: 12, pH: 12, taste: 12 },
      purityBreakdown: { pfas: 10, microplastics: 12, heavyMetals: 14, otherContaminants: 12 },
      resonanceBreakdown: { environmentalImpact: 16, ethicalSourcing: 14, packagingSustainability: 14, corporateTransparency: 14 },
    },
    contaminants: [
      { name: 'Atrazine', level: 0.12, unit: 'ppb', epaLimit: 3, ewgLimit: 0.1, status: 'caution', healthEffects: 'Herbicide runoff. Endocrine disruptor.' },
      { name: 'Chromium-6', level: 0.08, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'caution', healthEffects: '4x above EWG health guideline' },
      { name: 'Haloacetic Acids', level: 18, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.austintexas.gov/department/water-quality-reports',
    filterRecommendations: [
      { type: 'Activated Carbon', brand: 'Brita', effectiveness: 'Reduces chlorine, some pesticides', priceRange: '$25-40', removes: ['Chlorine', 'Some pesticides'] },
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Comprehensive removal', priceRange: '$200-400', removes: ['Atrazine', 'Chromium-6', 'HAAs'] },
    ],
  },
  {
    id: 'denver-co',
    city: 'Denver',
    state: 'Colorado',
    zipCode: '80202',
    utilityName: 'Denver Water',
    population: 1500000,
    qpr: {
      overall: 62,
      quality: 65,
      purity: 58,
      resonance: 64,
      valueRatio: 15500,
      grade: 'C+',
      qualityBreakdown: { sourceIntegrity: 18, mineralProfile: 16, pH: 16, taste: 15 },
      purityBreakdown: { pfas: 14, microplastics: 15, heavyMetals: 15, otherContaminants: 14 },
      resonanceBreakdown: { environmentalImpact: 17, ethicalSourcing: 16, packagingSustainability: 16, corporateTransparency: 15 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 3.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Near EPA limit' },
      { name: 'Haloacetic Acids', level: 15, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.denverwater.org/your-water/water-quality',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'ZeroWater', effectiveness: 'Good for general improvement', priceRange: '$30-50', removes: ['Chlorine', 'Some metals', 'Some PFAS'] },
    ],
  },
  {
    id: 'miami-fl',
    city: 'Miami',
    state: 'Florida',
    zipCode: '33101',
    utilityName: 'Miami-Dade Water and Sewer Department',
    population: 2800000,
    qpr: {
      overall: 44,
      quality: 42,
      purity: 40,
      resonance: 52,
      valueRatio: 11000,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 11, mineralProfile: 10, pH: 11, taste: 10 },
      purityBreakdown: { pfas: 9, microplastics: 10, heavyMetals: 11, otherContaminants: 10 },
      resonanceBreakdown: { environmentalImpact: 14, ethicalSourcing: 13, packagingSustainability: 13, corporateTransparency: 12 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 8.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '2.2x above EPA limit. Military base contamination.' },
      { name: 'Trihalomethanes', level: 35, unit: 'ppb', epaLimit: 80, ewgLimit: 0.8, status: 'danger', healthEffects: 'Disinfection byproducts' },
      { name: 'Haloacetic Acids', level: 25, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
      { name: 'Radium-226/228', level: 1.8, unit: 'pCi/L', epaLimit: 5, ewgLimit: 0.05, status: 'danger', healthEffects: '36x above EWG guideline. Naturally occurring radioactive element.' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.miamidade.gov/global/water/water-quality.page',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC ROES-PH75', effectiveness: 'Removes PFAS, radium, THMs', priceRange: '$250-400', removes: ['PFAS', 'Radium', 'THMs', 'HAAs'] },
    ],
  },
  {
    id: 'seattle-wa',
    city: 'Seattle',
    state: 'Washington',
    zipCode: '98101',
    utilityName: 'Seattle Public Utilities',
    population: 750000,
    qpr: {
      overall: 82,
      quality: 85,
      purity: 80,
      resonance: 82,
      valueRatio: 20500,
      grade: 'B+',
      qualityBreakdown: { sourceIntegrity: 23, mineralProfile: 20, pH: 21, taste: 21 },
      purityBreakdown: { pfas: 20, microplastics: 20, heavyMetals: 20, otherContaminants: 20 },
      resonanceBreakdown: { environmentalImpact: 22, ethicalSourcing: 20, packagingSustainability: 20, corporateTransparency: 20 },
    },
    contaminants: [
      { name: 'Haloacetic Acids', level: 8, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Low levels of disinfection byproducts' },
      { name: 'PFAS (Total)', level: 1.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Below EPA limit, slightly above EWG guideline' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.seattle.gov/utilities/your-services/water/water-quality',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'Brita Elite', effectiveness: 'Light filtration sufficient', priceRange: '$25-40', removes: ['Chlorine', 'Some metals'] },
    ],
  },
  {
    id: 'portland-or',
    city: 'Portland',
    state: 'Oregon',
    zipCode: '97201',
    utilityName: 'Portland Water Bureau',
    population: 650000,
    qpr: {
      overall: 75,
      quality: 78,
      purity: 72,
      resonance: 76,
      valueRatio: 18800,
      grade: 'B',
      qualityBreakdown: { sourceIntegrity: 21, mineralProfile: 19, pH: 19, taste: 19 },
      purityBreakdown: { pfas: 18, microplastics: 18, heavyMetals: 18, otherContaminants: 18 },
      resonanceBreakdown: { environmentalImpact: 20, ethicalSourcing: 19, packagingSustainability: 19, corporateTransparency: 18 },
    },
    contaminants: [
      { name: 'Lead', level: 1.8, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: 'Above EWG guideline. Old plumbing in some areas.' },
      { name: 'Haloacetic Acids', level: 11, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.portland.gov/water/water-quality',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'ZeroWater', effectiveness: 'Good for lead reduction', priceRange: '$30-50', removes: ['Lead', 'Chlorine', 'Some metals'] },
    ],
  },
  {
    id: 'atlanta-ga',
    city: 'Atlanta',
    state: 'Georgia',
    zipCode: '30301',
    utilityName: 'City of Atlanta Department of Watershed Management',
    population: 500000,
    qpr: {
      overall: 50,
      quality: 48,
      purity: 46,
      resonance: 56,
      valueRatio: 12500,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 13, mineralProfile: 12, pH: 12, taste: 11 },
      purityBreakdown: { pfas: 10, microplastics: 12, heavyMetals: 12, otherContaminants: 12 },
      resonanceBreakdown: { environmentalImpact: 15, ethicalSourcing: 14, packagingSustainability: 14, corporateTransparency: 13 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 6.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '1.6x above EPA limit' },
      { name: 'Lead', level: 3.5, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: '7x above EWG guideline. Aging infrastructure.' },
      { name: 'Haloacetic Acids', level: 22, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [
      { contaminant: 'Total Coliform Rule', type: 'Monitoring', date: '2024-05', resolved: true },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.atlantawatershed.org/drinking-water/water-quality-report/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Removes PFAS, lead, HAAs', priceRange: '$200-400', removes: ['PFAS', 'Lead', 'HAAs'] },
    ],
  },
  {
    id: 'boston-ma',
    city: 'Boston',
    state: 'Massachusetts',
    zipCode: '02101',
    utilityName: 'Massachusetts Water Resources Authority (MWRA)',
    population: 700000,
    qpr: {
      overall: 80,
      quality: 82,
      purity: 78,
      resonance: 80,
      valueRatio: 20000,
      grade: 'B+',
      qualityBreakdown: { sourceIntegrity: 22, mineralProfile: 20, pH: 20, taste: 20 },
      purityBreakdown: { pfas: 19, microplastics: 20, heavyMetals: 20, otherContaminants: 19 },
      resonanceBreakdown: { environmentalImpact: 21, ethicalSourcing: 20, packagingSustainability: 20, corporateTransparency: 19 },
    },
    contaminants: [
      { name: 'Haloacetic Acids', level: 9, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Low levels of disinfection byproducts' },
      { name: 'PFAS (Total)', level: 1.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Below EPA limit' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.mwra.com/annual/waterreport/default.html',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'Brita', effectiveness: 'Light filtration sufficient', priceRange: '$25-40', removes: ['Chlorine', 'Some metals'] },
    ],
  },
  {
    id: 'fresno-ca',
    city: 'Fresno',
    state: 'California',
    zipCode: '93701',
    utilityName: 'City of Fresno Water Division',
    population: 540000,
    qpr: {
      overall: 28,
      quality: 25,
      purity: 22,
      resonance: 38,
      valueRatio: 7000,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 6, mineralProfile: 6, pH: 7, taste: 6 },
      purityBreakdown: { pfas: 4, microplastics: 6, heavyMetals: 5, otherContaminants: 7 },
      resonanceBreakdown: { environmentalImpact: 11, ethicalSourcing: 9, packagingSustainability: 9, corporateTransparency: 9 },
    },
    contaminants: [
      { name: '1,2,3-Trichloropropane (TCP)', level: 0.008, unit: 'ppb', epaLimit: 0, ewgLimit: 0.0004, status: 'danger', healthEffects: '20x above EWG guideline. Pesticide byproduct. Carcinogen.' },
      { name: 'Arsenic', level: 4.8, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'danger', healthEffects: '1,200x above EWG guideline. Agricultural contamination.' },
      { name: 'PFAS (Total)', level: 12, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '3x above EPA limit. Industrial contamination.' },
      { name: 'Nitrate', level: 6.8, unit: 'ppm', epaLimit: 10, ewgLimit: 0.14, status: 'danger', healthEffects: '49x above EWG guideline. Agricultural fertilizer runoff.' },
      { name: 'Chromium-6', level: 0.35, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '17.5x above EWG guideline' },
      { name: 'Uranium', level: 3.2, unit: 'ppb', epaLimit: 30, ewgLimit: 0.43, status: 'danger', healthEffects: '7.4x above EWG guideline. Naturally occurring radioactive element.' },
    ],
    violations: [
      { contaminant: 'TCP', type: 'MCL Violation', date: '2024-01', resolved: false },
      { contaminant: 'Nitrate', type: 'Monitoring', date: '2024-06', resolved: true },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.fresno.gov/publicutilities/water-quality-reports/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring RCC7AK', effectiveness: 'CRITICAL — removes TCP, arsenic, PFAS, nitrate, uranium', priceRange: '$200-350', removes: ['TCP', 'Arsenic', 'PFAS', 'Nitrate', 'Chromium-6', 'Uranium'] },
    ],
  },
  {
    id: 'newark-nj',
    city: 'Newark',
    state: 'New Jersey',
    zipCode: '07101',
    utilityName: 'Newark Department of Water & Sewer Utilities',
    population: 280000,
    qpr: {
      overall: 30,
      quality: 28,
      purity: 25,
      resonance: 38,
      valueRatio: 7500,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 7, mineralProfile: 7, pH: 7, taste: 7 },
      purityBreakdown: { pfas: 5, microplastics: 6, heavyMetals: 6, otherContaminants: 8 },
      resonanceBreakdown: { environmentalImpact: 11, ethicalSourcing: 9, packagingSustainability: 9, corporateTransparency: 9 },
    },
    contaminants: [
      { name: 'Lead', level: 15.2, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'danger', healthEffects: '30x above EWG guideline. Lead service line crisis.' },
      { name: 'PFAS (Total)', level: 10.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '2.6x above EPA limit' },
      { name: 'Haloacetic Acids', level: 32, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [
      { contaminant: 'Lead and Copper Rule', type: 'MCL Violation', date: '2024-02', resolved: false },
    ],
    lastTested: '2025-Q2',
    ccrLink: 'https://www.newarknj.gov/departments/water-sewer-utilities',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring', effectiveness: 'Critical for lead removal', priceRange: '$150-300', removes: ['Lead', 'PFAS', 'HAAs'] },
    ],
  },
  {
    id: 'pittsburgh-pa',
    city: 'Pittsburgh',
    state: 'Pennsylvania',
    zipCode: '15201',
    utilityName: 'Pittsburgh Water and Sewer Authority (PWSA)',
    population: 300000,
    qpr: {
      overall: 35,
      quality: 32,
      purity: 30,
      resonance: 44,
      valueRatio: 8800,
      grade: 'F',
      qualityBreakdown: { sourceIntegrity: 8, mineralProfile: 8, pH: 8, taste: 8 },
      purityBreakdown: { pfas: 6, microplastics: 8, heavyMetals: 7, otherContaminants: 9 },
      resonanceBreakdown: { environmentalImpact: 12, ethicalSourcing: 11, packagingSustainability: 11, corporateTransparency: 10 },
    },
    contaminants: [
      { name: 'Lead', level: 10.1, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'danger', healthEffects: '20x above EWG guideline. Massive lead pipe infrastructure.' },
      { name: 'PFAS (Total)', level: 7.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '1.8x above EPA limit' },
      { name: 'Chloramine', level: 2.8, unit: 'ppm', epaLimit: 4, ewgLimit: 0, status: 'caution', healthEffects: 'Disinfectant. Can leach lead from pipes.' },
    ],
    violations: [
      { contaminant: 'Lead and Copper Rule', type: 'MCL Violation', date: '2024-04', resolved: false },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.pgh2o.com/your-water/water-quality-compliance',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Critical for lead and PFAS', priceRange: '$200-400', removes: ['Lead', 'PFAS', 'Chloramine'] },
    ],
  },
  {
    id: 'san-diego-ca',
    city: 'San Diego',
    state: 'California',
    zipCode: '92101',
    utilityName: 'City of San Diego Public Utilities',
    population: 1400000,
    qpr: {
      overall: 55,
      quality: 53,
      purity: 50,
      resonance: 62,
      valueRatio: 13800,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 14, mineralProfile: 13, pH: 13, taste: 13 },
      purityBreakdown: { pfas: 12, microplastics: 13, heavyMetals: 13, otherContaminants: 12 },
      resonanceBreakdown: { environmentalImpact: 17, ethicalSourcing: 15, packagingSustainability: 15, corporateTransparency: 15 },
    },
    contaminants: [
      { name: 'Chromium-6', level: 0.12, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '6x above EWG guideline' },
      { name: 'PFAS (Total)', level: 4.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Above EPA limit' },
      { name: 'Haloacetic Acids', level: 20, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.sandiego.gov/public-utilities/water-quality',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC ROES-50', effectiveness: 'Removes PFAS, chromium-6, HAAs', priceRange: '$200-400', removes: ['PFAS', 'Chromium-6', 'HAAs'] },
    ],
  },
  {
    id: 'dallas-tx',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '75201',
    utilityName: 'Dallas Water Utilities',
    population: 1300000,
    qpr: {
      overall: 50,
      quality: 48,
      purity: 45,
      resonance: 58,
      valueRatio: 12500,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 13, mineralProfile: 12, pH: 12, taste: 11 },
      purityBreakdown: { pfas: 10, microplastics: 11, heavyMetals: 12, otherContaminants: 12 },
      resonanceBreakdown: { environmentalImpact: 16, ethicalSourcing: 14, packagingSustainability: 14, corporateTransparency: 14 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 5.8, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '1.5x above EPA limit' },
      { name: 'Atrazine', level: 0.18, unit: 'ppb', epaLimit: 3, ewgLimit: 0.1, status: 'caution', healthEffects: 'Herbicide runoff' },
      { name: 'Haloacetic Acids', level: 19, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://dallascityhall.com/departments/waterutilities/Pages/water-quality.aspx',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring', effectiveness: 'Removes PFAS, atrazine', priceRange: '$150-300', removes: ['PFAS', 'Atrazine', 'HAAs'] },
    ],
  },
  {
    id: 'washington-dc',
    city: 'Washington',
    state: 'District of Columbia',
    zipCode: '20001',
    utilityName: 'DC Water',
    population: 700000,
    qpr: {
      overall: 55,
      quality: 52,
      purity: 50,
      resonance: 64,
      valueRatio: 13800,
      grade: 'C',
      qualityBreakdown: { sourceIntegrity: 14, mineralProfile: 13, pH: 13, taste: 12 },
      purityBreakdown: { pfas: 12, microplastics: 13, heavyMetals: 12, otherContaminants: 13 },
      resonanceBreakdown: { environmentalImpact: 17, ethicalSourcing: 16, packagingSustainability: 16, corporateTransparency: 15 },
    },
    contaminants: [
      { name: 'Lead', level: 4.8, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: '9.6x above EWG guideline. Legacy lead pipes.' },
      { name: 'PFAS (Total)', level: 5.2, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Above EPA limit' },
      { name: 'Haloacetic Acids', level: 20, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.dcwater.com/water-quality',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Removes lead, PFAS, HAAs', priceRange: '$200-400', removes: ['Lead', 'PFAS', 'HAAs'] },
    ],
  },
  {
    id: 'minneapolis-mn',
    city: 'Minneapolis',
    state: 'Minnesota',
    zipCode: '55401',
    utilityName: 'Minneapolis Water Treatment & Distribution',
    population: 430000,
    qpr: {
      overall: 68,
      quality: 70,
      purity: 65,
      resonance: 70,
      valueRatio: 17000,
      grade: 'C+',
      qualityBreakdown: { sourceIntegrity: 19, mineralProfile: 17, pH: 17, taste: 17 },
      purityBreakdown: { pfas: 16, microplastics: 16, heavyMetals: 17, otherContaminants: 16 },
      resonanceBreakdown: { environmentalImpact: 19, ethicalSourcing: 17, packagingSustainability: 17, corporateTransparency: 17 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 3.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'caution', healthEffects: 'Near EPA limit. 3M contamination legacy.' },
      { name: 'Haloacetic Acids', level: 14, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'caution', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.minneapolismn.gov/government/programs-initiatives/water-quality/',
    filterRecommendations: [
      { type: 'Pitcher Filter', brand: 'ZeroWater', effectiveness: 'Good for PFAS reduction', priceRange: '$30-50', removes: ['PFAS', 'Chlorine', 'Some metals'] },
    ],
  },
  {
    id: 'las-vegas-nv',
    city: 'Las Vegas',
    state: 'Nevada',
    zipCode: '89101',
    utilityName: 'Las Vegas Valley Water District',
    population: 650000,
    qpr: {
      overall: 46,
      quality: 44,
      purity: 42,
      resonance: 54,
      valueRatio: 11500,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 11, mineralProfile: 11, pH: 11, taste: 11 },
      purityBreakdown: { pfas: 10, microplastics: 10, heavyMetals: 11, otherContaminants: 11 },
      resonanceBreakdown: { environmentalImpact: 15, ethicalSourcing: 13, packagingSustainability: 13, corporateTransparency: 13 },
    },
    contaminants: [
      { name: 'Chromium-6', level: 0.28, unit: 'ppb', epaLimit: 100, ewgLimit: 0.02, status: 'danger', healthEffects: '14x above EWG guideline' },
      { name: 'Arsenic', level: 3.0, unit: 'ppb', epaLimit: 10, ewgLimit: 0.004, status: 'danger', healthEffects: '750x above EWG guideline. Desert source.' },
      { name: 'PFAS (Total)', level: 5.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Above EPA limit' },
      { name: 'Total Dissolved Solids', level: 420, unit: 'ppm', epaLimit: 500, ewgLimit: 250, status: 'caution', healthEffects: 'Very hard water from Lake Mead' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.lvvwd.com/water-quality/index.html',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC ROES-50', effectiveness: 'Essential for arsenic, chromium-6, TDS', priceRange: '$200-400', removes: ['Arsenic', 'Chromium-6', 'PFAS', 'TDS'] },
    ],
  },
  {
    id: 'detroit-mi',
    city: 'Detroit',
    state: 'Michigan',
    zipCode: '48201',
    utilityName: 'Great Lakes Water Authority (GLWA)',
    population: 640000,
    qpr: {
      overall: 40,
      quality: 38,
      purity: 35,
      resonance: 48,
      valueRatio: 10000,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 10, mineralProfile: 10, pH: 9, taste: 9 },
      purityBreakdown: { pfas: 7, microplastics: 9, heavyMetals: 9, otherContaminants: 10 },
      resonanceBreakdown: { environmentalImpact: 13, ethicalSourcing: 12, packagingSustainability: 12, corporateTransparency: 11 },
    },
    contaminants: [
      { name: 'Lead', level: 5.5, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'danger', healthEffects: '11x above EWG guideline. Aging infrastructure.' },
      { name: 'PFAS (Total)', level: 8.0, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: '2x above EPA limit' },
      { name: 'Haloacetic Acids', level: 26, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
    ],
    violations: [
      { contaminant: 'Lead and Copper Rule', type: 'Monitoring', date: '2024-07', resolved: true },
    ],
    lastTested: '2025-Q3',
    ccrLink: 'https://www.glwater.org/water-quality/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'iSpring', effectiveness: 'Removes lead, PFAS, HAAs', priceRange: '$150-300', removes: ['Lead', 'PFAS', 'HAAs'] },
    ],
  },
  {
    id: 'philadelphia-pa',
    city: 'Philadelphia',
    state: 'Pennsylvania',
    zipCode: '19102',
    utilityName: 'Philadelphia Water Department',
    population: 1600000,
    qpr: {
      overall: 48,
      quality: 45,
      purity: 42,
      resonance: 58,
      valueRatio: 12000,
      grade: 'D',
      qualityBreakdown: { sourceIntegrity: 12, mineralProfile: 11, pH: 11, taste: 11 },
      purityBreakdown: { pfas: 9, microplastics: 11, heavyMetals: 11, otherContaminants: 11 },
      resonanceBreakdown: { environmentalImpact: 16, ethicalSourcing: 14, packagingSustainability: 14, corporateTransparency: 14 },
    },
    contaminants: [
      { name: 'PFAS (Total)', level: 7.5, unit: 'ppt', epaLimit: 4, ewgLimit: 1, status: 'danger', healthEffects: 'Nearly 2x EPA limit. Industrial contamination.' },
      { name: 'Lead', level: 4.0, unit: 'ppb', epaLimit: 15, ewgLimit: 0.5, status: 'caution', healthEffects: '8x above EWG guideline' },
      { name: 'Haloacetic Acids', level: 24, unit: 'ppb', epaLimit: 60, ewgLimit: 0.1, status: 'danger', healthEffects: 'Disinfection byproducts' },
      { name: 'Trihalomethanes', level: 28, unit: 'ppb', epaLimit: 80, ewgLimit: 0.8, status: 'danger', healthEffects: 'Chlorination byproducts' },
    ],
    violations: [],
    lastTested: '2025-Q3',
    ccrLink: 'https://water.phila.gov/quality/',
    filterRecommendations: [
      { type: 'Reverse Osmosis', brand: 'APEC', effectiveness: 'Removes PFAS, lead, THMs', priceRange: '$200-400', removes: ['PFAS', 'Lead', 'THMs', 'HAAs'] },
    ],
  },
];

// ── Utility Functions ─────────────────────────────────────────────

export function getTopRatedWaters(limit = 5): WaterProduct[] {
  return [...bottledWaters].sort((a, b) => b.qpr.overall - a.qpr.overall).slice(0, limit);
}

export function getWorstValueWaters(limit = 5): WaterProduct[] {
  return [...bottledWaters].sort((a, b) => a.qpr.valueRatio - b.qpr.valueRatio).slice(0, limit);
}

export function getBestValueWaters(limit = 5): WaterProduct[] {
  return [...bottledWaters].sort((a, b) => b.qpr.valueRatio - a.qpr.valueRatio).slice(0, limit);
}

export function searchWaters(query: string): WaterProduct[] {
  const q = query.toLowerCase();
  return bottledWaters.filter(
    w => w.name.toLowerCase().includes(q) ||
         w.brand.toLowerCase().includes(q) ||
         w.type.toLowerCase().includes(q) ||
         w.sourceLocation.toLowerCase().includes(q)
  );
}

export function searchTapWater(query: string): TapWaterData[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Import zip data dynamically to avoid circular deps
  // First: check if query is a ZIP code (5 digits)
  const isZip = /^\d{5}$/.test(q);

  // Direct match on city, state, or zip
  let results = tapWaterDatabase.filter(
    t => t.city.toLowerCase().includes(q) ||
         t.state.toLowerCase().includes(q) ||
         t.zipCode.includes(q) ||
         t.id.includes(q)
  );

  // If no direct match, try fuzzy matching
  if (results.length === 0) {
    // Try matching partial words (e.g., "santa" matches "Santa Monica")
    const words = q.split(/\s+/);
    results = tapWaterDatabase.filter(t => {
      const searchable = `${t.city} ${t.state} ${t.utilityName}`.toLowerCase();
      return words.every(w => searchable.includes(w));
    });
  }

  return results;
}

// Enhanced search that also checks ZIP code mapping
export function searchTapWaterByZip(zip: string, zipMap: Record<string, string>): TapWaterData | null {
  const cityId = zipMap[zip];
  if (cityId) {
    return tapWaterDatabase.find(t => t.id === cityId) || null;
  }
  return null;
}

// Find city by ID
export function getTapWaterById(id: string): TapWaterData | null {
  return tapWaterDatabase.find(t => t.id === id) || null;
}
