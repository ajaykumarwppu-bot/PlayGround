import React from 'react';
import {COLORS, STEP_COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {PaperCard, SketchArrow, Stamp, TapeLabel} from '../paper/Bits';
import {FolderIcon, MapIcon, StarIcon, TargetIcon, BulbIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, TornBanner, wf} from './shared';

const ICONS = [TargetIcon, FolderIcon, MapIcon, BulbIcon, StarIcon];

export const S2Roadmap: React.FC<SceneProps> = ({seg}) => {
  const fLaaya = wf(seg, 'laaya', 0, 16);
  const fPaanch = wf(seg, 'paanch', 0, 58);
  const fRoadmap = wf(seg, 'roadmap', 0, 76);
  const fComplete = wf(seg, 'complete', 0, 100);

  return (
    <SceneShell bg={COLORS.cream} dir={1} shakes={[{at: fComplete, amp: 7}]}>
      <Layer depth={0.4} enter="top" enterAt={fLaaya} jitter={1} seed="rm-banner">
        <TornBanner
          color={COLORS.slate}
          h={170}
          rotate={-1.2}
          at={fLaaya}
          style={{top: 300, left: 50, width: 980, position: 'absolute'}}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 96,
              color: COLORS.cream,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            5-Step Roadmap
          </div>
        </TornBanner>
      </Layer>

      <Layer depth={0.62} enter="pop" enterAt={fLaaya + 4} jitter={0.8} seed="rm-sub">
        <div
          style={{
            position: 'absolute',
            top: 510,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT_DISPLAY,
            fontSize: 46,
            color: COLORS.inkSoft,
            letterSpacing: 3,
          }}
        >
          Simple. Systematic. Complete.
        </div>
      </Layer>

      {ICONS.map((Icon, i) => {
        const x = 62 + i * 200;
        const y = 700 + Math.abs(i - 2) * 46;
        const rot = (i - 2) * 6;
        return (
          <Layer
            key={i}
            depth={0.85 + i * 0.08}
            enter="bottom"
            enterAt={fPaanch + i * 5}
            enterDistance={900}
            enterRotate={(i % 2 ? 1 : -1) * 7}
            jitter={1.6}
            seed={`rm-card-${i}`}
          >
            <PaperCard
              color={STEP_COLORS[i]}
              rotate={rot}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 168,
                height: 224,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 0 22px',
              }}
            >
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 92, color: COLORS.ink, lineHeight: 1}}>
                {i + 1}
              </div>
              <Icon size={70} />
            </PaperCard>
          </Layer>
        );
      })}

      <Layer depth={1.15} enter="pop" enterAt={wf(seg, 'simple', 0, 48)} jitter={1.2} seed="rm-arrow">
        <SketchArrow
          d="M 130 1060 C 330 1160 750 1160 950 1060"
          width={1080}
          height={1300}
          viewBox="0 0 1080 1300"
          at={wf(seg, 'simple', 0, 48) + 2}
          drawFrames={14}
          color={COLORS.tealDark}
          strokeWidth={8}
          headAt={[950, 1060, 55]}
          style={{left: 0, top: 0}}
        />
      </Layer>

      <Layer depth={1.3} enter="pop" enterAt={fComplete} jitter={1.4} seed="rm-stamp">
        <Stamp
          text="Complete!"
          color={COLORS.green}
          at={fComplete}
          rotate={-5}
          fontSize={60}
          seed="rm-stamp-s"
          style={{position: 'absolute', left: 580, top: 540}}
        />
      </Layer>

      <Layer depth={1.05} enter="pop" enterAt={fRoadmap} jitter={1} seed="rm-tape">
        <TapeLabel
          text="Roadmap Ready"
          color={COLORS.yellow}
          at={fRoadmap}
          rotate={3}
          fontSize={36}
          style={{position: 'absolute', left: 380, top: 1220}}
        />
      </Layer>
    </SceneShell>
  );
};
