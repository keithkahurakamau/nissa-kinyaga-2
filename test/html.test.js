import test from 'node:test';
import assert from 'node:assert/strict';
import { escape, raw, html, renderToString } from '../lib/html.js';

test('escape() neutralises all five HTML metacharacters', () => {
  assert.equal(escape(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});

test('escape() coerces non-strings', () => {
  assert.equal(escape(42), '42');
});

test('html() escapes interpolated values', () => {
  const name = '<script>alert(1)</script>';
  assert.equal(
    renderToString(html`<h1>${name}</h1>`),
    '<h1>&lt;script&gt;alert(1)&lt;/script&gt;</h1>'
  );
});

test('html() does not escape literal template text', () => {
  assert.equal(renderToString(html`<p class="a">hi</p>`), '<p class="a">hi</p>');
});

test('html() nests without double-escaping', () => {
  const inner = html`<em>R&amp;D</em>`;
  assert.equal(renderToString(html`<p>${inner}</p>`), '<p><em>R&amp;D</em></p>');
});

test('html() joins arrays with no separator', () => {
  const items = ['a', 'b'].map((x) => html`<li>${x}</li>`);
  assert.equal(renderToString(html`<ul>${items}</ul>`), '<ul><li>a</li><li>b</li></ul>');
});

test('html() renders null, undefined and false as empty', () => {
  assert.equal(renderToString(html`<p>${null}${undefined}${false}</p>`), '<p></p>');
});

test('html() renders 0 as "0", not empty', () => {
  assert.equal(renderToString(html`<p>${0}</p>`), '<p>0</p>');
});

test('raw() opts out of escaping', () => {
  assert.equal(renderToString(html`<div>${raw('<br>')}</div>`), '<div><br></div>');
});
