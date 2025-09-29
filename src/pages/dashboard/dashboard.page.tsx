import React, { useState, useEffect } from "react";
import { useAuth } from "../../state/authContext";
import { supabase } from "../../supabase/supabaseClient";
import { Link } from "react-router-dom";
import ThemeButton from "../../components/themeButton/themeButton.component";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import AvatarSelector from "../../components/AvatarSelector/AvatarSelector";
import { Profile } from "../../types/profile.type";
import { GameWithRoom } from "../../types/game.type";
import "./dashboard.styles.css";

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  averageGameTime: number;
}

interface RecentGame {
  id: string;
  opponent: string;
  result: "win" | "loss" | "draw";
  date: string;
  duration: number;
}

interface UserProfile extends Profile {
  // Additional dashboard-specific fields
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "games" | "profile">(
    "overview"
  );
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.userId)
        .single();

      if (profileError) throw profileError;

      setProfile({
        id: profileData.id,
        username: profileData.username || "Unknown User",
        email: profileData.email || "",
        avatar_url: profileData.avatar_url,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
      });

      // Fetch game statistics with room data
      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select(
          `
                state, 
                created_at,
                updated_at,
                rooms!inner(host_id, guest_id)
              `
        )
        .order("updated_at", { ascending: false })
        .limit(100); // Limit to avoid performance issues

      if (gamesError) throw gamesError;

      // Filter games where user was either host or guest
      const userGames = (gamesData || []).filter(
        (game: any) =>
          game.rooms?.[0]?.host_id === user.userId ||
          game.rooms?.[0]?.guest_id === user.userId
      );

      // Calculate statistics
      const stats = calculateGameStats(
        userGames as unknown as GameWithRoom[],
        user.userId
      );
      setStats(stats);

      // Get recent games
      const recentGames = getRecentGames(
        userGames as unknown as GameWithRoom[],
        user.userId
      );
      setRecentGames(recentGames);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGameStats = (
    games: GameWithRoom[],
    userId: string
  ): GameStats => {
    let totalGames = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalGameTime = 0;

    games.forEach((game) => {
      if (
        game.state?.gameStatus === "win" ||
        game.state?.gameStatus === "tie"
      ) {
        totalGames++;

        // Calculate actual game time using created_at and updated_at
        const gameTime =
          new Date(game.updated_at).getTime() -
          new Date(game.created_at).getTime();
        totalGameTime += gameTime;

        if (game.state?.gameStatus === "win") {
          if (
            game.state?.wholeGameWinner ===
            (game.state?.turn === userId ? "X" : "O")
          ) {
            wins++;
            tempStreak++;
            currentStreak = Math.max(currentStreak, tempStreak);
          } else {
            losses++;
            tempStreak = 0;
          }
        } else {
          draws++;
          tempStreak = 0;
        }
      }
    });

    longestStreak = currentStreak;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const averageGameTime =
      totalGames > 0 ? totalGameTime / totalGames / 1000 / 60 : 0; // in minutes

    return {
      totalGames,
      wins,
      losses,
      draws,
      winRate: Math.round(winRate * 10) / 10,
      currentStreak,
      longestStreak,
      averageGameTime: Math.round(averageGameTime * 10) / 10,
    };
  };

  const getRecentGames = (
    games: GameWithRoom[],
    userId: string
  ): RecentGame[] => {
    return games.slice(0, 10).map((game) => {
      const room = (game.rooms as any)?.[0];
      const isHost = room?.host_id === userId;
      const opponentId = isHost ? room?.guest_id : room?.host_id;
      const result =
        game.state?.gameStatus === "win"
          ? game.state?.wholeGameWinner === (isHost ? "X" : "O")
            ? "win"
            : "loss"
          : game.state?.gameStatus === "tie"
          ? "draw"
          : "loss";

      return {
        id: game.id,
        opponent: `Player ${opponentId?.slice(-4)}`, // Simplified for now
        result,
        date: new Date(game.updated_at).toLocaleDateString(),
        duration: Math.round(
          (new Date(game.updated_at).getTime() -
            new Date(game.created_at).getTime()) /
            60000
        ), // Actual duration in minutes
      };
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_url: newAvatarUrl,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Welcome back, {profile?.username}!</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/game-history" className="history-link">
            📚 Game History
          </Link>
          <Link to="/leaderboard" className="history-link">
            🏆 Leaderboard
          </Link>
          <Link to="/achievements" className="history-link">
            🏅 Achievements
          </Link>
          <ThemeButton />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`nav-tab ${activeTab === "games" ? "active" : ""}`}
          onClick={() => setActiveTab("games")}
        >
          🎮 Recent Games
        </button>
        <button
          className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === "overview" && stats && (
          <div className="overview-tab">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <h3>{stats.totalGames}</h3>
                  <p>Total Games</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <h3>{stats.wins}</h3>
                  <p>Wins</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>{stats.winRate}%</h3>
                  <p>Win Rate</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-content">
                  <h3>{stats.currentStreak}</h3>
                  <p>Current Streak</p>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="detailed-stats">
              <h2>Game Statistics</h2>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Games Played:</span>
                  <span className="stat-value">{stats.totalGames}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wins:</span>
                  <span className="stat-value">{stats.wins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Losses:</span>
                  <span className="stat-value">{stats.losses}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Draws:</span>
                  <span className="stat-value">{stats.draws}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Win Rate:</span>
                  <span className="stat-value">{stats.winRate}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Longest Streak:</span>
                  <span className="stat-value">{stats.longestStreak}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Game Time:</span>
                  <span className="stat-value">
                    {stats.averageGameTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "games" && (
          <div className="games-tab">
            <h2>Recent Games</h2>
            {recentGames.length > 0 ? (
              <div className="games-list">
                {recentGames.map((game) => (
                  <div key={game.id} className="game-item">
                    <div className="game-opponent">
                      <span className="game-label">vs</span>
                      <span className="game-opponent-name">
                        {game.opponent}
                      </span>
                    </div>
                    <div className={`game-result game-result-${game.result}`}>
                      {game.result === "win"
                        ? "🏆"
                        : game.result === "loss"
                        ? "❌"
                        : "🤝"}
                      <span>{game.result.toUpperCase()}</span>
                    </div>
                    <div className="game-details">
                      <span className="game-date">{game.date}</span>
                      <span className="game-duration">{game.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-games">
                <p>No games played yet. Start your first game!</p>
                <button className="start-game-btn">Create Room</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && profile && (
          <div className="profile-tab">
            <h2>Profile Information</h2>
            <div className="profile-info">
              <div className="profile-avatar">
                <img
                  src={profile.avatar_url || "/default-avatar.png"}
                  alt="Avatar"
                />
                <button
                  className="change-avatar-btn"
                  onClick={() => setShowAvatarSelector(true)}
                >
                  Change Avatar
                </button>
              </div>
              <div className="profile-details">
                <div className="profile-item">
                  <span className="profile-label">Username:</span>
                  <span className="profile-value">{profile.username}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{profile.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Member Since:</span>
                  <span className="profile-value">
                    {formatDate(profile.created_at)}
                  </span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Last Active:</span>
                  <span className="profile-value">
                    {formatDate(profile.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avatar Selector Modal */}
        {showAvatarSelector && user && (
          <AvatarSelector
            userId={user.userId}
            currentAvatar={profile?.avatar_url}
            onAvatarChange={handleAvatarChange}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
