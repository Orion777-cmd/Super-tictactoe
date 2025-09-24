import React, { useState, useEffect } from "react";
import {
  generateUserAvatar,
  getUserAvatarWithStyle,
  AvatarStyle,
} from "../../util/avatar.util";
import "./avatar.styles.css";

interface AvatarProps {
  userId?: string;
  avatarUrl?: string; // Direct avatar URL from database
  username?: string;
  size?: number;
  style?: AvatarStyle;
  className?: string;
  showUsername?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  userId,
  avatarUrl: propAvatarUrl,
  username,
  size = 64,
  style,
  className = "",
  showUsername = false,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateAvatar = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // If avatarUrl is provided directly, use it
        if (propAvatarUrl) {
          setAvatarUrl(propAvatarUrl);
          setIsLoading(false);
          return;
        }

        // Otherwise generate based on userId
        if (userId) {
          let url: string;
          if (style) {
            url = getUserAvatarWithStyle(userId, style);
          } else {
            url = generateUserAvatar(userId);
          }
          setAvatarUrl(url);
        }
      } catch (err) {
        console.error("Error generating avatar:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    generateAvatar();
  }, [userId, style, propAvatarUrl]);

  if (isLoading) {
    return (
      <div
        className={`avatar-container ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="avatar-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`avatar-container ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="avatar-error">
          <span className="error-icon">👤</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar-container ${className}`}>
      <img
        src={avatarUrl}
        alt={username || "User Avatar"}
        className="avatar-image"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
      {showUsername && username && (
        <span className="avatar-username">{username}</span>
      )}
    </div>
  );
};

export default Avatar;
