import test from 'node:test';
import assert from 'node:assert/strict';
import { ORIGIN, slugify, absoluteUrl, outputPath } from '../lib/paths.js';

test('ORIGIN is the canonical two-s domain', () => {
  assert.equal(ORIGIN, 'https://nissasafaris.com');
});

test('slugify lowercases and hyphenates', () => {
  assert.equal(slugify('3-Day Masai Mara Classic'), '3-day-masai-mara-classic');
});

test('slugify strips punctuation and collapses separators', () => {
  assert.equal(slugify('Mount Kenya — Sirimon to Chogoria'), 'mount-kenya-sirimon-to-chogoria');
  assert.equal(slugify('Tsavo East & Tsavo West'), 'tsavo-east-tsavo-west');
});

test('slugify trims leading and trailing hyphens', () => {
  assert.equal(slugify('  --Diani Beach--  '), 'diani-beach');
});

test('absoluteUrl joins origin and path', () => {
  assert.equal(absoluteUrl('/safaris/'), 'https://nissasafaris.com/safaris/');
  assert.equal(absoluteUrl('/'), 'https://nissasafaris.com/');
});

test('outputPath maps directory URLs to index.html', () => {
  assert.equal(outputPath('/'), 'index.html');
  assert.equal(outputPath('/safaris/'), 'safaris/index.html');
  assert.equal(outputPath('/safaris/3-day-masai-mara-classic/'), 'safaris/3-day-masai-mara-classic/index.html');
});

test('outputPath passes through file URLs', () => {
  assert.equal(outputPath('/sitemap.xml'), 'sitemap.xml');
});
