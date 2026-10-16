import React from 'react';

// Kagaz jaisa shadow + halka texture. Har cutout ko isme lapeto.
export const Paper: React.FC<{
  children: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
  rotate?: number;
}> = ({children, color, style, rotate = -1.5}) => {
  return (
    <div
      style={{
        backgroundColor: color,
        boxShadow: '0 10px 0 rgba(0,0,0,0.12), 0 18px 30px rgba(0,0,0,0.18)',
        borderRadius: 6,
        transform: `rotate(${rotate}deg)`,
        position: 'relative',
        ...style,
      }}
    >
      {/* paper grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          opacity: 0.18,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 5px)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

// Stop-motion wala jitter — paper cutout films me thoda hilta hai
export const useJitter = (frame: number, amount = 1.2) => {
  const step = Math.floor(frame / 3); // 10fps feel
  const x = Math.sin(step * 12.9898) * 43758.5453;
  const frac = x - Math.floor(x);
  const y = Math.sin(step * 78.233) * 12543.123;
  const frac2 = y - Math.floor(y);
  return {
    x: (frac - 0.5) * 2 * amount,
    y: (frac2 - 0.5) * 2 * amount,
    r: (frac - 0.5) * 1.4,
  };
};
