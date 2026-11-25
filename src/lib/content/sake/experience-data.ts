/*
 * Experience Data — EXV Builder, Longevity Recipes, Sake Profile Quiz
 * Data module for three interactive features
 */

// ============================================================
// EXV BUILDER — Build Your Own Soul Print
// ============================================================

export interface EXVDimension {
  key: string;
  name: string;
  nameJa: string;
  kanji: string;
  description: string;
  descriptionJa: string;
  lowLabel: string;
  lowLabelJa: string;
  highLabel: string;
  highLabelJa: string;
  guideQuestion: string;
  guideQuestionJa: string;
  color: string;
}

export const exvDimensions: EXVDimension[] = [
  {
    key: 'impact',
    name: 'Impact',
    nameJa: '衝撃',
    kanji: '衝',
    description: 'The first-sip shock. Did it stop your thoughts? Did it make you close your eyes?',
    descriptionJa: '最初の一口の衝撃。思考が止まったか？目を閉じたか？',
    lowLabel: 'Gentle whisper',
    lowLabelJa: '静かな囁き',
    highLabel: 'Lightning strike',
    highLabelJa: '雷鳴',
    guideQuestion: 'When you first tasted it, did the world pause — even for a heartbeat?',
    guideQuestionJa: '初めて味わった時、世界は一瞬でも止まったか？',
    color: '#e74c3c',
  },
  {
    key: 'resonance',
    name: 'Resonance',
    nameJa: '余韻',
    kanji: '韻',
    description: 'The afterglow. How long does it stay with you after the last drop? Hours? Days?',
    descriptionJa: '余韻。最後の一滴の後、どれだけ長く残るか？数時間？数日？',
    lowLabel: 'Brief echo',
    lowLabelJa: '短い残響',
    highLabel: 'Eternal reverb',
    highLabelJa: '永遠の残響',
    guideQuestion: 'Can you still taste it when you think about it tomorrow?',
    guideQuestionJa: '明日思い出した時、まだ味わえるか？',
    color: '#3498db',
  },
  {
    key: 'story',
    name: 'Story',
    nameJa: '物語',
    kanji: '語',
    description: 'The narrative depth. Does knowing who made it, where, and why change the taste?',
    descriptionJa: '物語の深さ。誰が、どこで、なぜ作ったかを知ることで味が変わるか？',
    lowLabel: 'Anonymous craft',
    lowLabelJa: '匿名の技',
    highLabel: 'Epic saga',
    highLabelJa: '壮大な物語',
    guideQuestion: 'Does the story behind this sake make it taste different than if you knew nothing?',
    guideQuestionJa: 'この酒の背景を知ることで、何も知らない時と味が変わるか？',
    color: '#9b59b6',
  },
  {
    key: 'ephemerality',
    name: 'Ephemerality',
    nameJa: '儚さ',
    kanji: '儚',
    description: 'The awareness of impermanence. Is this moment unrepeatable? Is this bottle finite?',
    descriptionJa: '無常の自覚。この瞬間は繰り返せないか？この瓶は有限か？',
    lowLabel: 'Always available',
    lowLabelJa: 'いつでも手に入る',
    highLabel: 'Once in a lifetime',
    highLabelJa: '一生に一度',
    guideQuestion: 'If this bottle disappeared forever tomorrow, would it haunt you?',
    guideQuestionJa: 'この瓶が明日永遠に消えたら、心に残るか？',
    color: '#1abc9c',
  },
  {
    key: 'place',
    name: 'Place',
    nameJa: '場所',
    kanji: '場',
    description: 'The terroir of the moment. Does where you drink it transform the experience?',
    descriptionJa: '瞬間のテロワール。どこで飲むかが体験を変えるか？',
    lowLabel: 'Context-free',
    lowLabelJa: '場所を選ばない',
    highLabel: 'Inseparable from place',
    highLabelJa: '場所と不可分',
    guideQuestion: 'Would this sake taste the same in a fluorescent kitchen as in a Kyoto machiya?',
    guideQuestionJa: 'この酒は蛍光灯のキッチンでも京都の町家でも同じ味がするか？',
    color: '#f39c12',
  },
  {
    key: 'harmony',
    name: 'Harmony',
    nameJa: '調和',
    kanji: '和',
    description: 'The internal balance. Do all elements — aroma, texture, flavor, finish — speak as one voice?',
    descriptionJa: '内なるバランス。香り、質感、味、余韻 — すべてが一つの声として語るか？',
    lowLabel: 'Dissonant notes',
    lowLabelJa: '不協和音',
    highLabel: 'Perfect chord',
    highLabelJa: '完璧な和音',
    guideQuestion: 'Does every element of this sake feel like it belongs, or does something stick out?',
    guideQuestionJa: 'この酒のすべての要素が調和しているか、それとも何かが突出しているか？',
    color: '#2ecc71',
  },
  {
    key: 'awe',
    name: 'Awe',
    nameJa: '畏怖',
    kanji: '畏',
    description: 'The transcendent dimension. Does it make you feel small in the best way? Connected to something larger?',
    descriptionJa: '超越的な次元。最高の意味で自分の小ささを感じるか？より大きなものとのつながりを感じるか？',
    lowLabel: 'Pleasant drink',
    lowLabelJa: '心地よい飲み物',
    highLabel: 'Sacred experience',
    highLabelJa: '神聖な体験',
    guideQuestion: 'Did this sake make you feel grateful to be alive, even for a moment?',
    guideQuestionJa: 'この酒は、一瞬でも生きていることへの感謝を感じさせたか？',
    color: '#e67e22',
  },
];

export interface EXVTier {
  name: string;
  nameJa: string;
  kanji: string;
  range: [number, number];
  description: string;
  descriptionJa: string;
  color: string;
}

export const exvTiers: EXVTier[] = [
  { name: 'KAMI', nameJa: '神', kanji: '神', range: [60, 70], description: 'Realm of gods. Sake that transcends the category.', descriptionJa: '神の領域。カテゴリーを超越した酒。', color: '#c9a227' },
  { name: 'MEIJIN', nameJa: '名人', kanji: '名', range: [50, 59], description: 'Master level. Profound and unforgettable.', descriptionJa: '名人の域。深遠で忘れられない。', color: '#b8860b' },
  { name: 'TAKUMI', nameJa: '匠', kanji: '匠', range: [40, 49], description: 'Artisan craft. Excellence with distinctive character.', descriptionJa: '匠の技。独特の個性を持つ卓越。', color: '#a0522d' },
  { name: 'SHOKUNIN', nameJa: '職人', kanji: '職', range: [30, 39], description: 'Skilled craft. Reliable quality with moments of brilliance.', descriptionJa: '職人の仕事。確かな品質と輝きの瞬間。', color: '#708090' },
  { name: 'TANOSHII', nameJa: '楽', kanji: '楽', range: [15, 29], description: 'Enjoyable. Solid sake that brings genuine pleasure.', descriptionJa: '楽しい。純粋な喜びをもたらす確かな酒。', color: '#6b8e23' },
  { name: 'HAJIME', nameJa: '始', kanji: '始', range: [0, 14], description: 'Beginning. Every journey starts here.', descriptionJa: '始まり。すべての旅はここから。', color: '#4682b4' },
];

// ============================================================
// LONGEVITY RECIPES — Sake × Nutrition Synergy
// ============================================================

export interface LongevityRecipe {
  name: string;
  nameJa: string;
  category: 'morning' | 'pairing' | 'cooking' | 'beauty' | 'fermented';
  description: string;
  descriptionJa: string;
  ingredients: { item: string; itemJa: string; amount: string }[];
  benefits: string[];
  benefitsJa: string[];
  aminoAcidBoost: string[];
  sakeConnection: string;
  sakeConnectionJa: string;
  preparation: string;
  preparationJa: string;
  scienceNote: string;
  scienceNoteJa: string;
  icon: string;
}

export const longevityRecipes: LongevityRecipe[] = [
  {
    name: 'Morning Amazake Elixir',
    nameJa: '朝の甘酒エリクシル',
    category: 'morning',
    description: 'The "drinkable IV" that Japanese mothers have given their children for centuries. Non-alcoholic, probiotic, packed with B vitamins and all 9 essential amino acids.',
    descriptionJa: '何世紀にもわたり日本の母親が子供に与えてきた「飲む点滴」。ノンアルコール、プロバイオティクス、ビタミンB群と9つの必須アミノ酸が豊富。',
    ingredients: [
      { item: 'Fresh koji rice', itemJa: '生の米麹', amount: '200g' },
      { item: 'Filtered water', itemJa: '浄水', amount: '400ml' },
      { item: 'Fresh ginger', itemJa: '生姜', amount: '1 slice' },
      { item: 'Yuzu zest', itemJa: '柚子の皮', amount: 'pinch' },
    ],
    benefits: ['Gut microbiome restoration', 'Natural energy without caffeine', 'Skin hydration from within', 'Complete amino acid profile'],
    benefitsJa: ['腸内フローラの回復', 'カフェインなしの自然なエネルギー', '内側からの肌の保湿', '完全なアミノ酸プロファイル'],
    aminoAcidBoost: ['All 9 essential', 'Glutamine', 'Cysteine'],
    sakeConnection: 'Amazake is sake\'s non-alcoholic ancestor — same koji fermentation, same amino acid magic, zero alcohol.',
    sakeConnectionJa: '甘酒は酒のノンアルコールの祖先 — 同じ麹発酵、同じアミノ酸の魔法、アルコールゼロ。',
    preparation: 'Mix koji and water in a rice cooker. Hold at 55-60°C for 8 hours (use "keep warm" setting). The enzymes break rice starch into natural glucose. Blend smooth. Add ginger and yuzu. Serve warm or chilled.',
    preparationJa: '麹と水を炊飯器に入れる。55-60°Cで8時間保温（保温設定を使用）。酵素が米のでんぷんを天然のブドウ糖に分解。滑らかにブレンド。生姜と柚子を加える。温かくても冷たくても。',
    scienceNote: 'Koji produces over 100 enzymes during fermentation, including amylase, protease, and lipase. These pre-digest nutrients, making them 90%+ bioavailable — far exceeding most supplements.',
    scienceNoteJa: '麹は発酵中に100以上の酵素を生産する。アミラーゼ、プロテアーゼ、リパーゼなど。これらが栄養素を事前消化し、90%以上の生体利用率を実現 — ほとんどのサプリメントを大幅に上回る。',
    icon: '🌅',
  },
  {
    name: 'Sake Kasu Power Bowl',
    nameJa: '酒粕パワーボウル',
    category: 'morning',
    description: 'Sake lees (kasu) are the nutritional goldmine left after pressing. More concentrated amino acids than the sake itself. The breakfast of Okinawan centenarians.',
    descriptionJa: '酒粕は搾りの後に残る栄養の宝庫。酒そのものより濃縮されたアミノ酸。沖縄の百寿者の朝食。',
    ingredients: [
      { item: 'Fresh sake kasu', itemJa: '生酒粕', amount: '50g' },
      { item: 'Warm dashi', itemJa: '温かい出汁', amount: '200ml' },
      { item: 'White miso', itemJa: '白味噌', amount: '1 tbsp' },
      { item: 'Silken tofu', itemJa: '絹ごし豆腐', amount: '100g' },
      { item: 'Seasonal vegetables', itemJa: '季節の野菜', amount: 'handful' },
    ],
    benefits: ['Resistant protein for satiety', 'ACE-inhibitory peptides (blood pressure)', 'Conjugated linoleic acid', 'Dietary fiber from rice solids'],
    benefitsJa: ['満腹感のためのレジスタントプロテイン', 'ACE阻害ペプチド（血圧）', '共役リノール酸', '米固形物からの食物繊維'],
    aminoAcidBoost: ['Leucine', 'Valine', 'Arginine'],
    sakeConnection: 'Sake kasu contains everything the sake left behind — concentrated proteins, fiber, and bioactive peptides at 3-5x the concentration of the liquid.',
    sakeConnectionJa: '酒粕は酒が残したすべてを含む — 濃縮されたタンパク質、繊維、生理活性ペプチドが液体の3-5倍の濃度。',
    preparation: 'Dissolve kasu in warm dashi, stirring until smooth. Add miso. Gently warm (don\'t boil — preserves enzymes). Cube tofu, blanch vegetables. Assemble in a bowl. Garnish with shiso and sesame.',
    preparationJa: '酒粕を温かい出汁に溶かし、滑らかになるまで混ぜる。味噌を加える。優しく温める（沸騰させない — 酵素を保存）。豆腐を角切り、野菜を湯通し。器に盛り付け。紫蘇とごまで飾る。',
    scienceNote: 'Sake kasu contains α-EG (alpha-ethyl glucoside), shown in Kobe University research to activate collagen production in dermal fibroblasts. It\'s why sake brewers have famously beautiful hands.',
    scienceNoteJa: '酒粕にはα-EG（アルファエチルグルコシド）が含まれ、神戸大学の研究で真皮線維芽細胞のコラーゲン生産を活性化することが示されている。酒蔵の人の手が美しいことで有名な理由。',
    icon: '🥣',
  },
  {
    name: 'Kasuzuke — Sake Lees Marinade',
    nameJa: '粕漬け',
    category: 'cooking',
    description: 'The ancient preservation technique that turns fish and vegetables into umami bombs while infusing them with sake\'s amino acid arsenal.',
    descriptionJa: '魚や野菜をうまみ爆弾に変えながら、酒のアミノ酸を注入する古代の保存技術。',
    ingredients: [
      { item: 'Sake kasu', itemJa: '酒粕', amount: '500g' },
      { item: 'White miso', itemJa: '白味噌', amount: '100g' },
      { item: 'Mirin', itemJa: 'みりん', amount: '3 tbsp' },
      { item: 'Fresh fish (cod, salmon, or sea bream)', itemJa: '鮮魚（鱈、鮭、鯛）', amount: '4 fillets' },
    ],
    benefits: ['Deep umami without MSG', 'Protein tenderization via enzymes', 'Natural preservation', 'Amino acid infusion into food'],
    benefitsJa: ['MSGなしの深いうまみ', '酵素によるタンパク質の軟化', '天然の保存', '食品へのアミノ酸注入'],
    aminoAcidBoost: ['Glutamic acid', 'Aspartic acid', 'Alanine'],
    sakeConnection: 'Kasuzuke is the bridge between sake as drink and sake as medicine. The same fermentation that creates the liquid also creates the most nutritious marinade in existence.',
    sakeConnectionJa: '粕漬けは飲み物としての酒と薬としての酒の架け橋。液体を生み出す同じ発酵が、存在する中で最も栄養価の高いマリネを生み出す。',
    preparation: 'Mix kasu, miso, and mirin into a smooth paste. Pat fish dry, coat generously. Wrap in cheesecloth, place in kasu bed. Refrigerate 2-3 days. Scrape off excess, grill over charcoal until edges caramelize.',
    preparationJa: '酒粕、味噌、みりんを滑らかなペーストに混ぜる。魚の水気を拭き、たっぷり塗る。ガーゼに包み、粕床に置く。2-3日冷蔵。余分を取り除き、炭火で端がキャラメル化するまで焼く。',
    scienceNote: 'The Maillard reaction between sake kasu amino acids and fish proteins during grilling creates unique flavor compounds (pyrazines, furanones) that don\'t exist in any other cooking method.',
    scienceNoteJa: '焼き上げ中の酒粕アミノ酸と魚のタンパク質のメイラード反応が、他の調理法には存在しない独特の風味化合物（ピラジン、フラノン）を生成する。',
    icon: '🐟',
  },
  {
    name: 'Sake Bath — Nihonshu Buro',
    nameJa: '日本酒風呂',
    category: 'beauty',
    description: 'Pour 2-3 cups of sake into your bath. Not a luxury — a biochemical delivery system. Kojic acid, amino acids, and α-EG absorb through skin at 10x the rate of oral consumption.',
    descriptionJa: '風呂に2-3合の酒を注ぐ。贅沢ではなく、生化学的デリバリーシステム。コウジ酸、アミノ酸、α-EGが経口摂取の10倍の速度で皮膚から吸収される。',
    ingredients: [
      { item: 'Junmai sake (futsu-shu works fine)', itemJa: '純米酒（普通酒でも可）', amount: '360-540ml' },
      { item: 'Bath water at 38-40°C', itemJa: '38-40°Cの湯', amount: 'full tub' },
      { item: 'Hinoki wood chips (optional)', itemJa: '檜のチップ（任意）', amount: 'handful' },
    ],
    benefits: ['Kojic acid brightens skin', 'α-EG stimulates collagen', 'Amino acids hydrate deeply', 'Improved circulation and warmth retention'],
    benefitsJa: ['コウジ酸が肌を明るくする', 'α-EGがコラーゲンを刺激', 'アミノ酸が深く保湿', '血行改善と保温効果'],
    aminoAcidBoost: ['Serine', 'Proline', 'Glycine'],
    sakeConnection: 'Sake brewers\' hands are famously soft and youthful — they\'re literally bathing in amino acids and kojic acid all day. The nihonshu buro brings that effect to your whole body.',
    sakeConnectionJa: '酒蔵の人の手は柔らかく若々しいことで有名 — 文字通り一日中アミノ酸とコウジ酸に浸かっている。日本酒風呂はその効果を全身にもたらす。',
    preparation: 'Fill bath to 38-40°C. Add sake. Soak for 15-20 minutes. The slight alcohol opens pores, allowing amino acids to penetrate. Pat dry gently — don\'t rinse. Your skin will feel like silk.',
    preparationJa: '38-40°Cの湯を張る。酒を加える。15-20分浸かる。わずかなアルコールが毛穴を開き、アミノ酸の浸透を促す。優しく拭く — 洗い流さない。肌が絹のように感じる。',
    scienceNote: 'A 2018 study in the Journal of Dermatological Science found that kojic acid at concentrations present in sake effectively inhibits tyrosinase, the enzyme responsible for melanin overproduction and age spots.',
    scienceNoteJa: 'Journal of Dermatological Scienceの2018年の研究で、酒に含まれる濃度のコウジ酸がチロシナーゼ（メラニン過剰生産とシミの原因酵素）を効果的に阻害することが判明。',
    icon: '🛁',
  },
  {
    name: 'Nukazuke with Sake Kasu',
    nameJa: '酒粕入りぬか漬け',
    category: 'fermented',
    description: 'Add sake kasu to your nuka (rice bran) pickling bed. Double fermentation creates a probiotic powerhouse that no supplement can match.',
    descriptionJa: 'ぬか床に酒粕を加える。二重発酵がどのサプリメントにも匹敵しないプロバイオティクスの宝庫を生み出す。',
    ingredients: [
      { item: 'Nuka (rice bran)', itemJa: 'ぬか', amount: '1kg' },
      { item: 'Sake kasu', itemJa: '酒粕', amount: '200g' },
      { item: 'Sea salt', itemJa: '海塩', amount: '130g' },
      { item: 'Kombu', itemJa: '昆布', amount: '10cm strip' },
      { item: 'Seasonal vegetables', itemJa: '季節の野菜', amount: 'daily rotation' },
    ],
    benefits: ['Lactobacillus diversity', 'Vitamin K2 production', 'Enhanced mineral absorption', 'Gut-brain axis support'],
    benefitsJa: ['乳酸菌の多様性', 'ビタミンK2の生産', 'ミネラル吸収の向上', '腸脳軸のサポート'],
    aminoAcidBoost: ['GABA', 'Tryptophan', 'Glutamic acid'],
    sakeConnection: 'Nuka + sake kasu = the most complex fermentation ecosystem you can create at home. The koji enzymes in kasu supercharge the lactobacillus cultures in the nuka bed.',
    sakeConnectionJa: 'ぬか＋酒粕＝自宅で作れる最も複雑な発酵エコシステム。酒粕の麹酵素がぬか床の乳酸菌培養を強化する。',
    preparation: 'Toast nuka in dry pan until fragrant. Mix with salt and water to mud consistency. Knead in sake kasu. Add kombu and dried chili. Bury vegetables daily, stir bed with bare hands (your microbiome feeds it). Ready in 12-24 hours.',
    preparationJa: '乾いたフライパンでぬかを香りが立つまで炒る。塩と水で泥状に混ぜる。酒粕を練り込む。昆布と乾燥唐辛子を加える。毎日野菜を埋め、素手で床をかき混ぜる（あなたのマイクロバイオームが床を育てる）。12-24時間で完成。',
    scienceNote: 'The combination of Aspergillus oryzae (koji) and Lactobacillus (nuka) creates a symbiotic fermentation that produces GABA — the neurotransmitter responsible for calm, focused states. This is why Japanese village elders who maintain nuka beds report better sleep and lower anxiety.',
    scienceNoteJa: 'Aspergillus oryzae（麹）とLactobacillus（ぬか）の組み合わせが共生発酵を生み出し、GABA — 穏やかで集中した状態を担う神経伝達物質 — を生産する。ぬか床を維持する日本の村の長老がより良い睡眠と低い不安を報告する理由。',
    icon: '🥒',
  },
  {
    name: 'Sake-Steamed Seasonal Fish',
    nameJa: '酒蒸し',
    category: 'cooking',
    description: 'Sakamushi — the simplest, most elegant cooking technique. Steam fish with sake and the amino acids penetrate the protein, creating umami from within.',
    descriptionJa: '酒蒸し — 最もシンプルで最もエレガントな調理技法。酒で魚を蒸し、アミノ酸がタンパク質に浸透し、内側からうまみを生み出す。',
    ingredients: [
      { item: 'White fish or clams', itemJa: '白身魚またはあさり', amount: '300g' },
      { item: 'Junmai sake', itemJa: '純米酒', amount: '100ml' },
      { item: 'Kombu', itemJa: '昆布', amount: '5cm' },
      { item: 'Ginger', itemJa: '生姜', amount: '3 slices' },
      { item: 'Spring onion', itemJa: '長ネギ', amount: '1 stalk' },
    ],
    benefits: ['Alcohol evaporates, amino acids remain', 'Protein becomes more digestible', 'Natural glutamate enhancement', 'Low-calorie, high-nutrition cooking'],
    benefitsJa: ['アルコールは蒸発、アミノ酸は残る', 'タンパク質がより消化しやすくなる', '天然グルタミン酸の増強', '低カロリー、高栄養の調理'],
    aminoAcidBoost: ['Glutamic acid', 'Glycine', 'Alanine'],
    sakeConnection: 'When sake is heated, the alcohol evaporates but the amino acids concentrate. Sakamushi is essentially amino acid therapy delivered through the most delicious medium possible.',
    sakeConnectionJa: '酒を加熱するとアルコールは蒸発するがアミノ酸は濃縮される。酒蒸しは本質的に、最も美味しい媒体を通じて届けられるアミノ酸療法。',
    preparation: 'Place kombu in pot. Lay fish on top. Add sake, ginger, and a pinch of salt. Cover tightly. Steam over medium heat for 8-10 minutes. The fish will be impossibly tender. Garnish with spring onion and a drop of ponzu.',
    preparationJa: '鍋に昆布を敷く。魚を乗せる。酒、生姜、塩少々を加える。しっかり蓋をする。中火で8-10分蒸す。魚は信じられないほど柔らかくなる。長ネギとポン酢一滴で飾る。',
    scienceNote: 'At 78.3°C, ethanol evaporates while amino acids (boiling points 200-300°C) remain fully intact. Steaming at sake\'s natural alcohol content (15-16%) creates the perfect amino acid delivery temperature.',
    scienceNoteJa: '78.3°Cでエタノールは蒸発するが、アミノ酸（沸点200-300°C）は完全に残る。酒の天然アルコール度数（15-16%）での蒸しが完璧なアミノ酸デリバリー温度を生み出す。',
    icon: '🫕',
  },
];

export const recipeCategories = [
  { key: 'morning', name: 'Morning Rituals', nameJa: '朝の儀式', icon: '🌅' },
  { key: 'cooking', name: 'Cooking with Sake', nameJa: '酒で料理', icon: '🔥' },
  { key: 'fermented', name: 'Fermented Synergy', nameJa: '発酵のシナジー', icon: '🧫' },
  { key: 'beauty', name: 'Beauty & Body', nameJa: '美容と身体', icon: '✨' },
];

// ============================================================
// SAKE PROFILE QUIZ — Find Your Sake Soul
// ============================================================

export interface QuizQuestion {
  id: number;
  question: string;
  questionJa: string;
  context: string;
  contextJa: string;
  options: {
    text: string;
    textJa: string;
    scores: Record<string, number>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'It\'s your first sip of the evening. What are you reaching for?',
    questionJa: '夕方の最初の一口。何に手を伸ばす？',
    context: 'This reveals your instinctive flavor gravity.',
    contextJa: 'これはあなたの本能的な味覚の重力を明らかにする。',
    options: [
      { text: 'Something crisp and electric — like biting into a cold apple', textJa: '冷たいリンゴをかじるような、爽やかで電撃的なもの', scores: { light: 3, dry: 2, aromatic: 1 } },
      { text: 'Something warm and enveloping — like a cashmere blanket', textJa: 'カシミアの毛布のような、温かく包み込むもの', scores: { rich: 3, umami: 2, aged: 1 } },
      { text: 'Something wild and unpredictable — surprise me', textJa: '野性的で予測不能なもの — 驚かせて', scores: { funky: 3, nama: 2, natural: 1 } },
      { text: 'Something elegant and precise — a single perfect note', textJa: 'エレガントで精密なもの — 一つの完璧な音', scores: { refined: 3, aromatic: 2, daiginjo: 1 } },
    ],
  },
  {
    id: 2,
    question: 'You\'re walking through a Japanese market at dawn. What pulls you in?',
    questionJa: '夜明けの日本の市場を歩いている。何に引き寄せられる？',
    context: 'Your sensory magnetism maps to sake aroma families.',
    contextJa: 'あなたの感覚的な引力は酒の香りのファミリーに対応する。',
    options: [
      { text: 'The flower stall — white peach blossoms and jasmine', textJa: '花屋 — 白桃の花とジャスミン', scores: { aromatic: 3, daiginjo: 2, light: 1 } },
      { text: 'The fish counter — ocean spray and fresh seaweed', textJa: '魚屋 — 潮風と新鮮な海藻', scores: { umami: 3, dry: 2, mineral: 1 } },
      { text: 'The rice shop — warm, toasted grain and straw', textJa: '米屋 — 温かい、焼いた穀物と藁', scores: { rich: 3, junmai: 2, aged: 1 } },
      { text: 'The pickle vendor — funky, alive, fermenting', textJa: '漬物屋 — ファンキーで、生きていて、発酵している', scores: { funky: 3, natural: 2, nama: 1 } },
    ],
  },
  {
    id: 3,
    question: 'How do you take your coffee?',
    questionJa: 'コーヒーはどう飲む？',
    context: 'Coffee preference is a surprisingly accurate predictor of sake preference.',
    contextJa: 'コーヒーの好みは驚くほど正確な酒の好みの予測因子。',
    options: [
      { text: 'Black, single origin, pour-over — I want to taste the terroir', textJa: 'ブラック、シングルオリジン、ハンドドリップ — テロワールを味わいたい', scores: { refined: 3, dry: 2, mineral: 1 } },
      { text: 'Oat milk latte with a touch of honey', textJa: 'オーツミルクラテにハチミツ少々', scores: { light: 2, aromatic: 2, sweet: 2 } },
      { text: 'Espresso — short, intense, no nonsense', textJa: 'エスプレッソ — 短く、強く、無駄なし', scores: { rich: 3, umami: 2, aged: 1 } },
      { text: 'I don\'t drink coffee — tea, please', textJa: 'コーヒーは飲まない — お茶をお願い', scores: { light: 3, aromatic: 1, refined: 2 } },
    ],
  },
  {
    id: 4,
    question: 'You\'re choosing music for a late night alone. What plays?',
    questionJa: '一人の夜更けに音楽を選ぶ。何をかける？',
    context: 'Musical taste correlates with texture preference in sake.',
    contextJa: '音楽の好みは酒のテクスチャーの好みと相関する。',
    options: [
      { text: 'Ryuichi Sakamoto — sparse piano, infinite space', textJa: '坂本龍一 — 疎らなピアノ、無限の空間', scores: { refined: 3, light: 2, daiginjo: 1 } },
      { text: 'Miles Davis — Kind of Blue — warm, smoky, modal', textJa: 'マイルス・デイヴィス — Kind of Blue — 温かく、スモーキー、モーダル', scores: { rich: 3, aged: 2, umami: 1 } },
      { text: 'Boris — heavy, distorted, overwhelming', textJa: 'Boris — ヘヴィー、歪み、圧倒的', scores: { funky: 3, nama: 2, natural: 1 } },
      { text: 'Debussy — impressionistic, flowing, dreamlike', textJa: 'ドビュッシー — 印象派的、流れるような、夢のような', scores: { aromatic: 3, sweet: 2, light: 1 } },
    ],
  },
  {
    id: 5,
    question: 'What season makes you feel most alive?',
    questionJa: 'どの季節に最も生きていると感じる？',
    context: 'Seasonal affinity maps directly to sake serving temperature and style.',
    contextJa: '季節の親和性は酒の提供温度とスタイルに直接対応する。',
    options: [
      { text: 'Spring — cherry blossoms, renewal, fragile beauty', textJa: '春 — 桜、再生、儚い美', scores: { aromatic: 3, nama: 2, light: 1 } },
      { text: 'Summer — heat, intensity, cold water on hot stone', textJa: '夏 — 暑さ、強さ、熱い石に冷水', scores: { dry: 3, light: 2, mineral: 1 } },
      { text: 'Autumn — decay, richness, golden light', textJa: '秋 — 朽ち、豊かさ、黄金の光', scores: { rich: 3, aged: 2, umami: 1 } },
      { text: 'Winter — silence, depth, fire in the dark', textJa: '冬 — 静寂、深さ、闇の中の炎', scores: { rich: 2, umami: 3, funky: 1 } },
    ],
  },
  {
    id: 6,
    question: 'You find a hidden bar in Kyoto. What do you hope it looks like inside?',
    questionJa: '京都で隠れたバーを見つけた。中はどんな雰囲気を期待する？',
    context: 'Aesthetic preference reveals your relationship with complexity.',
    contextJa: '美的嗜好は複雑さとの関係を明らかにする。',
    options: [
      { text: 'Minimalist — one counter, one master, ten seats, silence', textJa: 'ミニマリスト — カウンター一つ、マスター一人、十席、静寂', scores: { refined: 3, daiginjo: 2, dry: 1 } },
      { text: 'Wabi-sabi — cracked walls, worn wood, 200 years of stories', textJa: '侘寂 — ひび割れた壁、使い込まれた木、200年の物語', scores: { aged: 3, rich: 2, umami: 1 } },
      { text: 'Chaotic — bottles everywhere, jazz playing, smoke in the air', textJa: '混沌 — 瓶だらけ、ジャズが流れ、煙が漂う', scores: { funky: 3, natural: 2, nama: 1 } },
      { text: 'Modern — clean lines, curated selection, beautiful lighting', textJa: 'モダン — クリーンなライン、キュレーションされたセレクション、美しい照明', scores: { aromatic: 2, light: 2, sweet: 2 } },
    ],
  },
  {
    id: 7,
    question: 'What matters most to you in a drink?',
    questionJa: '飲み物で最も大切なことは？',
    context: 'This is the soul question. It determines your EXV weighting.',
    contextJa: 'これは魂の質問。あなたのEXVの重み付けを決定する。',
    options: [
      { text: 'Purity — I want to taste the maker\'s intention, nothing else', textJa: '純粋さ — 造り手の意図だけを味わいたい', scores: { refined: 3, daiginjo: 2, light: 1 } },
      { text: 'Depth — I want layers that reveal themselves over time', textJa: '深さ — 時間とともに現れる層を求める', scores: { rich: 3, aged: 2, umami: 1 } },
      { text: 'Emotion — I want to feel something I\'ve never felt before', textJa: '感動 — 今まで感じたことのないものを感じたい', scores: { funky: 2, nama: 2, natural: 2 } },
      { text: 'Connection — I want to share it with someone and create a memory', textJa: 'つながり — 誰かと分かち合い、思い出を作りたい', scores: { aromatic: 2, sweet: 2, junmai: 2 } },
    ],
  },
];

export interface SakeProfile {
  key: string;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  topStyles: string[];
  topStylesJa: string[];
  bottles: string[];
  temperature: string;
  temperatureJa: string;
  vessel: string;
  vesselJa: string;
  color: string;
  kanji: string;
}

export const sakeProfiles: SakeProfile[] = [
  {
    key: 'refined',
    name: 'The Purist',
    nameJa: '純粋主義者',
    description: 'You seek clarity above all. The single perfect note, the maker\'s intention distilled to its essence. You don\'t want noise — you want signal. Your sake should be a haiku, not a novel.',
    descriptionJa: '何よりも明晰さを求める。一つの完璧な音、造り手の意図がその本質に蒸留されたもの。ノイズは要らない — シグナルが欲しい。あなたの酒は小説ではなく、俳句であるべき。',
    topStyles: ['Daiginjo', 'Junmai Daiginjo', 'Arabashiri'],
    topStylesJa: ['大吟醸', '純米大吟醸', '荒走り'],
    bottles: ['Dassai 23', 'Juyondai Honmaru', 'Isojiman Junmai Daiginjo'],
    temperature: '5-10°C (hana-bie to suzu-bie)',
    temperatureJa: '5-10°C（花冷え〜涼冷え）',
    vessel: 'Thin-rimmed wine glass or usurai glass',
    vesselJa: '薄口ワイングラスまたは薄らいグラス',
    color: '#e8d5b7',
    kanji: '純',
  },
  {
    key: 'rich',
    name: 'The Depth Seeker',
    nameJa: '深淵の探求者',
    description: 'You want layers. You want a sake that reveals new dimensions with every sip, every temperature change, every minute in the glass. Patience is your superpower. You\'re not drinking — you\'re excavating.',
    descriptionJa: '層を求める。一口ごと、温度変化ごと、グラスの中の一分ごとに新しい次元を明らかにする酒を求める。忍耐があなたの超能力。飲んでいるのではない — 発掘している。',
    topStyles: ['Junmai', 'Kimoto', 'Yamahai', 'Koshu (aged)'],
    topStylesJa: ['純米', '生酛', '山廃', '古酒（熟成）'],
    bottles: ['Daishichi Kimoto', 'Tamagawa Yamahai', 'Daruma Masamune 3-Year Koshu'],
    temperature: '40-50°C (nuru-kan to atsu-kan)',
    temperatureJa: '40-50°C（ぬる燗〜熱燗）',
    vessel: 'Thick-walled guinomi or lacquered sakazuki',
    vesselJa: '厚手のぐい呑みまたは漆塗りの盃',
    color: '#c9a227',
    kanji: '深',
  },
  {
    key: 'funky',
    name: 'The Wild One',
    nameJa: '野生の者',
    description: 'You don\'t want safe. You want alive, unpredictable, a little dangerous. You\'re the person who orders the thing nobody else will try. Your sake should challenge you, not comfort you.',
    descriptionJa: '安全なものは要らない。生きていて、予測不能で、少し危険なものが欲しい。誰も試さないものを注文する人。あなたの酒は慰めるのではなく、挑戦するべき。',
    topStyles: ['Namazake', 'Doburoku', 'Yamahai Nama', 'Natural sake'],
    topStylesJa: ['生酒', 'どぶろく', '山廃生', '自然派酒'],
    bottles: ['Tamagawa Nama', 'Aramasa No.6', 'Senkin Muku Nama'],
    temperature: '5°C or 55°C — extremes only',
    temperatureJa: '5°Cまたは55°C — 極端のみ',
    vessel: 'Rough-textured guinomi or masu box',
    vesselJa: '粗い質感のぐい呑みまたは枡',
    color: '#e74c3c',
    kanji: '野',
  },
  {
    key: 'aromatic',
    name: 'The Dreamer',
    nameJa: '夢想家',
    description: 'You drink with your nose first. Aroma is everything — the promise before the delivery. You want sake that fills a room with its presence before it ever touches your lips. Beauty matters.',
    descriptionJa: 'まず鼻で飲む。香りがすべて — 届ける前の約束。唇に触れる前にその存在で部屋を満たす酒が欲しい。美が重要。',
    topStyles: ['Ginjo', 'Junmai Ginjo', 'Sparkling sake', 'Nigori'],
    topStylesJa: ['吟醸', '純米吟醸', 'スパークリング酒', 'にごり'],
    bottles: ['Kubota Manju', 'Dewazakura Oka', 'Hakkaisan Sparkling'],
    temperature: '8-12°C (hana-bie)',
    temperatureJa: '8-12°C（花冷え）',
    vessel: 'Wide-mouth wine glass or tulip-shaped ochoko',
    vesselJa: '広口ワイングラスまたはチューリップ型のお猪口',
    color: '#9b59b6',
    kanji: '夢',
  },
];
