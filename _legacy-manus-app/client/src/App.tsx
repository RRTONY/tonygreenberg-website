import { Toaster } from "@/components/ui/sonner";
import { ContentProtection } from "@/components/ContentProtection";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import React, { Suspense, useEffect, useRef } from "react";
import { useAuth } from "./_core/hooks/useAuth";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import WhereNext from "./components/WhereNext";
import { ExitIntentPopup, FloatingPrompt, AnalyticsTracker } from "./components/ConversionMechanics";
import { BehaviorOverlays } from "./components/BehaviorOverlays";
import { ReturnVisitorBanner } from "./components/CommitmentEscalation";
import StandaloneNav from "./components/StandaloneNav";

/* ── Eagerly loaded for instant first paint (homepage = blog) ── */
import Blog from "./pages/Blog";
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const StartHere = React.lazy(() => import("./pages/StartHere"));

/* ── Lazy-loaded pages (code-split) ── */
const Home = React.lazy(() => import("./pages/Home"));
const WalkThrough = React.lazy(() => import("./pages/WalkThrough"));
const Territory = React.lazy(() => import("./pages/Territory"));
const EngineRoom = React.lazy(() => import("./pages/EngineRoom"));
const UnderNDA = React.lazy(() => import("./pages/UnderNDA"));
const TheBody = React.lazy(() => import("./pages/TheBody"));
const Nightstand = React.lazy(() => import("./pages/Nightstand"));
const TheWeb = React.lazy(() => import("./pages/TheWeb"));
const PickUp = React.lazy(() => import("./pages/PickUp"));
const Journeys = React.lazy(() => import("./pages/Journeys"));
const Portfolio = React.lazy(() => import("./pages/Portfolio"));
const Intel = React.lazy(() => import("./pages/Intel"));
const ThoughtCloud = React.lazy(() => import("./pages/ThoughtCloud"));
const TheIndex = React.lazy(() => import("./pages/TheIndex"));
const About = React.lazy(() => import("./pages/About"));
const Speaking = React.lazy(() => import("./pages/Speaking"));
const Ecosystem = React.lazy(() => import("./pages/Ecosystem"));
// StartHere is eagerly loaded above to avoid lazy-loading issues
const Published = React.lazy(() => import("./pages/Published"));
const Clients = React.lazy(() => import("./pages/Clients"));
const Series = React.lazy(() => import("./pages/Series"));
const FauxTony = React.lazy(() => import("./pages/FauxTony"));
const LeadMagnet = React.lazy(() => import("./pages/LeadMagnet"));
const Spirits = React.lazy(() => import("./pages/Spirits"));
const Assessments = React.lazy(() => import("./pages/Assessments"));
const DharmaFinder = React.lazy(() => import("./pages/DharmaFinder"));
const ConsciousnessScale = React.lazy(() => import("./pages/ConsciousnessScale"));
const GrantStudy = React.lazy(() => import("./pages/GrantStudy"));
const Manifesto = React.lazy(() => import("./pages/Manifesto"));
const AkbarEssay = React.lazy(() => import("./pages/AkbarEssay"));
const HumanosHome = React.lazy(() => import("./pages/humanos/HumanosHome"));
const HumanosPhilosophy = React.lazy(() => import("./pages/humanos/HumanosPhilosophy"));
const HumanosEcosystem = React.lazy(() => import("./pages/humanos/HumanosEcosystem"));
const HumanosResources = React.lazy(() => import("./pages/humanos/HumanosResources"));
const HumanosConnect = React.lazy(() => import("./pages/humanos/HumanosConnect"));
const HumanosPathToHere = React.lazy(() => import("./pages/humanos/HumanosPathToHere"));
const Community = React.lazy(() => import("./pages/Community"));
const JourneyFinder = React.lazy(() => import("./pages/JourneyFinder"));
const LifeAssessment = React.lazy(() => import("./pages/LifeAssessment"));
const FindYourMe = React.lazy(() => import("./pages/FindYourMe"));
const FindYourTherapy = React.lazy(() => import("./pages/FindYourTherapy"));
const FindYourSake = React.lazy(() => import("./pages/FindYourSake"));
const EcosystemMap = React.lazy(() => import("./pages/EcosystemMap"));
const FindYourSpirit = React.lazy(() => import("./pages/FindYourSpirit"));
const FindYourReligion = React.lazy(() => import("./pages/FindYourReligion"));
const MyJourney = React.lazy(() => import("./pages/MyJourney"));
const FindYourDiet = React.lazy(() => import("./pages/FindYourDiet"));
const FindYourMovement = React.lazy(() => import("./pages/FindYourMovement"));
const FindYourSleep = React.lazy(() => import("./pages/FindYourSleep"));
const FindYourCoffee = React.lazy(() => import("./pages/FindYourCoffee"));
const FindYourKitchen = React.lazy(() => import("./pages/FindYourKitchen"));
const FindYourStyle = React.lazy(() => import("./pages/FindYourStyle"));
const FindYourAttachmentStyle = React.lazy(() => import("./pages/FindYourAttachmentStyle"));
const FindYourLoveLanguage = React.lazy(() => import("./pages/FindYourLoveLanguage"));
const FindYourPeptide = React.lazy(() => import("./pages/FindYourPeptide"));
const PeptideHallOfShame = React.lazy(() => import("./pages/PeptideHallOfShame"));
const PeptideSupplyChain = React.lazy(() => import("./pages/PeptideSupplyChain"));
const PeptideMatrix = React.lazy(() => import("./pages/PeptideMatrix"));
const PeptideQuiz25 = React.lazy(() => import("./pages/PeptideQuiz25"));
const PeptideWatch = React.lazy(() => import("./pages/PeptideWatch"));
const RipPeptideSciences = React.lazy(() => import("./pages/RipPeptideSciences"));
const WhatsLegal = React.lazy(() => import("./pages/WhatsLegal"));
const VerifyYourCoa = React.lazy(() => import("./pages/VerifyYourCoa"));
const PriceTracker = React.lazy(() => import("./pages/PriceTracker"));
const TestYourPeptides = React.lazy(() => import("./pages/TestYourPeptides"));
const PeptideLibrary = React.lazy(() => import("./pages/PeptideLibrary"));
const FindYourSexuality = React.lazy(() => import("./pages/FindYourSexuality"));
const SelfPortrait = React.lazy(() => import("./pages/SelfPortrait"));
const FindMyHub = React.lazy(() => import("./pages/FindMyHub"));
const FlowCircuit = React.lazy(() => import("./pages/FlowCircuit"));
const ClockKeeperPartII = React.lazy(() => import("./pages/ClockKeeperPartII"));
const AdminClockKeeperResponses = React.lazy(() => import("./pages/AdminClockKeeperResponses"));
const AdminAssessments = React.lazy(() => import("./pages/AdminAssessments"));
const AdminSpamTracking = React.lazy(() => import("./pages/AdminSpamTracking"));
const AdminSpamLink = React.lazy(() => import("./pages/AdminSpamLink"));
const AdminComments = React.lazy(() => import("./pages/AdminComments"));
const AdminCanon = React.lazy(() => import("./pages/AdminCanon"));
const Engage = React.lazy(() => import("./pages/Engage"));
const Amplifier = React.lazy(() => import("./pages/Amplifier"));
const DiamondCut = React.lazy(() => import("./pages/DiamondCut"));
const Invest = React.lazy(() => import("./pages/Invest"));
const Shop = React.lazy(() => import("./pages/Shop"));
const Subscribe = React.lazy(() => import("./pages/Subscribe"));
const CharityScorecard = React.lazy(() => import("./pages/CharityScorecard"));
const CharityProfile = React.lazy(() => import("./pages/CharityProfile"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = React.lazy(() => import("./pages/PaymentCancel"));
const VendorIntakeForm = React.lazy(() => import("./pages/VendorIntakeForm")); // legacy — kept for redirect route
const VendorIntakeLong = React.lazy(() => import("./pages/VendorIntakeLong"));
const SupplierIntakeForm = React.lazy(() => import("./pages/SupplierIntakeForm"));
const SupplierIntakeLong = React.lazy(() => import("./pages/SupplierIntakeLong"));
const SoulScore = React.lazy(() => import("./pages/SoulScore"));
const ImpactDashboard = React.lazy(() => import("./pages/ImpactDashboard"));
const ThesisThreads = React.lazy(() => import("./pages/ThesisThreads"));
const PsychedelicReadinessIndex = React.lazy(() => import("./pages/pri/PsychedelicReadinessIndex"));
const MescalineDeepDive = React.lazy(() => import("./pages/pri/MescalineDeepDive"));
const IbogaDeepDive = React.lazy(() => import("./pages/pri/IbogaDeepDive"));
const IbogaCompassAssessment = React.lazy(() => import("./pages/pri/IbogaCompassAssessment"));
const PriCalibration = React.lazy(() => import("./pages/pri/PriCalibration"));
const PriEfficacy = React.lazy(() => import("./pages/pri/PriEfficacy"));
const PriResearch = React.lazy(() => import("./pages/pri/PriResearch"));
const FacilitatorIndex = React.lazy(() => import("./pages/pri/FacilitatorIndex"));
const FriendGatePage = React.lazy(() => import("./pages/FriendGate"));
const FriendSurvey = React.lazy(() => import("./pages/FriendSurvey"));
const SkippyMap = React.lazy(() => import("./pages/SkippyMap"));
const PostIntervention = React.lazy(() => import("./pages/PostIntervention"));
const MedicineSequencing = React.lazy(() => import("./pages/MedicineSequencing"));
const ThePhilosophy = React.lazy(() => import("./pages/ThePhilosophy"));
const Articles = React.lazy(() => import("./pages/Articles"));
const ImpactFuturism = React.lazy(() => import("./pages/ImpactFuturism"));
const CheshireGrin = React.lazy(() => import("./pages/CheshireGrin"));
const AnalyticsDashboard = React.lazy(() => import("./pages/AnalyticsDashboard"));
const ProtectingYourBusiness = React.lazy(() => import("./pages/ProtectingYourBusiness"));

/* ── Behavioral architecture pages ── */
const Assessment = React.lazy(() => import("./pages/Assessment"));
const PathPage = React.lazy(() => import("./pages/PathPage"));
const Essays = React.lazy(() => import("./pages/Essays"));

/* ── BrewSoul pages ── */
const BrewSoulWelcome = React.lazy(() => import("./pages/brewsoul/BrewSoulWelcome"));
const BrewSoulHome = React.lazy(() => import("./pages/brewsoul/BrewSoulHome"));
const BrewSoulBrowse = React.lazy(() => import("./pages/brewsoul/BrewSoulBrowse"));
const BrewSoulDetail = React.lazy(() => import("./pages/brewsoul/BrewSoulDetail"));
const BrewSoulQuiz = React.lazy(() => import("./pages/brewsoul/BrewSoulQuiz"));
const BrewSoulContent = React.lazy(() => import("./pages/brewsoul/BrewSoulContent").then(m => ({ default: m.BrewSoulShame })));
const BrewSoulDollar = React.lazy(() => import("./pages/brewsoul/BrewSoulContent").then(m => ({ default: m.BrewSoulDollar })));
const BrewSoulHealth = React.lazy(() => import("./pages/brewsoul/BrewSoulHealthFull"));
const BrewSoulFarms = React.lazy(() => import("./pages/brewsoul/BrewSoulContent").then(m => ({ default: m.BrewSoulFarms })));
const BrewSoulMoldFree = React.lazy(() => import("./pages/brewsoul/BrewSoulContent").then(m => ({ default: m.BrewSoulMoldFree })));
const BrewSoulExperiences = React.lazy(() => import("./pages/brewsoul/BrewSoulContent").then(m => ({ default: m.BrewSoulExperiences })));
const BrewSoulVarieties = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulVarieties })));
const BrewSoulProcessing = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulProcessing })));
const BrewSoulRoasters = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulRoasters })));
const BrewSoulGlossary = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulGlossary })));
const BrewSoulPairings = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulPairings })));
const BrewSoulEconomics = React.lazy(() => import("./pages/brewsoul/BrewSoulReference").then(m => ({ default: m.BrewSoulEconomics })));
const BrewSoulCompare = React.lazy(() => import("./pages/brewsoul/BrewSoulTools").then(m => ({ default: m.BrewSoulCompare })));
const BrewSoulBlendBuilder = React.lazy(() => import("./pages/brewsoul/BrewSoulTools").then(m => ({ default: m.BrewSoulBlendBuilder })));
const BrewSoulDrops = React.lazy(() => import("./pages/brewsoul/BrewSoulTools").then(m => ({ default: m.BrewSoulDrops })));
const BrewSoulCollection = React.lazy(() => import("./pages/brewsoul/BrewSoulTools").then(m => ({ default: m.BrewSoulCollection })));
const BrewSoulSubmit = React.lazy(() => import("./pages/brewsoul/BrewSoulTools").then(m => ({ default: m.BrewSoulSubmit })));
const BrewSoulPrescription = React.lazy(() => import("./pages/brewsoul/BrewSoulPrescriptionFull"));
const BrewSoulChains = React.lazy(() => import("./pages/brewsoul/BrewSoulChains"));
const FirstSip = React.lazy(() => import("./pages/brewsoul/FirstSip"));
const BrewSoulBiodynamic = React.lazy(() => import("./pages/brewsoul/BrewSoulBiodynamic"));
const BrewSoulDecaf = React.lazy(() => import("./pages/brewsoul/BrewSoulDecaf"));
const BrewSoulEsoteric = React.lazy(() => import("./pages/brewsoul/BrewSoulEsoteric"));
const BrewSoulCities = React.lazy(() => import("./pages/brewsoul/BrewSoulCities"));
const BrewSoulDirectory = React.lazy(() => import("./pages/brewsoul/BrewSoulDirectory"));
const BrewSoulCityDetail = React.lazy(() => import("./pages/brewsoul/BrewSoulCityDetail"));
const GuestSeriesIndex = React.lazy(() => import("./pages/brewsoul/GuestSeriesIndex"));
const GuestShanitaNicholas = React.lazy(() => import("./pages/brewsoul/GuestShanitaNicholas"));

/* ── Kava Encyclopedia pages ── */
const KavaHome = React.lazy(() => import("./pages/kava/KavaHome"));
const KavaOrigins = React.lazy(() => import("./pages/kava/KavaOrigins"));
const KavaInteractions = React.lazy(() => import("./pages/kava/KavaInteractions"));
const KavaScience = React.lazy(() => import("./pages/kava/KavaScience"));
const KavaAssessment = React.lazy(() => import("./pages/kava/KavaAssessment"));
const KavaHawaii = React.lazy(() => import("./pages/kava/KavaHawaii"));
const KavaMyths = React.lazy(() => import("./pages/kava/KavaMyths"));
const KavaCaffeine = React.lazy(() => import("./pages/kava/KavaCaffeine"));
const KavaProducts = React.lazy(() => import("./pages/kava/KavaProducts"));
const KavaCertification = React.lazy(() => import("./pages/kava/KavaCertification"));

/* ── Attention Theft Manifesto pages ── */
const AttentionTheft = React.lazy(() => import("./pages/manifesto/AttentionTheft"));
const ManifestoRedirect = React.lazy(() => import("./pages/manifesto/ManifestoRedirect"));
const YouveBeenReported = React.lazy(() => import("./pages/manifesto/YouveBeenReported"));
// Engagement features
const SharedChat = React.lazy(() => import("./pages/SharedChat"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const MyHighlights = React.lazy(() => import("./pages/MyHighlights"));
const MyReferrals = React.lazy(() => import("./pages/MyReferrals"));
const GuestEditor = React.lazy(() => import("./pages/GuestEditor"));
/* ── Standalone routes that render WITHOUT Layout/nav/footer/banners ── */
const STANDALONE_ROUTES = ["/edit/frqncy","/flow-circuit", "/search", "/living-declaration", "/manifesto", "/akbar", "/humanos", "/payment-success", "/payment-cancel", "/find-your-me", "/find-my-me", "/find-my-we", "/find-my-tribe", "/find-my-coffee", "/find-my-car", "/discover", "/find-your-therapy", "/find-your-sake", "/find-your-spirit", "/find-your-religion", "/ecosystem-map", "/my-journey", "/find-your-diet", "/find-your-movement", "/find-your-sleep", "/find-your-coffee", "/find-your-kitchen", "/find-your-style", "/find-your-attachment-style", "/find-your-love-language", "/find-your-peptide", "/find-your-sexuality", "/self-portrait", "/soulscore", "/impact-dashboard", "/thesis-threads", "/psychedelic-readiness-index", "/facilitator-index", "/pri-calibration", "/pri-efficacy", "/pri-research", "/peyote-mescaline", "/iboga-ibogaine", "/iboga-compass", "/peptide-watch", "/alex-azzi", "/cheshire-grin", "/analytics", "/brewsoul", "/brewsoul/cities", "/brewsoul/cities/", "/brewsoul/directory", "/brewsoul/guest", "/brewsoul/guest/shanita-nicholas", "/brewsoul/esoteric", "/kava", "/kava/origins", "/kava/interactions", "/kava/science", "/kava/assessment", "/kava/hawaii", "/kava/myths", "/kava/caffeine", "/kava/products", "/kava/certification", "/attention-theft", "/attention-theft/economics", "/attention-theft/blocker-finder", "/attention-theft/legal", "/attention-theft/weapons", "/attention-theft/report", "/youve-been-reported", "/spamtoast", "/admin/assessments", "/admin/spam-tracking", "/admin/spam-link", "/admin/comments", "/admin/canon", "/protecting-your-business", "/rip-peptide-sciences", "/whats-legal", "/verify-your-coa", "/price-tracker", "/test-your-peptides", "/peptide-library", "/find-my-attachment-style", "/find-my-sleep", "/find-my-movement", "/find-my-diet", "/find-my-peptide", "/find-my-therapy", "/find-my-spirit", "/find-my-sexuality", "/dharma-finder", "/consciousness-scale", "/grant-study", "/friend-gate", "/friend-survey", "/skippy", "/post-intervention", "/medicine-sequencing", "/the-philosophy", "/articles", "/impact-futurism"];

/* ── Minimal loading fallback ── */
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.85rem",
      color: "#999",
      letterSpacing: "0.1em",
    }}>
      Loading...
    </div>
  );
}

function GlobalAnalytics() {
  const [location] = useLocation();
  const slug = location.startsWith("/blog/") ? location.replace("/blog/", "") : undefined;
  return <AnalyticsTracker path={location} postSlug={slug} />;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("page-transition-enter");
    // Force reflow
    void el.offsetWidth;
    el.classList.add("page-transition-enter");
    window.scrollTo(0, 0);
  }, [location]);

  return <div ref={ref}>{children}</div>;
}

/* ── Standalone router — no Layout, no banners, no popups ── */
function StandaloneRouter() {
  return (
    <>
    <StandaloneNav />
    <div style={{ paddingTop: '52px' }}>
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/living-declaration" component={Manifesto} />
        <Route path="/manifesto">{() => { window.location.replace("/living-declaration"); return null; }}</Route>
        <Route path="/akbar" component={AkbarEssay} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/payment-cancel" component={PaymentCancel} />
        <Route path="/find-your-me" component={FindYourMe} />
        <Route path="/find-my-me" component={FindYourMe} />
        <Route path="/discover" component={FindYourMe} />
        <Route path="/find-your-therapy" component={FindYourTherapy} />
        <Route path="/find-your-sake" component={FindYourSake} />
        <Route path="/ecosystem-map" component={EcosystemMap} />
        <Route path="/find-your-spirit" component={FindYourSpirit} />
        <Route path="/find-your-religion" component={FindYourReligion} />
        <Route path="/my-journey" component={MyJourney} />
        <Route path="/find-your-diet" component={FindYourDiet} />
        <Route path="/find-your-movement" component={FindYourMovement} />
        <Route path="/find-your-sleep" component={FindYourSleep} />
        <Route path="/find-your-coffee" component={FindYourCoffee} />
        <Route path="/find-my-coffee" component={FindYourCoffee} />
        <Route path="/find-your-kitchen" component={FindYourKitchen} />
        <Route path="/find-your-style" component={FindYourStyle} />
        <Route path="/find-your-attachment-style" component={FindYourAttachmentStyle} />
        <Route path="/find-your-love-language" component={FindYourLoveLanguage} />
        <Route path="/find-your-peptide" component={FindYourPeptide} />
        <Route path="/find-your-sexuality" component={FindYourSexuality} />
        <Route path="/find-my-we" component={FindYourAttachmentStyle} />
        <Route path="/find-my-tribe" component={Community} />
        <Route path="/find-my-attachment-style" component={FindYourAttachmentStyle} />
        <Route path="/find-my-sleep" component={FindYourSleep} />
        <Route path="/find-my-movement" component={FindYourMovement} />
        <Route path="/find-my-diet" component={FindYourDiet} />
        <Route path="/find-my-peptide" component={FindYourPeptide} />
        <Route path="/find-my-therapy" component={FindYourTherapy} />
        <Route path="/find-my-spirit" component={FindYourSpirit} />
        <Route path="/find-my-sexuality" component={FindYourSexuality} />
        <Route path="/dharma-finder" component={DharmaFinder} />
        <Route path="/consciousness-scale" component={ConsciousnessScale} />
        <Route path="/grant-study" component={GrantStudy} />
        <Route path="/find-my" component={FindMyHub} />
        <Route path="/find-my-car">{() => {
          if (typeof window !== "undefined") window.location.replace("/find-my");
          return null;
        }}</Route>
        <Route path="/flow-circuit" component={FlowCircuit} />
        <Route path="/self-portrait" component={SelfPortrait} />
        <Route path="/soulscore" component={SoulScore} />
        <Route path="/impact-dashboard" component={ImpactDashboard} />
        <Route path="/thesis-threads" component={ThesisThreads} />
        <Route path="/psychedelic-readiness-index" component={PsychedelicReadinessIndex} />
        <Route path="/facilitator-index" component={FacilitatorIndex} />
        <Route path="/friend-gate" component={FriendGatePage} />
        <Route path="/friend-survey/:token" component={FriendSurvey} />
        <Route path="/skippy" component={SkippyMap} />
        <Route path="/medicine-sequencing" component={MedicineSequencing} />
        <Route path="/the-philosophy" component={ThePhilosophy} />
        <Route path="/articles" component={Articles} />
        <Route path="/impact-futurism" component={ImpactFuturism} />
        <Route path="/post-intervention" component={PostIntervention} />
        <Route path="/pri-calibration" component={PriCalibration} />
        <Route path="/pri-efficacy" component={PriEfficacy} />
        <Route path="/pri-research" component={PriResearch} />
        <Route path="/peyote-mescaline" component={MescalineDeepDive} />
        <Route path="/iboga-ibogaine" component={IbogaDeepDive} />
        <Route path="/iboga-compass" component={IbogaCompassAssessment} />
        <Route path="/alex-azzi" component={CheshireGrin} />
        <Route path="/cheshire-grin" component={CheshireGrin} />
        <Route path="/peptide-watch" component={PeptideWatch} />
        <Route path="/rip-peptide-sciences" component={RipPeptideSciences} />
        <Route path="/whats-legal" component={WhatsLegal} />
        <Route path="/verify-your-coa" component={VerifyYourCoa} />
        <Route path="/price-tracker" component={PriceTracker} />
        <Route path="/test-your-peptides" component={TestYourPeptides} />
        <Route path="/peptide-library" component={PeptideLibrary} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/search" component={SearchResults} />
        {/* BrewSoul */}
        <Route path="/brewsoul" component={BrewSoulWelcome} />
        <Route path="/brewsoul/first-sip" component={FirstSip} />
        <Route path="/brewsoul/home" component={BrewSoulHome} />
        <Route path="/brewsoul/browse" component={BrewSoulBrowse} />
        <Route path="/brewsoul/coffee/:id" component={BrewSoulDetail} />
        <Route path="/brewsoul/quiz" component={BrewSoulQuiz} />
        <Route path="/brewsoul/wall-of-shame" component={BrewSoulContent} />
        <Route path="/brewsoul/follow-the-dollar" component={BrewSoulDollar} />
        <Route path="/brewsoul/health" component={BrewSoulHealth} />
        <Route path="/brewsoul/farms" component={BrewSoulFarms} />
        <Route path="/brewsoul/mold-free" component={BrewSoulMoldFree} />
        <Route path="/brewsoul/experiences" component={BrewSoulExperiences} />
        <Route path="/brewsoul/varieties" component={BrewSoulVarieties} />
        <Route path="/brewsoul/processing" component={BrewSoulProcessing} />
        <Route path="/brewsoul/roasters" component={BrewSoulRoasters} />
        <Route path="/brewsoul/glossary" component={BrewSoulGlossary} />
        <Route path="/brewsoul/pairings" component={BrewSoulPairings} />
        <Route path="/brewsoul/economics" component={BrewSoulEconomics} />
        <Route path="/brewsoul/compare" component={BrewSoulCompare} />
        <Route path="/brewsoul/blend-builder" component={BrewSoulBlendBuilder} />
        <Route path="/brewsoul/drops" component={BrewSoulDrops} />
        <Route path="/brewsoul/collection" component={BrewSoulCollection} />
        <Route path="/brewsoul/submit" component={BrewSoulSubmit} />
        <Route path="/brewsoul/prescription" component={BrewSoulPrescription} />
        <Route path="/brewsoul/chains" component={BrewSoulChains} />
        <Route path="/brewsoul/biodynamic" component={BrewSoulBiodynamic} />
        <Route path="/brewsoul/decaf" component={BrewSoulDecaf} />
        <Route path="/brewsoul/esoteric" component={BrewSoulEsoteric} />
        <Route path="/brewsoul/cities/:slug" component={BrewSoulCityDetail} />
        <Route path="/brewsoul/directory" component={BrewSoulDirectory} />
        <Route path="/brewsoul/guest" component={GuestSeriesIndex} />
        <Route path="/brewsoul/guest/shanita-nicholas" component={GuestShanitaNicholas} />
        <Route path="/brewsoul/cities" component={BrewSoulCities} />
        {/* Kava Encyclopedia */}
        <Route path="/kava" component={KavaHome} />
        <Route path="/kava/origins" component={KavaOrigins} />
        <Route path="/kava/interactions" component={KavaInteractions} />
        <Route path="/kava/science" component={KavaScience} />
        <Route path="/kava/assessment" component={KavaAssessment} />
        <Route path="/kava/hawaii" component={KavaHawaii} />
        <Route path="/kava/myths" component={KavaMyths} />
        <Route path="/kava/caffeine" component={KavaCaffeine} />
        <Route path="/kava/products" component={KavaProducts} />
        <Route path="/kava/certification" component={KavaCertification} />
        {/* Attention Theft Manifesto — consolidated single page */}
        <Route path="/attention-theft" component={AttentionTheft} />
        {/* Legacy sub-routes redirect to consolidated page with anchor */}
        <Route path="/attention-theft/economics" component={ManifestoRedirect} />
        <Route path="/attention-theft/blocker-finder" component={ManifestoRedirect} />
        <Route path="/attention-theft/legal" component={ManifestoRedirect} />
        <Route path="/attention-theft/weapons" component={ManifestoRedirect} />
        <Route path="/attention-theft/report" component={ManifestoRedirect} />
        <Route path="/youve-been-reported" component={YouveBeenReported} />
        <Route path="/spamtoast">{() => { window.location.replace('/youve-been-reported' + window.location.search); return null; }}</Route>
        {/* Guest Editor */}
        <Route path="/edit/frqncy" component={GuestEditor} />
        {/* Admin */}
        <Route path="/admin/assessments" component={AdminAssessments} />
        <Route path="/admin/spam-tracking" component={AdminSpamTracking} />
        <Route path="/admin/spam-link" component={AdminSpamLink} />
        <Route path="/admin/comments" component={AdminComments} />
        <Route path="/admin/canon" component={AdminCanon} />
        <Route path="/protecting-your-business" component={ProtectingYourBusiness} />
      </Switch>
    </Suspense>
    <WhereNext isDark={false} />
    </div>
    </>
  );
}

/* ── Main site router — full Layout with nav, footer, banners ── */
function MainRouter() {
  return (
    <Layout>
      <ReturnVisitorBanner />
      <PageTransition>
      <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Blog} />
        <Route path="/the-letter" component={Home} />
        <Route path="/walk-through" component={WalkThrough} />
        <Route path="/the-territory" component={Territory} />
        <Route path="/engine-room" component={EngineRoom} />
        <Route path="/under-nda" component={UnderNDA} />
        <Route path="/the-body" component={TheBody} />
        <Route path="/the-nightstand" component={Nightstand} />
        <Route path="/the-web" component={TheWeb} />
        <Route path="/pick-up-the-phone" component={PickUp} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/journeys" component={Journeys} />
        <Route path="/recent-creations" component={Portfolio} />
        <Route path="/intel" component={Intel} />
        <Route path="/the-open-door" component={ThoughtCloud} />
        <Route path="/the-index" component={TheIndex} />
        <Route path="/about" component={About} />
        <Route path="/speaking" component={Speaking} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/start-here" component={StartHere} />
        <Route path="/published" component={Published} />
        <Route path="/clients" component={Clients} />
        <Route path="/series" component={Series} />
        <Route path="/fauxtony" component={FauxTony} />
        <Route path="/framework" component={LeadMagnet} />
        <Route path="/spirits" component={Spirits} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/assessments/dharma-finder" component={DharmaFinder} />
        <Route path="/assessments/consciousness-scale" component={ConsciousnessScale} />
        <Route path="/assessments/grant-study" component={GrantStudy} />
        <Route path="/flow-circuit" component={FlowCircuit} />
        <Route path="/find-my" component={FindMyHub} />
        <Route path="/find-my-we" component={FindYourAttachmentStyle} />
        <Route path="/find-my-tribe" component={Community} />
        <Route path="/find-my-car">{() => {
          if (typeof window !== "undefined") window.location.replace("/find-my");
          return null;
        }}</Route>
        <Route path="/find-my-attachment-style" component={FindYourAttachmentStyle} />
        <Route path="/find-my-sleep" component={FindYourSleep} />
        <Route path="/find-my-movement" component={FindYourMovement} />
        <Route path="/find-my-diet" component={FindYourDiet} />
        <Route path="/find-my-peptide" component={FindYourPeptide} />
        <Route path="/find-my-therapy" component={FindYourTherapy} />
        <Route path="/find-my-spirit" component={FindYourSpirit} />
        <Route path="/find-my-sexuality" component={FindYourSexuality} />
        <Route path="/dharma-finder" component={DharmaFinder} />
        <Route path="/consciousness-scale" component={ConsciousnessScale} />
        <Route path="/grant-study" component={GrantStudy} />
        <Route path="/peptide-hall-of-shame" component={PeptideHallOfShame} />
        <Route path="/peptide-supply-chain" component={PeptideSupplyChain} />
        <Route path="/peptide-matrix" component={PeptideMatrix} />
        <Route path="/quiz_25q" component={PeptideQuiz25} />
        <Route path="/peptide-watch" component={PeptideWatch} />
        <Route path="/living-declaration" component={Manifesto} />
        <Route path="/manifesto">{() => { window.location.replace("/living-declaration"); return null; }}</Route>
        <Route path="/clock-keeper-part-2" component={ClockKeeperPartII} />
        <Route path="/admin/clock-keeper-responses" component={AdminClockKeeperResponses} />
        <Route path="/admin/assessments" component={AdminAssessments} />
        <Route path="/admin/spam-tracking" component={AdminSpamTracking} />
        <Route path="/community" component={Community} />
        <Route path="/engage" component={Engage} />
        <Route path="/amplifier" component={Amplifier} />
        <Route path="/diamond-cut" component={DiamondCut} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/path/:archetype" component={PathPage} />
        <Route path="/essays" component={Essays} />
        <Route path="/invest" component={Invest} />
        <Route path="/shop" component={Shop} />
        <Route path="/subscribe" component={Subscribe} />
        <Route path="/charity-scorecard" component={CharityScorecard} />
        <Route path="/charity-scorecard/:slug" component={CharityProfile} />
        {/* Canonical supplier intake routes */}
        <Route path="/supplier-intake" component={SupplierIntakeForm} />
        <Route path="/supplier-intake-long/:token" component={SupplierIntakeLong} />
        <Route path="/supplier-intake-long" component={SupplierIntakeLong} />
        {/* Legacy vendor-intake routes — redirect to canonical supplier-intake */}
        <Route path="/vendor-intake">{() => { window.location.replace("/supplier-intake"); return null; }}</Route>
        <Route path="/vendor-intake-long">{() => { window.location.replace("/supplier-intake-long" + window.location.search); return null; }}</Route>
        <Route path="/find-your-journey" component={JourneyFinder} />
        <Route path="/life-assessment" component={LifeAssessment} />
        <Route path="/the-mirror" component={LifeAssessment} />
        <Route path="/shared-chat/:shareId" component={SharedChat} />
        <Route path="/my-highlights" component={MyHighlights} />
        <Route path="/my-impact" component={MyReferrals} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
      </PageTransition>
    </Layout>
  );
}

/* ── App shell — routes standalone pages outside Layout entirely ── */
function App() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(r => location === r || location.startsWith(r + "/"));
  const { isAuthenticated, logout } = useAuth();
  useSessionTimeout(isAuthenticated, logout);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <ContentProtection />
          {location === "/living-declaration" ? (
            <Suspense fallback={<PageLoader />}><Manifesto /></Suspense>
          ) : location.startsWith("/humanos") ? (
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/humanos" component={HumanosHome} />
                <Route path="/humanos/philosophy" component={HumanosPhilosophy} />
                <Route path="/humanos/ecosystem" component={HumanosEcosystem} />
                <Route path="/humanos/resources" component={HumanosResources} />
                <Route path="/humanos/connect" component={HumanosConnect} />
                <Route path="/humanos/path-to-here" component={HumanosPathToHere} />
              </Switch>
            </Suspense>
          ) : isStandalone ? (
            <StandaloneRouter />
          ) : (
            <>
              <MainRouter />
              <ExitIntentPopup />
              <FloatingPrompt />
              <BehaviorOverlays />
            </>
          )}
          <GlobalAnalytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
