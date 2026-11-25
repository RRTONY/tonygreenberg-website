/*
 * EXV (Experience Value) Rating System + Namazake Deep Data
 * The soul of the site — measuring what sake DOES to you, not what it IS
 * Seven emotional dimensions, six experiential tiers, heptagonal soul prints
 */

// ===================== EXV TYPES =====================

export interface EXVDimension {
  key: string;
  name: string;
  nameJa: string;
  kanji: string;
  description: string;
  descriptionJa: string;
  question: string;
  questionJa: string;
  lowLabel: string;
  lowLabelJa: string;
  highLabel: string;
  highLabelJa: string;
  color: string; // For radar chart
}

export interface EXVScore {
  shogeki: number;   // Impact
  yoin: number;      // Resonance
  monogatari: number; // Story
  hakanasa: number;  // Ephemerality
  basho: number;     // Place
  chowa: number;     // Harmony
  ifu: number;       // Awe
}

export interface EXVTier {
  name: string;
  nameJa: string;
  kanji: string;
  range: [number, number];
  meaning: string;
  meaningJa: string;
  color: string;
  description: string;
  descriptionJa: string;
}

export interface NamazakeBottle {
  id: string;
  name: string;
  nameJa: string;
  brewery: string;
  breweryJa: string;
  prefecture: string;
  prefectureJa: string;
  subtype: 'namanama' | 'namachozo' | 'namazume';
  subtypeJa: string;
  rice: string;
  riceJa: string;
  polishRatio: number;
  abv: number;
  season: string;
  seasonJa: string;
  exv: EXVScore;
  flavorProfile: string;
  flavorProfileJa: string;
  story: string;
  storyJa: string;
  servingTemp: string;
  servingTempJa: string;
  vessel: string;
  vesselJa: string;
  pairingFood: string;
  pairingFoodJa: string;
  whyThisMatters: string;
  whyThisMattersJa: string;
  priceRange: string;
}

export interface NamazakeSubtype {
  key: 'namanama' | 'namachozo' | 'namazume';
  name: string;
  nameJa: string;
  kanji: string;
  pasteurizationSkipped: string;
  pasteurizationSkippedJa: string;
  character: string;
  characterJa: string;
  shelfLife: string;
  shelfLifeJa: string;
  bestSeason: string;
  bestSeasonJa: string;
  analogy: string;
  analogyJa: string;
}

// ===================== EXV DIMENSIONS =====================

export const exvDimensions: EXVDimension[] = [
  {
    key: 'shogeki',
    name: 'Impact',
    nameJa: '衝撃',
    kanji: '衝',
    description: 'The first-sip voltage. How hard does it arrest your attention? Not alcohol burn — emotional arrest. The moment your conversation stops mid-sentence because something just happened in your mouth that demands your full presence.',
    descriptionJa: '最初の一口の衝撃。どれほど強く注意を奪うか。アルコールの刺激ではなく、感情の逮捕。口の中で何かが起こり、会話が途中で止まる瞬間。',
    question: 'Did this sake stop you in your tracks?',
    questionJa: 'この酒はあなたの足を止めたか？',
    lowLabel: 'Gentle whisper',
    lowLabelJa: '静かな囁き',
    highLabel: 'Defibrillator',
    highLabelJa: '除細動器',
    color: 'oklch(0.72 0.20 30)',
  },
  {
    key: 'yoin',
    name: 'Resonance',
    nameJa: '余韻',
    kanji: '韻',
    description: 'The afterlife of the sip. How long does it haunt you? Not aftertaste — afterfeeling. Some sake vanish like morning mist. Others colonize your memory for days. You find yourself thinking about them in the shower.',
    descriptionJa: '一口の余韻。どれほど長く心に残るか。後味ではなく、後感情。朝霧のように消えるものもあれば、何日も記憶に住み着くものもある。',
    question: 'Will you still be thinking about this tomorrow?',
    questionJa: '明日もこの酒のことを考えているだろうか？',
    lowLabel: 'Morning mist',
    lowLabelJa: '朝霧',
    highLabel: 'Haunting',
    highLabelJa: '幽玄',
    color: 'oklch(0.68 0.18 270)',
  },
  {
    key: 'monogatari',
    name: 'Story',
    nameJa: '物語',
    kanji: '語',
    description: 'Every bottle carries a narrative. The toji who left Tokyo to save his grandfather\'s brewery. The rice farmer who refuses to use machines. Story doesn\'t change the chemistry — it changes the experience. Sake with deep monogatari transforms drinking into witnessing.',
    descriptionJa: 'すべての瓶が物語を持つ。東京を離れて祖父の蔵を救った杜氏。機械を使わない米農家。物語は化学を変えないが、体験を変える。深い物語を持つ酒は、飲むことを目撃することに変える。',
    question: 'Does knowing the story change the taste?',
    questionJa: '物語を知ることで味は変わるか？',
    lowLabel: 'Anonymous',
    lowLabelJa: '無名',
    highLabel: 'Epic',
    highLabelJa: '叙事詩',
    color: 'oklch(0.75 0.15 85)',
  },
  {
    key: 'hakanasa',
    name: 'Ephemerality',
    nameJa: '儚さ',
    kanji: '儚',
    description: 'How fleeting is this experience? Can you repeat it? Namazake scores highest — it\'s literally dying as you drink it. A seasonal release you\'ll never find again. High hakanasa means: drink this now, with your whole attention, because it will never exist again.',
    descriptionJa: 'この体験はどれほど儚いか？繰り返せるか？生酒は最高得点 — 飲んでいる間にも変化している。二度と見つからない季節限定品。高い儚さは「今、全注意を注いで飲め。二度と存在しないから」を意味する。',
    question: 'Is this moment unrepeatable?',
    questionJa: 'この瞬間は繰り返せないものか？',
    lowLabel: 'Always available',
    lowLabelJa: '常時入手可能',
    highLabel: 'Once in a lifetime',
    highLabelJa: '一生に一度',
    color: 'oklch(0.70 0.22 330)',
  },
  {
    key: 'basho',
    name: 'Place',
    nameJa: '場所',
    kanji: '場',
    description: 'How strongly does this sake connect you to a specific place on earth? Can you taste the water? Can you feel the prefecture? Some sake are universal. Others are so rooted in their terroir that drinking them is teleportation.',
    descriptionJa: 'この酒はどれほど強く地球上の特定の場所と結びつくか？水の味がわかるか？県を感じるか？普遍的な酒もあれば、テロワールに深く根ざし、飲むことが瞬間移動になる酒もある。',
    question: 'Can you taste where this came from?',
    questionJa: 'これがどこから来たか味わえるか？',
    lowLabel: 'Universal',
    lowLabelJa: '普遍的',
    highLabel: 'Teleportation',
    highLabelJa: '瞬間移動',
    color: 'oklch(0.65 0.18 160)',
  },
  {
    key: 'chowa',
    name: 'Harmony',
    nameJa: '調和',
    kanji: '調',
    description: 'The internal balance of the experience. Not just acid/sweet/umami balance — the harmony between the sake and its ideal context. A rough yamahai scores low on conventional "balance" but scores 10 on chōwa when paired with grilled mackerel in a smoky izakaya.',
    descriptionJa: '体験の内的バランス。酸味/甘味/旨味のバランスだけでなく、酒とその理想的な文脈との調和。荒々しい山廃は従来の「バランス」では低得点だが、煙たい居酒屋で焼き鯖と合わせると調和は10点。',
    question: 'In the right moment, is this perfect?',
    questionJa: '正しい瞬間に、これは完璧か？',
    lowLabel: 'Searching',
    lowLabelJa: '模索中',
    highLabel: 'Perfect fit',
    highLabelJa: '完全一致',
    color: 'oklch(0.72 0.15 200)',
  },
  {
    key: 'ifu',
    name: 'Awe',
    nameJa: '畏怖',
    kanji: '畏',
    description: 'The rarest dimension. The feeling that you\'re in the presence of something that transcends craft and enters art. Not every sake has ifu. Most don\'t. But when you encounter it — a 40-year koshu that tastes like liquid amber and forgotten temples — you know.',
    descriptionJa: '最も稀な次元。技術を超えて芸術に入る何かの前にいるという感覚。すべての酒に畏怖があるわけではない。ほとんどにはない。しかし出会った時 — 液体の琥珀と忘れられた寺のような40年古酒 — わかる。',
    question: 'Does this transcend craft and become art?',
    questionJa: 'これは技術を超えて芸術になっているか？',
    lowLabel: 'Well-made',
    lowLabelJa: '良品',
    highLabel: 'Sacred',
    highLabelJa: '神聖',
    color: 'oklch(0.78 0.12 85)',
  },
];

// ===================== EXV TIERS =====================

export const exvTiers: EXVTier[] = [
  {
    name: 'Kami',
    nameJa: '神',
    kanji: '神',
    range: [90, 100],
    meaning: 'The Realm of Gods',
    meaningJa: '神の領域',
    color: 'oklch(0.65 0.25 25)',
    description: 'Transcendent. The experience rewrites your understanding of what sake can be. You remember this on your deathbed. Fewer than 1% of all sake encounters reach this tier.',
    descriptionJa: '超越的。この体験は酒の可能性に対する理解を書き換える。死の床でも覚えている。全ての酒体験の1%未満がこの段階に達する。',
  },
  {
    name: 'Tamashii',
    nameJa: '魂',
    kanji: '魂',
    range: [75, 89],
    meaning: 'Touches the Soul',
    meaningJa: '魂に触れる',
    color: 'oklch(0.78 0.12 85)',
    description: 'Changes how you think about sake. The experience leaves a permanent mark. You seek it out again, knowing it won\'t be the same. This is where obsession begins.',
    descriptionJa: '酒に対する考え方を変える。体験は永久的な痕跡を残す。同じではないと知りながら再び求める。ここから執着が始まる。',
  },
  {
    name: 'Kokoro',
    nameJa: '心',
    kanji: '心',
    range: [60, 74],
    meaning: 'Moves the Heart',
    meaningJa: '心を動かす',
    color: 'oklch(0.75 0.08 210)',
    description: 'A genuinely meaningful experience. You tell someone about it. You photograph the label. You make a mental note to return. This is excellent sake in excellent context.',
    descriptionJa: '真に意味のある体験。誰かに話す。ラベルを撮影する。また来ようと心に留める。これは優れた文脈における優れた酒。',
  },
  {
    name: 'Waza',
    nameJa: '技',
    kanji: '技',
    range: [45, 59],
    meaning: 'Crystallized Craft',
    meaningJa: '技の結晶',
    color: 'oklch(0.65 0.06 60)',
    description: 'Excellent technique, respectable depth. You appreciate the skill. The experience is satisfying but doesn\'t fundamentally alter your evening. Most award-winning sake lives here.',
    descriptionJa: '優れた技術、立派な深み。技術を評価する。体験は満足だが、根本的に夜を変えない。受賞酒の多くはここに住む。',
  },
  {
    name: 'Michi',
    nameJa: '道',
    kanji: '道',
    range: [30, 44],
    meaning: 'On the Path',
    meaningJa: '道の途中',
    color: 'oklch(0.55 0.04 270)',
    description: 'Honest sake, still finding its voice. Or perhaps the context wasn\'t right. Every journey passes through here. No shame in michi — it\'s where learning happens.',
    descriptionJa: '正直な酒、まだ声を見つけている途中。あるいは文脈が合わなかったのかもしれない。すべての旅はここを通る。道に恥はない — 学びが起こる場所。',
  },
  {
    name: 'Hajime',
    nameJa: '始',
    kanji: '始',
    range: [0, 29],
    meaning: 'First Steps',
    meaningJa: '始まりの一歩',
    color: 'oklch(0.45 0.02 270)',
    description: 'Entry-level experience. But every master was once a beginner, and every great sake journey started with a single unremarkable cup that made someone curious enough to try another.',
    descriptionJa: '入門レベルの体験。しかしすべての達人はかつて初心者であり、すべての偉大な酒の旅は、もう一杯試したいと思わせた一杯の平凡な杯から始まった。',
  },
];

// ===================== NAMAZAKE SUBTYPES =====================

export const namazakeSubtypes: NamazakeSubtype[] = [
  {
    key: 'namanama',
    name: 'Nama-Nama',
    nameJa: '生生',
    kanji: '生生',
    pasteurizationSkipped: 'Both rounds — completely raw',
    pasteurizationSkippedJa: '両方省略 — 完全に生',
    character: 'The wildest expression. Maximum enzyme activity, highest acidity, most vibrant. This is sake at its most alive — still fermenting, still changing, still breathing. The closest thing to drinking directly from the tank.',
    characterJa: '最も野性的な表現。最大の酵素活性、最高の酸味、最も鮮烈。これは最も生きている酒 — まだ発酵し、まだ変化し、まだ呼吸している。タンクから直接飲むことに最も近い。',
    shelfLife: '2-4 months refrigerated. Drink fast.',
    shelfLifeJa: '冷蔵2-4ヶ月。早く飲め。',
    bestSeason: 'Late winter to early spring — when it\'s freshest from the press',
    bestSeasonJa: '晩冬から早春 — 搾りたてが最も新鮮な時',
    analogy: 'If sake were music, nama-nama is a live recording — raw, unedited, with all the beautiful imperfections intact.',
    analogyJa: '酒が音楽なら、生生はライブ録音 — 生、未編集、すべての美しい不完全さがそのまま。',
  },
  {
    key: 'namachozo',
    name: 'Nama-Chozo',
    nameJa: '生貯蔵',
    kanji: '生貯',
    pasteurizationSkipped: 'First round (after pressing) — pasteurized only before bottling',
    pasteurizationSkippedJa: '一回目省略（搾り後）— 瓶詰め前のみ火入れ',
    character: 'The bridge between raw and refined. Aged unpasteurized, then stabilized for bottling. Retains bright, fresh character but with slightly more composure than nama-nama. The Yaoshin brewery (Gangi) makes ALL their sake this way — calling it "sake for sake lovers."',
    characterJa: '生と洗練の架け橋。生のまま熟成し、瓶詰め前に安定化。明るく新鮮な性格を保ちつつ、生生よりやや落ち着きがある。八百新酒造（雁木）は全ての酒をこの方法で造る — 「酒好きのための酒」と呼んで。',
    shelfLife: '4-6 months refrigerated. More forgiving.',
    shelfLifeJa: '冷蔵4-6ヶ月。より寛容。',
    bestSeason: 'Spring through summer — the sweet spot of freshness and stability',
    bestSeasonJa: '春から夏 — 新鮮さと安定性の最適点',
    analogy: 'A studio recording with minimal post-production. The performance is real, just gently shaped.',
    analogyJa: '最小限のポストプロダクションによるスタジオ録音。パフォーマンスは本物、ただ穏やかに形作られただけ。',
  },
  {
    key: 'namazume',
    name: 'Namazume',
    nameJa: '生詰め',
    kanji: '生詰',
    pasteurizationSkipped: 'Second round (before bottling) — pasteurized only after pressing',
    pasteurizationSkippedJa: '二回目省略（瓶詰め前）— 搾り後のみ火入れ',
    character: 'The autumn sage. Pasteurized after pressing to stabilize, then aged for months, then bottled raw. Many hiyaoroshi (autumn sake) are namazume. The result is a sake with matured depth but a fresh, living finish — like wisdom with a youthful spark.',
    characterJa: '秋の賢者。搾り後に火入れして安定化、数ヶ月熟成後、生のまま瓶詰め。多くの冷やおろし（秋酒）は生詰め。結果は熟成した深みと新鮮で生きた余韻を持つ酒 — 若々しい輝きを持つ知恵のように。',
    shelfLife: '3-5 months refrigerated. Best at release.',
    shelfLifeJa: '冷蔵3-5ヶ月。出荷時が最良。',
    bestSeason: 'Autumn — the classic hiyaoroshi season, September through November',
    bestSeasonJa: '秋 — 古典的な冷やおろしの季節、9月から11月',
    analogy: 'A carefully aged wine, decanted just before serving. The patience shows, but the final moment is raw.',
    analogyJa: '丁寧に熟成されたワイン、サーブ直前にデキャンタ。忍耐が見えるが、最後の瞬間は生。',
  },
];

// ===================== NAMAZAKE BOTTLES =====================

export const namazakeBottles: NamazakeBottle[] = [
  {
    id: 'kikusui-funaguchi',
    name: 'Kikusui Funaguchi',
    nameJa: '菊水 ふなぐち',
    brewery: 'Kikusui Brewing Co.',
    breweryJa: '菊水酒造',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Shinnosuke',
    riceJa: '新之助',
    polishRatio: 70,
    abv: 19,
    season: 'Year-round (the pioneer)',
    seasonJa: '通年（パイオニア）',
    exv: { shogeki: 8, yoin: 6, monogatari: 9, hakanasa: 5, basho: 7, chowa: 7, ifu: 7 },
    flavorProfile: 'Bold, honeyed, tropical. Pineapple and lychee with a muscular rice backbone. Unapologetically full-throttle.',
    flavorProfileJa: '大胆、蜂蜜的、トロピカル。パイナップルとライチ、力強い米の骨格。堂々たるフルスロットル。',
    story: 'The bottle that started everything. In the 1970s, Kikusui dared to can unpasteurized sake — something the industry said was impossible. The gold can became iconic. Every namazake that exists today owes a debt to this audacious act of rebellion.',
    storyJa: 'すべてを始めた瓶。1970年代、菊水は業界が不可能と言った生酒の缶詰に挑戦した。金色の缶はアイコンとなった。今日存在するすべての生酒は、この大胆な反逆行為に恩がある。',
    servingTemp: 'Ice cold (5°C). The can from the vending machine.',
    servingTempJa: 'キンキンに冷やして（5°C）。自販機の缶で。',
    vessel: 'Drink from the can. Seriously. That\'s the ritual.',
    vesselJa: '缶のまま飲め。本気で。それが儀式。',
    pairingFood: 'Yakitori with tare sauce, karaage, anything fried and salty',
    pairingFoodJa: 'タレの焼き鳥、唐揚げ、揚げ物全般',
    whyThisMatters: 'Without Funaguchi, namazake might still be a brewery-only secret. This is the Ramones of sake — it didn\'t invent the genre, but it made it accessible to everyone.',
    whyThisMattersJa: 'ふなぐちがなければ、生酒はまだ蔵元だけの秘密だったかもしれない。これは酒のラモーンズ — ジャンルを発明したわけではないが、誰もがアクセスできるようにした。',
    priceRange: '¥300-500',
  },
  {
    id: 'narutotai-ginjo-nama',
    name: 'Narutotai Ginjo Nama Genshu',
    nameJa: '鳴門鯛 吟醸 生原酒',
    brewery: 'Honke Matsuura Shuzō',
    breweryJa: '本家松浦酒造',
    prefecture: 'Tokushima',
    prefectureJa: '徳島',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Yamada Nishiki',
    riceJa: '山田錦',
    polishRatio: 58,
    abv: 18,
    season: 'Spring release',
    seasonJa: '春季限定',
    exv: { shogeki: 7, yoin: 8, monogatari: 9, hakanasa: 7, basho: 8, chowa: 8, ifu: 8 },
    flavorProfile: 'Lush melon, white peach, and a thread of mineral salinity from the Naruto Strait. Genshu power with ginjo grace.',
    flavorProfileJa: '豊かなメロン、白桃、鳴門海峡のミネラル塩味の糸。原酒の力と吟醸の優雅さ。',
    story: 'This bottle appeared in Blade Runner 2049 — the only real sake in a film about what it means to be alive. The irony is perfect: an unpasteurized, living sake in a movie about artificial life. The brewery has been making sake since 1804 on the island of Shikoku.',
    storyJa: 'この瓶はブレードランナー2049に登場した — 生きることの意味を問う映画に登場した唯一の本物の酒。皮肉は完璧：人工生命の映画に、火入れしていない生きた酒。蔵は1804年から四国で酒を造っている。',
    servingTemp: 'Well-chilled (8°C). Let it warm slightly as you drink.',
    servingTempJa: 'よく冷やして（8°C）。飲みながら少し温まるのを許す。',
    vessel: 'Wide-mouth guinomi — let the aroma bloom',
    vesselJa: '口の広いぐい呑み — 香りを開かせる',
    pairingFood: 'Sashimi of white fish, especially tai (sea bream). The mineral notes dance together.',
    pairingFoodJa: '白身魚の刺身、特に鯛。ミネラルの音が一緒に踊る。',
    whyThisMatters: 'A sake that bridges pop culture and deep craft. The Blade Runner connection brings people in; the liquid keeps them. This is gateway namazake for the curious.',
    whyThisMattersJa: 'ポップカルチャーと深い技術を橋渡しする酒。ブレードランナーのつながりが人を引き寄せ、液体が留める。好奇心旺盛な人のための入門生酒。',
    priceRange: '¥1,500-2,200',
  },
  {
    id: 'gangi-namacho-jungin',
    name: 'Gangi Nama-Chozo Junmai Ginjo',
    nameJa: '雁木 生貯蔵 純米吟醸',
    brewery: 'Yaoshin Brewing Co.',
    breweryJa: '八百新酒造',
    prefecture: 'Yamaguchi',
    prefectureJa: '山口',
    subtype: 'namachozo',
    subtypeJa: '生貯蔵',
    rice: 'Yamada Nishiki',
    riceJa: '山田錦',
    polishRatio: 50,
    abv: 16,
    season: 'Year-round (all Gangi is namachozo)',
    seasonJa: '通年（全ての雁木は生貯蔵）',
    exv: { shogeki: 6, yoin: 8, monogatari: 8, hakanasa: 4, basho: 7, chowa: 9, ifu: 7 },
    flavorProfile: 'Elegant pear, white grape, and a silky rice sweetness that lingers like a conversation you didn\'t want to end.',
    flavorProfileJa: '上品な梨、白ぶどう、終わらせたくない会話のように残る絹のような米の甘み。',
    story: 'Yaoshin makes ALL their sake as namachozo. Their philosophy: "We make sake for sake lovers." No compromise, no pasteurized versions. The brewery sits on the Nishiki River in Yamaguchi, and the name "Gangi" refers to the stone steps leading down to the water — where sake barrels were once loaded onto boats.',
    storyJa: '八百新は全ての酒を生貯蔵で造る。哲学：「酒好きのための酒を造る」。妥協なし、火入れ版なし。蔵は山口の錦川沿いにあり、「雁木」は水辺に降りる石段を指す — かつて酒樽が船に積まれた場所。',
    servingTemp: 'Slightly chilled (12°C). Room temperature reveals hidden layers.',
    servingTempJa: 'やや冷やして（12°C）。常温で隠れた層が現れる。',
    vessel: 'Thin-lipped ochoko — precision delivery',
    vesselJa: '薄口のお猪口 — 精密な配達',
    pairingFood: 'Tofu dengaku, grilled vegetables, anything that lets the sake lead',
    pairingFoodJa: '豆腐田楽、焼き野菜、酒が主役になれるもの',
    whyThisMatters: 'The brewery that bet everything on namachozo. In a world of hedged bets and safe choices, Yaoshin said: "This is the only way." That conviction is in every sip.',
    whyThisMattersJa: '生貯蔵に全てを賭けた蔵。安全な選択とヘッジの世界で、八百新は言った：「これが唯一の道」。その確信が一口ごとにある。',
    priceRange: '¥1,800-2,800',
  },
  {
    id: 'kubota-suiju',
    name: 'Kubota Suiju Daiginjo Nama',
    nameJa: '久保田 翠寿 大吟醸 生',
    brewery: 'Asahi Shuzō',
    breweryJa: '朝日酒造',
    prefecture: 'Niigata',
    prefectureJa: '新潟',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Gohyakumangoku',
    riceJa: '五百万石',
    polishRatio: 40,
    abv: 14,
    season: 'Limited spring/summer release',
    seasonJa: '春夏限定',
    exv: { shogeki: 5, yoin: 9, monogatari: 7, hakanasa: 8, basho: 6, chowa: 9, ifu: 8 },
    flavorProfile: 'Ethereal. Like drinking a cloud that tastes of green apple and white flowers. Impossibly light for a daiginjo, with a finish that seems to evaporate rather than end.',
    flavorProfileJa: '幽玄。青りんごと白い花の味がする雲を飲むよう。大吟醸としてはありえないほど軽く、終わるのではなく蒸発するような余韻。',
    story: 'Kubota is one of Japan\'s most famous sake brands, but Suiju is the one they almost didn\'t make. A daiginjo namazake at 14% ABV — the brewers thought it was too delicate to survive outside the brewery. They were almost right. It requires perfect cold chain from Niigata to your glass.',
    storyJa: '久保田は日本で最も有名な酒ブランドの一つだが、翠寿は造らなかったかもしれない酒。14%の大吟醸生酒 — 杜氏たちは蔵の外では繊細すぎて生き残れないと思った。ほぼ正しかった。新潟からあなたのグラスまで完璧なコールドチェーンが必要。',
    servingTemp: 'Cold (7°C). Do not let it warm.',
    servingTempJa: '冷やして（7°C）。温めるな。',
    vessel: 'Crystal-thin wine glass — this is closer to wine than sake',
    vesselJa: '極薄のワイングラス — これはワインに近い酒',
    pairingFood: 'Fresh fruit, light cheese, or nothing at all. Let it stand alone.',
    pairingFoodJa: '新鮮な果物、軽いチーズ、または何もなし。単独で立たせよ。',
    whyThisMatters: 'Proof that namazake isn\'t just about bold, brash flavors. Suiju whispers where Funaguchi shouts. Both are valid. Both are alive.',
    whyThisMattersJa: '生酒が大胆で荒々しい味だけではないことの証明。翠寿はふなぐちが叫ぶところで囁く。どちらも正当。どちらも生きている。',
    priceRange: '¥3,500-5,000',
  },
  {
    id: 'dewazakura-oka-nama',
    name: 'Dewazakura "Oka" Namazake',
    nameJa: '出羽桜 桜花 生酒',
    brewery: 'Dewazakura Shuzō',
    breweryJa: '出羽桜酒造',
    prefecture: 'Yamagata',
    prefectureJa: '山形',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Dewasansan',
    riceJa: '出羽燦々',
    polishRatio: 50,
    abv: 15.5,
    season: 'Spring (sakura season)',
    seasonJa: '春（桜の季節）',
    exv: { shogeki: 6, yoin: 7, monogatari: 8, hakanasa: 9, basho: 9, chowa: 8, ifu: 7 },
    flavorProfile: 'A garden after rain. Rose petals, fresh grass, and a mineral backbone from Yamagata\'s mountain water. The nama version amplifies everything the pasteurized Oka hints at.',
    flavorProfileJa: '雨上がりの庭。バラの花びら、新鮮な草、山形の山水のミネラル骨格。生酒版は火入れの桜花が暗示するすべてを増幅する。',
    story: 'Dewazakura means "cherry blossoms of Dewa" — the ancient name for Yamagata. The nama version is released only during sakura season, making it the most literal expression of spring in a bottle. The brewery uses only Yamagata-grown rice and Yamagata water. This sake IS Yamagata.',
    storyJa: '出羽桜は「出羽の桜」— 山形の古名。生酒版は桜の季節にのみ出荷され、瓶の中の最も文字通りの春の表現。蔵は山形産の米と山形の水のみを使用。この酒は山形そのもの。',
    servingTemp: 'Chilled (10°C). Drink outdoors under cherry blossoms if possible.',
    servingTempJa: '冷やして（10°C）。可能なら桜の下で屋外で飲む。',
    vessel: 'Sakazuki (flat ceremonial cup) — like a petal catching rain',
    vesselJa: '盃（平たい儀式用の杯）— 雨を受ける花びらのように',
    pairingFood: 'Sakura mochi, fresh spring vegetables, hanami bento',
    pairingFoodJa: '桜餅、新鮮な春野菜、花見弁当',
    whyThisMatters: 'The most seasonal sake in existence. Drinking Oka Namazake under cherry blossoms in Yamagata is one of the purest expressions of ichi-go ichi-e. The moment, the place, the liquid — all aligned.',
    whyThisMattersJa: '存在する最も季節的な酒。山形の桜の下で桜花生酒を飲むことは、一期一会の最も純粋な表現の一つ。瞬間、場所、液体 — すべてが一致。',
    priceRange: '¥1,600-2,400',
  },
  {
    id: 'tamagawa-time-machine',
    name: 'Tamagawa "Time Machine" 1712',
    nameJa: '玉川 タイムマシン 1712',
    brewery: 'Kinoshita Shuzō',
    breweryJa: '木下酒造',
    prefecture: 'Kyoto',
    prefectureJa: '京都',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Nihonbare',
    riceJa: '日本晴',
    polishRatio: 88,
    abv: 21,
    season: 'Winter release',
    seasonJa: '冬季出荷',
    exv: { shogeki: 10, yoin: 9, monogatari: 10, hakanasa: 7, basho: 9, chowa: 6, ifu: 10 },
    flavorProfile: 'Absolutely unhinged. Honey, caramel, soy sauce, dried fruit, and a funk that would make a natural winemaker weep with joy. This is sake from another century — literally brewed using a 1712 recipe.',
    flavorProfileJa: '完全に解き放たれた。蜂蜜、キャラメル、醤油、ドライフルーツ、ナチュラルワインメーカーが歓喜の涙を流すファンク。これは別の世紀の酒 — 文字通り1712年のレシピで醸造。',
    story: 'Philip Harper, the first non-Japanese toji in history, brews this using a recipe from 1712 — before modern temperature control, before stainless steel, before everything. The result is sake as it existed 300 years ago: wild, amber, untamed. Harper came to Japan as an English teacher and never left.',
    storyJa: 'フィリップ・ハーパー、歴史上初の非日本人杜氏がこれを1712年のレシピで醸造 — 現代の温度管理以前、ステンレス鋼以前、すべて以前。結果は300年前の酒：野性的、琥珀色、飼いならされていない。ハーパーは英語教師として日本に来て、二度と去らなかった。',
    servingTemp: 'Room temperature or slightly warm (20-40°C). Cold kills its complexity.',
    servingTempJa: '常温またはやや温かく（20-40°C）。冷やすと複雑さが死ぬ。',
    vessel: 'Heavy ceramic guinomi — this sake needs weight beneath it',
    vesselJa: '重い陶器のぐい呑み — この酒は下に重さが必要',
    pairingFood: 'Blue cheese, dark chocolate, miso-glazed anything, or aged gouda',
    pairingFoodJa: 'ブルーチーズ、ダークチョコレート、味噌グレーズ、熟成ゴーダ',
    whyThisMatters: 'The most esoteric namazake in existence. A British toji in rural Kyoto brewing 300-year-old recipes. If this doesn\'t touch your mind and your heart simultaneously, nothing will.',
    whyThisMattersJa: '存在する最も秘教的な生酒。京都の田舎でイギリス人杜氏が300年前のレシピを醸造。これが心と精神に同時に触れなければ、何も触れない。',
    priceRange: '¥1,800-2,500',
  },
  {
    id: 'rihaku-dreamy-clouds',
    name: 'Rihaku "Dreamy Clouds"',
    nameJa: '李白 にごり生酒',
    brewery: 'Rihaku Shuzō',
    breweryJa: '李白酒造',
    prefecture: 'Shimane',
    prefectureJa: '島根',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Gohyakumangoku / Shinnosuke',
    riceJa: '五百万石 / 新之助',
    polishRatio: 59,
    abv: 15,
    season: 'Winter/Spring',
    seasonJa: '冬/春',
    exv: { shogeki: 7, yoin: 6, monogatari: 7, hakanasa: 8, basho: 6, chowa: 7, ifu: 5 },
    flavorProfile: 'Cloudy, creamy, effervescent. Like drinking a snow cloud. Banana, yogurt, and a gentle fizz from active fermentation. Playful and serious at the same time.',
    flavorProfileJa: '濁り、クリーミー、発泡。雪雲を飲むよう。バナナ、ヨーグルト、活発な発酵からの穏やかな泡。遊び心と真剣さが同時に。',
    story: 'Named after the legendary Chinese poet Li Bai (Rihaku in Japanese), who was said to write his greatest poems while drunk. The nigori (cloudy) style combined with nama creates a sake that\'s literally still alive and fizzing — open the bottle carefully, it may overflow with enthusiasm.',
    storyJa: '伝説的な中国の詩人李白にちなんで名付けられた。酔いながら最高の詩を書いたと言われる。にごりスタイルと生の組み合わせは、文字通りまだ生きて泡立っている酒を生む — 慎重に開けよ、熱意で溢れるかもしれない。',
    servingTemp: 'Very cold (5°C). The fizz needs cold.',
    servingTempJa: 'とても冷たく（5°C）。泡には冷たさが必要。',
    vessel: 'Tall glass — watch the clouds swirl',
    vesselJa: '背の高いグラス — 雲が渦巻くのを見る',
    pairingFood: 'Spicy Thai food, Korean fried chicken, anything with heat',
    pairingFoodJa: 'スパイシーなタイ料理、韓国フライドチキン、辛いもの全般',
    whyThisMatters: 'The gateway drug. If someone says they don\'t like sake, hand them Dreamy Clouds. The fizz, the sweetness, the clouds — it\'s impossible to resist. And then they\'re in.',
    whyThisMattersJa: '入門の扉。酒が好きじゃないと言う人にDreamy Cloudsを渡せ。泡、甘さ、雲 — 抵抗は不可能。そして彼らは中に入る。',
    priceRange: '¥1,400-2,000',
  },
  {
    id: 'tedorigawa-yoshidagura-nama',
    name: 'Tedorigawa Yoshidagura-U Nama',
    nameJa: '手取川 吉田蔵う 生',
    brewery: 'Yoshida Shuzōten',
    breweryJa: '吉田酒造店',
    prefecture: 'Ishikawa',
    prefectureJa: '石川',
    subtype: 'namanama',
    subtypeJa: '生生',
    rice: 'Yamada Nishiki',
    riceJa: '山田錦',
    polishRatio: 45,
    abv: 16,
    season: 'Limited winter release',
    seasonJa: '冬季限定',
    exv: { shogeki: 7, yoin: 9, monogatari: 8, hakanasa: 9, basho: 10, chowa: 9, ifu: 8 },
    flavorProfile: 'Mineral-driven purity. The Tedori River\'s snowmelt is in every sip — clean, crystalline, with layers of pear and rice that unfold slowly. This is what water tastes like when it becomes sake.',
    flavorProfileJa: 'ミネラル主導の純粋さ。手取川の雪解け水が一口ごとに — 清らか、結晶のよう、梨と米の層がゆっくり開く。これは水が酒になった時の味。',
    story: 'Named after the Tedori River that flows from Mount Hakusan, one of Japan\'s three sacred mountains. The water is so pure that the brewery barely needs to filter. The "U" in the name is a playful addition by the young generation — a wink that says tradition can have humor.',
    storyJa: '日本三名山の一つ白山から流れる手取川にちなんで名付けられた。水は非常に純粋で、蔵はほとんど濾過する必要がない。名前の「う」は若い世代による遊び心のある追加 — 伝統にもユーモアがあるという目配せ。',
    servingTemp: 'Chilled (8-10°C). Let the mineral notes sing.',
    servingTempJa: '冷やして（8-10°C）。ミネラルの音を歌わせよ。',
    vessel: 'Glass ochoko — transparency matches the sake\'s purity',
    vesselJa: 'ガラスのお猪口 — 透明さが酒の純粋さに合う',
    pairingFood: 'Kani (crab) from the Sea of Japan, especially zuwaigani',
    pairingFoodJa: '日本海の蟹、特にずわいがに',
    whyThisMatters: 'The highest basho score in the collection. You don\'t just drink this sake — you drink Ishikawa. The sacred mountain, the river, the snow. Geography in liquid form.',
    whyThisMattersJa: 'コレクション中最高の場所スコア。この酒を飲むだけではない — 石川を飲む。聖なる山、川、雪。液体の地理学。',
    priceRange: '¥2,500-3,800',
  },
];

// ===================== HELPER FUNCTIONS =====================

export function calculateEXV(scores: EXVScore): number {
  // Weighted: awe counts double, ephemerality counts 1.5x
  const weighted = scores.shogeki + scores.yoin + scores.monogatari +
    (scores.hakanasa * 1.5) + scores.basho + scores.chowa + (scores.ifu * 2);
  const maxWeighted = 10 * 8.5; // 7 dimensions, with 2x and 1.5x weights
  return Math.round((weighted / maxWeighted) * 100);
}

export function getEXVTier(score: number): EXVTier {
  return exvTiers.find(t => score >= t.range[0] && score <= t.range[1]) || exvTiers[exvTiers.length - 1];
}

export function getRadarData(scores: EXVScore): { dimension: string; dimensionJa: string; value: number; key: string }[] {
  return exvDimensions.map(d => ({
    dimension: d.name,
    dimensionJa: d.nameJa,
    value: scores[d.key as keyof EXVScore],
    key: d.key,
  }));
}
