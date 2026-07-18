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

1. Isi **Data murid** (nama; Level & Tutor boleh dikosongkan -> pakai default).
2. Isi **Nilai** 0-100 tiap kategori. Huruf nilai (A, A-, dst) muncul otomatis
   di sebelah kanan. "Test" ditampilkan sebagai angka mentah sesuai desain.
3. **Final Score** dihitung otomatis dari rata-rata. Mau tentukan sendiri?
   Isi kolom "Final Score (override)".
4. Tulis **Catatan**.
5. Klik **Download PNG** atau **Download PDF**.

## Pengaturan brand (sekali saja)

Klik **Pengaturan brand** untuk:

- Upload **logo Cetta** dan **dua gambar tanda tangan**.
- Atur nama & jabatan penandatangan.
- Atur **default Level & Tutor**.
- Ubah **skala nilai** (mis. hapus baris A+ agar A = 91-100).

Semua ini tersimpan otomatis di browser (localStorage), jadi cukup diisi sekali.

## Struktur

```
app/
  layout.tsx      font & metadata
  page.tsx        form + pratinjau + download
components/
  ReportCard.tsx  kartu yang dicetak (desain Cetta)
  Seigaiha.tsx    pola ombak 青海波
lib/
  grades.ts       konversi angka -> huruf, Final, legenda
  types.ts        tipe data
```

## Catatan teknis

- Ekspor gambar pakai `html-to-image`; PDF dibungkus dengan `jspdf`.
- Font (Playfair Display, Poppins, Noto Sans JP) dimuat dari Google Fonts.
  Saat build offline mungkin muncul peringatan fetch font — abaikan, di
  browser normal font tetap termuat.
