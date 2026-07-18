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

// Attendance: input = jumlah pertemuan hadir dari total 12.
// 12=A+, 11=A, 10=A-, 9=B+, 8=B, 7=B-, <=6=C
export const ATTENDANCE_TOTAL = 12;
const ATTENDANCE_LADDER = ["A+", "A", "A-", "B+", "B", "B-"];

export function attendanceGrade(attended: number | null): string {
  if (attended === null) return "";
  const capped = Math.min(Math.max(attended, 0), ATTENDANCE_TOTAL);
  const missed = ATTENDANCE_TOTAL - capped;
  return missed < ATTENDANCE_LADDER.length ? ATTENDANCE_LADDER[missed] : "C";
}

// Konversi kehadiran ke skala 0-100 agar ikut rata-rata final score.
export function attendancePercent(attended: number | null): number | null {
  if (attended === null) return null;
  const capped = Math.min(Math.max(attended, 0), ATTENDANCE_TOTAL);
  return (capped / ATTENDANCE_TOTAL) * 100;
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
