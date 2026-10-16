import React from 'react';
import {COLORS} from '../constants';

export const ConfusedKid: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 380, style}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{position: 'absolute', ...style}}>
    <path
      d="M52 260 C52 208 70 182 100 182 C130 182 148 208 148 260 Z"
      fill={COLORS.accent}
      stroke={COLORS.ink}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path
      d="M62 198 C34 178 40 134 70 114"
      stroke={COLORS.accentDark}
      strokeWidth={22}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="72" cy="112" r="13" fill={COLORS.skin} stroke={COLORS.ink} strokeWidth={6} />
    <circle cx="100" cy="86" r="52" fill={COLORS.skin} stroke={COLORS.ink} strokeWidth={7} />
    <path
      d="M48 78 C52 40 74 24 100 24 C126 24 148 40 152 78 C142 60 124 54 100 54 C76 54 58 60 48 78 Z"
      fill={COLORS.hair}
    />
    <circle cx="82" cy="90" r="6" fill={COLORS.ink} />
    <circle cx="118" cy="90" r="6" fill={COLORS.ink} />
    <path
      d="M70 74 Q80 64 92 70 M108 70 Q120 64 130 74"
      stroke={COLORS.ink}
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
    />
    <path d="M86 116 Q100 104 114 116" stroke={COLORS.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path
      d="M152 56 Q162 72 152 80 Q142 72 152 56 Z"
      fill={COLORS.sky}
      stroke={COLORS.ink}
      strokeWidth={5}
    />
  </svg>
);
