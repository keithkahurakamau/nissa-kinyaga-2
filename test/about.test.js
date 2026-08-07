import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../build.js';
import site from '../data/site.js';

const about = new Map(pages().map((p) => [p.path, p.html])).get('/about/');

test('the about page exists', () => {
  assert.ok(about);
});

test('carries Person schema anchored to #nissa', () => {
  assert.match(about, /"@type":"Person"/);
  assert.match(about, /"@id":"https:\/\/nissasafaris\.com\/about\/#nissa"/);
});

test('shows the portrait', () => {
  assert.ok(about.includes(site.portrait));
});

test('retains the biographical facts from the source document', () => {
  for (const fact of [
    'Mukogodo', 'Lewa', 'Kenya Utalii College', 'ornithology',
    'social anthropology', 'Kenya Wildlife Service', 'distinction',
  ]) {
    assert.ok(about.toLowerCase().includes(fact.toLowerCase()), `about page lost: ${fact}`);
  }
});

test('carries every year Nissa stated explicitly', () => {
  for (const year of ['1997', '1998', '1999', '2002', '2009', '2011', '2024']) {
    assert.ok(about.includes(year), `about page omits the year ${year}`);
  }
});

test('names every place Nissa has worked', () => {
  for (const place of site.workedAt) {
    assert.ok(about.includes(place.name), `about page omits ${place.name}`);
  }
});

test('never mentions Lengishu', () => {
  assert.doesNotMatch(about, /Lengishu/i);
});

test('does not claim he currently guides at a single lodge', () => {
  assert.doesNotMatch(about, /Today I guide at/i);
});

test('lists the four services he offers', () => {
  for (const service of ['light', 'odge', 'ransfer', 'uiding']) {
    assert.ok(about.includes(service), `about page omits a service containing "${service}"`);
  }
});

test('retains the attributed pull-quote', () => {
  assert.ok(about.includes('Carrier'));
  assert.match(about, /<blockquote/);
});
