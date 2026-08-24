// Per-post thought leader credibility: 1-3 real voices matched to each blog topic
// These are real experts whose work relates to the post's subject matter

export interface ThoughtLeader {
  name: string;
  title: string;
  relevance: string;
  url?: string;
}

export const thoughtLeadersBySlug: Record<string, ThoughtLeader[]> = {
  'the-clock-keeper-chronicles-part-1': [
    { name: 'Richard Feynman', title: 'Nobel Laureate in Physics', relevance: 'Modeled intellectual humility and "I don\'t know" as the beginning of wisdom', url: 'https://en.wikipedia.org/wiki/Richard_Feynman' },
    { name: 'Ram Dass', title: 'Spiritual Teacher & Author', relevance: 'Authored Be Here Now, bridging Eastern consciousness practices with Western psychology', url: 'https://www.ramdass.org/' },
    { name: 'Buckminster Fuller', title: 'Systems Theorist & Inventor', relevance: 'Authored Operating Manual for Spaceship Earth, pioneered whole-systems thinking', url: 'https://en.wikipedia.org/wiki/Buckminster_Fuller' },
  ],
  'forever-chemicals-in-my-blood-pfas-and-microplastics': [
    { name: 'Erin Brockovich', title: 'Environmental Activist & Consumer Advocate', relevance: 'Pioneered corporate accountability for water contamination', url: 'https://www.erinbrockovich.com/' },
    { name: 'Dr. Philippe Grandjean', title: 'Professor of Environmental Medicine, Harvard', relevance: 'Leading researcher on PFAS health effects', url: 'https://www.hsph.harvard.edu/philippe-grandjean/' },
    { name: 'Rob Bilott', title: 'Environmental Attorney', relevance: 'Exposed DuPont PFAS contamination (Dark Waters)', url: 'https://en.wikipedia.org/wiki/Robert_Bilott' },
  ],
  'elixir-of-life-device-and-journey': [
    { name: 'Dr. Peter Attia', title: 'Longevity Physician & Author', relevance: 'Leading voice on longevity science and healthspan', url: 'https://peterattiamd.com/' },
    { name: 'Dr. David Sinclair', title: 'Professor of Genetics, Harvard Medical School', relevance: 'Pioneer in aging research and NAD+ biology', url: 'https://sinclair.hms.harvard.edu/' },
  ],
  'luz-lounge-where-loyalty-goes-to-die-groupon': [
    { name: 'Andrew Mason', title: 'Founder, Groupon', relevance: 'Created the daily deals model that disrupted local business', url: 'https://en.wikipedia.org/wiki/Andrew_Mason' },
    { name: 'Seth Godin', title: 'Marketing Author & Entrepreneur', relevance: 'Wrote extensively on permission marketing and loyalty', url: 'https://seths.blog/' },
  ],
  'trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud': [
    { name: 'Adam Bornstein', title: 'Fitness Industry Journalist & Author', relevance: 'Investigates fitness industry deception', url: 'https://www.bornfitness.com/' },
    { name: 'Dr. Stuart McGill', title: 'Professor Emeritus, Spine Biomechanics, Waterloo', relevance: 'Authority on evidence-based fitness and injury prevention', url: 'https://www.backfitpro.com/' },
  ],
  'dmn8-the-most-beautiful-crooked-gym-in-the-world': [
    { name: 'Mark Rippetoe', title: 'Strength Coach & Author', relevance: 'Advocate for honest, evidence-based strength training', url: 'https://startingstrength.com/' },
  ],
  'the-way-of-dao': [
    { name: 'Alan Watts', title: 'Philosopher & Writer', relevance: 'Brought Eastern philosophy to Western audiences', url: 'https://alanwatts.org/' },
    { name: 'Lao Tzu', title: 'Ancient Chinese Philosopher', relevance: 'Author of the Tao Te Ching, foundational Daoist text', url: 'https://en.wikipedia.org/wiki/Laozi' },
    { name: 'Dr. Edward Slingerland', title: 'Professor of Philosophy, UBC', relevance: 'Scholar bridging Eastern philosophy and cognitive science', url: 'https://www.edwardslingerland.com/' },
  ],
  'an-ode-to-kusaki-where-plants-become-culinary-masterpieces': [
    { name: 'Ren\u00e9 Redzepi', title: 'Chef & Co-founder, Noma', relevance: 'Pioneered plant-forward fine dining and foraging', url: 'https://noma.dk/' },
    { name: 'Dan Barber', title: 'Chef & Author, The Third Plate', relevance: 'Champion of farm-to-table and regenerative cuisine', url: 'https://www.bluehillfarm.com/' },
  ],
  'mastering-bd-the-art-of-the-no-that-opens-the-real-door': [
    { name: 'Chris Voss', title: 'Former FBI Lead Hostage Negotiator', relevance: 'Author of Never Split the Difference on tactical empathy', url: 'https://www.blackswanltd.com/' },
    { name: 'Oren Klaff', title: 'Author, Pitch Anything', relevance: 'Expert on neuroeconomics of deal-making', url: 'https://www.orenklaff.com/' },
    { name: 'Jill Konrath', title: 'Sales Strategist & Author', relevance: 'Authority on complex B2B sales acceleration', url: 'https://www.jillkonrath.com/' },
  ],
  'productivity-apps-that-rocked-my-world-in-2024': [
    { name: 'Tiago Forte', title: 'Author, Building a Second Brain', relevance: 'Leading voice on personal knowledge management', url: 'https://fortelabs.com/' },
    { name: 'Cal Newport', title: 'Professor & Author, Deep Work', relevance: 'Expert on digital minimalism and focused productivity', url: 'https://calnewport.com/' },
  ],
  'innovative-thinking-with-tony-greenberg-scale-up-show': [
    { name: 'Reid Hoffman', title: 'Co-founder, LinkedIn', relevance: 'Advocate for blitzscaling and innovative business models', url: 'https://www.reidhoffman.org/' },
    { name: 'Peter Thiel', title: 'Co-founder, PayPal & Palantir', relevance: 'Author of Zero to One on contrarian thinking', url: 'https://en.wikipedia.org/wiki/Peter_Thiel' },
  ],
  'more-ignorance-or-indignance-in-the-wake-of-covid-19': [
    { name: 'Dr. Anthony Fauci', title: 'Former Director, NIAID', relevance: 'Led US pandemic response and public health communication', url: 'https://en.wikipedia.org/wiki/Anthony_Fauci' },
    { name: 'Ed Yong', title: 'Science Journalist, The Atlantic', relevance: 'Pulitzer Prize-winning COVID-19 reporting', url: 'https://www.theatlantic.com/author/ed-yong/' },
  ],
  'the-arithmetic-of-relationships': [
    { name: 'Dr. John Gottman', title: 'Relationship Researcher', relevance: 'Discovered the mathematics of relationship success', url: 'https://www.gottman.com/' },
    { name: 'Esther Perel', title: 'Psychotherapist & Author', relevance: 'Expert on modern relationships and human connection', url: 'https://www.estherperel.com/' },
  ],
  'save-entrepreneurs-big-business-buying-startup-2': [
    { name: 'Scott Galloway', title: 'Professor, NYU Stern', relevance: 'Critic of Big Tech monopoly power over startups', url: 'https://www.profgalloway.com/' },
    { name: 'Lina Khan', title: 'Former Chair, FTC', relevance: 'Architect of modern antitrust enforcement', url: 'https://en.wikipedia.org/wiki/Lina_Khan' },
  ],
  'marc-andreessen-rebuttal-2020': [
    { name: 'Marc Andreessen', title: 'Co-founder, Andreessen Horowitz', relevance: 'Author of "It\'s Time to Build" essay being rebutted', url: 'https://a16z.com/' },
    { name: 'Anand Giridharadas', title: 'Author, Winners Take All', relevance: 'Critic of tech elite philanthropy and system change', url: 'https://anand.ly/' },
  ],
  'covid-deniers-need-to-take-a-breath': [
    { name: 'Dr. Peter Hotez', title: 'Virologist & Dean, Baylor', relevance: 'Leading voice against anti-science movements', url: 'https://www.bcm.edu/people-search/peter-hotez-23229' },
    { name: 'Dr. Ashish Jha', title: 'Dean, Brown School of Public Health', relevance: 'Public health communicator during COVID-19', url: 'https://www.brown.edu/academics/public-health/ashish-jha' },
  ],
  '6-act-of-speech-speaking-as-a-tool': [
    { name: 'J.L. Austin', title: 'Philosopher of Language', relevance: 'Originated speech act theory in How to Do Things with Words', url: 'https://en.wikipedia.org/wiki/J._L._Austin' },
    { name: 'Brené Brown', title: 'Research Professor & Author', relevance: 'Expert on vulnerability and courageous communication', url: 'https://brenebrown.com/' },
    { name: 'Nancy Duarte', title: 'CEO, Duarte Inc.', relevance: 'Authority on persuasive presentation and storytelling', url: 'https://www.duarte.com/' },
  ],
  'mastering-human-and-business-development': [
    { name: 'Jim Collins', title: 'Author, Good to Great', relevance: 'Researcher on what makes companies enduringly great', url: 'https://www.jimcollins.com/' },
    { name: 'Daniel Pink', title: 'Author, Drive', relevance: 'Expert on motivation, timing, and human performance', url: 'https://www.danpink.com/' },
  ],
  'psychedelics-could-become-extractive-capitalism': [
    { name: 'Rick Doblin', title: 'Founder, MAPS', relevance: 'Pioneer in psychedelic-assisted therapy research', url: 'https://maps.org/' },
    { name: 'Dr. Robin Carhart-Harris', title: 'Neuroscientist, UCSF', relevance: 'Leading psilocybin researcher', url: 'https://profiles.ucsf.edu/robin.carhart-harris' },
  ],
  'forward-health-is-a-sideway-step-at-best': [
    { name: 'Dr. Eric Topol', title: 'Cardiologist & Digital Health Pioneer', relevance: 'Author of Deep Medicine on AI in healthcare', url: 'https://drerictopol.com/' },
    { name: 'Dr. Vinod Khosla', title: 'Founder, Khosla Ventures', relevance: 'Investor in healthcare innovation and AI diagnostics', url: 'https://www.khoslaventures.com/' },
  ],
  'india-my-virtual-soul-home': [
    { name: 'Pico Iyer', title: 'Travel Writer & Essayist', relevance: 'Eloquent chronicler of spiritual journeys in India', url: 'https://www.picoiyer.com/' },
    { name: 'Amartya Sen', title: 'Nobel Laureate, Economics', relevance: 'Scholar on India\'s identity and development', url: 'https://en.wikipedia.org/wiki/Amartya_Sen' },
  ],
  'bread-stuck-with-no-customer-service': [
    { name: 'Danny Meyer', title: 'Restaurateur & Author', relevance: 'Wrote Setting the Table on hospitality excellence', url: 'https://www.ushgnyc.com/' },
    { name: 'Jay Baer', title: 'Author, Hug Your Haters', relevance: 'Expert on customer experience and complaint handling', url: 'https://www.jaybaer.com/' },
  ],
  'the-decay-of-professional-phone-calls': [
    { name: 'Sherry Turkle', title: 'Professor, MIT', relevance: 'Author of Reclaiming Conversation on digital communication', url: 'https://sherryturkle.mit.edu/' },
    { name: 'Cal Newport', title: 'Author, A World Without Email', relevance: 'Critic of modern communication dysfunction', url: 'https://calnewport.com/' },
  ],
  'how-to-alienate-a-loyal-vegan': [
    { name: 'Gene Baur', title: 'Co-founder, Farm Sanctuary', relevance: 'Pioneer in the vegan and animal rights movement', url: 'https://www.farmsanctuary.org/' },
    { name: 'Miyoko Schinner', title: 'Founder, Miyoko\'s Creamery', relevance: 'Vegan food entrepreneur and industry leader', url: 'https://miyokos.com/' },
  ],
  'the-decay-of-modern-day-communication': [
    { name: 'Sherry Turkle', title: 'Professor, MIT', relevance: 'Leading researcher on technology and human connection', url: 'https://sherryturkle.mit.edu/' },
    { name: 'Johann Hari', title: 'Author, Stolen Focus', relevance: 'Investigator of attention crisis in modern society', url: 'https://johannhari.com/' },
  ],
  'davos-2022-world-economic-forum-here-we-come': [
    { name: 'Klaus Schwab', title: 'Founder, World Economic Forum', relevance: 'Architect of the Davos stakeholder capitalism model', url: 'https://www.weforum.org/' },
    { name: 'Ray Dalio', title: 'Founder, Bridgewater Associates', relevance: 'Davos regular and author on economic cycles', url: 'https://www.principles.com/' },
  ],
  'founders-institute-tony-outsourci': [
    { name: 'Adeo Ressi', title: 'Founder, Founder Institute', relevance: 'Created the world\'s largest pre-seed startup accelerator', url: 'https://fi.co/' },
    { name: 'Steve Blank', title: 'Entrepreneur & Educator', relevance: 'Father of the Lean Startup movement', url: 'https://steveblank.com/' },
  ],
  'hiding-fees-tips-in-the-transparent-age': [
    { name: 'Dan Ariely', title: 'Behavioral Economist, Duke', relevance: 'Expert on irrational pricing and hidden costs', url: 'https://danariely.com/' },
    { name: 'Dina Srinivasan', title: 'Antitrust Scholar', relevance: 'Researcher on hidden digital economy costs', url: 'https://en.wikipedia.org/wiki/Dina_Srinivasan' },
  ],
  'the-ball-and-blockchain-decentralization': [
    { name: 'Vitalik Buterin', title: 'Co-founder, Ethereum', relevance: 'Architect of programmable blockchain infrastructure', url: 'https://vitalik.eth.limo/' },
    { name: 'Chris Dixon', title: 'General Partner, a16z crypto', relevance: 'Author of Read Write Own on blockchain\'s future', url: 'https://cdixon.org/' },
  ],
  'business-at-the-speed-of-light-millisecond-worth': [
    { name: 'Michael Lewis', title: 'Author, Flash Boys', relevance: 'Exposed high-frequency trading and millisecond economics', url: 'https://en.wikipedia.org/wiki/Michael_Lewis' },
    { name: 'Andrew Haldane', title: 'Former Chief Economist, Bank of England', relevance: 'Researcher on speed and stability in financial markets', url: 'https://en.wikipedia.org/wiki/Andrew_Haldane' },
  ],
  'only-time-buys-trust': [
    { name: 'Stephen M.R. Covey', title: 'Author, The Speed of Trust', relevance: 'Authority on trust as an economic driver', url: 'https://www.speedoftrust.com/' },
    { name: 'Rachel Botsman', title: 'Trust Expert & Author', relevance: 'Researcher on trust in the digital age', url: 'https://rachelbotsman.com/' },
  ],
  'the-tug-of-war-ethical-vs-economic-decisions': [
    { name: 'Michael Sandel', title: 'Professor of Philosophy, Harvard', relevance: 'Author of Justice and What Money Can\'t Buy', url: 'https://scholar.harvard.edu/sandel' },
    { name: 'Daron Acemoglu', title: 'Economist, MIT', relevance: 'Nobel laureate on institutions, ethics, and economics', url: 'https://economics.mit.edu/people/faculty/daron-acemoglu' },
  ],
  'the-2011-cynic-measures-his-predictions': [
    { name: 'Philip Tetlock', title: 'Professor, UPenn', relevance: 'Author of Superforecasting on prediction accuracy', url: 'https://goodjudgment.com/' },
    { name: 'Nate Silver', title: 'Statistician & Author', relevance: 'Pioneer in probabilistic forecasting', url: 'https://www.natesilver.net/' },
  ],
  'return-on-investment-going-green-going-green-2': [
    { name: 'Paul Hawken', title: 'Author, Drawdown', relevance: 'Mapped the ROI of climate solutions', url: 'https://drawdown.org/' },
    { name: 'Al Gore', title: 'Former VP & Climate Advocate', relevance: 'Pioneer in connecting green investment to returns', url: 'https://www.algore.com/' },
  ],
  'boiling-the-human-summit-harvard-kurzweil': [
    { name: 'Ray Kurzweil', title: 'Inventor & Futurist', relevance: 'Author of The Singularity Is Near on human-machine convergence', url: 'https://www.kurzweilai.net/' },
    { name: 'Nick Bostrom', title: 'Philosopher, Oxford', relevance: 'Author of Superintelligence on existential AI risk', url: 'https://nickbostrom.com/' },
  ],
  'why-good-service-is-all-about-trust': [
    { name: 'Tony Hsieh', title: 'Late CEO, Zappos', relevance: 'Built a billion-dollar company on service culture', url: 'https://en.wikipedia.org/wiki/Tony_Hsieh' },
    { name: 'Fred Reichheld', title: 'Creator, Net Promoter Score', relevance: 'Inventor of the standard for measuring customer loyalty', url: 'https://www.bain.com/our-team/fred-reichheld/' },
  ],
  'customer-service-key-to-business-success': [
    { name: 'Micah Solomon', title: 'Customer Service Consultant & Author', relevance: 'Expert on anticipatory customer service', url: 'https://micahsolomon.com/' },
    { name: 'Jeanne Bliss', title: 'Customer Experience Pioneer', relevance: 'Former Chief Customer Officer at Lands\' End and Microsoft', url: 'https://www.customerbliss.com/' },
  ],
  'eco-vegan-realities-seriesethical-economic': [
    { name: 'Peter Singer', title: 'Philosopher, Princeton', relevance: 'Author of Animal Liberation, father of animal rights ethics', url: 'https://petersinger.info/' },
    { name: 'Dr. Michael Greger', title: 'Physician & Author', relevance: 'Evidence-based advocate for plant-based nutrition', url: 'https://nutritionfacts.org/' },
  ],
  'what-solutions-are-best-built-with-blockchain': [
    { name: 'Gavin Wood', title: 'Co-founder, Ethereum & Polkadot', relevance: 'Architect of smart contract infrastructure', url: 'https://en.wikipedia.org/wiki/Gavin_Wood' },
    { name: 'Balaji Srinivasan', title: 'Former CTO, Coinbase', relevance: 'Author of The Network State on blockchain governance', url: 'https://balajis.com/' },
  ],
  'profiling-the-public-cloud-buyer': [
    { name: 'Werner Vogels', title: 'CTO, Amazon Web Services', relevance: 'Architect of the public cloud revolution', url: 'https://www.allthingsdistributed.com/' },
    { name: 'Mark Russinovich', title: 'CTO, Microsoft Azure', relevance: 'Technical leader in enterprise cloud adoption', url: 'https://en.wikipedia.org/wiki/Mark_Russinovich' },
  ],
  'jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again': [
    { name: 'Reed Hastings', title: 'Co-founder, Netflix', relevance: 'Disrupted Hollywood with streaming-first strategy', url: 'https://en.wikipedia.org/wiki/Reed_Hastings' },
  ],
  'amazon-trumps-all-other-suitors-quest-hulu': [
    { name: 'Jeff Bezos', title: 'Founder, Amazon', relevance: 'Built Amazon\'s content and streaming empire', url: 'https://en.wikipedia.org/wiki/Jeff_Bezos' },
  ],
  'my-other-car-is-a-bentley-not-car-to-leaf-alone': [
    { name: 'Carlos Ghosn', title: 'Former CEO, Nissan-Renault', relevance: 'Launched the Nissan Leaf, first mass-market EV', url: 'https://en.wikipedia.org/wiki/Carlos_Ghosn' },
    { name: 'Sandy Munro', title: 'Auto Industry Analyst', relevance: 'Expert on EV engineering and manufacturing', url: 'https://munrolive.com/' },
  ],
  'summit-series-weekend-community': [
    { name: 'Elliott Bisnow', title: 'Co-founder, Summit', relevance: 'Created the Summit Series community', url: 'https://www.summit.co/' },
  ],
  'clout-v-klout-differences-and-never-be-the-same': [
    { name: 'Robert Cialdini', title: 'Author, Influence', relevance: 'Definitive researcher on persuasion and social proof', url: 'https://www.influenceatwork.com/' },
  ],
  'origen-restaurant': [
    { name: 'Rodolfo Castellanos', title: 'Chef, Origen Oaxaca', relevance: 'Pioneer of modern Oaxacan cuisine', url: 'https://en.wikipedia.org/wiki/Rodolfo_Castellanos' },
    { name: 'Diana Kennedy', title: 'Culinary Anthropologist', relevance: 'Authority on Mexican regional cuisine', url: 'https://en.wikipedia.org/wiki/Diana_Kennedy' },
  ],
  'clear-communication': [
    { name: 'Joseph Grenny', title: 'Author, Crucial Conversations', relevance: 'Expert on high-stakes communication', url: 'https://cruciallearning.com/' },
  ],
  'apologize': [
    { name: 'Harriet Lerner', title: 'Psychologist & Author', relevance: 'Author of Why Won\'t You Apologize? on authentic apology', url: 'https://www.harrietlerner.com/' },
  ],
  'high-hells-demise-of-powerful-femininity': [
    { name: 'Naomi Wolf', title: 'Author, The Beauty Myth', relevance: 'Critic of beauty standards and feminine power dynamics', url: 'https://en.wikipedia.org/wiki/Naomi_Wolf' },
  ],
  '10-magic-questions-for-projects-success-kick-ass': [
    { name: 'Tom Peters', title: 'Author, In Search of Excellence', relevance: 'Pioneer of management consulting and project excellence', url: 'https://tompeters.com/' },
    { name: 'Patrick Lencioni', title: 'Author, The Five Dysfunctions of a Team', relevance: 'Expert on team dynamics and project success', url: 'https://www.tablegroup.com/' },
  ],
  'grateful-smuggest-sentiment-or-selfish-act': [
    { name: 'Robert Emmons', title: 'Professor of Psychology, UC Davis', relevance: 'World\'s leading scientific expert on gratitude', url: 'https://emmons.faculty.ucdavis.edu/' },
  ],
  'cios-maximize-roi-or-find-new-role-joe-weinman': [
    { name: 'Joe Weinman', title: 'Author, Cloudonomics', relevance: 'Expert on cloud economics and CIO strategy', url: 'https://www.joeweinman.com/' },
  ],
  'human-operating-system': [
    { name: 'Yuval Noah Harari', title: 'Historian & Author', relevance: 'Author of Sapiens on human cognitive architecture', url: 'https://www.ynharari.com/' },
    { name: 'Antonio Damasio', title: 'Neuroscientist, USC', relevance: 'Pioneer in understanding emotion and decision-making', url: 'https://dornsife.usc.edu/profile/antonio-damasio/' },
  ],
  'the-buyers-and-sellers-honesty-dance-1': [
    { name: 'Daniel Kahneman', title: 'Nobel Laureate, Psychology', relevance: 'Author of Thinking, Fast and Slow on cognitive biases in deals', url: 'https://en.wikipedia.org/wiki/Daniel_Kahneman' },
  ],
  'the-buyers-sellers-honesty-dance-2': [
    { name: 'Robert Cialdini', title: 'Author, Influence', relevance: 'Expert on reciprocity and trust in negotiations', url: 'https://www.influenceatwork.com/' },
  ],
  'when-valuations-dont-mean-valuable': [
    { name: 'Aswath Damodaran', title: 'Professor of Finance, NYU Stern', relevance: 'World authority on corporate valuation', url: 'https://pages.stern.nyu.edu/~adamodar/' },
  ],
  'the-cios-guide-to-smarter-vendor-negotiation': [
    { name: 'William Ury', title: 'Co-author, Getting to Yes', relevance: 'Pioneer of principled negotiation at Harvard', url: 'https://www.williamury.com/' },
  ],
  'it-challenges-buyers-are-ok-are-you-sure-part-1': [
    { name: 'Gartner Research', title: 'IT Research & Advisory', relevance: 'Definitive source on IT spending and buyer behavior', url: 'https://www.gartner.com/' },
  ],
  'so-now-that-we-admit-we-have-a-problem-part-2': [
    { name: 'Clayton Christensen', title: 'Late Professor, Harvard Business School', relevance: 'Author of The Innovator\'s Dilemma on disruption', url: 'https://en.wikipedia.org/wiki/Clayton_Christensen' },
  ],
  'fast-growth-companies-likely-to-fall-part-3': [
    { name: 'Jim Collins', title: 'Author, How the Mighty Fall', relevance: 'Researcher on why great companies decline', url: 'https://www.jimcollins.com/' },
  ],
  'would-you-hire-someone-who-led-a-rebellion': [
    { name: 'Adam Grant', title: 'Professor, Wharton', relevance: 'Author of Originals on nonconformists who move the world', url: 'https://adamgrant.net/' },
  ],
  'thing-price-gouging-price-fixing': [
    { name: 'Tim Wu', title: 'Professor, Columbia Law', relevance: 'Author of The Curse of Bigness on monopoly pricing', url: 'https://www.law.columbia.edu/faculty/tim-wu' },
  ],
  'the-molecule-as-mirror-from-substance-to-service': [
    { name: 'Dr. Matt Torrington', title: 'Addiction Medicine Specialist, Distinguished Fellow ASAM', relevance: 'Board-certified in Family Medicine and Addiction Medicine; Principal Investigator for buprenorphine trials; UCLA clinical research physician; founded no-cost addiction treatment program in Santa Monica', url: 'https://www.asam.org/' },
    { name: 'Dr. Stephen Scappa', title: 'Physician & Researcher', relevance: 'Clinical expertise in chemical dependency and cognition repair; trusted advisor on substance use and recovery pathways' },
    { name: 'Dr. Gabor Maté', title: 'Physician & Author, In the Realm of Hungry Ghosts', relevance: 'Reframed addiction as adaptive response to childhood trauma; pioneer of compassionate inquiry', url: 'https://drgabormate.com/' },
    { name: 'Dr. Anna Lembke', title: 'Chief, Stanford Addiction Medicine Dual Diagnosis Clinic', relevance: 'Author of Dopamine Nation; researcher on pleasure-pain homeostasis and dopamine deficit states', url: 'https://profiles.stanford.edu/anna-lembke' },
    { name: 'Dr. Robin Carhart-Harris', title: 'Neuroscientist, UCSF', relevance: 'Creator of the REBUS model; leading researcher on psilocybin for treatment-resistant depression', url: 'https://profiles.ucsf.edu/robin.carhart-harris' },
    { name: 'Dr. Bessel van der Kolk', title: 'Psychiatrist & Author, The Body Keeps the Score', relevance: 'Demonstrated that trauma is stored somatically; pioneered EMDR and yoga-based trauma therapy', url: 'https://www.besselvanderkolk.com/' },
  ],
};
