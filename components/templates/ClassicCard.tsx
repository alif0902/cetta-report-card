"use client";

import { forwardRef } from "react";
import { SeigaihaCorners } from "../Seigaiha";
import {
  Band,
  Brand,
  ExtraCell,
  ReportData,
  TemplateRow,
  Theme,
} from "@/lib/types";
import { ExtraBlockDef } from "@/lib/templates";
import {
  attendanceGrade,
  attendancePercent,
  finalGrade,
  legendRows,
  parseScore,
  scoreToGrade,
} from "@/lib/grades";

/**
 * Layout "classic" Cetta: awan seigaiha di sudut atas, judul serif,
 * tabel nilai, kotak grade + notes, dua tanda tangan, footer berwarna.
 *
 * Semua warna dan baris nilai datang dari template, jadi satu layout ini
 * bisa dipakai ulang untuk banyak varian (hijau, ungu, dst).
 */
export type ClassicCardProps = {
  data: ReportData;
  brand: Brand;
  theme: Theme;
  rows: TemplateRow[];
  bands: Band[];
  footerText: string;
  /** Teks Level bawaan template, dipakai kalau kolom Level dikosongkan. */
  levelFallback: string;
  /** Baris polos di bawah header TITLE, mis. "Simulasi JLPT". */
  captionRow?: string;
  /** Definisi blok Final Test dari template, dipasangkan dengan isi murid. */
  blocks?: { def: ExtraBlockDef; cells: ExtraCell[] }[];
};

const ClassicCard = forwardRef<HTMLDivElement, ClassicCardProps>(
  function ClassicCard(
    {
      data,
      brand,
      theme,
      rows,
      bands,
      footerText,
      levelFallback,
      captionRow,
      blocks,
    },
    ref
  ) {
    const level =
      data.level.trim() || levelFallback || brand.defaultLevel;
    const tutor = data.tutor.trim() || brand.defaultTutor;

    const nums = rows.map((r) =>
      r.key === "attendance"
        ? attendancePercent(parseScore(data.scores[r.key]))
        : parseScore(data.scores[r.key])
    );
    // nilai di blok Final Test ikut menentukan Final Score
    const blockNums = (blocks ?? []).flatMap((b) =>
      b.cells.map((c) => parseScore(c.score))
    );
    const final = finalGrade(
      [...nums, ...blockNums],
      data.finalOverride,
      bands
    );
    const legend = legendRows(bands);

    const jp = "'Noto Sans JP', sans-serif";
    const sans = "'Poppins', sans-serif";
    const serif = "'Playfair Display', serif";

    return (
      <div
        ref={ref}
        style={{
          width: 720,
          background: "#ffffff",
          color: theme.ink,
          fontFamily: sans,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* awan seigaiha di sudut atas */}
        <SeigaihaCorners color={theme.accent} />

        {/* logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 26,
            position: "relative",
            zIndex: 2,
          }}
        >
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logo}
              alt="Logo"
              style={{
                width: 112,
                height: 112,
                borderRadius: "50%",
                objectFit: "contain",
                background: "#fff",
              }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "#fff",
                border: `4px solid ${theme.accent}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1.05,
              }}
            >
              <span style={{ fontWeight: 700, color: "#e2452a", fontSize: 15 }}>
                CETTA
              </span>
              <span
                style={{ fontWeight: 700, color: theme.accent, fontSize: 12 }}
              >
                JAPANESE
              </span>
            </div>
          )}
        </div>

        {/* title */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div
            style={{
              fontFamily: serif,
              fontWeight: 900,
              fontSize: 58,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            REPORT CARD
          </div>
          <div
            style={{ fontFamily: jp, fontWeight: 700, fontSize: 26, marginTop: 2 }}
          >
            {"（成績表）"}
          </div>
        </div>

        <div
          style={{
            height: 4,
            background: theme.accent,
            margin: "14px 48px 0",
            borderRadius: 2,
          }}
        />

        {/* body */}
        <div style={{ padding: "16px 48px 0" }}>
          {/* info */}
          <div style={{ fontSize: 17, lineHeight: 1.7 }}>
            <InfoRow label="Student Name" value={data.studentName || "—"} />
            <InfoRow label="Level" value={level} />
            <InfoRow label="Tutor" value={tutor} />
          </div>

          {/* table */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <HeadCell theme={theme} center={rows.length === 0}>
                TITLE
              </HeadCell>
              {rows.length > 0 ? (
                <HeadCell theme={theme} width={160} center>
                  SCORE
                </HeadCell>
              ) : null}
            </div>
            {captionRow ? (
              <div
                style={{
                  background: theme.soft,
                  borderRadius: 8,
                  padding: "12px 18px",
                  marginBottom: 8,
                  fontWeight: 700,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                {captionRow}
              </div>
            ) : null}
            {rows.map((r) => {
              const n = parseScore(data.scores[r.key]);
              const shown =
                r.key === "attendance"
                  ? attendanceGrade(n, bands)
                  : r.raw
                  ? n === null
                    ? ""
                    : String(n)
                  : scoreToGrade(n, bands);
              return (
                <div
                  key={r.key}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <div
                    style={{
                      flex: "1 1 0%",
                      boxSizing: "border-box",
                      background: theme.soft,
                      borderRadius: 8,
                      padding: "12px 18px",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {r.en}
                    <span style={{ fontFamily: jp, fontWeight: 500 }}>
                      {"（" + r.jp + "）"}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: "0 0 160px",
                      boxSizing: "border-box",
                      background: theme.soft,
                      borderRadius: 8,
                      padding: "12px 8px",
                      fontWeight: 800,
                      fontSize: 22,
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {shown}
                  </div>
                </div>
              );
            })}
          </div>

          {/* blok Final Test / Kanji Test */}
          {(blocks ?? []).map(({ def, cells }, bi) =>
            cells.length ? (
              <div key={`${def.id}-${bi}`} style={{ marginTop: 10 }}>
                <div
                  style={{
                    background: theme.accent,
                    color: theme.onAccent,
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: 0.5,
                  }}
                >
                  {def.title}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {cells.map((c, i) => (
                    <div
                      key={`l${i}`}
                      style={{
                        flex: "1 1 0%",
                        minWidth: 0,
                        boxSizing: "border-box",
                        background: theme.soft,
                        borderRadius: 8,
                        padding: "9px 6px",
                        fontWeight: 700,
                        fontSize: 13,
                        textAlign: "center",
                        lineHeight: 1.25,
                        wordBreak: "break-word",
                      }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {cells.map((c, i) => (
                    <div
                      key={`s${i}`}
                      style={{
                        flex: "1 1 0%",
                        minWidth: 0,
                        boxSizing: "border-box",
                        background: theme.soft,
                        borderRadius: 8,
                        padding: "10px 6px",
                        fontWeight: 800,
                        fontSize: 22,
                        textAlign: "center",
                      }}
                    >
                      {c.score}
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

          {/* grade + notes */}
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={boxHead(theme)}>GRADE</div>
              <div
                style={{
                  background: theme.soft,
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginTop: 8,
                }}
              >
                {legend.map((l) => (
                  <div
                    key={l.grade}
                    style={{
                      display: "flex",
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ width: 42 }}>{l.grade}</span>
                    <span style={{ width: 16, textAlign: "center" }}>=</span>
                    <span>{l.range}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 2.1 }}>
              <div style={boxHead(theme)}>NOTES</div>
              <div
                style={{
                  background: theme.soft,
                  borderRadius: 8,
                  padding: "12px 16px",
                  marginTop: 8,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  textAlign: "justify",
                  minHeight: 150,
                }}
              >
                {data.notes}
              </div>
              {/* final score di kolom kanan, seperti master */}
              <div
                style={{
                  background: theme.accent,
                  color: theme.onAccent,
                  borderRadius: 8,
                  marginTop: 10,
                  padding: "10px 0",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: 21,
                  letterSpacing: 0.5,
                }}
              >
                FINAL SCORE :&nbsp;&nbsp;{final}
              </div>
            </div>
          </div>

          {/* signatures */}
          <div style={{ display: "flex", gap: 40, marginTop: 26 }}>
            <Signature
              name={brand.headName}
              title={brand.headTitle}
              sig={brand.headSig}
              ink={theme.ink}
            />
            <Signature
              name={brand.cooName}
              title={brand.cooTitle}
              sig={brand.cooSig}
              ink={theme.ink}
            />
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            background: theme.accent,
            color: theme.onFooter,
            marginTop: 26,
            marginLeft: theme.roundedFooter ? 48 : 0,
            marginRight: theme.roundedFooter ? 48 : 0,
            borderRadius: theme.roundedFooter ? "18px 18px 0 0" : 0,
            padding: "13px 0",
            textAlign: "center",
            fontWeight: 800,
            fontSize: 21,
            letterSpacing: 0.5,
          }}
        >
          {footerText}
        </div>
      </div>
    );
  }
);

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex" }}>
      <span style={{ width: 150, color: "#333" }}>{label}</span>
      <span style={{ width: 14 }}>:</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function HeadCell({
  children,
  width,
  center,
  theme,
}: {
  children: React.ReactNode;
  width?: number;
  center?: boolean;
  theme: Theme;
}) {
  return (
    <div
      style={{
        flex: width ? `0 0 ${width}px` : "1 1 0%",
        boxSizing: "border-box",
        background: theme.accent,
        color: theme.onAccent,
        borderRadius: 8,
        padding: "10px 18px",
        fontWeight: 800,
        fontSize: 16,
        letterSpacing: 0.5,
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </div>
  );
}

function boxHead(theme: Theme): React.CSSProperties {
  return {
    background: theme.accent,
    color: theme.onAccent,
    borderRadius: 8,
    padding: "8px 0",
    textAlign: "center",
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: 0.5,
  };
}

function Signature({
  name,
  title,
  sig,
  ink,
}: {
  name: string;
  title: string;
  sig: string | null;
  ink: string;
}) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {sig ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sig} alt="sig" style={{ maxHeight: 64, maxWidth: 190 }} />
        ) : null}
      </div>
      <div style={{ borderTop: `1.5px solid ${ink}`, paddingTop: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
      </div>
    </div>
  );
}

export default ClassicCard;
