/*
 * spiritualData.ts — Data for Traditional Sake Ceremony & Spiritual Realms
 * The deepest layer of the site. Where sake becomes sacrament.
 */

// ─── TRADITIONAL CEREMONY DATA ─────────────────────────────────

export interface CeremonyStep {
  order: number;
  nameEn: string;
  nameJa: string;
  kanji: string;
  durationEn: string;
  durationJa: string;
  descriptionEn: string;
  descriptionJa: string;
  deepNoteEn: string;
  deepNoteJa: string;
  icon: string; // emoji
}

export const traditionalCeremonySteps: CeremonyStep[] = [
  {
    order: 1,
    nameEn: 'Purification of Space',
    nameJa: '場の清め',
    kanji: '清',
    durationEn: 'Before gathering',
    durationJa: '集まる前に',
    descriptionEn: 'The host prepares the room. A single branch of seasonal greenery. The tokkuri is placed on a tray of unfinished wood. Salt is set at the threshold. The space is swept — not for cleanliness, but for emptiness.',
    descriptionJa: '亭主が部屋を整える。季節の枝を一本。未塗装の木の盆に徳利を置く。敷居に塩を盛る。掃き清める——清潔のためではなく、空（くう）のために。',
    deepNoteEn: 'In Shinto, purity is not the absence of dirt but the presence of sincerity. The swept room mirrors the swept mind. You are creating a container for something sacred to enter.',
    deepNoteJa: '神道において、清浄とは汚れの不在ではなく、誠の存在である。掃き清められた部屋は、掃き清められた心を映す。神聖なものが入るための器を作っている。',
    icon: '🌿',
  },
  {
    order: 2,
    nameEn: 'Selection of Vessel',
    nameJa: '器の選定',
    kanji: '器',
    durationEn: '5 minutes of contemplation',
    durationJa: '五分の黙想',
    descriptionEn: 'Choose the cup that matches the season and the soul of the sake. Winter calls for thick ceramic guinomi that warm the hands. Spring demands thin-lipped sakazuki where the sake barely touches before it enters you. The vessel is not a container — it is a collaborator.',
    descriptionJa: '季節と酒の魂に合った杯を選ぶ。冬は手を温める厚手の陶器のぐい呑み。春は酒がかすかに触れるだけの薄口の盃。器は容器ではない——共演者である。',
    deepNoteEn: 'The Japanese word for vessel (器/utsuwa) also means "capacity" — as in the capacity of a person. To choose a vessel is to ask: what am I capable of receiving tonight?',
    deepNoteJa: '器（うつわ）という言葉は「人の器」をも意味する。器を選ぶとは問うこと——今宵、何を受け入れられるか。',
    icon: '🏺',
  },
  {
    order: 3,
    nameEn: 'The Warming',
    nameJa: '燗付け',
    kanji: '燗',
    durationEn: 'Slow, attentive minutes',
    durationJa: 'ゆっくりと、注意深く',
    descriptionEn: 'If the sake calls for warmth, heat it with patience. Place the tokkuri in water heated to precisely the right temperature. Never microwave. Never rush. The warming is meditation — watching the water, feeling the ceramic, sensing the moment the sake reaches its voice.',
    descriptionJa: '酒が温もりを求めるなら、忍耐をもって温める。正確な温度の湯に徳利を入れる。電子レンジは決して使わない。急がない。燗付けは瞑想——湯を見つめ、陶器に触れ、酒が声を得る瞬間を感じ取る。',
    deepNoteEn: 'There are 10+ named temperature points in Japanese sake culture, from yukibie (snow-cold, 5°C) to tobikiri-kan (flying hot, 55°C). Each degree unlocks a different personality in the same bottle. The warming is not preparation — it is the first act of drinking.',
    deepNoteJa: '日本の酒文化には十以上の温度名がある。雪冷え（5°C）から飛び切り燗（55°C）まで。一度ごとに同じ瓶の異なる人格が現れる。燗付けは準備ではない——飲む行為の第一幕である。',
    icon: '🔥',
  },
  {
    order: 4,
    nameEn: 'The Offering',
    nameJa: '御神酒',
    kanji: '神',
    durationEn: 'A breath',
    durationJa: '一呼吸',
    descriptionEn: 'Before anyone drinks, a small portion is set aside — for the gods, for the ancestors, for the rice that gave its life. This is omiki. The sake is lifted slightly, a silent acknowledgment to forces larger than the gathering. In homes, this might be a small cup placed on the kamidana shelf. In the heart, it is gratitude.',
    descriptionJa: '誰も飲む前に、少量を取り分ける——神々のため、祖先のため、命を捧げた米のため。これが御神酒。酒をわずかに持ち上げ、集いより大きな力への無言の感謝。家庭では神棚に小さな杯を置く。心の中では、それは感謝。',
    deepNoteEn: 'Omiki transforms sake from beverage to bridge. The word itself contains 神 (kami/god). When you offer sake to the invisible, you acknowledge that what enters your mouth was not made by humans alone — it was made by water, rice, koji, yeast, time, and something unnamed.',
    deepNoteJa: '御神酒は酒を飲み物から橋へと変える。言葉自体に神が含まれる。見えないものに酒を捧げるとき、口に入るものは人間だけが作ったのではないと認める——水、米、麹、酵母、時間、そして名もなき何かが作った。',
    icon: '⛩️',
  },
  {
    order: 5,
    nameEn: 'Pouring for Others',
    nameJa: '注ぎの作法',
    kanji: '注',
    durationEn: 'Throughout the evening',
    durationJa: '夜を通して',
    descriptionEn: 'You never pour for yourself. This is the deepest etiquette of sake. You watch the cups of others. When a cup is less than half full, you offer. When someone pours for you, you lift your cup with both hands and receive. This creates a web of attention — everyone watching everyone, everyone caring for everyone.',
    descriptionJa: '自分では注がない。これが酒の最も深い作法。他者の杯を見守る。半分以下になったら差し出す。注いでもらうときは両手で杯を持ち上げて受ける。注意の網が生まれる——皆が皆を見守り、皆が皆を思いやる。',
    deepNoteEn: 'This single rule — never pour for yourself — contains an entire philosophy. It says: your pleasure is my responsibility. My pleasure is yours. We cannot drink alone, even when alone. The act of pouring is the act of love.',
    deepNoteJa: 'この一つの作法——自分では注がない——に哲学全体が含まれる。あなたの喜びは私の責任。私の喜びはあなたの。一人でいても、一人では飲めない。注ぐ行為は愛の行為。',
    icon: '🫗',
  },
  {
    order: 6,
    nameEn: 'The First Sip',
    nameJa: '初口',
    kanji: '初',
    durationEn: 'One moment',
    durationJa: '一瞬',
    descriptionEn: 'Hold the cup. Feel its weight, its temperature, the texture of the glaze against your fingertips. Bring it to your nose — not a wine-sniff, but a gentle inhalation, as if breathing in the presence of a friend. Then sip. Let the sake rest on your tongue before swallowing. The first sip is not for tasting. It is for meeting.',
    descriptionJa: '杯を持つ。重さ、温度、指先に触れる釉薬の質感を感じる。鼻に近づける——ワインの嗅ぎ方ではなく、友の気配を吸い込むように穏やかに。そして啜る。飲み込む前に舌の上に酒を休ませる。初口は味わうためではない。出会うため。',
    deepNoteEn: 'Japanese has a word — 出会い (deai) — that means "encounter" or "meeting" but carries the weight of fate. Your first sip of a sake is a deai. You are meeting a living thing that traveled from a rice field through a brewery through time to arrive at this exact moment in your mouth.',
    deepNoteJa: '日本語には「出会い」という言葉がある。運命の重みを持つ。酒の初口は出会い。田んぼから蔵を経て時を越え、この瞬間あなたの口に辿り着いた生きものとの。',
    icon: '👄',
  },
  {
    order: 7,
    nameEn: 'Kampai — The Shared Toast',
    nameJa: '乾杯',
    kanji: '杯',
    durationEn: 'A single word',
    durationJa: '一言',
    descriptionEn: 'Kampai literally means "dry cup" — drink it all. But the real meaning is deeper: we empty ourselves together. We make space together. The cups are raised, eyes meet, and for one suspended moment, everyone in the room is synchronized. This is the closest sake gets to prayer.',
    descriptionJa: '乾杯は文字通り「杯を乾かす」——全て飲み干す。しかし真の意味はより深い：共に自らを空にする。共に空間を作る。杯を掲げ、目が合い、一瞬の間、部屋の全員が同期する。酒が祈りに最も近づく瞬間。',
    deepNoteEn: 'The character 乾 means "dry/heaven" and 杯 means "cup." To kampai is to offer your cup to heaven and empty it. It is both celebration and surrender.',
    deepNoteJa: '「乾」は乾く・天を意味し、「杯」は杯を意味する。乾杯とは杯を天に捧げ空にすること。祝福であり、降伏でもある。',
    icon: '🥂',
  },
  {
    order: 8,
    nameEn: 'Naorai — The Sacred Feast',
    nameJa: '直会',
    kanji: '直',
    durationEn: 'The rest of the evening',
    durationJa: '夜の残り',
    descriptionEn: 'After the formal ceremony, the gathering softens into naorai — the communal feast where humans share the food and sake that was offered to the gods. This is not an afterparty. It is the completion of the circle: the gods have blessed the sake, and now we receive that blessing through our bodies.',
    descriptionJa: '正式な儀式の後、集いは直会へと和らぐ——神々に捧げた食と酒を人間が分かち合う共同の宴。これは二次会ではない。円の完成：神々が酒を祝福し、今我々はその祝福を身体を通して受け取る。',
    deepNoteEn: 'Naorai comes from 直り合い (naoriai) — "to return to the ordinary together." After touching the sacred, we must come back to the human world. But we return changed. The sake in your belly is the same sake the gods touched. You carry divinity home in your bloodstream.',
    deepNoteJa: '直会は「直り合い」から来る——「共に日常に戻る」。聖なるものに触れた後、人間の世界に戻らねばならない。しかし変わって戻る。腹の中の酒は神々が触れた同じ酒。神性を血流に乗せて家に持ち帰る。',
    icon: '🍶',
  },
];

// ─── SPIRITUAL REALMS DATA ─────────────────────────────────────

export interface SpiritualRealm {
  id: number;
  nameEn: string;
  nameJa: string;
  kanji: string;
  subtitleEn: string;
  subtitleJa: string;
  descriptionEn: string;
  descriptionJa: string;
  practiceEn: string;
  practiceJa: string;
  sakeConnectionEn: string;
  sakeConnectionJa: string;
  color: string; // oklch color for the realm
  symbol: string;
}

export const spiritualRealms: SpiritualRealm[] = [
  {
    id: 1,
    nameEn: 'The Realm of Purification',
    nameJa: '祓いの境地',
    kanji: '祓',
    subtitleEn: 'Harai — Where the noise stops',
    subtitleJa: '祓い——雑音が止む場所',
    descriptionEn: 'The first realm is silence. Before sake touches your lips, it has already begun its work. The act of preparation — choosing the vessel, warming the sake, setting the space — is itself a purification ritual. You are not just preparing a drink. You are preparing yourself to receive.',
    descriptionJa: '第一の境地は静寂。酒が唇に触れる前に、その働きはすでに始まっている。準備の行為——器を選び、酒を温め、場を整える——それ自体が祓いの儀式。飲み物を準備しているのではない。受け取る自分自身を準備している。',
    practiceEn: 'Sit with your sake for 30 seconds before drinking. Close your eyes. Feel the weight of the cup. Let the day fall away. This is harai — the clearing of the inner shrine.',
    practiceJa: '飲む前に三十秒、酒と共に座る。目を閉じる。杯の重さを感じる。一日を手放す。これが祓い——内なる神殿の清め。',
    sakeConnectionEn: 'Sake has been used in Shinto jichinsai (groundbreaking ceremonies) for millennia to purify land before building. The same principle applies to your inner landscape — sake purifies the ground of consciousness before something new can be built.',
    sakeConnectionJa: '酒は千年にわたり神道の地鎮祭で土地を清めるために使われてきた。同じ原理が内なる風景にも当てはまる——酒は意識の地を清め、新しいものが建てられるようにする。',
    color: 'oklch(0.85 0.05 200)',
    symbol: '💧',
  },
  {
    id: 2,
    nameEn: 'The Realm of Presence',
    nameJa: '今在の境地',
    kanji: '今',
    subtitleEn: 'Ima — Where time dissolves',
    subtitleJa: '今——時が溶ける場所',
    descriptionEn: 'The second realm arrives with the first sip. Sake, unlike spirits that hit hard and fast, enters gently. It does not assault your senses — it invites them. In this invitation is a doorway to radical presence. The amino acids in sake (7x more than wine) create a physical sensation of warmth and softness that anchors you in the body, in the now.',
    descriptionJa: '第二の境地は初口と共に訪れる。酒はスピリッツのように激しく速く来るのではなく、穏やかに入る。感覚を襲わない——招く。この招きの中に根源的な現在への扉がある。酒のアミノ酸（ワインの七倍）が温かさと柔らかさの身体感覚を生み、身体に、今に、錨を下ろす。',
    practiceEn: 'With your second sip, notice three things: the temperature on your tongue, the texture against your palate, and the warmth as it descends. You have just practiced mindfulness without trying. Sake did it for you.',
    practiceJa: '二口目で三つのことに気づく：舌の上の温度、上顎に触れる質感、下りゆく温もり。意図せずマインドフルネスを実践した。酒がそうさせた。',
    sakeConnectionEn: 'The Japanese concept of 一期一会 (ichigo ichie — one moment, one meeting) was born in tea ceremony but lives most fully in sake. Every cup is unrepeatable. The sake you drink tonight will never exist again in exactly this form, at this temperature, in this company.',
    sakeConnectionJa: '一期一会の概念は茶道に生まれたが、最も完全に生きるのは酒の中。すべての杯は繰り返せない。今宵飲む酒は、この形、この温度、この仲間で、二度と存在しない。',
    color: 'oklch(0.78 0.12 85)',
    symbol: '⏳',
  },
  {
    id: 3,
    nameEn: 'The Realm of Connection',
    nameJa: '結びの境地',
    kanji: '結',
    subtitleEn: 'Musubi — Where boundaries soften',
    subtitleJa: '結び——境界が柔らかくなる場所',
    descriptionEn: 'By the second or third cup, something shifts. The social armor loosens. Conversation deepens. Laughter comes easier. This is not mere alcohol — this is musubi, the Shinto concept of creative interconnection. The same force that binds atoms, that grows rice from mud, that turns koji mold into magic — that force is now working between people at the table.',
    descriptionJa: '二杯目か三杯目で何かが変わる。社会的な鎧が緩む。会話が深まる。笑いが容易になる。これは単なるアルコールではない——結び、神道の創造的相互接続の概念。原子を結び、泥から米を育て、麹菌を魔法に変える同じ力が、今、食卓の人々の間で働いている。',
    practiceEn: 'Pour for the person next to you before your own cup is empty. Watch their face as they receive. This micro-ritual of attention — repeated throughout the evening — weaves an invisible net of care that no other alcohol tradition achieves.',
    practiceJa: '自分の杯が空になる前に隣の人に注ぐ。受け取る顔を見守る。この注意の小さな儀式——夜を通して繰り返される——他のどの酒の伝統も達成しない、見えない思いやりの網を織る。',
    sakeConnectionEn: 'The rule of never pouring for yourself is not etiquette — it is technology. It is a social algorithm designed to create mutual awareness. Every pour is a question: "I see you. Do you need?" Every reception is an answer: "I am seen. I receive."',
    sakeConnectionJa: '自分で注がないという作法は礼儀ではない——技術である。相互認識を生み出すために設計された社会的アルゴリズム。すべての注ぎは問い：「あなたを見ている。必要か？」すべての受け取りは答え：「見られている。受け取る。」',
    color: 'oklch(0.72 0.15 50)',
    symbol: '🔗',
  },
  {
    id: 4,
    nameEn: 'The Realm of Communion',
    nameJa: '神人共食の境地',
    kanji: '共',
    subtitleEn: 'Shin-jin Kyōshoku — Where gods join the table',
    subtitleJa: '神人共食——神が食卓に加わる場所',
    descriptionEn: 'This is the realm that separates sake from every other alcohol on earth. In Shinto theology, when you drink omiki — sake that has been offered to the kami — you are literally sharing a meal with gods. The sake passes through the divine before it passes through you. You become a vessel for something larger than fermented rice.',
    descriptionJa: 'これが酒を地上の他のすべての酒と分かつ境地。神道の神学では、御神酒——神に捧げられた酒——を飲むとき、文字通り神々と食事を共にしている。酒は神聖なるものを通過してからあなたを通過する。発酵した米以上の何かの器となる。',
    practiceEn: 'Before your next gathering, set aside a small cup of sake on a high shelf or windowsill. Leave it for a few minutes. Then distribute it among your guests. You have just performed naorai — the ancient practice of divine communion. The sake in your belly is the same sake the gods touched.',
    practiceJa: '次の集まりの前に、高い棚か窓辺に小さな杯の酒を置く。数分置いておく。そして客人に分ける。直会を行った——神人共食の古代の実践。腹の中の酒は神々が触れた同じ酒。',
    sakeConnectionEn: 'Daimon Yasutaka, sixth-generation brewer, said it precisely: "The light inebriation we feel when we drink sake is a special feeling that can be likened to being transported to another world." He was not being poetic. He was being literal.',
    sakeConnectionJa: '六代目蔵元・大門康隆は正確に言った：「酒を飲んで感じるほのかな酔いは、別世界に運ばれるような特別な感覚。」詩的ではなかった。文字通りだった。',
    color: 'oklch(0.65 0.20 300)',
    symbol: '⛩️',
  },
  {
    id: 5,
    nameEn: 'The Realm of Dissolution',
    nameJa: '無我の境地',
    kanji: '無',
    subtitleEn: 'Muga — Where the self thins',
    subtitleJa: '無我——自我が薄くなる場所',
    descriptionEn: 'Deep into the evening, past the laughter and the stories, there is a quiet place. The Japanese call it 無我 (muga) — "no-self." Not unconsciousness, not oblivion. A gentle dissolution of the boundaries between you and the world. The sake has done what meditation takes years to achieve: it has softened the ego just enough for something larger to breathe through.',
    descriptionJa: '夜が深まり、笑いと物語を越えた先に、静かな場所がある。日本語では無我と呼ぶ。無意識でも忘却でもない。あなたと世界の境界の穏やかな溶解。酒は瞑想が何年もかけて達成することを成し遂げた：自我をちょうど十分に柔らかくし、より大きな何かが呼吸できるようにした。',
    practiceEn: 'This realm cannot be forced. It arrives when the evening has been conducted with sincerity — proper vessels, proper temperature, proper company, proper attention. It is the reward for doing everything else right. When it comes, do not name it. Just be in it.',
    practiceJa: 'この境地は強制できない。夜が誠実に営まれたとき訪れる——正しい器、正しい温度、正しい仲間、正しい注意。他のすべてを正しく行った報酬。訪れたら名付けない。ただその中にいる。',
    sakeConnectionEn: 'Buddhist monks were forbidden alcohol, yet they brewed sake in temples for centuries. The paradox resolves when you understand: sake was not consumed for pleasure but for practice. The gentle dissolution it offers is a shortcut to the same ego-softening that zazen meditation pursues.',
    sakeConnectionJa: '仏僧は飲酒を禁じられていたが、何世紀も寺で酒を醸した。矛盾は理解すれば解ける：酒は快楽のためではなく修行のために飲まれた。酒が提供する穏やかな溶解は、座禅が追求する同じ自我の軟化への近道。',
    color: 'oklch(0.55 0.08 270)',
    symbol: '🌊',
  },
  {
    id: 6,
    nameEn: 'The Realm of Awe',
    nameJa: '畏怖の境地',
    kanji: '畏',
    subtitleEn: 'Ifu — Where wonder returns',
    subtitleJa: '畏怖——驚異が戻る場所',
    descriptionEn: 'The rarest realm. Not everyone reaches it, and those who do cannot stay. It is the moment when you look at the cup in your hand and suddenly understand: this liquid is 80% water from an underground spring that fell as rain centuries ago. The rice was planted by hands you will never know. The koji mold is a living organism older than human civilization. You are drinking deep time.',
    descriptionJa: '最も稀な境地。誰もが到達するわけではなく、到達した者も留まれない。杯を見つめ突然理解する瞬間：この液体は何世紀も前に雨として降った地下水脈の水が八割。米は知ることのない手で植えられた。麹菌は人類文明より古い生物。深い時間を飲んでいる。',
    practiceEn: 'You cannot practice awe. You can only create the conditions for it. Drink slowly. Drink with people you love. Drink sake that was made with sincerity. And one night — maybe tonight — the veil will thin, and you will feel what the ancient Shinto priests felt when they said sake was a gift from the gods.',
    practiceJa: '畏怖は練習できない。その条件を作ることしかできない。ゆっくり飲む。愛する人と飲む。誠実に造られた酒を飲む。そしてある夜——おそらく今宵——ヴェールが薄くなり、古代の神道の神官が酒は神からの贈り物と言ったときに感じたものを感じるだろう。',
    sakeConnectionEn: 'The kanji 畏 (i/osoreru) means both "awe" and "fear" — the same dual meaning as the English word "awesome" before it was diluted. True awe contains a tremor. When sake delivers this, you have touched something that no score, no rating, no review can capture.',
    sakeConnectionJa: '畏という漢字は「畏れ」と「恐れ」の両方を意味する。真の畏怖には震えが含まれる。酒がこれを届けたとき、どんな点数も、評価も、レビューも捉えられない何かに触れている。',
    color: 'oklch(0.45 0.12 300)',
    symbol: '✨',
  },
  {
    id: 7,
    nameEn: 'The Realm of Return',
    nameJa: '帰還の境地',
    kanji: '帰',
    subtitleEn: 'Kikan — Where you come home different',
    subtitleJa: '帰還——変わって帰る場所',
    descriptionEn: 'Every sacred journey must end with a return. The evening closes. The last cup is drained. You step back into the ordinary world — but you are not the same person who sat down. Naorai means "to return to the ordinary together." The key word is "together." You carry the evening in your cells. The sake, the laughter, the silence, the gods at the table — all of it lives in you now.',
    descriptionJa: 'すべての聖なる旅は帰還で終わらねばならない。夜が閉じる。最後の杯が空になる。日常の世界に戻る——しかし座った時の同じ人間ではない。直会は「共に日常に戻る」を意味する。鍵は「共に」。夜を細胞に運ぶ。酒、笑い、沈黙、食卓の神々——すべてが今、あなたの中に生きている。',
    practiceEn: 'After your last sip, sit for one more minute. Do not check your phone. Do not stand up immediately. Let the transition happen. You are crossing back from the sacred to the profane, and that crossing deserves a moment of stillness.',
    practiceJa: '最後の一口の後、もう一分座る。スマートフォンを見ない。すぐに立たない。移行を起こさせる。聖なるものから俗なるものへ戻る途中であり、その横断は静寂の一瞬に値する。',
    sakeConnectionEn: 'In Shinto, the torii gate marks the boundary between sacred and profane. You pass through it twice — entering and leaving. The sake evening is the same: you enter through the first sip and leave through the last. What happens between the gates is not entertainment. It is transformation.',
    sakeConnectionJa: '神道では鳥居が聖と俗の境界を示す。二度くぐる——入るときと出るとき。酒の夜も同じ：初口でくぐり、最後の一口で出る。門の間で起こることは娯楽ではない。変容である。',
    color: 'oklch(0.70 0.10 120)',
    symbol: '🏠',
  },
];

// ─── SACRED CEREMONIES ─────────────────────────────────────────

export interface SacredCeremony {
  nameEn: string;
  nameJa: string;
  kanji: string;
  descriptionEn: string;
  descriptionJa: string;
  significanceEn: string;
  significanceJa: string;
}

export const sacredCeremonies: SacredCeremony[] = [
  {
    nameEn: 'San-San-Kudo',
    nameJa: '三三九度',
    kanji: '婚',
    descriptionEn: 'The wedding ceremony of three cups, three sips each. Three stacked sakazuki represent past, present, and future — or heaven, earth, and humankind. The couple alternates sipping, transcending the three human flaws through the sacred number nine.',
    descriptionJa: '三つの杯、各三口の婚礼の儀。重ねた三つの盃は過去・現在・未来、あるいは天・地・人を表す。夫婦が交互に啜り、聖なる数字九を通して三つの人間の欠点を超越する。',
    significanceEn: 'The number 9 (3×3) is considered the most auspicious in Japanese numerology. By drinking nine sips, the couple creates an unbreakable bond blessed by the kami.',
    significanceJa: '数字の九（三×三）は日本の数秘術で最も吉兆とされる。九口飲むことで、夫婦は神に祝福された不壊の絆を作る。',
  },
  {
    nameEn: 'Kagami Biraki',
    nameJa: '鏡開き',
    kanji: '鏡',
    descriptionEn: 'Breaking open a sake barrel with wooden mallets. The lid is called "kagami" (mirror) because it reflects the soul of the gathering. On the third call of "Yoisho!" the barrel cracks open, releasing sake and good fortune into the world.',
    descriptionJa: '木槌で酒樽を割り開く。蓋は「鏡」と呼ばれる——集いの魂を映すから。三度目の「よいしょ！」で樽が割れ、酒と幸運が世に放たれる。',
    significanceEn: 'The mirror (kagami) in Shinto is one of the three imperial regalia, representing truth and wisdom. To break it open is to release hidden truth into the community.',
    significanceJa: '鏡は神道の三種の神器の一つで、真実と知恵を表す。割り開くことは、隠された真実を共同体に解き放つこと。',
  },
  {
    nameEn: 'Niinamesai',
    nameJa: '新嘗祭',
    kanji: '嘗',
    descriptionEn: 'The Emperor\'s most difficult ritual. Every November, the Emperor clad in ancient robes conducts offerings of new rice and sake to the gods over two days, praying for the divine protection of the people. The most extensive naorai in existence.',
    descriptionJa: '天皇の最も困難な儀式。毎年十一月、古代の衣に身を包んだ天皇が二日間にわたり新米と酒を神々に捧げ、国民の神護を祈る。現存する最も大規模な直会。',
    significanceEn: 'Abolished by MacArthur during the American Occupation, it continues privately within the Imperial Palace — a thread of sacred sake tradition unbroken for over a thousand years.',
    significanceJa: 'アメリカ占領下でマッカーサーにより廃止されたが、皇居内で私的に続けられている——千年以上途切れない神聖な酒の伝統の糸。',
  },
  {
    nameEn: 'Otoso',
    nameJa: 'お屠蘇',
    kanji: '屠',
    descriptionEn: 'New Year\'s medicinal sake infused with herbs. Consumed on the morning of January 1st, from youngest to oldest family member. The characters mean "slay evil spirits" and "revive" — a liquid exorcism that resets the year.',
    descriptionJa: '薬草を浸した正月の薬酒。元旦の朝、家族の最年少から最年長の順に飲む。文字は「邪気を屠り」「蘇る」を意味する——年を再起動する液体の祓い。',
    significanceEn: 'Drinking from youngest to oldest ensures the vitality of youth is shared upward through the generations — a liquid chain of life force.',
    significanceJa: '最年少から最年長の順に飲むことで、若さの活力が世代を通じて上へ共有される——生命力の液体の連鎖。',
  },
  {
    nameEn: 'Kuchikami no Sake',
    nameJa: '口噛み酒',
    kanji: '噛',
    descriptionEn: 'The most ancient form of sake. Shrine maidens (miko) chewed rice to release enzymes from their saliva, then spat it into vessels to ferment. The miko\'s body was the brewery. Her saliva was the koji. This was considered divine intervention — the first sake was made by women, through their bodies, as an offering to gods.',
    descriptionJa: '最も古い形の酒。巫女が米を噛んで唾液の酵素を放出し、器に吐いて発酵させた。巫女の身体が蔵だった。唾液が麹だった。これは神の介入とされた——最初の酒は女性が、身体を通して、神への供物として造った。',
    significanceEn: 'This origin story reframes sake as fundamentally feminine and sacred — born not from technology but from the human body itself, offered not for pleasure but for communion with the divine.',
    significanceJa: 'この起源の物語は酒を根本的に女性的で神聖なものとして再構成する——技術からではなく人体そのものから生まれ、快楽のためではなく神との交わりのために捧げられた。',
  },
];

// ─── SEASONAL VIEWING RITUALS ──────────────────────────────────

export interface ViewingRitual {
  nameEn: string;
  nameJa: string;
  kanji: string;
  seasonEn: string;
  seasonJa: string;
  descriptionEn: string;
  descriptionJa: string;
  sakeStyleEn: string;
  sakeStyleJa: string;
}

export const viewingRituals: ViewingRitual[] = [
  {
    nameEn: 'Hanami-zake',
    nameJa: '花見酒',
    kanji: '花',
    seasonEn: 'Spring — Cherry Blossom',
    seasonJa: '春——桜',
    descriptionEn: 'Drinking under falling cherry blossoms. The petals land in your cup. You drink them. The impermanence of the blossoms mirrors the impermanence of the moment — and the sake makes that impermanence beautiful rather than sad.',
    descriptionJa: '散る桜の下で飲む。花びらが杯に落ちる。それを飲む。花の無常はこの瞬間の無常を映す——酒はその無常を悲しみではなく美しさに変える。',
    sakeStyleEn: 'Fresh namazake or hana-fubuki (flower blizzard) seasonal releases. Light, floral, ephemeral.',
    sakeStyleJa: '新鮮な生酒や花吹雪の季節限定酒。軽く、花のように、儚く。',
  },
  {
    nameEn: 'Tsukimi-zake',
    nameJa: '月見酒',
    kanji: '月',
    seasonEn: 'Autumn — Full Moon',
    seasonJa: '秋——満月',
    descriptionEn: 'Drinking while gazing at the harvest moon. The moon\'s reflection in your sake cup creates a second moon — you drink the sky. This is the most contemplative of the viewing rituals, practiced in silence or with minimal conversation.',
    descriptionJa: '中秋の名月を眺めながら飲む。杯に映る月がもう一つの月を作る——空を飲む。観賞の儀式の中で最も瞑想的で、沈黙か最小限の会話で行われる。',
    sakeStyleEn: 'Hiyaoroshi — once-pasteurized autumn sake with deepened umami. Warm it gently to mirror the moon\'s golden glow.',
    sakeStyleJa: 'ひやおろし——一度火入れの秋酒、深まった旨味。月の金色の輝きを映すように穏やかに温める。',
  },
  {
    nameEn: 'Yukimi-zake',
    nameJa: '雪見酒',
    kanji: '雪',
    seasonEn: 'Winter — Snowfall',
    seasonJa: '冬——降雪',
    descriptionEn: 'Drinking while watching snow fall. The ultimate in stillness. Hot sake in a thick ceramic cup, the steam rising to meet the falling flakes. Inside and outside merge. Warmth and cold become one sensation.',
    descriptionJa: '雪が降るのを眺めながら飲む。究極の静寂。厚手の陶器の杯に熱燗、湯気が舞い落ちる雪片に出会う。内と外が融合する。温かさと冷たさが一つの感覚になる。',
    sakeStyleEn: 'Full-bodied junmai warmed to atsukan (50°C). The heat is not luxury — it is survival made beautiful.',
    sakeStyleJa: 'フルボディの純米を熱燗（50°C）に。熱は贅沢ではない——美しくなった生存。',
  },
  {
    nameEn: 'Momijigari-zake',
    nameJa: '紅葉狩り酒',
    kanji: '紅',
    seasonEn: 'Late Autumn — Red Leaves',
    seasonJa: '晩秋——紅葉',
    descriptionEn: 'Drinking among the burning maples. Where hanami celebrates birth and renewal, momijigari celebrates the beauty of decline. The leaves are most beautiful at the moment of death. So is the sake — aged koshu, amber and complex, carrying the weight of time.',
    descriptionJa: '燃える紅葉の中で飲む。花見が誕生と再生を祝うなら、紅葉狩りは衰退の美を祝う。葉は死の瞬間に最も美しい。酒もまた——琥珀色で複雑な古酒、時の重みを運ぶ。',
    sakeStyleEn: 'Aged koshu or rich yamahai. Something with depth and melancholy. The sake equivalent of a cello.',
    sakeStyleJa: '熟成古酒や豊かな山廃。深みと哀愁のあるもの。チェロに相当する酒。',
  },
];
