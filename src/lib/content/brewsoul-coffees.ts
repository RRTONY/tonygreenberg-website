// Ported from legacy client/src/data/brewsoul-coffees.ts +
// brewsoul-coffees-expanded.ts + brewsoul-coffees-expanded2.ts — the full
// BrewSoul coffee catalog (real named producers, real tasting notes, real
// prices, real buy links). Legacy split this across 3 files and merged
// them at import time (`_COFFEES_CORE` + `COFFEES_EXPANDED` +
// `COFFEES_EXPANDED_2`); merged directly here into one module instead,
// same content. Real count is 107, not the 103/105 legacy's own comments
// and UI copy claimed in various places (legacy's own file header said
// "22 core + 58 expanded + 25 batch2 = 105", nav labels said "103" — both
// undercounts of what the arrays actually contained) — this migration
// uses the real live length (`BREWSOUL_COFFEES.length`) wherever a count
// is shown, not a repeated hardcoded number.
import type { CatalogItem } from "@/lib/intelligence-engine/types";

export const BREWSOUL_COFFEES: CatalogItem[] = [
  {
    "id": "gesha-village-lot-74",
    "name": "Gesha Village Lot 74",
    "producer": "Gesha Village Coffee Estate",
    "producerCountry": "Ethiopia",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Bench Maji, SNNPR",
    "originFarm": "Gesha Village Estate",
    "altitude": 1900,
    "variety": "Gesha 1931",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 94.5,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 9,
      "complexity": 10,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Jasmine",
      "Bergamot",
      "Peach",
      "Raw honey",
      "White tea"
    ],
    "priceUsd": 85,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "moldTestSource": "Third-party lab, 2024",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 65,
    "farmerShareUsd": 55.25,
    "cMarketPremiumPct": 800,
    "buyLinks": [
      {
        "label": "Gesha Village Direct",
        "url": "https://geshacoffee.com"
      }
    ],
    "scarcityProxy": 90,
    "limitedRelease": true,
    "microlotSizeKg": 50,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 10,
    "weirdnessScore": 3,
    "competitionWins": [
      "Best of Panama 2023 (Gesha category)"
    ],
    "climateRiskRegion": "Moderate",
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Lemon tart",
      "Fresh berries",
      "Shortbread"
    ],
    "connoisseurNote": "The Gesha that started the modern specialty revolution. Lot 74 is the estate's crown jewel — floral complexity that unfolds over 20 minutes as it cools. If you've never had a coffee that made you question everything you thought you knew, this is it.",
    "wowProxy": 95,
    "roastDate": "2025-02-01",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "black-forager-natural",
    "name": "Black Forager Natural",
    "producer": "Onyx Coffee Lab",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Oromia",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Onyx internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 7,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 10,
      "chocolate": 2
    },
    "tastingNotes": [
      "Blueberry",
      "Dark chocolate",
      "Strawberry jam",
      "Wine"
    ],
    "priceUsd": 32,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "Onyx Coffee Lab",
        "url": "https://onyxcoffeelab.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "competitionWins": [
      "Good Food Awards 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Dark chocolate",
      "Blueberry pancakes",
      "Brie"
    ],
    "connoisseurNote": "The gateway drug of specialty coffee. If someone tells you they don't like fruity coffee, hand them this. The natural process turns Ethiopian heirlooms into a blueberry bomb that converts skeptics.",
    "wowProxy": 75,
    "roastDate": "2025-02-10",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "finca-deborah-aurora",
    "name": "Finca Deborah Aurora",
    "producer": "Finca Deborah",
    "producerCountry": "Panama",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Boquete, Chiriquí",
    "originFarm": "Finca Deborah",
    "altitude": 1900,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Anaerobic Natural",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "Best of Panama",
    "flavorProfile": {
      "acidity": 9,
      "body": 7,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Tropical fruit",
      "Champagne",
      "Rose water",
      "Mango",
      "Vanilla"
    ],
    "priceUsd": 120,
    "unitGrams": 150,
    "moldTestStatus": "verified",
    "moldTestSource": "Third-party lab",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 70,
    "farmerShareUsd": 84,
    "cMarketPremiumPct": 1200,
    "buyLinks": [
      {
        "label": "Finca Deborah",
        "url": "https://fincadeborah.com"
      }
    ],
    "scarcityProxy": 95,
    "limitedRelease": true,
    "microlotSizeKg": 25,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 10,
    "weirdnessScore": 5,
    "competitionWins": [
      "Best of Panama 2024 Winner",
      "Producers & Roasters Forum Gold"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Tropical fruit salad",
      "Crème brûlée",
      "Macarons"
    ],
    "connoisseurNote": "Jamison Savage doesn't make coffee. He composes it. The Aurora lot uses anaerobic fermentation at controlled temperatures to create something that tastes more like a fine Champagne than any coffee you've ever had. This is where coffee becomes art.",
    "wowProxy": 98,
    "roastDate": "2025-01-20",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "cat-and-cloud-night-shift",
    "name": "Night Shift Blend",
    "producer": "Cat & Cloud",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Colombia / Ethiopia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 7,
      "complexity": 5,
      "fruitiness": 4,
      "chocolate": 8
    },
    "tastingNotes": [
      "Milk chocolate",
      "Caramel",
      "Brown sugar",
      "Walnut"
    ],
    "priceUsd": 18,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Cat & Cloud",
        "url": "https://catandcloud.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Drip",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Chocolate croissant",
      "Banana bread",
      "Oatmeal"
    ],
    "connoisseurNote": "The perfect daily driver. Not every coffee needs to be a religious experience. Sometimes you just need a cup that's reliably excellent, pairs with milk without flinching, and costs less than your avocado toast. Night Shift is that cup.",
    "wowProxy": 35,
    "roastDate": "2025-02-15",
    "peakWindowDays": [
      5,
      21
    ]
  },
  {
    "id": "proud-mary-kenya-aa",
    "name": "Kenya AA Kiambu",
    "producer": "Proud Mary",
    "producerCountry": "Australia",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Kiambu County",
    "altitude": 1750,
    "variety": "SL28 / SL34",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 90,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 10,
      "body": 7,
      "sweetness": 7,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Blackcurrant",
      "Grapefruit",
      "Tomato",
      "Brown sugar",
      "Sparkling"
    ],
    "priceUsd": 28,
    "unitGrams": 250,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Proud Mary",
        "url": "https://proudmarycoffee.com"
      }
    ],
    "scarcityProxy": 50,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 7,
    "weirdnessScore": 3,
    "competitionWins": [
      "Melbourne International Coffee Expo 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Citrus tart",
      "Goat cheese",
      "Dark berries"
    ],
    "connoisseurNote": "Kenya AA is the electric guitar of coffee. SL28 and SL34 varieties produce an acidity so bright it's almost savory — blackcurrant and tomato notes that make you question whether this is really coffee. Proud Mary roasts it to let every note scream.",
    "wowProxy": 78,
    "roastDate": "2025-02-08",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "sey-colombia-la-palma",
    "name": "La Palma y El Tucán Sidra",
    "producer": "SEY Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Cundinamarca",
    "originFarm": "La Palma y El Tucán",
    "altitude": 1700,
    "variety": "Sidra",
    "species": "Arabica",
    "processingMethod": "Lactic Anaerobic",
    "roastLevel": "Light",
    "cuppingScore": 91.5,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 8,
      "body": 7,
      "sweetness": 9,
      "complexity": 9,
      "fruitiness": 7,
      "chocolate": 5
    },
    "tastingNotes": [
      "Lychee",
      "Cider apple",
      "Cream",
      "Floral honey",
      "Spice"
    ],
    "priceUsd": 38,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "moldTestSource": "SEY transparency report",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 55,
    "farmerShareUsd": 20.9,
    "cMarketPremiumPct": 400,
    "buyLinks": [
      {
        "label": "SEY Coffee",
        "url": "https://www.seycoffee.com"
      }
    ],
    "scarcityProxy": 65,
    "limitedRelease": true,
    "microlotSizeKg": 200,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 8,
    "weirdnessScore": 4,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Apple tart",
      "Aged cheddar",
      "Honey cake"
    ],
    "connoisseurNote": "Sidra is the variety that's rewriting Colombian coffee. A natural Bourbon-Typica hybrid with Ethiopian-like complexity. La Palma's lactic anaerobic process adds a creamy, cider-like quality that's unlike anything else in the catalog. SEY's sourcing is impeccable.",
    "wowProxy": 82,
    "roastDate": "2025-02-05",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "george-howell-mamuto",
    "name": "Mamuto AA",
    "producer": "George Howell Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Kirinyaga",
    "originFarm": "Mamuto Estate",
    "altitude": 1800,
    "variety": "SL28",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "George Howell internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 8,
      "sweetness": 8,
      "complexity": 9,
      "fruitiness": 9,
      "chocolate": 5
    },
    "tastingNotes": [
      "Raspberry",
      "Red currant",
      "Dark chocolate",
      "Tamarind",
      "Floral"
    ],
    "priceUsd": 35,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 45,
    "buyLinks": [
      {
        "label": "George Howell Coffee",
        "url": "https://georgehowellcoffee.com"
      }
    ],
    "scarcityProxy": 55,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "competitionWins": [
      "Cup of Excellence Kenya 2022"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Raspberry tart",
      "Dark chocolate",
      "Aged gouda"
    ],
    "connoisseurNote": "George Howell is the godfather of American specialty coffee. He was sourcing single-origin before it had a name. Mamuto AA is his masterclass in Kenyan terroir — the kind of coffee that makes you understand why SL28 is considered the world's greatest coffee variety.",
    "wowProxy": 80,
    "roastDate": "2025-02-12",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "intelligentsia-frequency",
    "name": "Frequency Blend",
    "producer": "Intelligentsia",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / East Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 85,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 7,
      "complexity": 5,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Milk chocolate",
      "Caramel",
      "Citrus",
      "Toffee"
    ],
    "priceUsd": 17,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Intelligentsia",
        "url": "https://www.intelligentsia.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Espresso",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Granola",
      "Muffins"
    ],
    "connoisseurNote": "The original third-wave daily driver. Frequency has been Intelligentsia's flagship blend for over a decade. It's not going to change your life, but it's going to make every morning slightly better. Reliable, balanced, and available everywhere.",
    "wowProxy": 25,
    "roastDate": "2025-02-14",
    "peakWindowDays": [
      5,
      21
    ]
  },
  {
    "id": "luna-yemeni-haraaz",
    "name": "Yemen Haraaz Red",
    "producer": "Luna Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Yemen",
    "originRegion": "Haraaz Mountains",
    "altitude": 2200,
    "variety": "Yemeni Heirloom (Udaini)",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "Alliance for Coffee Excellence",
    "flavorProfile": {
      "acidity": 8,
      "body": 9,
      "sweetness": 10,
      "complexity": 10,
      "fruitiness": 8,
      "chocolate": 7
    },
    "tastingNotes": [
      "Dried fig",
      "Cardamom",
      "Dark cherry",
      "Cacao nib",
      "Spice",
      "Port wine"
    ],
    "priceUsd": 95,
    "unitGrams": 150,
    "moldTestStatus": "verified",
    "moldTestSource": "Third-party lab",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "farmerShareUsd": 47.5,
    "cMarketPremiumPct": 600,
    "buyLinks": [
      {
        "label": "Luna Coffee",
        "url": "https://lunacoffeeroasters.com"
      }
    ],
    "scarcityProxy": 92,
    "limitedRelease": true,
    "microlotSizeKg": 30,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 10,
    "weirdnessScore": 6,
    "competitionWins": [
      "Yemen Coffee Championship 2024"
    ],
    "climateRiskRegion": "High (conflict zone)",
    "recommendedBrewMethods": [
      "Pour-over",
      "Cezve/Ibrik",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Dates",
      "Baklava",
      "Dark chocolate truffles",
      "Aged cheese"
    ],
    "connoisseurNote": "Coffee was born in Yemen. These heirloom varieties have been growing in the Haraaz Mountains for centuries, untouched by modern hybridization. The result is a flavor profile that exists nowhere else on earth — dried fruit, spice, and a body so rich it feels like drinking history. Every cup funds farmers in an active conflict zone.",
    "wowProxy": 95,
    "roastDate": "2025-01-25",
    "peakWindowDays": [
      7,
      28
    ]
  },
  {
    "id": "passenger-burundi-kibira",
    "name": "Burundi Kibira Honey",
    "producer": "Passenger Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Burundi",
    "originRegion": "Kayanza Province",
    "altitude": 1800,
    "variety": "Red Bourbon",
    "species": "Arabica",
    "processingMethod": "Honey",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Passenger internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 7,
      "chocolate": 6
    },
    "tastingNotes": [
      "Peach",
      "Brown sugar",
      "Vanilla",
      "Plum",
      "Almond"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Passenger Coffee",
        "url": "https://www.passengercoffee.com"
      }
    ],
    "scarcityProxy": 45,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 5,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Kalita Wave",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Peach cobbler",
      "Almond croissant",
      "Vanilla ice cream"
    ],
    "connoisseurNote": "Burundi is the most underrated origin in specialty coffee. Same terroir as Rwanda, same Bourbon varieties, but a fraction of the price. Passenger's honey-processed Kibira is stone fruit heaven — the kind of coffee that makes you wonder why you've been paying twice as much for Ethiopian.",
    "wowProxy": 60,
    "roastDate": "2025-02-10",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "brandywine-sumatra-gayo",
    "name": "Sumatra Gayo Wet-Hulled",
    "producer": "Brandywine Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Indonesia",
    "originRegion": "Aceh, Gayo Highlands",
    "altitude": 1500,
    "variety": "Catimor / Typica",
    "species": "Arabica",
    "processingMethod": "Wet-Hulled (Giling Basah)",
    "roastLevel": "Medium-Dark",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 3,
      "body": 10,
      "sweetness": 5,
      "complexity": 7,
      "fruitiness": 2,
      "chocolate": 9
    },
    "tastingNotes": [
      "Cedar",
      "Dark chocolate",
      "Tobacco",
      "Earth",
      "Mushroom",
      "Herbs"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Brandywine",
        "url": "https://brandywinecoffeeroasters.com"
      }
    ],
    "scarcityProxy": 25,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 5,
    "recommendedBrewMethods": [
      "French press",
      "Espresso",
      "Moka pot"
    ],
    "foodPairingSuggestions": [
      "Steak",
      "Mushroom risotto",
      "Dark chocolate",
      "Aged cheddar"
    ],
    "connoisseurNote": "Sumatra is the heavy metal of coffee. The wet-hulled process creates a flavor profile that's polarizing — earthy, herbal, almost funky. You either love it or you don't. But if you do, nothing else scratches the itch. This is the coffee that pairs with a rainy afternoon and a leather-bound book.",
    "wowProxy": 45,
    "roastDate": "2025-02-12",
    "peakWindowDays": [
      7,
      28
    ]
  },
  {
    "id": "manhattan-ethiopia-yirgacheffe",
    "name": "Ethiopia Yirgacheffe Kochere",
    "producer": "Manhattan Coffee Roasters",
    "producerCountry": "Netherlands",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Yirgacheffe, Kochere",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 9,
      "body": 5,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Lemon",
      "Jasmine",
      "Earl Grey",
      "Apricot",
      "Honey"
    ],
    "priceUsd": 18,
    "unitGrams": 250,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 30,
    "buyLinks": [
      {
        "label": "Manhattan Coffee",
        "url": "https://manhattancoffeeroasters.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Lemon cake",
      "Scones",
      "Light pastries"
    ],
    "connoisseurNote": "Yirgacheffe Kochere is the benchmark for washed Ethiopian coffee. Floral, citrus, tea-like — it's the coffee that taught the world what 'terroir' means in a cup. Manhattan roasts it with European precision, letting the origin speak without interference.",
    "wowProxy": 65,
    "roastDate": "2025-02-08",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "sw-roasting-costa-rica-tarrazú",
    "name": "Costa Rica Tarrazú Honey",
    "producer": "SW Roasting",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Costa Rica",
    "originRegion": "Tarrazú",
    "altitude": 1600,
    "variety": "Caturra",
    "species": "Arabica",
    "processingMethod": "Red Honey",
    "roastLevel": "Medium",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Maple syrup",
      "Red apple",
      "Milk chocolate",
      "Hazelnut"
    ],
    "priceUsd": 16,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "SW Roasting",
        "url": "https://swroasting.com"
      }
    ],
    "scarcityProxy": 20,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Waffles",
      "Apple pie",
      "Hazelnut biscotti"
    ],
    "connoisseurNote": "Costa Rica's honey process is the country's gift to specialty coffee. Red honey leaves some of the fruit mucilage on the bean during drying, creating a sweetness that bridges the gap between washed clarity and natural fruitiness. Tarrazú's volcanic soil adds the rest.",
    "wowProxy": 40,
    "roastDate": "2025-02-14",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "tim-wendelboe-finca-tamana",
    "name": "Finca Tamana Castillo",
    "producer": "Tim Wendelboe",
    "producerCountry": "Norway",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "originFarm": "Finca Tamana",
    "altitude": 1750,
    "variety": "Castillo",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Tim Wendelboe internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 6,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 6
    },
    "tastingNotes": [
      "Caramel",
      "Orange",
      "Milk chocolate",
      "Toffee",
      "Clean"
    ],
    "priceUsd": 22,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "moldTestSource": "Tim Wendelboe transparency page",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 60,
    "farmerShareUsd": 13.2,
    "cMarketPremiumPct": 300,
    "buyLinks": [
      {
        "label": "Tim Wendelboe",
        "url": "https://timwendelboe.no"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Aeropress",
      "Pour-over",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Orange cake",
      "Caramel flan",
      "Butter cookies"
    ],
    "connoisseurNote": "Tim Wendelboe is the most transparent roaster on earth. He publishes exactly what he pays farmers, how he sources, and why. Finca Tamana is his longest relationship — a Colombian farm he's been buying from for over a decade. The coffee is clean, sweet, and a masterclass in what 'washed Colombian' should taste like.",
    "wowProxy": 55,
    "roastDate": "2025-02-01",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "ninety-plus-kemgin",
    "name": "Kemgin Lot W2",
    "producer": "Ninety Plus",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Bench Maji",
    "altitude": 1950,
    "variety": "Wild Ethiopian",
    "species": "Arabica",
    "processingMethod": "Proprietary Controlled Fermentation",
    "roastLevel": "Light",
    "cuppingScore": 94,
    "cuppingSource": "Ninety Plus internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 8,
      "sweetness": 10,
      "complexity": 10,
      "fruitiness": 9,
      "chocolate": 5
    },
    "tastingNotes": [
      "Mango",
      "Papaya",
      "Vanilla cream",
      "Jasmine",
      "Honey",
      "Cinnamon"
    ],
    "priceUsd": 150,
    "unitGrams": 120,
    "moldTestStatus": "verified",
    "moldTestSource": "Ninety Plus lab",
    "producerTransparencyGrade": "B",
    "farmerSharePct": 45,
    "buyLinks": [
      {
        "label": "Ninety Plus",
        "url": "https://ninetypluscoffee.com"
      }
    ],
    "scarcityProxy": 88,
    "limitedRelease": true,
    "microlotSizeKg": 40,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 10,
    "weirdnessScore": 7,
    "competitionWins": [
      "World Brewers Cup supply 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Mango sticky rice",
      "Crème brûlée",
      "Tropical fruit"
    ],
    "connoisseurNote": "Ninety Plus is the most controversial name in specialty coffee. Their proprietary fermentation process creates flavor profiles that shouldn't be possible — tropical fruit bombs that taste like someone blended a mango smoothie into your pour-over. Critics call it manipulation. Fans call it genius. You decide.",
    "wowProxy": 92,
    "roastDate": "2025-01-28",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "counter-culture-hologram",
    "name": "Hologram Blend",
    "producer": "Counter Culture Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Colombia / Ethiopia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 7,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Berry",
      "Nutty"
    ],
    "priceUsd": 15,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Counter Culture",
        "url": "https://counterculturecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Oatmeal",
      "Chocolate chip cookies"
    ],
    "connoisseurNote": "Counter Culture publishes their full transparency report every year — every farm, every price, every lot. Hologram is their everyday blend, and it's proof that ethical sourcing and accessible pricing aren't mutually exclusive. The best $15 you can spend on coffee.",
    "wowProxy": 30,
    "roastDate": "2025-02-15",
    "peakWindowDays": [
      5,
      21
    ]
  },
  {
    "id": "black-white-natural-ethiopia",
    "name": "The Natural Ethiopia",
    "producer": "Black & White Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Sidamo",
    "altitude": 1950,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Strawberry",
      "Blueberry",
      "Grape",
      "Chocolate",
      "Tropical"
    ],
    "priceUsd": 24,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Black & White",
        "url": "https://www.blackwhiteroasters.com"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "competitionWins": [
      "US Brewers Cup supply 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry tart",
      "Yogurt parfait",
      "Chocolate truffles"
    ],
    "connoisseurNote": "Black & White has quietly become one of the best roasters in America. Their natural Ethiopians are consistently fruit-forward without being over-fermented — a balance that's harder to achieve than it sounds. This is the coffee you serve to friends who say they don't like black coffee.",
    "wowProxy": 65,
    "roastDate": "2025-02-10",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "dak-colombia-pink-bourbon",
    "name": "Colombia Pink Bourbon Washed",
    "producer": "DAK Coffee Roasters",
    "producerCountry": "Netherlands",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "altitude": 1850,
    "variety": "Pink Bourbon",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 8,
      "body": 6,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 7,
      "chocolate": 4
    },
    "tastingNotes": [
      "Rosewater",
      "Peach",
      "Vanilla",
      "Mandarin",
      "Silky"
    ],
    "priceUsd": 20,
    "unitGrams": 250,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "DAK Coffee",
        "url": "https://dfrankfurt.com"
      }
    ],
    "scarcityProxy": 50,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 8,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Rose Turkish delight",
      "Peach tart",
      "Vanilla panna cotta"
    ],
    "connoisseurNote": "Pink Bourbon is the mystery variety of Colombian coffee — nobody's entirely sure of its genetics, but everyone agrees the cup is extraordinary. Floral, peachy, silky body. DAK roasts it with Nordic precision, letting the variety's natural elegance do the talking.",
    "wowProxy": 72,
    "roastDate": "2025-02-08",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "regalia-guatemala-huehuetenango",
    "name": "Guatemala Huehuetenango Pacamara",
    "producer": "Regalia Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Guatemala",
    "originRegion": "Huehuetenango",
    "altitude": 1800,
    "variety": "Pacamara",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 88,
    "cuppingSource": "Cup of Excellence",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 7,
      "complexity": 8,
      "fruitiness": 6,
      "chocolate": 6
    },
    "tastingNotes": [
      "Plum",
      "Dark chocolate",
      "Almond",
      "Citrus zest",
      "Creamy"
    ],
    "priceUsd": 25,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "farmerSharePct": 30,
    "buyLinks": [
      {
        "label": "Regalia Coffee",
        "url": "https://regaliacoffee.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "competitionWins": [
      "Cup of Excellence Guatemala 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Espresso",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Plum cake",
      "Dark chocolate",
      "Almonds"
    ],
    "connoisseurNote": "Pacamara is the giant of coffee varieties — literally. The beans are enormous, and the cup is equally oversized in flavor. Huehuetenango's dry microclimate at altitude creates a unique terroir that gives Pacamara a chocolatey depth you won't find anywhere else.",
    "wowProxy": 58,
    "roastDate": "2025-02-12",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "elida-estate-catuai-natural",
    "name": "Elida Estate Catuaí Natural",
    "producer": "Elida Estate",
    "producerCountry": "Panama",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Boquete, Chiriquí",
    "originFarm": "Elida Estate",
    "altitude": 1850,
    "variety": "Catuaí",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Best of Panama",
    "flavorProfile": {
      "acidity": 8,
      "body": 8,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 8,
      "chocolate": 5
    },
    "tastingNotes": [
      "Cherry",
      "Rum raisin",
      "Cacao",
      "Tropical fruit",
      "Caramel"
    ],
    "priceUsd": 55,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "moldTestSource": "Elida Estate lab",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 75,
    "farmerShareUsd": 41.25,
    "cMarketPremiumPct": 500,
    "buyLinks": [
      {
        "label": "Elida Estate",
        "url": "https://elidaestate.com"
      }
    ],
    "scarcityProxy": 70,
    "limitedRelease": true,
    "microlotSizeKg": 100,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 4,
    "weirdnessScore": 3,
    "competitionWins": [
      "Best of Panama 2024 (Catuaí category)"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Cherry pie",
      "Rum cake",
      "Dark chocolate truffles"
    ],
    "connoisseurNote": "Elida Estate proves that Gesha isn't the only game in Panama. Their Catuaí natural is a revelation — proof that processing and terroir can elevate a 'common' variety into something extraordinary. The Lamastus family has been farming this land for over a century.",
    "wowProxy": 78,
    "roastDate": "2025-02-01",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "koppi-rwanda-buf-cafe",
    "name": "Rwanda Buf Café Bourbon",
    "producer": "Koppi Roasters",
    "producerCountry": "Sweden",
    "producerShipsGlobal": true,
    "originCountry": "Rwanda",
    "originRegion": "Nyamasheke",
    "altitude": 1800,
    "variety": "Red Bourbon",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 88,
    "cuppingSource": "Cup of Excellence Rwanda",
    "flavorProfile": {
      "acidity": 8,
      "body": 6,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 7,
      "chocolate": 5
    },
    "tastingNotes": [
      "Red grape",
      "Plum",
      "Floral",
      "Caramel",
      "Tea-like"
    ],
    "priceUsd": 17,
    "unitGrams": 250,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 42,
    "buyLinks": [
      {
        "label": "Koppi",
        "url": "https://koppi.se"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 5,
    "weirdnessScore": 1,
    "competitionWins": [
      "Cup of Excellence Rwanda 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Grape tart",
      "Plum cake",
      "Light pastries"
    ],
    "connoisseurNote": "Rwanda is the rising star of African coffee. Buf Café washing station produces some of the cleanest, most elegant Bourbons on the continent. Koppi's Nordic light roast lets the terroir shine — red grape, plum, and a tea-like delicacy that makes you forget this costs less than a cocktail.",
    "wowProxy": 55,
    "roastDate": "2025-02-10",
    "peakWindowDays": [
      7,
      21
    ]
  },
  {
    "id": "orfeo-brazil-mogiana",
    "name": "Brazil Mogiana Natural",
    "producer": "Orfeo Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Brazil",
    "originRegion": "Mogiana, São Paulo",
    "altitude": 1100,
    "variety": "Yellow Bourbon",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Medium",
    "cuppingScore": 85,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 4,
      "body": 9,
      "sweetness": 8,
      "complexity": 5,
      "fruitiness": 4,
      "chocolate": 9
    },
    "tastingNotes": [
      "Peanut butter",
      "Dark chocolate",
      "Caramel",
      "Dried fruit",
      "Low acidity"
    ],
    "priceUsd": 14,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Orfeo Coffee",
        "url": "https://orfeocoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "French press",
      "Moka pot",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Peanut butter toast",
      "Chocolate cake",
      "Tiramisu"
    ],
    "connoisseurNote": "Brazil is the world's largest coffee producer, and most of it is forgettable. But Mogiana's Yellow Bourbon natural is the exception — nutty, chocolatey, zero acidity, and the best espresso base money can buy at this price. The daily driver for people who like their coffee to taste like coffee.",
    "wowProxy": 25,
    "roastDate": "2025-02-14",
    "peakWindowDays": [
      5,
      28
    ]
  },
  {
    "id": "hacienda-la-esmeralda-gesha",
    "name": "Hacienda La Esmeralda Gesha Private Collection",
    "producer": "Hacienda La Esmeralda",
    "producerCountry": "Panama",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Boquete, Chiriquí",
    "originFarm": "Hacienda La Esmeralda",
    "altitude": 1800,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 95,
    "cuppingSource": "Best of Panama",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 10,
      "complexity": 10,
      "fruitiness": 9,
      "chocolate": 2
    },
    "tastingNotes": [
      "Jasmine",
      "Bergamot",
      "Peach nectar",
      "Honey",
      "Lemongrass"
    ],
    "priceUsd": 200,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "moldTestSource": "Third-party lab",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 80,
    "farmerShareUsd": 160,
    "cMarketPremiumPct": 2000,
    "buyLinks": [
      {
        "label": "Hacienda La Esmeralda",
        "url": "https://haciendaesmeralda.com"
      }
    ],
    "scarcityProxy": 98,
    "limitedRelease": true,
    "microlotSizeKg": 20,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 15,
    "varietyRarityScore": 10,
    "weirdnessScore": 2,
    "competitionWins": [
      "Best of Panama 15x winner",
      "Most expensive coffee sold at auction"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Jasmine tea cake",
      "Fresh peaches",
      "Honey comb"
    ],
    "connoisseurNote": "The coffee that broke the auction record. La Esmeralda's Gesha is the Romanée-Conti of coffee — the benchmark against which all other coffees are measured. If you've never tasted it, you haven't tasted what coffee can be.",
    "wowProxy": 99
  },
  {
    "id": "ona-coffee-raspberry-candy",
    "name": "Raspberry Candy",
    "producer": "ONA Coffee",
    "producerCountry": "Australia",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Shakiso",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Carbonic Maceration Natural",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "ONA internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 7,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 10,
      "chocolate": 2
    },
    "tastingNotes": [
      "Raspberry",
      "Candy",
      "Watermelon",
      "Rose",
      "Cream soda"
    ],
    "priceUsd": 45,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "moldTestSource": "ONA lab",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "buyLinks": [
      {
        "label": "ONA Coffee",
        "url": "https://onacoffee.com.au"
      }
    ],
    "scarcityProxy": 75,
    "limitedRelease": true,
    "microlotSizeKg": 100,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 7,
    "weirdnessScore": 6,
    "competitionWins": [
      "World Barista Championship supply 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Raspberry sorbet",
      "White chocolate",
      "Macarons"
    ],
    "connoisseurNote": "Sasa Sestic's ONA pioneered carbonic maceration in coffee, borrowing from winemaking. The result is a coffee that tastes like raspberry candy — literally. Controversial? Absolutely. Delicious? Undeniably.",
    "wowProxy": 90
  },
  {
    "id": "manhattan-gesha-auction-lot",
    "name": "Gesha Auction Lot — Volcanica",
    "producer": "Manhattan Coffee Roasters",
    "producerCountry": "Netherlands",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Nariño",
    "originFarm": "Finca El Vergel",
    "altitude": 1950,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Double Anaerobic Washed",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 9,
      "body": 7,
      "sweetness": 9,
      "complexity": 10,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Jasmine",
      "Lychee",
      "Vanilla",
      "Lime zest",
      "Silk"
    ],
    "priceUsd": 65,
    "unitGrams": 150,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 55,
    "buyLinks": [
      {
        "label": "Manhattan Coffee",
        "url": "https://manhattancoffeeroasters.com"
      }
    ],
    "scarcityProxy": 80,
    "limitedRelease": true,
    "microlotSizeKg": 60,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 10,
    "weirdnessScore": 4,
    "competitionWins": [
      "World Brewers Cup supply 2024"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Lychee sorbet",
      "Vanilla bean ice cream",
      "Lime tart"
    ],
    "connoisseurNote": "Manhattan is the quiet giant of European specialty. Their Gesha lots from El Vergel are consistently among the best in the world. Double anaerobic washing creates a clarity that lets every floral note ring like a bell.",
    "wowProxy": 92
  },
  {
    "id": "april-ethiopia-halo-beriti",
    "name": "Halo Beriti Washed",
    "producer": "April Coffee Roasters",
    "producerCountry": "Denmark",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Yirgacheffe, Gedeo",
    "altitude": 2050,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "April internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 5,
      "sweetness": 9,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 2
    },
    "tastingNotes": [
      "White peach",
      "Jasmine",
      "Lemon curd",
      "Earl Grey",
      "Silky"
    ],
    "priceUsd": 28,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 48,
    "buyLinks": [
      {
        "label": "April Coffee",
        "url": "https://aprilcoffeeroasters.com"
      }
    ],
    "scarcityProxy": 55,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "competitionWins": [
      "World Brewers Cup Champion supply 2021"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Peach tart",
      "Shortbread",
      "Earl Grey cake"
    ],
    "connoisseurNote": "April is the most elegant roaster in Scandinavia. Their washed Ethiopians are so clean, so transparent, that you can taste the altitude. Halo Beriti is the definition of 'tea-like' — and that's the highest compliment in specialty coffee.",
    "wowProxy": 88
  },
  {
    "id": "the-barn-kenya-gakuyuini",
    "name": "Kenya Gakuyuini AA",
    "producer": "The Barn",
    "producerCountry": "Germany",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Nyeri",
    "altitude": 1800,
    "variety": "SL28 / SL34",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "The Barn internal",
    "flavorProfile": {
      "acidity": 10,
      "body": 7,
      "sweetness": 8,
      "complexity": 9,
      "fruitiness": 9,
      "chocolate": 4
    },
    "tastingNotes": [
      "Blackcurrant",
      "Blood orange",
      "Cranberry",
      "Brown sugar",
      "Sparkling"
    ],
    "priceUsd": 24,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "The Barn",
        "url": "https://thebarn.de"
      }
    ],
    "scarcityProxy": 45,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Blood orange tart",
      "Dark chocolate",
      "Goat cheese"
    ],
    "connoisseurNote": "The Barn is Berlin's most famous roaster for a reason. Their Kenyan lots are electric — SL28 from Nyeri produces an acidity so bright it's almost carbonated. This is the coffee that converts dark-roast drinkers.",
    "wowProxy": 85
  },
  {
    "id": "tropicalia-colombia-eugenioides",
    "name": "Eugenioides — The Ancestor",
    "producer": "Tropicalia Coffee",
    "producerCountry": "Colombia",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "altitude": 1700,
    "variety": "Eugenioides",
    "species": "Coffea eugenioides",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "World Brewers Cup",
    "flavorProfile": {
      "acidity": 3,
      "body": 4,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 7,
      "chocolate": 2
    },
    "tastingNotes": [
      "Sugarcane",
      "Vanilla",
      "Chamomile",
      "Peach",
      "Cream"
    ],
    "priceUsd": 95,
    "unitGrams": 100,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 70,
    "buyLinks": [
      {
        "label": "Tropicalia",
        "url": "https://tropicaliacoffee.com"
      }
    ],
    "scarcityProxy": 95,
    "limitedRelease": true,
    "microlotSizeKg": 15,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 10,
    "weirdnessScore": 9,
    "competitionWins": [
      "World Brewers Cup 2021 winning coffee"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Vanilla panna cotta",
      "Chamomile honey",
      "White peach"
    ],
    "connoisseurNote": "Eugenioides is not Arabica. It's the parent species of Arabica — the ancient ancestor that crossed with Canephora millions of years ago. It produces almost no bitterness, almost no acidity, and sweetness that borders on surreal. This is the rarest coffee on earth.",
    "wowProxy": 97
  },
  {
    "id": "kross-panama-gesha-honey",
    "name": "Gesha Honey — Finca Lerida",
    "producer": "Kross Coffee",
    "producerCountry": "Panama",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Boquete",
    "originFarm": "Finca Lerida",
    "altitude": 1800,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Honey",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "Best of Panama",
    "flavorProfile": {
      "acidity": 8,
      "body": 7,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Mango",
      "Honey",
      "Jasmine",
      "Papaya",
      "Caramel"
    ],
    "priceUsd": 70,
    "unitGrams": 150,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 65,
    "buyLinks": [
      {
        "label": "Kross Coffee",
        "url": "https://krosscoffee.com"
      }
    ],
    "scarcityProxy": 82,
    "limitedRelease": true,
    "microlotSizeKg": 40,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 10,
    "weirdnessScore": 3,
    "competitionWins": [
      "Best of Panama 2024 Honey category"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Mango sticky rice",
      "Honey cake",
      "Tropical fruit"
    ],
    "connoisseurNote": "Honey-processed Gesha is the sweet spot between washed clarity and natural fruit. Finca Lerida's altitude and Boquete's microclimate create a cup that's simultaneously delicate and explosively sweet.",
    "wowProxy": 90
  },
  {
    "id": "heart-colombia-la-palma-gesha",
    "name": "La Palma y El Tucán Gesha",
    "producer": "Heart Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Cundinamarca",
    "originFarm": "La Palma y El Tucán",
    "altitude": 1700,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "Heart internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 9,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Jasmine",
      "Bergamot",
      "Peach",
      "Lemon verbena",
      "Silk"
    ],
    "priceUsd": 48,
    "unitGrams": 200,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "buyLinks": [
      {
        "label": "Heart Coffee",
        "url": "https://heartroasters.com"
      }
    ],
    "scarcityProxy": 70,
    "limitedRelease": true,
    "microlotSizeKg": 80,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 10,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Lemon tart",
      "Jasmine tea cake",
      "Fresh berries"
    ],
    "connoisseurNote": "Heart in Portland is one of the most consistent roasters in America. Their Gesha lots from La Palma are textbook — floral, clean, with a silky body that makes you wonder if someone added cream. They didn't.",
    "wowProxy": 88
  },
  {
    "id": "ceremony-ethiopia-banko-gotiti",
    "name": "Banko Gotiti Natural",
    "producer": "Ceremony Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Ceremony internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 10,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blueberry",
      "Strawberry",
      "Dark chocolate",
      "Wine",
      "Tropical"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Ceremony Coffee",
        "url": "https://ceremonycoffee.com"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry cobbler",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "Ceremony is the quiet powerhouse of the mid-Atlantic. Their natural Ethiopians are fruit bombs that never cross into over-fermented territory. Banko Gotiti is the gateway — blueberry and strawberry so vivid you'll check the bag twice.",
    "wowProxy": 75
  },
  {
    "id": "ruby-colombia-el-paraiso",
    "name": "El Paraíso Double Anaerobic",
    "producer": "Ruby Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "originFarm": "Finca El Paraíso",
    "altitude": 1750,
    "variety": "Castillo",
    "species": "Arabica",
    "processingMethod": "Double Anaerobic",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "Cup of Excellence",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 5
    },
    "tastingNotes": [
      "Lychee",
      "Bubblegum",
      "Tropical punch",
      "Vanilla",
      "Cream"
    ],
    "priceUsd": 42,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 55,
    "buyLinks": [
      {
        "label": "Ruby Coffee",
        "url": "https://rubycoffeeroasters.com"
      }
    ],
    "scarcityProxy": 72,
    "limitedRelease": true,
    "microlotSizeKg": 100,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 4,
    "weirdnessScore": 7,
    "competitionWins": [
      "Cup of Excellence Colombia 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Lychee sorbet",
      "Tropical fruit salad",
      "Vanilla cake"
    ],
    "connoisseurNote": "El Paraíso is the most talked-about farm in Colombia right now. Their double anaerobic process creates flavors that shouldn't exist in coffee — lychee, bubblegum, tropical punch. Purists hate it. Everyone else can't stop drinking it.",
    "wowProxy": 88
  },
  {
    "id": "verve-kenya-kagumoini",
    "name": "Kenya Kagumoini AA",
    "producer": "Verve Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Nyeri",
    "altitude": 1850,
    "variety": "SL28 / SL34",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Verve internal",
    "flavorProfile": {
      "acidity": 10,
      "body": 7,
      "sweetness": 7,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 5
    },
    "tastingNotes": [
      "Blackcurrant",
      "Grapefruit",
      "Hibiscus",
      "Brown sugar",
      "Juicy"
    ],
    "priceUsd": 26,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Verve Coffee",
        "url": "https://vervecoffee.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Grapefruit tart",
      "Dark chocolate",
      "Goat cheese"
    ],
    "connoisseurNote": "Verve's Kenyan lots are consistently among the best in the US. Kagumoini AA from Nyeri is electric — the kind of acidity that makes your tongue tingle and your brain light up. If you think you don't like bright coffee, you haven't had this.",
    "wowProxy": 80
  },
  {
    "id": "equator-ethiopia-worka-sakaro",
    "name": "Ethiopia Worka Sakaro",
    "producer": "Equator Coffees",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Equator internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 5,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 7,
      "chocolate": 3
    },
    "tastingNotes": [
      "Lemon",
      "Jasmine",
      "Peach",
      "Tea-like",
      "Clean"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Equator Coffees",
        "url": "https://equatorcoffees.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Drip"
    ],
    "foodPairingSuggestions": [
      "Lemon cake",
      "Shortbread",
      "Fresh fruit"
    ],
    "connoisseurNote": "Equator is a certified B Corp that proves ethical sourcing and great coffee aren't mutually exclusive. Their washed Yirgacheffe is textbook — clean, floral, tea-like, and priced fairly. The daily driver for people who care about both cup quality and farmer welfare.",
    "wowProxy": 65
  },
  {
    "id": "little-wolf-guatemala-acatenango",
    "name": "Guatemala Acatenango Gesha",
    "producer": "Little Wolf Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Guatemala",
    "originRegion": "Acatenango Valley",
    "altitude": 1900,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 8,
      "body": 6,
      "sweetness": 9,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Jasmine",
      "Peach",
      "Bergamot",
      "Honey",
      "Silky"
    ],
    "priceUsd": 35,
    "unitGrams": 200,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 45,
    "buyLinks": [
      {
        "label": "Little Wolf",
        "url": "https://littlewolfcoffee.com"
      }
    ],
    "scarcityProxy": 60,
    "limitedRelease": true,
    "microlotSizeKg": 80,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 10,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Peach tart",
      "Honey cake",
      "Shortbread"
    ],
    "connoisseurNote": "Little Wolf is one of the most underrated roasters in America. Their Guatemalan Gesha from Acatenango is proof that Panama doesn't have a monopoly on the variety — volcanic soil at altitude creates a cup that rivals Boquete at half the price.",
    "wowProxy": 82
  },
  {
    "id": "stumptown-hair-bender",
    "name": "Hair Bender Blend",
    "producer": "Stumptown Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 8,
      "sweetness": 7,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 8
    },
    "tastingNotes": [
      "Dark chocolate",
      "Citrus",
      "Caramel",
      "Toffee"
    ],
    "priceUsd": 17,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Stumptown",
        "url": "https://stumptowncoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Drip",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Chocolate croissant",
      "Toast",
      "Banana bread"
    ],
    "connoisseurNote": "Hair Bender is the blend that launched Portland's coffee revolution. It's not the most exciting coffee in the world, but it's one of the most reliable. Chocolate, citrus, caramel — every single time. The Toyota Camry of specialty coffee, and that's a compliment.",
    "wowProxy": 35
  },
  {
    "id": "blue-bottle-hayes-valley",
    "name": "Hayes Valley Espresso",
    "producer": "Blue Bottle Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Africa / Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 85,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 7,
      "complexity": 5,
      "fruitiness": 4,
      "chocolate": 8
    },
    "tastingNotes": [
      "Chocolate",
      "Butterscotch",
      "Baking spice",
      "Smooth"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Blue Bottle",
        "url": "https://bluebottlecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Drip"
    ],
    "foodPairingSuggestions": [
      "Chocolate cake",
      "Biscotti",
      "Croissant"
    ],
    "connoisseurNote": "Blue Bottle was acquired by Nestlé in 2017, and purists wrote it off. But Hayes Valley Espresso remains a solid, approachable blend. It's not going to change your life, but it won't disappoint you either. The question is whether you want to support Nestlé's version of 'craft.'",
    "wowProxy": 30
  },
  {
    "id": "onyx-monarch",
    "name": "Monarch Blend",
    "producer": "Onyx Coffee Lab",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Guatemala",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium-Light",
    "cuppingScore": 87,
    "cuppingSource": "Onyx internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Cherry",
      "Caramel",
      "Nutty",
      "Sweet"
    ],
    "priceUsd": 18,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Onyx Coffee Lab",
        "url": "https://onyxcoffeelab.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Chocolate chip cookies",
      "Cherry pie",
      "Toast"
    ],
    "connoisseurNote": "Onyx's everyday blend is better than most roasters' flagship single origins. Monarch is the proof that 'blend' doesn't mean 'compromise.' Cherry, chocolate, caramel — balanced, sweet, and endlessly drinkable.",
    "wowProxy": 45
  },
  {
    "id": "passenger-kenya-nyeri-othaya",
    "name": "Kenya Nyeri Othaya AB",
    "producer": "Passenger Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Nyeri, Othaya",
    "altitude": 1800,
    "variety": "SL28 / SL34",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Passenger internal",
    "flavorProfile": {
      "acidity": 10,
      "body": 7,
      "sweetness": 7,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Blackcurrant",
      "Tomato",
      "Grapefruit",
      "Molasses",
      "Sparkling"
    ],
    "priceUsd": 25,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Passenger Coffee",
        "url": "https://passengercoffee.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 3,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Citrus salad",
      "Dark chocolate",
      "Aged cheese"
    ],
    "connoisseurNote": "Passenger is Lancaster, PA's gift to specialty coffee. Their Kenyan lots are consistently electric — Othaya AB has that signature Nyeri acidity that makes your tongue tingle. If you think coffee can't taste like blackcurrant and tomato simultaneously, prepare to be wrong.",
    "wowProxy": 78
  },
  {
    "id": "george-howell-tarrazu-herbazu",
    "name": "Tarrazú Herbazú Caturra",
    "producer": "George Howell Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Costa Rica",
    "originRegion": "Tarrazú",
    "originFarm": "Herbazú",
    "altitude": 1700,
    "variety": "Caturra",
    "species": "Arabica",
    "processingMethod": "Honey",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "George Howell internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 9,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 6
    },
    "tastingNotes": [
      "Honey",
      "Apricot",
      "Milk chocolate",
      "Caramel",
      "Clean"
    ],
    "priceUsd": 24,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "George Howell",
        "url": "https://georgehowellcoffee.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Drip",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Apricot tart",
      "Honey cake",
      "Butter cookies"
    ],
    "connoisseurNote": "George Howell literally invented the concept of 'specialty coffee' in the 1970s. His Tarrazú lots are a masterclass in what Costa Rica does best — clean, sweet, balanced. Herbazú's honey process adds an apricot sweetness that elevates it above the crowd.",
    "wowProxy": 65
  },
  {
    "id": "sey-ethiopia-worka-chelbesa",
    "name": "Ethiopia Worka Chelbesa Washed",
    "producer": "SEY Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "SEY internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 5,
      "sweetness": 9,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 2
    },
    "tastingNotes": [
      "Jasmine",
      "Lemon",
      "Peach",
      "Earl Grey",
      "Silk"
    ],
    "priceUsd": 26,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "moldTestSource": "SEY transparency report",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 52,
    "buyLinks": [
      {
        "label": "SEY Coffee",
        "url": "https://www.seycoffee.com"
      }
    ],
    "scarcityProxy": 50,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Lemon tart",
      "Earl Grey cake",
      "Fresh peaches"
    ],
    "connoisseurNote": "SEY is the most transparent roaster in New York. Their washed Ethiopians are the gold standard — Worka Chelbesa is so clean and floral it tastes like drinking a garden. The kind of coffee that makes you sit in silence for a moment.",
    "wowProxy": 82
  },
  {
    "id": "counter-culture-fast-forward",
    "name": "Fast Forward Blend",
    "producer": "Counter Culture Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Colombia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 6,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 7,
      "chocolate": 5
    },
    "tastingNotes": [
      "Citrus",
      "Floral",
      "Caramel",
      "Berry",
      "Clean"
    ],
    "priceUsd": 16,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Counter Culture",
        "url": "https://counterculturecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Fruit",
      "Granola"
    ],
    "connoisseurNote": "Counter Culture's lighter blend for people who want to taste fruit and floral without going full Nordic light roast. Fast Forward is the bridge between commodity coffee and specialty — bright enough to be interesting, approachable enough for anyone.",
    "wowProxy": 40
  },
  {
    "id": "devocion-toro",
    "name": "Toro — Fresh from Colombia",
    "producer": "Devoción",
    "producerCountry": "USA/Colombia",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila / Nariño",
    "altitude": 1800,
    "variety": "Caturra / Castillo",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 87,
    "cuppingSource": "Devoción internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 8,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Dark chocolate",
      "Caramel",
      "Dried fruit",
      "Nutty",
      "Smooth"
    ],
    "priceUsd": 20,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 45,
    "buyLinks": [
      {
        "label": "Devoción",
        "url": "https://dfrankfurt.com"
      }
    ],
    "scarcityProxy": 15,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Espresso",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Chocolate cake",
      "Caramel flan",
      "Nuts"
    ],
    "connoisseurNote": "Devoción's entire model is freshness — they ship green beans from Colombia to Brooklyn within 10 days of harvest. Most roasters take months. The result is a vibrancy that you can literally taste. Toro is their everyday blend, and it's fresher than anything else on the shelf.",
    "wowProxy": 55
  },
  {
    "id": "la-cabra-kenya-kiambu",
    "name": "Kenya Kiambu Washed",
    "producer": "La Cabra",
    "producerCountry": "Denmark",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Kiambu",
    "altitude": 1750,
    "variety": "SL28",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "La Cabra internal",
    "flavorProfile": {
      "acidity": 10,
      "body": 6,
      "sweetness": 8,
      "complexity": 9,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blackcurrant",
      "Rhubarb",
      "Cranberry",
      "Raw sugar",
      "Sparkling"
    ],
    "priceUsd": 28,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 42,
    "buyLinks": [
      {
        "label": "La Cabra",
        "url": "https://lacabra.dk"
      }
    ],
    "scarcityProxy": 50,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Rhubarb crumble",
      "Dark chocolate",
      "Goat cheese"
    ],
    "connoisseurNote": "La Cabra is the Danish roaster that coffee professionals drink when they want to be impressed. Their Kenyan lots are legendary — SL28 from Kiambu produces an acidity so complex it evolves in the cup over 20 minutes. This is coffee as a meditation practice.",
    "wowProxy": 85
  },
  {
    "id": "intelligentsia-black-cat",
    "name": "Black Cat Classic Espresso",
    "producer": "Intelligentsia Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 7,
      "complexity": 6,
      "fruitiness": 4,
      "chocolate": 8
    },
    "tastingNotes": [
      "Milk chocolate",
      "Caramel",
      "Cola",
      "Smooth"
    ],
    "priceUsd": 18,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Intelligentsia",
        "url": "https://intelligentsia.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Drip"
    ],
    "foodPairingSuggestions": [
      "Chocolate",
      "Pastries",
      "Breakfast"
    ],
    "connoisseurNote": "Black Cat is the espresso blend that launched a thousand coffee shops. Intelligentsia pioneered direct trade in the US, and while they've been acquired by Peet's, Black Cat remains a solid, reliable espresso. Not exciting. Not disappointing. Just good.",
    "wowProxy": 32
  },
  {
    "id": "proud-mary-colombia-la-esperanza",
    "name": "Colombia La Esperanza Thermal Shock",
    "producer": "Proud Mary",
    "producerCountry": "Australia",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "originFarm": "La Esperanza",
    "altitude": 1800,
    "variety": "Pink Bourbon",
    "species": "Arabica",
    "processingMethod": "Thermal Shock",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Proud Mary internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Strawberry milkshake",
      "Vanilla",
      "Rose",
      "Candy",
      "Cream"
    ],
    "priceUsd": 38,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "buyLinks": [
      {
        "label": "Proud Mary",
        "url": "https://proudmarycoffee.com"
      }
    ],
    "scarcityProxy": 70,
    "limitedRelease": true,
    "microlotSizeKg": 60,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 8,
    "weirdnessScore": 7,
    "competitionWins": [
      "Melbourne International Coffee Expo 2024"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Strawberry shortcake",
      "Vanilla ice cream",
      "Rose Turkish delight"
    ],
    "connoisseurNote": "Thermal shock processing is the newest frontier — rapid temperature changes during fermentation create flavor profiles that are almost hallucinogenic. This Pink Bourbon tastes like a strawberry milkshake. No, really. It's the most 'is this even coffee?' coffee in the catalog.",
    "wowProxy": 90
  },
  {
    "id": "folgers-classic-roast",
    "name": "Classic Roast",
    "producer": "Folgers (J.M. Smucker)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Brazil / Vietnam / Unknown",
    "variety": "Robusta / Arabica blend",
    "species": "Mixed",
    "processingMethod": "Industrial",
    "roastLevel": "Medium",
    "cuppingScore": 55,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 5,
      "sweetness": 2,
      "complexity": 1,
      "fruitiness": 0,
      "chocolate": 3
    },
    "tastingNotes": [
      "Burnt rubber",
      "Cardboard",
      "Bitter",
      "Flat",
      "Stale"
    ],
    "priceUsd": 8,
    "unitGrams": 907,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://folgers.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "The best part of waking up is not this in your cup. Folgers is the poster child for commodity coffee — pre-ground, months old, blended with Robusta, and roasted to oblivion to hide the defects. The fact that it's the #1 selling coffee in America is a national tragedy.",
    "wowProxy": 0
  },
  {
    "id": "maxwell-house-original",
    "name": "Original Roast",
    "producer": "Maxwell House (Kraft Heinz)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Brazil / Vietnam / Unknown",
    "variety": "Robusta / Arabica blend",
    "species": "Mixed",
    "processingMethod": "Industrial",
    "roastLevel": "Medium",
    "cuppingScore": 52,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 4,
      "sweetness": 1,
      "complexity": 1,
      "fruitiness": 0,
      "chocolate": 2
    },
    "tastingNotes": [
      "Cardboard",
      "Ash",
      "Bitter",
      "Hollow",
      "Stale"
    ],
    "priceUsd": 7,
    "unitGrams": 907,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://maxwellhouse.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Maxwell House claims it's 'good to the last drop.' We tested this claim. It is not good at any drop. Pre-ground commodity coffee that sits on shelves for months, blended to be as inoffensive as possible, which means it's offensive to anyone who's tasted real coffee.",
    "wowProxy": 0
  },
  {
    "id": "keurig-green-mountain",
    "name": "Breakfast Blend K-Cup",
    "producer": "Green Mountain (Keurig Dr Pepper)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Unknown",
    "species": "Arabica",
    "processingMethod": "Industrial",
    "roastLevel": "Light",
    "cuppingScore": 58,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 3,
      "sweetness": 2,
      "complexity": 1,
      "fruitiness": 1,
      "chocolate": 2
    },
    "tastingNotes": [
      "Watery",
      "Cardboard",
      "Slightly bitter",
      "Thin",
      "Forgettable"
    ],
    "priceUsd": 12,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://keurig.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "K-Cup machine"
    ],
    "connoisseurNote": "K-Cups are the single greatest environmental and gustatory crime in coffee history. Each pod generates plastic waste, the coffee inside is stale before it's sealed, and the brewing method under-extracts everything. You're paying $40/lb for coffee that tastes like hot cardboard water.",
    "wowProxy": 2
  },
  {
    "id": "nescafe-instant-classic",
    "name": "Clasico Instant",
    "producer": "Nescafé (Nestlé)",
    "producerCountry": "Switzerland",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Robusta / Arabica",
    "species": "Mixed",
    "processingMethod": "Spray-dried instant",
    "roastLevel": "Dark",
    "cuppingScore": 45,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 1,
      "body": 3,
      "sweetness": 1,
      "complexity": 0,
      "fruitiness": 0,
      "chocolate": 2
    },
    "tastingNotes": [
      "Burnt",
      "Chemical",
      "Bitter",
      "Hollow",
      "Metallic"
    ],
    "priceUsd": 9,
    "unitGrams": 200,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://nescafe.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Hot water"
    ],
    "connoisseurNote": "Nescafé is the world's most consumed coffee brand. Let that sink in. Spray-dried instant coffee made from the cheapest beans on earth, processed to remove every trace of character. Nestlé has done more damage to coffee culture than any single entity in history.",
    "wowProxy": 0
  },
  {
    "id": "death-wish-dark-roast",
    "name": "Death Wish Dark Roast",
    "producer": "Death Wish Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "India / Unknown",
    "variety": "Robusta / Arabica",
    "species": "Mixed",
    "processingMethod": "Industrial",
    "roastLevel": "Dark",
    "cuppingScore": 62,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 1,
      "body": 9,
      "sweetness": 2,
      "complexity": 1,
      "fruitiness": 0,
      "chocolate": 5
    },
    "tastingNotes": [
      "Charcoal",
      "Bitter",
      "Thick",
      "Smoky",
      "Caffeine"
    ],
    "priceUsd": 20,
    "unitGrams": 454,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Death Wish",
        "url": "https://deathwishcoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 0,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Drip",
      "French press"
    ],
    "connoisseurNote": "Death Wish markets itself as 'the world's strongest coffee.' That's like marketing a wine as 'the most alcoholic.' They use Robusta beans (high caffeine, low flavor) and roast them to charcoal. If your goal is caffeine, take a pill. If your goal is coffee, look elsewhere.",
    "wowProxy": 5
  },
  {
    "id": "starbucks-pike-place",
    "name": "Pike Place Roast",
    "producer": "Starbucks",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 72,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 6,
      "sweetness": 4,
      "complexity": 3,
      "fruitiness": 2,
      "chocolate": 6
    },
    "tastingNotes": [
      "Smoky",
      "Nutty",
      "Bitter",
      "Flat",
      "Burnt edges"
    ],
    "priceUsd": 12,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Starbucks",
        "url": "https://starbucks.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 1,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Starbucks buys more specialty-grade coffee than anyone on earth and then roasts it all into the same dark, smoky, bitter profile. Pike Place is their 'medium' roast, which in any other context would be called 'dark.' It's not terrible. It's just a waste of good beans.",
    "wowProxy": 10
  },
  {
    "id": "dunkin-original-blend",
    "name": "Original Blend",
    "producer": "Dunkin'",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 70,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 5,
      "sweetness": 4,
      "complexity": 2,
      "fruitiness": 1,
      "chocolate": 5
    },
    "tastingNotes": [
      "Smooth",
      "Mild",
      "Nutty",
      "Inoffensive",
      "Watery"
    ],
    "priceUsd": 10,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Dunkin'",
        "url": "https://dunkinathome.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Dunkin' is America's coffee. Not because it's good, but because it's everywhere and it's cheap. The Original Blend is engineered to be inoffensive — smooth, mild, forgettable. It's the beige paint of coffee. Nobody hates it. Nobody remembers it.",
    "wowProxy": 5
  },
  {
    "id": "lavazza-super-crema",
    "name": "Super Crema Espresso",
    "producer": "Lavazza",
    "producerCountry": "Italy",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Brazil / India / Colombia / Indonesia",
    "variety": "Arabica / Robusta",
    "species": "Mixed",
    "processingMethod": "Industrial",
    "roastLevel": "Medium",
    "cuppingScore": 68,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 7,
      "sweetness": 4,
      "complexity": 3,
      "fruitiness": 1,
      "chocolate": 6
    },
    "tastingNotes": [
      "Hazelnut",
      "Cream",
      "Mild bitter",
      "Flat",
      "Woody"
    ],
    "priceUsd": 18,
    "unitGrams": 1000,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Lavazza",
        "url": "https://lavazza.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 2,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot"
    ],
    "connoisseurNote": "Lavazza is Italy's largest coffee company, and Super Crema is their most popular blend. It produces a thick crema (hence the name) but the flavor underneath is unremarkable — hazelnut, cream, and a woody bitterness from the Robusta. Italy's coffee culture is stuck in the 1950s, and Lavazza is the reason.",
    "wowProxy": 8
  },
  {
    "id": "bulletproof-original",
    "name": "The Original Medium Roast",
    "producer": "Bulletproof",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Guatemala / Colombia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 78,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 4,
      "body": 7,
      "sweetness": 5,
      "complexity": 4,
      "fruitiness": 3,
      "chocolate": 6
    },
    "tastingNotes": [
      "Chocolate",
      "Nutty",
      "Clean",
      "Mild",
      "Smooth"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "moldTestSource": "Bulletproof claims 'clean coffee' process",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Bulletproof",
        "url": "https://bulletproof.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "French press",
      "Pour-over"
    ],
    "connoisseurNote": "Bulletproof built an empire on mycotoxin fear — claiming their 'clean coffee' process removes mold that other coffees contain. The science is dubious at best. The coffee itself is... fine. A perfectly average medium roast sold at a premium because of marketing, not quality.",
    "wowProxy": 15
  },
  {
    "id": "peets-major-dickasons",
    "name": "Major Dickason's Blend",
    "producer": "Peet's Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Dark",
    "cuppingScore": 75,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 2,
      "body": 9,
      "sweetness": 3,
      "complexity": 4,
      "fruitiness": 1,
      "chocolate": 7
    },
    "tastingNotes": [
      "Smoky",
      "Dark chocolate",
      "Earthy",
      "Heavy",
      "Bitter"
    ],
    "priceUsd": 15,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Peet's",
        "url": "https://peets.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 2,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 1,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "French press"
    ],
    "connoisseurNote": "Peet's is the godfather of dark roast in America — Alfred Peet literally taught the Starbucks founders. Major Dickason's is their flagship, and it's a monument to the philosophy that darker = better. It's not. But if you like your coffee to taste like a campfire, this is your jam.",
    "wowProxy": 12
  },
  {
    "id": "eight-oclock-original",
    "name": "The Original",
    "producer": "Eight O'Clock Coffee (Tata)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Industrial",
    "roastLevel": "Medium",
    "cuppingScore": 60,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 5,
      "sweetness": 3,
      "complexity": 2,
      "fruitiness": 1,
      "chocolate": 4
    },
    "tastingNotes": [
      "Flat",
      "Mild",
      "Slightly bitter",
      "Cardboard",
      "Forgettable"
    ],
    "priceUsd": 7,
    "unitGrams": 680,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://eightoclock.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Eight O'Clock is the coffee your grandparents drank because there was nothing else. Now owned by Tata Global Beverages, it's mass-produced commodity coffee with zero transparency about sourcing. At $5/lb, you get exactly what you pay for: nothing memorable.",
    "wowProxy": 2
  },
  {
    "id": "cafe-bustelo-espresso",
    "name": "Espresso Style",
    "producer": "Café Bustelo (J.M. Smucker)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica / Robusta",
    "processingMethod": "Industrial",
    "roastLevel": "Dark",
    "cuppingScore": 58,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 1,
      "body": 8,
      "sweetness": 2,
      "complexity": 1,
      "fruitiness": 0,
      "chocolate": 4
    },
    "tastingNotes": [
      "Burnt",
      "Bitter",
      "Thick",
      "Smoky",
      "Harsh"
    ],
    "priceUsd": 6,
    "unitGrams": 283,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Grocery stores",
        "url": "https://cafebustelo.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Moka pot",
      "Espresso"
    ],
    "connoisseurNote": "Café Bustelo has a cult following, and we respect the cultural significance. But let's be honest about what's in the can: over-roasted commodity beans, likely including Robusta, ground to dust. It makes a strong, bitter cup that's best drowned in sugar and milk. The espresso label is generous.",
    "wowProxy": 3
  },
  {
    "id": "onyx-geometry",
    "name": "Geometry Blend",
    "producer": "Onyx Coffee Lab",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Colombia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Light-Medium",
    "cuppingScore": 88,
    "cuppingSource": "Onyx internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 7,
      "chocolate": 5
    },
    "tastingNotes": [
      "Berry",
      "Citrus",
      "Chocolate",
      "Floral",
      "Balanced"
    ],
    "priceUsd": 20,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Onyx Coffee Lab",
        "url": "https://onyxcoffeelab.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Fruit tart",
      "Chocolate",
      "Pastries"
    ],
    "connoisseurNote": "Geometry is Onyx's 'I want something interesting but not weird' blend. Berry, citrus, chocolate — it hits every note without going overboard on any of them. The blend that converts Starbucks drinkers to specialty without scaring them.",
    "wowProxy": 50
  },
  {
    "id": "brandywine-ethiopia-natural-guji",
    "name": "Ethiopia Guji Natural",
    "producer": "Brandywine Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Oromia",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Brandywine internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 10,
      "chocolate": 2
    },
    "tastingNotes": [
      "Blueberry",
      "Strawberry",
      "Tropical",
      "Wine",
      "Floral"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Brandywine",
        "url": "https://brandywinecoffeeroasters.com"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry cobbler",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "Brandywine is Delaware's best-kept secret. Their natural Ethiopians are fruit bombs — Guji heirlooms processed naturally produce blueberry and strawberry notes so vivid they border on candy. At $22 for 10oz, it's one of the best values in specialty coffee.",
    "wowProxy": 70
  },
  {
    "id": "tim-wendelboe-aeropress-blend",
    "name": "Aeropress Blend",
    "producer": "Tim Wendelboe",
    "producerCountry": "Norway",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Colombia / Ethiopia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 88,
    "cuppingSource": "Tim Wendelboe internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 6,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 5
    },
    "tastingNotes": [
      "Caramel",
      "Citrus",
      "Floral",
      "Clean",
      "Balanced"
    ],
    "priceUsd": 18,
    "unitGrams": 250,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 55,
    "buyLinks": [
      {
        "label": "Tim Wendelboe",
        "url": "https://timwendelboe.no"
      }
    ],
    "scarcityProxy": 20,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 7,
    "shipCostUsdEst": 12,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Aeropress",
      "Pour-over"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Fruit",
      "Light pastries"
    ],
    "connoisseurNote": "Tim Wendelboe won the World Barista Championship in 2004 and has been the conscience of specialty coffee ever since. His Aeropress Blend is designed for the brewer he helped popularize — clean, sweet, balanced, and a masterclass in what 'light roast' should taste like.",
    "wowProxy": 55
  },
  {
    "id": "square-mile-red-brick",
    "name": "Red Brick Seasonal Espresso",
    "producer": "Square Mile Coffee Roasters",
    "producerCountry": "UK",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Seasonal rotation",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium-Light",
    "cuppingScore": 87,
    "cuppingSource": "Square Mile internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Fruit",
      "Sweet",
      "Balanced"
    ],
    "priceUsd": 18,
    "unitGrams": 350,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "Square Mile",
        "url": "https://shop.squaremilecoffee.com"
      }
    ],
    "scarcityProxy": 15,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Aeropress",
      "Moka pot"
    ],
    "foodPairingSuggestions": [
      "Chocolate brownie",
      "Caramel desserts",
      "Pastries"
    ],
    "connoisseurNote": "Square Mile was founded by James Hoffmann (World Barista Champion 2007) and Anette Moldvaer. Red Brick is their flagship espresso — it changes seasonally but always delivers chocolate, caramel, and sweetness. The benchmark for what modern espresso should taste like.",
    "wowProxy": 50
  },
  {
    "id": "catalyst-colombia-washed",
    "name": "Colombia Washed Caturra",
    "producer": "Catalyst Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "altitude": 1700,
    "variety": "Caturra",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 7,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Caramel",
      "Chocolate",
      "Citrus",
      "Clean",
      "Sweet"
    ],
    "priceUsd": 17,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Catalyst",
        "url": "https://catalystcoffee.co"
      }
    ],
    "scarcityProxy": 15,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Chocolate",
      "Pastries"
    ],
    "connoisseurNote": "A solid, reliable Colombian washed coffee from a small-batch roaster. Nothing flashy, nothing wrong. The kind of coffee that makes you realize most of what you've been drinking is either over-roasted or under-sourced.",
    "wowProxy": 35
  },
  {
    "id": "tandem-ethiopia-yirgacheffe-washed",
    "name": "Ethiopia Yirgacheffe Washed",
    "producer": "Tandem Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Yirgacheffe, Gedeo",
    "altitude": 1950,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Tandem internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 5,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 7,
      "chocolate": 3
    },
    "tastingNotes": [
      "Lemon",
      "Jasmine",
      "Peach",
      "Tea-like",
      "Delicate"
    ],
    "priceUsd": 20,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Tandem Coffee",
        "url": "https://tandemcoffee.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Lemon tart",
      "Shortbread",
      "Fresh fruit"
    ],
    "connoisseurNote": "Tandem is Portland, Maine's finest. Their washed Yirgacheffe is a textbook example of why Ethiopian coffee is the benchmark — lemon, jasmine, peach, and a tea-like delicacy that makes you slow down and pay attention.",
    "wowProxy": 65
  },
  {
    "id": "madcap-kenya-gichatha",
    "name": "Kenya Gichatha-ini AA",
    "producer": "Madcap Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Kenya",
    "originRegion": "Nyeri",
    "altitude": 1800,
    "variety": "SL28 / SL34",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Madcap internal",
    "flavorProfile": {
      "acidity": 10,
      "body": 7,
      "sweetness": 7,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Blackcurrant",
      "Grapefruit",
      "Tomato",
      "Brown sugar",
      "Juicy"
    ],
    "priceUsd": 25,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Madcap Coffee",
        "url": "https://madcapcoffee.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Citrus tart",
      "Dark chocolate",
      "Aged cheese"
    ],
    "connoisseurNote": "Madcap in Grand Rapids, Michigan is proof that great coffee doesn't require a coastal zip code. Their Kenyan lots are consistently among the best in America — Gichatha-ini AA has that signature Nyeri brightness that makes your palate wake up and pay attention.",
    "wowProxy": 78
  },
  {
    "id": "spyhouse-ethiopia-worka",
    "name": "Ethiopia Worka Natural",
    "producer": "Spyhouse Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 88,
    "cuppingSource": "Spyhouse internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blueberry",
      "Strawberry",
      "Wine",
      "Chocolate",
      "Sweet"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Spyhouse",
        "url": "https://spyhousecoffee.com"
      }
    ],
    "scarcityProxy": 25,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry tart",
      "Yogurt",
      "Dark chocolate"
    ],
    "connoisseurNote": "Spyhouse is Minneapolis's flagship specialty roaster. Their natural Ethiopians are crowd-pleasers — blueberry and strawberry notes that are vivid without being over-fermented. At $19 for 12oz, it's one of the best values in the Midwest.",
    "wowProxy": 60
  },
  {
    "id": "barista-parlor-golden-sound",
    "name": "Golden Sound Blend",
    "producer": "Barista Parlor",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Colombia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium-Light",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 6,
      "chocolate": 6
    },
    "tastingNotes": [
      "Chocolate",
      "Berry",
      "Caramel",
      "Sweet",
      "Balanced"
    ],
    "priceUsd": 18,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Barista Parlor",
        "url": "https://baristaparlor.com"
      }
    ],
    "scarcityProxy": 15,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Pastries",
      "Chocolate",
      "Toast"
    ],
    "connoisseurNote": "Nashville's Barista Parlor brings Southern hospitality to specialty coffee. Golden Sound is their everyday blend — approachable, sweet, balanced. Not going to blow your mind, but it'll make your morning better. The kind of coffee that makes you a regular.",
    "wowProxy": 42
  },
  {
    "id": "methodical-colombia-el-paraiso-lactic",
    "name": "Colombia El Paraíso Lactic",
    "producer": "Methodical Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "originFarm": "Finca El Paraíso",
    "altitude": 1750,
    "variety": "Castillo",
    "species": "Arabica",
    "processingMethod": "Lactic Anaerobic",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Cup of Excellence",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Mango",
      "Yogurt",
      "Tropical",
      "Vanilla",
      "Cream"
    ],
    "priceUsd": 35,
    "unitGrams": 200,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "buyLinks": [
      {
        "label": "Methodical",
        "url": "https://methodicalcoffee.com"
      }
    ],
    "scarcityProxy": 65,
    "limitedRelease": true,
    "microlotSizeKg": 80,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 4,
    "weirdnessScore": 6,
    "competitionWins": [
      "Cup of Excellence Colombia 2024"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Mango lassi",
      "Vanilla cake",
      "Tropical fruit"
    ],
    "connoisseurNote": "Methodical in Greenville, SC is quietly becoming one of the best roasters in the Southeast. Their El Paraíso lactic lot is a tropical explosion — mango, yogurt, vanilla. The lactic fermentation adds a creamy quality that makes it taste like a dessert.",
    "wowProxy": 85
  },
  {
    "id": "black-white-the-classic",
    "name": "The Classic Espresso",
    "producer": "Black & White Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Colombia / Ethiopia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium-Light",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Berry",
      "Sweet",
      "Creamy"
    ],
    "priceUsd": 18,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Black & White",
        "url": "https://www.blackwhiteroasters.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Chocolate cake",
      "Caramel desserts",
      "Pastries"
    ],
    "connoisseurNote": "Black & White's espresso blend is the workhorse that funds their exotic single origins. Chocolate, caramel, berry — it's designed to be the best espresso you can pull at home without a $3,000 grinder. And it delivers.",
    "wowProxy": 42
  },
  {
    "id": "james-coffee-ethiopia-sidamo",
    "name": "Ethiopia Sidamo Natural",
    "producer": "James Coffee Co.",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Sidamo",
    "altitude": 1900,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 88,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blueberry",
      "Wine",
      "Chocolate",
      "Floral",
      "Sweet"
    ],
    "priceUsd": 20,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "James Coffee",
        "url": "https://jamescoffeeco.com"
      }
    ],
    "scarcityProxy": 25,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry tart",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "San Diego's James Coffee brings California sunshine to Ethiopian naturals. Their Sidamo is a crowd-pleaser — blueberry and wine notes that are vivid but not overwhelming. The kind of coffee that makes you want to sit on a patio and do nothing.",
    "wowProxy": 58
  },
  {
    "id": "huckleberry-guatemala-finca-el-injerto",
    "name": "Guatemala Finca El Injerto Bourbon",
    "producer": "Huckleberry Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Guatemala",
    "originRegion": "Huehuetenango",
    "originFarm": "Finca El Injerto",
    "altitude": 1800,
    "variety": "Bourbon",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 89,
    "cuppingSource": "Cup of Excellence",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 6,
      "chocolate": 7
    },
    "tastingNotes": [
      "Dark chocolate",
      "Plum",
      "Caramel",
      "Almond",
      "Creamy"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "Huckleberry",
        "url": "https://huckleberryroasters.com"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 5,
    "weirdnessScore": 1,
    "competitionWins": [
      "Cup of Excellence Guatemala 2023"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Espresso",
      "Drip"
    ],
    "foodPairingSuggestions": [
      "Dark chocolate",
      "Plum cake",
      "Almonds"
    ],
    "connoisseurNote": "Huckleberry in Denver is the Rocky Mountain's best roaster. El Injerto is one of Guatemala's most decorated farms — Cup of Excellence winner multiple times. The Bourbon variety at altitude produces a chocolatey, plummy cup that's equally at home as espresso or pour-over.",
    "wowProxy": 68
  },
  {
    "id": "switchback-rwanda-kilimbi",
    "name": "Rwanda Kilimbi Washed",
    "producer": "Switchback Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Rwanda",
    "originRegion": "Nyamasheke",
    "altitude": 1800,
    "variety": "Red Bourbon",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 88,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 6,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 7,
      "chocolate": 4
    },
    "tastingNotes": [
      "Red grape",
      "Plum",
      "Floral",
      "Honey",
      "Tea-like"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Switchback",
        "url": "https://switchbackroasters.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 5,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Grape tart",
      "Light pastries",
      "Honey cake"
    ],
    "connoisseurNote": "Switchback in Colorado Springs is proof that great coffee exists outside the big cities. Their Rwandan lots are elegant — Kilimbi's Red Bourbon produces a tea-like cup with grape and plum notes that's perfect for anyone who finds Kenyan coffee too aggressive.",
    "wowProxy": 55
  },
  {
    "id": "ghost-town-colombia-pink-bourbon-natural",
    "name": "Colombia Pink Bourbon Natural",
    "producer": "Ghost Town Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "altitude": 1850,
    "variety": "Pink Bourbon",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 10,
      "complexity": 8,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Strawberry",
      "Rose",
      "Vanilla",
      "Tropical",
      "Candy"
    ],
    "priceUsd": 25,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 42,
    "buyLinks": [
      {
        "label": "Ghost Town",
        "url": "https://ghosttowncoffee.com"
      }
    ],
    "scarcityProxy": 50,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 8,
    "weirdnessScore": 3,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Strawberry shortcake",
      "Rose Turkish delight",
      "Vanilla cake"
    ],
    "connoisseurNote": "Ghost Town in Bozeman, Montana roasts some of the most exciting coffees in the mountain west. Their natural Pink Bourbon is a candy bomb — strawberry, rose, vanilla. The natural process amplifies Pink Bourbon's inherent sweetness into something almost surreal.",
    "wowProxy": 75
  },
  {
    "id": "dragonfly-yemen-haraz",
    "name": "Yemen Haraz Natural",
    "producer": "Dragonfly Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Yemen",
    "originRegion": "Haraz Mountains",
    "altitude": 2200,
    "variety": "Yemeni Heirloom",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light-Medium",
    "cuppingScore": 91,
    "cuppingSource": "SCA Certified",
    "flavorProfile": {
      "acidity": 7,
      "body": 9,
      "sweetness": 8,
      "complexity": 10,
      "fruitiness": 7,
      "chocolate": 7
    },
    "tastingNotes": [
      "Dried fruit",
      "Spice",
      "Dark chocolate",
      "Wine",
      "Tobacco",
      "Leather"
    ],
    "priceUsd": 65,
    "unitGrams": 200,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "farmerSharePct": 55,
    "buyLinks": [
      {
        "label": "Dragonfly Coffee",
        "url": "https://dragonflycoffeeroasters.com"
      }
    ],
    "scarcityProxy": 85,
    "limitedRelease": true,
    "microlotSizeKg": 30,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 10,
    "weirdnessScore": 5,
    "recommendedBrewMethods": [
      "Pour-over",
      "French press",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Dates",
      "Dark chocolate",
      "Aged cheese",
      "Dried figs"
    ],
    "connoisseurNote": "Yemen is where coffee began — literally. The Haraz Mountains have been growing coffee for 500+ years, and the heirloom varieties produce a cup unlike anything else on earth. Dried fruit, spice, wine, tobacco — it's complex, ancient, and irreplaceable. This is coffee archaeology.",
    "wowProxy": 88
  },
  {
    "id": "sey-colombia-gesha-el-paraiso",
    "name": "El Paraíso Gesha Washed",
    "producer": "SEY Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "originFarm": "Finca El Paraíso",
    "altitude": 1750,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "SEY internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 9,
      "complexity": 10,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Jasmine",
      "Bergamot",
      "Peach",
      "Honey",
      "Silk"
    ],
    "priceUsd": 55,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "moldTestSource": "SEY transparency report",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 55,
    "buyLinks": [
      {
        "label": "SEY Coffee",
        "url": "https://www.seycoffee.com"
      }
    ],
    "scarcityProxy": 80,
    "limitedRelease": true,
    "microlotSizeKg": 50,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 10,
    "weirdnessScore": 2,
    "competitionWins": [
      "Cup of Excellence Colombia 2024"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Jasmine tea cake",
      "Peach tart",
      "Honey"
    ],
    "connoisseurNote": "When SEY sources Gesha from El Paraíso, the result is one of the most refined coffees available in the US. Washed processing strips away the experimental funk and reveals pure varietal character — jasmine, bergamot, peach. This is what Gesha was born to taste like.",
    "wowProxy": 92
  },
  {
    "id": "george-howell-panama-gesha-esmeralda",
    "name": "Panama Gesha — Esmeralda Special",
    "producer": "George Howell Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Boquete, Chiriquí",
    "originFarm": "Hacienda La Esmeralda",
    "altitude": 1800,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 94,
    "cuppingSource": "George Howell internal",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 10,
      "complexity": 10,
      "fruitiness": 9,
      "chocolate": 2
    },
    "tastingNotes": [
      "Jasmine",
      "Bergamot",
      "Peach",
      "Honey",
      "Lemongrass"
    ],
    "priceUsd": 95,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 70,
    "buyLinks": [
      {
        "label": "George Howell",
        "url": "https://georgehowellcoffee.com"
      }
    ],
    "scarcityProxy": 90,
    "limitedRelease": true,
    "microlotSizeKg": 30,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 10,
    "weirdnessScore": 2,
    "competitionWins": [
      "Best of Panama multiple years"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Jasmine tea cake",
      "Fresh peaches",
      "Honey comb"
    ],
    "connoisseurNote": "George Howell roasting Esmeralda Gesha is the GOAT roasting the GOAT coffee. The man who coined 'specialty coffee' applying his 50 years of expertise to the most celebrated lot on earth. The result is transcendent — floral, sweet, complex beyond description.",
    "wowProxy": 96
  },
  {
    "id": "proud-mary-ethiopia-halo-hartume",
    "name": "Ethiopia Halo Hartume Anaerobic",
    "producer": "Proud Mary",
    "producerCountry": "Australia",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2050,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Anaerobic Natural",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Proud Mary internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 10,
      "complexity": 9,
      "fruitiness": 10,
      "chocolate": 2
    },
    "tastingNotes": [
      "Strawberry",
      "Mango",
      "Cream",
      "Tropical",
      "Candy"
    ],
    "priceUsd": 35,
    "unitGrams": 200,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 48,
    "buyLinks": [
      {
        "label": "Proud Mary",
        "url": "https://proudmarycoffee.com"
      }
    ],
    "scarcityProxy": 65,
    "limitedRelease": true,
    "microlotSizeKg": 80,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 10,
    "varietyRarityScore": 7,
    "weirdnessScore": 5,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Strawberry shortcake",
      "Mango sorbet",
      "Vanilla ice cream"
    ],
    "connoisseurNote": "Proud Mary's anaerobic Ethiopians are the most fun coffees in the catalog. Halo Hartume is a tropical candy bomb — strawberry, mango, cream. The anaerobic process amplifies the fruit to 11. Not for purists. Perfect for everyone else.",
    "wowProxy": 85
  },
  {
    "id": "trade-coffee-subscription-mystery",
    "name": "Mystery Subscription Box",
    "producer": "Trade Coffee (aggregator)",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Varies",
    "originRegion": "Varies",
    "variety": "Varies",
    "species": "Arabica",
    "processingMethod": "Varies",
    "roastLevel": "Varies",
    "cuppingScore": 82,
    "cuppingSource": "Aggregate estimate",
    "flavorProfile": {
      "acidity": 5,
      "body": 6,
      "sweetness": 6,
      "complexity": 5,
      "fruitiness": 5,
      "chocolate": 5
    },
    "tastingNotes": [
      "Varies by roaster",
      "Generally solid",
      "Occasionally excellent"
    ],
    "priceUsd": 15,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Trade Coffee",
        "url": "https://trade.coffee"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over"
    ],
    "connoisseurNote": "Trade is a subscription aggregator that matches you with roasters based on a quiz. The concept is solid — they partner with 400+ roasters. But the algorithm tends toward safe, middle-of-the-road picks. Good for discovery, not for depth.",
    "wowProxy": 25
  },
  {
    "id": "charbucks-italian-roast",
    "name": "Italian Roast",
    "producer": "Starbucks",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Extra Dark",
    "cuppingScore": 65,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 1,
      "body": 8,
      "sweetness": 2,
      "complexity": 2,
      "fruitiness": 0,
      "chocolate": 5
    },
    "tastingNotes": [
      "Charcoal",
      "Smoke",
      "Bitter",
      "Ash",
      "Burnt"
    ],
    "priceUsd": 13,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Starbucks",
        "url": "https://starbucks.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 1,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Starbucks Italian Roast is what happens when you take perfectly good specialty-grade beans and roast them until every trace of origin character is incinerated. It's not Italian — no Italian would drink this. It's just burnt. The coffee equivalent of a well-done wagyu steak.",
    "wowProxy": 3
  },
  {
    "id": "mcdonalds-premium-roast",
    "name": "Premium Roast",
    "producer": "McDonald's (McCafé)",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 68,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 5,
      "sweetness": 4,
      "complexity": 2,
      "fruitiness": 1,
      "chocolate": 5
    },
    "tastingNotes": [
      "Mild",
      "Smooth",
      "Slightly nutty",
      "Inoffensive",
      "Watery"
    ],
    "priceUsd": 9,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "McDonald's",
        "url": "https://mcdonalds.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 1,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Here's the dirty secret: McDonald's coffee is actually better than Starbucks drip. They use 100% Arabica, roast it medium, and serve it fresh. It's not good by specialty standards, but it's honest — and at $1 for a large, it's the best value in fast food coffee.",
    "wowProxy": 8
  },
  {
    "id": "klatch-belle-espresso",
    "name": "Belle Espresso",
    "producer": "Klatch Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Colombia / Guatemala",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 88,
    "cuppingSource": "Klatch internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 8,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 5,
      "chocolate": 8
    },
    "tastingNotes": [
      "Chocolate",
      "Cherry",
      "Caramel",
      "Sweet",
      "Creamy"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Klatch Coffee",
        "url": "https://klatchcoffee.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "competitionWins": [
      "World Barista Championship supply"
    ],
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Chocolate cake",
      "Cherry pie",
      "Biscotti"
    ],
    "connoisseurNote": "Klatch won the World Barista Championship with their coffee. Belle Espresso is their flagship blend — chocolate, cherry, caramel. It's designed for espresso but works beautifully as a pour-over. One of the best values in specialty espresso.",
    "wowProxy": 52
  },
  {
    "id": "vibrant-ethiopia-guji-natural",
    "name": "Ethiopia Guji Uraga Natural",
    "producer": "Vibrant Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Uraga",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Vibrant internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 10,
      "chocolate": 2
    },
    "tastingNotes": [
      "Blueberry",
      "Grape",
      "Chocolate",
      "Wine",
      "Floral"
    ],
    "priceUsd": 21,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Vibrant Coffee",
        "url": "https://vibrantcoffeeroasters.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry cobbler",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "Vibrant in Philadelphia is one of the most exciting young roasters in the US. Their Guji naturals are fruit bombs — blueberry and grape so vivid they border on wine. At $21 for 10oz, it's a steal for this quality level.",
    "wowProxy": 68
  },
  {
    "id": "coava-kilenso-mokonissa",
    "name": "Kilenso Mokonissa",
    "producer": "Coava Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Oromia",
    "altitude": 2100,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Coava internal",
    "flavorProfile": {
      "acidity": 8,
      "body": 5,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 8,
      "chocolate": 3
    },
    "tastingNotes": [
      "Lemon",
      "Peach",
      "Jasmine",
      "Honey",
      "Tea-like"
    ],
    "priceUsd": 22,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "Coava Coffee",
        "url": "https://coavacoffee.com"
      }
    ],
    "scarcityProxy": 35,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Batch brew"
    ],
    "foodPairingSuggestions": [
      "Lemon cake",
      "Shortbread",
      "Fresh fruit"
    ],
    "connoisseurNote": "Coava in Portland is the roaster that other roasters respect. Their washed Ethiopians are textbook — clean, floral, tea-like. Kilenso Mokonissa is the kind of coffee that makes you understand why people spend $22 on 10oz of beans.",
    "wowProxy": 72
  },
  {
    "id": "olympia-ethiopia-ardi",
    "name": "Ardi — Ethiopia Natural",
    "producer": "Olympia Coffee Roasting",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Guji, Oromia",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Olympia internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blueberry",
      "Strawberry",
      "Chocolate",
      "Floral",
      "Sweet"
    ],
    "priceUsd": 20,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 42,
    "buyLinks": [
      {
        "label": "Olympia Coffee",
        "url": "https://olympiacoffee.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry tart",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "Olympia in Olympia, WA is a B Corp that proves you can source ethically and roast brilliantly. Ardi is their flagship natural Ethiopian — blueberry and strawberry notes that are vivid without being over-fermented. A crowd-pleaser that also happens to be ethically sourced.",
    "wowProxy": 65
  },
  {
    "id": "ritual-guatemala-finca-rosma",
    "name": "Guatemala Finca Rosma Bourbon",
    "producer": "Ritual Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Guatemala",
    "originRegion": "Huehuetenango",
    "originFarm": "Finca Rosma",
    "altitude": 1800,
    "variety": "Bourbon",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 88,
    "cuppingSource": "Ritual internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Plum",
      "Caramel",
      "Almond",
      "Clean"
    ],
    "priceUsd": 22,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Ritual Coffee",
        "url": "https://ritualroasters.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 5,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Pour-over",
      "Drip",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Dark chocolate",
      "Plum cake",
      "Almonds"
    ],
    "connoisseurNote": "Ritual is San Francisco's OG specialty roaster. Their Guatemalan Bourbon from Finca Rosma is a classic — chocolate, plum, caramel. Not flashy, not boring. Just really, really good coffee from a roaster that's been doing this longer than most.",
    "wowProxy": 55
  },
  {
    "id": "sightglass-banner-dark",
    "name": "Banner Dark Blend",
    "producer": "Sightglass Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Dark",
    "cuppingScore": 84,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 3,
      "body": 9,
      "sweetness": 6,
      "complexity": 5,
      "fruitiness": 2,
      "chocolate": 9
    },
    "tastingNotes": [
      "Dark chocolate",
      "Smoky",
      "Caramel",
      "Nutty",
      "Bold"
    ],
    "priceUsd": 18,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Sightglass",
        "url": "https://sightglasscoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "French press",
      "Drip",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Chocolate brownie",
      "S'mores",
      "Steak"
    ],
    "connoisseurNote": "Sightglass proves that dark roast doesn't have to mean burnt. Banner Dark is roasted with care — you get chocolate and caramel instead of charcoal. The dark roast for people who want depth without destruction.",
    "wowProxy": 30
  },
  {
    "id": "eiland-colombia-pink-bourbon-honey",
    "name": "Colombia Pink Bourbon Honey",
    "producer": "Eiland Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "altitude": 1850,
    "variety": "Pink Bourbon",
    "species": "Arabica",
    "processingMethod": "Honey",
    "roastLevel": "Light",
    "cuppingScore": 90,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 10,
      "complexity": 8,
      "fruitiness": 8,
      "chocolate": 4
    },
    "tastingNotes": [
      "Peach",
      "Rose",
      "Honey",
      "Vanilla",
      "Silky"
    ],
    "priceUsd": 24,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 42,
    "buyLinks": [
      {
        "label": "Eiland Coffee",
        "url": "https://eilandcoffee.com"
      }
    ],
    "scarcityProxy": 45,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 8,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Peach tart",
      "Rose Turkish delight",
      "Honey cake"
    ],
    "connoisseurNote": "Eiland in Texas is quietly producing some of the best light roasts in the South. Their honey-processed Pink Bourbon is a stunner — peach, rose, honey, with a silky body that makes it feel like drinking liquid velvet.",
    "wowProxy": 72
  },
  {
    "id": "parlor-ethiopia-worka-natural",
    "name": "Ethiopia Worka Natural",
    "producer": "Parlor Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Ethiopia",
    "originRegion": "Gedeo, Yirgacheffe",
    "altitude": 2000,
    "variety": "Heirloom Ethiopian",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Parlor internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 7,
      "sweetness": 9,
      "complexity": 8,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Blueberry",
      "Strawberry",
      "Wine",
      "Floral",
      "Sweet"
    ],
    "priceUsd": 24,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 38,
    "buyLinks": [
      {
        "label": "Parlor Coffee",
        "url": "https://parlorcoffee.com"
      }
    ],
    "scarcityProxy": 30,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 6,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "Cold brew"
    ],
    "foodPairingSuggestions": [
      "Berry tart",
      "Dark chocolate",
      "Yogurt"
    ],
    "connoisseurNote": "Parlor in Brooklyn is the roaster for people who think they've outgrown Brooklyn roasters. Their natural Ethiopians are precise — fruit-forward without being sloppy. Worka Natural is the kind of coffee that makes you cancel your next meeting.",
    "wowProxy": 65
  },
  {
    "id": "black-rifle-beyond-black",
    "name": "Beyond Black — Dark Roast",
    "producer": "Black Rifle Coffee Company",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Colombia / Brazil",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Extra Dark",
    "cuppingScore": 70,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 1,
      "body": 9,
      "sweetness": 2,
      "complexity": 2,
      "fruitiness": 0,
      "chocolate": 5
    },
    "tastingNotes": [
      "Charcoal",
      "Smoke",
      "Bitter",
      "Burnt",
      "Heavy"
    ],
    "priceUsd": 16,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Black Rifle",
        "url": "https://blackriflecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 1,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "French press"
    ],
    "connoisseurNote": "Black Rifle is a culture brand that happens to sell coffee. Their 'Beyond Black' is roasted so dark it's essentially charcoal. The marketing is about identity, not quality. If you want to support veterans, there are better ways. If you want good coffee, look literally anywhere else.",
    "wowProxy": 5
  },
  {
    "id": "bones-coffee-sinn-o-bun",
    "name": "S'inn-O-Bun Flavored",
    "producer": "Bones Coffee Company",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Industrial + Flavoring",
    "roastLevel": "Medium",
    "cuppingScore": 50,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 5,
      "sweetness": 6,
      "complexity": 1,
      "fruitiness": 1,
      "chocolate": 3
    },
    "tastingNotes": [
      "Artificial cinnamon",
      "Chemical sweetness",
      "Vanilla extract",
      "Stale base"
    ],
    "priceUsd": 16,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "F",
    "buyLinks": [
      {
        "label": "Bones Coffee",
        "url": "https://bonescoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 0,
    "weirdnessScore": 1,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Flavored coffee is the industry's dirty secret — it exists to mask the taste of low-quality beans. Bones Coffee uses artificial flavorings to make commodity coffee taste like dessert. If you want cinnamon roll flavor, eat a cinnamon roll. Don't ruin coffee.",
    "wowProxy": 2
  },
  {
    "id": "community-coffee-signature",
    "name": "Signature Blend",
    "producer": "Community Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 72,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 6,
      "sweetness": 4,
      "complexity": 3,
      "fruitiness": 2,
      "chocolate": 5
    },
    "tastingNotes": [
      "Mild",
      "Nutty",
      "Smooth",
      "Inoffensive",
      "Flat"
    ],
    "priceUsd": 8,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Community Coffee",
        "url": "https://communitycoffee.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 2,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Community Coffee is Louisiana's largest coffee brand and a regional institution. The Signature Blend is perfectly adequate — mild, smooth, forgettable. It's the coffee equivalent of a participation trophy. Not bad enough to complain about, not good enough to remember.",
    "wowProxy": 8
  },
  {
    "id": "tim-hortons-original",
    "name": "Original Blend",
    "producer": "Tim Hortons (Restaurant Brands International)",
    "producerCountry": "Canada",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Latin America",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 68,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 3,
      "body": 5,
      "sweetness": 4,
      "complexity": 2,
      "fruitiness": 1,
      "chocolate": 4
    },
    "tastingNotes": [
      "Mild",
      "Smooth",
      "Slightly sweet",
      "Watery",
      "Forgettable"
    ],
    "priceUsd": 10,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Tim Hortons",
        "url": "https://timhortons.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 2,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 0,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip"
    ],
    "connoisseurNote": "Tim Hortons is Canada's national coffee chain, and Canadians defend it with patriotic fervor. The coffee itself is unremarkable — mild, smooth, designed to be consumed in large quantities. It's the coffee you drink because it's there, not because it's good.",
    "wowProxy": 5
  },
  {
    "id": "wrecking-ball-el-salvador-pacamara",
    "name": "El Salvador Pacamara Washed",
    "producer": "Wrecking Ball Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "El Salvador",
    "originRegion": "Santa Ana",
    "altitude": 1600,
    "variety": "Pacamara",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 7,
      "body": 8,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 6,
      "chocolate": 6
    },
    "tastingNotes": [
      "Plum",
      "Dark chocolate",
      "Citrus",
      "Creamy",
      "Complex"
    ],
    "priceUsd": 24,
    "unitGrams": 284,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 40,
    "buyLinks": [
      {
        "label": "Wrecking Ball",
        "url": "https://wreckingballcoffee.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 7,
    "weirdnessScore": 2,
    "recommendedBrewMethods": [
      "Pour-over",
      "Espresso",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Plum cake",
      "Dark chocolate",
      "Aged cheese"
    ],
    "connoisseurNote": "Wrecking Ball in San Francisco sources some of the best Pacamaras in the country. El Salvador's giant-bean variety produces a cup with unusual depth — plum, chocolate, citrus, and a creamy body that makes it work as both espresso and filter.",
    "wowProxy": 62
  },
  {
    "id": "luna-panama-gesha-natural",
    "name": "Panama Gesha Natural — Finca Sophia",
    "producer": "Luna Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Panama",
    "originRegion": "Volcán, Chiriquí",
    "originFarm": "Finca Sophia",
    "altitude": 1900,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Natural",
    "roastLevel": "Light",
    "cuppingScore": 93,
    "cuppingSource": "Best of Panama",
    "flavorProfile": {
      "acidity": 8,
      "body": 7,
      "sweetness": 10,
      "complexity": 10,
      "fruitiness": 9,
      "chocolate": 3
    },
    "tastingNotes": [
      "Tropical fruit",
      "Jasmine",
      "Mango",
      "Honey",
      "Wine"
    ],
    "priceUsd": 80,
    "unitGrams": 150,
    "moldTestStatus": "verified",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 65,
    "buyLinks": [
      {
        "label": "Luna Coffee",
        "url": "https://lunacoffeeroasters.com"
      }
    ],
    "scarcityProxy": 90,
    "limitedRelease": true,
    "microlotSizeKg": 25,
    "harvestYear": 2024,
    "inStock": true,
    "deliveryDaysEst": 5,
    "shipCostUsdEst": 8,
    "varietyRarityScore": 10,
    "weirdnessScore": 4,
    "competitionWins": [
      "Best of Panama 2024 Natural Gesha"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "Siphon"
    ],
    "foodPairingSuggestions": [
      "Tropical fruit",
      "Jasmine tea cake",
      "Honey"
    ],
    "connoisseurNote": "Finca Sophia is the highest-altitude coffee farm in Panama. Their natural Gesha is a tropical explosion — mango, jasmine, honey, wine. Luna roasts it with a light touch that lets every note sing. This is the coffee that makes you understand why people pay $80 for 150g.",
    "wowProxy": 94
  },
  {
    "id": "swift-cup-instant-colombia",
    "name": "Colombia Instant Specialty",
    "producer": "Swift Cup Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Huila",
    "variety": "Caturra",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 84,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 5,
      "sweetness": 7,
      "complexity": 5,
      "fruitiness": 5,
      "chocolate": 6
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Citrus",
      "Clean",
      "Mild"
    ],
    "priceUsd": 15,
    "unitGrams": 42,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Swift Cup",
        "url": "https://swiftcupcoffee.com"
      }
    ],
    "scarcityProxy": 15,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Hot water"
    ],
    "foodPairingSuggestions": [
      "Travel snacks",
      "Camping food",
      "Anything on the go"
    ],
    "connoisseurNote": "Swift Cup proves that instant coffee doesn't have to be terrible. They freeze-dry specialty-grade beans, and the result is shockingly good — chocolate, caramel, citrus. It's not as good as fresh pour-over, but it's 10x better than Nescafé. The future of travel coffee.",
    "wowProxy": 35
  },
  {
    "id": "intelligentsia-el-gallo",
    "name": "El Gallo — Guatemala",
    "producer": "Intelligentsia Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Guatemala",
    "originRegion": "Huehuetenango",
    "altitude": 1800,
    "variety": "Bourbon / Caturra",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 88,
    "cuppingSource": "Intelligentsia internal",
    "flavorProfile": {
      "acidity": 6,
      "body": 7,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 5,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Orange",
      "Caramel",
      "Almond",
      "Clean"
    ],
    "priceUsd": 22,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Intelligentsia",
        "url": "https://intelligentsia.com"
      }
    ],
    "scarcityProxy": 20,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 4,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Pour-over",
      "Drip",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Orange cake",
      "Dark chocolate",
      "Almonds"
    ],
    "connoisseurNote": "Intelligentsia's single origins are better than their blends. El Gallo from Huehuetenango is a classic Guatemalan — chocolate, orange, caramel. Not revolutionary, but reliably excellent. The kind of coffee that reminds you why you started drinking specialty.",
    "wowProxy": 50
  },
  {
    "id": "joe-coffee-daily-blend",
    "name": "The Daily Blend",
    "producer": "Joe Coffee Company",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Colombia / Ethiopia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 85,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 7,
      "sweetness": 7,
      "complexity": 5,
      "fruitiness": 4,
      "chocolate": 7
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Nutty",
      "Smooth",
      "Balanced"
    ],
    "priceUsd": 17,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Joe Coffee",
        "url": "https://joecoffeecompany.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 2,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Pour-over",
      "Espresso"
    ],
    "foodPairingSuggestions": [
      "Toast",
      "Pastries",
      "Breakfast"
    ],
    "connoisseurNote": "Joe Coffee is New York's neighborhood roaster. The Daily Blend is exactly what it sounds like — chocolate, caramel, smooth. Not trying to be anything it's not. The coffee you drink every morning without thinking about it, which is actually the highest compliment.",
    "wowProxy": 32
  },
  {
    "id": "cafe-grumpy-heartbreaker",
    "name": "Heartbreaker Espresso",
    "producer": "Café Grumpy",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 86,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 7,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 8
    },
    "tastingNotes": [
      "Chocolate",
      "Cherry",
      "Caramel",
      "Sweet",
      "Rich"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Café Grumpy",
        "url": "https://cafegrumpy.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Chocolate cake",
      "Cherry pie",
      "Biscotti"
    ],
    "connoisseurNote": "Café Grumpy got famous from a cameo on Girls, but the coffee was good before HBO showed up. Heartbreaker is their espresso blend — chocolate, cherry, caramel. It's designed to be the best espresso in your neighborhood, and in most neighborhoods, it is.",
    "wowProxy": 42
  },
  {
    "id": "kicking-horse-kick-ass",
    "name": "Kick Ass Dark Roast",
    "producer": "Kicking Horse Coffee (Lavazza)",
    "producerCountry": "Canada",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Indonesia / Central America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Dark",
    "cuppingScore": 76,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 9,
      "sweetness": 4,
      "complexity": 3,
      "fruitiness": 1,
      "chocolate": 7
    },
    "tastingNotes": [
      "Smoky",
      "Chocolate",
      "Earthy",
      "Bold",
      "Bitter"
    ],
    "priceUsd": 13,
    "unitGrams": 284,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "C",
    "buyLinks": [
      {
        "label": "Kicking Horse",
        "url": "https://kickinghorsecoffee.com"
      }
    ],
    "scarcityProxy": 0,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 2,
    "shipCostUsdEst": 0,
    "varietyRarityScore": 1,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "French press"
    ],
    "connoisseurNote": "Kicking Horse was a beloved Canadian organic roaster until Lavazza bought them. Kick Ass is their flagship dark roast — smoky, bold, and marketed with aggressive branding. The coffee is fine for dark roast fans, but 'organic' and 'fair trade' labels don't make up for over-roasting.",
    "wowProxy": 10
  },
  {
    "id": "jot-ultra-coffee-concentrate",
    "name": "Ultra Coffee Concentrate",
    "producer": "Jot",
    "producerCountry": "USA",
    "producerShipsGlobal": false,
    "originCountry": "Blend",
    "originRegion": "Unknown",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Concentrated extraction",
    "roastLevel": "Dark",
    "cuppingScore": 74,
    "cuppingSource": "Industry estimate",
    "flavorProfile": {
      "acidity": 2,
      "body": 10,
      "sweetness": 4,
      "complexity": 3,
      "fruitiness": 1,
      "chocolate": 7
    },
    "tastingNotes": [
      "Intense",
      "Chocolate",
      "Bitter",
      "Concentrated",
      "Thick"
    ],
    "priceUsd": 24,
    "unitGrams": 200,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "D",
    "buyLinks": [
      {
        "label": "Jot",
        "url": "https://jot.co"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 1,
    "weirdnessScore": 3,
    "recommendedBrewMethods": [
      "Add to milk/water"
    ],
    "connoisseurNote": "Jot is a coffee concentrate — one tablespoon in milk or water makes a cup. The concept is convenient, but the execution prioritizes strength over flavor. It's dark, intense, and one-dimensional. Good for people who want caffeine delivery, not for people who want to taste coffee.",
    "wowProxy": 12
  },
  {
    "id": "counter-culture-apollo",
    "name": "Apollo Blend",
    "producer": "Counter Culture Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Colombia",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 8
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Berry",
      "Sweet",
      "Smooth"
    ],
    "priceUsd": 15,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 35,
    "buyLinks": [
      {
        "label": "Counter Culture",
        "url": "https://counterculturecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Drip",
      "Espresso",
      "French press"
    ],
    "foodPairingSuggestions": [
      "Chocolate",
      "Pastries",
      "Breakfast"
    ],
    "connoisseurNote": "Apollo is Counter Culture's crowd-pleaser — the blend designed to make everyone happy. Chocolate, caramel, berry, smooth. It's the coffee you serve at a dinner party when you don't know everyone's preferences. And at $15 for 12oz from a transparently-sourced roaster, it's a genuine bargain.",
    "wowProxy": 40
  },
  {
    "id": "cuvee-black-and-blue",
    "name": "Black & Blue Espresso",
    "producer": "Cuvée Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Ethiopia / Brazil",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed/Natural Blend",
    "roastLevel": "Medium",
    "cuppingScore": 87,
    "cuppingSource": "Internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 8,
      "complexity": 7,
      "fruitiness": 6,
      "chocolate": 7
    },
    "tastingNotes": [
      "Blueberry",
      "Chocolate",
      "Caramel",
      "Sweet",
      "Rich"
    ],
    "priceUsd": 18,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Cuvée Coffee",
        "url": "https://cuveecoffee.com"
      }
    ],
    "scarcityProxy": 10,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Drip"
    ],
    "foodPairingSuggestions": [
      "Blueberry muffin",
      "Dark chocolate",
      "Pastries"
    ],
    "connoisseurNote": "Cuvée in Austin pioneered nitro cold brew and continues to push boundaries. Black & Blue is their espresso blend — blueberry from the Ethiopian component, chocolate from the Brazilian. It's designed for espresso but makes a killer cold brew too.",
    "wowProxy": 48
  },
  {
    "id": "verve-streetlevel",
    "name": "Streetlevel Espresso",
    "producer": "Verve Coffee Roasters",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Latin America / Africa",
    "variety": "Mixed",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Medium",
    "cuppingScore": 87,
    "cuppingSource": "Verve internal",
    "flavorProfile": {
      "acidity": 5,
      "body": 8,
      "sweetness": 8,
      "complexity": 6,
      "fruitiness": 5,
      "chocolate": 8
    },
    "tastingNotes": [
      "Chocolate",
      "Caramel",
      "Toffee",
      "Sweet",
      "Balanced"
    ],
    "priceUsd": 19,
    "unitGrams": 340,
    "moldTestStatus": "claims",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Verve Coffee",
        "url": "https://vervecoffee.com"
      }
    ],
    "scarcityProxy": 5,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 3,
    "weirdnessScore": 0,
    "recommendedBrewMethods": [
      "Espresso",
      "Moka pot",
      "Aeropress"
    ],
    "foodPairingSuggestions": [
      "Chocolate",
      "Toffee",
      "Pastries"
    ],
    "connoisseurNote": "Verve's espresso blend is Santa Cruz sunshine in a cup. Streetlevel is chocolate, caramel, toffee — designed to be the best espresso on your block. It's not trying to be exotic. It's trying to be perfect, and it comes close.",
    "wowProxy": 45
  },
  {
    "id": "pulse-n-pause-lemongrass-gesha",
    "name": "Finca La Dinastia Lemongrass Gesha",
    "producer": "Pulse N Pause Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Wilder Lazo, Finca La Dinastia",
    "originFarm": "Finca La Dinastia",
    "altitude": 1515,
    "variety": "Gesha",
    "species": "Arabica",
    "processingMethod": "Washed Lemongrass Fermentation",
    "roastLevel": "Light",
    "cuppingScore": 91,
    "cuppingSource": "Estimated from variety/process",
    "flavorProfile": {
      "acidity": 9,
      "body": 5,
      "sweetness": 8,
      "complexity": 10,
      "fruitiness": 8,
      "chocolate": 2
    },
    "tastingNotes": [
      "Lemongrass",
      "Peach",
      "Apricot",
      "Wild"
    ],
    "priceUsd": 38,
    "unitGrams": 227,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "farmerSharePct": 50,
    "buyLinks": [
      {
        "label": "Pulse N Pause Coffee",
        "url": "https://pulsenpausecoffee.com"
      }
    ],
    "scarcityProxy": 85,
    "limitedRelease": true,
    "inStock": true,
    "deliveryDaysEst": 4,
    "shipCostUsdEst": 6,
    "varietyRarityScore": 9,
    "weirdnessScore": 8,
    "recommendedBrewMethods": [
      "Pour-over",
      "Chemex",
      "V60"
    ],
    "foodPairingSuggestions": [
      "Lemon tart",
      "Stone fruit",
      "Thai basil dessert"
    ],
    "connoisseurNote": "Wilder Lazo's lemongrass-fermented Gesha is the kind of coffee that makes you question what coffee even is. The lemongrass fermentation adds an herbal, almost tea-like dimension to the already floral Gesha variety. Roasted in San Francisco. This is experimental processing at its most audacious — and it works.",
    "wowProxy": 88,
    "roastDate": "2025-04-28",
    "peakWindowDays": [
      7,
      21
    ],
    "harvestYear": 2025
  },
  {
    "id": "modcup-london-fog",
    "name": "London Fog",
    "producer": "Modcup Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Blend",
    "originRegion": "Cauca, Colombia & Yirgacheffe, Ethiopia",
    "altitude": 1875,
    "variety": "Caturra / Ethiopian Heirloom",
    "species": "Arabica",
    "processingMethod": "Semi-washed",
    "roastLevel": "Light-Medium",
    "cuppingScore": 89,
    "cuppingSource": "Estimated from tasting notes",
    "flavorProfile": {
      "acidity": 7,
      "body": 6,
      "sweetness": 8,
      "complexity": 9,
      "fruitiness": 6,
      "chocolate": 3
    },
    "tastingNotes": [
      "Lavender",
      "Bergamot",
      "Lemon blossom"
    ],
    "priceUsd": 30,
    "unitGrams": 340,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "B",
    "buyLinks": [
      {
        "label": "Modcup Coffee",
        "url": "https://modcup.com"
      }
    ],
    "scarcityProxy": 40,
    "limitedRelease": false,
    "inStock": true,
    "deliveryDaysEst": 3,
    "shipCostUsdEst": 5,
    "varietyRarityScore": 5,
    "weirdnessScore": 5,
    "recommendedBrewMethods": [
      "Pour-over",
      "Aeropress",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Earl Grey shortbread",
      "Lavender scone",
      "Lemon curd"
    ],
    "connoisseurNote": "Jersey City's Modcup calls this a 'Modern Expression' and they're not wrong. London Fog bridges Colombian modern processing with Ethiopian washed clarity — the result is a cup that smells like walking through a botanical garden. Lavender, bergamot, lemon blossom. It's an Earl Grey tea lover's gateway into specialty coffee.",
    "wowProxy": 72
  },
  {
    "id": "nordaggios-wush-wush-kodawari-ii",
    "name": "Wush Wush — Kodawari Volume II",
    "producer": "Nordaggios Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Colombia",
    "originRegion": "Santuario, Risaralda",
    "originFarm": "Finca Esmeralda Negra",
    "altitude": 1900,
    "variety": "Wush Wush",
    "species": "Arabica",
    "processingMethod": "Anaerobic Washed, Thermal Shock",
    "roastLevel": "Light",
    "cuppingScore": 92,
    "cuppingSource": "Competition microlot",
    "flavorProfile": {
      "acidity": 9,
      "body": 6,
      "sweetness": 9,
      "complexity": 10,
      "fruitiness": 10,
      "chocolate": 3
    },
    "tastingNotes": [
      "Raspberry",
      "Passionfruit",
      "Peach",
      "White chocolate"
    ],
    "priceUsd": 55,
    "unitGrams": 200,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Nordaggios Coffee",
        "url": "https://nordaggios.com"
      }
    ],
    "scarcityProxy": 95,
    "limitedRelease": true,
    "microlotSizeKg": 25,
    "inStock": true,
    "deliveryDaysEst": 4,
    "shipCostUsdEst": 6,
    "varietyRarityScore": 10,
    "weirdnessScore": 7,
    "competitionWins": [
      "Boris Herrera Competition Microlot"
    ],
    "recommendedBrewMethods": [
      "Pour-over",
      "V60",
      "Kalita Wave"
    ],
    "foodPairingSuggestions": [
      "Raspberry tart",
      "White chocolate truffle",
      "Passionfruit mousse"
    ],
    "connoisseurNote": "Boris Herrera's competition microlot is what Nordaggios calls 'A Liquid Collectable' — and they mean it. Wush Wush is one of the rarest coffee varieties on earth, originally from the Wush Wush forest in Ethiopia, now grown at 1900m in Colombia's Risaralda region. The anaerobic washed thermal shock process took 240 hours. Raspberry, passionfruit, peach, white chocolate. This is coffee as fine art. Kodawari Volume II — the Japanese concept of relentless pursuit of perfection.",
    "wowProxy": 94,
    "harvestYear": 2025
  },
  {
    "id": "flower-child-lisbeth-marino-sl9",
    "name": "Lisbeth Marino SL9",
    "producer": "Flower Child Coffee",
    "producerCountry": "USA",
    "producerShipsGlobal": true,
    "originCountry": "Peru",
    "originRegion": "Inkahuasi, Cusco",
    "altitude": 2200,
    "variety": "SL9",
    "species": "Arabica",
    "processingMethod": "Washed",
    "roastLevel": "Light",
    "cuppingScore": 89,
    "cuppingSource": "Estimated from variety/origin",
    "flavorProfile": {
      "acidity": 8,
      "body": 6,
      "sweetness": 8,
      "complexity": 8,
      "fruitiness": 7,
      "chocolate": 4
    },
    "tastingNotes": [
      "Floral",
      "Citrus",
      "Stone fruit",
      "Clean"
    ],
    "priceUsd": 32,
    "unitGrams": 250,
    "moldTestStatus": "untested",
    "producerTransparencyGrade": "A",
    "buyLinks": [
      {
        "label": "Flower Child Coffee",
        "url": "https://flowerchildcoffee.com"
      }
    ],
    "scarcityProxy": 80,
    "limitedRelease": true,
    "inStock": true,
    "deliveryDaysEst": 4,
    "shipCostUsdEst": 6,
    "varietyRarityScore": 8,
    "weirdnessScore": 4,
    "recommendedBrewMethods": [
      "Pour-over",
      "V60",
      "Chemex"
    ],
    "foodPairingSuggestions": [
      "Citrus cake",
      "Almond biscotti",
      "Fresh berries"
    ],
    "connoisseurNote": "Flower Child Coffee sources directly from Lisbeth Marino's farm at 2200 MASL in Cusco, Peru — one of the highest-altitude coffee origins in the world. SL9 is a Kenyan variety rarely seen outside East Africa, now thriving in the Peruvian highlands. Harvested October 2025, washed clean. The handwritten label tells you everything about the scale of this operation — this is artisan coffee at its most intimate.",
    "wowProxy": 78,
    "harvestYear": 2025
  }
];
