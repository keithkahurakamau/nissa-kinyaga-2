export const ORIGIN = 'https://nissasafaris.com';

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function absoluteUrl(pathname) {
  return ORIGIN + pathname;
}

export function outputPath(pathname) {
  const trimmed = pathname.replace(/^\//, '');
  if (trimmed === '') return 'index.html';
  if (trimmed.endsWith('/')) return `${trimmed}index.html`;
  return trimmed;
}
