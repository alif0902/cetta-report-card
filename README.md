# Cetta Report Card Generator

Website Next.js untuk membuat report card Cetta Japanese secara otomatis:
isi nilai (angka) -> huruf nilai dihitung otomatis -> pratinjau langsung ->
download PNG / PDF. Tidak perlu Canva.

## Cara menjalankan

Butuh **Node.js 18.18+** atau **20+**.

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Untuk versi produksi:

```bash
npm run build
npm start
```

## Cara pakai

1. Pilih **Template** (desain kartu). Bisa beda-beda tiap murid.
2. Isi **Data murid** (nama; Level & Tutor boleh dikosongkan -> pakai default).
3. Isi **Nilai** 0-100 tiap kategori. Kategori yang muncul mengikuti template
   yang dipilih. Huruf nilai (A, A-, dst) muncul otomatis di sebelah kanan.
   "Test" ditampilkan sebagai angka mentah sesuai desain.
4. **Final Score** dihitung otomatis dari rata-rata. Mau tentukan sendiri?
   Isi kolom "Final Score (override)".
5. Tulis **Catatan**.
6. Klik **Download PNG** atau **Download PDF**.

## Pengaturan brand (sekali saja)

Klik **Pengaturan brand** untuk:

- Upload **logo Cetta** dan **dua gambar tanda tangan**.
- Atur nama & jabatan penandatangan.
- Atur **default Level & Tutor**.
- Ubah **skala nilai**. Skala disimpan **per template**, jadi mengubah skala
  template Chuukyuu tidak mengganggu template Elementary. Tombol
  "kembalikan bawaan" mengembalikan skala asli template tersebut.

Semua ini tersimpan otomatis di browser (localStorage), jadi cukup diisi sekali.

## Template

16 template di `lib/templates.ts`, satu untuk tiap halaman master Canva
"(NEW MASTER) Report Card JAPANESE". Semua pakai skala A … C (tanpa A+).

| id | Warna | Isi |
| --- | --- | --- |
| `elementary` | ungu | Attendance, Participation, Speaking, Test |
| `elementary-ft` | ungu | 3 baris skill + Final Test (1, 2) |
| `shokyuu1` | oranye | Attendance, Participation, Speaking, Test |
| `shokyuu1-ft` | oranye | 3 baris skill + Final Test per bab |
| `jlpt-shokyuu1-reg` | oranye | Simulasi JLPT + Final Test 1-4 |
| `jlpt-shokyuu1-int` | oranye | Kanji Test ×6 + Final Test 1-3 |
| `shokyuu2` | biru | Attendance, Participation, Speaking, Test |
| `shokyuu2-ft` | biru | 3 baris skill + Final Test 5 kolom |
| `jlpt-shokyuu2-reg` | biru | Simulasi JLPT + Final Test 1-4 |
| `jlpt-shokyuu2-int` | biru | Kanji Test ×6 + Final Test 1-3 |
| `chuukyuu` | hijau | 6 baris skill lengkap |
| `jlpt-chuukyuu` | hijau | Simulasi JLPT + Final Test 1-4 |
| `joukyuu` | hijau tua | 6 baris skill lengkap |
| `jlpt-joukyuu` | hijau tua | Simulasi JLPT + Final Test 1-4 |
| `superintensif` | ungu tua | 3 baris skill + Final Test 6 kolom |
| `kaiwa` | kuning | Fluency, Vocabulary, Grammatical Range, Pronunciation, Classroom Participation, Final Test |

Memilih template juga mengisi kolom **Level** otomatis (mis. `Shokyuu 1（　初級1　）`),
tapi tetap bisa diketik ulang.

### Blok Final Test

Template bisa punya satu atau lebih blok bernama (`Final Test`,
`Kanji Test（漢字の試験）`) berisi kolom-kolom dengan label bebas. Label awal
datang dari `defaultLabels` di template; di form tutor boleh mengubah teksnya,
menambah, atau menghapus kolom. Nilainya tampil sebagai angka mentah di kartu
dan ikut dihitung ke Final Score.

Halaman JLPT Prep tidak punya tabel skill sama sekali — `rows: []` plus
`captionRow` (baris polos "Simulasi JLPT" / "Kanji Test") di bawah header TITLE.

### Menambah template baru

Kalau desainnya masih susunan yang sama (beda warna / baris nilai / teks),
cukup tambah satu entri di array `TEMPLATES` (`lib/templates.ts`) dengan
`layout: "classic"`. Tidak perlu menyentuh komponen apa pun.

Kalau susunannya benar-benar berbeda:

1. Buat komponen baru di `components/templates/` (contoh: `ClassicCard.tsx`).
2. Tambah id layout-nya di `LayoutId` (`lib/templates.ts`).
3. Tambah cabang `case` di `components/ReportCard.tsx`.

## Struktur

```
app/
  layout.tsx           font & metadata
  page.tsx             form + pratinjau + download
components/
  ReportCard.tsx       pemilih layout sesuai template murid
  templates/
    ClassicCard.tsx    layout klasik Cetta (dipakai semua template saat ini)
  Seigaiha.tsx         pola ombak 青海波
lib/
  templates.ts         daftar template: warna, baris nilai, skala
  grades.ts            konversi angka -> huruf, Final, legenda
  types.ts             tipe data
```

## Catatan teknis

- Ekspor gambar pakai `html-to-image`; PDF dibungkus dengan `jspdf`.
- Font (Playfair Display, Poppins, Noto Sans JP) dimuat dari Google Fonts.
  Saat build offline mungkin muncul peringatan fetch font — abaikan, di
  browser normal font tetap termuat.
