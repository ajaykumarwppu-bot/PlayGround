import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, STEP_COLORS} from '../constants';
import {FONT_DISPLAY, FONT_LABEL} from '../fonts';
import {CheckMark, Confetti, FlipIn, PaperCard, SketchArrow, Stamp, TapeLabel} from '../paper/Bits';
import {BellIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, wf} from './shared';

export const S9Outro: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const fTo = wf(seg, 'to', 0, 0);
  const fPaanch = wf(seg, 'paanch', 0, 30);
  const fRoadmap = wf(seg, 'roadmap', 0, 48);
  const fParts = wf(seg, 'parts', 0, 76);
  const fFollow = wf(seg, 'follow', 0, 116);
  const fKaro = wf(seg, 'karo', 0, 132);
  const fVideo = wf(seg, 'video', 0, 158);

  return (
    <SceneShell
      bg={COLORS.cream}
      dir={-1}
      shakes={[{at: fKaro, amp: 10}]}
    >
      <Layer depth={0.4} enter="top" enterAt={fTo} jitter={0.9} seed="s9-head">
        <div
          style={{
            position: 'absolute',
            top: 258,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 88,
            color: COLORS.ink,
            letterSpacing: 3,
            textShadow: '5px 6px 0 rgba(43,33,24,0.16)',
            textTransform: 'uppercase',
          }}
        >
          Your 5-Step Recap
        </div>
      </Layer>

      {STEP_COLORS.map((color, i) => {
        const at = fPaanch + i * 4;
        return (
          <Layer
            key={i}
            depth={0.85 + i * 0.07}
            enter="left"
            enterAt={at}
            enterDistance={800}
            enterRotate={-5}
            jitter={1.4}
            seed={`s9-chip-${i}`}
          >
            <PaperCard
              color={color}
              rotate={(i - 2) * 3.4}
              style={{
                position: 'absolute',
                left: 110 + i * 176,
                top: 470,
                width: 146,
                height: 146,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 88, color: COLORS.ink, lineHeight: 1}}>
                {i + 1}
              </div>
            </PaperCard>
          </Layer>
        );
      })}

      {STEP_COLORS.map((_, i) => (
        <Layer key={`tick-${i}`} depth={1.15} enter="pop" enterAt={fRoadmap + i * 3} jitter={1.2} seed={`s9-tick-${i}`}>
          <CheckMark
            at={fRoadmap + i * 3}
            size={56}
            style={{left: 190 + i * 176, top: 592}}
          />
        </Layer>
      ))}

      <Layer depth={1.0} enter="pop" enterAt={fRoadmap} jitter={1} seed="s9-tape">
        <TapeLabel
          text="Roadmap Complete!"
          color={COLORS.yellow}
          at={fRoadmap}
          rotate={-2}
          fontSize={38}
          style={{position: 'absolute', left: 330, top: 380}}
        />
      </Layer>

      <Layer depth={0.9} jitter={1.3} seed="s9-teaser">
        <FlipIn
          at={fParts}
          style={{position: 'absolute', left: 170, top: 780, width: 740}}
        >
          <PaperCard
            color={COLORS.slate}
            rotate={-1.6}
            style={{width: 740, padding: '26px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}
          >
            <div style={{fontFamily: FONT_DISPLAY, fontSize: 32, color: COLORS.yellow, letterSpacing: 4, textTransform: 'uppercase'}}>
              Next Video
            </div>
            <div style={{fontFamily: FONT_DISPLAY, fontSize: 54, color: COLORS.cream, textAlign: 'center', lineHeight: 1.15}}>
              Bade Chapter Ko Parts Mein Kaise Todna?
            </div>
          </PaperCard>
        </FlipIn>
      </Layer>

      <Layer depth={1.1} enter="pop" enterAt={fFollow} jitter={1.4} seed="s9-btn">
        <FlipIn at={fFollow} style={{position: 'absolute', left: 390, top: 1080}}>
          <div
            style={{
              backgroundColor: COLORS.accent,
              padding: '24px 70px',
              borderRadius: 16,
              filter: 'drop-shadow(10px 12px 0 rgba(43,33,24,0.28))',
              fontFamily: FONT_DISPLAY,
              fontSize: 64,
              color: COLORS.white,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Follow
          </div>
        </FlipIn>
        <SketchArrow
          d="M 540 1020 C 540 1046 540 1052 540 1064"
          viewBox="0 0 1080 1300"
          width={1080}
          height={1300}
          at={fFollow + 6}
          drawFrames={6}
          color={COLORS.accentDark}
          strokeWidth={8}
          headAt={[540, 1068, 90]}
          style={{left: 0, top: 0}}
        />
      </Layer>

      <Layer depth={1.35} enter="pop" enterAt={fKaro} jitter={1.6} seed="s9-cta">
        <Stamp
          text="Follow Karo!"
          color={COLORS.red}
          at={fKaro}
          rotate={-6}
          fontSize={60}
          seed="s9-cta-s"
          style={{position: 'absolute', left: 300, top: 1215}}
        />
      </Layer>

      <Layer depth={1.2} enter="pop" enterAt={fVideo} jitter={1.4} seed="s9-bell">
        <div
          style={{
            position: 'absolute',
            left: 740,
            top: 1055,
            transform: `rotate(${frame >= fVideo ? Math.sin((frame - fVideo) * 0.55) * 16 : 0}deg)`,
            transformOrigin: '50% 12%',
          }}
        >
          <BellIcon size={130} />
        </div>
      </Layer>

      <Layer depth={1.0} enter="pop" enterAt={fVideo + 4} jitter={1} seed="s9-next">
        <TapeLabel
          text="Next Video Mein Milte Hain!"
          color={COLORS.teal}
          at={fVideo + 4}
          rotate={2}
          fontSize={34}
          style={{position: 'absolute', left: 320, top: 1345}}
        />
      </Layer>

      <Confetti at={fVideo} count={22} origin={[540, 620]} duration={48} seed="s9-conf" />
      <Confetti at={fKaro} count={12} origin={[540, 1150]} duration={40} seed="s9-conf2" />

      <Layer depth={0.95} enter="pop" enterAt={fVideo + 24} jitter={0.6} seed="s9-credit">
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1600,
            textAlign: 'center',
            fontFamily: FONT_LABEL,
            fontSize: 22,
            color: COLORS.inkSoft,
            letterSpacing: 1,
          }}
        >
          music: "Carefree" - kevin macleod (incompetech.com) - cc by 4.0
        </div>
      </Layer>
    </SceneShell>
  );
};
