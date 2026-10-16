import timingRaw from './timing.json';

export type TimingWord = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type TimingSegment = {
  id: string;
  scene: string;
  audio: string;
  startFrame: number;
  durationFrames: number;
  words: TimingWord[];
  alignment: string;
};

export type SfxCue = {
  name: string;
  frame: number;
  vol: number;
};

export type Timing = {
  fps: number;
  voice: string;
  rate: string;
  totalDurationFrames: number;
  segments: TimingSegment[];
  sfx: SfxCue[];
};

export const timing = timingRaw as unknown as Timing;

export const wordFrame = (
  seg: TimingSegment,
  text: string,
  occurrence = 0,
  fallback = 0
): number => {
  const matches = seg.words.filter((w) => w.text === text);
  if (occurrence >= matches.length) {
    return fallback;
  }
  return matches[occurrence].startFrame;
};

export const wordEnd = (
  seg: TimingSegment,
  text: string,
  occurrence = 0,
  fallback = 0
): number => {
  const matches = seg.words.filter((w) => w.text === text);
  if (occurrence >= matches.length) {
    return fallback;
  }
  return matches[occurrence].endFrame;
};
