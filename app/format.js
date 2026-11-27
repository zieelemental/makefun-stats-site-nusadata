// Number formatting for the site, using the visitor's locale conventions
// for Indonesian numbers (comma decimal, dot thousands).

const id1 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const id2 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const id3 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const idInt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

// Format a value with the series' own decimal count.
export function fmtValue(value, decimals) {
  if (decimals === 0) return idInt.format(value);
  if (decimals === 1) return id1.format(value);
  if (decimals === 3) return id3.format(value);
  return id2.format(value);
}

// Format a large whole number with dot thousands separators, e.g. 22.139.
export function fmtInt(value) {
  return idInt.format(value);
}

// Escape text that goes into HTML, so province names and labels can never
// break the markup.
export function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
