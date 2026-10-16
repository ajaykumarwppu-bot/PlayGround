import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CAPTIONS, CHAPTERS, T, TOTAL_FRAMES} from './script';
import {Captions, GrainVignette, Letterbox, ProgressBar} from './parts';
import {ChapterScene, Closing, ColdOpen, TitleCard} from './chapters';

export const Documentary: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#111', fontFamily: 'Georgia, serif'}}>
      <Sequence from={T.coldOpen.from} durationInFrames={T.coldOpen.duration}>
        <ColdOpen duration={T.coldOpen.duration} />
      </Sequence>
      <Sequence from={T.title.from} durationInFrames={T.title.duration}>
        <TitleCard />
      </Sequence>
      {CHAPTERS.map((ch) => (
        <Sequence key={ch.n} from={ch.from} durationInFrames={ch.duration}>
          <ChapterScene ch={ch} />
        </Sequence>
      ))}
      <Sequence from={T.closing.from} durationInFrames={T.closing.duration}>
        <Closing duration={T.closing.duration} />
      </Sequence>
      <Letterbox />
      <GrainVignette />
      <Captions captions={CAPTIONS} />
      <ProgressBar total={TOTAL_FRAMES} marks={CHAPTERS.map((c) => c.from)} />
    </AbsoluteFill>
  );
};
