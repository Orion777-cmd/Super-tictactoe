export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Background colors
    primary: string;
    secondary: string;
    surface: string;
    surfaceVariant: string;

    // Text colors
    onPrimary: string;
    onSecondary: string;
    onSurface: string;
    onSurfaceVariant: string;

    // Game board colors
    boardBackground: string;
    boardBorder: string;
    cellBackground: string;
    cellBorder: string;
    cellHover: string;

    // Player colors
    playerX: string;
    playerO: string;
    playerXHover: string;
    playerOHover: string;

    // Turn indicator
    turnIndicator: string;
    turnIndicatorActive: string;

    // Winning line
    winningLine: string;
    winningLineGlow: string;

    // Buttons
    buttonPrimary: string;
    buttonSecondary: string;
    buttonText: string;
    buttonHover: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Avatar colors
    avatarBackground: string;
    avatarBorder: string;

    // Score colors
    scoreBackground: string;
    scoreText: string;
    scoreBorder: string;
  };
}

export type ThemeId =
  | "default"
  | "mystic-forest"
  | "cyberpunk-city"
  | "sunset-mountains"
  | "ocean-depths"
  | "fire-ember"
  | "night-sky";
