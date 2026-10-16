#!/usr/bin/env python3
"""Generate voice-over mp3s (edge-tts) + word timings + SFX cue timeline.

Outputs:
  public/vo/<id>.mp3       one file per segment
  src/data/timing.json     full timing manifest consumed by Remotion
"""

import asyncio
import json
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
VO = ROOT / "public" / "vo"
OUT = ROOT / "src" / "data" / "timing.json"
FPS = 30
END_HOLD_FRAMES = 45
MAX_TOTAL_FRAMES = 5400  # 3:00 Shorts cap

BITRATES_V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
BITRATES_V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
SAMPLE_RATES = {3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000]}


def mp3_duration(path: Path) -> float:
    """Duration of an MPEG-1/2/2.5 Layer III file by frame scanning."""
    data = path.read_bytes()
    i = 0
    if data[:3] == b"ID3" and len(data) > 10:
        size = (
            (data[6] & 0x7F) << 21
            | (data[7] & 0x7F) << 14
            | (data[8] & 0x7F) << 7
            | (data[9] & 0x7F)
        )
        i = 10 + size + (10 if data[5] & 0x10 else 0)
    end = len(data) - (128 if data[-128:-125] == b"TAG" else 0)
    total_seconds = 0.0
    while i + 4 < end:
        if data[i] == 0xFF and (data[i + 1] & 0xE0) == 0xE0:
            ver_bits = (data[i + 1] >> 3) & 0x03
            layer_bits = (data[i + 1] >> 1) & 0x03
            if ver_bits != 1 and layer_bits == 1:  # not reserved, Layer III
                br_idx = (data[i + 2] >> 4) & 0x0F
                sr_idx = (data[i + 2] >> 2) & 0x03
                pad = (data[i + 2] >> 1) & 0x01
                version = {3: 1, 2: 2, 0: 25}[ver_bits]
                table = BITRATES_V1_L3 if version == 1 else BITRATES_V2_L3
                if br_idx not in (0, 15) and sr_idx != 3:
                    bitrate = table[br_idx] * 1000
                    sr = SAMPLE_RATES[ver_bits][sr_idx]
                    samples = 1152 if version == 1 else 576
                    total_seconds += samples / sr
                    flen = int((144 if version == 1 else 72) * bitrate / sr) + pad
                    i += max(flen, 1)
                    continue
        i += 1
    return total_seconds


async def synth_segment(seg: dict, cfg: dict) -> list:
    last_err = None
    for attempt in range(6):
        try:
            com = edge_tts.Communicate(
                seg["vo"],
                cfg["voice"],
                rate=cfg["rate"],
                pitch=cfg.get("pitch", "+0Hz"),
                volume=cfg.get("volume", "+0%"),
                boundary="WordBoundary",
            )
            cues = []
            with open(VO / f"{seg['id']}.mp3", "wb") as f:
                async for chunk in com.stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        cues.append(
                            {
                                "text": chunk["text"],
                                "start": chunk["offset"] / 1e7,
                                "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                            }
                        )
            if not cues:
                raise RuntimeError("no WordBoundary events received")
            return cues
        except Exception as e:  # noqa: BLE001
            last_err = e
            wait = 2**attempt
            print(f"  [{seg['id']}] attempt {attempt + 1}/6 failed: {e} (retry in {wait}s)", file=sys.stderr)
            await asyncio.sleep(wait)
    raise SystemExit(f"FATAL: segment '{seg['id']}' failed after retries: {last_err}")


def resolve_word_frame(words: list, text: str, occurrence: int, fallback: int) -> int:
    matches = [w for w in words if w["text"] == text]
    if occurrence >= len(matches):
        print(
            f"  warning: sfx word '{text}'#{occurrence} not found, using fallback frame {fallback}",
            file=sys.stderr,
        )
        return fallback
    return matches[occurrence]["startFrame"]


async def main() -> None:
    VO.mkdir(parents=True, exist_ok=True)
    script = json.loads((ROOT / "content" / "script.json").read_text(encoding="utf-8"))

    total_words = sum(len(s["display"]) for s in script["segments"])
    print(f"voice={script['voice']} rate={script['rate']} segments={len(script['segments'])} words={total_words}")

    out = {
        "fps": FPS,
        "voice": script["voice"],
        "rate": script["rate"],
        "totalDurationFrames": 0,
        "segments": [],
        "sfx": [],
    }
    cur = 0
    for seg in script["segments"]:
        cues = await synth_segment(seg, script)
        dur_s = mp3_duration(VO / f"{seg['id']}.mp3")
        dur_f = round(dur_s * FPS)
        disp = seg["display"]

        words = []
        if len(disp) == len(cues):
            alignment = "index"
            for d, c in zip(disp, cues):
                words.append(
                    {
                        "text": d,
                        "startFrame": max(0, round(c["start"] * FPS)),
                        "endFrame": max(0, round(c["end"] * FPS)),
                    }
                )
        else:
            alignment = "proportional"
            print(
                f"  warning: '{seg['id']}' cue/display count mismatch "
                f"({len(cues)} cues vs {len(disp)} display) -> proportional",
                file=sys.stderr,
            )
            t0, t1 = cues[0]["start"], cues[-1]["end"]
            n = len(disp)
            span = max(t1 - t0, 1e-3)
            for i, d in enumerate(disp):
                words.append(
                    {
                        "text": d,
                        "startFrame": max(0, round((t0 + i / n * span) * FPS)),
                        "endFrame": max(0, round((t0 + (i + 1) / n * span) * FPS)),
                    }
                )

        for w_i in range(1, len(words)):
            if words[w_i]["startFrame"] < words[w_i - 1]["startFrame"]:
                words[w_i]["startFrame"] = words[w_i - 1]["startFrame"]

        out["segments"].append(
            {
                "id": seg["id"],
                "scene": seg["scene"],
                "audio": f"vo/{seg['id']}.mp3",
                "startFrame": cur,
                "durationFrames": dur_f,
                "words": words,
                "alignment": alignment,
            }
        )

        for cue in seg.get("sfx", []):
            if "word" in cue:
                base = resolve_word_frame(words, cue["word"], cue.get("wordIndex", 0), dur_f // 2)
                frame = cur + base + cue.get("offsetFrames", 0)
            else:
                frame = cur + round(cue["at"] * FPS)
            frame = min(max(frame, cur), cur + dur_f)
            out["sfx"].append({"name": cue["name"], "frame": frame, "vol": cue.get("vol", 0.9)})

        cur += dur_f + seg.get("pauseAfterFrames", 8)
        print(f"  {seg['id']:<8} {dur_s:6.2f}s ({dur_f:4d} f)  align={alignment}  cues={len(cues)}")

    out["totalDurationFrames"] = cur + END_HOLD_FRAMES
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=2), encoding="utf-8")

    total_s = out["totalDurationFrames"] / FPS
    sfx_count = len(out["sfx"])
    print(f"\nTOTAL {total_s:.1f}s ({out['totalDurationFrames']} frames)  sfx cues: {sfx_count}")
    print(f"wrote {OUT.relative_to(ROOT)}")
    if out["totalDurationFrames"] > MAX_TOTAL_FRAMES:
        raise SystemExit(f"ERROR: {total_s:.1f}s exceeds 3:00 Shorts cap")


if __name__ == "__main__":
    asyncio.run(main())
