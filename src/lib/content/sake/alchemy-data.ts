/*
 * Liquid Alchemy — The Pro-Sake Science & Soul Data Module
 * Nutritional benefits, amino acid systems, longevity, altered states
 */

// === AMINO ACID PROFILES ===
export interface AminoAcid {
  name: string;
  nameJa: string;
  symbol: string;
  sakeAmount: string; // mg per 100ml
  wineAmount: string;
  beerAmount: string;
  spiritsAmount: string;
  role: string;
  roleJa: string;
  benefit: string;
  benefitJa: string;
  category: 'essential' | 'non-essential' | 'conditional';
  bodySystem: string;
  bodySystemJa: string;
}

export const aminoAcids: AminoAcid[] = [
  {
    name: 'Glutamic Acid', nameJa: 'グルタミン酸', symbol: 'Glu',
    sakeAmount: '30-60', wineAmount: '3-6', beerAmount: '1-3', spiritsAmount: '0',
    role: 'The umami king. 10x more in sake than wine. Neurotransmitter precursor, immune modulator.',
    roleJa: 'うま味の王。ワインの10倍。神経伝達物質の前駆体、免疫調節因子。',
    benefit: 'Brain function, gut health, immune response. Precursor to GABA — the calming neurotransmitter.',
    benefitJa: '脳機能、腸の健康、免疫応答。GABA（鎮静神経伝達物質）の前駆体。',
    category: 'non-essential', bodySystem: 'Brain & Immune', bodySystemJa: '脳と免疫'
  },
  {
    name: 'Alanine', nameJa: 'アラニン', symbol: 'Ala',
    sakeAmount: '15-35', wineAmount: '2-5', beerAmount: '1-3', spiritsAmount: '0',
    role: 'Glucose metabolism engine. Converts to pyruvate for energy production.',
    roleJa: 'グルコース代謝エンジン。エネルギー生産のためにピルビン酸に変換。',
    benefit: 'Blood sugar regulation, liver protection, sustained energy without crash.',
    benefitJa: '血糖値調節、肝臓保護、クラッシュのない持続的エネルギー。',
    category: 'non-essential', bodySystem: 'Energy & Liver', bodySystemJa: 'エネルギーと肝臓'
  },
  {
    name: 'Arginine', nameJa: 'アルギニン', symbol: 'Arg',
    sakeAmount: '10-30', wineAmount: '1-4', beerAmount: '0.5-2', spiritsAmount: '0',
    role: 'Nitric oxide precursor. Vasodilator. Wound healing accelerator.',
    roleJa: '一酸化窒素前駆体。血管拡張剤。創傷治癒促進剤。',
    benefit: 'Blood flow, HGH stimulation, immune function, tumor suppression research.',
    benefitJa: '血流、成長ホルモン刺激、免疫機能、腫瘍抑制研究。',
    category: 'conditional', bodySystem: 'Circulation & Growth', bodySystemJa: '循環と成長'
  },
  {
    name: 'Valine', nameJa: 'バリン', symbol: 'Val',
    sakeAmount: '5-15', wineAmount: '0.5-2', beerAmount: '0.3-1', spiritsAmount: '0',
    role: 'BCAA — branched-chain amino acid. Muscle repair and growth stimulant.',
    roleJa: 'BCAA — 分岐鎖アミノ酸。筋肉修復と成長刺激。',
    benefit: 'Muscle recovery, mental focus, energy regulation during physical stress.',
    benefitJa: '筋肉回復、精神集中、身体的ストレス時のエネルギー調節。',
    category: 'essential', bodySystem: 'Muscle & Mind', bodySystemJa: '筋肉と精神'
  },
  {
    name: 'Leucine', nameJa: 'ロイシン', symbol: 'Leu',
    sakeAmount: '4-12', wineAmount: '0.3-1', beerAmount: '0.2-0.8', spiritsAmount: '0',
    role: 'Most potent BCAA for muscle protein synthesis. mTOR pathway activator.',
    roleJa: '筋タンパク質合成に最も強力なBCAA。mTOR経路活性化因子。',
    benefit: 'Tissue repair, wound healing, body protection from oxidative damage.',
    benefitJa: '組織修復、創傷治癒、酸化的損傷からの体の保護。',
    category: 'essential', bodySystem: 'Repair & Protection', bodySystemJa: '修復と保護'
  },
  {
    name: 'Proline', nameJa: 'プロリン', symbol: 'Pro',
    sakeAmount: '8-20', wineAmount: '1-4', beerAmount: '0.5-2', spiritsAmount: '0',
    role: 'Collagen building block. Skin structure architect.',
    roleJa: 'コラーゲンの構成要素。皮膚構造の設計者。',
    benefit: 'Skin elasticity, joint health, wound healing. The beauty amino acid.',
    benefitJa: '肌の弾力性、関節の健康、創傷治癒。美容アミノ酸。',
    category: 'conditional', bodySystem: 'Skin & Joints', bodySystemJa: '肌と関節'
  },
  {
    name: 'Lysine', nameJa: 'リシン', symbol: 'Lys',
    sakeAmount: '3-10', wineAmount: '0.2-1', beerAmount: '0.1-0.5', spiritsAmount: '0',
    role: 'Calcium absorption enhancer. Collagen cross-linker. Antiviral agent.',
    roleJa: 'カルシウム吸収促進剤。コラーゲン架橋剤。抗ウイルス剤。',
    benefit: 'Immune defense, bone strength, cold sore prevention, detoxification.',
    benefitJa: '免疫防御、骨の強化、口唇ヘルペス予防、解毒。',
    category: 'essential', bodySystem: 'Immune & Bone', bodySystemJa: '免疫と骨'
  },
  {
    name: 'Glycine', nameJa: 'グリシン', symbol: 'Gly',
    sakeAmount: '5-15', wineAmount: '0.5-2', beerAmount: '0.3-1', spiritsAmount: '0',
    role: 'Smallest amino acid with biggest sleep impact. Inhibitory neurotransmitter.',
    roleJa: '最小のアミノ酸で最大の睡眠効果。抑制性神経伝達物質。',
    benefit: 'Deep sleep quality, anti-inflammatory, liver detoxification, collagen synthesis.',
    benefitJa: '深い睡眠の質、抗炎症、肝臓解毒、コラーゲン合成。',
    category: 'non-essential', bodySystem: 'Sleep & Recovery', bodySystemJa: '睡眠と回復'
  },
  {
    name: 'Aspartic Acid', nameJa: 'アスパラギン酸', symbol: 'Asp',
    sakeAmount: '5-12', wineAmount: '0.5-2', beerAmount: '0.2-1', spiritsAmount: '0',
    role: 'Krebs cycle participant. Energy metabolism catalyst.',
    roleJa: 'クエン酸回路の参加者。エネルギー代謝触媒。',
    benefit: 'Stamina, fatigue reduction, mineral transport, neurotransmitter synthesis.',
    benefitJa: 'スタミナ、疲労軽減、ミネラル輸送、神経伝達物質合成。',
    category: 'non-essential', bodySystem: 'Energy & Stamina', bodySystemJa: 'エネルギーとスタミナ'
  },
  {
    name: '5-ALA', nameJa: '5-アミノレブリン酸', symbol: '5-ALA',
    sakeAmount: '0.5-2', wineAmount: 'trace', beerAmount: 'trace', spiritsAmount: '0',
    role: 'The "origin of life" molecule. Precursor to heme and chlorophyll. Mitochondrial energy.',
    roleJa: '「生命の起源」分子。ヘムとクロロフィルの前駆体。ミトコンドリアエネルギー。',
    benefit: 'Cellular energy production, anti-aging at the mitochondrial level, cancer research applications.',
    benefitJa: '細胞エネルギー生産、ミトコンドリアレベルでの抗老化、がん研究への応用。',
    category: 'non-essential', bodySystem: 'Cellular Energy', bodySystemJa: '細胞エネルギー'
  },
];

// === BIOACTIVE COMPOUNDS ===
export interface BioactiveCompound {
  name: string;
  nameJa: string;
  source: string;
  sourceJa: string;
  effect: string;
  effectJa: string;
  science: string;
  scienceJa: string;
  icon: string;
}

export const bioactiveCompounds: BioactiveCompound[] = [
  {
    name: 'Kojic Acid', nameJa: 'コウジ酸',
    source: 'Aspergillus oryzae (koji mold)', sourceJa: 'アスペルギルス・オリゼー（麹菌）',
    effect: 'Skin brightening, melanin inhibition, anti-aging',
    effectJa: '美白、メラニン抑制、抗老化',
    science: 'Chelates copper in tyrosinase enzyme, blocking melanin synthesis. Used in dermatology worldwide — originated from sake brewing.',
    scienceJa: 'チロシナーゼ酵素の銅をキレートし、メラニン合成を阻害。世界中の皮膚科で使用 — 酒造りから生まれた。',
    icon: '✦'
  },
  {
    name: 'Ferulic Acid', nameJa: 'フェルラ酸',
    source: 'Rice bran + koji fermentation', sourceJa: '米ぬか＋麹発酵',
    effect: 'UV protection, free radical neutralization, anti-photoaging',
    effectJa: 'UV保護、フリーラジカル中和、光老化防止',
    science: 'Natural UV absorber. Synergizes with vitamins C and E. Prevents premature aging from sun damage at the cellular level.',
    scienceJa: '天然UV吸収剤。ビタミンCとEと相乗効果。細胞レベルで日光による早期老化を防止。',
    icon: '☀'
  },
  {
    name: 'ACE-Inhibitory Peptides', nameJa: 'ACE阻害ペプチド',
    source: 'Koji enzymatic breakdown of rice protein', sourceJa: '麹による米タンパク質の酵素分解',
    effect: 'Blood pressure reduction, cardiovascular protection',
    effectJa: '血圧低下、心血管保護',
    science: 'Inhibit angiotensin-converting enzyme, reducing vasoconstriction. Natural mechanism identical to pharmaceutical ACE inhibitors.',
    scienceJa: 'アンジオテンシン変換酵素を阻害し、血管収縮を軽減。医薬品のACE阻害剤と同一の天然メカニズム。',
    icon: '♥'
  },
  {
    name: 'Pyroglutamyl Peptides', nameJa: 'ピログルタミルペプチド',
    source: 'Sake fermentation (19 distinct types)', sourceJa: '酒の発酵（19種類）',
    effect: 'Liver protection, anti-inflammatory, colitis symptom reduction',
    effectJa: '肝臓保護、抗炎症、大腸炎症状軽減',
    science: 'Sake contains 19 different pyroglutamyl peptides — more than any other fermented beverage. Hepatoprotective effects confirmed by Kiyono et al.',
    scienceJa: '酒は19種類のピログルタミルペプチドを含む — 他のどの発酵飲料よりも多い。肝保護効果は清野らにより確認。',
    icon: '⛨'
  },
  {
    name: 'SAM (S-Adenosylmethionine)', nameJa: 'SAM（S-アデノシルメチオニン）',
    source: 'Sake yeast (uniquely high production)', sourceJa: '酒酵母（独自の高生産）',
    effect: 'Mood elevation, joint health, liver protection',
    effectJa: '気分向上、関節の健康、肝臓保護',
    science: 'Sake yeast produces exceptionally high SAM levels. Used as a prescription antidepressant in Europe. Found in sake lees (kasu).',
    scienceJa: '酒酵母は例外的に高いSAMレベルを生産。ヨーロッパでは処方抗うつ薬として使用。酒粕に含まれる。',
    icon: '☯'
  },
  {
    name: 'Glycosylceramide', nameJa: 'グリコシルセラミド',
    source: 'Koji mold cell walls', sourceJa: '麹菌の細胞壁',
    effect: 'Gut microbiome modulation, skin barrier strengthening',
    effectJa: '腸内細菌叢の調節、皮膚バリアの強化',
    science: 'Koji contains abundant glycosylceramide that positively modulates intestinal microbiota. Hamajima et al. (2016) confirmed significant gut health effects.',
    scienceJa: '麹は腸内細菌叢を積極的に調節する豊富なグリコシルセラミドを含む。浜島ら（2016）が重要な腸の健康効果を確認。',
    icon: '◎'
  },
  {
    name: 'Lactic Acid', nameJa: '乳酸',
    source: 'Lactobacillus in sake moto (starter)', sourceJa: '酒母中の乳酸菌',
    effect: 'Probiotic, digestive health, immune boost',
    effectJa: 'プロバイオティクス、消化器の健康、免疫力向上',
    science: 'Sake brewing naturally produces lactic acid bacteria. Reduces inflammation, encourages lactose digestion, and mildly boosts immune system.',
    scienceJa: '酒造りは自然に乳酸菌を生産。炎症を軽減し、乳糖消化を促進し、免疫系を穏やかに強化。',
    icon: '❋'
  },
  {
    name: 'Ethyl-α-D-Glucoside', nameJa: 'エチルαDグルコシド',
    source: 'Unique to sake fermentation', sourceJa: '酒の発酵に固有',
    effect: 'Skin moisture retention, fibroblast activation',
    effectJa: '肌の水分保持、線維芽細胞の活性化',
    science: 'Found only in sake among alcoholic beverages. Bogaki et al. (2017) showed it enhances human dermal fibroblast activity — the cells that keep skin young.',
    scienceJa: 'アルコール飲料の中で酒にのみ見られる。ボガキら（2017）はヒト皮膚線維芽細胞の活性を高めることを示した — 肌を若く保つ細胞。',
    icon: '❀'
  },
];

// === ALCOHOL COMPARISON ===
export interface AlcoholComparison {
  category: string;
  categoryJa: string;
  sake: string;
  wine: string;
  beer: string;
  spirits: string;
  sakeWins: boolean;
  note: string;
  noteJa: string;
}

export const alcoholComparisons: AlcoholComparison[] = [
  { category: 'Amino Acids', categoryJa: 'アミノ酸', sake: '~120mg/100ml', wine: '~12mg/100ml', beer: '~5mg/100ml', spirits: '0', sakeWins: true, note: '10x more than wine. The single biggest differentiator.', noteJa: 'ワインの10倍。最大の差別化要因。' },
  { category: 'Sulfites', categoryJa: '亜硫酸塩', sake: 'Zero', wine: '20-350mg/L', beer: 'Low', spirits: 'Zero', sakeWins: true, note: 'No preservatives needed. Cleaner experience, fewer headaches.', noteJa: '保存料不要。よりクリーンな体験、頭痛が少ない。' },
  { category: 'Histamines', categoryJa: 'ヒスタミン', sake: 'Very low', wine: 'High (red)', beer: 'Medium', spirits: 'Low', sakeWins: true, note: 'Low histamines = no false allergy response = cleaner buzz.', noteJa: '低ヒスタミン＝偽アレルギー反応なし＝クリーンな酔い。' },
  { category: 'Gluten', categoryJa: 'グルテン', sake: 'Zero', wine: 'Zero', beer: 'Present', spirits: 'Varies', sakeWins: true, note: 'Rice-based. Completely gluten-free by nature.', noteJa: '米ベース。本質的に完全グルテンフリー。' },
  { category: 'Congeners', categoryJa: '不純物', sake: 'Very low', wine: 'Medium-High', beer: 'Medium', spirits: 'High (dark)', sakeWins: true, note: 'Fewer toxic byproducts = lighter hangover = better morning.', noteJa: '有毒副産物が少ない＝軽い二日酔い＝良い朝。' },
  { category: 'Bioactive Peptides', categoryJa: '生理活性ペプチド', sake: '19+ types', wine: 'Some', beer: 'Few', spirits: 'None', sakeWins: true, note: 'ACE-inhibitory + pyroglutamyl. Pharmaceutical-grade compounds.', noteJa: 'ACE阻害＋ピログルタミル。医薬品グレードの化合物。' },
  { category: 'Probiotic Potential', categoryJa: 'プロバイオティクス', sake: 'Lactic acid bacteria', wine: 'Minimal', beer: 'Minimal', spirits: 'None', sakeWins: true, note: 'Sake moto naturally produces beneficial lactobacillus.', noteJa: '酒母は自然に有益な乳酸菌を生産。' },
  { category: 'Calories (per pour)', categoryJa: 'カロリー（1杯あたり）', sake: '152 (4oz)', wine: '139 (6oz)', beer: '194 (16oz)', spirits: '131 (2oz)', sakeWins: false, note: 'Slightly more than wine per pour, but far less than beer.', noteJa: '1杯あたりワインよりやや多いが、ビールよりはるかに少ない。' },
  { category: 'Sugar', categoryJa: '糖質', sake: '0.5-4.2g', wine: '0.1-5.1g', beer: '0.14-0.45g', spirits: '0g', sakeWins: false, note: 'Higher glucose but lower fructose. Body processes it differently.', noteJa: 'グルコースは高いがフルクトースは低い。体は異なる処理をする。' },
  { category: 'Additives', categoryJa: '添加物', sake: 'None (premium)', wine: 'Sulfites, fining agents', beer: 'Various', spirits: 'Caramel color, etc.', sakeWins: true, note: 'Premium sake: rice, water, koji, yeast. That\'s it. Nothing else.', noteJa: 'プレミアム酒：米、水、麹、酵母。それだけ。他には何もない。' },
];

// === SEVEN BENEFITS ===
export interface HealthBenefit {
  title: string;
  titleJa: string;
  subtitle: string;
  subtitleJa: string;
  description: string;
  descriptionJa: string;
  science: string;
  scienceJa: string;
  icon: string;
  compounds: string[];
}

export const healthBenefits: HealthBenefit[] = [
  {
    title: 'The Skin Elixir', titleJa: '肌の霊薬',
    subtitle: 'Why sake brewers have the hands of 20-year-olds', subtitleJa: 'なぜ酒造りの人は20歳の手を持つのか',
    description: 'Toji (master brewers) who spend decades with their hands in sake mash are legendary for their youthful, porcelain-smooth skin. This isn\'t folklore — it\'s biochemistry. Sake contains ethyl-α-D-glucoside (found in no other alcohol), which activates fibroblasts — the cells that produce collagen and keep skin elastic. Add kojic acid for brightening, ferulic acid for UV protection, and proline for structural integrity.',
    descriptionJa: '何十年も酒のもろみに手を浸してきた杜氏（マスターブルワー）は、若々しく磁器のように滑らかな肌で伝説的だ。これは民間伝承ではない — 生化学だ。酒にはエチルαDグルコシド（他のアルコールには見られない）が含まれ、線維芽細胞を活性化する — コラーゲンを生産し肌の弾力性を保つ細胞。美白のためのコウジ酸、UV保護のためのフェルラ酸、構造的完全性のためのプロリンを加える。',
    science: 'Bogaki et al. (2017) confirmed ethyl-α-D-glucoside enhances human dermal fibroblast activity. Sake bath (酒風呂) tradition backed by measurable moisture retention.',
    scienceJa: 'ボガキら（2017）はエチルαDグルコシドがヒト皮膚線維芽細胞の活性を高めることを確認。酒風呂の伝統は測定可能な水分保持で裏付けられている。',
    icon: '✦', compounds: ['Ethyl-α-D-Glucoside', 'Kojic Acid', 'Ferulic Acid', 'Proline']
  },
  {
    title: 'The Sleep Architecture', titleJa: '睡眠の建築',
    subtitle: 'Deep sleep, not just unconsciousness', subtitleJa: '深い睡眠、ただの無意識ではなく',
    description: 'Sake doesn\'t just knock you out — it restructures your sleep. Sake yeast stimulates adenosine A2A receptors in the brain, promoting slow-wave sleep (the deep, restorative phase that most alcohol actually suppresses). This is the sleep where your body repairs tissue, consolidates memory, and releases growth hormone. Most alcohol gives you quantity of sleep. Sake gives you quality.',
    descriptionJa: '酒はただ意識を失わせるのではない — 睡眠を再構築する。酒酵母は脳のアデノシンA2A受容体を刺激し、徐波睡眠（ほとんどのアルコールが実際に抑制する深い回復段階）を促進する。これは体が組織を修復し、記憶を統合し、成長ホルモンを放出する睡眠だ。ほとんどのアルコールは睡眠の量を与える。酒は質を与える。',
    science: 'Monoi et al. (2015) in Journal of Sleep Research: sake yeast supplementation improved sleep quality via adenosine A2A receptor activation.',
    scienceJa: '物井ら（2015）Journal of Sleep Research：酒酵母サプリメントがアデノシンA2A受容体活性化を介して睡眠の質を改善。',
    icon: '☽', compounds: ['Sake Yeast', 'Adenosine Pathway', 'Glycine']
  },
  {
    title: 'The Liver Paradox', titleJa: '肝臓のパラドックス',
    subtitle: 'An alcohol that protects the organ it attacks', subtitleJa: '攻撃する臓器を保護するアルコール',
    description: 'Here\'s the paradox: alcohol damages the liver, but sake simultaneously promotes antioxidizing activity in the liver. Nakajima et al. showed that regular moderate sake consumption enhanced the liver\'s ability to process toxins — the very organ that processes the alcohol itself. The pyroglutamyl peptides act as hepatoprotective agents, and the lactic acid bacteria support the gut-liver axis.',
    descriptionJa: 'パラドックスがある：アルコールは肝臓を損傷するが、酒は同時に肝臓の抗酸化活性を促進する。中島らは、適度な酒の定期的な摂取が肝臓の毒素処理能力を高めることを示した — アルコール自体を処理するまさにその臓器。ピログルタミルペプチドは肝保護剤として作用し、乳酸菌は腸-肝臓軸をサポートする。',
    science: 'Nakajima et al. (2016) in PLoS One: chronic sake intake mediated radiation-induced metabolic alterations in mouse liver, showing protective effects.',
    scienceJa: '中島ら（2016）PLoS One：慢性的な酒の摂取がマウス肝臓の放射線誘発代謝変化を媒介し、保護効果を示した。',
    icon: '⚗', compounds: ['Pyroglutamyl Peptides', 'Lactic Acid', 'SAM']
  },
  {
    title: 'The Cardiovascular Shield', titleJa: '心血管の盾',
    subtitle: 'Blood pressure, naturally', subtitleJa: '自然に血圧を',
    description: 'Sake\'s ACE-inhibitory peptides work through the same mechanism as pharmaceutical blood pressure medications — but they arrive in a tokkuri instead of a pill bottle. Arginine converts to nitric oxide, dilating blood vessels. The overall effect: lower systolic blood pressure over time, reduced cardiovascular strain, and improved circulation. The Japanese proverb 酒は百薬の長 (sake surpasses any medicine) has biochemical backing.',
    descriptionJa: '酒のACE阻害ペプチドは医薬品の血圧薬と同じメカニズムで作用する — しかし錠剤の瓶ではなく徳利で届く。アルギニンは一酸化窒素に変換され、血管を拡張する。全体的な効果：時間の経過とともに収縮期血圧が低下し、心血管への負担が軽減され、循環が改善される。日本のことわざ「酒は百薬の長」には生化学的な裏付けがある。',
    science: 'Saito et al. (1994): ACE-inhibitory peptides in sake reduced blood pressure in spontaneously hypertensive rats.',
    scienceJa: '斉藤ら（1994）：酒中のACE阻害ペプチドが自然発症高血圧ラットの血圧を低下。',
    icon: '♥', compounds: ['ACE-Inhibitory Peptides', 'Arginine', 'Nitric Oxide']
  },
  {
    title: 'The Gut Intelligence', titleJa: '腸の知性',
    subtitle: 'Your second brain, properly fed', subtitleJa: '第二の脳、適切に養われて',
    description: 'Sake alters how your stomach processes food — prioritizing protein digestion and slowing excess starch absorption. The lactic acid bacteria from the brewing process act as natural probiotics. Glycosylceramide from koji modulates the gut microbiome. And because sake is low in the acids that cause metabolic acidosis, the morning-after gut distress that plagues wine and beer drinkers is dramatically reduced.',
    descriptionJa: '酒は胃が食物を処理する方法を変える — タンパク質の消化を優先し、過剰なデンプンの吸収を遅らせる。醸造過程の乳酸菌は天然のプロバイオティクスとして作用する。麹からのグリコシルセラミドは腸内細菌叢を調節する。そして酒は代謝性アシドーシスを引き起こす酸が少ないため、ワインやビールの飲酒者を悩ませる翌朝の腸の不調は劇的に軽減される。',
    science: 'Hamajima et al. (2016): koji glycosylceramide positively modulates intestinal microbiota composition.',
    scienceJa: '浜島ら（2016）：麹のグリコシルセラミドが腸内細菌叢の組成を積極的に調節。',
    icon: '◎', compounds: ['Lactic Acid Bacteria', 'Glycosylceramide', 'Glutamic Acid']
  },
  {
    title: 'The Mood Molecule', titleJa: '気分の分子',
    subtitle: 'SAM: Europe\'s prescription antidepressant, Japan\'s happy hour', subtitleJa: 'SAM：ヨーロッパの処方抗うつ薬、日本のハッピーアワー',
    description: 'S-Adenosylmethionine (SAM) is prescribed as an antidepressant in Italy, Germany, and Russia. Sake yeast produces it in unusually high quantities. SAM is a methyl donor involved in over 100 biochemical reactions — including serotonin and dopamine synthesis. This is why sake\'s mood elevation feels qualitatively different from other alcohols: it\'s not just ethanol disinhibition. There\'s a biochemical warmth that\'s distinct.',
    descriptionJa: 'S-アデノシルメチオニン（SAM）はイタリア、ドイツ、ロシアで抗うつ薬として処方されている。酒酵母はそれを異常に大量に生産する。SAMは100以上の生化学反応に関与するメチル供与体 — セロトニンとドーパミンの合成を含む。これが酒の気分高揚が他のアルコールと質的に異なる理由だ：単なるエタノールの脱抑制ではない。独特の生化学的な温かさがある。',
    science: 'SAM is a registered pharmaceutical in multiple European countries. Sake yeast produces uniquely high levels found concentrated in sake lees.',
    scienceJa: 'SAMは複数のヨーロッパ諸国で登録医薬品。酒酵母は酒粕に濃縮された独自の高レベルを生産。',
    icon: '☯', compounds: ['SAM', 'Sake Yeast', 'Folic Acid']
  },
  {
    title: 'The Clean Altered State', titleJa: 'クリーンな変性意識',
    subtitle: 'Intoxication without the interference', subtitleJa: '干渉のない酩酊',
    description: 'Every alcohol alters consciousness. But sake does it with the least interference. Zero sulfites means no preservative-triggered inflammation. Low histamines means no false immune response. Minimal congeners means fewer toxic byproducts competing for liver processing. The result: a cleaner, warmer, more present altered state. The Japanese have a word for this specific quality of sake intoxication: 酔い (yoi) — a harmonious drunkenness that\'s considered an art form, not a failure state.',
    descriptionJa: 'すべてのアルコールは意識を変える。しかし酒は最小の干渉でそれを行う。亜硫酸塩ゼロは保存料による炎症がないことを意味する。低ヒスタミンは偽の免疫反応がないことを意味する。最小限の不純物は肝臓処理を競合する有毒副産物が少ないことを意味する。結果：よりクリーンで、より温かく、より現在に存在する変性意識状態。日本人はこの酒の酩酊の特定の質を表す言葉を持っている：酔い（よい）— 失敗状態ではなく芸術形式と見なされる調和のとれた酔い。',
    science: 'Comparative analysis: sake has lowest combined sulfite + histamine + congener load of any fermented beverage.',
    scienceJa: '比較分析：酒は発酵飲料の中で亜硫酸塩＋ヒスタミン＋不純物の合計負荷が最も低い。',
    icon: '❂', compounds: ['Zero Sulfites', 'Low Histamines', 'Minimal Congeners', 'SAM']
  },
];

// === LONGEVITY DATA ===
export interface LongevityFact {
  stat: string;
  statJa: string;
  context: string;
  contextJa: string;
  source: string;
}

export const longevityFacts: LongevityFact[] = [
  { stat: '86+', statJa: '86歳以上', context: 'Average life expectancy in Japan — the highest in the world', contextJa: '日本の平均寿命 — 世界最高', source: 'WHO' },
  { stat: '86,000+', statJa: '86,000人以上', context: 'Centenarians living in Japan today', contextJa: '現在日本に住む100歳以上の人', source: 'Japan Ministry of Health' },
  { stat: '酒は百薬の長', statJa: '酒は百薬の長', context: '"Sake surpasses any medicine" — Japanese proverb dating back centuries', contextJa: '「酒は百薬の長」— 何世紀も前からの日本のことわざ', source: 'Traditional' },
  { stat: '4 ingredients', statJa: '4つの原料', context: 'Rice, water, koji, yeast. No additives, no preservatives, no sulfites.', contextJa: '米、水、麹、酵母。添加物なし、保存料なし、亜硫酸塩なし。', source: 'JSS' },
  { stat: '20+ amino acids', statJa: '20以上のアミノ酸', context: 'More free amino acids than any other alcoholic beverage', contextJa: '他のどのアルコール飲料よりも多い遊離アミノ酸', source: 'Kimura (2024)' },
  { stat: '19 peptide types', statJa: '19種類のペプチド', context: 'Pyroglutamyl peptides with hepatoprotective and anti-inflammatory effects', contextJa: '肝保護および抗炎症効果を持つピログルタミルペプチド', source: 'Kiyono et al. (2013)' },
];

// === ALTERED STATES PHILOSOPHY ===
export interface AlteredStateAspect {
  title: string;
  titleJa: string;
  description: string;
  descriptionJa: string;
  sakeAdvantage: string;
  sakeAdvantageJa: string;
}

export const alteredStateAspects: AlteredStateAspect[] = [
  {
    title: 'The Warmth', titleJa: '温もり',
    description: 'Sake produces a distinctive internal warmth that radiates from the center outward. Not the burning heat of spirits or the acidic flush of wine.',
    descriptionJa: '酒は中心から外側に放射する独特の内部的な温もりを生む。蒸留酒の燃えるような熱さやワインの酸性の紅潮ではない。',
    sakeAdvantage: 'Amino acid profile + low acid content creates a gentler, more sustained warming effect',
    sakeAdvantageJa: 'アミノ酸プロファイル＋低酸含量がより穏やかで持続的な温め効果を生む'
  },
  {
    title: 'The Clarity', titleJa: '明晰さ',
    description: 'Sake intoxication maintains a remarkable mental clarity compared to other alcohols. Thoughts don\'t scatter — they slow and deepen.',
    descriptionJa: '酒の酩酊は他のアルコールと比較して驚くべき精神的明晰さを維持する。思考は散乱しない — 遅くなり深まる。',
    sakeAdvantage: 'Zero sulfites + low histamines = no inflammatory interference with cognitive function',
    sakeAdvantageJa: '亜硫酸塩ゼロ＋低ヒスタミン＝認知機能への炎症性干渉なし'
  },
  {
    title: 'The Presence', titleJa: '存在感',
    description: 'Rather than pulling you out of the moment (like spirits) or making you drowsy (like beer), sake anchors you more firmly in the present.',
    descriptionJa: '蒸留酒のように瞬間から引き離したり、ビールのように眠くさせたりするのではなく、酒はあなたをより確実に現在に固定する。',
    sakeAdvantage: 'SAM + glutamic acid (GABA precursor) create a grounded, present-tense awareness',
    sakeAdvantageJa: 'SAM＋グルタミン酸（GABA前駆体）が地に足のついた現在形の意識を生む'
  },
  {
    title: 'The Connection', titleJa: 'つながり',
    description: 'The Japanese ritual of pouring for others (never yourself) creates a biochemical-social feedback loop. Oxytocin + sake\'s mood compounds = genuine human connection.',
    descriptionJa: '他者のために注ぐ（決して自分のためではない）日本の儀式は、生化学的-社会的フィードバックループを生む。オキシトシン＋酒の気分化合物＝本物の人間のつながり。',
    sakeAdvantage: 'The serving ritual amplifies sake\'s mood-elevating compounds through social bonding',
    sakeAdvantageJa: '注ぎの儀式が社会的絆を通じて酒の気分高揚化合物を増幅する'
  },
  {
    title: 'The Recovery', titleJa: '回復',
    description: 'The morning after sake is qualitatively different. Less headache, less nausea, less cognitive fog. The altered state has a gentler exit.',
    descriptionJa: '酒の翌朝は質的に異なる。頭痛が少なく、吐き気が少なく、認知的な霧が少ない。変性意識状態はより穏やかな出口を持つ。',
    sakeAdvantage: 'No sulfites, low histamines, minimal congeners, plus glycine for liver support',
    sakeAdvantageJa: '亜硫酸塩なし、低ヒスタミン、最小限の不純物、さらに肝臓サポートのためのグリシン'
  },
];
