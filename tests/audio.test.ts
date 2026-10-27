import { describe, expect, it, vi } from "vitest";
import { VoicePlayer, type AudioLike } from "../src/utils/audio";

function fakeAudio(playFails = false): AudioLike & { fire: (type: string) => void } {
  const handlers: Record<string, (() => void)[]> = {};
  const audio: any = {
    paused: true,
    currentTime: 0,
    duration: 10,
    playbackRate: 1,
    play: vi.fn(async () => {
      if (playFails) throw new Error("blocked");
      audio.paused = false;
      audio.fire("play");
    }),
    pause: vi.fn(() => {
      audio.paused = true;
      audio.fire("pause");
    }),
    addEventListener: (type: string, fn: () => void) => (handlers[type] ||= []).push(fn),
    removeEventListener: (type: string, fn: () => void) => (handlers[type] = (handlers[type] || []).filter((h) => h !== fn)),
    fire: (type: string) => (handlers[type] || []).forEach((h) => h()),
  };
  return audio;
}

describe("VoicePlayer", () => {
  it("pauses the voice note that was playing when another one starts", async () => {
    const a = fakeAudio();
    const b = fakeAudio();
    const first = new VoicePlayer(a);
    const second = new VoicePlayer(b);
    await first.play();
    await second.play();
    expect(a.pause).toHaveBeenCalled();
    expect(second.state.playing).toBe(true);
    expect(first.state.playing).toBe(false);
  });

  it("reports an error instead of throwing when the audio cannot play", async () => {
    const player = new VoicePlayer(fakeAudio(true));
    const states: boolean[] = [];
    player.onState((s) => states.push(s.error));
    await expect(player.play()).resolves.toBeUndefined();
    expect(player.state.error).toBe(true);
    expect(states.at(-1)).toBe(true);
  });

  it("seeks to a share of the duration", () => {
    const audio = fakeAudio();
    new VoicePlayer(audio).seek(0.5);
    expect(audio.currentTime).toBe(5);
  });

  it("changes the playback speed", () => {
    const audio = fakeAudio();
    const player = new VoicePlayer(audio);
    player.setRate(1.5);
    expect(audio.playbackRate).toBe(1.5);
    expect(player.state.rate).toBe(1.5);
  });
});
