/*
 * educationData.ts — Sake Education, Food Pairing, Retailer Directory, Value Matrix
 * The knowledge backbone for the teaching and commerce layers
 */

// ============================================================
// SAKE SPEAKING GUIDE — How to talk about sake like you mean it
// ============================================================

export interface SakeWord {
  term: string;
  kanji: string;
  pronunciation: string;
  meaningEn: string;
  meaningJa: string;
  usageEn: string;
  usageJa: string;
  category: 'tasting' | 'brewing' | 'serving' | 'grade' | 'culture';
}

export const sakeVocabulary: SakeWord[] = [
  // Tasting
  { term: 'Kire', kanji: '切れ', pronunciation: 'kee-reh', meaningEn: 'Clean finish — the way sake cuts off at the end, leaving no residue', meaningJa: '後味がすっきりと切れること', usageEn: '"This junmai has beautiful kire — it disappears like a whisper."', usageJa: '「この純米は切れが美しい——囁きのように消える」', category: 'tasting' },
  { term: 'Fukurami', kanji: '膨らみ', pronunciation: 'foo-koo-rah-mee', meaningEn: 'Roundness, fullness — the way sake swells on the palate', meaningJa: '口の中で膨らむ豊かさ', usageEn: '"The fukurami here is incredible — it blooms across your entire mouth."', usageJa: '「ここの膨らみは素晴らしい——口全体に花開く」', category: 'tasting' },
  { term: 'Umami', kanji: '旨味', pronunciation: 'oo-mah-mee', meaningEn: 'The fifth taste — savory depth that lingers and satisfies', meaningJa: '第五の味覚——残り満たす旨さ', usageEn: '"Yamahai styles are loaded with umami — they demand food."', usageJa: '「山廃は旨味が豊富——料理を求める」', category: 'tasting' },
  { term: 'Nigami', kanji: '苦味', pronunciation: 'nee-gah-mee', meaningEn: 'Bitterness — not a flaw, but a complexity marker in aged sake', meaningJa: '苦味——欠点ではなく、熟成酒の複雑さの指標', usageEn: '"That gentle nigami adds depth — like dark chocolate in liquid form."', usageJa: '「あの穏やかな苦味が深みを加える——液体のダークチョコレート」', category: 'tasting' },
  { term: 'Shibumi', kanji: '渋味', pronunciation: 'shee-boo-mee', meaningEn: 'Astringency — a dry, puckering sensation that adds structure', meaningJa: '渋味——構造を加える乾いた収斂感', usageEn: '"The shibumi gives this koshu its backbone."', usageJa: '「渋味がこの古酒に骨格を与える」', category: 'tasting' },
  { term: 'Tanrei', kanji: '淡麗', pronunciation: 'tahn-ray', meaningEn: 'Light and crisp — the Niigata style, clean as mountain snow', meaningJa: '淡麗——新潟スタイル、山の雪のように清い', usageEn: '"Classic tanrei karakuchi — dry, clean, and razor-sharp."', usageJa: '「典型的な淡麗辛口——ドライで清く、鋭い」', category: 'tasting' },
  { term: 'Nōjun', kanji: '濃醇', pronunciation: 'noh-joon', meaningEn: 'Rich and full-bodied — the opposite of tanrei, deep and layered', meaningJa: '濃醇——淡麗の対極、深く重層的', usageEn: '"This is pure nōjun — it coats your mouth like liquid velvet."', usageJa: '「これは純粋な濃醇——液体のベルベットのように口を覆う」', category: 'tasting' },
  // Brewing
  { term: 'Seimai-buai', kanji: '精米歩合', pronunciation: 'say-my-boo-eye', meaningEn: 'Rice polishing ratio — the percentage of grain remaining after milling', meaningJa: '精米歩合——精米後に残る米の割合', usageEn: '"At 35% seimai-buai, they\'ve polished away 65% of the grain."', usageJa: '「精米歩合35%、米の65%を磨き落としている」', category: 'brewing' },
  { term: 'Koji', kanji: '麹', pronunciation: 'koh-jee', meaningEn: 'The sacred mold (Aspergillus oryzae) that converts starch to sugar', meaningJa: '麹——澱粉を糖に変える聖なるカビ', usageEn: '"Without koji, there is no sake. It is the invisible brewer."', usageJa: '「麹なくして酒なし。見えない醸造家である」', category: 'brewing' },
  { term: 'Moromi', kanji: '醪', pronunciation: 'moh-roh-mee', meaningEn: 'The main fermentation mash — where the magic happens over 20-30 days', meaningJa: '醪——20〜30日間の本醸造', usageEn: '"The moromi is alive — bubbling, breathing, transforming."', usageJa: '「醪は生きている——泡立ち、呼吸し、変容する」', category: 'brewing' },
  { term: 'Yamahai', kanji: '山廃', pronunciation: 'yah-mah-high', meaningEn: 'Traditional method skipping pole-ramming — wild, gamey, complex', meaningJa: '山卸し廃止——野性的で複雑な伝統製法', usageEn: '"Yamahai sake has a wildness that modern methods can\'t replicate."', usageJa: '「山廃の酒には現代の方法では再現できない野性がある」', category: 'brewing' },
  { term: 'Kimoto', kanji: '生酛', pronunciation: 'kee-moh-toh', meaningEn: 'The oldest brewing method — pole-ramming rice into paste by hand', meaningJa: '生酛——手作業で米を摺り潰す最古の醸造法', usageEn: '"Kimoto is the monk\'s path — harder, longer, more rewarding."', usageJa: '「生酛は修行僧の道——より困難で、より長く、より報われる」', category: 'brewing' },
  // Serving
  { term: 'Hiya', kanji: '冷や', pronunciation: 'hee-yah', meaningEn: 'Room temperature — the default serving temperature, not chilled', meaningJa: '冷や——冷やしたのではなく、常温', usageEn: '"Serve this junmai at hiya to let the umami fully express."', usageJa: '「この純米は冷やで——旨味を完全に表現させる」', category: 'serving' },
  { term: 'Kan', kanji: '燗', pronunciation: 'kahn', meaningEn: 'Warmed sake — a spectrum from nurukan (40°C) to atsukan (50°C)', meaningJa: '燗——ぬる燗(40°C)から熱燗(50°C)まで', usageEn: '"Warming this yamahai to nurukan transforms it entirely."', usageJa: '「この山廃をぬる燗にすると全く別物になる」', category: 'serving' },
  { term: 'Ochoko', kanji: 'お猪口', pronunciation: 'oh-choh-koh', meaningEn: 'The small sake cup — designed for communal pouring and connection', meaningJa: 'お猪口——注ぎ合いと繋がりのための小さな杯', usageEn: '"The ochoko is small for a reason — it forces you to pour for others."', usageJa: '「お猪口が小さいのには理由がある——他者に注ぐことを促す」', category: 'serving' },
  // Grade
  { term: 'Junmai', kanji: '純米', pronunciation: 'joon-my', meaningEn: 'Pure rice — no added alcohol, just rice, water, koji, and yeast', meaningJa: '純米——米、水、麹、酵母のみ', usageEn: '"Junmai is the honest expression — nothing to hide behind."', usageJa: '「純米は正直な表現——隠れるものがない」', category: 'grade' },
  { term: 'Ginjo', kanji: '吟醸', pronunciation: 'geen-joh', meaningEn: 'Carefully brewed — polished to at least 60%, aromatic and elegant', meaningJa: '吟醸——60%以下に磨き、芳香で優雅', usageEn: '"Ginjo is where craft becomes art — the brewer\'s ego disappears."', usageJa: '「吟醸は技が芸術になる場所——杜氏の自我が消える」', category: 'grade' },
  { term: 'Daiginjo', kanji: '大吟醸', pronunciation: 'die-geen-joh', meaningEn: 'The pinnacle — polished to 50% or less, ethereal and transcendent', meaningJa: '大吟醸——50%以下に磨き、超越的', usageEn: '"Daiginjo is not better than junmai — it\'s a different conversation."', usageJa: '「大吟醸は純米より優れているのではない——別の会話だ」', category: 'grade' },
  { term: 'Tokubetsu', kanji: '特別', pronunciation: 'toh-koo-bet-soo', meaningEn: 'Special — the brewer did something extra, and wants you to know', meaningJa: '特別——蔵元が何か特別なことをした印', usageEn: '"Tokubetsu junmai means the brewer went beyond the minimum."', usageJa: '「特別純米は蔵元が最低基準を超えたことを意味する」', category: 'grade' },
  // Culture
  { term: 'Kampai', kanji: '乾杯', pronunciation: 'kahm-pie', meaningEn: 'Cheers! — literally "dry cup," the universal toast', meaningJa: '乾杯——杯を乾かす、普遍的な乾杯', usageEn: '"Never drink before kampai. It\'s not a suggestion — it\'s a covenant."', usageJa: '「乾杯の前に飲んではいけない。提案ではなく、契約だ」', category: 'culture' },
  { term: 'Oshaku', kanji: 'お酌', pronunciation: 'oh-shah-koo', meaningEn: 'The act of pouring for others — never pour for yourself', meaningJa: 'お酌——他者に注ぐこと。自分に注いではいけない', usageEn: '"Oshaku is not service — it\'s a conversation without words."', usageJa: '「お酌は奉仕ではない——言葉のない会話だ」', category: 'culture' },
  { term: 'Nomunication', kanji: '飲みニケーション', pronunciation: 'noh-moo-nee-kay-shon', meaningEn: 'Drinking + communication — the Japanese art of bonding over sake', meaningJa: '飲みニケーション——酒を通じた絆の日本的芸術', usageEn: '"The real decisions in Japan are made during nomunication."', usageJa: '「日本の本当の決断は飲みニケーションの場で下される」', category: 'culture' },
];

// ============================================================
// FOOD PAIRING GUIDE — Sake × Food: The Sacred Marriage
// ============================================================

export interface FoodPairing {
  sakeStyle: string;
  sakeStyleJa: string;
  principle: string;
  principleJa: string;
  pairings: {
    dishEn: string;
    dishJa: string;
    whyEn: string;
    whyJa: string;
    intensityMatch: number; // 1-10
  }[];
  avoidEn: string;
  avoidJa: string;
  temperatureEn: string;
  temperatureJa: string;
}

export const foodPairings: FoodPairing[] = [
  {
    sakeStyle: 'Daiginjo / Junmai Daiginjo',
    sakeStyleJa: '大吟醸 / 純米大吟醸',
    principle: 'Match delicacy with delicacy. This sake whispers — don\'t pair it with anything that shouts.',
    principleJa: '繊細さには繊細さを。この酒は囁く——叫ぶものと合わせてはいけない。',
    pairings: [
      { dishEn: 'Hirame (flounder) sashimi with yuzu', dishJa: 'ヒラメの刺身 柚子添え', whyEn: 'The ethereal floral notes dance with the clean, sweet flesh of white fish', whyJa: '華やかな花の香りが白身魚の清い甘さと踊る', intensityMatch: 9 },
      { dishEn: 'Steamed egg custard (chawanmushi)', dishJa: '茶碗蒸し', whyEn: 'Silky texture meets silky texture — the umami amplifies without competing', whyJa: '絹のような食感が出会う——旨味が競わず増幅する', intensityMatch: 8 },
      { dishEn: 'Fresh mozzarella with white truffle oil', dishJa: 'フレッシュモッツァレラ 白トリュフオイル', whyEn: 'The cross-cultural bridge — creamy, delicate, aromatic on both sides', whyJa: '文化を超えた架け橋——両方がクリーミーで繊細で芳香', intensityMatch: 7 },
      { dishEn: 'Lightly salted edamame', dishJa: '塩茹で枝豆', whyEn: 'The simplest pairing is often the best — salt lifts the ginjo aroma', whyJa: '最もシンプルな組み合わせが最良——塩が吟醸香を引き立てる', intensityMatch: 9 },
    ],
    avoidEn: 'Heavy sauces, strong spices, red meat. They\'ll bulldoze the subtlety.',
    avoidJa: '濃厚なソース、強い香辛料、赤身肉。繊細さを押し潰す。',
    temperatureEn: 'Chilled (8-12°C) — cold preserves the delicate aromatics',
    temperatureJa: '冷酒（8-12°C）——冷やすことで繊細な香りを保つ',
  },
  {
    sakeStyle: 'Junmai',
    sakeStyleJa: '純米',
    principle: 'The workhorse. Junmai is the most food-friendly sake — it has the body to stand up to real cooking.',
    principleJa: '万能選手。純米は最も料理に合う酒——本格的な料理に負けない体を持つ。',
    pairings: [
      { dishEn: 'Grilled chicken yakitori (tare sauce)', dishJa: '焼き鳥（タレ）', whyEn: 'The caramelized sweetness of tare meets the rice-forward richness of junmai', whyJa: 'タレのキャラメルの甘さが純米の米の豊かさと出会う', intensityMatch: 9 },
      { dishEn: 'Tempura with tentsuyu', dishJa: '天ぷら 天つゆ', whyEn: 'Junmai cuts through the oil while the dashi in tentsuyu bridges the umami', whyJa: '純米が油を切り、天つゆの出汁が旨味を橋渡しする', intensityMatch: 8 },
      { dishEn: 'Aged cheddar or Gruyère', dishJa: '熟成チェダーまたはグリュイエール', whyEn: 'The amino acid complexity in both creates an umami explosion', whyJa: '両方のアミノ酸の複雑さが旨味の爆発を生む', intensityMatch: 8 },
      { dishEn: 'Mushroom risotto', dishJa: 'キノコのリゾット', whyEn: 'Rice meets rice — the earthy mushroom umami is a natural partner', whyJa: '米が米に出会う——土の香りのキノコの旨味は天然のパートナー', intensityMatch: 9 },
    ],
    avoidEn: 'Nothing, really. Junmai is the most forgiving style. But very sweet desserts can clash.',
    avoidJa: '特にない。純米は最も寛容なスタイル。ただし甘すぎるデザートは衝突する。',
    temperatureEn: 'Room temp to warm (15-45°C) — warming unlocks hidden umami layers',
    temperatureJa: '常温〜燗（15-45°C）——温めると隠れた旨味の層が開く',
  },
  {
    sakeStyle: 'Yamahai / Kimoto',
    sakeStyleJa: '山廃 / 生酛',
    principle: 'Wild sake for wild food. These styles have the backbone for bold, funky, fermented flavors.',
    principleJa: '野性の酒には野性の料理を。これらのスタイルは大胆で発酵した味に負けない骨格を持つ。',
    pairings: [
      { dishEn: 'Grilled unagi (eel) with kabayaki sauce', dishJa: '鰻の蒲焼き', whyEn: 'The rich, gamey character of yamahai matches the intense sweetness of eel', whyJa: '山廃の濃厚で野性的な性格が鰻の強い甘さに匹敵する', intensityMatch: 10 },
      { dishEn: 'Blue cheese (Roquefort, Gorgonzola)', dishJa: 'ブルーチーズ（ロックフォール、ゴルゴンゾーラ）', whyEn: 'Funk meets funk — the lactic acid in both creates a cosmic handshake', whyJa: '発酵が発酵に出会う——両方の乳酸が宇宙的な握手を生む', intensityMatch: 9 },
      { dishEn: 'Lamb chops with rosemary', dishJa: 'ラムチョップ ローズマリー添え', whyEn: 'Kimoto\'s gamey depth matches lamb\'s gamey richness — kindred spirits', whyJa: '生酛の野性的な深みがラムの野性的な豊かさに合う——同類の魂', intensityMatch: 8 },
      { dishEn: 'Natto on rice', dishJa: '納豆ご飯', whyEn: 'The ultimate fermentation pairing — only yamahai can handle natto\'s intensity', whyJa: '究極の発酵ペアリング——山廃だけが納豆の強さに対応できる', intensityMatch: 10 },
    ],
    avoidEn: 'Delicate sashimi, light salads. The yamahai will overpower them.',
    avoidJa: '繊細な刺身、軽いサラダ。山廃が圧倒してしまう。',
    temperatureEn: 'Warm (40-50°C) — heat tames the wildness and reveals hidden sweetness',
    temperatureJa: '燗（40-50°C）——熱が野性を鎮め、隠れた甘さを引き出す',
  },
  {
    sakeStyle: 'Namazake (Unpasteurized)',
    sakeStyleJa: '生酒',
    principle: 'Fresh meets fresh. Namazake is alive — pair it with things that are still breathing.',
    principleJa: '新鮮が新鮮に出会う。生酒は生きている——まだ息をしているものと合わせる。',
    pairings: [
      { dishEn: 'Raw oysters with ponzu', dishJa: '生牡蠣 ポン酢', whyEn: 'Ocean freshness meets rice freshness — the ponzu bridges the mineral gap', whyJa: '海の新鮮さが米の新鮮さに出会う——ポン酢がミネラルの隙間を橋渡し', intensityMatch: 10 },
      { dishEn: 'Ceviche with lime and cilantro', dishJa: 'セビーチェ ライムとパクチー', whyEn: 'The citrus zing of namazake amplifies the lime — a tropical-Japanese fusion', whyJa: '生酒の柑橘の刺激がライムを増幅——トロピカルと日本の融合', intensityMatch: 8 },
      { dishEn: 'Spring vegetable tempura', dishJa: '春野菜の天ぷら', whyEn: 'Seasonal alignment — spring namazake with spring vegetables is poetic', whyJa: '季節の調和——春の生酒と春野菜は詩的', intensityMatch: 9 },
      { dishEn: 'Fresh burrata with basil and olive oil', dishJa: 'ブッラータ バジルとオリーブオイル', whyEn: 'Creamy, fresh, alive — the Italian-Japanese handshake nobody expected', whyJa: 'クリーミーで新鮮で生きている——誰も予想しなかったイタリアと日本の握手', intensityMatch: 8 },
    ],
    avoidEn: 'Anything heavy, cooked for hours, or deeply smoked. Namazake wants lightness.',
    avoidJa: '重いもの、長時間調理したもの、深く燻製したもの。生酒は軽さを求める。',
    temperatureEn: 'Cold (5-10°C) — keep it alive and vibrant',
    temperatureJa: '冷酒（5-10°C）——生き生きと鮮やかに保つ',
  },
  {
    sakeStyle: 'Nigori (Cloudy)',
    sakeStyleJa: 'にごり酒',
    principle: 'Texture is the key. Nigori\'s creamy body pairs with creamy, spicy, or sweet foods.',
    principleJa: 'テクスチャーが鍵。にごりのクリーミーな体はクリーミー、スパイシー、甘い料理と合う。',
    pairings: [
      { dishEn: 'Thai green curry', dishJa: 'タイのグリーンカレー', whyEn: 'The creamy sweetness of nigori tames the chili heat — a legendary pairing', whyJa: 'にごりのクリーミーな甘さが唐辛子の辛さを鎮める——伝説的な組み合わせ', intensityMatch: 10 },
      { dishEn: 'Mango sticky rice', dishJa: 'マンゴースティッキーライス', whyEn: 'Sweet meets sweet, rice meets rice — the dessert pairing that converts skeptics', whyJa: '甘さが甘さに、米が米に出会う——懐疑派を改宗させるデザートペアリング', intensityMatch: 9 },
      { dishEn: 'Fried chicken (karaage)', dishJa: '唐揚げ', whyEn: 'The richness of nigori coats the crispy exterior — comfort food elevated', whyJa: 'にごりの豊かさがカリカリの衣を包む——コンフォートフードの昇華', intensityMatch: 8 },
      { dishEn: 'Dark chocolate truffles', dishJa: 'ダークチョコレートトリュフ', whyEn: 'The bitter-sweet contrast with nigori\'s milky sweetness is transcendent', whyJa: 'にごりのミルキーな甘さとのビタースイートなコントラストは超越的', intensityMatch: 7 },
    ],
    avoidEn: 'Delicate fish, subtle flavors. Nigori is a flavor bulldozer — use it wisely.',
    avoidJa: '繊細な魚、微妙な味。にごりは味のブルドーザー——賢く使う。',
    temperatureEn: 'Cold (5-8°C) — shake gently before serving to redistribute the sediment',
    temperatureJa: '冷酒（5-8°C）——注ぐ前に優しく振って澱を再分散',
  },
  {
    sakeStyle: 'Koshu (Aged)',
    sakeStyleJa: '古酒',
    principle: 'Time demands time. Aged sake pairs with foods that have also been transformed by time.',
    principleJa: '時間は時間を求める。古酒は時間によって変容した料理と合う。',
    pairings: [
      { dishEn: 'Foie gras with fig compote', dishJa: 'フォアグラ イチジクのコンポート添え', whyEn: 'The caramel and dried fruit notes in koshu mirror the richness of foie gras', whyJa: '古酒のキャラメルとドライフルーツの香りがフォアグラの豊かさを映す', intensityMatch: 9 },
      { dishEn: 'Aged Parmigiano-Reggiano (36+ months)', dishJa: '熟成パルミジャーノ・レッジャーノ（36ヶ月以上）', whyEn: 'Two things perfected by time — the amino acid crystals in both create fireworks', whyJa: '時間によって完成された二つのもの——両方のアミノ酸結晶が花火を生む', intensityMatch: 10 },
      { dishEn: 'Peking duck', dishJa: '北京ダック', whyEn: 'The lacquered skin\'s sweetness matches koshu\'s caramelized depth', whyJa: '皮の甘さが古酒のキャラメル化した深みに合う', intensityMatch: 8 },
      { dishEn: 'Crème brûlée', dishJa: 'クレームブリュレ', whyEn: 'Caramel meets caramel — the dessert course that makes koshu sing', whyJa: 'キャラメルがキャラメルに出会う——古酒を歌わせるデザートコース', intensityMatch: 9 },
    ],
    avoidEn: 'Raw, fresh, light foods. Koshu has traveled too far to go back to simplicity.',
    avoidJa: '生の、新鮮な、軽い料理。古酒はシンプルさに戻るには遠くまで旅してきた。',
    temperatureEn: 'Room temp or slightly warm (18-40°C) — let the complexity breathe',
    temperatureJa: '常温またはやや温め（18-40°C）——複雑さに呼吸させる',
  },
  {
    sakeStyle: 'Sparkling Sake',
    sakeStyleJa: 'スパークリング日本酒',
    principle: 'Celebration in a glass. Sparkling sake is the aperitif, the palate cleanser, the party starter.',
    principleJa: 'グラスの中の祝祭。スパークリング日本酒は食前酒、口直し、パーティーの始まり。',
    pairings: [
      { dishEn: 'Sushi (especially uni and ikura)', dishJa: '寿司（特にウニとイクラ）', whyEn: 'The bubbles cut through the richness of sea urchin and salmon roe', whyJa: '泡がウニとイクラの豊かさを切る', intensityMatch: 9 },
      { dishEn: 'Prosciutto and melon', dishJa: '生ハムとメロン', whyEn: 'Sweet, salty, effervescent — the Italian aperitivo reimagined', whyJa: '甘く、塩辛く、発泡——イタリアのアペリティーヴォの再想像', intensityMatch: 8 },
      { dishEn: 'Strawberry shortcake', dishJa: 'ストロベリーショートケーキ', whyEn: 'Low-alcohol sparkling sake with strawberries is Japan\'s answer to Champagne and cake', whyJa: '低アルコールスパークリングとイチゴはシャンパンとケーキへの日本の答え', intensityMatch: 7 },
      { dishEn: 'Fried calamari with lemon', dishJa: 'フライドカラマリ レモン添え', whyEn: 'Bubbles + fried food = the universal law of deliciousness', whyJa: '泡＋揚げ物＝美味しさの普遍的法則', intensityMatch: 8 },
    ],
    avoidEn: 'Heavy stews, strong cheeses. The bubbles can\'t compete with that much weight.',
    avoidJa: '重いシチュー、強いチーズ。泡はそれほどの重さに対抗できない。',
    temperatureEn: 'Very cold (3-7°C) — like Champagne, colder is better for sparkling',
    temperatureJa: 'よく冷やす（3-7°C）——シャンパン同様、スパークリングは冷たい方が良い',
  },
];

// ============================================================
// PAIRING PRINCIPLES — The Philosophy Behind the Matches
// ============================================================

export interface PairingPrinciple {
  nameEn: string;
  nameJa: string;
  descriptionEn: string;
  descriptionJa: string;
  icon: string;
}

export const pairingPrinciples: PairingPrinciple[] = [
  { nameEn: 'Wash (洗)', nameJa: '洗い流す', descriptionEn: 'Sake cleanses the palate between bites — use crisp, dry styles to reset after rich foods', descriptionJa: '酒が一口ごとに口を洗い流す——豊かな料理の後にキレのある辛口でリセット', icon: '💧' },
  { nameEn: 'Bridge (橋)', nameJa: '橋渡し', descriptionEn: 'Find a shared flavor between sake and food — umami bridges umami, sweetness bridges sweetness', descriptionJa: '酒と料理の共通の味を見つける——旨味が旨味を、甘さが甘さを橋渡し', icon: '🌉' },
  { nameEn: 'Push (押)', nameJa: '押し上げる', descriptionEn: 'Sake amplifies a flavor in the food — acidity pushes citrus, richness pushes cream', descriptionJa: '酒が料理の味を増幅する——酸味が柑橘を、豊かさがクリームを押し上げる', icon: '⬆️' },
  { nameEn: 'Cut (切)', nameJa: '切る', descriptionEn: 'Sake slices through heaviness — dry sake cuts oil, acid cuts fat, bubbles cut richness', descriptionJa: '酒が重さを切る——辛口が油を、酸が脂を、泡が豊かさを切る', icon: '✂️' },
  { nameEn: 'Contrast (対)', nameJa: '対比', descriptionEn: 'Opposites attract — sweet sake with salty food, dry sake with sweet glazes', descriptionJa: '対極が引き合う——甘い酒と塩辛い料理、辛口と甘い釉薬', icon: '☯️' },
  { nameEn: 'Season (季)', nameJa: '季節', descriptionEn: 'Match the season — spring namazake with spring vegetables, autumn hiyaoroshi with autumn mushrooms', descriptionJa: '季節を合わせる——春の生酒と春野菜、秋のひやおろしと秋のキノコ', icon: '🍂' },
];

// ============================================================
// TOP 50 SAKE RETAILERS — US + International
// ============================================================

export interface SakeRetailer {
  name: string;
  location: string;
  country: string;
  region: string;
  type: 'online' | 'physical' | 'both';
  specialtyEn: string;
  specialtyJa: string;
  url: string;
  hasAffiliate: boolean;
  affiliateNotes: string;
  priceRange: '$' | '$$' | '$$$';
  selectionSize: 'small' | 'medium' | 'large' | 'massive';
  shipsTo: string[];
  notableEn: string;
  notableJa: string;
}

export const sakeRetailers: SakeRetailer[] = [
  // === US ONLINE ===
  { name: 'Tippsy', location: 'Los Angeles, CA', country: 'US', region: 'West Coast', type: 'online', specialtyEn: 'Largest US online sake store with subscription service and personalized recommendations', specialtyJa: '米国最大のオンライン酒店、サブスクリプションとパーソナライズ推薦', url: 'https://www.tippsysake.com', hasAffiliate: true, affiliateNotes: '10% commission on all purchases via ShareASale', priceRange: '$$', selectionSize: 'massive', shipsTo: ['US (most states)'], notableEn: 'Best for beginners — their quiz matches you to sake. Subscription boxes are excellent gifts.', notableJa: '初心者に最適——クイズで酒をマッチング。サブスクリプションボックスは素晴らしいギフト。' },
  { name: 'True Sake', location: 'San Francisco, CA', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'America\'s first dedicated sake store — legendary curation by Beau Timken', specialtyJa: 'アメリカ初の専門酒店——ボー・ティムケンの伝説的キュレーション', url: 'https://www.truesake.com', hasAffiliate: false, affiliateNotes: 'No formal affiliate program — contact for partnership', priceRange: '$$', selectionSize: 'large', shipsTo: ['US (most states)'], notableEn: 'The godfather of American sake retail. If Beau recommends it, trust him.', notableJa: 'アメリカの酒小売の教父。ボーが推薦するなら信頼せよ。' },
  { name: 'Sake Social', location: 'Online', country: 'US', region: 'National', type: 'online', specialtyEn: 'Curated monthly sake boxes with educational materials', specialtyJa: '教育資料付きの月刊キュレーション酒ボックス', url: 'https://www.sakesocial.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership opportunities', priceRange: '$$', selectionSize: 'medium', shipsTo: ['US (most states)'], notableEn: 'The educational approach makes this perfect for our audience.', notableJa: '教育的アプローチが私たちのオーディエンスに最適。' },
  { name: 'Saketaro', location: 'Online', country: 'US', region: 'National', type: 'online', specialtyEn: 'Premium sake subscription with insulated packaging', specialtyJa: '断熱包装のプレミアム酒サブスクリプション', url: 'https://www.saketaro.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'medium', shipsTo: ['US'], notableEn: 'Excellent packaging — sake arrives in perfect condition. Premium focus.', notableJa: '優れた包装——酒が完璧な状態で届く。プレミアム重視。' },
  { name: 'SakéOne', location: 'Forest Grove, OR', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'American-brewed sake + imported Japanese selections', specialtyJa: 'アメリカ醸造酒＋日本からの輸入セレクション', url: 'https://www.sakeone.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'medium', shipsTo: ['US'], notableEn: 'The bridge between American and Japanese sake — their Momokawa line is excellent value.', notableJa: 'アメリカと日本の酒の架け橋——百川ラインは優れた価値。' },
  // === US PHYSICAL + ONLINE ===
  { name: 'Sakaya', location: 'New York, NY', country: 'US', region: 'East Coast', type: 'both', specialtyEn: 'NYC\'s premier sake boutique — intimate, knowledgeable, curated', specialtyJa: 'NYCのプレミア酒ブティック——親密で知識豊富なキュレーション', url: 'https://www.sakayanyc.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'medium', shipsTo: ['NY, NJ, CT'], notableEn: 'Rick and Hiroko Smith are walking encyclopedias. Visit in person if you can.', notableJa: 'リックとヒロコ・スミスは歩く百科事典。可能なら直接訪問を。' },
  { name: 'Astor Wines & Spirits', location: 'New York, NY', country: 'US', region: 'East Coast', type: 'both', specialtyEn: 'Massive selection across all spirits — strong sake section', specialtyJa: '全スピリッツの膨大なセレクション——強力な酒セクション', url: 'https://www.astorwines.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'large', shipsTo: ['US (most states)'], notableEn: 'The sake section is a hidden gem inside a massive wine store.', notableJa: '巨大なワインストアの中の隠れた宝石。' },
  { name: 'K&L Wine Merchants', location: 'San Francisco / Redwood City, CA', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'Legendary wine merchant with growing sake program', specialtyJa: '成長する酒プログラムを持つ伝説的ワイン商', url: 'https://www.klwines.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'medium', shipsTo: ['US (most states)'], notableEn: 'Wine people crossing over to sake start here. Great bridge retailer.', notableJa: 'ワインから酒に移行する人はここから始める。素晴らしい架け橋小売店。' },
  { name: 'Umami Mart', location: 'Oakland, CA', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'Japanese barware + curated sake and spirits — the aesthetic choice', specialtyJa: '日本のバーウェア＋キュレーション酒とスピリッツ——美的選択', url: 'https://umamimart.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'small', shipsTo: ['US'], notableEn: 'Buy the sake AND the vessel to drink it from. The full experience.', notableJa: '酒もそれを飲む器も買える。完全な体験。' },
  { name: 'Binny\'s Beverage Depot', location: 'Chicago, IL', country: 'US', region: 'Midwest', type: 'both', specialtyEn: 'Chicago\'s largest beverage retailer with solid sake selection', specialtyJa: 'シカゴ最大の飲料小売店、充実した酒セレクション', url: 'https://www.binnys.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$', selectionSize: 'large', shipsTo: ['IL'], notableEn: 'Best value in the Midwest. Their house selections are surprisingly good.', notableJa: '中西部で最高の価値。自社セレクションは驚くほど良い。' },
  // === US SPECIALTY ===
  { name: 'Mutual Trading Co.', location: 'Los Angeles, CA', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'Major Japanese food and sake distributor — wholesale and retail', specialtyJa: '日本食品と酒の主要ディストリビューター', url: 'https://www.mutualtrading.com', hasAffiliate: false, affiliateNotes: 'B2B partnership opportunities', priceRange: '$$', selectionSize: 'massive', shipsTo: ['US'], notableEn: 'The invisible giant — they supply most Japanese restaurants in the US.', notableJa: '見えない巨人——米国のほとんどの日本料理店に供給。' },
  { name: 'Vine Connections', location: 'Sausalito, CA', country: 'US', region: 'West Coast', type: 'online', specialtyEn: 'Premium sake importer — artisanal focus, small producers', specialtyJa: 'プレミアム酒輸入業者——職人的、小規模生産者重視', url: 'https://www.vineconnections.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'medium', shipsTo: ['US'], notableEn: 'If you want the small-batch, village-level sake — this is your source.', notableJa: '小ロット、村レベルの酒が欲しいなら——ここがソース。' },
  { name: 'Bottle Barn', location: 'Santa Rosa, CA', country: 'US', region: 'West Coast', type: 'both', specialtyEn: 'Wine country retailer with excellent sake section', specialtyJa: 'ワインカントリーの小売店、優れた酒セクション', url: 'https://bottlebarn.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$', selectionSize: 'medium', shipsTo: ['US (most states)'], notableEn: 'Great prices — often the cheapest place to find premium sake online.', notableJa: '素晴らしい価格——プレミアム酒をオンラインで最安で見つけられることが多い。' },
  { name: 'Drizly / Uber Eats', location: 'National', country: 'US', region: 'National', type: 'online', specialtyEn: 'On-demand alcohol delivery — sake available in most metro areas', specialtyJa: 'オンデマンドアルコール配達——ほとんどの都市部で酒が利用可能', url: 'https://www.drizly.com', hasAffiliate: true, affiliateNotes: 'Affiliate program available through Impact', priceRange: '$$', selectionSize: 'medium', shipsTo: ['US (metro areas)'], notableEn: 'When you need sake in 30 minutes. Selection varies by location.', notableJa: '30分で酒が必要な時。セレクションは場所により異なる。' },
  { name: 'Total Wine & More', location: 'National (200+ stores)', country: 'US', region: 'National', type: 'both', specialtyEn: 'America\'s largest independent wine retailer — growing sake section', specialtyJa: 'アメリカ最大の独立系ワイン小売店——成長する酒セクション', url: 'https://www.totalwine.com', hasAffiliate: true, affiliateNotes: 'Affiliate program available', priceRange: '$', selectionSize: 'large', shipsTo: ['US'], notableEn: 'Most accessible entry point — there\'s probably one near you.', notableJa: '最もアクセスしやすいエントリーポイント——おそらく近くにある。' },
  // === JAPAN ===
  { name: 'IMADEYA', location: 'Chiba / Tokyo, Japan', country: 'Japan', region: 'Kanto', type: 'both', specialtyEn: 'Japan\'s most respected sake retailer — brewery-direct relationships', specialtyJa: '日本で最も尊敬される酒小売店——蔵元直接の関係', url: 'https://en.imadeya.co.jp', hasAffiliate: false, affiliateNotes: 'Contact for international partnership', priceRange: '$$', selectionSize: 'massive', shipsTo: ['Japan', 'International (select)'], notableEn: 'THE destination if you\'re in Japan. Their staff are certified sake sommeliers.', notableJa: '日本にいるなら必訪。スタッフは認定酒ソムリエ。' },
  { name: 'Hasegawa Saketen', location: 'Tokyo Station, Japan', country: 'Japan', region: 'Kanto', type: 'physical', specialtyEn: 'Iconic sake shop inside Tokyo Station — perfect for last-minute gifts', specialtyJa: '東京駅内の象徴的酒店——最後の贈り物に最適', url: 'https://www.hasegawasaketen.com', hasAffiliate: false, affiliateNotes: 'Physical only — pilgrimage destination', priceRange: '$$', selectionSize: 'large', shipsTo: ['Japan'], notableEn: 'Before you board the Shinkansen, stop here. You\'ll thank yourself later.', notableJa: '新幹線に乗る前にここに立ち寄れ。後で自分に感謝する。' },
  { name: 'Kurashu', location: 'Online (Japan-based)', country: 'Japan', region: 'National', type: 'online', specialtyEn: 'Ships premium sake directly from Japan to 13+ countries', specialtyJa: '日本から13カ国以上にプレミアム酒を直送', url: 'https://www.kurashu.jp', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'medium', shipsTo: ['Japan', 'Asia', 'Select international'], notableEn: 'The closest thing to buying directly from the brewery without being in Japan.', notableJa: '日本にいなくても蔵元から直接買うのに最も近い。' },
  { name: 'Sake no Nishida', location: 'Fushimi, Kyoto, Japan', country: 'Japan', region: 'Kansai', type: 'physical', specialtyEn: 'Fushimi\'s legendary sake shop — deep Kyoto selection', specialtyJa: '伏見の伝説的酒店——深い京都セレクション', url: '', hasAffiliate: false, affiliateNotes: 'Physical only — Kyoto pilgrimage', priceRange: '$$', selectionSize: 'medium', shipsTo: ['Japan'], notableEn: 'In the heart of Fushimi\'s sake district. The owner knows every brewer personally.', notableJa: '伏見の酒蔵地区の中心。店主はすべての蔵元を個人的に知っている。' },
  { name: 'Pontocho Sake Bar District', location: 'Kyoto, Japan', country: 'Japan', region: 'Kansai', type: 'physical', specialtyEn: 'Not a store — a district of hidden sake bars in lantern-lit alleys', specialtyJa: '店ではなく——提灯の路地に隠れた酒バーの地区', url: '', hasAffiliate: false, affiliateNotes: 'Experience, not retail', priceRange: '$$$', selectionSize: 'small', shipsTo: [], notableEn: 'You don\'t buy sake here — you experience it. Every bar has 3-5 seats.', notableJa: 'ここでは酒を買わない——体験する。各バーは3〜5席。' },
  // === UK / EUROPE ===
  { name: 'Tengu Sake', location: 'London, UK', country: 'UK', region: 'Europe', type: 'both', specialtyEn: 'UK\'s leading sake specialist — Oliver Hilton-Johnson is a legend', specialtyJa: '英国を代表する酒専門店——オリバー・ヒルトン＝ジョンソンは伝説', url: 'https://www.tengusake.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'large', shipsTo: ['UK', 'EU'], notableEn: 'The gateway to sake for all of Europe. Their tasting events are legendary.', notableJa: 'ヨーロッパ全体の酒への入口。テイスティングイベントは伝説的。' },
  { name: 'Japan Centre', location: 'London, UK', country: 'UK', region: 'Europe', type: 'both', specialtyEn: 'Japanese food and sake superstore — broad selection', specialtyJa: '日本食品と酒のスーパーストア——幅広いセレクション', url: 'https://www.japancentre.com', hasAffiliate: true, affiliateNotes: 'Affiliate program available', priceRange: '$$', selectionSize: 'large', shipsTo: ['UK', 'EU'], notableEn: 'Buy the sake and the ingredients to cook the pairing. One-stop shop.', notableJa: '酒もペアリングの食材も買える。ワンストップショップ。' },
  { name: 'JSake', location: 'Germany', country: 'Germany', region: 'Europe', type: 'online', specialtyEn: 'Direct importer — 100+ premium sake from Japan to Europe', specialtyJa: '直接輸入業者——日本からヨーロッパへ100以上のプレミアム酒', url: 'https://jsake.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'large', shipsTo: ['EU'], notableEn: 'Best selection in continental Europe. German efficiency meets Japanese craft.', notableJa: 'ヨーロッパ大陸で最高のセレクション。ドイツの効率性が日本の技に出会う。' },
  { name: 'Lucky Sake', location: 'Switzerland', country: 'Switzerland', region: 'Europe', type: 'online', specialtyEn: 'Swiss-based premium sake importer with affiliate program', specialtyJa: 'スイス拠点のプレミアム酒輸入業者、アフィリエイトプログラムあり', url: 'https://www.luckysake.com', hasAffiliate: true, affiliateNotes: 'ShareASale affiliate program — competitive commissions', priceRange: '$$$', selectionSize: 'medium', shipsTo: ['EU', 'Switzerland'], notableEn: 'Premium positioning with an actual affiliate program — rare in sake.', notableJa: 'プレミアムポジショニングと実際のアフィリエイトプログラム——酒では珍しい。' },
  // === AUSTRALIA / ASIA ===
  { name: 'Sakeshop', location: 'Sydney, Australia', country: 'Australia', region: 'Oceania', type: 'both', specialtyEn: 'Australia\'s premier sake retailer — excellent curation', specialtyJa: 'オーストラリアのプレミア酒小売店——優れたキュレーション', url: 'https://www.sakeshop.com.au', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$', selectionSize: 'medium', shipsTo: ['Australia'], notableEn: 'The best sake selection south of the equator.', notableJa: '赤道以南で最高の酒セレクション。' },
  { name: 'The Nihonshu', location: 'Singapore', country: 'Singapore', region: 'Asia', type: 'online', specialtyEn: 'Rare sake from small Japanese producers — ships across Asia', specialtyJa: '日本の小規模生産者からの希少酒——アジア全域に配送', url: 'https://the-nihonshu.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'medium', shipsTo: ['Singapore', 'Taiwan', 'Hong Kong'], notableEn: 'The esoteric picks. Small producers you\'ve never heard of. That\'s the point.', notableJa: '秘教的なセレクション。聞いたことのない小規模生産者。それがポイント。' },
  { name: 'Dekanta', location: 'Tokyo / Online', country: 'Japan', region: 'International', type: 'online', specialtyEn: 'Premium Japanese spirits and sake — ships worldwide', specialtyJa: 'プレミアム日本のスピリッツと酒——世界中に配送', url: 'https://dekanta.com', hasAffiliate: false, affiliateNotes: 'Contact for partnership', priceRange: '$$$', selectionSize: 'large', shipsTo: ['Worldwide'], notableEn: 'When you want that impossible-to-find bottle shipped to your door.', notableJa: '見つけられないボトルを玄関まで届けてほしい時。' },
];

// ============================================================
// VALUE MATRIX — Best Experience Per Dollar
// ============================================================

export interface ValueEntry {
  nameEn: string;
  nameJa: string;
  brewery: string;
  style: string;
  priceUS: string;
  priceJapan: string;
  exvScore: number;
  valueRatio: number; // EXV per dollar
  availabilityUS: 'easy' | 'moderate' | 'hard' | 'impossible';
  availabilityJapan: 'easy' | 'moderate' | 'hard';
  whyEn: string;
  whyJa: string;
  flavorEn: string;
  flavorJa: string;
}

export const valueMatrix: ValueEntry[] = [
  { nameEn: 'Kubota Senju', nameJa: '久保田 千寿', brewery: 'Asahi-Shuzo (Niigata)', style: 'Tokubetsu Honjozo', priceUS: '$25-30', priceJapan: '¥1,200', exvScore: 52, valueRatio: 9.2, availabilityUS: 'easy', availabilityJapan: 'easy', whyEn: 'The gateway drug. Clean, crisp, endlessly drinkable. Available everywhere.', whyJa: '入門の酒。清く、キレがあり、無限に飲める。どこでも手に入る。', flavorEn: 'Clean melon, white peach, mineral finish', flavorJa: 'クリーンなメロン、白桃、ミネラルのフィニッシュ' },
  { nameEn: 'Hakkaisan Tokubetsu Honjozo', nameJa: '八海山 特別本醸造', brewery: 'Hakkaisan (Niigata)', style: 'Tokubetsu Honjozo', priceUS: '$20-25', priceJapan: '¥1,100', exvScore: 48, valueRatio: 9.5, availabilityUS: 'easy', availabilityJapan: 'easy', whyEn: 'Mountain water purity at an absurd price point. The best value in sake.', whyJa: '山水の純粋さが驚くべき価格で。酒で最高の価値。', flavorEn: 'Crisp, light, snow-melt freshness', flavorJa: 'キレがあり、軽く、雪解けの新鮮さ' },
  { nameEn: 'Masumi Okuden Kantsukuri', nameJa: '真澄 奥伝寒造り', brewery: 'Miyasaka (Nagano)', style: 'Junmai', priceUS: '$18-22', priceJapan: '¥1,000', exvScore: 50, valueRatio: 10.0, availabilityUS: 'easy', availabilityJapan: 'easy', whyEn: 'The junmai that converted a generation. Rich, warm, honest.', whyJa: '一世代を改宗させた純米。豊かで、温かく、正直。', flavorEn: 'Rice, chestnut, warm earth, gentle sweetness', flavorJa: '米、栗、温かい土、穏やかな甘さ' },
  { nameEn: 'Dewazakura Oka Ginjo', nameJa: '出羽桜 桜花吟醸', brewery: 'Dewazakura (Yamagata)', style: 'Ginjo', priceUS: '$22-28', priceJapan: '¥1,300', exvScore: 55, valueRatio: 9.0, availabilityUS: 'easy', availabilityJapan: 'easy', whyEn: 'Cherry blossom in a bottle. The ginjo that started the ginjo boom.', whyJa: 'ボトルの中の桜。吟醸ブームを始めた吟醸。', flavorEn: 'Cherry blossom, pear, banana, elegant finish', flavorJa: '桜、梨、バナナ、エレガントなフィニッシュ' },
  { nameEn: 'Tedorigawa Yamahai Junmai', nameJa: '手取川 山廃純米', brewery: 'Yoshida (Ishikawa)', style: 'Yamahai Junmai', priceUS: '$25-30', priceJapan: '¥1,400', exvScore: 58, valueRatio: 8.8, availabilityUS: 'moderate', availabilityJapan: 'easy', whyEn: 'The yamahai that proves wild doesn\'t mean rough. Elegant wildness.', whyJa: '野性は荒さではないことを証明する山廃。エレガントな野性。', flavorEn: 'Lactic, mushroom, honey, long umami finish', flavorJa: '乳酸、キノコ、蜂蜜、長い旨味のフィニッシュ' },
  { nameEn: 'Suigei Tokubetsu Junmai', nameJa: '酔鯨 特別純米', brewery: 'Suigei (Kochi)', style: 'Tokubetsu Junmai', priceUS: '$22-28', priceJapan: '¥1,200', exvScore: 52, valueRatio: 9.0, availabilityUS: 'moderate', availabilityJapan: 'easy', whyEn: 'The "Drunken Whale" — dry, sharp, food-friendly. Kochi drinking culture in a bottle.', whyJa: '「酔鯨」——辛口、シャープ、料理に合う。高知の飲酒文化がボトルに。', flavorEn: 'Dry, citrus, mineral, clean cut', flavorJa: '辛口、柑橘、ミネラル、クリーンなキレ' },
  { nameEn: 'Juyondai Honmaru', nameJa: '十四代 本丸', brewery: 'Takagi (Yamagata)', style: 'Tokubetsu Honjozo', priceUS: '$80-200+', priceJapan: '¥2,000 (retail) / ¥15,000+ (resale)', exvScore: 72, valueRatio: 4.0, availabilityUS: 'impossible', availabilityJapan: 'hard', whyEn: 'The unicorn. If you find it at retail price, buy every bottle. Life-changing sake.', whyJa: 'ユニコーン。定価で見つけたら全部買え。人生を変える酒。', flavorEn: 'Tropical fruit, silk, honey, infinite layers', flavorJa: 'トロピカルフルーツ、絹、蜂蜜、無限の層' },
  { nameEn: 'Dassai 45', nameJa: '獺祭 45', brewery: 'Asahi Shuzo (Yamaguchi)', style: 'Junmai Daiginjo', priceUS: '$28-35', priceJapan: '¥1,500', exvScore: 50, valueRatio: 7.5, availabilityUS: 'easy', availabilityJapan: 'easy', whyEn: 'The most famous sake in the world. Polarizing but undeniably accessible.', whyJa: '世界で最も有名な酒。賛否両論だが否定できないアクセシビリティ。', flavorEn: 'Floral, light, clean, approachable', flavorJa: '花、軽い、クリーン、親しみやすい' },
  { nameEn: 'Kokuryu Junmai Ginjo', nameJa: '黒龍 純米吟醸', brewery: 'Kokuryu (Fukui)', style: 'Junmai Ginjo', priceUS: '$35-45', priceJapan: '¥1,800', exvScore: 60, valueRatio: 7.8, availabilityUS: 'moderate', availabilityJapan: 'easy', whyEn: 'The "Black Dragon" — elegant, powerful, unforgettable. A connoisseur\'s daily driver.', whyJa: '「黒龍」——エレガントで力強く、忘れられない。通の日常酒。', flavorEn: 'Pear, white flower, rice sweetness, long finish', flavorJa: '梨、白い花、米の甘さ、長いフィニッシュ' },
  { nameEn: 'Tamagawa "Time Machine" 1712', nameJa: '玉川 タイムマシン 1712', brewery: 'Kinoshita (Kyoto)', style: 'Yamahai Junmai (Aged)', priceUS: '$30-40', priceJapan: '¥1,600', exvScore: 65, valueRatio: 8.5, availabilityUS: 'hard', availabilityJapan: 'moderate', whyEn: 'Brewed using 1712 methods by a British toji. The most punk sake in existence.', whyJa: '英国人杜氏が1712年の方法で醸造。存在する最もパンクな酒。', flavorEn: 'Caramel, soy, dried fruit, wild complexity', flavorJa: 'キャラメル、醤油、ドライフルーツ、野性的な複雑さ' },
];

// ============================================================
// TASTE PROFILE DIMENSIONS — For the Taste Profile Test
// ============================================================

export interface TasteQuestion {
  id: number;
  questionEn: string;
  questionJa: string;
  options: {
    labelEn: string;
    labelJa: string;
    scores: { sweet: number; dry: number; rich: number; light: number; aromatic: number; earthy: number; };
  }[];
}

export const tasteQuestions: TasteQuestion[] = [
  {
    id: 1,
    questionEn: 'You\'re at a bar. What do you reach for first?',
    questionJa: 'バーにいます。最初に何に手を伸ばす？',
    options: [
      { labelEn: 'A crisp gin & tonic with cucumber', labelJa: 'キュウリ入りのキリッとしたジントニック', scores: { sweet: 0, dry: 3, rich: 0, light: 3, aromatic: 2, earthy: 0 } },
      { labelEn: 'A bold Negroni', labelJa: '力強いネグローニ', scores: { sweet: 1, dry: 2, rich: 3, light: 0, aromatic: 1, earthy: 2 } },
      { labelEn: 'A glass of off-dry Riesling', labelJa: 'オフドライのリースリング', scores: { sweet: 2, dry: 1, rich: 1, light: 2, aromatic: 3, earthy: 0 } },
      { labelEn: 'An aged Old Fashioned', labelJa: '熟成オールドファッションド', scores: { sweet: 2, dry: 1, rich: 3, light: 0, aromatic: 1, earthy: 3 } },
    ]
  },
  {
    id: 2,
    questionEn: 'Your ideal breakfast is:',
    questionJa: '理想の朝食は：',
    options: [
      { labelEn: 'Fresh fruit and yogurt', labelJa: 'フレッシュフルーツとヨーグルト', scores: { sweet: 2, dry: 0, rich: 0, light: 3, aromatic: 2, earthy: 0 } },
      { labelEn: 'Eggs Benedict with hollandaise', labelJa: 'エッグベネディクト オランデーズソース', scores: { sweet: 0, dry: 1, rich: 3, light: 0, aromatic: 1, earthy: 1 } },
      { labelEn: 'Miso soup, rice, grilled fish', labelJa: '味噌汁、ご飯、焼き魚', scores: { sweet: 0, dry: 2, rich: 2, light: 1, aromatic: 0, earthy: 3 } },
      { labelEn: 'Croissant with jam and espresso', labelJa: 'クロワッサンとジャムとエスプレッソ', scores: { sweet: 3, dry: 0, rich: 2, light: 1, aromatic: 2, earthy: 0 } },
    ]
  },
  {
    id: 3,
    questionEn: 'In a perfume shop, you\'re drawn to:',
    questionJa: '香水店で惹かれるのは：',
    options: [
      { labelEn: 'Fresh citrus and green tea', labelJa: 'フレッシュな柑橘と緑茶', scores: { sweet: 0, dry: 2, rich: 0, light: 3, aromatic: 3, earthy: 0 } },
      { labelEn: 'White flowers and vanilla', labelJa: '白い花とバニラ', scores: { sweet: 3, dry: 0, rich: 1, light: 1, aromatic: 3, earthy: 0 } },
      { labelEn: 'Leather, tobacco, and sandalwood', labelJa: 'レザー、タバコ、サンダルウッド', scores: { sweet: 0, dry: 2, rich: 3, light: 0, aromatic: 1, earthy: 3 } },
      { labelEn: 'Wet stone and forest floor', labelJa: '濡れた石と森の床', scores: { sweet: 0, dry: 3, rich: 1, light: 1, aromatic: 1, earthy: 3 } },
    ]
  },
  {
    id: 4,
    questionEn: 'Your favorite season is:',
    questionJa: '好きな季節は：',
    options: [
      { labelEn: 'Spring — cherry blossoms and new beginnings', labelJa: '春——桜と新しい始まり', scores: { sweet: 2, dry: 1, rich: 0, light: 3, aromatic: 3, earthy: 0 } },
      { labelEn: 'Summer — heat, festivals, cold drinks', labelJa: '夏——暑さ、祭り、冷たい飲み物', scores: { sweet: 1, dry: 2, rich: 0, light: 3, aromatic: 2, earthy: 0 } },
      { labelEn: 'Autumn — falling leaves and warm fires', labelJa: '秋——落ち葉と温かい火', scores: { sweet: 1, dry: 1, rich: 3, light: 0, aromatic: 1, earthy: 3 } },
      { labelEn: 'Winter — silence, snow, contemplation', labelJa: '冬——沈黙、雪、瞑想', scores: { sweet: 0, dry: 3, rich: 2, light: 1, aromatic: 0, earthy: 2 } },
    ]
  },
  {
    id: 5,
    questionEn: 'You\'re cooking dinner. What\'s the vibe?',
    questionJa: '夕食を作っています。雰囲気は？',
    options: [
      { labelEn: 'Light and fresh — poke bowl or ceviche', labelJa: '軽くて新鮮——ポケボウルかセビーチェ', scores: { sweet: 1, dry: 2, rich: 0, light: 3, aromatic: 2, earthy: 0 } },
      { labelEn: 'Slow-braised — osso buco or ramen', labelJa: 'じっくり煮込み——オッソブーコかラーメン', scores: { sweet: 0, dry: 1, rich: 3, light: 0, aromatic: 1, earthy: 3 } },
      { labelEn: 'Grilled — yakitori or steak', labelJa: '焼き——焼き鳥かステーキ', scores: { sweet: 0, dry: 2, rich: 2, light: 1, aromatic: 1, earthy: 2 } },
      { labelEn: 'Delicate — steamed fish with herbs', labelJa: '繊細——ハーブ蒸し魚', scores: { sweet: 1, dry: 1, rich: 1, light: 2, aromatic: 3, earthy: 1 } },
    ]
  },
  {
    id: 6,
    questionEn: 'Your relationship with spice:',
    questionJa: 'スパイスとの関係：',
    options: [
      { labelEn: 'Keep it mild — I want to taste the ingredients', labelJa: 'マイルドに——素材の味を感じたい', scores: { sweet: 1, dry: 1, rich: 0, light: 3, aromatic: 2, earthy: 0 } },
      { labelEn: 'Medium heat — enough to feel alive', labelJa: '中辛——生きていると感じる程度', scores: { sweet: 0, dry: 2, rich: 1, light: 1, aromatic: 1, earthy: 2 } },
      { labelEn: 'Bring the fire — I want to sweat', labelJa: '激辛——汗をかきたい', scores: { sweet: 0, dry: 3, rich: 2, light: 0, aromatic: 0, earthy: 3 } },
      { labelEn: 'Complex spice — layers, not just heat', labelJa: '複雑なスパイス——辛さだけでなく層', scores: { sweet: 1, dry: 1, rich: 2, light: 0, aromatic: 2, earthy: 2 } },
    ]
  },
  {
    id: 7,
    questionEn: 'Close your eyes. What landscape appears?',
    questionJa: '目を閉じて。どんな風景が浮かぶ？',
    options: [
      { labelEn: 'A misty mountain stream at dawn', labelJa: '夜明けの霧の山の渓流', scores: { sweet: 0, dry: 2, rich: 0, light: 3, aromatic: 1, earthy: 2 } },
      { labelEn: 'A sunlit garden full of flowers', labelJa: '花に満ちた陽光の庭', scores: { sweet: 2, dry: 0, rich: 1, light: 2, aromatic: 3, earthy: 0 } },
      { labelEn: 'An ancient cellar with oak barrels', labelJa: 'オーク樽のある古い地下室', scores: { sweet: 1, dry: 1, rich: 3, light: 0, aromatic: 1, earthy: 3 } },
      { labelEn: 'A wild coastline with crashing waves', labelJa: '波が打ち寄せる荒々しい海岸線', scores: { sweet: 0, dry: 3, rich: 1, light: 1, aromatic: 0, earthy: 2 } },
    ]
  },
];

export interface TasteProfile {
  nameEn: string;
  nameJa: string;
  descriptionEn: string;
  descriptionJa: string;
  dominantTraits: string[];
  recommendedStyles: string[];
  starterBottles: string[];
  icon: string;
}

export const tasteProfiles: TasteProfile[] = [
  { nameEn: 'The Purist', nameJa: '純粋主義者', descriptionEn: 'You crave clarity and precision. Your palate gravitates toward clean, dry, mineral-driven sake that lets the rice speak for itself. You\'d rather have one perfect sip than a bottle of mediocrity.', descriptionJa: '明瞭さと精密さを求める。あなたの味覚は、米自体が語るクリーンでドライなミネラル感のある酒に引き寄せられる。凡庸な一本より完璧な一口を選ぶ。', dominantTraits: ['dry', 'light'], recommendedStyles: ['Daiginjo', 'Junmai Daiginjo', 'Tanrei Karakuchi'], starterBottles: ['Kubota Senju', 'Hakkaisan Tokubetsu', 'Born Gold'], icon: '💎' },
  { nameEn: 'The Depth Seeker', nameJa: '深淵の探求者', descriptionEn: 'You want layers. Complexity. Something that reveals itself over time, like a conversation with an old friend. Rich, earthy, umami-forward sake is your territory.', descriptionJa: '層を求める。複雑さ。古い友人との会話のように時間とともに明かされるもの。豊かで土の香りの旨味前面の酒があなたの領域。', dominantTraits: ['rich', 'earthy'], recommendedStyles: ['Yamahai', 'Kimoto', 'Koshu', 'Junmai'], starterBottles: ['Tedorigawa Yamahai', 'Tamagawa Time Machine', 'Daishichi Kimoto'], icon: '🌑' },
  { nameEn: 'The Aromancer', nameJa: '香りの魔術師', descriptionEn: 'Your nose leads the way. You drink with your sense of smell first, tasting second. Floral, fruity, aromatic sake makes your soul sing. You probably love perfume too.', descriptionJa: '鼻が先導する。まず嗅覚で飲み、次に味わう。花、果実、芳香の酒が魂を歌わせる。おそらく香水も好き。', dominantTraits: ['aromatic', 'sweet'], recommendedStyles: ['Ginjo', 'Junmai Ginjo', 'Namazake', 'Sparkling'], starterBottles: ['Dewazakura Oka', 'Kokuryu Junmai Ginjo', 'Dassai 23'], icon: '🌸' },
  { nameEn: 'The Wild One', nameJa: '野生の者', descriptionEn: 'You want sake that surprises you. That challenges you. That makes you think "what IS this?" Funky, unpasteurized, experimental — you\'re the first to try the weird bottle.', descriptionJa: '驚かせる酒を求める。挑戦する酒。「これは何だ？」と思わせる酒。ファンキーで、無濾過で、実験的——変わったボトルを最初に試すのはあなた。', dominantTraits: ['earthy', 'dry'], recommendedStyles: ['Namazake', 'Doburoku', 'Yamahai', 'Muroka'], starterBottles: ['Tamagawa Time Machine', 'Aramasa No.6', 'Senkin Muku'], icon: '⚡' },
];
