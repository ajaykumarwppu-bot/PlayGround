import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {CheckMark, PaperCard, PopBubble, Stamp, TapeLabel} from '../paper/Bits';
import {BookIcon, CalendarIcon, ClockIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, StepHeader, wf} from './shared';

export const S3Step1: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const fOne = wf(seg, 'one', 0, 12);
  const fKaun = wf(seg, 'kaun', 0, 70);
  const fKab = wf(seg, 'kab', 0, 100);
  const fDeadline = wf(seg, 'deadline', 0, 168);
  const fLo = wf(seg, 'lo', 0, 216);
  const tick = Math.floor(frame / 12) * 30;

  return (
    <SceneShell
      bg={COLORS.mint}
      dir={-1}
      shakes={[{at: fDeadline, amp: 9}]}
    >
      <StepHeader step={1} title="Choose Your Chapter" color={COLORS.yellow} at={fOne} />

      <Layer depth={0.8} enter="left" enterAt={fOne} enterDistance={900} enterRotate={7} jitter={1.4} seed="s1-book">
        <PaperCard
          color={COLORS.white}
          rotate={-2}
          style={{
            position: 'absolute',
            left: 290,
            top: 620,
            width: 500,
            height: 430,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookIcon size={260} color={COLORS.white} stroke={COLORS.ink} />
          <div
            style={{
              position: 'absolute',
              bottom: 26,
              fontFamily: FONT_DISPLAY,
              fontSize: 42,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            My Chapter
          </div>
        </PaperCard>
      </Layer>

      <Layer depth={0.95} enter="pop" enterAt={fKab} jitter={1.2} seed="s1-cal">
        <PaperCard
          color={COLORS.white}
          rotate={-6}
          style={{position: 'absolute', left: 70, top: 980, width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <CalendarIcon size={170} />
        </PaperCard>
      </Layer>

      <Layer depth={0.9} enter="pop" enterAt={Math.max(0, fDeadline - 30)} jitter={1.2} seed="s1-clock">
        <PaperCard
          color={COLORS.white}
          rotate={5}
          style={{position: 'absolute', left: 770, top: 430, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        >
          <ClockIcon size={150} handAngle={-30 + tick} />
        </PaperCard>
      </Layer>

      <Layer depth={1.05} enter="pop" enterAt={fKaun} jitter={1.6} seed="s1-q">
        <PopBubble at={fKaun} rotate={3} tail="bottom" fontSize={38} style={{left: 420, top: 452}}>
          Kaun Sa?
        </PopBubble>
      </Layer>

      <Layer depth={1.2} enter="pop" enterAt={fDeadline} jitter={1.4} seed="s1-dl">
        <Stamp
          text="Deadline: 3 Din"
          color={COLORS.red}
          at={fDeadline}
          rotate={-8}
          fontSize={48}
          seed="s1-dl-s"
          style={{position: 'absolute', left: 420, top: 1090}}
        />
      </Layer>

      <Layer depth={1.1} enter="pop" enterAt={fLo} jitter={1.2} seed="s1-done">
        <CheckMark at={fLo} size={90} style={{left: 800, top: 1130}} />
        <TapeLabel
          text="Target Set!"
          color={COLORS.teal}
          at={fLo + 4}
          rotate={-3}
          fontSize={34}
          style={{position: 'absolute', left: 80, top: 1260}}
        />
      </Layer>
    </SceneShell>
  );
};
