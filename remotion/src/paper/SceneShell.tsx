import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {H, W} from '../constants';
import {Grain} from './Grain';
import {TornStrip} from './Torn';

export type Shake = {at: number; amp?: number};

export const SceneShell: React.FC<{
  bg: string;
  dir?: 1 | -1;
  shakes?: Shake[];
  grain?: number;
  intro?: boolean;
  children?: React.ReactNode;
}> = ({bg, dir = 1, shakes = [], grain = 0.4, intro = true, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = intro
    ? spring({frame, fps, config: {damping: 16, stiffness: 100, mass: 1.1}})
    : 1;
  const inv = 1 - p;
  const enterX = inv * dir * (W + 160);
  const enterRot = inv * dir * 2.0;
  const baseScale = 1.045 + inv * 0.05;
  const sheetShadow = inv > 0.01 ? `drop-shadow(${-dir * 18}px 14px 0 rgba(43,33,24,0.25))` : undefined;

  let shakeX = 0;
  let shakeY = 0;
  for (const s of shakes) {
    const d = frame - s.at;
    if (d >= 0 && d < 16) {
      const amp = s.amp ?? 8;
      const fall = Math.exp(-d / 4.5);
      shakeX += Math.sin(d * 1.9) * amp * fall;
      shakeY += Math.cos(d * 2.3) * amp * 0.7 * fall;
    }
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `translate(${enterX + shakeX}px, ${shakeY}px) rotate(${enterRot}deg) scale(${baseScale})`,
          backgroundColor: bg,
          filter: sheetShadow,
        }}
      >
        <TornStrip
          side={dir === 1 ? 'left' : 'right'}
          length={H + 320}
          thickness={54}
          color={bg}
          seed={`sheet-${bg}`}
          amp={20}
          style={{
            [dir === 1 ? 'left' : 'right']: -52,
            top: -160,
            filter: `drop-shadow(${-dir * 10}px 0 0 rgba(43,33,24,0.20))`,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(120% 80% at 50% 28%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%)',
          }}
        />
        <Grain opacity={grain} />
        <AbsoluteFill>{children}</AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(130% 95% at 50% 42%, rgba(0,0,0,0) 58%, rgba(43,33,24,0.14) 100%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
