import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {CheckMark, FlipIn, PaperCard, PopBubble, ProgressPips, TapeLabel} from '../paper/Bits';
import {BulbIcon, LoopIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, StepHeader, wf} from './shared';

const CARD_COLORS = [COLORS.yellow, COLORS.teal, COLORS.accent];

export const S6Step4: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fFour = wf(seg, 'four', 0, 10);
  const fConcept = [wf(seg, 'concept', 0, 30), wf(seg, 'concept', 1, 190), wf(seg, 'concept', 2, 330)];
  const fExplain0 = wf(seg, 'explain', 0, 90);
  const fExplain1 = wf(seg, 'explain', 1, 230);
  const fJao = wf(seg, 'jao', 0, 396);

  const shift = (i: number) => {
    const s1 = i + 1 < fConcept.length ? spring({frame: Math.max(0, frame - fConcept[i + 1]), fps, config: {damping: 16, stiffness: 120, mass: 1}}) : 0;
    const s2 = i + 2 < fConcept.length ? spring({frame: Math.max(0, frame - fConcept[i + 2]), fps, config: {damping: 16, stiffness: 120, mass: 1}}) : 0;
    return s1 + s2;
  };

  return (
    <SceneShell bg={COLORS.sand} dir={1}>
      <StepHeader step={4} title="One Concept At A Time" color={COLORS.sand} at={fFour} />

      <Layer depth={0.5} drift={[0, -30]} jitter={0.8} seed="s4-loop">
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 430,
            transform: `rotate(${frame * 0.7}deg)`,
            opacity: 0.85,
          }}
        >
          <LoopIcon size={130} />
        </div>
      </Layer>

      {CARD_COLORS.map((color, i) => {
        const at = fConcept[i];
        const idx = shift(i);
        return (
          <Layer
            key={i}
            depth={0.9 + i * 0.08}
            jitter={i === 2 ? 1.4 : 0.9}
            seed={`s4-card-${i}`}
          >
            <FlipIn
              at={at}
              style={{
                position: 'absolute',
                left: 330 - idx * 72,
                top: 700 + idx * 52,
                width: 440,
                height: 320,
                transform: `scale(${1 - idx * 0.07})`,
                zIndex: i,
              }}
            >
              <PaperCard
                color={COLORS.white}
                rotate={0}
                style={{width: 440, height: 320, padding: 0, overflow: 'hidden'}}
              >
                <div style={{backgroundColor: color, height: 78, display: 'flex', alignItems: 'center', padding: '0 26px'}}>
                  <div style={{fontFamily: FONT_DISPLAY, fontSize: 46, color: COLORS.ink, letterSpacing: 2, textTransform: 'uppercase'}}>
                    Concept {i + 1}
                  </div>
                </div>
                <div style={{position: 'absolute', right: 26, top: 108}}>
                  <BulbIcon size={110} />
                </div>
                <div style={{position: 'absolute', left: 26, top: 120}}>
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      style={{
                        height: 14,
                        backgroundColor: COLORS.ink,
                        opacity: 0.35,
                        marginBottom: 18,
                        width: 220 - k * 40,
                      }}
                    />
                  ))}
                </div>
              </PaperCard>
            </FlipIn>
          </Layer>
        );
      })}

      <Layer depth={1.1} enter="pop" enterAt={fExplain0} jitter={1.5} seed="s4-b1">
        <PopBubble at={fExplain0} rotate={2} tail="left" fontSize={38} style={{left: 520, top: 470}}>
          Apne Words Mein?
        </PopBubble>
      </Layer>

      <Layer depth={1.2} enter="pop" enterAt={fExplain1} jitter={1.4} seed="s4-clear">
        <CheckMark at={fExplain1} size={84} style={{left: 780, top: 1120}} />
        <TapeLabel
          text="Clear!"
          color={COLORS.green}
          at={fExplain1 + 4}
          rotate={-3}
          fontSize={36}
          style={{position: 'absolute', left: 620, top: 1200}}
        />
      </Layer>

      <Layer depth={1.15} enter="pop" enterAt={fConcept[0]} jitter={0.8} seed="s4-pips">
        <ProgressPips count={3} doneAt={fConcept} style={{position: 'absolute', left: 430, top: 1330}} />
      </Layer>

      <Layer depth={1.25} enter="pop" enterAt={fJao} jitter={1.2} seed="s4-tick">
        <CheckMark at={fJao} size={64} color={COLORS.teal} style={{left: 660, top: 1320}} />
      </Layer>
    </SceneShell>
  );
};
