import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Paper} from '../components/Paper';
import type {Caption} from './script';

export const Letterbox: React.FC<{height?: number}> = ({height = 96}) => {
  const frame = useCurrentFrame();
  const off = interpolate(frame, [0, 22], [-height - 4, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: 'clamp',
  });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: off,
          left: 0,
          right: 0,
          height,
          background: '#0A0A0A',
          zIndex: 40,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: off,
          left: 0,
          right: 0,
          height,
          background: '#0A0A0A',
          zIndex: 40,
        }}
      />
    </>
  );
};

export const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const active = captions.find((c) => frame >= c.from && frame <= c.to);
  if (!active) {
    return null;
  }
  const opacity = Math.min(
    interpolate(frame, [active.from, active.from + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    interpolate(frame, [active.to - 10, active.to], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 260,
        zIndex: 50,
      }}
    >
      <div
        style={{
          opacity,
          background: 'rgba(255,253,243,0.97)',
          color: '#2B2B2B',
          padding: '16px 36px',
          borderRadius: 12,
          borderBottom: '6px solid #E8A13D',
          fontSize: 34,
          maxWidth: 1250,
          textAlign: 'center',
          boxShadow: '0 10px 0 rgba(0,0,0,0.16), 0 20px 36px rgba(0,0,0,0.22)',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};

export const ProgressBar: React.FC<{total: number; marks: number[]}> = ({total, marks}) => {
  const frame = useCurrentFrame();
  const pct = Math.min(frame / total, 1);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 7,
          width: `${pct * 100}%`,
          background: '#E8A13D',
          zIndex: 60,
        }}
      />
      {marks.map((m, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${(m / total) * 100}%`,
            width: 5,
            height: 18,
            background: '#E8A13D',
            opacity: 0.75,
            zIndex: 61,
          }}
        />
      ))}
    </>
  );
};

export const ChapterCard: React.FC<{
  n: number;
  name: string;
  place: string;
  duration: number;
}> = ({n, name, place, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: {damping: 14, stiffness: 130}});
  const out = interpolate(frame, [duration - 22, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(inP, [0, 1], [0.85, 1]);
  const y = interpolate(inP, [0, 1], [40, 0]);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: out,
        background: 'rgba(20,16,8,0.22)',
        zIndex: 30,
      }}
    >
      <div style={{transform: `scale(${scale}) translateY(${y}px)`}}>
        <Paper
          color="#FFFDF3"
          rotate={-1.6}
          style={{padding: '54px 96px', textAlign: 'center', borderRadius: 16}}
        >
          <div style={{fontSize: 34, letterSpacing: 10, color: '#8A6D3B', fontWeight: 700}}>
            CHAPTER {n}
          </div>
          <div style={{fontSize: 96, fontWeight: 900, lineHeight: 1.05, marginTop: 6}}>
            {name}
          </div>
          <div
            style={{
              marginTop: 16,
              display: 'inline-block',
              background: '#2B2B2B',
              color: '#fff',
              padding: '8px 26px',
              borderRadius: 24,
              fontSize: 26,
              letterSpacing: 4,
            }}
          >
            {place}
          </div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<{n: number; name: string; place: string}> = ({
  n,
  name,
  place,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 110, fps, config: {damping: 13}});
  const x = interpolate(s, [0, 1], [-640, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        bottom: 110,
        transform: `translateX(${x}px)`,
        zIndex: 30,
      }}
    >
      <Paper
        color="#FFFDF3"
        rotate={-0.8}
        style={{
          padding: '18px 34px',
          borderRadius: 10,
          borderLeft: '10px solid #E8A13D',
        }}
      >
        <div style={{fontSize: 22, letterSpacing: 6, color: '#8A6D3B', fontWeight: 700}}>
          CHAPTER {n} • {place}
        </div>
        <div style={{fontSize: 40, fontWeight: 900}}>{name}</div>
      </Paper>
    </div>
  );
};

export const KenBurns: React.FC<{children: React.ReactNode; duration: number}> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.05, 1.13], {
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
};

export const StatCounter: React.FC<{
  emoji: string;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
  rotate?: number;
}> = ({emoji, value, suffix = '', label, delay, rotate = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14}});
  const p = interpolate(frame, [delay, delay + 55], [0, value], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const display = Math.round(p).toLocaleString('en-IN');
  return (
    <div
      style={{
        transform: `translateY(${interpolate(s, [0, 1], [400, 0])}px)`,
        opacity: s,
        width: 460,
      }}
    >
      <Paper
        color="#FFFDF3"
        rotate={rotate}
        style={{padding: '36px 30px', textAlign: 'center', borderRadius: 14}}
      >
        <div style={{fontSize: 64}}>{emoji}</div>
        <div
          style={{
            fontSize: 86,
            fontWeight: 900,
            color: '#D96C4A',
            lineHeight: 1.05,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {display}
          {suffix}
        </div>
        <div style={{fontSize: 30, color: '#444', marginTop: 8}}>{label}</div>
      </Paper>
    </div>
  );
};

export const MapRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [40, 210], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const len = 1500;
  const dots = [
    {x: 330, y: 640, label: 'Samarkand', at: 60},
    {x: 980, y: 480, label: 'Baghdad', at: 130},
    {x: 1560, y: 380, label: 'Venice', at: 205},
  ];
  return (
    <svg
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      viewBox="0 0 1920 1080"
    >
      <path
        d="M 330 640 C 640 560, 700 500, 980 480 S 1300 420, 1560 380"
        fill="none"
        stroke="#2B2B2B"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        opacity={0.85}
      />
      {dots.map((d, i) => {
        const s = spring({frame: frame - d.at, fps, config: {damping: 12}});
        return (
          <g key={i} transform={`translate(${d.x} ${d.y}) scale(${s})`}>
            <circle r={16} fill="#D96C4A" stroke="#2B2B2B" strokeWidth={5} />
            <text
              y={-36}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize={40}
              fontWeight={700}
              fill="#2B2B2B"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const ScissorsSweep: React.FC<{delay?: number}> = ({delay = 30}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const x = interpolate(frame, [delay, durationInFrames - 30], [-260, 2200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const open = Math.sin(frame * 0.4) * 14;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 380,
          left: 0,
          width: Math.max(x, 0),
          borderTop: '6px dashed rgba(43,43,43,0.30)',
          zIndex: 5,
        }}
      />
      <div style={{position: 'absolute', top: 320, left: x, zIndex: 6}}>
        <div style={{fontSize: 110, transform: 'rotate(18deg)'}}>
          <span style={{display: 'inline-block', transform: `rotate(${open}deg)`}}>✂️</span>
        </div>
      </div>
    </>
  );
};

export const GrainVignette: React.FC = () => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 45}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.28) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px)',
        }}
      />
    </AbsoluteFill>
  );
};
