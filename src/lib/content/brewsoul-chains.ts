import type { ChainEntry } from "@/lib/intelligence-engine/types";

// Extracted from legacy client/src/data/brewsoul-chains.ts's computed
// `CHAIN_RANKINGS` export (real 5-dimension scores → weighted
// aggregate → tier, computed once at legacy's module-load time from a
// smaller raw dataset) — dumped here as a literal array via a one-off
// `tsx` extraction script, same approach used for brewsoul-coffees.ts,
// so the real computed values are preserved exactly without
// re-implementing the aggregate/tier derivation logic by hand.
export const CHAIN_RANKINGS: ChainEntry[] = [
  {
    "rank": 1,
    "id": "counter-culture",
    "name": "Counter Culture Coffee",
    "hq": "Durham, NC",
    "locations": 3,
    "founded": 1995,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 10,
      "experience": 8,
      "consistency": 9
    },
    "verdict": "The gold standard. Publishes full transparency report every year. Every farm, every price, every lot. The best $15/bag in America.",
    "strengths": [
      "Full transparency report",
      "Direct trade pioneer",
      "Consistent roast quality",
      "Training centers nationwide"
    ],
    "weaknesses": [
      "Limited retail locations",
      "Not widely available in stores"
    ],
    "signatureDrink": "Hologram Blend pour-over",
    "priceRange": "$14-22/bag",
    "website": "https://counterculturecoffee.com",
    "aggregate": 88,
    "tier": "S"
  },
  {
    "rank": 2,
    "id": "onyx-coffee-lab",
    "name": "Onyx Coffee Lab",
    "hq": "Rogers, AR",
    "locations": 4,
    "founded": 2012,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 10,
      "value": 7,
      "sourcingEthics": 9,
      "experience": 9,
      "consistency": 9
    },
    "verdict": "The most exciting roaster in America. Competition-winning quality at every price point. Their cafés are temples of coffee.",
    "strengths": [
      "Competition winners",
      "Exceptional single origins",
      "Beautiful café design",
      "Transparent sourcing"
    ],
    "weaknesses": [
      "Premium pricing",
      "Limited locations"
    ],
    "signatureDrink": "Black Forager Natural pour-over",
    "priceRange": "$18-45/bag",
    "website": "https://onyxcoffeelab.com",
    "aggregate": 88,
    "tier": "S"
  },
  {
    "rank": 3,
    "id": "intelligentsia",
    "name": "Intelligentsia Coffee",
    "hq": "Chicago, IL",
    "locations": 12,
    "founded": 1995,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 9,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "Pioneered direct trade in the US. Now owned by Peet's but quality remains high. The OG of third-wave coffee.",
    "strengths": [
      "Direct trade pioneer",
      "Multiple locations",
      "Strong training program",
      "Consistent quality"
    ],
    "weaknesses": [
      "Corporate ownership (Peet's)",
      "Some locations feel corporate"
    ],
    "signatureDrink": "Black Cat Espresso",
    "priceRange": "$16-28/bag",
    "website": "https://intelligentsia.com",
    "aggregate": 80,
    "tier": "A"
  },
  {
    "rank": 4,
    "id": "verve-coffee",
    "name": "Verve Coffee Roasters",
    "hq": "Santa Cruz, CA",
    "locations": 8,
    "founded": 2007,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 7,
      "sourcingEthics": 9,
      "experience": 9,
      "consistency": 8
    },
    "verdict": "California sunshine in a cup. Beautiful cafés, exceptional single origins, and a sourcing program that rivals anyone.",
    "strengths": [
      "Stunning café design",
      "Excellent single origins",
      "Strong sourcing",
      "LA + Santa Cruz presence"
    ],
    "weaknesses": [
      "Premium pricing",
      "West Coast only"
    ],
    "signatureDrink": "Streetlevel Espresso",
    "priceRange": "$17-30/bag",
    "website": "https://vervecoffee.com",
    "aggregate": 84,
    "tier": "A"
  },
  {
    "rank": 5,
    "id": "sey-coffee",
    "name": "SEY Coffee",
    "hq": "Brooklyn, NY",
    "locations": 1,
    "founded": 2017,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 10,
      "value": 7,
      "sourcingEthics": 10,
      "experience": 8,
      "consistency": 9
    },
    "verdict": "The most transparent roaster in New York. Their washed Ethiopians are the gold standard. One location, zero compromises.",
    "strengths": [
      "Unmatched transparency",
      "Best washed Ethiopians in US",
      "Rigorous quality control"
    ],
    "weaknesses": [
      "Single location",
      "Premium pricing",
      "Can feel intimidating"
    ],
    "signatureDrink": "Worka Chelbesa Washed pour-over",
    "priceRange": "$18-55/bag",
    "website": "https://www.seycoffee.com",
    "aggregate": 89,
    "tier": "S"
  },
  {
    "rank": 6,
    "id": "heart-coffee",
    "name": "Heart Coffee Roasters",
    "hq": "Portland, OR",
    "locations": 3,
    "founded": 2009,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 7,
      "sourcingEthics": 9,
      "experience": 8,
      "consistency": 9
    },
    "verdict": "Portland's most consistent roaster. Every single origin is excellent. Their Gesha lots are world-class.",
    "strengths": [
      "Exceptional consistency",
      "World-class Geshas",
      "Clean minimalist cafés"
    ],
    "weaknesses": [
      "Portland only",
      "Limited blends"
    ],
    "signatureDrink": "Colombia Gesha pour-over",
    "priceRange": "$18-48/bag",
    "website": "https://heartroasters.com",
    "aggregate": 84,
    "tier": "A"
  },
  {
    "rank": 7,
    "id": "george-howell",
    "name": "George Howell Coffee",
    "hq": "Boston, MA",
    "locations": 3,
    "founded": 1984,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 10,
      "value": 8,
      "sourcingEthics": 9,
      "experience": 7,
      "consistency": 9
    },
    "verdict": "The man who coined 'specialty coffee.' 50 years of expertise. His coffees are masterclasses in roasting restraint.",
    "strengths": [
      "Legendary founder",
      "Exceptional roast quality",
      "Deep sourcing relationships",
      "Fair pricing for quality"
    ],
    "weaknesses": [
      "Limited locations",
      "Cafés feel dated"
    ],
    "signatureDrink": "Mamuto AA Kenya pour-over",
    "priceRange": "$16-95/bag",
    "website": "https://georgehowellcoffee.com",
    "aggregate": 88,
    "tier": "S"
  },
  {
    "rank": 8,
    "id": "passenger-coffee",
    "name": "Passenger Coffee",
    "hq": "Lancaster, PA",
    "locations": 3,
    "founded": 2014,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 9,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "Lancaster's gift to specialty coffee. Exceptional Kenyan lots and a sourcing program that punches way above its weight.",
    "strengths": [
      "Outstanding Kenyan coffees",
      "Fair pricing",
      "Beautiful Lancaster café",
      "Strong sourcing"
    ],
    "weaknesses": [
      "Limited to Lancaster area",
      "Small operation"
    ],
    "signatureDrink": "Kenya Nyeri pour-over",
    "priceRange": "$16-30/bag",
    "website": "https://passengercoffee.com",
    "aggregate": 85,
    "tier": "S"
  },
  {
    "rank": 9,
    "id": "ceremony-coffee",
    "name": "Ceremony Coffee Roasters",
    "hq": "Annapolis, MD",
    "locations": 6,
    "founded": 2008,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "The mid-Atlantic's best roaster. Natural Ethiopians that convert skeptics. Multiple locations without losing quality.",
    "strengths": [
      "Excellent natural Ethiopians",
      "Multiple locations",
      "Good value",
      "Consistent quality"
    ],
    "weaknesses": [
      "Mid-Atlantic only",
      "Blends are average"
    ],
    "signatureDrink": "Banko Gotiti Natural pour-over",
    "priceRange": "$15-25/bag",
    "website": "https://ceremonycoffee.com",
    "aggregate": 83,
    "tier": "A"
  },
  {
    "rank": 10,
    "id": "madcap-coffee",
    "name": "Madcap Coffee",
    "hq": "Grand Rapids, MI",
    "locations": 3,
    "founded": 2008,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "Proof that great coffee doesn't require a coastal zip code. Their Kenyan lots are consistently among the best in America.",
    "strengths": [
      "Outstanding Kenyans",
      "Midwest accessibility",
      "Fair pricing",
      "Beautiful cafés"
    ],
    "weaknesses": [
      "Michigan only",
      "Limited online presence"
    ],
    "signatureDrink": "Kenya Gichatha-ini AA pour-over",
    "priceRange": "$16-28/bag",
    "website": "https://madcapcoffee.com",
    "aggregate": 83,
    "tier": "A"
  },
  {
    "rank": 11,
    "id": "stumptown",
    "name": "Stumptown Coffee Roasters",
    "hq": "Portland, OR",
    "locations": 10,
    "founded": 1999,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 7
    },
    "verdict": "Portland's OG. Hair Bender is iconic. Now owned by Peet's, and some say the magic has faded. Still better than 95% of what's out there.",
    "strengths": [
      "Iconic blends",
      "Multiple locations",
      "Strong brand",
      "Good cold brew"
    ],
    "weaknesses": [
      "Corporate ownership",
      "Quality inconsistency across locations",
      "Resting on reputation"
    ],
    "signatureDrink": "Hair Bender Espresso",
    "priceRange": "$15-25/bag",
    "website": "https://stumptowncoffee.com",
    "aggregate": 77,
    "tier": "A"
  },
  {
    "rank": 12,
    "id": "blue-bottle",
    "name": "Blue Bottle Coffee",
    "hq": "Oakland, CA",
    "locations": 100,
    "founded": 2002,
    "type": "premium",
    "scores": {
      "coffeeQuality": 7,
      "value": 5,
      "sourcingEthics": 7,
      "experience": 9,
      "consistency": 8
    },
    "verdict": "Beautiful cafés, decent coffee, Nestlé money. The Apple Store of coffee — the experience is the product, not the beans.",
    "strengths": [
      "Stunning café design",
      "Consistent experience",
      "Wide availability",
      "Strong brand"
    ],
    "weaknesses": [
      "Nestlé ownership",
      "Overpriced for quality",
      "Style over substance"
    ],
    "signatureDrink": "Hayes Valley Espresso",
    "priceRange": "$16-28/bag",
    "website": "https://bluebottlecoffee.com",
    "aggregate": 69,
    "tier": "B"
  },
  {
    "rank": 13,
    "id": "devocion",
    "name": "Devoción",
    "hq": "Brooklyn, NY",
    "locations": 5,
    "founded": 2006,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 9,
      "experience": 9,
      "consistency": 7
    },
    "verdict": "The freshest coffee in America — beans ship from Colombia within 10 days of harvest. The Williamsburg café is a destination.",
    "strengths": [
      "Unmatched freshness",
      "Direct from Colombia",
      "Stunning Williamsburg café",
      "Unique model"
    ],
    "weaknesses": [
      "Colombia only",
      "Inconsistent across locations",
      "Premium pricing"
    ],
    "signatureDrink": "Toro Blend",
    "priceRange": "$16-25/bag",
    "website": "https://dfrankfurt.com",
    "aggregate": 80,
    "tier": "A"
  },
  {
    "rank": 14,
    "id": "coava",
    "name": "Coava Coffee Roasters",
    "hq": "Portland, OR",
    "locations": 4,
    "founded": 2008,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "The roaster that other roasters respect. Their washed Ethiopians are textbook. Portland's most serious coffee.",
    "strengths": [
      "Exceptional washed coffees",
      "Respected by industry",
      "Clean roasting style"
    ],
    "weaknesses": [
      "Portland only",
      "Can feel austere",
      "Limited blends"
    ],
    "signatureDrink": "Kilenso Mokonissa pour-over",
    "priceRange": "$17-28/bag",
    "website": "https://coavacoffee.com",
    "aggregate": 81,
    "tier": "A"
  },
  {
    "rank": 15,
    "id": "equator-coffees",
    "name": "Equator Coffees",
    "hq": "San Rafael, CA",
    "locations": 6,
    "founded": 1995,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 10,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "Certified B Corp that proves ethical sourcing and great coffee aren't mutually exclusive. The conscience of California coffee.",
    "strengths": [
      "B Corp certified",
      "Exceptional ethics",
      "Fair pricing",
      "Women-owned"
    ],
    "weaknesses": [
      "Bay Area only",
      "Cafés are functional not beautiful"
    ],
    "signatureDrink": "Ethiopia Worka Sakaro pour-over",
    "priceRange": "$14-24/bag",
    "website": "https://equatorcoffees.com",
    "aggregate": 83,
    "tier": "A"
  },
  {
    "rank": 16,
    "id": "olympia-coffee",
    "name": "Olympia Coffee Roasting",
    "hq": "Olympia, WA",
    "locations": 4,
    "founded": 2005,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 9,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "B Corp roaster with exceptional ethics. Their natural Ethiopians are crowd-pleasers. Pacific Northwest's conscience.",
    "strengths": [
      "B Corp certified",
      "Excellent naturals",
      "Fair pricing",
      "Strong ethics"
    ],
    "weaknesses": [
      "Washington only",
      "Limited brand recognition"
    ],
    "signatureDrink": "Ardi Natural Ethiopia",
    "priceRange": "$15-24/bag",
    "website": "https://olympiacoffee.com",
    "aggregate": 81,
    "tier": "A"
  },
  {
    "rank": 17,
    "id": "ritual-coffee",
    "name": "Ritual Coffee Roasters",
    "hq": "San Francisco, CA",
    "locations": 4,
    "founded": 2005,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 7
    },
    "verdict": "San Francisco's OG specialty roaster. Their Guatemalans are classics. Still relevant after 20 years.",
    "strengths": [
      "SF institution",
      "Strong Guatemalan lots",
      "Multiple locations"
    ],
    "weaknesses": [
      "Resting on reputation",
      "Inconsistent across locations"
    ],
    "signatureDrink": "Guatemala Finca Rosma pour-over",
    "priceRange": "$16-26/bag",
    "website": "https://ritualroasters.com",
    "aggregate": 77,
    "tier": "A"
  },
  {
    "rank": 18,
    "id": "tandem-coffee",
    "name": "Tandem Coffee Roasters",
    "hq": "Portland, ME",
    "locations": 2,
    "founded": 2012,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 8
    },
    "verdict": "Portland, Maine's finest. Washed Ethiopians that are textbook. Also makes incredible pastries.",
    "strengths": [
      "Exceptional washed coffees",
      "Amazing pastries",
      "Cozy cafés",
      "Fair pricing"
    ],
    "weaknesses": [
      "Maine only",
      "Small operation"
    ],
    "signatureDrink": "Ethiopia Yirgacheffe Washed pour-over",
    "priceRange": "$15-24/bag",
    "website": "https://tandemcoffee.com",
    "aggregate": 83,
    "tier": "A"
  },
  {
    "rank": 19,
    "id": "brandywine",
    "name": "Brandywine Coffee Roasters",
    "hq": "Wilmington, DE",
    "locations": 1,
    "founded": 2013,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 9,
      "sourcingEthics": 8,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "Delaware's best-kept secret. Natural Ethiopians that rival anyone. Possibly the best value in specialty coffee.",
    "strengths": [
      "Exceptional value",
      "Outstanding naturals",
      "Strong online presence"
    ],
    "weaknesses": [
      "Single location",
      "Limited brand recognition"
    ],
    "signatureDrink": "Ethiopia Guji Natural pour-over",
    "priceRange": "$14-24/bag",
    "website": "https://brandywinecoffeeroasters.com",
    "aggregate": 84,
    "tier": "A"
  },
  {
    "rank": 20,
    "id": "black-white",
    "name": "Black & White Coffee Roasters",
    "hq": "Wake Forest, NC",
    "locations": 2,
    "founded": 2015,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 8,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "Quietly becoming one of the best roasters in America. Their natural Ethiopians and espresso blends are exceptional.",
    "strengths": [
      "Competition-quality coffees",
      "Fair pricing",
      "Strong online"
    ],
    "weaknesses": [
      "Limited locations",
      "Low brand awareness"
    ],
    "signatureDrink": "The Natural Ethiopia pour-over",
    "priceRange": "$16-28/bag",
    "website": "https://www.blackwhiteroasters.com",
    "aggregate": 82,
    "tier": "A"
  },
  {
    "rank": 21,
    "id": "methodical",
    "name": "Methodical Coffee",
    "hq": "Greenville, SC",
    "locations": 3,
    "founded": 2015,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 8,
      "consistency": 7
    },
    "verdict": "The Southeast's most exciting roaster. Their El Paraíso lots are world-class. Greenville's coffee destination.",
    "strengths": [
      "Exceptional experimental lots",
      "Beautiful cafés",
      "Growing reputation"
    ],
    "weaknesses": [
      "Southeast only",
      "Experimental coffees aren't for everyone"
    ],
    "signatureDrink": "El Paraíso Lactic pour-over",
    "priceRange": "$17-35/bag",
    "website": "https://methodicalcoffee.com",
    "aggregate": 80,
    "tier": "A"
  },
  {
    "rank": 22,
    "id": "cat-and-cloud",
    "name": "Cat & Cloud Coffee",
    "hq": "Santa Cruz, CA",
    "locations": 3,
    "founded": 2016,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 7,
      "experience": 9,
      "consistency": 8
    },
    "verdict": "The most fun coffee company in America. Great blends, great vibes, great YouTube content. Coffee as community.",
    "strengths": [
      "Exceptional community",
      "Fun brand",
      "Great blends",
      "YouTube education"
    ],
    "weaknesses": [
      "Santa Cruz only",
      "Single origins are average"
    ],
    "signatureDrink": "Night Shift Blend",
    "priceRange": "$15-22/bag",
    "website": "https://catandcloud.com",
    "aggregate": 80,
    "tier": "A"
  },
  {
    "rank": 23,
    "id": "spyhouse",
    "name": "Spyhouse Coffee",
    "hq": "Minneapolis, MN",
    "locations": 6,
    "founded": 2000,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 7,
      "experience": 8,
      "consistency": 7
    },
    "verdict": "Minneapolis's flagship roaster. Natural Ethiopians that are crowd-pleasers. Best value in the Midwest.",
    "strengths": [
      "Great value",
      "Multiple locations",
      "Strong naturals",
      "Midwest institution"
    ],
    "weaknesses": [
      "Minnesota only",
      "Blends are average"
    ],
    "signatureDrink": "Ethiopia Worka Natural",
    "priceRange": "$14-22/bag",
    "website": "https://spyhousecoffee.com",
    "aggregate": 77,
    "tier": "A"
  },
  {
    "rank": 24,
    "id": "barista-parlor",
    "name": "Barista Parlor",
    "hq": "Nashville, TN",
    "locations": 4,
    "founded": 2011,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 6,
      "sourcingEthics": 7,
      "experience": 9,
      "consistency": 7
    },
    "verdict": "Nashville's coolest coffee shops. The experience is the product — motorcycle-themed, industrial-chic, Instagram-ready.",
    "strengths": [
      "Stunning café design",
      "Nashville institution",
      "Great vibes"
    ],
    "weaknesses": [
      "Style over substance",
      "Overpriced",
      "Coffee is good not great"
    ],
    "signatureDrink": "Golden Sound Blend",
    "priceRange": "$16-24/bag",
    "website": "https://baristaparlor.com",
    "aggregate": 71,
    "tier": "B"
  },
  {
    "rank": 25,
    "id": "huckleberry",
    "name": "Huckleberry Roasters",
    "hq": "Denver, CO",
    "locations": 2,
    "founded": 2011,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 8,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "Denver's best roaster. Their Guatemalan lots are exceptional. Solid across the board without being flashy.",
    "strengths": [
      "Excellent Guatemalans",
      "Fair pricing",
      "Consistent quality"
    ],
    "weaknesses": [
      "Denver only",
      "Low brand recognition"
    ],
    "signatureDrink": "Guatemala El Injerto pour-over",
    "priceRange": "$15-25/bag",
    "website": "https://huckleberryroasters.com",
    "aggregate": 78,
    "tier": "A"
  },
  {
    "rank": 26,
    "id": "sightglass",
    "name": "Sightglass Coffee",
    "hq": "San Francisco, CA",
    "locations": 3,
    "founded": 2009,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 6,
      "sourcingEthics": 7,
      "experience": 9,
      "consistency": 7
    },
    "verdict": "San Francisco's most beautiful roastery. The SOMA location is a cathedral of coffee. Quality is good, not transcendent.",
    "strengths": [
      "Stunning roastery",
      "Great experience",
      "SF institution"
    ],
    "weaknesses": [
      "Overpriced for quality",
      "Style over substance"
    ],
    "signatureDrink": "Banner Dark Blend",
    "priceRange": "$16-26/bag",
    "website": "https://sightglasscoffee.com",
    "aggregate": 71,
    "tier": "B"
  },
  {
    "rank": 27,
    "id": "joe-coffee",
    "name": "Joe Coffee Company",
    "hq": "New York, NY",
    "locations": 15,
    "founded": 2003,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "New York's neighborhood roaster. Not trying to be the best — trying to be your local. And succeeding.",
    "strengths": [
      "Many NYC locations",
      "Consistent",
      "Approachable",
      "Good value"
    ],
    "weaknesses": [
      "Not exceptional",
      "Generic feel at some locations"
    ],
    "signatureDrink": "The Daily Blend",
    "priceRange": "$15-22/bag",
    "website": "https://joecoffeecompany.com",
    "aggregate": 70,
    "tier": "B"
  },
  {
    "rank": 28,
    "id": "cafe-grumpy",
    "name": "Café Grumpy",
    "hq": "New York, NY",
    "locations": 8,
    "founded": 2005,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "Got famous from Girls, but the coffee was good before HBO. Solid NYC chain that doesn't try too hard.",
    "strengths": [
      "Multiple NYC locations",
      "Consistent quality",
      "Good espresso"
    ],
    "weaknesses": [
      "Riding TV fame",
      "Not exceptional"
    ],
    "signatureDrink": "Heartbreaker Espresso",
    "priceRange": "$16-22/bag",
    "website": "https://cafegrumpy.com",
    "aggregate": 70,
    "tier": "B"
  },
  {
    "rank": 29,
    "id": "parlor-coffee",
    "name": "Parlor Coffee",
    "hq": "Brooklyn, NY",
    "locations": 1,
    "founded": 2012,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "Brooklyn's roaster for people who've outgrown Brooklyn roasters. Precise, clean, no-nonsense.",
    "strengths": [
      "Clean roasting",
      "Strong naturals",
      "No pretension"
    ],
    "weaknesses": [
      "Single location",
      "Limited availability"
    ],
    "signatureDrink": "Ethiopia Worka Natural",
    "priceRange": "$17-26/bag",
    "website": "https://parlorcoffee.com",
    "aggregate": 76,
    "tier": "A"
  },
  {
    "rank": 30,
    "id": "cuvee-coffee",
    "name": "Cuvée Coffee",
    "hq": "Austin, TX",
    "locations": 2,
    "founded": 1998,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "Austin's pioneer. Invented nitro cold brew on draft. The coffee is solid, the innovation is real.",
    "strengths": [
      "Nitro cold brew pioneer",
      "Austin institution",
      "Innovative"
    ],
    "weaknesses": [
      "Texas only",
      "Coffee quality is good not great"
    ],
    "signatureDrink": "Black & Blue Espresso",
    "priceRange": "$15-22/bag",
    "website": "https://cuveecoffee.com",
    "aggregate": 70,
    "tier": "B"
  },
  {
    "rank": 31,
    "id": "la-colombe",
    "name": "La Colombe Coffee Roasters",
    "hq": "Philadelphia, PA",
    "locations": 30,
    "founded": 1994,
    "type": "premium",
    "scores": {
      "coffeeQuality": 7,
      "value": 6,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "Draft Latte in a can changed the game. The cafés are good. The coffee is fine. Growing fast, quality is stretching.",
    "strengths": [
      "Draft Latte innovation",
      "Wide availability",
      "Good cafés"
    ],
    "weaknesses": [
      "Quality stretching with growth",
      "Inconsistent across locations"
    ],
    "signatureDrink": "Draft Latte (can)",
    "priceRange": "$14-22/bag",
    "website": "https://lacolombe.com",
    "aggregate": 67,
    "tier": "B"
  },
  {
    "rank": 32,
    "id": "peets",
    "name": "Peet's Coffee",
    "hq": "Emeryville, CA",
    "locations": 200,
    "founded": 1966,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "The godfather of dark roast. Alfred Peet taught the Starbucks founders. Now a corporate chain that over-roasts everything.",
    "strengths": [
      "Historical significance",
      "Wide availability",
      "Consistent"
    ],
    "weaknesses": [
      "Over-roasts everything",
      "Corporate feel",
      "Stuck in the past"
    ],
    "signatureDrink": "Major Dickason's Blend",
    "priceRange": "$12-18/bag",
    "website": "https://peets.com",
    "aggregate": 61,
    "tier": "B"
  },
  {
    "rank": 33,
    "id": "philz",
    "name": "Philz Coffee",
    "hq": "San Francisco, CA",
    "locations": 70,
    "founded": 2003,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 6,
      "sourcingEthics": 5,
      "experience": 8,
      "consistency": 6
    },
    "verdict": "The anti-espresso bar. Every cup is hand-poured and customized. The experience is great. The coffee is mediocre.",
    "strengths": [
      "Unique experience",
      "Customization",
      "Loyal following",
      "Fun vibes"
    ],
    "weaknesses": [
      "Coffee quality is average",
      "Pre-blended with cream/sugar",
      "No transparency"
    ],
    "signatureDrink": "Mint Mojito Iced Coffee",
    "priceRange": "$5-7/cup",
    "website": "https://philzcoffee.com",
    "aggregate": 58,
    "tier": "B"
  },
  {
    "rank": 34,
    "id": "caribou",
    "name": "Caribou Coffee",
    "hq": "Minneapolis, MN",
    "locations": 400,
    "founded": 1992,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 6,
      "sourcingEthics": 5,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "The Midwest's Starbucks alternative. Slightly better coffee, slightly better vibes. Still a chain.",
    "strengths": [
      "Midwest presence",
      "Better than Starbucks",
      "Consistent"
    ],
    "weaknesses": [
      "Generic chain feel",
      "Average coffee",
      "No transparency"
    ],
    "signatureDrink": "Caribou Blend",
    "priceRange": "$10-16/bag",
    "website": "https://cariboucoffee.com",
    "aggregate": 56,
    "tier": "C"
  },
  {
    "rank": 35,
    "id": "dutch-bros",
    "name": "Dutch Bros Coffee",
    "hq": "Grants Pass, OR",
    "locations": 900,
    "founded": 1992,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 6,
      "sourcingEthics": 3,
      "experience": 8,
      "consistency": 7
    },
    "verdict": "The In-N-Out of coffee. The experience is the product — friendly baristas, drive-through speed, sugar bombs. The coffee itself is an afterthought.",
    "strengths": [
      "Exceptional service",
      "Fun culture",
      "Fast",
      "Loyal following"
    ],
    "weaknesses": [
      "Coffee is terrible",
      "Sugar-forward drinks",
      "Zero transparency",
      "Not really coffee"
    ],
    "signatureDrink": "Annihilator (sugar bomb)",
    "priceRange": "$4-7/drink",
    "website": "https://dutchbros.com",
    "aggregate": 49,
    "tier": "C"
  },
  {
    "rank": 36,
    "id": "gregorys",
    "name": "Gregorys Coffee",
    "hq": "New York, NY",
    "locations": 35,
    "founded": 2006,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 7,
      "sourcingEthics": 5,
      "experience": 6,
      "consistency": 6
    },
    "verdict": "NYC's fastest-growing chain. Better than Starbucks, cheaper than specialty. The commuter's choice.",
    "strengths": [
      "NYC convenience",
      "Fair pricing",
      "Better than Starbucks"
    ],
    "weaknesses": [
      "Generic",
      "No transparency",
      "Growing too fast"
    ],
    "signatureDrink": "Cold Brew",
    "priceRange": "$4-6/drink",
    "website": "https://gregoryscoffee.com",
    "aggregate": 61,
    "tier": "B"
  },
  {
    "rank": 37,
    "id": "birch-coffee",
    "name": "Birch Coffee",
    "hq": "New York, NY",
    "locations": 10,
    "founded": 2009,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 7,
      "sourcingEthics": 6,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "NYC's coziest chain. The cafés feel like living rooms. The coffee is decent. The vibes are the real product.",
    "strengths": [
      "Cozy cafés",
      "Good vibes",
      "Fair pricing"
    ],
    "weaknesses": [
      "Average coffee",
      "NYC only"
    ],
    "signatureDrink": "Latte",
    "priceRange": "$4-6/drink",
    "website": "https://birchcoffee.com",
    "aggregate": 64,
    "tier": "B"
  },
  {
    "rank": 38,
    "id": "blank-street",
    "name": "Blank Street Coffee",
    "hq": "New York, NY",
    "locations": 50,
    "founded": 2020,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 8,
      "sourcingEthics": 4,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "The VC-funded disruptor. Tiny kiosks, robot-assisted, cheaper than everyone. The coffee is fine. The model is interesting.",
    "strengths": [
      "Cheapest specialty-adjacent",
      "Convenient locations",
      "Fast"
    ],
    "weaknesses": [
      "VC-funded growth model",
      "Average coffee",
      "No soul"
    ],
    "signatureDrink": "Matcha Latte",
    "priceRange": "$3-5/drink",
    "website": "https://blankstreet.com",
    "aggregate": 59,
    "tier": "B"
  },
  {
    "rank": 39,
    "id": "alfred",
    "name": "Alfred Coffee",
    "hq": "Los Angeles, CA",
    "locations": 10,
    "founded": 2013,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 4,
      "sourcingEthics": 4,
      "experience": 9,
      "consistency": 6
    },
    "verdict": "LA's most Instagrammable coffee. 'But First, Coffee' is the brand. The experience is the product. The coffee is forgettable.",
    "strengths": [
      "Instagram-perfect",
      "Celebrity clientele",
      "Great design"
    ],
    "weaknesses": [
      "Overpriced",
      "Style over substance",
      "Average coffee"
    ],
    "signatureDrink": "Iced Vanilla Latte",
    "priceRange": "$6-9/drink",
    "website": "https://alfred.la",
    "aggregate": 53,
    "tier": "C"
  },
  {
    "rank": 40,
    "id": "trade-coffee",
    "name": "Trade Coffee (subscription)",
    "hq": "New York, NY",
    "locations": 0,
    "founded": 2018,
    "type": "premium",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 6,
      "experience": 6,
      "consistency": 5
    },
    "verdict": "Subscription aggregator partnering with 400+ roasters. Good for discovery. Algorithm tends toward safe picks.",
    "strengths": [
      "Huge roaster network",
      "Good discovery tool",
      "Convenient"
    ],
    "weaknesses": [
      "Inconsistent quality",
      "Algorithm plays it safe",
      "Middleman markup"
    ],
    "signatureDrink": "Varies by subscription",
    "priceRange": "$13-22/bag",
    "website": "https://trade.coffee",
    "aggregate": 65,
    "tier": "B"
  },
  {
    "rank": 41,
    "id": "starbucks",
    "name": "Starbucks",
    "hq": "Seattle, WA",
    "locations": 35000,
    "founded": 1971,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 3,
      "sourcingEthics": 5,
      "experience": 6,
      "consistency": 8
    },
    "verdict": "The world's largest coffee chain. Buys more specialty-grade coffee than anyone and roasts it all to charcoal. Consistent mediocrity at premium prices.",
    "strengths": [
      "Ubiquitous",
      "Consistent globally",
      "Good benefits for employees",
      "Mobile ordering"
    ],
    "weaknesses": [
      "Over-roasts everything",
      "Overpriced",
      "Destroyed the word 'specialty'"
    ],
    "signatureDrink": "Pike Place Roast",
    "priceRange": "$10-16/bag",
    "website": "https://starbucks.com",
    "aggregate": 47,
    "tier": "C"
  },
  {
    "rank": 42,
    "id": "panera-bread",
    "name": "Panera Bread Coffee",
    "hq": "St. Louis, MO",
    "locations": 2100,
    "founded": 1987,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 7,
      "sourcingEthics": 4,
      "experience": 5,
      "consistency": 7
    },
    "verdict": "Unlimited coffee subscription for $12/month. The coffee is mediocre but the value proposition is real.",
    "strengths": [
      "Unlimited subscription",
      "Convenient",
      "Decent value"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Not a coffee company"
    ],
    "signatureDrink": "Dark Roast (unlimited)",
    "priceRange": "$12/month unlimited",
    "website": "https://panerabread.com",
    "aggregate": 52,
    "tier": "C"
  },
  {
    "rank": 43,
    "id": "dunkin",
    "name": "Dunkin'",
    "hq": "Canton, MA",
    "locations": 12500,
    "founded": 1950,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 7,
      "sourcingEthics": 3,
      "experience": 4,
      "consistency": 7
    },
    "verdict": "America runs on Dunkin'. The coffee is mild, forgettable, and cheap. It's not good by any standard, but it's honest about what it is.",
    "strengths": [
      "Cheap",
      "Fast",
      "Everywhere",
      "Honest about what it is"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Zero transparency",
      "Ugly stores"
    ],
    "signatureDrink": "Original Blend Medium",
    "priceRange": "$8-12/bag",
    "website": "https://dunkinathome.com",
    "aggregate": 49,
    "tier": "C"
  },
  {
    "rank": 44,
    "id": "tim-hortons",
    "name": "Tim Hortons",
    "hq": "Toronto, Canada",
    "locations": 5600,
    "founded": 1964,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 6,
      "sourcingEthics": 3,
      "experience": 4,
      "consistency": 6
    },
    "verdict": "Canada's national coffee chain. Canadians defend it with patriotic fervor. The coffee is unremarkable.",
    "strengths": [
      "Canadian institution",
      "Cheap",
      "Convenient"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Declining quality",
      "Zero transparency"
    ],
    "signatureDrink": "Original Blend Double-Double",
    "priceRange": "$8-12/bag",
    "website": "https://timhortons.com",
    "aggregate": 42,
    "tier": "D"
  },
  {
    "rank": 45,
    "id": "wawa",
    "name": "Wawa Coffee",
    "hq": "Wawa, PA",
    "locations": 1000,
    "founded": 1964,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 8,
      "sourcingEthics": 3,
      "experience": 5,
      "consistency": 7
    },
    "verdict": "The best gas station coffee in America. That's a low bar, but Wawa clears it. Fresh, cheap, and available 24/7.",
    "strengths": [
      "Best convenience store coffee",
      "Cheap",
      "Always fresh",
      "24/7"
    ],
    "weaknesses": [
      "It's gas station coffee",
      "Zero transparency"
    ],
    "signatureDrink": "Regular Coffee",
    "priceRange": "$2-4/cup",
    "website": "https://wawa.com",
    "aggregate": 53,
    "tier": "C"
  },
  {
    "rank": 46,
    "id": "mcdonalds",
    "name": "McDonald's (McCafé)",
    "hq": "Chicago, IL",
    "locations": 40000,
    "founded": 1955,
    "type": "fast-food",
    "scores": {
      "coffeeQuality": 4,
      "value": 9,
      "sourcingEthics": 4,
      "experience": 3,
      "consistency": 8
    },
    "verdict": "Dirty secret: McDonald's coffee is better than Starbucks drip. 100% Arabica, medium roast, $1 for a large. The best value in fast food coffee.",
    "strengths": [
      "Best value anywhere",
      "100% Arabica",
      "Consistent",
      "Better than Starbucks"
    ],
    "weaknesses": [
      "It's McDonald's",
      "Zero transparency",
      "Terrible experience"
    ],
    "signatureDrink": "Premium Roast Coffee",
    "priceRange": "$1-3/cup",
    "website": "https://mcdonalds.com",
    "aggregate": 55,
    "tier": "C"
  },
  {
    "rank": 47,
    "id": "seven-eleven",
    "name": "7-Eleven Coffee",
    "hq": "Dallas, TX",
    "locations": 13000,
    "founded": 1927,
    "type": "fast-food",
    "scores": {
      "coffeeQuality": 3,
      "value": 8,
      "sourcingEthics": 2,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "The original convenience store coffee. Cheap, available, and exactly what you'd expect from a gas station.",
    "strengths": [
      "Cheap",
      "Everywhere",
      "24/7"
    ],
    "weaknesses": [
      "Gas station quality",
      "Stale",
      "Zero transparency"
    ],
    "signatureDrink": "Big Gulp Coffee",
    "priceRange": "$1-3/cup",
    "website": "https://7-eleven.com",
    "aggregate": 44,
    "tier": "C"
  },
  {
    "rank": 48,
    "id": "black-rifle",
    "name": "Black Rifle Coffee Company",
    "hq": "Salt Lake City, UT",
    "locations": 30,
    "founded": 2014,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 4,
      "sourcingEthics": 4,
      "experience": 5,
      "consistency": 6
    },
    "verdict": "A culture brand that happens to sell coffee. The marketing is about identity, not quality. The coffee is over-roasted and overpriced.",
    "strengths": [
      "Strong brand identity",
      "Veteran-owned",
      "Loyal following"
    ],
    "weaknesses": [
      "Over-roasted",
      "Overpriced",
      "Culture over quality"
    ],
    "signatureDrink": "Beyond Black Dark Roast",
    "priceRange": "$14-18/bag",
    "website": "https://blackriflecoffee.com",
    "aggregate": 44,
    "tier": "C"
  },
  {
    "rank": 49,
    "id": "scooters",
    "name": "Scooter's Coffee",
    "hq": "Omaha, NE",
    "locations": 700,
    "founded": 1998,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 5,
      "sourcingEthics": 3,
      "experience": 5,
      "consistency": 6
    },
    "verdict": "Midwest drive-through chain. Fast, friendly, forgettable. The coffee is a vehicle for sugar and milk.",
    "strengths": [
      "Fast drive-through",
      "Friendly service",
      "Growing fast"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Sugar-forward",
      "No transparency"
    ],
    "signatureDrink": "Caramelicious",
    "priceRange": "$4-6/drink",
    "website": "https://scooterscoffee.com",
    "aggregate": 41,
    "tier": "D"
  },
  {
    "rank": 50,
    "id": "biggby",
    "name": "Biggby Coffee",
    "hq": "East Lansing, MI",
    "locations": 350,
    "founded": 1995,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 6,
      "sourcingEthics": 3,
      "experience": 5,
      "consistency": 6
    },
    "verdict": "Michigan's drive-through chain. Friendly, cheap, and the coffee is an afterthought to the flavored drinks.",
    "strengths": [
      "Friendly",
      "Cheap",
      "Midwest presence"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Flavored drink focus"
    ],
    "signatureDrink": "Butter Bear Latte",
    "priceRange": "$4-6/drink",
    "website": "https://biggby.com",
    "aggregate": 44,
    "tier": "C"
  },
  {
    "rank": 51,
    "id": "saxbys",
    "name": "Saxbys",
    "hq": "Philadelphia, PA",
    "locations": 15,
    "founded": 2005,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "Philadelphia chain with a social mission — student-run locations at universities. Coffee is decent, mission is admirable.",
    "strengths": [
      "Social mission",
      "Student employment"
    ],
    "weaknesses": [
      "Average coffee"
    ],
    "priceRange": "$4-6/drink",
    "website": "https://saxbys.com",
    "aggregate": 62,
    "tier": "B"
  },
  {
    "rank": 52,
    "id": "compass-coffee",
    "name": "Compass Coffee",
    "hq": "Washington, DC",
    "locations": 15,
    "founded": 2014,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 7,
      "sourcingEthics": 5,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "DC's homegrown chain. Better than Starbucks, cheaper than specialty. The capital's daily driver.",
    "strengths": [
      "DC presence",
      "Fair pricing",
      "Good vibes"
    ],
    "weaknesses": [
      "Average coffee",
      "No transparency"
    ],
    "priceRange": "$14-18/bag",
    "website": "https://compasscoffee.com",
    "aggregate": 62,
    "tier": "B"
  },
  {
    "rank": 53,
    "id": "james-coffee",
    "name": "James Coffee Co.",
    "hq": "San Diego, CA",
    "locations": 3,
    "founded": 2014,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "San Diego's best roaster. Natural Ethiopians that bring California sunshine. Solid across the board.",
    "strengths": [
      "Good naturals",
      "San Diego presence"
    ],
    "weaknesses": [
      "Limited locations"
    ],
    "priceRange": "$16-24/bag",
    "website": "https://jamescoffeeco.com",
    "aggregate": 73,
    "tier": "A"
  },
  {
    "rank": 54,
    "id": "switchback",
    "name": "Switchback Coffee Roasters",
    "hq": "Colorado Springs, CO",
    "locations": 2,
    "founded": 2011,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "Colorado Springs' best. Rwandan lots that are elegant. Proof great coffee exists outside big cities.",
    "strengths": [
      "Excellent Rwandans",
      "Fair pricing"
    ],
    "weaknesses": [
      "Small market"
    ],
    "priceRange": "$14-22/bag",
    "website": "https://switchbackroasters.com",
    "aggregate": 76,
    "tier": "A"
  },
  {
    "rank": 55,
    "id": "ghost-town",
    "name": "Ghost Town Coffee Roasters",
    "hq": "Bozeman, MT",
    "locations": 1,
    "founded": 2015,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 7
    },
    "verdict": "Montana's most exciting roaster. Pink Bourbon naturals that rival anyone. The mountain west's hidden gem.",
    "strengths": [
      "Exciting coffees",
      "Unique location"
    ],
    "weaknesses": [
      "Single location",
      "Remote"
    ],
    "priceRange": "$16-28/bag",
    "website": "https://ghosttowncoffee.com",
    "aggregate": 73,
    "tier": "A"
  },
  {
    "rank": 56,
    "id": "klatch",
    "name": "Klatch Coffee",
    "hq": "Rancho Cucamonga, CA",
    "locations": 3,
    "founded": 1993,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "World Barista Championship supplier. Their espresso blends are competition-grade. SoCal's quiet champion.",
    "strengths": [
      "Competition-grade",
      "Strong espresso"
    ],
    "weaknesses": [
      "Limited locations",
      "Low profile"
    ],
    "priceRange": "$16-24/bag",
    "website": "https://klatchcoffee.com",
    "aggregate": 72,
    "tier": "A"
  },
  {
    "rank": 57,
    "id": "eiland",
    "name": "Eiland Coffee Roasters",
    "hq": "Tyler, TX",
    "locations": 1,
    "founded": 2016,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "Texas's best light roaster. Pink Bourbon honeys that are stunning. The South's most underrated roaster.",
    "strengths": [
      "Excellent light roasts",
      "Great Pink Bourbons"
    ],
    "weaknesses": [
      "Single location",
      "Low awareness"
    ],
    "priceRange": "$16-26/bag",
    "website": "https://eilandcoffee.com",
    "aggregate": 72,
    "tier": "A"
  },
  {
    "rank": 58,
    "id": "little-wolf",
    "name": "Little Wolf Coffee",
    "hq": "Ipswich, MA",
    "locations": 1,
    "founded": 2017,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "One of the most underrated roasters in America. Guatemalan Geshas that rival Panama at half the price.",
    "strengths": [
      "Exceptional Geshas",
      "Great value"
    ],
    "weaknesses": [
      "Single location",
      "Unknown"
    ],
    "priceRange": "$16-35/bag",
    "website": "https://littlewolfcoffee.com",
    "aggregate": 74,
    "tier": "A"
  },
  {
    "rank": 59,
    "id": "vibrant",
    "name": "Vibrant Coffee Roasters",
    "hq": "Philadelphia, PA",
    "locations": 1,
    "founded": 2018,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 8,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "Philadelphia's most exciting young roaster. Guji naturals that are fruit bombs. One to watch.",
    "strengths": [
      "Exciting naturals",
      "Great value"
    ],
    "weaknesses": [
      "Single location",
      "New"
    ],
    "priceRange": "$15-24/bag",
    "website": "https://vibrantcoffeeroasters.com",
    "aggregate": 74,
    "tier": "A"
  },
  {
    "rank": 60,
    "id": "wrecking-ball",
    "name": "Wrecking Ball Coffee Roasters",
    "hq": "San Francisco, CA",
    "locations": 1,
    "founded": 2011,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "SF's Pacamara specialist. El Salvador lots that are complex and creamy. The connoisseur's choice.",
    "strengths": [
      "Excellent Pacamaras",
      "Complex coffees"
    ],
    "weaknesses": [
      "Single location",
      "Niche"
    ],
    "priceRange": "$17-28/bag",
    "website": "https://wreckingballcoffee.com",
    "aggregate": 72,
    "tier": "A"
  },
  {
    "rank": 61,
    "id": "green-mountain",
    "name": "Green Mountain (Keurig)",
    "hq": "Waterbury, VT",
    "locations": 0,
    "founded": 1981,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 3,
      "sourcingEthics": 4,
      "experience": 2,
      "consistency": 6
    },
    "verdict": "K-Cups are the single greatest environmental and gustatory crime in coffee history. $40/lb for stale coffee in plastic pods.",
    "strengths": [
      "Convenient",
      "Ubiquitous"
    ],
    "weaknesses": [
      "Terrible coffee",
      "Environmental disaster",
      "Overpriced"
    ],
    "priceRange": "$10-14/box",
    "website": "https://keurig.com",
    "aggregate": 34,
    "tier": "D"
  },
  {
    "rank": 62,
    "id": "nespresso",
    "name": "Nespresso",
    "hq": "Lausanne, Switzerland",
    "locations": 800,
    "founded": 1986,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 3,
      "sourcingEthics": 5,
      "experience": 7,
      "consistency": 8
    },
    "verdict": "George Clooney's coffee. Beautiful machines, aluminum pods, mediocre espresso. The luxury brand of average coffee.",
    "strengths": [
      "Beautiful design",
      "Consistent",
      "Recycling program"
    ],
    "weaknesses": [
      "Overpriced",
      "Average coffee",
      "Pod waste"
    ],
    "priceRange": "$0.75-1.50/pod",
    "website": "https://nespresso.com",
    "aggregate": 51,
    "tier": "C"
  },
  {
    "rank": 63,
    "id": "illy",
    "name": "illy",
    "hq": "Trieste, Italy",
    "locations": 0,
    "founded": 1933,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 4,
      "sourcingEthics": 6,
      "experience": 5,
      "consistency": 8
    },
    "verdict": "Italy's premium export. Single-blend philosophy — one blend, roasted perfectly. Consistent but one-dimensional.",
    "strengths": [
      "Consistent globally",
      "Quality control",
      "Italian heritage"
    ],
    "weaknesses": [
      "One-dimensional",
      "Overpriced",
      "No variety"
    ],
    "priceRange": "$12-18/can",
    "website": "https://illy.com",
    "aggregate": 56,
    "tier": "C"
  },
  {
    "rank": 64,
    "id": "lavazza",
    "name": "Lavazza",
    "hq": "Turin, Italy",
    "locations": 0,
    "founded": 1895,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 5,
      "sourcingEthics": 4,
      "experience": 4,
      "consistency": 7
    },
    "verdict": "Italy's largest coffee company. Super Crema is everywhere. The coffee is unremarkable — hazelnut, cream, woody bitterness.",
    "strengths": [
      "Wide availability",
      "Italian heritage",
      "Consistent"
    ],
    "weaknesses": [
      "Average quality",
      "Robusta blends",
      "No transparency"
    ],
    "priceRange": "$10-18/bag",
    "website": "https://lavazza.com",
    "aggregate": 46,
    "tier": "C"
  },
  {
    "rank": 65,
    "id": "bulletproof",
    "name": "Bulletproof Coffee",
    "hq": "Seattle, WA",
    "locations": 0,
    "founded": 2013,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 3,
      "sourcingEthics": 4,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "Built an empire on mycotoxin fear. The science is dubious. The coffee is average. The marketing is genius.",
    "strengths": [
      "Strong brand",
      "Health positioning"
    ],
    "weaknesses": [
      "Dubious science",
      "Overpriced",
      "Average coffee"
    ],
    "priceRange": "$15-22/bag",
    "website": "https://bulletproof.com",
    "aggregate": 41,
    "tier": "D"
  },
  {
    "rank": 66,
    "id": "death-wish",
    "name": "Death Wish Coffee",
    "hq": "Saratoga Springs, NY",
    "locations": 0,
    "founded": 2012,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 4,
      "sourcingEthics": 3,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "Markets itself as 'the world's strongest coffee.' Uses Robusta for caffeine, roasts to charcoal. If you want caffeine, take a pill.",
    "strengths": [
      "Strong brand",
      "Caffeine content"
    ],
    "weaknesses": [
      "Terrible flavor",
      "Robusta",
      "Over-roasted"
    ],
    "priceRange": "$16-20/bag",
    "website": "https://deathwishcoffee.com",
    "aggregate": 36,
    "tier": "D"
  },
  {
    "rank": 67,
    "id": "bones-coffee",
    "name": "Bones Coffee Company",
    "hq": "Deerfield Beach, FL",
    "locations": 0,
    "founded": 2012,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 2,
      "value": 3,
      "sourcingEthics": 2,
      "experience": 3,
      "consistency": 5
    },
    "verdict": "Flavored coffee to mask low-quality beans. Artificial cinnamon and vanilla extract over commodity coffee. The industry's dirty secret.",
    "strengths": [
      "Fun branding",
      "Variety"
    ],
    "weaknesses": [
      "Artificial flavoring",
      "Low quality base",
      "No transparency"
    ],
    "priceRange": "$14-18/bag",
    "website": "https://bonescoffee.com",
    "aggregate": 27,
    "tier": "F"
  },
  {
    "rank": 68,
    "id": "community-coffee",
    "name": "Community Coffee",
    "hq": "Baton Rouge, LA",
    "locations": 0,
    "founded": 1919,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 6,
      "sourcingEthics": 3,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "Louisiana's largest coffee brand. Regional institution. The coffee is perfectly adequate — mild, smooth, forgettable.",
    "strengths": [
      "Regional loyalty",
      "Cheap",
      "Long history"
    ],
    "weaknesses": [
      "Average coffee",
      "No transparency"
    ],
    "priceRange": "$7-10/bag",
    "website": "https://communitycoffee.com",
    "aggregate": 44,
    "tier": "C"
  },
  {
    "rank": 69,
    "id": "eight-oclock",
    "name": "Eight O'Clock Coffee",
    "hq": "Montvale, NJ",
    "locations": 0,
    "founded": 1859,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 6,
      "sourcingEthics": 2,
      "experience": 2,
      "consistency": 5
    },
    "verdict": "Your grandparents' coffee. Now owned by Tata. Mass-produced commodity with zero transparency. At $5/lb, you get what you pay for.",
    "strengths": [
      "Cheap",
      "Long history"
    ],
    "weaknesses": [
      "Commodity quality",
      "No transparency",
      "Stale"
    ],
    "priceRange": "$5-8/bag",
    "website": "https://eightoclock.com",
    "aggregate": 36,
    "tier": "D"
  },
  {
    "rank": 70,
    "id": "chock-full",
    "name": "Chock Full o'Nuts",
    "hq": "New York, NY",
    "locations": 0,
    "founded": 1926,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 5,
      "sourcingEthics": 2,
      "experience": 2,
      "consistency": 5
    },
    "verdict": "NYC institution turned commodity brand. The name is misleading — there are no nuts. The coffee is forgettable.",
    "strengths": [
      "NYC nostalgia",
      "Cheap"
    ],
    "weaknesses": [
      "Commodity quality",
      "Misleading name",
      "Stale"
    ],
    "priceRange": "$6-9/bag",
    "website": "https://chockfullonuts.com",
    "aggregate": 34,
    "tier": "D"
  },
  {
    "rank": 71,
    "id": "jot",
    "name": "Jot Coffee",
    "hq": "San Francisco, CA",
    "locations": 0,
    "founded": 2018,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 4,
      "sourcingEthics": 4,
      "experience": 4,
      "consistency": 7
    },
    "verdict": "Coffee concentrate — one tablespoon makes a cup. Convenient but one-dimensional. Strength over flavor.",
    "strengths": [
      "Convenient",
      "Consistent"
    ],
    "weaknesses": [
      "One-dimensional",
      "Overpriced"
    ],
    "priceRange": "$20-28/bottle",
    "website": "https://jot.co",
    "aggregate": 46,
    "tier": "C"
  },
  {
    "rank": 72,
    "id": "chameleon",
    "name": "Chameleon Cold-Brew",
    "hq": "Austin, TX",
    "locations": 0,
    "founded": 2010,
    "type": "premium",
    "scores": {
      "coffeeQuality": 5,
      "value": 6,
      "sourcingEthics": 5,
      "experience": 4,
      "consistency": 7
    },
    "verdict": "Organic cold brew in grocery stores. Decent quality, fair price. Now owned by Nestlé.",
    "strengths": [
      "Organic",
      "Wide availability",
      "Decent cold brew"
    ],
    "weaknesses": [
      "Nestlé owned",
      "Limited range"
    ],
    "priceRange": "$8-12/bottle",
    "website": "https://chameleoncoldbrew.com",
    "aggregate": 53,
    "tier": "C"
  },
  {
    "rank": 73,
    "id": "stok",
    "name": "STōK Cold Brew",
    "hq": "Denver, CO",
    "locations": 0,
    "founded": 2015,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 7,
      "sourcingEthics": 3,
      "experience": 3,
      "consistency": 7
    },
    "verdict": "Grocery store cold brew. Cheap, consistent, and better than making bad hot coffee. The default cold brew for non-coffee people.",
    "strengths": [
      "Cheap",
      "Widely available",
      "Consistent"
    ],
    "weaknesses": [
      "Average quality",
      "No transparency"
    ],
    "priceRange": "$5-8/bottle",
    "website": "https://stok.com",
    "aggregate": 47,
    "tier": "C"
  },
  {
    "rank": 74,
    "id": "kicking-horse",
    "name": "Kicking Horse Coffee",
    "hq": "Invermere, BC",
    "locations": 0,
    "founded": 1996,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 5,
      "value": 5,
      "sourcingEthics": 5,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "Canadian organic roaster bought by Lavazza. Fair trade, organic, over-roasted. The labels don't make up for the roasting.",
    "strengths": [
      "Organic",
      "Fair trade"
    ],
    "weaknesses": [
      "Over-roasted",
      "Lavazza owned"
    ],
    "priceRange": "$12-16/bag",
    "website": "https://kickinghorsecoffee.com",
    "aggregate": 48,
    "tier": "C"
  },
  {
    "rank": 75,
    "id": "cafe-bustelo",
    "name": "Café Bustelo",
    "hq": "Miami, FL",
    "locations": 0,
    "founded": 1928,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 3,
      "value": 7,
      "sourcingEthics": 2,
      "experience": 3,
      "consistency": 6
    },
    "verdict": "Cultural icon with a cult following. Over-roasted commodity beans ground to dust. Best drowned in sugar and milk.",
    "strengths": [
      "Cultural significance",
      "Cheap",
      "Strong"
    ],
    "weaknesses": [
      "Over-roasted",
      "Robusta likely",
      "No transparency"
    ],
    "priceRange": "$5-8/can",
    "website": "https://cafebustelo.com",
    "aggregate": 41,
    "tier": "D"
  },
  {
    "rank": 76,
    "id": "folgers",
    "name": "Folgers",
    "hq": "Orrville, OH",
    "locations": 0,
    "founded": 1850,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 2,
      "value": 5,
      "sourcingEthics": 1,
      "experience": 1,
      "consistency": 6
    },
    "verdict": "#1 selling coffee in America. Pre-ground, months old, Robusta-blended, roasted to oblivion. A national tragedy.",
    "strengths": [
      "Cheap",
      "Ubiquitous"
    ],
    "weaknesses": [
      "Terrible quality",
      "Stale",
      "Zero transparency",
      "Robusta"
    ],
    "priceRange": "$6-10/can",
    "website": "https://folgers.com",
    "aggregate": 28,
    "tier": "F"
  },
  {
    "rank": 77,
    "id": "maxwell-house",
    "name": "Maxwell House",
    "hq": "Chicago, IL",
    "locations": 0,
    "founded": 1892,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 2,
      "value": 5,
      "sourcingEthics": 1,
      "experience": 1,
      "consistency": 5
    },
    "verdict": "'Good to the last drop' — we tested this claim. It is not good at any drop. Pre-ground commodity coffee.",
    "strengths": [
      "Cheap"
    ],
    "weaknesses": [
      "Terrible quality",
      "Stale",
      "Zero transparency"
    ],
    "priceRange": "$5-9/can",
    "website": "https://maxwellhouse.com",
    "aggregate": 27,
    "tier": "F"
  },
  {
    "rank": 78,
    "id": "nescafe",
    "name": "Nescafé",
    "hq": "Vevey, Switzerland",
    "locations": 0,
    "founded": 1938,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 1,
      "value": 4,
      "sourcingEthics": 2,
      "experience": 1,
      "consistency": 6
    },
    "verdict": "The world's most consumed coffee brand. Spray-dried instant from the cheapest beans on earth. Nestlé has done more damage to coffee culture than any single entity.",
    "strengths": [
      "Ubiquitous globally",
      "Cheap"
    ],
    "weaknesses": [
      "Terrible quality",
      "Instant",
      "Nestlé"
    ],
    "priceRange": "$6-12/jar",
    "website": "https://nescafe.com",
    "aggregate": 25,
    "tier": "F"
  },
  {
    "rank": 79,
    "id": "great-value",
    "name": "Great Value (Walmart)",
    "hq": "Bentonville, AR",
    "locations": 0,
    "founded": 1993,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 2,
      "value": 6,
      "sourcingEthics": 1,
      "experience": 1,
      "consistency": 5
    },
    "verdict": "Walmart's store brand. The cheapest coffee money can buy. You get exactly what you pay for: nothing.",
    "strengths": [
      "Cheapest possible"
    ],
    "weaknesses": [
      "Bottom-tier quality",
      "Zero transparency"
    ],
    "priceRange": "$4-7/can",
    "website": "https://walmart.com",
    "aggregate": 30,
    "tier": "D"
  },
  {
    "rank": 80,
    "id": "kirkland",
    "name": "Kirkland Signature (Costco)",
    "hq": "Issaquah, WA",
    "locations": 0,
    "founded": 1995,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 5,
      "value": 8,
      "sourcingEthics": 4,
      "experience": 3,
      "consistency": 7
    },
    "verdict": "Costco's store brand is secretly roasted by Starbucks. Better value than Starbucks retail. The best mass-market coffee by default.",
    "strengths": [
      "Great value",
      "Roasted by Starbucks",
      "Bulk pricing"
    ],
    "weaknesses": [
      "Still mass-market",
      "Limited variety"
    ],
    "priceRange": "$12-18/bag (3lb)",
    "website": "https://costco.com",
    "aggregate": 55,
    "tier": "C"
  },
  {
    "rank": 81,
    "id": "ruby-coffee",
    "name": "Ruby Coffee Roasters",
    "hq": "Nelsonville, WI",
    "locations": 1,
    "founded": 2014,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 7,
      "sourcingEthics": 8,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "Wisconsin's best roaster. Their El Paraíso lots are world-class. Rural location, global quality.",
    "strengths": [
      "Exceptional experimental lots",
      "Strong sourcing"
    ],
    "weaknesses": [
      "Remote location",
      "Limited availability"
    ],
    "priceRange": "$17-42/bag",
    "website": "https://rubycoffeeroasters.com",
    "aggregate": 77,
    "tier": "A"
  },
  {
    "rank": 82,
    "id": "dragonfly",
    "name": "Dragonfly Coffee Roasters",
    "hq": "Henderson, NV",
    "locations": 1,
    "founded": 2016,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "Nevada's best roaster. Yemeni lots that are archaeological treasures. The desert's hidden gem.",
    "strengths": [
      "Rare Yemeni coffees",
      "Unique offerings"
    ],
    "weaknesses": [
      "Single location",
      "Niche"
    ],
    "priceRange": "$18-65/bag",
    "website": "https://dragonflycoffeeroasters.com",
    "aggregate": 72,
    "tier": "A"
  },
  {
    "rank": 83,
    "id": "swift-cup",
    "name": "Swift Cup Coffee",
    "hq": "New York, NY",
    "locations": 0,
    "founded": 2016,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 5,
      "consistency": 7
    },
    "verdict": "Specialty instant coffee. Freeze-dried single origins that are shockingly good. The future of travel coffee.",
    "strengths": [
      "Best instant coffee",
      "Convenient",
      "Specialty grade"
    ],
    "weaknesses": [
      "Expensive per cup",
      "Limited range"
    ],
    "priceRange": "$15-20/pack",
    "website": "https://swiftcupcoffee.com",
    "aggregate": 63,
    "tier": "B"
  },
  {
    "rank": 84,
    "id": "copper-cow",
    "name": "Copper Cow Coffee",
    "hq": "Los Angeles, CA",
    "locations": 0,
    "founded": 2017,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 6,
      "consistency": 7
    },
    "verdict": "Vietnamese pour-over kits with condensed milk. Unique concept, decent execution. The best Vietnamese coffee outside Vietnam.",
    "strengths": [
      "Unique concept",
      "Vietnamese heritage",
      "Convenient"
    ],
    "weaknesses": [
      "Niche",
      "Limited range"
    ],
    "priceRange": "$12-16/pack",
    "website": "https://coppercowcoffee.com",
    "aggregate": 61,
    "tier": "B"
  },
  {
    "rank": 85,
    "id": "dripkit",
    "name": "Dripkit",
    "hq": "New York, NY",
    "locations": 0,
    "founded": 2017,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 5,
      "sourcingEthics": 5,
      "experience": 6,
      "consistency": 6
    },
    "verdict": "Single-serve pour-over kits. Convenient, decent quality, but expensive per cup. The camping coffee upgrade.",
    "strengths": [
      "Convenient",
      "No equipment needed"
    ],
    "weaknesses": [
      "Expensive per cup",
      "Average quality"
    ],
    "priceRange": "$15-20/pack",
    "website": "https://dripkit.coffee",
    "aggregate": 56,
    "tier": "C"
  },
  {
    "rank": 86,
    "id": "groundwork",
    "name": "Groundwork Coffee",
    "hq": "Los Angeles, CA",
    "locations": 5,
    "founded": 1990,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 6,
      "consistency": 6
    },
    "verdict": "LA's organic pioneer. Solid coffee, strong ethics, Venice Beach vibes. The original conscious coffee company.",
    "strengths": [
      "Organic pioneer",
      "LA institution",
      "Good ethics"
    ],
    "weaknesses": [
      "Average quality",
      "Dated feel"
    ],
    "priceRange": "$14-20/bag",
    "website": "https://groundworkcoffee.com",
    "aggregate": 68,
    "tier": "B"
  },
  {
    "rank": 87,
    "id": "allegro",
    "name": "Allegro Coffee (Whole Foods)",
    "hq": "Thornton, CO",
    "locations": 0,
    "founded": 1977,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 4,
      "consistency": 6
    },
    "verdict": "Whole Foods' in-house roaster. Decent quality, organic options, available everywhere Whole Foods is. The grocery store upgrade.",
    "strengths": [
      "Wide availability",
      "Organic options",
      "Decent quality"
    ],
    "weaknesses": [
      "Amazon/Whole Foods owned",
      "Inconsistent freshness"
    ],
    "priceRange": "$10-16/bag",
    "website": "https://wholefoodsmarket.com",
    "aggregate": 57,
    "tier": "C"
  },
  {
    "rank": 88,
    "id": "counter-culture-wholesale",
    "name": "Counter Culture (wholesale)",
    "hq": "Durham, NC",
    "locations": 0,
    "founded": 1995,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 9,
      "value": 8,
      "sourcingEthics": 10,
      "experience": 5,
      "consistency": 8
    },
    "verdict": "Counter Culture's wholesale program supplies hundreds of cafés. If your local shop serves CC, you're in good hands.",
    "strengths": [
      "Best wholesale program",
      "Training centers",
      "Transparency"
    ],
    "weaknesses": [
      "Dependent on café execution"
    ],
    "priceRange": "$14-22/bag",
    "website": "https://counterculturecoffee.com",
    "aggregate": 83,
    "tier": "A"
  },
  {
    "rank": 89,
    "id": "stumpton-cold-brew",
    "name": "Stumptown Cold Brew (RTD)",
    "hq": "Portland, OR",
    "locations": 0,
    "founded": 1999,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 5,
      "sourcingEthics": 6,
      "experience": 4,
      "consistency": 7
    },
    "verdict": "Stumptown's bottled cold brew is available in grocery stores nationwide. Decent quality, premium price. The gateway to better cold brew.",
    "strengths": [
      "Widely available",
      "Decent quality"
    ],
    "weaknesses": [
      "Overpriced",
      "Peet's owned"
    ],
    "priceRange": "$4-6/bottle",
    "website": "https://stumptowncoffee.com",
    "aggregate": 56,
    "tier": "C"
  },
  {
    "rank": 90,
    "id": "cometeer",
    "name": "Cometeer",
    "hq": "Gloucester, MA",
    "locations": 0,
    "founded": 2015,
    "type": "premium",
    "scores": {
      "coffeeQuality": 7,
      "value": 4,
      "sourcingEthics": 6,
      "experience": 5,
      "consistency": 7
    },
    "verdict": "Flash-frozen specialty coffee in capsules. Partners with top roasters. Quality is surprisingly good. Price is not.",
    "strengths": [
      "Innovative concept",
      "Top roaster partnerships",
      "Good quality"
    ],
    "weaknesses": [
      "Very expensive",
      "Frozen shipping"
    ],
    "priceRange": "$2-4/capsule",
    "website": "https://cometeer.com",
    "aggregate": 58,
    "tier": "B"
  },
  {
    "rank": 91,
    "id": "pjs-coffee",
    "name": "PJ's Coffee",
    "hq": "New Orleans, LA",
    "locations": 150,
    "founded": 1978,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 6,
      "sourcingEthics": 4,
      "experience": 5,
      "consistency": 6
    },
    "verdict": "New Orleans chain. Better than Dunkin', worse than specialty. The Gulf Coast's default.",
    "strengths": [
      "NOLA institution",
      "Fair pricing"
    ],
    "weaknesses": [
      "Average coffee",
      "Regional only"
    ],
    "priceRange": "$4-6/drink",
    "website": "https://pjscoffee.com",
    "aggregate": 49,
    "tier": "C"
  },
  {
    "rank": 92,
    "id": "colectivo",
    "name": "Colectivo Coffee",
    "hq": "Milwaukee, WI",
    "locations": 15,
    "founded": 1993,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 7,
      "sourcingEthics": 7,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "Milwaukee's beloved roaster. Beautiful cafés, decent coffee, strong community. The Midwest's most charming chain.",
    "strengths": [
      "Beautiful cafés",
      "Community focus",
      "Good vibes"
    ],
    "weaknesses": [
      "Inconsistent quality",
      "Midwest only"
    ],
    "priceRange": "$13-20/bag",
    "website": "https://colectivo.coffee",
    "aggregate": 69,
    "tier": "B"
  },
  {
    "rank": 93,
    "id": "la-marzocco-cafe",
    "name": "La Marzocco Café",
    "hq": "Seattle, WA",
    "locations": 1,
    "founded": 2016,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 8,
      "value": 5,
      "sourcingEthics": 7,
      "experience": 9,
      "consistency": 5
    },
    "verdict": "The espresso machine company's café. Rotating guest roasters. The experience is unmatched. Consistency varies by roaster.",
    "strengths": [
      "Rotating roasters",
      "Best equipment",
      "Unique concept"
    ],
    "weaknesses": [
      "Inconsistent",
      "Single location",
      "Expensive"
    ],
    "priceRange": "$5-8/drink",
    "website": "https://lamarzocco.com",
    "aggregate": 69,
    "tier": "B"
  },
  {
    "rank": 94,
    "id": "toby-estate",
    "name": "Toby's Estate Coffee",
    "hq": "Brooklyn, NY",
    "locations": 3,
    "founded": 2012,
    "type": "specialty",
    "scores": {
      "coffeeQuality": 7,
      "value": 6,
      "sourcingEthics": 6,
      "experience": 7,
      "consistency": 6
    },
    "verdict": "Australian-style coffee in Brooklyn. Flat whites done right. The coffee is good, the vibes are better.",
    "strengths": [
      "Australian style",
      "Good flat whites",
      "Nice cafés"
    ],
    "weaknesses": [
      "Limited locations",
      "Average single origins"
    ],
    "priceRange": "$16-22/bag",
    "website": "https://tobysestate.com",
    "aggregate": 65,
    "tier": "B"
  },
  {
    "rank": 95,
    "id": "storyville",
    "name": "Storyville Coffee",
    "hq": "Seattle, WA",
    "locations": 3,
    "founded": 2013,
    "type": "premium",
    "scores": {
      "coffeeQuality": 6,
      "value": 4,
      "sourcingEthics": 5,
      "experience": 8,
      "consistency": 6
    },
    "verdict": "Seattle's most luxurious coffee experience. Beautiful Pike Place location. The coffee doesn't match the price tag.",
    "strengths": [
      "Stunning locations",
      "Great experience"
    ],
    "weaknesses": [
      "Overpriced",
      "Average coffee"
    ],
    "priceRange": "$18-28/bag",
    "website": "https://storyville.com",
    "aggregate": 56,
    "tier": "C"
  },
  {
    "rank": 96,
    "id": "coffee-bean-tea-leaf",
    "name": "The Coffee Bean & Tea Leaf",
    "hq": "Los Angeles, CA",
    "locations": 1000,
    "founded": 1963,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 4,
      "sourcingEthics": 4,
      "experience": 5,
      "consistency": 6
    },
    "verdict": "LA's original chain. Predates Starbucks. The coffee is mediocre, the ice blended drinks are the real product.",
    "strengths": [
      "LA institution",
      "Good blended drinks"
    ],
    "weaknesses": [
      "Mediocre coffee",
      "Overpriced",
      "Declining"
    ],
    "priceRange": "$12-16/bag",
    "website": "https://coffeebean.com",
    "aggregate": 44,
    "tier": "C"
  },
  {
    "rank": 97,
    "id": "tullys",
    "name": "Tully's Coffee",
    "hq": "Seattle, WA",
    "locations": 5,
    "founded": 1992,
    "type": "mass-market",
    "scores": {
      "coffeeQuality": 4,
      "value": 5,
      "sourcingEthics": 3,
      "experience": 4,
      "consistency": 5
    },
    "verdict": "Seattle's other coffee chain. Once had 400 locations, now barely surviving. A cautionary tale of over-expansion.",
    "strengths": [
      "Seattle heritage"
    ],
    "weaknesses": [
      "Nearly extinct",
      "Average coffee",
      "Declining"
    ],
    "priceRange": "$10-14/bag",
    "website": "https://tullys.com",
    "aggregate": 42,
    "tier": "D"
  },
  {
    "rank": 98,
    "id": "krispy-kreme",
    "name": "Krispy Kreme Coffee",
    "hq": "Winston-Salem, NC",
    "locations": 1400,
    "founded": 1937,
    "type": "fast-food",
    "scores": {
      "coffeeQuality": 3,
      "value": 6,
      "sourcingEthics": 2,
      "experience": 4,
      "consistency": 6
    },
    "verdict": "You're here for the donuts. The coffee exists to wash them down. It's fine for that purpose.",
    "strengths": [
      "Cheap",
      "Pairs with donuts"
    ],
    "weaknesses": [
      "Afterthought coffee",
      "Not a coffee company"
    ],
    "priceRange": "$2-4/cup",
    "website": "https://krispykreme.com",
    "aggregate": 40,
    "tier": "D"
  },
  {
    "rank": 99,
    "id": "gas-station-generic",
    "name": "Generic Gas Station Coffee",
    "hq": "Everywhere, USA",
    "locations": 150000,
    "founded": 1950,
    "type": "fast-food",
    "scores": {
      "coffeeQuality": 1,
      "value": 5,
      "sourcingEthics": 1,
      "experience": 1,
      "consistency": 3
    },
    "verdict": "The bottom of the barrel. Stale, burnt, sitting on a hot plate for hours. The coffee of last resort.",
    "strengths": [
      "Everywhere",
      "Cheap",
      "24/7"
    ],
    "weaknesses": [
      "Everything else"
    ],
    "priceRange": "$1-2/cup",
    "website": "",
    "aggregate": 22,
    "tier": "F"
  },
  {
    "rank": 100,
    "id": "hotel-lobby-coffee",
    "name": "Hotel Lobby Coffee",
    "hq": "Everywhere, USA",
    "locations": 55000,
    "founded": 1950,
    "type": "fast-food",
    "scores": {
      "coffeeQuality": 1,
      "value": 3,
      "sourcingEthics": 1,
      "experience": 2,
      "consistency": 2
    },
    "verdict": "The worst coffee in America. Stale pods, ancient drip machines, and the audacity to charge $5 for it. The coffee that makes you question your life choices.",
    "strengths": [
      "Available at 6am"
    ],
    "weaknesses": [
      "Everything",
      "Overpriced for quality",
      "Stale",
      "Depressing"
    ],
    "priceRange": "$0-5/cup",
    "website": "",
    "aggregate": 18,
    "tier": "F"
  }
];
