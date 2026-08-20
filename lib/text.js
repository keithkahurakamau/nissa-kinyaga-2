import { escape, raw } from './html.js';

// Every page's meta description must land in this range, measured in
// HTML-escaped characters, enforced site-wide by the "every page has a
// unique meta description of 50-165 chars" test in test/build.test.js.
export const MIN_DESCRIPTION = 50;
export const MAX_DESCRIPTION = 165;

// The build test measures description length off the rendered HTML
// attribute (`<meta name="description" content="...">`), where the `html`
// tag function has already HTML-escaped the text. An apostrophe becomes
// `&#39;` (5 chars for 1), so length decisions must be made against the
// escaped length, not the raw source string length.

/**
 * The HTML-escaped length of `text`, what actually lands in the rendered
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

// Inline links inside authored prose.
//
// The legal pages (data/legal.js) are the first content on this site that
// needs anchors *inside* a sentence: "email us", "see the privacy policy",
// "read the cookie policy". Everything else on the site keeps prose and
// markup separate, and that stays the rule; this exists so a legal clause
// can carry a working link without data/legal.js having to hold raw HTML,
// which would put an un-escaped hole straight through the `html` tag's
// auto-escaping.
//
// Deliberately not a markdown parser. Exactly one construct is understood,
// `[label](href)`, and only three href shapes are allowed through. Anything
// else is escaped and rendered as the literal text the author typed, so a
// typo shows up on the page as a visible mistake rather than as a silently
// broken or, worse, `javascript:` link.
const INLINE_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
// The leading `\/(?!\/)` matters: "//evil.test" is a protocol-relative
// URL, not a root-relative path, and navigates straight off this site.
const SAFE_HREF = /^(?:\/(?!\/)[^\s"'<>]*|mailto:[^\s"'<>]+|https:\/\/[^\s"'<>]+)$/;

/**
 * Escapes `text` and turns `[label](href)` into an anchor.
 *
 * Root-relative, `mailto:` and `https:` hrefs are permitted; external links
 * get `target="_blank" rel="noopener noreferrer"`, the invariant
 * test/remaining-pages.test.js enforces across every page on the site.
 *
 * @param {string} text
 * @returns {import('./html.js').RawHtml} safe HTML
 */
export function inlineLinks(text) {
  const source = String(text);
  let out = '';
  let cursor = 0;
  for (const match of source.matchAll(INLINE_LINK)) {
    const [whole, label, href] = match;
    out += escape(source.slice(cursor, match.index));
    if (SAFE_HREF.test(href)) {
      const external = href.startsWith('https://');
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      out += `<a href="${escape(href)}"${rel}>${escape(label)}</a>`;
    } else {
      out += escape(whole);
    }
    cursor = match.index + whole.length;
  }
  return raw(out + escape(source.slice(cursor)));
}
