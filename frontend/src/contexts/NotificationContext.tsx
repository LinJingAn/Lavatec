import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => string;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(7);
    const notification: Notification = {
      id,
      type,
      message,
      duration
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  const success = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
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
