import { useState, useEffect, useCallback } from "react";
import { useNotificationContext } from "../context/NotificationContext";

interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastConnected: Date | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export const useConnectionStatus = () => {
  const notifications = useNotificationContext();
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isConnected: true,
    lastConnected: new Date(),
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
  });

  const [reconnectTimeout, setReconnectTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        reconnectAttempts: 0,
      }));

      notifications.showGameNotification(
        "success",
        "Connection Restored",
        "You're back online!",
        { duration: 3000 }
      );
    };

    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        isConnected: false,
      }));

      notifications.showGameNotification(
        "warning",
        "Connection Lost",
        "You're offline. Some features may not work.",
        { duration: 5000 }
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [notifications]);

  // Attempt to reconnect
  const attemptReconnect = useCallback(async () => {
    if (
      !status.isOnline ||
      status.reconnectAttempts >= status.maxReconnectAttempts
    ) {
      return false;
    }

    try {
      // Test connection with a simple fetch
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        setStatus((prev) => ({
          ...prev,
          isConnected: true,
          lastConnected: new Date(),
          reconnectAttempts: 0,
        }));

        notifications.showGameNotification(
          "success",
          "Reconnected",
          "Connection restored successfully!",
          { duration: 3000 }
        );

        return true;
      }
    } catch (error) {
      console.error("Reconnection attempt failed:", error);
    }

    // Increment reconnect attempts
    setStatus((prev) => ({
      ...prev,
      reconnectAttempts: prev.reconnectAttempts + 1,
    }));

    return false;
  }, [
    status.isOnline,
    status.reconnectAttempts,
    status.maxReconnectAttempts,
    notifications,
  ]);

  // Auto-reconnect with exponential backoff
  useEffect(() => {
    if (!status.isOnline || status.isConnected) {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        setReconnectTimeout(null);
      }
      return;
    }

    if (status.reconnectAttempts >= status.maxReconnectAttempts) {
      notifications.showGameNotification(
        "error",
        "Connection Failed",
        "Unable to reconnect. Please check your internet connection.",
        { duration: 8000 }
      );
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = Math.min(1000 * Math.pow(2, status.reconnectAttempts), 30000);

    const timeout = setTimeout(() => {
      attemptReconnect();
    }, delay);

    setReconnectTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    status.isOnline,
    status.isConnected,
    status.reconnectAttempts,
    status.maxReconnectAttempts,
    attemptReconnect,
    notifications,
  ]);

  // Manual reconnect
  const reconnect = useCallback(async () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      setReconnectTimeout(null);
    }

    setStatus((prev) => ({
      ...prev,
      reconnectAttempts: 0,
    }));

    return await attemptReconnect();
  }, [attemptReconnect, reconnectTimeout]);

  // Reset connection status
  const resetConnection = useCallback(() => {
    setStatus({
      isOnline: navigator.onLine,
      isConnected: true,
      lastConnected: new Date(),
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
    });
  }, []);

  // Check if we should show connection warnings
  const shouldShowWarning = status.isOnline && !status.isConnected;
  const canReconnect =
    status.isOnline && status.reconnectAttempts < status.maxReconnectAttempts;

  return {
    ...status,
    shouldShowWarning,
    canReconnect,
    reconnect,
    resetConnection,
  };
};
