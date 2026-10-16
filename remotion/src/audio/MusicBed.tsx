import {useMemo} from 'react';
import {Html5Audio, staticFile, useCurrentFrame} from 'remotion';
import {TimingSegment} from '../data/timing';
import {buildDuckEnvelope} from './duck';
import {FPS} from '../constants';

export const MusicBed: React.FC<{segments: TimingSegment[]; totalFrames: number}> = ({
  segments,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const env = useMemo(
    () => buildDuckEnvelope(segments, totalFrames, FPS),
    [segments, totalFrames]
  );
  const volume = env[Math.min(frame, env.length - 1)];
  return <Html5Audio src={staticFile('music/bed_carefree.mp3')} loop volume={volume} />;
};
