"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReportCard from "@/components/ReportCard";
import Seigaiha from "@/components/Seigaiha";
import { Band, Brand, ReportData, ScoreKey } from "@/lib/types";
import {
  ATTENDANCE_TOTAL,
  attendanceGrade,
  DEFAULT_BANDS,
  parseScore,
  scoreToGrade,
} from "@/lib/grades";
import logoHd from "@/logo-hd.png";
import sigSiti from "@/sig-siti.png";
import sigMonica from "@/sig-monica.png";
import { dataUrlToBytes, makeZip } from "@/lib/zip";

const BRAND_KEY = "cetta.brand.v1";
const STUDENTS_KEY = "cetta.students.v1";

const emptyScores = {
  attendance: "",
  participation: "",
  grammar: "",
  kanji: "",
  test: "",
  speaking: "",
};

const DEFAULT_BRAND: Brand = {
  logo: logoHd.src,
  headName: "Siti Mutmainah",
  headTitle: "HEAD OF CETTA JAPANESE",
  headSig: sigSiti.src,
  cooName: "Monica Milan",
  cooTitle: "CHIEF OPERATING OFFICER",
  cooSig: sigMonica.src,
  defaultLevel: "Chuukyuu\uff08\u3000\u4e2d\u7d1a\u3000\uff09",
  defaultTutor: "Muhammad Alif Hamka",
  bands: DEFAULT_BANDS,
};

const SCORE_FIELDS: {
  key: ScoreKey;
  label: string;
  raw?: boolean;
  att?: boolean;
}[] = [
  {
    key: "attendance",
    label: `Attendance \u51fa\u5e2d \u00b7 hadir dari ${ATTENDANCE_TOTAL} pertemuan`,
    att: true,
  },
  { key: "participation", label: "Participation \u7a4d\u6975\u6027" },
  { key: "grammar", label: "Grammar \u6587\u6cd5" },
  { key: "kanji", label: "Kanji \u6f22\u5b57" },
  { key: "test", label: "Test \u8a66\u9a13", raw: true },
  { key: "speaking", label: "Speaking \u4f1a\u8a71" },
];

const emptyReport = (): ReportData => ({
  studentName: "",
  level: "",
  tutor: "",
  scores: { ...emptyScores },
  notes: "",
  finalOverride: "",
});

export default function Home() {
  const [students, setStudents] = useState<ReportData[]>([emptyReport()]);
  const [active, setActive] = useState(0);
  const report = students[Math.min(active, students.length - 1)] ?? students[0];
  const setReport = (fn: (r: ReportData) => ReportData) =>
    setStudents((list) => list.map((s, i) => (i === active ? fn(s) : s)));
  const [brand, setBrand] = useState<Brand>(DEFAULT_BRAND);
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [busy, setBusy] = useState<null | "png" | "pdf">(null);

  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewWrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // load brand from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BRAND_KEY);
      if (raw) {
        // nilai null tersimpan tidak boleh menimpa aset bawaan
        const stored = Object.fromEntries(
          Object.entries(JSON.parse(raw)).filter(
            ([, v]) => v !== null && v !== undefined
          )
        ) as Partial<Brand>;
        setBrand({ ...DEFAULT_BRAND, ...stored });
      }
    } catch {}
    try {
      const rawS = localStorage.getItem(STUDENTS_KEY);
      if (rawS) {
        const parsed = JSON.parse(rawS);
        if (Array.isArray(parsed) && parsed.length) {
          setStudents(
            parsed.map((s) => ({
              ...emptyReport(),
              ...s,
              scores: { ...emptyScores, ...(s?.scores || {}) },
            }))
          );
        }
      }
    } catch {}
    setReady(true);
  }, []);

  // persist brand
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
    } catch {}
  }, [brand, ready]);

  // persist daftar murid
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    } catch {}
  }, [students, ready]);

  // responsive preview scaling
  useEffect(() => {
    const el = previewWrap.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / 720));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  const setScore = (k: ScoreKey, v: string) =>
    setReport((r) => ({ ...r, scores: { ...r.scores, [k]: v } }));

  const readImage = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = () => rej(new Error("Gagal membaca gambar"));
      fr.readAsDataURL(file);
    });

  const onUpload =
    (key: "logo" | "headSig" | "cooSig") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const url = await readImage(f);
      setBrand((b) => ({ ...b, [key]: url }));
      e.target.value = "";
    };

  const studentFile = (s: ReportData, i: number) => {
    const base = s.studentName.trim().replace(/[^\w\-]+/g, "_");
    return base || `murid_${i + 1}`;
  };

  const download = useCallback(
    async (kind: "png" | "pdf") => {
      setBusy(kind);
      try {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const { toPng } = await import("html-to-image");
        const { jsPDF } = await import("jspdf");

        const used = new Set<string>();
        const files: { name: string; data: Uint8Array }[] = [];

        for (let i = 0; i < students.length; i++) {
          const node = exportRefs.current[i];
          if (!node) continue;
          const dataUrl = await toPng(node, {
            pixelRatio: 2,
            backgroundColor: "#ffffff",
            cacheBust: true,
          });

          let base = studentFile(students[i], i);
          while (used.has(base)) base = `${base}_${i + 1}`;
          used.add(base);

          if (kind === "png") {
            files.push({ name: `${base}.png`, data: dataUrlToBytes(dataUrl) });
          } else {
            const img = new Image();
            img.src = dataUrl;
            await new Promise((r) => (img.onload = r));
            const pdf = new jsPDF({
              orientation: img.height >= img.width ? "portrait" : "landscape",
              unit: "px",
              format: [img.width, img.height],
            });
            pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
            files.push({
              name: `${base}.pdf`,
              data: new Uint8Array(pdf.output("arraybuffer")),
            });
          }
        }

        if (!files.length) return;

        let blob: Blob;
        let outName: string;
        if (files.length === 1) {
          blob = new Blob([files[0].data.buffer as ArrayBuffer], {
            type: kind === "png" ? "image/png" : "application/pdf",
          });
          outName = files[0].name;
        } else {
          blob = makeZip(files);
          outName = `Cetta_Report_Cards_${kind.toUpperCase()}.zip`;
        }
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = outName;
        a.click();
        URL.revokeObjectURL(a.href);
      } catch (err) {
        alert("Gagal membuat file. Coba lagi.");
        console.error(err);
      } finally {
        setBusy(null);
      }
    },
    [students]
  );

  const addStudent = () => {
    setStudents((list) => [...list, emptyReport()]);
    setActive(students.length); // panjang sebelum penambahan = index murid baru
  };

  const removeStudent = (i: number) => {
    if (students.length <= 1) return;
    setStudents((list) => list.filter((_, idx) => idx !== i));
    setActive((a) => (i < a ? a - 1 : Math.min(a, students.length - 2)));
  };

  const resetStudent = () =>
    setReport((r) => ({
      studentName: "",
      level: "",
      tutor: "",
      scores: { ...emptyScores },
      notes: "",
      finalOverride: "",
    }));

  const updateBand = (i: number, patch: Partial<Band>) =>
    setBrand((b) => {
      const bands = b.bands.map((x, idx) => (idx === i ? { ...x, ...patch } : x));
      return { ...b, bands };
    });
  const addBand = () =>
    setBrand((b) => ({ ...b, bands: [...b.bands, { min: 0, grade: "" }] }));
  const removeBand = (i: number) =>
    setBrand((b) => ({ ...b, bands: b.bands.filter((_, idx) => idx !== i) }));

  if (!ready) return null;

  return (
    <main className="min-h-screen">
      {/* header */}
      <header className="relative bg-white border-b border-[#e4ead8]">
        <div className="absolute inset-x-0 top-0 opacity-40">
          <Seigaiha height={40} />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
              Report Card Generator
            </h1>
            <p className="text-sm text-neutral-500">
              {"Cetta Japanese \u2014 isi nilai, langsung jadi kartu."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => download("png")}
              disabled={busy !== null}
              className="rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
            >
              {busy === "png"
                ? "Membuat\u2026"
                : students.length > 1
                ? `Download PNG (${students.length})`
                : "Download PNG"}
            </button>
            <button
              onClick={() => download("pdf")}
              disabled={busy !== null}
              className="rounded-full border border-leaf px-4 py-2 text-sm font-semibold text-leafdark hover:bg-leafsoft disabled:opacity-60"
            >
              {busy === "pdf"
                ? "Membuat\u2026"
                : students.length > 1
                ? `Download PDF (${students.length})`
                : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        {/* form */}
        <section className="space-y-5">
          <Card title="Murid">
            <div className="flex flex-wrap items-center gap-2">
              {students.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                    i === active
                      ? "border-leaf bg-leafsoft text-leafdark"
                      : "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <button onClick={() => setActive(i)}>
                    {s.studentName.trim() || `Murid ${i + 1}`}
                  </button>
                  {students.length > 1 ? (
                    <button
                      onClick={() => removeStudent(i)}
                      className="text-neutral-400 hover:text-red-500"
                      title="Hapus murid"
                    >
                      {"✕"}
                    </button>
                  ) : null}
                </div>
              ))}
              <button
                onClick={addStudent}
                className="rounded-full border border-dashed border-leaf px-3 py-1.5 text-sm font-semibold text-leafdark hover:bg-leafsoft"
              >
                + Tambah murid
              </button>
            </div>
          </Card>

          <Card title="Data murid">
            <Field label="Student Name">
              <input
                className="inp"
                value={report.studentName}
                onChange={(e) =>
                  setReport((r) => ({ ...r, studentName: e.target.value }))
                }
                placeholder="mis. OCTAVIANY"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Level" hint="kosong = default">
                <input
                  className="inp"
                  value={report.level}
                  onChange={(e) =>
                    setReport((r) => ({ ...r, level: e.target.value }))
                  }
                  placeholder={brand.defaultLevel}
                />
              </Field>
              <Field label="Tutor" hint="kosong = default">
                <input
                  className="inp"
                  value={report.tutor}
                  onChange={(e) =>
                    setReport((r) => ({ ...r, tutor: e.target.value }))
                  }
                  placeholder={brand.defaultTutor}
                />
              </Field>
            </div>
          </Card>

          <Card title={"Nilai"}>
            <div className="space-y-2">
              {SCORE_FIELDS.map((f) => {
                const n = parseScore(report.scores[f.key]);
                const preview = f.att
                  ? attendanceGrade(n) || "\u2014"
                  : f.raw
                  ? n === null
                    ? "\u2014"
                    : String(n)
                  : scoreToGrade(n, brand.bands) || "\u2014";
                return (
                  <div
                    key={f.key}
                    className="grid grid-cols-[minmax(0,1fr)_6rem_2.5rem] items-center gap-3"
                  >
                    <label className="text-sm text-neutral-700">
                      {f.label}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={f.att ? ATTENDANCE_TOTAL : 100}
                      className="inp text-center"
                      value={report.scores[f.key]}
                      onChange={(e) => setScore(f.key, e.target.value)}
                    />
                    <span className="text-center text-sm font-bold text-leafdark">
                      {preview}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4" />
            <Field label="Final Score (opsional override)" hint="kosong = otomatis dari rata-rata">
              <input
                className="inp"
                value={report.finalOverride}
                onChange={(e) =>
                  setReport((r) => ({ ...r, finalOverride: e.target.value }))
                }
                placeholder="mis. A"
              />
            </Field>
          </Card>

          <Card title="Catatan (Notes)">
            <textarea
              className="inp min-h-[120px] resize-y"
              value={report.notes}
              onChange={(e) =>
                setReport((r) => ({ ...r, notes: e.target.value }))
              }
              placeholder={"Komentar untuk murid\u2026"}
            />
          </Card>

          <div className="flex gap-2">
            <button
              onClick={resetStudent}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Reset murid
            </button>
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              {showSettings ? "Tutup pengaturan" : "Pengaturan brand"}
            </button>
          </div>

          {showSettings && (
            <Card title="Pengaturan brand (disimpan otomatis)">
              <p className="mb-3 text-xs text-neutral-500">
                Diisi sekali, dipakai untuk semua murid. Tersimpan di browser ini.
              </p>
              <Upload label="Logo Cetta" onChange={onUpload("logo")} has={!!brand.logo} onClear={() => setBrand((b)=>({...b, logo:null}))} />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Nama TTD kiri">
                  <input className="inp" value={brand.headName}
                    onChange={(e)=>setBrand((b)=>({...b, headName:e.target.value}))}/>
                </Field>
                <Field label="Jabatan kiri">
                  <input className="inp" value={brand.headTitle}
                    onChange={(e)=>setBrand((b)=>({...b, headTitle:e.target.value}))}/>
                </Field>
              </div>
              <Upload label="Gambar TTD kiri" onChange={onUpload("headSig")} has={!!brand.headSig} onClear={() => setBrand((b)=>({...b, headSig:null}))} />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Nama TTD kanan">
                  <input className="inp" value={brand.cooName}
                    onChange={(e)=>setBrand((b)=>({...b, cooName:e.target.value}))}/>
                </Field>
                <Field label="Jabatan kanan">
                  <input className="inp" value={brand.cooTitle}
                    onChange={(e)=>setBrand((b)=>({...b, cooTitle:e.target.value}))}/>
                </Field>
              </div>
              <Upload label="Gambar TTD kanan" onChange={onUpload("cooSig")} has={!!brand.cooSig} onClear={() => setBrand((b)=>({...b, cooSig:null}))} />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="Default Level">
                  <input className="inp" value={brand.defaultLevel}
                    onChange={(e)=>setBrand((b)=>({...b, defaultLevel:e.target.value}))}/>
                </Field>
                <Field label="Default Tutor">
                  <input className="inp" value={brand.defaultTutor}
                    onChange={(e)=>setBrand((b)=>({...b, defaultTutor:e.target.value}))}/>
                </Field>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold text-neutral-700">
                  Skala nilai
                </div>
                <div className="space-y-2">
                  {brand.bands.map((band, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 w-10">min</span>
                      <input type="number" className="inp w-20"
                        value={band.min}
                        onChange={(e)=>updateBand(i,{min:Number(e.target.value)})}/>
                      <input className="inp w-20"
                        value={band.grade}
                        onChange={(e)=>updateBand(i,{grade:e.target.value})}/>
                      <button onClick={()=>removeBand(i)}
                        className="text-neutral-400 hover:text-red-500 px-2">{"\u2715"}</button>
                    </div>
                  ))}
                </div>
                <button onClick={addBand}
                  className="mt-2 text-sm font-medium text-leafdark hover:underline">
                  + Tambah baris
                </button>
              </div>
            </Card>
          )}
        </section>

        {/* preview */}
        <section>
          <div className="sticky top-4">
            <div className="mb-2 text-sm text-neutral-500">Pratinjau langsung</div>
            <div
              ref={previewWrap}
              className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-[#e4ead8] overflow-hidden"
            >
              <div
                style={{
                  width: 720 * scale,
                  height: "auto",
                }}
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: 720,
                  }}
                >
                  <ReportCard data={report} brand={brand} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* render tersembunyi: kartu semua murid untuk ekspor */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -100000, top: 0, pointerEvents: "none" }}
      >
        {students.map((s, i) => (
          <ReportCard
            key={i}
            ref={(el) => {
              exportRefs.current[i] = el;
            }}
            data={s}
            brand={brand}
          />
        ))}
      </div>

      <style jsx global>{`
        .inp {
          width: 100%;
          border: 1px solid #d8ddcd;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 14px;
          outline: none;
          background: #fff;
        }
        .inp:focus {
          border-color: #8cc63f;
          box-shadow: 0 0 0 3px rgba(140, 198, 63, 0.2);
        }
      `}</style>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#e9ecdf]">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-leafdark">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-medium text-neutral-600">
        {label}
        {hint ? (
          <span className="text-neutral-400">{" \u00b7 "}{hint}</span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

function Upload({
  label,
  onChange,
  has,
  onClear,
}: {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  has: boolean;
  onClear: () => void;
}) {
  return (
    <div className="mt-1 flex items-center gap-3">
      <label className="cursor-pointer rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
        {label}
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
      {has ? (
        <button onClick={onClear} className="text-xs text-neutral-400 hover:text-red-500">
          hapus
        </button>
      ) : (
        <span className="text-xs text-neutral-400">belum ada</span>
      )}
    </div>
  );
}
