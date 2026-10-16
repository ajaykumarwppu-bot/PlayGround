import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {H, W} from '../constants';

export type EnterFrom = 'left' | 'right' | 'top' | 'bottom' | 'pop' | 'none';

export type LayerProps = {
  depth?: number;
  drift?: [number, number];
  push?: number;
  rotate?: number;
  jitter?: number;
  jitterRotate?: number;
  enter?: EnterFrom;
  enterAt?: number;
  enterRotate?: number;
  enterDistance?: number;
  seed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const Layer: React.FC<LayerProps> = ({
  depth = 0.5,
  drift = [0, 0],
  push = 0.03,
  rotate = 0,
  jitter = 2,
  jitterRotate = 0.7,
  enter = 'none',
  enterAt = 0,
  enterRotate = 0,
  enterDistance,
  seed = 'layer',
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames);
  const dist = enterDistance ?? (enter === 'top' || enter === 'bottom' ? H + 300 : W + 300);

  const step = Math.floor(Math.max(0, frame - enterAt) / 3);
  const jx = (random(`${seed}-jx-${step}`) - 0.5) * 2 * jitter;
  const jy = (random(`${seed}-jy-${step}`) - 0.5) * 2 * jitter;
  const jr = (random(`${seed}-jr-${step}`) - 0.5) * 2 * jitterRotate;

  let ex = 0;
  let ey = 0;
  let er = 0;
  let es = 1;
  let opacity = 1;
  if (enter !== 'none') {
    const pf = Math.max(0, frame - enterAt);
    const p = spring({frame: pf, fps, config: {damping: 15, stiffness: 110, mass: 1}});
    const inv = 1 - p;
    if (enter === 'left') ex = -inv * dist;
    if (enter === 'right') ex = inv * dist;
    if (enter === 'top') ey = -inv * dist;
    if (enter === 'bottom') ey = inv * dist;
    if (enter === 'pop') {
      es = 0.5 + 0.5 * p;
      opacity = interpolate(pf, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
    }
    er = inv * enterRotate;
  }

  const driftX = drift[0] * depth * t;
  const driftY = drift[1] * depth * t;
  const pushScale = 1 + push * depth * t;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${ex + driftX + jx}px, ${ey + driftY + jy}px) rotate(${
          rotate + er + jr
        }deg) scale(${es * pushScale})`,
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
