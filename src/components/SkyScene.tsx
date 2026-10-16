import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Paper, useJitter} from './Paper';

export const SkyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const j1 = useJitter(frame, 3);
  const j2 = useJitter(frame + 20, 4);

  const sunY = interpolate(frame, [0, 120], [-80, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {/* sun — scalloped paper circle */}
      <div
        style={{
          position: 'absolute',
          top: 140 + sunY,
          right: 220,
          transform: `translate(${j1.x}px, ${j1.y}px) rotate(${j1.r}deg)`,
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: '#E8A13D',
            boxShadow: '0 10px 0 rgba(0,0,0,0.12), 0 0 0 24px #EFC25E, 0 0 0 48px #F6DE9A',
          }}
        />
      </div>

      {/* clouds */}
      <Cloud left={-40 + ((frame * 1.2) % 2100)} top={180} scale={1} dark="#fff" />
      <Cloud
        left={400 - ((frame * 0.8) % 1600)}
        top={320}
        scale={1.4}
        dark="#FFF8E6"
      />
      <div
        style={{
          position: 'absolute',
          left: 120 + j2.x,
          top: 480 + j2.y,
          transform: `rotate(${j2.r}deg)`,
        }}
      >
        <Paper color="#7BA17D" style={{width: 520, height: 120, borderRadius: '60px 60px 12px 12px'}}>
          <div />
        </Paper>
      </div>

      {/* mountains — layered triangles with torn edge */}
      <svg
        style={{position: 'absolute', bottom: 180, left: 0, width: 1920, height: 520}}
        viewBox="0 0 1920 520"
      >
        <polygon points="0,520 420,80 820,520" fill="#8FA98B" />
        <polygon points="520,520 980,40 1440,520" fill="#5E7F5C" />
        <polygon points="1150,520 1550,120 1920,520 1920,520" fill="#3E5A3E" />
        {/* snow caps */}
        <polygon points="920,105 980,40 1040,105 1005,95 980,115 955,95" fill="#fff" />
        <polygon points="375,135 420,80 465,135 440,125 420,140 400,125" fill="#fff" />
      </svg>

      {/* foreground ground strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          height: 220,
          width: '120%',
          left: '-10%',
          background: '#C9A86A',
          transform: 'rotate(-2deg)',
          boxShadow: '0 -12px 0 rgba(0,0,0,0.12)',
        }}
      >
        {/* trees */}
        <Tree left={300} />
        <Tree left={620} scale={1.3} />
        <Tree left={1250} scale={0.9} />
        <Tree left={1520} scale={1.2} />
      </div>
    </div>
  );
};

const Cloud: React.FC<{left: number; top: number; scale: number; dark: string}> = ({
  left,
  top,
  scale,
  dark,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `scale(${scale})`,
        display: 'flex',
      }}
    >
      {[90, 130, 100].map((s, i) => (
        <div
          key={i}
          style={{
            width: s,
            height: s,
            borderRadius: '50%',
            background: dark,
            marginLeft: i === 0 ? 0 : -30,
            marginTop: i === 1 ? -30 : 10,
            boxShadow: '0 8px 0 rgba(0,0,0,0.1)',
          }}
        />
      ))}
    </div>
  );
};

const Tree: React.FC<{left: number; scale?: number}> = ({left, scale = 1}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: -110 * scale,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{width: 26, height: 90, background: '#6B4A2B', margin: '0 auto'}} />
      <div
        style={{
          width: 150,
          height: 150,
          background: '#2F5230',
          borderRadius: '50% 50% 50% 8px',
          transform: 'rotate(-3deg)',
          boxShadow: '0 8px 0 rgba(0,0,0,0.15)',
          marginTop: -20,
        }}
      />
    </div>
  );
};
