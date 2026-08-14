// Credentials, registrations and review platforms.
//
// EDITORIAL RULE, read before adding anything here.
//
// This file makes claims about real regulatory bodies. A wrong entry is not a
// typo, it is a false statement about a licence, and it is the client who
// carries that.
//
// Two separate things are tracked, and the distinction is the whole point:
//
//   `verified`  the entry may be published. For guide credentials this means
//               an independent published source confirms it (see `source`).
//               For company registrations it means the client has asserted,
//               on the record, that the business holds it. The client is the
//               authority on their own registrations; this file is not.
//
//   `reference` the licence or registration number exactly as printed on the
//               document. NEVER invent, guess, pattern-match or placeholder
//               one. `null` is correct and renders no number at all. A number
//               is a specific verifiable string, and a wrong one is worse
//               than none, because it points a checker at someone else's
//               record. test/credentials.test.js fails the build on anything
//               that looks like a stand-in.
//
// The four company entries below are published on the client's assertion of
// 2026-08-14 that Nissa Safaris holds them, with their numbers still to come.
// If any turns out not to be held, delete the entry: claiming to be a licensed
// tour operator without the licence is the one error on this site with legal
// consequences rather than merely embarrassing ones.

/**
 * Nissa's personal guiding qualifications, as distinct from the company's
 * registrations below. These belong to the man, not the business.
 */
export const guideCredentials = [
  {
    id: 'kpsga-silver',
    verified: true,
    name: 'KPSGA Silver guide',
    body: 'Kenya Professional Safari Guides Association',
    bodyUrl: 'https://safariguides.org/',
    // Both interviews below state "one of only 59 silver guides in Kenya".
    // The count is a figure from 2021 and will drift, so it is deliberately
    // not repeated as a live claim on the site; the rating itself is what is
    // durable. Do not reintroduce the number without a current source.
    detail:
      'Silver is the middle of the association\'s three grades, awarded on written and practical examination covering ecology, ornithology, geology, first aid and vehicle handling, and requiring three further years in the field beyond Bronze.',
    source: {
      title: 'Life lessons with Nissa Ole Kinyaga, Luxury London',
      url: 'https://luxurylondon.co.uk/travel/international/life-lessons-with-nissa-old-kinyaga-kenya-safari-guide-interview/',
    },
  },
  {
    id: 'utalii',
    verified: true,
    name: 'Advanced tour-guiding certificate',
    body: 'Kenya Utalii College',
    bodyUrl: null,
    detail:
      'Kenya\'s national hospitality and tourism training college. The advanced guiding course covers ornithology, walking safaris, astronomy and first aid.',
    source: {
      title: 'Life lessons with Nissa Ole Kinyaga, Luxury London',
      url: 'https://luxurylondon.co.uk/travel/international/life-lessons-with-nissa-old-kinyaga-kenya-safari-guide-interview/',
    },
  },
];

/**
 * Company registrations and operator licences.
 *
 * Published on the client's assertion that the business holds each one; the
 * reference numbers are outstanding and stay `null` until supplied, so each
 * renders the credential and its issuing body with no number attached.
 */
export const companyCredentials = [
  {
    id: 'brs',
    verified: true,
    name: 'Registered company',
    body: 'Business Registration Service, Kenya',
    bodyUrl: 'https://brs.go.ke/',
    reference: null, // registration number, e.g. "PVT-XXXXXXX"
    detail: 'Nissa Safaris is a company registered in Kenya.',
  },
  {
    id: 'tra',
    verified: true,
    name: 'Licensed tour operator',
    body: 'Tourism Regulatory Authority',
    bodyUrl: 'https://www.tourismauthority.go.ke/',
    reference: null, // TRA licence number
    // The TRA, not KWS, is the body that licenses tour operators in Kenya.
    // KWS manages parks and wildlife and issues its own separate permits;
    // see the `kws` entry, which is deliberately worded not to imply that a
    // KWS permit licenses the business.
    detail: 'The authority that licenses tour operators in Kenya.',
  },
  {
    id: 'kato',
    verified: true,
    name: 'KATO member',
    body: 'Kenya Association of Tour Operators',
    bodyUrl: 'https://katokenya.org/',
    reference: null, // KATO membership number
    detail:
      'A membership association of Kenyan tour operators, with a bonding scheme and a code of conduct for members.',
  },
  {
    id: 'kws',
    verified: true,
    name: 'Park permits',
    body: 'Kenya Wildlife Service',
    bodyUrl: 'https://www.kws.go.ke/',
    reference: null, // permit/concession number
    // Worded as a permit held, never as a licence to operate: KWS does not
    // license tour operators, and implying otherwise would misdescribe a
    // government agency's remit.
    detail:
      'Permits issued by the agency that manages Kenya\'s national parks and reserves.',
  },
];

/**
 * Third-party review platforms.
 *
 * `url: null` means the profile does not exist yet, and the badge is not
 * rendered: a review link that 404s costs more trust than an absent one. As
 * of this writing no listing for Nissa Safaris was found on any of the three,
 * so all are null pending the client's URLs.
 */
export const reviewPlatforms = [
  { id: 'tripadvisor', name: 'Tripadvisor', url: null, cta: 'Read and write reviews on Tripadvisor' },
  { id: 'google', name: 'Google', url: null, cta: 'Read and write Google reviews' },
  { id: 'safaribookings', name: 'SafariBookings', url: null, cta: 'Read and write reviews on SafariBookings' },
];

/**
 * How international journeys are actually delivered.
 *
 * Nissa Safaris is licensed in Kenya and arranges the nine data/journeys.js
 * countries through operators licensed in those countries. This states that
 * plainly rather than implying certification Nissa Safaris does not hold
 * abroad, which matches the operator-voice rule those pages already follow.
 */
export const internationalAssurance =
  'Outside Kenya we work through ground operators licensed in their own country, and they hold the permits and guiding accreditation required there. Nissa Safaris plans the trip, books it and stays your single point of contact throughout; the local operator runs the vehicles and guides on the ground.';

export const verified = (list) => list.filter((entry) => entry.verified);
export const activePlatforms = () => reviewPlatforms.filter((platform) => platform.url);

export default {
  guideCredentials,
  companyCredentials,
  reviewPlatforms,
  internationalAssurance,
};
