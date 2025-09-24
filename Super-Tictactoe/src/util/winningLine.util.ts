import { GridState } from "../types/gridStateType";

export interface WinningLine {
  type: "row" | "column" | "diagonal";
  index: number;
  cells: number[];
}

// Check for winning lines in a 3x3 board
export const getWinningLine = (
  board: (GridState | null)[]
): WinningLine | null => {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      const type = i < 3 ? "row" : i < 6 ? "column" : "diagonal";
      const index = i < 3 ? i : i < 6 ? i - 3 : i - 6;
      return {
        type,
        index,
        cells: [a, b, c],
      };
    }
  }

  return null;
};

// Get winning line for the main 3x3 board (winnerBoard)
export const getMainWinningLine = (
  winnerBoard: (GridState | "draw")[]
): WinningLine | null => {
  return getWinningLine(winnerBoard as (GridState | null)[]);
};
