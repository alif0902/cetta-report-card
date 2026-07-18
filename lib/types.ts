export type Band = { min: number; grade: string };

export type ScoreKey =
  | "attendance"
  | "participation"
  | "grammar"
  | "kanji"
  | "test"
  | "speaking";

export type Scores = Record<ScoreKey, string>;

export type ReportData = {
  studentName: string;
  level: string;
  tutor: string;
  scores: Scores;
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
  bands: Band[];
};
