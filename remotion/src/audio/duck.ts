import {TimingSegment} from '../data/timing';

export const buildDuckEnvelope = (
  segments: TimingSegment[],
  totalFrames: number,
  fps: number
): Float32Array => {
  const base = 0.28;
  const duck = 0.12;
  const ramp = 10;
  const env = new Float32Array(totalFrames).fill(base);
  for (const s of segments) {
    const a = Math.max(0, s.startFrame - ramp);
    const b = Math.min(totalFrames, s.startFrame + s.durationFrames + ramp);
    for (let f = a; f < b; f++) {
      const tIn = Math.min(1, (f - a) / ramp);
      const tOut = Math.min(1, (b - f) / ramp);
      const ducked = base - (base - duck) * Math.min(tIn, tOut);
      if (ducked < env[f]) {
        env[f] = ducked;
      }
    }
  }
  const fadeIn = Math.round(fps * 0.8);
  const fadeOut = Math.round(fps * 1.6);
  for (let f = 0; f < fadeIn; f++) {
    env[f] *= f / fadeIn;
  }
  for (let f = 0; f < fadeOut && totalFrames - 1 - f >= 0; f++) {
    env[totalFrames - 1 - f] *= f / fadeOut;
  }
  return env;
};
