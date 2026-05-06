// src/components/ui/RadarChart.tsx
import React from 'react';

interface RadarChartProps {
  areas: string[];
  scores: Record<string, number>;
  benchmark: Record<string, number>;
  size?: number;
}

export default function RadarChart({ areas, scores, benchmark, size = 220 }: RadarChartProps) {
  const n = 6;
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.33;
  const labelR = size * 0.43;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

  const px = (i: number, val: number) => cx + R * (val / 5) * Math.cos(angle(i));
  const py = (i: number, val: number) => cy + R * (val / 5) * Math.sin(angle(i));
  const lx = (i: number) => cx + labelR * Math.cos(angle(i));
  const ly = (i: number) => cy + labelR * Math.sin(angle(i));

  const toPoints = (vals: number[]) =>
    vals.map((v, i) => `${px(i, v)},${py(i, v)}`).join(' ');

  const scoreVals = areas.map(a => scores[a] ?? 0);
  const bmVals    = areas.map(a => benchmark[a] ?? 3);

  const textAnchor = (i: number) => {
    const ax = Math.cos(angle(i));
    if (ax < -0.1) return 'end';
    if (ax > 0.1)  return 'start';
    return 'middle';
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ display: 'block' }}
    >
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map(level => (
        <polygon
          key={level}
          points={toPoints(Array(n).fill(level))}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={level === 3 ? 1 : 0.5}
          strokeDasharray={level === 3 ? '3,2' : undefined}
        />
      ))}

      {/* Axes */}
      {areas.map((_, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={px(i, 5)} y2={py(i, 5)}
          stroke="#E2E8F0" strokeWidth={0.7}
        />
      ))}

      {/* Benchmark polygon */}
      <polygon
        points={toPoints(bmVals)}
        fill="rgba(148,163,184,0.1)"
        stroke="#94A3B8"
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />

      {/* Score polygon */}
      <polygon
        points={toPoints(scoreVals)}
        fill="rgba(74,158,142,0.22)"
        stroke="#4A9E8E"
        strokeWidth={2}
      />

      {/* Score dots */}
      {areas.map((a, i) => {
        const v = scores[a] ?? 0;
        if (v === 0) return null;
        return (
          <circle
            key={a}
            cx={px(i, v)} cy={py(i, v)}
            r={4}
            fill="#4A9E8E"
            stroke="#fff"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Labels */}
      {areas.map((a, i) => (
        <text
          key={a}
          x={lx(i)} y={ly(i)}
          textAnchor={textAnchor(i)}
          dominantBaseline="middle"
          fontSize={9}
          fontFamily="Apple SD Gothic Neo, Malgun Gothic, sans-serif"
          fill="#374151"
          fontWeight={600}
        >
          {a}
        </text>
      ))}
    </svg>
  );
}

/** Return raw SVG string for print (no React) */
export function radarSVGString(areas: string[], scores: Record<string, number>, benchmark: Record<string, number>, size = 220): string {
  const n = 6;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.33;
  const labelR = size * 0.43;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const px = (i: number, v: number) => +(cx + R * (v/5) * Math.cos(angle(i))).toFixed(2);
  const py = (i: number, v: number) => +(cy + R * (v/5) * Math.sin(angle(i))).toFixed(2);
  const pt = (i: number, v: number) => `${px(i,v)},${py(i,v)}`;
  const toPoints = (vals: number[]) => vals.map((v,i) => pt(i,v)).join(' ');
  const scoreVals = areas.map(a => scores[a] ?? 0);
  const bmVals    = areas.map(a => benchmark[a] ?? 3);

  const rings = [1,2,3,4,5].map(l =>
    `<polygon points="${toPoints(Array(n).fill(l))}" fill="none" stroke="#e2e8f0" stroke-width="${l===3?1:0.5}" ${l===3?'stroke-dasharray="3,2"':''}/>`
  ).join('');

  const axes = areas.map((_,i) =>
    `<line x1="${cx}" y1="${cy}" x2="${px(i,5)}" y2="${py(i,5)}" stroke="#e2e8f0" stroke-width="0.7"/>`
  ).join('');

  const bmPoly = `<polygon points="${toPoints(bmVals)}" fill="rgba(148,163,184,0.1)" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  const scPoly = `<polygon points="${toPoints(scoreVals)}" fill="rgba(74,158,142,0.22)" stroke="#4A9E8E" stroke-width="2"/>`;
  const dots = areas.map((a,i) => {
    const v = scores[a] ?? 0;
    return v > 0 ? `<circle cx="${px(i,v)}" cy="${py(i,v)}" r="4" fill="#4A9E8E" stroke="#fff" stroke-width="1.5"/>` : '';
  }).join('');

  const lbls = areas.map((a,i) => {
    const ax = Math.cos(angle(i));
    const ta = ax < -0.1 ? 'end' : ax > 0.1 ? 'start' : 'middle';
    const x = +(cx + labelR * Math.cos(angle(i))).toFixed(1);
    const y = +(cy + labelR * Math.sin(angle(i))).toFixed(1);
    return `<text x="${x}" y="${y}" text-anchor="${ta}" dominant-baseline="middle" font-size="9" font-family="Apple SD Gothic Neo,Malgun Gothic,sans-serif" fill="#374151" font-weight="600">${a}</text>`;
  }).join('');

  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${rings}${axes}${bmPoly}${scPoly}${dots}${lbls}</svg>`;
}
