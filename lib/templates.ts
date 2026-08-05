import { Band, Brand, ExtraBlocks, TemplateRow, Theme } from "./types";
import { DEFAULT_BANDS } from "./grades";

/**
 * Daftar template report card, mengikuti master Canva
 * "(NEW MASTER) Report Card JAPANESE" (16 halaman).
 *
 * Menambah template baru = tambahkan satu entri di TEMPLATES.
 * Kalau desainnya masih mirip (beda warna / baris nilai / teks), pakai
 * layout "classic". Kalau susunannya benar-benar beda, buat komponen baru
 * di components/templates lalu daftarkan layout-nya di components/ReportCard.tsx.
 */
export type LayoutId = "classic";

/**
 * Blok "Final Test": bar judul berwarna, lalu grid kolom.
 * Tiap kolom punya label (diketik tutor) dan nilai angka.
 */
export type ExtraBlockDef = {
  id: string;
  /** Judul di bar berwarna, mis. "Final Test". */
  title: string;
  /** Label awal tiap kolom; tutor bebas mengubah, menambah, atau menghapus. */
  defaultLabels: string[];
};

export type TemplateDef = {
  id: string;
  /** Nama yang muncul di dropdown. */
  name: string;
  /** Kelompok di dropdown, mis. "Shokyuu 1". */
  group: string;
  /** Keterangan singkat di bawah dropdown. */
  description: string;
  /** Teks Level bawaan, ikut terisi saat template dipilih. */
  defaultLevel: string;
  layout: LayoutId;
  theme: Theme;
  rows: TemplateRow[];
  /** Baris polos di bawah header TITLE, mis. "Simulasi JLPT". */
  captionRow?: string;
  extraBlocks?: ExtraBlockDef[];
  /** Skala nilai bawaan template (bisa ditimpa lewat pengaturan brand). */
  bands: Band[];
  footerText: string;
};

/** Skala tanpa A+, dipakai semua halaman master Canva. */
export const SIMPLE_BANDS: Band[] = [
  { min: 91, grade: "A" },
  { min: 81, grade: "A-" },
  { min: 71, grade: "B+" },
  { min: 61, grade: "B" },
  { min: 51, grade: "B-" },
  { min: 0, grade: "C" },
];

const INK = "#1C1C1C";
const WHITE = "#FFFFFF";

const theme = (
  accent: string,
  soft: string,
  darkBackground = false
): Theme => ({
  accent,
  soft,
  onAccent: WHITE,
  onFooter: darkBackground ? WHITE : INK,
  ink: INK,
  roundedFooter: true,
});

const PURPLE = () => theme("#8B4C9F", "#EDE0F2");
const ORANGE = () => theme("#F0762F", "#FBE4D6");
const BLUE = () => theme("#4A87C6", "#DDE9F6");
const GREEN = () => theme("#8CC63F", "#E8F3D3");
const DARK_GREEN = () => theme("#10513C", "#DEE9E4", true);
const GOLD = () => theme("#F0C333", "#FBF1D2");
const INDIGO = () => theme("#3E2E6E", "#E2DEEE", true);

const ATTENDANCE: TemplateRow = {
  key: "attendance",
  en: "Attendance",
  jp: "出席",
};
const PARTICIPATION: TemplateRow = {
  key: "participation",
  en: "In class participation",
  jp: "積極性",
};
const SPEAKING: TemplateRow = { key: "speaking", en: "Speaking", jp: "会話" };
const TEST: TemplateRow = { key: "test", en: "Test", jp: "試験", raw: true };

/** Tiga baris skill tanpa Test — dipakai halaman yang punya blok Final Test. */
const SKILL_ROWS: TemplateRow[] = [ATTENDANCE, PARTICIPATION, SPEAKING];

/** Empat baris dasar, termasuk Test. */
const BASIC_ROWS: TemplateRow[] = [...SKILL_ROWS, TEST];

/** Enam baris skill lengkap — Chuukyuu & Joukyuu. */
const FULL_ROWS: TemplateRow[] = [
  ATTENDANCE,
  PARTICIPATION,
  { key: "grammar", en: "Grammar", jp: "文法" },
  { key: "kanji", en: "Kanji", jp: "漢字" },
  TEST,
  SPEAKING,
];

/** Blok Final Test bernomor, dipakai halaman JLPT Prep. */
const numbered = (n: number): ExtraBlockDef => ({
  id: "final",
  title: "Final Test",
  defaultLabels: Array.from({ length: n }, (_, i) => String(i + 1)),
});

/** Dua blok halaman "JLPT Prep … int": Kanji Test lalu Final Test bernomor. */
const KANJI_INT_BLOCKS: ExtraBlockDef[] = [
  {
    id: "kanji",
    title: "Final Test",
    defaultLabels: Array.from({ length: 6 }, () => "KANJI XX-XX"),
  },
  { ...numbered(3), id: "final" },
];

export const TEMPLATES: TemplateDef[] = [
  // ---------- Elementary ----------
  {
    id: "elementary",
    name: "Elementary",
    group: "Elementary",
    description: "Ungu. Attendance, Participation, Speaking, Test.",
    defaultLevel: "Elementary",
    layout: "classic",
    theme: PURPLE(),
    rows: BASIC_ROWS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "elementary-ft",
    name: "Elementary + Final Test",
    group: "Elementary",
    description: "Ungu. Tiga baris skill, plus blok Final Test bernomor.",
    defaultLevel: "Elementary",
    layout: "classic",
    theme: PURPLE(),
    rows: SKILL_ROWS,
    extraBlocks: [numbered(2)],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },

  // ---------- Shokyuu 1 ----------
  {
    id: "shokyuu1",
    name: "Shokyuu 1",
    group: "Shokyuu 1",
    description: "Oranye. Attendance, Participation, Speaking, Test.",
    defaultLevel: "Shokyuu 1（　初級1　）",
    layout: "classic",
    theme: ORANGE(),
    rows: BASIC_ROWS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "shokyuu1-ft",
    name: "Shokyuu 1 + Final Test",
    group: "Shokyuu 1",
    description: "Oranye. Tiga baris skill, plus blok Final Test per bab.",
    defaultLevel: "Shokyuu 1（　初級1　）",
    layout: "classic",
    theme: ORANGE(),
    rows: SKILL_ROWS,
    extraBlocks: [
      {
        id: "final",
        title: "Final Test",
        defaultLabels: [
          "BUNPOU 6-7",
          "Kanji 3-5",
          "BUNPOU 8-9",
          "BUNPOU XX-XX",
        ],
      },
    ],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-shokyuu1-reg",
    name: "JLPT Prep Shokyuu 1 reg",
    group: "Shokyuu 1",
    description: "Oranye. Simulasi JLPT + Final Test bernomor 1-4.",
    defaultLevel: "JLPT Prep Shokyuu 1 reg（　初級1　）",
    layout: "classic",
    theme: ORANGE(),
    rows: [],
    captionRow: "Simulasi JLPT",
    extraBlocks: [numbered(4)],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-shokyuu1-int",
    name: "JLPT Prep Shokyuu 1 int",
    group: "Shokyuu 1",
    description: "Oranye. Kanji Test enam kolom + Final Test bernomor 1-3.",
    defaultLevel: "JLPT Prep Shokyuu 1 int（　初級1　）",
    layout: "classic",
    theme: ORANGE(),
    rows: [],
    captionRow: "Kanji Test（漢字の試験）",
    extraBlocks: KANJI_INT_BLOCKS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },

  // ---------- Shokyuu 2 ----------
  {
    id: "shokyuu2",
    name: "Shokyuu 2",
    group: "Shokyuu 2",
    description: "Biru. Attendance, Participation, Speaking, Test.",
    defaultLevel: "Shokyuu 2（　初級2　）",
    layout: "classic",
    theme: BLUE(),
    rows: BASIC_ROWS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "shokyuu2-ft",
    name: "Shokyuu 2 + Final Test",
    group: "Shokyuu 2",
    description: "Biru. Tiga baris skill, plus blok Final Test lima kolom.",
    defaultLevel: "Shokyuu 2（　初級2　）",
    layout: "classic",
    theme: BLUE(),
    rows: SKILL_ROWS,
    extraBlocks: [
      {
        id: "final",
        title: "Final Test",
        defaultLabels: [
          "BUNPOU 12-15",
          "BUNPOU XX-XX",
          "Kanji XX-XX",
          "BUNPOU XX-XX",
          "BUNPOU XX-XX",
        ],
      },
    ],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-shokyuu2-reg",
    name: "JLPT Prep Shokyuu 2 reg",
    group: "Shokyuu 2",
    description: "Biru. Simulasi JLPT + Final Test bernomor 1-4.",
    defaultLevel: "JLPT Prep Shokyuu 2 reg（　初級2　）",
    layout: "classic",
    theme: BLUE(),
    rows: [],
    captionRow: "Simulasi JLPT",
    extraBlocks: [numbered(4)],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-shokyuu2-int",
    name: "JLPT Prep Shokyuu 2 int",
    group: "Shokyuu 2",
    description: "Biru. Kanji Test enam kolom + Final Test bernomor 1-3.",
    defaultLevel: "JLPT Prep Shokyuu 2 int（　初級2　）",
    layout: "classic",
    theme: BLUE(),
    rows: [],
    captionRow: "Kanji Test（漢字の試験）",
    extraBlocks: KANJI_INT_BLOCKS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },

  // ---------- Chuukyuu ----------
  {
    id: "chuukyuu",
    name: "Chuukyuu",
    group: "Chuukyuu",
    description: "Hijau. Enam baris skill lengkap termasuk Grammar & Kanji.",
    defaultLevel: "Chuukyuu　（　中級　）",
    layout: "classic",
    theme: GREEN(),
    rows: FULL_ROWS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-chuukyuu",
    name: "JLPT Prep Chuukyuu",
    group: "Chuukyuu",
    description: "Hijau. Simulasi JLPT + Final Test bernomor 1-4.",
    defaultLevel: "JLPT Prep Chuukyuu　（　中級　）",
    layout: "classic",
    theme: GREEN(),
    rows: [],
    captionRow: "Simulasi JLPT",
    extraBlocks: [numbered(4)],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },

  // ---------- Joukyuu ----------
  {
    id: "joukyuu",
    name: "Joukyuu",
    group: "Joukyuu",
    description: "Hijau tua. Enam baris skill lengkap, sama seperti Chuukyuu.",
    defaultLevel: "Joukyuu　（　上級　）",
    layout: "classic",
    theme: DARK_GREEN(),
    rows: FULL_ROWS,
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "jlpt-joukyuu",
    name: "JLPT Prep Joukyuu",
    group: "Joukyuu",
    description: "Hijau tua. Simulasi JLPT + Final Test bernomor 1-4.",
    defaultLevel: "JLPT Prep Joukyuu　（　上級　）",
    layout: "classic",
    theme: DARK_GREEN(),
    rows: [],
    captionRow: "Simulasi JLPT",
    extraBlocks: [numbered(4)],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },

  // ---------- Lain-lain ----------
  {
    id: "superintensif",
    name: "Superintensif",
    group: "Lainnya",
    description: "Ungu tua. Tiga baris skill, plus blok Final Test enam kolom.",
    defaultLevel: "Superintensif",
    layout: "classic",
    theme: INDIGO(),
    rows: SKILL_ROWS,
    extraBlocks: [
      {
        id: "final",
        title: "Final Test",
        defaultLabels: [
          "BUNPOU BAB 1-9",
          "KANJI BAB 1-3",
          "TEST 1",
          "TEST 2",
          "TEST 3",
          "TEST 4",
        ],
      },
    ],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
  {
    id: "kaiwa",
    name: "Kaiwa",
    group: "Lainnya",
    description: "Kuning. Enam baris khusus percakapan, tanpa Attendance.",
    defaultLevel: "Kaiwa",
    layout: "classic",
    theme: GOLD(),
    rows: [
      { key: "fluency", en: "Fluency and Coherence", jp: "流暢性" },
      { key: "vocabulary", en: "Vocabulary", jp: "言葉" },
      { key: "grammar", en: "Grammatical Range", jp: "文法" },
      { key: "pronunciation", en: "Pronunciation", jp: "発音" },
      { key: "participation", en: "Classroom Participation", jp: "積極性" },
      { key: "test", en: "Final Test", jp: "試験", raw: true },
    ],
    bands: SIMPLE_BANDS,
    footerText: "CETTA JAPANESE",
  },
];

export const DEFAULT_TEMPLATE_ID = "chuukyuu";

export function getTemplate(id: string | undefined): TemplateDef {
  return (
    TEMPLATES.find((t) => t.id === id) ??
    TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID) ??
    TEMPLATES[0]
  );
}

/** Template dikelompokkan per level, untuk <optgroup> di dropdown. */
export function templateGroups(): { group: string; items: TemplateDef[] }[] {
  const out: { group: string; items: TemplateDef[] }[] = [];
  for (const t of TEMPLATES) {
    const last = out[out.length - 1];
    if (last && last.group === t.group) last.items.push(t);
    else out.push({ group: t.group, items: [t] });
  }
  return out;
}

/** Skala nilai yang berlaku: override dari brand, kalau tidak ada pakai bawaan template. */
export function bandsFor(brand: Brand, templateId: string): Band[] {
  const override = brand.bandsByTemplate?.[templateId];
  if (override && override.length) return override;
  return getTemplate(templateId).bands;
}

/** Isi awal blok Final Test untuk sebuah template. */
export function defaultExtras(templateId: string): ExtraBlocks {
  const out: ExtraBlocks = {};
  for (const b of getTemplate(templateId).extraBlocks ?? []) {
    out[b.id] = b.defaultLabels.map((label) => ({ label, score: "" }));
  }
  return out;
}

/**
 * Isi blok yang dipakai murid ini. Kolom yang belum pernah disentuh
 * diisi dari template, jadi ganti template tetap memunculkan label contoh.
 */
export function extrasFor(
  extras: ExtraBlocks | undefined,
  templateId: string
): ExtraBlocks {
  const fallback = defaultExtras(templateId);
  if (!extras) return fallback;
  const out: ExtraBlocks = {};
  for (const key of Object.keys(fallback)) {
    const saved = extras[key];
    out[key] = saved && saved.length ? saved : fallback[key];
  }
  return out;
}

/** Semua teks Level bawaan, dipakai untuk tahu apakah Level masih "otomatis". */
export const DEFAULT_LEVELS = TEMPLATES.map((t) => t.defaultLevel);

// DEFAULT_BANDS masih dipakai sebagai skala lama (dengan A+) di pengaturan brand.
export { DEFAULT_BANDS };
