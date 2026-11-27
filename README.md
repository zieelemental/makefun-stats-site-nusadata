# NusaData — Portal Statistik Indonesia

Situs statistik nasional Indonesia: penduduk, ekonomi, dan kesejahteraan
dari data resmi yang sudah terverifikasi — dalam satu halaman yang mudah
dibaca di layar besar maupun di ponsel.

## Isi situs

- **Beranda** — ringkasan 2024 dalam 6 kartu KPI (penduduk, PDB, inflasi,
  pengangguran, kemiskinan, IPM), grafik tren pertumbuhan ekonomi, dan
  tautan jelajah ke tiap halaman.
- **Ekonomi** — pemilih indikator (pertumbuhan PDB, PDB nominal, inflasi,
  perdagangan) dengan grafik garis, grafik batang impor–ekspor, dan tabel
  per tahun yang berubah mengikuti indikator.
- **Penduduk** — grafik tren 2020–2025, tabel 38 provinsi yang bisa dicari
  namanya, disaring menurut pulau, dan diurutkan menurut kolom; ada juga
  grafik 10 provinsi terbesar.
- **Sosial** — pemilih indikator (kemiskinan, pengangguran, IPM, gini)
  dengan grafik dan tabel per tahun plus catatan penjelasan.
- **Tentang** — cara kerja situs, daftar sumber lengkap, dan cara mengutip.

Semua angka mencantumkan sumber dan tahun datanya di samping angka
tersebut. Situs ini kompilasi independen — bukan situs BPS dan tidak
berafiliasi dengan BPS atau lembaga pemerintah mana pun.

## Angka kunci (2024)

| Indikator | Nilai | Sumber |
| --- | --- | --- |
| Penduduk | 281,60 juta jiwa (+1,04%) | BPS |
| PDB nominal | Rp22.139 triliun | BPS |
| Pertumbuhan PDB | 5,03% yoy | BPS |
| Inflasi (Des) | 1,57% yoy | BPS / Bank Indonesia |
| Pengangguran (TPT, Agu) | 4,91% | BPS |
| Kemiskinan (Sep) | 8,57% | BPS |
| IPM | 75,02 | BPS |
| Ekspor | US$264,70 miliar; impor US$233,66 miliar; surplus US$31,04 miliar | BPS |

## Cara menjalankan

Situs ini berkas statis biasa — tidak ada build step dan tidak ada
permintaan jaringan. Untuk menguji secara lokal:

```sh
node serve.ts --port 8901
# lalu buka http://localhost:8901/
```

## Struktur

```
main.ts            program penyerahan (menyalin app/ + screenshots/ ke
                   /output dan menulis dossier.json)
serve.ts           server statis kecil untuk pengujian lokal (bukan bagian
                   dari situs)
app/
  index.html       kerangka halaman (header, nav, footer)
  style.css        tata letak, tipografi, kartu, tabel, responsif
  charts.css       tampilan grafik SVG
  main.js          router hash + interaksi (cari, saring, urutkan)
  views.js         template tiap halaman
  charts.js        grafik SVG buatan sendiri (garis, batang, batang ganda,
                   batang horizontal) — tanpa library eksternal
  data.js          semua data + sumber
  format.js        format angka id-ID + escaping HTML
vendor/
  makefun-frontend.ts   library kit (tidak diubah)
screenshots/
  1-cover.jpg      beranda, desktop 1280×1000
  2-ekonomi.jpg    halaman ekonomi, desktop 1280×800
  3-penduduk.jpg   halaman penduduk, desktop 1280×800
  4-ponsel.jpg     beranda, ponsel 390×844
```

## Lisensi

MIT — lihat `LICENSE`.
