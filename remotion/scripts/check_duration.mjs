import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const timing = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'timing.json'), 'utf-8'));
const FPS = timing.fps ?? 30;
const MAX = 5400;

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  failures++;
};

console.log('id        start   dur   words  align');
let prevWordCount = 0;
for (const seg of timing.segments) {
  const audioPath = path.join(ROOT, 'public', seg.audio);
  if (!fs.existsSync(audioPath)) fail(`missing audio ${seg.audio}`);
  if (!seg.words.length && seg.alignment !== 'placeholder') fail(`segment ${seg.id} has no word timings`);
  if (prevWordCount === 0 && seg.startFrame !== 0) fail(`first segment does not start at 0`);
  prevWordCount += seg.words.length;
  let mono = true;
  for (let i = 1; i < seg.words.length; i++) {
    if (seg.words[i].startFrame < seg.words[i - 1].startFrame) mono = false;
  }
  if (!mono) fail(`segment ${seg.id} words not monotonic`);
  console.log(
    `${seg.id.padEnd(9)} ${String(seg.startFrame).padStart(5)} ${String(seg.durationFrames).padStart(5)} ${String(seg.words.length).padStart(5)}  ${seg.alignment}`
  );
}

const sfxDir = path.join(ROOT, 'public', 'sfx');
for (const cue of timing.sfx) {
  if (!fs.existsSync(path.join(sfxDir, `${cue.name}.wav`))) fail(`missing sfx ${cue.name}.wav`);
  if (cue.frame < 0 || cue.frame >= timing.totalDurationFrames) fail(`sfx ${cue.name} frame out of range`);
}

const totalS = timing.totalDurationFrames / FPS;
console.log(`\ntotal: ${totalS.toFixed(1)}s (${timing.totalDurationFrames} frames @ ${FPS}fps, cap ${MAX} = 3:00)`);
if (timing.totalDurationFrames > MAX) fail(`over Shorts cap (${timing.totalDurationFrames} > ${MAX})`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log(`\nOK - ${timing.segments.length} segments, ${timing.sfx.length} sfx cues, all checks passed`);
