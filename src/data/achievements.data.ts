import { Achievement } from "../types/achievement.type";

export const achievements: Achievement[] = [
  // Win-based achievements
  {
    id: "first_win",
    name: "First Victory",
    description: "Win your first game",
    icon: "🏆",
    category: "wins",
    rarity: "common",
    points: 10,
    requirements: [
      {
        type: "total_wins",
        value: 1,
        description: "Win 1 game"
      }
    ]
  },
  {
    id: "win_streak_5",
    name: "Hot Streak",
    description: "Win 5 games in a row",
    icon: "🔥",
    category: "streaks",
    rarity: "uncommon",
    points: 50,
    requirements: [
      {
        type: "win_streak",
        value: 5,
        description: "Win 5 games in a row"
      }
    ]
  },
  {
    id: "win_streak_10",
    name: "Unstoppable",
    description: "Win 10 games in a row",
    icon: "⚡",
    category: "streaks",
    rarity: "rare",
    points: 100,
    requirements: [
      {
        type: "win_streak",
        value: 10,
        description: "Win 10 games in a row"
      }
    ]
  },
  {
    id: "win_100",
    name: "Centurion",
    description: "Win 100 games",
    icon: "💯",
    category: "wins",
    rarity: "epic",
    points: 500,
    requirements: [
      {
        type: "total_wins",
        value: 100,
        description: "Win 100 games"
      }
    ]
  },
  {
    id: "win_500",
    name: "Legend",
    description: "Win 500 games",
    icon: "👑",
    category: "wins",
    rarity: "legendary",
    points: 1000,
    requirements: [
      {
        type: "total_wins",
        value: 500,
        description: "Win 500 games"
      }
    ]
  },

  // Game count achievements
  {
    id: "play_10",
    name: "Getting Started",
    description: "Play 10 games",
    icon: "🎮",
    category: "games",
    rarity: "common",
    points: 5,
    requirements: [
      {
        type: "total_games",
        value: 10,
        description: "Play 10 games"
      }
    ]
  },
  {
    id: "play_50",
    name: "Regular Player",
    description: "Play 50 games",
    icon: "🎯",
    category: "games",
    rarity: "uncommon",
    points: 25,
    requirements: [
      {
        type: "total_games",
        value: 50,
        description: "Play 50 games"
      }
    ]
  },
  {
    id: "play_200",
    name: "Dedicated",
    description: "Play 200 games",
    icon: "🎲",
    category: "games",
    rarity: "rare",
    points: 100,
    requirements: [
      {
        type: "total_games",
        value: 200,
        description: "Play 200 games"
      }
    ]
  },

  // Special achievements
  {
    id: "perfect_game",
    name: "Perfect Game",
    description: "Win a game without losing any small boards",
    icon: "✨",
    category: "special",
    rarity: "rare",
    points: 75,
    requirements: [
      {
        type: "perfect_win",
        value: 1,
        description: "Win a game perfectly"
      }
    ]
  },
  {
    id: "comeback_king",
    name: "Comeback King",
    description: "Win a game after being behind 3-0",
    icon: "🔄",
    category: "special",
    rarity: "epic",
    points: 150,
    requirements: [
      {
        type: "comeback_win",
        value: 1,
        description: "Win after being down 3-0"
      }
    ]
  },
  {
    id: "quick_win",
    name: "Lightning Fast",
    description: "Win a game in under 5 minutes",
    icon: "⚡",
    category: "time",
    rarity: "uncommon",
    points: 30,
    requirements: [
      {
        type: "quick_win",
        value: 1,
        description: "Win a game in under 5 minutes"
      }
    ]
  },
  {
    id: "marathon",
    name: "Marathon Player",
    description: "Play a game that lasts over 30 minutes",
    icon: "🏃",
    category: "time",
    rarity: "rare",
    points: 50,
    requirements: [
      {
        type: "long_game",
        value: 1,
        description: "Play a game over 30 minutes"
      }
    ]
  },

  // Social achievements
  {
    id: "first_opponent",
    name: "Social Butterfly",
    description: "Play against 5 different opponents",
    icon: "👥",
    category: "social",
    rarity: "uncommon",
    points: 25,
    requirements: [
      {
        type: "unique_opponents",
        value: 5,
        description: "Play against 5 different players"
      }
    ]
  },
  {
    id: "chatty",
    name: "Chatty",
    description: "Send 100 messages in game chat",
    icon: "💬",
    category: "social",
    rarity: "common",
    points: 15,
    requirements: [
      {
        type: "messages_sent",
        value: 100,
        description: "Send 100 chat messages"
      }
    ]
  },

  // Win rate achievements
  {
    id: "high_winrate",
    name: "Skilled Player",
    description: "Maintain a 70% win rate over 20 games",
    icon: "🎯",
    category: "wins",
    rarity: "rare",
    points: 100,
    requirements: [
      {
        type: "win_rate",
        value: 70,
        description: "Maintain 70% win rate over 20 games"
      }
    ]
  },
  {
    id: "master",
    name: "Master",
    description: "Maintain an 80% win rate over 50 games",
    icon: "🧙",
    category: "wins",
    rarity: "epic",
    points: 200,
    requirements: [
      {
        type: "win_rate",
        value: 80,
        description: "Maintain 80% win rate over 50 games"
      }
    ]
  }
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(achievement => achievement.id === id);
};

export const getAchievementsByCategory = (category: string): Achievement[] => {
  return achievements.filter(achievement => achievement.category === category);
};

export const getAchievementsByRarity = (rarity: string): Achievement[] => {
  return achievements.filter(achievement => achievement.rarity === rarity);
};
