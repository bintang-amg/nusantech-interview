# Movie Explorer

Aplikasi web untuk menelusuri film menggunakan data dari [TMDB API](https://developer.themoviedb.org/docs). Dibangun dengan **React + TypeScript + Tailwind CSS**, dengan unit test menggunakan **React Testing Library**.

## Fitur

- **Daftar film** — mengambil data dari TMDB dan menampilkannya sebagai kartu berisi poster, judul, tahun rilis, dan rating.
- **Pencarian film** — mencari film berdasarkan judul (debounced, memanggil endpoint `/search/movie`).
- **Filter kategori** — Now Playing, Popular, Top Rated, Upcoming.
- **Halaman detail film** — sinopsis, sutradara, pemain utama, poster & backdrop, plus tombol **Back**.
- **Pagination** — infinite scroll (IntersectionObserver) sekaligus tombol **Load more** sebagai fallback.
- **Penanganan error & loading state**

## Tech Stack

| Kebutuhan   | Teknologi                          |
| ----------- | ---------------------------------- |
| UI          | React 18                           |
| Bahasa      | TypeScript                         |
| Styling     | Tailwind CSS                       |
| Routing     | React Router v6                    |
| HTTP client | Axios                              |
| Testing     | Vitest + React Testing Library     |
| Build tool  | Vite                               |
| Deploy      | Vercel (Edge Function sebagai proxy) |

## Struktur Proyek

```
.
├── api/
│   └── proxy.ts               # Edge Function: proxy ke TMDB + suntik API key (produksi/Vercel)
├── src/
│   ├── api/
│   │   └── tmdb.ts            # Semua akses jaringan & error handling terpusat di sini
│   ├── components/            # Komponen presentasional & reusable (TANPA pemanggilan API)
│   │   ├── ui/                # Button, SearchBar, Spinner, ErrorMessage, EmptyState, RatingBadge
│   │   ├── MovieCard.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── CastList.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── config/
│   │   └── env.ts             # Konfigurasi non-rahasia (base URL, image CDN)
│   ├── hooks/                 # Logika data & state
│   │   ├── useMovies.ts       # Fetch + pagination + error state
│   │   ├── useMovieDetail.ts
│   │   ├── useDebounce.ts
│   │   └── useInfiniteScroll.ts
│   ├── pages/
│   │   ├── MovieListPage.tsx
│   │   └── MovieDetailPage.tsx
│   ├── types/
│   │   └── tmdb.ts            # Tipe data TMDB
│   ├── utils/
│   │   ├── images.ts          # Pembentukan URL gambar
│   │   └── format.ts          # Format tahun, runtime, rating
│   ├── test/                  # Setup, fixtures, dan helper testing
│   ├── App.tsx                # Definisi route
│   └── main.tsx
├── vercel.json                # Konfigurasi build & SPA rewrite untuk Vercel
├── vite.config.ts             # Dev proxy ke TMDB + konfigurasi Vitest
└── .env.example
```

### Prinsip arsitektur

- **Pemisahan tanggung jawab**: seluruh akses API berada di `src/api` dan custom hooks. Komponen di `src/components` bersifat *presentational* (menerima props, tidak memanggil API) sehingga mudah diuji dan dipakai ulang.
- **Logika data di hooks**: `useMovies` menangani fetch, pagination, dan error; komponen hanya merender state.
- **API key tidak pernah bocor ke browser**: klien memanggil path same-origin `/api/tmdb`, sedangkan key ditambahkan di sisi server (lihat bagian [Keamanan API Key](#keamanan-api-key)).

## Menjalankan Secara Lokal

### Prasyarat

- Node.js 18+ (disarankan 20+)
- API key TMDB ([cara mendapatkan](https://developer.themoviedb.org/docs/getting-started))

### Langkah

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment variable
#    Salin .env.example menjadi .env lalu isi API key
cp .env.example .env

# 3. Jalankan dev server
npm run dev
```

Buka `http://localhost:5173`.

### Environment Variables

| Nama                      | Prefix akses | Default                       | Keterangan                                        |
| ------------------------- | ------------ | ----------------------------- | ------------------------------------------------- |
| `TMDB_API_KEY`            | server-only  | —                             | **Rahasia**. Tanpa prefix `VITE_`.                 |
| `VITE_TMDB_BASE_URL`      | client       | `/api/tmdb`                   | Path same-origin yang dipanggil aplikasi.          |
| `VITE_TMDB_IMAGE_BASE_URL`| client       | `https://image.tmdb.org/t/p`  | CDN gambar publik (tanpa key).                     |

> Jangan pernah memberi prefix `VITE_` pada `TMDB_API_KEY`. Vite akan meng-*inline* variabel ber-prefix `VITE_` ke bundle browser sehingga nilainya terekspos ke pengguna.

## Testing

```bash
npm run test            # jalankan seluruh test sekali
npm run test:watch      # mode watch
npm run test:coverage   # dengan laporan coverage
```

Cakupan saat ini: **35 test di 11 file** (unit untuk komponen, hooks, API layer, dan utilitas, plus integration test untuk halaman list, halaman detail, dan navigasi).

## Build & Preview

```bash
npm run build           # type-check + build produksi ke folder dist/
npm run preview         # pratinjau hasil build
```

## Keamanan API Key

Karena ini aplikasi front-end murni, API key tidak boleh disertakan di kode klien. Alurnya:

- **Development** — proxy bawaan Vite (`vite.config.ts`) meneruskan `/api/tmdb/*` ke TMDB dan menambahkan `api_key` di proses dev server.
- **Production (Vercel)** — Edge Function `api/proxy.ts` melakukan hal yang sama, lalu mengembalikan respons ke klien. Karena Vercel tidak mendukung *catch-all* route (`[...path]`) di folder `/api` untuk project non-Next.js, request `/api/tmdb/*` diarahkan ke fungsi ini lewat *rewrite* di `vercel.json`.

Dengan begitu bundle browser hanya berisi path `/api/tmdb`, tanpa API key.

## Deploy ke Vercel

1. Import repository ini ke Vercel (framework Vite terdeteksi otomatis; build & output sudah diatur di `vercel.json`).
2. Buka **Project → Settings → Environment Variables**, tambahkan:
   - **Name**: `TMDB_API_KEY`
   - **Value**: API key TMDB Anda
   - **Environments**: Production, Preview, Development
3. Deploy.

`vercel.json` juga mengatur SPA rewrite agar URL seperti `/movie/27205` tetap memuat `index.html` saat diakses langsung.

## Scripts

| Script                  | Fungsi                                   |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Menjalankan dev server                   |
| `npm run build`         | Type-check + build produksi              |
| `npm run preview`       | Pratinjau hasil build                    |
| `npm run typecheck`     | Menjalankan TypeScript type-check        |
| `npm run test`          | Menjalankan test                         |
| `npm run test:watch`    | Test mode watch                          |
| `npm run test:coverage` | Test + laporan coverage                  |

## Lisensi

Data dan layanan film disediakan oleh [TMDB](https://www.themoviedb.org/). Proyek ini tidak berafiliasi dengan TMDB.
