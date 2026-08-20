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
    { label: 'Privacy', href: '/privacy/' },
    { label: 'IWACO-KENYA', href: 'https://iwacokenya.org' },
  ],
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
