# 🕌 Pengingat Salat - Wails Desktop Application

Aplikasi desktop Islami berkinerja tinggi, modern, dan sangat estetis yang dirancang dengan **Premium Glassmorphism Design**. Dibuat menggunakan **Wails v2** di bagian backend (Go) serta **React**, **Vite**, dan **TypeScript** di bagian frontend.

Aplikasi ini menyajikan pengingat waktu sholat real-time, widget melayang di desktop (*always-on-top* dengan pengunci jendela), Al-Quran digital dengan audio murottal yang interaktif, sistem pelacak *Streak Sholat* yang mendisiplinkan, serta integrasi prakiraan cuaca otomatis.

---

## ✨ Fitur-Fitur Unggulan

1. **🕌 Jadwal Sholat Akurat & Adzan Autoplay**
   - Perhitungan jadwal sholat otomatis berdasarkan koordinat kota utama.
   - Pilihan suara adzan premium dari muadzin ternama (Alafasy, Al-Aqsa, H. Muammar ZA, Taha Al-Junayd).
   - Tombol **Test Adzan & Hentikan** adzan secara instan di menu.
   - Pilihan lokasi dipusatkan di halaman **Settings** untuk menjaga kebersihan UI di halaman utama.

2. **🔥 Streak Sholat Harian**
   - Sistem motivasi ibadah harian. Pengguna mencentang 5 waktu sholat yang telah ditunaikan.
   - **Aturan Ketat:** Tombol hanya bisa dicentang ketika waktu sholat tersebut telah tiba. Dan jika dicentang, ia akan dicoret (*crossed out*) serta **tidak dapat di-uncheck**.
   - **Reset Streak:** Jika pengguna melewatkan satu waktu sholat (misal Dhuhr tidak dicentang hingga masuk waktu Asr), status sholat tersebut otomatis terkunci bolong `(X)` dan **streak langsung kembali ke 0**. Semua data direset pada pukul 00:00 setiap harinya.

3. **📖 Al-Quran Digital & Custom Audio Player**
   - 114 Surat lengkap dengan teks Arab dan terjemahan.
   - Custom player murottal modern yang mendukung bilah durasi (*seeking progress track*).
   - Dilengkapi dengan *creative micro-animations* berupa visualizer gelombang suara dinamis ketika audio diputar.

4. **🌤️ Informasi Cuaca Terintegrasi**
   - Integrasi langsung dengan API cuaca Open-Meteo.
   - Prakiraan cuaca real-time hari ini serta prakiraan 5 hari ke depan yang disinkronkan otomatis berdasarkan kota pilihan di setelan.

5. **🖥️ Rainmeter-Style Widget Mode (Anti-Close)**
   - Mode melayang mini yang selalu berada di atas jendela lain (*Always on Top*).
   - Sistem keamanan **Anti-Close**: Jendela utama tidak dapat ditutup secara tidak sengaja ketika mode widget aktif. Tombol close dan shortcut alt+f4 dicegah, memaksa jendela tetap siaga mengingatkan Anda, kecuali dinonaktifkan dari Setelan.

6. **🌐 Dukungan Multi-Bahasa**
   - Bahasa Indonesia (ID)
   - English (EN)
   - Bahasa Malaysia (MS)

---

## 🛠️ Panduan Pengembangan (Developer Guide)

Bagi pengembang yang ingin berkontribusi atau melanjutkan proyek ini, ikuti petunjuk arsitektur di bawah.

### Prerequisites (Prasyarat)
* **Go** (versi 1.18 atau lebih baru)
* **Node.js** (versi 16 atau lebih baru) & **npm**
* **Wails CLI** (Instal via `go install github.com/wailsapp/wails/v2/cmd/wails@latest`)

### 📁 Struktur Proyek
```bash
├── adzan compilation/  # Audio kompilasi mentah adzan
├── assets/             # Logo transparan premium beresolusi tinggi (.png)
├── build/              # Hasil build biner produksi (installer/exe)
├── frontend/           # Aplikasi Frontend (React + Vite + TypeScript)
│   ├── src/            # Komponen & Halaman aplikasi (App.tsx, index.css)
│   └── public/         # Aset statis frontend (audio adzan, logo)
├── landing-page/       # Situs web promosi & unduhan (React + Vite)
├── app.go              # Logika sistem Wails (Widget Mode, Window Interceptor)
├── main.go             # Entrypoint inisialisasi aplikasi Go & Wails config
├── wails.json          # Konfigurasi proyek Wails
└── README.md           # Panduan ini
```

---

## 🚀 Jalankan dalam Mode Pengembangan

Untuk menjalankan aplikasi desktop dalam mode interaktif dan hot-reload:
```bash
wails dev
```
Perubahan di kode Go akan memicu kompilasi ulang otomatis, sementara perubahan di frontend React akan di-hot-reload instan di jendela aplikasi Wails.

### Mengembangkan Landing Page
Untuk menjalankan situs promosi/landing page secara terpisah:
```bash
cd landing-page
npm run dev
```

---

## 📦 Membangun Aplikasi untuk Rilis (Build Production)

Ketika Anda melakukan perubahan pada aset-aset di `frontend/public/` (seperti mengganti/menambah suara adzan atau logo), Anda harus **membersihkan direktori dist** terlebih dahulu agar compiler Go `embed` tidak mengalami masalah cache biner lama.

Ikuti langkah rilis berikut secara berurutan:

1. **Bersihkan Dist & Siapkan Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Aplikasi Desktop Utama (Windows Biner):**
   Kembali ke root direktori dan jalankan perintah build dari Wails:
   ```bash
   cd ..
   wails build
   ```
   *Biner hasil kompilasi final yang dioptimalkan akan tersimpan di dalam folder `build/bin/pengigat solat.exe`.*

3. **Build Landing Page Website:**
   ```bash
   cd landing-page
   npm run build
   ```
   *Output berupa file HTML/CSS/JS statis siap dideploy ke server web (seperti Netlify, Vercel, atau GitHub Pages) berada di folder `landing-page/dist/`.*

---

## 🔒 Catatan Teknis Wails & Go Embed

* **Kendala Karakter Khusus di Go Embed:**
  Compiler Go `embed.FS` tidak mendukung file dengan spasi, tanda kurung `()`, huruf arab, atau tanda petik tunggal di dalam nama file. Seluruh file adzan di `frontend/public/adzan/` telah disederhanakan namanya menggunakan struktur huruf kecil dan tanda hubung, seperti `azan-salman-al-utaybi.mp3` dan `adzan-h-muammar-za.mp3`. Tetap patuhi penamaan ini jika Anda ingin mengganti aset audio.

* **Pencegahan Close Window di Go:**
  Sistem *Anti-Close* dikendalikan dari `main.go` menggunakan fungsi callback `OnBeforeClose`:
  ```go
  OnBeforeClose: func(ctx context.Context) (prevent bool) {
      // Mengembalikan nilai true akan mencegah aplikasi untuk menutup
      return app.MencegahPenutupanJendela()
  }
  ```
  Nilai ini dievaluasi secara dinamis berdasarkan state tombol *Always on Top* di frontend.

---

*Mari jaga kedisiplinan ibadah di tengah kesibukan produktivitas digital!* 🕌✨
