// ---------------------------------------------------------------------------
// Lost Draw Outfitters — CONCEPT / DEMO data.
//
// This is a fictional outfitter brand used to showcase the Pro-tier "outfitter"
// multipage template on bosqueworks.com/concepts/outfitter. It is NOT a real
// client and not a real business. All copy is finished demo content (no
// placeholders). All pages are noindex. Image paths point at public/outfitter/.
//
// Ported from the bosqueworks-demos outfitter template; the component contract
// (client.business / client.brand / client.outfitter / client.pages) is kept
// identical so the 12 outfitter components render unchanged.
// ---------------------------------------------------------------------------

export const lostDraw = {
  tier: 'pro',
  template: 'outfitter',

  business: {
    name: 'Lost Draw Outfitters',
    shortName: 'Lost Draw',
    tagline: 'Texas Hunts, Earned the Hard Way.',
    industry: 'Guided Hunts',
    // Phone/email intentionally blank on this concept — the booking form is the
    // contact path, and the components hide the call/email CTAs when these are
    // empty. (Keeps a fictional brand from advertising a working line.)
    phone: '',
    email: '',
    owner: '',
    address: { street: '', city: 'Stephenville', state: 'TX', zip: '' },
    serviceArea: [
      'Erath County',
      'Comanche County',
      'Hamilton County',
      'Bosque County',
      'Hood County',
    ],
    social: { facebook: '', google: '' },
    licenses: 'Family-Owned & Operated',
  },

  // Proven outfitter earth-tone palette (sage / night / rust / bone).
  brand: {
    primary: '#7A8B6F',
    primaryDark: '#1F2620',
    primaryLight: '#A8B79C',
    accent: '#8B4513',
    background: '#F5EFDF',
    surface: '#E8DEC5',
    text: '#2A2520',
    textLight: '#6B665E',
    fontHeading: 'Rye',
    fontBody: 'Arial',
  },

  outfitter: {
    // No logo image — the brand mark is the wordmark set in Rye.
    logo: '',
    heroPhoto: '/outfitter/hero-country.jpg',

    hero: {
      eyebrow: 'Cross Timbers · Texas',
      headline: 'Hunts Earned, Not Bought.',
      subline:
        'Family-run guided hunts on Cross Timbers country worked for five generations. Whitetail, exotics, and waterfowl on managed ground — real terrain, fair chase, no high-fence shortcuts.',
      primaryCta: 'Book Your Hunt',
      secondaryCta: 'Explore Our Hunts',
    },

    programs: [
      {
        slug: 'whitetail',
        name: 'Whitetail Deer',
        season: 'September – January',
        summary: 'Managed herd, low-pressure ground, mature bucks on their feet.',
        icon: '🦌',
        image: '/outfitter/whitetail.jpg',
        description:
          'Our whitetail program runs on ground we manage year-round under an MLD permit, which means a longer season, controlled harvest, and a herd with real age structure. You hunt from box blinds over senderos and food plots, or still-hunt the creek bottoms when the rut turns the bucks loose. Most hunters see deer every sit; the patient ones see the deer they came for. A typical hunt is two to three days with lodging, home-cooked meals, field dressing, and trophy prep included. We keep the pressure low and the guide-to-hunter ratio lower — one guide, one or two hunters, no crowding the country. First-time hunters and seasoned trophy hunters get the same straight answers about what the property is holding.',
      },
      {
        slug: 'exotics',
        name: 'Exotic Hunts',
        season: 'Year-Round',
        summary: 'Aoudad, axis, blackbuck, and fallow — free-ranging Texas exotics.',
        icon: '🐏',
        image: '/outfitter/exotics.jpg',
        description:
          'Texas exotics hunt well twelve months a year, and our country holds aoudad, axis, blackbuck, and fallow on free-range terrain that actually makes them work for it. Aoudad in the rough breaks is the marquee hunt — a spot-and-stalk grind across rock and cedar that earns every step. Axis and blackbuck reward glassing the open pasture edges at first and last light. We price by species and trophy class up front, with no surprise fees at the skinning shed. Hunts run one to three days depending on what you are after, lodging and meals included, and we will tailor the pace to your legs and your goals. Bring a rifle you trust out to 300 yards and we will put you in the right country.',
      },
      {
        slug: 'waterfowl',
        name: 'Waterfowl',
        season: 'November – January',
        summary: 'Mixed-bag duck hunts over water, with seasoned retrievers working.',
        icon: '🦆',
        image: '/outfitter/waterfowl.jpg',
        description:
          'When the season is in, we run morning waterfowl hunts over stock tanks and river-bottom sloughs that pull birds off the bigger water. Expect a mixed bag — gadwall, wigeon, teal, and the occasional pintail — worked over a hand-set decoy spread out of brushed blinds. Our retrievers do the wet work, and watching three good dogs run a morning is half the reason people book. Hunts start well before legal light, run through the morning flight, and finish with coffee and a bird count at the truck. We provide blinds, decoys, dogs, and the read on where the birds are sitting; you bring waders, a plugged shotgun, and steel shot. Limits happen, but we hunt it honest — some mornings the birds win, and that is the deal.',
      },
    ],

    country: {
      eyebrow: 'The Country',
      headline: 'Worked. Walked. Watched.',
      subhead:
        'Cross Timbers country is a hard, honest mix — oak motte and cedar brakes giving way to river bottom, sendero, and open pasture. Five generations of stewardship built ground that holds mature animals because it is hunted right and rested between. This is what walking it feels like: rock underfoot, water in the draws, and game that did not get old by being careless.',
      stats: [
        { value: '6,000+', label: 'Acres of low-pressure terrain' },
        { value: '5', label: 'Generations on this land' },
        { value: '4', label: 'Distinct ecosystems hunted' },
      ],
    },

    heritage: {
      eyebrow: 'Heritage',
      headline: 'This Country Deserves to Be Hunted Right.',
      quote: 'This country deserves to be hunted right.',
      image: '/outfitter/heritage.jpg',
      body: [
        'Lost Draw started the way most things out here did — with a family, a fence line, and more work than daylight. The same ground that ran cattle for five generations now carries a managed herd and a hunting operation built on one rule: leave the country better than the season you found it.',
        'We guide the way we were taught to hunt — fair chase, mature animals, clean shots, and respect for the animal and the land both. A Lost Draw hunt is not a high-fence sure thing. It is real country, real terrain, and a guide who would rather you pass a young buck than fill a tag you will not be proud of. Come hunt it once and you will understand why we have never needed to advertise.',
      ],
    },

    booking: {
      eyebrow: 'Plan Your Hunt',
      headline: 'Book Your Hunt',
      subhead:
        'Tell us what you are after and when. We will come back with availability and pricing — usually the same day.',
    },
  },

  // Multipage nav. navLabel/title/subtitle drive the header + page heroes.
  pages: [
    {
      slug: 'hunts',
      title: 'Our Hunts',
      navLabel: 'Hunts',
      subtitle: 'Three programs. One standard.',
      sections: ['huntsList', 'bookForm'],
    },
    {
      slug: 'property',
      title: 'The Country',
      navLabel: 'The Country',
      subtitle: 'Texas country, worked for generations.',
      sections: ['country', 'photoFeature'],
    },
    {
      slug: 'about',
      title: 'Our Heritage',
      navLabel: 'About',
      subtitle: 'Hunters first. Stewards always.',
      sections: ['heritage', 'country'],
    },
    {
      slug: 'book',
      title: 'Book Your Hunt',
      navLabel: 'Book',
      subtitle: 'Tell us what you are after.',
      sections: ['bookForm'],
    },
  ],

  cta: {
    eyebrow: 'Plan Your Hunt',
    headline: 'Ready to Get After It?',
    subtext:
      'Tell us what you are hunting and when. We will get back to you the same day.',
  },

  // Booking form routes through the portfolio's existing /api/contact
  // (Resend + Turnstile). Inquiries land with Cody for the demo.
  contact: {
    recipientEmail: 'cody@bosqueworks.com',
    subjectPrefix: 'Lost Draw (concept) hunt inquiry',
    successMessage: 'Inquiry sent — check your inbox.',
    errorMessage: 'Sorry, something went wrong. Please try again.',
  },
};

export default lostDraw;
