import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {COLORS, END_HOLD_FRAMES, SCENE_TRANSITION_FRAMES} from './constants';
import {timing} from './data/timing';
import {Captions} from './captions/Captions';
import {MusicBed} from './audio/MusicBed';
import {SfxLayer} from './audio/SfxLayer';
import {VoLayer} from './audio/VoLayer';
import {S0Hook} from './scenes/S0_Hook';
import {S1Problem} from './scenes/S1_Problem';
import {S2Roadmap} from './scenes/S2_Roadmap';
import {S3Step1} from './scenes/S3_Step1';
import {S4Step2} from './scenes/S4_Step2';
import {S5Step3} from './scenes/S5_Step3';
import {S6Step4} from './scenes/S6_Step4';
import {S7Step5} from './scenes/S7_Step5';
import {S8Bonus} from './scenes/S8_Bonus';
import {S9Outro} from './scenes/S9_Outro';
import {SceneProps} from './scenes/shared';

const SCENES: Record<string, React.FC<SceneProps>> = {
  hook: S0Hook,
  problem: S1Problem,
  roadmap: S2Roadmap,
  step1: S3Step1,
  step2: S4Step2,
  step3: S5Step3,
  step4: S6Step4,
  step5: S7Step5,
  bonus: S8Bonus,
  outro: S9Outro,
};

const FadeOut: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [total - 16, total - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const inP = interpolate(frame, [0, 3], [1, 0], {extrapolateRight: 'clamp'});
  const opacity = Math.max(out, inP);
  if (opacity <= 0.001) return null;
  return <AbsoluteFill style={{backgroundColor: COLORS.paper, opacity, zIndex: 100}} />;
};

export const ChapterVideo: React.FC = () => {
  const {segments, sfx, totalDurationFrames} = timing;
  const lastIndex = segments.length - 1;
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(150deg, ${COLORS.cream} 0%, ${COLORS.paper} 100%)`,
        }}
      />
      {segments.map((seg, i) => {
        const Comp = SCENES[seg.scene] ?? S0Hook;
        const extra =
          i < lastIndex
            ? SCENE_TRANSITION_FRAMES
            : Math.max(END_HOLD_FRAMES, totalDurationFrames - seg.startFrame);
        return (
          <Sequence
            key={seg.id}
            from={seg.startFrame}
            durationInFrames={seg.durationFrames + extra}
            name={seg.id}
          >
            <Comp seg={seg} index={i} />
          </Sequence>
        );
      })}
      <VoLayer segments={segments} />
      <SfxLayer cues={sfx} />
      <MusicBed segments={segments} totalFrames={totalDurationFrames} />
      <Captions segments={segments} />
      <FadeOut total={totalDurationFrames} />
    </AbsoluteFill>
  );
};
