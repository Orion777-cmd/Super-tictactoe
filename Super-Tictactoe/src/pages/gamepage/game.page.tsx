import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameLogic from "../../hooks/gameHook";
import BigXO from "../../components/BigXO/bigXo.component";
import Avatar from "../../components/avatar/avatar.component";
import { GameStatus } from "../../types/gameStatusType";
import { useAuth } from "../../state/authContext";
import { getRoom } from "../../supabase/gameApi";
import { supabase } from "../../supabase/supabaseClient";
import "./gamepage.styles.css";

// Helper function to fetch username by user ID
const fetchUsername = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return "Unknown User";
    }

    return data.username || "Unknown User";
  } catch (error) {
    console.error("Error fetching username:", error);
    return "Unknown User";
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

  // Fetch room data and subscribe to updates
  useEffect(() => {
    const fetchRoom = async () => {
      if (roomId) {
        try {
          const roomData = await getRoom(roomId);

          // Fetch usernames for both players
          const [hostUsername, guestUsername] = await Promise.all([
            roomData.host_id
              ? fetchUsername(roomData.host_id)
              : Promise.resolve(""),
            roomData.guest_id
              ? fetchUsername(roomData.guest_id)
              : Promise.resolve(""),
          ]);

          setRoom({
            ...roomData,
            host_username: hostUsername,
            guest_username: guestUsername,
          });
        } catch (error) {
          console.error("Error fetching room:", error);
        }
      }
    };
    fetchRoom();

    // Subscribe to room updates for avatar changes
    if (roomId) {
      const channel = supabase
        .channel(`room-${roomId}`)
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
              host_avatar?: string;
              guest_avatar?: string;
            };

            if (!roomData) return;

            // Fetch usernames for both players
            const [hostUsername, guestUsername] = await Promise.all([
              roomData.host_id
                ? fetchUsername(roomData.host_id)
                : Promise.resolve(""),
              roomData.guest_id
                ? fetchUsername(roomData.guest_id)
                : Promise.resolve(""),
            ]);

            setRoom({
              host_id: roomData.host_id || "",
              guest_id: roomData.guest_id,
              host_avatar: roomData.host_avatar,
              guest_avatar: roomData.guest_avatar,
              host_username: hostUsername,
              guest_username: guestUsername,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [roomId]);

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="player-info player-one">
          <div className="player-info-container">
            <Avatar
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
          {gameLogic.wholeGameWinner && (
            <p className="winner-message">
              🏆{" "}
              {gameLogic.wholeGameWinner === gameLogic.playerSymbol
                ? `${user?.username || "You"} won!`
                : `${
                    gameLogic.wholeGameWinner === "X"
                      ? room?.host_username || "Host"
                      : room?.guest_username || "Guest"
                  } won!`}
            </p>
          )}
        </div>

        <div className="player-info player-two">
          <div className="player-info-container">
            <Avatar
              avatarUrl={room?.guest_avatar}
              username={room?.guest_username || "Guest"}
              size={60}
              className={`game-avatar ${
                gameLogic.turn === room?.guest_id ? "current-turn" : ""
              }`}
            />
            <p className="player-name">{room?.guest_username || "Guest"}</p>
          </div>
          <div className="player-score">
            <span className="score-label">Score:</span>
            <span className="score-value">{gameLogic.score[1]}</span>
          </div>
        </div>
      </div>

      <div className="game-board-container">
        <BigXO
          bigBoard={gameLogic.bigBoard}
          winnerBoard={gameLogic.winnerBoard}
          turn={gameLogic.turn}
          gameStatus={gameLogic.gameStatus}
          activeBoard={gameLogic.activeBoard}
          currentPlayerTurn={gameLogic.currentPlayerTurn}
          handleCellClick={gameLogic.handleCellClick}
        />
      </div>
    </div>
  );
};

export default GamePage;
