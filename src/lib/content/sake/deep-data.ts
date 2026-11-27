/*
 * Deep Data Module — All 20 new features
 * Esoteric, Sensory, Place, Ritual, Knowledge layers
 */

// ============================================================
// 1. ICHI-GO ICHI-E PAIRING ENGINE
// ============================================================
export const pairingSakes = [
  'Dassai 23', 'Juyondai Honmaru', 'Kubota Manju', 'Hakkaisan Tokubetsu',
  'Born Gold', 'Tedorigawa Yamahai', 'Dewazakura Oka', 'Masumi Nanago',
  'Tamagawa Yamahai', 'Noguchi Naohiko Junmai', 'Isojiman Junmai Daiginjo',
  'Kokuryu Ryu', 'Senkin Modern', 'Aramasa No.6', 'Nabeshima Daiginjo',
];
export const pairingDishes = [
  { en: 'Grilled ayu with salt', ja: '鮎の塩焼き' },
  { en: 'Seared otoro with wasabi', ja: '大トロの炙り わさび添え' },
  { en: 'Chilled silken tofu with myoga', ja: '冷奴 茗荷のせ' },
  { en: 'Tempura of shiso leaf and lotus root', ja: '大葉と蓮根の天ぷら' },
  { en: 'Simmered daikon in dashi', ja: '大根のおでん' },
  { en: 'Pickled turnip with yuzu peel', ja: 'かぶの柚子漬け' },
  { en: 'Grilled miso-glazed eggplant', ja: '茄子の味噌田楽' },
  { en: 'Sashimi of hirame with ponzu', ja: 'ひらめの刺身 ポン酢' },
  { en: 'Steamed chawanmushi with uni', ja: '雲丹の茶碗蒸し' },
  { en: 'Charcoal-grilled wagyu tongue', ja: '牛タンの炭火焼き' },
  { en: 'Bamboo shoot rice (takenoko gohan)', ja: '筍ご飯' },
  { en: 'Dried persimmon with cream cheese', ja: '干し柿のクリームチーズ' },
];
export const pairingSeasons = [
  { en: 'First snow of the year', ja: '初雪' },
  { en: 'Cherry blossoms at dusk', ja: '夕暮れの桜' },
  { en: 'Cicadas screaming in August heat', ja: '八月の蝉時雨' },
  { en: 'Autumn moon through bare branches', ja: '裸枝越しの秋月' },
  { en: 'Rain on a tin roof at midnight', ja: '真夜中のトタン屋根の雨' },
  { en: 'Morning mist over rice paddies', ja: '田んぼの朝霧' },
  { en: 'Typhoon wind rattling the shoji', ja: '障子を揺らす台風の風' },
  { en: 'Frost on the stone lantern', ja: '石灯籠の霜' },
];
export const pairingVessels = [
  { en: 'Ochoko — small porcelain cup', ja: 'お猪口 — 小さな磁器杯' },
  { en: 'Guinomi — chunky stoneware cup', ja: 'ぐい呑み — 厚手の陶器杯' },
  { en: 'Masu — cedar wooden box', ja: '枡 — 杉の木箱' },
  { en: 'Sakazuki — flat ceremonial dish', ja: '盃 — 平たい儀式用皿' },
  { en: 'Wine glass — for aromatics', ja: 'ワイングラス — 香り用' },
  { en: 'Kiriko cut glass — Edo style', ja: '切子グラス — 江戸スタイル' },
];
export const pairingMoods = [
  { en: 'Solitude after a long journey', ja: '長旅の後の孤独' },
  { en: 'Laughter with old friends', ja: '旧友との笑い声' },
  { en: 'Quiet grief, beautifully held', ja: '美しく抱かれた静かな悲しみ' },
  { en: 'The electricity before a kiss', ja: 'キスの前の電気' },
  { en: 'Gratitude for nothing in particular', ja: '特に何もないことへの感謝' },
  { en: 'Restlessness at 3am', ja: '午前3時の落ち着かなさ' },
  { en: 'The calm after making a hard decision', ja: '難しい決断の後の静けさ' },
  { en: 'Wonder at something impossibly small', ja: 'ありえないほど小さなものへの驚嘆' },
];

// ============================================================
// 2. WATER ATLAS
// ============================================================
export interface WaterSource {
  id: string;
  name: string;
  nameJa: string;
  region: string;
  regionJa: string;
  lat: number;
  lng: number;
  hardness: number; // mg/L
  hardnessLabel: string;
  hardnessLabelJa: string;
  minerals: string;
  mineralsJa: string;
  description: string;
  descriptionJa: string;
  sakeStyle: string;
  sakeStyleJa: string;
  famousBreweries: string;
  famousBreweriesJa: string;
  spiritual: string;
  spiritualJa: string;
}

export const waterSources: WaterSource[] = [
  {
    id: 'fushimi', name: 'Fushimi Gokōsui', nameJa: '伏見御香水',
    region: 'Kyoto', regionJa: '京都',
    lat: 34.93, lng: 135.76,
    hardness: 60, hardnessLabel: 'Medium-Soft', hardnessLabelJa: '中軟水',
    minerals: 'Balanced calcium, low iron, moderate potassium',
    mineralsJa: 'バランスの取れたカルシウム、低鉄分、適度なカリウム',
    description: 'The underground springs of Fushimi have fed sake brewing for over 400 years. The water emerges through layers of granite and clay, naturally filtered to extraordinary purity. The name "Gokōsui" means "Imperial Fragrant Water."',
    descriptionJa: '伏見の地下水脈は400年以上にわたり酒造りを支えてきた。花崗岩と粘土の層を通って湧き出る水は、自然に濾過され驚くべき純度を持つ。「御香水」の名は「帝の香り高い水」を意味する。',
    sakeStyle: 'Produces onna-zake (feminine sake) — soft, round, elegant, with gentle sweetness',
    sakeStyleJa: '女酒を生む — 柔らかく、丸みがあり、優雅で、穏やかな甘み',
    famousBreweries: 'Gekkeikan, Kizakura, Tamanohikari',
    famousBreweriesJa: '月桂冠、黄桜、玉乃光',
    spiritual: 'The water was blessed by Emperor Seiwa in 862 AD. Pilgrims still collect it from the shrine.',
    spiritualJa: '862年に清和天皇が祝福した水。今も参拝者が神社から汲んでいる。',
  },
  {
    id: 'nada-miyamizu', name: 'Nada Miyamizu', nameJa: '灘宮水',
    region: 'Hyogo (Kobe)', regionJa: '兵庫（神戸）',
    lat: 34.72, lng: 135.24,
    hardness: 170, hardnessLabel: 'Hard', hardnessLabelJa: '硬水',
    minerals: 'High calcium, phosphorus, potassium; very low iron',
    mineralsJa: '高カルシウム、リン、カリウム；非常に低い鉄分',
    description: 'Discovered in 1840 by Yamamura Tazaemon. The mineral-rich water flows between the Rokko mountains and the sea, picking up nutrients that turbocharge yeast fermentation. The discovery of miyamizu transformed Nada into Japan\'s largest sake-producing region.',
    descriptionJa: '1840年に山邑太左衛門が発見。六甲山と海の間を流れるミネラル豊富な水は、酵母発酵を加速させる栄養素を含む。宮水の発見が灘を日本最大の酒造地域に変えた。',
    sakeStyle: 'Produces otoko-zake (masculine sake) — dry, crisp, bold, with sharp finish',
    sakeStyleJa: '男酒を生む — 辛口、キレがあり、力強く、鋭い後味',
    famousBreweries: 'Hakutsuru, Kikumasamune, Sawanotsuru, Kenbishi',
    famousBreweriesJa: '白鶴、菊正宗、沢の鶴、剣菱',
    spiritual: 'The water was found near Nishinomiya Shrine, dedicated to Ebisu, god of prosperity and fishermen.',
    spiritualJa: '西宮神社の近くで発見。恵比寿神 — 繁栄と漁師の神 — を祀る。',
  },
  {
    id: 'niigata-snow', name: 'Echigo Snowmelt', nameJa: '越後の雪解け水',
    region: 'Niigata', regionJa: '新潟',
    lat: 37.90, lng: 139.02,
    hardness: 25, hardnessLabel: 'Ultra-Soft', hardnessLabelJa: '超軟水',
    minerals: 'Extremely low mineral content, near-pure H₂O',
    mineralsJa: '極めて低いミネラル含有量、ほぼ純粋なH₂O',
    description: 'Three meters of snow fall on Niigata each winter. As it melts through volcanic rock over months, it becomes some of the purest water on Earth. This ultra-soft water forces a slow, patient fermentation that produces Niigata\'s signature clean, dry style.',
    descriptionJa: '毎冬3メートルの雪が新潟に降る。何ヶ月もかけて火山岩を通して溶けると、地球上で最も純粋な水の一つになる。この超軟水は遅く忍耐強い発酵を強い、新潟特有のクリーンで辛口のスタイルを生む。',
    sakeStyle: 'Tanrei karakuchi — clean, dry, light, with crystalline transparency',
    sakeStyleJa: '淡麗辛口 — クリーン、辛口、軽快、水晶のような透明感',
    famousBreweries: 'Hakkaisan, Kubota (Asahi Shuzo), Koshi no Kanbai',
    famousBreweriesJa: '八海山、久保田（朝日酒造）、越乃寒梅',
    spiritual: 'Snow is considered a purifier in Shinto. The long winter burial and spring rebirth mirrors sake\'s own transformation.',
    spiritualJa: '神道では雪は浄化するもの。長い冬の埋没と春の再生は、酒自体の変容を映す。',
  },
  {
    id: 'akita-chokai', name: 'Chōkai Mountain Spring', nameJa: '鳥海山の湧水',
    region: 'Akita', regionJa: '秋田',
    lat: 39.10, lng: 140.05,
    hardness: 35, hardnessLabel: 'Soft', hardnessLabelJa: '軟水',
    minerals: 'Low calcium, trace silica, balanced pH',
    mineralsJa: '低カルシウム、微量シリカ、バランスの取れたpH',
    description: 'Mount Chōkai\'s volcanic springs filter through ancient basalt for decades before emerging. The water has a silky mouthfeel that translates directly into the sake. Akita\'s isolation preserved traditional brewing methods that disappeared elsewhere.',
    descriptionJa: '鳥海山の火山性湧水は何十年もかけて古代の玄武岩を通って濾過される。水は絹のような口当たりを持ち、それが直接酒に反映される。秋田の孤立が他所では消えた伝統的醸造法を保存した。',
    sakeStyle: 'Rich, full-bodied junmai with umami depth and velvety texture',
    sakeStyleJa: '旨味の深みとビロードのような質感を持つ、豊かでフルボディの純米',
    famousBreweries: 'Aramasa, Shinsei, Yuki no Bosha',
    famousBreweriesJa: '新政、新生、雪の茅舎',
    spiritual: 'Chōkai is one of Japan\'s sacred mountains. The water is considered a gift from the mountain kami.',
    spiritualJa: '鳥海山は日本の霊山の一つ。水は山の神からの贈り物とされる。',
  },
  {
    id: 'hiroshima-saijo', name: 'Saijō Soft Water', nameJa: '西条の軟水',
    region: 'Hiroshima', regionJa: '広島',
    lat: 34.43, lng: 132.74,
    hardness: 30, hardnessLabel: 'Soft', hardnessLabelJa: '軟水',
    minerals: 'Very low minerals, exceptional purity',
    mineralsJa: '非常に低いミネラル、卓越した純度',
    description: 'In 1898, Miura Senzaburo revolutionized brewing by proving that soft water — previously considered unsuitable — could produce extraordinary sake with modified techniques. His "soft water brewing method" (nansui jōzō-hō) changed everything.',
    descriptionJa: '1898年、三浦仙三郎は軟水 — 以前は不適とされていた — が改良された技術で卓越した酒を生むことを証明し、醸造に革命を起こした。彼の「軟水醸造法」はすべてを変えた。',
    sakeStyle: 'Gentle, aromatic ginjo with floral elegance and smooth finish',
    sakeStyleJa: '花のような優雅さと滑らかな後味を持つ、穏やかで芳香な吟醸',
    famousBreweries: 'Kamotsuru, Kirei, Fukucho',
    famousBreweriesJa: '賀茂鶴、亀齢、富久長',
    spiritual: 'Saijō means "western gate" — the water flows from sacred Mount Ryūō (Dragon King Mountain).',
    spiritualJa: '西条は「西の門」を意味する — 水は霊山・龍王山から流れる。',
  },
  {
    id: 'yamagata-gassan', name: 'Gassan Mountain Water', nameJa: '月山の水',
    region: 'Yamagata', regionJa: '山形',
    lat: 38.30, lng: 140.00,
    hardness: 20, hardnessLabel: 'Ultra-Soft', hardnessLabelJa: '超軟水',
    minerals: 'Near-zero mineral content, snowmelt origin',
    mineralsJa: 'ほぼゼロのミネラル含有量、雪解け水起源',
    description: 'Gassan (Moon Mountain) is one of the three sacred Dewa mountains. Its snowmelt takes 400 years to filter through volcanic rock before reaching the breweries below. The result is water of almost supernatural purity.',
    descriptionJa: '月山は出羽三山の一つ。雪解け水は火山岩を400年かけて濾過され、麓の蔵元に届く。結果はほぼ超自然的な純度の水。',
    sakeStyle: 'Ethereal, delicate daiginjo with whisper-light body',
    sakeStyleJa: '囁くように軽い酒質の、幽玄で繊細な大吟醸',
    famousBreweries: 'Dewazakura, Juyondai, Tatenokawa',
    famousBreweriesJa: '出羽桜、十四代、楯の川',
    spiritual: 'Gassan is the mountain of the dead in Shugendō practice. Water from here carries the prayers of a thousand years.',
    spiritualJa: '月山は修験道における死者の山。ここからの水は千年の祈りを運ぶ。',
  },
];

// ============================================================
// 3. DOBUROKU & SACRED SAKE
// ============================================================
export interface SacredSakeEntry {
  id: string;
  name: string;
  nameJa: string;
  type: 'origin' | 'ritual' | 'forbidden' | 'festival';
  description: string;
  descriptionJa: string;
  detail: string;
  detailJa: string;
}

export const sacredSake: SacredSakeEntry[] = [
  {
    id: 'kuchikami', name: 'Kuchikami-no-sake (Chewed Sake)', nameJa: '口噛みの酒',
    type: 'origin',
    description: 'The oldest form of sake. Shrine maidens (miko) chewed rice and spat it into a vessel. Enzymes in saliva converted starch to sugar. The gods drank first.',
    descriptionJa: '最古の日本酒の形。巫女が米を噛み、器に吐き出した。唾液の酵素がデンプンを糖に変えた。神が最初に飲んだ。',
    detail: 'Referenced in the Kojiki (712 AD) and depicted in the anime "Your Name" (Kimi no Na wa). The practice connected the human body directly to the fermentation process — the brewer WAS the enzyme.',
    detailJa: '古事記（712年）に記載され、アニメ「君の名は。」に描かれた。この慣行は人体を発酵プロセスに直接つなげた — 醸造者が酵素そのものだった。',
  },
  {
    id: 'omiki', name: 'Omiki (Sacred Offering Sake)', nameJa: '御神酒',
    type: 'ritual',
    description: 'Sake offered to the kami at Shinto shrines. Placed in white porcelain vessels on the altar. After the gods have "consumed" the spiritual essence, humans drink the physical remainder.',
    descriptionJa: '神社で神に捧げる酒。白磁の器に入れて祭壇に置く。神が霊的本質を「消費」した後、人間が物質的な残りを飲む。',
    detail: 'The act of sharing sake with the gods (naorai) is the foundation of all Japanese drinking culture. Every toast, every kanpai, echoes this ancient communion between human and divine.',
    detailJa: '神と酒を分かち合う行為（直会）は日本のすべての飲酒文化の基盤。すべての乾杯は、人間と神の間のこの古代の交わりを反映している。',
  },
  {
    id: 'doburoku', name: 'Doburoku (Forbidden Homebrew)', nameJa: 'どぶろく',
    type: 'forbidden',
    description: 'Unfiltered, thick, white rice wine. Illegal to brew at home since 1899 (Meiji tax laws). But it flows freely at designated shrine festivals where ancient exemptions still apply.',
    descriptionJa: '無濾過の、濃厚で白い米酒。1899年（明治の酒税法）以来自家醸造は違法。しかし古代の免除が適用される指定神社の祭りでは自由に流れる。',
    detail: 'Shirakawa-go\'s Doburoku Festival (October) is the most famous. The thick, sweet, slightly fizzy brew tastes nothing like commercial sake — it tastes like the earth itself, fermented.',
    detailJa: '白川郷のどぶろく祭り（10月）が最も有名。濃厚で甘く、微発泡のこの酒は市販の日本酒とは全く異なる味 — 大地そのものが発酵したような味。',
  },
  {
    id: 'miko-brewers', name: 'Miko — The First Brewers', nameJa: '巫女 — 最初の醸造者',
    type: 'origin',
    description: 'Before men took over sake production, shrine maidens were the primary brewers. The word "toji" (杜氏) may derive from "toji" (刀自), an honorific for women. Brewing was women\'s sacred work.',
    descriptionJa: '男性が酒造を引き継ぐ前、巫女が主要な醸造者だった。「杜氏」という言葉は女性の敬称「刀自」に由来する可能性がある。醸造は女性の神聖な仕事だった。',
    detail: 'The Meiji government systematically removed women from brewing, claiming their presence would anger the gods. The opposite was true — women WERE the original connection between sake and the divine.',
    detailJa: '明治政府は女性の存在が神を怒らせると主張し、組織的に女性を醸造から排除した。真実はその逆 — 女性こそが酒と神をつなぐ本来の存在だった。',
  },
  {
    id: 'matsuo-shrine', name: 'Matsuo Taisha — Shrine of Sake', nameJa: '松尾大社 — 酒の神社',
    type: 'ritual',
    description: 'Kyoto\'s Matsuo Taisha is the patron shrine of sake brewers. Every brewery in Japan has a Matsuo talisman. The spring water here is said to prevent sake from spoiling.',
    descriptionJa: '京都の松尾大社は酒造りの守護神社。日本のすべての蔵元が松尾のお守りを持つ。ここの湧水は酒の腐敗を防ぐと言われる。',
    detail: 'Visit in April during the Sake Festival when brewers from across Japan gather. The shrine\'s sugidama (cedar ball) tradition — hanging a fresh green ball outside the brewery — signals new sake is ready.',
    detailJa: '4月の酒祭りに訪れよ。全国の蔵元が集まる。神社の杉玉の伝統 — 蔵の外に新鮮な緑の玉を吊るす — は新酒の完成を知らせる。',
  },
  {
    id: 'shirakawago', name: 'Shirakawa-go Doburoku Festival', nameJa: '白川郷どぶろく祭り',
    type: 'festival',
    description: 'Every October, this UNESCO World Heritage village holds a festival where doburoku flows from shrine to street. The only legal public doburoku in Japan. Villagers have brewed it for 1,200 years.',
    descriptionJa: '毎年10月、このユネスコ世界遺産の村で、どぶろくが神社から通りへ流れる祭りが開催される。日本で唯一の合法的な公開どぶろく。村人は1,200年間醸造してきた。',
    detail: 'The festival is a living museum of sake\'s origins. The doburoku is thick as porridge, sweet, tangy, and alive with wild fermentation. It connects you directly to the Jōmon period.',
    detailJa: '祭りは日本酒の起源の生きた博物館。どぶろくはお粥のように濃厚で、甘く、酸味があり、野生発酵で生きている。縄文時代に直接つながる。',
  },
];

// ============================================================
// 4. TOJI LINEAGE MAP
// ============================================================
export interface TojiGuild {
  id: string;
  name: string;
  nameJa: string;
  region: string;
  regionJa: string;
  philosophy: string;
  philosophyJa: string;
  signature: string;
  signatureJa: string;
  famousBreweries: string[];
  history: string;
  historyJa: string;
}

export const tojiGuilds: TojiGuild[] = [
  {
    id: 'nanbu', name: 'Nanbu Toji', nameJa: '南部杜氏',
    region: 'Iwate', regionJa: '岩手',
    philosophy: 'Precision and elegance. The largest guild, known for meticulous technique and aromatic ginjo styles.',
    philosophyJa: '精密さと優雅さ。最大の流派で、緻密な技術と芳香な吟醸スタイルで知られる。',
    signature: 'Clean, aromatic, technically flawless ginjo and daiginjo',
    signatureJa: 'クリーンで芳香な、技術的に完璧な吟醸・大吟醸',
    famousBreweries: ['Dassai (Yamaguchi)', 'Nanbu Bijin (Iwate)', 'Suigei (Kochi)'],
    history: 'Founded in the Edo period by farmers from Iwate\'s Nanbu domain who traveled to breweries during winter. At peak, over 3,000 members.',
    historyJa: '江戸時代に岩手の南部藩の農民が冬季に蔵元へ出稼ぎに行ったことから始まる。最盛期には3,000人以上の会員。',
  },
  {
    id: 'tajima', name: 'Tajima Toji', nameJa: '但馬杜氏',
    region: 'Hyogo', regionJa: '兵庫',
    philosophy: 'Power and tradition. Masters of hard-water brewing in the Nada style. Bold, structured, built to last.',
    philosophyJa: '力と伝統。灘スタイルの硬水醸造の達人。力強く、構造的で、持続力がある。',
    signature: 'Dry, bold, masculine sake with firm structure',
    signatureJa: '辛口で力強い、しっかりとした構造の男酒',
    famousBreweries: ['Hakutsuru (Hyogo)', 'Kikumasamune (Hyogo)', 'Kenbishi (Hyogo)'],
    history: 'The guild that built Nada into Japan\'s sake capital. Their mastery of miyamizu hard water created the otoko-zake (masculine sake) tradition.',
    historyJa: '灘を日本の酒の首都に築いた流派。宮水の硬水の熟達が男酒の伝統を生んだ。',
  },
  {
    id: 'echigo', name: 'Echigo Toji', nameJa: '越後杜氏',
    region: 'Niigata', regionJa: '新潟',
    philosophy: 'Purity and restraint. Masters of ultra-soft snowmelt water. The tanrei karakuchi (clean and dry) revolution.',
    philosophyJa: '純粋さと抑制。超軟水の雪解け水の達人。淡麗辛口革命。',
    signature: 'Crystal-clear, dry, light-bodied sake with pristine finish',
    signatureJa: '水晶のように澄んだ、辛口で軽い酒質、清らかな後味',
    famousBreweries: ['Hakkaisan (Niigata)', 'Kubota (Niigata)', 'Koshi no Kanbai (Niigata)'],
    history: 'Niigata\'s deep snow forced farmers to seek winter work. They perfected the art of coaxing flavor from mineral-poor water through patience and precision.',
    historyJa: '新潟の深い雪が農民に冬の仕事を求めさせた。忍耐と精密さでミネラルの少ない水から風味を引き出す技を完成させた。',
  },
  {
    id: 'noto', name: 'Noto Toji', nameJa: '能登杜氏',
    region: 'Ishikawa', regionJa: '石川',
    philosophy: 'Soul and depth. Known for rich, complex, deeply flavored sake. The guild that values feeling over technique.',
    philosophyJa: '魂と深み。豊かで複雑、深い味わいの酒で知られる。技術より感覚を重んじる流派。',
    signature: 'Rich, umami-laden, deeply satisfying junmai styles',
    signatureJa: '豊かで旨味に満ちた、深く満足感のある純米スタイル',
    famousBreweries: ['Tedorigawa (Ishikawa)', 'Kikuhime (Ishikawa)', 'Noguchi Naohiko (Ishikawa)'],
    history: 'From the remote Noto Peninsula. The legendary Noguchi Naohiko, who came out of retirement at 87, is their most famous son.',
    historyJa: '辺境の能登半島から。87歳で引退から復帰した伝説の野口尚彦が最も有名な出身者。',
  },
  {
    id: 'izumo', name: 'Izumo Toji', nameJa: '出雲杜氏',
    region: 'Shimane', regionJa: '島根',
    philosophy: 'Ancient and mystical. From the land of myths. Sake here is still brewed with a sense of divine connection.',
    philosophyJa: '古代と神秘。神話の国から。ここの酒は今も神とのつながりの感覚で醸される。',
    signature: 'Earthy, complex, with a sense of terroir and spiritual weight',
    signatureJa: '土の香り、複雑さ、テロワールと霊的な重みの感覚',
    famousBreweries: ['Rihaku (Shimane)', 'Zuikan (Shimane)', 'Tenon (Shimane)'],
    history: 'Izumo is where the gods gather in October (Kamiarizuki). The oldest sake traditions in Japan may originate here, near the Grand Shrine of Izumo.',
    historyJa: '出雲は10月に神々が集まる場所（神在月）。日本最古の酒の伝統は出雲大社の近く、ここに起源を持つかもしれない。',
  },
];

// ============================================================
// 5. KURABITO DIARY (excerpts from a fictional brewing season)
// ============================================================
export interface DiaryEntry {
  id: number;
  date: string;
  dateJa: string;
  title: string;
  titleJa: string;
  entry: string;
  entryJa: string;
  role: string;
  roleJa: string;
}

export const kurabitoDiary: DiaryEntry[] = [
  { id: 1, date: 'October 1', dateJa: '10月1日', title: 'Arrival', titleJa: '到着',
    role: 'Kama-ya (rice steamer)', roleJa: '釜屋',
    entry: 'Left my family in Iwate at dawn. The bus wound through mountains turning gold. Arrived at the kura by evening. The toji greeted us with silence and tea. My room is six tatami mats. The futon smells of last year\'s koji. Tomorrow we clean.',
    entryJa: '夜明けに岩手の家族を残して出発。バスは金色に染まる山を縫って走った。夕方に蔵に到着。杜氏は沈黙とお茶で迎えてくれた。部屋は六畳。布団は去年の麹の匂いがする。明日は掃除。',
  },
  { id: 2, date: 'October 15', dateJa: '10月15日', title: 'The Washing', titleJa: '洗米',
    role: 'Kama-ya', roleJa: '釜屋',
    entry: 'Washed 600kg of Yamada Nishiki today. Each batch timed to the second — 7 seconds for daiginjo rice polished to 35%. One second too long and the rice absorbs too much water. My hands are raw. The toji watched every batch without speaking.',
    entryJa: '今日は600kgの山田錦を洗った。各バッチは秒単位で計測 — 35%精米の大吟醸米は7秒。1秒長すぎると米が水を吸いすぎる。手は荒れた。杜氏は一言も発さず全バッチを見守った。',
  },
  { id: 3, date: 'November 3', dateJa: '11月3日', title: 'The Koji Room', titleJa: '麹室',
    role: 'Koji-ya (koji maker)', roleJa: '麹屋',
    entry: 'First time inside the muro. 38°C, 80% humidity. The air is thick with sweet chestnut smell. We spread koji spores by hand, working in shifts through the night. Every two hours, someone checks the temperature of the rice beds. The koji is alive. It breathes.',
    entryJa: '初めて室に入った。38°C、湿度80%。空気は甘い栗の匂いで濃い。手で麹菌を撒き、夜通し交代で作業。2時間ごとに誰かが米床の温度を確認する。麹は生きている。呼吸している。',
  },
  { id: 4, date: 'November 20', dateJa: '11月20日', title: 'Sandan Shikomi', titleJa: '三段仕込み',
    role: 'Moto-mawashi (starter maker)', roleJa: '酛廻し',
    entry: 'The three-stage addition begins. Day one: hatsuzoe. The tank receives its first feeding of rice, water, and koji. The yeast starter bubbles with quiet fury. The smell is intoxicating — banana, apple, something ancient. We will not sleep well for three days.',
    entryJa: '三段仕込みが始まる。初日：初添え。タンクが最初の米、水、麹を受ける。酒母は静かな激しさで泡立つ。匂いは陶酔的 — バナナ、リンゴ、何か古代のもの。三日間はよく眠れないだろう。',
  },
  { id: 5, date: 'December 24', dateJa: '12月24日', title: 'Silent Night', titleJa: '静かな夜',
    role: 'All', roleJa: '全員',
    entry: 'Christmas Eve. No celebration. The moromi is at its most delicate stage. The toji sleeps next to the tanks. I can hear the fermentation — a soft, continuous whisper, like the building itself is breathing. Outside, snow. Inside, creation.',
    entryJa: 'クリスマスイブ。祝いはない。醪は最も繊細な段階。杜氏はタンクの横で眠る。発酵の音が聞こえる — 柔らかく連続する囁き、建物自体が呼吸しているよう。外は雪。中は創造。',
  },
  { id: 6, date: 'January 15', dateJa: '1月15日', title: 'The Pressing', titleJa: '上槽',
    role: 'All', roleJa: '全員',
    entry: 'Joso day. The moromi goes into the press. First comes the arabashiri — the free-run sake that flows before pressure is applied. It\'s cloudy, wild, electric. The toji tastes it, closes his eyes for ten seconds, then nods once. We exhale.',
    entryJa: '上槽の日。醪が搾り機に入る。最初に荒走り — 圧力をかける前に流れ出る酒。濁っていて、野性的で、電気的。杜氏がそれを味わい、10秒間目を閉じ、一度頷く。私たちは息を吐く。',
  },
  { id: 7, date: 'February 28', dateJa: '2月28日', title: 'The Tasting', titleJa: '利き酒',
    role: 'All', roleJa: '全員',
    entry: 'The daiginjo is ready for evaluation. We gather in the tasting room — seven men who have lived together for five months. The toji pours into white ceramic cups. Nobody speaks. The sake is transparent, with a faint blue tinge. It tastes like winter ending.',
    entryJa: '大吟醸の評価準備が整った。利き酒室に集まる — 5ヶ月間共に暮らした7人の男たち。杜氏が白い磁器の杯に注ぐ。誰も話さない。酒は透明で、かすかな青みがある。冬の終わりの味がする。',
  },
  { id: 8, date: 'March 15', dateJa: '3月15日', title: 'Departure', titleJa: '出発',
    role: 'All', roleJa: '全員',
    entry: 'The season ends. We bow to the kura, to the tanks, to each other. The toji shakes each hand — the only physical contact in six months. On the bus home, I watch the mountains. The snow is melting. The plum trees are blooming. I will be back in October.',
    entryJa: '季節が終わる。蔵に、タンクに、お互いに礼をする。杜氏が一人ずつ握手する — 6ヶ月で唯一の身体的接触。帰りのバスで山を眺める。雪が溶けている。梅が咲いている。10月にまた来る。',
  },
];

// ============================================================
// 6. TEMPERATURE SPECTRUM
// ============================================================
export interface TempPoint {
  id: string;
  name: string;
  nameJa: string;
  temp: number; // Celsius
  description: string;
  descriptionJa: string;
  aromas: string;
  aromasJa: string;
  bestFor: string;
  bestForJa: string;
}

export const temperatureSpectrum: TempPoint[] = [
  { id: 'yukibie', name: 'Yukibie (Snow-Cold)', nameJa: '雪冷え', temp: 5,
    description: 'Sake so cold it numbs. Aromas are locked away. The texture is sharp, mineral, almost painful. For when you want to feel the cold inside you.',
    descriptionJa: '痺れるほど冷たい酒。香りは閉じ込められる。質感は鋭く、ミネラル的で、ほぼ痛い。内側に冷たさを感じたい時に。',
    aromas: 'Minimal — clean, mineral, ice-like', aromasJa: '最小限 — クリーン、ミネラル、氷のよう',
    bestFor: 'Light, dry honjozo or futsushu', bestForJa: '軽い辛口の本醸造や普通酒',
  },
  { id: 'hanabie', name: 'Hanabie (Flower-Cold)', nameJa: '花冷え', temp: 10,
    description: 'The temperature of cherry blossom season. Delicate aromas begin to emerge — melon, pear, a whisper of rice. The sweet spot for premium ginjo.',
    descriptionJa: '桜の季節の温度。繊細な香りが現れ始める — メロン、梨、米の囁き。プレミアム吟醸の最適温度。',
    aromas: 'Melon, pear, white flower, light rice', aromasJa: 'メロン、梨、白い花、軽い米',
    bestFor: 'Daiginjo, ginjo, aromatic styles', bestForJa: '大吟醸、吟醸、芳香タイプ',
  },
  { id: 'suzubie', name: 'Suzubie (Cool)', nameJa: '涼冷え', temp: 15,
    description: 'Room temperature in a Japanese house in autumn. The full personality of the sake reveals itself. This is where complexity lives.',
    descriptionJa: '秋の日本家屋の室温。酒の全人格が現れる。複雑さが住む温度。',
    aromas: 'Full spectrum — fruit, umami, earth, rice', aromasJa: 'フルスペクトル — 果実、旨味、土、米',
    bestFor: 'Junmai, junmai ginjo, aged sake', bestForJa: '純米、純米吟醸、熟成酒',
  },
  { id: 'joon', name: 'Jōon (Room Temp)', nameJa: '常温', temp: 20,
    description: 'True room temperature. Umami deepens. Sweetness rounds. The sake breathes fully. Many connoisseurs consider this the truest expression.',
    descriptionJa: '真の室温。旨味が深まる。甘みが丸くなる。酒が完全に呼吸する。多くの通がこれを最も真実の表現と考える。',
    aromas: 'Rice, umami, nuts, gentle sweetness', aromasJa: '米、旨味、ナッツ、穏やかな甘み',
    bestFor: 'Junmai, yamahai, kimoto styles', bestForJa: '純米、山廃、生酛スタイル',
  },
  { id: 'hinatakan', name: 'Hinata-kan (Sunlight Warm)', nameJa: '日向燗', temp: 30,
    description: 'The warmth of sunlight on skin. Barely warm. Umami blooms. A gentle introduction to heated sake.',
    descriptionJa: '肌に当たる日光の温かさ。かすかに温かい。旨味が花開く。燗酒への穏やかな入門。',
    aromas: 'Expanded umami, rice sweetness, cream', aromasJa: '広がる旨味、米の甘み、クリーム',
    bestFor: 'Junmai, honjozo, gentle styles', bestForJa: '純米、本醸造、穏やかなスタイル',
  },
  { id: 'nurukan', name: 'Nuru-kan (Lukewarm)', nameJa: 'ぬる燗', temp: 40,
    description: 'The golden zone. Body temperature. The sake becomes part of you. Aromas open fully. Texture becomes silky. This is where yamahai and kimoto sing.',
    descriptionJa: '黄金の温度帯。体温。酒があなたの一部になる。香りが完全に開く。質感が絹のようになる。山廃と生酛が歌う温度。',
    aromas: 'Full umami, caramel, mushroom, earth', aromasJa: 'フル旨味、キャラメル、きのこ、土',
    bestFor: 'Yamahai, kimoto, aged junmai', bestForJa: '山廃、生酛、熟成純米',
  },
  { id: 'jokan', name: 'Jō-kan (Proper Warm)', nameJa: '上燗', temp: 45,
    description: 'Distinctly warm. The sake steams gently. Sharp edges soften. Acidity becomes rounder. Perfect for cold winter nights.',
    descriptionJa: 'はっきりと温かい。酒がかすかに湯気を立てる。鋭い角が柔らかくなる。酸味が丸くなる。寒い冬の夜に最適。',
    aromas: 'Toasted rice, dried fruit, warm spice', aromasJa: '焼き米、ドライフルーツ、温かいスパイス',
    bestFor: 'Robust junmai, honjozo, futsushu', bestForJa: '力強い純米、本醸造、普通酒',
  },
  { id: 'atsukan', name: 'Atsu-kan (Hot)', nameJa: '熱燗', temp: 50,
    description: 'Hot sake. The steam carries aroma directly to your nose. Sweetness retreats, dryness advances. The drink becomes medicine, warmth, comfort.',
    descriptionJa: '熱い酒。蒸気が香りを直接鼻に運ぶ。甘みが退き、辛さが進む。酒が薬、温もり、慰めになる。',
    aromas: 'Grain, toast, dry herbs, smoke', aromasJa: '穀物、トースト、ドライハーブ、煙',
    bestFor: 'Honjozo, futsushu, robust styles', bestForJa: '本醸造、普通酒、力強いスタイル',
  },
  { id: 'tobikirikan', name: 'Tobikiri-kan (Flying Hot)', nameJa: '飛び切り燗', temp: 55,
    description: 'Dangerously hot. Only for the boldest sake. Most aromas evaporate — what remains is pure structure, pure grain, pure warmth. An act of faith.',
    descriptionJa: '危険なほど熱い。最も大胆な酒だけに。ほとんどの香りが蒸発 — 残るのは純粋な構造、純粋な穀物、純粋な温もり。信仰の行為。',
    aromas: 'Grain essence, smoke, mineral', aromasJa: '穀物のエッセンス、煙、ミネラル',
    bestFor: 'Only robust futsushu or honjozo', bestForJa: '力強い普通酒か本醸造のみ',
  },
];

// ============================================================
// 7. SAKE × MUSIC SYNESTHESIA
// ============================================================
export interface MusicPairing {
  id: string;
  sakeStyle: string;
  sakeStyleJa: string;
  artist: string;
  track: string;
  genre: string;
  why: string;
  whyJa: string;
  mood: string;
  moodJa: string;
}

export const musicPairings: MusicPairing[] = [
  { id: 'daiginjo-sakamoto', sakeStyle: 'Daiginjo', sakeStyleJa: '大吟醸',
    artist: 'Ryuichi Sakamoto', track: 'Merry Christmas Mr. Lawrence', genre: 'Ambient Piano',
    why: 'Both are exercises in restraint and beauty. The piano\'s sparse notes mirror daiginjo\'s crystalline purity — every element placed with surgical precision.',
    whyJa: '両者とも抑制と美の実践。ピアノの疎らな音符は大吟醸の水晶のような純度を映す — すべての要素が外科的精密さで配置される。',
    mood: 'Contemplative solitude', moodJa: '瞑想的な孤独',
  },
  { id: 'yamahai-takemitsu', sakeStyle: 'Yamahai Junmai', sakeStyleJa: '山廃純米',
    artist: 'Tōru Takemitsu', track: 'November Steps', genre: 'Contemporary Classical',
    why: 'Takemitsu bridges Japanese and Western music like yamahai bridges wild and controlled fermentation. Both are complex, layered, and slightly unsettling in the best way.',
    whyJa: '武満は山廃が野生と制御された発酵を橋渡しするように、日本と西洋の音楽を橋渡しする。両者とも複雑で、層があり、最良の意味でわずかに不安にさせる。',
    mood: 'Intellectual tension', moodJa: '知的な緊張',
  },
  { id: 'nigori-boris', sakeStyle: 'Nigori (Cloudy)', sakeStyleJa: 'にごり酒',
    artist: 'Boris', track: 'Absolutego', genre: 'Drone/Doom Metal',
    why: 'Nigori is sake at its most primal — thick, unfiltered, raw. Boris\'s 60-minute drone is sound at its most primal. Both overwhelm the senses and demand surrender.',
    whyJa: 'にごりは最も原始的な酒 — 濃厚、無濾過、生。ボリスの60分のドローンは最も原始的な音。両者とも感覚を圧倒し、降伏を要求する。',
    mood: 'Primal immersion', moodJa: '原始的な没入',
  },
  { id: 'koshu-coltrane', sakeStyle: 'Koshu (Aged)', sakeStyleJa: '古酒',
    artist: 'John Coltrane', track: 'A Love Supreme', genre: 'Spiritual Jazz',
    why: 'Aged sake and late Coltrane share the same quality: time has burned away everything unnecessary. What remains is pure devotion, pure expression, pure spirit.',
    whyJa: '熟成酒と晩年のコルトレーンは同じ質を共有する：時間が不要なものをすべて焼き尽くした。残るのは純粋な献身、純粋な表現、純粋な精神。',
    mood: 'Transcendent devotion', moodJa: '超越的な献身',
  },
  { id: 'sparkling-cornelius', sakeStyle: 'Sparkling Sake', sakeStyleJa: 'スパークリング日本酒',
    artist: 'Cornelius', track: 'Point of View Point', genre: 'Shibuya-kei/Electronic',
    why: 'Cornelius\'s playful precision mirrors sparkling sake\'s effervescence — both are Japanese innovation disguised as lightness. Complex craft wearing a casual smile.',
    whyJa: 'コーネリアスの遊び心のある精密さはスパークリング日本酒の発泡を映す — 両者とも軽さに偽装された日本のイノベーション。カジュアルな笑顔を纏った複雑な技。',
    mood: 'Playful sophistication', moodJa: '遊び心のある洗練',
  },
  { id: 'junmai-haruomi', sakeStyle: 'Junmai', sakeStyleJa: '純米',
    artist: 'Haruomi Hosono', track: 'Watering a Flower', genre: 'Ambient/Exotica',
    why: 'Hosono\'s gentle exotica matches junmai\'s honest, unadorned character. Both are deeply Japanese while being quietly universal. No pretension, just presence.',
    whyJa: '細野の穏やかなエキゾチカは純米の正直で飾らない性格に合う。両者とも深く日本的でありながら静かに普遍的。気取りなく、ただ存在する。',
    mood: 'Gentle presence', moodJa: '穏やかな存在感',
  },
  { id: 'nama-boredoms', sakeStyle: 'Nama (Unpasteurized)', sakeStyleJa: '生酒',
    artist: 'Boredoms', track: 'Super Going', genre: 'Noise/Psychedelic',
    why: 'Nama sake is alive, unstable, electric. Boredoms are alive, unstable, electric. Both are best experienced fresh, in the moment, before they transform into something else entirely.',
    whyJa: '生酒は生きていて、不安定で、電気的。ボアダムスは生きていて、不安定で、電気的。両者とも新鮮に、その瞬間に、全く別のものに変わる前に体験するのが最良。',
    mood: 'Chaotic vitality', moodJa: '混沌とした生命力',
  },
  { id: 'kimoto-joe', sakeStyle: 'Kimoto', sakeStyleJa: '生酛',
    artist: 'Joe Hisaishi', track: 'Ashitaka Sekki (Princess Mononoke)', genre: 'Film Score',
    why: 'Kimoto is the ancient method — labor-intensive, connected to the earth. Hisaishi\'s Mononoke score captures that same tension between nature and human will, ancient and modern.',
    whyJa: '生酛は古代の方法 — 労働集約的で、大地とつながる。久石譲のもののけ姫のスコアは自然と人間の意志、古代と現代の同じ緊張を捉える。',
    mood: 'Epic reverence', moodJa: '壮大な畏敬',
  },
];

// ============================================================
// 8. AGING & TIME PHILOSOPHY
// ============================================================
export interface AgingStage {
  id: string;
  years: string;
  name: string;
  nameJa: string;
  color: string;
  colorJa: string;
  flavor: string;
  flavorJa: string;
  philosophy: string;
  philosophyJa: string;
  example: string;
  exampleJa: string;
}

export const agingStages: AgingStage[] = [
  { id: 'fresh', years: '0-6 months', name: 'Shiboritate (Freshly Pressed)', nameJa: 'しぼりたて',
    color: 'Clear to faint green', colorJa: '透明からかすかな緑',
    flavor: 'Bright, sharp, fruity, electric — like biting into a fresh apple', flavorJa: '明るく、鋭く、フルーティで電気的 — 新鮮なリンゴをかじるよう',
    philosophy: 'Youth. Potential. The thrill of the new.', philosophyJa: '若さ。可能性。新しさのスリル。',
    example: 'Senkin Modern Muku (Tochigi)', exampleJa: '仙禽 モダン 無垢（栃木）',
  },
  { id: '1year', years: '1-2 years', name: 'Standard Release', nameJa: '通常出荷',
    color: 'Clear to pale gold', colorJa: '透明から淡い金色',
    flavor: 'Balanced, rounded, the brewer\'s intended expression', flavorJa: 'バランスが取れ、丸みがあり、蔵元が意図した表現',
    philosophy: 'Maturity. The sake has found its voice.', philosophyJa: '成熟。酒が自分の声を見つけた。',
    example: 'Dassai 23 (Yamaguchi)', exampleJa: '獺祭 23（山口）',
  },
  { id: '3year', years: '3-5 years', name: 'Chōki Jukusei (Long-Aged)', nameJa: '長期熟成',
    color: 'Gold to amber', colorJa: '金色から琥珀色',
    flavor: 'Honey, caramel, dried fruit, nuts — sherry-like complexity emerges', flavorJa: '蜂蜜、キャラメル、ドライフルーツ、ナッツ — シェリーのような複雑さが現れる',
    philosophy: 'Patience. The sake begins to forget what it was and discover what it will become.', philosophyJa: '忍耐。酒は自分が何であったかを忘れ始め、何になるかを発見する。',
    example: 'Daruma Masamune 3-Year (Gifu)', exampleJa: '達磨正宗 3年（岐阜）',
  },
  { id: '10year', years: '10-20 years', name: 'Koshu (Vintage Sake)', nameJa: '古酒',
    color: 'Deep amber to mahogany', colorJa: '深い琥珀色からマホガニー',
    flavor: 'Dark chocolate, coffee, soy sauce, umami depth — closer to Madeira than wine', flavorJa: 'ダークチョコレート、コーヒー、醤油、旨味の深み — ワインよりマデイラに近い',
    philosophy: 'Wisdom. Time has stripped away the superficial. Only essence remains.', philosophyJa: '知恵。時間が表面的なものを剥ぎ取った。本質だけが残る。',
    example: 'Kaiun Tokusen Koshu 10-Year (Shizuoka)', exampleJa: '開運 特撰古酒 10年（静岡）',
  },
  { id: '40year', years: '30-50+ years', name: 'Ō-Koshu (Grand Vintage)', nameJa: '大古酒',
    color: 'Near-black, like aged balsamic', colorJa: 'ほぼ黒、熟成バルサミコのよう',
    flavor: 'Molasses, earth, smoke, leather — a liquid meditation on impermanence', flavorJa: '糖蜜、土、煙、革 — 無常についての液体の瞑想',
    philosophy: 'Transcendence. The sake has outlived its maker. It belongs to time now.', philosophyJa: '超越。酒は造り手より長く生きた。今は時間のもの。',
    example: 'Daruma Masamune 40-Year Koshu (Gifu)', exampleJa: '達磨正宗 40年古酒（岐阜）',
  },
];
