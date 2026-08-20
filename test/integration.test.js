import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../build.js';

const all = pages();
const ROOT = join(fileURLToPath(import.meta.url), '..', '..');

// Files build.js copies into dist rather than rendering. Mapped to their
// source path so a link to one is checked against the file that will actually
// be copied, instead of being waved through by an allowlist: a typo in an
// asset href used to pass this test silently.
const COPIED = {
  '/favicon.ico': 'assets/favicon.ico',
};

// styles.css and app.js ship under content-hashed names (lib/assets.js), so
// their URLs cannot be listed literally. Matched by shape instead, and the
// unhashed source file is what gets checked for existence.
const HASHED_URL = /^\/(styles|app)\.[0-9a-f]{8}\.(css|js)$/;

test('every internal href resolves to a page the build emits', () => {
  const known = new Set(all.map((p) => p.path));
  for (const { path, html } of all) {
    if (!path.endsWith('/')) continue;
    const hrefs = [...html.matchAll(/href="(\/[^"#]*?)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (href.startsWith('/assets/')) {
        assert.ok(
          existsSync(join(ROOT, href.replace(/^\//, ''))),
          `${path} links to ${href}, which is not in assets/`,
        );
        continue;
      }
      const hashed = href.match(HASHED_URL);
      if (hashed) {
        const source = `${hashed[1]}.${hashed[2]}`;
        assert.ok(existsSync(join(ROOT, source)), `${path} links ${href} but ${source} is missing`);
        continue;
      }
      if (href in COPIED) {
        assert.ok(
          existsSync(join(ROOT, COPIED[href])),
          `${path} links to ${href}, but ${COPIED[href]} does not exist`,
        );
        continue;
      }
      assert.ok(known.has(href), `${path} links to ${href}, which is not built`);
    }
  }
});

test('every page is reachable from the home page in at most two hops', () => {
  const byPath = new Map(all.filter((p) => p.path.endsWith('/')).map((p) => [p.path, p.html]));
  const linksFrom = (path) =>
    [...(byPath.get(path) ?? '').matchAll(/href="(\/[^"#]*?)"/g)]
      .map((m) => m[1])
      .filter((href) => byPath.has(href));

  const reached = new Set(['/']);
  for (const first of linksFrom('/')) {
    reached.add(first);
    for (const second of linksFrom(first)) reached.add(second);
  }
  for (const path of byPath.keys()) {
    assert.ok(reached.has(path), `${path} is more than two hops from the home page`);
  }
});

test('all 50 HTML pages are emitted', () => {
  assert.equal(all.filter((p) => p.path.endsWith('/')).length, 50);
});
