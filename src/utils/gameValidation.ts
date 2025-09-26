import { GameState } from "../types/gameState.type";
import { GameStatus } from "../types/gameStatusType";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface MoveValidation {
  isValid: boolean;
  reason?: string;
  timestamp: number;
  playerId: string;
  boardIndex: number;
  cellIndex: number;
}

// Rate limiting for moves
const moveHistory = new Map<string, MoveValidation[]>();
const MAX_MOVES_PER_MINUTE = 10;
const MIN_MOVE_INTERVAL = 1000; // 1 second between moves

export const validateGameState = (gameState: GameState): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate bigBoard structure
  if (!gameState.bigBoard || !Array.isArray(gameState.bigBoard)) {
    errors.push("Invalid bigBoard structure");
    return { isValid: false, errors, warnings };
  }

  if (gameState.bigBoard.length !== 9) {
    errors.push("BigBoard must have exactly 9 boards");
  }

  // Validate each small board
  gameState.bigBoard.forEach((board, boardIndex) => {
    if (!Array.isArray(board) || board.length !== 9) {
      errors.push(`Board ${boardIndex} must have exactly 9 cells`);
      return;
    }

    // Check for invalid cell values
    board.forEach((cell, cellIndex) => {
      if (cell !== null && cell !== "X" && cell !== "O") {
        errors.push(
          `Invalid cell value at board ${boardIndex}, cell ${cellIndex}: ${cell}`
        );
      }
    });
  });

  // Validate winnerBoard
  if (!gameState.winnerBoard || !Array.isArray(gameState.winnerBoard)) {
    errors.push("Invalid winnerBoard structure");
  } else if (gameState.winnerBoard.length !== 9) {
    errors.push("WinnerBoard must have exactly 9 entries");
  } else {
    gameState.winnerBoard.forEach((winner, index) => {
      if (
        winner !== null &&
        winner !== "X" &&
        winner !== "O" &&
        winner !== "draw"
      ) {
        errors.push(`Invalid winner value at board ${index}: ${winner}`);
      }
    });
  }

  // Validate game status
  if (!Object.values(GameStatus).includes(gameState.gameStatus as GameStatus)) {
    errors.push(`Invalid game status: ${gameState.gameStatus}`);
  }

  // Validate turn
  if (typeof gameState.turn !== "string" || gameState.turn.length === 0) {
    errors.push("Invalid turn value");
  }

  // Validate activeBoard
  if (
    typeof gameState.activeBoard !== "number" ||
    gameState.activeBoard < -1 ||
    gameState.activeBoard > 8
  ) {
    errors.push(`Invalid activeBoard value: ${gameState.activeBoard}`);
  }

  // Validate score
  if (!Array.isArray(gameState.score) || gameState.score.length !== 2) {
    errors.push("Score must be an array of 2 numbers");
  } else {
    gameState.score.forEach((score, index) => {
      if (typeof score !== "number" || score < 0 || !Number.isInteger(score)) {
        errors.push(`Invalid score at index ${index}: ${score}`);
      }
    });
  }

  // Validate wholeGameWinner
  if (
    gameState.wholeGameWinner !== null &&
    gameState.wholeGameWinner !== "X" &&
    gameState.wholeGameWinner !== "O" &&
    gameState.wholeGameWinner !== "draw"
  ) {
    errors.push(`Invalid wholeGameWinner: ${gameState.wholeGameWinner}`);
  }

  // Check for impossible game states
  if (gameState.gameStatus === GameStatus.WIN && !gameState.wholeGameWinner) {
    warnings.push("Game marked as won but no winner specified");
  }

  if (
    gameState.gameStatus === GameStatus.TIE &&
    gameState.wholeGameWinner !== "draw"
  ) {
    warnings.push("Game marked as tie but wholeGameWinner is not 'draw'");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateMove = (
  gameState: GameState,
  playerId: string,
  boardIndex: number,
  cellIndex: number
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic move validation
  if (boardIndex < 0 || boardIndex > 8) {
    errors.push("Invalid board index");
    return { isValid: false, errors, warnings };
  }

  if (cellIndex < 0 || cellIndex > 8) {
    errors.push("Invalid cell index");
    return { isValid: false, errors, warnings };
  }

  // Check if it's the player's turn
  if (gameState.turn !== playerId) {
    errors.push("Not your turn");
    return { isValid: false, errors, warnings };
  }

  // Check if game is in playing state
  if (gameState.gameStatus !== GameStatus.PLAYING) {
    errors.push("Game is not in playing state");
    return { isValid: false, errors, warnings };
  }

  // Check if the cell is already occupied
  if (gameState.bigBoard[boardIndex][cellIndex] !== null) {
    errors.push("Cell is already occupied");
    return { isValid: false, errors, warnings };
  }

  // Check active board rule
  if (gameState.activeBoard !== -1 && gameState.activeBoard !== boardIndex) {
    // Check if the target board is already won
    if (gameState.winnerBoard[gameState.activeBoard] === null) {
      errors.push("Must play in the active board");
      return { isValid: false, errors, warnings };
    }
  }

  // Check if the target board is already won
  if (gameState.winnerBoard[boardIndex] !== null) {
    errors.push("Cannot play in a won board");
    return { isValid: false, errors, warnings };
  }

  // Rate limiting check
  const now = Date.now();
  const playerMoves = moveHistory.get(playerId) || [];
  const recentMoves = playerMoves.filter(
    (move) => now - move.timestamp < 60000
  ); // Last minute

  if (recentMoves.length >= MAX_MOVES_PER_MINUTE) {
    errors.push("Too many moves in the last minute");
    return { isValid: false, errors, warnings };
  }

  // Check minimum move interval
  const lastMove = playerMoves[playerMoves.length - 1];
  if (lastMove && now - lastMove.timestamp < MIN_MOVE_INTERVAL) {
    errors.push("Move too soon after previous move");
    return { isValid: false, errors, warnings };
  }

  // Record the move for rate limiting
  const move: MoveValidation = {
    isValid: true,
    timestamp: now,
    playerId,
    boardIndex,
    cellIndex,
  };
  moveHistory.set(playerId, [...recentMoves, move]);

  return {
    isValid: true,
    errors,
    warnings,
  };
};

export const detectSuspiciousActivity = (
  gameState: GameState,
  playerId: string
): string[] => {
  const suspicious: string[] = [];

  // Check for impossible win patterns
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  // Check each small board for suspicious patterns
  gameState.bigBoard.forEach((board, boardIndex) => {
    const boardWinner = gameState.winnerBoard[boardIndex];
    if (boardWinner) return; // Board already won

    // Count player moves in this board
    const playerMoves = board.filter(
      (cell) => cell === (playerId === "X" ? "X" : "O")
    ).length;
    const opponentMoves = board.filter(
      (cell) => cell === (playerId === "X" ? "O" : "X")
    ).length;

    // Check for impossible move counts
    if (playerMoves > 5 || opponentMoves > 5) {
      suspicious.push(`Suspicious move count in board ${boardIndex}`);
    }

    // Check for impossible win patterns
    winPatterns.forEach((pattern) => {
      const patternCells = pattern.map((index) => board[index]);
      const playerCount = patternCells.filter(
        (cell) => cell === (playerId === "X" ? "X" : "O")
      ).length;
      const opponentCount = patternCells.filter(
        (cell) => cell === (playerId === "X" ? "O" : "X")
      ).length;
      const emptyCount = patternCells.filter((cell) => cell === null).length;

      // If player has 3 in a row but board isn't won, that's suspicious
      if (playerCount === 3 && boardWinner !== (playerId === "X" ? "X" : "O")) {
        suspicious.push(
          `Player has 3 in a row in board ${boardIndex} but board not won`
        );
      }

      // If opponent has 3 in a row but board isn't won, that's suspicious
      if (
        opponentCount === 3 &&
        boardWinner !== (playerId === "X" ? "O" : "X")
      ) {
        suspicious.push(
          `Opponent has 3 in a row in board ${boardIndex} but board not won`
        );
      }
    });
  });

  // Check for impossible game progression
  const totalMoves = gameState.bigBoard
    .flat()
    .filter((cell) => cell !== null).length;
  const expectedMoves =
    gameState.turn === playerId ? totalMoves : totalMoves - 1;

  if (totalMoves % 2 !== (playerId === "X" ? 0 : 1)) {
    suspicious.push("Inconsistent move count for player");
  }

  return suspicious;
};

export const sanitizeGameState = (gameState: GameState): GameState => {
  // Create a deep copy and sanitize
  const sanitized = JSON.parse(JSON.stringify(gameState));

  // Ensure all arrays have correct lengths
  if (!sanitized.bigBoard || sanitized.bigBoard.length !== 9) {
    sanitized.bigBoard = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
  }

  if (!sanitized.winnerBoard || sanitized.winnerBoard.length !== 9) {
    sanitized.winnerBoard = Array(9).fill(null);
  }

  if (!sanitized.score || sanitized.score.length !== 2) {
    sanitized.score = [0, 0];
  }

  // Sanitize cell values
  sanitized.bigBoard.forEach((board: any[], boardIndex: number) => {
    if (!Array.isArray(board) || board.length !== 9) {
      sanitized.bigBoard[boardIndex] = Array(9).fill(null);
    } else {
      board.forEach((cell, cellIndex) => {
        if (cell !== null && cell !== "X" && cell !== "O") {
          sanitized.bigBoard[boardIndex][cellIndex] = null;
        }
      });
    }
  });

  // Sanitize winner board
  sanitized.winnerBoard.forEach((winner: any, index: number) => {
    if (
      winner !== null &&
      winner !== "X" &&
      winner !== "O" &&
      winner !== "draw"
    ) {
      sanitized.winnerBoard[index] = null;
    }
  });

  // Sanitize other fields
  if (typeof sanitized.turn !== "string") {
    sanitized.turn = "";
  }

  if (
    typeof sanitized.activeBoard !== "number" ||
    sanitized.activeBoard < -1 ||
    sanitized.activeBoard > 8
  ) {
    sanitized.activeBoard = -1;
  }

  if (!Object.values(GameStatus).includes(sanitized.gameStatus)) {
    sanitized.gameStatus = GameStatus.WAITING;
  }

  if (
    sanitized.wholeGameWinner !== null &&
    sanitized.wholeGameWinner !== "X" &&
    sanitized.wholeGameWinner !== "O" &&
    sanitized.wholeGameWinner !== "draw"
  ) {
    sanitized.wholeGameWinner = null;
  }

  return sanitized;
};

export const clearMoveHistory = (playerId: string) => {
  moveHistory.delete(playerId);
};

export const clearAllMoveHistory = () => {
  moveHistory.clear();
};
