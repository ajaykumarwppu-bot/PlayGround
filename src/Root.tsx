import {Composition} from 'remotion';
import {PaperCutoutVideo} from './PaperCutoutVideo';
import {Documentary} from './doc/Documentary';
import {VIDEO_CONFIG} from './config';
import {FPS, TOTAL_FRAMES} from './doc/script';

const totalFrames = 100 + VIDEO_CONFIG.scenes.length * 90 + 90;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PaperCutoutVideo"
        component={PaperCutoutVideo}
        durationInFrames={totalFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Documentary"
        component={Documentary}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
