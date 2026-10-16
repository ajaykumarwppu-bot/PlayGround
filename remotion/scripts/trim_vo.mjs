import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TIMING = path.join(ROOT, 'src', 'data', 'timing.json');
const timing = JSON.parse(fs.readFileSync(TIMING, 'utf-8'));
const FPS = timing.fps ?? 30;
const END_HOLD_FRAMES = 45;
const KEEP_TAIL = 10;
const PAUSE = 4;

const ffmpeg = (args) => execFileSync('npx', ['remotion', 'ffmpeg', '-y', ...args], {cwd: ROOT, stdio: 'pipe'});

let cur = 0;
for (const seg of timing.segments) {
  const speechEnd = seg.words.length ? seg.words[seg.words.length - 1].endFrame : 0;
  const keep = Math.min(seg.durationFrames, speechEnd + KEEP_TAIL);
  if (keep < seg.durationFrames) {
    const src = path.join(ROOT, 'public', seg.audio);
    const tmp = path.join(ROOT, 'public', seg.audio.replace(/\.mp3$/, '.trim.mp3'));
    ffmpeg(['-i', src, '-t', (keep / FPS).toFixed(3), '-c', 'copy', tmp]);
    fs.renameSync(tmp, src);
    console.log(`${seg.id.padEnd(8)} trimmed ${seg.durationFrames} -> ${keep} (+${((seg.durationFrames - keep) / FPS).toFixed(2)}s)`);
  }
  const oldStart = seg.startFrame;
  seg.startFrame = cur;
  seg.durationFrames = keep;
  cur += keep + PAUSE;
  seg._oldStart = oldStart;
}

const shift = (frame) => {
  const seg = [...timing.segments].reverse().find((s) => frame >= s._oldStart);
  if (!seg) return frame;
  return seg.startFrame + (frame - seg._oldStart);
};
for (const cue of timing.sfx) {
  cue.frame = shift(cue.frame);
}
timing.totalDurationFrames = cur - PAUSE + END_HOLD_FRAMES;
for (const seg of timing.segments) delete seg._oldStart;

fs.writeFileSync(TIMING, JSON.stringify(timing, null, 2) + '\n');
console.log(`total: ${(timing.totalDurationFrames / FPS).toFixed(1)}s (${timing.totalDurationFrames} frames)`);
