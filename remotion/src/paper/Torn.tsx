import React, {useMemo} from 'react';
import {random} from 'remotion';

export type TornSide = 'top' | 'bottom' | 'left' | 'right';

const buildContour = (
  length: number,
  teeth: number,
  amp: number,
  seed: string,
  variant: number
): {p: number; d: number}[] => {
  const pts: {p: number; d: number}[] = [];
  for (let i = 0; i <= teeth; i++) {
    const p = i / teeth;
    const n = random(`${seed}-v${variant}-${i}`);
    const spike = i % 4 === 2 ? 1.7 : 1;
    pts.push({p, d: (0.18 + n * 0.82) * amp * spike});
  }
  return pts;
};

export const TornStrip: React.FC<{
  side: TornSide;
  length: number;
  thickness?: number;
  color: string;
  seed?: string;
  amp?: number;
  teeth?: number;
  boilFrame?: number;
  style?: React.CSSProperties;
}> = ({
  side,
  length,
  thickness = 44,
  color,
  seed = 'torn',
  amp = 14,
  teeth,
  boilFrame,
  style,
}) => {
  const tCount = teeth ?? Math.max(16, Math.round(length / 46));
  const variant = boilFrame === undefined ? 0 : Math.floor(boilFrame / 3) % 3;
  const path = useMemo(() => {
    const pts = buildContour(length, tCount, amp, seed, variant);
    const fmt = (n: number) => n.toFixed(1);
    if (side === 'top') {
      let d = `M 0 ${fmt(thickness)}`;
      for (const pt of pts) d += ` L ${fmt(pt.p * length)} ${fmt(pt.d)}`;
      d += ` L ${fmt(length)} ${fmt(thickness)} Z`;
      return d;
    }
    if (side === 'bottom') {
      let d = `M 0 0`;
      for (const pt of pts) d += ` L ${fmt(pt.p * length)} ${fmt(thickness - pt.d)}`;
      d += ` L ${fmt(length)} 0 Z`;
      return d;
    }
    if (side === 'left') {
      let d = `M ${fmt(thickness)} 0`;
      for (const pt of pts) d += ` L ${fmt(pt.d)} ${fmt(pt.p * length)}`;
      d += ` L ${fmt(thickness)} ${fmt(length)} Z`;
      return d;
    }
    let d = `M 0 0`;
    for (const pt of pts) d += ` L ${fmt(thickness - pt.d)} ${fmt(pt.p * length)}`;
    d += ` L 0 ${fmt(length)} Z`;
    return d;
  }, [side, length, thickness, amp, seed, variant, tCount]);

  const w = side === 'top' || side === 'bottom' ? length : thickness;
  const h = side === 'top' || side === 'bottom' ? thickness : length;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{position: 'absolute', display: 'block', ...style}}
    >
      <path d={path} fill={color} />
    </svg>
  );
};
