import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Paper} from '../components/Paper';
import {ChapterCard, KenBurns, LowerThird, ScissorsSweep, StatCounter} from './parts';
import {
  CityScene,
  DesertScene,
  PaperCloud,
  PaperSun,
  RiceFieldScene,
} from './backdrops';
import {
  CHAPTER_CARD_FRAMES,
  Chapter,
  CRAFT,
  CREDITS,
  STATS,
  T,
} from './script';

export const ColdOpen: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = spring({frame, fps, config: {damping: 13}});
  const counter = interpolate(frame, [20, 110], [0, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p1 = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p2 = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  void duration;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#232323',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 170,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(drop, [0, 1], [-520, 0])}px) rotate(${interpolate(
            drop,
            [0, 1],
            [6, 0]
          )}deg)`,
        }}
      >
        <Paper
          color="#FFFDF3"
          rotate={-1}
          style={{width: 1100, height: 560, borderRadius: 14}}
        >
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: p1,
              }}
            >
              <div style={{fontSize: 180, fontWeight: 900, color: '#D96C4A', lineHeight: 1}}>
                {Math.round(counter)}×
              </div>
              <div style={{fontSize: 36, color: '#444', marginTop: 8}}>
                aaj tumne kagaz ko itni baar chhua
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: p2,
              }}
            >
              <div style={{fontSize: 150, fontWeight: 900, color: '#3E6B8C', lineHeight: 1}}>
                2,000 saal
              </div>
              <div style={{fontSize: 36, color: '#444', marginTop: 8}}>
                purani kahani ka pehla panna
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 13}});
  return (
    <AbsoluteFill style={{backgroundColor: '#F3E7C9', justifyContent: 'center', alignItems: 'center'}}>
      <PaperSun top={110} right={300} />
      <PaperCloud left={180} top={200} />
      <PaperCloud left={1350} top={120} scale={1.25} tint="#FFF8E6" />
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
          opacity: Math.min(1, s * 1.2),
          textAlign: 'center',
        }}
      >
        <Paper color="#FFFDF3" rotate={-2} style={{padding: '70px 140px', borderRadius: 18}}>
          <div style={{fontSize: 30, letterSpacing: 12, color: '#8A6D3B', fontWeight: 700}}>
            EK PAPER-CUTOUT DOCUMENTARY
          </div>
          <div
            style={{
              fontSize: 170,
              fontWeight: 900,
              lineHeight: 1,
              marginTop: 8,
              color: '#2B2B2B',
              textShadow: '6px 6px 0 #E8A13D',
            }}
          >
            {CREDITS.title}
          </div>
          <div style={{fontSize: 44, color: '#444', marginTop: 6, fontStyle: 'italic'}}>
            {CREDITS.subtitle}
          </div>
          <div style={{width: 120, height: 8, background: '#E8A13D', margin: '26px auto 0', borderRadius: 4}} />
          <div style={{fontSize: 30, color: '#6b6b6b', marginTop: 20}}>{CREDITS.line}</div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

const StatsChapter: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{backgroundColor: '#F3E7C9', overflow: 'hidden'}}>
      <PaperSun top={120} right={260} size={160} color="#E8B64C" />
      <PaperCloud left={140} top={200} tint="#FFF8E6" />
      <div
        style={{
          position: 'absolute',
          right: -60,
          bottom: -120,
          fontSize: 420,
          fontWeight: 900,
          color: 'rgba(138,109,59,0.10)',
          fontStyle: 'italic',
        }}
      >
        123
      </div>
    </AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        top: 230,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 60,
      }}
    >
      {STATS.map((s, i) => (
        <StatCounter
          key={i}
          emoji={s.emoji}
          value={s.value}
          suffix={s.suffix}
          label={s.label}
          delay={235 + i * 15}
          rotate={i % 2 === 0 ? -1.8 : 1.4}
        />
      ))}
    </div>
  </AbsoluteFill>
);

const CraftScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#F6E3D0', overflow: 'hidden'}}>
      <PaperSun top={110} right={300} size={170} color="#D98E5F" />
      <PaperCloud left={200} top={170} />
      {CRAFT.map((c, i) => {
        const s = spring({frame: frame - 20 - i * 9, fps, config: {damping: 12}});
        const float = Math.sin((frame + i * 30) / 22) * 10;
        const angle = (i - 2) * 9;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 250 + i * 300,
              top: 460 + Math.abs(i - 2) * 44 + float,
              transform: `scale(${s})`,
              opacity: s,
            }}
          >
            <Paper
              color="#FFFDF3"
              rotate={angle}
              style={{width: 230, padding: '26px 10px', textAlign: 'center', borderRadius: 12}}
            >
              <div style={{fontSize: 64}}>{c.emoji}</div>
              <div style={{fontSize: 30, fontWeight: 700}}>{c.label}</div>
            </Paper>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const DigitalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: frame - 40, fps, config: {damping: 12}});
  const b = spring({frame: frame - 100, fps, config: {damping: 12}});
  const banner = spring({frame: frame - 200, fps, config: {damping: 12}});
  return (
    <AbsoluteFill>
      <CityScene />
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 380,
          transform: `translateY(${interpolate(a, [0, 1], [300, 0])}px)`,
          opacity: a,
        }}
      >
        <Paper color="#2E3440" rotate={-3} style={{padding: '34px 46px', borderRadius: 18, textAlign: 'center'}}>
          <div style={{fontSize: 70}}>📱</div>
          <div style={{fontSize: 34, fontWeight: 700, color: '#fff'}}>PAPERLESS?</div>
        </Paper>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 300,
          top: 380,
          transform: `translateY(${interpolate(b, [0, 1], [300, 0])}px)`,
          opacity: b,
        }}
      >
        <Paper color="#FFFDF3" rotate={2.5} style={{padding: '34px 46px', borderRadius: 18, textAlign: 'center'}}>
          <div style={{fontSize: 70}}>📄</div>
          <div style={{fontSize: 34, fontWeight: 700}}>AUR BHI ZAROORI</div>
        </Paper>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 575,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${banner})`,
          opacity: banner,
        }}
      >
        <Paper color="#E8A13D" rotate={-1} style={{padding: '26px 60px', borderRadius: 14}}>
          <div style={{fontSize: 52, fontWeight: 900}}>ROLE BADLA — KHATAM NAHI</div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

export const ChapterScene: React.FC<{ch: Chapter}> = ({ch}) => (
  <>
    <KenBurns duration={ch.duration}>
      {ch.n === 1 && <RiceFieldScene />}
      {ch.n === 2 && <DesertScene />}
      {ch.n === 3 && <StatsChapter />}
      {ch.n === 4 && <CraftScene />}
      {ch.n === 5 && <DigitalScene />}
    </KenBurns>
    <ChapterCard
      n={ch.n}
      name={ch.name}
      place={ch.place}
      duration={Math.min(CHAPTER_CARD_FRAMES, ch.duration)}
    />
    <LowerThird n={ch.n} name={ch.name} place={ch.place} />
  </>
);

export const Closing: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 13}});
  const endS = spring({frame: frame - 180, fps, config: {damping: 13}});
  const showEnd = frame >= 175;
  void duration;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F3E7C9',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
      }}
    >
      <PaperSun top={130} right={340} size={150} color="#E8B64C" />
      <PaperCloud left={220} top={190} />
      {!showEnd ? (
        <div
          style={{
            transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <Paper color="#FFFDF3" rotate={-1.4} style={{padding: '64px 100px', maxWidth: 1300}}>
            <div style={{fontSize: 44, color: '#8A6D3B', letterSpacing: 6, fontWeight: 700}}>
              AAKHIR MEIN
            </div>
            <div style={{fontSize: 66, fontWeight: 900, lineHeight: 1.25, marginTop: 12}}>
              Jab bhi kuch banane ka mann kare —
              <br />
              ek kagaz uthao, aur shuru karo. ✂️
            </div>
          </Paper>
        </div>
      ) : (
        <div
          style={{
            transform: `scale(${interpolate(endS, [0, 1], [0.6, 1])})`,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <Paper color="#E8A13D" rotate={1.4} style={{padding: '70px 130px', borderRadius: 20}}>
            <div style={{fontSize: 120, fontWeight: 900}}>THE END</div>
            <div style={{fontSize: 34, marginTop: 10}}>
              {CREDITS.title} — {CREDITS.subtitle}
            </div>
          </Paper>
          <div style={{marginTop: 30, fontSize: 30, color: '#6b6b6b'}}>{CREDITS.credit}</div>
        </div>
      )}
      <ScissorsSweep />
    </AbsoluteFill>
  );
};

export {T};
