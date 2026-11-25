/*
 * Deep Data Module Part 2 — Features 9-20
 * Yeast, Defects, Village Breweries, Fushimi, Pilgrimage, Terroir,
 * Home Izakaya, Journaling, Gift Protocol, SMV Matrix, Wine Translation, Anti-Score Manifesto
 */

// ============================================================
// 9. YEAST STRAIN ENCYCLOPEDIA
// ============================================================
export interface YeastStrain {
  id: string;
  number: string;
  name: string;
  nameJa: string;
  origin: string;
  originJa: string;
  aroma: string;
  aromaJa: string;
  character: string;
  characterJa: string;
  bestFor: string;
  bestForJa: string;
  wild: boolean;
}

export const yeastStrains: YeastStrain[] = [
  { id: 'k7', number: 'No. 7', name: 'The Workhorse', nameJa: '万能選手',
    origin: 'Miyasaka Brewery (Masumi), Nagano, 1946', originJa: '宮坂醸造（真澄）、長野、1946年',
    aroma: 'Balanced fruit, mild banana, clean finish', aromaJa: 'バランスの取れた果実、穏やかなバナナ、クリーンな後味',
    character: 'The most widely used sake yeast in history. Reliable, versatile, the foundation of modern sake. Like a session musician who makes everyone else sound better.',
    characterJa: '歴史上最も広く使われた酒酵母。信頼性があり、万能で、現代の日本酒の基盤。他の全員をより良く聞こえさせるセッションミュージシャンのよう。',
    bestFor: 'Junmai, honjozo, all-purpose', bestForJa: '純米、本醸造、万能', wild: false,
  },
  { id: 'k9', number: 'No. 9', name: 'The Aromatic', nameJa: '芳香の王',
    origin: 'Kumamoto Prefecture, 1968', originJa: '熊本県、1968年',
    aroma: 'Intense apple, pear, floral, elegant', aromaJa: '強いリンゴ、梨、花、エレガント',
    character: 'The yeast that launched the ginjo revolution. Produces the ethereal fruit aromas that define premium sake. A diva who demands cold fermentation and rewards with transcendence.',
    characterJa: '吟醸革命を起こした酵母。プレミアム日本酒を定義する幽玄な果実の香りを生む。低温発酵を要求し、超越で報いるディーヴァ。',
    bestFor: 'Ginjo, daiginjo, competition sake', bestForJa: '吟醸、大吟醸、コンクール酒', wild: false,
  },
  { id: 'k14', number: 'No. 14', name: 'The Apple Bomb', nameJa: 'リンゴ爆弾',
    origin: 'Kanazawa, Ishikawa, 1990s', originJa: '金沢、石川、1990年代',
    aroma: 'Explosive apple, banana, tropical fruit', aromaJa: '爆発的なリンゴ、バナナ、トロピカルフルーツ',
    character: 'Takes No. 9\'s aromatics and turns them up to eleven. Produces sake that smells like a fruit basket. Controversial — purists say it\'s too much. That\'s exactly the point.',
    characterJa: '9号の芳香性を11まで上げる。フルーツバスケットのような香りの酒を生む。議論を呼ぶ — 純粋主義者は過剰だと言う。まさにそれがポイント。',
    bestFor: 'Aromatic daiginjo, modern styles', bestForJa: '芳香大吟醸、モダンスタイル', wild: false,
  },
  { id: 'k18', number: 'No. 18', name: 'The Exotic', nameJa: 'エキゾチック',
    origin: 'Brewing Society of Japan, 2006', originJa: '日本醸造協会、2006年',
    aroma: 'Lychee, rose, muscat grape, perfume-like', aromaJa: 'ライチ、バラ、マスカット、香水のような',
    character: 'The newest official strain. Produces aromas so intense they border on perfume. Divides opinion sharply — some call it the future, others call it a betrayal of tradition.',
    characterJa: '最新の公式株。香水に近いほど強烈な香りを生む。意見を鋭く分ける — 未来と呼ぶ者もいれば、伝統の裏切りと呼ぶ者もいる。',
    bestFor: 'Ultra-premium daiginjo, export market', bestForJa: '超プレミアム大吟醸、輸出市場', wild: false,
  },
  { id: 'flower', number: 'Flower Yeast', name: 'The Wild Ones', nameJa: '野生の者たち',
    origin: 'Captured from flowers: rhododendron, begonia, sunflower, abelia', originJa: 'シャクナゲ、ベゴニア、ヒマワリ、アベリアの花から捕獲',
    aroma: 'Varies wildly — each flower imparts unique character', aromaJa: '大きく異なる — 各花が独自の個性を与える',
    character: 'Tokyo University of Agriculture pioneered capturing wild yeasts from flower petals. Each flower species produces a different aroma profile. Sake made with rhododendron yeast smells nothing like sake made with sunflower yeast.',
    characterJa: '東京農業大学が花びらから野生酵母を捕獲する先駆者。各花種が異なる香りプロファイルを生む。シャクナゲ酵母の酒はヒマワリ酵母の酒とは全く異なる香り。',
    bestFor: 'Experimental, artisanal, limited editions', bestForJa: '実験的、職人的、限定版', wild: true,
  },
  { id: 'kura', number: 'Kura-tsuki', name: 'The House Spirit', nameJa: '蔵付き酵母',
    origin: 'Lives in the walls, beams, and air of old breweries', originJa: '古い蔵の壁、梁、空気に住む',
    aroma: 'Unique to each brewery — unreplicable terroir', aromaJa: '各蔵に固有 — 再現不可能なテロワール',
    character: 'The yeast that lives in the brewery itself. Accumulated over decades or centuries. When a brewery burns down, this yeast is lost forever. It IS the brewery\'s soul, literally embedded in the architecture.',
    characterJa: '蔵自体に住む酵母。何十年、何世紀もかけて蓄積。蔵が焼けるとこの酵母は永遠に失われる。文字通り建築に埋め込まれた蔵の魂そのもの。',
    bestFor: 'Traditional styles, brewery-specific character', bestForJa: '伝統的スタイル、蔵固有の個性', wild: true,
  },
];

// ============================================================
// 10. SAKE DEFECTS & OFF-FLAVORS
// ============================================================
export interface SakeDefect {
  id: string;
  name: string;
  nameJa: string;
  japanese: string;
  cause: string;
  causeJa: string;
  smell: string;
  smellJa: string;
  isFeature: boolean;
  featureNote: string;
  featureNoteJa: string;
}

export const sakeDefects: SakeDefect[] = [
  { id: 'hineka', name: 'Hineka (Aged Off-Flavor)', nameJa: '老ねか', japanese: '老香',
    cause: 'Oxidation over time, especially in poorly stored sake. UV light and heat accelerate it.',
    causeJa: '時間経過による酸化、特に保存状態の悪い酒。紫外線と熱が加速させる。',
    smell: 'Cardboard, wet paper, stale honey', smellJa: 'ダンボール、濡れた紙、古い蜂蜜',
    isFeature: true, featureNote: 'In koshu (aged sake), controlled oxidation creates desirable sherry-like complexity. The line between defect and feature is intention.',
    featureNoteJa: '古酒では、制御された酸化がシェリーのような望ましい複雑さを生む。欠陥と特徴の境界線は意図にある。',
  },
  { id: 'namahine', name: 'Nama-hine (Raw Deterioration)', nameJa: '生老ね', japanese: '生老ね',
    cause: 'Enzymes in unpasteurized (nama) sake continue working, causing unwanted changes.',
    causeJa: '無濾過（生）酒の酵素が働き続け、望ましくない変化を引き起こす。',
    smell: 'Cooked corn, cabbage, sulfur', smellJa: '茹でたトウモロコシ、キャベツ、硫黄',
    isFeature: false, featureNote: 'Always a defect. Nama sake must be kept cold. If you smell this, the cold chain was broken.',
    featureNoteJa: '常に欠陥。生酒は冷蔵保存が必須。この匂いがしたら、コールドチェーンが途切れた証拠。',
  },
  { id: 'tsuwari', name: 'Tsuwari (Sulfur)', nameJa: 'つわり', japanese: 'つわり',
    cause: 'Yeast stress during fermentation, often from too-rapid temperature changes.',
    causeJa: '発酵中の酵母ストレス、しばしば急激な温度変化から。',
    smell: 'Struck match, boiled egg, rubber', smellJa: '擦ったマッチ、ゆで卵、ゴム',
    isFeature: true, featureNote: 'In very young sake, mild sulfur can indicate freshness and will dissipate with brief airing. Some toji intentionally leave a trace as a signature.',
    featureNoteJa: '非常に若い酒では、穏やかな硫黄は新鮮さを示し、短時間の空気接触で消散する。一部の杜氏は意図的に痕跡を残す。',
  },
  { id: 'isoamyl', name: 'Isoamyl Acetate (Banana Overload)', nameJa: 'バナナ過多', japanese: '酢酸イソアミル過多',
    cause: 'Excessive ester production from high fermentation temperatures or specific yeast strains.',
    causeJa: '高い発酵温度や特定の酵母株からの過剰なエステル生成。',
    smell: 'Overwhelming banana, nail polish, solvent', smellJa: '圧倒的なバナナ、マニキュア、溶剤',
    isFeature: true, featureNote: 'At moderate levels, this IS the ginjo aroma everyone loves. The defect is only in excess — like perfume, the dose makes the poison.',
    featureNoteJa: '適度なレベルでは、これこそ皆が愛する吟醸香。欠陥は過剰にのみ — 香水のように、量が毒を作る。',
  },
  { id: 'diacetyl', name: 'Diacetyl (Butter)', nameJa: 'ダイアセチル', japanese: 'ジアセチル',
    cause: 'Bacterial contamination or incomplete fermentation. Common in poorly managed yamahai.',
    causeJa: '細菌汚染または不完全な発酵。管理の悪い山廃に多い。',
    smell: 'Movie theater butter, butterscotch, artificial cream', smellJa: '映画館のバター、バタースコッチ、人工クリーム',
    isFeature: true, featureNote: 'In yamahai and kimoto styles, a whisper of diacetyl adds richness and complexity. It becomes a defect only when it dominates.',
    featureNoteJa: '山廃や生酛スタイルでは、かすかなダイアセチルが豊かさと複雑さを加える。支配的になった時だけ欠陥になる。',
  },
  { id: 'koji-kusai', name: 'Koji-kusai (Koji Stink)', nameJa: '麹臭い', japanese: '麹臭',
    cause: 'Over-propagated koji or poor temperature control in the muro (koji room).',
    causeJa: '過剰に繁殖した麹または室（麹室）での温度管理不良。',
    smell: 'Musty, mushroom, damp basement, chestnut gone wrong', smellJa: 'カビ臭い、きのこ、湿った地下室、おかしくなった栗',
    isFeature: false, featureNote: 'Generally a defect, but some rustic junmai styles intentionally carry a hint of koji character as a marker of handcraft.',
    featureNoteJa: '一般的に欠陥だが、一部の素朴な純米スタイルは手作りの証として意図的にかすかな麹の個性を残す。',
  },
];

// ============================================================
// 11. VILLAGE BREWERY DIRECTORY
// ============================================================
export interface VillageBrewery {
  id: string;
  name: string;
  nameJa: string;
  location: string;
  locationJa: string;
  people: number;
  toji: string;
  tojiJa: string;
  story: string;
  storyJa: string;
  signature: string;
  signatureJa: string;
  whyMatters: string;
  whyMattersJa: string;
}

export const villageBreweries: VillageBrewery[] = [
  { id: 'tamagawa', name: 'Kinoshita Shuzō (Tamagawa)', nameJa: '木下酒造（玉川）',
    location: 'Kumihama, Kyoto Prefecture — mountain village, population 800', locationJa: '京都府久美浜町 — 山間の村、人口800人',
    people: 5, toji: 'Philip Harper — the first non-Japanese toji in history', tojiJa: 'フィリップ・ハーパー — 歴史上初の外国人杜氏',
    story: 'A British man who fell in love with sake, apprenticed for years, and became the first foreign toji. His yamahai and kimoto styles are wild, funky, and unapologetically bold.',
    storyJa: '日本酒に恋したイギリス人が何年も修行し、初の外国人杜氏になった。彼の山廃と生酛は野性的で、ファンキーで、堂々と大胆。',
    signature: 'Tamagawa Yamahai Junmai — untamed, complex, alive', signatureJa: '玉川 山廃純米 — 野性的、複雑、生きている',
    whyMatters: 'Proves sake is not about nationality but devotion. Harper\'s outsider perspective revealed traditions that insiders had stopped questioning.',
    whyMattersJa: '日本酒は国籍ではなく献身であることを証明。ハーパーの外部者の視点が、内部者が疑問を持たなくなった伝統を明らかにした。',
  },
  { id: 'noguchi', name: 'Noguchi Naohiko Kenkyūjo', nameJa: '農口尚彦研究所',
    location: 'Komatsu, Ishikawa — rural Noto region', locationJa: '石川県小松市 — 能登の農村地域',
    people: 3, toji: 'Noguchi Naohiko — came out of retirement at 87', tojiJa: '農口尚彦 — 87歳で引退から復帰',
    story: 'The "God of Sake" retired, then couldn\'t stay away. At 87, he opened a new brewery to pass on techniques he feared would die with him. He brews standing, by hand, every day.',
    storyJa: '「酒の神」は引退したが、離れられなかった。87歳で新しい蔵を開き、自分と共に消えることを恐れた技術を伝承。毎日立って、手で醸す。',
    signature: 'Junmai Daiginjo — pure, precise, the distillation of 70 years of mastery', signatureJa: '純米大吟醸 — 純粋、精密、70年の熟達の蒸留',
    whyMatters: 'A living library of techniques that exist nowhere else. When Noguchi stops brewing, knowledge accumulated over seven decades will be irreplaceable.',
    whyMattersJa: '他のどこにも存在しない技術の生きた図書館。農口が醸造を止めれば、70年以上にわたり蓄積された知識は取り替えが効かない。',
  },
  { id: 'aramasa', name: 'Aramasa Shuzō', nameJa: '新政酒造',
    location: 'Akita City — but operates like a village operation', locationJa: '秋田市 — しかし村の蔵のように運営',
    people: 8, toji: 'Yusuke Sato — 8th generation, radical traditionalist', tojiJa: '佐藤祐輔 — 8代目、急進的伝統主義者',
    story: 'Sato returned from Tokyo journalism to save his family brewery. His radical move: use ONLY Association No. 6 yeast (discovered at his brewery in 1930) and traditional kimoto method. Modern sake through ancient means.',
    storyJa: '佐藤は東京のジャーナリズムから家業の蔵を救うために戻った。急進的な動き：自社蔵で1930年に発見された6号酵母のみと伝統的な生酛製法のみを使用。古代の手段による現代の酒。',
    signature: 'No.6 series — impossibly elegant, wine-like, revolutionary', signatureJa: 'No.6シリーズ — 信じられないほどエレガント、ワインのよう、革命的',
    whyMatters: 'Proof that tradition and innovation are the same thing. Aramasa is the most exciting brewery in Japan precisely because it looks backward.',
    whyMattersJa: '伝統とイノベーションが同じものであることの証明。新政が日本で最もエキサイティングな蔵であるのは、まさに後ろを向いているから。',
  },
  { id: 'senkin', name: 'Senkin', nameJa: '仙禽',
    location: 'Sakura, Tochigi — small town surrounded by rice fields', locationJa: '栃木県さくら市 — 田んぼに囲まれた小さな町',
    people: 6, toji: 'Kazuki Usui — domain-focused, terroir-obsessed', tojiJa: '薄井一樹 — ドメーヌ重視、テロワールに執着',
    story: 'Usui declared his brewery a "domaine" — using only rice grown within sight of the kura, only water from the local river. Every bottle is a GPS coordinate.',
    storyJa: '薄井は蔵を「ドメーヌ」と宣言 — 蔵から見える範囲で栽培された米のみ、地元の川の水のみを使用。すべての瓶がGPS座標。',
    signature: 'Modern series — bright, acidic, almost like natural wine', signatureJa: 'モダンシリーズ — 明るく、酸味があり、ほぼナチュラルワインのよう',
    whyMatters: 'The terroir movement in sake starts here. If wine can express place, why can\'t sake?',
    whyMattersJa: '日本酒のテロワール運動はここから始まる。ワインが場所を表現できるなら、なぜ日本酒にはできないのか？',
  },
  { id: 'kidoizumi', name: 'Kidoizumi Shuzō', nameJa: '寿泉酒造',
    location: 'Isumi, Chiba — coastal village facing the Pacific', locationJa: '千葉県いすみ市 — 太平洋に面した海辺の村',
    people: 4, toji: 'Shōji Hayashi — hot yamahai pioneer', tojiJa: '林昌次 — 熱掛け山廃のパイオニア',
    story: 'Hayashi invented "hot yamahai" — adding boiling water to the starter to create unique lactic flavors. His sake is funky, wild, divisive, and utterly original. The natural wine of sake.',
    storyJa: '林は「熱掛け山廃」を発明 — 酒母に熱湯を加え独自の乳酸風味を生む。彼の酒はファンキーで、野性的で、賛否両論で、完全にオリジナル。日本酒のナチュラルワイン。',
    signature: 'Afs (Acid Fermentation Sake) — sour, complex, challenging', signatureJa: 'Afs（酸発酵酒）— 酸味、複雑、挑戦的',
    whyMatters: 'Proves sake can be punk rock. Not everything needs to be clean and pretty. Sometimes the most honest expression is the messiest.',
    whyMattersJa: '日本酒がパンクロックになれることを証明。すべてがクリーンで美しい必要はない。時に最も正直な表現は最も乱雑なもの。',
  },
];

// ============================================================
// 12. FUSHIMI DEEP DIVE
// ============================================================
export interface FushimiSpot {
  id: string;
  name: string;
  nameJa: string;
  type: 'brewery' | 'bar' | 'walk' | 'shrine' | 'hidden';
  founded: string;
  description: string;
  descriptionJa: string;
  mustTry: string;
  mustTryJa: string;
}

export const fushimiSpots: FushimiSpot[] = [
  { id: 'gekkeikan', name: 'Gekkeikan Ōkura Museum', nameJa: '月桂冠大倉記念館',
    type: 'brewery', founded: '1637',
    description: 'Nearly 400 years of continuous brewing. The museum preserves Edo-era tools and techniques. The tasting room at the end offers sake unavailable anywhere else.',
    descriptionJa: 'ほぼ400年の連続醸造。博物館は江戸時代の道具と技術を保存。最後の試飲室では他では手に入らない酒を提供。',
    mustTry: 'Gekkeikan Tokusen — the museum-only bottling', mustTryJa: '月桂冠 特撰 — 博物館限定瓶詰め',
  },
  { id: 'kizakura', name: 'Kizakura Kappa Country', nameJa: '黄桜カッパカントリー',
    type: 'brewery', founded: '1925',
    description: 'The brewery that embraced the kappa (water sprite) as its mascot. Their innovation lab experiments with sake-beer hybrids and ancient rice varieties.',
    descriptionJa: '河童をマスコットに採用した蔵。イノベーションラボでは日本酒とビールのハイブリッドや古代米品種を実験。',
    mustTry: 'Kizakura Junmai Daiginjo — surprisingly refined for a mass producer', mustTryJa: '黄桜 純米大吟醸 — 大量生産者としては驚くほど洗練',
  },
  { id: 'canal', name: 'Jikkokubune Canal Walk', nameJa: '十石舟の運河散歩',
    type: 'walk', founded: 'Edo period',
    description: 'The canals that once transported sake barrels to Osaka. Walk at dusk when the willow trees reflect in the water and the brewery chimneys release steam. The most photogenic sake moment in Japan.',
    descriptionJa: 'かつて酒樽を大阪に運んだ運河。夕暮れに歩けば柳が水面に映り、蔵の煙突から蒸気が立ち上る。日本で最もフォトジェニックな酒の瞬間。',
    mustTry: 'Board the jikkokubune boat in spring — sake served on the water', mustTryJa: '春に十石舟に乗る — 水上で酒を楽しむ',
  },
  { id: 'gokosui', name: 'Gokōnomizu Shrine Spring', nameJa: '御香宮の湧水',
    type: 'shrine', founded: '862 AD',
    description: 'The sacred spring that gives Fushimi its water. Emperor Seiwa blessed it in 862. You can still fill bottles here for free. This is the water that becomes sake.',
    descriptionJa: '伏見に水を与える聖なる泉。862年に清和天皇が祝福。今も無料で瓶に汲める。これが酒になる水。',
    mustTry: 'Taste the water itself — soft, sweet, with a mineral whisper', mustTryJa: '水そのものを味わう — 柔らかく、甘く、ミネラルの囁き',
  },
  { id: 'torisei', name: 'Torisei (Hidden Brewery Bar)', nameJa: '鳥せい',
    type: 'hidden', founded: '1976',
    description: 'A yakitori restaurant inside an old sake brewery. The nama sake is drawn directly from the tank behind the counter. You drink it within minutes of pressing. This is as fresh as sake gets.',
    descriptionJa: '古い酒蔵の中の焼き鳥店。生酒はカウンター裏のタンクから直接汲む。搾りから数分以内に飲む。これ以上新鮮な酒はない。',
    mustTry: 'Tokusen Genshu — drawn from the tank, undiluted, unpasteurized', mustTryJa: '特撰原酒 — タンクから汲んだ、無加水、無濾過',
  },
];

// ============================================================
// 13. SAKE PILGRIMAGE ROUTES
// ============================================================
export interface PilgrimageRoute {
  id: string;
  name: string;
  nameJa: string;
  region: string;
  regionJa: string;
  days: number;
  breweries: number;
  description: string;
  descriptionJa: string;
  stops: { name: string; nameJa: string; note: string; noteJa: string }[];
  bestSeason: string;
  bestSeasonJa: string;
}

export const pilgrimageRoutes: PilgrimageRoute[] = [
  { id: 'niigata', name: 'Niigata Snow Country Trail', nameJa: '新潟雪国の道',
    region: 'Niigata', regionJa: '新潟', days: 3, breweries: 5,
    description: 'Through the deepest snow country in Japan. Breweries here use ultra-soft snowmelt water and centuries of Echigo toji tradition to create the cleanest sake on Earth.',
    descriptionJa: '日本で最も深い雪国を通る。ここの蔵は超軟水の雪解け水と何世紀もの越後杜氏の伝統で、地球上で最もクリーンな酒を造る。',
    stops: [
      { name: 'Hakkaisan', nameJa: '八海山', note: 'Start here. Tour the snow room where sake ages at -3°C under 1,000 tons of snow.', noteJa: 'ここから始める。1,000トンの雪の下、-3°Cで酒が熟成する雪室を見学。' },
      { name: 'Kubota (Asahi Shuzo)', nameJa: '久保田（朝日酒造）', note: 'The brewery that defined modern Niigata style. Ask for the Manju tasting.', noteJa: '現代の新潟スタイルを定義した蔵。萬寿の試飲を頼む。' },
      { name: 'Koshi no Kanbai', nameJa: '越乃寒梅', note: 'The legendary "Plum in the Cold" — the sake that started the premium revolution in the 1970s.', noteJa: '伝説の「越乃寒梅」— 1970年代にプレミアム革命を始めた酒。' },
      { name: 'Takachiyo', nameJa: '高千代', note: 'Small, experimental, using 59 different rice varieties. The mad scientist of Niigata.', noteJa: '小さく、実験的で、59種類の米品種を使用。新潟のマッドサイエンティスト。' },
      { name: 'Ponshukan (Echigo-Yuzawa Station)', nameJa: 'ぽんしゅ館（越後湯沢駅）', note: 'End at this sake museum inside the train station. 117 Niigata sakes on tap for ¥500.', noteJa: '駅構内のこの酒ミュージアムで締める。新潟の117銘柄が500円で試飲可能。' },
    ],
    bestSeason: 'January-February (brewing season, snow at peak)', bestSeasonJa: '1月-2月（醸造シーズン、雪のピーク）',
  },
  { id: 'hiroshima', name: 'Hiroshima Coastal Path', nameJa: '広島海岸の道',
    region: 'Hiroshima', regionJa: '広島', days: 2, breweries: 4,
    description: 'The birthplace of soft-water brewing. Miura Senzaburo\'s revolution happened here. Walk between breweries along the Seto Inland Sea.',
    descriptionJa: '軟水醸造の発祥地。三浦仙三郎の革命がここで起きた。瀬戸内海沿いに蔵を歩いて巡る。',
    stops: [
      { name: 'Kamotsuru', nameJa: '賀茂鶴', note: 'The grand dame of Saijō. Their Daiginjo Gold won the Nobel Prize dinner.', noteJa: '西条の大御所。大吟醸ゴールドはノーベル賞晩餐会で採用。' },
      { name: 'Fukucho', nameJa: '富久長', note: 'Female toji Miho Imada brews with ancient Hattanso rice. The future is female.', noteJa: '女性杜氏・今田美穂が古代の八反草で醸す。未来は女性のもの。' },
      { name: 'Kirei', nameJa: '亀齢', note: 'Quiet, precise, the introvert of Saijō. Their Mannen Kame is a hidden gem.', noteJa: '静かで精密、西条の内向的な蔵。萬年亀は隠れた宝石。' },
      { name: 'Sakurao Distillery', nameJa: '桜尾蒸留所', note: 'Bonus: Japan\'s craft gin and whisky, using local botanicals. A bridge between spirits.', noteJa: 'ボーナス：地元のボタニカルを使った日本のクラフトジンとウイスキー。スピリッツの架け橋。' },
    ],
    bestSeason: 'October (Saijō Sake Festival — largest in Japan)', bestSeasonJa: '10月（西条酒まつり — 日本最大）',
  },
  { id: 'tohoku', name: 'Tōhoku Mountain Circuit', nameJa: '東北山岳巡回',
    region: 'Yamagata / Akita / Iwate', regionJa: '山形 / 秋田 / 岩手', days: 4, breweries: 6,
    description: 'The spiritual heartland of sake. Remote mountain breweries where the toji tradition is strongest. Prepare for silence, snow, and transcendence.',
    descriptionJa: '日本酒の精神的中心地。杜氏の伝統が最も強い辺境の山の蔵。沈黙、雪、超越に備えよ。',
    stops: [
      { name: 'Juyondai (Takagi Shuzo)', nameJa: '十四代（高木酒造）', note: 'The most sought-after sake in Japan. You cannot visit, but you can drink it in Yamagata bars.', noteJa: '日本で最も入手困難な酒。訪問はできないが、山形のバーで飲める。' },
      { name: 'Dewazakura', nameJa: '出羽桜', note: 'The brewery that brought ginjo to the masses. Their Oka is the gateway drug.', noteJa: '吟醸を大衆にもたらした蔵。桜花はゲートウェイドラッグ。' },
      { name: 'Aramasa', nameJa: '新政', note: 'The revolutionary. Only No. 6 yeast, only kimoto, only wooden tanks. The future through the past.', noteJa: '革命家。6号酵母のみ、生酛のみ、木桶のみ。過去を通じた未来。' },
      { name: 'Yuki no Bosha', nameJa: '雪の茅舎', note: 'Brewed in a thatched-roof building buried in snow. The sake tastes like winter silence.', noteJa: '雪に埋もれた茅葺き屋根の建物で醸す。酒は冬の沈黙の味がする。' },
      { name: 'Nanbu Bijin', nameJa: '南部美人', note: 'The "Southern Beauty." Their kosher-certified sake bridges cultures.', noteJa: '「南部美人」。コーシャ認証の酒が文化を橋渡しする。' },
      { name: 'Akabu', nameJa: '赤武', note: 'The youngest toji in Japan (started at 22). Proof that sake\'s future is in young hands.', noteJa: '日本最年少の杜氏（22歳で開始）。日本酒の未来が若い手にある証拠。' },
    ],
    bestSeason: 'February (deep winter, peak brewing, snow festivals)', bestSeasonJa: '2月（厳冬、醸造ピーク、雪祭り）',
  },
];

// ============================================================
// 14. TERROIR COMPARISON (built into Prefectures page as a tool)
// ============================================================
export interface PrefectureTerroir {
  id: string;
  name: string;
  nameJa: string;
  water: string;
  waterJa: string;
  rice: string;
  riceJa: string;
  climate: string;
  climateJa: string;
  style: string;
  styleJa: string;
  keywords: string[];
  keywordsJa: string[];
}

export const prefectureTerroirs: PrefectureTerroir[] = [
  { id: 'niigata', name: 'Niigata', nameJa: '新潟',
    water: 'Ultra-soft snowmelt (25 mg/L)', waterJa: '超軟水の雪解け水（25mg/L）',
    rice: 'Gohyakumangoku, Koshi Tanrei', riceJa: '五百万石、越淡麗',
    climate: 'Heavy snow, cold winters, humid summers', climateJa: '豪雪、寒い冬、蒸し暑い夏',
    style: 'Tanrei karakuchi — clean, dry, light, crystalline', styleJa: '淡麗辛口 — クリーン、辛口、軽快、水晶のよう',
    keywords: ['clean', 'dry', 'light', 'snow'], keywordsJa: ['クリーン', '辛口', '軽快', '雪'],
  },
  { id: 'hyogo', name: 'Hyogo (Nada)', nameJa: '兵庫（灘）',
    water: 'Hard miyamizu (170 mg/L)', waterJa: '硬水の宮水（170mg/L）',
    rice: 'Yamada Nishiki (birthplace)', riceJa: '山田錦（発祥地）',
    climate: 'Mild coastal, Rokko mountain winds', climateJa: '温暖な沿岸、六甲山の風',
    style: 'Otoko-zake — bold, dry, structured, powerful', styleJa: '男酒 — 力強い、辛口、構造的、パワフル',
    keywords: ['bold', 'dry', 'structured', 'masculine'], keywordsJa: ['力強い', '辛口', '構造的', '男性的'],
  },
  { id: 'kyoto', name: 'Kyoto (Fushimi)', nameJa: '京都（伏見）',
    water: 'Medium-soft spring water (60 mg/L)', waterJa: '中軟水の湧水（60mg/L）',
    rice: 'Yamada Nishiki, Iwai, Gohyakumangoku', riceJa: '山田錦、祝、五百万石',
    climate: 'Basin climate — hot summers, cold winters', climateJa: '盆地気候 — 暑い夏、寒い冬',
    style: 'Onna-zake — soft, round, elegant, gentle sweetness', styleJa: '女酒 — 柔らかく、丸く、優雅、穏やかな甘み',
    keywords: ['soft', 'elegant', 'round', 'feminine'], keywordsJa: ['柔らかい', '優雅', '丸い', '女性的'],
  },
  { id: 'yamagata', name: 'Yamagata', nameJa: '山形',
    water: 'Ultra-soft Gassan snowmelt (20 mg/L)', waterJa: '超軟水の月山雪解け水（20mg/L）',
    rice: 'Dewasansan, Yamada Nishiki', riceJa: '出羽燦々、山田錦',
    climate: 'Heavy snow, extreme cold, pure air', climateJa: '豪雪、極寒、清浄な空気',
    style: 'Ethereal ginjo — delicate, aromatic, whisper-light', styleJa: '幽玄な吟醸 — 繊細、芳香、囁くように軽い',
    keywords: ['ethereal', 'aromatic', 'delicate', 'premium'], keywordsJa: ['幽玄', '芳香', '繊細', 'プレミアム'],
  },
  { id: 'akita', name: 'Akita', nameJa: '秋田',
    water: 'Soft Chōkai spring water (35 mg/L)', waterJa: '軟水の鳥海山湧水（35mg/L）',
    rice: 'Miyama Nishiki, Akita Sake Komachi', riceJa: '美山錦、秋田酒こまち',
    climate: 'Deep snow, isolated, traditional', climateJa: '深い雪、孤立、伝統的',
    style: 'Rich junmai — full-bodied, umami-deep, velvety', styleJa: '豊かな純米 — フルボディ、旨味深い、ビロードのよう',
    keywords: ['rich', 'umami', 'full', 'traditional'], keywordsJa: ['豊か', '旨味', 'フル', '伝統的'],
  },
  { id: 'hiroshima', name: 'Hiroshima', nameJa: '広島',
    water: 'Soft Saijō water (30 mg/L)', waterJa: '軟水の西条水（30mg/L）',
    rice: 'Hattan Nishiki, Senbon Nishiki', riceJa: '八反錦、千本錦',
    climate: 'Mild Seto Inland Sea climate', climateJa: '温暖な瀬戸内海気候',
    style: 'Gentle ginjo — floral, smooth, approachable', styleJa: '穏やかな吟醸 — 花のよう、滑らか、親しみやすい',
    keywords: ['gentle', 'floral', 'smooth', 'innovative'], keywordsJa: ['穏やか', '花のよう', '滑らか', '革新的'],
  },
];

// ============================================================
// 15. HOME IZAKAYA BUILDER
// ============================================================
export interface IzakayaElement {
  id: string;
  category: string;
  categoryJa: string;
  title: string;
  titleJa: string;
  description: string;
  descriptionJa: string;
  tips: string[];
  tipsJa: string[];
}

export const homeIzakayaElements: IzakayaElement[] = [
  { id: 'lighting', category: 'Atmosphere', categoryJa: '雰囲気',
    title: 'Lighting — The First Ingredient', titleJa: '照明 — 最初の材料',
    description: 'Kill the overhead lights. Use only warm, low sources: candles in ceramic holders, a single paper lantern, or warm-white string lights at knee height. The goal is shadow, not illumination.',
    descriptionJa: '天井照明を消す。温かく低い光源のみ使用：陶器の燭台のキャンドル、一つの提灯、または膝の高さの暖白色のストリングライト。目標は影であり、照明ではない。',
    tips: ['Beeswax candles over paraffin — the scent matters', 'Place light sources below eye level', 'One corner should be in complete shadow'],
    tipsJa: ['パラフィンより蜜蝋キャンドル — 香りが重要', '光源は目線より下に', '一角は完全な影に'],
  },
  { id: 'sound', category: 'Atmosphere', categoryJa: '雰囲気',
    title: 'Sound — The Invisible Wall', titleJa: '音 — 見えない壁',
    description: 'Three options: ambient (Ryuichi Sakamoto, Hiroshi Yoshimura), traditional (shakuhachi, koto), or silence. Never background pop music. The sound should make the room feel smaller and more intimate.',
    descriptionJa: '三つの選択肢：アンビエント（坂本龍一、吉村弘）、伝統的（尺八、琴）、または沈黙。決してポップミュージックをBGMにしない。音は部屋をより小さく親密に感じさせるべき。',
    tips: ['Yoshimura\'s "Music for Nine Postcards" is perfect', 'Volume should be barely audible', 'Silence is underrated — try it for the first pour'],
    tipsJa: ['吉村弘の「Music for Nine Postcards」が最適', '音量はかろうじて聞こえる程度に', '沈黙は過小評価されている — 最初の一杯で試してみて'],
  },
  { id: 'vessels', category: 'Service', categoryJa: 'サービス',
    title: 'Vessels — Choose with Intention', titleJa: '器 — 意図を持って選ぶ',
    description: 'Match the vessel to the sake and the season. Porcelain ochoko for daiginjo. Rough stoneware guinomi for yamahai. Cedar masu for celebration. Never use the same vessel for every sake.',
    descriptionJa: '器を酒と季節に合わせる。大吟醸には磁器のお猪口。山廃には粗い陶器のぐい呑み。祝いには杉の枡。すべての酒に同じ器を使わない。',
    tips: ['Warm the vessel before pouring hot sake', 'Wet the rim of a masu before filling', 'Mismatched vessels are more wabi-sabi than a matching set'],
    tipsJa: ['熱燗を注ぐ前に器を温める', '枡の縁を濡らしてから注ぐ', '不揃いの器はセットよりも侘び寂び'],
  },
  { id: 'food', category: 'Food', categoryJa: '食',
    title: 'Food Sequence — Build, Don\'t Dump', titleJa: '食の順序 — 積み上げよ、一度に出すな',
    description: 'Start light, build heavy. Cold tofu → sashimi → grilled fish → simmered dishes → rice. Each dish should arrive as the previous one is finishing. The meal is a narrative, not a buffet.',
    descriptionJa: '軽いものから始め、重いものへ。冷奴 → 刺身 → 焼き魚 → 煮物 → ご飯。各皿は前の皿が終わる頃に届くべき。食事はビュッフェではなく物語。',
    tips: ['Three dishes maximum at any one time', 'Salt before sauce — let the palate build', 'End with ochazuke (rice with tea) — the perfect closer'],
    tipsJa: ['同時に出す皿は最大3つ', '醤油の前に塩 — 味覚を積み上げる', '最後はお茶漬け — 完璧な締め'],
  },
  { id: 'temperature', category: 'Service', categoryJa: 'サービス',
    title: 'Temperature — The Hidden Variable', titleJa: '温度 — 隠れた変数',
    description: 'Have at least two temperatures ready: one chilled (10°C for ginjo) and one warm (40°C for junmai). Use a tokkuri in hot water, never microwave. Check temperature by touching the vessel to your cheek.',
    descriptionJa: '少なくとも二つの温度を用意：冷やし（吟醸に10°C）と温め（純米に40°C）。湯煎の徳利を使い、決して電子レンジは使わない。器を頬に当てて温度を確認。',
    tips: ['The tokkuri should feel like a warm handshake, not a burn', 'Serve chilled sake in a vessel resting on ice', 'Change temperature mid-meal to reset the palate'],
    tipsJa: ['徳利は火傷ではなく温かい握手のように感じるべき', '冷酒は氷の上に置いた器で', '食事の途中で温度を変えて味覚をリセット'],
  },
];

// ============================================================
// 16. SAKE JOURNALING SYSTEM (template structure)
// ============================================================
export interface JournalField {
  id: string;
  label: string;
  labelJa: string;
  placeholder: string;
  placeholderJa: string;
  type: 'text' | 'textarea' | 'select' | 'range';
  options?: { en: string; ja: string }[];
}

export const journalFields: JournalField[] = [
  { id: 'sake_name', label: 'The Sake', labelJa: '酒の名前', placeholder: 'Name and brewery', placeholderJa: '銘柄と蔵元', type: 'text' },
  { id: 'date', label: 'When', labelJa: 'いつ', placeholder: 'Date and time', placeholderJa: '日時', type: 'text' },
  { id: 'who', label: 'With Whom', labelJa: '誰と', placeholder: 'Alone, or with...', placeholderJa: '一人で、または...', type: 'text' },
  { id: 'where', label: 'Where', labelJa: 'どこで', placeholder: 'Place and setting', placeholderJa: '場所と環境', type: 'text' },
  { id: 'weather', label: 'The Weather', labelJa: '天気', placeholder: 'Rain, snow, clear...', placeholderJa: '雨、雪、晴れ...', type: 'text' },
  { id: 'vessel', label: 'The Vessel', labelJa: '器', placeholder: 'What did you drink from?', placeholderJa: '何で飲んだ？', type: 'text' },
  { id: 'temperature', label: 'Temperature', labelJa: '温度', placeholder: 'Cold, room, warm, hot', placeholderJa: '冷、常温、ぬる燗、熱燗', type: 'text' },
  { id: 'first_impression', label: 'First Sip', labelJa: '最初の一口', placeholder: 'What hit you first?', placeholderJa: '最初に何を感じた？', type: 'textarea' },
  { id: 'aromas', label: 'What You Smelled', labelJa: '香り', placeholder: 'Be specific, be weird', placeholderJa: '具体的に、変でもいい', type: 'textarea' },
  { id: 'feeling', label: 'How It Made You Feel', labelJa: 'どう感じたか', placeholder: 'Not the flavor — the emotion', placeholderJa: '味ではなく — 感情', type: 'textarea' },
  { id: 'music', label: 'What Was Playing', labelJa: '流れていた音楽', placeholder: 'Song, silence, rain...', placeholderJa: '曲、沈黙、雨...', type: 'text' },
  { id: 'would_return', label: 'Would You Return?', labelJa: 'また飲みたい？', placeholder: 'To this sake, this moment', placeholderJa: 'この酒に、この瞬間に', type: 'textarea' },
];

// ============================================================
// 17. GIFT PROTOCOL
// ============================================================
export interface GiftOccasion {
  id: string;
  occasion: string;
  occasionJa: string;
  description: string;
  descriptionJa: string;
  sakeType: string;
  sakeTypeJa: string;
  wrapping: string;
  wrappingJa: string;
  etiquette: string;
  etiquetteJa: string;
}

export const giftOccasions: GiftOccasion[] = [
  { id: 'wedding', occasion: 'Wedding (結婚祝い)', occasionJa: '結婚祝い',
    description: 'Sake at weddings symbolizes the union of two families. The san-san-kudo ceremony involves three sips from three cups.',
    descriptionJa: '結婚式の酒は二つの家族の結合を象徴。三三九度の儀式は三つの杯から三口ずつ。',
    sakeType: 'Daiginjo or junmai daiginjo in a 1.8L isshōbin (one-shō bottle)', sakeTypeJa: '大吟醸または純米大吟醸の一升瓶（1.8L）',
    wrapping: 'Red and white noshi paper, mizuhiki knot that cannot be untied (musubi-kiri)', wrappingJa: '紅白の熨斗紙、解けない結び（結び切り）',
    etiquette: 'Always give in pairs — two bottles symbolize the couple. Never give one bottle alone.', etiquetteJa: '必ず対で贈る — 二本は夫婦を象徴。一本だけは決して贈らない。',
  },
  { id: 'newyear', occasion: 'New Year (お年賀)', occasionJa: 'お年賀',
    description: 'The first sake of the year. Traditionally drunk on January 1st with ozoni (mochi soup). A fresh start.',
    descriptionJa: '一年の最初の酒。伝統的に1月1日にお雑煮と共に飲む。新たな始まり。',
    sakeType: 'Shiboritate (freshly pressed) or a celebratory gold-flaked sake', sakeTypeJa: 'しぼりたて（新酒）または祝い用の金箔入り酒',
    wrapping: 'Red and gold noshi, butterfly knot (chō-musubi) — can be retied, meaning repeatable joy', wrappingJa: '紅金の熨斗、蝶結び — 結び直せる、繰り返せる喜びの意',
    etiquette: 'Present before January 7th. After that, it becomes "cold-weather greeting" (kan-chū mimai).', etiquetteJa: '1月7日までに贈る。それ以降は「寒中見舞い」になる。',
  },
  { id: 'business', occasion: 'Business Gift (手土産)', occasionJa: '手土産',
    description: 'The art of the business gift. Not a bribe — a gesture of respect. The sake should reflect the giver\'s taste and the receiver\'s status.',
    descriptionJa: 'ビジネスギフトの技。賄賂ではなく — 敬意の表現。酒は贈り手の趣味と受け手の地位を反映すべき。',
    sakeType: 'Premium junmai daiginjo from a respected regional brewery — never mass-market', sakeTypeJa: '尊敬される地方蔵のプレミアム純米大吟醸 — 決して大手メーカーではない',
    wrapping: 'Brewery\'s own gift box, wrapped in furoshiki cloth', wrappingJa: '蔵元の化粧箱、風呂敷に包む',
    etiquette: 'Present with both hands, label facing the receiver. Say "tsumaranai mono desu ga" (it\'s a trifling thing) — the ultimate Japanese humble-brag.', etiquetteJa: '両手でラベルを相手に向けて差し出す。「つまらないものですが」と言う — 究極の日本的謙遜。',
  },
  { id: 'sympathy', occasion: 'Sympathy / Condolence (お悔やみ)', occasionJa: 'お悔やみ',
    description: 'Sake can be offered at Buddhist memorial services. The gesture acknowledges that grief and beauty coexist.',
    descriptionJa: '仏教の法要で酒を供えることができる。悲しみと美しさが共存することを認める行為。',
    sakeType: 'Quiet, understated junmai — nothing flashy, nothing aromatic', sakeTypeJa: '静かで控えめな純米 — 派手でなく、芳香でもなく',
    wrapping: 'White and silver noshi, simple knot. No red. No gold.', wrappingJa: '白と銀の熨斗、シンプルな結び。赤なし。金なし。',
    etiquette: 'Timing matters more than the bottle. Being present is the gift.', etiquetteJa: '瓶よりもタイミングが重要。そこにいることが贈り物。',
  },
];

// ============================================================
// 18. SMV/ACIDITY MATRIX (data points for scatter plot)
// ============================================================
export interface SMVDataPoint {
  name: string;
  nameJa: string;
  smv: number; // Sake Meter Value (-15 to +15)
  acidity: number; // 0.8 to 2.5
  style: string;
  styleJa: string;
  category: string;
}

export const smvData: SMVDataPoint[] = [
  { name: 'Dassai 23', nameJa: '獺祭 23', smv: 4, acidity: 1.1, style: 'Clean & Dry', styleJa: 'クリーン＆ドライ', category: 'daiginjo' },
  { name: 'Kubota Manju', nameJa: '久保田 萬寿', smv: 2, acidity: 1.2, style: 'Balanced', styleJa: 'バランス', category: 'junmai-daiginjo' },
  { name: 'Hakkaisan Tokubetsu', nameJa: '八海山 特別', smv: 5, acidity: 1.0, style: 'Light & Dry', styleJa: '軽快＆辛口', category: 'honjozo' },
  { name: 'Tedorigawa Yamahai', nameJa: '手取川 山廃', smv: 3, acidity: 1.8, style: 'Rich & Complex', styleJa: '豊か＆複雑', category: 'yamahai' },
  { name: 'Born Gold', nameJa: '梵 ゴールド', smv: 2, acidity: 1.3, style: 'Elegant', styleJa: 'エレガント', category: 'junmai-daiginjo' },
  { name: 'Aramasa No.6', nameJa: '新政 No.6', smv: -2, acidity: 2.0, style: 'Acidic & Modern', styleJa: '酸味＆モダン', category: 'junmai' },
  { name: 'Senkin Modern', nameJa: '仙禽 モダン', smv: -5, acidity: 2.2, style: 'Wine-like', styleJa: 'ワインのよう', category: 'junmai' },
  { name: 'Juyondai Honmaru', nameJa: '十四代 本丸', smv: 2, acidity: 1.2, style: 'Fruity & Balanced', styleJa: 'フルーティ＆バランス', category: 'honjozo' },
  { name: 'Kokuryu Ryu', nameJa: '黒龍 龍', smv: 5, acidity: 1.1, style: 'Crisp & Premium', styleJa: 'キレ＆プレミアム', category: 'daiginjo' },
  { name: 'Masumi Nanago', nameJa: '真澄 七號', smv: 1, acidity: 1.4, style: 'Soft & Round', styleJa: '柔らか＆丸い', category: 'junmai' },
  { name: 'Dewazakura Oka', nameJa: '出羽桜 桜花', smv: 5, acidity: 1.2, style: 'Aromatic & Dry', styleJa: '芳香＆辛口', category: 'ginjo' },
  { name: 'Nabeshima Daiginjo', nameJa: '鍋島 大吟醸', smv: 1, acidity: 1.3, style: 'Lush & Fruity', styleJa: '豊潤＆フルーティ', category: 'daiginjo' },
  { name: 'Isojiman Junmai DG', nameJa: '磯自慢 純米大吟醸', smv: 4, acidity: 1.1, style: 'Precise & Clean', styleJa: '精密＆クリーン', category: 'junmai-daiginjo' },
  { name: 'Tamagawa Yamahai', nameJa: '玉川 山廃', smv: -1, acidity: 2.1, style: 'Wild & Funky', styleJa: '野性的＆ファンキー', category: 'yamahai' },
  { name: 'Noguchi Naohiko JDG', nameJa: '農口尚彦 純米大吟醸', smv: 3, acidity: 1.2, style: 'Masterful', styleJa: '匠の技', category: 'junmai-daiginjo' },
];

// ============================================================
// 19. SAKE VS WINE TRANSLATION
// ============================================================
export interface WineTranslation {
  id: string;
  sakeStyle: string;
  sakeStyleJa: string;
  wineEquivalent: string;
  wineEquivalentJa: string;
  sharedTraits: string;
  sharedTraitsJa: string;
  keyDifference: string;
  keyDifferenceJa: string;
}

export const wineTranslations: WineTranslation[] = [
  { id: 'daiginjo-riesling', sakeStyle: 'Daiginjo', sakeStyleJa: '大吟醸',
    wineEquivalent: 'Riesling Spätlese (Mosel)', wineEquivalentJa: 'リースリング・シュペートレーゼ（モーゼル）',
    sharedTraits: 'Floral aromatics, precision, delicacy, low alcohol feel, mineral backbone', sharedTraitsJa: '花の芳香、精密さ、繊細さ、低アルコール感、ミネラルの骨格',
    keyDifference: 'Daiginjo achieves its delicacy through rice polishing; Riesling through terroir and late harvest', keyDifferenceJa: '大吟醸は精米で繊細さを達成；リースリングはテロワールと遅摘みで',
  },
  { id: 'yamahai-burgundy', sakeStyle: 'Yamahai Junmai', sakeStyleJa: '山廃純米',
    wineEquivalent: 'Natural Burgundy (Pinot Noir)', wineEquivalentJa: 'ナチュラル・ブルゴーニュ（ピノ・ノワール）',
    sharedTraits: 'Wild fermentation character, earthy complexity, umami, divisive opinions', sharedTraitsJa: '野生発酵の個性、土の複雑さ、旨味、賛否両論',
    keyDifference: 'Yamahai\'s wildness comes from lactic bacteria; natural wine\'s from ambient yeast and minimal intervention', keyDifferenceJa: '山廃の野性は乳酸菌から；ナチュラルワインの野性は環境酵母と最小限の介入から',
  },
  { id: 'koshu-sherry', sakeStyle: 'Koshu (Aged Sake)', sakeStyleJa: '古酒',
    wineEquivalent: 'Amontillado Sherry', wineEquivalentJa: 'アモンティリャード・シェリー',
    sharedTraits: 'Amber color, oxidative character, nuts, caramel, extraordinary complexity', sharedTraitsJa: '琥珀色、酸化的性格、ナッツ、キャラメル、驚異的な複雑さ',
    keyDifference: 'Koshu ages in sealed tanks; sherry ages under a veil of flor yeast. Both transform through time but by different mechanisms', keyDifferenceJa: '古酒は密閉タンクで熟成；シェリーはフロール酵母の膜の下で熟成。両者とも時間で変容するが異なるメカニズムで',
  },
  { id: 'nigori-petnat', sakeStyle: 'Nigori (Cloudy)', sakeStyleJa: 'にごり酒',
    wineEquivalent: 'Pétillant Naturel (Pét-Nat)', wineEquivalentJa: 'ペティアン・ナチュレル',
    sharedTraits: 'Cloudy, textural, slightly fizzy, rustic charm, Instagram-friendly', sharedTraitsJa: '濁り、質感、微発泡、素朴な魅力、インスタ映え',
    keyDifference: 'Nigori\'s cloudiness is rice sediment; pét-nat\'s is yeast lees. Both celebrate the unfinished', keyDifferenceJa: 'にごりの濁りは米の澱；ペットナットの濁りは酵母の澱。両者とも未完成を祝う',
  },
  { id: 'junmai-chardonnay', sakeStyle: 'Junmai', sakeStyleJa: '純米',
    wineEquivalent: 'Unoaked Chablis (Chardonnay)', wineEquivalentJa: '樽なしシャブリ（シャルドネ）',
    sharedTraits: 'Pure expression of raw material, mineral, clean, food-friendly versatility', sharedTraitsJa: '原料の純粋な表現、ミネラル、クリーン、食事との万能な相性',
    keyDifference: 'Junmai\'s umami gives it a savory depth that Chablis approaches but never quite reaches', keyDifferenceJa: '純米の旨味はシャブリが近づくが決して到達しない旨味の深みを与える',
  },
  { id: 'sparkling-champagne', sakeStyle: 'Sparkling Sake (Awa Sake)', sakeStyleJa: 'スパークリング日本酒（泡酒）',
    wineEquivalent: 'Grower Champagne', wineEquivalentJa: 'グローワー・シャンパーニュ',
    sharedTraits: 'Fine bubbles, celebration, complexity beneath the fizz, terroir expression', sharedTraitsJa: '細かい泡、祝い、泡の下の複雑さ、テロワールの表現',
    keyDifference: 'Awa sake achieves carbonation through in-bottle fermentation like champagne, but with rice\'s unique umami backbone', keyDifferenceJa: '泡酒はシャンパーニュのように瓶内発酵で炭酸を得るが、米独自の旨味の骨格を持つ',
  },
];

// ============================================================
// 20. ANTI-SCORE MANIFESTO (essay sections)
// ============================================================
export interface ManifestoSection {
  id: string;
  title: string;
  titleJa: string;
  body: string;
  bodyJa: string;
}

export const manifestoSections: ManifestoSection[] = [
  { id: 'opening', title: 'The Tyranny of the Number', titleJa: '数字の専制',
    body: 'A sake rated 92 points is not better than one rated 88. It is merely more agreeable to the palate of the person holding the pen. The 100-point scale — borrowed from wine, borrowed from school exams — reduces a living, breathing, culturally embedded experience to a grade. It is the intellectual equivalent of rating a sunset.',
    bodyJa: '92点の日本酒は88点のものより優れているわけではない。ペンを持つ人の味覚により合致しているだけだ。100点満点の尺度 — ワインから借り、学校の試験から借りた — は、生きて呼吸する文化に根ざした体験を成績に矮小化する。夕焼けを採点するのと知的に同等の行為。',
  },
  { id: 'evi', title: 'EVI: Emotional Volatility Index', titleJa: 'EVI：感情揮発性指数',
    body: 'We propose a different metric. The Emotional Volatility Index measures how much a sake moves you — not whether it\'s "good" or "bad," but whether it makes you feel something. A sake that provokes argument at the dinner table scores higher than one everyone politely agrees is "nice." Volatility is the point. Comfort is the enemy of experience.',
    bodyJa: '我々は異なる指標を提案する。感情揮発性指数は、日本酒があなたをどれだけ動かすかを測る — 「良い」か「悪い」かではなく、何かを感じさせるかどうか。食卓で議論を引き起こす酒は、全員が礼儀正しく「いいね」と同意する酒より高得点。揮発性こそがポイント。快適さは体験の敵。',
  },
  { id: 'eei', title: 'EEI: Existential Engagement Index', titleJa: 'EEI：実存的関与指数',
    body: 'The Existential Engagement Index measures depth of connection. Does this sake make you think about the person who made it? The water that fed the rice? The season it was brewed in? The friend you\'re sharing it with? A sake that opens doors in your mind scores higher than one that merely pleases your tongue. The tongue is a servant. The mind is the master.',
    bodyJa: '実存的関与指数はつながりの深さを測る。この酒は造った人のことを考えさせるか？米を育てた水のことを？醸された季節のことを？一緒に飲んでいる友人のことを？心の扉を開く酒は、単に舌を喜ばせる酒より高得点。舌は召使い。心が主人。',
  },
  { id: 'wabisabi', title: 'The Wabi-Sabi of Flavor', titleJa: '味わいの侘び寂び',
    body: 'The Western rating system demands perfection. Wabi-sabi demands imperfection. A sake with a slight roughness, an unexpected bitterness, a faint wildness — these are not flaws to be penalized. They are the cracks where the gold enters. The most memorable sakes are never the "perfect" ones. They are the ones that surprised you, challenged you, changed you.',
    bodyJa: '西洋の評価システムは完璧を要求する。侘び寂びは不完全を要求する。わずかな粗さ、予期しない苦味、かすかな野性 — これらは減点される欠点ではない。金が入るひびである。最も記憶に残る酒は決して「完璧な」ものではない。あなたを驚かせ、挑戦させ、変えたものだ。',
  },
  { id: 'closing', title: 'Drink Without Counting', titleJa: '数えずに飲め',
    body: 'Put down the scorecard. Pick up the cup. Pour for your friend. Let them pour for you. Notice the weight of the vessel, the color of the liquid, the sound it makes as it fills. Smell before you taste. Taste before you judge. And then — don\'t judge at all. Just be there. The sake is already perfect. The crack in the cup is where the gold enters.',
    bodyJa: 'スコアカードを置け。杯を手に取れ。友に注げ。注いでもらえ。器の重さ、液体の色、満たされる音に気づけ。味わう前に嗅げ。判断する前に味わえ。そして — 判断するな。ただそこにいろ。酒はすでに完璧だ。杯のひびこそ金が入る場所。',
  },
];
