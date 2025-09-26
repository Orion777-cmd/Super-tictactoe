import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import GameBoardSkeleton from "../GameBoardSkeleton/GameBoardSkeleton";
import "./GameLoading.styles.css";

interface GameLoadingProps {
  message?: string;
  showSkeleton?: boolean;
}

const GameLoading: React.FC<GameLoadingProps> = ({
  message = "Loading game...",
  showSkeleton = true,
}) => {
  return (
    <div className="game-loading">
      {showSkeleton ? (
        <GameBoardSkeleton />
      ) : (
        <div className="game-loading-simple">
          <LoadingSpinner size="large" message={message} />
        </div>
      )}
    </div>
  );
};

export default GameLoading;
