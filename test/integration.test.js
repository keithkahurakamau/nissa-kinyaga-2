import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';

const all = pages();

test('every internal href resolves to a page the build emits', () => {
  const known = new Set(all.map((p) => p.path));
  for (const { path, html } of all) {
    if (!path.endsWith('/')) continue;
    const hrefs = [...html.matchAll(/href="(\/[^"#]*?)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (href.startsWith('/assets/') || href === '/styles.css' || href === '/app.js') continue;
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

test('all 37 HTML pages are emitted', () => {
  assert.equal(all.filter((p) => p.path.endsWith('/')).length, 37);
});
