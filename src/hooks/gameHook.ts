import { useEffect, useState, useRef, useCallback } from "react";
import { GameStatus } from "../types/gameStatusType";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import {
  updateGameState,
  subscribeToGameState,
  getRoom,
  getGameForRoom,
} from "../supabase/gameApi";
import { GridState } from "../types/gridStateType";
import { calculateWinner, isDrawInevitable } from "../util/findWinner.util";
import { useUser } from "../state/authContext";
import { useSound } from "./useSound";
import { useNotificationContext } from "../context/NotificationContext";
import { useTimeoutContext } from "../context/TimeoutContext";
import { useErrorRecovery } from "./useErrorRecovery";
import {
  validateGameState,
  validateMove,
  detectSuspiciousActivity,
  sanitizeGameState,
} from "../utils/gameValidation";

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
  const [room, setRoom] = useState<any>(null);
  const subscriptionRef = useRef<SupabaseSubscription | null>(null);
  const sound = useSound();
  const notifications = useNotificationContext();
  const { resetTimeout } = useTimeoutContext();
  const { handleError } = useErrorRecovery(gameId, roomId);

  // Update game state in Supabase
  const updateDB = useCallback(
    async (data: Partial<GameState>) => {
      if (!supabaseGameId) return;

      console.log("[DEBUG] 🔄 updateDB called with:", {
        activeBoard: data.activeBoard,
        currentActiveBoard: activeBoard,
        willUse:
          data.activeBoard !== undefined ? data.activeBoard : activeBoard,
      });

      // Always send complete state to avoid partial updates
      const completeState = {
        bigBoard: data.bigBoard || bigBoard,
        winnerBoard: data.winnerBoard || winnerBoard,
        turn: data.turn !== undefined ? data.turn : turn,
        gameStatus: (data.gameStatus || gameStatus) as GameStatus,
        winner: data.winner !== undefined ? data.winner : winner,
        score: data.score || score,
        activeBoard:
          data.activeBoard !== undefined ? data.activeBoard : activeBoard,
        wholeGameWinner:
          data.wholeGameWinner !== undefined
            ? data.wholeGameWinner
            : wholeGameWinner,
      };

      console.log("[DEBUG] 🔄 completeState being sent:", completeState);

      try {
        await updateGameState(supabaseGameId, completeState);
      } catch (error) {
        console.error("Database update error:", error);
        handleError(error as Error, "updateDB");
      }
    },
    [
      supabaseGameId,
      activeBoard,
      bigBoard,
      winnerBoard,
      turn,
      gameStatus,
      winner,
      score,
      wholeGameWinner,
    ]
  );

  // Check if both players are in the room and start the game
  const checkAndStartGame = useCallback(async () => {
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
  }, [roomId, gameStatus, updateDB, setGameStatus]);

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
            setActiveBoard(
              game.state.activeBoard !== undefined ? game.state.activeBoard : -1
            );
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
      console.log("[DEBUG] 🔄 WebSocket update received:", {
        activeBoard: state.activeBoard,
        turn: state.turn,
        gameStatus: state.gameStatus,
      });

      // Validate the received game state
      const stateWithCorrectTypes = {
        ...state,
        gameStatus: state.gameStatus as GameStatus,
      };
      const validation = validateGameState(stateWithCorrectTypes);
      if (!validation.isValid) {
        console.error("Invalid game state received:", validation.errors);
        handleError(
          new Error(`Invalid game state: ${validation.errors.join(", ")}`),
          "gameStateUpdate"
        );
        return;
      }

      // Sanitize the game state before applying
      const sanitizedState = sanitizeGameState(stateWithCorrectTypes);

      // Play sound for opponent's move (only if it's not our turn)
      if (sanitizedState.turn !== user?.userId) {
        sound.playMove();
      }

      // Play sound for game ending
      if (
        sanitizedState.gameStatus === GameStatus.WIN &&
        sanitizedState.wholeGameWinner
      ) {
        if (
          sanitizedState.wholeGameWinner ===
          (user?.userId === room?.host_id ? "X" : "O")
        ) {
          sound.playWin();
        } else {
          sound.playLose();
        }
      }

      setBigBoard(sanitizedState.bigBoard as GridState[][]);
      setWinnerBoard(sanitizedState.winnerBoard as (GridState | "draw")[]);
      setGameStatus(sanitizedState.gameStatus as GameStatus);
      setTurn(sanitizedState.turn);
      setWinner(sanitizedState.winner);
      setScore(sanitizedState.score);
      setActiveBoard(
        sanitizedState.activeBoard !== undefined
          ? sanitizedState.activeBoard
          : -1
      );
      setWholeGameWinner(
        (sanitizedState.wholeGameWinner as GridState | "draw" | null) || null
      );
    });
    subscriptionRef.current = sub as SupabaseSubscription;

    // Fallback: Poll for updates every 2 seconds if real-time fails
    // const pollInterval = setInterval(async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from("games")
    //       .select("*")
    //       .eq("id", supabaseGameId)
    //       .order("updated_at", { ascending: false })
    //       .single();

    //     if (error) {
    //       console.error("Polling error:", error);
    //       return;
    //     }

    //     if (data && data.state) {
    //       // Only update if we have complete state data
    //       if (
    //         data.state.bigBoard &&
    //         data.state.winnerBoard &&
    //         data.state.turn !== undefined
    //       ) {
    //         setBigBoard(data.state.bigBoard);
    //         setWinnerBoard(data.state.winnerBoard);
    //         setGameStatus(data.state.gameStatus);
    //         setTurn(data.state.turn);
    //         setWinner(data.state.winner);
    //         setScore(data.state.score);
    //         setActiveBoard(data.state.activeBoard || -1);
    //         setWholeGameWinner(data.state.wholeGameWinner || null);
    //       } else {
    //         console.log(
    //           "[DEBUG] 🔄 Incomplete state received, skipping update"
    //         );
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Polling error:", error);
    //   }
    // }, 2000);

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [supabaseGameId]);

  // Remove periodic polling - only check when needed

  // Handle a cell click in the full board
  const handleCellClick = async (boardIdx: number, cellIdx: number) => {
    // Check if it's the user's turn
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

    // Validate the move
    const currentGameState = {
      bigBoard,
      winnerBoard,
      turn,
      gameStatus,
      winner: wholeGameWinner || "",
      activeBoard,
      score,
      wholeGameWinner,
    };

    const moveValidation = validateMove(
      currentGameState,
      user.userId,
      boardIdx,
      cellIdx
    );
    if (!moveValidation.isValid) {
      console.warn("Invalid move:", moveValidation.errors);
      notifications.showGameNotification(
        "warning",
        "Invalid Move",
        moveValidation.errors[0] || "Move not allowed",
        { duration: 3000 }
      );
      return;
    }

    // Check for suspicious activity
    const suspicious = detectSuspiciousActivity(currentGameState, user.userId);
    if (suspicious.length > 0) {
      console.warn("Suspicious activity detected:", suspicious);
      notifications.showGameNotification(
        "warning",
        "Suspicious Activity",
        "Unusual game patterns detected",
        { duration: 5000 }
      );
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

    console.log(
      "[DEBUG] Move made in board",
      boardIdx,
      "cell",
      cellIdx,
      "-> next player must play in board",
      newActiveBoard
    );

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

    // Check if the whole game has a winner or is a draw
    console.log("[DEBUG] Checking winnerBoard for draw:", newWinnerBoard);
    const wholeGameWinnerResult = calculateWinner(newWinnerBoard);
    console.log("[DEBUG] calculateWinner returned:", wholeGameWinnerResult);

    let newGameStatus: GameStatus = gameStatus;
    let newWholeGameWinner = wholeGameWinner;
    const newScore = [...score];

    // Check for immediate winner or draw
    if (wholeGameWinnerResult) {
      console.log("[DEBUG] Whole game result:", wholeGameWinnerResult);

      if (wholeGameWinnerResult === "draw") {
        // Handle draw
        newGameStatus = GameStatus.TIE;
        newWholeGameWinner = "draw";

        // Play draw sound
        sound.playDraw();
        notifications.showGameNotification(
          "info",
          "🤝 Draw Game",
          "The game ended in a draw!",
          { duration: 6000 }
        );
      } else {
        // Handle win
        newGameStatus = GameStatus.WIN;
        newWholeGameWinner = wholeGameWinnerResult;

        // Play win/lose sound based on who won
        if (wholeGameWinnerResult === playerSymbol) {
          sound.playWin();
          notifications.showGameNotification(
            "success",
            "🎉 Victory!",
            "Congratulations! You won the game!",
            { duration: 8000 }
          );
        } else {
          sound.playLose();
          notifications.showGameNotification(
            "warning",
            "😔 Game Over",
            "Better luck next time!",
            { duration: 6000 }
          );
        }

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
    } else {
      // Check if a draw is inevitable (optimized early detection)
      if (isDrawInevitable(newWinnerBoard)) {
        console.log("[DEBUG] Draw is inevitable - ending game early");
        newGameStatus = GameStatus.TIE;
        newWholeGameWinner = "draw";

        // Play draw sound
        sound.playDraw();
        notifications.showGameNotification(
          "info",
          "🤝 Draw Game",
          "The game ended in a draw!",
          { duration: 6000 }
        );
      }
    }

    // Update the game state - switch to the other player
    // Get room data to determine the other player
    const currentRoom = await getRoom(roomId);
    const otherPlayerId = isHost ? currentRoom.guest_id : currentRoom.host_id;

    if (!otherPlayerId) {
      console.error("[DEBUG] ❌ No other player ID found!", {
        isHost,
        isGuest,
        host_id: currentRoom.host_id,
        guest_id: currentRoom.guest_id,
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
      host_id: currentRoom.host_id,
      guest_id: currentRoom.guest_id,
      isHost,
      isGuest,
    });
    console.log(
      "[DEBUG] 🔄 Active board update - New active board:",
      newActiveBoard,
      "Current activeBoard state:",
      activeBoard
    );

    // Play move sound
    sound.playMove();

    // Reset timeout for the next player
    resetTimeout();

    // Update local state immediately for better UX
    setBigBoard(newBigBoard);
    setWinnerBoard(newWinnerBoard);
    setTurn(otherPlayerId);
    setActiveBoard(newActiveBoard);
    setGameStatus(newGameStatus);
    setWinner(winner);
    setScore(newScore as [number, number]);
    setWholeGameWinner(newWholeGameWinner);

    await updateDB({
      bigBoard: newBigBoard,
      winnerBoard: newWinnerBoard,
      turn: otherPlayerId,
      activeBoard: newActiveBoard,
      gameStatus: newGameStatus,
      wholeGameWinner: newWholeGameWinner,
      score: newScore as [number, number],
      winner: winner,
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

  // Rematch functionality
  const requestRematch = async () => {
    try {
      const room = await getRoom(roomId);
      if (!room?.host_id || !room?.guest_id) {
        console.error("Cannot request rematch: missing players");
        return;
      }
      // Reset the game state for a new game
      await updateDB({
        bigBoard: EMPTY_BOARD,
        winnerBoard: EMPTY_WINNER_BOARD,
        turn: room.host_id, // Host starts the rematch
        gameStatus: GameStatus.PLAYING,
        winner: "",
        score: [0, 0], // Reset scores for rematch
        activeBoard: -1,
        wholeGameWinner: null,
      });

      // Play notification sound
      sound.playNotification();

      // Show rematch notification
      notifications.showGameNotification(
        "info",
        "🔄 Rematch Started",
        "A new game has begun! Good luck!",
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Rematch error:", error);
      sound.playError();
      notifications.showGameNotification(
        "error",
        "❌ Rematch Failed",
        "Could not start rematch. Please try again.",
        { duration: 5000 }
      );
    }
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

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .single();
        if (error) throw error;
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };
    fetchRoom();
  }, [roomId]);

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
  }, [supabaseGameId, gameStatus, roomId, checkAndStartGame]);

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
    requestRematch,
    handleLeave,
  };
}
