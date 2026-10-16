import {AbsoluteFill, staticFile} from 'remotion';

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.42}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('textures/grain.png')})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '512px 512px',
        mixBlendMode: 'multiply',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};
