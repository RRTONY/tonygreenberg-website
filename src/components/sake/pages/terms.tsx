"use client";

import { AlertTriangle, Eye, FileText, Globe, Scale, Shield } from "lucide-react";
import { useLanguage } from "@/components/sake/sake-providers";

// Ported from the Sake app's client/src/pages/Terms.tsx (2026-11-26), which the app also showed at
// /privacy and /dmca (so do /sake/privacy and /sake/dmca; their canonical points at /sake/terms):
// the header, the six legal sections and the bottom notice, word for word. The app's per-look
// colors are literal class pairs (Austere value behind `[.sake-austere_&]:`).
// Changed: "Last updated" showed the visitor's current year (new Date()), which would also make the
// server and browser disagree around New Year; it is the year the terms were written, 2026, the same
// year as the copyright notice.

const year = 2026;
const ACCENT = "text-[oklch(0.78_0.12_85)] [.sake-austere_&]:text-[oklch(0.52_0.19_30)]";
const FG = "text-[oklch(0.9_0.01_85)] [.sake-austere_&]:text-[oklch(0.25_0.01_60)]";
const MUTED = "text-[oklch(0.6_0.02_270)] [.sake-austere_&]:text-[oklch(0.5_0.008_60)]";

export function SakeTerms() {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Shield,
      title: t('Intellectual Property Rights', '知的財産権'),
      content: t(
        `All content on Sake for Sake's Sake™ — including but not limited to text, images, photography, design elements, the EXV™ (Experience Value) scoring system, the seven-dimension soul print methodology, data compilations, and all original editorial content — is the exclusive intellectual property of Sake for Sake's Sake™ and is protected under international copyright, trademark, and intellectual property law.\n\nThe EXV™ scoring system, including its seven dimensions (Impact/衝撃, Resonance/余韻, Story/物語, Ephemerality/儚さ, Place/場所, Harmony/調和, Awe/畏怖), its heptagonal visualization methodology, and its six-tier classification system (KAMI through HAJIME), is a proprietary framework. Any reproduction, adaptation, or derivative work based on this system without express written permission constitutes infringement.`,
        `Sake for Sake's Sake™のすべてのコンテンツ — テキスト、画像、写真、デザイン要素、EXV™（体験価値）スコアリングシステム、七次元ソウルプリント方法論、データ編集、およびすべてのオリジナル編集コンテンツを含むがこれに限定されない — は、Sake for Sake's Sake™の独占的知的財産であり、国際著作権法、商標法、および知的財産法により保護されています。\n\nEXV™スコアリングシステム — その七つの次元（衝撃、余韻、物語、儚さ、場所、調和、畏怖）、七角形の可視化方法論、および六段階の分類システム（神から始まで）を含む — は独自のフレームワークです。書面による明示的な許可なくこのシステムを複製、翻案、または派生作品を作成することは侵害に該当します。`
      ),
    },
    {
      icon: AlertTriangle,
      title: t('Prohibited Activities', '禁止事項'),
      content: t(
        `The following activities are strictly prohibited without prior written authorization:\n\n• Automated scraping, crawling, or data extraction of any content\n• Reproduction or redistribution of the EXV™ scoring system or methodology\n• Creating derivative works, competing products, or "inspired by" systems based on our proprietary frameworks\n• Using AI training tools, language models, or machine learning systems to ingest, learn from, or reproduce our content\n• Screen scraping, web harvesting, or systematic downloading of pages\n• Mirroring, framing, or embedding our content on external sites\n• Commercial use of any content without a licensing agreement\n• Removing, altering, or obscuring any copyright, trademark, or attribution notices\n\nViolation of these terms may result in legal action including injunctive relief, statutory damages, and recovery of legal fees.`,
        `以下の活動は、事前の書面による承認なしに厳禁です：\n\n• コンテンツの自動スクレイピング、クローリング、またはデータ抽出\n• EXV™スコアリングシステムまたは方法論の複製または再配布\n• 当社の独自フレームワークに基づく派生作品、競合製品、または「インスパイア」システムの作成\n• AIトレーニングツール、言語モデル、または機械学習システムを使用して当社のコンテンツを取り込み、学習、または再現すること\n• スクリーンスクレイピング、ウェブハーベスティング、またはページの体系的なダウンロード\n• 外部サイトでの当社コンテンツのミラーリング、フレーミング、または埋め込み\n• ライセンス契約なしのコンテンツの商業利用\n• 著作権、商標、または帰属表示の削除、変更、または隠蔽\n\nこれらの条件に違反した場合、差止命令、法定損害賠償、および弁護士費用の回収を含む法的措置が取られる場合があります。`
      ),
    },
    {
      icon: Eye,
      title: t('Monitoring & Enforcement', '監視と執行'),
      content: t(
        `We actively monitor for unauthorized use of our content and intellectual property using automated detection systems. This includes:\n\n• Digital fingerprinting of original content and images\n• Automated detection of scraped or reproduced content across the web\n• Monitoring of competing platforms for derivative works\n• DMCA takedown procedures for infringing content\n• Cooperation with search engines to de-index infringing copies\n\nIf you discover unauthorized use of our content, please report it to our DMCA agent.`,
        `当社は、自動検出システムを使用して、コンテンツおよび知的財産の不正使用を積極的に監視しています。これには以下が含まれます：\n\n• オリジナルコンテンツおよび画像のデジタルフィンガープリンティング\n• ウェブ全体でのスクレイピングまたは複製されたコンテンツの自動検出\n• 派生作品に対する競合プラットフォームの監視\n• 侵害コンテンツに対するDMCAテイクダウン手続き\n• 侵害コピーのインデックス解除のための検索エンジンとの協力\n\n当社コンテンツの不正使用を発見された場合は、DMCAエージェントにご報告ください。`
      ),
    },
    {
      icon: Globe,
      title: t('Permitted Sharing', '許可された共有'),
      content: t(
        `We encourage and welcome the following activities:\n\n• Sharing links to our pages on social media with proper attribution\n• Brief quotations (under 100 words) with clear attribution and a link back to the source page\n• Personal, non-commercial discussion of our content in blogs, reviews, or social media posts\n• Producers and breweries sharing their own profiles and listings from our platform\n• Educational use in academic settings with proper citation\n\nFor commercial licensing, media inquiries, or partnership proposals, please contact us through the Producer Portal.`,
        `以下の活動を奨励し歓迎します：\n\n• 適切な帰属表示を伴うソーシャルメディアでのページリンクの共有\n• 明確な帰属表示とソースページへのリンクバックを伴う短い引用（100語以下）\n• ブログ、レビュー、またはソーシャルメディア投稿での個人的、非商業的なコンテンツの議論\n• 当社プラットフォームからの自社プロフィールおよびリスティングの生産者および醸造所による共有\n• 適切な引用を伴う学術環境での教育的使用\n\n商業ライセンス、メディアの問い合わせ、またはパートナーシップの提案については、プロデューサーポータルからお問い合わせください。`
      ),
    },
    {
      icon: Scale,
      title: t('Trademarks', '商標'),
      content: t(
        `The following are trademarks or pending trademarks of Sake for Sake's Sake™:\n\n• "Sake for Sake's Sake" and the 酒 logo mark\n• "EXV" and "Experience Value" scoring system\n• The seven-dimension soul print heptagonal visualization\n• The six-tier classification: KAMI (神), IKIGAI (生甲斐), MIYABI (雅), SHIBUI (渋い), TANOSHII (楽), HAJIME (始)\n• "Kintsugi Noir" design system\n• "Liquid Alchemy" as applied to sake nutrition content\n• "Ichi-go Ichi-e Pairing Engine"\n\nThese marks may not be used in connection with any product or service that is not affiliated with Sake for Sake's Sake™, in any manner that is likely to cause confusion, or in any manner that disparages or discredits the brand.`,
        `以下はSake for Sake's Sake™の商標または出願中の商標です：\n\n• 「Sake for Sake's Sake」および酒のロゴマーク\n• 「EXV」および「Experience Value」スコアリングシステム\n• 七次元ソウルプリント七角形の可視化\n• 六段階の分類：神（KAMI）、生甲斐（IKIGAI）、雅（MIYABI）、渋い（SHIBUI）、楽（TANOSHII）、始（HAJIME）\n• 「Kintsugi Noir」デザインシステム\n• 日本酒の栄養コンテンツに適用される「Liquid Alchemy」\n• 「一期一会ペアリングエンジン」\n\nこれらのマークは、Sake for Sake's Sake™と提携していない製品またはサービスに関連して、混乱を引き起こす可能性のある方法で、またはブランドを中傷または信用を損なう方法で使用することはできません。`
      ),
    },
    {
      icon: FileText,
      title: t('DMCA Policy', 'DMCAポリシー'),
      content: t(
        `We respect intellectual property rights and expect the same from others. If you believe your copyrighted work has been used on our site in a way that constitutes infringement, please provide:\n\n1. Identification of the copyrighted work\n2. Identification of the infringing material and its location on our site\n3. Your contact information\n4. A statement of good faith belief\n5. A statement of accuracy under penalty of perjury\n6. Your physical or electronic signature\n\nSimilarly, if you discover our content being used without authorization on another platform, we appreciate reports to help us enforce our rights.`,
        `当社は知的財産権を尊重し、他者にも同様のことを期待します。当社サイトであなたの著作物が侵害を構成する方法で使用されていると思われる場合は、以下をご提供ください：\n\n1. 著作物の特定\n2. 侵害素材およびサイト上の場所の特定\n3. 連絡先情報\n4. 善意の信念の声明\n5. 偽証罪の下での正確性の声明\n6. 物理的または電子的署名\n\n同様に、当社のコンテンツが別のプラットフォームで無断使用されていることを発見された場合、権利の執行にご協力いただけると幸いです。`
      ),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 transition-colors duration-700 bg-[oklch(0.08_0.02_270)] [.sake-austere_&]:bg-[oklch(0.96_0.005_80)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield aria-hidden="true" size={24} className={ACCENT} />
            <span className={`text-[10px] tracking-[0.3em] uppercase ${ACCENT}`}>{t("Legal Protection", "法的保護")}</span>
          </div>
          <h1 className={`font-sk-display text-3xl sm:text-4xl font-bold [.sake-austere_&]:font-light tracking-wider mb-4 ${FG}`}>
            {t("Terms of Use", "利用規約")}
          </h1>
          <p className={`text-sm ${MUTED}`}>
            {t(
              `Last updated: ${year}. These terms govern your use of Sake for Sake's Sake™.`,
              `最終更新：${year}年。これらの規約はSake for Sake's Sake™の利用を規定します。`,
            )}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="p-6 sm:p-8 border transition-colors duration-500 bg-[oklch(0.12_0.025_270)] border-[oklch(0.78_0.12_85/0.15)] [.sake-austere_&]:bg-[oklch(0.93_0.006_80)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <section.icon aria-hidden="true" size={18} className={ACCENT} />
                <h2 className={`font-sk-display text-lg font-semibold [.sake-austere_&]:font-normal tracking-wider ${FG}`}>{section.title}</h2>
              </div>
              <div className={`text-sm leading-relaxed whitespace-pre-line ${MUTED}`}>{section.content}</div>
            </section>
          ))}
        </div>

        {/* Bottom notice */}
        <div className="mt-12 text-center">
          <p className={`text-[10px] tracking-wider ${MUTED}`}>
            © {year} Sake for Sake&apos;s Sake™. {t("All rights reserved worldwide.", "全世界の権利を保有。")}
          </p>
          <p className={`text-[9px] tracking-wider mt-2 ${MUTED}`}>
            {t(
              "EXV™, Kintsugi Noir™, and Liquid Alchemy™ are trademarks of Sake for Sake's Sake™.",
              "EXV™、Kintsugi Noir™、およびLiquid Alchemy™はSake for Sake's Sake™の商標です。",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
