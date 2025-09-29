type GridState = "X" | "O" | "draw" | null;

// Helper function to check if a player can still win a specific line
const canPlayerWinLine = (
  line: (GridState | "draw" | null)[],
  player: "X" | "O"
): boolean => {
  // Count how many positions the player already has in this line
  const playerCount = line.filter((pos) => pos === player).length;
  const opponentCount = line.filter(
    (pos) => pos === (player === "X" ? "O" : "X")
  ).length;
  const emptyCount = line.filter((pos) => pos === null).length;

  // If opponent already has a position in this line, player cannot win
  if (opponentCount > 0) {
    return false;
  }

  // If player has 2 positions and there's 1 empty, they can win
  if (playerCount === 2 && emptyCount === 1) {
    return true;
  }

  // If player has 1 position and there are 2 empty, they can still win
  if (playerCount === 1 && emptyCount === 2) {
    return true;
  }

  // If all positions are empty, player can still win
  if (playerCount === 0 && emptyCount === 3) {
    return true;
  }

  // If player has 3 positions, they already won (shouldn't happen in this context)
  if (playerCount === 3) {
    return true;
  }

  return false;
};

// Optimized function to detect if a draw is inevitable without waiting for all cells
export const isDrawInevitable = (squares: (GridState | "draw")[]): boolean => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check if either player can still win any line
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const line = [squares[a], squares[b], squares[c]];

    // Check if this line can still be won by X
    const canXWin = canPlayerWinLine(line, "X");
    if (canXWin) {
      return false; // X can still win this line, so game is not a draw
    }

    // Check if this line can still be won by O
    const canOWin = canPlayerWinLine(line, "O");
    if (canOWin) {
      return false; // O can still win this line, so game is not a draw
    }
  }

  // If we get here, neither player can win any line
  return true;
};

export const calculateWinner = (squares: (GridState | "draw")[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // Check if it's a draw (either all filled OR no one can win)
  if (squares.every((square) => square !== null)) {
    return "draw";
  }

  // Check if draw is inevitable even with empty squares
  if (isDrawInevitable(squares)) {
    return "draw";
  }

  return null;
};

// Debug version of isDrawInevitable for testing
export const isDrawInevitableDebug = (
  squares: (GridState | "draw")[]
): boolean => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  console.log("Checking draw for board:", squares);

  // Check if either player can still win any line
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const line = [squares[a], squares[b], squares[c]];

    // Check if this line can still be won by X
    const canXWin = canPlayerWinLine(line, "X");
    if (canXWin) {
      console.log(`Line ${i} can be won by X:`, line);
      return false; // X can still win this line, so game is not a draw
    }

    // Check if this line can still be won by O
    const canOWin = canPlayerWinLine(line, "O");
    if (canOWin) {
      console.log(`Line ${i} can be won by O:`, line);
      return false; // O can still win this line, so game is not a draw
    }
  }

  console.log("No player can win any line - draw is inevitable");
  return true;
};
