import { useState, useCallback } from "react";
import { useSound } from "./useSound";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary";
}

interface NotificationHook {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showGameNotification: (
    type: Notification["type"],
    title: string,
    message: string,
    options?: {
      duration?: number;
      persistent?: boolean;
      actions?: NotificationAction[];
    }
  ) => void;
}

export const useNotifications = (): NotificationHook => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const sound = useSound();

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        id,
        duration: 5000,
        persistent: false,
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Play sound based on notification type
      switch (notification.type) {
        case "success":
          sound.playNotification();
          break;
        case "error":
          sound.playError();
          break;
        case "warning":
          sound.playNotification();
          break;
        case "info":
          sound.playNotification();
          break;
      }

      // Auto-remove notification after duration (unless persistent)
      if (!newNotification.persistent && newNotification.duration) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [sound]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const showGameNotification = useCallback(
    (
      type: Notification["type"],
      title: string,
      message: string,
      options: {
        duration?: number;
        persistent?: boolean;
        actions?: NotificationAction[];
      } = {}
    ) => {
      addNotification({
        type,
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showGameNotification,
  };
};
