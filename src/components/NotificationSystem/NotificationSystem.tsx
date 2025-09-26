import React from "react";
import { useNotifications, Notification } from "../../hooks/useNotifications";
import "./NotificationSystem.styles.css";

interface NotificationSystemProps {
  className?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  className = "",
}) => {
  const { notifications, removeNotification } = useNotifications();

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
  };

  return (
    <div className={`notification-system ${className}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() =>
            !notification.persistent && removeNotification(notification.id)
          }
        >
          <div className="notification-content">
            <div className="notification-header">
              <span className="notification-icon">
                {getNotificationIcon(notification.type)}
              </span>
              <h4 className="notification-title">{notification.title}</h4>
              {!notification.persistent && (
                <button
                  className="notification-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  aria-label="Close notification"
                >
                  ×
                </button>
              )}
            </div>
            <p className="notification-message">{notification.message}</p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="notification-actions">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`notification-action notification-action-${
                      action.variant || "secondary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(action.action);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {!notification.persistent && notification.duration && (
            <div className="notification-progress">
              <div
                className="notification-progress-bar"
                style={{
                  animationDuration: `${notification.duration}ms`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
