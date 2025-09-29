import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuth } from "../../state/authContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ThemeButton from "../../components/themeButton/themeButton.component";
import "./leaderboard.styles.css";

interface PlayerStats {
  userId: string;
  username: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  averageGameTime: number;
  totalPlayTime: number;
  rank: number;
  points: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<
    "all" | "week" | "month" | "year"
  >("all");
  const [sortBy, setSortBy] = useState<
    "winRate" | "wins" | "games" | "streak" | "points"
  >("winRate");
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter, sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date filter
      const now = new Date();
      let startDate: Date | null = null;

      switch (timeFilter) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      // Fetch all games with the time filter
      let query = supabase.from("games").select(
        `
          id,
          state,
          updated_at,
          rooms!inner(host_id, guest_id)
        `
      );

      if (startDate) {
        query = query.gte("updated_at", startDate.toISOString());
      }

      const { data: gamesData, error: gamesError } = await query;

      if (gamesError) throw gamesError;

      // Process the data to calculate player statistics
      const playerStatsMap = new Map<string, PlayerStats>();

      // Filter for completed games only
      const completedGames = (gamesData || []).filter(
        (game) =>
          game.state?.gameStatus === "win" || game.state?.gameStatus === "draw"
      );

      // Get unique user IDs
      const userIds = new Set<string>();
      completedGames.forEach((game) => {
        if (game.rooms && game.rooms.length > 0) {
          userIds.add(game.rooms[0].host_id);
          if (game.rooms[0].guest_id) {
            userIds.add(game.rooms[0].guest_id);
          }
        }
      });

      // Fetch usernames for all users
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", Array.from(userIds));

      const usernameMap = new Map<string, string>();
      (profilesData || []).forEach((profile) => {
        usernameMap.set(profile.id, profile.username);
      });

      completedGames.forEach((game) => {
        const hostId = game.rooms?.[0]?.host_id;
        const guestId = game.rooms?.[0]?.guest_id;
        const hostUsername =
          usernameMap.get(hostId) || `User ${hostId.slice(-4)}`;
        const guestUsername =
          usernameMap.get(guestId) || `User ${guestId.slice(-4)}`;

        // Initialize player stats if not exists
        if (!playerStatsMap.has(hostId)) {
          playerStatsMap.set(hostId, {
            userId: hostId,
            username: hostUsername,
            totalGames: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageGameTime: 0,
            totalPlayTime: 0,
            rank: 0,
            points: 0,
          });
        }

        if (!playerStatsMap.has(guestId)) {
          playerStatsMap.set(guestId, {
            userId: guestId,
            username: guestUsername,
            totalGames: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageGameTime: 0,
            totalPlayTime: 0,
            rank: 0,
            points: 0,
          });
        }

        const hostStats = playerStatsMap.get(hostId)!;
        const guestStats = playerStatsMap.get(guestId)!;

        // Update game counts
        hostStats.totalGames++;
        guestStats.totalGames++;

        // Calculate game duration (simplified)
        const gameDuration = 300000; // 5 minutes default
        hostStats.totalPlayTime += gameDuration;
        guestStats.totalPlayTime += gameDuration;

        // Update win/loss/draw counts
        if (game.state?.gameStatus === "win") {
          if (game.state?.wholeGameWinner === "X") {
            hostStats.wins++;
            guestStats.losses++;
          } else if (game.state?.wholeGameWinner === "O") {
            guestStats.wins++;
            hostStats.losses++;
          }
        } else if (game.state?.gameStatus === "tie") {
          hostStats.draws++;
          guestStats.draws++;
        }
      });

      // Calculate derived statistics
      const playerStats: PlayerStats[] = Array.from(
        playerStatsMap.values()
      ).map((stats) => {
        const winRate =
          stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;
        const averageGameTime =
          stats.totalGames > 0
            ? stats.totalPlayTime / stats.totalGames / 1000 / 60
            : 0;

        // Calculate points (simplified scoring system)
        const points = stats.wins * 3 + stats.draws * 1;

        return {
          ...stats,
          winRate: Math.round(winRate * 10) / 10,
          averageGameTime: Math.round(averageGameTime * 10) / 10,
          points,
        };
      });

      // Sort players based on selected criteria
      const sortedPlayers = playerStats.sort((a, b) => {
        switch (sortBy) {
          case "winRate":
            return b.winRate - a.winRate;
          case "wins":
            return b.wins - a.wins;
          case "games":
            return b.totalGames - a.totalGames;
          case "streak":
            return b.longestStreak - a.longestStreak;
          case "points":
            return b.points - a.points;
          default:
            return 0;
        }
      });

      // Assign ranks
      sortedPlayers.forEach((player, index) => {
        player.rank = index + 1;
      });

      setPlayers(sortedPlayers);

      // Find current user's rank
      if (user) {
        const userStats = sortedPlayers.find((p) => p.userId === user.userId);
        setCurrentUserRank(userStats ? userStats.rank : null);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#ffd700";
    if (rank === 2) return "#c0c0c0";
    if (rank === 3) return "#cd7f32";
    return "var(--theme-onSurface)";
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <LoadingSpinner size="large" message="Loading leaderboard..." />
      </div>
    );
  }

  return (
    <div className="leaderboard">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="header-content">
          <h1>🏆 Leaderboard</h1>
          <p>Top players and rankings</p>
        </div>
        <div className="header-actions">
          <ThemeButton />
        </div>
      </div>

      {/* Current User Rank */}
      {currentUserRank && (
        <div className="user-rank-card">
          <div className="user-rank-content">
            <span className="user-rank-icon">👤</span>
            <div className="user-rank-info">
              <h3>Your Rank</h3>
              <p>You are ranked #{currentUserRank} on the leaderboard!</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="leaderboard-filters">
        <div className="filter-group">
          <label>Time Period:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="winRate">Win Rate</option>
            <option value="wins">Total Wins</option>
            <option value="games">Games Played</option>
            <option value="streak">Longest Streak</option>
            <option value="points">Points</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-content">
        {error && (
          <div className="error-message">
            <p>Error loading leaderboard: {error}</p>
          </div>
        )}

        {players.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>No data available</h3>
            <p>No games found for the selected time period.</p>
          </div>
        ) : (
          <div className="leaderboard-table">
            {players.slice(0, 50).map((player) => (
              <div
                key={player.userId}
                className={`leaderboard-row ${
                  player.userId === user?.userId ? "current-user" : ""
                }`}
              >
                <div className="rank-cell">
                  <span
                    className="rank-icon"
                    style={{ color: getRankColor(player.rank) }}
                  >
                    {getRankIcon(player.rank)}
                  </span>
                </div>

                <div className="player-cell">
                  <div className="player-info">
                    <span className="player-name">{player.username}</span>
                    {player.userId === user?.userId && (
                      <span className="current-user-badge">You</span>
                    )}
                  </div>
                </div>

                <div className="stats-cell">
                  <div className="stat-item">
                    <span className="stat-label">Games:</span>
                    <span className="stat-value">{player.totalGames}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Wins:</span>
                    <span className="stat-value">{player.wins}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Win Rate:</span>
                    <span className="stat-value">{player.winRate}%</span>
                  </div>
                </div>

                <div className="additional-stats">
                  <div className="stat-item">
                    <span className="stat-label">Streak:</span>
                    <span className="stat-value">{player.longestStreak}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Time:</span>
                    <span className="stat-value">
                      {formatTime(player.averageGameTime)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Points:</span>
                    <span className="stat-value">{player.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
