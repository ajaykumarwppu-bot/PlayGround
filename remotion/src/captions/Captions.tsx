import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CAPTION_BOTTOM} from '../constants';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {TimingSegment, TimingWord} from '../data/timing';

type Chunk = {
  words: TimingWord[];
  start: number;
  end: number;
  index: number;
};

const MAX_WORDS = 4;
const MAX_WIDTH = 920;
const MAX_DURATION = 52;
const BASE_FONT = 84;
const MIN_FONT = 58;
const CHAR_W = 0.58;
const GAP = 26;

const estimateWidth = (words: TimingWord[], fontSize: number): number =>
  words.reduce((s, w) => s + w.text.length * fontSize * CHAR_W, 0) + GAP * (words.length - 1);

const fitFont = (words: TimingWord[]): number => {
  let size = BASE_FONT;
  while (size > MIN_FONT && estimateWidth(words, size) > MAX_WIDTH) {
    size -= 2;
  }
  return size;
};

export const buildChunks = (segments: TimingSegment[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let index = 0;
  for (const seg of segments) {
    const absWords = seg.words.map((w) => ({
      ...w,
      startFrame: w.startFrame + seg.startFrame,
      endFrame: w.endFrame + seg.startFrame,
    }));
    let cur: TimingWord[] = [];
    const flush = () => {
      if (cur.length) {
        chunks.push({
          words: cur,
          start: cur[0].startFrame,
          end: cur[cur.length - 1].endFrame,
          index: index++,
        });
        cur = [];
      }
    };
    for (const w of absWords) {
      const candidate = [...cur, w];
      const dur = w.endFrame - candidate[0].startFrame;
      if (
        cur.length > 0 &&
        (candidate.length > MAX_WORDS ||
          dur > MAX_DURATION ||
          estimateWidth(candidate, BASE_FONT) > MAX_WIDTH)
      ) {
        flush();
      }
      cur.push(w);
    }
    flush();
  }
  return chunks;
};

const WordSpan: React.FC<{
  word: TimingWord;
  fontSize: number;
  seqStart: number;
  chunkFrame: number;
}> = ({word, fontSize, seqStart, chunkFrame}) => {
  const {fps} = useVideoConfig();
  const gi = chunkFrame + seqStart;
  const started = gi >= word.startFrame;
  const p = spring({
    frame: Math.max(0, gi - word.startFrame),
    fps,
    config: {damping: 12, stiffness: 300, mass: 0.5},
  });
  const pop = started ? 1 + 0.12 * p * (1 - p) * 4 : 1;
  const hl = interpolate(gi, [word.startFrame, word.startFrame + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: `scale(${pop})`,
        lineHeight: 1.08,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: -8,
          right: -8,
          top: '16%',
          bottom: '6%',
          backgroundColor: COLORS.yellow,
          opacity: 0.85,
          mixBlendMode: 'multiply',
          transform: `scaleX(${started ? hl : 0})`,
          transformOrigin: 'left center',
          borderRadius: 8,
          clipPath: 'polygon(0 12%, 3% 0%, 99% 6%, 100% 90%, 96% 100%, 2% 94%)',
        }}
      />
      <span
        style={{
          position: 'relative',
          color: started ? COLORS.accentDark : COLORS.ink,
        }}
      >
        {word.text}
      </span>
    </span>
  );
};

const ChunkView: React.FC<{
  chunk: Chunk;
  seqStart: number;
  durationFrames: number;
}> = ({chunk, seqStart, durationFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fontSize = useMemo(() => fitFont(chunk.words), [chunk]);
  const p = spring({frame, fps, config: {damping: 13, stiffness: 240, mass: 0.7}});
  const scale = 0.68 + 0.32 * p;
  const opacityIn = interpolate(frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'});
  const exit = interpolate(frame, [durationFrames - 5, durationFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rot = (random(`cap-rot-${chunk.index}`) - 0.5) * 2.4;

  return (
    <div
      style={{
        opacity: opacityIn * (1 - exit),
        transform: `translateY(${-16 * exit}px) scale(${scale}) rotate(${rot}deg)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: `6px ${GAP}px`,
          backgroundColor: 'rgba(253,250,243,0.94)',
          borderRadius: 14,
          padding: '20px 42px 26px',
          filter: 'drop-shadow(7px 9px 0 rgba(43,33,24,0.20))',
          fontFamily: FONT_DISPLAY,
          fontSize,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          color: COLORS.ink,
          textAlign: 'center',
          width: 'fit-content',
          maxWidth: 968,
        }}
      >
        {chunk.words.map((w) => (
          <WordSpan
            key={`${w.text}-${w.startFrame}`}
            word={w}
            fontSize={fontSize}
            seqStart={seqStart}
            chunkFrame={frame}
          />
        ))}
      </div>
    </div>
  );
};

export const Captions: React.FC<{segments: TimingSegment[]}> = ({segments}) => {
  const chunks = useMemo(() => buildChunks(segments), [segments]);
  return (
    <>
      {chunks.map((chunk, i) => {
        const next = chunks[i + 1];
        const from = Math.max(0, chunk.start - 3);
        const until = next ? Math.max(from + 8, next.start - 3) : chunk.end + 12;
        const duration = until - from;
        return (
          <Sequence
            key={chunk.index}
            from={from}
            durationInFrames={duration}
            name={`cap-${chunk.index}`}
          >
            <AbsoluteFill
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: CAPTION_BOTTOM,
                paddingLeft: 56,
                paddingRight: 56,
                pointerEvents: 'none',
                zIndex: 60,
              }}
            >
              <ChunkView chunk={chunk} seqStart={from} durationFrames={duration} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};
