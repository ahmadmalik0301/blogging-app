import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import webSocketService from '../../services/websocket';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'userSignup' | 'newPost' | 'postUpdated' | 'postDeleted';
  message: string;
  timestamp: Date;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Connect WebSocket if authenticated
    webSocketService.connect();

    // Listen for user signup notifications (admin only)
    if (user.role === 'ADMIN') {
      const handleUserSignup = (data: any) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'userSignup',
          message: `New user signed up: ${data.firstName} ${data.lastName || ''} (${data.email})`,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [notification, ...prev]);
      };

      webSocketService.onUserSignup(handleUserSignup);

      return () => {
        webSocketService.offUserSignup(handleUserSignup);
      };
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Disconnect WebSocket when user logs out
    return () => {
      if (!isAuthenticated) {
        webSocketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null; // Only show notifications for admin
  }

  return (
    <div className="notifications-container">
      <button
        className={`notifications-toggle ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        🔔
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={clearAll} className="clear-all-btn">
                Clear All
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-time">
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;