import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {VIDEO_CONFIG} from './config';
import {Paper, useJitter} from './components/Paper';
import {SkyScene} from './components/SkyScene';

export const PaperCutoutVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpring = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const titleScale = interpolate(titleSpring, [0, 1], [0.4, 1]);
  const jitter = useJitter(frame, 1.5);

  return (
    <AbsoluteFill style={{backgroundColor: '#F3E7C9', fontFamily: 'Georgia, serif'}}>
      {/* INTRO 0-90 */}
      <Sequence from={0} durationInFrames={100}>
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <SkyScene />
          <div
            style={{
              transform: `scale(${titleScale}) translate(${jitter.x}px, ${jitter.y}px) rotate(${jitter.r}deg)`,
              textAlign: 'center',
            }}
          >
            <Paper
              color="#FFFDF3"
              style={{padding: '40px 90px', borderRadius: 18}}
              rotate={-2}
            >
              <div
                style={{
                  fontSize: 28,
                  letterSpacing: 8,
                  color: '#8A6D3B',
                  fontWeight: 700,
                }}
              >
                {VIDEO_CONFIG.subtitle.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 110,
                  fontWeight: 900,
                  color: '#2B2B2B',
                  lineHeight: 1,
                  marginTop: 10,
                  textShadow: '4px 4px 0 #E8A13D',
                }}
              >
                {VIDEO_CONFIG.title}
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: 'inline-block',
                  background: '#2B2B2B',
                  color: '#fff',
                  padding: '10px 28px',
                  borderRadius: 30,
                  fontSize: 28,
                }}
              >
                ✂️ PAPER CUTOUT STYLE ✂️
              </div>
            </Paper>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* MIDDLE SCENES */}
      {VIDEO_CONFIG.scenes.map((s, i) => {
        const from = 100 + i * 90;
        return (
          <Sequence key={i} from={from} durationInFrames={90}>
            <SceneCard heading={s.heading} body={s.body} bg={s.bg} index={i} />
          </Sequence>
        );
      })}

      {/* OUTRO */}
      <Sequence from={100 + VIDEO_CONFIG.scenes.length * 90} durationInFrames={90}>
        <AbsoluteFill
          style={{
            backgroundColor: '#2B2B2B',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper color="#E8A13D" style={{padding: '50px 100px'}} rotate={1.5}>
            <div style={{fontSize: 70, fontWeight: 900, textAlign: 'center'}}>
              THE END
            </div>
            <div style={{fontSize: 30, textAlign: 'center', marginTop: 10}}>
              {VIDEO_CONFIG.cta}
            </div>
          </Paper>
          <Scissors />
        </AbsoluteFill>
      </Sequence>

      {/* film grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            'repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

const SceneCard: React.FC<{heading: string; body: string; bg: string; index: number}> = ({
  heading,
  body,
  bg,
  index,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const up = spring({frame, fps, config: {damping: 14}});
  const y = interpolate(up, [0, 1], [500, 0]);
  const rot = interpolate(frame, [0, 60], [index % 2 ? 4 : -4, 0]);

  const colors = ['#D96C4A', '#3E6B8C', '#5E7F5C'];

  return (
    <AbsoluteFill style={{backgroundColor: bg, justifyContent: 'center', alignItems: 'center'}}>
      <SkyScene />
      <div style={{transform: `translateY(${y}px) rotate(${rot}deg)`, display: 'flex', gap: 40}}>
        <Paper color={colors[index % 3]} style={{width: 140, height: 380, borderRadius: 70}} rotate={2}>
          <div style={{fontSize: 90, textAlign: 'center', marginTop: 120}}>
            {['☀️', '⛰️', '✏️'][index % 3]}
          </div>
        </Paper>
        <Paper color="#FFFDF3" style={{width: 900, padding: '50px 60px'}} rotate={-1}>
          <div style={{fontSize: 36, letterSpacing: 4, color: '#8A6D3B', fontWeight: 700}}>
            SCENE {index + 1}
          </div>
          <div style={{fontSize: 84, fontWeight: 900, lineHeight: 1}}>{heading}</div>
          <div style={{fontSize: 34, marginTop: 16, color: '#444'}}>{body}</div>
        </Paper>
      </div>
    </AbsoluteFill>
  );
};

const Scissors: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 89], [-200, 2120], {extrapolateRight: 'clamp'});
  const open = Math.sin(frame * 0.4) * 12;
  return (
    <div style={{position: 'absolute', top: '50%', left: x, fontSize: 90, transform: 'rotate(20deg)'}}>
      <div style={{transform: `rotate(${open}deg)`}}>✂️</div>
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: -1600,
          width: 1600,
          borderTop: '6px dashed #fff',
        }}
      />
    </div>
  );
};
