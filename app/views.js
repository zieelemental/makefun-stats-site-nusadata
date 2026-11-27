// Page views for NusaData. Each view is a pure function of its state and
// returns an HTML string; main.js renders it into #app and binds the
// controls. All numbers come from data.js — nothing is hard-coded here
// except labels and layout.

import { SERIES, HEADLINES, PROVINCES, ISLANDS, TRADE_2024, SOURCES, META, provinceShare } from './data.js';
import { lineChart, barChart, groupedBarChart, hbarChart } from './charts.js';
import { fmtValue, fmtInt, esc } from './format.js';

function sourceNote(series) {
  return `<p class="source-note">Sumber: ${esc(series.source)} · ${esc(series.note)}</p>`;
}

function dataTable(series) {
  const rows = series.years
    .map((y, i) => `<tr><th scope="row" class="num">${y}</th><td class="num">${fmtValue(series.values[i], series.decimals)}</td></tr>`)
    .join('');
  return `<table class="data-table"><caption>${esc(series.label)} (${esc(series.unit)})</caption><thead><tr><th scope="col">Tahun</th><th scope="col">Nilai</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function switcher(items, current, base) {
  return `<div class="switcher" role="group" aria-label="Pilih indikator">${items
    .map(
      ([key, label]) =>
        `<a class="chip${key === current ? ' active' : ''}" href="${base}/${key}"${key === current ? ' aria-current="true"' : ''}>${label}</a>`,
    )
    .join('')}</div>`;
}

// ---- Home -----------------------------------------------------------------

export function homeView() {
  const cards = HEADLINES.map(
    (h) => `<article class="kpi">
      <h3>${esc(h.label)}</h3>
      <p class="kpi-value num">${fmtValue(h.value, h.key === 'gdpNominal' ? 0 : 2)}<span class="kpi-unit">${esc(h.suffix)}</span></p>
      <p class="kpi-change">${esc(h.change)}</p>
      <p class="kpi-year">${esc(h.year)}</p>
    </article>`,
  ).join('');

  const g = SERIES.gdpGrowth;
  return `<section class="hero">
    <p class="eyebrow">Portal Statistik Indonesia</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Penduduk, ekonomi, dan kesejahteraan Indonesia — dari data resmi yang
    sudah diverifikasi — dalam satu tempat yang mudah dibaca di layar besar
    maupun di ponsel.</p>
    <p class="hero-meta">Data tahun terakhir yang tersedia: ${META.latestYear} · Diperbarui ${esc(META.updated)}</p>
  </section>

  <section aria-labelledby="kpi-title">
    <h2 id="kpi-title" class="section-title">Sekilas ${META.latestYear}</h2>
    <div class="kpi-grid">${cards}</div>
  </section>

  <section aria-labelledby="trend-title">
    <h2 id="trend-title" class="section-title">Tren utama: pertumbuhan ekonomi</h2>
    <div class="chart-card">
      ${lineChart({ years: g.years, values: g.values, decimals: g.decimals, zeroLine: true })}
      <p class="chart-caption">${esc(g.label)} (${esc(g.unit)}), 2020–2025. Ekonomi terkontraksi
      2,07% pada 2020 saat pandemi, lalu tumbuh stabil di kisaran 5%.</p>
      ${sourceNote(g)}
    </div>
  </section>

  <section aria-labelledby="explore-title">
    <h2 id="explore-title" class="section-title">Jelajahi datanya</h2>
    <div class="explore-grid">
      <a class="explore-card" href="#/ekonomi">
        <h3>Ekonomi</h3>
        <p>PDB Rp22.139 triliun pada 2024, inflasi 1,57%, dan perdagangan yang surplus 56 bulan berturut-turut.</p>
        <span class="explore-link">Buka data ekonomi →</span>
      </a>
      <a class="explore-card" href="#/penduduk">
        <h3>Penduduk</h3>
        <p>281,6 juta jiwa pada 2024 — 55,7% tinggal di Pulau Jawa. Lihat tabel 38 provinsi yang bisa dicari dan diurutkan.</p>
        <span class="explore-link">Buka data penduduk →</span>
      </a>
      <a class="explore-card" href="#/sosial">
        <h3>Sosial</h3>
        <p>Kemiskinan turun ke 8,57%, pengangguran 4,91%, dan IPM naik ke 75,02 pada 2024.</p>
        <span class="explore-link">Buka data sosial →</span>
      </a>
    </div>
  </section>`;
}

// ---- Economy ---------------------------------------------------------------

const ECONOMY_ITEMS = [
  ['gdpGrowth', 'Pertumbuhan PDB'],
  ['gdpNominal', 'PDB nominal'],
  ['inflation', 'Inflasi'],
  ['trade', 'Perdagangan'],
];

export function economyView(indicator) {
  const key = ECONOMY_ITEMS.some(([k]) => k === indicator) ? indicator : 'gdpGrowth';
  let body = `<h1>Data ekonomi</h1>
  <p class="lede">Produk domestik bruto, inflasi, dan perdagangan luar negeri Indonesia,
  2020–2025. Pilih indikator di bawah untuk mengganti grafik dan tabel.</p>
  ${switcher(ECONOMY_ITEMS, key, '#/ekonomi')}`;

  if (key === 'trade') {
    body += `<div class="chart-card">
      ${groupedBarChart({ years: SERIES.exports.years, seriesA: SERIES.exports.values, seriesB: SERIES.imports.values, labelA: 'Ekspor', labelB: 'Impor', decimals: 2 })}
      <p class="chart-caption">Ekspor dan impor barang (US$ miliar), 2020–2024.</p>
      ${sourceNote(SERIES.exports)}
    </div>
    <div class="kpi-grid">
      <article class="kpi"><h3>Ekspor 2024</h3><p class="kpi-value num">US$${fmtValue(TRADE_2024.exports, 2)} <span class="kpi-unit">miliar</span></p><p class="kpi-change">+2,29% dari 2023</p><p class="kpi-year">BPS / Kemenkeu</p></article>
      <article class="kpi"><h3>Impor 2024</h3><p class="kpi-value num">US$${fmtValue(TRADE_2024.imports, 2)} <span class="kpi-unit">miliar</span></p><p class="kpi-change">+5,3% dari 2023</p><p class="kpi-year">BPS / Kemenkeu</p></article>
      <article class="kpi"><h3>Surplus perdagangan</h3><p class="kpi-value num">US$${fmtValue(TRADE_2024.surplus, 2)} <span class="kpi-unit">miliar</span></p><p class="kpi-change">Surplus ${TRADE_2024.surplusMonths} bulan berturut-turut sejak ${esc(TRADE_2024.surplusSince)}</p><p class="kpi-year">BPS / Kemenkeu</p></article>
    </div>
    <div class="two-col">${dataTable(SERIES.exports)}${dataTable(SERIES.imports)}</div>`;
  } else {
    const s = SERIES[key];
    const chart = key === 'gdpNominal'
      ? barChart({ years: s.years, values: s.values, decimals: s.decimals })
      : lineChart({ years: s.years, values: s.values, decimals: s.decimals, zeroLine: key === 'gdpGrowth' });
    body += `<div class="chart-card">
      ${chart}
      <p class="chart-caption">${esc(s.label)} (${esc(s.unit)}), ${s.years[0]}–${s.years[s.years.length - 1]}.</p>
      ${sourceNote(s)}
    </div>
    <div class="two-col">
      ${dataTable(s)}
      <aside class="note-card">
        <h2>Yang perlu diketahui</h2>
        ${key === 'gdpGrowth' ? `<p>Pertumbuhan 2025 sebesar 5,11% — akselerasi dari 5,03% pada 2024, menurut publikasi Pendapatan Nasional Indonesia 2021–2025 (BPS, Juni 2026).</p>` : ''}
        ${key === 'gdpNominal' ? `<p>PDB per kapita 2024 mencapai Rp78,61 juta, setara US$4.960,3 (BPS). PDB nominal naik 40% dalam lima tahun, dari Rp16.977 triliun pada 2021 ke Rp23.821 triliun pada 2025.</p>` : ''}
        ${key === 'inflation' ? `<p>Inflasi melonjak ke 5,51% pada 2022 saat harga energi global naik, lalu kembali ke dalam sasaran 2,5% ± 1% pada 2023–2024. Pada 2025 inflasi kembali naik ke 2,92%.</p>` : ''}
      </aside>
    </div>`;
  }
  return body;
}

// ---- Population ------------------------------------------------------------

function provinceRows(state) {
  const q = state.query.trim().toLowerCase();
  let rows = PROVINCES.filter((p) => (!q || p.name.toLowerCase().includes(q)) && (state.island === 'Semua' || p.island === state.island));
  const dir = state.sortDir;
  rows = [...rows].sort((a, b) => {
    if (state.sortKey === 'name') return dir * a.name.localeCompare(b.name, 'id');
    if (state.sortKey === 'island') return dir * a.island.localeCompare(b.island, 'id');
    if (state.sortKey === 'share') return dir * (provinceShare(a.pop) - provinceShare(b.pop));
    return dir * (a.pop - b.pop);
  });
  return rows;
}

function provinceTable(state) {
  const rows = provinceRows(state);
  const arrow = (key) => (state.sortKey === key ? (state.sortDir === 1 ? ' ▲' : ' ▼') : '');
  const head = `<thead><tr>
    <th scope="col"><button class="sort-btn" data-sort="name" type="button">Provinsi${arrow('name')}</button></th>
    <th scope="col"><button class="sort-btn" data-sort="island" type="button">Pulau${arrow('island')}</button></th>
    <th scope="col"><button class="sort-btn" data-sort="pop" type="button">Penduduk (juta)${arrow('pop')}</button></th>
    <th scope="col"><button class="sort-btn" data-sort="share" type="button">Pangsa (%)${arrow('share')}</button></th>
  </tr></thead>`;
  const body = rows.length
    ? rows
        .map(
          (p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.island)}</td><td class="num">${fmtValue(p.pop, 1)}</td><td class="num">${fmtValue(provinceShare(p.pop), 1)}</td></tr>`,
        )
        .join('')
    : `<tr><td colspan="4" class="empty">Tidak ada provinsi yang cocok dengan pencarian “${esc(state.query)}”.</td></tr>`;
  return `<table class="data-table province-table"><caption>Jumlah penduduk menurut provinsi, 2024 (38 provinsi)</caption>${head}<tbody>${body}</tbody></table>
  <p class="table-foot">Menampilkan ${rows.length} dari 38 provinsi · BPS 2024, angka dibulatkan ke 0,1 juta jiwa; jumlah provinsi yang dibulatkan adalah 281,4 juta, sedangkan total nasional 281,6 juta — selisihnya pembulatan.</p>`;
}

export function populationView(state) {
  const mode = state.mode === 'chart' ? 'chart' : 'table';
  const p = SERIES.population;
  const top10 = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
  const javaShare = PROVINCES.filter((x) => x.island === 'Jawa').reduce((s, x) => s + x.pop, 0) / META.nationalPopulation2024 * 100;

  let body = `<h1>Data penduduk</h1>
  <p class="lede">Jumlah penduduk Indonesia ${fmtValue(META.nationalPopulation2024, 1)} juta jiwa pada 2024 —
  negara berpenduduk terbesar keempat di dunia. Pulau Jawa menampung ${fmtValue(javaShare, 1)}% penduduk,
  meski luasnya hanya sekitar 7% wilayah Indonesia.</p>
  <div class="chart-card">
    ${lineChart({ years: p.years, values: p.values, decimals: p.decimals })}
    <p class="chart-caption">${esc(p.label)} (${esc(p.unit)}), 2020–2025.</p>
    ${sourceNote(p)}
  </div>
  <div class="view-toggle" role="group" aria-label="Tampilan data provinsi">
    <a class="chip${mode === 'table' ? ' active' : ''}" href="#/penduduk/table"${mode === 'table' ? ' aria-current="true"' : ''}>Tabel provinsi</a>
    <a class="chip${mode === 'chart' ? ' active' : ''}" href="#/penduduk/chart"${mode === 'chart' ? ' aria-current="true"' : ''}>Grafik 10 besar</a>
  </div>`;

  if (mode === 'chart') {
    body += `<div class="chart-card">
      ${hbarChart({ rows: top10.map((x) => ({ label: x.name, value: x.pop })), max: top10[0].pop, decimals: 1 })}
      <p class="chart-caption">10 provinsi berpenduduk terbanyak, 2024 (juta jiwa). Tiga provinsi di Pulau Jawa — Jawa Barat, Jawa Timur, Jawa Tengah — mencakup 46,2% penduduk nasional.</p>
      ${sourceNote(p)}
    </div>`;
  } else {
    const chips = ['Semua', ...ISLANDS]
      .map(
        (isl) => `<button class="chip${state.island === isl ? ' active' : ''}" data-island="${esc(isl)}" type="button" aria-pressed="${state.island === isl}">${esc(isl)}</button>`,
      )
      .join('');
    body += `<div class="filter-bar">
      <label class="search-label" for="prov-search">Cari provinsi</label>
      <input id="prov-search" name="provinsi" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Contoh: Jawa Barat…" value="${esc(state.query)}">
      <div class="chip-row" role="group" aria-label="Saring menurut pulau">${chips}</div>
    </div>
    <div id="province-table-wrap">${provinceTable(state)}</div>`;
  }
  return body;
}

// ---- Social ----------------------------------------------------------------

const SOCIAL_ITEMS = [
  ['poverty', 'Kemiskinan'],
  ['unemployment', 'Pengangguran'],
  ['ipm', 'IPM'],
  ['gini', 'Gini'],
];

export function socialView(indicator) {
  const key = SOCIAL_ITEMS.some(([k]) => k === indicator) ? indicator : 'poverty';
  const s = SERIES[key];
  let aside = '';
  if (key === 'poverty') {
    aside = `<p>Pada Maret 2025, tingkat kemiskinan turun lagi ke 8,47% — 23,85 juta jiwa — terendah dalam dua dekade. Garis kemiskinan nasional saat itu Rp609.160 per kapita per bulan. Kemiskinan pedesaan (11,03%) masih jauh di atas perkotaan (6,73%).</p>`;
  } else if (key === 'unemployment') {
    aside = `<p>Pengangguran terus menurun sejak puncak pandemi. Pada Februari 2025, TPT mencapai 4,76% — terendah sejak krisis 1998. Angkatan kerja Agustus 2024 tercatat 155,27 juta orang; 147,91 juta bekerja dan 7,35 juta menganggur.</p>`;
  } else if (key === 'ipm') {
    aside = `<p>IPM mengukur umur panjang dan hidup sehat, pengetahuan, dan standar hidup layak. Pada 2024 Indonesia masuk kategori pembangunan manusia “tinggi” (70–80). IPM naik 0,63 poin dari 2023.</p>`;
  } else {
    aside = `<p>Rasio gini 0 berarti pemerataan sempurna dan 1 berarti ketimpangan total. Angka Indonesia bergerak tipis di 0,38–0,39 selama lima tahun terakhir — ketimpangan pengeluaran relatif stabil.</p>`;
  }
  return `<h1>Data sosial</h1>
  <p class="lede">Kemiskinan, pengangguran, pembangunan manusia, dan ketimpangan — empat
  ukuran kesejahteraan yang paling sering dicari. Pilih indikator untuk mengganti grafik dan tabel.</p>
  ${switcher(SOCIAL_ITEMS, key, '#/sosial')}
  <div class="chart-card">
    ${lineChart({ years: s.years, values: s.values, decimals: s.decimals })}
    <p class="chart-caption">${esc(s.label)} (${esc(s.unit)}), ${s.years[0]}–${s.years[s.years.length - 1]}.</p>
    ${sourceNote(s)}
  </div>
  <div class="two-col">
    ${dataTable(s)}
    <aside class="note-card"><h2>Yang perlu diketahui</h2>${aside}</aside>
  </div>`;
}

// ---- About -----------------------------------------------------------------

export function aboutView() {
  const list = SOURCES.map(
    (s) => `<li><strong>${esc(s.publisher)}</strong> (${esc(s.year)}) — ${esc(s.items)}</li>`,
  ).join('');
  return `<h1>Tentang NusaData</h1>
  <p class="lede">NusaData adalah portal statistik Indonesia yang disusun secara independen
  dari publikasi resmi. Situs ini bukan situs Badan Pusat Statistik dan tidak
  berafiliasi dengan BPS atau lembaga pemerintah mana pun.</p>

  <section aria-labelledby="about-how">
    <h2 id="about-how" class="section-title">Cara kerja situs ini</h2>
    <p>Setiap angka di situs ini diambil dari publikasi resmi dan dicantumkan sumber
    serta tahun datanya di samping angka tersebut. Grafik dibuat dari data yang sama
    dengan tabel di bawahnya, jadi yang Anda lihat di grafik bisa diperiksa di tabel.
    Situs ini berjalan sepenuhnya dari berkasnya sendiri — tanpa permintaan jaringan —
    sehingga bisa dibuka di mana saja, termasuk di ponsel dengan koneksi lambat.</p>
    <p>Angka provinsi dibulatkan ke 0,1 juta jiwa. Karena pembulatan, jumlah ke-38 provinsi
    (281,4 juta) sedikit berbeda dari total nasional (281,6 juta). Angka seri tahunan
    ditampilkan apa adanya dari sumbernya; di mana tersedia angka 2025 yang sudah dirilis
    resmi, angka itu ikut ditampilkan dan diberi catatan.</p>
  </section>

  <section aria-labelledby="about-sources">
    <h2 id="about-sources" class="section-title">Sumber data</h2>
    <ul class="source-list">${list}</ul>
    <p>Untuk angka terbaru, rujuk langsung ke publikasi resmi penerbit di atas.
    Bila menemukan angka yang keliru, catat sumber dan tahunnya — koreksi selalu
    berangkat dari publikasi resmi, bukan dari ingatan.</p>
  </section>

  <section aria-labelledby="about-cite">
    <h2 id="about-cite" class="section-title">Cara mengutip</h2>
    <p>Contoh: “Jumlah penduduk Indonesia 281,6 juta jiwa pada 2024 (BPS, dikutip
    dari NusaData, November 2026).” Cantumkan selalu sumber aslinya — BPS, Bank
    Indonesia, atau Kementerian Keuangan — karena merekalah penerbit datanya.</p>
  </section>`;
}
