import React from 'react';
import {COLORS} from '../constants';
import {FONT_DISPLAY} from '../fonts';
import {CheckMark, PaperCard, Stamp, TapeLabel} from '../paper/Bits';
import {BookIcon, FolderIcon, NotesIcon, PdfIcon, PlayIcon} from '../paper/icons';
import {Layer} from '../paper/Layer';
import {SceneShell} from '../paper/SceneShell';
import {SceneProps, FloatingScraps, StepHeader, wf} from './shared';

const ITEMS = [
  {word: 'books', label: 'Books', Icon: BookIcon, x: 560, y: 470, rot: -3},
  {word: 'notes', label: 'Notes', Icon: NotesIcon, x: 800, y: 610, rot: 3},
  {word: 'pdfs', label: 'PDFs', Icon: PdfIcon, x: 560, y: 850, rot: -2},
  {word: 'lectures', label: 'Lectures', Icon: PlayIcon, x: 800, y: 990, rot: 2},
];

export const S4Step2: React.FC<SceneProps> = ({seg}) => {
  const fTwo = wf(seg, 'two', 0, 10);
  const fResources = wf(seg, 'resources', 0, 22);
  const fReady = wf(seg, 'ready', 0, 158);
  const fHo = wf(seg, 'ho', 0, 248);

  return (
    <SceneShell bg={COLORS.cream} dir={1} shakes={[{at: fResources, amp: 7}]}>
      <StepHeader step={2} title="Collect Your Resources" color={COLORS.mint} at={fTwo} />

      <FloatingScraps count={3} seed="s2-scraps" />

      <Layer depth={0.8} enter="pop" enterAt={fResources} jitter={1.4} seed="s2-folder">
        <PaperCard
          color={COLORS.teal}
          rotate={-3}
          style={{
            position: 'absolute',
            left: 80,
            top: 720,
            width: 410,
            height: 350,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FolderIcon size={240} color={COLORS.tealDark} stroke={COLORS.ink} />
          <div
            style={{
              position: 'absolute',
              bottom: 22,
              fontFamily: FONT_DISPLAY,
              fontSize: 38,
              color: COLORS.ink,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Sab Kuch
          </div>
        </PaperCard>
      </Layer>

      {ITEMS.map((it, i) => {
        const at = wf(seg, it.word, 0, 60 + i * 30);
        return (
          <React.Fragment key={it.word}>
            <Layer
              depth={0.95 + i * 0.07}
              enter="right"
              enterAt={at}
              enterDistance={1050}
              enterRotate={5}
              jitter={1.5}
              seed={`s2-item-${i}`}
            >
              <PaperCard
                color={COLORS.white}
                rotate={it.rot}
                style={{
                  position: 'absolute',
                  left: it.x,
                  top: it.y,
                  width: 200,
                  height: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 0 16px',
                }}
              >
                <it.Icon size={116} />
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 30,
                    color: COLORS.ink,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {it.label}
                </div>
              </PaperCard>
            </Layer>
            <Layer
              depth={1.2 + i * 0.05}
              enter="pop"
              enterAt={at + 8}
              jitter={1.4}
              seed={`s2-check-${i}`}
            >
              <CheckMark at={at + 8} size={68} style={{left: it.x + 150, top: it.y + 132}} />
            </Layer>
          </React.Fragment>
        );
      })}

      <Layer depth={1.3} enter="pop" enterAt={fReady} jitter={1.4} seed="s2-ready">
        <Stamp
          text="Ready!"
          color={COLORS.accent}
          at={fReady}
          rotate={-7}
          fontSize={56}
          seed="s2-ready-s"
          style={{position: 'absolute', left: 150, top: 640}}
        />
      </Layer>

      <Layer depth={1.15} enter="pop" enterAt={fHo} jitter={1.2} seed="s2-tape">
        <TapeLabel
          text="Ek Jagah"
          color={COLORS.yellow}
          at={fHo}
          rotate={-2}
          fontSize={36}
          style={{position: 'absolute', left: 170, top: 1110}}
        />
      </Layer>
    </SceneShell>
  );
};
