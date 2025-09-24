import React, { useState } from "react";
import { useTheme } from "../../context/themeContext";
import { Theme } from "../../types/theme.type";
import "./themeSelector.styles.css";

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [, setPreviewTheme] = useState<Theme | null>(null);

  const handleThemeClick = (theme: Theme) => {
    setTheme(theme.id);
    onClose();
  };

  const handleThemeHover = (theme: Theme) => {
    setPreviewTheme(theme);
  };

  const handleMouseLeave = () => {
    setPreviewTheme(null);
  };

  if (!isOpen) return null;

  return (
    <div className="theme-selector-overlay" onClick={onClose}>
      <div
        className="theme-selector-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-selector-header">
          <h2>Choose Your Theme</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="theme-selector-content">
          <div className="theme-grid">
            {availableThemes.map((theme) => (
              <div
                key={theme.id}
                className={`theme-card ${
                  currentTheme.id === theme.id ? "active" : ""
                }`}
                onClick={() => handleThemeClick(theme)}
                onMouseEnter={() => handleThemeHover(theme)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="theme-preview">
                  <div
                    className="theme-preview-background"
                    style={{ backgroundColor: theme.colors.surface }}
                  >
                    <div
                      className="theme-preview-board"
                      style={{
                        backgroundColor: theme.colors.boardBackground,
                        borderColor: theme.colors.boardBorder,
                      }}
                    >
                      <div
                        className="theme-preview-cell"
                        style={{
                          backgroundColor: theme.colors.cellBackground,
                          borderColor: theme.colors.cellBorder,
                        }}
                      >
                        <div
                          className="theme-preview-x"
                          style={{ color: theme.colors.playerX }}
                        >
                          X
                        </div>
                      </div>
                      <div
                        className="theme-preview-cell"
                        style={{
                          backgroundColor: theme.colors.cellBackground,
                          borderColor: theme.colors.cellBorder,
                        }}
                      >
                        <div
                          className="theme-preview-o"
                          style={{ color: theme.colors.playerO }}
                        >
                          O
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="theme-info">
                  <h3 className="theme-name">{theme.name}</h3>
                  <p className="theme-description">{theme.description}</p>

                  <div className="theme-colors">
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: theme.colors.playerX }}
                      title="Player X"
                    />
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: theme.colors.playerO }}
                      title="Player O"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
