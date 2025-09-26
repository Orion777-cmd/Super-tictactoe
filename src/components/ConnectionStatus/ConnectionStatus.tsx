import React from "react";
import { useConnectionStatus } from "../../hooks/useConnectionStatus";
import "./ConnectionStatus.styles.css";

const ConnectionStatus: React.FC = () => {
  const {
    isOnline,
    shouldShowWarning,
    canReconnect,
    reconnectAttempts,
    maxReconnectAttempts,
    reconnect,
  } = useConnectionStatus();

  if (!shouldShowWarning) {
    return null;
  }

  const handleReconnect = async () => {
    await reconnect();
  };

  return (
    <div className="connection-status">
      <div className="connection-warning">
        <div className="connection-icon">{isOnline ? "⚠️" : "📡"}</div>

        <div className="connection-content">
          <div className="connection-title">
            {isOnline ? "Connection Issues" : "You're Offline"}
          </div>

          <div className="connection-message">
            {isOnline
              ? "Having trouble connecting to the server. Some features may not work properly."
              : "You're currently offline. Please check your internet connection."}
          </div>

          {isOnline && (
            <div className="connection-attempts">
              Reconnect attempts: {reconnectAttempts} / {maxReconnectAttempts}
            </div>
          )}
        </div>

        {isOnline && canReconnect && (
          <button
            className="connection-reconnect-btn"
            onClick={handleReconnect}
            disabled={!canReconnect}
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
