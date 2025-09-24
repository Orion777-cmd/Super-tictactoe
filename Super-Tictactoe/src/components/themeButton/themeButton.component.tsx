import React, { useState } from "react";
import ThemeSelector from "../themeSelector/themeSelector.component";
import "./themeButton.styles.css";

const ThemeButton: React.FC = () => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleThemeButtonClick = () => {
    setIsSelectorOpen(true);
  };

  const handleCloseSelector = () => {
    setIsSelectorOpen(false);
  };

  return (
    <>
      <button
        className="theme-button"
        onClick={handleThemeButtonClick}
        title="Change Theme"
      >
        <div className="theme-button-icon">🎨</div>
      </button>

      <ThemeSelector isOpen={isSelectorOpen} onClose={handleCloseSelector} />
    </>
  );
};

export default ThemeButton;
