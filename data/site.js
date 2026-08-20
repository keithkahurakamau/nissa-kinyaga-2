import { ORIGIN } from '../lib/paths.js';

export default {
  name: 'Nissa Safaris',
  legalName: 'Nissa Safaris',
  guide: 'Nissa Ole Kinyaga',
  tagline: 'Journeys that connect you to nature',
  description:
    'Private, freelance safaris across Kenya led by Nissa Ole Kinyaga of Nissa Safaris, over twenty years guiding across Maasai Mara, Samburu, Ol Pejeta, Tsavo, Laikipia, Mount Kenya and the Diani coast.',
  origin: ORIGIN,
  email: 'nissasafaris254@gmail.com',
  phones: ['+254 707 415 444', '+254 722 449 514'],
  whatsapp: '254707415444',
  instagram: 'nissa_safaris_tours',
  logo: '/assets/logo.png',
  logoFull: '/assets/logo-full.png',
  portrait: '/assets/portrait.jpg',
  defaultShareImage: '/assets/lion.jpg',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Safaris', href: '/safaris/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'Journeys', href: '/journeys/' },
    { label: 'About', href: '/about/' },
    { label: 'Gallery', href: '/gallery/' },
    { label: 'Journal', href: '/journal/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'Contact', href: '/contact/' },
  ],
  footerLinks: [
    { label: 'All safaris', href: '/safaris/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'International journeys', href: '/journeys/' },
    { label: 'About Nissa', href: '/about/' },
    { label: 'Reviews & credentials', href: '/reviews/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Get the app', href: '/app/' },
    { label: 'IWACO-KENYA', href: 'https://iwacokenya.org' },
  ],
  // Kept apart from footerLinks and rendered as its own row: these are the
  // four documents a visitor goes looking for deliberately, and burying them
  // among the navigation links is how they end up hard to find. Order is
  // the order they matter in to someone about to book.
  legalLinks: [
    { label: 'Terms & conditions', href: '/terms/' },
    { label: 'Privacy policy', href: '/privacy/' },
    { label: 'Cookies', href: '/cookies/' },
    { label: 'Copyright & credits', href: '/copyright/' },
  ],
  // Profiles that prove this is the same business elsewhere on the web.
  // schema.org `sameAs` is the strongest entity-resolution signal there is:
  // it is how a search engine or an AI assistant confirms that the Nissa
  // Safaris on this domain is the Nissa Safaris on Google, rather than
  // guessing from a similar name. Add the Google Business Profile URL here
  // as soon as it is to hand (Google Maps "Share" gives a maps.app.goo.gl
  // link; the full https://www.google.com/maps/place/... URL is better).
  // Entries render only when set, so a blank string is never emitted.
  profiles: {
    googleBusiness: '',
    tripadvisor: '',
    facebook: '',
  },
  workedAt: [
    { name: 'Lewa Wildlife Conservancy', role: 'Head radio signalling officer, ranger research' },
    { name: 'Lewa Safari Camp', role: 'Safari guide, then head guide and camp assistant manager' },
    { name: 'Sirikoi Camp, Lewa', role: 'Safari guide' },
    { name: 'Ol Donyo Lodge, Chyulu Hills', role: 'Freelance guide' },
    { name: 'Angama Mara', role: 'Freelance guide' },
    { name: 'Sarara Camp, Mathews Range', role: 'Freelance guide' },
    { name: 'Saruni Kalama', role: 'Freelance guide' },
    { name: 'Il Ngwesi Lodge', role: 'Freelance guide' },
    { name: 'Tassia Lodge', role: 'Freelance guide' },
    { name: 'Borana Conservancy', role: 'Head guide and head of staff' },
    // The source document records these three only because the client listed
  // them; it states no role for any of them. Do not invent one, the launch
  // checklist tracks confirming them with Nissa.
  { name: 'Laragai House', role: null },
    { name: 'Tsavo East', role: null },
    { name: 'Tsavo West', role: null },
  ],
};
