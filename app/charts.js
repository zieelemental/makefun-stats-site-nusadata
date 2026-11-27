// Hand-rolled SVG charts. No library: each chart is a plain SVG string with
// a viewBox, so it scales to any screen and costs nothing to load.
// Every chart labels its values on the drawing itself, so it stays readable
// in a screenshot with no hover needed.

import { fmtValue } from './format.js';

const W = 720;
const H = 320;
const PAD = { top: 26, right: 18, bottom: 34, left: 58 };
const TEAL = '#0f766e';
const AMBER = '#d97706';
const SLATE = '#475569';
const GRID = '#e2e0d9';
const INK = '#1f2937';
const MUTED = '#6b7280';

// Pick 5 evenly spaced, human-round tick values covering [min, max].
function ticks(min, max) {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const stepRaw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(stepRaw));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(v);
  return { lo, hi, list: out };
}

function yLabel(v, decimals) {
  return fmtValue(v, decimals);
}

// A line chart over `years` with one series of `values`.
export function lineChart({ years, values, decimals, color = TEAL, zeroLine = false }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  const t = ticks(min - pad, max + pad);
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (i * iw) / (years.length - 1);
  const y = (v) => PAD.top + ih - ((v - t.lo) / (t.hi - t.lo)) * ih;

  let grid = '';
  for (const v of t.list) {
    grid += `<line x1="${PAD.left}" y1="${y(v)}" x2="${W - PAD.right}" y2="${y(v)}" stroke="${GRID}" stroke-width="1"/>`;
    grid += `<text x="${PAD.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="${MUTED}">${yLabel(v, decimals)}</text>`;
  }
  if (zeroLine && t.lo < 0 && t.hi > 0) {
    grid += `<line x1="${PAD.left}" y1="${y(0)}" x2="${W - PAD.right}" y2="${y(0)}" stroke="${SLATE}" stroke-width="1.5"/>`;
  }

  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  let dots = '';
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i)}" cy="${y(v)}" r="4.5" fill="${color}" stroke="#fff" stroke-width="1.5"><title>${years[i]}: ${fmtValue(v, decimals)}</title></circle>`;
    // Edge labels sit beside their dot instead of centred on it, so they
    // never collide with the y-axis tick labels at the left edge.
    const anchor = i === 0 ? 'start' : i === values.length - 1 ? 'end' : 'middle';
    const lx = i === 0 ? x(i) + 9 : i === values.length - 1 ? x(i) - 9 : x(i);
    dots += `<text x="${lx.toFixed(1)}" y="${y(v) - 11}" text-anchor="${anchor}" font-size="12.5" font-weight="600" fill="${INK}">${fmtValue(v, decimals)}</text>`;
  });
  let labels = '';
  years.forEach((yr, i) => {
    labels += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="12" fill="${MUTED}">${yr}</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik garis" xmlns="http://www.w3.org/2000/svg">${grid}<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}</svg>`;
}

// A vertical bar chart over `years` with one series of `values`.
export function barChart({ years, values, decimals, color = TEAL }) {
  const max = Math.max(...values);
  const t = ticks(0, max * 1.08);
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const slot = iw / years.length;
  const bw = Math.min(64, slot * 0.6);
  const y = (v) => PAD.top + ih - ((v - t.lo) / (t.hi - t.lo)) * ih;

  let grid = '';
  for (const v of t.list) {
    grid += `<line x1="${PAD.left}" y1="${y(v)}" x2="${W - PAD.right}" y2="${y(v)}" stroke="${GRID}" stroke-width="1"/>`;
    grid += `<text x="${PAD.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="${MUTED}">${yLabel(v, decimals)}</text>`;
  }
  let bars = '';
  values.forEach((v, i) => {
    const bx = PAD.left + i * slot + (slot - bw) / 2;
    bars += `<rect x="${bx.toFixed(1)}" y="${y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(PAD.top + ih - y(v)).toFixed(1)}" rx="3" fill="${color}"><title>${years[i]}: ${fmtValue(v, decimals)}</title></rect>`;
    bars += `<text x="${(bx + bw / 2).toFixed(1)}" y="${(y(v) - 8).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="${INK}">${fmtValue(v, decimals)}</text>`;
    bars += `<text x="${(bx + bw / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="12" fill="${MUTED}">${years[i]}</text>`;
  });

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang" xmlns="http://www.w3.org/2000/svg">${grid}${bars}</svg>`;
}

// Two series side by side per year (exports vs imports).
export function groupedBarChart({ years, seriesA, seriesB, labelA, labelB, decimals }) {
  const max = Math.max(...seriesA, ...seriesB);
  const t = ticks(0, max * 1.08);
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const slot = iw / years.length;
  const bw = Math.min(46, slot * 0.3);
  const y = (v) => PAD.top + ih - ((v - t.lo) / (t.hi - t.lo)) * ih;

  let grid = '';
  for (const v of t.list) {
    grid += `<line x1="${PAD.left}" y1="${y(v)}" x2="${W - PAD.right}" y2="${y(v)}" stroke="${GRID}" stroke-width="1"/>`;
    grid += `<text x="${PAD.left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="${MUTED}">${yLabel(v, decimals)}</text>`;
  }
  let bars = '';
  years.forEach((yr, i) => {
    const cx = PAD.left + i * slot + slot / 2;
    const a = seriesA[i];
    const b = seriesB[i];
    bars += `<rect x="${(cx - bw - 3).toFixed(1)}" y="${y(a).toFixed(1)}" width="${bw}" height="${(PAD.top + ih - y(a)).toFixed(1)}" rx="3" fill="${TEAL}"><title>${yr} ${labelA}: ${fmtValue(a, decimals)}</title></rect>`;
    bars += `<rect x="${(cx + 3).toFixed(1)}" y="${y(b).toFixed(1)}" width="${bw}" height="${(PAD.top + ih - y(b)).toFixed(1)}" rx="3" fill="${AMBER}"><title>${yr} ${labelB}: ${fmtValue(b, decimals)}</title></rect>`;
    bars += `<text x="${cx.toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="12" fill="${MUTED}">${yr}</text>`;
  });
  const legend = `<g font-size="13" fill="${INK}"><rect x="${PAD.left}" y="2" width="12" height="12" rx="2" fill="${TEAL}"/><text x="${PAD.left + 18}" y="12">${labelA}</text><rect x="${PAD.left + 130}" y="2" width="12" height="12" rx="2" fill="${AMBER}"/><text x="${PAD.left + 148}" y="12">${labelB}</text></g>`;

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang berkelompok" xmlns="http://www.w3.org/2000/svg">${legend}${grid}${bars}</svg>`;
}

// Horizontal bars: rows of {label, value}, sorted as given, with a value at
// the end of each bar. `max` scales the bars; pass the largest value.
export function hbarChart({ rows, max, decimals, color = TEAL }) {
  const rowH = 34;
  const labelW = 150;
  const valueW = 64;
  const h = 16 + rows.length * rowH + 10;
  const bw = W - labelW - valueW - 24;
  let out = '';
  rows.forEach((r, i) => {
    const y = 16 + i * rowH;
    const w = Math.max(2, (r.value / max) * bw);
    out += `<text x="${labelW - 10}" y="${y + 15}" text-anchor="end" font-size="13" fill="${INK}">${r.label}</text>`;
    out += `<rect x="${labelW}" y="${y + 4}" width="${w.toFixed(1)}" height="18" rx="3" fill="${color}"><title>${r.label}: ${fmtValue(r.value, decimals)}</title></rect>`;
    out += `<text x="${labelW + w + 8}" y="${y + 18}" font-size="13" font-weight="600" fill="${INK}">${fmtValue(r.value, decimals)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${h}" role="img" aria-label="Grafik batang horizontal" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}
