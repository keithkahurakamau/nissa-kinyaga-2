import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../data/site.js';

test('brand and contact details match the spec verbatim', () => {
  assert.equal(site.name, 'Nissa Safaris');
  assert.equal(site.guide, 'Nissa Ole Kinyaga');
  assert.equal(site.email, 'nissasafaris254@gmail.com');
  assert.equal(site.whatsapp, '254707415444');
  assert.deepEqual(site.phones, ['+254 707 415 444', '+254 722 449 514']);
  assert.equal(site.instagram, 'nissa_safaris_tours');
});

test('nav entries all have a label and an absolute path', () => {
  assert.ok(site.nav.length >= 5);
  for (const item of site.nav) {
    assert.ok(item.label, 'nav item missing label');
    assert.match(item.href, /^\/.*\/$|^\/$/, `nav href not a directory URL: ${item.href}`);
  }
});

test('workedAt lists every place from the spec', () => {
  assert.deepEqual(site.workedAt.map((w) => w.name).sort(), [
    'Angama Mara',
    'Borana Conservancy',
    'Il Ngwesi Lodge',
    'Laragai House',
    'Lewa Safari Camp',
    'Lewa Wildlife Conservancy',
    'Ol Donyo Lodge, Chyulu Hills',
    'Sarara Camp, Mathews Range',
    'Saruni Kalama',
    'Sirikoi Camp, Lewa',
    'Tassia Lodge',
    'Tsavo East',
    'Tsavo West',
  ]);
});

test('credentials keep the Silver rating last and unchanged', () => {
  assert.equal(
    site.credentials[site.credentials.length - 1],
    'Silver-rated safari guide — one of 59 in Kenya',
  );
});

test('logo and portrait point at the paths the user will supply', () => {
  assert.equal(site.logo, '/assets/logo.png');
  assert.equal(site.portrait, '/assets/portrait.jpg');
});
