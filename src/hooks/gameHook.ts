import { useEffect, useState, useRef } from "react";
import { GameStatus } from "../types/gameStatusType";
import { useNavigate } from "react-router-dom";
import {
  updateGameState,
  subscribeToGameState,
  getRoom,
  getGameForRoom,
} from "../supabase/gameApi";
import { GridState } from "../types/gridStateType";
import { calculateWinner } from "../util/findWinner.util";
import { useUser } from "../state/authContext";
import { supabase } from "../supabase/supabaseClient";

// Types

type Turn = string; // User ID

// Define the shape of the game state stored in Supabase
interface GameState {
  bigBoard: (string | null)[][];
  winnerBoard: (string | "draw" | null)[];
  turn: Turn;
  gameStatus: string;
  winner: string;
  score: [number, number];
  activeBoard: number; // -1 means any board, 0-8 means specific board
  wholeGameWinner: string | "draw" | null;
}

interface SupabaseSubscription {
  unsubscribe: () => void;
}

const EMPTY_BOARD = Array(9)
  .fill(null)
  .map(() => Array(9).fill(null));
const EMPTY_WINNER_BOARD = Array(9).fill(null);

export default function useGameLogic({
  roomId,
  gameId,
}: {
  roomId: string;
  gameId?: string;
}) {
  const navigate = useNavigate();
  const user = useUser();

  // States
  const [bigBoard, setBigBoard] = useState<GridState[][]>(EMPTY_BOARD);
  const [winnerBoard, setWinnerBoard] =
    useState<(GridState | "draw")[]>(EMPTY_WINNER_BOARD);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
  const [turn, setTurn] = useState<Turn>("");
  const [winner, setWinner] = useState("");
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [activeBoard, setActiveBoard] = useState<number>(-1); // -1 means any board
  const [wholeGameWinner, setWholeGameWinner] = useState<
    GridState | "draw" | null
  >(null);
  const [supabaseGameId, setSupabaseGameId] = useState<string | undefined>(
    gameId
  );
  const subscriptionRef = useRef<SupabaseSubscription | null>(null);

  // Check if both players are in the room and start the game
  const checkAndStartGame = async () => {
    try {
      const room = await getRoom(roomId);
      if (room.host_id && room.guest_id) {
        if (gameStatus === GameStatus.WAITING) {
          // Both players are present, start the game
          await updateDB({
            gameStatus: GameStatus.PLAYING,
          });
          // Update local state immediately
          setGameStatus(GameStatus.PLAYING);
        }
      }
    } catch (error) {
      console.error("Error checking room state:", error);
    }
  };

  // Fetch existing game on mount
  useEffect(() => {
    let isMounted = true;
    async function setupGame() {
      if (!supabaseGameId) {
        try {
          // Get the existing game for this room
          const game = await getGameForRoom(roomId);

          if (isMounted) {
            setSupabaseGameId(game.id);
            setBigBoard(game.state.bigBoard);
            setWinnerBoard(game.state.winnerBoard);
            setGameStatus(game.state.gameStatus);
            setTurn(game.state.turn);
            setWinner(game.state.winner);
            setScore(game.state.score);
            setActiveBoard(game.state.activeBoard || -1);
            setWholeGameWinner(game.state.wholeGameWinner || null);
          }
        } catch (error) {
          console.error("Error fetching game:", error);
        }
      } else {
        // Game already exists, will start when first cell is clicked
      }
    }
    setupGame();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [roomId, user]);

  // Subscribe to real-time game state
  useEffect(() => {
    if (!supabaseGameId) return;
    const sub = subscribeToGameState(supabaseGameId, (state: GameState) => {
      
      setBigBoard(state.bigBoard as GridState[][]);
      setWinnerBoard(state.winnerBoard as (GridState | "draw")[]);
      setGameStatus(state.gameStatus as GameStatus);
      setTurn(state.turn);
      setWinner(state.winner);
      setScore(state.score);
      setActiveBoard(state.activeBoard || -1);
      setWholeGameWinner(
        (state.wholeGameWinner as GridState | "draw" | null) || null
      );
    });
    subscriptionRef.current = sub as SupabaseSubscription;

    // Fallback: Poll for updates every 2 seconds if real-time fails
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .eq("id", supabaseGameId)
          .order("updated_at", { ascending: false })
          .single();

        if (error) {
          console.error("Polling error:", error);
          return;
        }

        if (data && data.state) {
          // Only update if we have complete state data
          if (
            data.state.bigBoard &&
            data.state.winnerBoard &&
            data.state.turn !== undefined
          ) {

            setBigBoard(data.state.bigBoard);
            setWinnerBoard(data.state.winnerBoard);
            setGameStatus(data.state.gameStatus);
            setTurn(data.state.turn);
            setWinner(data.state.winner);
            setScore(data.state.score);
            setActiveBoard(data.state.activeBoard || -1);
            setWholeGameWinner(data.state.wholeGameWinner || null);
          } else {
            console.log(
              "[DEBUG] 🔄 Incomplete state received, skipping update"
            );
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      clearInterval(pollInterval);
    };
  }, [supabaseGameId]);

  // Remove periodic polling - only check when needed

  // Update game state in Supabase
  const updateDB = async (data: Partial<GameState>) => {
    if (!supabaseGameId) return;
    // Always send complete state to avoid partial updates
    const completeState = {
      bigBoard: data.bigBoard || bigBoard,
      winnerBoard: data.winnerBoard || winnerBoard,
      turn: data.turn !== undefined ? data.turn : turn,
      gameStatus: data.gameStatus || gameStatus,
      winner: data.winner !== undefined ? data.winner : winner,
      score: data.score || score,
      activeBoard:
        data.activeBoard !== undefined ? data.activeBoard : activeBoard,
      wholeGameWinner:
        data.wholeGameWinner !== undefined
          ? data.wholeGameWinner
          : wholeGameWinner,
    };

    try {
      await updateGameState(supabaseGameId, completeState);
    } catch (error) {
      console.error("Database update error:", error);
    }
  };

  // Handle a cell click in the full board
  const handleCellClick = async (boardIdx: number, cellIdx: number) => {    // Check if it's the user's turn
    if (!user) {
      return;
    }

    const room = await getRoom(roomId);
    const isHost = room.host_id === user.userId;
    const isGuest = room.guest_id === user.userId;

    if (!isHost && !isGuest) {
      return;
    }

    if (user.userId !== turn) {
      return;
    }

    // If game is not playing, try to start it first
    if (gameStatus !== GameStatus.PLAYING) {
      await checkAndStartGame();

      // For the first move, allow it even if status is still WAITING
      // This handles the case where the game starts with the first move
      if (
        (gameStatus as GameStatus) !== GameStatus.PLAYING &&
        (gameStatus as GameStatus) !== GameStatus.WAITING
      ) {
        return;
      }
    }

    // Check if cell is already occupied
    if (bigBoard[boardIdx][cellIdx] !== null) {
      console.log("[DEBUG] Cell already occupied");
      return;
    }

    // Check active board rule (super tic-tac-toe rule)
    if (activeBoard !== -1 && activeBoard !== boardIdx) {
      // If the active board is already won, allow any board
      if (winnerBoard[activeBoard] !== null) {
        console.log(
          "[DEBUG] Active board",
          activeBoard,
          "is already won by:",
          winnerBoard[activeBoard],
          "- allowing any board"
        );
        // Don't return, allow the move to proceed
      } else {
        console.log(
          "[DEBUG] Must play in active board:",
          activeBoard,
          "but tried to play in:",
          boardIdx
        );
        return;
      }
    }

    // Make the move
    const playerSymbol = isHost ? "X" : "O";

    const newBigBoard = bigBoard.map((row, i) =>
      i === boardIdx
        ? row.map((cell, j) => (j === cellIdx ? playerSymbol : cell))
        : row
    );

    // Check if this small board has a winner
    const smallBoardWinner = calculateWinner(newBigBoard[boardIdx]);
    const newWinnerBoard = [...winnerBoard];
    let newActiveBoard = cellIdx; // Next player must play in the board corresponding to the cell they just played

    if (smallBoardWinner) {
      console.log("[DEBUG] Small board", boardIdx, "won by:", smallBoardWinner);
      newWinnerBoard[boardIdx] = smallBoardWinner;

      // Check if the target board is already won
      if (newWinnerBoard[cellIdx] !== null) {
        console.log(
          "[DEBUG] Target board",
          cellIdx,
          "is already won - setting active board to -1"
        );
        newActiveBoard = -1; // Any board is available
      }
    } else {
      // Even if no winner, check if target board is already won
      if (newWinnerBoard[cellIdx] !== null) {
        console.log(
          "[DEBUG] Target board",
          cellIdx,
          "is already won - setting active board to -1"
        );
        newActiveBoard = -1; // Any board is available
      }
    }

    // Check if the whole game has a winner
    const wholeGameWinnerResult = calculateWinner(newWinnerBoard);
    let newGameStatus: GameStatus = gameStatus;
    let newWholeGameWinner = wholeGameWinner;
    const newScore = [...score];

    if (wholeGameWinnerResult) {
      console.log("[DEBUG] Whole game won by:", wholeGameWinnerResult);
      newGameStatus = GameStatus.WIN;
      newWholeGameWinner = wholeGameWinnerResult;

      // Update score based on winner
      if (wholeGameWinnerResult === "X") {
        // Host (X) won
        newScore[0] += 1;
      } else if (wholeGameWinnerResult === "O") {
        // Guest (O) won
        newScore[1] += 1;
      }
      console.log("[DEBUG] Score updated:", newScore);
    }

    // Update the game state - switch to the other player
    const otherPlayerId = isHost ? room.guest_id : room.host_id;

    if (!otherPlayerId) {
      console.error("[DEBUG] ❌ No other player ID found!", {
        isHost,
        isGuest,
        host_id: room.host_id,
        guest_id: room.guest_id,
      });
      return;
    }

    console.log(
      "[DEBUG] 🔄 Turn update - Current turn:",
      turn,
      "New turn:",
      otherPlayerId
    );
    console.log("[DEBUG] 🔄 Room data:", {
      host_id: room.host_id,
      guest_id: room.guest_id,
      isHost,
      isGuest,
    });
    console.log(
      "[DEBUG] 🔄 Active board update - New active board:",
      newActiveBoard
    );

    await updateDB({
      bigBoard: newBigBoard,
      winnerBoard: newWinnerBoard,
      turn: otherPlayerId,
      activeBoard: newActiveBoard,
      gameStatus: newGameStatus,
      wholeGameWinner: newWholeGameWinner,
      score: newScore as [number, number],
    });
  };

  // Reset game (keep score, reset board)
  const reset = () => {
    updateDB({
      bigBoard: EMPTY_BOARD,
      winnerBoard: EMPTY_WINNER_BOARD,
      gameStatus: GameStatus.PLAYING,
      turn: user?.userId || "",
      winner: "",
      score: score, // Keep current score
      wholeGameWinner: null,
      activeBoard: -1,
    });
  };

  // Handle leave (optional: implement room cleanup logic if needed)
  const handleLeave = async () => {
    navigate("/create-room");
  };

  // Determine current player's turn
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<string>("");

  // Player info
  const [isHost, setIsHost] = useState<boolean>(false);
  const [playerSymbol, setPlayerSymbol] = useState<string>("");

  // Update current player turn when user or room changes
  useEffect(() => {
    const updatePlayerTurn = async () => {
      if (!user) {
        setCurrentPlayerTurn("");
        setIsHost(false);
        setPlayerSymbol("");
        return;
      }

      try {
        const room = await getRoom(roomId);

        const isHostUser = room.host_id === user.userId;
        const isGuest = room.guest_id === user.userId;

        if (isHostUser || isGuest) {
          setCurrentPlayerTurn(user.userId);
          setIsHost(isHostUser);
          setPlayerSymbol(isHostUser ? "X" : "O");
        } else {
          setCurrentPlayerTurn("");
          setIsHost(false);
          setPlayerSymbol("");
        }
      } catch (error) {
        console.error("Error getting room data:", error);
        setCurrentPlayerTurn("");
        setIsHost(false);
        setPlayerSymbol("");
      }
    };

    updatePlayerTurn();
  }, [user, roomId]);

  // Auto-start game when both players are present
  useEffect(() => {
    const autoStartGame = async () => {
      if (!supabaseGameId) return;

      try {
        const room = await getRoom(roomId);
        if (
          room.host_id &&
          room.guest_id &&
          gameStatus === GameStatus.WAITING
        ) {
          await checkAndStartGame();
        }
      } catch (error) {
        console.error("Error in auto-start:", error);
      }
    };

    autoStartGame();
  }, [supabaseGameId, gameStatus, roomId]);

  return {
    bigBoard,
    winnerBoard,
    gameStatus,
    turn,
    winner,
    score,
    activeBoard,
    wholeGameWinner,
    currentPlayerTurn,
    isHost,
    playerSymbol,
    handleCellClick,
    reset,
    handleLeave,
  };
}
