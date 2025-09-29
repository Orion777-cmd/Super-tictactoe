// import { GameStatus } from "../types/gameStatusType";

// Utility function to check if a board is playable
export const isBoardPlayable = (
  gameStatus: string,
  activeBoard: number,
  boardIndex: number,
  winner: string | null,
  currentPlayerTurn: string,
  turn: string
): boolean => {
  return (
    (gameStatus === "playing" || gameStatus === "waiting") &&
    (activeBoard === -1 || activeBoard === boardIndex) &&
    winner === null &&
    currentPlayerTurn === turn
  );
};
