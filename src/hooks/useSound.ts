import { useState, useCallback } from "react";

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
}

interface SoundHook {
  playMove: () => void;
  playWin: () => void;
  playLose: () => void;
  playDraw: () => void;
  playNotification: () => void;
  playError: () => void;
  isEnabled: boolean;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
}

// Generate sound data URLs for different game sounds
const generateSoundData = (
  frequency: number,
  duration: number,
  type: "sine" | "square" | "sawtooth" = "sine"
): string => {
  const sampleRate = 44100;
  const length = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length * 2, true);

  // Generate audio data
  for (let i = 0; i < length; i++) {
    let sample = 0;
    const t = i / sampleRate;

    switch (type) {
      case "sine":
        sample = Math.sin(2 * Math.PI * frequency * t);
        break;
      case "square":
        sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
        break;
      case "sawtooth":
        sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
        break;
    }

    // Apply envelope (fade in/out)
    const envelope = Math.exp(-t * 2);
    sample *= envelope;

    // Convert to 16-bit PCM
    const intSample = Math.max(-32768, Math.min(32767, sample * 32767));
    view.setInt16(44 + i * 2, intSample, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
};

// Pre-generated sound data URLs
const soundData = {
  move: generateSoundData(800, 0.1, "sine"),
  win: generateSoundData(1200, 0.3, "square"),
  lose: generateSoundData(400, 0.5, "sawtooth"),
  draw: generateSoundData(600, 0.2, "sine"),
  notification: generateSoundData(1000, 0.15, "sine"),
  error: generateSoundData(300, 0.4, "sawtooth"),
};

export const useSound = (): SoundHook => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("soundVolume");
    return saved !== null ? parseFloat(saved) : 0.7;
  });

  const playSound = useCallback(
    (soundUrl: string, options: SoundOptions = {}) => {
      if (!isEnabled) return;

      try {
        const audio = new Audio(soundUrl);
        audio.volume = (options.volume ?? volume) * 0.7; // Cap at 70% to prevent ear damage
        audio.playbackRate = options.playbackRate ?? 1;
        audio.loop = options.loop ?? false;

        audio.play().catch((error) => {
          console.warn("Could not play sound:", error);
        });
      } catch (error) {
        console.warn("Sound playback error:", error);
      }
    },
    [isEnabled, volume]
  );

  const playMove = useCallback(() => {
    playSound(soundData.move);
  }, [playSound]);

  const playWin = useCallback(() => {
    playSound(soundData.win, { volume: 0.8 });
  }, [playSound]);

  const playLose = useCallback(() => {
    playSound(soundData.lose, { volume: 0.6 });
  }, [playSound]);

  const playDraw = useCallback(() => {
    playSound(soundData.draw, { volume: 0.5 });
  }, [playSound]);

  const playNotification = useCallback(() => {
    playSound(soundData.notification, { volume: 0.6 });
  }, [playSound]);

  const playError = useCallback(() => {
    playSound(soundData.error, { volume: 0.4 });
  }, [playSound]);

  const toggleSound = useCallback(() => {
    setIsEnabled((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem("soundEnabled", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem("soundVolume", clampedVolume.toString());
  }, []);

  return {
    playMove,
    playWin,
    playLose,
    playDraw,
    playNotification,
    playError,
    isEnabled,
    toggleSound,
    setVolume,
  };
};
