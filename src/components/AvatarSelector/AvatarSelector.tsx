import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";
import {
  generateAvatarOptions,
  AVATAR_STYLES,
  // getUserAvatarWithStyle,
} from "../../util/avatar.util";
import "./AvatarSelector.styles.css";

interface AvatarSelectorProps {
  userId: string;
  currentAvatar?: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  userId,
  currentAvatar,
  onAvatarChange,
  onClose,
}) => {
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("avataaars");
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatar || ""
  );

  // Generate avatar options when component mounts or style changes
  useEffect(() => {
    const generateOptions = () => {
      const options = generateAvatarOptions(userId, 6);
      setAvatarOptions(options);
    };

    generateOptions();
  }, [userId]);

  // Generate new options when style changes
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    const newOptions = generateAvatarOptions(userId, 6);
    setAvatarOptions(newOptions);
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: selectedAvatar })
        .eq("id", userId);

      if (error) throw error;

      onAvatarChange(selectedAvatar);
      onClose();
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewOptions = () => {
    const newOptions = generateAvatarOptions(userId, 6);
    setAvatarOptions(newOptions);
  };

  return (
    <div className="avatar-selector-overlay">
      <div className="avatar-selector-modal">
        <div className="avatar-selector-header">
          <h3>Choose Your Avatar</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="avatar-selector-content">
          <div className="style-selector">
            <label>Avatar Style:</label>
            <select
              value={selectedStyle}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="style-dropdown"
            >
              {AVATAR_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="avatar-grid">
            {avatarOptions.map((avatarUrl, index) => (
              <div
                key={index}
                className={`avatar-option ${
                  selectedAvatar === avatarUrl ? "selected" : ""
                }`}
                onClick={() => handleAvatarSelect(avatarUrl)}
              >
                <img src={avatarUrl} alt={`Avatar option ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="avatar-actions">
            <button
              className="generate-new-btn"
              onClick={generateNewOptions}
              disabled={loading}
            >
              Generate New Options
            </button>
            <button
              className="save-avatar-btn"
              onClick={handleSaveAvatar}
              disabled={!selectedAvatar || loading}
            >
              {loading ? "Saving..." : "Save Avatar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
