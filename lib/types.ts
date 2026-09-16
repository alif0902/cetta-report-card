export type Band = { min: number; grade: string };

export type ScoreKey =
  | "attendance"
  | "participation"
  | "grammar"
  | "kanji"
  | "test"
  | "speaking"
  // khusus kelas Kaiwa
  | "fluency"
  | "vocabulary"
  | "pronunciation";

export type Scores = Record<ScoreKey, string>;

/** Satu kolom di blok Final Test: label diketik tutor, nilai berupa angka. */
export type ExtraCell = { label: string; score: string };

/** Isi blok Final Test per murid, dikunci dengan id blok dari template. */
export type ExtraBlocks = Record<string, ExtraCell[]>;

export type ReportData = {
  templateId: string;
  studentName: string;
  level: string;
  tutor: string;
  scores: Scores;
  /** Isi blok Final Test / Kanji Test / dsb. Kosong kalau template tak punya. */
  extras: ExtraBlocks;
  notes: string;
  finalOverride: string;
};

export type Brand = {
  logo: string | null;
  headName: string;
  headTitle: string;
  headSig: string | null;
  cooName: string;
  cooTitle: string;
  cooSig: string | null;
  defaultLevel: string;
  defaultTutor: string;
  /**
   * Jumlah pertemuan satu periode kelas (8 untuk private, 12 untuk reguler).
   * Berlaku untuk semua template & semua murid. Opsional karena data lama
   * di localStorage belum menyimpannya — baca lewat attendanceTotalOf().
   */
  attendanceTotal?: number;
  /** Skala nilai lama; dipakai sebagai skala template default. */
  bands: Band[];
  /** Skala nilai per template; menimpa skala bawaan template bila ada. */
  bandsByTemplate?: Record<string, Band[]>;
};

/** Warna & gaya visual sebuah template. */
export type Theme = {
  accent: string;
  soft: string;
  /** Warna teks di atas blok accent (header tabel, GRADE/NOTES, final score). */
  onAccent: string;
  /** Warna teks di footer; di master Canva sering beda dari onAccent. */
  onFooter: string;
  ink: string;
  /** Sudut bawah footer dibulatkan, seperti template Elementary. */
  roundedFooter: boolean;
};

/** Satu baris nilai yang ditampilkan di kartu. */
export type TemplateRow = {
  key: ScoreKey;
  en: string;
  jp: string;
  /** Tampilkan angka mentah, bukan huruf grade (mis. Test). */
  raw?: boolean;
};

export type CardProps = {
  data: ReportData;
  brand: Brand;
};
