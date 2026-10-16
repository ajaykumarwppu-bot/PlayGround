import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SFX_DIR = path.join(ROOT, 'public', 'sfx');
const TEX_DIR = path.join(ROOT, 'public', 'textures');
const FPS = 30;
const SR = 44100;

fs.mkdirSync(SFX_DIR, {recursive: true});
fs.mkdirSync(TEX_DIR, {recursive: true});

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2i(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function whiteNoise(n, rnd) {
  const a = new Float32Array(n);
  for (let i = 0; i < n; i++) a[i] = rnd() * 2 - 1;
  return a;
}

class Biquad {
  constructor() {
    this.z1 = 0;
    this.z2 = 0;
    this.c = {b0: 1, b1: 0, b2: 0, a1: 0, a2: 0};
  }
  setCoeffs(type, freq, q, sr = SR) {
    const f = clamp(freq, 20, sr * 0.45);
    const w0 = (2 * Math.PI * f) / sr;
    const cw = Math.cos(w0);
    const sw = Math.sin(w0);
    const alpha = sw / (2 * q);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'lowpass') {
      b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = (1 - cw) / 2;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
    } else if (type === 'highpass') {
      b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
    } else {
      b0 = alpha; b1 = 0; b2 = -alpha;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
    }
    this.c = {b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0};
  }
  process(x) {
    const {b0, b1, b2, a1, a2} = this.c;
    const y = b0 * x + this.z1;
    this.z1 = b1 * x - a1 * y + this.z2;
    this.z2 = b2 * x - a2 * y;
    return y;
  }
}

function normalize(buf, peak = 0.9) {
  let max = 1e-9;
  for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(buf[i]));
  const g = peak / max;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
  return buf;
}

function toWav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(clamp(samples[i], -1, 1) * 32767), 44 + i * 2);
  }
  return buf;
}

function makeWhoosh({dur = 0.45, f0 = 300, f1 = 3500, q = 1.1, seed = 1}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const bp = new Biquad();
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const tt = t / dur;
    if (i % 32 === 0) bp.setCoeffs('bandpass', f0 * Math.pow(f1 / f0, tt), q);
    const env = Math.pow(tt, 0.6) * Math.exp(-3 * tt) * 3.4;
    out[i] = bp.process(noise[i]) * env;
  }
  return normalize(out, 0.85);
}

function makeRip({dur = 0.35, seed = 2}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const hp = new Biquad();
  hp.setCoeffs('highpass', 1500, 0.8);
  const stepGains = new Float32Array(240);
  for (let s = 0; s < stepGains.length; s++) stepGains[s] = 0.55 + 0.45 * mulberry32(seed * 131 + s)();
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const jag =
      (0.55 + 0.45 * Math.abs(Math.sin(2 * Math.PI * 17 * t + 3 * Math.sin(2 * Math.PI * 5 * t)))) *
      stepGains[Math.floor(t / 0.003) % 240];
    out[i] = hp.process(noise[i]) * Math.exp(-t / 0.3) * jag;
  }
  return normalize(out, 0.85);
}

function makePop({dur = 0.12, seed = 3}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 70 + 110 * Math.exp(-t / 0.02);
    phase += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t / 0.035);
    const click = t < 0.003 ? (rnd() * 2 - 1) * 0.5 : 0;
    out[i] = Math.sin(phase) * env + click;
  }
  return normalize(out, 0.9);
}

function makeStamp({dur = 0.28, seed = 4}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const lp = new Biquad();
  lp.setCoeffs('lowpass', 600, 0.9);
  const tick = new Biquad();
  tick.setCoeffs('bandpass', 3000, 2.5);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const sub = Math.sin(2 * Math.PI * 70 * t) * Math.exp(-t / 0.06) * 0.9;
    const burst = lp.process(noise[i]) * Math.exp(-t / 0.03) * 0.8;
    const clack = tick.process(noise[i]) * Math.exp(-t / 0.004) * 0.6;
    out[i] = sub + burst + clack;
  }
  return normalize(out, 0.95);
}

function makeDing({dur = 0.7, seed = 5}) {
  const n = Math.round(dur * SR);
  const out = new Float32Array(n);
  const partials = [
    [1046.5, 0.6],
    [1568.0, 0.4],
    [2093.0, 0.2],
    [523.25, 0.25],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const attack = Math.min(1, t / 0.003);
    const env = attack * Math.exp(-t / 0.25);
    const shimmer = 1 + 0.12 * Math.sin(2 * Math.PI * 6 * t);
    let v = 0;
    for (const [f, a] of partials) v += a * Math.sin(2 * Math.PI * f * t);
    out[i] = v * env * shimmer;
  }
  return normalize(out, 0.8);
}

function makeBuzz({dur = 0.4, seed = 6}) {
  const n = Math.round(dur * SR);
  const lp = new Biquad();
  lp.setCoeffs('lowpass', 1000, 0.9);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const sq1 = Math.sign(Math.sin(2 * Math.PI * 110 * t));
    const sq2 = Math.sign(Math.sin(2 * Math.PI * 117 * t));
    const trem = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 28 * t));
    out[i] = lp.process((sq1 + sq2) * 0.5) * Math.exp(-t / 0.15) * trem;
  }
  return normalize(out, 0.75);
}

function makeTick({dur = 0.03, seed = 7}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const bp = new Biquad();
  bp.setCoeffs('bandpass', 3000, 4);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    out[i] = bp.process(noise[i]) * Math.exp(-t / 0.006);
  }
  return normalize(out, 0.8);
}

function makeRiser({dur = 1.4, seed = 8}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const bp = new Biquad();
  const out = new Float32Array(n);
  let phase = 0;
  let tremPhase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const tt = t / dur;
    if (i % 32 === 0) bp.setCoeffs('bandpass', 400 * Math.pow(15, tt), 1.0);
    const f = 200 * Math.pow(8, tt);
    phase += (2 * Math.PI * f) / SR;
    tremPhase += (2 * Math.PI * (4 + 12 * tt)) / SR;
    const env = Math.pow(tt, 1.8);
    const trem = 0.8 + 0.2 * Math.sin(tremPhase);
    out[i] = (0.6 * Math.sin(phase) + 0.5 * bp.process(noise[i])) * env * trem;
  }
  return normalize(out, 0.85);
}

function makeSnip({dur = 0.15, seed = 9}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const bp = new Biquad();
  const tick1 = new Biquad();
  tick1.setCoeffs('bandpass', 3200, 4);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (i % 32 === 0) bp.setCoeffs('bandpass', 6000 * Math.pow(1 / 3, t / dur), 1.4);
    const t2 = t - 0.055;
    const tickA = t < 0.02 ? tick1.process(noise[i]) * Math.exp(-t / 0.006) : 0;
    const tickB = t2 >= 0 && t2 < 0.02 ? tick1.process(noise[i]) * Math.exp(-t2 / 0.006) : 0;
    const sweep = bp.process(noise[i]) * Math.exp(-t / 0.05) * 0.5 * (t > 0.03 ? 1 : 0.35);
    out[i] = tickA + tickB + sweep;
  }
  return normalize(out, 0.8);
}

function makeFlip({dur = 0.22, seed = 10}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const bp = new Biquad();
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const tt = t / dur;
    if (i % 32 === 0) bp.setCoeffs('bandpass', 600 * Math.pow(5, tt), 1.2);
    const swell =
      Math.exp(-Math.pow(t - 0.05, 2) / 0.0016) + 0.7 * Math.exp(-Math.pow(t - 0.15, 2) / 0.0016);
    out[i] = bp.process(noise[i]) * swell;
  }
  return normalize(out, 0.7);
}

function makeSlap({dur = 0.18, seed = 11}) {
  const n = Math.round(dur * SR);
  const rnd = mulberry32(seed);
  const noise = whiteNoise(n, rnd);
  const lp = new Biquad();
  lp.setCoeffs('lowpass', 900, 0.9);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const thump = Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t / 0.05) * 0.9;
    const burst = lp.process(noise[i]) * Math.exp(-t / 0.02) * 0.7;
    out[i] = thump + burst;
  }
  return normalize(out, 0.85);
}

const SFX = {
  whoosh: makeWhoosh({}),
  rip: makeRip({}),
  pop: makePop({}),
  stamp: makeStamp({}),
  ding: makeDing({}),
  buzz: makeBuzz({}),
  tick: makeTick({}),
  riser: makeRiser({}),
  snip: makeSnip({}),
  flip: makeFlip({}),
  slap: makeSlap({}),
};

const durations = {};
for (const [name, samples] of Object.entries(SFX)) {
  fs.writeFileSync(path.join(SFX_DIR, `${name}.wav`), toWav(samples));
  durations[name] = Math.ceil((samples.length / SR) * FPS);
  console.log(
    `${name.padEnd(8)} ${(samples.length / SR).toFixed(3)}s  (${durations[name]} frames @${FPS}fps)`
  );
}
fs.writeFileSync(path.join(SFX_DIR, 'durations.json'), JSON.stringify(durations, null, 2) + '\n');

// ---------- paper grain texture ----------
const TEX = 512;

function vnoise(x, y, cell, seed) {
  const xi = Math.floor(x / cell);
  const yi = Math.floor(y / cell);
  const xf = x / cell - xi;
  const yf = y / cell - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const p = TEX / cell;
  const h = (a, b) => hash2i(((a % p) + p) % p, ((b % p) + p) % p, seed);
  const n00 = h(xi, yi);
  const n10 = h(xi + 1, yi);
  const n01 = h(xi, yi + 1);
  const n11 = h(xi + 1, yi + 1);
  return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v;
}

const rgba = new Uint8Array(TEX * TEX * 4);
const grainRnd = mulberry32(4242);
for (let y = 0; y < TEX; y++) {
  for (let x = 0; x < TEX; x++) {
    const fbm =
      0.45 * vnoise(x, y, 64, 11) +
      0.28 * vnoise(x, y, 32, 22) +
      0.17 * vnoise(x, y, 16, 33) +
      0.1 * vnoise(x, y, 8, 44);
    const fine = grainRnd() * 14;
    const v = clamp(Math.round(242 + (fbm - 0.5) * 26 - fine), 190, 255);
    const idx = (y * TEX + x) * 4;
    rgba[idx] = v;
    rgba[idx + 1] = v;
    rgba[idx + 2] = v;
    rgba[idx + 3] = 255;
  }
}

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  const px = Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, {level: 9})),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.writeFileSync(path.join(TEX_DIR, 'grain.png'), encodePng(TEX, TEX, rgba));
console.log(`grain.png   ${TEX}x${TEX}`);
console.log('done');
