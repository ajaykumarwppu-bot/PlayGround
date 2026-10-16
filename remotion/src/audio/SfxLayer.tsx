import {Sequence, Html5Audio, staticFile} from 'remotion';
import {SfxCue} from '../data/timing';
import durations from '../../public/sfx/durations.json';

export const SfxLayer: React.FC<{cues: SfxCue[]}> = ({cues}) => {
  return (
    <>
      {cues.map((c, i) => {
        const dur = (durations as Record<string, number>)[c.name] ?? 6;
        return (
          <Sequence
            key={`${c.name}-${c.frame}-${i}`}
            from={c.frame}
            durationInFrames={dur + 3}
            name={`sfx-${c.name}`}
          >
            <Html5Audio src={staticFile(`sfx/${c.name}.wav`)} volume={c.vol * 0.85} />
          </Sequence>
        );
      })}
    </>
  );
};
