import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {Highlighter, Scissors, SketchArrow, StickyNote, TapeLabel} from '../paper/Bits';
import {PencilIcon, StarIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, wf} from './shared';

const LINE_D = [
  'M 10 14 C 120 -4 260 30 430 10',
  'M 10 12 C 140 28 300 -6 440 16',
  'M 10 16 C 110 0 250 30 340 12',
];

export const S8Bonus: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const fBonus = wf(seg, 'bonus', 0, 0);
  const fSummary = wf(seg, 'summary', 0, 74);
  const fLikh = wf(seg, 'likh', 0, 128);
  const fChhoti = wf(seg, 'chhoti', 0, 186);
  const fHelp = wf(seg, 'help', 0, 236);
  const scissorsX = interpolate(frame, [fChhoti, fChhoti + 24], [200, 860], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell bg={COLORS.cream} dir={1} shakes={[{at: fBonus, amp: 7}]}>
      <Layer depth={0.45} enter="top" enterAt={fBonus} jitter={0.9} seed="s8-head">
        <TapeLabel
          text="Bonus Tip!"
          color={COLORS.yellow}
          at={fBonus + 2}
          rotate={-3}
          fontSize={40}
          style={{position: 'absolute', left: 70, top: 250}}
        />
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 330,
            fontFamily: FONT_DISPLAY,
            fontSize: 84,
            color: COLORS.ink,
            lineHeight: 1.04,
            textShadow: '5px 6px 0 rgba(43,33,24,0.16)',
            maxWidth: 700,
          }}
        >
          Short Notes = Revision Hero
        </div>
      </Layer>

      <Layer depth={0.95} jitter={1.5} seed="s8-note">
        <StickyNote at={fBonus} w={640} h={580} rotate={-3} style={{left: 220, top: 660}}>
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 46,
              fontFamily: FONT_DISPLAY,
              fontSize: 58,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Short Summary
          </div>
          <Highlighter
            w={420}
            h={36}
            progress={Math.min(1, Math.max(0, (frame - fSummary) / 8))}
            style={{position: 'absolute', left: 44, top: 104, opacity: 0.6}}
          />
          {[0, 1, 2].map((i) => (
            <SketchArrow
              key={i}
              d={LINE_D[i]}
              viewBox="0 0 460 30"
              width={460}
              height={30}
              at={fLikh + i * 5}
              drawFrames={9}
              color={COLORS.inkSoft}
              strokeWidth={5}
              style={{left: 70, top: 210 + i * 66, position: 'absolute'}}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: 52,
              top: 430,
              fontFamily: FONT_DISPLAY,
              fontSize: 34,
              color: COLORS.inkSoft,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Apne words mein...
          </div>
        </StickyNote>
      </Layer>

      <Layer depth={1.15} enter="pop" enterAt={fLikh} jitter={1.3} seed="s8-pencil">
        <div style={{position: 'absolute', left: 810, top: 580, transform: 'rotate(24deg)'}}>
          <PencilIcon size={120} />
        </div>
      </Layer>

      <Layer depth={1.25} enter="pop" enterAt={fChhoti + 4} jitter={1.2} seed="s8-chip">
        <TapeLabel
          text="AI Se Chhota Karo"
          color={COLORS.mint}
          at={fChhoti + 4}
          rotate={2}
          fontSize={34}
          style={{position: 'absolute', left: 560, top: 420}}
        />
      </Layer>

      <Layer depth={1.45} jitter={1} seed="s8-scis">
        <div style={{position: 'absolute', left: scissorsX, top: 640, opacity: frame >= fChhoti ? 1 : 0}}>
          <Scissors size={104} snipAt={fChhoti} />
        </div>
      </Layer>

      <Layer depth={1.3} enter="pop" enterAt={fHelp} jitter={1.4} seed="s8-star">
        <div style={{position: 'absolute', left: 790, top: 600, transform: `rotate(${Math.sin(frame * 0.2) * 6}deg)`}}>
          <StarIcon size={120} />
        </div>
        <Highlighter
          w={430}
          h={40}
          color={COLORS.yellow}
          progress={Math.min(1, Math.max(0, (frame - fHelp) / 10))}
          rotate={-2}
          style={{position: 'absolute', left: 180, top: 340, opacity: 0.55}}
        />
      </Layer>
    </SceneShell>
  );
};
