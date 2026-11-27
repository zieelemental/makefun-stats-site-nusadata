// NusaData router and wiring.
//
// Routes (hash-based, so the site works from plain static files):
//   #/                 home
//   #/ekonomi          economy, default indicator
//   #/ekonomi/<ind>    economy with one indicator (gdpGrowth, gdpNominal,
//                      inflation, trade)
//   #/penduduk         population, table view
//   #/penduduk/<mode>  population, table or chart
//   #/sosial           social, default indicator
//   #/sosial/<ind>     social with one indicator (poverty, unemployment,
//                      ipm, gini)
//   #/tentang          about and sources
//
// The province table's search, island filter and sorting are in-page state:
// typing in the search box re-renders only the table, so the field keeps
// focus while you type.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { homeView, economyView, populationView, socialView, aboutView } from './views.js';

const app = document.getElementById('app');

// Province table state, kept across renders while the page is open.
const provinceState = {
  mode: 'table',
  query: '',
  island: 'Semua',
  sortKey: 'pop',
  sortDir: -1,
};

const TITLES = {
  home: 'NusaData — Statistik Indonesia',
  ekonomi: 'Data ekonomi — NusaData',
  penduduk: 'Data penduduk — NusaData',
  sosial: 'Data sosial — NusaData',
  tentang: 'Tentang NusaData',
};

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [page, arg] = raw.split('/');
  return { page: page || '', arg: arg || '' };
}

function markNav(page) {
  document.querySelectorAll('.site-nav a').forEach((a) => {
    const isCurrent = a.getAttribute('data-page') === page;
    if (isCurrent) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function render() {
  window.__shotReady = false;
  const { page, arg } = parseHash();
  let html = '';
  let title = TITLES.home;

  if (page === 'ekonomi') {
    html = economyView(arg);
    title = TITLES.ekonomi;
  } else if (page === 'penduduk') {
    provinceState.mode = arg === 'chart' ? 'chart' : 'table';
    html = populationView(provinceState);
    title = TITLES.penduduk;
  } else if (page === 'sosial') {
    html = socialView(arg);
    title = TITLES.sosial;
  } else if (page === 'tentang') {
    html = aboutView();
    title = TITLES.tentang;
  } else {
    html = homeView();
  }

  document.title = title;
  app.innerHTML = html;
  markNav(page);
  bindPage(page);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Re-render only the province table (keeps search focus and scroll).
function refreshProvinceTable() {
  const wrap = document.getElementById('province-table-wrap');
  if (!wrap) return;
  // Rebuild the table from the current view's table function by re-rendering
  // the population view and taking just its table part.
  const temp = document.createElement('div');
  temp.innerHTML = populationView(provinceState);
  const fresh = temp.querySelector('#province-table-wrap');
  if (fresh) wrap.innerHTML = fresh.innerHTML;
  bindSortButtons();
}

function bindSortButtons() {
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-sort');
      if (provinceState.sortKey === key) {
        provinceState.sortDir = -provinceState.sortDir;
      } else {
        provinceState.sortKey = key;
        provinceState.sortDir = key === 'name' || key === 'island' ? 1 : -1;
      }
      refreshProvinceTable();
    });
  });
}

function bindPage(page) {
  if (page !== 'penduduk') return;
  const search = document.getElementById('prov-search');
  if (search) {
    search.addEventListener('input', () => {
      provinceState.query = search.value;
      refreshProvinceTable();
    });
  }
  document.querySelectorAll('[data-island]').forEach((chip) => {
    chip.addEventListener('click', () => {
      provinceState.island = chip.getAttribute('data-island');
      document.querySelectorAll('[data-island]').forEach((c) => {
        const on = c.getAttribute('data-island') === provinceState.island;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      refreshProvinceTable();
    });
  });
  bindSortButtons();
}

window.addEventListener('hashchange', render);
render();
