const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const RAW = Symbol('raw-html');

export function escape(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function raw(value) {
  return { [RAW]: String(value) };
}

function interpolate(value) {
  if (value === null || value === undefined || value === false) return '';
  if (Array.isArray(value)) return value.map(interpolate).join('');
  if (typeof value === 'object' && RAW in value) return value[RAW];
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += interpolate(values[i]) + strings[i + 1];
  }
  return raw(out);
}

export function renderToString(node) {
  return interpolate(node);
}
