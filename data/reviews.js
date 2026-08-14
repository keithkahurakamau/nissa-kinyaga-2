// Guest reviews published on /reviews/.
//
// EMPTY BY DESIGN. Do not seed this with sample, illustrative or "placeholder"
// reviews. A fabricated testimonial is the single most damaging thing that
// could be put on this site: it is a false statement attributed to a named
// person, and unlike a wrong date nobody can correct it after the fact.
//
// Add an entry only when a real guest has sent one and agreed to it being
// published. templates/reviews.js renders the section only when this array is
// non-empty, and lib/seo.js emits AggregateRating only from real entries, so
// the page and its structured data are both correct while this is empty.
//
// Shape:
//   {
//     name:    'First name and last initial, or full name with permission',
//     country: 'Where they travelled from, optional',
//     trip:    'Which safari they took, ideally a data/packages.js title',
//     date:    'YYYY-MM', when they travelled
//     rating:  1-5, integer
//     body:    'Their words. Light copy-editing for typos only, never rewritten.',
//   }

/** @type {{name: string, country?: string, trip?: string, date: string, rating: number, body: string}[]} */
const reviews = [];

export default reviews;
