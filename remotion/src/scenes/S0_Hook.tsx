import React from 'react';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {Confetti, Highlighter, PaperCard, WashiTape} from '../paper/Bits';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, TornBanner, wf} from './shared';

export const S0Hook: React.FC<SceneProps> = ({seg}) => {
  const fChapter = wf(seg, 'chapter', 0, 22);
  const fPaanch = wf(seg, 'paanch', 0, 34);
  const fSteps = wf(seg, 'steps', 0, 48);
  const fMein = wf(seg, 'mein', 0, 60);

  return (
    <SceneShell
      bg={COLORS.paper}
      dir={1}
      intro={false}
      shakes={[
        {at: 0, amp: 10},
        {at: fPaanch, amp: 13},
        {at: fSteps, amp: 8},
      ]}
    >
      <Layer depth={0.25} drift={[-60, 30]} jitter={0.8} seed="hook-bg">
        <WashiTape w={280} h={54} rotate={-14} seed="hook-t1" color={COLORS.teal} style={{position: 'absolute', top: 360, left: -60}} />
        <WashiTape w={240} h={50} rotate={12} seed="hook-t2" color={COLORS.accent} style={{position: 'absolute', top: 1180, right: -70}} />
      </Layer>

      <Layer depth={0.55} enter="top" enterAt={0} jitter={1.2} seed="hook-title">
        <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              backgroundColor: COLORS.white,
              padding: '18px 52px',
              transform: 'rotate(-2.4deg)',
              filter: 'drop-shadow(10px 12px 0 rgba(43,33,24,0.24))',
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Complete Any
          </div>
        </div>
      </Layer>

      <Layer depth={0.62} enter="top" enterAt={fChapter} enterDistance={760} jitter={1.2} seed="hook-title2">
        <div style={{position: 'absolute', top: 468, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div
            style={{
              backgroundColor: COLORS.accent,
              padding: '18px 52px',
              transform: 'rotate(1.6deg)',
              filter: 'drop-shadow(10px 12px 0 rgba(43,33,24,0.28))',
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              color: COLORS.white,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Chapter
          </div>
        </div>
      </Layer>

      <Layer depth={0.9} enter="bottom" enterAt={fPaanch} enterDistance={900} enterRotate={6} jitter={1.6} seed="hook-five">
        <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative', width: 460, height: 460}}>
            <PaperCard
              color={COLORS.teal}
              rotate={6}
              style={{position: 'absolute', top: 34, left: 40, width: 420, height: 420}}
            />
            <PaperCard
              color={COLORS.yellow}
              rotate={-5}
              style={{position: 'absolute', top: 18, left: 20, width: 420, height: 420}}
            />
            <PaperCard
              color={COLORS.accent}
              rotate={-2}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 420,
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 330,
                  color: COLORS.white,
                  lineHeight: 1,
                  marginTop: -16,
                }}
              >
                5
              </div>
            </PaperCard>
          </div>
        </div>
      </Layer>

      <Layer depth={1.0} enter="pop" enterAt={fSteps} jitter={1.2} seed="hook-steps">
        <TornBanner
          color={COLORS.slate}
          h={150}
          rotate={-1.6}
          at={fSteps}
          style={{top: 1160, left: 60, width: 960, position: 'absolute'}}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 92,
              color: COLORS.cream,
              letterSpacing: 10,
              textTransform: 'uppercase',
            }}
          >
            Steps Mein!
          </div>
        </TornBanner>
      </Layer>

      <Layer depth={1.25} enter="pop" enterAt={fMein} jitter={2} seed="hook-hl">
        <Highlighter
          w={300}
          h={34}
          color={COLORS.yellow}
          progress={1}
          rotate={-3}
          style={{position: 'absolute', top: 548, left: 388, opacity: 0.55}}
        />
      </Layer>

      <Confetti at={fMein - 2} count={18} origin={[540, 830]} duration={44} seed="hook-conf" />
    </SceneShell>
  );
};
