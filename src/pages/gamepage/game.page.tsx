import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameLogic from "../../hooks/gameHook";
import BigXO from "../../components/BigXO/bigXo.component";
import Avatar from "../../components/avatar/avatar.component";
import ThemeButton from "../../components/themeButton/themeButton.component";
import { GameStatus } from "../../types/gameStatusType";
import { useAuth } from "../../state/authContext";
import { getRoom } from "../../supabase/gameApi";
import { supabase } from "../../supabase/supabaseClient";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import GameLoading from "../../components/GameLoading/GameLoading";
import RematchButton from "../../components/RematchButton/RematchButton";
import GameChat from "../../components/GameChat/GameChat";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";
import "./gamepage.styles.css";

// Helper function to fetch user profile by user ID
const fetchUserProfile = async (
  userId: string
): Promise<{ username: string; avatar_url?: string }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return { username: "Unknown User" };
    }

    return {
      username: data.username || "Unknown User",
      avatar_url: data.avatar_url,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { username: "Unknown User" };
  }
};

const GamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const gameLogic = useGameLogic({ roomId: roomId || "" });
  const { user } = useAuth();
  const [room, setRoom] = useState<{
    host_id: string;
    guest_id?: string;
    host_avatar?: string;
    guest_avatar?: string;
    host_username?: string;
    guest_username?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading game...");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const navigate = useNavigate();
  // const [gameId, setGameId] = useState<string | null>(null);

  // Check if user is authorized to access this room
  useEffect(() => {
    const checkRoomAccess = async () => {
      if (!roomId) {
        setIsLoading(false);
        setIsAuthorized(false);
        navigate("/");
        return;
      }

      if (!user) {
        setLoadingMessage("Please log in to access this room. Redirecting...");
        setTimeout(() => navigate("/login-signup"), 2000);
        return;
      }

      try {
        setLoadingMessage("Checking room access...");
        const roomData = await getRoom(roomId);

        // Check if user is part of this room (host or guest)
        const isHost = roomData.host_id === user.userId;
        const isGuest = roomData.guest_id === user.userId;

        if (!isHost && !isGuest) {
          // User is not part of this room, redirect to homepage
          console.log("User not authorized to access this room");
          setLoadingMessage(
            "You don't have access to this room. Redirecting..."
          );
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking room access:", error);
        navigate("/");
        return;
      }
    };

    checkRoomAccess();
  }, [roomId, user, navigate]);

  // Fetch room data and subscribe to updates
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchRoom = async () => {
      if (roomId) {
        try {
          setLoadingMessage("Loading room data...");
          const roomData = await getRoom(roomId);

          setLoadingMessage("Loading game data...");
          // const gameData = await getGameForRoom(roomId);
          // setGameId(gameData.id);

          setLoadingMessage("Loading player information...");
          // Fetch user profiles for both players
          const [hostProfile, guestProfile] = await Promise.all([
            roomData.host_id
              ? fetchUserProfile(roomData.host_id)
              : Promise.resolve({ username: "", avatar_url: undefined }),
            roomData.guest_id
              ? fetchUserProfile(roomData.guest_id)
              : Promise.resolve({ username: "", avatar_url: undefined }),
          ]);

          setRoom({
            ...roomData,
            host_username: hostProfile.username,
            guest_username: guestProfile.username,
            host_avatar: hostProfile.avatar_url || "",
            guest_avatar: guestProfile.avatar_url || "",
          });

          setLoadingMessage("Initializing game...");
          // Small delay to show loading state
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error fetching room:", error);
          setIsLoading(false);
        }
      }
    };
    fetchRoom();

    // Subscribe to room updates for avatar changes
    if (roomId) {
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rooms",
            filter: `id=eq.${roomId}`,
          },
          async (payload) => {
            console.log("Room updated:", payload.new);
            const roomData = payload.new as {
              host_id: string;
              guest_id?: string;
            };

            if (!roomData) return;

            // Fetch user profiles for both players
            const [hostProfile, guestProfile] = await Promise.all([
              roomData.host_id
                ? fetchUserProfile(roomData.host_id)
                : Promise.resolve({ username: "", avatar_url: undefined }),
              roomData.guest_id
                ? fetchUserProfile(roomData.guest_id)
                : Promise.resolve({ username: "", avatar_url: undefined }),
            ]);

            setRoom({
              host_id: roomData.host_id || "",
              guest_id: roomData.guest_id,
              host_avatar: hostProfile.avatar_url || "",
              guest_avatar: guestProfile.avatar_url || "",
              host_username: hostProfile.username,
              guest_username: guestProfile.username,
            });
          }
        )
        .subscribe();

      // Log channel lifecycle for debugging realtime connection issues
      // eslint-disable-next-line no-console
      console.log(`Subscribed to room channel for ${roomId}`, channel);

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [roomId]);

  // Show loading state while initializing or checking authorization
  if (isLoading || !isAuthorized) {
    return <GameLoading message={loadingMessage} showSkeleton={true} />;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="player-info player-one">
          <div className="player-info-container">
            <Avatar
              userId={room?.host_id}
              avatarUrl={room?.host_avatar}
              username={room?.host_username || "Host"}
              size={60}
              className={`game-avatar ${
                gameLogic.turn === room?.host_id ? "current-turn" : ""
              }`}
            />
            <p className="player-name">{room?.host_username || "Host"}</p>
          </div>
          <div className="player-score">
            <span className="score-label">Score:</span>
            <span className="score-value">{gameLogic.score[0]}</span>
          </div>
        </div>

        <div className="game-status">
          <p className="game-status-text">
            {gameLogic.gameStatus === GameStatus.WAITING
              ? "Waiting for players"
              : gameLogic.gameStatus === GameStatus.PLAYING
              ? "Playing"
              : gameLogic.gameStatus === GameStatus.WIN
              ? "Game Over"
              : gameLogic.gameStatus === GameStatus.TIE
              ? "Tie Game"
              : gameLogic.gameStatus}
          </p>
          <p className="turn-info">
            Turn:{" "}
            {gameLogic.turn === room?.host_id
              ? room?.host_username || "Host"
              : room?.guest_username || "Guest"}
          </p>
          <p className="player-symbol">
            You are: <strong>{gameLogic.playerSymbol}</strong>
          </p>
        </div>

        <div className="player-info player-two">
          <div className="player-info-container">
            {room?.guest_id ? (
              <>
                <Avatar
                  userId={room?.guest_id}
                  avatarUrl={room?.guest_avatar}
                  username={room?.guest_username || "Guest"}
                  size={60}
                  className={`game-avatar ${
                    gameLogic.turn === room?.guest_id ? "current-turn" : ""
                  }`}
                />
                <p className="player-name">{room?.guest_username || "Guest"}</p>
              </>
            ) : (
              <>
                <div className="waiting-avatar">
                  <span className="waiting-icon">⏳</span>
                </div>
                <p className="player-name waiting-text">
                  Waiting for player...
                </p>
              </>
            )}
          </div>
          <div className="player-score">
            <span className="score-label">Score:</span>
            <span className="score-value">{gameLogic.score[1]}</span>
          </div>
        </div>
      </div>

      <div className="game-board-container">
        <ErrorBoundary
          fallback={
            <div className="game-board-error">
              <h3>Game Board Error</h3>
              <p>
                There was an error loading the game board. Please try refreshing
                the page.
              </p>
            </div>
          }
        >
          <BigXO
            bigBoard={gameLogic.bigBoard}
            winnerBoard={gameLogic.winnerBoard}
            turn={gameLogic.turn}
            gameStatus={gameLogic.gameStatus}
            activeBoard={gameLogic.activeBoard}
            currentPlayerTurn={gameLogic.currentPlayerTurn}
            handleCellClick={gameLogic.handleCellClick}
            wholeGameWinner={gameLogic.wholeGameWinner}
          />
        </ErrorBoundary>

        {/* Floating Game Over Overlay */}
        {gameLogic.wholeGameWinner && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <div className="winner-celebration">
                <div className="celebration-icon">
                  {gameLogic.wholeGameWinner === "draw" ? "🤝" : "🏆"}
                </div>
                <h2 className="winner-title">
                  {gameLogic.wholeGameWinner === "draw"
                    ? "It's a Draw!"
                    : gameLogic.wholeGameWinner === gameLogic.playerSymbol
                    ? "You Won!"
                    : "Game Over"}
                </h2>
                <p className="winner-message">
                  {gameLogic.wholeGameWinner === "draw"
                    ? "The game ended in a draw! Well played!"
                    : gameLogic.wholeGameWinner === gameLogic.playerSymbol
                    ? `Congratulations ${user?.username || "Player"}!`
                    : `${
                        gameLogic.wholeGameWinner === "X"
                          ? room?.host_username || "Host"
                          : room?.guest_username || "Guest"
                      } won the game!`}
                </p>
                <div className="game-over-actions">
                  <button className="play-again-btn" onClick={gameLogic.reset}>
                    <span className="btn-icon">🔄</span>
                    <span className="btn-text">Play Again</span>
                  </button>
                  <RematchButton
                    onRematch={gameLogic.requestRematch}
                    disabled={!room?.guest_id}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme button in bottom right corner */}
      <div className="theme-button-container">
        <ThemeButton />
      </div>

      {/* Game Timeout - Temporarily Disabled */}
      {/* {gameId && (
        <GameTimeout
          gameId={gameId}
          roomId={roomId!}
          isPlayerTurn={gameLogic.turn === room?.host_id}
          moveTimeout={300}
          warningTime={60}
        />
      )} */}

      {/* Game chat */}
      {roomId && <GameChat roomId={roomId} />}

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default GamePage;
