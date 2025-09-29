import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./RematchButton.styles.css";

interface RematchButtonProps {
  onRematch: () => void;
  disabled?: boolean;
  className?: string;
}

const RematchButton: React.FC<RematchButtonProps> = ({
  onRematch,
  disabled = false,
  className = "",
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  // const navigate = useNavigate();

  const handleRematch = async () => {
    if (disabled || isRequesting) return;

    setIsRequesting(true);

    try {
      // Call the rematch handler
      await onRematch();

      // Small delay for visual feedback
      setTimeout(() => {
        setIsRequesting(false);
      }, 1000);
    } catch (error) {
      console.error("Rematch error:", error);
      setIsRequesting(false);
    }
  };

  return (
    <button
      className={`rematch-button ${disabled ? "disabled" : ""} ${
        isRequesting ? "requesting" : ""
      } ${className}`}
      onClick={handleRematch}
      disabled={disabled || isRequesting}
      title={disabled ? "Rematch not available" : "Request a rematch"}
    >
      <span className="rematch-icon">{isRequesting ? "⏳" : "🔄"}</span>
      <span className="rematch-text">
        {isRequesting ? "Requesting..." : "Rematch"}
      </span>
    </button>
  );
};

export default RematchButton;
