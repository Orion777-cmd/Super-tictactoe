import React from "react";
import { useSound } from "../../hooks/useSound";
import "./SoundSettings.styles.css";

interface SoundSettingsProps {
  className?: string;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ className = "" }) => {
  const { isEnabled, toggleSound, setVolume, volume, playNotification } =
    useSound();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleTestSound = () => {
    playNotification();
  };

  return (
    <div className={`sound-settings ${className}`}>
      <div className="sound-controls">
        <div className="sound-toggle">
          <label className="sound-label">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={toggleSound}
              className="sound-checkbox"
            />
            <span className="sound-toggle-text">
              {isEnabled ? "🔊" : "🔇"} Sound Effects
            </span>
          </label>
        </div>

        {isEnabled && (
          <div className="volume-control">
            <label className="volume-label">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
            <button
              onClick={handleTestSound}
              className="test-sound-btn"
              title="Test sound"
            >
              🔊
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundSettings;
