import React, { useState } from "react";
import { useAchievements } from "../../hooks/useAchievements";
import { Achievement, AchievementCategory, AchievementRarity } from "../../types/achievement.type";
import ThemeButton from "../../components/themeButton/themeButton.component";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./achievements.styles.css";

const AchievementsPage: React.FC = () => {
  const {
    achievements,
    userAchievements,
    achievementProgress,
    loading,
    error,
    getUnlockedAchievements,
    getAchievementProgress,
    getAchievementsByCategory,
    getTotalPoints,
  } = useAchievements();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | "all">("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const categories: AchievementCategory[] = ["wins", "streaks", "games", "special", "social", "time"];
  const rarities: AchievementRarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case "common": return "#6b7280";
      case "uncommon": return "#10b981";
      case "rare": return "#3b82f6";
      case "epic": return "#8b5cf6";
      case "legendary": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getRarityName = (rarity: AchievementRarity) => {
    switch (rarity) {
      case "common": return "Common";
      case "uncommon": return "Uncommon";
      case "rare": return "Rare";
      case "epic": return "Epic";
      case "legendary": return "Legendary";
      default: return "Unknown";
    }
  };

  const getCategoryName = (category: AchievementCategory) => {
    switch (category) {
      case "wins": return "Wins";
      case "streaks": return "Streaks";
      case "games": return "Games";
      case "special": return "Special";
      case "social": return "Social";
      case "time": return "Time";
      default: return "Unknown";
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== "all" && achievement.category !== selectedCategory) return false;
    if (selectedRarity !== "all" && achievement.rarity !== selectedRarity) return false;
    if (showUnlockedOnly) {
      const isUnlocked = userAchievements.some(ua => 
        ua.achievementId === achievement.id && ua.isUnlocked
      );
      return isUnlocked;
    }
    return true;
  });

  const unlockedAchievements = getUnlockedAchievements();
  const totalPoints = getTotalPoints();

  if (loading) {
    return (
      <div className="achievements-loading">
        <LoadingSpinner size="large" message="Loading achievements..." />
      </div>
    );
  }

  return (
    <div className="achievements">
      {/* Header */}
      <div className="achievements-header">
        <div className="header-content">
          <h1>🏆 Achievements</h1>
          <p>Unlock badges and earn points by playing!</p>
        </div>
        <div className="header-actions">
          <ThemeButton />
        </div>
      </div>

      {/* Stats */}
      <div className="achievements-stats">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>{unlockedAchievements.length}</h3>
            <p>Unlocked</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{achievements.length}</h3>
            <p>Total Available</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="achievements-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | "all")}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Rarity:</label>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value as AchievementRarity | "all")}
            className="filter-select"
          >
            <option value="all">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {getRarityName(rarity)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
            />
            Show unlocked only
          </label>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {error && (
          <div className="error-message">
            <p>Error loading achievements: {error}</p>
          </div>
        )}

        {filteredAchievements.length === 0 ? (
          <div className="no-achievements">
            <div className="no-achievements-icon">🎯</div>
            <h3>No achievements found</h3>
            <p>Try adjusting your filters or play more games to unlock achievements!</p>
          </div>
        ) : (
          filteredAchievements.map(achievement => {
            const progress = getAchievementProgress(achievement.id);
            const isUnlocked = progress?.isUnlocked || false;
            const progressPercentage = progress 
              ? (progress.currentProgress / progress.maxProgress) * 100 
              : 0;

            return (
              <div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? "unlocked" : "locked"}`}
              >
                <div className="achievement-icon">
                  {achievement.icon}
                </div>
                
                <div className="achievement-content">
                  <div className="achievement-header">
                    <h3 className="achievement-name">{achievement.name}</h3>
                    <div className="achievement-rarity" style={{ color: getRarityColor(achievement.rarity) }}>
                      {getRarityName(achievement.rarity)}
                    </div>
                  </div>
                  
                  <p className="achievement-description">{achievement.description}</p>
                  
                  <div className="achievement-progress">
                    {isUnlocked ? (
                      <div className="progress-unlocked">
                        <span className="unlocked-text">✅ Unlocked!</span>
                        {progress?.unlockedAt && (
                          <span className="unlocked-date">
                            {new Date(progress.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="progress-bar-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="progress-text">
                          {progress?.currentProgress || 0} / {progress?.maxProgress || achievement.requirements[0].value}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="achievement-footer">
                    <div className="achievement-category">
                      {getCategoryName(achievement.category)}
                    </div>
                    <div className="achievement-points">
                      {achievement.points} pts
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
