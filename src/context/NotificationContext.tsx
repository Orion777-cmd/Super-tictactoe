import React, { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "../hooks/useNotifications";

// Use the actual return type from useNotifications
type NotificationHook = ReturnType<typeof useNotifications>;

const NotificationContext = createContext<NotificationHook | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationHook => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};
