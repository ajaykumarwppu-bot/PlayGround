import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, W} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {TapeLabel} from '../paper/Bits';
import {TornStrip} from '../paper/Torn';
import {TimingSegment, wordFrame} from '../data/timing';

export type SceneProps = {seg: TimingSegment; index: number};

export const wf = (seg: TimingSegment, text: string, occurrence = 0, fallback = 0): number =>
  wordFrame(seg, text, occurrence, fallback);

export const StepHeader: React.FC<{
  step: number;
  title: string;
  color: string;
  at?: number;
}> = ({step, title, color, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 15, stiffness: 140, mass: 0.9}});
  const inv = 1 - p;
  const opacity = interpolate(pf, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top: 206,
        left: 64,
        right: 64,
        transform: `translateY(${inv * -260}px) rotate(${inv * -2}deg)`,
        opacity,
        zIndex: 5,
      }}
    >
      <TapeLabel text={`Step ${step}`} color={color} at={at + 2} rotate={-3} fontSize={38} />
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 92,
          color: COLORS.ink,
          lineHeight: 1.02,
          marginTop: 16,
          textShadow: '5px 6px 0 rgba(43,33,24,0.16)',
          maxWidth: 920,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const TornBanner: React.FC<{
  w?: number;
  h: number;
  color: string;
  seed?: string;
  rotate?: number;
  at?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({w = W, h, color, seed = 'banner', rotate = 0, at = 0, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pf = Math.max(0, frame - at);
  const p = spring({frame: pf, fps, config: {damping: 15, stiffness: 160, mass: 0.9}});
  const inv = 1 - p;
  const scaleX = interpolate(p, [0, 1], [0.4, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(pf, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        transform: `rotate(${rotate + inv * -3}deg) scaleX(${scaleX})`,
        opacity,
        ...style,
      }}
    >
      <TornStrip side="top" length={w} thickness={h / 2 + 4} color={color} seed={`${seed}-t`} amp={11} style={{top: 0, left: 0}} />
      <TornStrip side="bottom" length={w} thickness={h / 2 + 4} color={color} seed={`${seed}-b`} amp={11} style={{bottom: 0, left: 0}} />
      <div
        style={{
          position: 'absolute',
          top: h / 2 - 8,
          bottom: h / 2 - 8,
          left: 0,
          right: 0,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const FloatingScraps: React.FC<{
  count?: number;
  seed?: string;
  colors?: string[];
}> = ({
  count = 3,
  seed = 'scraps',
  colors = [COLORS.yellow, COLORS.teal, COLORS.accent, COLORS.lavender],
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames);
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * 860 + 100;
        const y0 = -80 + random(`${seed}-y-${i}`) * 260;
        const speed = 0.6 + random(`${seed}-s-${i}`) * 0.9;
        const y = y0 + t * speed * 1750;
        const rot = random(`${seed}-r-${i}`) * 360 + t * 220 * (i % 2 ? 1 : -1);
        const size = 28 + random(`${seed}-z-${i}`) * 32;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size * 1.2,
              backgroundColor: colors[i % colors.length],
              transform: `rotate(${rot}deg)`,
              opacity: 0.46,
              borderRadius: 3,
              boxShadow: '3px 4px 0 rgba(43,33,24,0.12)',
            }}
          />
        );
      })}
    </>
  );
};
