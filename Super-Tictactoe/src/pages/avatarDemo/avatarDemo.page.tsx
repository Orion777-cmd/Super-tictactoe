import React, { useState } from "react";
import Avatar from "../../components/avatar/avatar.component";
import AvatarPreview from "../../components/avatarPreview/avatarPreview.component";
import { generateAvatarOptions } from "../../util/avatar.util";
import "./avatarDemo.styles.css";

const AvatarDemo: React.FC = () => {
  const [userId] = useState("demo-user-123");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [avatarOptions] = useState(() => generateAvatarOptions(userId, 8));

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  return (
    <div className="avatar-demo-container">
      <div className="demo-header">
        <h1>🎲 DiceBear Avatar Demo</h1>
        <p>Random avatar generation for Super Tic-Tac-Toe</p>
      </div>

      <div className="demo-content">
        <div className="demo-section">
          <h2>Avatar Preview Component</h2>
          <AvatarPreview
            userId={userId}
            onAvatarSelect={handleAvatarSelect}
            className="demo-preview"
          />
        </div>

        <div className="demo-section">
          <h2>Random Avatar Options</h2>
          <div className="avatar-grid">
            {avatarOptions.map((avatarUrl, index) => (
              <div key={index} className="avatar-option">
                <img
                  src={avatarUrl}
                  alt={`Avatar option ${index + 1}`}
                  className="option-image"
                />
                <button
                  className="select-btn"
                  onClick={() => setSelectedAvatar(avatarUrl)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-section">
          <h2>Selected Avatar</h2>
          <div className="selected-avatar">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Selected avatar"
                className="selected-image"
              />
            ) : (
              <div className="placeholder">
                <p>Select an avatar above</p>
              </div>
            )}
          </div>
        </div>

        <div className="demo-section">
          <h2>Game Integration Example</h2>
          <div className="game-example">
            <div className="player-card">
              <Avatar userId={userId} size={50} className="game-avatar" />
              <div className="player-info">
                <h3>Player 1</h3>
                <p>Score: 0</p>
              </div>
            </div>
            <div className="vs">VS</div>
            <div className="player-card">
              <Avatar userId="opponent-456" size={50} className="game-avatar" />
              <div className="player-info">
                <h3>Player 2</h3>
                <p>Score: 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;
