import React from "react";
import "./GameBoardSkeleton.styles.css";

const GameBoardSkeleton: React.FC = () => {
  return (
    <div className="game-board-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-player-info">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
          </div>
        </div>

        <div className="skeleton-game-status">
          <div className="skeleton-line long"></div>
        </div>

        <div className="skeleton-player-info">
          <div className="skeleton-text">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
          </div>
          <div className="skeleton-avatar"></div>
        </div>
      </div>

      <div className="skeleton-board">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="skeleton-small-board">
            {Array.from({ length: 9 }).map((_, cellIndex) => (
              <div key={cellIndex} className="skeleton-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoardSkeleton;
