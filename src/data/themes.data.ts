import { Theme } from "../types/theme.type";

export const themes: Record<string, Theme> = {
  default: {
    id: "default",
    name: "Default",
    description: "Professional design with navy blue base and coral accents",
    colors: {
      primary: "#161E2F",
      secondary: "#242F49",
      surface: "linear-gradient(135deg, #161E2F 0%, #384358 100%)",
      surfaceVariant: "rgba(22, 30, 47, 0.9)",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#FFFFFF",
      onSurfaceVariant: "#161E2F",

      boardBackground: "rgba(0, 0, 0, 0.1)",
      boardBorder: "rgba(22, 30, 47, 0.3)",
      cellBackground: "#161E2F",
      cellBorder: "rgba(255, 165, 134, 0.2)",
      cellHover: "#242F49",

      playerX: "#B51A2B",
      playerO: "#FFA586",
      playerXHover: "#D91E3A",
      playerOHover: "#FFB8A0",

      turnIndicator: "#384358",
      turnIndicatorActive: "#B51A2B",

      winningLine: "#B51A2B",
      winningLineGlow: "#D91E3A",

      buttonPrimary: "#B51A2B",
      buttonSecondary: "#541A2E",
      buttonText: "#FFFFFF",
      buttonHover: "#D91E3A",

      success: "#28a745",
      warning: "#ffc107",
      error: "#dc3545",
      info: "#17a2b8",

      avatarBackground: "rgba(22, 30, 47, 0.9)",
      avatarBorder: "#B51A2B",

      scoreBackground: "rgba(181, 26, 43, 0.1)",
      scoreText: "#B51A2B",
      scoreBorder: "rgba(181, 26, 43, 0.3)",
    },
  },

  "mystic-forest": {
    id: "mystic-forest",
    name: "Blue Orchid",
    description: "Elegant blue orchid palette with ethereal glow",
    colors: {
      primary: "#020D2F",
      secondary: "#032C7D",
      surface: "linear-gradient(135deg, #020D2F 0%, #032C7D 100%)",
      surfaceVariant: "rgba(2, 13, 47, 0.9)",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#C4C7F2",
      onSurfaceVariant: "#C4C7F2",

      boardBackground: "rgba(0, 0, 0, 0.1)",
      boardBorder: "rgba(2, 13, 47, 0.3)",
      cellBackground: "#020D2F",
      cellBorder: "rgba(29, 151, 241, 0.2)",
      cellHover: "#032C7D",

      playerX: "#1D97F1",
      playerO: "#C4C7F2",
      playerXHover: "#4AA8F5",
      playerOHover: "#D4D7F5",

      turnIndicator: "#0841C9",
      turnIndicatorActive: "#1D97F1",

      winningLine: "#1D97F1",
      winningLineGlow: "#4AA8F5",

      buttonPrimary: "#1D97F1",
      buttonSecondary: "#0841C9",
      buttonText: "#FFFFFF",
      buttonHover: "#4AA8F5",

      success: "#28a745",
      warning: "#ffc107",
      error: "#1D97F1",
      info: "#0841C9",

      avatarBackground: "rgba(2, 13, 47, 0.9)",
      avatarBorder: "#1D97F1",

      scoreBackground: "rgba(29, 151, 241, 0.1)",
      scoreText: "#1D97F1",
      scoreBorder: "rgba(29, 151, 241, 0.3)",
    },
  },

  "cyberpunk-city": {
    id: "cyberpunk-city",
    name: "Cyberpunk City",
    description: "Neon-lit urban landscape with teal and yellow accents",
    colors: {
      primary: "#0B5868",
      secondary: "#FFE44B",
      surface: "#05262D",
      surfaceVariant: "#0F2C33",

      onPrimary: "#FFFFFF",
      onSecondary: "#000000",
      onSurface: "#A1E3D8",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#02161A",
      boardBorder: "#0B5868",
      cellBackground: "#05262D",
      cellBorder: "#0F2C33",
      cellHover: "#0A3A42",

      playerX: "#FFE44B",
      playerO: "#A1E3D8",
      playerXHover: "#FFD700",
      playerOHover: "#7DD3C8",

      turnIndicator: "#0B5868",
      turnIndicatorActive: "#FFE44B",

      winningLine: "#FFE44B",
      winningLineGlow: "#FFD700",

      buttonPrimary: "#FFE44B",
      buttonSecondary: "#0B5868",
      buttonText: "#000000",
      buttonHover: "#FFD700",

      success: "#A1E3D8",
      warning: "#F6F09C",
      error: "#FF6B6B",
      info: "#0B5868",

      avatarBackground: "#05262D",
      avatarBorder: "#0B5868",

      scoreBackground: "#02161A",
      scoreText: "#A1E3D8",
      scoreBorder: "#0F2C33",
    },
  },

  "sunset-mountains": {
    id: "sunset-mountains",
    name: "Elegant Royal",
    description: "Elegant royal palette with rich reds and deep navy",
    colors: {
      primary: "#102A46",
      secondary: "#6E1B37",
      surface: "linear-gradient(135deg, #1B0E1F 0%, #102A46 100%)",
      surfaceVariant: "rgba(16, 42, 70, 0.9)",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#F3BF99",
      onSurfaceVariant: "#F3BF99",

      boardBackground: "rgba(0, 0, 0, 0.1)",
      boardBorder: "rgba(16, 42, 70, 0.3)",
      cellBackground: "#102A46",
      cellBorder: "rgba(244, 42, 50, 0.2)",
      cellHover: "#6E1B37",

      playerX: "#F42A32",
      playerO: "#F3BF99",
      playerXHover: "#FF4A52",
      playerOHover: "#F5C9A8",

      turnIndicator: "#6E1B37",
      turnIndicatorActive: "#F42A32",

      winningLine: "#F42A32",
      winningLineGlow: "#FF4A52",

      buttonPrimary: "#F42A32",
      buttonSecondary: "#6E1B37",
      buttonText: "#FFFFFF",
      buttonHover: "#FF4A52",

      success: "#28a745",
      warning: "#ffc107",
      error: "#F42A32",
      info: "#6E1B37",

      avatarBackground: "rgba(16, 42, 70, 0.9)",
      avatarBorder: "#F42A32",

      scoreBackground: "rgba(244, 42, 50, 0.1)",
      scoreText: "#F42A32",
      scoreBorder: "rgba(244, 42, 50, 0.3)",
    },
  },

  "ocean-depths": {
    id: "ocean-depths",
    name: "Ocean Depths",
    description: "Deep ocean with teal and coral underwater colors",
    colors: {
      primary: "#0F2C33",
      secondary: "#2E9CA0",
      surface: "#113948",
      surfaceVariant: "#21616A",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#E6D1B4",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#0A1F26",
      boardBorder: "#0F2C33",
      cellBackground: "#113948",
      cellBorder: "#21616A",
      cellHover: "#1A4A55",

      playerX: "#2E9CA0",
      playerO: "#EFA00F",
      playerXHover: "#3FB3B7",
      playerOHover: "#FFB31A",

      turnIndicator: "#21616A",
      turnIndicatorActive: "#2E9CA0",

      winningLine: "#2E9CA0",
      winningLineGlow: "#3FB3B7",

      buttonPrimary: "#2E9CA0",
      buttonSecondary: "#0F2C33",
      buttonText: "#FFFFFF",
      buttonHover: "#3FB3B7",

      success: "#2E9CA0",
      warning: "#EFA00F",
      error: "#F55654",
      info: "#21616A",

      avatarBackground: "#113948",
      avatarBorder: "#0F2C33",

      scoreBackground: "#0A1F26",
      scoreText: "#E6D1B4",
      scoreBorder: "#21616A",
    },
  },

  "fire-ember": {
    id: "fire-ember",
    name: "Fire Ember",
    description: "Warm fire colors with golden and orange tones",
    colors: {
      primary: "#8F5923",
      secondary: "#C59A63",
      surface: "#5B2F0B",
      surfaceVariant: "#782B01",

      onPrimary: "#FFFFFF",
      onSecondary: "#000000",
      onSurface: "#FBDAF",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#2D1A0A",
      boardBorder: "#8F5923",
      cellBackground: "#5B2F0B",
      cellBorder: "#782B01",
      cellHover: "#6B3F1B",

      playerX: "#ED8017",
      playerO: "#FBDAF",
      playerXHover: "#FF8C1A",
      playerOHover: "#F5E6D3",

      turnIndicator: "#8F5923",
      turnIndicatorActive: "#ED8017",

      winningLine: "#ED8017",
      winningLineGlow: "#FF8C1A",

      buttonPrimary: "#ED8017",
      buttonSecondary: "#8F5923",
      buttonText: "#FFFFFF",
      buttonHover: "#FF8C1A",

      success: "#C59A63",
      warning: "#ED8017",
      error: "#F55654",
      info: "#8F5923",

      avatarBackground: "#5B2F0B",
      avatarBorder: "#8F5923",

      scoreBackground: "#2D1A0A",
      scoreText: "#FBDAF",
      scoreBorder: "#782B01",
    },
  },

  "night-sky": {
    id: "night-sky",
    name: "Night Sky",
    description: "Starry night with deep blues and celestial colors",
    colors: {
      primary: "#132C47",
      secondary: "#FBAE54",
      surface: "#294C63",
      surfaceVariant: "#4C4F54",

      onPrimary: "#FFFFFF",
      onSecondary: "#000000",
      onSurface: "#D4ECE9",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#0A1A2E",
      boardBorder: "#132C47",
      cellBackground: "#294C63",
      cellBorder: "#4C4F54",
      cellHover: "#3A5A73",

      playerX: "#FBAE54",
      playerO: "#D4ECE9",
      playerXHover: "#FFC066",
      playerOHover: "#E8F5F3",

      turnIndicator: "#4C4F54",
      turnIndicatorActive: "#FBAE54",

      winningLine: "#FBAE54",
      winningLineGlow: "#FFC066",

      buttonPrimary: "#FBAE54",
      buttonSecondary: "#132C47",
      buttonText: "#000000",
      buttonHover: "#FFC066",

      success: "#78AEAD",
      warning: "#FBAE54",
      error: "#F55654",
      info: "#132C47",

      avatarBackground: "#294C63",
      avatarBorder: "#132C47",

      scoreBackground: "#0A1A2E",
      scoreText: "#D4ECE9",
      scoreBorder: "#4C4F54",
    },
  },
};

export const defaultTheme: Theme = themes["default"];
