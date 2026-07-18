"use client";

// 青海波 (seigaiha) wave pattern, rendered as a tiling SVG band.
export default function Seigaiha({
  height = 78,
  color = "#8CC63F",
}: {
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 240 78"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id="seigaiha"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke={color} strokeWidth="1.6">
            {/* row centered at bottom of tile -> top halves show as arcs */}
            {[-40, 0, 40].map((cx) =>
              [7, 13, 19].map((r) => (
                <circle key={`a${cx}-${r}`} cx={cx + 20} cy={20} r={r} />
              ))
            )}
            {/* staggered lower row */}
            {[-20, 20, 60].map((cx) =>
              [7, 13, 19].map((r) => (
                <circle key={`b${cx}-${r}`} cx={cx + 20} cy={40} r={r} />
              ))
            )}
          </g>
        </pattern>
      </defs>
      <rect x="0" y="0" width="240" height="78" fill="url(#seigaiha)" />
    </svg>
  );
}

// Gugusan awan seigaiha di dua sudut atas, seperti desain master.
export function SeigaihaCorners({ color = "#8CC63F" }: { color?: string }) {
  const cloud = (id: string) => (
    <defs>
      <g id={id} fill="none" stroke={color} strokeWidth="3">
        <circle r="34" fill="#fff" />
        <circle r="25" />
        <circle r="16" />
        <circle r="7" />
      </g>
    </defs>
  );
  return (
    <>
      <svg
        width="300"
        height="150"
        viewBox="0 0 300 150"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {cloud("sgc-tl")}
        {[[10, -6], [78, -14], [146, -8], [-12, 52], [52, 44], [118, 50], [18, 104], [84, 100]].map(
          ([x, y]) => (
            <use key={`${x}-${y}`} href="#sgc-tl" x={x} y={y} />
          )
        )}
      </svg>
      <svg
        width="260"
        height="130"
        viewBox="0 0 260 130"
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        {cloud("sgc-tr")}
        {[[120, -10], [188, -4], [252, -14], [152, 46], [218, 42], [250, 96]].map(([x, y]) => (
          <use key={`${x}-${y}`} href="#sgc-tr" x={x} y={y} />
        ))}
      </svg>
    </>
  );
}
