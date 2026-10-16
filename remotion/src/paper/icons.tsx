import React from 'react';
import {COLORS} from '../constants';

export type IconProps = {
  size?: number;
  color?: string;
  stroke?: string;
  style?: React.CSSProperties;
};

const Base: React.FC<{
  size: number;
  style?: React.CSSProperties;
  viewBox?: string;
  children: React.ReactNode;
}> = ({size, style, viewBox = '0 0 100 100', children}) => (
  <svg width={size} height={size} viewBox={viewBox} style={{display: 'block', ...style}}>
    {children}
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M50 26 C38 16 20 14 10 18 L10 74 C20 70 38 72 50 82 C62 72 80 70 90 74 L90 18 C80 14 62 16 50 26 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M50 28 L50 80" stroke={stroke} strokeWidth={6} strokeLinecap="round" />
  </Base>
);

export const CalendarIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <rect x="12" y="20" width="76" height="68" rx="10" fill={color} stroke={stroke} strokeWidth={7} />
    <path d="M12 40 L88 40" stroke={stroke} strokeWidth={6} />
    <path d="M32 8 L32 26" stroke={stroke} strokeWidth={8} strokeLinecap="round" />
    <path d="M68 8 L68 26" stroke={stroke} strokeWidth={8} strokeLinecap="round" />
    <circle cx="32" cy="56" r="5" fill={stroke} />
    <circle cx="50" cy="56" r="5" fill={stroke} />
    <circle cx="68" cy="56" r="5" fill={stroke} />
    <circle cx="32" cy="72" r="5" fill={stroke} />
    <circle cx="50" cy="72" r="5" fill={stroke} />
  </Base>
);

export const FolderIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M10 26 L38 26 L46 36 L90 36 L86 84 L10 82 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </Base>
);

export const PdfIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path d="M24 10 L60 10 L78 28 L78 90 L24 90 Z" fill={color} stroke={stroke} strokeWidth={7} strokeLinejoin="round" />
    <path d="M60 10 L60 28 L78 28" fill="none" stroke={stroke} strokeWidth={6} strokeLinejoin="round" />
    <path d="M34 48 L68 48 M34 62 L68 62 M34 76 L54 76" stroke={stroke} strokeWidth={6} strokeLinecap="round" />
  </Base>
);

export const NotesIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <rect x="26" y="18" width="58" height="72" rx="8" fill={color} stroke={stroke} strokeWidth={7} transform="rotate(6 55 54)" />
    <rect x="16" y="12" width="58" height="72" rx="8" fill={color} stroke={stroke} strokeWidth={7} />
    <path d="M28 30 L60 30 M28 44 L60 44 M28 58 L60 58 M28 72 L46 72" stroke={stroke} strokeWidth={6} strokeLinecap="round" />
  </Base>
);

export const PlayIcon: React.FC<IconProps> = ({size = 100, color = COLORS.accent, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <rect x="10" y="10" width="80" height="80" rx="20" fill={color} stroke={stroke} strokeWidth={7} />
    <path d="M41 32 L72 50 L41 68 Z" fill={COLORS.white} stroke={stroke} strokeWidth={5} strokeLinejoin="round" />
  </Base>
);

export const RobotIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path d="M50 6 L50 18" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
    <circle cx="50" cy="6" r="6" fill={COLORS.accent} stroke={stroke} strokeWidth={5} />
    <rect x="16" y="20" width="68" height="58" rx="16" fill={color} stroke={stroke} strokeWidth={7} />
    <circle cx="36" cy="44" r="6" fill={stroke} />
    <circle cx="64" cy="44" r="6" fill={stroke} />
    <path d="M38 62 Q50 72 62 62" fill="none" stroke={stroke} strokeWidth={6} strokeLinecap="round" />
  </Base>
);

export const ClockIcon: React.FC<IconProps & {handAngle?: number}> = ({
  size = 100,
  color = COLORS.white,
  stroke = COLORS.ink,
  style,
  handAngle = -25,
}) => (
  <Base size={size} style={style}>
    <circle cx="50" cy="52" r="38" fill={color} stroke={stroke} strokeWidth={8} />
    <g transform={`rotate(${handAngle} 50 52)`}>
      <path d="M50 28 L50 52 L68 60" fill="none" stroke={COLORS.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </Base>
);

export const BulbIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <circle cx="50" cy="42" r="27" fill={color} stroke={stroke} strokeWidth={7} />
    <path d="M40 68 L60 68 L60 74 Q60 84 50 84 Q40 84 40 74 Z" fill={color} stroke={stroke} strokeWidth={7} strokeLinejoin="round" />
    <path d="M50 4 L50 10 M12 42 L18 42 M82 42 L88 42 M22 14 L27 19 M78 14 L73 19" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
  </Base>
);

export const PencilIcon: React.FC<IconProps> = ({size = 100, color = COLORS.yellow, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path d="M14 86 L10 94 L18 92 L72 38 L64 30 Z" fill={color} stroke={stroke} strokeWidth={6} strokeLinejoin="round" />
    <path d="M64 30 L72 38 L84 22 L76 14 Z" fill={COLORS.red} stroke={stroke} strokeWidth={6} strokeLinejoin="round" />
  </Base>
);

export const StarIcon: React.FC<IconProps> = ({size = 100, color = COLORS.yellow, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M50 8 L61 36 L92 38 L68 57 L76 88 L50 70 L24 88 L32 57 L8 38 L39 36 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </Base>
);

export const TargetIcon: React.FC<IconProps> = ({size = 100, color = COLORS.red, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <circle cx="50" cy="50" r="38" fill={COLORS.white} stroke={stroke} strokeWidth={7} />
    <circle cx="50" cy="50" r="22" fill="none" stroke={stroke} strokeWidth={7} />
    <circle cx="50" cy="50" r="7" fill={color} />
  </Base>
);

export const BellIcon: React.FC<IconProps> = ({size = 100, color = COLORS.yellow, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M50 10 Q56 10 56 17 C70 21 74 33 74 47 L74 58 L82 70 L18 70 L26 58 L26 47 C26 33 30 21 44 17 Q44 10 50 10 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M42 76 Q50 86 58 76" fill="none" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
  </Base>
);

export const LoopIcon: React.FC<IconProps> = ({size = 100, color = COLORS.teal, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M82 50 A32 32 0 1 1 66 23"
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
    <path d="M82 10 L82 30 L62 26" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </Base>
);

export const MapIcon: React.FC<IconProps> = ({size = 100, color = COLORS.white, stroke = COLORS.ink, style}) => (
  <Base size={size} style={style}>
    <path
      d="M10 24 L36 16 L64 26 L90 18 L90 76 L64 84 L36 74 L10 82 Z"
      fill={color}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M36 16 L36 74 M64 26 L64 84" stroke={stroke} strokeWidth={6} />
  </Base>
);
