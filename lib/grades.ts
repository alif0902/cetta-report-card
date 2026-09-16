import { Band } from "./types";

export const DEFAULT_BANDS: Band[] = [
  { min: 96, grade: "A+" },
  { min: 91, grade: "A" },
  { min: 81, grade: "A-" },
  { min: 71, grade: "B+" },
  { min: 61, grade: "B" },
  { min: 51, grade: "B-" },
  { min: 0, grade: "C" },
];

export function parseScore(v: string): number | null {
  if (v === undefined || v === null) return null;
  const t = String(v).trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function scoreToGrade(score: number | null, bands: Band[]): string {
  if (score === null) return "";
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  for (const b of sorted) if (score >= b.min) return b.grade;
  return sorted.length ? sorted[sorted.length - 1].grade : "";
}

// Attendance: input = jumlah pertemuan hadir dari total pertemuan sekelas.
// Tiap pertemuan yang terlewat turun satu tingkat pada skala nilai template.
// Total 12 (A..C): 12=A, 11=A-, 10=B+, 9=B, 8=B-, <=7=C
// Total  8 (A..C):  8=A,  7=A-,  6=B+, 5=B, 4=B-, <=3=C
export const ATTENDANCE_TOTAL_OPTIONS = [8, 12] as const;
export const DEFAULT_ATTENDANCE_TOTAL = 12;

/**
 * Jumlah pertemuan yang berlaku, diambil dari pengaturan brand.
 * Data lama di localStorage belum punya field ini, dan isinya bisa saja
 * angka asing — keduanya jatuh ke total bawaan.
 */
export function attendanceTotalOf(brand: {
  attendanceTotal?: number;
}): number {
  const n = brand?.attendanceTotal;
  return ATTENDANCE_TOTAL_OPTIONS.some((o) => o === n)
    ? (n as number)
    : DEFAULT_ATTENDANCE_TOTAL;
}

/** Tangga grade kehadiran: semua grade dari tertinggi, kecuali grade terendah. */
function attendanceLadder(bands: Band[]): string[] {
  const sorted = [...bands].sort((a, b) => b.min - a.min).map((b) => b.grade);
  return sorted.length > 1 ? sorted.slice(0, -1) : sorted;
}

export function attendanceGrade(
  attended: number | null,
  bands: Band[] = DEFAULT_BANDS,
  total: number = DEFAULT_ATTENDANCE_TOTAL
): string {
  if (attended === null) return "";
  const ladder = attendanceLadder(bands);
  const lowest =
    [...bands].sort((a, b) => a.min - b.min)[0]?.grade ?? "";
  const capped = Math.min(Math.max(attended, 0), total);
  const missed = total - capped;
  return missed < ladder.length ? ladder[missed] : lowest;
}

// Konversi kehadiran ke skala 0-100 agar ikut rata-rata final score.
export function attendancePercent(
  attended: number | null,
  total: number = DEFAULT_ATTENDANCE_TOTAL
): number | null {
  if (attended === null) return null;
  if (total <= 0) return null;
  const capped = Math.min(Math.max(attended, 0), total);
  return (capped / total) * 100;
}

export function finalGrade(
  nums: (number | null)[],
  override: string,
  bands: Band[]
): string {
  if (override && override.trim()) return override.trim();
  const valid = nums.filter((n): n is number => n !== null);
  if (!valid.length) return "";
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return scoreToGrade(avg, bands);
}

export function legendRows(
  bands: Band[]
): { grade: string; range: string }[] {
  const sorted = [...bands].sort((a, b) => b.min - a.min);
  return sorted.map((b, i) => {
    const upper = i === 0 ? 100 : sorted[i - 1].min - 1;
    const range = b.min <= 0 ? `\u2264${upper}` : `${b.min}\u2013${upper}`;
    return { grade: b.grade, range };
  });
}
