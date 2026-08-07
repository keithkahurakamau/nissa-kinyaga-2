import { escape } from './html.js';

// Every page's meta description must land in this range, measured in
// HTML-escaped characters — enforced site-wide by the "every page has a
// unique meta description of 50-165 chars" test in test/build.test.js.
export const MIN_DESCRIPTION = 50;
export const MAX_DESCRIPTION = 165;

// The build test measures description length off the rendered HTML
// attribute (`<meta name="description" content="...">`), where the `html`
// tag function has already HTML-escaped the text. An apostrophe becomes
// `&#39;` (5 chars for 1), so length decisions must be made against the
// escaped length, not the raw source string length.

/**
 * The HTML-escaped length of `text` — what actually lands in the rendered
 * `<meta name="description">` attribute, and what MIN_DESCRIPTION /
 * MAX_DESCRIPTION are measured against.
 *
 * @param {string} text
 * @returns {number}
 */
export function escapedLength(text) {
  return escape(text).length;
}

/**
 * Truncates `text` word-by-word until its HTML-escaped form is at most
 * `maxLen` characters. Never splits a word.
 *
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
export function truncateToEscapedLimit(text, maxLen) {
  let candidate = text.trim();
  while (escapedLength(candidate) > maxLen) {
    const lastSpace = candidate.lastIndexOf(' ');
    candidate = lastSpace > 0 ? candidate.slice(0, lastSpace) : candidate.slice(0, -1);
  }
  return candidate.trim();
}
