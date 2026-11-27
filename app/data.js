// Data for NusaData — Portal Statistik Indonesia.
//
// Every figure below was checked against a published source before it was
// written here. Sources are named per series (see SOURCES) and shown on the
// site next to each figure. Population figures by province are BPS 2024,
// rounded to 0.1 million; the national total is 281.6 million, so the rounded
// province figures sum to 281.4 million — the 0.2 gap is rounding, and the
// site says so next to the table.

export const META = {
  country: 'Indonesia',
  latestYear: 2024,
  updated: 'November 2026',
  nationalPopulation2024: 281.6,
};

// A series is one indicator over time. `years` and `values` line up by index.
// `decimals` is how many decimals the chart labels show. `source` names the
// publisher; `note` is the short label the site shows under the chart.
export const SERIES = {
  population: {
    label: 'Jumlah penduduk',
    unit: 'juta jiwa',
    decimals: 2,
    source: 'BPS',
    note: 'BPS, Sensus Penduduk 2020 dan proyeksi penduduk; 2024 dari SP2024. Angka 2025 adalah proyeksi BPS.',
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    values: [270.2, 272.25, 275.77, 278.69, 281.6, 284.44],
  },
  gdpGrowth: {
    label: 'Pertumbuhan ekonomi (PDB)',
    unit: '% yoy',
    decimals: 2,
    source: 'BPS',
    note: 'BPS, Berita Resmi Statistik 5 Februari 2025 dan publikasi Pendapatan Nasional Indonesia 2021–2025.',
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    values: [-2.07, 3.7, 5.31, 5.05, 5.03, 5.11],
  },
  gdpNominal: {
    label: 'PDB atas dasar harga berlaku',
    unit: 'Rp triliun',
    decimals: 0,
    source: 'BPS',
    note: 'BPS, Pendapatan Nasional Indonesia 2021–2025. PDB per kapita 2024: Rp78,61 juta (US$4.960,3).',
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    values: [15434, 16977, 18587, 20168, 22139, 23821],
  },
  inflation: {
    label: 'Inflasi tahunan (IHK, Desember ke Desember)',
    unit: '% yoy',
    decimals: 2,
    source: 'BPS / Bank Indonesia',
    note: 'BPS dan Bank Indonesia, tabel Target Inflasi. Sasaran inflasi 2024–2027: 2,5% ± 1%.',
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    values: [1.68, 1.87, 5.51, 2.61, 1.57, 2.92],
  },
  poverty: {
    label: 'Persentase penduduk miskin',
    unit: '%',
    decimals: 2,
    source: 'BPS',
    note: 'BPS, kondisi September tiap tahun. Maret 2025: 8,47% (23,85 juta jiwa); garis kemiskinan Rp609.160 per kapita per bulan.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [10.19, 9.71, 9.57, 9.36, 8.57],
  },
  unemployment: {
    label: 'Tingkat Pengangguran Terbuka (TPT)',
    unit: '%',
    decimals: 2,
    source: 'BPS',
    note: 'BPS, Sakernas Agustus tiap tahun. Februari 2025: 4,76% — terendah sejak krisis 1998.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [7.07, 6.49, 5.86, 5.32, 4.91],
  },
  ipm: {
    label: 'Indeks Pembangunan Manusia (IPM)',
    unit: 'skala 0–100',
    decimals: 2,
    source: 'BPS',
    note: 'BPS, publikasi Indeks Pembangunan Manusia. Kategori 2024: tinggi.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [71.94, 72.29, 73.37, 74.39, 75.02],
  },
  gini: {
    label: 'Rasio gini (ketimpangan pengeluaran)',
    unit: 'rasio 0–1',
    decimals: 3,
    source: 'BPS',
    note: 'BPS, kondisi September tiap tahun. Maret 2024: 0,379.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [0.385, 0.381, 0.381, 0.379, 0.381],
  },
  exports: {
    label: 'Ekspor barang',
    unit: 'US$ miliar',
    decimals: 2,
    source: 'BPS / Kemenkeu',
    note: 'BPS, diolah Kemenkeu (BKF). 2024 naik 2,29% dari 2023.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [163.19, 231.61, 291.9, 258.82, 264.7],
  },
  imports: {
    label: 'Impor barang',
    unit: 'US$ miliar',
    decimals: 2,
    source: 'BPS / Kemenkeu',
    note: 'BPS, diolah Kemenkeu (BKF). 2024 naik 5,3% dari 2023.',
    years: [2020, 2021, 2022, 2023, 2024],
    values: [141.57, 196.27, 237.44, 221.93, 233.66],
  },
};

// Trade balance, 2024: exports minus imports, and how long the surplus streak ran.
export const TRADE_2024 = {
  exports: 264.7,
  imports: 233.66,
  surplus: 31.04,
  surplusMonths: 56,
  surplusSince: 'Mei 2020',
};

// Headline cards on the home page. `change` is the short comparison shown
// under the number; `year` is the reference period of the figure.
export const HEADLINES = [
  {
    key: 'population',
    label: 'Penduduk',
    value: 281.6,
    suffix: ' juta jiwa',
    change: '+1,04% dari 2023',
    year: '2024 · BPS',
  },
  {
    key: 'gdpNominal',
    label: 'PDB',
    value: 22139,
    suffix: ' Rp triliun',
    change: 'Tumbuh 5,03% pada 2024',
    year: '2024 · BPS',
  },
  {
    key: 'inflation',
    label: 'Inflasi tahunan',
    value: 1.57,
    suffix: '%',
    change: 'Turun dari 2,61% (2023)',
    year: 'Des 2024 · BPS',
  },
  {
    key: 'unemployment',
    label: 'Pengangguran (TPT)',
    value: 4.91,
    suffix: '%',
    change: 'Turun dari 5,32% (Agu 2023)',
    year: 'Agu 2024 · BPS',
  },
  {
    key: 'poverty',
    label: 'Penduduk miskin',
    value: 8.57,
    suffix: '%',
    change: 'Turun dari 9,36% (Sep 2023)',
    year: 'Sep 2024 · BPS',
  },
  {
    key: 'ipm',
    label: 'Indeks Pembangunan Manusia',
    value: 75.02,
    suffix: '',
    change: 'Naik dari 74,39 (2023)',
    year: '2024 · BPS',
  },
];

// Population by province, BPS 2024, in millions of people, rounded to 0.1.
// `island` is the island group used by the table filter.
export const PROVINCES = [
  { name: 'Jawa Barat', island: 'Jawa', pop: 50.3 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.8 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.9 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 15.6 },
  { name: 'Banten', island: 'Jawa', pop: 12.4 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.7 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.5 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.4 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 8.8 },
  { name: 'Riau', island: 'Sumatera', pop: 6.7 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.8 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 5.8 },
  { name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', pop: 5.7 },
  { name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', pop: 5.6 },
  { name: 'Aceh', island: 'Sumatera', pop: 5.6 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.2 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop: 4.3 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop: 4.0 },
  { name: 'Jambi', island: 'Sumatera', pop: 3.7 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop: 3.8 },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', pop: 3.1 },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', pop: 2.8 },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', pop: 2.8 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', pop: 2.7 },
  { name: 'Kepulauan Riau', island: 'Sumatera', pop: 2.2 },
  { name: 'Bengkulu', island: 'Sumatera', pop: 2.1 },
  { name: 'Maluku', island: 'Maluku & Papua', pop: 2.0 },
  { name: 'Sulawesi Barat', island: 'Sulawesi', pop: 1.6 },
  { name: 'Kepulauan Bangka Belitung', island: 'Sumatera', pop: 1.5 },
  { name: 'Papua Pegunungan', island: 'Maluku & Papua', pop: 1.5 },
  { name: 'Maluku Utara', island: 'Maluku & Papua', pop: 1.4 },
  { name: 'Papua Tengah', island: 'Maluku & Papua', pop: 1.4 },
  { name: 'Gorontalo', island: 'Sulawesi', pop: 1.2 },
  { name: 'Papua', island: 'Maluku & Papua', pop: 1.1 },
  { name: 'Kalimantan Utara', island: 'Kalimantan', pop: 0.7 },
  { name: 'Papua Barat Daya', island: 'Maluku & Papua', pop: 0.6 },
  { name: 'Papua Barat', island: 'Maluku & Papua', pop: 0.6 },
  { name: 'Papua Selatan', island: 'Maluku & Papua', pop: 0.5 },
];

export const ISLANDS = ['Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'];

// The sources the site cites, shown on the About page.
export const SOURCES = [
  {
    publisher: 'Badan Pusat Statistik (BPS)',
    items: 'Jumlah penduduk & proyeksi penduduk; Pertumbuhan ekonomi dan PDB; Inflasi IHK; Tingkat Pengangguran Terbuka (Sakernas); Persentase penduduk miskin; Indeks Pembangunan Manusia; Rasio gini; Ekspor–impor.',
    year: '2020–2025',
  },
  {
    publisher: 'Bank Indonesia',
    items: 'Tabel Target Inflasi — inflasi aktual tahunan (yoy) dan sasaran inflasi 2,5% ± 1%.',
    year: '2020–2025',
  },
  {
    publisher: 'Kementerian Keuangan (BKF / DJKN)',
    items: 'Siaran pers neraca perdagangan 2024: ekspor, impor, dan surplus perdagangan.',
    year: '2024',
  },
];

export function provinceShare(pop) {
  return (pop / META.nationalPopulation2024) * 100;
}
