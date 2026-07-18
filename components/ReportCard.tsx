"use client";

import { forwardRef } from "react";
import { SeigaihaCorners } from "./Seigaiha";
import { Brand, ReportData, ScoreKey } from "@/lib/types";
import {
  attendanceGrade,
  attendancePercent,
  finalGrade,
  legendRows,
  parseScore,
  scoreToGrade,
} from "@/lib/grades";

const GREEN = "#8CC63F";
const GREEN_SOFT = "#E8F3D3";
const INK = "#1C1C1C";

const ROWS: { key: ScoreKey; en: string; jp: string; raw?: boolean }[] = [
  { key: "attendance", en: "Attendance", jp: "\u51fa\u5e2d" },
  { key: "participation", en: "In class participation", jp: "\u7a4d\u6975\u6027" },
  { key: "grammar", en: "Grammar", jp: "\u6587\u6cd5" },
  { key: "kanji", en: "Kanji", jp: "\u6f22\u5b57" },
  { key: "test", en: "Test", jp: "\u8a66\u9a13", raw: true },
  { key: "speaking", en: "Speaking", jp: "\u4f1a\u8a71" },
];

type Props = { data: ReportData; brand: Brand };

const ReportCard = forwardRef<HTMLDivElement, Props>(function ReportCard(
  { data, brand },
  ref
) {
  const bands = brand.bands;
  const level = data.level.trim() || brand.defaultLevel;
  const tutor = data.tutor.trim() || brand.defaultTutor;

  const nums = ROWS.map((r) =>
    r.key === "attendance"
      ? attendancePercent(parseScore(data.scores[r.key]))
      : parseScore(data.scores[r.key])
  );
  const final = finalGrade(nums, data.finalOverride, bands);
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
        color: INK,
        fontFamily: sans,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* awan seigaiha di sudut atas */}
      <SeigaihaCorners color={GREEN} />

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
              border: `4px solid ${GREEN}`,
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
            <span style={{ fontWeight: 700, color: GREEN, fontSize: 12 }}>
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
        <div style={{ fontFamily: jp, fontWeight: 700, fontSize: 26, marginTop: 2 }}>
          {"\uff08\u6210\u7e3e\u8868\uff09"}
        </div>
      </div>

      <div
        style={{
          height: 4,
          background: GREEN,
          margin: "14px 48px 0",
          borderRadius: 2,
        }}
      />

      {/* body */}
      <div style={{ padding: "16px 48px 0" }}>
        {/* info */}
        <div style={{ fontSize: 17, lineHeight: 1.7 }}>
          <InfoRow label="Student Name" value={data.studentName || "\u2014"} />
          <InfoRow label="Level" value={level} />
          <InfoRow label="Tutor" value={tutor} />
        </div>

        {/* table */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <HeadCell>TITLE</HeadCell>
            <HeadCell width={160} center>
              SCORE
            </HeadCell>
          </div>
          {ROWS.map((r) => {
            const n = parseScore(data.scores[r.key]);
            const shown =
              r.key === "attendance"
                ? attendanceGrade(n)
                : r.raw
                ? n === null
                  ? ""
                  : String(n)
                : scoreToGrade(n, bands);
            return (
              <div key={r.key} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    flex: "1 1 0%",
                    boxSizing: "border-box",
                    background: GREEN_SOFT,
                    borderRadius: 8,
                    padding: "12px 18px",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {r.en}
                  <span style={{ fontFamily: jp, fontWeight: 500 }}>
                    {"\uff08" + r.jp + "\uff09"}
                  </span>
                </div>
                <div
                  style={{
                    flex: "0 0 160px",
                    boxSizing: "border-box",
                    background: GREEN_SOFT,
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

        {/* grade + notes */}
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={boxHead(GREEN)}>GRADE</div>
            <div
              style={{
                background: GREEN_SOFT,
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
            <div style={boxHead(GREEN)}>NOTES</div>
            <div
              style={{
                background: GREEN_SOFT,
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
                background: GREEN,
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
          />
          <Signature
            name={brand.cooName}
            title={brand.cooTitle}
            sig={brand.cooSig}
          />
        </div>
      </div>

      {/* footer hijau */}
      <div
        style={{
          background: GREEN,
          marginTop: 26,
          padding: "13px 0",
          textAlign: "center",
          fontWeight: 800,
          fontSize: 21,
          letterSpacing: 0.5,
        }}
      >
        CETTA JAPANESE
      </div>
    </div>
  );
});

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
}: {
  children: React.ReactNode;
  width?: number;
  center?: boolean;
}) {
  return (
    <div
      style={{
        flex: width ? `0 0 ${width}px` : "1 1 0%",
        boxSizing: "border-box",
        background: GREEN,
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

function boxHead(bg: string): React.CSSProperties {
  return {
    background: bg,
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
}: {
  name: string;
  title: string;
  sig: string | null;
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
      <div style={{ borderTop: "1.5px solid #1c1c1c", paddingTop: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
      </div>
    </div>
  );
}

export default ReportCard;
