import React, { useState, useEffect } from "react";
import { useAuth } from "../../state/authContext";
import { useGameHistory, GameHistoryEntry } from "../../hooks/useGameHistory";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ThemeButton from "../../components/themeButton/themeButton.component";
import "./gameHistory.styles.css";

const GameHistory: React.FC = () => {
  const { user } = useAuth();
  const { games, loading, error, fetchGameHistory, getGameDetails } =
    useGameHistory();
  const [selectedGame, setSelectedGame] = useState<GameHistoryEntry | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "wins" | "losses" | "draws">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "duration" | "opponent">(
    "date"
  );

  useEffect(() => {
    if (user) {
      fetchGameHistory(user.userId);
    }
  }, [user, fetchGameHistory]);

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    if (filter === "wins")
      return game.winner === (game.hostId === user?.userId ? "host" : "guest");
    if (filter === "losses")
      return game.winner === (game.hostId === user?.userId ? "guest" : "host");
    if (filter === "draws") return game.winner === "draw";
    return true;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "duration":
        return b.gameDuration - a.gameDuration;
      case "opponent":
        const aOpponent =
          a.hostId === user?.userId ? a.guestUsername : a.hostUsername;
        const bOpponent =
          b.hostId === user?.userId ? b.guestUsername : b.hostUsername;
        return aOpponent.localeCompare(bOpponent);
      default:
        return 0;
    }
  });

  const handleGameClick = async (gameId: string) => {
    const gameDetails = await getGameDetails(gameId);
    setSelectedGame(gameDetails);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getResultIcon = (game: GameHistoryEntry) => {
    const isHost = game.hostId === user?.userId;
    if (game.winner === "draw") return "🤝";
    if (game.winner === (isHost ? "host" : "guest")) return "🏆";
    return "❌";
  };

  const getResultText = (game: GameHistoryEntry) => {
    const isHost = game.hostId === user?.userId;
    if (game.winner === "draw") return "Draw";
    if (game.winner === (isHost ? "host" : "guest")) return "Win";
    return "Loss";
  };

  if (loading) {
    return (
      <div className="game-history-loading">
        <LoadingSpinner size="large" message="Loading game history..." />
      </div>
    );
  }

  return (
    <div className="game-history">
      {/* Header */}
      <div className="game-history-header">
        <div className="header-content">
          <h1>Game History</h1>
          <p>View your past games and statistics</p>
        </div>
        <div className="header-actions">
          <ThemeButton />
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="game-history-controls">
        <div className="filter-controls">
          <label>Filter by result:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Games</option>
            <option value="wins">Wins Only</option>
            <option value="losses">Losses Only</option>
            <option value="draws">Draws Only</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="duration">Duration</option>
            <option value="opponent">Opponent</option>
          </select>
        </div>
      </div>

      {/* Games List */}
      <div className="games-list">
        {error && (
          <div className="error-message">
            <p>Error loading game history: {error}</p>
          </div>
        )}

        {sortedGames.length === 0 ? (
          <div className="no-games">
            <div className="no-games-icon">🎮</div>
            <h3>No games found</h3>
            <p>
              {filter === "all"
                ? "You haven't played any games yet. Start your first game!"
                : `No ${filter} found in your game history.`}
            </p>
          </div>
        ) : (
          sortedGames.map((game) => (
            <div
              key={game.id}
              className={`game-item game-item-${getResultText(
                game
              ).toLowerCase()}`}
              onClick={() => handleGameClick(game.id)}
            >
              <div className="game-result">
                <span className="result-icon">{getResultIcon(game)}</span>
                <span className="result-text">{getResultText(game)}</span>
              </div>

              <div className="game-details">
                <div className="game-opponent">
                  <span className="opponent-label">vs</span>
                  <span className="opponent-name">
                    {game.hostId === user?.userId
                      ? game.guestUsername
                      : game.hostUsername}
                  </span>
                </div>

                <div className="game-meta">
                  <span className="game-date">
                    {formatDate(game.updatedAt)}
                  </span>
                  <span className="game-duration">
                    {formatDuration(game.gameDuration)}
                  </span>
                  <span className="game-score">
                    {game.finalScore[0]} - {game.finalScore[1]}
                  </span>
                </div>
              </div>

              <div className="game-actions">
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="game-details-modal">
          <div
            className="modal-overlay"
            onClick={() => setSelectedGame(null)}
          />
          <div className="modal-content">
            <div className="modal-header">
              <h2>Game Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedGame(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="game-info">
                <div className="info-item">
                  <span className="info-label">Opponent:</span>
                  <span className="info-value">
                    {selectedGame.hostId === user?.userId
                      ? selectedGame.guestUsername
                      : selectedGame.hostUsername}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Result:</span>
                  <span className="info-value">
                    {getResultText(selectedGame)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">
                    {formatDuration(selectedGame.gameDuration)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Final Score:</span>
                  <span className="info-value">
                    {selectedGame.finalScore[0]} - {selectedGame.finalScore[1]}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date:</span>
                  <span className="info-value">
                    {formatDate(selectedGame.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHistory;
