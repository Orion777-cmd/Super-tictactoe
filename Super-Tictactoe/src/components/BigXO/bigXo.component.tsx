import "./bigXo.styles.css";
import XO from "../XO/xo.component";
import { GridState } from "../../types/gridStateType";
import { GameStatus } from "../../types/gameStatusType";
import { getMainWinningLine } from "../../util/winningLine.util";

interface BigXOProps {
  bigBoard: GridState[][];
  winnerBoard: (GridState | "draw")[];
  turn: string; // User ID
  gameStatus: GameStatus;
  activeBoard: number;
  currentPlayerTurn: string; // User ID
  handleCellClick: (boardIdx: number, cellIdx: number) => void;
  wholeGameWinner?: GridState | "draw" | null;
}

const BigXO: React.FC<BigXOProps> = ({
  bigBoard,
  winnerBoard,
  turn,
  gameStatus,
  activeBoard,
  currentPlayerTurn,
  handleCellClick,
  wholeGameWinner,
}) => {
  // Safety check for bigBoard
  if (!bigBoard || !Array.isArray(bigBoard) || bigBoard.length === 0) {
    return <div>Loading game...</div>;
  }

  // Get winning line for the main 3x3 board when game is won
  const mainWinningLine = wholeGameWinner
    ? getMainWinningLine(winnerBoard)
    : null;

  // Render winning line based on the winning pattern
  const renderWinningLine = () => {
    if (!mainWinningLine) return null;

    const { type, index } = mainWinningLine;

    // Create SVG line that connects the winning boards
    return (
      <svg
        className="winning-line-svg"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="winningGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#ff6b6b" />
            <stop offset="40%" stopColor="#ff4757" />
            <stop offset="50%" stopColor="#ff3742" />
            <stop offset="60%" stopColor="#ff4757" />
            <stop offset="80%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {type === "row" && (
          <line
            x1="50"
            y1={50 + index * 133.33}
            x2="350"
            y2={50 + index * 133.33}
            stroke="url(#winningGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="winning-line-path"
          />
        )}
        {type === "column" && (
          <line
            x1={50 + index * 133.33}
            y1="50"
            x2={50 + index * 133.33}
            y2="350"
            stroke="url(#winningGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="winning-line-path"
          />
        )}
        {type === "diagonal" && index === 0 && (
          <line
            x1="50"
            y1="50"
            x2="350"
            y2="350"
            stroke="url(#winningGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="winning-line-path"
          />
        )}
        {type === "diagonal" && index === 1 && (
          <line
            x1="350"
            y1="50"
            x2="50"
            y2="350"
            stroke="url(#winningGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="winning-line-path"
          />
        )}
      </svg>
    );
  };

  // Check if it's not the current player's turn
  const isDisabled =
    gameStatus === GameStatus.PLAYING && turn !== currentPlayerTurn;

  return (
    <div
      className={`ultimate-container ${mainWinningLine ? "has-winner" : ""} ${
        isDisabled ? "disabled" : ""
      }`}
    >
      {bigBoard.map((smallBoard, idx) => (
        <XO
          key={idx}
          board={smallBoard}
          winner={winnerBoard[idx]}
          boardIndex={idx}
          turn={turn}
          gameStatus={gameStatus}
          activeBoard={activeBoard}
          currentPlayerTurn={currentPlayerTurn}
          handleCellClick={handleCellClick}
        />
      ))}
      {renderWinningLine()}
    </div>
  );
};

export default BigXO;
