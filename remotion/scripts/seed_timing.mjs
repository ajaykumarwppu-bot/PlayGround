import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'data', 'timing.json');

if (fs.existsSync(OUT)) {
  console.log('timing.json already exists - not overwriting (run from real TTS instead)');
  process.exit(0);
}

const script = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'script.json'), 'utf-8'));
const FPS = 30;

let cur = 0;
const segments = [];
for (const seg of script.segments) {
  const estFrames = Math.round((seg.display.length / 2.9) * FPS);
  segments.push({
    id: seg.id,
    scene: seg.scene,
    audio: `vo/${seg.id}.mp3`,
    startFrame: cur,
    durationFrames: estFrames,
    words: [],
    alignment: 'placeholder',
  });
  cur += estFrames + (seg.pauseAfterFrames ?? 8);
}

const timing = {
  fps: FPS,
  voice: script.voice,
  rate: script.rate,
  totalDurationFrames: cur + 45,
  segments,
  sfx: [],
};

fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, JSON.stringify(timing, null, 2) + '\n');
console.log(`placeholder timing written: ${timing.totalDurationFrames} frames (${(timing.totalDurationFrames / FPS).toFixed(1)}s)`);
