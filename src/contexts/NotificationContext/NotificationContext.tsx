'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PushNotification from '../../components/PushNotification/PushNotification';
import styles from './Notification.module.css';

interface Notification {
  id: number;
  message: string;
  duration: number;
}

interface NotificationContextType {
  showNotification: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  if (typeof window !== 'undefined' && !container) {
    const portalContainer = document.createElement('div');
    portalContainer.id = 'notification-portal';
    document.body.appendChild(portalContainer);
    setContainer(portalContainer);
  }

  const showNotification = useCallback((message: string, duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, duration }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {container &&
        createPortal(
          <div className={styles.notificationPortalWrapper}>
            {notifications.map((notification) => (
              <PushNotification
                key={notification.id}
                message={notification.message}
                duration={notification.duration}
                onClose={() => removeNotification(notification.id)}
              />
            ))}
          </div>,
          container,
        )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
