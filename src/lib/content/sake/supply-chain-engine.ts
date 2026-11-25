/**
 * Supply Chain Dollar Map Engine — MODULAR / REUSABLE
 * 
 * Traces every dollar from origin to consumer glass.
 * Designed to be dropped into any beverage index:
 *   - Sake (current)
 *   - Mezcal / Tequila (future)
 *   - Water (future)
 *   - Wine / Spirits (future)
 * 
 * Each node in the chain gets a dollar allocation, margin percentage,
 * carbon footprint estimate, and transparency score.
 */

// ============================================================
// GENERIC SUPPLY CHAIN TYPES (reusable across all beverage indexes)
// ============================================================

export type BeverageCategory = 'sake' | 'mezcal' | 'tequila' | 'water' | 'wine' | 'spirits';

export interface SupplyChainNode {
  id: string;
  label: string;
  labelJa?: string;
  role: 'producer' | 'brand' | 'importer' | 'distributor' | 'retailer' | 'restaurant' | 'consumer';
  entity?: string;           // Actual company name
  entityJa?: string;
  location?: string;
  locationJa?: string;
  country: string;
  dollarIn: number;          // What this node pays (cost basis)
  dollarOut: number;         // What this node charges (selling price)
  margin: number;            // Percentage margin at this node
  marginDollars: number;     // Absolute dollar margin
  carbonKg: number;          // CO2 kg added at this stage
  carbonSource: string;      // What generates the carbon (shipping, refrigeration, etc.)
  daysInChain: number;       // How many days the product spends at this stage
  transparencyScore: number; // 0-100 how transparent this node is about pricing
  notes: string;
  notesJa?: string;
}

export interface SupplyChainRoute {
  id: string;
  fromNode: string;
  toNode: string;
  transportMode: 'ocean_freight' | 'air_freight' | 'truck' | 'rail' | 'local' | 'none';
  distanceKm: number;
  carbonKgPerUnit: number;
  daysInTransit: number;
  costPerUnit: number;
  notes: string;
}

export interface SupplyChainMap {
  productId: string;
  productName: string;
  productNameJa?: string;
  category: BeverageCategory;
  originCountry: string;
  destinationCountry: string;
  nodes: SupplyChainNode[];
  routes: SupplyChainRoute[];
  totalRetailPrice: number;
  totalCarbonKg: number;
  totalDaysFromOrigin: number;
  // Where the money actually goes
  producerShare: number;     // % of retail that goes to the actual maker
  brandShare: number;        // % that goes to brand/marketing
  importerShare: number;     // % to importer
  distributorShare: number;  // % to distributor
  retailerShare: number;     // % to retailer
  taxAndDuty: number;        // % to government
  // Restaurant layer (optional)
  restaurantMarkup?: number;
  restaurantShare?: number;
}

// ============================================================
// CARBON FOOTPRINT CONSTANTS
// ============================================================

export const carbonConstants = {
  // kg CO2 per ton-km by transport mode
  oceanFreight: 0.008,      // Most efficient
  rail: 0.022,
  truck: 0.062,
  airFreight: 0.602,        // 75x worse than ocean
  // Per-unit estimates for a 720ml bottle (~1.2kg shipped weight)
  bottleWeight: 1.2,        // kg including packaging
  // Production carbon (kg CO2 per 720ml bottle)
  sakeProduction: 0.8,      // Rice cultivation + brewing + bottling
  mezcalProduction: 1.2,    // Agave cultivation + roasting + distilling
  tequilaProduction: 1.0,   // Agave + industrial distilling
  waterProduction: 0.3,     // Extraction + bottling
  // Refrigeration (for namazake / unpasteurized)
  refrigeratedShipping: 1.5, // multiplier on base shipping carbon
  coldStorage: 0.05,         // kg CO2 per day of cold storage per bottle
};

// ============================================================
// SAKE-SPECIFIC SUPPLY CHAIN DATA
// ============================================================

export interface SakeSupplyChainProfile {
  sakeId: string;
  name: string;
  nameJa: string;
  brewery: string;
  breweryJa: string;
  prefecture: string;
  prefectureJa: string;
  // Origin details
  originPort: string;
  originPortJa: string;
  usEntryPort: string;
  // Pricing at each stage (720ml bottle)
  breweryGatePrice: number;     // What the brewery sells for (JPY converted to USD)
  brandOwnerPrice: number;      // If brand ≠ brewery, what brand charges
  fobJapan: number;             // Free On Board Japan (export price)
  cifUS: number;                // Cost Insurance Freight to US port
  importerLandedCost: number;   // After customs, duty, FDA
  distributorPrice: number;     // What distributor charges retailer
  retailPrice: number;          // What consumer pays
  restaurantPrice: number;      // What restaurant charges (per 300ml serving equivalent)
  // Carbon journey
  requiresRefrigeration: boolean;
  isNamazake: boolean;
  shippingDistanceKm: number;
  usDistributionKm: number;     // Average distance from port to retailer
  // Supply chain actors
  importer: string;
  distributor: string;
  // Transparency
  breweryTransparency: number;  // 0-100
  importerTransparency: number;
  distributorTransparency: number;
  // Who's trying hard vs too hard
  integrityNotes: string;
  integrityNotesJa?: string;
  integrityScore: number;       // 0-100 (100 = pure craft, 0 = pure marketing)
}

// Helper: calculate margin percentage
function margin(costIn: number, priceOut: number): number {
  if (priceOut === 0) return 0;
  return Math.round(((priceOut - costIn) / priceOut) * 100);
}

// Helper: calculate carbon for a shipping leg
function shippingCarbon(distanceKm: number, mode: 'ocean_freight' | 'air_freight' | 'truck' | 'rail', refrigerated: boolean): number {
  const rates: Record<string, number> = {
    ocean_freight: carbonConstants.oceanFreight,
    air_freight: carbonConstants.airFreight,
    truck: carbonConstants.truck,
    rail: carbonConstants.rail,
  };
  const base = (distanceKm * rates[mode] * carbonConstants.bottleWeight) / 1000;
  return refrigerated ? base * carbonConstants.refrigeratedShipping : base;
}

// ============================================================
// GENERATE FULL SUPPLY CHAIN MAP FROM PROFILE
// ============================================================

export function generateSupplyChainMap(profile: SakeSupplyChainProfile): SupplyChainMap {
  const nodes: SupplyChainNode[] = [
    {
      id: 'brewery',
      label: 'Brewery / Kura',
      labelJa: '蔵元',
      role: 'producer',
      entity: profile.brewery,
      entityJa: profile.breweryJa,
      location: profile.prefecture,
      locationJa: profile.prefectureJa,
      country: 'Japan',
      dollarIn: 0,
      dollarOut: profile.breweryGatePrice,
      margin: 100, // They create the value
      marginDollars: profile.breweryGatePrice,
      carbonKg: carbonConstants.sakeProduction,
      carbonSource: 'Rice cultivation, water pumping, brewing, bottling',
      daysInChain: 30, // Average brewing + aging
      transparencyScore: profile.breweryTransparency,
      notes: 'The actual maker. Rice, water, koji, yeast, time, and human skill.',
      notesJa: '実際の造り手。米、水、麹、酵母、時間、そして人の技。',
    },
    {
      id: 'brand',
      label: 'Brand Owner',
      labelJa: 'ブランドオーナー',
      role: 'brand',
      entity: profile.brewery, // Usually same as brewery for sake
      entityJa: profile.breweryJa,
      location: profile.prefecture,
      locationJa: profile.prefectureJa,
      country: 'Japan',
      dollarIn: profile.breweryGatePrice,
      dollarOut: profile.fobJapan,
      margin: margin(profile.breweryGatePrice, profile.fobJapan),
      marginDollars: +(profile.fobJapan - profile.breweryGatePrice).toFixed(2),
      carbonKg: 0.1, // Packaging, labeling
      carbonSource: 'Export packaging, labeling, documentation',
      daysInChain: 5,
      transparencyScore: profile.breweryTransparency,
      notes: 'For most sake, the brewery IS the brand. No middleman markup here.',
      notesJa: 'ほとんどの日本酒では、蔵元がブランド。ここに仲介マークアップはない。',
    },
    {
      id: 'importer',
      label: 'US Importer',
      labelJa: '米国輸入業者',
      role: 'importer',
      entity: profile.importer,
      location: profile.usEntryPort,
      country: 'United States',
      dollarIn: profile.cifUS,
      dollarOut: profile.importerLandedCost,
      margin: margin(profile.cifUS, profile.importerLandedCost),
      marginDollars: +(profile.importerLandedCost - profile.cifUS).toFixed(2),
      carbonKg: 0.05, // Warehouse operations
      carbonSource: 'Customs clearance, FDA inspection, warehouse storage',
      daysInChain: 14,
      transparencyScore: profile.importerTransparency,
      notes: 'Handles customs, FDA compliance, duty payment, and initial US warehousing.',
      notesJa: '税関、FDA準拠、関税支払い、初期米国倉庫管理を担当。',
    },
    {
      id: 'distributor',
      label: 'Distributor',
      labelJa: '卸売業者',
      role: 'distributor',
      entity: profile.distributor,
      country: 'United States',
      dollarIn: profile.importerLandedCost,
      dollarOut: profile.distributorPrice,
      margin: margin(profile.importerLandedCost, profile.distributorPrice),
      marginDollars: +(profile.distributorPrice - profile.importerLandedCost).toFixed(2),
      carbonKg: shippingCarbon(profile.usDistributionKm, 'truck', profile.requiresRefrigeration),
      carbonSource: 'Truck delivery to retailers, warehouse operations',
      daysInChain: 7,
      transparencyScore: profile.distributorTransparency,
      notes: 'The invisible layer. Distributors take 20-30% and most consumers never know they exist.',
      notesJa: '見えない層。卸売業者は20-30%を取り、ほとんどの消費者はその存在を知らない。',
    },
    {
      id: 'retailer',
      label: 'Retailer',
      labelJa: '小売店',
      role: 'retailer',
      country: 'United States',
      dollarIn: profile.distributorPrice,
      dollarOut: profile.retailPrice,
      margin: margin(profile.distributorPrice, profile.retailPrice),
      marginDollars: +(profile.retailPrice - profile.distributorPrice).toFixed(2),
      carbonKg: profile.requiresRefrigeration ? 0.1 : 0.02,
      carbonSource: profile.requiresRefrigeration ? 'Refrigerated display, lighting' : 'Shelf storage, lighting',
      daysInChain: 30, // Average shelf time
      transparencyScore: 60,
      notes: 'Where you finally buy it. Markup varies wildly — Japanese grocery stores vs specialty shops.',
      notesJa: 'ここで最終的に購入。マークアップは大きく異なる — 日本食料品店 vs 専門店。',
    },
    {
      id: 'restaurant',
      label: 'Restaurant',
      labelJa: 'レストラン',
      role: 'restaurant',
      country: 'United States',
      dollarIn: profile.distributorPrice,
      dollarOut: profile.restaurantPrice,
      margin: margin(profile.distributorPrice, profile.restaurantPrice),
      marginDollars: +(profile.restaurantPrice - profile.distributorPrice).toFixed(2),
      carbonKg: profile.requiresRefrigeration ? 0.15 : 0.05,
      carbonSource: 'Refrigeration, glassware washing, ambiance energy',
      daysInChain: 14,
      transparencyScore: 30,
      notes: 'The biggest markup in the chain. 2.5-4x retail is standard. Some use sake as pure margin.',
      notesJa: 'チェーン内最大のマークアップ。小売の2.5-4倍が標準。純粋なマージンとして酒を使う店もある。',
    },
  ];

  const oceanCarbonKg = shippingCarbon(profile.shippingDistanceKm, 'ocean_freight', profile.requiresRefrigeration);

  const routes: SupplyChainRoute[] = [
    {
      id: 'brewery-to-port',
      fromNode: 'brewery',
      toNode: 'brand',
      transportMode: 'truck',
      distanceKm: 200, // Average brewery to Japanese port
      carbonKgPerUnit: shippingCarbon(200, 'truck', false),
      daysInTransit: 1,
      costPerUnit: 0.5,
      notes: 'Brewery to Japanese export port',
    },
    {
      id: 'japan-to-us',
      fromNode: 'brand',
      toNode: 'importer',
      transportMode: profile.isNamazake ? 'air_freight' : 'ocean_freight',
      distanceKm: profile.shippingDistanceKm,
      carbonKgPerUnit: profile.isNamazake
        ? shippingCarbon(profile.shippingDistanceKm, 'air_freight', true)
        : oceanCarbonKg,
      daysInTransit: profile.isNamazake ? 2 : 28,
      costPerUnit: +(profile.cifUS - profile.fobJapan).toFixed(2),
      notes: profile.isNamazake
        ? 'Air freight required for unpasteurized sake — 75x the carbon of ocean shipping'
        : 'Ocean container from Japan to US West/East Coast',
    },
    {
      id: 'importer-to-distributor',
      fromNode: 'importer',
      toNode: 'distributor',
      transportMode: 'truck',
      distanceKm: 500,
      carbonKgPerUnit: shippingCarbon(500, 'truck', profile.requiresRefrigeration),
      daysInTransit: 2,
      costPerUnit: 1.0,
      notes: 'Importer warehouse to distributor hub',
    },
    {
      id: 'distributor-to-retail',
      fromNode: 'distributor',
      toNode: 'retailer',
      transportMode: 'truck',
      distanceKm: profile.usDistributionKm,
      carbonKgPerUnit: shippingCarbon(profile.usDistributionKm, 'truck', profile.requiresRefrigeration),
      daysInTransit: 1,
      costPerUnit: 0.5,
      notes: 'Last mile to retail shelf',
    },
    {
      id: 'distributor-to-restaurant',
      fromNode: 'distributor',
      toNode: 'restaurant',
      transportMode: 'local',
      distanceKm: 50,
      carbonKgPerUnit: shippingCarbon(50, 'truck', profile.requiresRefrigeration),
      daysInTransit: 1,
      costPerUnit: 0.3,
      notes: 'Local delivery to restaurant',
    },
  ];

  const totalCarbon = nodes.reduce((sum, n) => sum + n.carbonKg, 0)
    + routes.reduce((sum, r) => sum + r.carbonKgPerUnit, 0);

  const totalDays = nodes.reduce((sum, n) => sum + n.daysInChain, 0)
    + routes.reduce((sum, r) => sum + r.daysInTransit, 0);

  return {
    productId: profile.sakeId,
    productName: profile.name,
    productNameJa: profile.nameJa,
    category: 'sake',
    originCountry: 'Japan',
    destinationCountry: 'United States',
    nodes,
    routes,
    totalRetailPrice: profile.retailPrice,
    totalCarbonKg: +totalCarbon.toFixed(2),
    totalDaysFromOrigin: totalDays,
    producerShare: Math.round((profile.breweryGatePrice / profile.retailPrice) * 100),
    brandShare: Math.round(((profile.fobJapan - profile.breweryGatePrice) / profile.retailPrice) * 100),
    importerShare: Math.round(((profile.importerLandedCost - profile.cifUS) / profile.retailPrice) * 100),
    distributorShare: Math.round(((profile.distributorPrice - profile.importerLandedCost) / profile.retailPrice) * 100),
    retailerShare: Math.round(((profile.retailPrice - profile.distributorPrice) / profile.retailPrice) * 100),
    taxAndDuty: Math.round(((profile.cifUS - profile.fobJapan) / profile.retailPrice) * 100),
    restaurantMarkup: +(profile.restaurantPrice / profile.retailPrice).toFixed(1),
    restaurantShare: Math.round(((profile.restaurantPrice - profile.distributorPrice) / profile.restaurantPrice) * 100),
  };
}

// ============================================================
// SAKE SUPPLY CHAIN PROFILES (per bottle)
// ============================================================

export const sakeSupplyChains: SakeSupplyChainProfile[] = [
  {
    sakeId: 'masumi-okuden',
    name: 'Masumi Okuden Kantsukuri',
    nameJa: '真澄 奥伝寒造り',
    brewery: 'Miyasaka Brewing',
    breweryJa: '宮坂醸造',
    prefecture: 'Nagano',
    prefectureJa: '長野',
    originPort: 'Yokohama',
    originPortJa: '横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 5.50,
    brandOwnerPrice: 5.50,
    fobJapan: 7.00,
    cifUS: 9.50,
    importerLandedCost: 12.00,
    distributorPrice: 15.50,
    retailPrice: 22.00,
    restaurantPrice: 14.00, // per 300ml serving
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8850,
    usDistributionKm: 800,
    importer: 'Mutual Trading Co.',
    distributor: 'Southern Glazer\'s',
    breweryTransparency: 85,
    importerTransparency: 60,
    distributorTransparency: 30,
    integrityScore: 90,
    integrityNotes: 'Miyasaka Brewing invented Yeast No. 7 — they literally advanced the entire industry. Zero marketing fluff. The sake speaks for itself at $22.',
    integrityNotesJa: '宮坂醸造は7号酵母を発明 — 業界全体を前進させた。マーケティングの虚飾ゼロ。22ドルで酒が自らを語る。',
  },
  {
    sakeId: 'hakkaisan-tokubetsu',
    name: 'Hakkaisan Tokubetsu Junmai',
    nameJa: '八海山 特別純米',
    brewery: 'Hakkaisan Brewery',
    breweryJa: '八海醸造',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    originPort: 'Niigata / Yokohama',
    originPortJa: '新潟 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 6.00,
    brandOwnerPrice: 6.00,
    fobJapan: 8.00,
    cifUS: 11.00,
    importerLandedCost: 14.00,
    distributorPrice: 18.50,
    retailPrice: 28.00,
    restaurantPrice: 18.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8850,
    usDistributionKm: 1200,
    importer: 'Hakkaisan USA (own import)',
    distributor: 'Multiple regional',
    breweryTransparency: 80,
    importerTransparency: 75,
    distributorTransparency: 35,
    integrityScore: 85,
    integrityNotes: 'Hakkaisan controls their own US import — rare vertical integration. Keeps prices honest. Snow-melt water from Mt. Hakkai is the real story, not marketing.',
    integrityNotesJa: '八海山は自社で米国輸入を管理 — 珍しい垂直統合。価格を正直に保つ。八海山の雪解け水が本当のストーリー。',
  },
  {
    sakeId: 'suigei-tokubetsu',
    name: 'Suigei Tokubetsu Junmai',
    nameJa: '酔鯨 特別純米',
    brewery: 'Suigei Brewing',
    breweryJa: '酔鯨酒造',
    prefecture: 'Kochi',
    prefectureJa: '高知',
    originPort: 'Kobe',
    originPortJa: '神戸',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 4.50,
    brandOwnerPrice: 4.50,
    fobJapan: 6.00,
    cifUS: 8.50,
    importerLandedCost: 11.00,
    distributorPrice: 14.00,
    retailPrice: 20.00,
    restaurantPrice: 12.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 9200,
    usDistributionKm: 600,
    importer: 'World Sake Imports',
    distributor: 'Regional networks',
    breweryTransparency: 88,
    importerTransparency: 65,
    distributorTransparency: 30,
    integrityScore: 95,
    integrityNotes: 'The highest QPR in the database. Suigei means "Drunken Whale" — named after a Tosa samurai who loved sake. At $20, this is the most honest bottle in America. Zero pretension.',
    integrityNotesJa: 'データベース最高のQPR。酔鯨は酒を愛した土佐の侍にちなむ。20ドルでアメリカで最も正直な瓶。気取りゼロ。',
  },
  {
    sakeId: 'born-gold',
    name: 'Born Gold Junmai Daiginjo',
    nameJa: '梵 ゴールド 純米大吟醸',
    brewery: 'Katoukichibee Shouten',
    breweryJa: '加藤吉平商店',
    prefecture: 'Fukui',
    prefectureJa: '福井',
    originPort: 'Tsuruga / Yokohama',
    originPortJa: '敦賀 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 8.00,
    brandOwnerPrice: 8.00,
    fobJapan: 11.00,
    cifUS: 14.50,
    importerLandedCost: 18.00,
    distributorPrice: 25.00,
    retailPrice: 38.00,
    restaurantPrice: 24.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 9100,
    usDistributionKm: 900,
    importer: 'Joto Sake',
    distributor: 'Skurnik Wines',
    breweryTransparency: 82,
    importerTransparency: 80,
    distributorTransparency: 40,
    integrityScore: 88,
    integrityNotes: 'Born is the official sake of Japanese state dinners. Served to world leaders. At $38 for a junmai daiginjo, the quality-to-price ratio is absurd. Joto Sake imports with genuine passion.',
    integrityNotesJa: '梵は日本の国賓晩餐会の公式酒。世界のリーダーに提供。38ドルの純米大吟醸として品質価格比は驚異的。',
  },
  {
    sakeId: 'dassai-23',
    name: 'Dassai 23 Junmai Daiginjo',
    nameJa: '獺祭 二割三分 純米大吟醸',
    brewery: 'Asahi Shuzo (Yamaguchi)',
    breweryJa: '旭酒造（山口）',
    prefecture: 'Yamaguchi',
    prefectureJa: '山口',
    originPort: 'Kobe',
    originPortJa: '神戸',
    usEntryPort: 'New York',
    breweryGatePrice: 15.00,
    brandOwnerPrice: 18.00,
    fobJapan: 22.00,
    cifUS: 28.00,
    importerLandedCost: 38.00,
    distributorPrice: 55.00,
    retailPrice: 85.00,
    restaurantPrice: 55.00,
    requiresRefrigeration: true,
    isNamazake: false,
    shippingDistanceKm: 14500,
    usDistributionKm: 1500,
    importer: 'Dassai USA (own subsidiary)',
    distributor: 'Multiple premium',
    breweryTransparency: 70,
    importerTransparency: 65,
    distributorTransparency: 25,
    integrityScore: 55,
    integrityNotes: 'The most marketed sake in the world. Dassai opened a NYC brewery to bypass import costs — but retail price stayed at $85. The 23% polish ratio is impressive engineering, but the brand premium is enormous. They\'re trying too hard to be the "Dom Pérignon of sake."',
    integrityNotesJa: '世界で最もマーケティングされた酒。獺祭はNYCに蔵を開設して輸入コストを回避 — しかし小売価格は85ドルのまま。23%精米歩合は印象的な技術だが、ブランドプレミアムは巨大。「酒のドン・ペリニヨン」になろうとしすぎている。',
  },
  {
    sakeId: 'juyondai-honmaru',
    name: 'Juyondai Honmaru',
    nameJa: '十四代 本丸',
    brewery: 'Takagi Shuzo',
    breweryJa: '高木酒造',
    prefecture: 'Yamagata',
    prefectureJa: '山形',
    originPort: 'Yokohama',
    originPortJa: '横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 6.00,
    brandOwnerPrice: 6.00,
    fobJapan: 8.00,
    cifUS: 11.00,
    importerLandedCost: 15.00,
    distributorPrice: 22.00,
    retailPrice: 250.00,
    restaurantPrice: 120.00,
    requiresRefrigeration: true,
    isNamazake: false,
    shippingDistanceKm: 8850,
    usDistributionKm: 800,
    importer: 'Specialty gray market',
    distributor: 'Speculator networks',
    breweryTransparency: 95,
    importerTransparency: 10,
    distributorTransparency: 5,
    integrityScore: 15,
    integrityNotes: 'The brewery is pure. Takagi Shuzo sells at $15 in Japan. The US price of $250 is 100% speculator markup — the brewery sees none of it. This is the most extreme example of supply chain exploitation in the sake world. The $228 gap between brewery price and retail is pure middleman extraction.',
    integrityNotesJa: '蔵元は純粋。高木酒造は日本で15ドルで販売。米国の250ドルは100%投機家のマークアップ — 蔵元には一銭も入らない。酒の世界で最も極端なサプライチェーン搾取の例。',
  },
  {
    sakeId: 'tedorigawa-silver',
    name: 'Tedorigawa Silver Mountain',
    nameJa: '手取川 銀嶺',
    brewery: 'Yoshida Brewery',
    breweryJa: '吉田酒造店',
    prefecture: 'Ishikawa',
    prefectureJa: '石川',
    originPort: 'Kanazawa / Yokohama',
    originPortJa: '金沢 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 10.00,
    brandOwnerPrice: 10.00,
    fobJapan: 13.00,
    cifUS: 17.00,
    importerLandedCost: 22.00,
    distributorPrice: 30.00,
    retailPrice: 45.00,
    restaurantPrice: 28.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8900,
    usDistributionKm: 700,
    importer: 'Joto Sake',
    distributor: 'Skurnik Wines',
    breweryTransparency: 90,
    importerTransparency: 80,
    distributorTransparency: 40,
    integrityScore: 92,
    integrityNotes: 'Yoshida Brewery is a 6th-generation family operation. Noto toji tradition. Joto Sake imports with genuine love. At $45 for a junmai daiginjo that rivals $100+ bottles, the supply chain is remarkably honest.',
    integrityNotesJa: '吉田酒造店は6代続く家族経営。能登杜氏の伝統。Joto Sakeが真の愛情を持って輸入。100ドル以上の瓶に匹敵する純米大吟醸が45ドル。',
  },
  {
    sakeId: 'kokuryu-junmai',
    name: 'Kokuryu Junmai Ginjo',
    nameJa: '黒龍 純米吟醸',
    brewery: 'Kokuryu Brewery',
    breweryJa: '黒龍酒造',
    prefecture: 'Fukui',
    prefectureJa: '福井',
    originPort: 'Tsuruga / Yokohama',
    originPortJa: '敦賀 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 8.50,
    brandOwnerPrice: 8.50,
    fobJapan: 11.50,
    cifUS: 15.00,
    importerLandedCost: 19.00,
    distributorPrice: 24.00,
    retailPrice: 35.00,
    restaurantPrice: 22.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 9100,
    usDistributionKm: 800,
    importer: 'Vine Connections',
    distributor: 'Regional premium',
    breweryTransparency: 85,
    importerTransparency: 75,
    distributorTransparency: 35,
    integrityScore: 87,
    integrityNotes: 'Kokuryu (Black Dragon) was one of the first Fukui breweries to focus on ginjo. They pioneered the "Burgundy approach" to sake — terroir-driven, not marketing-driven. Vine Connections imports thoughtfully.',
    integrityNotesJa: '黒龍は福井で最初に吟醸に注力した蔵の一つ。「ブルゴーニュアプローチ」を先駆 — マーケティングではなくテロワール主導。',
  },
  {
    sakeId: 'dewazakura-oka',
    name: 'Dewazakura Oka Ginjo',
    nameJa: '出羽桜 桜花 吟醸',
    brewery: 'Dewazakura Brewery',
    breweryJa: '出羽桜酒造',
    prefecture: 'Yamagata',
    prefectureJa: '山形',
    originPort: 'Yokohama',
    originPortJa: '横浜',
    usEntryPort: 'New York',
    breweryGatePrice: 5.00,
    brandOwnerPrice: 5.00,
    fobJapan: 7.00,
    cifUS: 10.00,
    importerLandedCost: 13.50,
    distributorPrice: 17.50,
    retailPrice: 25.00,
    restaurantPrice: 16.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 14500,
    usDistributionKm: 500,
    importer: 'World Sake Imports',
    distributor: 'MS Walker / regional',
    breweryTransparency: 88,
    importerTransparency: 70,
    distributorTransparency: 35,
    integrityScore: 93,
    integrityNotes: 'Dewazakura literally started the ginjo boom in the 1980s. "Oka" means cherry blossom. At $25, this is a masterclass in restraint — the brewery could charge twice as much and nobody would blink. They choose not to.',
    integrityNotesJa: '出羽桜は1980年代に吟醸ブームを文字通り始めた。「桜花」は桜の花。25ドルで抑制のマスタークラス — 蔵は2倍請求しても誰も驚かない。しかし選ばない。',
  },
  {
    sakeId: 'nanbu-bijin-tokubetsu',
    name: 'Nanbu Bijin Tokubetsu Junmai',
    nameJa: '南部美人 特別純米',
    brewery: 'Nanbu Bijin',
    breweryJa: '南部美人',
    prefecture: 'Iwate',
    prefectureJa: '岩手',
    originPort: 'Yokohama',
    originPortJa: '横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 5.00,
    brandOwnerPrice: 5.00,
    fobJapan: 7.00,
    cifUS: 10.00,
    importerLandedCost: 13.00,
    distributorPrice: 17.00,
    retailPrice: 24.00,
    restaurantPrice: 15.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8850,
    usDistributionKm: 900,
    importer: 'Mutual Trading Co.',
    distributor: 'Southern Glazer\'s',
    breweryTransparency: 90,
    importerTransparency: 60,
    distributorTransparency: 30,
    integrityScore: 91,
    integrityNotes: 'Nanbu Bijin means "Southern Beauty." 5th-generation kurabito Kosuke Kuji is one of the most passionate ambassadors for sake in the world. The brewery survived the 2011 tsunami. At $24, every dollar feels earned.',
    integrityNotesJa: '南部美人は「南部の美人」。5代目蔵人の久慈浩介は世界で最も情熱的な日本酒大使の一人。蔵は2011年の津波を生き延びた。24ドルの一銭一銭が正当。',
  },
  {
    sakeId: 'kubota-manju',
    name: 'Kubota Manju Junmai Daiginjo',
    nameJa: '久保田 萬寿 純米大吟醸',
    brewery: 'Asahi Shuzo (Niigata)',
    breweryJa: '朝日酒造（新潟）',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    originPort: 'Niigata / Yokohama',
    originPortJa: '新潟 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 14.00,
    brandOwnerPrice: 16.00,
    fobJapan: 20.00,
    cifUS: 26.00,
    importerLandedCost: 34.00,
    distributorPrice: 44.00,
    retailPrice: 65.00,
    restaurantPrice: 42.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8850,
    usDistributionKm: 1200,
    importer: 'Asahi Shuzo USA',
    distributor: 'Multiple premium',
    breweryTransparency: 70,
    importerTransparency: 65,
    distributorTransparency: 30,
    integrityScore: 65,
    integrityNotes: 'Kubota Manju is a solid junmai daiginjo, but the brand has become a status symbol in Japan. The US price of $65 carries a significant brand premium. Good sake, but you\'re paying for the name more than the liquid at this point.',
    integrityNotesJa: '久保田萬寿は堅実な純米大吟醸だが、ブランドは日本でステータスシンボルに。米国65ドルには大きなブランドプレミアム。良い酒だが、この時点では液体よりも名前に支払っている。',
  },
  {
    sakeId: 'isojiman-junmai',
    name: 'Isojiman Junmai Ginjo',
    nameJa: '磯自慢 純米吟醸',
    brewery: 'Isojiman Shuzo',
    breweryJa: '磯自慢酒造',
    prefecture: 'Shizuoka',
    prefectureJa: '静岡',
    originPort: 'Shimizu / Yokohama',
    originPortJa: '清水 / 横浜',
    usEntryPort: 'Los Angeles',
    breweryGatePrice: 9.00,
    brandOwnerPrice: 9.00,
    fobJapan: 12.00,
    cifUS: 16.00,
    importerLandedCost: 21.00,
    distributorPrice: 28.00,
    retailPrice: 42.00,
    restaurantPrice: 26.00,
    requiresRefrigeration: false,
    isNamazake: false,
    shippingDistanceKm: 8900,
    usDistributionKm: 700,
    importer: 'Vine Connections',
    distributor: 'Skurnik Wines',
    breweryTransparency: 92,
    importerTransparency: 78,
    distributorTransparency: 38,
    integrityScore: 94,
    integrityNotes: 'Isojiman is the sommelier\'s secret. Ocean-influenced Shizuoka terroir. The brewery barely markets at all — word of mouth only. At $42, the supply chain is clean and the quality is transcendent. This is what integrity looks like.',
    integrityNotesJa: '磯自慢はソムリエの秘密。海の影響を受けた静岡のテロワール。蔵はほとんどマーケティングしない — 口コミのみ。42ドルでサプライチェーンはクリーン、品質は超越的。',
  },
];

// ============================================================
// US-BASED SAKE BREWERIES (lowest carbon footprint)
// ============================================================

export interface USBrewery {
  id: string;
  name: string;
  city: string;
  state: string;
  founded: number;
  carbonFootprint: 'ultra-low' | 'low' | 'medium';
  carbonKgPerBottle: number;
  description: string;
  descriptionJa: string;
  website?: string;
  notableSakes: string[];
  integrityScore: number;
  priceRange: string;
}

export const usBreweries: USBrewery[] = [
  {
    id: 'brooklyn-kura',
    name: 'Brooklyn Kura',
    city: 'Brooklyn',
    state: 'NY',
    founded: 2018,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.4,
    description: 'America\'s first sake brewery in a major city. Founded by two friends who left finance to make sake in Industry City. Zero ocean shipping. Local rice from the Northeast. The lowest carbon sake you can buy in America.',
    descriptionJa: '大都市初のアメリカの酒蔵。金融業界を去った二人の友人がインダストリー・シティで酒を造る。海上輸送ゼロ。北東部の地元米。アメリカで最も低炭素の酒。',
    website: 'https://brooklynkura.com',
    notableSakes: ['#14 Junmai Ginjo', 'Occidental Junmai', 'Number Fourteen Nama'],
    integrityScore: 98,
    priceRange: '$18-35',
  },
  {
    id: 'sequoia-sake',
    name: 'Sequoia Sake',
    city: 'San Francisco',
    state: 'CA',
    founded: 2014,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.35,
    description: 'San Francisco\'s first sake brewery. Uses California-grown Calrose rice and local water. Husband-wife team Jake Myrick and Noriko Kamei blend Japanese tradition with Bay Area innovation. Taproom in Bayview.',
    descriptionJa: 'サンフランシスコ初の酒蔵。カリフォルニア産カルローズ米と地元の水を使用。夫婦チームが日本の伝統とベイエリアのイノベーションを融合。',
    website: 'https://sequoiasake.com',
    notableSakes: ['Coastal Junmai', 'Nama Ginjo', 'Genshu'],
    integrityScore: 96,
    priceRange: '$16-30',
  },
  {
    id: 'texas-sake',
    name: 'Texas Sake Company',
    city: 'Austin',
    state: 'TX',
    founded: 2011,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.38,
    description: 'The first sake brewery in Texas. Uses Texas-grown rice — the state is actually one of the largest rice producers in the US. Yoed Anis trained in Japan and brings authentic technique to the Lone Star State.',
    descriptionJa: 'テキサス初の酒蔵。テキサス産米を使用 — 実はテキサスは米国最大の米生産地の一つ。日本で修行したYoed Anisがローンスター州に本格的な技術をもたらす。',
    website: 'https://texassake.com',
    notableSakes: ['Whooping Crane Junmai', 'Town Lake Junmai Ginjo', 'Nama'],
    integrityScore: 94,
    priceRange: '$15-28',
  },
  {
    id: 'setting-sun',
    name: 'Setting Sun Sake Brewing',
    city: 'San Diego',
    state: 'CA',
    founded: 2020,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.32,
    description: 'San Diego\'s first sake brewery. Founded by a former Navy officer who fell in love with sake in Japan. Uses California rice and San Diego water. Taproom in North Park. The newest and one of the most exciting US breweries.',
    descriptionJa: 'サンディエゴ初の酒蔵。日本で酒に恋した元海軍将校が設立。カリフォルニア米とサンディエゴの水を使用。ノースパークにタップルーム。',
    notableSakes: ['North Park Junmai', 'Sunset Ginjo', 'Pacific Nama'],
    integrityScore: 95,
    priceRange: '$14-26',
  },
  {
    id: 'moto-i',
    name: 'Moto-i',
    city: 'Minneapolis',
    state: 'MN',
    founded: 2008,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.42,
    description: 'The first sake brewery/restaurant outside of Japan. Brews on-site in Uptown Minneapolis. Their sake never travels more than 50 feet from tank to glass. The ultimate zero-mile sake experience.',
    descriptionJa: '日本国外初の酒蔵/レストラン。ミネアポリスのアップタウンで醸造。酒はタンクからグラスまで50フィート以上移動しない。究極のゼロマイル酒体験。',
    website: 'https://motoi.com',
    notableSakes: ['Junmai', 'Junmai Ginjo', 'Seasonal Nama'],
    integrityScore: 93,
    priceRange: '$12-24',
  },
  {
    id: 'den-sake',
    name: 'Den Sake Brewery',
    city: 'Los Angeles',
    state: 'CA',
    founded: 2019,
    carbonFootprint: 'ultra-low',
    carbonKgPerBottle: 0.36,
    description: 'LA\'s first sake brewery, founded in the Arts District. Uses California Calrose and Yamada Nishiki rice. The toji trained at multiple breweries in Japan. Their taproom is a destination for the LA sake community.',
    descriptionJa: 'LAのアーツ・ディストリクトに設立されたLA初の酒蔵。カリフォルニアのカルローズと山田錦を使用。杜氏は日本の複数の蔵で修行。',
    notableSakes: ['Arts District Junmai', 'Ginjo', 'Sparkling Nigori'],
    integrityScore: 95,
    priceRange: '$16-32',
  },
];

// ============================================================
// RESTAURANT INTEGRITY DATA
// ============================================================

export interface RestaurantIntegrityProfile {
  type: string;
  typeJa: string;
  description: string;
  descriptionJa: string;
  typicalMarkup: string;
  integrityScore: number;
  sakeStrategy: 'margin' | 'experience' | 'balanced' | 'education';
  redFlags: string[];
  redFlagsJa: string[];
  greenFlags: string[];
  greenFlagsJa: string[];
  examples: string;
  examplesJa: string;
}

export const restaurantIntegrityProfiles: RestaurantIntegrityProfile[] = [
  {
    type: 'The Educator',
    typeJa: '教育者',
    description: 'Uses sake to teach and delight. Staff trained. Flight options. Temperature choices. These restaurants lose money on sake to build lifetime customers.',
    descriptionJa: '酒で教え、喜ばせる。スタッフは訓練済み。フライトオプション。温度の選択肢。生涯顧客を築くために酒で損をする。',
    typicalMarkup: '2-2.5x',
    integrityScore: 95,
    sakeStrategy: 'education',
    redFlags: [],
    redFlagsJa: [],
    greenFlags: ['Flight/tasting menus', 'Temperature recommendations', 'Staff can explain types', 'Rotating seasonal selections', 'Sake sommelier on staff'],
    greenFlagsJa: ['フライト/テイスティングメニュー', '温度の推薦', 'スタッフがタイプを説明できる', '季節のローテーション', '酒ソムリエがスタッフに'],
    examples: 'True Sake Bar (SF), Sakagura (NYC), Ototo (LA)',
    examplesJa: 'True Sake Bar（SF）、酒蔵（NYC）、Ototo（LA）',
  },
  {
    type: 'The Craftsman',
    typeJa: '職人',
    description: 'Curates a small, thoughtful sake list. Every bottle chosen for a reason. Pairs with the food menu. Fair pricing because they believe in the product.',
    descriptionJa: '小さく思慮深い酒リストをキュレーション。すべての瓶に理由がある。料理メニューとペアリング。製品を信じているから公正な価格。',
    typicalMarkup: '2.5-3x',
    integrityScore: 85,
    sakeStrategy: 'experience',
    redFlags: [],
    redFlagsJa: [],
    greenFlags: ['Small curated list (5-15 bottles)', 'Food pairing suggestions', 'Sake changes with menu seasons', 'Owner/chef selects personally'],
    greenFlagsJa: ['小さなキュレーションリスト（5-15本）', '料理ペアリングの提案', '酒がメニューの季節と共に変わる', 'オーナー/シェフが個人的に選択'],
    examples: 'Sushi Nakazawa (NYC), n/naka (LA), Rintaro (SF)',
    examplesJa: 'Sushi Nakazawa（NYC）、n/naka（LA）、Rintaro（SF）',
  },
  {
    type: 'The Balanced',
    typeJa: 'バランス型',
    description: 'Standard Japanese restaurant with a decent sake list. Not trying to educate, not trying to exploit. Industry-standard markup. Reliable but not inspiring.',
    descriptionJa: 'まともな酒リストを持つ標準的な日本食レストラン。教育しようとも搾取しようともしない。業界標準のマークアップ。信頼できるが感動はない。',
    typicalMarkup: '3x',
    integrityScore: 60,
    sakeStrategy: 'balanced',
    redFlags: ['Only mainstream brands', 'No temperature guidance'],
    redFlagsJa: ['主流ブランドのみ', '温度のガイダンスなし'],
    greenFlags: ['Reasonable prices', 'Consistent quality', 'Sake served at correct temp'],
    greenFlagsJa: ['合理的な価格', '一貫した品質', '酒が正しい温度で提供'],
    examples: 'Most neighborhood sushi restaurants',
    examplesJa: 'ほとんどの近所の寿司レストラン',
  },
  {
    type: 'The Margin Builder',
    typeJa: 'マージンビルダー',
    description: 'Uses sake as a profit center. Overpriced hot sake. Mainstream brands at premium prices. Staff doesn\'t know the difference between junmai and daiginjo. Sake is an afterthought.',
    descriptionJa: '酒を利益センターとして使用。割高な熱燗。主流ブランドをプレミアム価格で。スタッフは純米と大吟醸の違いを知らない。酒は後回し。',
    typicalMarkup: '3.5-4x',
    integrityScore: 30,
    sakeStrategy: 'margin',
    redFlags: ['Hot sake only', 'No brand names listed', '"House sake" at $12/glass', 'Staff can\'t describe any sake', 'Same list for 5+ years'],
    redFlagsJa: ['熱燗のみ', 'ブランド名が記載されていない', '「ハウス酒」がグラス12ドル', 'スタッフが酒を説明できない', '5年以上同じリスト'],
    greenFlags: [],
    greenFlagsJa: [],
    examples: 'Chain Japanese restaurants, hotel bars, fusion restaurants',
    examplesJa: 'チェーンの日本食レストラン、ホテルバー、フュージョンレストラン',
  },
  {
    type: 'The Tourist Trap',
    typeJa: '観光客罠',
    description: 'Actively exploits sake ignorance. 4x+ markup. Cheap sake in fancy bottles. "Premium" sake that costs $8 in Japan sold for $60. The worst of the industry.',
    descriptionJa: '酒の無知を積極的に搾取。4倍以上のマークアップ。安い酒を高級ボトルに。日本で8ドルの「プレミアム」酒を60ドルで販売。業界最悪。',
    typicalMarkup: '4x+',
    integrityScore: 10,
    sakeStrategy: 'margin',
    redFlags: ['4x+ markup on identifiable bottles', '"Rare" sake that\'s common in Japan', 'Sake served in wrong glassware', 'No vintage or brewery info', 'Pushy upselling on sake'],
    redFlagsJa: ['識別可能なボトルに4倍以上のマークアップ', '日本では一般的な「レア」酒', '間違ったグラスで提供', 'ヴィンテージや蔵元情報なし', '酒の押し売り'],
    greenFlags: [],
    greenFlagsJa: [],
    examples: 'Tourist-area Japanese restaurants, airport sake bars',
    examplesJa: '観光地の日本食レストラン、空港の酒バー',
  },
];

// ============================================================
// ORDERING GUIDE QUESTIONS
// ============================================================

export interface OrderingGuideQuestion {
  id: string;
  question: string;
  questionJa: string;
  options: {
    id: string;
    label: string;
    labelJa: string;
    tags: string[];
    carbonWeight: number; // 0-1, how much this choice favors low-carbon options
  }[];
}

export const orderingGuideQuestions: OrderingGuideQuestion[] = [
  {
    id: 'experience',
    question: 'What kind of experience are you looking for tonight?',
    questionJa: '今夜はどんな体験を求めていますか？',
    options: [
      { id: 'explore', label: 'I want to explore something new', labelJa: '新しいものを探求したい', tags: ['adventurous', 'unique'], carbonWeight: 0.5 },
      { id: 'comfort', label: 'Something familiar and comforting', labelJa: '馴染みのある安心感', tags: ['classic', 'reliable'], carbonWeight: 0.7 },
      { id: 'impress', label: 'I want to impress someone', labelJa: '誰かを感動させたい', tags: ['premium', 'presentation'], carbonWeight: 0.3 },
      { id: 'learn', label: 'I want to learn about sake', labelJa: '日本酒について学びたい', tags: ['educational', 'variety'], carbonWeight: 0.6 },
    ],
  },
  {
    id: 'flavor',
    question: 'Which flavor world speaks to you?',
    questionJa: 'どの味わいの世界が語りかけますか？',
    options: [
      { id: 'clean', label: 'Clean, crisp, mineral — like mountain water', labelJa: 'クリーン、キリッと、ミネラル — 山の水のように', tags: ['clean', 'mineral', 'dry'], carbonWeight: 0.5 },
      { id: 'fruity', label: 'Fruity, aromatic, lush — like a garden', labelJa: 'フルーティー、芳醇、豊か — 庭園のように', tags: ['fruity', 'aromatic', 'sweet'], carbonWeight: 0.4 },
      { id: 'umami', label: 'Rich, savory, deep — like the earth', labelJa: '豊か、旨味、深い — 大地のように', tags: ['umami', 'rich', 'earthy'], carbonWeight: 0.8 },
      { id: 'funky', label: 'Wild, funky, unpredictable — like a storm', labelJa: 'ワイルド、ファンキー、予測不可能 — 嵐のように', tags: ['funky', 'wild', 'complex'], carbonWeight: 0.6 },
    ],
  },
  {
    id: 'temperature',
    question: 'How do you feel about temperature?',
    questionJa: '温度についてどう思いますか？',
    options: [
      { id: 'cold', label: 'Chilled — I like my drinks cold', labelJa: '冷酒 — 冷たい飲み物が好き', tags: ['chilled', 'ginjo'], carbonWeight: 0.4 },
      { id: 'room', label: 'Room temperature — let it breathe', labelJa: '常温 — 呼吸させて', tags: ['room', 'junmai'], carbonWeight: 0.7 },
      { id: 'warm', label: 'Warm — I love the ritual of heated sake', labelJa: '燗酒 — 温めた酒の儀式が好き', tags: ['warm', 'kan', 'traditional'], carbonWeight: 0.9 },
      { id: 'any', label: 'Surprise me — I trust the sommelier', labelJa: '驚かせて — ソムリエを信頼する', tags: ['flexible', 'open'], carbonWeight: 0.6 },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s your comfort zone for a glass/serving?',
    questionJa: 'グラス/一杯のコンフォートゾーンは？',
    options: [
      { id: 'value', label: '$8-15 — Great sake doesn\'t need to be expensive', labelJa: '$8-15 — 素晴らしい酒は高くなくていい', tags: ['value', 'qpr'], carbonWeight: 0.8 },
      { id: 'mid', label: '$15-25 — I\'ll invest for quality', labelJa: '$15-25 — 品質に投資する', tags: ['mid-range', 'quality'], carbonWeight: 0.6 },
      { id: 'premium', label: '$25-40 — Special occasion energy', labelJa: '$25-40 — 特別な機会のエネルギー', tags: ['premium', 'special'], carbonWeight: 0.4 },
      { id: 'no-limit', label: 'Price is not the point tonight', labelJa: '今夜は価格は問題ではない', tags: ['luxury', 'experience'], carbonWeight: 0.2 },
    ],
  },
  {
    id: 'carbon',
    question: 'How much does the journey matter to you?',
    questionJa: '旅路はどれくらい重要ですか？',
    options: [
      { id: 'local', label: 'I\'d love to try American-made sake — lowest footprint', labelJa: 'アメリカ産の酒を試したい — 最低フットプリント', tags: ['local', 'us-brewed'], carbonWeight: 1.0 },
      { id: 'conscious', label: 'I prefer ocean-shipped, not air-freighted', labelJa: '空輸ではなく船便が好み', tags: ['ocean', 'conscious'], carbonWeight: 0.7 },
      { id: 'authentic', label: 'I want the real thing from Japan, carbon be damned', labelJa: '日本の本物が欲しい、炭素なんて関係ない', tags: ['imported', 'authentic'], carbonWeight: 0.2 },
      { id: 'unaware', label: 'I never thought about this before — tell me more', labelJa: '考えたことがなかった — もっと教えて', tags: ['curious', 'open'], carbonWeight: 0.5 },
    ],
  },
];

// ============================================================
// CARBON TIER CLASSIFICATION
// ============================================================

export interface CarbonTier {
  tier: string;
  tierJa: string;
  range: string;
  color: string;
  description: string;
  descriptionJa: string;
}

export const carbonTiers: CarbonTier[] = [
  { tier: 'Ultra-Low', tierJa: '超低', range: '< 0.5 kg CO₂', color: '#22c55e', description: 'US-brewed sake. Zero ocean shipping. Local rice, local water. The greenest glass you can pour.', descriptionJa: '米国醸造の酒。海上輸送ゼロ。地元の米、地元の水。最もグリーンな一杯。' },
  { tier: 'Low', tierJa: '低', range: '0.5-1.5 kg CO₂', color: '#84cc16', description: 'Ocean-shipped from Japan. Standard pasteurized sake. The most efficient way to get authentic Japanese sake to America.', descriptionJa: '日本から船便。標準的な火入れ酒。本格的な日本酒をアメリカに届ける最も効率的な方法。' },
  { tier: 'Medium', tierJa: '中', range: '1.5-3.0 kg CO₂', color: '#eab308', description: 'Refrigerated ocean shipping or long US distribution chains. Namazake and delicate sakes that need cold chain.', descriptionJa: '冷蔵船便または長い米国流通チェーン。生酒やデリケートな酒は冷蔵チェーンが必要。' },
  { tier: 'High', tierJa: '高', range: '3.0-6.0 kg CO₂', color: '#f97316', description: 'Air-freighted sake. Some namazake and seasonal releases fly to preserve freshness. 75x the carbon of ocean shipping.', descriptionJa: '空輸の酒。一部の生酒や季節限定品は鮮度を保つために空輸。海上輸送の75倍の炭素。' },
  { tier: 'Very High', tierJa: '非常に高', range: '> 6.0 kg CO₂', color: '#ef4444', description: 'Air-freighted + refrigerated + long distribution. The most carbon-intensive sake journey possible.', descriptionJa: '空輸＋冷蔵＋長距離流通。最も炭素集約的な酒の旅。' },
];

export function getCarbonTier(carbonKg: number): CarbonTier {
  if (carbonKg < 0.5) return carbonTiers[0];
  if (carbonKg < 1.5) return carbonTiers[1];
  if (carbonKg < 3.0) return carbonTiers[2];
  if (carbonKg < 6.0) return carbonTiers[3];
  return carbonTiers[4];
}

// ============================================================
// HELPER: Get supply chain map for a sake by ID
// ============================================================

export function getSupplyChainForSake(sakeId: string): SupplyChainMap | null {
  const profile = sakeSupplyChains.find(s => s.sakeId === sakeId);
  if (!profile) return null;
  return generateSupplyChainMap(profile);
}

// ============================================================
// HELPER: Get all supply chains sorted by carbon footprint
// ============================================================

export function getAllSupplyChainsSortedByCarbon(): SupplyChainMap[] {
  return sakeSupplyChains
    .map(generateSupplyChainMap)
    .sort((a, b) => a.totalCarbonKg - b.totalCarbonKg);
}

// ============================================================
// HELPER: Get all supply chains sorted by producer share
// ============================================================

export function getAllSupplyChainsSortedByIntegrity(): (SupplyChainMap & { integrityScore: number })[] {
  return sakeSupplyChains
    .map(profile => ({
      ...generateSupplyChainMap(profile),
      integrityScore: profile.integrityScore,
    }))
    .sort((a, b) => b.integrityScore - a.integrityScore);
}
