// Avatar utility for generating random DiceBear avatars using public API
export type AvatarStyle =
  | "avataaars"
  | "bottts"
  | "identicon"
  | "initials"
  | "micah"
  | "pixel-art"
  | "personas"
  | "open-peeps";

export interface AvatarConfig {
  style: AvatarStyle;
  seed: string;
  size?: number;
  backgroundColor?: string;
}

// Available avatar styles with their configurations
export const AVATAR_STYLES: AvatarStyle[] = [
  "avataaars",
  "bottts",
  "identicon",
  "initials",
  "micah",
  "pixel-art",
  "personas",
  "open-peeps",
];

// Generate a deterministic avatar configuration based on user ID
export const generateRandomAvatar = (userId: string): AvatarConfig => {
  // Use a simple hash function to get consistent values from userId
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const userHash = hash(userId);
  const styleIndex = userHash % AVATAR_STYLES.length;
  const colorIndex = userHash % 20; // We have 20 colors

  return {
    style: AVATAR_STYLES[styleIndex],
    seed: userId, // Use userId as seed for consistency
    size: 64,
    backgroundColor: getColorByIndex(colorIndex),
  };
};

// Generate avatar URL using DiceBear public API
export const getAvatarUrl = (config: AvatarConfig): string => {
  const { style, seed, size = 64, backgroundColor } = config;

  // Use DiceBear's public API (no API key required)
  const baseUrl = "https://api.dicebear.com/7.x";
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
    backgroundColor: backgroundColor || "transparent",
    format: "svg",
  });

  return `${baseUrl}/${style}/svg?${params.toString()}`;
};

// Get a random background color
const getRandomBackgroundColor = (): string => {
  const colors = [
    "ff6b6b",
    "4ecdc4",
    "45b7d1",
    "96ceb4",
    "feca57",
    "ff9ff3",
    "54a0ff",
    "5f27cd",
    "00d2d3",
    "ff9f43",
    "a55eea",
    "26de81",
    "fd79a8",
    "fdcb6e",
    "6c5ce7",
    "fd79a8",
    "fdcb6e",
    "6c5ce7",
    "a29bfe",
    "fd79a8",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

// Get color by index for deterministic selection
const getColorByIndex = (index: number): string => {
  const colors = [
    "ff6b6b",
    "4ecdc4",
    "45b7d1",
    "96ceb4",
    "feca57",
    "ff9ff3",
    "54a0ff",
    "5f27cd",
    "00d2d3",
    "ff9f43",
    "a55eea",
    "26de81",
    "fd79a8",
    "fdcb6e",
    "6c5ce7",
    "fd79a8",
    "fdcb6e",
    "6c5ce7",
    "a29bfe",
    "fd79a8",
  ];

  return colors[index % colors.length];
};

// Generate avatar for a user
export const generateUserAvatar = (userId: string): string => {
  const config = generateRandomAvatar(userId);
  return getAvatarUrl(config);
};

// Get avatar with specific style
export const getUserAvatarWithStyle = (
  userId: string,
  style: AvatarStyle
): string => {
  const config: AvatarConfig = {
    style,
    seed: `${userId}-${style}`,
    size: 64,
    backgroundColor: getRandomBackgroundColor(),
  };

  return getAvatarUrl(config);
};

// Generate multiple avatar options for user selection
export const generateAvatarOptions = (
  userId: string,
  count: number = 6
): string[] => {
  const options: string[] = [];
  const usedStyles = new Set<AvatarStyle>();

  while (options.length < count && usedStyles.size < AVATAR_STYLES.length) {
    const randomStyle =
      AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];

    if (!usedStyles.has(randomStyle)) {
      usedStyles.add(randomStyle);
      const avatarUrl = getUserAvatarWithStyle(userId, randomStyle);
      options.push(avatarUrl);
    }
  }

  return options;
};
