import {Sequence, Html5Audio, staticFile} from 'remotion';
import {TimingSegment} from '../data/timing';

export const VoLayer: React.FC<{segments: TimingSegment[]}> = ({segments}) => {
  return (
    <>
      {segments.map((s) => (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames} name={`vo-${s.id}`}>
          <Html5Audio src={staticFile(s.audio)} volume={1} />
        </Sequence>
      ))}
    </>
  );
};
