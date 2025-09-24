import React, { useState, useEffect } from "react";
import Avatar from "../avatar/avatar.component";
import {
  getUserAvatarWithStyle,
  AvatarStyle,
  AVATAR_STYLES,
} from "../../util/avatar.util";
import "./avatarPreview.styles.css";

interface AvatarPreviewProps {
  userId: string;
  onAvatarSelect?: (avatarUrl: string) => void;
  className?: string;
}

const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  userId,
  onAvatarSelect,
  className = "",
}) => {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>("avataaars");

  useEffect(() => {
    if (userId) {
      const avatarUrl = getUserAvatarWithStyle(userId, selectedStyle);
      onAvatarSelect?.(avatarUrl);
    }
  }, [userId, selectedStyle, onAvatarSelect]);

  const handleStyleChange = (style: AvatarStyle) => {
    setSelectedStyle(style);
  };

  const handleRandomize = () => {
    const randomStyle =
      AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    setSelectedStyle(randomStyle);
  };

  return (
    <div className={`avatar-preview-container ${className}`}>
      <div className="avatar-preview-header">
        <h3>Choose Your Avatar</h3>
        <button
          className="randomize-btn"
          onClick={handleRandomize}
          type="button"
        >
          🎲 Randomize
        </button>
      </div>

      <div className="avatar-preview-display">
        <Avatar
          userId={userId}
          size={80}
          style={selectedStyle}
          className="preview-avatar"
        />
      </div>

      <div className="avatar-style-selector">
        <p className="style-label">Avatar Style:</p>
        <div className="style-options">
          {AVATAR_STYLES.map((style) => (
            <button
              key={style}
              className={`style-option ${
                selectedStyle === style ? "selected" : ""
              }`}
              onClick={() => handleStyleChange(style)}
              type="button"
            >
              {style.charAt(0).toUpperCase() + style.slice(1).replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarPreview;
