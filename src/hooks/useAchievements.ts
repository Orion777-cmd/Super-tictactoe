import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../state/authContext";
import { useNotificationContext } from "../context/NotificationContext";
import {
  UserAchievement,
  AchievementProgress,
} from "../types/achievement.type";
import { achievements } from "../data/achievements.data";

export const useAchievements = () => {
  const { user } = useAuth();
  const notifications = useNotificationContext();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    []
  );
  const [achievementProgress, setAchievementProgress] = useState<
    AchievementProgress[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user achievements
  const fetchUserAchievements = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", user.userId)
        .order("unlocked_at", { ascending: false });

      if (fetchError) throw fetchError;

      setUserAchievements(data || []);
    } catch (err) {
      console.error("Error fetching user achievements:", err);
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Calculate achievement progress
  const calculateProgress = useCallback(async () => {
    if (!user) return;

    try {
      const progress: AchievementProgress[] = [];

      for (const achievement of achievements) {
        let currentProgress = 0;
        let maxProgress = 0;
        let isUnlocked = false;
        let unlockedAt: Date | undefined;

        // Check if already unlocked
        const userAchievement = userAchievements.find(
          (ua) => ua.achievementId === achievement.id
        );
        if (userAchievement && userAchievement.isUnlocked) {
          isUnlocked = true;
          unlockedAt = new Date(userAchievement.unlockedAt);
          currentProgress = achievement.requirements[0].value;
          maxProgress = achievement.requirements[0].value;
        } else {
          // Calculate current progress based on achievement type
          const requirement = achievement.requirements[0];
          maxProgress = requirement.value;

          switch (requirement.type) {
            case "total_wins":
              const { data: winsData } = await supabase
                .from("games")
                .select("state")
                .eq("rooms.host_id", user.userId)
                .or(`rooms.guest_id.eq.${user.userId}`)
                .eq("state.gameStatus", "win");

              if (winsData) {
                const userWins = winsData.filter((game) => {
                  const isHost = game.state?.host_id === user.userId;
                  const isGuest = game.state?.guest_id === user.userId;
                  const winner = game.state?.wholeGameWinner;
                  return (
                    (isHost && winner === "X") || (isGuest && winner === "O")
                  );
                }).length;
                currentProgress = userWins;
              }
              break;

            case "total_games":
              const { data: gamesData } = await supabase
                .from("games")
                .select("id")
                .eq("rooms.host_id", user.userId)
                .or(`rooms.guest_id.eq.${user.userId}`);

              currentProgress = gamesData?.length || 0;
              break;

            case "win_streak":
              // This would require more complex logic to calculate current streak
              // For now, we'll use a simplified approach
              currentProgress = 0;
              break;

            case "win_rate":
              // Calculate win rate over recent games
              const { data: recentGames } = await supabase
                .from("games")
                .select("state")
                .eq("rooms.host_id", user.userId)
                .or(`rooms.guest_id.eq.${user.userId}`)
                .order("created_at", { ascending: false })
                .limit(20);

              if (recentGames && recentGames.length >= 20) {
                const wins = recentGames.filter((game) => {
                  const isHost = game.state?.host_id === user.userId;
                  const isGuest = game.state?.guest_id === user.userId;
                  const winner = game.state?.wholeGameWinner;
                  return (
                    (isHost && winner === "X") || (isGuest && winner === "O")
                  );
                }).length;
                const winRate = (wins / recentGames.length) * 100;
                currentProgress = Math.floor(winRate);
              }
              break;

            default:
              currentProgress = 0;
          }

          progress.push({
            achievementId: achievement.id,
            currentProgress: Math.min(currentProgress, maxProgress),
            maxProgress,
            isUnlocked: currentProgress >= maxProgress,
            unlockedAt: isUnlocked ? unlockedAt : undefined,
          });
        }
      }

      setAchievementProgress(progress);
    } catch (err) {
      console.error("Error calculating achievement progress:", err);
    }
  }, [user, userAchievements]);

  // Check and unlock achievements
  const checkAchievements = useCallback(async () => {
    if (!user) return;

    try {
      for (const progress of achievementProgress) {
        if (
          !progress.isUnlocked &&
          progress.currentProgress >= progress.maxProgress
        ) {
          // Unlock achievement
          const { error: unlockError } = await supabase
            .from("user_achievements")
            .upsert({
              user_id: user.userId,
              achievement_id: progress.achievementId,
              unlocked_at: new Date().toISOString(),
              progress: progress.maxProgress,
              is_unlocked: true,
            });

          if (unlockError) {
            console.error("Error unlocking achievement:", unlockError);
            continue;
          }

          // Show notification
          const achievement = achievements.find(
            (a) => a.id === progress.achievementId
          );
          if (achievement) {
            notifications.showGameNotification(
              "success",
              "Achievement Unlocked!",
              `${achievement.icon} ${achievement.name}`,
              { duration: 5000 }
            );
          }

          // Refresh achievements
          await fetchUserAchievements();
        }
      }
    } catch (err) {
      console.error("Error checking achievements:", err);
    }
  }, [user, achievementProgress, notifications, fetchUserAchievements]);

  // Initialize achievements
  useEffect(() => {
    fetchUserAchievements();
  }, [fetchUserAchievements]);

  // Calculate progress when achievements are loaded
  useEffect(() => {
    if (userAchievements.length >= 0) {
      calculateProgress();
    }
  }, [userAchievements, calculateProgress]);

  // Check for new achievements when progress changes
  useEffect(() => {
    if (achievementProgress.length > 0) {
      checkAchievements();
    }
  }, [achievementProgress, checkAchievements]);

  // Get unlocked achievements
  const getUnlockedAchievements = useCallback(() => {
    return userAchievements.filter((ua) => ua.isUnlocked);
  }, [userAchievements]);

  // Get achievement progress by ID
  const getAchievementProgress = useCallback(
    (achievementId: string) => {
      return achievementProgress.find(
        (ap) => ap.achievementId === achievementId
      );
    },
    [achievementProgress]
  );

  // Get achievements by category
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievements.filter((a) => a.category === category);
  }, []);

  // Get total points earned
  const getTotalPoints = useCallback(() => {
    return getUnlockedAchievements().reduce((total, userAchievement) => {
      const achievement = achievements.find(
        (a) => a.id === userAchievement.achievementId
      );
      return total + (achievement?.points || 0);
    }, 0);
  }, [getUnlockedAchievements]);

  return {
    achievements,
    userAchievements,
    achievementProgress,
    loading,
    error,
    getUnlockedAchievements,
    getAchievementProgress,
    getAchievementsByCategory,
    getTotalPoints,
    refreshAchievements: fetchUserAchievements,
  };
};
