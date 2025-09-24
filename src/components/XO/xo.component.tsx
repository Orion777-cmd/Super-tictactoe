import Cell from "../cell/cell.component";
import "./xo.styles.css";
import { GridState } from "../../types/gridStateType";
import { GameStatus } from "../../types/gameStatusType";

interface XOProps {
  board: (GridState | null)[];
  winner: GridState | "draw" | null;
  boardIndex: number;
  turn: string; // User ID
  gameStatus: GameStatus;
  activeBoard: number;
  currentPlayerTurn: string; // User ID
  handleCellClick: (boardIdx: number, cellIdx: number) => void;
}

const XO: React.FC<XOProps> = ({
  board,
  winner,
  boardIndex,
  turn,
  gameStatus,
  activeBoard,
  currentPlayerTurn,
  handleCellClick,
}) => {
  const handleCellClickWrapper = (cellIdx: number) => {
    handleCellClick(boardIndex, cellIdx);
  };

  // Determine if this board is playable
  // For Super Tic-Tac-Toe: board is playable if:
  // 1. Game is in playable state
  // 2. This board is the active board (or any board if activeBoard is -1)
  // 3. This board hasn't been won yet
  // 4. It's the current player's turn (currentPlayerTurn matches the game turn)
  const isBoardPlayable =
    (gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.WAITING) &&
    (activeBoard === -1 || activeBoard === boardIndex) &&
    winner === null &&
    currentPlayerTurn === turn;

  // Note: Individual winning line animation removed - only main board shows winning lines

  console.log("[DEBUG] XO Board Playability:", {
    boardIndex,
    gameStatus,
    activeBoard,
    winner,
    currentPlayerTurn,
    turn,
    isBoardPlayable,
  });

  return (
    <div
      className={`grid-container ${
        winner === null
          ? isBoardPlayable
            ? "board-active"
            : "board-inactive"
          : "board-disable"
      }`}
    >
      {winner != null ? (
        <div className={`winner-${winner}`}></div>
      ) : (
        board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => handleCellClickWrapper(index)}
            disabled={!!cell || !isBoardPlayable}
          />
        ))
      )}
    </div>
  );
};

export default XO;
