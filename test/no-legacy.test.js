import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { pages } from '../build.js';

test('the legacy single-page index.html is gone', () => {
  assert.equal(existsSync(new URL('../index.html', import.meta.url)), false);
});

test('no page still refers to the old brand-as-title', () => {
  for (const { path, html } of pages()) {
    if (!path.endsWith('/')) continue;
    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
    assert.doesNotMatch(title, /Conservation Storyteller/, `${path} keeps the old title`);
  }
});

test('the placeholder price warning is still greppable before launch', () => {
  const source = readFileSync(new URL('../data/packages.js', import.meta.url), 'utf8');
  assert.match(source, /PLACEHOLDER, EDIT BEFORE LAUNCH/);
});

test('the launch checklist exists and names the two blocking assets', () => {
  const checklist = readFileSync(new URL('../docs/LAUNCH-CHECKLIST.md', import.meta.url), 'utf8');
  assert.match(checklist, /assets\/logo\.png/);
  assert.match(checklist, /assets\/portrait\.jpg/);
});
