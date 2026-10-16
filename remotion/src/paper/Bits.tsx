import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';
import {FONT_LABEL} from '../fonts';

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const PaperCard: React.FC<{
  color?: string;
  rotate?: number;
  shadow?: boolean;
  padded?: boolean;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({color = COLORS.white, rotate = 0, shadow = true, padded = true, radius = 6, style, children}) => {
  return (
    <div
      style={{
        backgroundColor: color,
        transform: `rotate(${rotate}deg)`,
        filter: shadow ? 'drop-shadow(10px 12px 0 rgba(43,33,24,0.22))' : undefined,
        borderRadius: radius,
        padding: padded ? '26px 30px' : undefined,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Stamp: React.FC<{
  text: string;
  color?: string;
  at?: number;
  rotate?: number;
  fontSize?: number;
  seed?: string;
  style?: React.CSSProperties;
}> = ({text, color = COLORS.red, at = 0, rotate = -6, fontSize = 54, seed = 'stamp', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 20, stiffness: 400, mass: 0.6}});
  const scale = interpolate(p, [0, 1], [2.5, 1], clampOpts);
  const wobble = (random(`${seed}-${Math.floor(Math.max(0, frame - at) / 3)}`) - 0.5) * (pf < 8 ? 4 : 0.7);
  const opacity = interpolate(pf, [0, 2], [0, 1], clampOpts);
  return (
    <div
      style={{
        transform: `rotate(${rotate + wobble}deg) scale(${scale})`,
        opacity,
        color,
        border: `${Math.max(4, fontSize * 0.09)}px solid ${color}`,
        borderRadius: 10,
        padding: `${fontSize * 0.14}px ${fontSize * 0.36}px`,
        fontFamily: FONT_LABEL,
        fontSize,
        letterSpacing: 2,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const WashiTape: React.FC<{
  color?: string;
  w: number;
  h: number;
  rotate?: number;
  seed?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({color = COLORS.yellow, w, h, rotate = 0, seed = 'tape', opacity = 0.86, style}) => {
  const frame = useCurrentFrame();
  const jr = (random(`${seed}-${Math.floor(frame / 3)}`) - 0.5) * 0.5;
  return (
    <div
      style={{
        width: w,
        height: h,
        transform: `rotate(${rotate + jr}deg)`,
        backgroundColor: color,
        opacity,
        clipPath:
          'polygon(1% 6%, 4% 0%, 97% 2%, 100% 9%, 99% 93%, 95% 100%, 3% 98%, 0% 91%)',
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 6px, transparent 6px 14px)',
        boxShadow: '4px 5px 0 rgba(43,33,24,0.16)',
        ...style,
      }}
    />
  );
};

export const TapeLabel: React.FC<{
  text: string;
  color?: string;
  at?: number;
  rotate?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({text, color = COLORS.yellow, at = 0, rotate = -2, fontSize = 34, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 14, stiffness: 220, mass: 0.7}});
  const sx = interpolate(p, [0, 1], [0.6, 1], clampOpts);
  const opacity = interpolate(pf, [0, 3], [0, 1], clampOpts);
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${rotate}deg) scaleX(${sx})`,
        transformOrigin: 'center',
        opacity,
        backgroundColor: color,
        color: COLORS.ink,
        fontFamily: FONT_LABEL,
        fontSize,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: '10px 26px',
        clipPath: 'polygon(1% 8%, 5% 0%, 96% 3%, 100% 12%, 99% 90%, 94% 100%, 3% 97%, 0% 88%)',
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 5px, transparent 5px 12px)',
        boxShadow: '5px 6px 0 rgba(43,33,24,0.18)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const Highlighter: React.FC<{
  w: number;
  h?: number;
  color?: string;
  progress: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({w, h = 44, color = COLORS.yellow, progress, rotate = -1.2, style}) => {
  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: color,
        opacity: 0.9,
        transform: `rotate(${rotate}deg) scaleX(${Math.max(0.001, Math.min(1, progress))})`,
        transformOrigin: 'left center',
        mixBlendMode: 'multiply',
        clipPath: 'polygon(0 10%, 3% 0%, 99% 5%, 100% 92%, 97% 100%, 2% 96%)',
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 7px, transparent 7px 16px)',
        ...style,
      }}
    />
  );
};

export const SketchArrow: React.FC<{
  d: string;
  viewBox?: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  at?: number;
  drawFrames?: number;
  headAt?: [number, number, number];
  headSize?: number;
  style?: React.CSSProperties;
}> = ({
  d,
  viewBox = '0 0 400 300',
  width = 400,
  height = 300,
  color = COLORS.ink,
  strokeWidth = 7,
  at = 0,
  drawFrames = 12,
  headAt,
  headSize = 22,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + drawFrames], [0, 1], clampOpts);
  const headP = interpolate(frame, [at + drawFrames - 2, at + drawFrames + 3], [0, 1], clampOpts);
  return (
    <svg width={width} height={height} viewBox={viewBox} style={{position: 'absolute', ...style}}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        transform="translate(2,3)"
        opacity={0.25}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - p}
      />
      {headAt ? (
        <g transform={`translate(${headAt[0]}, ${headAt[1]}) rotate(${headAt[2]}) scale(${headP})`}>
          <path
            d={`M ${-headSize} ${-headSize * 0.62} L 0 0 L ${-headSize} ${headSize * 0.62}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  );
};

export const CheckMark: React.FC<{
  at?: number;
  drawFrames?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({at = 0, drawFrames = 7, size = 64, color = COLORS.green, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + drawFrames], [0, 1], clampOpts);
  const pop = spring({
    frame: Math.max(0, frame - at - drawFrames + 2),
    fps: 30,
    config: {damping: 11, stiffness: 260, mass: 0.6},
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', ...style}}>
      <path
        d="M 14 56 L 40 82 L 88 18"
        fill="none"
        stroke={color}
        strokeWidth={13}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        transform={`translate(50 50) scale(${0.85 + 0.15 * pop}) translate(-50 -50)`}
      />
    </svg>
  );
};

export const CrossMark: React.FC<{
  at?: number;
  drawFrames?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({at = 0, drawFrames = 5, size = 60, color = COLORS.red, style}) => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [at, at + drawFrames], [0, 1], clampOpts);
  const p2 = interpolate(frame, [at + 3, at + 3 + drawFrames], [0, 1], clampOpts);
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth: 14,
    strokeLinecap: 'round' as const,
    pathLength: 1,
    strokeDasharray: '1',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', ...style}}>
      <path d="M 16 16 L 84 84" {...common} strokeDashoffset={1 - p1} />
      <path d="M 84 16 L 16 84" {...common} strokeDashoffset={1 - p2} />
    </svg>
  );
};

export const FlipIn: React.FC<{
  at?: number;
  axis?: 'x' | 'y';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({at = 0, axis = 'y', style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 14, stiffness: 150, mass: 0.8}});
  const rot = (1 - p) * 92;
  const opacity = interpolate(pf, [0, 2], [0, 1], clampOpts);
  return (
    <div style={{perspective: 1600, ...style}}>
      <div
        style={{
          transform: axis === 'y' ? `rotateY(${-rot}deg)` : `rotateX(${rot}deg)`,
          opacity,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PopBubble: React.FC<{
  at?: number;
  color?: string;
  rotate?: number;
  tail?: 'left' | 'right' | 'bottom' | 'none';
  fontSize?: number;
  seed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at = 0, color = COLORS.white, rotate = -2, tail = 'left', fontSize = 38, seed = 'bubble', style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 11, stiffness: 200, mass: 0.7}});
  const scale = 0.4 + 0.6 * p;
  const opacity = interpolate(pf, [0, 3], [0, 1], clampOpts);
  const sway = pf > 12 ? Math.sin((frame - at) * 0.13) * 1.4 : 0;
  const tailStyle: React.CSSProperties =
    tail === 'none'
      ? {}
      : tail === 'bottom'
        ? {left: '48%', bottom: -14, transform: 'rotate(45deg)'}
        : tail === 'left'
          ? {left: -12, top: '58%', transform: 'rotate(45deg)'}
          : {right: -12, top: '58%', transform: 'rotate(45deg)'};
  return (
    <div
      style={{
        position: 'absolute',
        transform: `rotate(${rotate + sway}deg) scale(${scale})`,
        opacity,
        backgroundColor: color,
        color: COLORS.ink,
        fontFamily: FONT_LABEL,
        fontSize,
        letterSpacing: 1,
        textTransform: 'uppercase',
        padding: '20px 34px',
        borderRadius: 14,
        filter: 'drop-shadow(9px 10px 0 rgba(43,33,24,0.22))',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
      {tail !== 'none' ? (
        <div
          style={{
            position: 'absolute',
            width: 26,
            height: 26,
            backgroundColor: color,
            ...tailStyle,
          }}
        />
      ) : null}
    </div>
  );
};

export const Confetti: React.FC<{
  at?: number;
  count?: number;
  origin?: [number, number];
  colors?: string[];
  spread?: number;
  duration?: number;
  seed?: string;
}> = ({
  at = 0,
  count = 14,
  origin = [540, 800],
  colors = [COLORS.accent, COLORS.teal, COLORS.yellow, COLORS.red, COLORS.lavender],
  spread = 420,
  duration = 42,
  seed = 'conf',
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`${seed}-a-${i}`) * Math.PI * 2;
        const dist = spread * (0.4 + random(`${seed}-d-${i}`) * 0.6);
        const d = frame - at - i * 1.5;
        if (d < 0) return null;
        const p = Math.min(1, d / duration);
        const x = Math.cos(a) * dist * p;
        const y = Math.sin(a) * dist * 0.7 * p + 380 * p * p;
        const spin = (random(`${seed}-s-${i}`) - 0.5) * 900 * p;
        const opacity = p < 0.75 ? 1 : 1 - (p - 0.75) / 0.25;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: origin[0] + x,
              top: origin[1] + y,
              width: 22 + random(`${seed}-w-${i}`) * 14,
              height: 30,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${random(`${seed}-r-${i}`) * 360 + spin}deg)`,
              opacity,
              borderRadius: 3,
              boxShadow: '3px 4px 0 rgba(43,33,24,0.18)',
            }}
          />
        );
      })}
    </>
  );
};

export const Scissors: React.FC<{
  size?: number;
  color?: string;
  snipAt?: number;
  style?: React.CSSProperties;
}> = ({size = 120, color = COLORS.ink, snipAt = 0, style}) => {
  const frame = useCurrentFrame();
  const snip = frame >= snipAt ? Math.sin((frame - snipAt) * 0.9) * 14 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', ...style}}>
      <circle cx="26" cy="24" r="13" fill="none" stroke={color} strokeWidth="7" />
      <circle cx="74" cy="24" r="13" fill="none" stroke={color} strokeWidth="7" />
      <path
        d={`M 33 33 L 72 84`}
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        transform={`rotate(${snip} 52 52)`}
      />
      <path
        d={`M 67 33 L 28 84`}
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        transform={`rotate(${-snip} 52 52)`}
      />
      <circle cx="50" cy="60" r="5" fill={color} />
    </svg>
  );
};

export const StickyNote: React.FC<{
  w?: number;
  h?: number;
  color?: string;
  rotate?: number;
  at?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({w = 620, h = 560, color = COLORS.sticky, rotate = -3, at = 0, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 15, stiffness: 240, mass: 0.8}});
  const scale = interpolate(p, [0, 1], [1.5, 1], clampOpts);
  const opacity = interpolate(pf, [0, 3], [0, 1], clampOpts);
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        backgroundColor: color,
        filter: 'drop-shadow(12px 14px 0 rgba(43,33,24,0.24))',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 74,
          height: 74,
          background: 'linear-gradient(135deg, transparent 48%, rgba(43,33,24,0.16) 50%)',
        }}
      />
      {children}
    </div>
  );
};

export const ProgressPips: React.FC<{
  count: number;
  doneAt: number[];
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({count, doneAt, size = 30, color = COLORS.accent, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', gap: 18, ...style}}>
      {new Array(count).fill(0).map((_, i) => {
        const at = doneAt[i] ?? Infinity;
        const p = spring({frame: Math.max(0, frame - at), fps, config: {damping: 12, stiffness: 300, mass: 0.5}});
        const on = frame >= at;
        const s = on ? 1 + 0.35 * p * (1 - p) * 4 : 1;
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              border: `5px solid ${COLORS.ink}`,
              backgroundColor: on ? color : 'transparent',
              transform: `scale(${s})`,
            }}
          />
        );
      })}
    </div>
  );
};
