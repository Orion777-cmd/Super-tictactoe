import { Theme } from "../types/theme.type";

export const themes: Record<string, Theme> = {
  default: {
    id: "default",
    name: "Default",
    description:
      "Classic design with vibrant blue accents and clean aesthetics",
    colors: {
      primary: "#1a1a2e",
      secondary: "#16213e",
      surface: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      surfaceVariant: "rgba(255, 255, 255, 0.9)",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#FFFFFF",
      onSurfaceVariant: "#333",

      boardBackground: "rgba(0, 0, 0, 0.05)",
      boardBorder: "rgba(0, 0, 0, 0.1)",
      cellBackground: "black",
      cellBorder: "rgba(255, 255, 255, 0.1)",
      cellHover: "#667eea",

      playerX: "white",
      playerO: "white",
      playerXHover: "#667eea",
      playerOHover: "#764ba2",

      turnIndicator: "#6c757d",
      turnIndicatorActive: "#667eea",

      winningLine: "#667eea",
      winningLineGlow: "#764ba2",

      buttonPrimary: "#667eea",
      buttonSecondary: "#764ba2",
      buttonText: "#FFFFFF",
      buttonHover: "#5a6fd8",

      success: "#28a745",
      warning: "#ffc107",
      error: "#dc3545",
      info: "#17a2b8",

      avatarBackground: "rgba(255, 255, 255, 0.9)",
      avatarBorder: "#667eea",

      scoreBackground: "rgba(102, 126, 234, 0.1)",
      scoreText: "#667eea",
      scoreBorder: "rgba(102, 126, 234, 0.3)",
    },
  },

  "mystic-forest": {
    id: "mystic-forest",
    name: "Mystic Forest",
    description: "Enchanted forest with glowing branches and magical twilight",
    colors: {
      primary: "#733B73",
      secondary: "#F55654",
      surface: "#2D1B2D",
      surfaceVariant: "#4A2D4A",

      onPrimary: "#FFFFFF",
      onSecondary: "#FFFFFF",
      onSurface: "#E6D1B4",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#1A0F1A",
      boardBorder: "#733B73",
      cellBackground: "#2D1B2D",
      cellBorder: "#4A2D4A",
      cellHover: "#3D2B3D",

      playerX: "#F55654",
      playerO: "#FFD58C",
      playerXHover: "#FF6B6B",
      playerOHover: "#FFE44B",

      turnIndicator: "#427C80",
      turnIndicatorActive: "#F55654",

      winningLine: "#F55654",
      winningLineGlow: "#FF6B6B",

      buttonPrimary: "#F55654",
      buttonSecondary: "#427C80",
      buttonText: "#FFFFFF",
      buttonHover: "#FF6B6B",

      success: "#91B87C",
      warning: "#F99551",
      error: "#F55654",
      info: "#427C80",

      avatarBackground: "#2D1B2D",
      avatarBorder: "#733B73",

      scoreBackground: "#1A0F1A",
      scoreText: "#E6D1B4",
      scoreBorder: "#4A2D4A",
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
    name: "Sunset Mountains",
    description: "Dramatic mountain peaks with warm sunset colors",
    colors: {
      primary: "#DC2011",
      secondary: "#EFDFC5",
      surface: "#380F17",
      surfaceVariant: "#533946",

      onPrimary: "#FFFFFF",
      onSecondary: "#000000",
      onSurface: "#EFDFC5",
      onSurfaceVariant: "#F6F09C",

      boardBackground: "#1A0A0D",
      boardBorder: "#DC2011",
      cellBackground: "#380F17",
      cellBorder: "#533946",
      cellHover: "#4A1A23",

      playerX: "#DC2011",
      playerO: "#EFDFC5",
      playerXHover: "#FF2B1B",
      playerOHover: "#F5E6D3",

      turnIndicator: "#8F0B13",
      turnIndicatorActive: "#DC2011",

      winningLine: "#DC2011",
      winningLineGlow: "#FF2B1B",

      buttonPrimary: "#DC2011",
      buttonSecondary: "#8F0B13",
      buttonText: "#FFFFFF",
      buttonHover: "#FF2B1B",

      success: "#91B87C",
      warning: "#F99551",
      error: "#DC2011",
      info: "#8F0B13",

      avatarBackground: "#380F17",
      avatarBorder: "#DC2011",

      scoreBackground: "#1A0A0D",
      scoreText: "#EFDFC5",
      scoreBorder: "#533946",
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
