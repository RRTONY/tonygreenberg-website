// ===================================================================
// SAKE FOR SAKE'S SAKE — Deep Culture Data Module
// 72 Microseasons, Vessels, Kanji Decoder, Wabi-Sabi, Kyoto Backstreets
// ===================================================================

export interface Microseason {
  id: number;
  period: string;
  periodJa: string;
  name: string;
  nameJa: string;
  dates: string;
  sake: string;
  sakeJa: string;
  food: string;
  foodJa: string;
  mood: string;
  moodJa: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface Vessel {
  id: string;
  name: string;
  nameJa: string;
  kanji: string;
  description: string;
  descriptionJa: string;
  bestFor: string;
  bestForJa: string;
  ritual: string;
  ritualJa: string;
  material: string;
  materialJa: string;
  tempRange: string;
  tempRangeJa: string;
}

export interface KanjiLabel {
  id: string;
  kanji: string;
  reading: string;
  readingJa: string;
  meaning: string;
  meaningJa: string;
  category: 'grade' | 'style' | 'process' | 'quality' | 'season';
  detail: string;
  detailJa: string;
}

export interface WabiSabiPrinciple {
  id: string;
  name: string;
  nameJa: string;
  kanji: string;
  description: string;
  descriptionJa: string;
  tastingPrompt: string;
  tastingPromptJa: string;
  sakeExample: string;
  sakeExampleJa: string;
}

export interface KyotoSpot {
  id: string;
  name: string;
  nameJa: string;
  area: string;
  areaJa: string;
  type: string;
  typeJa: string;
  description: string;
  descriptionJa: string;
  secret: string;
  secretJa: string;
  bestTime: string;
  bestTimeJa: string;
}

// ===================================================================
// 72 MICROSEASONS — Selected highlights (18 representative seasons)
// ===================================================================

export const microseasons: Microseason[] = [
  { id: 1, period: 'Risshun', periodJa: '立春', name: 'East wind melts the ice', nameJa: '東風解凍', dates: 'Feb 4–8', sake: 'Fresh namazake — raw, unpasteurized, alive', sakeJa: '搾りたての生酒 — 生、無濾過、生きている', food: 'Fuki-no-tou tempura (butterbur sprouts)', foodJa: 'ふきのとうの天ぷら', mood: 'First stirring. The ice cracks. Something is waking up.', moodJa: '最初の目覚め。氷が割れる。何かが目覚めている。', season: 'spring' },
  { id: 2, period: 'Usui', periodJa: '雨水', name: 'Mist starts to linger', nameJa: '霞始靆', dates: 'Feb 24–28', sake: 'Nigori — cloudy, unfiltered, like the mist itself', sakeJa: 'にごり酒 — 霞のように白く濁った', food: 'Nanohana ohitashi (rapeseed greens)', foodJa: '菜の花のおひたし', mood: 'The world softens. Edges blur. Drink something imprecise.', moodJa: '世界が柔らかくなる。輪郭がぼやける。曖昧なものを飲め。', season: 'spring' },
  { id: 3, period: 'Keichitsu', periodJa: '啓蟄', name: 'Hibernating insects surface', nameJa: '蟄虫啓戸', dates: 'Mar 5–9', sake: 'Kimoto junmai — earthy, wild, just emerged', sakeJa: '生酛純米 — 土の香り、野性的、出てきたばかり', food: 'Warabi mochi (bracken fern)', foodJa: 'わらび餅', mood: 'Underground things come to light. Drink something primal.', moodJa: '地下のものが光に出る。原始的なものを飲め。', season: 'spring' },
  { id: 4, period: 'Shunbun', periodJa: '春分', name: 'Cherry blossoms begin', nameJa: '桜始開', dates: 'Mar 25–29', sake: 'Hanami sake — anything pink, sparkling, or fleeting', sakeJa: '花見酒 — ピンク、スパークリング、儚いもの', food: 'Sakura mochi, hanami dango', foodJa: '桜餅、花見団子', mood: 'Ichi-go ichi-e. This blossom, this cup, this moment — never again.', moodJa: '一期一会。この花、この杯、この瞬間 — 二度とない。', season: 'spring' },
  { id: 5, period: 'Seimei', periodJa: '清明', name: 'Swallows return', nameJa: '玄鳥至', dates: 'Apr 4–8', sake: 'Light junmai ginjo — clean, migratory, restless', sakeJa: '軽やかな純米吟醸 — クリーン、渡り鳥のように落ち着かない', food: 'Takenoko (bamboo shoots) with sansho', foodJa: '筍と山椒', mood: 'Movement. Return. The familiar made strange by absence.', moodJa: '移動。帰還。不在によって見知らぬものとなった馴染みのもの。', season: 'spring' },
  { id: 6, period: 'Rikka', periodJa: '立夏', name: 'Frogs start singing', nameJa: '蛙始鳴', dates: 'May 5–9', sake: 'Sparkling sake — effervescent, joyful, noisy', sakeJa: 'スパークリング日本酒 — 泡立ち、喜び、にぎやか', food: 'Edamame with coarse salt', foodJa: '枝豆と粗塩', mood: 'The rice paddies fill with water and song. Life is loud.', moodJa: '田んぼが水と歌で満たされる。生命は騒がしい。', season: 'summer' },
  { id: 7, period: 'Boushu', periodJa: '芒種', name: 'Praying mantis hatches', nameJa: '蟷螂生', dates: 'Jun 5–9', sake: 'Yamahai junmai — patient, predatory, precise', sakeJa: '山廃純米 — 忍耐強く、捕食的で、精密', food: 'Ayu (sweetfish) salt-grilled', foodJa: '鮎の塩焼き', mood: 'Stillness before the strike. Calculated patience.', moodJa: '一撃前の静寂。計算された忍耐。', season: 'summer' },
  { id: 8, period: 'Geshi', periodJa: '夏至', name: 'Self-heal withers', nameJa: '乃東枯', dates: 'Jun 21–25', sake: 'Chilled daiginjo — ethereal, cooling, transcendent', sakeJa: '冷やした大吟醸 — 幽玄、冷涼、超越的', food: 'Hiyashi somen with myoga', foodJa: '冷やしそうめんとみょうが', mood: 'The longest day. Even healing things must rest.', moodJa: '最も長い日。癒すものでさえ休まなければならない。', season: 'summer' },
  { id: 9, period: 'Shousho', periodJa: '小暑', name: 'Warm winds arrive', nameJa: '温風至', dates: 'Jul 7–11', sake: 'On-the-rocks genshu — undiluted, over ice, brutal', sakeJa: 'ロックの原酒 — 無加水、氷の上、力強い', food: 'Unagi (eel) with tare sauce', foodJa: 'うなぎの蒲焼き', mood: 'The heat is honest. Drink something that doesn\'t pretend.', moodJa: '暑さは正直だ。偽らないものを飲め。', season: 'summer' },
  { id: 10, period: 'Risshu', periodJa: '立秋', name: 'Cool winds arrive', nameJa: '涼風至', dates: 'Aug 7–11', sake: 'Hiyaoroshi — autumn release, rounded, mature', sakeJa: 'ひやおろし — 秋の限定酒、丸みを帯びた、成熟した', food: 'Sanma (pacific saury) with grated daikon', foodJa: '秋刀魚と大根おろし', mood: 'The first cool breath. Summer\'s fever breaks.', moodJa: '最初の涼しい息吹。夏の熱が引く。', season: 'autumn' },
  { id: 11, period: 'Hakuro', periodJa: '白露', name: 'Swallows depart', nameJa: '玄鳥去', dates: 'Sep 17–21', sake: 'Aged junmai — deep, nostalgic, departure', sakeJa: '熟成純米 — 深く、懐かしく、旅立ち', food: 'Matsutake dobin-mushi', foodJa: '松茸の土瓶蒸し', mood: 'What arrived in spring now leaves. Savor the going.', moodJa: '春に来たものが今去る。去りゆくものを味わえ。', season: 'autumn' },
  { id: 12, period: 'Shubun', periodJa: '秋分', name: 'Thunder ceases', nameJa: '雷乃収声', dates: 'Sep 28–Oct 2', sake: 'Tokubetsu junmai at room temperature — still, balanced', sakeJa: '常温の特別純米 — 静かで、バランスの取れた', food: 'Kuri gohan (chestnut rice)', foodJa: '栗ご飯', mood: 'Silence after the storm. Equilibrium. The world holds its breath.', moodJa: '嵐の後の沈黙。均衡。世界が息を止める。', season: 'autumn' },
  { id: 13, period: 'Kanro', periodJa: '寒露', name: 'Chrysanthemums bloom', nameJa: '菊花開', dates: 'Oct 13–17', sake: 'Junmai with chrysanthemum petal — kiku-sake tradition', sakeJa: '菊の花びらを浮かべた純米 — 菊酒の伝統', food: 'Kaki (persimmon) with white shiro-ae', foodJa: '柿の白和え', mood: 'Ancient beauty. The flower of longevity in your cup.', moodJa: '古代の美。長寿の花があなたの杯に。', season: 'autumn' },
  { id: 14, period: 'Ritto', periodJa: '立冬', name: 'Camellias bloom', nameJa: '山茶始開', dates: 'Nov 7–11', sake: 'Warm junmai — first kan of the season, gentle heat', sakeJa: '温かい純米 — 季節最初の燗、穏やかな温もり', food: 'Oden with karashi mustard', foodJa: 'おでんと辛子', mood: 'The first warmth from within. The kura fires are lit.', moodJa: '内からの最初の温もり。蔵の火が灯される。', season: 'winter' },
  { id: 15, period: 'Taisetsu', periodJa: '大雪', name: 'Bears hibernate', nameJa: '熊蟄穴', dates: 'Dec 11–15', sake: 'Rich koshu (aged sake) — hibernation in a glass', sakeJa: '濃厚な古酒 — グラスの中の冬眠', food: 'Nabe (hot pot) with ponzu', foodJa: '鍋とポン酢', mood: 'Go inward. The deepest flavors come from the longest sleep.', moodJa: '内に向かえ。最も深い味わいは最も長い眠りから来る。', season: 'winter' },
  { id: 16, period: 'Touji', periodJa: '冬至', name: 'Self-heal sprouts', nameJa: '乃東生', dates: 'Dec 22–25', sake: 'Yuzu-infused sake — the solstice drink, citrus warmth', sakeJa: '柚子酒 — 冬至の飲み物、柑橘の温もり', food: 'Kabocha no nimono (simmered pumpkin)', foodJa: 'かぼちゃの煮物', mood: 'The darkest night. The yuzu bath. Rebirth begins in darkness.', moodJa: '最も暗い夜。柚子湯。再生は闇の中で始まる。', season: 'winter' },
  { id: 17, period: 'Shoukan', periodJa: '小寒', name: 'Springs warm up', nameJa: '水泉動', dates: 'Jan 10–14', sake: 'Shiboritate — just-pressed new sake, raw and wild', sakeJa: 'しぼりたて — 搾りたての新酒、生で野性的', food: 'Ozoni (New Year mochi soup)', foodJa: 'お雑煮', mood: 'Beneath the frozen surface, water moves. New sake is born.', moodJa: '凍った表面の下で水が動く。新酒が生まれる。', season: 'winter' },
  { id: 18, period: 'Daikan', periodJa: '大寒', name: 'Hens begin laying', nameJa: '鶏始乳', dates: 'Jan 30–Feb 3', sake: 'Shinshu (new sake) — the brewery\'s first child of the year', sakeJa: '新酒 — 蔵の今年最初の子', food: 'Tamago-zake (egg sake — traditional cold remedy)', foodJa: '卵酒（伝統的な風邪薬）', mood: 'Even in the coldest cold, life insists. The kura is alive.', moodJa: '最も寒い寒さの中でも、生命は主張する。蔵は生きている。', season: 'winter' },
];

// ===================================================================
// VESSELS & CEREMONY
// ===================================================================

export const vessels: Vessel[] = [
  {
    id: 'ochoko',
    name: 'Ochoko',
    nameJa: 'お猪口',
    kanji: '猪口',
    description: 'The classic small sake cup. Its diminutive size ensures frequent refilling — which is the point. Each pour is an act of care between companions.',
    descriptionJa: '定番の小さな酒杯。その小ささが頻繁な注ぎ足しを保証する — それが本質。注ぐたびに仲間への思いやりの行為。',
    bestFor: 'Ginjo, Daiginjo — the small opening concentrates delicate aromas',
    bestForJa: '吟醸、大吟醸 — 小さな口が繊細な香りを集中させる',
    ritual: 'Never fill your own ochoko. Always pour for others first. When someone pours for you, lift the cup slightly to receive.',
    ritualJa: '自分のお猪口は自分で満たさない。常に他の人に先に注ぐ。注いでもらう時は杯を少し持ち上げて受ける。',
    material: 'Ceramic, porcelain, lacquerware',
    materialJa: '陶器、磁器、漆器',
    tempRange: 'All temperatures',
    tempRangeJa: '全温度帯',
  },
  {
    id: 'guinomi',
    name: 'Guinomi',
    nameJa: 'ぐい呑み',
    kanji: '呑',
    description: 'Larger than ochoko, designed for serious drinking. The name literally means "gulp drink." Rustic, often handmade, with beautiful imperfections.',
    descriptionJa: 'お猪口より大きく、本格的な飲酒のために設計。名前は文字通り「ぐいっと飲む」。素朴で、しばしば手作りで、美しい不完全さを持つ。',
    bestFor: 'Junmai, Yamahai, Kimoto — robust sake that benefits from air contact',
    bestForJa: '純米、山廃、生酛 — 空気との接触で活きる力強い日本酒',
    ritual: 'Hold with both hands when receiving. The weight and texture of the vessel is part of the experience.',
    ritualJa: '受け取る時は両手で持つ。器の重さと質感が体験の一部。',
    material: 'Stoneware, rough ceramic, wood',
    materialJa: '石器、粗い陶器、木',
    tempRange: 'Room temperature to warm',
    tempRangeJa: '常温〜温',
  },
  {
    id: 'sakazuki',
    name: 'Sakazuki',
    nameJa: '盃',
    kanji: '盃',
    description: 'The flat, wide ceremonial cup. Used in Shinto rituals, weddings, and formal occasions. The wide surface exposes sake to air, changing its character.',
    descriptionJa: '平たく広い儀式用の杯。神道の儀式、結婚式、正式な場で使用。広い表面が日本酒を空気にさらし、その性格を変える。',
    bestFor: 'Ceremonial sake, aged koshu — the wide surface releases complex aromas',
    bestForJa: '儀式用の日本酒、熟成古酒 — 広い表面が複雑な香りを放つ',
    ritual: 'San-san-kudo: three cups, three sips each. The wedding ritual binding two families through shared sake.',
    ritualJa: '三三九度：三つの杯、各三口。共有する日本酒を通じて二つの家族を結ぶ結婚の儀式。',
    material: 'Lacquerware (vermillion or black), porcelain',
    materialJa: '漆器（朱または黒）、磁器',
    tempRange: 'Room temperature',
    tempRangeJa: '常温',
  },
  {
    id: 'masu',
    name: 'Masu',
    nameJa: '枡',
    kanji: '枡',
    description: 'The wooden measuring box, originally for rice. Drinking from the corner is traditional. The cedar aroma mingles with the sake — intentionally.',
    descriptionJa: '元々は米の計量箱。角から飲むのが伝統。杉の香りが日本酒と混ざり合う — 意図的に。',
    bestFor: 'Robust junmai, futsu-shu — the cedar adds a forest-floor note',
    bestForJa: '力強い純米、普通酒 — 杉が森の土の香りを加える',
    ritual: 'Mokkiri: a glass placed inside the masu, sake poured until it overflows. The overflow symbolizes generosity and abundance.',
    ritualJa: 'もっきり：枡の中にグラスを置き、溢れるまで日本酒を注ぐ。溢れは寛大さと豊かさの象徴。',
    material: 'Hinoki (Japanese cypress) or sugi (cedar)',
    materialJa: '檜（ひのき）または杉（すぎ）',
    tempRange: 'Room temperature to slightly chilled',
    tempRangeJa: '常温〜やや冷',
  },
  {
    id: 'tokkuri',
    name: 'Tokkuri',
    nameJa: '徳利',
    kanji: '徳利',
    description: 'The narrow-necked flask for warming and serving. The "tokku tokku" sound of pouring gave it its name. A vessel that sings.',
    descriptionJa: '温めと提供のための細首の徳利。注ぐ時の「とくとく」という音が名前の由来。歌う器。',
    bestFor: 'Warming sake — the narrow neck retains heat and concentrates aroma',
    bestForJa: '燗酒 — 細い首が熱を保ち香りを集中させる',
    ritual: 'Place in hot water (not microwave). The ideal temperature is when you can hold the tokkuri comfortably but feel the warmth.',
    ritualJa: 'お湯に入れて温める（電子レンジ不可）。理想の温度は、徳利を快適に持てるが温もりを感じる程度。',
    material: 'Ceramic, porcelain',
    materialJa: '陶器、磁器',
    tempRange: 'Warm to hot (40-55°C)',
    tempRangeJa: '温〜熱（40-55°C）',
  },
  {
    id: 'katakuchi',
    name: 'Katakuchi',
    nameJa: '片口',
    kanji: '片口',
    description: 'The spouted serving bowl. Open-topped, it lets sake breathe like a wine decanter. The wide mouth invites you to smell before you pour.',
    descriptionJa: '注ぎ口のある盛り鉢。開いた上部が日本酒をワインデキャンタのように呼吸させる。広い口が注ぐ前に香りを嗅ぐよう誘う。',
    bestFor: 'Complex junmai ginjo, aged sake — aeration opens up layers',
    bestForJa: '複雑な純米吟醸、熟成酒 — 通気が層を開く',
    ritual: 'Pour slowly from the spout. The katakuchi is the generous host — it gives freely and holds nothing back.',
    ritualJa: '注ぎ口からゆっくり注ぐ。片口は寛大な主人 — 惜しみなく与え、何も隠さない。',
    material: 'Ceramic, glass, metal',
    materialJa: '陶器、ガラス、金属',
    tempRange: 'Chilled to room temperature',
    tempRangeJa: '冷〜常温',
  },
];

// ===================================================================
// KANJI DECODER — Sake Label Reading Guide
// ===================================================================

export const kanjiLabels: KanjiLabel[] = [
  { id: 'junmai', kanji: '純米', reading: 'Junmai', readingJa: 'じゅんまい', meaning: 'Pure Rice', meaningJa: '純粋な米', category: 'grade', detail: 'No added alcohol. Only rice, water, koji, and yeast. The purest expression of the brewer\'s art.', detailJa: 'アルコール添加なし。米、水、麹、酵母のみ。醸造家の芸術の最も純粋な表現。' },
  { id: 'daiginjo', kanji: '大吟醸', reading: 'Daiginjo', readingJa: 'だいぎんじょう', meaning: 'Great Ginjo', meaningJa: '大いなる吟醸', category: 'grade', detail: 'Rice polished to at least 50%. The pinnacle of sake craftsmanship. Expect ethereal aromas and silky texture.', detailJa: '精米歩合50%以上。日本酒の職人技の頂点。幽玄な香りとシルキーな質感を期待。' },
  { id: 'ginjo', kanji: '吟醸', reading: 'Ginjo', readingJa: 'ぎんじょう', meaning: 'Careful Brew', meaningJa: '吟味して醸す', category: 'grade', detail: 'Rice polished to at least 60%. Aromatic, elegant, and refined. The "singing" of sake.', detailJa: '精米歩合60%以上。香り高く、エレガントで洗練された。日本酒の「歌」。' },
  { id: 'honjozo', kanji: '本醸造', reading: 'Honjozo', readingJa: 'ほんじょうぞう', meaning: 'True Brew', meaningJa: '本格的な醸造', category: 'grade', detail: 'Small amount of brewers alcohol added to lift aroma. Light, clean, excellent warm. Underrated category.', detailJa: '少量の醸造アルコールを添加して香りを引き立てる。軽やかでクリーン、燗に最適。過小評価されたカテゴリー。' },
  { id: 'tokubetsu', kanji: '特別', reading: 'Tokubetsu', readingJa: 'とくべつ', meaning: 'Special', meaningJa: '特別な', category: 'grade', detail: 'The brewery considers this "special" — either extra polishing or a unique technique. The brewer\'s pride.', detailJa: '蔵元が「特別」と考えるもの — 追加の精米または独自の技法。醸造家の誇り。' },
  { id: 'nama', kanji: '生', reading: 'Nama', readingJa: 'なま', meaning: 'Raw / Unpasteurized', meaningJa: '生（なま）', category: 'process', detail: 'Skips pasteurization. Fresh, vibrant, sometimes wild. Must be refrigerated. Drink young.', detailJa: '火入れを省略。フレッシュで生き生きとした、時に野性的。要冷蔵。若いうちに飲む。' },
  { id: 'genshu', kanji: '原酒', reading: 'Genshu', readingJa: 'げんしゅ', meaning: 'Undiluted', meaningJa: '原酒', category: 'process', detail: 'No water added after pressing. Higher alcohol (17-20%). Intense, concentrated, bold.', detailJa: '搾り後に加水なし。高アルコール（17-20%）。濃厚で凝縮された、力強い。' },
  { id: 'muroka', kanji: '無濾過', reading: 'Muroka', readingJa: 'むろか', meaning: 'Unfiltered', meaningJa: '無濾過', category: 'process', detail: 'Skips charcoal filtration. Retains natural color (slight gold/green tint) and fuller flavor.', detailJa: '炭素濾過を省略。自然な色（わずかな金/緑の色合い）とより豊かな味わいを保持。' },
  { id: 'kimoto', kanji: '生酛', reading: 'Kimoto', readingJa: 'きもと', meaning: 'Living Starter', meaningJa: '生きた酛', category: 'style', detail: 'Traditional yeast starter using pole-ramming (yamaoroshi). Complex, gamey, wild. 30-day process.', detailJa: '山卸しを使う伝統的な酒母。複雑で野趣があり、野性的。30日間の工程。' },
  { id: 'yamahai', kanji: '山廃', reading: 'Yamahai', readingJa: 'やまはい', meaning: 'Mountain Abolished', meaningJa: '山卸し廃止', category: 'style', detail: 'Kimoto without the pole-ramming. Natural lactic acid development. Rich, tangy, umami-laden.', detailJa: '山卸しを省いた生酛。自然な乳酸発酵。豊かで酸味があり、旨味に満ちた。' },
  { id: 'koshu', kanji: '古酒', reading: 'Koshu', readingJa: 'こしゅ', meaning: 'Aged Sake', meaningJa: '古い酒', category: 'quality', detail: 'Aged for years, sometimes decades. Develops sherry-like, caramel, nutty complexity. Amber colored.', detailJa: '数年、時に数十年熟成。シェリーのような、キャラメル、ナッツの複雑さを発展。琥珀色。' },
  { id: 'arabashiri', kanji: '荒走り', reading: 'Arabashiri', readingJa: 'あらばしり', meaning: 'Rough Run', meaningJa: '荒い走り', category: 'quality', detail: 'First sake to flow from the press. Wild, rough, untamed. The most primal expression.', detailJa: '搾りから最初に流れ出る日本酒。野性的で荒々しく、飼い慣らされていない。最も原始的な表現。' },
  { id: 'nakadori', kanji: '中取り', reading: 'Nakadori', readingJa: 'なかどり', meaning: 'Middle Cut', meaningJa: '中間の取り', category: 'quality', detail: 'The middle portion of pressing. Most balanced, refined, and prized. The heart of the press.', detailJa: '搾りの中間部分。最もバランスが良く、洗練され、珍重される。搾りの心臓。' },
  { id: 'shizuku', kanji: '雫', reading: 'Shizuku', readingJa: 'しずく', meaning: 'Drip', meaningJa: '雫', category: 'quality', detail: 'Gravity-drip pressed in bags. No mechanical pressure. The most delicate, limited, and expensive method.', detailJa: '袋で重力滴下搾り。機械的圧力なし。最も繊細で限定的で高価な方法。' },
  { id: 'hiyaoroshi', kanji: 'ひやおろし', reading: 'Hiyaoroshi', readingJa: 'ひやおろし', meaning: 'Cold Release', meaningJa: '冷やおろし', category: 'season', detail: 'Autumn seasonal release. Pasteurized once in spring, aged through summer, released unpasteurized in fall. Rounded and mature.', detailJa: '秋の季節限定酒。春に一度火入れし、夏を越して熟成、秋に生で出荷。丸みを帯びて成熟。' },
  { id: 'shiboritate', kanji: 'しぼりたて', reading: 'Shiboritate', readingJa: 'しぼりたて', meaning: 'Freshly Pressed', meaningJa: '搾りたて', category: 'season', detail: 'Just-pressed new sake, released in winter. Fresh, lively, sometimes rough around the edges. The new vintage.', detailJa: '冬に出荷される搾りたての新酒。フレッシュで生き生きとした、時に荒削り。新しいヴィンテージ。' },
];

// ===================================================================
// WABI-SABI TASTING PHILOSOPHY
// ===================================================================

export const wabiSabiPrinciples: WabiSabiPrinciple[] = [
  {
    id: 'fukinsei',
    name: 'Fukinsei — Asymmetry',
    nameJa: '不均斉 — 非対称',
    kanji: '不均斉',
    description: 'Beauty in irregularity. The crack in the glaze, the off-center pour, the sake that doesn\'t fit any category. Perfection is a dead end.',
    descriptionJa: '不規則さの中の美。釉薬のひび、中心からずれた注ぎ、どのカテゴリーにも当てはまらない日本酒。完璧は行き止まり。',
    tastingPrompt: 'Find the flaw. What makes this sake imperfect? Now ask: is that flaw actually the most interesting thing about it?',
    tastingPromptJa: '欠点を見つけよ。この日本酒を不完全にしているものは何か？そして問え：その欠点は実は最も興味深い点ではないか？',
    sakeExample: 'Aramasa No.6 — defies classification, lives between categories',
    sakeExampleJa: '新政 No.6 — 分類を拒み、カテゴリーの間に生きる',
  },
  {
    id: 'kanso',
    name: 'Kanso — Simplicity',
    nameJa: '簡素 — 簡潔',
    kanji: '簡素',
    description: 'The elimination of clutter. Strip away everything unnecessary until only the essential remains. The sake that says the most with the least.',
    descriptionJa: '雑然としたものの排除。不要なものをすべて取り除き、本質だけが残るまで。最小限で最も多くを語る日本酒。',
    tastingPrompt: 'Close your eyes. Take one sip. What is the single word that describes this sake? Not three words. One.',
    tastingPromptJa: '目を閉じよ。一口飲め。この日本酒を一語で表す言葉は何か？三語ではない。一語。',
    sakeExample: 'Kubota Manju — the art of saying everything through restraint',
    sakeExampleJa: '久保田 萬寿 — 抑制を通じてすべてを語る芸術',
  },
  {
    id: 'koko',
    name: 'Kokō — Austerity',
    nameJa: '枯高 — 枯淡',
    kanji: '枯高',
    description: 'Weathered beauty. The dignity of age. Like an ancient tree — stripped bare but more powerful for it. The beauty of what remains after everything else has fallen away.',
    descriptionJa: '風化した美。年齢の品格。古木のように — 裸にされたがそれゆえにより力強い。他のすべてが落ちた後に残るものの美。',
    tastingPrompt: 'Drink a koshu (aged sake). What has time taken away? What has it given? Which matters more?',
    tastingPromptJa: '古酒を飲め。時間は何を奪ったか？何を与えたか？どちらがより重要か？',
    sakeExample: 'Daruma Masamune 3-year Koshu — time as the ultimate brewer',
    sakeExampleJa: '達磨正宗 3年古酒 — 時間こそ究極の醸造家',
  },
  {
    id: 'shizen',
    name: 'Shizen — Naturalness',
    nameJa: '自然 — 自然体',
    kanji: '自然',
    description: 'Without pretense. The sake that doesn\'t try to be anything other than what it is. No manipulation, no tricks, no performance.',
    descriptionJa: '見せかけなし。ありのままであること以外を求めない日本酒。操作なし、トリックなし、演技なし。',
    tastingPrompt: 'Does this sake feel honest? Does it taste like it\'s trying to impress you, or simply being itself?',
    tastingPromptJa: 'この日本酒は正直に感じるか？あなたを感動させようとしているか、それともただ自分自身であるか？',
    sakeExample: 'Kaze no Mori — unfiltered, unpasteurized, unapologetic',
    sakeExampleJa: '風の森 — 無濾過、生、弁解なし',
  },
  {
    id: 'yugen',
    name: 'Yūgen — Mystery',
    nameJa: '幽玄 — 奥深さ',
    kanji: '幽玄',
    description: 'Profound grace. The suggestion of something beyond what can be said. The aftertaste that haunts you three days later.',
    descriptionJa: '深遠な優雅さ。言葉にできないものの示唆。三日後もあなたを悩ませる余韻。',
    tastingPrompt: 'After swallowing, sit in silence for 30 seconds. What arrives in the emptiness? That\'s the yūgen.',
    tastingPromptJa: '飲み込んだ後、30秒間沈黙の中に座れ。空虚の中に何が到来するか？それが幽玄。',
    sakeExample: 'Kokuryu Ryu — a sake that demands silence and rewards patience',
    sakeExampleJa: '黒龍 龍 — 沈黙を要求し、忍耐に報いる日本酒',
  },
  {
    id: 'datsuzoku',
    name: 'Datsuzoku — Freedom',
    nameJa: '脱俗 — 脱慣習',
    kanji: '脱俗',
    description: 'Transcendence of the conventional. The sake that breaks every rule and is better for it. The glitch in the matrix.',
    descriptionJa: '慣習の超越。すべてのルールを破り、それゆえにより良い日本酒。マトリックスのグリッチ。',
    tastingPrompt: 'What rule does this sake break? Classification? Temperature? Expectation? Now — does the rule-breaking make it more alive?',
    tastingPromptJa: 'この日本酒はどのルールを破っているか？分類？温度？期待？そして — ルール破りはそれをより生き生きとさせているか？',
    sakeExample: 'Juyondai Honmaru — a honjozo that embarrasses most daiginjo',
    sakeExampleJa: '十四代 本丸 — ほとんどの大吟醸を凌駕する本醸造',
  },
  {
    id: 'seijaku',
    name: 'Seijaku — Stillness',
    nameJa: '静寂 — 静けさ',
    kanji: '静寂',
    description: 'Active calm. Not the absence of sound, but the presence of deep listening. The moment between pouring and drinking.',
    descriptionJa: '能動的な静寂。音の不在ではなく、深い傾聴の存在。注ぐことと飲むことの間の瞬間。',
    tastingPrompt: 'Before you drink, pause. Look at the sake in the cup. Watch the light move through it. Now drink.',
    tastingPromptJa: '飲む前に、止まれ。杯の中の日本酒を見よ。光がその中を動くのを見よ。そして飲め。',
    sakeExample: 'Isojiman Junmai Ginjo — mineral stillness, ocean calm',
    sakeExampleJa: '磯自慢 純米吟醸 — ミネラルの静寂、海の穏やかさ',
  },
];

// ===================================================================
// KYOTO BACKSTREETS
// ===================================================================

export const kyotoSpots: KyotoSpot[] = [
  {
    id: 'fushimi-canals',
    name: 'Fushimi Canal Walk',
    nameJa: '伏見の運河散歩',
    area: 'Fushimi',
    areaJa: '伏見',
    type: 'Walk',
    typeJa: '散歩',
    description: 'Tree-lined canals where sake barrels once floated to Osaka. The wooden brewery buildings still stand, their walls darkened by centuries of koji spores.',
    descriptionJa: '酒樽がかつて大阪に向かって浮かんだ並木の運河。木造の蔵の建物が今も立ち、何世紀もの麹菌の胞子で壁が黒ずんでいる。',
    secret: 'Visit at dawn. The mist rises from the canals and the only sound is water. You\'ll understand why they built breweries here.',
    secretJa: '夜明けに訪れよ。運河から霧が立ち上り、聞こえるのは水の音だけ。なぜここに蔵を建てたか理解できる。',
    bestTime: 'Early morning, October–March',
    bestTimeJa: '早朝、10月〜3月',
  },
  {
    id: 'pontocho',
    name: 'Pontochō Alley',
    nameJa: '先斗町',
    area: 'Central Kyoto',
    areaJa: '京都中心部',
    type: 'Sake Bars',
    typeJa: '酒場',
    description: 'A single narrow alley between Kamo River and Kiyamachi. Lantern-lit doorways hide some of Kyoto\'s finest sake bars. Most seat fewer than 8 people.',
    descriptionJa: '鴨川と木屋町の間の一本の狭い路地。提灯に照らされた入口が京都最高の酒場を隠す。ほとんどが8人未満の席。',
    secret: 'Look for the noren (curtain) with a single kanji. The less signage, the better the sake. Ask for "omakase" and trust the master.',
    secretJa: '一文字の漢字の暖簾を探せ。看板が少ないほど、日本酒は良い。「おまかせ」と言って、店主を信じよ。',
    bestTime: 'After 8pm, weekdays',
    bestTimeJa: '午後8時以降、平日',
  },
  {
    id: 'gekkeikan',
    name: 'Gekkeikan Ōkura Museum',
    nameJa: '月桂冠大倉記念館',
    area: 'Fushimi',
    areaJa: '伏見',
    type: 'Museum',
    typeJa: '博物館',
    description: 'Inside a 1637 brewery building. Touch the tools that haven\'t changed in 400 years. Taste water from the same underground spring that feeds the sake.',
    descriptionJa: '1637年の蔵の建物の中。400年変わっていない道具に触れる。日本酒を育む同じ地下水脈の水を味わう。',
    secret: 'Ask to taste the genshu (undiluted) sample — it\'s not on the standard tasting menu but they\'ll pour it if you ask in Japanese.',
    secretJa: '原酒のサンプルを味見させてもらえるか聞いてみよ — 標準のテイスティングメニューにはないが、日本語で頼めば注いでくれる。',
    bestTime: 'Weekday mornings',
    bestTimeJa: '平日の午前中',
  },
  {
    id: 'nishiki-market',
    name: 'Nishiki Market Back Alleys',
    nameJa: '錦市場の裏路地',
    area: 'Central Kyoto',
    areaJa: '京都中心部',
    type: 'Food & Sake',
    typeJa: '食と酒',
    description: 'Behind the tourist-facing stalls, the perpendicular alleys hide standing sake bars where locals drink cup sake at 11am without judgment.',
    descriptionJa: '観光客向けの店の裏、垂直の路地に立ち飲み酒場が隠れ、地元の人が午前11時にカップ酒を飲んでいる。',
    secret: 'Find the tiny shop selling tsukemono (pickles) and ask which sake they drink with their own pickles. That\'s the real pairing.',
    secretJa: '漬物を売る小さな店を見つけ、自分の漬物とどの日本酒を飲むか聞いてみよ。それが本当のペアリング。',
    bestTime: 'Late morning, any day',
    bestTimeJa: '午前遅く、いつでも',
  },
  {
    id: 'kamogawa-yuka',
    name: 'Kamogawa Riverside Yuka',
    nameJa: '鴨川の床',
    area: 'Central Kyoto',
    areaJa: '京都中心部',
    type: 'Experience',
    typeJa: '体験',
    description: 'Summer-only wooden platforms extending over the Kamo River. Drink sake with your feet dangling above the water as the sun sets behind the mountains.',
    descriptionJa: '夏季限定で鴨川の上に張り出す木製の床。山の向こうに日が沈む中、足を水の上に垂らしながら日本酒を飲む。',
    secret: 'Book the smallest yuka you can find — 4 seats maximum. The intimacy changes everything. Order local Fushimi sake only.',
    secretJa: '見つけられる最小の床を予約せよ — 最大4席。親密さがすべてを変える。地元の伏見の日本酒だけを注文。',
    bestTime: 'May–September, sunset',
    bestTimeJa: '5月〜9月、日没時',
  },
  {
    id: 'toji-temple',
    name: 'Tō-ji Temple Flea Market',
    nameJa: '東寺の弘法市',
    area: 'South Kyoto',
    areaJa: '京都南部',
    type: 'Market',
    typeJa: '市場',
    description: 'Monthly flea market at the ancient temple. Find vintage sake cups, handmade tokkuri, and old masu boxes among the antiques.',
    descriptionJa: '古刹での月例蚤の市。骨董品の中にヴィンテージの酒杯、手作りの徳利、古い枡を見つける。',
    secret: 'Look for the old man selling Showa-era ceramic sake sets. He knows the provenance of every piece. Bring cash and patience.',
    secretJa: '昭和時代の陶器の酒器セットを売っている老人を探せ。すべての品の来歴を知っている。現金と忍耐を持って行け。',
    bestTime: '21st of every month, early morning',
    bestTimeJa: '毎月21日、早朝',
  },
];
