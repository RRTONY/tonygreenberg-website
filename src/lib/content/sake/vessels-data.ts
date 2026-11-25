// Vessel Guidebook data (器の手引書), moved word for word out of the Sake Manus app's
// client/src/pages/Vessels.tsx (2026-11-26) so the page component stays readable. Used only by
// src/components/sake/pages/vessels.tsx. The `emoji` field was data the app never displayed.

/* ── Vessel Guidebook Data ────────────────────────────────── */
export interface SakeRec {
  name: string;
  nameJa: string;
  why: string;
  whyJa: string;
}

export interface Artisan {
  name: string;
  nameJa: string;
  location: string;
  locationJa: string;
  specialty: string;
  specialtyJa: string;
  priceRange: string;
}

export interface VesselGuide {
  id: string;
  name: string;
  nameJa: string;
  kanji: string;
  emoji: string;
  tagline: string;
  taglineJa: string;
  description: string;
  descriptionJa: string;
  shape: string;
  shapeJa: string;
  capacity: string;
  material: string;
  materialJa: string;
  materialScience: string;
  materialScienceJa: string;
  tempRange: string;
  tempRangeJa: string;
  aromaEffect: string;
  aromaEffectJa: string;
  bestStyles: string[];
  bestStylesJa: string[];
  avoidStyles: string[];
  avoidStylesJa: string[];
  sakeRecs: SakeRec[];
  ritual: string;
  ritualJa: string;
  connoisseurNote: string;
  connoisseurNoteJa: string;
  artisans: Artisan[];
}

export const vesselGuides: VesselGuide[] = [
  {
    id: 'ochoko',
    name: 'Ochoko',
    nameJa: 'お猪口',
    kanji: '猪口',
    emoji: '🍶',
    tagline: 'The Intimate Cup — Conversation in Every Sip',
    taglineJa: '親密な杯 — 一口ごとに会話',
    description: 'The classic small sake cup, typically 30-60ml. Its diminutive size ensures frequent refilling — which is the entire point. Each pour is an act of care between companions. The narrow opening concentrates volatile aromas upward toward the nose, making it ideal for aromatic sake.',
    descriptionJa: '定番の小さな酒杯、通常30-60ml。その小ささが頻繁な注ぎ足しを保証する — それが全ての本質。注ぐたびに仲間への思いやりの行為。狭い口が揮発性の香りを鼻に向かって集中させ、芳香性の高い日本酒に最適。',
    shape: 'Narrow mouth (3-5cm), tapered or straight walls, small base',
    shapeJa: '狭い口（3-5cm）、テーパーまたはストレートの壁、小さな底',
    capacity: '30-60ml (1-2 oz)',
    material: 'Ceramic, porcelain, lacquerware, glass',
    materialJa: '陶器、磁器、漆器、ガラス',
    materialScience: 'Porcelain ochoko retain cold temperature longer. Ceramic versions add micro-texture that changes mouthfeel. Lacquerware brings warmth to the lips and a subtle resinous note. Glass reveals color but conducts temperature faster.',
    materialScienceJa: '磁器のお猪口は冷たい温度をより長く保持する。陶器版は口当たりを変えるミクロの質感を加える。漆器は唇に温もりと微妙な樹脂の香りをもたらす。ガラスは色を見せるが温度伝導が速い。',
    tempRange: 'All temperatures (5-55°C)',
    tempRangeJa: '全温度帯（5-55°C）',
    aromaEffect: 'The narrow opening funnels aromatics directly to the nose. Best for sake with delicate, layered aromas that reward close attention.',
    aromaEffectJa: '狭い口が香りを直接鼻に導く。繊細で層のある香りを持つ、注意深く嗅ぐと報われる日本酒に最適。',
    bestStyles: ['Daiginjo', 'Junmai Daiginjo', 'Ginjo', 'Aromatic Junmai'],
    bestStylesJa: ['大吟醸', '純米大吟醸', '吟醸', '芳香純米'],
    avoidStyles: ['Heavy nigori', 'Sparkling sake'],
    avoidStylesJa: ['濃厚にごり', 'スパークリング日本酒'],
    sakeRecs: [
      { name: 'Dassai 23', nameJa: '獺祭 23', why: 'The ethereal Yamada Nishiki aroma needs a narrow funnel to fully appreciate its apple-pear complexity.', whyJa: '幽玄な山田錦の香りは、リンゴ-梨の複雑さを十分に味わうために狭い漏斗が必要。' },
      { name: 'Kubota Manju', nameJa: '久保田 萬寿', why: 'Delicate melon and white flower notes bloom in the concentrated space of an ochoko.', whyJa: '繊細なメロンと白い花の香りがお猪口の集中した空間で開花する。' },
      { name: 'Juyondai Honmaru', nameJa: '十四代 本丸', why: 'The legendary fruity elegance deserves the intimate attention only an ochoko provides.', whyJa: '伝説的なフルーティなエレガンスは、お猪口だけが提供する親密な注意に値する。' },
      { name: 'Born Gold', nameJa: '梵 ゴールド', why: 'Aged at -8°C for 2 years — the subtle complexity unfolds sip by tiny sip.', whyJa: '-8°Cで2年熟成 — 微妙な複雑さが小さな一口ごとに展開する。' },
    ],
    ritual: 'Never fill your own ochoko. Always pour for others first. When someone pours for you, lift the cup slightly with both hands to receive. The frequency of pouring creates rhythm in conversation — it is social choreography.',
    ritualJa: '自分のお猪口は自分で満たさない。常に他の人に先に注ぐ。注いでもらう時は両手で杯を少し持ち上げて受ける。注ぐ頻度が会話にリズムを生む — それは社交の振り付け。',
    connoisseurNote: 'The best ochoko have a slight inward curve at the rim (called "kuchizukuri" or lip-making). This creates a micro-dam that controls flow and directs sake to the center of the tongue, where umami receptors are densest. Arita-yaki porcelain ochoko from Saga Prefecture are considered the gold standard for ginjo service.',
    connoisseurNoteJa: '最高のお猪口は縁にわずかな内向きのカーブがある（「口造り」と呼ばれる）。これがミクロのダムを作り、流れを制御し、旨味受容体が最も密集する舌の中央に日本酒を導く。佐賀県の有田焼磁器お猪口は吟醸サービスのゴールドスタンダードとされる。',
    artisans: [
      { name: 'Arita Porcelain Lab', nameJa: '有田ポーセリンラボ', location: 'Arita, Saga', locationJa: '佐賀県有田', specialty: 'Ultra-thin porcelain ochoko with 400-year lineage', specialtyJa: '400年の系譜を持つ超薄磁器お猪口', priceRange: '¥3,000-8,000' },
      { name: 'Kimura Glass', nameJa: '木村硝子', location: 'Tokyo', locationJa: '東京', specialty: 'Hand-blown crystal sake glasses, paper-thin walls', specialtyJa: '手吹きクリスタル酒グラス、紙のように薄い壁', priceRange: '¥2,500-6,000' },
      { name: 'Raku Kichizaemon', nameJa: '楽吉左衛門', location: 'Kyoto', locationJa: '京都', specialty: '15th generation Raku ware — museum-quality ceremonial cups', specialtyJa: '15代目楽焼 — 美術館品質の儀式用杯', priceRange: '¥50,000-500,000+' },
    ],
  },
  {
    id: 'guinomi',
    name: 'Guinomi',
    nameJa: 'ぐい呑み',
    kanji: '呑',
    emoji: '🏺',
    tagline: 'The Drinker\'s Cup — Built for Serious Sessions',
    taglineJa: '飲み手の杯 — 本格的な酒席のために',
    description: 'Larger than ochoko (60-120ml), the guinomi is the workhorse of sake drinking. The name literally means "gulp drink." Rustic, often handmade, with beautiful imperfections that embody wabi-sabi. The wider opening allows more air contact, opening up robust sake styles.',
    descriptionJa: 'お猪口より大きく（60-120ml）、ぐい呑みは日本酒飲みの主力。名前は文字通り「ぐいっと飲む」。素朴で、しばしば手作りで、侘寂を体現する美しい不完全さを持つ。広い口がより多くの空気接触を許し、力強い酒のスタイルを開く。',
    shape: 'Wide mouth (5-8cm), thick walls, substantial weight in hand',
    shapeJa: '広い口（5-8cm）、厚い壁、手に重量感',
    capacity: '60-120ml (2-4 oz)',
    material: 'Stoneware, rough ceramic (Bizen, Shigaraki, Karatsu), wood',
    materialJa: '石器、粗い陶器（備前、信楽、唐津）、木',
    materialScience: 'Unglazed Bizen-yaki has micro-pores that aerate sake on contact, softening harsh edges. Shigaraki\'s feldspar inclusions create a rough texture that stimulates the lips. The weight of stoneware slows your drinking pace — the vessel teaches patience.',
    materialScienceJa: '無釉の備前焼は接触時に日本酒を通気するミクロの気孔を持ち、荒い角を柔らかくする。信楽の長石の含有物が唇を刺激する粗い質感を作る。石器の重さが飲むペースを遅くする — 器が忍耐を教える。',
    tempRange: 'Room temperature to warm (15-50°C)',
    tempRangeJa: '常温〜温（15-50°C）',
    aromaEffect: 'The wide opening disperses aromatics broadly, reducing intensity but increasing complexity perception. You smell the whole picture rather than individual notes.',
    aromaEffectJa: '広い口が香りを広く分散させ、強度を減らすが複雑さの知覚を増す。個々の香りではなく全体像を嗅ぐ。',
    bestStyles: ['Junmai', 'Yamahai', 'Kimoto', 'Tokubetsu Junmai', 'Aged Koshu'],
    bestStylesJa: ['純米', '山廃', '生酛', '特別純米', '熟成古酒'],
    avoidStyles: ['Delicate daiginjo (aromas escape too fast)', 'Sparkling'],
    avoidStylesJa: ['繊細な大吟醸（香りが早く逃げる）', 'スパークリング'],
    sakeRecs: [
      { name: 'Tedorigawa Yamahai Junmai', nameJa: '手取川 山廃純米', why: 'The wild, lactic complexity of yamahai needs air and a thick-walled vessel to fully express its earthy soul.', whyJa: '山廃の野性的な乳酸の複雑さは、その土の魂を十分に表現するために空気と厚壁の器が必要。' },
      { name: 'Tamagawa Yamahai', nameJa: '玉川 山廃', why: 'Philip Harper\'s funky, bold sake demands a rustic Bizen guinomi — they were made for each other.', whyJa: 'フィリップ・ハーパーのファンキーで大胆な酒は素朴な備前ぐい呑みを要求する — 互いのために作られた。' },
      { name: 'Daishichi Kimoto Junmai', nameJa: '大七 生酛純米', why: 'The benchmark kimoto. Its rich, layered umami unfolds beautifully in a wide-mouthed guinomi at 40°C.', whyJa: '生酛のベンチマーク。豊かで層のある旨味が40°Cの広口ぐい呑みで美しく展開する。' },
      { name: 'Noguchi Naohiko Junmai', nameJa: '農口尚彦 純米', why: 'The master\'s robust junmai style is built for substantial vessels that match its weight and gravity.', whyJa: '匠の力強い純米スタイルは、その重さと重力に匹敵する重厚な器のために作られた。' },
    ],
    ritual: 'Hold with both hands when receiving. Cradle the guinomi in your palm — feel its weight, its texture, its temperature. The vessel is not separate from the experience; it IS the experience.',
    ritualJa: '受け取る時は両手で持つ。ぐい呑みを手のひらに抱く — その重さ、質感、温度を感じる。器は体験から分離していない。器が体験そのもの。',
    connoisseurNote: 'Collect guinomi from different kilns — each region\'s clay creates a fundamentally different drinking experience. Bizen softens, Shigaraki adds texture, Karatsu brings warmth, Hagi changes color over years of use (called "Hagi no nanabake" — the seven transformations of Hagi). A well-used guinomi becomes a diary of every sake it has held.',
    connoisseurNoteJa: '異なる窯のぐい呑みを集めよ — 各地域の土が根本的に異なる飲酒体験を生む。備前は柔らかくし、信楽は質感を加え、唐津は温もりをもたらし、萩は長年の使用で色が変わる（「萩の七化け」と呼ばれる）。よく使われたぐい呑みは、それが抱いた全ての日本酒の日記となる。',
    artisans: [
      { name: 'Isezaki Jun (Living National Treasure)', nameJa: '伊勢崎淳（人間国宝）', location: 'Bizen, Okayama', locationJa: '岡山県備前', specialty: 'Unglazed Bizen-yaki with natural ash glaze from 10-day wood firings', specialtyJa: '10日間の薪窯焼成による自然灰釉の無釉備前焼', priceRange: '¥30,000-200,000' },
      { name: 'Nakazato Takashi', nameJa: '中里隆', location: 'Karatsu, Saga', locationJa: '佐賀県唐津', specialty: 'Korean-influenced Karatsu ware with warm, earthy glazes', specialtyJa: '温かく土の釉薬を持つ韓国の影響を受けた唐津焼', priceRange: '¥15,000-80,000' },
      { name: 'Shigaraki Pottery Village', nameJa: '信楽陶芸村', location: 'Shigaraki, Shiga', locationJa: '滋賀県信楽', specialty: 'Rustic stoneware with feldspar inclusions and natural ash', specialtyJa: '長石含有と自然灰の素朴な石器', priceRange: '¥3,000-30,000' },
    ],
  },
  {
    id: 'sakazuki',
    name: 'Sakazuki',
    nameJa: '盃',
    kanji: '盃',
    emoji: '🔴',
    tagline: 'The Ceremonial Dish — Where Sake Meets the Sacred',
    taglineJa: '儀式の皿 — 酒が聖なるものと出会う場所',
    description: 'The flat, wide ceremonial cup used in Shinto rituals, weddings (san-san-kudo), and formal occasions. The wide surface exposes sake to maximum air, changing its character dramatically. Holding a sakazuki is holding history.',
    descriptionJa: '神道の儀式、結婚式（三三九度）、正式な場で使用される平たく広い儀式用の杯。広い表面が日本酒を最大限の空気にさらし、その性格を劇的に変える。盃を持つことは歴史を持つこと。',
    shape: 'Very wide, shallow dish (8-15cm diameter, 1-2cm deep)',
    shapeJa: '非常に広く浅い皿（直径8-15cm、深さ1-2cm）',
    capacity: '20-45ml (0.7-1.5 oz)',
    material: 'Lacquerware (vermillion or black), porcelain, gold-leafed',
    materialJa: '漆器（朱または黒）、磁器、金箔',
    materialScience: 'Lacquerware sakazuki are warm to the touch — the urushi lacquer is a natural insulator. Vermillion (shu-nuri) is traditionally associated with protection from evil. The wide surface area means sake temperature changes rapidly — drink promptly.',
    materialScienceJa: '漆器の盃は触ると温かい — 漆は天然の断熱材。朱塗りは伝統的に魔除けと結びつく。広い表面積は日本酒の温度が急速に変化することを意味する — 速やかに飲む。',
    tempRange: 'Room temperature only (15-20°C)',
    tempRangeJa: '常温のみ（15-20°C）',
    aromaEffect: 'Maximum surface exposure means aromatics dissipate quickly. You get a broad, immediate burst of aroma rather than a sustained funnel. Best for sake where the palate matters more than the nose.',
    aromaEffectJa: '最大の表面露出は香りが素早く散逸することを意味する。持続的な漏斗ではなく、広く即座の香りのバーストを得る。鼻より口蓋が重要な日本酒に最適。',
    bestStyles: ['Ceremonial sake', 'Aged koshu', 'Rich junmai', 'Kimoto'],
    bestStylesJa: ['儀式用日本酒', '熟成古酒', '豊かな純米', '生酛'],
    avoidStyles: ['Aromatic daiginjo (aromas vanish instantly)', 'Chilled sake', 'Sparkling'],
    avoidStylesJa: ['芳香大吟醸（香りが瞬時に消える）', '冷酒', 'スパークリング'],
    sakeRecs: [
      { name: 'Daruma Masamune 3-Year Koshu', nameJa: '達磨正宗 3年古酒', why: 'Aged sake\'s caramel and dried fruit notes are amplified by the wide surface — like swirling brandy in a snifter.', whyJa: '熟成酒のキャラメルとドライフルーツの香りが広い表面で増幅される — スニフターでブランデーを回すように。' },
      { name: 'Daishichi Minowamon', nameJa: '大七 箕輪門', why: 'The ultimate kimoto — its deep umami and lactic richness deserve the ceremonial gravity of a sakazuki.', whyJa: '究極の生酛 — その深い旨味と乳酸の豊かさは盃の儀式的な重力に値する。' },
      { name: 'Kenbishi Mizuho', nameJa: '剣菱 瑞穂', why: 'One of Japan\'s oldest brands (1505). Drinking Kenbishi from a sakazuki connects you to 500 years of tradition.', whyJa: '日本最古のブランドの一つ（1505年）。盃で剣菱を飲むことは500年の伝統に繋がる。' },
    ],
    ritual: 'San-san-kudo (三三九度): Three cups of increasing size, three sips each — nine sips total. The wedding ritual binding two families through shared sake. The first cup represents heaven, the second earth, the third humanity.',
    ritualJa: '三三九度：大きさの増す三つの杯、各三口 — 合計九口。共有する日本酒を通じて二つの家族を結ぶ結婚の儀式。最初の杯は天を、二番目は地を、三番目は人を表す。',
    connoisseurNote: 'At Shinto shrines, the sakazuki used for omiki (sacred sake offering) is never washed with soap — only rinsed with water. The accumulated layers of sake residue are considered sacred. In tea ceremony culture, the equivalent concept is "nureba" — the patina of use that makes an object more beautiful over time.',
    connoisseurNoteJa: '神社では、御神酒（聖なる酒の供え物）に使われる盃は石鹸で洗わない — 水ですすぐだけ。蓄積された日本酒の残留物は神聖と見なされる。茶道文化では、同等の概念は「濡れ場」 — 使用の経年変化が物をより美しくする。',
    artisans: [
      { name: 'Wajima Kirimoto', nameJa: '輪島キリモト', location: 'Wajima, Ishikawa', locationJa: '石川県輪島', specialty: 'Wajima-nuri lacquerware — 130+ coats of urushi lacquer', specialtyJa: '輪島塗漆器 — 130層以上の漆', priceRange: '¥15,000-100,000' },
      { name: 'Kanazawa Gold Leaf (Hakuichi)', nameJa: '金沢箔一', location: 'Kanazawa, Ishikawa', locationJa: '石川県金沢', specialty: 'Gold-leafed sakazuki — 99% of Japan\'s gold leaf comes from Kanazawa', specialtyJa: '金箔盃 — 日本の金箔の99%は金沢産', priceRange: '¥5,000-50,000' },
    ],
  },
  {
    id: 'masu',
    name: 'Masu',
    nameJa: '枡',
    kanji: '枡',
    emoji: '📦',
    tagline: 'The Wooden Box — Where Measurement Became Ritual',
    taglineJa: '木の箱 — 計量が儀式になった場所',
    description: 'Originally a rice measuring box (180ml = 1 gō). Drinking from the corner is traditional. The hinoki or sugi wood aroma mingles with the sake — intentionally. The masu is the most democratic vessel: no pretension, pure pleasure.',
    descriptionJa: '元々は米の計量箱（180ml = 一合）。角から飲むのが伝統。檜または杉の木の香りが日本酒と混ざり合う — 意図的に。枡は最も民主的な器：気取りなし、純粋な喜び。',
    shape: 'Square box, 8.5cm × 8.5cm × 5.5cm (standard 1-gō)',
    shapeJa: '四角い箱、8.5cm × 8.5cm × 5.5cm（標準一合）',
    capacity: '180ml (6 oz) — exactly 1 gō',
    material: 'Hinoki (Japanese cypress) or sugi (cedar)',
    materialJa: '檜（ひのき）または杉（すぎ）',
    materialScience: 'New hinoki masu release strong wood oils that can overpower delicate sake. Season a new masu by filling with water and letting it sit overnight 2-3 times. After seasoning, the wood adds a subtle forest-floor note without dominating. Cedar masu are more aromatic than hinoki.',
    materialScienceJa: '新しい檜の枡は繊細な日本酒を圧倒する強い木の油を放出する。新しい枡は水を入れて一晩置くことを2-3回繰り返して慣らす。慣らし後、木は支配せずに微妙な森の土の香りを加える。杉の枡は檜より芳香性が高い。',
    tempRange: 'Room temperature to slightly chilled (10-20°C)',
    tempRangeJa: '常温〜やや冷（10-20°C）',
    aromaEffect: 'The wood aroma becomes part of the sake\'s profile. This is not contamination — it is collaboration. The square shape means you drink from a corner, creating a narrow stream that hits the tip of the tongue first.',
    aromaEffectJa: '木の香りが日本酒のプロファイルの一部になる。これは汚染ではない — 共演。四角い形は角から飲むことを意味し、舌の先端に最初に当たる狭い流れを作る。',
    bestStyles: ['Robust junmai', 'Futsu-shu', 'Honjozo', 'Nigori'],
    bestStylesJa: ['力強い純米', '普通酒', '本醸造', 'にごり'],
    avoidStyles: ['Delicate daiginjo (wood overwhelms)', 'Aged koshu'],
    avoidStylesJa: ['繊細な大吟醸（木が圧倒する）', '熟成古酒'],
    sakeRecs: [
      { name: 'Hakkaisan Tokubetsu Honjozo', nameJa: '八海山 特別本醸造', why: 'Clean, crisp, and dry enough to dance with the cedar aroma rather than fight it.', whyJa: 'クリーンでキレがあり、杉の香りと戦うのではなく踊るのに十分な辛口。' },
      { name: 'Sawanoi Junmai', nameJa: '澤乃井 純米', why: 'A Tokyo-area classic — honest, straightforward junmai that celebrates simplicity alongside the masu.', whyJa: '東京エリアの定番 — 枡と共にシンプルさを祝う、正直で素直な純米。' },
      { name: 'Ozeki One Cup', nameJa: '大関 ワンカップ', why: 'Yes, seriously. The mokkiri ritual (glass-in-masu overflow) with everyday sake is pure joy. No pretension needed.', whyJa: 'はい、真剣に。日常の酒でのもっきり（枡の中のグラスから溢れる）は純粋な喜び。気取り不要。' },
    ],
    ritual: 'Mokkiri (もっきり): A glass placed inside the masu, sake poured until it overflows into the box. The overflow symbolizes generosity and abundance. Drink from the glass first, then sip from the masu corner. At festivals, sake is served directly in masu — drink from the corner, never the flat edge.',
    ritualJa: 'もっきり：枡の中にグラスを置き、箱に溢れるまで日本酒を注ぐ。溢れは寛大さと豊かさの象徴。まずグラスから飲み、次に枡の角からすする。祭りでは日本酒は枡に直接注がれる — 角から飲む、平らな縁からは決して飲まない。',
    connoisseurNote: 'The kanji 枡 contains the radical for "measure" (升). In Edo period, masu sizes were strictly regulated — a dishonest measure was a criminal offense. Today, the masu is stamped with the brewery\'s name at festivals. Collectors prize vintage masu from defunct breweries. A salt rim on the masu corner (shiobana) is traditional at izakaya — the salt enhances umami perception.',
    connoisseurNoteJa: '漢字「枡」は「升」（計量）の部首を含む。江戸時代、枡のサイズは厳格に規制されていた — 不正な計量は犯罪だった。今日、祭りでは枡に蔵元の名前が刻印される。収集家は廃業した蔵元のヴィンテージ枡を珍重する。枡の角の塩縁（塩花）は居酒屋の伝統 — 塩が旨味の知覚を高める。',
    artisans: [
      { name: 'Ōhashi Ryōki', nameJa: '大橋量器', location: 'Ōgaki, Gifu', locationJa: '岐阜県大垣', specialty: 'Japan\'s largest masu producer — 80% of all masu made here since 1950', specialtyJa: '日本最大の枡メーカー — 1950年以来全枡の80%をここで製造', priceRange: '¥500-3,000' },
      { name: 'Kiso Hinoki Craft', nameJa: '木曽檜クラフト', location: 'Kiso, Nagano', locationJa: '長野県木曽', specialty: 'Premium Kiso hinoki masu from 300-year-old trees', specialtyJa: '300年の木から作るプレミアム木曽檜枡', priceRange: '¥2,000-8,000' },
    ],
  },
  {
    id: 'tokkuri',
    name: 'Tokkuri',
    nameJa: '徳利',
    kanji: '徳利',
    emoji: '🫗',
    tagline: 'The Singing Flask — The Vessel That Has a Voice',
    taglineJa: '歌う徳利 — 声を持つ器',
    description: 'The narrow-necked flask for warming and serving. The "tokku tokku" sound of pouring gave it its name — a vessel that literally sings. The narrow neck retains heat beautifully and concentrates aroma in the headspace above the sake.',
    descriptionJa: '温めと提供のための細首の徳利。注ぐ時の「とくとく」という音が名前の由来 — 文字通り歌う器。細い首が熱を美しく保持し、日本酒の上の空間に香りを集中させる。',
    shape: 'Bulbous body, narrow neck (1.5-3cm opening), 15-20cm tall',
    shapeJa: '球状の胴体、細い首（口径1.5-3cm）、高さ15-20cm',
    capacity: '180ml (1 gō) or 360ml (2 gō)',
    material: 'Ceramic, porcelain, occasionally glass',
    materialJa: '陶器、磁器、時にガラス',
    materialScience: 'The bulbous shape maximizes surface area for even heating in a water bath. Ceramic tokkuri retain heat 40% longer than porcelain. The narrow neck creates a thermal cap — hot air trapped above the sake keeps it warm. Never microwave — uneven heating destroys delicate compounds.',
    materialScienceJa: '球状の形が湯煎での均一な加熱のために表面積を最大化する。陶器の徳利は磁器より40%長く熱を保持する。細い首が熱の蓋を作る — 日本酒の上に閉じ込められた熱い空気が温かさを保つ。電子レンジ不可 — 不均一な加熱が繊細な化合物を破壊する。',
    tempRange: 'Warm to hot (35-55°C)',
    tempRangeJa: '温〜熱（35-55°C）',
    aromaEffect: 'The narrow neck acts as a chimney — warm sake releases more volatile compounds, and the neck channels them upward in a concentrated stream. Warming in a tokkuri transforms sake more dramatically than any other variable.',
    aromaEffectJa: '細い首が煙突として機能する — 温かい日本酒はより多くの揮発性化合物を放出し、首がそれらを集中した流れで上方に導く。徳利での温めは他のどの変数よりも劇的に日本酒を変える。',
    bestStyles: ['Junmai', 'Honjozo', 'Kimoto', 'Yamahai', 'Futsu-shu'],
    bestStylesJa: ['純米', '本醸造', '生酛', '山廃', '普通酒'],
    avoidStyles: ['Nama (unpasteurized)', 'Sparkling', 'Aromatic daiginjo'],
    avoidStylesJa: ['生酒（非加熱）', 'スパークリング', '芳香大吟醸'],
    sakeRecs: [
      { name: 'Masumi Nanago', nameJa: '真澄 七號', why: 'The birthplace of Yeast No. 7 — its soft, round character blooms into something transcendent at 42°C (nuru-kan).', whyJa: '7号酵母の発祥地 — その柔らかく丸い性格が42°C（ぬる燗）で超越的なものに開花する。' },
      { name: 'Suigei Tokubetsu Junmai', nameJa: '酔鯨 特別純米', why: 'Kochi\'s "Drunken Whale" — clean and dry cold, but warming unlocks hidden layers of rice sweetness.', whyJa: '高知の「酔鯨」 — 冷やではクリーンで辛口だが、温めると隠れた米の甘みの層が解放される。' },
      { name: 'Dewazakura Oka Ginjo', nameJa: '出羽桜 桜花吟醸', why: 'Controversial choice — most say never warm ginjo. But at gentle nuru-kan, the cherry blossom notes transform into something magical.', whyJa: '議論を呼ぶ選択 — ほとんどは吟醸を温めるなと言う。しかし穏やかなぬる燗で、桜の香りが魔法のようなものに変わる。' },
    ],
    ritual: 'Place the tokkuri in a pot of water, heat slowly. The ideal temperature is when you can hold the tokkuri comfortably but feel the warmth. Listen for the "tokku tokku" — the sound tells you the sake is ready to pour. Always pour for others. The tokkuri should never sit empty at the table.',
    ritualJa: '徳利を鍋の水に入れ、ゆっくり温める。理想の温度は、徳利を快適に持てるが温もりを感じる程度。「とくとく」を聞く — その音が日本酒が注ぐ準備ができたことを教える。常に他の人に注ぐ。徳利はテーブルで空のまま置かれるべきではない。',
    connoisseurNote: 'The 10 named temperature points of kan-zake (warmed sake) each unlock different flavor compounds. Hinata-kan (30°C) brings out sweetness. Nuru-kan (40°C) is the sweet spot for most junmai. Jo-kan (45°C) emphasizes umami. Atsu-kan (50°C) sharpens dryness. Tobikiri-kan (55°C+) is for bold yamahai only. A master kan-zake bartender adjusts temperature to the specific bottle, the weather, and the drinker\'s mood.',
    connoisseurNoteJa: '燗酒の10の名前付き温度帯はそれぞれ異なる風味化合物を解放する。日向燗（30°C）は甘みを引き出す。ぬる燗（40°C）はほとんどの純米のスイートスポット。上燗（45°C）は旨味を強調する。熱燗（50°C）は辛さを鋭くする。飛びきり燗（55°C+）は大胆な山廃のみ。燗酒の達人は温度を特定の瓶、天気、飲み手の気分に合わせて調整する。',
    artisans: [
      { name: 'Tokoname Pottery (Hōsen Kiln)', nameJa: '常滑焼（宝泉窯）', location: 'Tokoname, Aichi', locationJa: '愛知県常滑', specialty: 'Iron-rich clay tokkuri that improve sake flavor through mineral interaction', specialtyJa: '鉱物の相互作用で日本酒の味を向上させる鉄分豊富な土の徳利', priceRange: '¥3,000-15,000' },
      { name: 'Mashiko Pottery (Hamada lineage)', nameJa: '益子焼（濱田系譜）', location: 'Mashiko, Tochigi', locationJa: '栃木県益子', specialty: 'Mingei (folk art) tradition tokkuri with warm, rustic glazes', specialtyJa: '温かく素朴な釉薬の民藝伝統徳利', priceRange: '¥2,000-20,000' },
    ],
  },
  {
    id: 'katakuchi',
    name: 'Katakuchi',
    nameJa: '片口',
    kanji: '片口',
    emoji: '🥣',
    tagline: 'The Open Bowl — The Generous Host',
    taglineJa: '開いた鉢 — 寛大な主人',
    description: 'The spouted serving bowl — sake\'s answer to a wine decanter. Open-topped, it lets sake breathe and evolve. The wide mouth invites you to smell before you pour. Modern sake bars increasingly favor katakuchi for premium service.',
    descriptionJa: '注ぎ口のある盛り鉢 — ワインデキャンタに対する日本酒の答え。開いた上部が日本酒を呼吸させ進化させる。広い口が注ぐ前に香りを嗅ぐよう誘う。モダンな酒バーはプレミアムサービスにますます片口を好む。',
    shape: 'Wide bowl with single pouring spout, 10-15cm diameter',
    shapeJa: '単一の注ぎ口を持つ広い鉢、直径10-15cm',
    capacity: '200-360ml (7-12 oz)',
    material: 'Ceramic, glass, metal (tin, pewter)',
    materialJa: '陶器、ガラス、金属（錫、ピューター）',
    materialScience: 'Tin (suzu) katakuchi are prized because tin ions interact with sake to soften harsh notes and round out the flavor — this is not folklore, it is chemistry. Glass katakuchi let you observe the sake\'s color and viscosity. Ceramic versions add the character of their glaze.',
    materialScienceJa: '錫（すず）の片口は珍重される。錫イオンが日本酒と相互作用して荒い角を柔らかくし、味わいを丸くするから — これは伝承ではなく化学。ガラスの片口は日本酒の色と粘度を観察させる。陶器版は釉薬の個性を加える。',
    tempRange: 'Chilled to room temperature (5-20°C)',
    tempRangeJa: '冷〜常温（5-20°C）',
    aromaEffect: 'Maximum aeration. The open bowl lets sake evolve over 10-15 minutes, similar to decanting wine. Complex sake that seems "closed" when first opened will bloom in a katakuchi.',
    aromaEffectJa: '最大の通気。開いた鉢が日本酒を10-15分かけて進化させる、ワインのデキャンタージュに似て。最初に開けた時「閉じている」ように見える複雑な日本酒が片口で開花する。',
    bestStyles: ['Complex Junmai Ginjo', 'Aged Koshu', 'Yamahai', 'Natural/Wild Sake', 'Kimoto'],
    bestStylesJa: ['複雑な純米吟醸', '熟成古酒', '山廃', '自然派/野生の酒', '生酛'],
    avoidStyles: ['Simple futsu-shu (nothing to open up)', 'Sparkling (loses fizz)'],
    avoidStylesJa: ['シンプルな普通酒（開くものがない）', 'スパークリング（泡が抜ける）'],
    sakeRecs: [
      { name: 'Aramasa No.6', nameJa: '新政 No.6', why: 'The acidic, wine-like character of Aramasa benefits enormously from 10 minutes of breathing in a katakuchi.', whyJa: '新政の酸味のある、ワインのような性格は片口での10分間の呼吸から大いに恩恵を受ける。' },
      { name: 'Senkin Modern', nameJa: '仙禽 モダン', why: 'Domain-specific Domaine sake — treat it like natural wine. Decant in a katakuchi and watch it transform.', whyJa: 'ドメーヌ特有のドメーヌ酒 — 自然派ワインのように扱う。片口でデキャンタし、変化を見守る。' },
      { name: 'Isojiman Junmai Daiginjo', nameJa: '磯自慢 純米大吟醸', why: 'The precise, layered complexity of Isojiman reveals hidden dimensions when given room to breathe.', whyJa: '磯自慢の精密で層のある複雑さは、呼吸する余地を与えると隠れた次元を明らかにする。' },
    ],
    ritual: 'Pour slowly from the spout. The katakuchi is the generous host — it gives freely and holds nothing back. In modern sake bars, the katakuchi is placed on the table for guests to serve themselves, breaking the traditional "pour for others" rule. This is intentional — it signals a more relaxed, contemporary drinking culture.',
    ritualJa: '注ぎ口からゆっくり注ぐ。片口は寛大な主人 — 惜しみなく与え、何も隠さない。モダンな酒バーでは、片口はゲストが自分で注げるようにテーブルに置かれ、伝統的な「他者に注ぐ」ルールを破る。これは意図的 — よりリラックスした現代的な飲酒文化を示す。',
    connoisseurNote: 'The katakuchi is the vessel of choice for sake sommeliers doing "kiki-zake" (professional tasting). The wide opening allows rapid assessment of aroma, and the spout enables precise pouring into tasting cups. Nousaku\'s tin katakuchi from Takaoka, Toyama are the industry standard — the tin genuinely changes the sake\'s character through ion exchange.',
    connoisseurNoteJa: '片口は「利き酒」（プロのテイスティング）を行う酒ソムリエの選択の器。広い口が香りの迅速な評価を可能にし、注ぎ口がテイスティングカップへの正確な注ぎを可能にする。富山県高岡の能作の錫片口は業界標準 — 錫はイオン交換を通じて日本酒の性格を本当に変える。',
    artisans: [
      { name: 'Nousaku', nameJa: '能作', location: 'Takaoka, Toyama', locationJa: '富山県高岡', specialty: '100% pure tin katakuchi — bendable, antibacterial, flavor-enhancing', specialtyJa: '100%純錫片口 — 曲げられる、抗菌、味わい向上', priceRange: '¥8,000-25,000' },
      { name: 'Shotoku Glass', nameJa: 'ショウトクガラス', location: 'Tokyo', locationJa: '東京', specialty: 'Handmade glass katakuchi with traditional Japanese forms', specialtyJa: '伝統的な日本の形の手作りガラス片口', priceRange: '¥3,000-10,000' },
      { name: 'SyuRo', nameJa: 'シュロ', location: 'Tokyo (Torigoe)', locationJa: '東京（鳥越）', specialty: 'Minimalist tin and brass vessels designed for modern sake service', specialtyJa: 'モダンな酒サービスのためにデザインされたミニマリストの錫と真鍮の器', priceRange: '¥5,000-15,000' },
    ],
  },
];

/* ── Pairing Matrix ────────────────────────────────────────── */
export const pairingMatrix: { style: string; styleJa: string; vessels: string[] }[] = [
  { style: 'Daiginjo', styleJa: '大吟醸', vessels: ['ochoko', 'katakuchi'] },
  { style: 'Junmai Daiginjo', styleJa: '純米大吟醸', vessels: ['ochoko', 'katakuchi'] },
  { style: 'Ginjo', styleJa: '吟醸', vessels: ['ochoko'] },
  { style: 'Junmai', styleJa: '純米', vessels: ['guinomi', 'tokkuri', 'masu'] },
  { style: 'Honjozo', styleJa: '本醸造', vessels: ['tokkuri', 'masu', 'ochoko'] },
  { style: 'Yamahai', styleJa: '山廃', vessels: ['guinomi', 'katakuchi', 'tokkuri'] },
  { style: 'Kimoto', styleJa: '生酛', vessels: ['guinomi', 'sakazuki', 'tokkuri'] },
  { style: 'Aged Koshu', styleJa: '古酒', vessels: ['sakazuki', 'katakuchi', 'guinomi'] },
  { style: 'Nigori', styleJa: 'にごり', vessels: ['guinomi', 'masu'] },
  { style: 'Sparkling', styleJa: 'スパークリング', vessels: ['ochoko'] },
  { style: 'Nama (Unpasteurized)', styleJa: '生酒', vessels: ['ochoko', 'katakuchi'] },
  { style: 'Futsu-shu', styleJa: '普通酒', vessels: ['masu', 'tokkuri', 'guinomi'] },
];
