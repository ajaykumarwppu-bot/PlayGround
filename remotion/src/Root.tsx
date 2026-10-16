import './fonts';
import {Composition} from 'remotion';
import {ChapterVideo} from './ChapterVideo';
import {timing} from './data/timing';
import {FPS, H, W} from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ChapterFiveSteps"
      component={ChapterVideo}
      durationInFrames={timing.totalDurationFrames}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
