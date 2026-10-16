import React from 'react';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {CrossMark, PaperCard, PopBubble, Stamp} from '../paper/Bits';
import {ConfusedKid} from '../paper/Kid';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {FloatingScraps, SceneProps, wf} from './shared';

const PAPERS = [
  {x: 430, y: 400, rot: -12, w: 250, h: 300},
  {x: 670, y: 380, rot: 9, w: 230, h: 280},
  {x: 520, y: 590, rot: 6, w: 260, h: 310},
  {x: 760, y: 620, rot: -8, w: 220, h: 270},
  {x: 610, y: 800, rot: 14, w: 240, h: 290},
];

export const S1Problem: React.FC<SceneProps> = ({seg}) => {
  const fKahan = wf(seg, 'kahan', 0, 24);
  const fPadhein = wf(seg, 'padhein', 0, 44);
  const fKaise = wf(seg, 'kaise', 0, 62);
  const fSkip = wf(seg, 'skip', 0, 78);

  return (
    <SceneShell
      bg={COLORS.slate}
      dir={-1}
      shakes={[{at: fSkip - 2, amp: 9}, {at: fPadhein, amp: 6}]}
      grain={0.5}
    >
      <FloatingScraps count={4} seed="prob-scraps" colors={[COLORS.white, COLORS.yellow, COLORS.lavender]} />

      <Layer depth={0.75} enter="left" enterAt={2} enterDistance={700} enterRotate={-4} jitter={1.4} seed="prob-kid">
        <ConfusedKid size={370} style={{left: 30, top: 700}} />
      </Layer>

      {PAPERS.map((p, i) => (
        <Layer
          key={i}
          depth={0.7 + i * 0.06}
          enter="bottom"
          enterAt={i * 3}
          enterDistance={1000}
          enterRotate={(i % 2 ? 1 : -1) * 5}
          jitter={1.6}
          seed={`prob-paper-${i}`}
        >
          <PaperCard
            color={COLORS.white}
            rotate={p.rot}
            style={{position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h}}
          >
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: 24,
                right: 30,
                height: 16,
                backgroundColor: COLORS.ink,
                opacity: 0.55,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 66,
                left: 24,
                right: 60,
                height: 12,
                backgroundColor: COLORS.ink,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 96,
                left: 24,
                right: 40,
                height: 12,
                backgroundColor: COLORS.ink,
                opacity: 0.3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 126,
                left: 24,
                right: 90,
                height: 12,
                backgroundColor: COLORS.ink,
                opacity: 0.3,
              }}
            />
          </PaperCard>
        </Layer>
      ))}

      <Layer depth={1.05} enter="pop" enterAt={fKahan} jitter={1.6} seed="prob-b1">
        <PopBubble at={fKahan} rotate={-3} tail="left" fontSize={40} style={{left: 300, top: 300}}>
          Kahan Se?
        </PopBubble>
      </Layer>

      <Layer depth={1.1} enter="pop" enterAt={fPadhein} jitter={1.6} seed="prob-b2">
        <PopBubble at={fPadhein} rotate={2} tail="left" fontSize={40} style={{left: 260, top: 520}}>
          Kya Padhein?
        </PopBubble>
      </Layer>

      <Layer depth={1.15} enter="pop" enterAt={fKaise} jitter={1.6} seed="prob-b3">
        <PopBubble at={fKaise} rotate={-2} tail="left" fontSize={40} style={{left: 320, top: 740}}>
          Kaise Padhein?
        </PopBubble>
      </Layer>

      <Layer depth={1.3} enter="pop" enterAt={fPadhein + 4} jitter={2} seed="prob-x1">
        <CrossMark at={fPadhein + 4} size={104} style={{left: 500, top: 430}} />
        <CrossMark at={fKaise + 8} size={96} style={{left: 780, top: 660}} />
      </Layer>

      <Layer depth={1.4} enter="pop" enterAt={fSkip} jitter={1.4} seed="prob-skip">
        <Stamp
          text="Skip Mat Karo!"
          color={COLORS.red}
          at={fSkip}
          rotate={-7}
          fontSize={62}
          seed="skip-stamp"
          style={{position: 'absolute', left: 190, top: 1080}}
        />
      </Layer>

      <Layer depth={0.5} drift={[0, -40]} jitter={0.8} seed="prob-doodle">
        <div
          style={{
            position: 'absolute',
            top: 1210,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 44,
            color: COLORS.cream,
            opacity: 0.75,
            letterSpacing: 3,
          }}
        >
          Har Chapter Ke Saath Yahi Hota Hai...
        </div>
      </Layer>
    </SceneShell>
  );
};
