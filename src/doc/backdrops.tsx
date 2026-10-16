import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useJitter} from '../components/Paper';
import {MapRoute} from './parts';

export const PaperSun: React.FC<{top: number; right: number; size?: number; color?: string}> = ({
  top,
  right,
  size = 220,
  color = '#E8A13D',
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      right,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: '0 10px 0 rgba(0,0,0,0.12), 0 0 0 26px rgba(239,194,94,0.85), 0 0 0 52px rgba(246,222,154,0.6)',
    }}
  />
);

export const PaperCloud: React.FC<{left: number; top: number; scale?: number; tint?: string}> = ({
  left,
  top,
  scale = 1,
  tint = '#fff',
}) => (
  <div style={{position: 'absolute', left, top, transform: `scale(${scale})`, display: 'flex'}}>
    {[80, 120, 92].map((s, i) => (
      <div
        key={i}
        style={{
          width: s,
          height: s,
          borderRadius: '50%',
          background: tint,
          marginLeft: i === 0 ? 0 : -26,
          marginTop: i === 1 ? -28 : 8,
          boxShadow: '0 8px 0 rgba(0,0,0,0.10)',
        }}
      />
    ))}
  </div>
);

export const RiceFieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const j = useJitter(frame, 2.5);
  const boatX = interpolate(frame, [0, 660], [1500, -300], {extrapolateRight: 'clamp'});
  const rows = [
    {y: 520, c: '#B9D3A8'},
    {y: 630, c: '#A3C492'},
    {y: 740, c: '#8DB57E'},
    {y: 850, c: '#77A56B'},
    {y: 960, c: '#619259'},
  ];
  return (
    <AbsoluteFill style={{backgroundColor: '#DCE8CF', overflow: 'hidden'}}>
      <PaperSun top={120} right={260} />
      <PaperCloud left={-30 + ((frame * 1.1) % 2100)} top={150} />
      <PaperCloud left={1200 - ((frame * 0.7) % 1500)} top={300} scale={1.3} tint="#FFF8E6" />
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '-4%',
            right: '-4%',
            top: r.y,
            height: 280,
            background: r.c,
            borderRadius: '50% 50% 0 0 / 14% 14% 0 0',
            boxShadow: '0 -6px 0 rgba(0,0,0,0.06)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 250,
          top: 300,
          transform: `translate(${j.x}px, ${j.y}px) rotate(${j.r}deg)`,
          filter: 'drop-shadow(0 10px 0 rgba(0,0,0,0.12))',
        }}
      >
        <svg width="250" height="360" viewBox="0 0 240 340" style={{overflow: 'visible'}}>
          <rect x="80" y="216" width="80" height="116" fill="#E8C9A0" />
          <rect x="88" y="152" width="64" height="100" fill="#E8C9A0" />
          <rect x="96" y="96" width="48" height="90" fill="#E8C9A0" />
          <rect x="104" y="278" width="32" height="54" fill="#8A5A33" />
          <path d="M 8 252 Q 120 178 232 252 Q 120 232 8 252 Z" fill="#C0392B" />
          <path d="M 32 184 Q 120 120 208 184 Q 120 172 32 184 Z" fill="#C0392B" />
          <path d="M 56 122 Q 120 68 184 122 Q 120 112 56 122 Z" fill="#C0392B" />
          <line x1="120" y1="68" x2="120" y2="40" stroke="#9C4A2F" strokeWidth="6" />
          <circle cx="120" cy="34" r="7" fill="#E8A13D" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          background: '#7FB3C8',
          boxShadow: '0 -8px 0 rgba(0,0,0,0.08)',
        }}
      />
      <div style={{position: 'absolute', left: boatX, bottom: 130, fontSize: 90, transform: 'rotate(-4deg)'}}>
        ⛵
      </div>
    </AbsoluteFill>
  );
};

export const DesertScene: React.FC = () => {
  const frame = useCurrentFrame();
  const camels = [0, 260, 520];
  return (
    <AbsoluteFill style={{backgroundColor: '#F2DCB0', overflow: 'hidden'}}>
      <PaperSun top={110} right={150} color="#E08E3C" />
      <PaperCloud left={500 - ((frame * 0.5) % 1600)} top={140} scale={1.1} tint="#FFF6E0" />
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          right: '-10%',
          top: 620,
          height: 420,
          background: '#E3BC7B',
          borderRadius: '50% 50% 0 0',
          boxShadow: '0 -10px 0 rgba(0,0,0,0.08)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          right: '-5%',
          top: 760,
          height: 380,
          background: '#D4A65F',
          borderRadius: '50% 50% 0 0',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-5%',
          right: '-20%',
          top: 900,
          height: 320,
          background: '#C6924A',
          borderRadius: '50% 50% 0 0',
        }}
      />
      <MapRoute />
      {camels.map((off, i) => {
        const x = interpolate(frame, [0, 660], [-400 - off, 2400 - off], {
          extrapolateRight: 'clamp',
        });
        const bob = Math.abs(Math.sin((frame + i * 20) * 0.25)) * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              bottom: 170 - i * 10,
              fontSize: 92,
              transform: `scaleX(-1) translateY(${bob}px)`,
            }}
          >
            🐪
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const BUILDINGS = [
  {x: 120, w: 180, h: 420, c: '#8FA8B8'},
  {x: 330, w: 150, h: 540, c: '#7A94A6'},
  {x: 510, w: 200, h: 380, c: '#9DB4C2'},
  {x: 740, w: 160, h: 480, c: '#7A94A6'},
  {x: 930, w: 190, h: 560, c: '#8FA8B8'},
  {x: 1150, w: 170, h: 420, c: '#9DB4C2'},
  {x: 1350, w: 210, h: 500, c: '#7A94A6'},
  {x: 1590, w: 180, h: 400, c: '#8FA8B8'},
];

export const CityScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#E4E7EA', overflow: 'hidden'}}>
      <PaperSun top={100} right={220} size={180} color="#E8B64C" />
      <PaperCloud left={-40 + ((frame * 0.9) % 2100)} top={130} />
      <PaperCloud left={1300 - ((frame * 0.6) % 1600)} top={260} scale={1.2} />
      {BUILDINGS.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x,
            bottom: 180,
            width: b.w,
            height: b.h,
            background: b.c,
            borderRadius: '8px 8px 0 0',
            boxShadow: '0 10px 0 rgba(0,0,0,0.10)',
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.65) 5px, rgba(255,255,255,0) 7px)',
            backgroundSize: '44px 52px',
            backgroundPosition: `${(i * 13) % 44}px ${(i * 7) % 52}px`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: '#C9BFA8',
          boxShadow: '0 -8px 0 rgba(0,0,0,0.08)',
        }}
      />
    </AbsoluteFill>
  );
};
