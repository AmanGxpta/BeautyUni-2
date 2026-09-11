/**
 * BeautyUni — the site's ground truth, in one place.
 *
 * Everything a page says about the company comes from here rather than being
 * typed into JSX: the four capabilities, who the platform is for, the podcast
 * episodes, the featured programme and the founders. A correction to a date or
 * a job title is then a one-line change that every page picks up, and no page
 * can drift into claims the marketing copy never made.
 */

export const CONTACT = {
  email: "roopa.ambekar@icloud.com",
  phoneDisplay: "+91 87928 37676",
  phoneHref: "tel:+918792837676",
  designerEmail: "trust.yashira@gmail.com",
} as const;

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/podcast", label: "Podcast" },
  { href: "/programmes", label: "Programmes" },
  { href: "/join", label: "Join" },
] as const;

/**
 * The consent wording on the join form.
 *
 * Here rather than in `lib/community.ts` because the form is a Client
 * Component: anything it imports is bundled for the browser, and
 * `lib/community.ts` reaches Prisma through its store. Split into parts so the
 * page can render the address as a link while the row stores the whole
 * sentence — what someone agreed to and what we recorded cannot then drift.
 */
export const CONSENT_LEAD =
  "I agree to BeautyUni contacting me by email, phone or WhatsApp about its education programmes, events and the From Passion to Profit podcast.";

/** The sentence before the contact address, which the page renders as a link. */
export const CONSENT_WITHDRAW = "I can withdraw this at any time by emailing";

export const CONSENT_TEXT = `${CONSENT_LEAD} ${CONSENT_WITHDRAW} ${CONTACT.email}.`;

export type Capability = {
  n: string;
  title: string;
  kicker: string;
  body: string;
};

/** "Education that goes beyond technique" — the four interconnected capabilities. */
export const CAPABILITIES: readonly Capability[] = [
  {
    n: "01",
    title: "Technical Mastery",
    kicker:
      "Raise technical standards and understand the principles behind the craft — not simply the steps.",
    body: "BeautyUni’s approach focuses on developing real capability and contemporary technical understanding, helping professionals build mastery that goes deeper than following a demonstration.",
  },
  {
    n: "02",
    title: "Consultation & Communication",
    kicker:
      "Technical ability becomes more powerful when it is paired with the ability to understand and communicate with clients.",
    body: "BeautyUni focuses on better conversations, stronger consultation and confident communication — helping professionals build client trust, loyalty and repeat business.",
  },
  {
    n: "03",
    title: "Leadership & Teams",
    kicker: "As a business grows, technical ability alone isn’t enough.",
    body: "BeautyUni develops the people skills required to hire, lead and retain a team, helping professionals grow from being practitioners into effective leaders.",
  },
  {
    n: "04",
    title: "Visibility & Commercial Thinking",
    kicker: "Great work also needs to be positioned effectively.",
    body: "BeautyUni explores the commercial side of the profession — including positioning, pricing and digital visibility — helping professionals navigate an increasingly crowded market.",
  },
];

/** "Built for the whole profession" — who BeautyUni is for. */
export const AUDIENCE = [
  "Salon & spa owners",
  "Clinic & medaesthetics owners",
  "Hairdressers & stylists",
  "Therapists & aestheticians",
  "Educators & trainers",
  "Artists & students",
  "Brands, manufacturers & suppliers",
  "Investors",
] as const;

/** The join form's "Your role" options — the same list the live form offers. */
export const ROLES = [
  "Salon owner",
  "Spa owner",
  "Clinic / medaesthetics owner",
  "Hairdresser / stylist",
  "Beauty therapist / aesthetician",
  "Nail technician",
  "Makeup artist",
  "Educator / trainer",
  "Student",
  "Brand / manufacturer / supplier",
  "Investor",
  "Other",
] as const;

export type Episode = {
  code: string;
  youtubeId: string;
  title: string;
  guests: string;
  summary: string;
  /** Local copy of the YouTube poster, see public/site. */
  poster: string;
};

/** From Passion to Profit — newest first. */
export const EPISODES: readonly Episode[] = [
  {
    code: "S01 · E03",
    youtubeId: "9QUegFnCtOw",
    title: "The business behind great hair: building a career that lasts",
    guests: "With Rodney Cutler and Reginald Laws",
    summary:
      "Rodney Cutler on falling into hairdressing by accident and building Cutler Salon in New York — and, with Reg Laws, what it takes to move from creative stylist to owner: mastering the fundamentals, continuous education, and building a salon culture that lasts.",
    poster: "/site/ep-9QUegFnCtOw.jpg",
  },
  {
    code: "S01 · E02",
    youtubeId: "rfHHj6QV4FM",
    title: "The truth behind “overnight success” in the beauty industry",
    guests: "With hosts Roopa Ambekar and Vikas Vij",
    summary:
      "Roopa and Vikas on what it really takes to turn passion into a profitable, sustainable business: why perfectionism stalls growth, why discounting is a race to the bottom, why owners must know their own P&L, and why social media is part of a strategy — not the strategy.",
    poster: "/site/ep-rfHHj6QV4FM.jpg",
  },
  {
    code: "S01 · E01",
    youtubeId: "RLSYodjXoqk",
    title: "This one skill can 10x your salon business",
    guests:
      "With Reginald Laws — Founder, PR at Partners; creator of the Rock Star Success System",
    summary:
      "Reg Laws argues the most valuable skill in hairdressing isn’t the cut — it’s learning to truly hear the person in your chair. Four decades of lessons on communication, client experience and the consultation habits that drive retention and pricing power.",
    poster: "/site/ep-RLSYodjXoqk.jpg",
  },
];

export const PROGRAMME = {
  slug: "rock-star-success-system",
  tag: "Featured programme",
  name: "Rock Star Success System",
  subtitle: "Cut, Color & Communication",
  dates: "2–3 September 2026",
  city: "Mumbai",
  venue: "Novotel Mumbai International Airport",
  format: "Two-day U.S.-certified masterclass",
  places: "Limited to 50 professionals",
  partner: "Professional Beauty India",
  lead: "Reginald Laws",
  intro:
    "Led by Reginald Laws, the programme brings together five U.S. hairdressers and combines contemporary cut-and-colour education with the consultation and career skills that help transform technical ability into client trust.",
  detail: [
    "The seminar brings five U.S. hairdressers and industry experts, led by Reginald Laws, Founder of the Rock Star Success System and CEO of PR Partners in Washington, D.C. It combines contemporary cut-and-colour education with consultation, communication and career-building skills that help hairdressers turn technical ability into client trust, loyalty and business opportunity.",
    "Developed over more than 30 years, the Rock Star Success System has trained thousands of hairdressers and has been delivered in the United States, France, Hong Kong, Japan and Singapore.",
  ],
  quote:
    "Technical skill opens the door, but communication builds the relationship. When hairdressers are confident in both their craft and client conversations, they build trust and create careers with real longevity.",
  quoteBy: "Reginald Laws",
  equation: ["Technical capability", "Communication", "Professional development"],
} as const;

export type Founder = {
  name: string;
  role: string;
  portrait: string;
  short: string;
  long: readonly string[];
  facts: readonly string[];
};

export const FOUNDERS: readonly Founder[] = [
  {
    name: "Roopa Ambekar",
    role: "Co-Founder & Educator",
    portrait: "/site/portrait-roopa.jpg",
    short:
      "A beauty educator, entrepreneur and institute founder with more than 30 years of experience across India and the United States.",
    long: [
      "Roopa Ambekar is a beauty educator, entrepreneur and institute founder with more than 30 years of experience across India and the United States.",
      "Her experience includes serving as Dean at the Paul Mitchell School in Virginia and Director of Education at Graham Webb Academy and Aveda Institute.",
      "Her career brings a deep education-first perspective to BeautyUni and its focus on building genuine professional capability.",
    ],
    facts: [
      "Dean, Paul Mitchell School, Virginia",
      "Director of Education, Graham Webb Academy",
      "Director of Education, Aveda Institute",
    ],
  },
  {
    name: "Vikas Vij",
    role: "Co-Founder",
    portrait: "/site/portrait-vikas.jpg",
    short:
      "Founder and Managing Director of IDEX and the force behind Professional Beauty India. Based in London.",
    long: [
      "Vikas Vij is the Founder and Managing Director of IDEX and the force behind Professional Beauty India.",
      "Based in London, he has built industry platforms connecting education, innovation, product discovery and business.",
    ],
    facts: [
      "Founder & Managing Director, IDEX",
      "Professional Beauty India",
      "Based in London",
    ],
  },
];

/** The philosophy ladder — read in order. */
export const PHILOSOPHY_LADDER = [
  "It requires understanding the craft.",
  "It requires knowing how to consult and communicate.",
  "It requires earning trust.",
  "It requires knowing how to lead people.",
  "It requires understanding positioning, pricing and visibility.",
  "And it requires the ability to turn professional capability into a career or business that can grow and last.",
] as const;

export const PHILOSOPHY_CLOSE = [
  "Learn the craft.",
  "Understand the thinking behind it.",
  "Build the capability around it.",
  "Then learn the business behind it.",
] as const;
