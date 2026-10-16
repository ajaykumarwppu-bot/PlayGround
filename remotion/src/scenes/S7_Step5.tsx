import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {CheckMark, CrossMark, PaperCard, Scissors, Stamp, TapeLabel} from '../paper/Bits';
import {ClockIcon, LoopIcon, StarIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, FloatingScraps, StepHeader, wf} from './shared';

const ROWS = [0, 1, 2];

export const S7Step5: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const fFive = wf(seg, 'five', 0, 10);
  const fTest = wf(seg, 'test', 0, 30);
  const fMock = wf(seg, 'mock', 0, 46);
  const fSolve = wf(seg, 'solve', 0, 190);
  const fMistakes = wf(seg, 'mistakes', 0, 214);
  const fProblem = wf(seg, 'problem', 0, 246);
  const fRevise = wf(seg, 'revise', 0, 330);

  const scissorsX = interpolate(frame, [fRevise, fRevise + 26], [230, 840], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell
      bg={COLORS.amber}
      dir={-1}
      shakes={[{at: fTest, amp: 8}, {at: fMistakes, amp: 7}]}
    >
      <StepHeader step={5} title="Test Yourself" color={COLORS.amber} at={fFive} />
      <FloatingScraps count={3} seed="s5-scraps" colors={[COLORS.white, COLORS.red, COLORS.yellow]} />

      <Layer depth={0.85} enter="bottom" enterAt={fTest} enterDistance={1100} enterRotate={4} jitter={1.3} seed="s5-paper">
        <PaperCard
          color={COLORS.white}
          rotate={-1.5}
          padded={false}
          style={{position: 'absolute', left: 210, top: 540, width: 660, height: 780, padding: 36}}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 58,
              color: COLORS.ink,
              letterSpacing: 3,
              textTransform: 'uppercase',
              borderBottom: `6px dashed ${COLORS.inkSoft}`,
              paddingBottom: 16,
            }}
          >
            Mock Test
          </div>
          {ROWS.map((r) => (
            <div key={r} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 58}}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  border: `6px solid ${COLORS.ink}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_DISPLAY,
                  fontSize: 36,
                  color: COLORS.ink,
                  flexShrink: 0,
                }}
              >
                {r + 1}
              </div>
              <div style={{flexGrow: 1}}>
                <div style={{height: 13, backgroundColor: COLORS.ink, opacity: 0.4, marginBottom: 14, width: '90%'}} />
                <div style={{height: 13, backgroundColor: COLORS.ink, opacity: 0.4, width: '62%'}} />
              </div>
            </div>
          ))}
        </PaperCard>
      </Layer>

      <Layer depth={1.05} enter="pop" enterAt={fMock} jitter={1.2} seed="s5-timer">
        <PaperCard
          color={COLORS.white}
          rotate={4}
          style={{
            position: 'absolute',
            left: 760,
            top: 380,
            width: 230,
            height: 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <ClockIcon size={92} handAngle={-60 + Math.floor(frame / 6) * 4} />
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 44, color: COLORS.ink}}>10:00</div>
        </PaperCard>
      </Layer>

      <Layer depth={1.3} enter="pop" enterAt={fSolve} jitter={1.4} seed="s5-marks">
        <CheckMark at={fSolve} size={86} style={{left: 770, top: 640}} />
        <CheckMark at={fSolve + 14} size={86} style={{left: 770, top: 940}} />
      </Layer>

      <Layer depth={1.35} enter="pop" enterAt={fMistakes} jitter={1.6} seed="s5-err">
        <CrossMark at={fMistakes} size={96} style={{left: 766, top: 760}} />
        <div
          style={{
            position: 'absolute',
            left: 730,
            top: 730,
            width: 160,
            height: 180,
            border: `8px solid ${COLORS.red}`,
            borderRadius: '50%',
            transform: `rotate(-6deg) scale(${Math.min(1, Math.max(0, (frame - fMistakes) / 6))})`,
            opacity: frame >= fMistakes ? 0.9 : 0,
          }}
        />
      </Layer>

      <Layer depth={1.2} enter="pop" enterAt={fProblem} jitter={1.4} seed="s5-gold">
        <TapeLabel
          text="Galti = Gold"
          color={COLORS.yellow}
          at={fProblem}
          rotate={-4}
          fontSize={38}
          style={{position: 'absolute', left: 250, top: 440}}
        />
        <div style={{position: 'absolute', left: 640, top: 420}}>
          <StarIcon size={110} />
        </div>
      </Layer>

      <Layer depth={1.4} enter="pop" enterAt={fRevise} jitter={1.2} seed="s5-rev">
        <Stamp
          text="Revise!"
          color={COLORS.tealDark}
          at={fRevise}
          rotate={-6}
          fontSize={52}
          seed="s5-rev-s"
          style={{position: 'absolute', left: 280, top: 1150}}
        />
        <div style={{position: 'absolute', left: 120, top: 860, transform: `rotate(${frame * 1.1}deg)`}}>
          <LoopIcon size={96} />
        </div>
      </Layer>

      <Layer depth={1.5} jitter={1} seed="s5-scis">
        <div style={{position: 'absolute', left: scissorsX, top: 1230, opacity: frame >= fRevise - 6 ? 1 : 0}}>
          <Scissors size={110} snipAt={fRevise} />
        </div>
      </Layer>
    </SceneShell>
  );
};
