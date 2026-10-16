import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {FlipIn, PaperCard, SketchArrow, Stamp, TapeLabel} from '../paper/Bits';
import {BookIcon, RobotIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, StepHeader, wf} from './shared';

const BUBBLE_X = [175, 380, 585, 790];

export const S5Step3: React.FC<SceneProps> = ({seg}) => {
  const frame = useCurrentFrame();
  const fThree = wf(seg, 'three', 0, 10);
  const fOverview = wf(seg, 'overview', 0, 30);
  const fRead = wf(seg, 'read', 0, 96);
  const fAi = wf(seg, 'ai', 0, 130);
  const fTopic = wf(seg, 'topic-wise', 0, 168);
  const fConcepts = wf(seg, 'concepts', 0, 296);
  const fNahi = wf(seg, 'nahi', 0, 320);
  const fHain = wf(seg, 'hain', 0, 396);
  const scanY = ((frame - fAi) * 9) % 470;

  return (
    <SceneShell bg={COLORS.sky} dir={-1} shakes={[{at: fNahi, amp: 9}]}>
      <StepHeader step={3} title="Get An Overview" color={COLORS.sky} at={fThree} />

      <Layer depth={0.8} enter="left" enterAt={fOverview} enterDistance={950} enterRotate={5} jitter={1.3} seed="s3-left">
        <PaperCard
          color={COLORS.white}
          rotate={-2}
          style={{position: 'absolute', left: 60, top: 540, width: 440, height: 560, overflow: 'hidden'}}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 48,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Quick Read
          </div>
          <div style={{position: 'absolute', left: 130, top: 130}}>
            <BookIcon size={180} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <FlipIn
              key={i}
              at={fRead + i * 7}
              style={{position: 'absolute', left: 135, top: 330, width: 170, height: 160}}
            >
              <div
                style={{
                  width: 170,
                  height: 160,
                  backgroundColor: COLORS.cream,
                  border: `4px solid ${COLORS.ink}`,
                  borderRadius: 6,
                  transform: `rotate(${(i - 1.5) * 2.4}deg)`,
                  padding: 14,
                }}
              >
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    style={{
                      height: 10,
                      backgroundColor: COLORS.ink,
                      opacity: 0.4,
                      marginBottom: 12,
                      width: `${80 - k * 18}%`,
                    }}
                  />
                ))}
              </div>
            </FlipIn>
          ))}
        </PaperCard>
      </Layer>

      <Layer depth={0.88} enter="right" enterAt={fOverview + 4} enterDistance={950} enterRotate={-5} jitter={1.3} seed="s3-right">
        <PaperCard
          color={COLORS.white}
          rotate={2}
          style={{position: 'absolute', left: 580, top: 540, width: 440, height: 560, overflow: 'hidden'}}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 48,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            AI Overview
          </div>
          <div style={{position: 'absolute', left: 130, top: 130}}>
            <RobotIcon size={180} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              top: 90 + Math.max(0, scanY),
              height: 44,
              background: `linear-gradient(180deg, rgba(42,157,143,0), rgba(42,157,143,0.55), rgba(42,157,143,0))`,
              opacity: frame >= fAi ? 0.9 : 0,
            }}
          />
          <TapeLabel
            text="PDF → AI"
            color={COLORS.mint}
            at={fAi}
            rotate={-3}
            fontSize={34}
            style={{position: 'absolute', left: 240, top: 420}}
          />
        </PaperCard>
      </Layer>

      {BUBBLE_X.map((x, i) => (
        <Layer key={i} depth={1.0 + i * 0.06} enter="pop" enterAt={fTopic + i * 5} jitter={1.4} seed={`s3-bub-${i}`}>
          <div
            style={{
              position: 'absolute',
              left: x,
              top: 1150,
              width: 148,
              height: 148,
              borderRadius: '50%',
              backgroundColor: i % 2 ? COLORS.yellow : COLORS.white,
              border: `6px solid ${COLORS.ink}`,
              boxShadow: '6px 8px 0 rgba(43,33,24,0.22)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div style={{fontFamily: FONT_DISPLAY, fontSize: 44, color: COLORS.ink, lineHeight: 1}}>{i + 1}</div>
            <div style={{width: 66, height: 8, backgroundColor: COLORS.ink, opacity: 0.45}} />
          </div>
        </Layer>
      ))}

      {[0, 1, 2].map((i) => {
        const cx1 = BUBBLE_X[i] + 74;
        const cx2 = BUBBLE_X[i + 1] + 74;
        return (
          <Layer key={`arrow-${i}`} depth={1.35} enter="pop" enterAt={fConcepts + i * 5} jitter={0.8} seed={`s3-arr-${i}`}>
            <SketchArrow
              d={`M ${cx1} 1224 C ${cx1 + 70} 1120 ${cx2 - 70} 1120 ${cx2 - 6} 1218`}
              width={1080}
              height={1300}
              viewBox="0 0 1080 1300"
              at={fConcepts + i * 5}
              drawFrames={9}
              color={COLORS.accent}
              strokeWidth={7}
              headAt={[cx2, 1224, 68]}
              style={{left: 0, top: 0}}
            />
          </Layer>
        );
      })}

      <Layer depth={1.4} enter="pop" enterAt={fNahi} jitter={1.5} seed="s3-nr">
        <Stamp
          text="No Ratta!"
          color={COLORS.red}
          at={fNahi}
          rotate={-8}
          fontSize={56}
          seed="s3-nr-s"
          style={{position: 'absolute', left: 400, top: 700}}
        />
      </Layer>

      <Layer depth={1.1} enter="pop" enterAt={fHain} jitter={1.2} seed="s3-map">
        <TapeLabel
          text="Map Ready"
          color={COLORS.teal}
          at={fHain}
          rotate={2}
          fontSize={34}
          style={{position: 'absolute', left: 640, top: 320}}
        />
      </Layer>
    </SceneShell>
  );
};
